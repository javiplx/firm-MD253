function StopRefresh()
{
if (window.myRefresh && window.clearTimeout)
window.clearTimeout(myRefresh);
}

function StartRefresh()
{
if (window.setTimeout && window.location && window.location.reload)
myRefresh = window.setTimeout("window.location.reload()", 10000);
}
	

// disable submit on enter for text input in forms 
function noenter(e)
{
 var key;
 if(window.event)
      key = window.event.keyCode;     //IE
 else
      key = e.which;     //firefox
 if(key == 13)
      return false;
 else
      return true;
}

function clearLog()
{
	loadXMLDoc("/rpc/log_clear","");
}

function getLog()
{ 
	window.open('/rpc/log_getfile');
}

function stopServer()
{
	loadXMLDoc("/rpc/stop","");
}

function setClientEnable(mac,enabled)
{
	//alert(mac + ":" + enabled);
	if (enabled=='1') {
		loadXMLDoc("/rpc/client_enable?mac="+mac,"");
	}
	else {
		loadXMLDoc("/rpc/client_disable?mac="+mac,"");
	}	
}


function addClient(mac,client_id,enabled)
{
	//alert(mac + ":" + client_id + ":" + enabled);
	loadXMLDoc("/rpc/client_add?mac="+mac+"?id="+client_id+"?enabled="+enabled,"");
}

function removeClient(mac)
{
	//alert(mac);
	loadXMLDoc("/rpc/client_delete?mac="+mac,"");
}

function rescanDirectories()
{
	loadXMLDoc("/rpc/rescan","");
	var tmp_str = translateOption("rescanalert");
	alert(tmp_str);
}

function rebuiltDB()
{
	var tmp_str = translateOption("rebuiltalert");
	alert(tmp_str);
	parent.location.href='/rpc/rebuild';
	//loadXMLDoc("/rpc/rebuild","");
	//var tmp_str = translateOption("rebuiltalert");
	//alert(tmp_str);
}


function resetClients()
{
	parent.location.href='/rpc/resetclients';
}


function resetDefaults()
{
	loadXMLDoc("/rpc/reset","");
	var tmp_str = translateOption("resetalert");
	alert(tmp_str);
	parent.location.href='/rpc/restart';
	//var tmp_str = translateOption("resetalert");
	//alert(tmp_str);
}

function loadXMLDoc(my_url,strData) {
	var req;
	req = false;
	// branch for native XMLHttpRequest object
	if(window.XMLHttpRequest) {
		try {
			req = new XMLHttpRequest();
		} catch(e) {
			req = false;
		}
		// branch for IE/Windows ActiveX version
		} else if(window.ActiveXObject) {
		try {
			req = new ActiveXObject("Msxml2.XMLHTTP");
		} catch(e) {
			try {
				req = new ActiveXObject("Microsoft.XMLHTTP");
			} catch(e) {
				req = false;
			}
		}
	}
	if(req) {
//		my_url = "http://127.0.0.1:9000" + my_url;
		if (strData.length>0) {  // post request
		  req.open("POST", my_url, false);
	  	//req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	  	req.setRequestHeader('Content-Type', 'text/xml; charset=UTF-8');
  	  req.send(strData);			
		}
		else { // get request
			req.open("GET", my_url, false);
			req.send("");
		}
		return req.responseText;
	}
	return "";
}

var name_array=new Array();
var value_array=new Array();
var values_loaded=0;

function getAllValues() {
	var nPos=0;
	var nTotal=0;
	
	big_string=loadXMLDoc("/rpc/get_all","");
	all_values_array=big_string.split("\n");
	for (i=0;i<all_values_array.length;i++) {
		one_pair=all_values_array[i].split("=");
		if (one_pair.length>1) {
			name_array[i]=one_pair[0];
			//value_array[i]=one_pair[1];
			nTotal=one_pair[1].length;
			nPos=0;
			value_array[i]='';
			while((nPos < nTotal) && (one_pair[1].charAt(nPos)>=' ')) {
				value_array[i]=value_array[i]+one_pair[1].charAt(nPos);
				nPos++;
			}
		}
	}		
	values_loaded=1;
}

function getValue(strName) {
	// init call
	if (!values_loaded) getAllValues();
	// now look for the value
	for (i=0;i<name_array.length;i++) {
		if (name_array[i]==strName) return value_array[i];
	}
	return "";
	//return loadXMLDoc("/rpc/get_option?"+strName);
}

var new_values='';

function setValue(strName,strValue) {
	new_values=new_values+strName+"="+strValue+"\n";
	return strValue;
	//return loadXMLDoc("/rpc/set_option?"+strName+"="+strValue,"");
}

function setAllValues() {
	return loadXMLDoc("/rpc/set_all",new_values);
}

var strLanguageFile='';
var strLanguageFileRetrieved=0;

function translateOption(strName) {
	var strRC='';
	var nTotal=0;
	var nPos=0;
	var strSearch='';
	if (!strLanguageFileRetrieved) {
		strLanguageFileRetrieved=1;
		strLanguageFile=loadXMLDoc("/rpc/get_language_file","");
	}
	strSearch="|"+strName+"|";
	nPos=strLanguageFile.indexOf(strSearch);
	if (nPos<0) return strName; // not found
	nPos=nPos+strSearch.length;
	nTotal=strLanguageFile.length;
	while((nPos < nTotal) && (strLanguageFile.charAt(nPos)>=' ')) {
		strRC=strRC+strLanguageFile.charAt(nPos);
		nPos++;
	}
	return strRC;
	//return loadXMLDoc("/rpc/translate_option?"+strName,"");
}

function translateHelp(strName) {
	var strRC='';
	var nTotal=0;
	var nPos=0;
	var strSearch='';
	if (!strLanguageFileRetrieved) {
		strLanguageFileRetrieved=1;
		strLanguageFile=loadXMLDoc("/rpc/get_language_file","");
	}
	strSearch="|"+strName+"?";
	nPos=strLanguageFile.indexOf(strSearch);
	if (nPos<0) return strName; // not found
	nPos=nPos+strSearch.length;
	nTotal=strLanguageFile.length;
	while((nPos < nTotal) && (strLanguageFile.charAt(nPos)>=' ')) {
		strRC=strRC+strLanguageFile.charAt(nPos);
		nPos++;
	}
	return strRC;
	//return loadXMLDoc("/rpc/translate_help?"+strName,"");
}

function getVersion() {
	return loadXMLDoc("/rpc/version","");
}

// Helper function to get element by id.
function getElement( element_id ) 
{
	return document.getElementById( element_id );
}

// remove div with help window
function hideHelp() 
{
	var divHelp = 'helpDialog_div';
	if ( getElement(divHelp)) 
	{
		getElement(divHelp).parentNode.removeChild(getElement(divHelp));
	} 
}
	
	var strDir = "";

function hideDir() 
{
	var divDir = 'dirDialog_div';
	if ( getElement(divDir)) 
	{
		getElement(divDir).parentNode.removeChild(getElement(divDir));
	} 
}

function hideSelect()
{if (document.all){document.all.divContentdir.style.visibility="hidden";}}

function unhideSelect()
{if (document.all){document.all.divContentdir.style.visibility="visible";}}


function showFile(optionName) 
{ 
	var divDir = 'dirDialog_div';
	var newDiv = document.createElement('div');
  var object = document.getElementById( 'divPopup' );
	hideDir();
  hideSelect();
	newDiv.id = divDir;
	newDiv.className = 'dir_dialog';
	newDiv.style.zIndex = 99999;
	object.appendChild(newDiv); 	
	showDirselection('', '', optionName,1,0);	  
}



function showDir(optionName) 
{
	var divDir = 'dirDialog_div';
	var newDiv = document.createElement('div');
  var object = document.getElementById( 'divPopup' );
  hideSelect();
	hideDir();
	newDiv.id = divDir;
	newDiv.className = 'dir_dialog';
	newDiv.style.zIndex = 99999;
	object.appendChild(newDiv); 	
	showDirselection('', '', optionName,0,0);	  
}



function dirSelected(strDir,inputName)
{ 
	  var contentObject = document.getElementById(inputName);
		//alert(inputName +":"+contentObject);
	  contentObject.value = strDir;
	  if (strDir.charAt(strDir.length-1) == ':') contentObject.value=contentObject.value+'\\'; // add backslash for drive volumes on windows
		hideDir();
		unhideSelect();
}



