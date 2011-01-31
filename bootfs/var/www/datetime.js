if(document.cookie.indexOf("CD32N:MD-253")<0){
 location.replace ('login.htm');
}

//Javascript name: My Date Time Picker
//Date created: 16-Nov-2003 23:19
//Scripter: TengYong Ng
//Website: http://www.rainforestnet.com
//Copyright (c) 2003 TengYong Ng
//FileName: DateTimePicker.js
//Version: 0.8
//Contact: contact@rainforestnet.com
// Note: Permission given to use this script in ANY kind of applications if
//       header lines are left unchanged.

//Global variables
var winCal;
var dtToday=new Date();
var Cal;
var docCal;
var MonthName=["January", "February", "March", "April", "May", "June", "July","August", "September", "October", "November", "December"];
//var MonthName=["一月", "二月", "三月", "四月", "五月", "六月","七月", "八月", "九月", "十月", "十一月", "十二月"];
var WeekDayName=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
//var WeekDayName=["日","一","二","三","四","五","六"];
var exDateTime;//Existing Date and Time

//Configurable parameters
var cnTop="200";//200 top coordinate of calendar window.
var cnLeft="500";//500 left coordinate of calendar window
var WindowTitle ="DateTime Picker";//Date Time Picker title.
var WeekChar=2;//number of character for week day. if 2 then Mo,Tu,We. if 3 then Mon,Tue,Wed.
var CellWidth=20;//Width of day cell.
var DateSeparator="/";//Date Separator, you can change it to "/" if you want.
var TimeMode=24;//default TimeMode value. 12 or 24

var ShowLongMonth=true;//Show long month name in Calendar header. example: "January".
var ShowMonthYear=true;//Show Month and Year in Calendar header.
var MonthYearColor="#002055";//Font Color of Month and Year in Calendar header.
var WeekHeadColor="#d7e0ef";//Background Color in Week header.
var WeekHeadFontColor="#3c5d86";//Font Color in Week header.
var SundayColor="#ffffff";//Background color of Sunday.
var SaturdayColor="#ffffff";//Background color of Saturday.
var WeekDayColor="#ffffff";//Background color of weekdays.
var FontColor="#000000";//color of font in Calendar day cell.
var TodayColor="#000000";//Background color of today.
var SelDateColor="#ffffff";//Backgrond color of selected date in textbox.
var YrSelColor="#002055";//color of font of Year selector.
var ThemeBg="transparent";//Background image of Calendar window.
//end Configurable parameters
//end Global variable

