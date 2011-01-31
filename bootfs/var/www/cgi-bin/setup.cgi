#!/bin/sh
echo "Content-type: text/html"
echo ""
echo "<HTML><HEAD><TITLE>Sample CGI Output</TITLE></HEAD><BODY>"

. /usr/libexec/modules/modules.conf
DHCP_TMP=/etc/sysconfig/system-script/udhcpd.tmp

CONFIG_PATH=/etc/sysconfig/config
IFCFG=${CONFIG_PATH}/ifcfg-eth0
GMT=${CONFIG_PATH}/gmt.conf
TZINFO=${CONFIG_PATH}/tzinfo
NTP_CONF=${CONFIG_PATH}/ntp.conf
NTP_SERVER=${CONFIG_PATH}/ntp_server
NTP_ACTION=${CONFIG_PATH}/ntp.action
WEBMASTER=${CONFIG_PATH}/webmaster.conf

scsi_list=/etc/sysconfig/config/scsi.list

format_hdd=/var/www/cgi-bin/format.sh
SingleFormat=/var/www/cgi-bin/SingleFormat.sh
scandisk_hdd=/var/www/cgi-bin/scandisk.sh
raid1_rebuild=/etc/sysconfig/system-script/rebuilddisk.sh
replaceFile=/var/www/cgi-bin/replaceFile
func=`echo ${QUERY_STRING} | cut '-d&' -f1`

