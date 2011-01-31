function EvenKey(){
 ns4 = (document.layers) ? true : false;
 ie4 = (document.all) ? true : false;

 document.onkeydown = keyDown;
 if(ns4)
  document.captureEvents(Event.KEYDOWN);
}

function keyDown(e){
 var intKey = 0;
 e= (window.event)? event : e;
 intKey = (e.keyCode)? e.keyCode: e.charCode;
 if (intKey == 13) LoginSubmit();
}

function LoginSubmit(){
 var UserName = document.getElementById("UserName").value;
 var UserPasswd = document.getElementById("UserPasswd").value;
 getContent('','/cgi-bin/setup.cgi?webmaster&'+UserName+'&'+UserPasswd,"function:CheckLogin");
}

function CheckLogin(msg){
 msg = msg.split("\n");
 if(msg[0]=="OK"){
  document.cookie = "CD32N:MD-253"
  location.replace ('status.htm');
 } else {
  document.getElementById("UserName").value = '';
  document.getElementById("UserPasswd").value = '';
  alert(decode(showText(219)));
  setTimeout(function(){document.getElementById("UserName").focus();},10);
  return false;
 }
}

function LoginCancel(){
 document.getElementById("UserName").value = '';
 document.getElementById("UserPasswd").value = '';
 setTimeout(function(){document.getElementById("UserName").focus();},10);
}

function Logout(){
  document.cookie = "CD32N:"
  location.replace ('index.html');
}