function NewCal(pCtrl,pFormat,pShowTime,pTimeMode)
{
	Cal=new Calendar(dtToday);
	if ((pShowTime!=null) && (pShowTime))
	{
		Cal.ShowTime=true;
		if ((pTimeMode!=null) &&((pTimeMode=='12')||(pTimeMode=='24')))
		{
			TimeMode=pTimeMode;
		}
	}
	if (pCtrl!=null)
		Cal.Ctrl=pCtrl;
	if (pFormat!=null)
		Cal.Format=pFormat.toUpperCase();

	exDateTime=document.getElementById(pCtrl).value;

	if (exDateTime!="")//Parse Date String
	{
		var Sp1;//Index of Date Separator 1
		var Sp2;//Index of Date Separator 2
		var tSp1;//Index of Time Separator 1
		var tSp1;//Index of Time Separator 2
		var strMonth;
		var strDate;
		var strYear;
		var intMonth;
		var YearPattern;
		var strHour;
		var strMinute;
		var strSecond;
		//parse month
/*		Sp1=exDateTime.indexOf(DateSeparator,0)
		Sp2=exDateTime.indexOf(DateSeparator,(parseInt(Sp1)+1));
		if ((Cal.Format.toUpperCase()=="DDMMYYYY") || (Cal.Format.toUpperCase()=="DDMMMYYYY"))
		{
			strMonth=exDateTime.substring(Sp1+1,Sp2);
			strDate=exDateTime.substring(0,Sp1);
		}
		else if ((Cal.Format.toUpperCase()=="MMDDYYYY") || (Cal.Format.toUpperCase()=="MMMDDYYYY"))
		{
			strMonth=exDateTime.substring(0,Sp1);
			strDate=exDateTime.substring(Sp1+1,Sp2);
		}
*/
// modify by kpc beg
		Sp1=exDateTime.indexOf(DateSeparator,0)
		Sp2=exDateTime.indexOf(DateSeparator,(parseInt(Sp1)+1));
		strYear=exDateTime.substring(0,Sp1);
		strMonth=exDateTime.substring(Sp1+1,Sp2);
		strDate=exDateTime.substring(Sp2+1,Sp2+5);
// modify by kpc end

		if (isNaN(strMonth))
			intMonth=Cal.GetMonthIndex(strMonth);
		else
			intMonth=parseInt(strMonth,10)-1;
		if ((parseInt(intMonth,10)>=0) && (parseInt(intMonth,10)<12))
			Cal.Month=intMonth;
		//end parse month
		//parse Date
		if ((parseInt(strDate,10)<=Cal.GetMonDays()) && (parseInt(strDate,10)>=1))
			Cal.Date=strDate;
		//end parse Date
		//parse year
//		strYear=exDateTime.substring(Sp2+1,Sp2+5);  稍上面kpc處已取得
		YearPattern=/^\d{4}$/;
		if (YearPattern.test(strYear))
			Cal.Year=parseInt(strYear,10);
		//end parse year
		//parse time
		if (Cal.ShowTime==true)
		{
			tSp1=exDateTime.indexOf(":",0)
			tSp2=exDateTime.indexOf(":",(parseInt(tSp1)+1));
			strHour=exDateTime.substring(tSp1,(tSp1)-2);
			Cal.SetHour(strHour);
			strMinute=exDateTime.substring(tSp1+1,tSp2);
			Cal.SetMinute(strMinute);
			strSecond=exDateTime.substring(tSp2+1,tSp2+3);
			Cal.SetSecond(strSecond);
		}
	}
	winCal=window.open("","DateTimePicker","toolbar=no,status=no,menubar=no,fullscreen=no,location=no,directories=no,scrollbars=no,resizable=no,width=195,height=245,resizable=0,top="+cnTop+",left="+cnLeft);
	docCal=winCal.document;
	RenderCal();
}

