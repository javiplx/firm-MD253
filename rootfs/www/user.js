if(document.cookie.indexOf("CD32N:MD-253")<0){
 location.replace ('login.htm');
}

// ********************** USER Function Start ********************** //
function UserData(){
 showBackgroundImage('wait_message');
 getContent('','/cgi-bin/user.cgi?HDDSize',"function:showHDDSizeMessage");
}

function showHDDSizeMessage(msg){
 window.document.getElementById('SIZE').innerHTML = '<INPUT id=HDDSize value=\"'+msg+'\" type=hidden>';
 parent.calcHeight('parent');
 getContent('','/cgi-bin/user.cgi?user_data_list',"function:showUserDataMessage");
}

function showUserDataMessage(msg){
 UserDataList = msg.split("\n");

 for (i=0; i<UserDataList.length && UserDataList[i] != "" ; i++){
  var UserData = UserDataList[i].split("\^");

  var table_height=28;
  var data = new Array("Account","Login","Access","delete","size");
  var oTable=window.document.getElementById('UserData');
  var oTr=oTable.insertRow(-1);

  for (j=0; j<UserData.length && UserData[j] != "" ; j++){
   oCell=oTr.insertCell(j);
   oCell.style.cssText="text-align: left;color: #0000FF;padding: 0px 0px 0px 10px;";

   if(j==0){
    oCell.style.cssText="color: #008800;padding: 0px 0px 0px 10px;";
    //str=UserData[j];
    str='<a id='+UserData[j]+' href=javascript:ModifyUserWindown(\"'+UserData[j]+'\")>'+UserData[j];
   }

   if(j==1){
    //UserRadio(UserData[0],UserData[1]);
    if(UserData[j].indexOf("none") != -1){
     oCell.style.cssText="color: #0000FF;padding: 0px 0px 0px 10px;";
     str=showText(73);
    } else {
     oCell.style.cssText="color: #0000FF;padding: 0px 0px 0px 10px;";
     str=UserData[j];
     if(str=="0")
      str = showText(73);
     else
      str = str + "B";
    }
   }

   if(j==2){
    if(UserData[j].indexOf("none") != -1){
     oCell.style.cssText="color: #E24242;padding: 0px 0px 0px 10px;";
     str=showText(73);
    } else {
     oCell.style.cssText="color: #0000FF;padding: 0px 0px 0px 10px;";
     if(UserData[j]=='0')
      str = UserData[j]+'MB';
     else
      str = UserData[j]+'B';
    }
   }

   if(j==3){
    oCell.style.cssText="text-align: center;color: #000000;padding: 0px 0px 0px 10px;";
    //str = '<input type="button" id=\"'+UserData[0]+'\" value="'+showText(65)+'" onclick="ModifyUser(this.id)" /><input type="button" id=\"'+UserData[0]+'\" value="'+showText(66)+'" onclick="DeleteUser(this.id)" />';
    str = '<input type="button" id=\"'+UserData[0]+'\" value="'+showText(66)+'" onclick="DeleteUser(this.id)" />';
   }

   oCell.style.backgroundColor="#FFFFFF";
   oCell.innerHTML=str;

   //if(j==1){
   // if(UserData[1]=="0")
   //  document.getElementById(UserData[0]+"_size").disabled=true;
   // else
   //  document.getElementById(UserData[0]+"_size").disabled=false;
   //}

  }
 }
 parent.calcHeight('parent');
 getContent('','/cgi-bin/user.cgi?HDDUseFree',"function:showHDDUseFreeMessage");
}

function showHDDUseFreeMessage(msg){
 if(msg!=''){
  HDDUseFree = msg.split("\n");
  var p = new pie();
  p.add(showText(58),HDDUseFree[0]);
  p.add(showText(181),HDDUseFree[1]);
  p.render("pieCanvas", "Pie Graph")
 }
 parent.calcHeight('parent');
 hiddenBackgroundImage('wait_message');
}

function UserRadio(account,Quota){
 if(Quota=="0"){
  str = '<input type=radio id='+account+'_Disable value=0 onClick=ChangeQuotaStatus(this.id) checked />'+decode(showText(73))+'&nbsp;<input type=radio id='+account+'_Enable onClick=ChangeQuotaStatus(this.id) /><input type="text" size="6" MAXLENGTH=8 id='+account+'_size value=\"\" />&nbsp;GB';
 } else {
  str = '<input type=radio id='+account+'_Disable value=0 onClick=ChangeQuotaStatus(this.id) />'+decode(showText(73))+'&nbsp;<input type=radio id='+account+'_Enable onClick=ChangeQuotaStatus(this.id) checked /><input type="text" size="6" MAXLENGTH=8 id='+account+'_size value=\"'+Quota+'\" />&nbsp;GB';
 }
 return str;
}

