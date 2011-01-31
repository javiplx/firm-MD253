if(document.cookie.indexOf("CD32N:MD-253")<0){
 location.replace ('login.htm');
}

// ********************** Status Function Start ********************** //
function GetStatusInfo(){
 showBackgroundImage('wait_message'); 
 getContent('','/cgi-bin/info.cgi?GetStatusInfo','function:SystemStatus');
}

function SystemStatus(msg){
 msg = msg.split("\n");
 var data = new Array("DeviceName","GroupName","FirmwareVersion","IPAddr","MACAddr","ShareStatus","FTPStatus","DLNAStatus","iTunesStatus");
 for (i=0; i<data.length && data[i] != "" ; i++){
  if((i==5)||(i==6)||(i==7)||(i==8)){
   var str = data[i];
   eval('data['+i+']=msg['+i+']');
   if(data[i].indexOf('ON')!=-1)
    document.getElementById(str).innerHTML = showText(32);
   else
    document.getElementById(str).innerHTML = showText(33);
  } else {
   document.getElementById(data[i]).innerHTML = msg[i];
  }
 }
 parent.calcHeight('parent');
 getContent('','/cgi-bin/info.cgi?GetDateTime','function:ShowDateTime');
}

function ShowDateTime(msg){
 var datetime = msg.split("\ ");
 var year_val = datetime[0];
 if (year_val<=1970){
	now = new Date();
	month = now.getMonth()+1+"";
	month_val = (month.length<2)?("0"+month):month;
	date = now.getDate()+"";
	date_val = date;
	hour = now.getHours()+"";
	hour_val = hour;
	minutes = now.getMinutes()+"";
	minutes_val = minutes;
	year_val = now.getFullYear()+"";
  now_time=month_val+date_val+hour_val+minutes_val+year_val;
	getContent('','/cgi-bin/info.cgi?setDateTime&'+now_time,'',false);
 } else {
  var month_val = datetime[1];
  var date_val = datetime[2];
  var hour_val = datetime[3];
  var minutes_val = datetime[4];
 }
 str = year_val+' / '+month_val+' / '+date_val+' '+hour_val+':'+minutes_val;
 window.document.getElementById('Date').innerHTML = str;
 parent.calcHeight('parent');
 hiddenBackgroundImage('wait_message');
}

// ********************** Status Function End *********************** //

// ********************** LOG Function Start ********************* //

function SyslogKernel(file){
 //showBackgroundImage('wait_message');
 getContent('','/cgi-bin/info.cgi?syslog&'+file,'function:SyslogKernelShow:'+file);
}

function SyslogKernelShow(msg,file){
 msg = msg.split("\n");
 var opts = "<select size=\"20\" style=\"width:700px; color:#002055;background-color:transparent;\">";
 for (i=0; i<msg.length && msg[i] != "" ; i++){
  opts += "<option value='"+msg[i]+"'>"+msg[i]+"</option>";
 }
 opts+="</select>"
 document.getElementById("Message").innerHTML=opts;
 parent.calcHeight('parent');
 hiddenBackgroundImage('wait_message');
}

// ********************** LOG Function End *********************** //