function RenderCal()
{
	var vCalHeader;
	var vCalData;
	var vCalTime;
	var i;
	var j;
	var SelectStr;
	var vDayCount=0;
	var vFirstDay;

	docCal.open();
	docCal.writeln("<html><head><title>"+WindowTitle+"</title>");
	docCal.writeln("<script>var winMain=window.opener;</script>");
	docCal.writeln("</head><body background='"+ThemeBg+"' link="+FontColor+" vlink="+FontColor+"><form name='Calendar'>");

	vCalHeader="<table border=0 cellpadding=3 cellspacing=1 width='100%' align=\"center\" valign=\"top\">\n";
	//Month Selector
	vCalHeader+="<tr>\n<td colspan='7'><table border=0 width='100%' cellpadding=0 cellspacing=0><tr><td align='left'>\n";
	vCalHeader+="<select name=\"MonthSelector\" onChange=\"javascript:winMain.Cal.SwitchMth(this.selectedIndex);winMain.RenderCal();\">\n";
	for (i=0;i<12;i++)
	{
		if (i==Cal.Month)
			SelectStr="Selected";
		else
			SelectStr="";
		vCalHeader+="<option "+SelectStr+" value >"+MonthName[i]+"\n";
	}
	vCalHeader+="</select></td>";
	//Year selector
	vCalHeader+="\n<td align='right'><a href=\"javascript:winMain.Cal.DecYear();winMain.RenderCal()\"><b><font color=\""+YrSelColor+"\"><</font></b></a><font face=\"Verdana\" color=\""+YrSelColor+"\" size=2><b> "+Cal.Year+" </b></font><a href=\"javascript:winMain.Cal.IncYear();winMain.RenderCal()\"><b><font color=\""+YrSelColor+"\">></font></b></a></td></tr></table></td>\n";
	vCalHeader+="</tr>";
	//Calendar header shows Month and Year
	if (ShowMonthYear)
		vCalHeader+="<tr><td colspan='7'><font face='Verdana' size='2' align='center' color='"+MonthYearColor+"'><b>"+Cal.GetMonthName(ShowLongMonth)+" "+Cal.Year+"</b></font></td></tr>\n";
	//Week day header
	vCalHeader+="<tr bgcolor="+WeekHeadColor+" style=\"color:"+WeekHeadFontColor+"\">";
	for (i=0;i<7;i++)
	{
		vCalHeader+="<td align='center'><font face='Verdana' size='2'>"+WeekDayName[i].substr(0,WeekChar)+"</font></td>";
	}
	vCalHeader+="</tr>";
	docCal.write(vCalHeader);

	//Calendar detail
	CalDate=new Date(Cal.Year,Cal.Month);
	CalDate.setDate(1);
	vFirstDay=CalDate.getDay();
	vCalData="<tr>";
	for (i=0;i<vFirstDay;i++)
	{
		vCalData=vCalData+GenCell();
		vDayCount=vDayCount+1;
	}
	for (j=1;j<=Cal.GetMonDays();j++)
	{
		var strCell;
		vDayCount=vDayCount+1;
		if ((j==dtToday.getDate())&&(Cal.Month==dtToday.getMonth())&&(Cal.Year==dtToday.getFullYear()))
			strCell=GenCell(j,true,TodayColor);//Highlight today's date
		else
		{
			if (j==Cal.Date)
			{
				strCell=GenCell(j,true,SelDateColor);
			}
			else
			{
				if (vDayCount%7==0)
					strCell=GenCell(j,false,SaturdayColor);
				else if ((vDayCount+6)%7==0)
					strCell=GenCell(j,false,SundayColor);
				else
					strCell=GenCell(j,null,WeekDayColor);
			}
		}
		vCalData=vCalData+strCell;

		if((vDayCount%7==0)&&(j<Cal.GetMonDays()))
		{
			vCalData=vCalData+"</tr>\n<tr>";
		}
	}
	docCal.writeln(vCalData);
	//Time picker
	if (Cal.ShowTime)
	{
		var showHour;
		showHour=Cal.getShowHour();
		vCalTime="<tr>\n<td colspan='7' align='center'>";
		vCalTime+="<input type='text' name='hour' maxlength=2 size=1 style=\"WIDTH: 22px\" value="+showHour+" onchange=\"javascript:winMain.Cal.SetHour(this.value)\">";
		vCalTime+=" : ";
		vCalTime+="<input type='text' name='minute' maxlength=2 size=1 style=\"WIDTH: 22px\" value="+Cal.Minutes+" onchange=\"javascript:winMain.Cal.SetMinute(this.value)\">";
		vCalTime+=" : ";
		vCalTime+="<input type='text' name='second' maxlength=2 size=1 style=\"WIDTH: 22px\" value="+Cal.Seconds+" onchange=\"javascript:winMain.Cal.SetSecond(this.value)\">";
		if (TimeMode==12)
		{
			var SelectAm =(parseInt(Cal.Hours,10)<12)? "Selected":"";
			var SelectPm =(parseInt(Cal.Hours,10)>=12)? "Selected":"";

			vCalTime+="<select name=\"ampm\" onchange=\"javascript:winMain.Cal.SetAmPm(this.options[this.selectedIndex].value);\">";
			vCalTime+="<option "+SelectAm+" value=\"AM\">AM</option>";
			vCalTime+="<option "+SelectPm+" value=\"PM\">PM<option>";
			vCalTime+="</select>";
		}
		vCalTime+="\n</td>\n</tr>";
		docCal.write(vCalTime);
	}
	//end time picker
	docCal.writeln("\n</table>");
	docCal.writeln("</form><script language='javascript'>self.focus();</script></body></html>");
	docCal.close();
}