function dirQuit()
{
	hideDir();
	unhideSelect();
}

	
function showDirselection(completePath, completePathIndex, optionName, fileSelector, fileSelected)
{
	var str_html='';
	var str_line='';
	var	str_Delimiter='';
	var str_first_line='';
	var str_first_line_index='';
  var div_dirselect = document.getElementById( 'dirDialog_div' );
  
  //alert(completePath);
  //alert(completePathIndex);
	
	if (div_dirselect)
	{
		var str_dir = loadXMLDoc("/rpc/getdir?path=" + completePathIndex,"")
		var str_dir_array=str_dir.split("\n");
		var str_slash=str_dir_array[0];
		
		if ((completePath.charAt(0)=='/') && (completePathIndex.charAt(0)!='/')) completePathIndex="/"+completePathIndex;
		
		var str_first_line_array=completePath.split(str_slash);
		var str_first_line_array_index=completePathIndex.split(str_slash);
		

		str_escaped_slash="";
		if (str_slash=='\\') {
			str_escaped_slash="\\";
		}

		if (completePath.length > 0) {
			// first entry - reset - start navigation
			str_html="<IMG src=\"/images/arrow_test_small.gif\" />" +
			  			 "<A href=\"javascript:void(0)\" onclick=\"showDirselection('','','"+optionName+"',"+fileSelector+","+fileSelected+")\">*</A>&nbsp;";
		}

		for (i=0;i<str_first_line_array.length;i++) {
			  if (str_first_line_array[i].length > 0) {
	 				if (i>0) {
	 					str_first_line=str_first_line+str_slash+str_escaped_slash+str_first_line_array[i];
	 					str_first_line_index=str_first_line_index+str_slash+str_escaped_slash+str_first_line_array_index[i];
	 				}
	 				else {
	 					str_first_line=str_first_line_array[i];
	 					str_first_line_index=str_first_line_array_index[i];
	 				}
	 				if (fileSelected && (i==str_first_line_array.length-1)) {
		 				str_line="<IMG src=\"/images/arrow_test_small.gif\" />" + str_first_line_array[i] + "&nbsp;";
	 				}
	 				else {
		 				str_line="<IMG src=\"/images/arrow_test_small.gif\" />" +
							  		"<A href=\"javascript:void(0)\" onclick=\"showDirselection('"+
		 				         str_first_line + "','" +
		 				         str_first_line_index + "','" +
		 				         optionName+ "',"  +
		 				         fileSelector+ ",0" +
		 				         ")\">" + str_first_line_array[i] + "</A>&nbsp;";
		 			}
	 				str_html=str_html+str_line;
	 			}
		}
				
		// add select button
		if (fileSelector) {
			if (fileSelected) {
				str_html=str_html+"&nbsp;<INPUT class=\"button\" TYPE=\"button\" NAME=\"selectdir\" Value=\"" + translateOption("select") + "\" onClick=\"dirSelected('"+
				          str_first_line+"','"+optionName+"')\">&nbsp;<INPUT class=\"button\" TYPE=\"button\" NAME=\"quit\" Value=\"" + translateOption("quit") + "\" onClick=\"dirQuit()\">"
			}
			else {
				str_html=str_html+"<INPUT class=\"button\" TYPE=\"button\" NAME=\"quit\" Value=\"" + translateOption("quit") + "\" onClick=\"dirQuit()\">"
			}
		}
		else {
			if (completePath.length>0) {
				str_html=str_html+"&nbsp;<INPUT class=\"button\" TYPE=\"button\" NAME=\"selectdir\" Value=\"" + translateOption("select") + "\" onClick=\"dirSelected('"+
				          str_first_line+"','"+optionName+"')\">&nbsp;<INPUT class=\"button\" TYPE=\"button\" NAME=\"quit\" Value=\"" + translateOption("quit") + "\" onClick=\"dirQuit()\">"
			}
			else {
				str_html=str_html+"<INPUT class=\"button\" TYPE=\"button\" NAME=\"quit\" Value=\"" + translateOption("quit") + "\" onClick=\"dirQuit()\">"
			}
		}	  
	  
	  str_html=str_html+"<hr>";
		
		if (!fileSelected) { // only show more selections if we do not have already seletced a file
			for (i=1;i<str_dir_array.length;i++) {
				if (str_dir_array[i].charAt(3) == 'D') {
	 				str_line="<A href=\"javascript:void(0)\" onclick=\"showDirselection('"+ str_first_line;
	 				if (str_first_line.length > 0)  str_line=str_line+str_slash+str_escaped_slash;
	 				str_line=str_line+str_dir_array[i].substring(4);
	 				if (str_line.charAt(str_line.length-1) == str_slash) str_line=str_line+str_escaped_slash;
	 				str_line=str_line+"','" + str_first_line_index;
	 				if (str_first_line_index.length > 0)  str_line=str_line+str_slash+str_escaped_slash;
	 				str_line=str_line+ str_dir_array[i].substring(0,3)  + "','" ;
	 				str_line=str_line+optionName+"'," + fileSelector+ ",0" + ")\">" + str_dir_array[i].substring(4) + "</A>";
	 				str_html=str_html+str_line+"<br>";
	 			}
	 		}
	
			// show files if we have a file selector
			if (fileSelector) {
				for (i=1;i<str_dir_array.length;i++) {
					if (str_dir_array[i].charAt(3) == 'F') {
		 				str_line="<A href=\"javascript:void(0)\" onclick=\"showDirselection('"+ str_first_line;
		 				if (str_first_line.length > 0)  str_line=str_line+str_slash+str_escaped_slash;
		 				str_line=str_line+str_dir_array[i].substring(4);
		 				if (str_line.charAt(str_line.length-1) == str_slash) str_line=str_line+str_escaped_slash;
		 				str_line=str_line+"','" + str_first_line_index;
		 				if (str_first_line_index.length > 0)  str_line=str_line+str_slash+str_escaped_slash;
		 				str_line=str_line+ str_dir_array[i].substring(0,3)  + "','" ;
		 				str_line=str_line+optionName+"'," + fileSelector+ ",1" + ")\">" + str_dir_array[i].substring(4) + "</A>";
		 				str_html=str_html+str_line+"<br>";
		 			}
		 		}
			}
		}
					
		div_dirselect.innerHTML = str_html;
  }
}



function rescanDirs() 
{
		return loadXMLDoc("/rpc/rescan","");	
}

// Video nodes
var videonodeCount = 0;
var str_addVideoLevel = "";
var navitreeTypeVideo = "Custom";

function selectTypeVideo(myname,type_selected)
{ 
	var select_string = "<SELECT class=\"inputValue\" name='type_" + myname + "'>";
	if ( type_selected == 'newLevel')
    {select_string = select_string + "<option class=alert value='newLevel' selected>Specify type!</option>"; }
  if (( type_selected == '') || (type_selected == '-'))
    {select_string = select_string + "<option value='-' selected> &nbsp;</option>";}
  else
    {select_string = select_string + "<option value='-'> &nbsp;</option>";}
  if ( type_selected == 'PATH') 
    {select_string = select_string + "<option value='%PATH' selected>" + translateOption("folder") + "</option>";}
  else
    {select_string = select_string + "<option value='%PATH'>" + translateOption("folder") + "</option>";}
  if ( type_selected == 'ALBUM') 
    {select_string = select_string + "<option value='%ALBUM' selected>" + translateOption("album") + "</option>";}
  else
    {select_string = select_string + "<option value='%ALBUM'>" + translateOption("album") + "</option>";}
  if ( type_selected == 'GENRE') 
    {select_string = select_string + "<option value='%GENRE' selected>" + translateOption("genre") + "</option>";}
  else
    {select_string = select_string + "<option value='%GENRE'>" + translateOption("genre") + "</option>";}
  if ( type_selected == 'TITLE') 
    {select_string = select_string + "<option value='%TITLE' selected>" + translateOption("title") + "</option>";}
  else
    {select_string = select_string + "<option value='%TITLE'>" + translateOption("title") + "</option>";}
  if ( type_selected == 'DATE') 
    {select_string = select_string + "<option value='%DATE' selected>" + translateOption("date") + "</option>";}
  else
    {select_string = select_string + "<option value='%DATE'>" + translateOption("date") + "</option>";}
  if ( type_selected == 'DAY') 
    {select_string = select_string + "<option value='%DAY' selected>" + translateOption("day") + "</option>";}
  else
    {select_string = select_string + "<option value='%DAY'>" + translateOption("day") + "</option>";}
  if ( type_selected == 'MONTH') 
    {select_string = select_string + "<option value='%MONTH' selected>" + translateOption("month") + "</option>";}
  else
    {select_string = select_string + "<option value='%MONTH'>" + translateOption("month") + "</option>";}
   if ( type_selected == 'YEAR') 
    {select_string = select_string + "<option value='%YEAR' selected>" + translateOption("year") + "</option>";}
  else
    {select_string = select_string + "<option value='%YEAR'>" + translateOption("year") + "</option>";} 
  if ( type_selected == 'KEYWORD') 
    {select_string = select_string + "<option value='%KEYWORD' selected>" + translateOption("keyword") + "</option>";}
  else
    {select_string = select_string + "<option value='%KEYWORD'>" + translateOption("keyword") + "</option>";}
  if ( type_selected == 'RATING') 
    {select_string = select_string + "<option value='%RATING' selected>" + translateOption("rating") + "</option>";}
  else
    {select_string = select_string + "<option value='%RATING'>" + translateOption("rating") + "</option>";}
  if ( type_selected == 'DESCRIPTION') 
    {select_string = select_string + "<option value='%DESCRIPTION' selected>" + translateOption("description") + "&nbsp; &nbsp; &nbsp;</option>";}
  else
    {select_string = select_string + "<option value='%DESCRIPTION'>" + translateOption("description") + "&nbsp; &nbsp; &nbsp;</option>";}
  if ( type_selected == 'RESOLUTION') 
    {select_string = select_string + "<option value='%RESOLUTION' selected>" + translateOption("resolution") + "</option>";}
  else
    {select_string = select_string + "<option value='%RESOLUTION'>" + translateOption("resolution") + "</option>";}
  select_string = select_string + "</SELECT>";
  return select_string;
}

