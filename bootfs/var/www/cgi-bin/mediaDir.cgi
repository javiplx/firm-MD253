#!/bin/sh
echo "Content-type: text/html"
echo ""
echo "<HTML><HEAD>"
#echo "<script type=\"text/javascript\" src=\"/getlanguage.js\"></script>"
echo "<TITLE>Sample CGI Output</TITLE>"
echo "</HEAD><BODY>"
DAAP_CONF=/etc/sysconfig/config/daapd.conf
mp3_dir=`/bin/cat $DAAP_CONF|/bin/grep "^mp3_dir"|/bin/cut -c9-`
path=`echo ${QUERY_STRING} | cut '-d&' -f1`

limitpath="/home"
if [ $limitpath == $path ]; then
	targetpath=$limitpath
else
	path_len=`echo $path | wc -L`
	lastpath_len=`echo ${path} | awk -F"/" '{print $NF}' | wc -L`
	let targetpath_len=`expr $path_len-$lastpath_len-1`
	targetpath=`echo $path | cut -c-$targetpath_len`
  targetpath=`echo ${targetpath}|sed 's/\%20/\ /g'`
	echo "<a href='javascript:go(\"$targetpath\")'><img src=pictures/_up.jpg height=18 align=top border=0>&nbsp;.&nbsp;.&nbsp;</a><br>"
fi

num=0
path=`echo ${path}|sed 's/\%20/\ /g'`
MEDIA_PATH=`find "${path}" -maxdepth 1 -type d|tr " " "^"`

for i in $MEDIA_PATH; do
 i=`echo ${i}|tr "^" " "`
 [ "${i}" == "${path}" ] && continue
 [ "${i}" == "/home/.lpd" ] && continue
 [ "${i}" == "/home/BitTorrent/.btpd" ] && continue
 echo "<div class=\"spacer\">"
 echo "<div style='text-align:left;width:430px;float:left;'><span>"
 [ "$i/" == "$mp3_dir" ] && \
	  echo "<input type=checkbox id=\"subDir_$num\" value=\"$i\" name=share onClick=selectDir(this.id,this.value) checked />" ||\
	  echo "<input type=checkbox id=\"subDir_$num\" value=\"$i\" name=share onClick=selectDir(this.id,this.value) />"
 echo "</span>"

 string=${i##*/}
 echo "<span><a href='javascript:go(\"${i}\")'><img src=pictures/folder.gif height=18 align=top border=0>&nbsp;"${string}"</a></span>"
 echo "</div>"
 echo "</div>"
 num=`expr $num + 1`
done
echo "<INPUT id=num_value value=\"$num\" type=hidden>"
#echo "<script type=\"text/javascript\">parent.calcHeight('parent');</script>"
echo "</BODY></HTML>"