function GenCell(pValue,pHighLight,pColor)//Generate table cell with value
{
	var PValue;
	var PCellStr;
	var vColor;
	var vHLstr1;//HighLight string
	var vHlstr2;
	var vTimeStr;

	if (pValue==null)
		PValue="";
	else
		PValue=pValue;

	if (pColor!=null)
		vColor="bgcolor=\""+pColor+"\"";
	else
		vColor="";
	if ((pHighLight!=null)&&(pHighLight))
		{vHLstr1= "color='#002055'><b>";vHLstr2="</b>";}
	else
		{vHLstr1=">";vHLstr2="";}

	if (Cal.ShowTime)
	{
		vTimeStr="winMain.document.getElementById('"+Cal.Ctrl+"').value+=' '+"+"winMain.Cal.getShowHour()"+"+':'+"+"winMain.Cal.Minutes"+"+':'+"+"winMain.Cal.Seconds";
		if (TimeMode==12)
			vTimeStr+="+' '+winMain.Cal.AMorPM";
	}
	else
		vTimeStr="";
	PCellStr="<td "+vColor+" width="+CellWidth+" align='center'><font face='verdana' size='2'"+vHLstr1+"<a href=\"javascript:winMain.document.getElementById('"+Cal.Ctrl+"').value='"+Cal.FormatDate(PValue)+"';"+vTimeStr+";window.close();\">"+PValue+"</a>"+vHLstr2+"</font></td>";
	return PCellStr;
}

function Calendar(pDate,pCtrl)
{
	//Properties
	this.Date=pDate.getDate();//selected date
	this.Month=pDate.getMonth();//selected month number
	this.Year=pDate.getFullYear();//selected year in 4 digits
	this.Hours=pDate.getHours();

	if (pDate.getMinutes()<10)
		this.Minutes="0"+pDate.getMinutes();
	else
		this.Minutes=pDate.getMinutes();

	if (pDate.getSeconds()<10)
		this.Seconds="0"+pDate.getSeconds();
	else
		this.Seconds=pDate.getSeconds();

	this.MyWindow=winCal;
	this.Ctrl=pCtrl;
	this.Format="ddMMyyyy";
	this.Separator=DateSeparator;
	this.ShowTime=false;
	if (pDate.getHours()<12)
		this.AMorPM="AM";
	else
		this.AMorPM="PM";
}

function GetMonthIndex(shortMonthName)
{
	for (i=0;i<12;i++)
	{
		if (MonthName[i].substring(0,3).toUpperCase()==shortMonthName.toUpperCase())
		{	return i;}
	}
}
Calendar.prototype.GetMonthIndex=GetMonthIndex;

function IncYear()
{	Cal.Year++;}
Calendar.prototype.IncYear=IncYear;

function DecYear()
{	Cal.Year--;}
Calendar.prototype.DecYear=DecYear;

function SwitchMth(intMth)
{	Cal.Month=intMth;}
Calendar.prototype.SwitchMth=SwitchMth;

function SetHour(intHour)
{
	var MaxHour;
	var MinHour;
	if (TimeMode==24)
	{	MaxHour=23;MinHour=0}
	else if (TimeMode==12)
	{	MaxHour=12;MinHour=1}
	else
		alert("TimeMode can only be 12 or 24");
	var HourExp=new RegExp("^\\d\\d$");
	if (HourExp.test(intHour) && (parseInt(intHour,10)<=MaxHour) && (parseInt(intHour,10)>=MinHour))
	{
		if ((TimeMode==12) && (Cal.AMorPM=="PM"))
		{
			if (parseInt(intHour,10)==12)
				Cal.Hours=12;
			else
				Cal.Hours=parseInt(intHour,10)+12;
		}
		else if ((TimeMode==12) && (Cal.AMorPM=="AM"))
		{
			if (intHour==12)
				intHour-=12;
			Cal.Hours=parseInt(intHour,10);
		}
		else if (TimeMode==24)
			Cal.Hours=parseInt(intHour,10);
	}
}
Calendar.prototype.SetHour=SetHour;

function SetMinute(intMin)
{
	var MinExp=new RegExp("^\\d\\d$");
	if (MinExp.test(intMin) && (intMin<60))
		Cal.Minutes=intMin;
}
Calendar.prototype.SetMinute=SetMinute;

function SetSecond(intSec)
{
	var SecExp=new RegExp("^\\d\\d$");
	if (SecExp.test(intSec) && (intSec<60))
		Cal.Seconds=intSec;
}
Calendar.prototype.SetSecond=SetSecond;