var videonodeCount_str=0;

function showVideoNodes() 
{
	var allNodes = "";
	
	var alpha = new Array (10);
	var node_type = new Array (10);
	var optionName = translateOption("videonode");
	var optionName_internal = "videonode";
	var optionValue = "";
	videonodeCount=0;
	allNodes = allNodes + " <table class=\"optionItem\"><tr><td class=\"optionName\">&nbsp;";
  allNodes = allNodes + "<td class=\"optionHeading\" width=\"200\">" + translateOption('name');
  allNodes = allNodes + "<td class=\"optionHeading\" width=\"130\">" + translateOption('type');
  allNodes = allNodes + "<td class=\"optionHeading\">ABC";
  allNodes = allNodes + "<\/tr><\/table>";
	

	for ( var i = 1; i < 6; i++)
	{ 
		var optionNumber = parseInt(i);
	  var optionNumberedName = optionName + optionNumber;
	  if (!enable_cancel_videotree) new_video_treeArray [i-1] = getValue("videonode"+optionNumber);
	  optionValue = new_video_treeArray [i-1];
	  var first = true;
	  for ( var n = 0; n < 5; n++) {node_type[n] = ""; alpha[n] = "-";}
	  var node_type_index = 0;
	  
	  if (optionValue != "")	  	  
// extract node description
	  { 
		  var nodeArray = optionValue.split(",");

		  var node_name = nodeArray[0];
		  var level = nodeArray.length;
		  if (node_name != "")
		  { 
			  for (var j = 1; j < level; j++)
			  { 
				  if (nodeArray[j].substring(0,1) == "[") 
		// alpha defined	
				    {
				  	var tmp_arr = nodeArray[j].split("%");
				  	alpha[node_type_index] = nodeArray[j].substring(1,2);
				  	node_type[node_type_index]= tmp_arr[1];
			      }
		// alpha not defined	      
				  else
				  {
				  	alpha[node_type_index] = "-"; 
				  	if (nodeArray[j] == "newLevel") 
				  	{
				  	node_type[node_type_index] = "newLevel";}
				  	else {node_type[node_type_index] = nodeArray[j].substring(1,nodeArray[j].length);}
				  }	
		// create 1st level		  	
					if (first) {
					  var videonodeCount_str = parseInt(videonodeCount+1);
					  var nodeNumberedName = optionName + videonodeCount_str;
						videonodeCount++;
						first=false;
					}
					if (node_type[node_type_index]) {node_type_index++;}
	      }
	      first=true;
	      allNodes = allNodes + " <table class=\"optionItem\">";
	      allNodes = allNodes + "<tr><TD class=\"optionName\">" + optionName + " " + videonodeCount_str + ":";					
			  allNodes = allNodes + "<td width=\"200\"><INPUT class=\"inputValue\" type=\"text\"  onkeypress=\"return noenter(event)\"name=\"my_videonode" + videonodeCount_str + "\" size=\"30\" value=\"" + node_name + "\">";					
				for ( var n = 0; n < node_type_index+1; n++)
				{ 
					if ((node_type[n]) || (node_type_index == 0))
				    {
				    if (!first) allNodes = allNodes + " <tr><TD>&nbsp;<td>";
					  allNodes = allNodes + "<td class=\"inputValue\" width=\"130\">" + selectTypeVideo("videonode"+videonodeCount_str,node_type[n]);
				    allNodes = allNodes + "<td>" + selectAlpha("videonode"+videonodeCount_str,alpha[n]);
				    first = false;
				    }
	        }
				allNodes = allNodes + "<td><INPUT class=\"button\" type=submit value=\"" + translateOption("addlevel") + "\" onClick=\"addVideoLevel(" + parseInt(i-1) + ");\">";
				allNodes = allNodes + "<\/tr><\/table>";
			}
		}
  }
  // add empty node for additional node specification
  if (videonodeCount < 6 ) 
  {
	  videonodeCount_str = parseInt(videonodeCount+1);
		nodeNumberedName = optionName + videonodeCount_str;
	  allNodes = allNodes + "<table class=\"optionItem\"><tr><TD class=\"optionName\">"; 
	  allNodes = allNodes + optionName + " " + videonodeCount_str + ":";					
		allNodes = allNodes + "<td width=\"200\"><INPUT class=\"inputValue\" type=\"text\"  onkeypress=\"return noenter(event)\"name=\"my_videonode" + videonodeCount_str + "\" size=\"30\" value=\"\">";					
		allNodes = allNodes + "<td width=\"130\">" + selectTypeVideo("videonode"+videonodeCount_str,node_type[n]);
		allNodes = allNodes + "<td>" + selectAlpha("videonode"+videonodeCount_str,alpha[n]);
		allNodes = allNodes + "<td><INPUT class=\"button\" type=submit value=\"" + translateOption("addlevel") + "\" onClick=\"addVideoLevel(" + videonodeCount + ");\">";
		allNodes = allNodes + "<\/tr><\/table>";		
  }
// button to add new node
	if (videonodeCount+1 < 5)
	{
		allNodes = allNodes + "<table class=\"optionItem\"><tr><TD class=\"optionName\">"; 
	  allNodes = allNodes + "<tr><td><td colspan=\"2\"><INPUT class=\"button\" type=\"button\" value=\"" + translateOption("addnode") + "\" onClick=\"addVideoNode();\">";
		allNodes = allNodes + "<\/tr><\/table>";
  }
  enable_cancel_videotree = true;  
	return allNodes;
}

// Picture nodes
var picturenodeCount = 0;
var str_addPictureLevel = "";
var navitreeTypePicture = "Custom";

function selectPictureType(myname,type_selected)
{ 
	var select_string = "<SELECT class=inputValue name='type_" + myname + "'>";
	if ( type_selected == 'newLevel')
    {select_string = select_string + "<option class=alert value='newLevel' selected>Specify type!<\/option>"; }
  if (( type_selected == '') || (type_selected == '-'))
    {select_string = select_string + "<option value='-' selected> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;<\/option>";}
  else
    {select_string = select_string + "<option value='-'> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;<\/option>";}
  if ( type_selected == 'PATH') 
    {select_string = select_string + "<option value='%PATH' selected>" + translateOption("folder") + "<\/option>";}
  else
    {select_string = select_string + "<option value='%PATH'>" + translateOption("folder") + "<\/option>";}
  if ( type_selected == 'DATE') 
    {select_string = select_string + "<option value='%DATE' selected>" + translateOption("date") + "<\/option>";}
  else
    {select_string = select_string + "<option value='%DATE'>" + translateOption("date") + "<\/option>";}
  if ( type_selected == 'DAY') 
    {select_string = select_string + "<option value='%DAY' selected>" + translateOption("day") + "<\/option>";}
  else
    {select_string = select_string + "<option value='%DAY'>" + translateOption("day") + "<\/option>";}
  if ( type_selected == 'MONTH') 
    {select_string = select_string + "<option value='%MONTH' selected>" + translateOption("month") + "<\/option>";}
  else
    {select_string = select_string + "<option value='%MONTH'>" + translateOption("month") + "<\/option>";}
   if ( type_selected == 'YEAR') 
    {select_string = select_string + "<option value='%YEAR' selected>" + translateOption("year") + "<\/option>";}
  else
    {select_string = select_string + "<option value='%YEAR'>" + translateOption("year") + "<\/option>";} 
  if ( type_selected == 'KEYWORD') 
    {select_string = select_string + "<option value='%KEYWORD' selected>" + translateOption("keyword") + "<\/option>";}
  else
    {select_string = select_string + "<option value='%KEYWORD'>" + translateOption("keyword") + "<\/option>";}
  if ( type_selected == 'RATING') 
    {select_string = select_string + "<option value='%RATING' selected>" + translateOption("rating") + "<\/option>";}
  else
    {select_string = select_string + "<option value='%RATING'>" + translateOption("rating") + "<\/option>";}
  if ( type_selected == 'DESCRIPTION') 
    {select_string = select_string + "<option value='%DESCRIPTION' selected>" + translateOption("description") + "&nbsp; &nbsp; &nbsp;<\/option>";}
  else
    {select_string = select_string + "<option value='%DESCRIPTION'>" + translateOption("description") + "&nbsp; &nbsp; &nbsp;<\/option>";}
  if ( type_selected == 'RESOLUTION') 
    {select_string = select_string + "<option value='%RESOLUTION' selected>" + translateOption("resolution") + "<\/option>";}
  else
    {select_string = select_string + "<option value='%RESOLUTION'>" + translateOption("resolution") + "<\/option>";}
  select_string = select_string + "<\/Select>";
  return select_string;
}