function ModifyUserWindown(id){
 showBackgroundImage('wait_message');
 getContent('','/cgi-bin/user.cgi?user_quota&'+id,"function:ModifyUserWindownOpen:"+id);
}

function ModifyUserWindownOpen(msg,id){
 quota = msg.split("\n");
 hiddenBackgroundImage('wait_message');
 showPopWindow('ModifyUserWindow');
 document.getElementById("ModifyName").value = id;
 document.getElementById("ModifyName").disabled = true;

 UserRadio(id,quota[0]);
 document.getElementById("QuotaData").innerHTML = str;
}

function ModifyUserCancel(){
 document.getElementById("ModifyPasswd").value = '';
 document.getElementById("QuotaData").innerHTML = '';
 closePopWindow('ModifyUserWindow');
}

function ChangeQuotaStatus(id){
 tmpID = id.split("_");
 if(id.indexOf('Disable')!=-1){
 	document.getElementById(tmpID[0]+"_size").disabled=true;
  document.getElementById(tmpID[0]+"_Disable").checked=true;
  document.getElementById(tmpID[0]+"_Enable").checked=false;
 } else {
 	document.getElementById(tmpID[0]+"_size").disabled=false;
  document.getElementById(tmpID[0]+"_Disable").checked=false;
  document.getElementById(tmpID[0]+"_Enable").checked=true;
 }
}

function User(id){
 var re=/[\S\w]+/;
 var HDDSize = document.getElementById("HDDSize").value;
 var data = new Array(id+'Name',id+'Passwd',id+'Quota');
 var name = document.getElementById(id+"Name").value;
 var passwd = document.getElementById(id+"Passwd").value;
 var quota = document.getElementById(id+"Quota").value;

 for (i=0; i<data.length && data[i] != "" ; i++){
  value = document.getElementById(data[i]).value;
  var str = data[i];
  var object = document.getElementById(str);

  if((data[i]=="ModifyPasswd")||(data[i]=="CreateQuota")||(data[i]=="ModifyQuota")){
   if(quota=='')
    quota=0;

   if(passwd=='')
    passwd='none';
  } else {
   if (!re.test(value)){
   	setTimeout(function(){object.focus();object.select();},10);
    alert(decode(showText(175)));
    return false;
   }
   if (! Check_Data(value)){
    setTimeout(function(){object.focus();object.select();},10);
    alert(decode(showText(152)));
    return false;
   }
   if (! CheckStartChar(value)){
    setTimeout(function(){object.focus();object.select();},10);
    alert(decode(showText(176)));
    return false;
   }
  }

  if ((data[i]=="CreateQuota")||(data[i]=="ModifyQuota")){
   if (! Check_num(data[i],quota)){
   	setTimeout(function(){object.focus();object.select();},10);
    alert('\''+quota+'\' '+decode(showText(157)));
    return false;
   }
   quota=parseInt(quota);
   HDDSize=parseInt(HDDSize);

   if(quota>=HDDSize){
   	setTimeout(function(){object.focus();object.select();},10);
   	alert(decode(showText(177))+' \''+quota+'GB\' '+decode(showText(178))+' Drive 1 \''+HDDSize+'GB\'');
    return false;
   }
  }

  if (data[i]=="CreateName"){
   if(value.length < 3){
   	setTimeout(function(){object.focus();object.select();},10);
    alert(decode(showText(179)));
    return false;
   }
   if (! Check_system(value)){
    setTimeout(function(){object.focus();object.select();},10);
    alert(decode(showText(175)));
    return false;
   }
   if (! Check_Same(value)){
   	setTimeout(function(){object.focus();object.select();},10);
    alert(decode(showText(180)));
    return false;
   }
  }
 }

 showBackgroundImage('wait_message');
 if (id=="Create"){
  getContent('','/cgi-bin/user.cgi?adduser&'+name+'&'+passwd+'&'+quota,'function:ModifyOK');
 } else {
 	getContent('','/cgi-bin/user.cgi?modifyuser&'+name+'&'+passwd+'&'+quota,'function:ModifyOK');
 }
}

