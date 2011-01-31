if(document.cookie.indexOf("CD32N:MD-253")<0){
 location.replace ('login.htm');
}

// ********************** iTunes Function Start ********************** //
function iTuneStatus(){
 showBackgroundImage('wait_message');
 getContent('','/cgi-bin/services.cgi?iTuneStatus',"function:ShowiTuneStatus");
}

function ShowiTuneStatus(msg){
 window.document.getElementById('Old_Status').innerHTML = '<INPUT id=\"Old_Status_value\" value=\"'+msg+'\" type=hidden>';
 if(msg.indexOf("ON") != -1){
  document.getElementById("status_enable").checked=true;
  document.getElementById("status_disable").checked=false;
 } else {
  document.getElementById("status_enable").checked=false;
  document.getElementById("status_disable").checked=true;
 }
 window.document.getElementById('Value_1').innerHTML = '<INPUT id=Old_Value value=0 type=hidden>';
 getContent('','/cgi-bin/services.cgi?DiskStatus',"function:iTunesFolderControl");
}

function iTunesFolderControl(msg){
 var data = new Array("status_enable","status_disable","iTuneChangeBtn","StopScanBtn");
 for (i=0; i<data.length && data[i] != "" ; i++){
  if(msg.indexOf('NoDisk')!=-1)
   document.getElementById(data[i]).disabled=true;
  else
   document.getElementById(data[i]).disabled=false;
 }

 if(msg.indexOf('NoDisk')!=-1)
  hiddenBackgroundImage('wait_message');
 else
  getContent('','/cgi-bin/services.cgi?MusicFolder',"function:ShowMusicFolder");

}

function ShowMusicFolder(msg){
 path = msg.split("\n");
 window.document.getElementById('share_folder').innerHTML = '<b>'+path[0]+'</b>';
 hiddenBackgroundImage('wait_message');
 if(path[1].indexOf("None")!=-1){
  go('/home');
 } else {
  go('/home'+path[1]);
 }
}

function go(ppp){
 var str="";
 var ppp_length=ppp.length;
 var now_path = ppp.substr(5,4096);
 if(ppp_length<=8)
  str='/';

 window.document.getElementById('now_path').innerHTML = '<b>'+showText(191)+'&nbsp;'+str+now_path+'</b><INPUT id=now_path_value value=\"'+str+now_path+'\" type=hidden>';
 //window.document.getElementById('now_path').innerHTML = '<b>'+getWord("itune_now_path")+'&nbsp;'+str+now_path+'</b>';
 getContent('DirList','/cgi-bin/mediaDir.cgi?'+ppp);
 //getContent('','/cgi-bin/mediaDir.cgi?'+ppp,"function:ListSubDir");
 //parent.calcHeight('parent');
 Detected_UnderScan_First();
}

function ListSubDir(msg){
 window.document.getElementById('DirList').innerHTML = msg;
 parent.calcHeight('parent');
 //Detected_UnderScan_First();
 //var iTune_state = document.getElementById('Old_Status_value').value;
 //if(iTune_state.indexOf("ON") != -1){
 // showBackgroundImage('wait_message');
 // UnderScan();
 //}

}

function OnChgiTuneStatus(id){
 if(id.indexOf('status_enable')!=-1){
  path = getContent("","/cgi-bin/services.cgi?MusicFolder","return",false);
  if(path.indexOf("None")!=-1){
   alert(decode(showText(192)));
  } else {
   document.getElementById("status_enable").checked=true;
   document.getElementById("status_disable").checked=false;
  }
 } else {
  document.getElementById("status_disable").checked=true;
  document.getElementById("status_enable").checked=false;
 }
}

function iTuneChange(){
 var iTune_state = document.getElementById('Old_Status_value').value;
 var Now_Status = getContent("","/cgi-bin/services.cgi?iTuneStatus","return",false);
 if (document.getElementById('status_enable').checked==true){
  if(confirm(showText(194)+'\n'+showText(195))){
   var status='Enable';
   var Old_Status_value = 'ON';
  } else {
   if(iTune_state.indexOf("OFF") != -1){
    document.getElementById("status_enable").checked=false;
    document.getElementById("status_disable").checked=true;
   }
   return;
  }
 } else {
  //if(confirm(getWord("message_itune_folder_disable"))){
   var status='Disable';
   var Old_Status_value = 'OFF';
  //} else {
   //if(iTune_state.indexOf("ON") != -1){
    //window.document.getElementById('Now_Status').innerHTML = '<input type="radio" id="status_enable" onClick="OnChgiTuneStatus(this.id)" />&nbsp;'+getWord("ftp_enable")+'&nbsp;<input type="radio" id="status_disable" onClick="OnChgiTuneStatus(this.id)" />&nbsp;'+getWord("ftp_disable");
    //document.getElementById("status_enable").checked=true;
    //document.getElementById("status_disable").checked=false;
   //}
   //return;
  //}
 }
 window.document.getElementById('Old_Status').innerHTML = '<INPUT id=Old_Status_value value=\"'+Old_Status_value+'\" type=hidden>';
 showBackgroundImage('ShowiTune');
 getContent('','/cgi-bin/services.cgi?ChgiTuneStatus&'+status,"function:showiTuneMessage");
}

