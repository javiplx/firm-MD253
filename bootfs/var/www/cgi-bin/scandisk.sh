#!/bin/sh
PATH=/bin:/sbin:/usr/bin:/usr/sbin
export PATH

. /usr/libexec/modules/modules.conf
CONFIG_PATH=/etc/sysconfig/config
scsi_list=${CONFIG_PATH}/scsi.list
TwonkyMedia=/usr/local/TwonkyVision/twonkymedia.sh

SLEEP=1
SHARE_PATH=/home

SERVICE="smb ftp btpd lpd"
for i in $SERVICE; do
 service_${i}_stop >/dev/null 2>&1
done
dlna_stop_daemon >/dev/null 2>&1 &
$TwonkyMedia stop

/bin/sleep $SLEEP

DiskNum=0
for scsi in SCSI0 SCSI1; do
 MODEL=`/bin/awk -F: /${scsi}/'{print $2}' ${scsi_list}`
 [ "$MODEL" == "" ] && continue || DiskNum=`expr $DiskNum + 1`
done

SHARE_PATH_TREE=`/bin/df|/bin/grep "/home/"|/bin/awk '{print $1}'`
for disk in $SHARE_PATH_TREE; do
 disk=${disk##*/}
 /etc/sysconfig/system-script/umount $disk
done

RAID_MODE=`/usr/bin/mdadm -D /dev/md1`
[ "$RAID_MODE" == "" ] && {
 /bin/umount -l /dev/sdb1 >/dev/null 2>&1
 /bin/umount -l /dev/sda1 >/dev/null 2>&1
 } || {
 /bin/umount -l /dev/md1 >/dev/null 2>&1
 }

echo "hdd1 blue clear" > /proc/mp_leds
echo "hdd2 blue clear" > /proc/mp_leds
echo "hdd1 red set" > /proc/mp_leds
echo "hdd2 red set" > /proc/mp_leds

[ "$RAID_MODE" == "" ] && {
 [ $DiskNum -lt 2 ] && {
  /usr/local/xfsprogs/xfs_repair -nL /dev/sda1 >/dev/null 2>&1
  } || {
  /usr/local/xfsprogs/xfs_repair -nL /dev/sda1 >/dev/null 2>&1
  /usr/local/xfsprogs/xfs_repair -nL /dev/sdb1 >/dev/null 2>&1
  }
 } || {
 /usr/local/xfsprogs/xfs_repair -nL /dev/md1 >/dev/null 2>&1
 }

#mount -t xfs -o prjquota /dev/md1 /home >/dev/null 2>&1
[ "$RAID_MODE" == "" ] && {
 [ $DiskNum -lt 2 ] && {
  /bin/mount -t xfs -o uquota /dev/${dev}1 ${SHARE_PATH}
  } || {
  /bin/mount -t xfs -o uquota /dev/sda1 ${SHARE_PATH}
  [ -d "${SHARE_PATH}/Disk_2" ] || /bin/mkdir -p ${SHARE_PATH}/Disk_2
  /bin/mount -t xfs -o uquota /dev/sdb1 ${SHARE_PATH}/Disk_2
  }
 } || {
 /bin/mount -t xfs -o uquota /dev/md1 /home
 }
[ $? -eq 0 ] && {
 /bin/logger "$0 - Drive Mount Succeed"
 echo "hdd1 red clear" > /proc/mp_leds
 echo "hdd2 red clear" > /proc/mp_leds
 echo "hdd1 blue set" > /proc/mp_leds
 echo "hdd2 blue set" > /proc/mp_leds
 } || {
 /bin/logger "$0 - Drive Mount Failed"
 echo "hdd1 blue clear" > /proc/mp_leds
 echo "hdd2 blue clear" > /proc/mp_leds
 echo "hdd1 red set" > /proc/mp_leds
 echo "hdd2 red set" > /proc/mp_leds
 }

for disk in $SHARE_PATH_TREE; do
 disk=${disk##*/}
 [ $DiskNum -lt 2 ] || {
  [ "$disk" == "sdb1" ] && continue
  }
 /etc/sysconfig/system-script/mount $disk
done

service_smb_modify_conf

for i in $SERVICE; do
 service_${i}_start >/dev/null 2>&1 &
done
dlna_start_daemon >/dev/null 2>&1 &
$TwonkyMedia start
