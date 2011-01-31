#!/bin/sh
echo "Content-type: text/html"
echo ""
echo "<HTML><HEAD><TITLE>Sample CGI Output</TITLE></HEAD><BODY>"

. /usr/libexec/modules/modules.conf
CONFIG_PATH=/etc/sysconfig/config

DAAP_CONF=${CONFIG_PATH}/daapd.conf
DNSR_CONF=${CONFIG_PATH}/responder.conf
SERVICE_CONF=${CONFIG_PATH}/service
CRONTABLE=${CONFIG_PATH}/root

FTP_CONF=${CONFIG_PATH}/proftpd/proftpd.conf
ANONYMOUS_CONF=${CONFIG_PATH}/proftpd/anonymous.conf
SHARE_PATH=/home

BTPD_CONF=${CONFIG_PATH}/btpd.conf
BTPD_BASE_DIR=/home/BitTorrent
BTPD_TORRENTS=${BTPD_BASE_DIR}/.btpd/torrents_list
ICONV=/usr/sbin/iconv

. $SERVICE_CONF

replaceFile=/var/www/cgi-bin/replaceFile
func=`echo ${QUERY_STRING} | cut '-d&' -f1`

case ${func} in
 iTuneStatus)
  DAAP_STATUS=`/bin/pidof daapd`
  [ -n "${DAAP_STATUS}" ] && echo "ON" || echo "OFF"
  ;;
 MusicFolder)
  path=`/bin/cat $DAAP_CONF|/usr/bin/grep "^mp3_dir"|/usr/bin/cut -c9-|\
        /usr/bin/sed 's/\/tmp//'|/usr/bin/sed 's/\/home//'`
  echo "$path"|grep "^/$" >/dev/null 2>&1
  [ $? -eq 0 ] && path="None Selected"
  echo "$path"
  entry_path=`echo $path|/usr/bin/sed 's/\/$//'`
  entry_path=${entry_path%/*}
  echo "$entry_path"
  ;;
 ChgiTuneStatus)
  status=`echo ${QUERY_STRING}|/usr/bin/cut '-d&' -f2`
  old_status=`/usr/bin/awk -F= /daapd/'{print $2}' $SERVICE_CONF|/usr/bin/sed 's/\ //g'`
  $replaceFile "$SERVICE_CONF" "daapd=${old_status}" "daapd=${status}"
  dlna_mDNSR_modify_conf

  case ${status} in
   Enable)
    [ -n "`/bin/pidof daapd`" ] || {
     /usr/bin/daapd -m -c ${DAAP_CONF} -d 9 -D scan -f > /tmp/data 2>&1 &
     }
    ;;
   Disable)
    #old_dir=`/bin/cat $DAAP_CONF|/usr/bin/grep "^mp3_dir"|/usr/bin/cut -c9-`
    #$replaceFile "${DAAP_CONF}" "mp3_dir $old_dir" "mp3_dir /tmp/" >/dev/null 2>&1
    /bin/killall daapd >/dev/null 2>&1
    PID=`/bin/pidof daapd`
    for pid in $PID; do
     /bin/kill -9 ${pid}
    done
    ;;
  esac
  ;;
 mp3_dir)
  path=`echo ${QUERY_STRING}|/usr/bin/cut '-d&' -f2`
  path=`echo ${path}|sed 's/\%20/\ /g'|sed 's/\%7B/\{/g'|sed 's/\%7D/\}/g'|sed 's/\%7E/\~/g'|\
        sed 's/\%60/\`/g'|sed 's/\%5B/\[/g'|sed 's/\%5D/\]/g'|sed 's/\%25/\%/g'|\
        sed 's/\%24/\$/g'|sed 's/\%21/\!/g'|sed 's/\%27/'\''/g'`

  old_path=`/bin/cat $DAAP_CONF|/usr/bin/grep "^mp3_dir"|/usr/bin/cut -c9-`
  old_status=`/usr/bin/awk -F= /daapd/'{print $2}' $SERVICE_CONF|/usr/bin/sed 's/\ //g'`
  [ "$path/" == "$old_path" ] && {
   $replaceFile "$DAAP_CONF" "mp3_dir $old_path" "mp3_dir /tmp/"
   $replaceFile "$SERVICE_CONF" "daapd=${old_status}" "daapd=Disable"

   /bin/killall daapd >/dev/null 2>&1
   PID=`/bin/pidof daapd`
   for pid in $PID; do
    /bin/kill -9 ${pid}
   done

   /bin/rm -rf /tmp/data
   dlna_mDNSR_modify_conf
   } || {
   $replaceFile "$DAAP_CONF" "mp3_dir $old_path" "mp3_dir $path/"
   $replaceFile "$SERVICE_CONF" "daapd=${old_status}" "daapd=Disable"

   /bin/killall daapd >/dev/null 2>&1
   PID=`/bin/pidof daapd`
   for pid in $PID; do
    /bin/kill -9 ${pid}
   done

   /bin/rm -rf /tmp/data
   $replaceFile "$SERVICE_CONF" "daapd=Disable" "daapd=Enable"
   dlna_mDNSR_modify_conf
   /usr/bin/daapd -m -c ${DAAP_CONF} -d 9 -D scan -f > /tmp/data 2>&1 &
   }
  ;;
 stop_scan)
  old_dir=`/bin/cat $DAAP_CONF|/usr/bin/grep "^mp3_dir"|/usr/bin/cut -c9-`
  old_status=`/usr/bin/awk -F= /daapd/'{print $2}' $SERVICE_CONF|/usr/bin/sed 's/\ //g'`
  $replaceFile "${DAAP_CONF}" "mp3_dir $old_dir" "mp3_dir /tmp/" >/dev/null 2>&1
  $replaceFile "${SERVICE_CONF}" "daapd=$old_status" "daapd=Disable"

  /bin/killall daapd >/dev/null 2>&1
  PID=`/bin/pidof daapd`
  for pid in $PID; do
   /bin/kill -9 ${pid}
  done

  /bin/rm -rf /tmp/data
  dlna_mDNSR_modify_conf
  ;;
 Detected_UnderScan_First)
  for i in 1 2; do
   SIZE=`/bin/ls /tmp/ -al|/usr/bin/awk /data/'{print $5}'`
   str="SIZE_$i=$SIZE"
   export $str
   sleep 2
  done
  [ "$SIZE_1" != "$SIZE_2" ] && echo "Scaning" || echo "Stop"
  ;;
 Detected_Value)
  /bin/ls /tmp/ -al|/usr/bin/awk /data/'{print $5}'
  ;;
 UsersData)
  UsersData=$(echo $(service_smb_modify_share_access))
  echo "${UsersData}"|/usr/bin/sed 's/\ //g'|/bin/sed 's/,$//'|/usr/bin/tr "," "^"
  ;;
 SecurityData)
  FOLDER=`/usr/bin/find "${SHARE_PATH}" -maxdepth 1 -type d|/usr/bin/tr " " "^"`
  for i in ${FOLDER}; do
   i=`echo ${i}|/usr/bin/tr "^" " "`
   [ "${i}" == "${SHARE_PATH}" ] && continue
   [ "${i}" == "/home/.lpd" ] && continue
   AllowUser=`/usr/bin/awk /AllowUser/'{print $2}' ${i}/.ftpaccess|/usr/bin/sed 's/\ //g'`
   DenyUser=`/usr/bin/awk /DenyUser/'{print $2}' ${i}/.ftpaccess|/usr/bin/sed 's/\ //g'`
   [ "$DenyUser" == "" ] && DenyUser=none
   name=${i##*/}
   echo "$name^$AllowUser#$DenyUser"
  done
  ;;
 USBData)
  SHARE_PATH_TREE=`/bin/df|/usr/bin/grep "/home/"|/usr/bin/awk '{print $1}'`
  for disk in $SHARE_PATH_TREE; do
   disk=${disk##*/}
   FOLDER=`/bin/df|/usr/bin/awk /${disk}/'{print $NF}'`
   FOLDER=${FOLDER##*/}
   str="${FOLDER}^"
  done
  echo "$str"
  ;;
 ftp_state)
  [ -n "`/bin/pidof proftpd`" ] && echo "ON" || echo "OFF"
  /usr/bin/awk /PassivePorts/'{print $2,$3}' ${FTP_CONF}|/usr/bin/sed 's/\ $//'|/usr/bin/tr " " "^"
  /usr/bin/awk /anonymous.conf/'{print $1}' ${FTP_CONF}|/usr/bin/grep "^#" >/dev/null 2>&1
  [ $? -eq 0 ] && echo "NO" || echo "YES"
  /bin/cat ${ANONYMOUS_CONF}|/usr/bin/grep "AllowAll" >/dev/null 2>&1
  [ $? -eq 0 ] && echo "YES" || echo "NO"
  /bin/df|/usr/bin/awk '{print $NF}'|/usr/bin/grep "^/home$" >/dev/null 2>&1
  [ $? -eq 0 ] && echo "ENABLE" || echo "DISABLE"
  ;;
 FolderList)
  FOLDER=`/usr/bin/find "${SHARE_PATH}" -maxdepth 1 -type d|/usr/bin/tr " " "^"`
  for folder in $FOLDER; do
   [ "${folder}" == "${SHARE_PATH}" ] && continue
   [ "${folder}" == "/home/.lpd" ] && continue
   folder=${folder##*/}
   folder=`echo ${folder}|/usr/bin/tr "^" " "`
   echo "$folder"
  done
  ;;
 modify_ftp_conf)
  service_ftp_modify_conf ${QUERY_STRING}
  ;;
 ModifyFTPFolderAction)
  service_user_modify_ftp_action ${QUERY_STRING}
  ;;
 FolderCreate)
  FolderName=`echo ${QUERY_STRING}|/usr/bin/cut '-d&' -f2`
  /bin/mkdir -p ${SHARE_PATH}/${FolderName}
  /bin/chmod 777 ${SHARE_PATH}/${FolderName}
  service_smb_modify_conf
  ;;
 FolderModify)
  OldFolderName=`echo ${QUERY_STRING}|/usr/bin/cut '-d&' -f2`
  FolderName=`echo ${QUERY_STRING}|/usr/bin/cut '-d&' -f3`
  /bin/mv ${SHARE_PATH}/${OldFolderName} ${SHARE_PATH}/${FolderName}
  /bin/chmod 777 ${SHARE_PATH}/${FolderName}
  service_smb_modify_conf
 ;;
 FolderDelete)
  FolderName=`echo ${QUERY_STRING}|/usr/bin/cut '-d&' -f2`
  /bin/rm -rf ${SHARE_PATH}/${FolderName}
  service_smb_modify_conf
  ;;
 UploadTorrent)
  service_btpd_torrent_manager ${QUERY_STRING} add
  ;;
 bt_state)
  [ -n "`/bin/pidof btpd`" ] && echo "ON" || echo "OFF"
  /usr/bin/awk -F= /port/'{print $2}' ${BTPD_CONF}|/usr/bin/sed 's/\ //g'
  /usr/bin/awk -F= /outgoing/'{print $2}' ${BTPD_CONF}|/usr/bin/sed 's/\ //g'
  /usr/bin/awk -F= /incoming/'{print $2}' ${BTPD_CONF}|/usr/bin/sed 's/\ //g'
  /usr/bin/awk -F= /maxpeers/'{print $2}' ${BTPD_CONF}|/usr/bin/sed 's/\ //g'
  ;;
 modify_torrent_conf)
  service_btpd_modify_conf ${QUERY_STRING}
  sleep 2
  ;;
 TorrentList)
  export BTPD_HOME=${BTPD_BASE_DIR}/.btpd