function showPictureNodes() 
{ 
	var allNodes = "";	
	var alpha = new Array (10);
	var node_type = new Array (10);
	var optionName = translateOption("picturenode");
	var optionName_internal = "picturenode";
	var optionValue = "";
	
	picturenodeCount=0;
	allNodes = allNodes + " <table class=\"optionItem\"><tr><td class=\"optionName\">&nbsp;";
  allNodes = allNodes + "<td class=\"optionHeading\" width=\"200\">" + translateOption('name');
  allNodes = allNodes + "<td class=\"optionHeading\" width=\"130\">" + translateOption('type');
  allNodes = allNodes + "<td class=\"optionHeading\">ABC";
  allNodes = allNodes + "<\/tr><\/table>";
	

	for ( var i = 1; i < 6; i++)
	{ 
		var optionNumber = parseInt(i);
	  var optionNumberedName = optionName + optionNumber;
	  if (!enable_cancel_picturetree) new_picture_treeArray [i-1] = getValue("picturenode"+optionNumber);
	  optionValue = new_picture_treeArray [i-1];
	  var first = true;
	  for ( var n = 0; n < 5; n++) {node_type[n] = ""; alpha[n] = "-";}
	  var node_type_index = 0;
	  
	  if (optionValue != "")	  	  
// extract node description
	  { 
		  var nodeArray = optionValue.split(",");

		  var node_name = nodeArray[0];
		  var level = nodeArray.length;
		  if (node_name != "")
		  { 
			  for (var j = 1; j < level; j++)
			  { 
				  if (nodeArray[j].substring(0,1) == "[") 
		// alpha defined	
				    {
				  	var tmp_arr = nodeArray[j].split("%");
				  	alpha[node_type_index] = nodeArray[j].substring(1,2);
				  	node_type[node_type_index]= tmp_arr[1];
			      }
		// alpha not defined	      
				  else
				  {
				  	alpha[node_type_index] = "-"; 
				  	if (nodeArray[j] == "newLevel") 
				  	{
				  	node_type[node_type_index] = "newLevel";}
				  	else {node_type[node_type_index] = nodeArray[j].substring(1,nodeArray[j].length);}
				  }	
		// create 1st level		  	
					if (first) {
					  var picturenodeCount_str = parseInt(picturenodeCount+1);
					  var nodeNumberedName = optionName + picturenodeCount_str;
						picturenodeCount++;
						first=false;
					}
					if (node_type[node_type_index]) {node_type_index++;}
	      }
	      first=true;
	      allNodes = allNodes + " <table class=\"optionItem\">";
	      allNodes = allNodes + "<tr><TD class=\"optionName\">" + optionName + " " + picturenodeCount_str + ":";					
			  allNodes = allNodes + "<td width=\"200\"><INPUT class=\"inputValue\" type=\"text\"  onkeypress=\"return noenter(event)\"name=\"my_picturenode" + picturenodeCount_str + "\" size=\"30\" value=\"" + node_name + "\">";					
				for ( var n = 0; n < node_type_index+1; n++)
				{ 
					if ((node_type[n]) || (node_type_index == 0))
				    {
				    if (!first) allNodes = allNodes + " <tr><TD>&nbsp;<td>";
					  allNodes = allNodes + "<td class=\"inputValue\" width=\"130\">" + selectPictureType("picturenode"+picturenodeCount_str,node_type[n]);
				    allNodes = allNodes + "<td>" + selectAlpha("picturenode"+picturenodeCount_str,alpha[n]);
				    first = false;				 			  				    
					  }
	        }
				allNodes = allNodes + "<td><INPUT class=\"button\" type=submit value=\"" + translateOption("addlevel") + "\" onClick=\"addPictureLevel(" + parseInt(i-1) + ");\">";
				allNodes = allNodes + "<\/tr><\/table>";
			}
		}
  }
  // add empty node for additional node specification
  if (picturenodeCount < 6 ) 
  {
	  picturenodeCount_str = parseInt(picturenodeCount+1);
		nodeNumberedName = optionName + picturenodeCount_str;
	  allNodes = allNodes + "<table class=\"optionItem\"><tr><TD class=\"optionName\">"; 
	  allNodes = allNodes + optionName + " " + picturenodeCount_str + ":";					
		allNodes = allNodes + "<td width=\"200\"><INPUT class=\"inputValue\" type=\"text\"  onkeypress=\"return noenter(event)\"name=\"my_picturenode" + picturenodeCount_str + "\" size=\"30\" value=\"\">";					
		allNodes = allNodes + "<td width=\"130\">" + selectPictureType("picturenode"+picturenodeCount_str,node_type[n]);
		allNodes = allNodes + "<td>" + selectAlpha("picturenode"+picturenodeCount_str,alpha[n]);
		allNodes = allNodes + "<td><INPUT class=\"button\" type=submit value=\"" + translateOption("addlevel") + "\" onClick=\"addPictureLevel(" + picturenodeCount + ");\">";
		allNodes = allNodes + "<\/tr><\/table>";
  }
// button to add new node
	if (picturenodeCount+1 < 5)
	{
		allNodes = allNodes + "<table class=\"optionItem\"><tr><TD class=\"optionName\">"; 
	  allNodes = allNodes + "<tr><td><td colspan=\"2\"><INPUT class=\"button\" type=\"button\" value=\"" + translateOption("addnode") + "\" onClick=\"addPictureNode();\">";
		allNodes = allNodes + "<\/tr><\/table>";
  }
  enable_cancel_picturetree = true;  
	return allNodes;
}

// Music nodes
var musicnodeCount = 0;
var str_addLevel = "";
var navitreeTypeMusic = "Custom";

function selectType(myname,type_selected)
{ 
	var select_string = "<SELECT class=\"inputValue\" name='type_" + myname + "'>";
	if ( type_selected == 'newLevel')
    {select_string = select_string + "<option class=alert value='newLevel' selected>Specify type!<\/option>"; }
  if (( type_selected == '') || (type_selected == '-'))
    {select_string = select_string + "<option value='-' selected> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;<\/option>";}
  else
    {select_string = select_string + "<option value='-'> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;<\/option>";}
  if ( type_selected == 'ALBUM') 
    {select_string = select_string + "<option value='%ALBUM' selected>" + translateOption("album") + "<\/option>";}
  else
    {select_string = select_string + "<option value='%ALBUM'>" + translateOption("album") + "<\/option>";}
  if ( type_selected == 'ALBUMARTIST') 
    {select_string = select_string + "<option value='%ALBUMARTIST' selected>" + translateOption("album") + " " + translateOption("artist")+ "<\/option>";}
  else
    {select_string = select_string + "<option value='%ALBUMARTIST'>" + translateOption("album") + " " + translateOption("artist") + "<\/option>";}
  if ( type_selected == 'ARTIST') 
    {select_string = select_string + "<option value='%ARTIST' selected>" + translateOption("artist") + "<\/option>";}
  else
    {select_string = select_string + "<option value='%ARTIST'>" + translateOption("artist") + "<\/option>";}
  if ( type_selected == 'COMPOSER') 
    {select_string = select_string + "<option value='%COMPOSER' selected>" + translateOption("composer") + "<\/option>";}
  else
    {select_string = select_string + "<option value='%COMPOSER'>" + translateOption("composer") + "<\/option>";}
  if ( type_selected == 'GENRE') 
    {select_string = select_string + "<option value='%GENRE' selected>" + translateOption("genre") + "<\/option>";}
  else
    {select_string = select_string + "<option value='%GENRE'>" + translateOption("genre") + "<\/option>";}
  if ( type_selected == 'KEYWORD') 
    {select_string = select_string + "<option value='%KEYWORD' selected>" + translateOption("keyword") + "&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;<\/option>";}
  else
    {select_string = select_string + "<option value='%KEYWORD'>" + translateOption("keyword") + "&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;<\/option>";}
  if ( type_selected == 'RATING') 
    {select_string = select_string + "<option value='%RATING' selected>" + translateOption("rating") + "&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;<\/option>";}
  else
    {select_string = select_string + "<option value='%RATING'>" + translateOption("rating") + "&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;<\/option>";}
  if ( type_selected == 'PATH') 
    {select_string = select_string + "<option value='%PATH' selected>" + translateOption("folder") + "<\/option>";}
  else
    {select_string = select_string + "<option value='%PATH'>" + translateOption("folder") + "<\/option>";}
  if ( type_selected == 'TITLE') 
    {select_string = select_string + "<option value='%TITLE' selected>" + translateOption("title") + "<\/option>";}
  else
    {select_string = select_string + "<option value='%TITLE'>" + translateOption("title") + "<\/option>";}
  if ( type_selected == 'YEAR') 
    {select_string = select_string + "<option value='%YEAR' selected>" + translateOption("year") + "<\/option>";}
  else
    {select_string = select_string + "<option value='%YEAR'>" + translateOption("year") + "<\/option>";}
    
  select_string = select_string + "<\/SELECT>";
  return select_string;
}

function selectAlpha(myname,alpha)
{
	var tmp_str= "";
	var select_string = "<SELECT class=\"inputValue\" name='alpha_" + myname + "' >";
	
  if ( alpha == '-') {tmp_str = "<option value='0' selected>-<\/option>";}
  else {tmp_str = "<option value='0'>-<\/option>";}
  select_string = select_string + tmp_str;	
  
  if ( alpha == '1') {tmp_str = "<option value='1' selected>1</option>"}
  else {tmp_str = "<option value='1'>1</option>";}
  select_string = select_string + tmp_str;	

  if ( alpha == '2') {tmp_str = "<option value='2' selected>2</option>"}
  else {tmp_str = "<option value='2'>2</option>";}
  select_string = select_string + tmp_str;	

  if ( alpha == '3') {tmp_str = "<option value='3' selected>3<\/option>"}
  else {tmp_str = "<option value='3'>3<\/option>";}
  select_string = select_string + tmp_str;	
    
  if ( alpha == '4') {tmp_str = "<option value='4' selected>4<\/option>"}
  else {tmp_str = "<option value='4'>4<\/option>";}
  select_string = select_string + tmp_str;	
    
  if ( alpha == '5') {tmp_str = "<option value='5' selected>5<\/option>"}
  else {tmp_str = "<option value='5'>5<\/option>";}  
  select_string = select_string + tmp_str;	
  
  select_string = select_string + "<\/SELECT>";
  return select_string;
}

