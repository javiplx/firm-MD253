#!/bin/sh
echo -e "Content-type: text/html"\\r
echo -e ""\\r
echo -e "<HTML><HEAD><TITLE>Sample CGI Output</TITLE></HEAD><BODY>"\\r

. /usr/libexec/modules/modules.conf
PASSWD=/etc/passwd
CONF_PATH=/etc/sysconfig/config
SMB_SHARES_CONF=${CONF_PATH}/smb/shares.inc
SMB_HOST_CONF=${CONF_PATH}/smb/host.inc
IFCFG=${CONF_PATH}/ifcfg-eth0
IFCFG_DEFAULT=${CONF_PATH}/ifcfg-eth0.default
replaceFile=/bin/replaceFile

scsi_list=/etc/sysconfig/config/scsi.list

format_hdd=/var/www/cgi-bin/format.sh
SingleFormat=/var/www/cgi-bin/SingleFormat.sh
XFS_QUOTA=/usr/local/xfsprogs/xfs_quota
func=`echo ${QUERY_STRING} | cut '-d&' -f1`

case ${func} in
 "RAIDSTATUS")
  RAID_MODE=`/usr/bin/mdadm -D /dev/md1|\
  /bin/awk -F: /Level/'{print $2}'|/bin/sed 's/\ //g'`

  [ "$RAID_MODE" == "" ] && RAID_MODE=SingleDisk
  echo -e "$RAID_MODE"\\r
  ;;
 "Logical_Volumes")
  STATUS=`/usr/bin/mdadm -D /dev/md1`
  [ "${STATUS}" == "" ] || {
   MODE=`echo "${STATUS}"|/bin/awk -F: /Level/'{print $2}'|sed 's/\ //g'`
   [ "$MODE" == "linear" ] && MODE=JBOD ||\
    MODE=`echo $MODE| tr "[:lower:]" "[:upper:]"`
   SIZE=`/bin/df -h /dev/md1|/bin/grep "^/dev"|/bin/awk '{print $2,$4}'|/bin/tr " " "^"`
   echo "${STATUS}"|/bin/grep "rebuilding" >/dev/null 2>&1
   [ $? -eq 0 ] && {
    percent=`/bin/cat /proc/mdstat|/bin/awk /recovery/'{print $4}'|sed 's/\ //g'`
    str="recovery=${percent}"
    } || str="Ready"
   DATA="$MODE^$SIZE^$str"
   }
   echo -e "$DATA"\\r
  ;;
 "SingleDisk_Volumes")
  DiskNum=0
  for scsi in SCSI0 SCSI1; do
   MODEL=`/bin/awk -F: /${scsi}/'{print $2}' ${scsi_list}`
   [ "$MODEL" == "" ] && continue || DiskNum=`expr $DiskNum + 1`
    REAL=$scsi
  done

  [ $DiskNum -eq 0 ] && {
   echo -e "Drive 1^--^--^No Disk^Drive 2^--^--^No Disk"\\r
   } || {
   [ $DiskNum -lt 2 ] && {
    MountPoint=`/bin/df|/bin/grep "^/dev/sda1"|/bin/awk '{print $NF}'`
    [ "$MountPoint" == "/home" ] && {
     TotalSize=`/bin/df|/bin/grep "^/dev/sda1"|/bin/awk '{print $2}'`
     FreeSize=`/bin/df|/bin/grep "^/dev/sda1"|/bin/awk '{print $4}'`
     }

    [ "$MountPoint" == "" ] && {
     TotalSize="--"
     FreeSize="--"
     }

    [ "$REAL" == "SCSI0" ] && {
     echo -e "Drive 1^${TotalSize}^${FreeSize}^format^Drive 2^--^--^No Disk"\\r
     } || {
     echo -e "Drive 1^--^--^No Disk^Drive 2^${TotalSize}^${FreeSize}^format"\\r
     }
    } || {
    DiskNum=0
    for disk in sda1 sdb1; do
     DiskNum=`expr $DiskNum + 1`
     TotalSize=`/bin/df -h|/bin/grep "^/dev/${disk}"|/bin/awk '{print $2}'`
     [ "$TotalSize" == "" ] && TotalSize="--"

     FreeSize=`/bin/df -h|/bin/grep "^/dev/${disk}"|/bin/awk '{print $4}'`
     [ "$FreeSize" == "" ] && FreeSize="--"

     DATA="$DATADrive ${DiskNum}^${TotalSize}^${FreeSize}^format^"
    done
    echo -e "$DATA"\\r
    }
   }
  ;;
 "Physical_Disks")
  scsi_list=/etc/sysconfig/config/scsi.list
  i=0
  for scsi in SCSI0 SCSI1; do
   MODEL=`/bin/awk -F: /${scsi}/'{print $2}' ${scsi_list}`
   [ "$MODEL" == "" ] && continue || i=`expr $i + 1`
    REAL=$scsi
  done

  [ $i -lt 2 ] && {
   Capacity=`/bin/fdisk -l /dev/sda|/bin/awk /sda:/'{print $5}'|sed 's/\ //g'`
   MODEL=`/bin/awk -F: /${REAL}/'{print $2}' ${scsi_list}`
   /usr/bin/mdadm -D /dev/md1 >/dev/null 2>&1
   [ $? -eq 0 ] && ACT="active" || ACT="removed"

   [ "$REAL" == "SCSI0" ] && {
    echo -e "${MODEL}^${Capacity}^Ready^"\\r
    echo -e "Fail^Fail^Fail^"\\r
    } || {
    echo -e "Fail^Fail^Fail^"\\r
    echo -e "${MODEL}^${Capacity}^Ready^"\\r
    }
   } || {
   SCSI0=sda ; SCSI1=sdb
   for scsi in SCSI0 SCSI1; do
    MODEL=`/bin/awk -F: /${scsi}/'{print $2}' ${scsi_list}`
    eval str=\$${scsi}
    Capacity=`/bin/fdisk -l /dev/${str}|/bin/awk /${str}:/'{print $5}'|sed 's/\ //g'`
    MD_STATUS=`/usr/bin/mdadm -D /dev/md1`
    [ "$MD_STATUS" == "" ] && ACT="removed" || {
     echo "$MD_STATUS"|/bin/grep "$str" >/dev/null 2>&1
     [ $? -eq 0 ] && {
      echo "$MD_STATUS"|/bin/grep "$str"|/bin/grep "rebuilding" >/dev/null 2>&1
      [ $? -eq 0 ] && ACT="rebuilding" || ACT="active"
      } || ACT="removed"
     }
    echo -e "${MODEL}^${Capacity}^Ready^"\\r
   done
   }
  ;;
 "SingleFormat")
  Disk=`echo ${QUERY_STRING}|/bin/cut '-d&' -f2`
  $SingleFormat $Disk
  ;;
 "format")
  mode=`echo ${QUERY_STRING} | cut '-d&' -f2`
  $format_hdd $mode
  ;;
 "SetDevice")
  hostname=`echo ${QUERY_STRING} | cut '-d&' -f2`
  new_groupname=`echo ${QUERY_STRING} | cut '-d&' -f3`
  echo "${hostname}" > /etc/hostname
  /bin/hostname -F /etc/hostname
  echo "127.0.0.1	${hostname}.localdomain	${hostname}" > /etc/hosts
  export name="${hostname}"
  dlna_modify_config
  dlna_stop_daemon
  sleep 2
  dlna_start_daemon

  NETBIOS=`/bin/cat ${SMB_HOST_CONF}|grep "^netbios"`
  echo "${NETBIOS}" > ${SMB_HOST_CONF}
  echo "workgroup = ${new_groupname}" >> ${SMB_HOST_CONF}
  service_smb_stop
  sleep 2
  service_smb_start
  ;;
 "Status")
  HostName=`/bin/hostname`
  GROUPNAME=`/bin/awk -F= /workgroup/'{print $2}' ${SMB_HOST_CONF}|/bin/sed 's/\ //g'`
  Size=`/bin/df|/bin/awk /md1/'{print $2}'`
  echo -e "$HostName^$GROUPNAME^$Size"\\r
  ;;
 "getGuestQuota")
  bhard=`/bin/awk -F: /^nobody:/'{print $5}' /etc/passwd|\
         /bin/awk -F, '{print $2}'|/bin/sed 's/\ //g'`

  echo -e "${bhard}"\\r
  ;;
 "SetExecTable")
  Value=`echo ${QUERY_STRING}|/bin/cut '-d&' -f2|/bin/sed 's/\%20/\ /g'`
  $Value
  ;;
 "Quota")
  bhard=`echo ${QUERY_STRING} | cut '-d&' -f2`
  ${XFS_QUOTA} -x -c "limit -u bsoft=${bhard}g bhard=${bhard}g 99" /home
  old_str=`/bin/awk /^nobody:/'{print $1}' /etc/passwd|/bin/sed 's/\ //g'`
  new_str="nobody:!!:99:98:${bhard},${bhard}:/home/PUBLIC:/sbin/nologin"
  $replaceFile "/etc/passwd" "${old_str}" "${new_str}"
  ;;
 "CreateUser")
  service_user_modify ${QUERY_STRING}
  ;;
 "CreateFolder")
  FolderName=`echo ${QUERY_STRING}|/bin/cut '-d&' -f2`
  SHARE_PATH=/home
  /bin/mkdir -p ${SHARE_PATH}/${FolderName}
  /bin/chmod 777 ${SHARE_PATH}/${FolderName}
  service_smb_modify_conf
  service_user_modify_installer_action
  ;;
 "ShareFolderList")
  HOME=/home
  data="/"
  for i in $data; do
   PATH=`/bin/find "${HOME}${i}" -maxdepth 1 -type d|/bin/tr " " "^"`
   for j in $PATH; do
    tmpPATH=`echo ${j}|/bin/tr "^" " "`
    [ "${tmpPATH}" == "${HOME}${i}" ] && continue
    tmpPATH=${tmpPATH##*/}
    [ "$str" == "" ] &&\
     str="$tmpPATH" ||\
     str="$str^$tmpPATH"
   done
  done
  echo "$str"
  ;;
 "UserList")
  for i in `/bin/awk -F: '{print $1}' ${PASSWD}`; do
   i=`echo ${i}|/bin/sed 's/\ //g'`
   [ "$str" == "" ] &&\
    str="$i" ||\
    str="$str^$i"
  done
  echo $str
  ;;
 "SpecialUserFolderList")
  user=`echo ${QUERY_STRING} | cut '-d&' -f2`
  HOME=/home
  PATH=`/bin/find "${HOME}" -maxdepth 1 -type d|/bin/tr " " "^"`
  for i in $PATH; do
   tmpPATH=`echo ${i}|/bin/tr "^" " "`
   [ "${tmpPATH}" == "${HOME}" ] && continue
   tmpPATH=${tmpPATH##*/}
   WriteList=`/bin/cat ${SMB_SHARES_CONF}/${tmpPATH}.inc|/bin/grep "write"|\
              /bin/grep ",${user},"`
   Invalid=`/bin/cat ${SMB_SHARES_CONF}/${tmpPATH}.inc|\
            /bin/awk -F= /invalid/'{print $2}'|/bin/sed 's/\ //g'|/bin/tr "," " "`
   for j in $Invalid; do
    [ "$user" == "$j" ] && {
     InvalidUsers=$j
     break
     }
   done

   [ "$InvalidUsers" == "" ] && {
    [ "$WriteList" == "" ] || {
     [ "$str" == "" ] &&\
     str="$tmpPATH" ||\
      str="$str^$tmpPATH"
     }
    }
  done
  echo "BTDownload^Media^PUBLIC^${user}^${str}"
  ;;
 "ChangeMode")
  NEW_MODE=`echo ${QUERY_STRING} | cut '-d&' -f2`
  service_smb_modify_scurity $NEW_MODE
  sleep 2
  service_smb_start
  ;;
 "ModifyMAC")
  NEW_MAC=`echo ${QUERY_STRING}|/bin/cut '-d&' -f2|/bin/tr 'a-z' 'A-Z'`
  OLD_MAC=`/bin/awk -F= /HWADDR/'{print $2}' $IFCFG|/bin/sed 's/\ //g'`
  OLD_MAC_DEFAULT=`/bin/awk -F= /HWADDR/'{print $2}' $IFCFG_DEFAULT|/bin/sed 's/\ //g'`
  $replaceFile "${IFCFG}" "HWADDR=${OLD_MAC}" "HWADDR=${NEW_MAC}"
  $replaceFile "${IFCFG_DEFAULT}" "HWADDR=${OLD_MAC_DEFAULT}" "HWADDR=${NEW_MAC}"
  ;;
 "MACValue")
  /bin/awk -F= /HWADDR/'{print $2}' $IFCFG_DEFAULT|/bin/sed 's/\ //g'
  ;;
 *)
  echo -e "${QUERY_STRING} ${REQUEST_METHOD}"\\r
  ;;
esac

echo -e "</BODY></HTML>"\\r
