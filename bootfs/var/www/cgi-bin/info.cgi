#!/bin/sh
echo "Content-type: text/html"
echo ""
echo "<HTML><HEAD><TITLE>Sample CGI Output</TITLE></HEAD><BODY>"

. /usr/libexec/modules/modules.conf
SMB_HOST_CONF=/etc/sysconfig/config/smb/host.inc
IFCFG=/etc/sysconfig/network-scripts/ifcfg-eth0
VERSION=/etc/sysconfig/config/version

replaceFile=/var/www/cgi-bin/replaceFile
func=`echo ${QUERY_STRING} | cut '-d&' -f1`

case ${func} in
 GetStatusInfo)
  /bin/hostname|/bin/sed 's/\ //g'
  /bin/awk "-F = " '/workgroup/{print $2}' ${SMB_HOST_CONF}|/bin/sed 's/\ //g'
  /bin/cat $VERSION
  /bin/awk -F= /IPADDR/'{print $2}' $IFCFG|/bin/sed 's/\ //g'
  /bin/awk -F= /HWADDR/'{print $2}' $IFCFG|/bin/sed 's/\ //g'
  [ -n "`/bin/pidof smbd`" ] && echo "ON" || echo "OFF"
  [ -n "`/bin/pidof proftpd`" ] && echo "ON" || echo "OFF"
  [ -n "`/bin/pidof twonkymedia`" ] && echo "ON" || echo "OFF"
  [ -n "`/bin/pidof daapd`" ] && echo "ON" || echo "OFF"
  ;;
 GetDateTime)
  /bin/date '+%Y %m %d %H %M'|/bin/tr -d '\n'
  ;;
 setDateTime)
  now=`echo ${QUERY_STRING} | cut '-d&' -f2`
  echo "manual" > /etc/sysconfig/config/ntp.action
  date ${now}
  ;;
 syslog)
  FILE=`echo ${QUERY_STRING} | cut '-d&' -f2`
  cat /var/log/${FILE}
  ;;
 *)
  echo "Hello Mapower ${QUERY_STRING} ${REQUEST_METHOD}"
  ;;
esac

echo "</BODY></HTML>"