function selectDir(id,value){
 var old_Select = "";
 var num = document.getElementById('num_value').value;
 for (x=0; x<num; x++){
  if(("subDir_"+x)!=(id)){
   if (document.getElementById("subDir_"+x).checked==true){
    document.getElementById("subDir_"+x).checked=false;
    old_Select = "subDir_"+x;
   }
  }
 }

 //var multi=/^[\w\s-\/.]+$/g
 var multi=/^[\w\s-\/.\[\]{}()`~!@$%\'+,;=]+$/
 if (!multi.test(value)){
  alert(decode(showText(176)));
  document.getElementById(id).checked=false;

  if(old_Select != "")
   document.getElementById(old_Select).checked=true;

  return false;
 }

 var now_path = document.getElementById('now_path_value').value;
 if(document.getElementById(id).checked==true){
  if(confirm(showText(194)+'\n'+showText(195))){
   showBackgroundImage('ShowiTune');
   window.document.getElementById('Old_Status').innerHTML = '<INPUT id=Old_Status_value value=ON type=hidden>';
   getContent('','/cgi-bin/services.cgi?mp3_dir&'+value,"function:showMediaMessage:"+now_path);
  } else {
   if(old_Select != "")
    document.getElementById(old_Select).checked=true;

   document.getElementById(id).checked=false;
  }
 } else {
  //if(confirm(getWord("message_itune_folder_disable"))){
   showBackgroundImage('ShowiTune');
   window.document.getElementById('Old_Status').innerHTML = '<INPUT id=Old_Status_value value=OFF type=hidden>';
   getContent('','/cgi-bin/services.cgi?mp3_dir&'+value,"function:showMediaMessage:"+now_path);
  //} else {
   //document.getElementById(id).checked=true;
  //}
 }
}

function stop_scan(){
 if (document.getElementById('status_enable').checked==false){
  return;
 } else {
  if(confirm(showText(196)+'\n'+showText(197))){
   window.document.getElementById('Old_Status').innerHTML = '<INPUT id=Old_Status_value value=OFF type=hidden>';
   showBackgroundImage('ShowiTune');
   getContent('','/cgi-bin/services.cgi?stop_scan',"function:showMediaMessage:stop");

   var num = document.getElementById('num_value').value;
   for (x=0; x<num; x++){
    if (document.getElementById("subDir_"+x).checked==true)
     document.getElementById("subDir_"+x).checked=false;
   }
  }
 }
}

function showMediaMessage(msg,now_path){
 var iTune_state = document.getElementById('Old_Status_value').value;
 if(iTune_state.indexOf("ON")!=-1){
  document.getElementById("status_enable").checked=true;
  document.getElementById("status_disable").checked=false;
  window.document.getElementById('under_scan').innerHTML = '<b>'+showText(198)+'</b>';
  UnderScan();
 } else {
 	window.document.getElementById('under_scan').innerHTML = "";
 	hiddenBackgroundImage('ShowiTune');
  document.getElementById("status_enable").checked=false;
  document.getElementById("status_disable").checked=true;
 }
 path = getContent("","/cgi-bin/services.cgi?MusicFolder","return",false);
 path = path.split("\n");
 window.document.getElementById('share_folder').innerHTML = '<b>'+path[0]+'</b>';
 return;
}

function showiTuneMessage(){
 var iTune_state = document.getElementById('Old_Status_value').value;
 if(iTune_state.indexOf("ON") != -1){
  document.getElementById("status_enable").checked=true;
  document.getElementById("status_disable").checked=false;
  window.document.getElementById('under_scan').innerHTML = '<b>'+showText(198)+'</b>';
  UnderScan();
 } else {
  document.getElementById("status_enable").checked=false;
  document.getElementById("status_disable").checked=true;
  window.document.getElementById('under_scan').innerHTML = "";
  hiddenBackgroundImage('ShowiTune');
  return;
 }
}

function Detected_UnderScan_First(){
 var iTune_state = document.getElementById('Old_Status_value').value;
 if(iTune_state.indexOf("ON") != -1)
  getContent('','/cgi-bin/services.cgi?Detected_UnderScan_First',"function:Detected_UnderScan");
 else
  return;
 parent.calcHeight('parent');
}

function Detected_UnderScan(msg){
 var Detected_Value;
 if(msg.indexOf("Scaning")!=-1){
  showBackgroundImage('ShowiTune');
  window.document.getElementById('under_scan').innerHTML = '<b>'+showText(198)+'</b>';
  UnderScan();
 } else {
  return;
 }
}

function UnderScan(){
 getContent('','/cgi-bin/services.cgi?Detected_Value',"function:UnderScanMessage");
}

function UnderScanMessage(msg){
 var Value_1 = parseInt(document.getElementById('Old_Value').value);
 var Value_2 = parseInt(msg);

 if(Value_1!=Value_2){
  Value_1 = Value_2;

  var iTune_state = document.getElementById('Old_Status_value').value;
  if(iTune_state.indexOf("ON") != -1){
   showBackgroundImage('ShowiTune');
   window.document.getElementById('under_scan').innerHTML = '<b>'+showText(198)+'</b>';
 	 window.document.getElementById('Value_1').innerHTML = '<INPUT id=Old_Value value=\"'+Value_1+'\" type=hidden>';
   setTimeout("UnderScan()",8000)
  }

 } else {
 	window.document.getElementById('under_scan').innerHTML = "";
  hiddenBackgroundImage('ShowiTune');
  return;
 }
}

// ********************** iTunes Function End ********************** //

// ********************** uPnP Function Start ********************** //

function upnp_status(){
 showBackgroundImage('wait_message');
 getContent('','/cgi-bin/services.cgi?uPnPCron',"function:showuPnPCron");
}

function showuPnPCron(msg){
 var crontable = window.document.getElementById('crontable');
 var data = new Array("60","120");

 start = '<select id="cronselect">';
 end = '</select>';
 var x = 0;
 var y = 0;
 for (i=0; i<data.length && data[i] != ""; i++){
  if(msg.indexOf("2")!=-1)
   select = '<option value='+data[i]+' selected>'+data[i]+'</option>';
  else
   select = '<option value='+data[i]+'>'+data[i]+'</option>';

  start += select;
 }
 start += end;

 crontable.innerHTML = start;
 parent.calcHeight('parent');
 getContent('','/cgi-bin/services.cgi?ushare_state',"function:showuPnPStatus");
}

function showuPnPStatus(msg){
 msg = msg.split("\n");
 if(msg[0].indexOf("ON") != -1){
  document.getElementById("status_enable").checked=true;
  document.getElementById("status_disable").checked=false;
 } else {
  document.getElementById("status_enable").checked=false;
  document.getElementById("status_disable").checked=true;
 }

 //window.document.getElementById('UPnPPort').value = msg[1];
 getContent('','/cgi-bin/services.cgi?DiskStatus',"function:uPnPActionControl");
}

function uPnPActionControl(msg){
 var data = new Array("status_enable","status_disable","uPnPRescanBtn");
 for (i=0; i<data.length && data[i] != "" ; i++){
  if(msg.indexOf('NoDisk')!=-1)
   document.getElementById(data[i]).disabled=true;
  else
   document.getElementById(data[i]).disabled=false;
 }
 hiddenBackgroundImage('wait_message');
}

function OnChguPnPStatus(id){
 if(id.indexOf('status_enable')!=-1){
  document.getElementById("status_enable").checked=true;
  document.getElementById("status_disable").checked=false;
 } else {
  document.getElementById("status_disable").checked=true;
  document.getElementById("status_enable").checked=false;
 }
}

function uPnPChange() {

 if (document.getElementById('status_enable').checked==true)
  var status='Enable';
 else
  var status='Disable';

/*
 var re=/[\S\w]+/;
 var object = document.getElementById('UPnPPort');
 var port = object.value;

 if (!re.test(port)){
  setTimeout(function(){object.focus();object.select();},10);
  alert(decode(showText(151)));
  return false;
 }

 if (! Check_num('port',port)){
  setTimeout(function(){object.focus();object.select();},10);
  alert('\''+port+'\' '+decode(showText(157)));
  return false;
 }

 if (port < 1024||port > 65534){
  setTimeout(function(){object.focus();object.select();},10);
  alert('\''+port+'\' '+decode(showText(157)));
  return false;
 }
 */

 var crontable = document.getElementById("cronselect").value;
 showBackgroundImage('wait_message');
 //getContent('','/cgi-bin/services.cgi?modify_config&'+status+'&'+port+'&'+crontable,"function:showuPnPMessage");
 getContent('','/cgi-bin/services.cgi?modify_config&'+status+'&'+crontable,"function:showuPnPMessage");
}

function uPnPRescan(){
 showBackgroundImage('wait_message');
 getContent('','/cgi-bin/services.cgi?uPnPRescan',"function:showuPnPMessage");
}

function showuPnPMessage(){
 hiddenBackgroundImage('wait_message');
 //location.replace ('media.htm');
 upnp_status();
}
// ********************** uPnP Function End ********************** //

// ********************** FTP Function Start ********************** //

function getFTPStatus(){
 showBackgroundImage('wait_message');
 getContent('','/cgi-bin/services.cgi?UsersData',"function:showFTPUsersData");
}

function showFTPUsersData(msg){
 msg = msg.split("\n");
 window.document.getElementById('UsersData').innerHTML = '<INPUT id=\"Users\" value=\"'+msg[0]+'\" type=hidden>';
 getContent('','/cgi-bin/services.cgi?SecurityData',"function:showFTPSecurityData");
}

function showFTPSecurityData(msg){
 msg = msg.split("\n");
 var str = '';
 for(i=0; i<msg.length && msg[i] != "" ; i++){
  var data = msg[i].split("^");
  str += '<INPUT id=\"'+data[0]+'\" value=\"'+data[1]+'\" type=hidden>';
 }
 window.document.getElementById('SecurityData').innerHTML = str;
 parent.calcHeight('parent');
 getContent('','/cgi-bin/services.cgi?USBData',"function:showFTPUSBData");
}

function showFTPUSBData(msg){
 msg = msg.split("\n");
 window.document.getElementById('USBData').innerHTML = '<INPUT id=\"USBFolderData\" value=\"'+msg[0]+'\" type=hidden>';
 getContent('','/cgi-bin/services.cgi?ftp_state',"function:showFTPStatus");
}

function showFTPStatus(msg){
 msg = msg.split("\n");

 if(msg[0].indexOf("ON") != -1){
  document.getElementById("status_enable").checked=true;
  document.getElementById("status_disable").checked=false;
 } else {
  document.getElementById("status_enable").checked=false;
  document.getElementById("status_disable").checked=true;
 }

 var PassivePort = msg[1].split("^");
 document.getElementById("PasvPort_1").value=PassivePort[0];
 document.getElementById("PasvPort_2").value=PassivePort[1];

 if(msg[2].indexOf('YES')!=-1){
  document.getElementById("Allow_Anon_Enable").checked=true;
  document.getElementById("Allow_Anon_Disable").checked=false;
 } else {
  document.getElementById("Allow_Anon_Enable").checked=false;
  document.getElementById("Allow_Anon_Disable").checked=true;
 }

 if(msg[3].indexOf('YES')!=-1){
  document.getElementById("Anon_Access_ReadWrite").checked=true;
  document.getElementById("Anon_Access_Read").checked=false;
 } else {
 	document.getElementById("Anon_Access_ReadWrite").checked=false;
  document.getElementById("Anon_Access_Read").checked=true;
 }
 window.document.getElementById('HDD_STATUS').innerHTML = '<INPUT id=HDDSTATUS value=\"'+msg[4]+'\" type=hidden>';
 parent.calcHeight('parent');
 getContent('','/cgi-bin/services.cgi?FolderList',"function:showFTPFolderList");
}

function showFTPFolderList(msg){
 var FolderList = msg.split("\n");
 var opts = "<select size=\"7\" id=\"FolderSelect\" style=\"width: 200px;\" onChange=\"FTPFolderSelect()\">";

 for(i=0; i<FolderList.length && FolderList[i] != "" ; i++){
  opts += "<option value='"+FolderList[i]+"'>"+FolderList[i]+"</option>";
 }
 opts+="</select>"
 document.getElementById("FolderList").innerHTML=opts;
 window.document.getElementById('OLD_FOLDER').innerHTML = '<INPUT id=FolderName value=\"\" type=hidden>';
 parent.calcHeight('parent');
 getContent('','/cgi-bin/services.cgi?DiskStatus',"function:FTPFolderControl");
}

function FTPFolderControl(msg){
 var data = new Array("FolderSelect","FTPFolderCreate","FTPFolderModify","FTPFolderDelete");
 for (i=0; i<data.length && data[i] != "" ; i++){
  if(msg.indexOf('NoDisk')!=-1)
   document.getElementById(data[i]).disabled=true;
  else
   document.getElementById(data[i]).disabled=false;
 }
 hiddenBackgroundImage('wait_message');
}

function OnChgFTPStatus(id){
 if(id.indexOf('status_enable')!=-1){
  document.getElementById("status_enable").checked=true;
  document.getElementById("status_disable").checked=false;
 } else {
  document.getElementById("status_disable").checked=true;
  document.getElementById("status_enable").checked=false;
 }
}

function OnChgAccessType(id){
 if(id.indexOf('Anon_Access_ReadWrite')!=-1){
  document.getElementById("Anon_Access_ReadWrite").checked=true;
  document.getElementById("Anon_Access_Read").checked=false;
 } else {
  document.getElementById("Anon_Access_Read").checked=true;
  document.getElementById("Anon_Access_ReadWrite").checked=false;
 }
}

function OnChgAllowType(id){
 if(id.indexOf('Allow_Anon_Disable')!=-1){
  document.getElementById("Allow_Anon_Disable").checked=true;
  document.getElementById("Allow_Anon_Enable").checked=false;
 } else {
  document.getElementById("Allow_Anon_Enable").checked=true;
  document.getElementById("Allow_Anon_Disable").checked=false;
 }
}

function FTPSubmit(){
 var data = new Array("PasvPort_1","PasvPort_2");
 var re=/[\S\w]+/;
 var num=/^\d+$/g;

 for (i=0; i<data.length && data[i] != "" ; i++){
  var object = document.getElementById(data[i]);
  var port = object.value;

  if(!re.test(port)){
   setTimeout(function(){object.focus();object.select();},10);
   alert(decode(showText(151)));
   return false;
  }

  if (! Check_num(data[i],port)){
   setTimeout(function(){object.focus();object.select();},10);
   alert('\''+port+'\' '+decode(showText(157)));
   return false;
  }

  if (port < 50000||port > 65534){
   setTimeout(function(){object.focus();object.select();},10);
   alert('\''+port+'\' '+decode(showText(157)));
   return false;
  }
 }

 var PasvPort_1 = document.getElementById('PasvPort_1').value;
 var PasvPort_2 = document.getElementById('PasvPort_2').value;

 if (PasvPort_2 <= PasvPort_1){
  alert('\''+PasvPort_1+'\' '+decode(showText(157)));
  setTimeout(function(){document.getElementById('PasvPort_1').focus();document.getElementById('PasvPort_1').select();},10);
  return false;
 }

 if (document.getElementById('status_enable').checked==true)
  var status='Enable';
 else
  var status='Disable';

 if (document.getElementById('Allow_Anon_Enable').checked==true)
  var Allow_Anon_Enable='YES';
 else
  var Allow_Anon_Enable='NO';

 if (document.getElementById('Anon_Access_ReadWrite').checked==true)
  var Anon_Access_ReadWrite='AllowAll';
 else
  var Anon_Access_ReadWrite='DenyAll';

 showBackgroundImage('wait_message');
 getContent('','/cgi-bin/services.cgi?modify_ftp_conf&'+status+'&'+PasvPort_1+'&'+PasvPort_2+'&'+Allow_Anon_Enable+'&'+Anon_Access_ReadWrite,'function:showFTPMessage');
}

function showFTPMessage(){
 hiddenBackgroundImage('wait_message');
 getFTPStatus();
}

function Check_num(id,num){
 var reg = /^(\d+)$/;
 if (!reg.test(num)){
  return false;
 }
 return true;
}

function FTPFolderSelect(){
 var FolderName=document.getElementById("FolderSelect").value;
 window.document.getElementById('OLD_FOLDER').innerHTML = '<INPUT id=FolderName value=\"'+FolderName+'\" type=hidden>';
 FTPFolderUserData(FolderName);
 parent.calcHeight('parent');
}

function FTPFolderUserData(FolderName){
 var UsersData = document.getElementById("Users").value
 UsersData = UsersData.split("^");
 var FolderData = document.getElementById(FolderName).value;

 FolderData = FolderData.split("#");
 var DenyUser = FolderData[0].split(",");
 var AllowUser = FolderData[1].split(",");
 var data = new Array("Account","Login","Access");

 var table_height=28;
 var oTable=window.document.getElementById('UserData');
 var rowNum=oTable.rows.length;
 if(rowNum>1){
  rowNum = rowNum - 1;
  for(rIndex=0;rIndex<rowNum;rIndex++)
   oTable.deleteRow(-1);
 }

 for (i=0; i<UsersData.length && UsersData[i] != "" ; i++){
  var oTr=oTable.insertRow(-1);
  for (j=0; j<data.length && data[j] != "" ; j++){
   oCell=oTr.insertCell(j);
   oCell.style.cssText="text-align: center;color: #0000FF;";

   if(j==0){
    str = UsersData[i];
   }

   if(j==2){
    if(FolderData[1].indexOf('none')!=-1){
     FTPUserRadio(UsersData[i],FolderName,data[j],'YES');
    } else if((FolderData[1].indexOf(','+UsersData[i]+',')!=-1)||(FolderData[1].indexOf(UsersData[i]+',')!=-1)){
     FTPUserRadio(UsersData[i],FolderName,data[j],'NO');
    } else {
     FTPUserRadio(UsersData[i],FolderName,data[j],'YES');
    }
   }

   if(j==1){
    if(FolderData[0].indexOf(','+UsersData[i]+',')!=-1){
     FTPUserRadio(UsersData[i],FolderName,data[j],'YES');
    } else {
     FTPUserRadio(UsersData[i],FolderName,data[j],'NO');
    }
   }

   oCell.style.backgroundColor="#FFFFFF";
   oCell.innerHTML=str;

  }
 }

}

function FTPUserRadio(account,FolderName,data,datainner){
 if(datainner=="YES"){
  str = '<input type=radio id='+account+'^'+FolderName+'^'+data+' value='+datainner+' checked />&nbsp;'+showText(188)+'&nbsp;&nbsp;<input type=radio id='+account+'^'+FolderName+'^'+data+' value='+datainner+' onClick=ChangeFTPStatus(this.id,this.value) />&nbsp;'+showText(189);
 } else {
  str = '<input type=radio id='+account+'^'+FolderName+'^'+data+' value='+datainner+' onClick=ChangeFTPStatus(this.id,this.value) />&nbsp;'+showText(188)+'&nbsp;&nbsp;<input type=radio id='+account+'^'+FolderName+'^'+data+' value='+datainner+' checked />&nbsp;'+showText(189);
 }
 return str;
}

function ChangeFTPStatus(data,value){
 showBackgroundImage('wait_message');
 data = data.split("^");
 var id = data[0];
 var FolderName = data[1];
 var action = data[2];
 getContent('','/cgi-bin/services.cgi?ModifyFTPFolderAction&'+id+'&'+FolderName+'&'+action+'&'+value,'function:showFTPChangeStatus');
}

function showFTPChangeStatus(){
 location.replace ('ftp.htm');
}

function OpneFTPFolderCreate(){
 window.document.getElementById('Action').innerHTML = '<INPUT id=FolderAction value=Create type=hidden>';
 window.document.getElementById('WindowTitle').innerHTML = showText(216)+'&nbsp;'+showText(107)+'<br /><br />';
 setTimeout(function(){document.getElementById("FolderText").focus();document.getElementById("FolderText").select();},10);
 showPopWindow('ModifyUserWindow');
}

function OpneFTPFolderModify(){
 window.document.getElementById('Action').innerHTML = '<INPUT id=FolderAction value=Modify type=hidden>';
 window.document.getElementById('WindowTitle').innerHTML = showText(65)+'&nbsp;'+showText(107)+'<br /><br />';
 var FolderName=document.getElementById("FolderSelect").value;

 if(FolderName==''){
  alert(decode(showText(226)));
  return false;
 }

 if (! CheckSystemFolder(FolderName,'Modify')){
  alert(decode(showText(228)));
  return false;
 }

 document.getElementById("FolderText").value = FolderName;
 setTimeout(function(){document.getElementById("FolderText").focus();document.getElementById("FolderText").select();},10);
 showPopWindow('ModifyUserWindow');
}

function FolderCreateCancel(){
 document.getElementById("FolderText").value = '';
 closePopWindow('ModifyUserWindow');
}

function FolderAction(){
 var Action = document.getElementById("FolderAction").value;
 if(Action=="Create")
  FTPFolderCreate();
 else
  FTPFolderModify();
}

function FTPFolderCreate(){
 var folder=document.getElementById("FolderSelect");
 var object = document.getElementById("FolderText");
 var folder_value=object.value;
 var HDDSTATUS=document.getElementById("HDDSTATUS").value;

 if(HDDSTATUS.indexOf("DISABLE") != -1){
  document.getElementById("FolderText").value='';
  return false;
 }

 if(folder_value==''){
  alert(decode(showText(140)));
  setTimeout(function(){object.focus();object.select();},10);
  return false;
 }

 if (! CheckSystemFolder(folder_value,'Create')){
  alert(decode(showText(141)));
  setTimeout(function(){object.focus();object.select();},10);
  return false;
 }

 if (! CheckUSBFolder(folder_value)){
  alert(decode(showText(141)));
  setTimeout(function(){object.focus();object.select();},10);
  return false;
 }

 if(FTPSelectIsExitItem(folder, folder_value, 'Create')){
  setTimeout(function(){object.focus();object.select();},10);
  alert(decode(showText(187)));
 } else {
  if (! FTPCheckFolderData(folder_value)){
   setTimeout(function(){object.focus();object.select();},10);
   alert(decode(showText(176)));
   return false;
  }
  showBackgroundImage('wait_message');
  FolderCreateCancel();
  document.getElementById("FolderText").value='';
  getContent('','/cgi-bin/services.cgi?FolderCreate&'+folder_value,"function:showFTPChangeStatus");
 }
}

function FTPFolderModify(){
 var folder=document.getElementById("FolderSelect");
 var object = document.getElementById("FolderText");
 var folder_value=object.value;
 var select_index=folder.selectedIndex;
 var old_folder=document.getElementById("FolderName").value;
 var HDDSTATUS=document.getElementById("HDDSTATUS").value;

 if(HDDSTATUS.indexOf("DISABLE") != -1){
  document.getElementById("FolderText").value='';
  return false;
 }

 if(folder_value==''){
  alert(decode(showText(226)));
  setTimeout(function(){object.focus();object.select();},10);
  return false;
 }

 if (! CheckSystemFolder(folder_value,'Modify')){
  alert(decode(showText(141)));
  setTimeout(function(){object.focus();object.select();},10);
  return false;
 }

 if (! CheckUSBFolder(folder_value)){
  alert(decode(showText(141)));
  setTimeout(function(){object.focus();object.select();},10);
  return false;
 }

 if(FTPSelectIsExitItem(folder, folder_value, 'Modify')){
 	setTimeout(function(){object.focus();object.select();},10);
  alert(decode(showText(187)));
 } else {
  if (! FTPCheckFolderData(folder_value)){
   setTimeout(function(){object.focus();object.select();},10);
   alert(decode(showText(176)));
   return false;
  }
  showBackgroundImage('wait_message');
  FolderCreateCancel();
  document.getElementById("FolderText").value='';
  getContent('','/cgi-bin/services.cgi?FolderModify&'+old_folder+'&'+folder_value,"function:showFTPChangeStatus");
 }
}

function FTPFolderDelete(){
 var folder=document.getElementById("FolderSelect");
 var folder_value=document.getElementById("FolderSelect").value;
 var select_index=folder.selectedIndex;
 var isDel=false;
 var HDDSTATUS=document.getElementById("HDDSTATUS").value;
 var object = document.getElementById('FolderText');

 if(HDDSTATUS.indexOf("DISABLE") != -1){
  document.getElementById("FolderText").value='';
  return false;
 }

 if(folder_value==''){
  alert(decode(showText(226)));
  return false;
 }

 if (! CheckSystemFolder(folder_value,'Delete')){
  alert(decode(showText(227)));
  return false;
 }

 if (! CheckUSBFolder(folder_value)){
  alert(decode(showText(227)));
  return false;
 }

 if (confirm(decode(showText(229)))){
  for (var i = 0; i < folder.options.length; i++){
   if (folder.options[i].value == folder_value){
    folder.remove(i);
    isDel=true;
    document.getElementById("FolderText").value='';
    getContent('','/cgi-bin/services.cgi?FolderDelete&'+folder_value,"function:showFTPChangeStatus");
    break;
   }
  }

  if(!isDel)
   alert(decode(showText(212)));
 }
}

function showFolderMessage(){
 //getSambaStatus();
 location.replace ('ftp.htm');
}

function FTPCheckFolderData(value){
 var reg=/^[\w-.]+$/g
 var error = value.match(reg);
 if (error == null){
  return false;
 }
 return true;
}

function FTPSelectIsExitItem(objSelect, objItemValue, Action){
	var old_folder=document.getElementById("FolderName").value;
 var isExit = false;
 for (var i = 0; i < objSelect.options.length; i++){
  if(Action.indexOf('Create')!=-1){
   if (objSelect.options[i].value == objItemValue) {
    isExit = true;
    break;
   }
  } else if(Action.indexOf('Modify')!=-1){
   if ((objSelect.options[i].value == objItemValue)&&(old_folder!=objItemValue)) {
    isExit = true;
    break;
   }
  }
 }
 return isExit;
}

function CheckSystemFolder(folder_value, Action){
 var HDDFolder = new Array("PUBLIC","Media","BitTorrent","Disk_2");
 var old_folder=document.getElementById("FolderName").value;

 if(Action.indexOf('Modify')!=-1){
  for (i=0; i<HDDFolder.length && HDDFolder[i] != "" ; i++){
   if(HDDFolder[i]==old_folder)
    return false;
  }
 }

 for (i=0; i<HDDFolder.length && HDDFolder[i] != "" ; i++){
  if(HDDFolder[i]==folder_value)
   return false;
 }
 return true;
}

function CheckUSBFolder(folder_value){
 var USBFolder = document.getElementById("USBFolderData").value;
 USBFolder = USBFolder.split("^");
 for (i=0; i<USBFolder.length && USBFolder[i] != "" ; i++){
  if(USBFolder[i].indexOf(folder_value)!=-1)
   return false;
 }
 return true;
}

// ********************** FTP Function End ********************** //

// ********************** BT Function Start ********************** //

function BTStart(){
 showBackgroundImage('wait_message')
 var ppp = getParameter('path');
 if(ppp==null)
  ppp='';

 if(ppp.indexOf("/tmp/") != -1){
  getContent('','/cgi-bin/services.cgi?UploadTorrent&'+ppp,"function:UploadFinish");
 } else 
  BT_Status();
}

function UploadFinish(){
 location.replace ('bt.htm');
}

function BT_Status(){
 getContent('','/cgi-bin/services.cgi?bt_state',"function:ShowBTStatus");
}

function ShowBTStatus(msg){
 msg = msg.split("\n");
 var data = new Array("status","port","outgoing","incoming","maxpeers");
 for (i=0; i<data.length && data[i] != "" ; i++){
 	str = data[i];
  eval('data['+i+']=msg['+i+']');
  if(i==0){
   if(data[i].indexOf("ON") != -1){
    document.getElementById("status_enable").checked=true;
    document.getElementById("status_disable").checked=false;
   } else {
   	document.getElementById("status_enable").checked=false;
    document.getElementById("status_disable").checked=true;
   }
 } else
   window.document.getElementById(str).value = data[i];
 }

 if(msg[0].indexOf("ON") != -1){
  parent.calcHeight('parent');
  getContent('','/cgi-bin/services.cgi?DiskStatus',"function:FolderControl:ON");
 } else
  FolderControl('NoDisk','OFF');
}

function FolderControl(msg,action){
 if(action=='ON')
  var data = new Array("status_enable","status_disable","UploadFile","UpLoadBTFileBtn","DeleteTorrents","StartTorrents","StopTorrents","torrent_all","UpLoadCancel","RefreshTorrents");
 else
  var data = new Array("UploadFile","UpLoadBTFileBtn","DeleteTorrents","StartTorrents","StopTorrents","torrent_all","UpLoadCancel","RefreshTorrents");


 for (i=0; i<data.length && data[i] != "" ; i++){
  if(msg.indexOf('NoDisk')!=-1)
   document.getElementById(data[i]).disabled=true;
  else
   document.getElementById(data[i]).disabled=false;
 }

 if(msg.indexOf('NoDisk')!=-1)
  hiddenBackgroundImage('wait_message');
 else
  getContent('','/cgi-bin/services.cgi?TorrentList','function:TorrentListShow');
}

function TorrentListShow(msg){
 msg = msg.split("\n");
 var name = '';

 var oTable=window.document.getElementById('TorrentListData');
 var rowNum=oTable.rows.length;

 if(rowNum>3){
  rowNum = rowNum - 1;
  for(rIndex=2;rIndex<rowNum;rIndex++)
   oTable.deleteRow(-1);
 }

 for (i=0; i<msg.length && msg[i] != "" ; i++){
  var table_height=28;

  var oTr=oTable.insertRow(-1);
  data = msg[i].split("^");

  for (j=0; j<data.length && data[j] != "" ; j++){

   oCell=oTr.insertCell(j);
   oCell.style.cssText="text-align: center;color: #000000;";

   if(j==0){
    name = data[1].split("%");
    data[j]='<input type=checkbox id=torrent_'+i+' value=\"'+name[0]+'\" />';
   }

   if(j==1){
    name = data[j].split("%");
    oCell.style.cssText="text-align: left;color: #008800;padding: 0px 0px 0px 10px;";
    data[j]='<a id='+name[0]+' href=\'javascript:TorrentStatus(\"'+name[0]+'\")\'>'+name[1];
   }

   if(j==2){
    if(data[j].indexOf('+')!=-1){
     data[j] = 'Starting';
    } else if(data[j].indexOf('-')!=-1){
     data[j] = 'Stopped';
     oCell.style.cssText="text-align: center;color: #E24242;";
    } else if(data[j].indexOf('I')!=-1){
     data[j] = 'Inactive';
     oCell.style.cssText="text-align: center;color: #E24242;";
    } else if(data[j].indexOf('S')!=-1){
     data[j] = 'Seeding';
    } else if(data[j].indexOf('L')!=-1){
     data[j] = 'Leeching';
    }
   }

   str = data[j];
   oCell.style.backgroundColor="#FFFFFF";
   oCell.innerHTML=str;
  }
 }
 document.getElementById('DelTorrent').disabled='false';
 window.document.getElementById('Value').innerHTML = '<INPUT id=Now_Value value=\"'+i+'\" type=hidden>';
 parent.calcHeight('parent');
 hiddenBackgroundImage('wait_message');
}

function TorrentStatus(id){
 showBackgroundImage('wait_message');
 getContent('','/cgi-bin/services.cgi?TorrentStatus&'+id,'function:TorrentStatusShow:'+id);
}

function TorrentStatusShow(msg,id){
 msg = msg.split("\n");
 var str = '';
 for (i=0; i<msg.length && msg[i] != "" ; i++){
 	if(i==1){
   filedata = msg[i].split("#");
   var filedataval = '';

   var FileoTable=window.document.getElementById('TorrentInfoTable');
   var Filetable_height=28;
   var FileoTr=FileoTable.insertRow(-1);
   FileoTr=FileoTable.insertRow(-1);
   FileoCell=FileoTr.insertCell(0);
   FileoCell.style.backgroundColor="#FFFFFF"
   FileoCell.style.cssText="text-align: left;background-color: #d7e0ef;color: #3c5d86;font-weight:bold;font-size:9pt;text-align:right;padding: 0px 10px 0px 0px;";
   FileoCell.innerHTML='File';
   FileoCell=FileoTr.insertCell(1);

   for (n=0; n<filedata.length && filedata[n] != "" ; n++){
    filedataval += filedata[n]+'<br>';
   }
   FileoCell.style.cssText="text-align: left;background-color: #FFFFFF;color: #000000;padding: 0px 0px 0px 10px;";
   FileoCell.innerHTML=filedataval;
  } else {
   if(msg[i].indexOf('TorrentStatus')!=-1){

    var table_height=28;
    var oTable=window.document.getElementById('TorrentStatusTable');

    var rowNum=oTable.rows.length;
    if(rowNum>1){
     rowNum = rowNum - 1;
     for(rIndex=0;rIndex<rowNum;rIndex++)
      oTable.deleteRow(-1);
    }

    var oTr=oTable.insertRow(-1);
    oTr=oTable.insertRow(-1);
    data = msg[i].split("=");
    info = data[1].split("^");

    for (j=0; j<info.length && info[j] != "" ; j++){
     oCell=oTr.insertCell(j);
     oCell.style.cssText="text-align: center;color: #000000;";
     infodata = info[j];
     oCell.style.backgroundColor="#FFFFFF";
     oCell.innerHTML=infodata;
    }
   } else {
    str = msg[i].split("#");
    var InfooTable=window.document.getElementById('TorrentInfoTable');
    var InforowNum=InfooTable.rows.length;
    if(InforowNum>1){
     InforowNum = InforowNum - 1;
     for(rIndex=0;rIndex<InforowNum;rIndex++)
      InfooTable.deleteRow(-1);
    }

    for (k=0; k<str.length && str[k] != "" ; k++){
     var Infotable_height=28;
     var InfooTr=InfooTable.insertRow(-1);
     InfooTr=InfooTable.insertRow(-1);
     strdata = str[k].split(":");

     for (m=0; m<strdata.length && strdata[m] != "" ; m++){
      InfooCell=InfooTr.insertCell(m);
      InfooCell.style.backgroundColor="#FFFFFF"

      if(m==0)
       InfooCell.style.cssText="text-align: left;background-color: #d7e0ef;color: #3c5d86;font-weight:bold;font-size:9pt;text-align:right;padding: 0px 10px 0px 0px;";
      else
       InfooCell.style.cssText="text-align: left;background-color: #FFFFFF;color: #000000;padding: 0px 0px 0px 10px;";

      strdataval = strdata[m];
      InfooCell.innerHTML=strdataval;
     }
    }
   }
  }
 }
 hiddenBackgroundImage('wait_message');
 showPopWindow('TorrentsStatus');
 parent.calcHeight('parent');
}

function DeleteTorrents(){
 var num = document.getElementById('Now_Value').value;
 var str = '';
 for (x=0; x<num; x++){
  if (document.getElementById("torrent_"+x).checked==true)
   var VALUE = document.getElementById("torrent_"+x).value+'^';
  else
   continue;

   str += VALUE;
 }
 if(str!=''){
  showPopWindow('DelTorrents');
 }
}

function TorrentAction(id){
 var num = document.getElementById('Now_Value').value;
 var str = '';
 for (x=0; x<num; x++){
  if (document.getElementById("torrent_"+x).checked==true)
   var VALUE = document.getElementById("torrent_"+x).value+'^';
  else
   continue;

   str += VALUE;
 }
 if(str==''){
  return false;
 } else {
  if(id=="del"){
   if (document.getElementById("DelFile").checked==true)
    var action='DelFile';
   else
    var action='DelTorrent';

   showBackgroundImage('wait_message');
   getContent('','/cgi-bin/services.cgi?TorrentAction&'+id+'&'+str+'&'+action,'function:showBTPDMessage');
  } else {
   showBackgroundImage('wait_message');
   getContent('','/cgi-bin/services.cgi?TorrentAction&'+id+'&'+str,'function:showBTPDMessage');
  }
 }
}

function SelectAll(){
 var num = document.getElementById('Now_Value').value;
 var checked=document.getElementById("torrent_all").checked;
 for (x=0; x<num; x++){
  document.getElementById("torrent_"+x).checked=checked;
 }
}

function OnChgBTPDStatus(id){
 if(id.indexOf('status_enable')!=-1){
  document.getElementById("status_enable").checked=true;
  document.getElementById("status_disable").checked=false;
 } else {
  document.getElementById("status_disable").checked=true;
  document.getElementById("status_enable").checked=false;
 }
}

function bt_submit(){
 if (document.getElementById('status_enable').checked==true)
  var status='Enable';
 else
  var status='Disable';

 var data = new Array("port","outgoing","incoming","maxpeers");
 for (i=0; i<data.length && data[i] != "" ; i++){
  var object = document.getElementById(data[i]);
  var VALUE = object.value;
  eval('data['+i+']='+'\"'+VALUE+'\"');

  if (! Check_val(data[i],VALUE)){
   setTimeout(function(){object.focus();object.select();},10);
   alert('\''+VALUE+'\' '+decode(showText(157)));
   return false;
  }
 }
 showBackgroundImage('wait_message');
 getContent('','/cgi-bin/services.cgi?modify_torrent_conf&'+status+'&'+data[0]+'&'+data[1]+'&'+data[2]+'&'+data[3],'function:showBTPDMessage');
}

function showBTPDMessage(){
 hiddenBackgroundImage('wait_message');
 location.replace ('bt.htm');
}

function UpLoadFile(){
 var filename = document.getElementById("UploadFile").value;
 if (filename==""){
  alert(decode(showText(234)));
  return false;
 } else {
  showBackgroundImage('ShowUpLoadBTFile')
 }
}

function UpLoadCancel(){
 window.document.getElementById('Upload').innerHTML = '<input type=\"file\" id=\"UploadFile\" size=\"25\" maxlength=\"31\" name=\"file\" />';
}

function Check_val(id,num){
 var reg = /^(\d+)$/;
 if (!reg.test(num)){
  return false;
 }

 if(id=='port'){
  if (num < 1024||num > 65535)
   return false;
 }
 return true;
}

function RefreshTorrents(){
 showBackgroundImage('wait_message');
 getContent('','/cgi-bin/services.cgi?TorrentList','function:TorrentListShow');
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

// ********************** BT Function End ************************ //
