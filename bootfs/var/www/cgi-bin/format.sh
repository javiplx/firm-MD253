#!/bin/sh
PATH=/bin:/sbin:/usr/bin:/usr/sbin
export PATH

mode=$1

. /usr/libexec/modules/modules.conf
CONFIG_PATH=/etc/sysconfig/config
SMB_CONF=${CONFIG_PATH}/smb/smb.conf
scsi_list=${CONFIG_PATH}/scsi.list

XFS_QUOTA=/usr/local/xfsprogs/xfs_quota
replaceFile=/bin/replaceFile
crontable=/etc/sysconfig/config/root
detectRebuild=/etc/sysconfig/system-script/detectRebuild
TwonkyMedia=/usr/local/TwonkyVision/twonkymedia.sh

PASSWD=/etc/passwd
SLEEP=1
SHARE_PATH=/home

detectRebuildLine=`/bin/cat ${crontable}|/bin/grep "${detectRebuild}"`
echo "${detectRebuildLine}"|/bin/grep "#" >/devnull 2>&1
[ $? -eq 0 ] || {
 $replaceFile "${crontable}" "${detectRebuildLine}" "#* * * * * /etc/sysconfig/system-script/detectRebuild"
 service_crond_start
 }

echo "hdd1 blue clear" > /proc/mp_leds
echo "hdd2 blue clear" > /proc/mp_leds
echo "hdd1 red clear" > /proc/mp_leds
echo "hdd2 red clear" > /proc/mp_leds
echo "hdd1 red set" > /proc/mp_leds
echo "hdd2 red set" > /proc/mp_leds

SERVICE="smb ftp btpd lpd"
for i in $SERVICE; do
 service_${i}_stop >/dev/null 2>&1
done
dlna_stop_daemon >/dev/null 2>&1 &
$TwonkyMedia stop

/bin/sleep $SLEEP
/bin/killall djmount >/dev/null 2>&1
/bin/killall udevd >/dev/null 2>&1
/bin/sleep $SLEEP

SHARE_PATH_TREE=`/bin/df|/bin/grep "/home/"|/bin/awk '{print $1}'`
for disk in $SHARE_PATH_TREE; do
 disk=${disk##*/}
 /etc/sysconfig/system-script/umount $disk
done

Directory="PUBLIC Media BitTorrent"
[ -d /tmp/ftpaccess ] || /bin/mkdir -p /tmp/ftpaccess
for i in $Directory; do
 /bin/cp -af ${SHARE_PATH}/${i}/.ftpaccess /tmp/ftpaccess/${i}
done

/bin/umount -l /dev/sda1 >/dev/null 2>&1
/bin/umount -l /dev/sdb1 >/dev/null 2>&1

/bin/umount -l /dev/md1 >/dev/null 2>&1
/usr/bin/mdadm --stop /dev/md1 >/dev/null 2>&1

service_create_partition ${mode} >/dev/null 2>&1

/bin/sleep $SLEEP
/bin/killall djmount >/dev/null 2>&1
/bin/sleep $SLEEP

cat /dev/null > /etc/mdadm.conf
/usr/bin/mdadm --zero-superblock /dev/sda1
/usr/bin/mdadm --zero-superblock /dev/sdb1
/usr/bin/mdadm --create /dev/md1 --raid-devices=2 --level=${mode} --run /dev/sd[a-b]1 --assume-clean >/dev/null 2>&1
/usr/local/xfsprogs/mkfs.xfs -f /dev/md1 >/dev/null 2>&1
/usr/bin/mdadm -D -s >> /etc/mdadm.conf

echo "hdd1 blue clear" > /proc/mp_leds
echo "hdd2 blue clear" > /proc/mp_leds
echo "hdd1 red clear" > /proc/mp_leds
echo "hdd2 red clear" > /proc/mp_leds

#mount -t xfs -o prjquota /dev/md1 ${SHARE_PATH} >/dev/null 2>&1
/bin/mount -t xfs -o uquota /dev/md1 ${SHARE_PATH}
[ $? -eq 0 ] && {
 /bin/logger "$0 - Drive Mount Succeed"
 echo "hdd1 blue set" > /proc/mp_leds
 echo "hdd2 blue set" > /proc/mp_leds
 } || {
 /bin/logger "$0 - Drive Mount Failed"
 echo "hdd1 red set" > /proc/mp_leds
 echo "hdd2 red set" > /proc/mp_leds
 }

USER=`/bin/awk -F: /:500:/'{print $1}' ${PASSWD}`
NOBODY=`/bin/awk -F: /^nobody:/'{print $5}' ${PASSWD}|/bin/sed 's/\ //g'`
[ "$NOBODY" == "nobody" ] || {
 bhard=`echo ${NOBODY}|/bin/awk -F, '{print $2}'|/bin/sed 's/\ //g'`
 ${XFS_QUOTA} -x -c "limit -u bsoft=${bhard}g bhard=${bhard}g 99" /home
 }

for user in ${USER}; do
 USER_UID=`/bin/awk -F: /^${user}:/'{print $3}' ${PASSWD}`
 bhard=`/bin/awk -F: /^${user}:/'{print $5}' ${PASSWD}|\
        /bin/awk -F, '{print $2}'|/bin/sed 's/\ //g'`
 [ "$bhard" == "0" ] && bhard=999999999

 ${XFS_QUOTA} -x -c "limit -u bsoft=${bhard}g bhard=${bhard}g ${USER_UID}" ${SHARE_PATH}
done

for disk in $SHARE_PATH_TREE; do
 disk=${disk##*/}
 [ "$disk" == "sdb1" ] && continue
 /etc/sysconfig/system-script/mount $disk
done

service_smb_modify_conf

for i in $Directory; do
 /bin/cp -af /tmp/ftpaccess/${i} ${SHARE_PATH}/${i}/.ftpaccess
done
/bin/rm -rf /tmp/ftpaccess

for i in $SERVICE; do
 service_${i}_start >/dev/null 2>&1 &
done
dlna_start_daemon >/dev/null 2>&1 &
$TwonkyMedia start

/bin/mkdir -p /home/PUBLIC/Media
/bin/chown nobody.nogroup /home/PUBLIC/Media
/bin/chmod 777 /home/PUBLIC/Media

/bin/udevd --daemon
/bin/logger "$0 - Drive Format Succeed"
