---
layout: post
title:  "Creating rootfs.tar.gz from Linux LiveCD"
---

While the user facing part of LiveCD works mostly the same across Linux distros,
the internals can be more or less different. That's why in this text I'll present
how to extract filesystem from two distributions: Debian and Fedora. That ought
to give anyone enough overview to reproduce for any other distribution.

## TL;DR

**Debian**
```
sudo mkdir /mnt/iso
sudo mount -o loop debian-live-12.1.0-amd64-standard.iso /mnt/iso
cd /mnt/iso
sudo unsquashfs -d /tmp/squashfs ./live/filesystem.squashfs
cd /tmp/squashfs
sudo tar -vzcp -f ~/rootfs.tar.gz .
sudo chown $USER:$USER ~/rootfs.tar.gz
cd ~
sudo umount /mnt/iso
sudo rmdir /mnt/iso
sudo rm -r /tmp/squashfs
```

**Fedora**
```
sudo mkdir /mnt/iso
sudo mount -o loop Fedora-Workstation-Live-x86_64-38-1.6.iso /mnt/iso
cd /mnt/iso
sudo unsquashfs -d /tmp/squashfs ./LiveOS/squashfs.img
cd /tmp/squashfs
sudo mkdir /mnt/rootfs
sudo mount -o loop LiveOS/rootfs.img /mnt/rootfs
cd /mnt/rootfs
sudo tar -vzcp -f ~/rootfs.tar.gz .
sudo chown $USER:$USER ~/rootfs.tar.gz
cd ~
sudo umount /mnt/iso
sudo umount /mnt/rootfs
sudo rmdir /mnt/iso /mnt/rootfs
sudo rm -r /tmp/squashfs
```

# Prerequisites

* Linux environment (probably any other \*nix will also do)
* `tar` program
* `unsquashfs` - usually part of [squashfs-tools](https://github.com/plougher/squashfs-tools)
                 package ([see at command-not-found.com](https://command-not-found.com/unsquashfs))
* `mount`
* `sudo` + permissions

# Step-by-step
## Get the LiveCDs

This step is self-explanatory.

As of writing those words the latest ISOs are:
  * `debian-live-12.1.0-amd64-standard.iso`
  * `Fedora-Workstation-Live-x86_64-38-1.6.iso`

## Mounting ISOs

First we need to create mountpoints:
```
$ sudo mkdir /mnt/debian
$ sudo mkdir /mnt/fedora
```
(it doesn't need to be `/mnt/iso`, you can as well use `~/foo` or something else)

The syntax for mounting an ISO file is: `mount -o loop disk1.iso /mnt/disk`

Therefore let's mount our images:
```
$ sudo mount -o loop debian-live-12.1.0-amd64-standard.iso /mnt/debian
$ sudo mount -o loop Fedora-Workstation-Live-x86_64-38-1.6.iso /mnt/fedora
```

## Finding SquashFS

```
$ find /mnt/debian -name '*squashfs*'
/mnt/debian/boot/grub/i386-efi/squash4.mod
/mnt/debian/boot/grub/x86_64-efi/squash4.mod
/mnt/debian/live/filesystem.squashfs
/mnt/debian/pool-udeb/main/l/linux-signed-amd64/squashfs-modules-6.1.0-10-amd64-di_6.1.38-1_amd64.udeb
/mnt/debian/pool-udeb/main/l/linux-signed-amd64/squashfs-modules-6.1.0-9-amd64-di_6.1.27-1_amd64.udeb
$ find /mnt/fedora -name '*squashfs*'
/mnt/fedora/boot/grub2/i386-pc/squash4.mod
/mnt/fedora/LiveOS/squashfs.img
```

As we can see, we have:
  * `/mnt/debian/live/filesystem.squashfs`
  * `/mnt/fedora/LiveOS/squashfs.img`

Those are out files of interest.

## Unsquashing

Now let's uncompress the files; I'll extract them in `$TMPDIR`
(be sure it has sufficient size or choose different location).

```
$ TMPDIR="${TMPDIR:-/tmp}"
$ sudo unsquashfs -d "$TMPDIR"/debian /mnt/debian/live/filesystem.squashfs
$ sudo unsquashfs -d "$TMPDIR"/fedora /mnt/fedora/LiveOS/squashfs.img
```

Let's have a look at what we got so far:
```
$ ls "$TMPDIR"/debian
bin@   etc/         lib@    libx32@  opt/   run/   sys/  var/
boot/  home/        lib32@  media/   proc/  sbin@  tmp/  vmlinuz@
dev/   initrd.img@  lib64@  mnt/     root/  srv/   usr/
$ ls "$TMPDIR"/fedora
LiveOS
$ ls "$TMPDIR"/fedora/LiveOS
rootfs.img
```

## Mounting (Fedora) filesystem image

As we seen in previous step, for Debian we already dug out
its filesystem, but there's only `rootfs.img` file for Fedora.
We can mount it as we did with ISOs to reach its content.

```
$ sudo mkdir /mnt/fedora_fs
$ sudo mount -o loop "$TMPDIR"/fedora/LiveOS/rootfs.img /mnt/fedora_fs
$ ls /mnt/fedora_fs
afs/  boot/  etc/   lib@    lost+found/  mnt/  proc/  run/   srv/  tmp/  var/
bin@  dev/   home/  lib64@  media/       opt/  root/  sbin@  sys/  usr/
```

## Creating tarballs

Now all that's left is just archiving the filesystems into `rootfs.tar.gz` files:

```
$ cd "$TMPDIR"/debian
$ sudo tar -vzcp -f ~/debian.tar.gz .
$ sudo chown $USER:$USER ~/debian.tar.gz
```

```
$ cd /mnt/fedora_fs
$ sudo tar -vzcp -f ~/fedora.tar.gz .
$ sudo chown $USER:$USER ~/fedora.tar.gz
```

<aside markdown="1">
You may also be interested in my [rootfs2tar](https://github.com/Jorengarenar/rootfs2tar) utility.
</aside>

## Cleanup

```
$ sudo umount /mnt/debian /mnt/fedora /mnt/fedora_fs
$ sudo rmdir /mnt/debian /mnt/fedora /mnt/fedora_fs
$ sudo rm -r "$TMPDIR"/debian "$TMPDIR"/fedora
```

# Done

Great! Now that we know how get filesystem from Linux LiveCD ISO into `rootfs.tar.gz` archive, we can use it to e.g.
[create an instance of Windows Subsystem for Linux (WSL)](https://learn.microsoft.com/en-us/windows/wsl/use-custom-distro#import-the-tar-file-into-wsl).