function AdminPassword(value){
 var re=/[\S\w]+/;

 if(value.length < 3){
  len="short";
  return false;
 }
 if (!re.test(value)){
 	len="ok";
  return false;
 }
 if (! Check_Data(value)){
 	len="ok";
  return false;
 }
 return true;
}

function Check_Data(value){
 var reg=/^[\w-.]+$/g
 var error = value.match(reg);
 if (error == null){
  return false;
 }
 return true;
}

function Check_num(id,num){
 var reg = /[\D]/;
 var error = num.match(reg);
 if (error != null){
  return false;
 }
 return true;
}

function CheckStartChar(value){
 var reg_start = /^[\w]/
 var error_start = value.match(reg_start);
 if (error_start == null){
  return false;
 }
 return true;
}

function Check_system(value){
 var system = new Array("root","toor","bin","daemon","sys","sync","shutdown","halt","ftp","nobody","admin");
 for (s=0; s<system.length && system[s] != "" ; s++){
  if (system[s] == value){
   return false;
  }
 }
 return true;
}

function Check_Same(value){
 var userDataList = getContent('','/cgi-bin/user.cgi?user_data_list',"return",false);
 userDataList = userDataList.split("\n");
 for (j=0; j<userDataList.length && userDataList[j] != "" ; j++){
  var UserData = userDataList[j].split("\^");
  if (UserData[0] == value){
   return false;
  }
 }
 return true;
}

function ModifyUserAction(id){
	var id = document.getElementById("ModifyName").value;
 var HDDSize = document.getElementById("HDDSize").value;
 var passwd = document.getElementById("ModifyPasswd").value;
 var object = document.getElementById(id+"_size");

 if(document.getElementById(id+"_Disable").checked)
 Quota = '0';
 else
  Quota = document.getElementById(id+"_size").value;

 if(Quota=='')
  return false;

 if (! Check_num(id,Quota)){
  setTimeout(function(){object.focus();object.select();},10);
  alert('\''+Quota+'\' '+decode(showText(157)));
  return false;
 }
 quota=parseInt(Quota);
 HDDSize=parseInt(HDDSize);

 if(quota>=HDDSize){
  setTimeout(function(){object.focus();object.select();},10);
  document.getElementById(id+"_size").value = HDDSize;
  alert(decode(showText(177))+' \''+quota+'\' '+decode(showText(178))+' Drive 1 \''+HDDSize+'\'');
  return false;
 }

 if(passwd=='')
  passwd='none';

 getContent('','/cgi-bin/user.cgi?ModifyUsers&'+id+'&'+passwd+'&'+Quota,'function:ModifyOK');
}

function DeleteUser(id){
 showBackgroundImage('wait_message');
 getContent('','/cgi-bin/user.cgi?deluser&'+id,'function:ModifyOK');
}

function ModifyOK(msg){
	hiddenBackgroundImage('wait_message');
  location.replace ('user.htm');
}

// ********************** USER Function End ********************** //

// ********************** Share Folder Function Start ********************** //
function getSambaStatus(){
 showBackgroundImage('wait_message');
 getContent('','/cgi-bin/user.cgi?UsersData',"function:showUsersData");
}

function showUsersData(msg){
 msg = msg.split("\n");
 window.document.getElementById('UsersData').innerHTML = '<INPUT id=\"Users\" value=\"'+msg[0]+'\" type=hidden>';
 getContent('','/cgi-bin/user.cgi?SecurityData',"function:showSecurityData");
}

function showSecurityData(msg){
 msg = msg.split("\n");
 var str = '';
 for(i=0; i<msg.length && msg[i] != "" ; i++){
  var data = msg[i].split("^");
  str += '<INPUT id=\"'+data[0]+'\" value=\"'+data[1]+'\" type=hidden>';
 }
 window.document.getElementById('SecurityData').innerHTML = str;
 getContent('','/cgi-bin/user.cgi?USBData',"function:showUSBData");
}

function showUSBData(msg){
 msg = msg.split("\n");
 window.document.getElementById('USBData').innerHTML = '<INPUT id=\"USBFolderData\" value=\"'+msg[0]+'\" type=hidden>';
 parent.calcHeight('parent');
 getContent('','/cgi-bin/user.cgi?nas_state',"function:showSambaStatus");
}