# Old detect rule
#  file=`/usr/bin/find "${BTPD_TORRENTS}/" -maxdepth 1 -type f|/usr/bin/tr " " "^"`
#  for i in ${file}; do
#   name=`echo "${i##*/}"|/usr/bin/sed 's/'.torrent'//g'|/usr/bin/tr "^" " "`
#   num=`/bin/cat ${BTPD_BASE_DIR}/.btpd/TorrentNumStatus|/usr/bin/grep "${name}.torrent$"|/usr/bin/awk '{print $1}'`
#   [ "$num" == "" ] && continue

# New detect rule
  Val=`/bin/cat ${BTPD_BASE_DIR}/.btpd/TorrentNumStatus|/usr/bin/awk '{print $1}'`
  for i in ${Val}; do
   name=`/bin/cat ${BTPD_BASE_DIR}/.btpd/TorrentNumStatus|/usr/bin/grep "^$i "|/usr/bin/sed 's/^'$i'\ //'|/bin/sed 's/\.torrent$//'`
   num=$i

   str=`/usr/bin/btcli list ${num}|/usr/bin/grep -v "NAME"|/usr/bin/cut -c43-`
   [ "$str" == "" ] && continue
   str=`echo "$str"|/usr/bin/awk 'BEGIN{OFS="^"}{print $2,$3,$4}'`
   echo "check^$num%$name^$str"
  done
  ;;
 TorrentStatus)
  export BTPD_HOME=${BTPD_BASE_DIR}/.btpd
  num=`echo ${QUERY_STRING}|/usr/bin/cut '-d&' -f2`
  FileName=`/bin/cat ${BTPD_BASE_DIR}/.btpd/TorrentNumStatus|/usr/bin/grep "^$num "|/usr/bin/sed 's/^'$num'\ //'`

  Source=`/usr/bin/btinfo ${BTPD_TORRENTS}/"$FileName"|/usr/bin/grep -v "^Tracker URLs:"|\
  /usr/bin/tr -s ' ' ' '|/usr/bin/tr '\n' '#'|/usr/bin/sed 's/'Files:#'/\n/'|/bin/sed 's/\#$//'`

  echo "${Source}"|${ICONV} -f CP936 -t UTF-8 >/dev/null 2>&1
  [ $? -eq 0 ] && Target=`echo "${Source}"|${ICONV} -f CP936 -t UTF-8` ||\
   Target=`echo "${Source}"|${ICONV} -f CP950 -t UTF-8`

  SourceNum=`echo "${Source}"|/usr/bin/wc -c`
  TargetNum=`echo "${Target}"|/usr/bin/wc -c`
  [ $SourceNum -gt $TargetNum ] && echo "${Source}" || echo "${Target}"

  status=`/usr/bin/btcli stat ${BTPD_TORRENTS}/"$FileName"|/usr/bin/grep -v "HAVE"|/usr/bin/awk 'BEGIN{OFS="^"}{print $1,$2,$3,$4,$5,$7,$8}'`
  echo "TorrentStatus=$status"
  ;;
 TorrentAction)
  action=`echo ${QUERY_STRING} | cut '-d&' -f2`
  service_btpd_torrent_manager ${QUERY_STRING} ${action}
  ;;
 DiskStatus)
  Status=`/bin/df|/usr/bin/grep "/home$"`
  [ "$Status" == "" ] && echo "NoDisk" || echo "Enable"
  ;;
 *)
  echo "Hello Mapower ${QUERY_STRING} ${REQUEST_METHOD}"
  ;;
esac

echo "</BODY></HTML>"
