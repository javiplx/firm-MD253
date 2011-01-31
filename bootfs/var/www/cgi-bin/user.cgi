#!/bin/sh
echo "Content-type: text/html"
echo ""
echo "<HTML><HEAD><TITLE>Sample CGI Output</TITLE></HEAD><BODY>"

. /usr/libexec/modules/modules.conf
PASSWD=/etc/passwd

CONFIG_PATH=/etc/sysconfig/config
SMB_PATH=${CONFIG_PATH}/smb
SMP_SHARE_PATH=${SMB_PATH}/shares
SMB_CONF=${SMB_PATH}/smb.conf
SHARE_PATH=/home

XFS_QUOTA=/usr/local/xfsprogs/xfs_quota
replaceFile=/var/www/cgi-bin/replaceFile
func=`echo ${QUERY_STRING} | cut '-d&' -f1`

case ${func} in
 HDDSize)
  HDDSize=`/bin/df|/bin/grep "/home$"|/bin/awk '{print $2}'`
  expr $HDDSize / 1024 / 1024
  ;;
 user_data_list)
  USER=`/bin/awk -F: /:500:/'{print $1}' ${PASSWD}`
  for user in ${USER}; do
   size=`$XFS_QUOTA -x -c 'report -N -h' /home|\
         /bin/awk /^${user}\ /'{print $2}'|/bin/sed 's/\ //g'`
   bhard=`$XFS_QUOTA -x -c 'report -N -h' /home|\
         /bin/awk /^${user}\ /'{print $4}'|/bin/sed 's/\ //g'`

   str=`/bin/awk -F: /^${user}:/'{print $5}' ${PASSWD}|\
        /bin/awk -F, '{print $2}'|/bin/sed 's/\ //g'`

   [ "$str" == "0" ] && bhard=""
   [ "$size" == "" ] && size="none"
   [ "$bhard" == "" ] && bhard="none"
   echo "$user^$bhard^$size^manager"
  done
  ;;
 adduser)
  service_user_modify ${QUERY_STRING}
  ;;
 HDDUseFree)
  /bin/df|/bin/grep "/home$"|/bin/awk 'BEGIN{OFS="\n"}{print $3,$4}'|/bin/sed 's/\ //g'
  ;;
 user_quota)
  user=`echo ${QUERY_STRING} | cut '-d&' -f2`
  /bin/awk -F: /^${user}:/'{print $5}' ${PASSWD}|\
  /bin/awk -F, '{print $2}'|/bin/sed 's/\ //g'
  ;;
 ModifyUsers)
  service_user_modify ${QUERY_STRING}
  ;;
 deluser)
  service_user_modify ${QUERY_STRING}
  ;;
 UsersData)
  UsersData=$(echo $(service_smb_modify_share_access))
  echo "${UsersData}"|/bin/sed 's/\ //g'|/bin/sed 's/,$//'|/bin/tr "," "^"
  ;;
 SecurityData)
  MODE="shares"
  for dir in $MODE; do
   file=`ls ${SMB_PATH}/${dir}`
   for i in ${file}; do
    string=${i%.*}
    FolderStatus=`/bin/cat ${SMB_PATH}/folders/${string}`

    [ "${string}" == "PUBLIC" -o "${FolderStatus}" == "anonymous" ] && {
     write_list="$FolderStatus"
     invalid_users="$FolderStatus"
     } || {
     write_list=`/bin/awk -F= /write/'{print $2}' ${SMB_PATH}/${dir}/${i}|/bin/sed 's/\ //g'`
     invalid_users=`/bin/awk -F= /invalid/'{print $2}' ${SMB_PATH}/${dir}/${i}|/bin/sed 's/\ //g'`
     [ "$invalid_users" == "" ] && invalid_users=none
     }

    echo "$string^$write_list#$invalid_users"
   done
  done
  ;;
 USBData)
  SHARE_PATH_TREE=`/bin/df|/bin/grep "/home/"|/bin/awk '{print $1}'`
  for disk in $SHARE_PATH_TREE; do
   disk=${disk##*/}
   FOLDER=`/bin/df|/bin/awk /${disk}/'{print $NF}'`
   FOLDER=${FOLDER##*/}
   str="${FOLDER}^"
  done
  echo "$str"
  ;;
 nas_state)
  [ -n "`/bin/pidof smbd`" ] && echo "ON" || echo "OFF"

  /bin/df|/bin/awk '{print $NF}'|/bin/grep "^/home$" >/dev/null 2>&1
  [ $? -eq 0 ] && echo "ENABLE" || echo "DISABLE"

  NobodyQuota=`/bin/awk -F: /nobody/'{print $5}' /etc/passwd|/bin/awk -F, '{print $1}'`
  echo "$NobodyQuota"

  HDDSize=`/bin/df|/bin/grep "/home$"|/bin/awk '{print $2}'`
  [ "$HDDSize" == "" ] && echo "No disk" || expr $HDDSize / 1024 / 1024

  [ "$HDDSize" == "" ] && echo "No disk" || {
   [ "$NobodyQuota" == "0" ] && echo "Unlimited" || {
    $XFS_QUOTA -x -c 'report -N -h' /home|\
    /bin/awk /^nobody\ /'{print $2}'|/bin/sed 's/\ //g'
    }
   }
  ;;
 FolderList)
  FOLDER=`/bin/find "${SHARE_PATH}" -maxdepth 1 -type d|/bin/tr " " "^"`
  for folder in $FOLDER; do
   [ "${folder}" == "${SHARE_PATH}" ] && continue
   [ "${folder}" == "/home/.lpd" ] && continue
   folder=${folder##*/}
   folder=`echo ${folder}|tr "^" " "`
   echo "$folder"
  done
  ;;
 ChgSMBStatus)
  STATUS=`echo ${QUERY_STRING} | cut '-d&' -f2`
  Quota=`echo ${QUERY_STRING} | cut '-d&' -f3`
  PASSWD_LINE=`/bin/cat /etc/passwd|/bin/grep "^nobody:"`
  $replaceFile "/etc/passwd" "${PASSWD_LINE}" "nobody:!!:99:98:${Quota},${Quota}:/home/PUBLIC:/sbin/nologin"
  ${XFS_QUOTA} -x -c "limit -u bsoft=${Quota}g bhard=${Quota}g 99" /home
  service_smb_${STATUS}
  ;;
 GetFolderStatus)
  FolderName=`echo ${QUERY_STRING}|/bin/cut '-d&' -f2`
  /bin/cat ${SMB_PATH}/folders/"${FolderName}"
  ;;
 FolderCreate)
  FolderName=`echo ${QUERY_STRING}|/bin/cut '-d&' -f2`
  FolderStatus=`echo ${QUERY_STRING}|/bin/cut '-d&' -f3`
  /bin/mkdir -p ${SHARE_PATH}/"${FolderName}"
  /bin/chmod 777 ${SHARE_PATH}/"${FolderName}"
  echo "${FolderStatus}" > ${SMB_PATH}/folders/"${FolderName}"
  service_smb_modify_conf
  ;;
 FolderModify)
  OldFolderName=`echo ${QUERY_STRING}|/bin/cut '-d&' -f2`
  FolderName=`echo ${QUERY_STRING}|/bin/cut '-d&' -f3`
  FolderStatus=`echo ${QUERY_STRING}|/bin/cut '-d&' -f4`
  /bin/mv ${SHARE_PATH}/"${OldFolderName}" ${SHARE_PATH}/"${FolderName}"
  /bin/chmod 777 ${SHARE_PATH}/"${FolderName}"
  /bin/rm -f ${SMP_SHARE_PATH}/"${OldFolderName}".inc
  /bin/rm -f ${SMB_PATH}/folders/"${OldFolderName}"
  echo "${FolderStatus}" > ${SMB_PATH}/folders/"${FolderName}"
  service_smb_modify_conf
  ;;
 FolderDelete)
  FolderName=`echo ${QUERY_STRING}|/bin/cut '-d&' -f2`
  /bin/rm -rf ${SHARE_PATH}/"${FolderName}"
  /bin/rm -f ${SMP_SHARE_PATH}/"${FolderName}".inc
  /bin/rm -f ${SMB_PATH}/folders/"${FolderName}"
  service_smb_modify_conf
  ;;
 ModifySMBFolderAction)
  service_user_modify_smb_action ${QUERY_STRING}
  ;;
 DiskStatus)
  Status=`/bin/df|/bin/grep "/home$"`
  [ "$Status" == "" ] && echo "NoDisk" || echo "Enable"
  ;;
 *)
  echo "Hello Mapower ${QUERY_STRING} ${REQUEST_METHOD}"
  ;;
esac

echo "</BODY></HTML>"