function showSambaStatus(msg){
 msg = msg.split("\n");

 if(msg[0].indexOf("ON") != -1){
  document.getElementById("status_enable").checked=true;
  document.getElementById("status_disable").checked=false;
 } else {
  document.getElementById("status_enable").checked=false;
  document.getElementById("status_disable").checked=true;
 }

 window.document.getElementById('HDD_STATUS').innerHTML = '<INPUT id=HDDSTATUS value=\"'+msg[1]+'\" type=hidden>';
 window.document.getElementById('PublicQuota').value = msg[2];
 window.document.getElementById('SIZE').innerHTML = '<INPUT id=HDDSize value=\"'+msg[3]+'\" type=hidden>';

 if((msg[4]=='Unlimited')||(msg[4].indexOf("No disk") != -1)){
  var str = msg[4];
 } else if(msg[4]==0)
  var str = msg[4]+'MB';
 else
  var str = msg[4]+'B';

 window.document.getElementById('PublicQuotaUsed').innerHTML = str;
 parent.calcHeight('parent');
 getContent('','/cgi-bin/user.cgi?FolderList',"function:showFolderList");
}

function showFolderList(msg){
 var FolderList = msg.split("\n");
 var opts = "<select size=\"7\" id=\"FolderSelect\" style=\"width: 200px;\" onChange=\"FolderSelect()\">";

 for(i=0; i<FolderList.length && FolderList[i] != "" ; i++){
  opts += "<option value='"+FolderList[i]+"'>"+FolderList[i]+"</option>";
 }
 opts+="</select>"
 document.getElementById("FolderList").innerHTML=opts;
 window.document.getElementById('OLD_FOLDER').innerHTML = '<INPUT id=FolderName value=\"\" type=hidden>';
 parent.calcHeight('parent');
 getContent('','/cgi-bin/user.cgi?DiskStatus',"function:SmbFolderControl");
}

function SmbFolderControl(msg){
 var data = new Array("FolderSelect","FolderCreate","FolderModify","FolderDelete");
 for (i=0; i<data.length && data[i] != "" ; i++){
  if(msg.indexOf('NoDisk')!=-1)
   document.getElementById(data[i]).disabled=true;
  else
   document.getElementById(data[i]).disabled=false;
 }
 hiddenBackgroundImage('wait_message');
}

function OnChgSMBStatus(id){
 if(id.indexOf('status_disable')!=-1){
  document.getElementById("status_disable").checked=true;
  document.getElementById("status_enable").checked=false;
 } else {
  document.getElementById("status_enable").checked=true;
  document.getElementById("status_disable").checked=false;
 }
}

function Samba_submit(){
 var re=/[\S\w]+/;
 var HDDSize = document.getElementById("HDDSize").value;
 var object = document.getElementById("PublicQuota");
 var quota = object.value;

 if (document.getElementById('status_enable').checked==true)
  var status='start';
 else
  var status='stop';

 if (!re.test(quota)){
  setTimeout(function(){object.focus();object.select();},10);
  alert(decode(showText(175)));
  return false;
 }

 if (! Check_num('PublicQuota',quota)){
  setTimeout(function(){object.focus();object.select();},10);
  alert('\''+quota+'\' '+decode(showText(157)));
  return false;
 }

 quota=parseInt(quota);
 HDDSize=parseInt(HDDSize);

 if(quota>=HDDSize){
  setTimeout(function(){object.focus();object.select();},10);
  alert(decode(showText(177))+' \''+quota+'GB\' '+decode(showText(178))+' Drive 1 \''+HDDSize+'GB\'');
  return false;
 }

 showBackgroundImage('wait_message');
 getContent('','/cgi-bin/user.cgi?ChgSMBStatus&'+status+'&'+quota,"function:showSMBMessage");
}

function showSMBMessage(){
 hiddenBackgroundImage('wait_message');
 getSambaStatus();
}

function FolderSelect(){
 var FolderName=document.getElementById("FolderSelect").value;
 window.document.getElementById('OLD_FOLDER').innerHTML = '<INPUT id=FolderName value=\"'+FolderName+'\" type=hidden>';
 FolderUserData(FolderName);
 parent.calcHeight('parent');
}