function addVideoLevel (i)
{
	enable_cancel_videotree = true;
	build_videoNodes ();
	new_video_treeArray[i] = new_video_treeArray[i] + ',newLevel';
	var videoObject = document.getElementById("divVideoNodes");
	videoObject.innerHTML = showVideoNodes();	
}

function addPictureLevel (i)
{
	enable_cancel_picturetree = true;
	build_pictureNodes ();
	new_picture_treeArray[i] = new_picture_treeArray[i] + ',newLevel';
	//alert(new_picture_treeArray[i]);
	var pictureObject = document.getElementById("divPictureNodes");
	pictureObject.innerHTML = showPictureNodes();	
}

function addMusicLevel (i)
{
	enable_cancel_musictree = true;
	build_musicNodes ();
	new_treeArray[i] = new_treeArray[i] + ',newLevel';
	var musicObject = document.getElementById("divMusicNodes");
	musicObject.innerHTML = showMusicNodes();	
}

// Music tree
function build_musicNodes()
{
	var tmp_str = "";
	var i = 0;
	var empty = true;
	var bool_addLevel = false;
	var string_node = "";
	var rightItem = false;
		    	
	musicnodeCount=0;
	while (document.forms['egal'].elements[i])
	  { 
	  	while ((document.forms['egal'].elements[i]) && (document.forms['egal'].elements[i].name.substring(0,12) != "my_musicnode"))
	  	{ i++; }
	  	do 
	  	{ 
	  		rightItem = false;
	  		if (!document.forms['egal'].elements[i]) {break}
	  		rightItem=true;
	  	  if (document.forms['egal'].elements[i].type == 'text')
	  	  {  
//	  	  	if (document.forms['egal'].elements[i].name == str_addLevel) {document.forms['egal'].elements[i].value = ""}
	  	  	if (document.forms['egal'].elements[i].value == "") {empty = true} else {empty = false;}
	  	  	musicnodeCount++;
	  	  	tmp_str = tmp_str + document.forms['egal'].elements[i].value;
	  	    var optionName = "musicnode" + parseInt(musicnodeCount);
	  	    i++;
		    }
		    if (document.forms['egal'].elements[i].value != "newLevel")
		    {
		    	tmp_str = tmp_str + ",";
			    if ((document.forms['egal'].elements[i+1]) && (document.forms['egal'].elements[i+1].value != 0)) {tmp_str = tmp_str + "[" + document.forms['egal'].elements[i+1].value + "]";}
			    tmp_str = tmp_str + document.forms['egal'].elements[i].value;
			  }
			    i = i + 2;
	    }
	    while ((document.forms['egal'].elements[i]) && (document.forms['egal'].elements[i].type == 'select-one'));
	    i++;
	    if (rightItem) { 
	    	if (!empty) {new_treeArray[musicnodeCount-1]=tmp_str} else {new_treeArray[musicnodeCount-1]=""}
	    }
	    tmp_str = "";
	  }
	for (var j = musicnodeCount; j < 10; j++)
	{ 
		new_treeArray[j] = "";
	}
}

function build_pictureNodes()
{
	var tmp_str = "";
	var i = 0;
	var empty = true;
	var bool_addLevel = false;
	var string_node = "";
	var rightItem = false;

	picturenodeCount=0;
	while (document.forms['egal'].elements[i])
	  { 
	  	while ((document.forms['egal'].elements[i]) && (document.forms['egal'].elements[i].name.substring(0,14) != "my_picturenode"))
	  	{ i++ }
	  	do
	  	{
	  	  rightItem = false;
	  		if (!document.forms['egal'].elements[i]) {break}
	  		rightItem=true;
	  	  if (document.forms['egal'].elements[i].type == 'text')
	  	  { 
//			  	if (document.forms['egal'].elements[i].name == str_addPictureLevel) {bool_addLevel = true} else {bool_addLevel = false}
	  	  	if (document.forms['egal'].elements[i].value == "") {empty = true} else {empty = false}
	  	  	picturenodeCount++;
	  	  	tmp_str = tmp_str + document.forms['egal'].elements[i].value;
	  	    var optionName = "picturenode" + parseInt(picturenodeCount);
	  	    i++;
		    }
		    if (document.forms['egal'].elements[i].value != "newLevel")
		    {
			    tmp_str = tmp_str + ",";
			    if ((document.forms['egal'].elements[i+1]) && (document.forms['egal'].elements[i+1].value != 0)) {tmp_str = tmp_str + "[" + document.forms['egal'].elements[i+1].value + "]";}
			    tmp_str = tmp_str + document.forms['egal'].elements[i].value;
		    }
		    i = i + 2;
	    }
	    while ((document.forms['egal'].elements[i]) && (document.forms['egal'].elements[i].type == 'select-one'));
	    i++;
	    if (rightItem) {
	    	if (!empty) {new_picture_treeArray[picturenodeCount-1]=tmp_str} else {new_picture_treeArray[picturenodeCount-1]=""}
	    }
	    tmp_str = "";
	  }
		for (var j = picturenodeCount+1; j < 6; j++)
		{ 
			new_picture_treeArray[j] = "";
		}
  }


function build_videoNodes()
{
	var tmp_str = "";
	var i = 0;
	var empty = true;
	var bool_addLevel = false;
	var string_node = "";
	var rightItem = false;

	videonodeCount=0;
	while (document.forms['egal'].elements[i])
	  { 
	  	while ((document.forms['egal'].elements[i]) && (document.forms['egal'].elements[i].name.substring(0,12) != "my_videonode"))
	  	{ i++ }
	  	do
	  	{
	  	  rightItem = false;
	  		if (!document.forms['egal'].elements[i]) {break}
	  		rightItem=true;
	  	  if (document.forms['egal'].elements[i].type == 'text')
	  	  { 
//			  	if (document.forms['egal'].elements[i].name == str_addVideoLevel) {bool_addLevel = true} else {bool_addLevel = false}
	  	  	if (document.forms['egal'].elements[i].value == "") {empty = true} else {empty = false}
	  	  	videonodeCount++;
	  	  	tmp_str = tmp_str + document.forms['egal'].elements[i].value;
	  	    var optionName = "videonode" + parseInt(videonodeCount);
	  	    i++;
		    }
		    if (document.forms['egal'].elements[i].value != "newLevel")
		    {
			    tmp_str = tmp_str + ",";
			    if ((document.forms['egal'].elements[i+1]) && (document.forms['egal'].elements[i+1].value != 0)) {tmp_str = tmp_str + "[" + document.forms['egal'].elements[i+1].value + "]";}
			    tmp_str = tmp_str + document.forms['egal'].elements[i].value;
		    }
		    i = i + 2;
	    }
	    while ((document.forms['egal'].elements[i]) && (document.forms['egal'].elements[i].type == 'select-one'));
	    i++;
	    if (rightItem) {
	    	if (!empty) {new_video_treeArray[videonodeCount-1]=tmp_str} else {new_video_treeArray[videonodeCount-1]=""}
	    }
	    tmp_str = "";
	  }
		for (var j = videonodeCount+1; j < 6; j++)
		{ 
			new_video_treeArray[j] = "";
		}
  }

