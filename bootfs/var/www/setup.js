if(document.cookie.indexOf("CD32N:MD-253")<0){
 location.replace ('login.htm');
}

// ********************** Setup System Function Start ********************** //
function GetStatusInfo(){
 showBackgroundImage('wait_message');
 getContent('','/cgi-bin/info.cgi?GetStatusInfo','function:SystemStatus');
}

function SystemStatus(msg){
 msg = msg.split("\n");
 document.getElementById("DeviceName").value = msg[0];
 document.getElementById("GroupName").value = msg[1];
 hiddenBackgroundImage('wait_message');
}

function ChangeDevice(){
 var re=/[\S\w]+/;

 var data = new Array("DeviceName","GroupName","AdminPasswd");
 for (i=0; i<data.length && data[i] != "" ; i++){
  VALUE = document.getElementById(data[i]).value;

  if(i==2){
   if((VALUE=="")||(VALUE=="password"))
    VALUE = "NaN";

   if (! AdminPassword(VALUE)){
    if(len=="short")
     alert(decode(showText(153)));
    else
     alert(decode(showText(152)));

    setTimeout(function(){document.getElementById(data[i]).focus();document.getElementById(data[i]).select();},10);
    return false;
   }
  } else {
   if (!re.test(VALUE)){
    alert(decode(showText(151)));
    setTimeout(function(){document.getElementById(data[i]).focus();document.getElementById(data[i]).select();},10);
    return false;
   }

   if (! Check_Data(VALUE)){
    alert(decode(showText(152)));
    setTimeout(function(){document.getElementById(data[i]).focus();document.getElementById(data[i]).select();},10);
    return false;
   }

  }
  eval('data['+i+']='+'\"'+VALUE+'\"');
 }
 showBackgroundImage('wait_message');
 getContent('','/cgi-bin/setup.cgi?ChgSystemStatus&'+data[0]+'&'+data[1]+'&'+data[2],'function:ShowChangeDevice:'+data[2]);
}

function ShowChangeDevice(msg,str){

 if(str.indexOf('NaN')!=-1){
  hiddenBackgroundImage('wait_message');
  alert(decode(showText(154)));
  GetStatusInfo();
 } else
 	Logout();
}