function SetAmPm(pvalue)
{
	this.AMorPM=pvalue;
	if (pvalue=="PM")
	{
		this.Hours=(parseInt(this.Hours,10))+12;
		if (this.Hours==24)
			this.Hours=12;
	}
	else if (pvalue=="AM")
		this.Hours-=12;
}
Calendar.prototype.SetAmPm=SetAmPm;

function getShowHour()
{
	var finalHour;
    if (TimeMode==12)
    {
    	if (parseInt(this.Hours,10)==0)
		{
			this.AMorPM="AM";
			finalHour=parseInt(this.Hours,10)+12;
		}
		else if (parseInt(this.Hours,10)==12)
		{
			this.AMorPM="PM";
			finalHour=12;
		}
		else if (this.Hours>12)
		{
			this.AMorPM="PM";
			if ((this.Hours-12)<10)
				finalHour="0"+((parseInt(this.Hours,10))-12);
			else
				finalHour=parseInt(this.Hours,10)-12;
		}
		else
		{
			this.AMorPM="AM";
			if (this.Hours<10)
				finalHour="0"+parseInt(this.Hours,10);
			else
				finalHour=this.Hours;
		}
	}
	else if (TimeMode==24)
	{
		if (this.Hours<10)
			finalHour="0"+parseInt(this.Hours,10);
		else
			finalHour=this.Hours;
	}
	return finalHour;
}
Calendar.prototype.getShowHour=getShowHour;

function GetMonthName(IsLong)
{
	var Month=MonthName[this.Month];
	if (IsLong)
		return Month;
	else
		return Month.substr(0,3);
}
Calendar.prototype.GetMonthName=GetMonthName;

