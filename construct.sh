#!/bin/sh

gunzip -c bootfs.bin > bootfs.img
mkdir bootfs
mount -o loop bootfs.img bootfs

rm bootfs/bin bootfs/sbin bootfs/usr/sbin
mv bootfs/usr/bin bootfs/bin
ln -s bin bootfs/sbin


unsquashfs -d rootfs filesystem.bin

mv rootfs/lib/*-0.9.29.so bootfs/usr/lib
mv rootfs/lib/ld-uClibc.so.0 rootfs/lib/libc.so.0 rootfs/lib/libcrypt.so.0 rootfs/lib/libm.so.0 \
        rootfs/lib/libdl.so.0 rootfs/lib/libnsl.so.0 rootfs/lib/libresolv.so.0 \
        rootfs/lib/libpthread.so.0 rootfs/lib/librt.so.0 rootfs/lib/libutil.so.0 \
        bootfs/usr/lib

