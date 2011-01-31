var default_language = 'uk';
var language = getCookie('language');
var file = 'languages/' + language + '.txt';
var tekst = readFile(file);
var tekst_array = tekst.split("~");

function getCookie(c_name)
	{
	if (document.cookie.length>0)
		{
		c_start=document.cookie.indexOf(c_name + "=")
		if (c_start!=-1)
			{
			c_start=c_start + c_name.length+1
			c_end=document.cookie.indexOf(";",c_start)
			if (c_end==-1) c_end=document.cookie.length
			return unescape(document.cookie.substring(c_start,c_end))
		}
	}
	return default_language;
}

function calcHeight(source)
{
 	if(source=='parent'){
 	 var browser=navigator.userAgent.toLowerCase();
 	 if (browser.indexOf('safari/') == -1){
		 var extra=25;
		}
		else{
			var extra=0;
		}
  	//find the height of the internal page
  	var the_height=document.getElementById('iframe').contentWindow.document.body.scrollHeight;
  	//change the height of the iframe
  	document.getElementById('iframe').height=the_height + extra;
  }else{
			//find the height of the internal page
  	var the_height=parent.document.getElementById('iframe').contentWindow.document.body.scrollHeight;
  	//change the height of the iframe
  	parent.document.getElementById('iframe').height=the_height + extra;
	}
}

function swapClass(main){
	var items=['one','two','three','four','five'];
	for (var i in items){
		if (items[i]==main){
			document.getElementById(items[i]).className="on";
		}else{
		 	document.getElementById(items[i]).className="off";
		}
	}
}

function readFile(url){
  var xmlhttp;
  /*@cc_on
  @if (@_jscript_version >= 5)
    try {
      xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
    } catch (e) {
      try {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
      } catch (E) {
        xmlhttp = false;
      }
    }
  @else
  xmlhttp = false;
  @end @*/

  if (!xmlhttp && typeof XMLHttpRequest != 'undefined') {
    try {
      xmlhttp = new XMLHttpRequest();
    } catch (e) {
      xmlhttp = false;
    }
  }
  xmlhttp.open("GET",url,false);
  xmlhttp.send(null);
  return xmlhttp.responseText;
}

function showMsg(msg)
{
	switch(msg){
	case "ok":
		alert("Your modifications have been saved.");
		break;
	}
}

function showText(number) {
	return tekst_array[number];
}