function GetMonDays()//Get number of days in a month
{
	var DaysInMonth=[31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	if (this.IsLeapYear())
	{
		DaysInMonth[1]=29;
	}
	return DaysInMonth[this.Month];
}
Calendar.prototype.GetMonDays=GetMonDays;

function IsLeapYear()
{
	if ((this.Year%4)==0)
	{
		if ((this.Year%100==0) && (this.Year%400)!=0)
		{
			return false;
		}
		else
		{
			return true;
		}
	}
	else
	{
		return false;
	}
}
Calendar.prototype.IsLeapYear=IsLeapYear;

function FormatDate(pDate)
{
	//by kpc
	kpcMonth = this.Month + 1;
	kpcDate = pDate;
	if (kpcMonth < 10) kpcMonth = "0" + kpcMonth;
	if (kpcDate < 10) kpcDate = "0" + kpcDate;

	if (this.Format.toUpperCase()=="DDMMYYYY")
		return (kpcDate+DateSeparator+kpcMonth+DateSeparator+this.Year);
	else if (this.Format.toUpperCase()=="DDMMMYYYY")
		return (pDate+DateSeparator+this.GetMonthName(false)+DateSeparator+this.Year);
	else if (this.Format.toUpperCase()=="MMDDYYYY")
		return (kpcMonth+DateSeparator+kpcDate+DateSeparator+this.Year);
else if (this.Format.toUpperCase()=="YYYYMMDD")	// by kpc
		return (this.Year+DateSeparator+kpcMonth+DateSeparator+kpcDate);
	else if (this.Format.toUpperCase()=="MMMDDYYYY")
		return (this.GetMonthName(false)+DateSeparator+pDate+DateSeparator+this.Year);
}
Calendar.prototype.FormatDate=FormatDate;

//*********************** Date /Time Function Start ***********************//
function NTPAction(){
 showBackgroundImage('wait_message');
 getContent('','/cgi-bin/setup.cgi?gmtconf','function:ShowGMTConfig');
}

function ShowGMTConfig(msg){
 getContent('','/cgi-bin/setup.cgi?tzinfo','function:ShowTZInfo:'+msg);
}

function ShowTZInfo(msg,gmtconf){
 tzinfo_data = msg.split("\n");
 var tzinfo = window.document.getElementById('tzinfo');
 start = '<select id="tzselect">';
 end = '</select>';
 var x = 0;
 var y = 0;
 for (i=0; i<tzinfo_data.length && tzinfo_data[i] != ""; i++){
  gmt_data = tzinfo_data[i].split("\#");
  x=parseInt(i)-12;
  if (x==gmtconf)
   select = '<option value='+x+' selected>'+gmt_data[1]+'</option>';
  else
   select = '<option value='+x+'>'+gmt_data[1]+'</option>';

  start += select;
 }
 start += end;
 tzinfo.innerHTML = start;
 getContent('','/cgi-bin/setup.cgi?datetime','function:ShowDateTime');
}

function ShowDateTime(msg){
 var datetime = msg.split("\ ");

 var year_val = datetime[0];
 var month_val = datetime[1];
 var date_val = datetime[2];
 var date=window.document.getElementById('date');
 date.innerHTML = '<input type="text" id="date_end_query" size=7 readonly value='+date_val+'/'+month_val+'/'+year_val+' />';

 var hour_val = datetime[3];
 var minute_val = datetime[4];
 var data = new Array("hour","minute");

 for (i=0; i<data.length && data[i] != "" ; i++){
  var insert=window.document.getElementById(data[i]);
  var start = '<select id=' + data[i] + 'select>';
  var end = '</select>';

  if (data[i]=='hour')
   var x=24;
  else
   var x=60;

  eval('time='+data[i]+'_val');
  for (v=0; v<x; v++){
   if (v==time){
    select = '<option value='+(v<10?"0":"")+v+' selected>'+(v<10?"0":"")+v+'</option>';
   } else {
    select = '<option value='+(v<10?"0":"")+v+'>'+(v<10?"0":"")+v+'</option>';
   }
   start += select;
  }
  start += end;
  insert.innerHTML = start;
 }
 var ntpconf = getContent("","/cgi-bin/setup.cgi?ntpconf","return",false);
 getContent('','/cgi-bin/setup.cgi?ntpserver','function:ShowNTPServer:'+ntpconf);
}

function ShowNTPServer(msg,ntpconf){
 var ntpserver = msg.split("\n");
 window.document.getElementById('ntpconf').innerHTML = '<input type=hidden size=15 readonly id=ntp value=\"' + ntpconf + '\" />';

 var ntpserver_data = window.document.getElementById('ntpselect');
 start = '<select id=\"ntp_select\" onChange=\"SelectChange(this.value)\" >';
 end = '</select>';
 for (i=0; i<ntpserver.length && ntpserver[i] != ""; i++){
  if (ntpserver[i]==ntpconf)
   select = '<option value='+ntpserver[i]+' selected>'+ntpserver[i]+'</option>';
  else
   select = '<option value='+ntpserver[i]+'>'+ntpserver[i]+'</option>';

  start += select;
 }
 start += end;
 ntpserver_data.innerHTML = start;
 getContent('','/cgi-bin/setup.cgi?ntp_action','function:ShowNTPSetting');
}

function ShowNTPSetting(msg){
 if(msg.indexOf("auto") != -1){
  document.getElementById("auto_config").checked=true;
  document.getElementById("manual_config").checked=false;
  id = 'auto_config';
 } else {
  document.getElementById("manual_config").checked=true;
  document.getElementById("auto_config").checked=false;
  id = 'manual_config';
 }
 DateSettingMode(id);
 hiddenBackgroundImage('wait_message');
}

function OnChgNTPStatus(id){
 if(id.indexOf('auto_config')!=-1){
  document.getElementById("auto_config").checked=true;
  document.getElementById("manual_config").checked=false;
 } else {
  document.getElementById("manual_config").checked=true;
  document.getElementById("auto_config").checked=false;
 }
 DateSettingMode(id);
}

function DateSettingMode(mode){
 if(mode.indexOf('auto_config')!=-1){
  ChgSettingMode('Manual','Disable');
  ChgSettingMode('Auto','Enable');
 } else {
  ChgSettingMode('Auto','Disable');
  ChgSettingMode('Manual','Enable');
 }
}

function ChgSettingMode(id,mode){
 if(id.indexOf('Auto')!=-1)
  var data = new Array("ntp_select","tzselect","AddNTPServer","DelNTPServer","ntp_text");
 else
  var data = new Array("hourselect","minuteselect","ChgManualDateStatus");

 for (i=0; i<data.length && data[i] != "" ; i++){
  if(mode.indexOf('Enable')!=-1)
   document.getElementById(data[i]).disabled=false;
  else
   document.getElementById(data[i]).disabled=true;
 }
}

function SelectChange(value) {
 var ntp=window.document.getElementById('ntpconf');
 ntp.innerHTML = '<input type=hidden size=15 readonly id=ntp value=\"' + value + '\" />';
 window.document.getElementById('ntp_text').value = value;
}

function NTPAdd(){
 var ntp=document.getElementById("ntp_select");
 var ntp_value=document.getElementById("ntp_text").value;

 if(SelectIsExitItem(ntp, ntp_value))
  alert(decode(showText(134)));
 else if(ntp_value=="")
  alert(decode(showText(135)));
 else if (! Check_Data(ntp_value)){
  alert(decode(showText(152)));
  setTimeout(function(){document.getElementById("ntp_text").focus();document.getElementById("ntp_text").select();},10);
  return false;
 } else {
  ntp.options[ntp.length]=new Option(ntp_value,ntp_value);
  ntp.options[ntp.length-1].selected = true;
  SelectChange(ntp_value);
  showBackgroundImage('wait_message');
  getContent('','/cgi-bin/setup.cgi?AddNTPServer&'+ntp_value,'function:ShowModify:Add');
 }
}

function NTPDel(){
 var ntp=document.getElementById("ntp_select");
 var ntp_value=document.getElementById("ntp_text").value;
 var isDel=false;

 for (var i = 0; i < ntp.options.length; i++) {
  if (ntp.options[i].value == ntp_value) {
   ntp.remove(i);
   isDel=true;
   showBackgroundImage('wait_message');
   getContent('','/cgi-bin/setup.cgi?DelNTPServer&'+ntp_value,'function:ShowModify:Del');
   break;
  }
 }

 if(!isDel)
  alert(decode(showText(136)));
}

function SelectIsExitItem(objSelect, objItemValue) {
 var isExit = false;
 for (var i = 0; i < objSelect.options.length; i++) {
  if (objSelect.options[i].value == objItemValue) {
   isExit = true;
   break;
  }
 }
 return isExit;
}

function Check_Data(value){
 var reg=/^[\w-.]+$/g
 var error = value.match(reg);
 if (error == null){
  return false;
 }
 return true;
}

function ChgDateStatus(){
 if (document.getElementById('manual_config').checked==true)
  var ntp_action = 'manual';
 else
  var ntp_action = 'auto';

 var ntpconf = document.getElementById("ntp").value;
 var tzinfo = document.getElementById("tzselect").value;
 var fulldate = document.getElementById("date_end_query").value;
 fulldate = fulldate.split("\/");
 var date=fulldate[0];
 var month=fulldate[1];
 var year=fulldate[2];
 var hour = document.getElementById("hourselect").value;
 var minute = document.getElementById("minuteselect").value;
 var str = month + date + hour + minute + year;
 showBackgroundImage('wait_message');
 getContent('','/cgi-bin/setup.cgi?ChgDateStatus&'+ntp_action+'&'+ntpconf+'&'+tzinfo+'&'+str,"function:ShowChgDateStatus:"+ntpconf);
}

function ShowModify(msg,action){
 if(action.indexOf('Add')!=-1){
 	document.getElementById("ntp_text").value = '';
 	hiddenBackgroundImage('wait_message');
 } else
 	location.replace ('setup_date.htm');
}

function ShowChgDateStatus(msg,ntpconf){
 hiddenBackgroundImage('wait_message');
 if (document.getElementById('auto_config').checked==true){
  if(msg.indexOf("no server") != -1)
   alert(decode(showText(230))+' '+ntpconf+'\n'+decode(showText(231)));
  else
   msg = "";
 }
 //location.replace ('setup_date.htm');
 NTPAction();

}
//*********************** Date /Time Function End *************************//