function showMusicNodes() 
{ 
	var allNodes = "";
	var optionValue = "";
	
	var alpha = new Array (10);
	var node_type = new Array (10);
	var optionName = translateOption("musicnode");
	var optionName_internal = "musicnode";
	musicnodeCount = 0;	      
	allNodes = allNodes + " <table class=\"optionItem\"><tr><td class=\"optionName\">&nbsp;";
  allNodes = allNodes + "<td class=\"optionHeading\" width=\"200\">" + translateOption('name');
  allNodes = allNodes + "<td class=\"optionHeading\" width=\"130\">" + translateOption('type');
  allNodes = allNodes + "<td class=\"optionHeading\">ABC";
  allNodes = allNodes + "<\/tr><\/table>";

	for ( var i = 1; i < 11; i++)
	{ 
		var optionNumber = parseInt(i);
	  var optionNumberedName = optionName + optionNumber;
	  if (!enable_cancel_musictree) new_treeArray [i-1] = getValue("musicnode"+optionNumber);
	  optionValue = new_treeArray [i-1];
	  var first = true;
	  for ( var n = 0; n < 10; n++) {node_type[n] = ""; alpha[n] = "-";}
	  var node_type_index = 0;
	  
	  if (optionValue != "")	  	  
// extract node description
	  { 
		  var nodeArray = optionValue.split(",");

		  var node_name = nodeArray[0];
		  var level = nodeArray.length;
		  if (node_name != "")
		  { 
			  for (var j = 1; j < level; j++)
			  { 
				  if (nodeArray[j].substring(0,1) == "[") 
		// alpha defined	
				    {
				  	var tmp_arr = nodeArray[j].split("%");
				  	alpha[node_type_index] = nodeArray[j].substring(1,2);
				  	node_type[node_type_index]= tmp_arr[1];
			      }
		// alpha not defined	      
				  else
				  {
				  	alpha[node_type_index] = "-"; 
				  	if (nodeArray[j] == "newLevel") 
				  	{
				  	node_type[node_type_index] = "newLevel";}
				  	else {node_type[node_type_index] = nodeArray[j].substring(1,nodeArray[j].length);}
				  }	
		// create 1st level		  	
					if (first) {
					  var musicnodeCount_str = parseInt(musicnodeCount+1);
					  var nodeNumberedName = optionName + musicnodeCount_str;
						musicnodeCount++;
						first=false;
					}
					if (node_type[node_type_index]) {node_type_index++;}
	      }
	      first=true;
	      allNodes = allNodes + " <table class=\"optionItem\">";
	      allNodes = allNodes + "<tr><TD class=\"optionName\">" + optionName + " " + musicnodeCount_str + ":";				
			  allNodes = allNodes + "<td width=\"200\"><INPUT class=\"inputValue\" type=\"text\"  onkeypress=\"return noenter(event)\"name=\"my_musicnode" + musicnodeCount_str + "\" id=\"my_musicnode" + musicnodeCount_str + "\" size=\"30\" value=\"" + node_name + "\">";					
				for ( var n = 0; n < node_type_index+1; n++)
				{ 
					if ((node_type[n]) || (node_type_index == 0))
				    {
				    if (!first) allNodes = allNodes + " <tr><TD>&nbsp;<td>";
					  allNodes = allNodes + "<td class=\"inputValue\" width=\"130\">" + selectType("musicnode"+musicnodeCount_str,node_type[n]);
				    allNodes = allNodes + "<td>" + selectAlpha("musicnode"+musicnodeCount_str,alpha[n]);
				    first = false;
					  }
	      }
        allNodes = allNodes + "<td><INPUT class=\"button\" type=\"button\" value=\"" + translateOption("addlevel") + "\" onClick=\"addMusicLevel(" + parseInt(i-1) + ");\">";
				allNodes = allNodes + "<\/tr><\/table>";
			}
		}
  }

  // add empty node for additional node specification
  if (musicnodeCount < 10 ) 
  {
	  musicnodeCount_str = parseInt(musicnodeCount+1);
		nodeNumberedName = optionName + musicnodeCount_str;
	  allNodes = allNodes + "<table class=\"optionItem\"><tr><TD class=\"optionName\">"; 
	  allNodes = allNodes + optionName + " " + musicnodeCount_str + ":";					
		allNodes = allNodes + "<td width=\"200\"><INPUT class=\"inputValue\" type=\"text\"  onkeypress=\"return noenter(event)\"name=\"my_musicnode" + musicnodeCount_str + "\" name=\"my_musicnode" + musicnodeCount_str + "\" size=\"30\" value=\"\">";					
		allNodes = allNodes + "<td width=\"130\">" + selectType("musicnode"+musicnodeCount_str,node_type[n]);
		allNodes = allNodes + "<td>" + selectAlpha("musicnode"+musicnodeCount_str,alpha[n]);
		allNodes = allNodes + "<td><INPUT class=\"button\" type=\"button\"t value=\"" + translateOption("addlevel") + "\" onClick=\"addMusicLevel(" + musicnodeCount + ");\">";
		allNodes = allNodes + "<\/tr><\/table>";
  }
  // button to add new node
	if (musicnodeCount+1 < 10)
	{
		allNodes = allNodes + "<table class=\"optionItem\"><tr><TD class=\"optionName\">"; 
	  allNodes = allNodes + "<tr><td><td colspan=\"2\"><INPUT class=\"button\" type=\"button\" value=\"" + translateOption("addnode") + "\" onClick=\"addMusicNode();\">";
		allNodes = allNodes + "<\/tr><\/table>";
	}
	enable_cancel_musictree = true;
	return allNodes;
}	
	
	function getStatus() 
  {
	return loadXMLDoc("/rpc/info_status","");
  }
  
  function getClientInfo() 
  {
	return loadXMLDoc("/rpc/info_clients","");
  }

  function getConnectedClientInfo() 
  {
	return loadXMLDoc("/rpc/info_connected_clients","");
  }
  
  function getNicInfo() 
  {
	return loadXMLDoc("/rpc/info_nics","");
  }
 
 function getClientNames() 
  {
	return loadXMLDoc("/rpc/get_clients","");
  }
  
 
 function clientSelectionBox(nr,nSelected)
 {
	  var temp = "";
 		var clientnames=getClientNames();
 		var clientname_array=clientnames.split(",");
 	
 	 temp= "<SELECT class=\"inputValue\" name=\"client_name"  +  parseInt(nr)  +"\" >";
 	//alert(nSelected);
	//for (var i=0; i<clientname_array.length; i+=2) {
	// 	 	alert(clientname_array[i]+":"+clientname_array[i+1]);
	//}
  for (var i=0; i<clientname_array.length; i+=2) {
 	 	if (parseInt(clientname_array[i],10)==nSelected) {
 	 		//alert(clientname_array[i]+":"+clientname_array[i+1]+":"+nSelected);
	 		temp = temp + "<option selected value=\""+clientname_array[i]+"\">"+clientname_array[i+1]+"<\/option>";
	  }	 		
	 	else	
	 		temp = temp + "<option value=\""+clientname_array[i]+"\">"+clientname_array[i+1]+"<\/option>";
	 }		
	 temp = temp + "<\/select>";

	//alert(nr+":"+nSelected);

	 return temp;
}
 
 function clientInfo() 
 {
  var clientString = getConnectedClientInfo();;
  var temp = "<tr><td>&nbsp;</td></tr>";
  var n=0;

	clientEntryArray = clientString.split("\n");
	//alert(clientEntryArray.length);
	for ( var i = 0; i < (clientEntryArray.length-1); i+=11)
  { 
  	clientID          = clientEntryArray[i];
  	clientMAC         = clientEntryArray[i+1];
  	clientIP          = clientEntryArray[i+2];
  	clientUUID        = clientEntryArray[i+3];
  	clientEnabled     = clientEntryArray[i+4];
  	clientType        = clientEntryArray[i+5];
  	clientFriendyName = clientEntryArray[i+6];
  	clientDescURL     = clientEntryArray[i+7];
  	clientIcon        = clientEntryArray[i+8];
  	clientMimetype    = clientEntryArray[i+9];
  	clientDelimiter   = clientEntryArray[i+10];
	  n++;	
  	temp=temp+"<tr><td class=\"optionName\">";
	  	
		if (clientEnabled == '1') {
			temp =  temp + "<INPUT type=\"checkbox\" name=\"client_enabled" +  parseInt(n) + "\" checked ><\/input>&nbsp;";
		}
		else {
			temp =  temp + "<INPUT type=\"checkbox\" name=\"client_enabled" +  parseInt(n) + "\" ><\/input>&nbsp;";
		}			
    temp =  temp + "<INPUT class=\"inputValue\" type=\"text\" readonly onkeypress=\"return noenter(event)\" name=\"client_mac"  +  parseInt(n) +"\" size=\"20\" value=\""+clientMAC +"\">";
  	temp =  temp + "</td><td class=\"inputValue\">";
  	temp =  temp + clientSelectionBox(n,clientID); // + "</td>";
  	temp =  temp + "&nbsp;" + clientIP;
  	temp =  temp + "&nbsp;" + clientFriendyName;
  	temp =  temp + "</td></tr>";
  }
  
  i=999
 	temp=temp+"<tr><td class=\"optionName\">";
 	temp = temp + "<INPUT type=\"checkbox\" name=\"client_enabled" +  parseInt(i) + "\" ><\/input>&nbsp;";
  temp = temp + "<INPUT class=\"inputValue\" type=\"text\" onkeypress=\"return noenter(event)\" name=\"new_client_mac\" size=\"20\" value=\"\">";
  temp = temp + "</td><td class=\"inputValue\">";
 	temp = temp + clientSelectionBox(i,-1) + "</td></tr>";
  
	return temp;	
}
  
  

  
 //global variable to store remaining number of days for trial version
 var daysleft = 0;
 var restartpending = false;
 var licensestatus=0;
 var showerror = false;
 var error_str="";
 var showCDKey=false;
 
 

function licenseStatus()
{
	return  licensestatus;
}