function FolderUserData(FolderName){
 var FolderData = document.getElementById(FolderName).value;
 var data = new Array("Account","Login","Access");

 if((FolderName.indexOf('PUBLIC')!=-1)||(FolderData.indexOf('anonymous')!=-1)){
  var table_height=28;
  var oTable=window.document.getElementById('UserData');

  var rowNum=oTable.rows.length;
  if(rowNum>1){
   rowNum = rowNum - 1;
   for(rIndex=0;rIndex<rowNum;rIndex++)
    oTable.deleteRow(-1);
  }

  var oTr=oTable.insertRow(-1);
  for (j=0; j<data.length && data[j] != "" ; j++){
   oCell=oTr.insertCell(j);
   oCell.style.cssText="text-align: center;color: #0000FF;";

   if(j==0)
    str = 'Anonymous';

   if((j==1)||(j==2))
    str = '<input type=radio id=\"Anonymous_'+data[j]+'_allow\" checked />&nbsp;'+showText(188)+'&nbsp;&nbsp;<input type=radio id=\"Anonymous_'+data[j]+'_disallow\" />&nbsp;'+showText(189);

   oCell.style.backgroundColor="#FFFFFF";
   oCell.innerHTML=str;
  }
  document.getElementById('Anonymous_Login_allow').disabled=true;
  document.getElementById('Anonymous_Login_disallow').disabled=true;
  document.getElementById('Anonymous_Access_allow').disabled=true;
  document.getElementById('Anonymous_Access_disallow').disabled=true;
 } else {
  ShowFolderUserData(FolderName);
 }
}

function ShowFolderUserData(FolderName){
 var UsersData = document.getElementById("Users").value
 UsersData = UsersData.split("^");
 var FolderData = document.getElementById(FolderName).value;
 FolderData = FolderData.split("#");
 var WriteList = FolderData[0].split(",");
 var InvalidUsers = FolderData[1].split(",");
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

   if(j==1){
    if(FolderData[1].indexOf('none')!=-1){
     FolderUserRadio(UsersData[i],FolderName,data[j],'YES');
    } else if((FolderData[1].indexOf(','+UsersData[i]+',')!=-1)||(FolderData[1].indexOf(UsersData[i]+',')!=-1)){
     FolderUserRadio(UsersData[i],FolderName,data[j],'NO');
    } else {
     FolderUserRadio(UsersData[i],FolderName,data[j],'YES');
    }
   }

   if(j==2){
    if(FolderData[0].indexOf(','+UsersData[i]+',')!=-1){
     FolderUserRadio(UsersData[i],FolderName,data[j],'YES');
    } else {
     FolderUserRadio(UsersData[i],FolderName,data[j],'NO');
    }
   }

   oCell.style.backgroundColor="#FFFFFF";
   oCell.innerHTML=str;

  }
 }

}

function FolderUserRadio(account,FolderName,data,datainner){
 if(datainner=="YES"){
  str = '<input type=radio id='+account+'^'+FolderName+'^'+data+' value='+datainner+' checked />&nbsp;'+showText(188)+'&nbsp;&nbsp;<input type=radio id='+account+'^'+FolderName+'^'+data+' value='+datainner+' onClick=ChangeStatus(this.id,this.value) />&nbsp;'+showText(189);
 } else {
  str = '<input type=radio id='+account+'^'+FolderName+'^'+data+' value='+datainner+' onClick=ChangeStatus(this.id,this.value) />&nbsp;'+showText(188)+'&nbsp;&nbsp;<input type=radio id='+account+'^'+FolderName+'^'+data+' value='+datainner+' checked />&nbsp;'+showText(189);
 }
 return str;
}

function ChangeStatus(data,value){
 showBackgroundImage('wait_message');
 data = data.split("^");
 var id = data[0];
 var FolderName = data[1];
 var action = data[2];
 getContent('','/cgi-bin/user.cgi?ModifySMBFolderAction&'+id+'&'+FolderName+'&'+action+'&'+value,'function:showChangeStatus');
}

function showChangeStatus(){
 location.replace ('share.htm');
}

function OpenFolderCreate(){
	window.document.getElementById('Action').innerHTML = '<INPUT id=FolderAction value=Create type=hidden>';
	window.document.getElementById('WindowTitle').innerHTML = showText(216)+'&nbsp;'+showText(107)+'<br /><br />';
	setTimeout(function(){document.getElementById("FolderText").focus();document.getElementById("FolderText").select();},10);
 showPopWindow('ModifyUserWindow');
}

function OpenFolderModify(){
	window.document.getElementById('Action').innerHTML = '<INPUT id=FolderAction value=Modify type=hidden>';
	window.document.getElementById('WindowTitle').innerHTML = showText(65)+'&nbsp;'+showText(107)+'<br /><br />';
 var folder_value=document.getElementById("FolderSelect").value;

 if(folder_value==''){
 	alert(decode(showText(226)));
  return false;
 }

 if(folder_value=='PUBLIC'){
 	alert(decode(showText(228)));
  return false;
 }

 showBackgroundImage('wait_message');
 getContent('','/cgi-bin/user.cgi?GetFolderStatus&'+folder_value,"function:showOpenFolderModify:"+folder_value);
}

