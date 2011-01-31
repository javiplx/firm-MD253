if(document.cookie.indexOf("CD32N:MD-253")<0){
 location.replace ('login.htm');
}

// ********************** Reboot Function Start ********************** //
function Reboot(){
 var sure = confirm(decode(showText(148)));
 if(sure)
  document.location="system_reboot.htm";
}

function Reset_2_Def(){
 var sure = confirm(decode(showText(147)));
 if(sure){
  getContent('','/cgi-bin/toolbox.cgi?Reset_2_Def','',false);
  document.location="system_reboot.htm";
 }
}
// ********************** Reboot Function End ************************* //

// ********************** Firmware Upgrade Function Start ************************ //
function DisableButton(){
 document.getElementById('DownloadFirmware').disabled=true;
}

function CheckNEW(){
 //showBackgroundImage('ShowUpLoadFile')
 showBackgroundImage('wait_message');
 getContent('','/cgi-bin/toolbox.cgi?CheckNEW',"function:showNewFirmware");
}

function showNewFirmware(msg){
 msg = msg.split("\n");
 hiddenBackgroundImage('wait_message');
 if(msg[0].indexOf('NoConnect')!=-1){
  document.getElementById('DownloadFirmware').disabled=true;
  window.document.getElementById('CheckVer').innerHTML = msg[1];
 } else if(msg[0]==""){
  document.getElementById('DownloadFirmware').disabled=true;
  window.document.getElementById('CheckVer').innerHTML = 'No new version.';
 } else {
  document.getElementById('DownloadFirmware').disabled=false;
  window.document.getElementById('CheckVer').innerHTML = 'SitecomNas v'+msg[0];
  var xmlDoc = parseXML(getContent('',"version.xml?","html",false));
  var xmlDownloadURL = getURL(xmlDoc,"url");
  window.document.getElementById('URL').innerHTML = '<INPUT id=DownLoadURL value=\"'+xmlDownloadURL+'\" type=hidden>';
 }
}

function DownloadFirmware(){
 alert(decode(showText(239)));
 showBackgroundImage('ShowUpLoadFile');
 var DownLoadURL = document.getElementById('DownLoadURL').value;
 getContent('','/cgi-bin/toolbox.cgi?DownloadFirmware&'+DownLoadURL,"function:showConfirmUpgrade");
}

function showConfirmUpgrade(msg){
 hiddenBackgroundImage('ShowUpLoadFile');
 var DownLoadURL = document.getElementById('DownLoadURL').value;
 FileName = DownLoadURL.split("\/");

 for (i=0; i<FileName.length ; i++){
  var str = '/tmp/'+FileName[i];
  if(str.indexOf('.bin')!=-1){
   ppp = str;
   break;
  }
 }

 if(msg.indexOf('NOT')!=-1)
  window.document.getElementById('CheckVer').innerHTML =  "Server returned error: HTTP/1.0 404 File download error, Please try again.";
 else
  document.location="firmware_upgrade.htm?path="+ppp;
}

function UpLoadFile(){
 var filename = document.getElementById("UploadFile").value;
 if (filename==""){
  alert(decode(showText(149)));
  return false;
 } else {
  showBackgroundImage('ShowUpLoadFile')
 }
}

function UpLoadCancel(){
 window.document.getElementById('Upload').innerHTML = '<input type=\"file\" size=\"25\" maxlength=\"31\" name=\"file\" id=\"UploadFile\" />';
}

function Decompression(){
 showBackgroundImage('Kernel_upgrade');
 getContent('','/cgi-bin/toolbox.cgi?Kernel_upgrade&'+ppp,"function:Kernel_upgrade");
}

function Kernel_upgrade(msg){
 hiddenBackgroundImage('Kernel_upgrade');
 if(msg.indexOf('finish')!=-1){
  window.document.getElementById("Kernel_upgrade").innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;OK";
  finish=1;
 } else if(msg.indexOf('error')!=-1){
  window.document.getElementById("Kernel_upgrade").innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;<font color=darkred>MD5 check error !!!</font>";
 } else {
  window.document.getElementById("Kernel_upgrade").innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;don't need upgrade";
 }
 showBackgroundImage('Bootfs_upgrade');
 getContent('','/cgi-bin/toolbox.cgi?Bootfs_upgrade&'+ppp,"function:Bootfs_upgrade");
}

function Bootfs_upgrade(msg){
 hiddenBackgroundImage('Bootfs_upgrade');
 if(msg.indexOf('finish')!=-1){
  window.document.getElementById("Bootfs_upgrade").innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;OK";
  finish=1;
 } else if(msg.indexOf('error')!=-1){
  window.document.getElementById("Bootfs_upgrade").innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;<font color=darkred>MD5 check error !!!</font>";
 } else {
  window.document.getElementById("Bootfs_upgrade").innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;don't need upgrade";
 }
 showBackgroundImage('FileSystem_upgrade');
 getContent('','/cgi-bin/toolbox.cgi?FileSystem_upgrade&'+ppp,"function:FileSystem_upgrade");
}

function FileSystem_upgrade(msg){
 hiddenBackgroundImage('FileSystem_upgrade');
 if(msg.indexOf('finish')!=-1){
  window.document.getElementById("FileSystem_upgrade").innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;OK";
  finish=1;
 } else if(msg.indexOf('error')!=-1){
  window.document.getElementById("FileSystem_upgrade").innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;<font color=darkred>MD5 check error !!!</font>";
 } else {
  window.document.getElementById("FileSystem_upgrade").innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;don't need upgrade";
 }
 if (finish==1)
  UpgradeFinish();
}

function UpgradeFinish(){
 var sure = confirm(decode(showText(150)));
 if(sure)
  document.location="system_reboot.htm";
}

function getParameter(parameterName) {
	var strQuery = location.search.substring(1);
	var paramName = parameterName + "=";
	if (strQuery.length > 0) {
		begin = strQuery.indexOf(paramName);
		if (begin != -1) {
			begin += paramName.length;
		end = strQuery.indexOf("&" , begin);
		if ( end == -1 ) end = strQuery.length
			return unescape(strQuery.substring(begin, end));
		}
		return "null";
	}
}

// ********************** Firmware Upgrade Function End ************************** //

// ********************** parseXML Function Start ************************** //

function parseXML(xmlText){
 var xmlDoc;
 try{
  xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
  xmlDoc.async="false";
  xmlDoc.loadXML(xmlText);
 }

 catch(e){
  try{
   parser=new DOMParser();
   xmlDoc=parser.parseFromString(xmlText,"text/xml");
  }
  catch(e){
   alert(e.message);
   return;
  }
 }
 return xmlDoc;
}

function getURL(xmlDoc,key){
 var _key = xmlDoc.getElementsByTagName(key)[0].firstChild.nodeValue;
 if (_key)
  return _key.Trim();
}

String.prototype.Trim = function() {
 return this.replace(/(^\s*)|(\s*$)/g,"");
}

// ********************** parseXML Function End ************************** //

