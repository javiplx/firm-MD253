#!/bin/sh
echo "Content-type: text/html"
echo ""
echo "<HTML><HEAD><TITLE>Sample CGI Output</TITLE></HEAD><BODY>"

. /usr/libexec/modules/modules.conf
func=`echo ${QUERY_STRING} | cut '-d&' -f1`
firmware=`echo ${QUERY_STRING} | cut '-d&' -f2`
VERSION=/etc/sysconfig/config/version
targetpath=${firmware%/*}
tempFolder=$targetpath"/.tempByMapower"

versionset(){
for i in $1; do
 eval x=\\$i
 export $x
done
}

case ${func} in
 Reboot)
  /bin/ls >/dev/null 2>&1
  /bin/reboot
  ;;
 Reset_2_Def)
  /bin/rm -f /etc/sysconfig/config/finish
  SHARE_PATH=/home
  FOLDER=`/bin/find "${SHARE_PATH}" -maxdepth 1 -type d|/bin/tr " " "^"`
  for i in ${FOLDER}; do
   i=`echo ${i}|/bin/tr "^" " "`
   [ "${i}" == "${SHARE_PATH}" ] && continue
   [ "${i}" == "/home/.lpd" ] && continue
   /bin/rm -rf ${i}/.ftpaccess
  done
  ;;
 CheckNEW)
  cd /tmp
   /bin/rm -f /tmp/version.xml
  /bin/wget http://portal.sitecom.com/MD-253/v1001/upgrade/version.xml > /tmp/.msg 2>&1
  [ $? -eq 0 ] && {
   VerNum=`/bin/awk -F\" /version/'{print $2}' /tmp/version.xml|/bin/sed 's/\ //g'`

   new=`echo "$VerNum"|/bin/awk -F. '{print "new_a="$1,"new_b="$2,"new_c="$3}'`
   old=`/bin/awk -F_ '{print $2}' ${VERSION}|/bin/sed 's/v//'|/bin/sed 's/[a-z]$//'|\
      /bin/awk -F. '{print "old_a="$1,"old_b="$2,"old_c="$3}'`

   versionset "$new"
   versionset "$old"

   for x in a b c; do
    eval new_num=\$new_$x
    eval old_num=\$old_$x
    [ $new_num -gt $old_num ] && {
     echo "${VerNum}"
     /bin/cp -af /tmp/version.xml /var/www
     break
     }
   done
   /bin/rm -f /tmp/.msg
   } || {
   echo "NoConnect"
   /bin/cat /tmp/.msg|/bin/grep "wget:"|/bin/sed 's/wget:\ //'
   /bin/rm -f /tmp/.msg
   }
  ;;
 DownloadFirmware)
  DELAY_TIME=1
  TimeOut=120
  num=0
  person=0

  cd /tmp
  /bin/rm -f /tmp/*.bin
  /bin/wget ${firmware} > /tmp/.msg 2>&1 &

  # detect timeout
  while true; do
   val=`/bin/cat /tmp/.msg|/bin/grep -v 'Connecting'|/bin/tr '\cM' '\n'|/bin/awk '{print $2}'`
   for i in $val; do
    value_2=$i
   done

   [ "${value_2}" == "100%" ] && {
    [ $person -ge 3 ] && break || {
     person=`expr $person + 1`
     }
    }

   [ "${value_1}" == "${value_2}" ] && {
    [ $num -ge $TimeOut ] && break || {
     /bin/sleep $DELAY_TIME
     num=`expr $num + 1`
     continue
     }
    } || {
    /bin/sleep $DELAY_TIME
    value_1="${value_2}"
    continue
    }
  done

  /bin/cat /tmp/.msg|/bin/grep "100%"|/bin/grep "00:00:00" >/dev/null 2>&1
  [ $? -eq 0 ] && echo "OK" || {
   /bin/killall wget
   echo "NOT"
   }

  /bin/rm -f /tmp/.msg
  ;;
 Decompression)
  # create temp folder
  /bin/rm -rf ${tempFolder}
  /bin/mkdir ${tempFolder}

  # decompression
  cd ${tempFolder}
  /bin/tar xvf $firmware
  ;;
 "Kernel_upgrade")
  # upgrade kernel
  cd $tempFolder
  if [ -f uImage.bin ]; then
   new=`md5sum uImage.bin | awk '{print $1}'`
   old=`cat uImage.md5sum | awk '{print $1}'`
   if [ "$new" == "$old" ]; then
    /bin/flashcp uImage.bin /dev/mtd1
    echo "-finish-"
   else
    echo "error"
   fi
  else
   echo "no"
  fi
  ;;
 "Bootfs_upgrade")
  # upgrade Bootfs
  cd $tempFolder
  if [ -f bootfs.bin ]; then
   new=`md5sum bootfs.bin | awk '{print $1}'`
   old=`cat bootfs.bin.md5sum | awk '{print $1}'`
   if [ "$new" == "$old" ]; then
    /bin/flashcp bootfs.bin /dev/mtd2
    echo "-finish-"
   else
    echo "error"
   fi
  else
   echo "no"
  fi
  ;;
 "FileSystem_upgrade")
  # upgrade FileSystem
  cd $tempFolder
  if [ -f filesystem.bin ]; then
   new=`md5sum filesystem.bin | awk '{print $1}'`
   old=`cat filesystem.bin.md5sum | awk '{print $1}'`
   if [ "$new" == "$old" ]; then
    /bin/flashcp filesystem.bin /dev/mtd3
    echo "-finish-"
   else
    echo "error"
   fi
  else
   echo "no"
  fi
  cd ..
  /bin/rm -rf $tempFolder
  ;;
 *)
  echo "Hello Mapower ${QUERY_STRING} ${REQUEST_METHOD}"
  ;;
esac

echo "</BODY></HTML>"