case ${func} in
 service_ssh_start)
  RSA_FILE=/etc/sysconfig/config/ssh/ssh_rsa_host_key
  PID_FILE=/var/run/dropbear.pid
  PID=`/bin/pidof ssh`
  [ "$PID" == "" ] && /usr/sbin/dropbear -r ${RSA_FILE} -P ${PID_FILE}
  ;;
 ChgSystemStatus)
  service_system_modify_conf ${QUERY_STRING}
  ;;
 GetDeviceIP)
  /bin/awk -F= /BOOTPROTO/'{print $2}' $IFCFG|/bin/sed 's/\ //g'
  /bin/awk -F= /IPADDR/'{print $2}' $IFCFG|/bin/sed 's/\ //g'
  /bin/awk -F= /NETMASK/'{print $2}' $IFCFG|/bin/sed 's/\ //g'
  /bin/awk -F= /GATEWAY/'{print $2}' $IFCFG|/bin/sed 's/\ //g'
  /bin/awk -F= /PDNS/'{print $2}' $IFCFG|/bin/sed 's/\ //g'
  /bin/awk -F= /SDNS/'{print $2}' $IFCFG|/bin/sed 's/\ //g'
  /bin/awk -F= /MTU/'{print $2}' $IFCFG|/bin/sed 's/\ //g'
  #/bin/awk -F= /HWADDR/'{print $2}' $IFCFG|/bin/sed 's/\ //g'
  ;;
 modify_ip)
  network_modify_conf ${QUERY_STRING}
  sleep 5
  /usr/local/TwonkyVision/twonkymedia.sh stop
  sleep 1
  /usr/local/TwonkyVision/twonkymedia.sh start
  ;;
 get_dhcp_ip)
  #HWADDR=`echo ${QUERY_STRING} | cut '-d&' -f2`
  #/bin/ifconfig eth0 hw ether ${HWADDR}
  /bin/udhcpc -n -R -b -i eth0 --timeout=1 --tryagain=1 -s ${DHCP_TMP} >/dev/null 2>&1
  [ -f /tmp/.dhcp.tmp ] && {
   cat /tmp/.dhcp.tmp
   rm -f /tmp/.dhcp.tmp
   } || {
   echo "no_dhcp"
   }
  ;;
 RAIDSTATUS)
  RAID_MODE=`/usr/bin/mdadm -D /dev/md1|\
  /bin/awk -F: /Level/'{print $2}'|/bin/sed 's/\ //g'`

  DiskNum=0
  for scsi in SCSI0 SCSI1; do
   MODEL=`/bin/awk -F: /${scsi}/'{print $2}' ${scsi_list}`
   [ "$MODEL" == "" ] && continue || DiskNum=`expr $DiskNum + 1`
  done

  [ "$RAID_MODE" == "" ] && {
   [ $DiskNum -lt 2 ] && RAID_MODE=SingleDisk || RAID_MODE=DaulDisk
   [ $DiskNum -eq 0 ] && RAID_MODE=NoDisk
   } || {
   [ $DiskNum -lt 2 ] && RAID_MODE=SingleDisk
   }
  echo "$RAID_MODE"

  [ "$RAID_MODE" == "raid1" ] || break
  for DISK in sda sdb; do
   fdisk -l /dev/${DISK} >/dev/null 2>&1
   [ $? -eq 0 ] || {
    status=fail
    }
  done

  [ "$status" == "fail" ] && echo "not" || {
   /usr/bin/mdadm -D /dev/md1|/bin/grep "removed" >/dev/null 2>&1
   [ $? -eq 0 ] && {
    [ $DiskNum -lt 2 ] && echo "not" || echo "rebuild"
    } || echo "not"
   }

  STATUS=`/usr/bin/mdadm -D /dev/md1`
  [ "${STATUS}" == "" ] && echo "No" || echo "Yes"
  ;;
 Logical_Volumes)
  STATUS=`/usr/bin/mdadm -D /dev/md1`
  [ "${STATUS}" == "" ] && echo "not appear" || {
   MODE=`echo "${STATUS}"|/bin/awk -F: /Level/'{print $2}'|sed 's/\ //g'`
   [ "$MODE" == "linear" ] && MODE=JBOD ||\
    MODE=`echo $MODE| tr "[:lower:]" "[:upper:]"`
    echo "$MODE"
   /bin/df -h /dev/md1|/bin/grep "^/dev"|/bin/awk 'BEGIN{OFS="\n"}{print $2,$4}'
   echo "${STATUS}"|/bin/grep "rebuilding" >/dev/null 2>&1
   [ $? -eq 0 ] && {
    percent=`/bin/cat /proc/mdstat|/bin/awk /recovery/'{print $4}'|sed 's/\ //g'`
    echo "recovery=${percent}"
   } || echo "Ready"
   }
  ;;
 Physical_Disks_1)
  for disk in sdb sda; do
   [ "$disk" == "sda" ] && str="Drive (Right)" || str="Drive (Left)"
   MODEL=`/bin/smartctl -i -d ata /dev/${disk}|/bin/awk /Device\ Model/'{print $NF}'|/bin/sed 's/\ //g'`
   [ "$MODEL" == "" ] && {
    echo "${str}:--:--:No Disk:removed"
    } || {
    Capacity=`/bin/fdisk -l /dev/${disk}|/bin/awk -F, /${disk}:/'{print $1}'|/bin/awk -F: '{print $2}'|/bin/sed 's/^\ //'`
    Status=`/bin/smartctl -i /dev/${disk} -d ata|/bin/grep "SMART support is"|/bin/grep -v "Available"|/bin/awk -F: '{print $2}'|/bin/sed 's/\ //g'`

    case ${Status} in
     Disabled)
      ACT="${Status}"
      ;;
     Enabled)
      ACT=`/bin/smartctl -H -d ata /dev/${disk}|/bin/awk /overall-health/'{print $NF}'|/bin/sed 's/\ //g'`
      ;;
    esac

    echo "${str}:${MODEL}:${Capacity}:Ready:${ACT}"
    }
  done
  ;;
 Physical_Disks)
  DiskNum=0
  for scsi in SCSI0 SCSI1; do
   MODEL=`/bin/awk -F: /${scsi}/'{print $2}' ${scsi_list}`
   [ "$MODEL" == "" ] && continue || DiskNum=`expr $DiskNum + 1`
    REAL=$scsi
  done

  [ $DiskNum -eq 0 ] && {
   echo "Drive 1:--:--:No Disk:removed"
   echo "Drive 2:--:--:No Disk:removed"
   } || {
   [ $DiskNum -lt 2 ] && {
    Capacity=`/bin/fdisk -l /dev/sda|/bin/awk /sda:/'{print $3}'|sed 's/\ //g'`
    MODEL=`/bin/awk -F: /${REAL}/'{print $2}' ${scsi_list}`
    /usr/bin/mdadm -D /dev/md1 >/dev/null 2>&1
    [ $? -eq 0 ] && ACT="active" || ACT="removed"

    [ "$REAL" == "SCSI0" ] && {
     echo "Drive (Left):--:--:No Disk:removed"
     echo "Drive (Right):${MODEL}:${Capacity}:Ready:${ACT}"
     } || {
     echo "Drive (Left):${MODEL}:${Capacity}:Ready:${ACT}"
     echo "Drive (Rigth):--:--:No Disk:removed"
     }
    } || {
    SCSI0=sda ; SCSI1=sdb
    for scsi in SCSI1 SCSI0; do
     MODEL=`/bin/awk -F: /${scsi}/'{print $2}' ${scsi_list}`
     eval str=\$${scsi}
     Capacity=`/bin/fdisk -l /dev/${str}|/bin/awk /${str}:/'{print $3}'|sed 's/\ //g'`
     MD_STATUS=`/usr/bin/mdadm -D /dev/md1`
     [ "$MD_STATUS" == "" ] && ACT="removed" || {
      echo "$MD_STATUS"|/bin/grep "$str" >/dev/null 2>&1
      [ $? -eq 0 ] && {
       echo "$MD_STATUS"|/bin/grep "$str"|/bin/grep "rebuilding" >/dev/null 2>&1
       [ $? -eq 0 ] && ACT="rebuilding" || ACT="active"
       } || ACT="removed"
      }
     echo "$scsi:${MODEL}:${Capacity}:Ready:${ACT}"
    done
    }
   }
  ;;
 SingleDisk_Volumes)
  DiskNum=0
  for scsi in SCSI0 SCSI1; do
   MODEL=`/bin/awk -F: /${scsi}/'{print $2}' ${scsi_list}`
   [ "$MODEL" == "" ] && continue || DiskNum=`expr $DiskNum + 1`
    REAL=$scsi
  done

  [ $DiskNum -eq 0 ] && {
   echo "Drive (Right):--:--:No Disk"
   echo "Drive (Left):--:--:No Disk"
   } || {
   [ $DiskNum -lt 2 ] && {
    MountPoint=`/bin/df|/bin/grep "^/dev/sda1"|/bin/awk '{print $NF}'`
    [ "$MountPoint" == "/home" ] && {
     TotalSize=`/bin/df -h|/bin/grep "^/dev/sda1"|/bin/awk '{print $2}'`
     FreeSize=`/bin/df -h|/bin/grep "^/dev/sda1"|/bin/awk '{print $4}'`
     }

    [ "$MountPoint" == "" ] && {
     TotalSize="--"
     FreeSize="--"
     }

    [ "$REAL" == "SCSI0" ] && {
     echo "Drive (Left):--:--:No Disk"
     echo "Drive (Right):${TotalSize}:${FreeSize}:format"
     } || {
     echo "Drive (Left):${TotalSize}:${FreeSize}:format"
     echo "Drive (Right):--:--:No Disk"
     }
    } || {
    DiskNum=0
    for disk in sdb1 sda1; do
     DiskNum=`expr $DiskNum + 1`
     TotalSize=`/bin/df -h|/bin/grep "^/dev/${disk}"|/bin/awk '{print $2}'`
     [ "$TotalSize" == "" ] && TotalSize="--"

     FreeSize=`/bin/df -h|/bin/grep "^/dev/${disk}"|/bin/awk '{print $4}'`
     [ "$FreeSize" == "" ] && FreeSize="--"
     [ ${DiskNum} -eq 1 ] && str="(Right)" || str="(Left)"

     echo "Drive ${str}:${TotalSize}:${FreeSize}:format"
    done
    }
   }
  ;;
 USB_Disks)
  DiskNum=0
  for scsi in SCSI0 SCSI1; do
   MODEL=`/bin/awk -F: /${scsi}/'{print $2}' ${scsi_list}`
   [ "$MODEL" == "" ] && continue || DiskNum=`expr $DiskNum + 1`
  done
  SHARE_PATH_TREE=`/bin/df|/bin/grep "/home/"|/bin/awk '{print $1}'`

  for disk in $SHARE_PATH_TREE; do
   [ $DiskNum -lt 2 ] || {
    [ "$disk" == "/dev/sdb1" ] && continue
    }
   echo ${disk}
  done
  ;;
 USB_Disks_Data)
  dev=`echo ${QUERY_STRING}|/bin/cut '-d&' -f2`
  tmp_dev=${dev##*/}
  Volume=`/bin/df|/bin/awk /${tmp_dev}/'{print $NF}'`
  Volume=${Volume##*/} ; echo "$Volume"
  /bin/smartctl -i ${dev}|/bin/awk -F: /Device:/'{print $2}'|/bin/tr -s ' ' ' '|\
  /bin/sed 's/Version//g'|/bin/sed 's/^\ //g'|/bin/sed 's/\ $//g'
  /bin/df -h /dev/${tmp_dev}|/bin/grep "^/dev"|/bin/awk 'BEGIN{OFS="\n"}{print $2,$4}'
  #TYPE=`/bin/blkid -c /dev/null -s TYPE $dev|cut '-d=' -f2|sed 's/\"//g'|sed 's/\ //g'`
  #[ "$TYPE" == "vfat" ] && TYPE=FAT
  #TYPE=`echo $TYPE|/bin/tr "[:lower:]" "[:upper:]"`
  #echo "$TYPE"

  /bin/fdisk -l|/bin/grep "^$dev"|/bin/cut -c55-
  ;;
 UsersData)
  UsersData=$(echo $(service_smb_modify_share_access))
  echo "${UsersData}"|/bin/sed 's/\ //g'|/bin/sed 's/,$//'|/bin/tr "," "^"
  ;;
 rebuild_info)
  for disk in sda1 sdb1; do
   MD_STATUS=`/usr/bin/mdadm -D /dev/md1`
   echo "$MD_STATUS"|/bin/grep "$disk" >/dev/null 2>&1
   [ $? -eq 0 ] && {
    active=$disk
    break
    }
  done

  for DISK in sda sdb; do
   SIZE=`fdisk -l /dev/${DISK}|awk /${DISK}:/'{print $5}'`
   i="${DISK}=${SIZE}"
   export $i
  done

  case ${active} in
   sda1)
    [ $sdb -lt $sda ] && echo "small^sda^sdb" || echo "big^sda^sdb"
    ;;
   sdb1)
    [ $sda -lt $sdb ] && echo "small^sdb^sda" || echo "big^sdb^sda"
    ;;
  esac
  ;;
 raid1_rebuild)
  $raid1_rebuild
  ;;
 scandisk_hdd)
  $scandisk_hdd
  ;;
 format_hdd)
  mode=`echo ${QUERY_STRING} | cut '-d&' -f2`
  $format_hdd $mode
  ;;
 SingleFormat)
  Disk=`echo ${QUERY_STRING}|/bin/cut '-d&' -f2`
  $SingleFormat $Disk
  ;;
 ntp_action)
  /bin/cat ${NTP_ACTION}
  ;;
 gmtconf)
  /bin/cat $GMT|/bin/tr -d '\n'
  ;;
 tzinfo)
  /bin/cat $TZINFO
  ;;
 datetime)
  /bin/date '+%Y %m %d %H %M'|/bin/tr -d '\n'
  ;;
 ntpserver)
  /bin/cat $NTP_SERVER
  ;;
 ntpconf)
  /bin/cat $NTP_CONF|/bin/tr -d '\n'
  ;;
 AddNTPServer)
  ADD=`echo ${QUERY_STRING} | cut '-d&' -f2`
  echo "$ADD" >> $NTP_SERVER
  ;;
 DelNTPServer)
  DEL=`echo ${QUERY_STRING} | cut '-d&' -f2`
  OLD=`/bin/cat $NTP_SERVER|/bin/grep -v "^${DEL}$"`
  echo "$OLD" > $NTP_SERVER
  for i in `/bin/cat $NTP_SERVER`; do
   echo "$i" > $NTP_CONF
   break
  done
  ;;
 ChgDateStatus)
  ntp_action=`echo ${QUERY_STRING} | cut '-d&' -f2`
  echo "$ntp_action" > ${NTP_ACTION}
  ntpconf=`echo ${QUERY_STRING} | cut '-d&' -f3`
  tzinfo=`echo ${QUERY_STRING} | cut '-d&' -f4`
  now=`echo ${QUERY_STRING} | cut '-d&' -f5`
  echo "$ntpconf" > $NTP_CONF
  echo "$tzinfo" > $GMT

  [ "$ntp_action" == "manual" ] &&\
   date ${now}

  [ "$ntp_action" == "auto" ] && {
   /etc/sysconfig/system-script/cron-ntp >/tmp/.StatusMsg 2>&1
   /bin/cat /tmp/.StatusMsg
   /rm -f /tmp/.StatusMsg
   }
  ;;
 webmaster)
  Login_user=`echo ${QUERY_STRING}|/bin/cut '-d&' -f2`
  Login_passwd=`echo ${QUERY_STRING}|/bin/cut '-d&' -f3`
  user=`/bin/cat ${WEBMASTER}|/bin/cut '-d:' -f1`
  passwd=`/bin/cat ${WEBMASTER}|/bin/cut '-d:' -f2`
  [ ${Login_user} == ${user} ] && [ ${Login_passwd} == ${passwd} ] && /bin/echo "OK"
  ;;
 *)
  echo "Hello Mapower ${QUERY_STRING} ${REQUEST_METHOD}"
  ;;
esac

echo "</BODY></HTML>"