function AdminPassword(value){
 var re=/[\S\w]+/;

 if (!re.test(value)){
 	len="ok";
  return false;
 }
 if(value.length < 3){
  len="short";
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

function Logout(){
  document.cookie = "CD32N:"
  location.replace ('login.htm');
}

// ********************** Setup System Function End ************************ //

// ********************** Setup Network Function Start ************************ //
function GetDeviceIP(){
 showBackgroundImage('wait_message');
 getContent('','/cgi-bin/setup.cgi?GetDeviceIP','function:ShowGetDeviceIP');
}

function ShowGetDeviceIP(msg){
 msg = msg.split("\n");
 //var data = new Array("iptype","ipadd","mask","gateway","dns_1","dns_2","mtu","macaddr");
 var data = new Array("iptype","ipadd","mask","gateway","dns_1","dns_2","mtu");
 for (i=0; i<data.length && data[i] != "" ; i++){
 	var str = data[i];
  eval('data['+i+']=msg['+i+']');
  if(i==0){
   setiptype(data[i]);
  } else if(i==6){

   var Jumbo = new Array("1500","4074","7418","9000");
   var JumboFrames = window.document.getElementById('JumboFrames');
   start = '<select id=\"JumboFramesSelect\">';
   end = '</select>';
   for (j=0; j<Jumbo.length && Jumbo[j] != ""; j++){
    if (Jumbo[j]=='1500')
     ValueStr = showText(220)+'&nbsp;';
    else
     ValueStr = showText(221)+'&nbsp;';

    if (Jumbo[j]==msg[6])
     select = '<option value='+Jumbo[j]+' selected>'+ValueStr+Jumbo[j]+'&nbsp;'+showText(222)+'</option>';
    else
     select = '<option value='+Jumbo[j]+'>'+ValueStr+Jumbo[j]+'&nbsp;'+showText(222)+'</option>';

    start += select;
   }

   start += end;
   JumboFrames.innerHTML = start;

  } else {
   document.getElementById(str).value = data[i]
  }
 }
 hiddenBackgroundImage('wait_message');
}

function setiptype(iptype){
 if(iptype.indexOf('dhcp')!=-1){
  document.getElementById("iptype_dhcp").checked=true;
	 document.getElementById("ipadd").disabled=true;
  document.getElementById("mask").disabled=true;
  document.getElementById("gateway").disabled=true;
  document.getElementById("dns_1").disabled=true;
  document.getElementById("dns_2").disabled=true;
 } else {
  document.getElementById("iptype_static").checked=true;
 }
}

function OnChgType(id){
 var type = id;
 if(type.indexOf('iptype_static')!=-1){
  document.getElementById("iptype_static").checked=true;
  document.getElementById("iptype_dhcp").checked=false;
	 document.getElementById("ipadd").disabled=false;
  document.getElementById("mask").disabled=false;
  document.getElementById("gateway").disabled=false;
  document.getElementById("dns_1").disabled=false;
  document.getElementById("dns_2").disabled=false;
 } else {
  document.getElementById("iptype_dhcp").checked=true;
  document.getElementById("iptype_static").checked=false;
	 document.getElementById("ipadd").disabled=true;
  document.getElementById("mask").disabled=true;
  document.getElementById("gateway").disabled=true;
  document.getElementById("dns_1").disabled=true;
  document.getElementById("dns_2").disabled=true;
 }
}

function ChangeIPStatus(){
 //var data = new Array("ipadd","mask","gateway","dns_1","dns_2","macaddr");
 var data = new Array("ipadd","mask","gateway","dns_1","dns_2");
 var ip_addr = document.getElementById("ipadd").value;
 var gateway = document.getElementById("gateway").value;
 //var mac = document.getElementById("macaddr").value;
 var dns_1 = document.getElementById("dns_1").value;
 var dns_2 = document.getElementById("dns_2").value;
 var netmask = document.getElementById("mask").value;
 var re=/[\S\w]+/;
 var result=true;

 if (document.getElementById('iptype_static').checked==true){
  var ip = new Array("ipadd","gateway");
  var DNS = new Array("dns_1","dns_2");

  for (i=0; i<ip.length && ip[i] != "" ; i++){
   val = document.getElementById(ip[i]).value;
   if (!re.test(val)){
   	alert(decode(showText(131)));
   	setTimeout(function(){document.getElementById(ip[i]).focus();document.getElementById(ip[i]).select();},10);
    return false;
   }
   if (! Check_Ip(val,ip[i])){
    alert (val+decode(showText(157)));
    setTimeout(function(){document.getElementById(ip[i]).focus();document.getElementById(ip[i]).select();},10);
    return false;
   }
  }

  if ((!re.test(dns_1))&&(!re.test(dns_2))){
   alert(decode(showText(131)));
   setTimeout(function(){document.getElementById("dns_1").focus();document.getElementById("dns_1").select();},10);
   return false;
  } else {
   for (i=0; i<DNS.length && DNS[i] != "" ; i++){
    dns_ip = document.getElementById(DNS[i]).value;
    if (re.test(dns_ip)){
     if (! Check_Ip(dns_ip,DNS[i])){
      alert (dns_ip + decode(showText(157)));
      setTimeout(function(){document.getElementById(DNS[i]).focus();document.getElementById(DNS[i]).select();},10);
      return false;
     }
    }
   }
  }

  if (!re.test(netmask)){
   alert(decode(showText(131)));
   setTimeout(function(){document.getElementById("mask").focus();document.getElementById("mask").select();},10);
   return false;
  } else {
   if (! Check_mask(netmask,"mask")){
    alert (netmask + decode(showText(157)));
    setTimeout(function(){document.getElementById("mask").focus();document.getElementById("mask").select();},10);
    return false;
   }
  }
 }

/*
 if (!re.test(mac)){
 alert(decode(showText(158)));
  setTimeout(function(){document.getElementById("macaddr").focus();document.getElementById("macaddr").select();},10);
  return false;
 } else {
  if (! Check_mac(mac,"macaddr")){
   alert (mac + decode(showText(157))+decode(showText(158)));
   setTimeout(function(){document.getElementById("macaddr").focus();document.getElementById("macaddr").select();},10);
   return false;
  }
 }
 */

 var mtu = document.getElementById("JumboFramesSelect").value;
 var thisHREF = document.location.href;
 thisHREF = thisHREF.split( "/" );

 if (document.getElementById('iptype_static').checked==true){
  if(ip_addr==thisHREF[2]){
  	showBackgroundImage('wait_message');
   //getContent('','/cgi-bin/setup.cgi?modify_ip&static&IP='+ip_addr+'&MASK='+netmask+'&GATEWAY='+gateway+'&DNS_1='+dns_1+'&DNS_2='+dns_2+'&MAC='+mac+'&MTU='+mtu,'function:ChangeIPFinish');
   getContent('','/cgi-bin/setup.cgi?modify_ip&static&IP='+ip_addr+'&MASK='+netmask+'&GATEWAY='+gateway+'&DNS_1='+dns_1+'&DNS_2='+dns_2+'&MTU='+mtu,'function:ChangeIPFinish');
  } else {
   parent.document.location.href='http://'+ip_addr;
   //getContent('','/cgi-bin/setup.cgi?modify_ip&static&IP='+ip_addr+'&MASK='+netmask+'&GATEWAY='+gateway+'&DNS_1='+dns_1+'&DNS_2='+dns_2+'&MAC='+mac+'&MTU='+mtu,'');
   getContent('','/cgi-bin/setup.cgi?modify_ip&static&IP='+ip_addr+'&MASK='+netmask+'&GATEWAY='+gateway+'&DNS_1='+dns_1+'&DNS_2='+dns_2+'&MTU='+mtu,'');
  }

 } else {
 	showBackgroundImage('wait_message');
 	//getContent('','/cgi-bin/setup.cgi?get_dhcp_ip&'+mac,'function:DetectDHCPServer:'+mtu);
  getContent('','/cgi-bin/setup.cgi?get_dhcp_ip','function:DetectDHCPServer:'+mtu);
 }
 return result;
}

function DetectDHCPServer(msg,mtu){
	ip = msg.split( "\n" );

 var thisHREF = document.location.href;
 thisHREF = thisHREF.split( "/" );

	if(ip[0].indexOf("no_dhcp") != -1){
  alert ('No DHCP Server');
  location.replace ('setup_network.htm');
 } else {
  if(ip[0]==thisHREF[2]){
   //getContent('','/cgi-bin/setup.cgi?modify_ip&dhcp&'+mac+'&'+mtu,'function:ChangeIPFinish');
   getContent('','/cgi-bin/setup.cgi?modify_ip&dhcp&'+mtu,'function:ChangeIPFinish');
  } else {
   parent.document.location.href='http://'+ip[0];
   //getContent('','/cgi-bin/setup.cgi?modify_ip&dhcp&'+mac+'&'+mtu,'');
   getContent('','/cgi-bin/setup.cgi?modify_ip&dhcp&'+mtu,'');
  }
 }

}

function ChangeIPFinish(){
 location.replace ('setup_network.htm');
}

function Check_Ip(ip_address,evn){
 var local_ip = "127.0.0.1";
 if (ip_address == local_ip)
  return false;

 var last_length = (ip_address.length - 1);
 if (last_length == "-1"){
  return true;
 }

 var reg_all = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/;
 var error_all = ip_address.match(reg_all);
 if (error_all == null && ip_address.length != "0"){
  return false;
 }

 var reg_single = /[^0-9\.]/g;
 var error_single = ip_address.match(reg_single);
 if (error_single != null){
  return false;
 }

 for(n=0;n<ip_address.length;n++){
  var char = ip_address.charAt(n);
  if (n == "0"){
   var chart_1 = /\d/;
   var error = chart_1.exec(char);
   if (error == null){
    return false;
   }
  }
  if (n == last_length){
   var chart_last = /\d/;
   var error = chart_last.exec(char);
   if (error == null){
    return false;
   }
  }
 }

 var ip_no = ip_address.split(".");
 for(n=0;n<=3;n++){
  if ((n=="0")||(n=="3")){
   if ((ip_no[n] >= 255)||(ip_no[n] <= 0)){
    return false;
   }
  }
  else {
   if ((ip_no[n] > 255)||(ip_no[n] < 0)){
    return false;
   }
  }
 }
 return true;
}

function Check_mask(mask_address,evn){
 var last_length = (mask_address.length - 1);
 var reg_all = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/;
 var error_all = mask_address.match(reg_all);

 if (error_all == null && mask_address.length != "0"){
  return false;
 }
 var reg_single = /[^0-9\.]/g;
 var error_single = mask_address.match(reg_single);
 if (error_single != null){
  return false;
 }
 for(n=0;n<mask_address.length;n++){
  var char = mask_address.charAt(n);

  if (n == "0"){
   var chart_1 = /\d/;
   var error = chart_1.exec(char);
   if (error == null){
    return false;
   }
  }
  if (n == last_length){
   var chart_last = /\d/;
   var error = chart_last.exec(char);
   if (error == null){
    return false;
   }
  }
 }
 var mask_no = mask_address.split(".");
 for(n=0;n<=3;n++){

  if (n=="0"){
   if (mask_no[n] <= 0){
    return false;
   }
  } else {
   if ((mask_no[n] > 255)||(mask_no[n] < 0)){
    return false;
   }
  }
 }
 return true;
}

function Check_mac(mac,i){
 var reg_all = /^[a-fA-F0-9]{2}\:[a-fA-F0-9]{2}\:[a-fA-F0-9]{2}\:[a-fA-F0-9]{2}\:[a-fA-F0-9]{2}\:[a-fA-F0-9]{2}$/;
 var error_all = mac.match(reg_all);
 if (error_all == null){
  return false;
 }
 return true;
}

function Check_num(id,num){
 var reg = /(\D+)$/;
 var error = num.match(reg);
 if (error != null){
  return false;
 }
 return true;
}

function change_action(){
 var url1=window.location.href;
 userDataList = url1.split("?");

 return true;
}

function checkIP(obj){
 var sIPAddress=obj.value;
 var exp = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
 var reg = sIPAddress.match(exp);
 if(reg==null){
  alert(decode(showText(131)));
  setTimeout(function(){obj.focus();obj.select();},10)
 }
}

// ********************** Setup Network Function End ************************** //

// ********************** DISK Function Start ******************** //

function DiskUI_Status(){
 showBackgroundImage('wait_message');
 getContent('','/cgi-bin/setup.cgi?RAIDSTATUS','function:RAIDSTATUS');
}

function RAIDSTATUS(msg){
 msg = msg.split("\n");

 var data = new Array("linear","raid0","raid1");
 var RaidType = window.document.getElementById('RaidType');
 start = '<select id=\"RaidTypeSelect\">';
 end = '</select>';
 for (i=0; i<data.length && data[i] != ""; i++){
  if(data[i]=='linear')
   str = 'JBOD';
  else if(data[i]=='raid0')
   str = 'Raid 0';
  else if(data[i]=='raid1')
   str = 'Raid 1';

  if (data[i]==msg[0])
   select = '<option value='+data[i]+' selected>'+str+'</option>';
  else
   select = '<option value='+data[i]+'>'+str+'</option>';

  start += select;
 }

 start += end;
 RaidType.innerHTML = start;

 if((msg[0].indexOf('SingleDisk')!=-1)||(msg[0].indexOf('NoDisk')!=-1)){
  document.getElementById("FormatButton").disabled=true;
  document.getElementById("RaidTypeSelect").disabled=true;
 }

 if(msg[0].indexOf('NoDisk')!=-1)
  document.getElementById("RepairButton").disabled=true;

 window.document.getElementById('raid_mode').innerHTML = '<INPUT id=Old_raid_mode value=\"'+msg[0]+'\" type=hidden>';

 if(msg[1].indexOf('rebuild')!=-1)
  window.document.getElementById('rebuild').innerHTML = '<button onclick=\"Rebuid()\" />Rebuid</button>';

 parent.calcHeight('parent');

 if(msg[2].indexOf('Yes')!=-1){
  window.document.getElementById('RaidLevel').innerHTML = showText(159);
  getContent('','/cgi-bin/setup.cgi?Logical_Volumes','function:Logical_Volumes');
 } else {
  window.document.getElementById('RaidLevel').innerHTML = showText(217);
  getContent('','/cgi-bin/setup.cgi?SingleDisk_Volumes','function:SingleDisk_Volumes');
 }
}

function Logical_Volumes(Logical){
 Logical = Logical.split("\n");
 if(Logical[0].indexOf('appear')!=-1){
  Logical[0]="--"; Logical[1]="--"; Logical[2]="--"; Logical[3]="Fail";
 }

 var table_height=28;
 var oTable=window.document.getElementById('LogicalDiskData');
 var oTr=oTable.insertRow(-1);
 oTr=oTable.insertRow(-1);
 for (i=0; i<Logical.length && Logical[i] != "" ; i++){

  oCell=oTr.insertCell(i);
  oCell.style.cssText="text-align: center;color: #0000FF;";

  if(i==3){
   if((Logical[i].indexOf('Fail')!=-1)||(Logical[i].indexOf('recovery')!=-1))
    oCell.style.cssText="text-align: center;color: #E24242;";
  }

  str = Logical[i];
  oCell.style.backgroundColor="#FFFFFF";
  oCell.innerHTML=str;
 }
 parent.calcHeight('parent');
 getContent('','/cgi-bin/setup.cgi?Physical_Disks','function:Physical_Disks');
}

function SingleDisk_Volumes(msg){
 msg = msg.split("\n");
 var Old_raid_mode = window.document.getElementById('Old_raid_mode').value;
 var table_height=28;
 var oTable=window.document.getElementById('LogicalDiskData');
 var oTr=oTable.insertRow(-1);
 oTr=oTable.insertRow(-1);
 for (i=0; i<msg.length && msg[i] != "" ; i++){

  oTr=oTable.insertRow(-1);
  Data = msg[i].split(":");
  for (s=0; s<Data.length && Data[s] != "" ; s++){

   oCell=oTr.insertCell(s);
   oCell.style.cssText="text-align: center;color: #0000FF;";
   str = Data[s];

   if((s==1)||(s==2)){
    if(str.indexOf('--')!=-1)
     oCell.style.cssText="text-align: center;color: #E24242;";
   }

   if(s==3){
    if(str.indexOf('format')!=-1){
     if(Old_raid_mode.indexOf('SingleDisk')!=-1){
      DiskID='sda';
      str = '<input type=button id=\"'+DiskID+'_'+i+'\" value=\"'+showText(50)+'\" onclick=\"SingleFormat(this.id)\" />';
     } else if(Old_raid_mode.indexOf('DaulDisk')!=-1){
      if(i==0)
       DiskID='sdb';
      else
       DiskID='sda';
      str = '<input type=button id=\"'+DiskID+'_'+i+'\" value=\"'+showText(50)+'\" onclick=\"SingleFormat(this.id)\" />';
     }
    } else if(str.indexOf('No Disk')!=-1){
     oCell.style.cssText="text-align: center;color: #E24242;";
    }
   }

   oCell.style.backgroundColor="#FFFFFF";
   oCell.innerHTML=str;
  }
 }
 parent.calcHeight('parent');
 getContent('','/cgi-bin/setup.cgi?Physical_Disks','function:Physical_Disks');
}

function Physical_Disks(msg){
 Physical = msg.split("\n");

 var table_height=28;
 var oTable=window.document.getElementById('PhysicalDiskData');
 var oTr=oTable.insertRow(-1);
 oTr=oTable.insertRow(-1);
 for (k=0; k<Physical.length && Physical[k] != "" ; k++){

  oTr=oTable.insertRow(-1);
  Data = Physical[k].split(":");
  for (s=0; s<Data.length && Data[s] != "" ; s++){

   oCell=oTr.insertCell(s);
   oCell.style.cssText="text-align: center;color: #0000FF;";
   str = Data[s];

   if(s==0){
    if(str.indexOf('SCSI0')!=-1)
     str="Drive (Right)"

    if(str.indexOf('SCSI1')!=-1)
     str="Drive (Left)"
   }

   if(s==3){
    if(str.indexOf('Ready')!=-1)
     oCell.style.cssText="text-align: center;color: #008800;";

    if(str.indexOf('No Disk')!=-1)
     oCell.style.cssText="text-align: center;color: #E24242;";
   }

   if(s==4){
    if((Data[s].indexOf('removed')!=-1)||(Data[s].indexOf('rebuilding')!=-1))
     oCell.style.cssText="text-align: center;color: #E24242;";
   }

   oCell.style.backgroundColor="#FFFFFF";
   oCell.innerHTML=str;
  }
 }
 window.document.getElementById("Disk").innerHTML = '<INPUT id=\"DiskData\" value=\"'+msg+'\" type=hidden>';
 parent.calcHeight('parent');
 getContent('','/cgi-bin/setup.cgi?USB_Disks','function:USB_Disks');
}

function USB_Disks(USB){
 USB = USB.split("\n");
 for (i=0; i<USB.length && USB[i] != "" ; i++){
  getContent('','/cgi-bin/setup.cgi?USB_Disks_Data&'+USB[i],'function:USB_Disks_Data');
 }
 parent.calcHeight('parent');
 hiddenBackgroundImage('wait_message');
}

function USB_Disks_Data(USBDiskData){
 USBDiskData = USBDiskData.split("\n");

 var table_height=28;
 var oTable=window.document.getElementById('USBDiskData');
 var oTr=oTable.insertRow(-1);
 oTr=oTable.insertRow(-1);
 for (j=0; j<USBDiskData.length && USBDiskData[j] != "" ; j++){

  oCell=oTr.insertCell(j);
  oCell.style.cssText="text-align: center;color: #0000FF;";

  str = USBDiskData[j];
  oCell.style.backgroundColor="#FFFFFF";
  oCell.innerHTML=str;
 }
 parent.calcHeight('parent');
}

function OnChgRAIDStatus(id){
 if(id.indexOf('linear')!=-1){
  document.getElementById("linear").checked=true;
  document.getElementById("raid0").checked=false;
  document.getElementById("raid1").checked=false;
 } else if(id.indexOf('raid0')!=-1){
  document.getElementById("linear").checked=false;
  document.getElementById("raid0").checked=true;
  document.getElementById("raid1").checked=false;
 } else if(id.indexOf('raid1')!=-1){
  document.getElementById("linear").checked=false;
  document.getElementById("raid0").checked=false;
  document.getElementById("raid1").checked=true;
 } else {
  document.getElementById("linear").checked=false;
  document.getElementById("raid0").checked=false;
  document.getElementById("raid1").checked=false;
 }
}

function Rebuid(){
 showBackgroundImage('wait_message');
 getContent('','/cgi-bin/setup.cgi?rebuild_info','function:Rebuid_action');
}

function Rebuid_action(msg){
 hiddenBackgroundImage('wait_message');
 rebuild_info = msg.split("^");

 if(rebuild_info[1].indexOf('sda')!=-1)
  str = 'Drive 1 --> Drive 2';
 else
  str = 'Drive 2 --> Drive 1';

 if(rebuild_info[0].indexOf('small')!=-1){
  alert(decode(showText(170)));
 } else {

  var sure = confirm(decode(showText(171))+'\n'+str);
  if(sure){
   showBackgroundImage('wait_message');
   getContent('','/cgi-bin/setup.cgi?raid1_rebuild','function:REBUILDSTATUS');
  }
 }
}

function REBUILDSTATUS(){
 hiddenBackgroundImage('wait_message');
}

function CreateRaid(){
 var newMode = document.getElementById('RaidTypeSelect').value;
 format_action(newMode);
}

function format_action(newMode){
 if(newMode.indexOf('empty')!=-1){
 	alert(decode(showText(172)));
  return;
 }

 if(newMode.indexOf('linear')!=-1)
  var str = 'JBOD';
 else
  var str = newMode;

 var sure = confirm(decode(showText(216))+decode(showText(46))+': '+str+' ?');
 if(sure){
  showBackgroundImage('wait_message');
  getContent('','/cgi-bin/setup.cgi?format_hdd&'+newMode,'function:formatOK');
 } else {
  var Old_raid_mode = document.getElementById("Old_raid_mode").value;
  OnChgRAIDStatus(Old_raid_mode);
 }
}

function SingleFormat(DiskID){
 var sure = confirm(decode(showText(173)));
 if(sure){
  showBackgroundImage('wait_message');
  getContent('','/cgi-bin/setup.cgi?SingleFormat&'+DiskID,'function:formatOK');
 } else
  return;
}

function formatOK(msg){
	hiddenBackgroundImage('wait_message');
  alert(decode(showText(132)));
  location.replace ('system_reboot.htm');
}

function scandisk_action(){
 var sure = confirm(decode(showText(169)));
 if(sure){
  showBackgroundImage('wait_message');
  getContent('','/cgi-bin/setup.cgi?scandisk_hdd','function:scandiskOK');
 }
}

function scandiskOK(msg){
	hiddenBackgroundImage('wait_message');
	alert(decode(showText(133)));
}

function CancelSingleFormat(id){
 closePopWindow(id);
 var Old_raid_mode = document.getElementById("Old_raid_mode").value;
 OnChgRAIDStatus(Old_raid_mode);
}

function refresh(){
 location.replace ('setup_disk.htm');
}

// ********************** DISK Function End ********************** //