function decode(code){
code=code.replace(/"/g,'\\"');
code='"  '+code+'  "';
code=(eval(code));
return code
}

function statusLink(index){
	var picArry=new Array();
	for(i=1;i<=4;i++){
		picArry[i]=(i==index)?" class=\"actief\"":""
	}
	document.write("<li"+picArry[1]+"><a href=\"status.htm\">"+(showText(0))+"</script></a></li>");
	document.write("<li"+picArry[2]+"><a href=\"log_system.htm\" target=\"iframe\">"+(showText(7))+"</a></li>");
	document.write("<li"+picArry[3]+"><a href=\"log_event.htm\" target=\"iframe\">"+(showText(8))+"</script></a></li>");
	document.write("<li"+picArry[4]+"><a href=\"log_connect.htm\" target=\"iframe\">"+(showText(9))+"</a></li>");
}

function setupLink(index){
	var picArry=new Array();
	for(i=1;i<=4;i++){
		picArry[i]=(i==index)?" class=\"actief\"":""
	}
	document.write("<li"+picArry[1]+"><a href=\"setup_system.htm\">"+(showText(10))+"</script></a></li>");
	document.write("<li"+picArry[2]+"><a href=\"setup_network.htm\" target=\"iframe\">"+(showText(11))+"</a></li>");
	document.write("<li"+picArry[3]+"><a href=\"setup_disk.htm\" target=\"iframe\">"+(showText(12))+"</script></a></li>");
	document.write("<li"+picArry[4]+"><a href=\"setup_date.htm\" target=\"iframe\">"+(showText(13))+"</a></li>");
}

function userLink(index){
	var picArry=new Array();
	for(i=1;i<=2;i++){
		picArry[i]=(i==index)?" class=\"actief\"":""
	}
	document.write("<li"+picArry[1]+"><a href=\"user.htm\">"+(showText(14))+"</script></a></li>");
	document.write("<li"+picArry[2]+"><a href=\"share.htm\" target=\"iframe\">"+(showText(15))+"</a></li>");
}

function servicesLink(index){
	var picArry=new Array();
	for(i=1;i<=4;i++){
		picArry[i]=(i==index)?" class=\"actief\"":""
	}

 var thisHREF = document.location.href;
 thisHREF = thisHREF.split( "/" );
 var IP = thisHREF[2];

	document.write("<li"+picArry[1]+"><a href=\"bt.htm\">"+(showText(16))+"</script></a></li>");
	document.write("<li"+picArry[2]+"><a href=\"media_itunes.htm\" target=\"iframe\">"+(showText(17))+"</a></li>");
	//document.write("<li"+picArry[3]+"><a href=\"media_upnp.htm\" target=\"iframe\">"+(showText(18))+"</script></a></li>");
	document.write("<li"+picArry[3]+"><a href=\"http://"+IP+":9000/config\" target=\"_blank\">"+(showText(18))+"</script></a></li>");
	document.write("<li"+picArry[4]+"><a href=\"ftp.htm\" target=\"iframe\">"+(showText(19))+"</a></li>");
}

function toolboxLink(index){
	var picArry=new Array();
	for(i=1;i<=2;i++){
		picArry[i]=(i==index)?" class=\"actief\"":""
	}
	document.write("<li"+picArry[1]+"><a href=\"default.htm\">"+(showText(20))+"</script></a></li>");
	document.write("<li"+picArry[2]+"><a href=\"firmware.htm\" target=\"iframe\">"+(showText(21))+"</a></li>");
}

function showBackgroundImage(msg){
 if(msg.indexOf("wait_") != -1){
	$.blockUI({
	message:'<img src=pictures/indicator_medium.gif class=loading>&nbsp;&nbsp;&nbsp;&nbsp;<font style=\"font-weight: bold;font-size: 15pt;vertical-align: super;\">Loading.....</font>',
		css:{border:'5px solid white',background:'#d7e0ef',padding:'10px',color:'#3c5d86'}
	});
 } else {
  document.getElementById(msg).style.backgroundRepeat="no-repeat";
  document.getElementById(msg).style.backgroundImage="url(pictures/indicator_medium.gif)";
 }
}

function hiddenBackgroundImage(msg){
 if(msg.indexOf("wait_") != -1){
	$.unblockUI();
 } else {
  document.getElementById(msg).style.backgroundImage="url(none)";
 }
}

function showPopWindow(obj){
 var DivRef = document.getElementById(obj);
 var IfrRef = document.getElementById('DivShim');

 if(IfrRef == null){
  IfrRef = document.createElement("IFRAME");
  IfrRef.id = "DivShim";
  DivRef.parentNode.appendChild(IfrRef);
 }

 DivRef.style.display = "block";
 IfrRef.style.width = DivRef.offsetWidth;
 IfrRef.style.height = DivRef.offsetHeight;
 IfrRef.style.position = "absolute";
 IfrRef.style.top =  DivRef.style.top;
 IfrRef.style.left = DivRef.style.left;
 DivRef.style.zIndex = 100;
 IfrRef.style.zIndex = DivRef.style.zIndex - 1;
 IfrRef.style.display = "block";

 initDrag();
}

function closePopWindow(obj){
 document.getElementById(obj).style.display="none";
 document.getElementById("DivShim").style.display="none";

 endDrag();
}


/*
 * Drag and Drop
 */
var mousex = 0;
var mousey = 0;
var grabx = 0;
var graby = 0;
var orix = 0;
var oriy = 0;
var elex = 0;
var eley = 0;

var dragobj = null;
var dragShim = null;

function falsefunc() { return false; } // used to block cascading events

function initDrag()
{
  document.onmousemove = update; // update(event) implied on NS, update(null) implied on IE
  //update();
}

function endDrag()
{
	document.onmousemove = null;
}

function getMouseXY(e) // works on IE6,FF,Moz,Opera7
{
  if (!e) e = window.event; // works on IE, but not NS (we rely on NS passing us the event)

  if (e)
  {
    if (e.pageX || e.pageY)
    { // this doesn't work on IE6!! (works on FF,Moz,Opera7)
      mousex = e.pageX;
      mousey = e.pageY;
    }
    else if (e.clientX || e.clientY)
    { // works on IE6
      mousex = e.clientX + document.body.scrollLeft;//加上捲軸的位置
      mousey = e.clientY + document.body.scrollTop;//加上捲軸的位置
    }
  }
}

function update(e)
{
  getMouseXY(e); // NS is passing (event), while IE is passing (null)
}

function grab(context)
{
  document.onmousedown = falsefunc; // in NS this prevents cascading of events, thus disabling text selection
  dragobj = context;
  dragShim = document.getElementById("DivShim");
  document.onmousemove = drag;
  grabx = mousex;
  graby = mousey;
  elex = orix = parseInt(dragobj.style.left,10);//轉成整數(指定原為10進位)
  eley = oriy = parseInt(dragobj.style.top,10);
  update();
}

function drag(e) // parameter passing is important for NS family
{
  if (dragobj)
  {
    elex = orix + (mousex-grabx);
    eley = oriy + (mousey-graby);
    dragobj.style.left = (elex).toString(10) + 'px';//轉成10進位的字串
    dragobj.style.top  = (eley).toString(10) + 'px';
    dragShim.style.left = dragobj.style.left;
    dragShim.style.top  = dragobj.style.top;
  }
  update(e);
  return false; // in IE this prevents cascading of events, thus text selection is disabled
}

function drop()
{
  if (dragobj)
  {
    dragobj = null;
	dragShim = null;
  }
  update();
  document.onmousemove = update;
  document.onmousedown = null;   // re-enables text selection on NS
}
