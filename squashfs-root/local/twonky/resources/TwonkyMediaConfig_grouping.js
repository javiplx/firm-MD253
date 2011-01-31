   var expired = false;
   var div_array = new Array( 
  "divButtons",
  "divRestartWarning",
  "divCachedir", 
	"divCachemaxsize",
  "divEMPTY",
  "divKey",
  "divStatus",  	
	"divLanguage",  
	"divFriendlyname",  
  "divContentdir",  	
	"divIgnoredir",  
	"divCompilationsdir",  
	"divScantime", 
  "divRandomizeplaylists",
	"divPlaylistnumentries",  
	"divPlaylists",  
	"divPlaylistlastplayed",  
	"divPlaylistmostplayed",
  "divRadio",    
	"divRadioreread",  
	"divRadiogenre",  
	"divRadioStations",
	"divInternetradio",  
  "divAdobepath",    
	"divItuneslib", 
	"divAdaptcase",  
	"divFolderprefix", 
  "divAlltracks",    
	"divPlaylists",  
	"divPlaylistlastplayed",  
	"divPlaylistmostplayed",  
	"divAllpictures", 
  "divAllvideos",    
  "divRootmusic",    
	"divRootpicture", 
	"divRootvideo",  
	"divAllname",  
	"divTagspicture",
	"divEnableweb", 
  "divNicrestart",    
	"divHttpport",  
	"divRtpport",  
	"divIp",  
  "divClientDB",  
	"divNosearch",  
  "divStreambuffer",
	"divDbdir",  
	"divNorescale",  
	"divMusictree", 
	"divPicturetree", 
	"divVideotree", 
  "divTrouble",
  "divLogfile",
  "divExit",    
  "divRestart", 
  "divRescan",
  "divTreetype",
  "divWebaccess",
  "divError",
  "divFirstHR",
  "divCDKey",
  "divUpload",
  "divUpnptimeout",
  "divRemoteaccess",
  "divNaming");
  
function hideAllDivs() 
 {
 	var hide ="";

	for (i = 0; i < div_array.length; i++) 
	{
		hide =  parent.CONT_FRAME.document.getElementById(div_array[i]);
		if (hide != null) {hide.style.display = "none";	} 
	}
}

function hide_div(div)
{
	var hide;

 	hide =  parent.CONT_FRAME.document.getElementById(div);
  hide.style.display = "none";	
}

function show_div(div)
{
	var show;
	
 	show =  parent.CONT_FRAME.document.getElementById(div);
	show.style.display = "block";	
}

function showAllDivs()  
 {
 	var show ="";

	for (i = 0; i < div_array.length; i++) 
	{
		show =  parent.CONT_FRAME.document.getElementById(div_array[i]);
		if (show != null) {show.style.display = "block";	} 
	}
}

function getServerKind()
{
	
  var statusString = getStatus();

  if ( statusString.indexOf("|ME") == -1) 
  	{return "TwonkyMusic "}
  else
    {return "TwonkyMedia "}   		
}		  	
	