function errorStr()
{
	statusInfo();
	return  error_str;
}
 	
	
 function statusInfo() 
  {
  var temp = "";
  var statusName ="";
  var statusValue ="";
  var statusString = getStatus();
  var nicString = getNicInfo();
  var all_media = true;
  var cdkey_str="";
  
  if ( statusString.indexOf("|ME") == -1) all_media = false;
 
	var statusEntryArray = statusString.split("\n");
	var first = true;
	showerror = false;
 	showCDKey = false;
 	
	for ( var i = 0; i < statusEntryArray.length; i++)
		{ 
		  if (statusEntryArray[i].length>0) {
		  //if (first) {temp =  temp + "<tr><td class=\"infoGroup\">" + translateOption("memory"); first = false;}	
		  if (first) {temp =  temp + "<tr><td class=\"infoGroup\">"; first = false;}	
		  var statusEntries = statusEntryArray[i].split("|");
		  statusName = translateOption(statusEntries[0]);
		  statusValue = statusEntries[1];
		  if (statusValue == 'sparc_341_232_INFRANT') statusValue='Infrant_Processor';
		  switch (statusEntries[0]) 
		    {
		  	case "usedmem":
		      temp =  temp + "<tr><td class=\"optionName\">" + statusName + ":<td class=\"inputValue\">" + statusValue + " KB";  
		  	break;			    		    			    	
		  	case "allowedmaxmem":
		  		if (statusValue > 0) {
		  			temp =  temp + "<tr><td class=\"optionName\">" + statusName + ":<td class=\"inputValue\">" + statusValue;  
		  		}
		  	break;		    	
		  	case "maxmemexceeded":
		  		if (statusValue > 0) {
		  			temp =  temp + "<tr><td class=\"optionName\" colspan=2 valign=\"middle\"><img src=\"/images/attention-small.gif\">&nbsp;" + statusName;
		  		}
		  	break;
		  			  	
		  	case "musictracks":
				temp =  temp + "<tr><td>&nbsp;<tr><td class=\"infoGroup\">" + translateOption("content");
		  	temp =  temp + "<tr><td class=\"optionName\">" + statusName + ":<td class=\"inputValue\">" + statusValue;
		  	break;	
		  	
  	  	case "pictures":	
  	  	if (all_media) temp =  temp + "<tr><td class=\"optionName\">" + statusName + ":<td class=\"inputValue\">" + statusValue;  
		  	break;

  	  	case "videos":	
  	  	if (all_media) temp =  temp + "<tr><td class=\"optionName\">" + statusName + ":<td class=\"inputValue\">" + statusValue;  
		  	break;		  	

  	  	case "radiostations":	
  	  	if (all_media) temp =  temp + "<tr><td class=\"optionName\">" + statusName + ":<td class=\"inputValue\">" + statusValue;  
		  	break;		  	
		  	
		  	case "configlocation":
				temp =  temp + "<tr><td>&nbsp;<tr><td class=\"optionName\">" + translateOption("configlocation") + ":<td  class=\"inputValue\">" + statusValue;
		  	break;	
		  	case "versionavailable":
		  	break;
		  	case "scanstart":
				temp =  temp + "<tr><td>&nbsp;<tr><td class=\"infoGroup\">" + translateOption("scaninfo");
		  		if (statusValue !== 0) {
		  			temp =  temp + "<tr><td class=\"optionName\">" + statusName + ":<td class=\"inputValue\">" + statusValue;
		  		}
		  	break;
		  	case "licensedays":
		  	  if (licensestatus != 2) {  // 2 is a registered version
				    temp =  temp + "<tr><td>&nbsp;<tr><td class=\"infoGroup\">" + translateHelp("trialinfo");		  			
		  			temp =  temp + "<tr><td class=\"optionName\">" + statusName + ":<td class=\"inputValue\">";
		  			temp = temp + statusValue;
		  		}
		  		else {
		  			temp =  temp + "<tr><td>&nbsp;<tr><td class=\"optionName\">" + translateOption("licenseinfo") + ":<td class=\"inputValue\">";
		  			temp = temp + translateHelp("registeredaccount");
		  	  }
		  	daysleft = parseInt(statusValue);
		  	cdkey_str=getValue("cdkey");
		  	if (cdkey_str.length>0) {
	  					temp =  temp + "<tr><td class=\"optionName\">" + translateOption("cdkey") + ":<td  class=\"inputValue\">" + cdkey_str;
	  		}
		  	break;
		  	case "licensestatus":
				licensestatus=parseInt(statusValue);
				//ACCOUNTING_TRIAL_VERSION				1
				showCDKey=true;
				if (licensestatus==-201) {   // Key malformed
					error_str = "<div class=\"alert\">"+translateHelp("invalidkey")+"<\/div>";
					showerror = true;
				}
				if (licensestatus==-202) {   // Music Key for Media Server
					error_str = "<div class=\"alert\">"+translateHelp("wrongversion")+"<\/div>";
					showerror = true;
				}
				if (licensestatus==-203) {   // Wrong OEM
					error_str = "<div class=\"alert\">"+translateHelp("keymismatch")+"<\/div>";
					showerror = true;
				}
				if (licensestatus==-204) {   // Key expired
					error_str = "<div class=\"alert\">"+translateHelp("keymismatch")+"<\/div>";
					showerror = true;
				}
				if (licensestatus==-205) {   // Key in use
					error_str = "<div class=\"alert\">"+translateHelp("keyinuse")+"<\/div>";
					showerror = true;
				}
				if (licensestatus==-206) {   // Trial expired
					error_str = "<div class=\"alert\">"+translateHelp("expired")+"<\/div>";
					showerror = true;
				}
				if (licensestatus==2) {   // ACCOUNTING_REGISTERED_VERSION
					error_str = "<div class=\"alert\">"+translateHelp("keymismatch")+"<\/div>";
					showCDKey = false;
				}
		  	break;
		  	case "uptime":
				temp =  temp + "<tr><td>&nbsp;<tr><td class=\"infoGroup\">" + translateOption("serverinfo");
		  	temp =  temp + "<tr><td class=\"optionName\">" + statusName + ":<td class=\"inputValue\">" + statusValue + " " + translateOption("days");
		  	temp =  temp + ", " + statusEntries[2] + " " + translateOption("hours");
		  	break;		 	
			  	  	
		  		  	
		  	case "serverplatform":
// for internal purposes only	
		  	break;	
		  		  	
		  	case "serverkind":
		  	temp =  temp + "<tr><td class=\"optionName\">" + statusName + ":<td class=\"inputValue\">";
		  	if (statusValue = "ME") 
		  	  {temp = temp + "TwonkyMedia"}
		  	else
		  	  {temp = temp + "TwonkyMusic"}		  		
		  	break;
		  	
		  	case "restartpending":
		  	temp =  temp + "<tr><td class=\"optionName\">" + statusName + ":<td class=\"inputValue\">";
		  	if (statusValue == "0") {restartpending = false; temp = temp + translateOption("no");}
		  	else {restartpending = true; temp = temp + translateOption("yes");}
  	  	break;
  	  	
		  	default:
		    temp =  temp + "<tr><td class=\"optionName\">" + statusName + ":<td class=\"inputValue\">" + statusValue;  
		    }
		  } 
    }
	temp =  temp + "<tr><td>&nbsp;" 
		
	var first_nic = true;
	statusEntryArray = nicString.split("\n");
	if (statusEntryArray.length > 0) {temp =  temp + "<tr><td class=\"optionName\">" + translateOption("networkinterfaces") + ":";}
	for ( var i = 0; i < statusEntryArray.length; i++)
		{
		if (statusEntryArray[i].length>0) 
		  {
		  if (first_nic) 
		    {
		    temp =  temp + "<td class=\"inputValue\">" + statusEntryArray[i]
		    first_nic = false;
		    }
		  else
		    {temp =  temp + "<tr><td><\/td><td class=\"inputValue\">" + statusEntryArray[i]}		  	
    	} 
    }
	temp =  temp + "<tr><td>&nbsp;" 		
	return temp;	
	}
	
// Validator Object
  var valid = new Object();

// REGEX Elements
//matches email
  valid.emailAddress = /^.+\@(\[?)[a-zA-Z0-9\-\.]+\.([a-zA-Z]{2,3}|[0-9]{1,3})(\]?)$/;

// IP Address
  valid.ipAddress = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;

function setRadioGenre() 
{	
		var myForm = document.egal;
		var checkString = "";
		checkString = getValue("radiogenre");			
		if (checkString == "")
		{
			for ( var i = 0; i < 18; i++)
			{
			  myForm.myradiogenre[i].checked = false;
			}
		}
		else
		{	
		  var checkString_Array = checkString.split(",");
		  for ( i = 0; i < 18; i++) {myForm.myradiogenre[i].checked = false;}	

			for ( i = 0; i < checkString_Array.length ; i++)
			{
				for ( var j = 0; j < 18; j++)
				{
// beide lower case + trim					
				if (myForm.myradiogenre[j].value == checkString_Array[i]) { myForm.myradiogenre[j].checked = true;}
				}
			}
		}
	}

