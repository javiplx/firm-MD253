#!/bin/sh

gunzip -c bootfs.bin > bootfs.img
mkdir bootfs
mount -o loop bootfs.img bootfs

rm bootfs/bin bootfs/sbin bootfs/usr/sbin
mv bootfs/usr/bin bootfs/bin
ln -s bin bootfs/sbin


unsquashfs -d rootfs filesystem.bin

mv bootfs/var/www/ rootfs
ln -s ../usr/www bootfs/var/www

mv rootfs/bin/hotplug bootfs/bin

mv rootfs/lib/modules bootfs/usr/lib

mv rootfs/lib/*-0.9.29.so bootfs/usr/lib
mv rootfs/lib/ld-uClibc.so.0 rootfs/lib/libc.so.0 rootfs/lib/libcrypt.so.0 rootfs/lib/libm.so.0 \
        rootfs/lib/libdl.so.0 rootfs/lib/libnsl.so.0 rootfs/lib/libresolv.so.0 \
        rootfs/lib/libpthread.so.0 rootfs/lib/librt.so.0 rootfs/lib/libutil.so.0 \
        bootfs/usr/lib

mkdir bootfs/usr/bin
ln -s bin bootfs/usr/sbin

mv rootfs/bin/busybox bootfs/usr/bin
ls -al rootfs/bin | awk 'NF==11 && $11=="busybox" { printf "mv -f rootfs/bin/%s bootfs/usr/bin\n" , $9 }' | sh

mv rootfs/bin/syslogd rootfs/bin/klogd bootfs/usr/bin
mv rootfs/bin/buttons_daemon rootfs/bin/udevd bootfs/usr/bin
mv rootfs/bin/mdadm rootfs/bin/iconv bootfs/usr/bin
mv rootfs/bin/flashcp rootfs/bin/replaceFile bootfs/usr/bin/

# At least hdparm and smartclt should be on boot image. Maybe also date, find, ntpdate, logrotate & fsck.hfsplus
# But there is no single kb free on the image

