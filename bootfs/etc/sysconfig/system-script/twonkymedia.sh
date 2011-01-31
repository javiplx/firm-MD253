#!/bin/sh
#
# MediaServer Control File written by Itzchak Rehberg
# Modified for fedora/redhat by Landon Bradshaw <phazeforward@gmail.com>
# Adapted to TwonkyMedia 3.0 by TwonkyVision GmbH
# Adapted to TwonkyMedia 4.0 by TwonkyVision GmbH
#
# This script is intended for SuSE and Fedora systems. Please report
# problems and suggestions at http://www.twonkyvision.de/mantis/
#
#
###############################################################################
#
### BEGIN INIT INFO
# Provides:       twonkymedia
# Required-Start: $network $remote_fs
# Default-Start:  3 5
# Default-Stop:   0 1 2 6
# Description:    TwonkyVision UPnP server
### END INIT INFO
#
# Comments to support chkconfig on RedHat/Fedora Linux
# chkconfig: 345 71 29
# description: TwonkyVision UPnP server
#
#==================================================================[ Setup ]===

WORKDIR1="/usr/local/TwonkyVision"
WORKDIR2="`dirname $0`"
PIDFILE=/var/run/twonky.pid

#=================================================================[ Script ]===

# Source function library.
if [ -f /etc/rc.status ]; then
  # SUSE
  . /etc/rc.status
  rc_reset
else
  # Reset commands if not available
  rc_status() {
    case "$1" in
	-v)
	    true
	    ;;
	*)
	    false
	    ;;
    esac
    echo
  }
  alias rc_exit=exit
fi


if [ -x "$WORKDIR1" ]; then
WORKDIR="$WORKDIR1"
else
WORKDIR="$WORKDIR2"
fi

DAEMON=twonkymedia
if [ ! -f "${WORKDIR}/${DAEMON}" ]
then
    DAEMON=twonkymusic
fi
TWONKYSRV="${WORKDIR}/${DAEMON}"

INIFILE="${WORKDIR}/twonkyvision-mediaserver.ini"

TwonkyConfigPath=/etc/sysconfig/config/twonky
/bin/df|/bin/grep "/home$" >/dev/null 2>&1
[ $? -eq 0 ] && {
 [ -d /home/PUBLIC/Media/.twonky ] || /bin/mkdir -p /home/PUBLIC/Media/.twonky

 /bin/rm -f ${TwonkyConfigPath}/twonkymedia.db
 /bin/ln -sf /home/PUBLIC/Media/.twonky ${TwonkyConfigPath}/twonkymedia.db

 /bin/rm -f ${TwonkyConfigPath}/db.info
 /bin/ln -sf /home/PUBLIC/Media/.twonky/db.info ${TwonkyConfigPath}/db.info

 /bin/rm -f ${TwonkyConfigPath}/twonkymediaserver-log.txt
 /bin/ln -sf /home/PUBLIC/Media/.twonky/twonkymediaserver-log.txt ${TwonkyConfigPath}/twonkymediaserver-log.txt
 } || {
 /bin/rm -f ${TwonkyConfigPath}/twonkymedia.db
 /bin/ln -sf /tmp/.twonky ${TwonkyConfigPath}/twonkymedia.db

 /bin/rm -f ${TwonkyConfigPath}/db.info
 /bin/ln -sf /var/log/twonky/db.info ${TwonkyConfigPath}/db.info

 /bin/rm -f ${TwonkyConfigPath}/twonkymediaserver-log.txt
 /bin/ln -sf /var/log/twonky/twonkymediaserver-log.txt ${TwonkyConfigPath}/twonkymediaserver-log.txt
 }

cd $WORKDIR

case "$1" in
  start)
    if [ -e $PIDFILE ]; then
      PID=`cat $PIDFILE`
      echo "Twonky server seems already be running under PID $PID"
      echo "(PID file $PIDFILE already exists). Checking for process..."
      running=`ps --no-headers -o "%c" -p $PID`
      if ( [ "${DAEMON}"=="${running}" ] ); then
        echo "Process IS running. Not started again."
      else
        echo "Looks like the daemon crashed: the PID does not match the daemon."
        echo "Removing flag file..."
        rm $PIDFILE
        $0 start
        exit $?
      fi
      exit 0
    else
      if [ ! -x "${TWONKYSRV}" ]; then
	  echo "Twonky servers not found".
	  rc_status -u
	  exit $?
      fi
      echo -n "Starting $TWONKYSRV ... "
      /bin/nice -n +12 $TWONKYSRV -D -inifile "${INIFILE}"
      rc_status -v
    fi
  ;;
  stop)
    if [ ! -e $PIDFILE ]; then
      echo "PID file $PIDFILE not found, stopping server anyway..."
      killall TERM twonkymedia twonkymusic
      rc_status -u
      exit 3
    else
      echo -n "Stopping Twonky MediaServer ... "
      PID=`cat $PIDFILE`
      kill TERM $PID
      rm -f $PIDFILE
      rc_status -v
    fi
  ;;
  reload)
    if [ ! -e $PIDFILE ]; then
      echo "PID file $PIDFILE not found, stopping server anyway..."
      killall TERM twonkymedia twonkymusic
      rc_status -u
      exit 3
    else
      echo -n "Reloading Twonky server ... "
      PID=`cat $PIDFILE`
      kill HUP $PID
      rc_status -v
    fi
  ;;
  restart)
    $0 stop
    $0 start
  ;;
  status)
    if [ ! -e $PIDFILE ]; then
      running="`ps ax --no-headers | grep -e twonkymedia -e twonkymusic | grep -v grep | grep -v twonkymedia.sh | cut -d ' ' -f 1`"
      if [ "${running}" == "" ]; then
        echo "No twonky server is running"
      else
        echo "A twonky server seems to be running (PID: "${running}"), but no PID file exists."
        echo "Probably no write permission for ${PIDFILE}."
      fi
      exit 0
    fi
    PID=`cat $PIDFILE`
    running=`ps --no-headers -o "%c" -p $PID`
    if ( [ "${DAEMON}"=="${running}" ] ); then
      echo "Twonky server IS running."
    else
      echo "Looks like the daemon crashed: the PID does not match the daemon."
    fi
  ;;
  *)
    echo ""
    echo "Twonky server"
    echo "-------------"
    echo "Syntax:"
    echo "  $0 {start|stop|restart|reload|status}"
    echo ""
    exit 3
  ;;
esac

rc_exit