function selectClientType(myname,type_selected)
{ 
	var select_string = "<SELECT class=inputValue name='type_" + myname + "'>";

  if ( type_selected == '') 
    {select_string = select_string + "<option value='-' selected> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;<\/option>";}
  else
    {select_string = select_string + "<option value='-'> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;<\/option>";}
  if ( type_selected == 'musicclient') 
    {select_string = select_string + "<option value='0' selected>" + translateOption("musicclient") + "<\/option>";}
  else
    {select_string = select_string + "<option value='0'>" + translateOption("musicclient") + "<\/option>";}
  if ( type_selected == 'dlinkclient') 
    {select_string = select_string + "<option value='1' selected>" + translateOption("dlinkclient") + "<\/option>";}
  else
    {select_string = select_string + "<option value='1'>" + translateOption("dlinkclient") + "<\/option>";}
  if ( type_selected == 'homepodclient') 
    {select_string = select_string + "<option value='2' selected>" + translateOption("homepodclient") + "<\/option>";}
  else
    {select_string = select_string + "<option value='2'>" + translateOption("homepodclient") + "<\/option>";}
  if ( type_selected == 'm740client') 
    {select_string = select_string + "<option value='3' selected>" + translateOption("m740client") + "<\/option>";}
  else
    {select_string = select_string + "<option value='3'>" + translateOption("m740client") + "<\/option>";}
   if ( type_selected == 'netgear115client') 
    {select_string = select_string + "<option value='4' selected>" + translateOption("netgear115client") + "<\/option>";}
  else
    {select_string = select_string + "<option value='4'>" + translateOption("netgear115client") + "<\/option>";} 
  if ( type_selected == 'noxonclient') 
    {select_string = select_string + "<option value='5' selected>" + translateOption("noxonclient") + "<\/option>";}
  else
    {select_string = select_string + "<option value='5'>" + translateOption("noxonclient") + "<\/option>";}
  if ( type_selected == 'syabasclient') 
    {select_string = select_string + "<option value='6' selected>" + translateOption("syabasclient") + "<\/option>";}
  else
    {select_string = select_string + "<option value='6'>" + translateOption("syabasclient") + "<\/option>";}
  if ( type_selected == 'telegentclient') 
    {select_string = select_string + "<option value='7' selected>" + translateOption("telegentclient") + "<\/option>";}
  else
    {select_string = select_string + "<option value='7'>" + translateOption("telegentclient") + "<\/option>";}
  select_string = select_string + "<\/Select>";
  return select_string;
}	

function showContentdirs()
{
	var contentObject = document.getElementById('content_directories');
	var contentStr  = "";
	var dirString = "";
	var dirType = "";
	var input_id = "";
	var contentDirs = "";
	if (enable_cancel) 
	  contentDirs = newContentDirs;
	else 
		contentDirs = getValue("contentdir");	
	
  contentStr = contentStr + "<p><\/p><table class=\"optionItem\">";
	contentStr = contentStr + "<tr><TD class=\"optionName\">" + translateOption("contentdir")+ ":";								

	if (contentDirs != "")
	{
	  var contentDirs_Array = contentDirs.split(",");
	  for ( var i = 0; i < contentDirs_Array.length; i++)
		{ 
		  var singleDir = contentDirs_Array[i].split("|");
		  dirString = singleDir[1]; 
		  dirType = singleDir[0].charAt(1);
		  dirEnabled = singleDir[0].charAt(0);
		  if (i>0) {contentStr = contentStr + "<br>"; }
		  if (dirEnabled=="+") 
		  	contentStr = contentStr + "<tr><td><INPUT type=\"checkbox\" name=\"cdir_checkbox" + parseInt(i) + "\" checked>&nbsp;<\/input>";
			else 
		  	contentStr = contentStr + "<tr><td><INPUT type=\"checkbox\" name=\"cdir_checkbox" + parseInt(i) + "\">&nbsp;<\/input>";
		  contentStr = contentStr + "<INPUT class=\"inputValue\"  type=\"text\"  onkeypress=\"return noenter(event)\"name=\"my_contentdir" + parseInt(i) + "\" id=\"my_contentdir" + parseInt(i) + "\"size=\"70\" value=\"" + dirString + "\" />&nbsp;&nbsp;";
		  contentStr = contentStr + "<SELECT class=\"inputValue\" name=\"content_type\">";
		  contentStr = contentStr + "<option value=\"A|\">All content types<\/option>";
		  if (dirType == "M") {contentStr = contentStr + "<option selected value=\"M|\">Music-only<\/option>";} else {contentStr = contentStr + "<option value=\"M|\">Music-only<\/option>";}
		  if (dirType == "P") {contentStr = contentStr + "<option selected value=\"P|\">Pictures-only<\/option>";} else {contentStr = contentStr + "<option value=\"P|\">Pictures-only<\/option>";}
		  if (dirType == "V") {contentStr = contentStr + "<option selected value=\"V|\">Video-only<\/option>";} else {contentStr = contentStr + "<option value=\"V|\">Video-only<\/option>";}
		  contentStr = contentStr + "<\/select>";
		  contentStr = contentStr + "&nbsp;&nbsp;<INPUT class=\"button\" type=\"button\"  value=\"" + translateOption("browse")+"\" onClick=\"showDir('my_contentdir" + parseInt(i) + "');\" />";
    }
// add empty field for new content dir
		  input_id = "my_contentdir" + parseInt(i);
		  contentStr = contentStr + "<br><INPUT type=\"checkbox\" name=\"cdir_checkbox" + parseInt(i) + "\" checked>&nbsp;<\/input>";		  
		  contentStr = contentStr + "<INPUT class=\"inputValue\"  type=\"text\"  onkeypress=\"return noenter(event)\"name=\"" + input_id + "\" id=\"" + input_id + "\" size=\"70\" value=\"\">&nbsp;&nbsp;";
		  contentStr = contentStr + "<SELECT class=\"inputValue\" name=\"content_type\">";
		  contentStr = contentStr + "<option selected value=\"A|\">All content types<\/option>";
		  contentStr = contentStr + "<option  value=\"M|\">Music-only<\/option>";
		  contentStr = contentStr + "<option  value=\"P|\">Pictures-only<\/option>";
		  contentStr = contentStr + "<option  value=\"V|\">Video-only<\/option>";
		  contentStr = contentStr + "<\/select>";
		  contentStr = contentStr + "&nbsp;&nbsp;<INPUT class=\"button\" type=\"button\" value=\"" + translateOption("browse")+"\" onClick=\"showDir('my_contentdir" + parseInt(i) + "');\">";   
  		contentStr = contentStr + "<br><INPUT class=\"button\" type=\"button\" value=\""
  		contentStr = contentStr + translateOption("addcontentdir") + "\"";
  		contentStr = contentStr + "onClick=\"addContentDir(\'" + input_id + "\');\">";
	}
// No content dir specified
	else 
	{ 
		input_id = "my_contentdir0";
	  contentStr = contentStr + "<tr><td>&nbsp;<td><INPUT type=\"checkbox\" name=\"cdir_checkbox0" + "\" checked>&nbsp;<\/input>";	
	  contentStr = contentStr + "<INPUT class=\"inputValue\"  type=\"text\"  onkeypress=\"return noenter(event)\"name=\"" + input_id + "\" id=\"" + input_id + "\" size=\"70\" value=\"\">&nbsp;&nbsp;";
	  contentStr = contentStr + "<SELECT class=inputValue name=\"content_type\">";
		contentStr = contentStr + "<option selected value=\"A|\">All content types<\/option>";
		contentStr = contentStr + "<option value=\"M|\">Music-only<\/option>";
		contentStr = contentStr + "<option value=\"P|\">Pictures-only<\/option>";
		contentStr = contentStr + "<option value=\"V|\">Video-only<\/option>";
		contentStr = contentStr + "<\/select>";
		contentStr = contentStr + "&nbsp;&nbsp;<INPUT class=\"button\" type=\"button\" value=\"" + translateOption("browse")+"\" onClick=\"showDir('my_contentdir0');\">";
		contentStr = contentStr + "<br><INPUT class=\"button\" type=\"button\" value=\"" + translateOption("addcontentdir") + "\" onClick=\"addContentDir(\'" + input_id + "\');\">";
	}
	contentStr = contentStr + "<tr><td class=\"helpText\" colspan=\"2\">" + translateHelp("contentdir") + "<\/tr><\/table><hr>";
	return contentStr;
}

// for auto tab on cd-key
function KeyPress(what,e,max,action) {
    if (document.layers) {
        if (e.target.value.length >= max) {
            if (what.name == "cdkey1") {  // enable copy & paste on cd key
            	if (what.value.length > 20) {
					    		egal.cdkey2.value=egal.cdkey1.value.substring(5,9);
					    		egal.cdkey3.value=egal.cdkey1.value.substring(10,14);
					    		egal.cdkey4.value=egal.cdkey1.value.substring(15,19);
					    		egal.cdkey5.value=egal.cdkey1.value.substring(20,24);
					    		egal.cdkey6.value=egal.cdkey1.value.substring(25,29);
					    		egal.cdkey7.value=egal.cdkey1.value.substring(30,34);
					    		egal.cdkey8.value=egal.cdkey1.value.substring(35,39);
					    		egal.cdkey1.value=egal.cdkey1.value.substring(0,4);
					    }
						}
      	    eval(action);
        }
    }
    else if (document.all) {
        if (what.value.length > (max-1)) {
            if (what.name == "cdkey1") {  // enable copy & paste on cd key
            	if (what.value.length > 20) {
					    		egal.cdkey2.value=egal.cdkey1.value.substring(5,9);
					    		egal.cdkey3.value=egal.cdkey1.value.substring(10,14);
					    		egal.cdkey4.value=egal.cdkey1.value.substring(15,19);
					    		egal.cdkey5.value=egal.cdkey1.value.substring(20,24);
					    		egal.cdkey6.value=egal.cdkey1.value.substring(25,29);
					    		egal.cdkey7.value=egal.cdkey1.value.substring(30,34);
					    		egal.cdkey8.value=egal.cdkey1.value.substring(35,39);
					    		egal.cdkey1.value=egal.cdkey1.value.substring(0,4);
					    }
						}
  	        eval(action);
        }
    }
}