function showOpenFolderModify(msg,FolderName){
 hiddenBackgroundImage('wait_message');
 document.getElementById("FolderText").value = FolderName;

 if(msg.indexOf('personal')!=-1){
  document.getElementById("personal").checked=true;
  document.getElementById("anonymous").checked=false;
 } else {
  document.getElementById("anonymous").checked=true;
  document.getElementById("personal").checked=false;
 }

	setTimeout(function(){document.getElementById("FolderText").focus();document.getElementById("FolderText").select();},10);
 showPopWindow('ModifyUserWindow');
}

function FolderCreateCancel(){
 document.getElementById("FolderText").value = '';
 document.getElementById("anonymous").checked=true;
 document.getElementById("personal").checked=false;
 closePopWindow('ModifyUserWindow');
}

function FolderAction(){
 var Action = document.getElementById("FolderAction").value;
 if(Action=="Create")
  FolderCreate();
 else
  FolderModify();
}

function OnChgScurity(id){
 if(id.indexOf('personal')!=-1){
  document.getElementById("personal").checked=true;
  document.getElementById("anonymous").checked=false;
 } else {
  document.getElementById("anonymous").checked=true;
  document.getElementById("personal").checked=false;
 }
}

function FolderCreate(){
 var folder=document.getElementById("FolderSelect");
 var folder_value=document.getElementById("FolderText").value;
 var HDDSTATUS=document.getElementById("HDDSTATUS").value;
 var object = document.getElementById('FolderText');

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

 if(SelectIsExitItem(folder, folder_value, 'Create')){
 	setTimeout(function(){object.focus();object.select();},10);
  alert(decode(showText(187)));
 } else {
  if (! CheckFolderData(folder_value)){
   setTimeout(function(){object.focus();object.select();},10);
   alert(decode(showText(176)));
   return false;
  }

  if(document.getElementById('anonymous').checked)
   FolderStatus = 'anonymous';
  else
  	FolderStatus = 'personal';

  showBackgroundImage('wait_message');
  FolderCreateCancel();
  document.getElementById("FolderText").value='';
  getContent('','/cgi-bin/user.cgi?FolderCreate&'+folder_value+'&'+FolderStatus,"function:showFolderMessage");
 }
}

function FolderModify(){
 var folder=document.getElementById("FolderSelect");
 var folder_value=document.getElementById("FolderText").value;
 var select_index=folder.selectedIndex;
 var old_folder=document.getElementById("FolderName").value;
 var HDDSTATUS=document.getElementById("HDDSTATUS").value;
 var object = document.getElementById('FolderText');

 if(HDDSTATUS.indexOf("DISABLE") != -1){
  document.getElementById("FolderText").value='';
  return false;
 }

 if(folder_value==''){
  alert(decode(showText(226)));
  setTimeout(function(){object.focus();object.select();},10);
  return false;
 }

 if(folder_value!=old_folder){
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
 }

 if(SelectIsExitItem(folder, folder_value, 'Modify')){
 	setTimeout(function(){object.focus();object.select();},10);
  alert(decode(showText(187)));
 } else {
  if (! CheckFolderData(folder_value)){
   setTimeout(function(){object.focus();object.select();},10);
   alert(decode(showText(176)));
   return false;
  }

  if(document.getElementById('anonymous').checked)
   FolderStatus = 'anonymous';
  else
  	FolderStatus = 'personal';

  showBackgroundImage('wait_message');
  FolderCreateCancel();
  document.getElementById("FolderText").value='';
  getContent('','/cgi-bin/user.cgi?FolderModify&'+old_folder+'&'+folder_value+'&'+FolderStatus,"function:showFolderMessage");
 }
}

function FolderDelete(){
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
    getContent('','/cgi-bin/user.cgi?FolderDelete&'+folder_value,"function:showFolderMessage");
    break;
   }
  }

  if(!isDel)
   alert(decode(showText(212)));
 }
}

function showFolderMessage(){
 //getSambaStatus();
 location.replace ('share.htm');
}

function CheckFolderData(value){
 var reg=/^[\w-.]+$/g
 var error = value.match(reg);
 if (error == null){
  return false;
 }
 return true;
}

function SelectIsExitItem(objSelect, objItemValue, Action){
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
// ********************** Share Folder Function End ********************** //







