function optionsShow(inputOptionSet, reload) 
{
  hideAllDivs();
	var optionSet = inputOptionSet;
	var title = parent.HEAD_FRAME.document.getElementById( 'divPageTitle' );
	var configTitle = getServerKind()  + translateOption("webconfigtitle") + ": ";
	parent.actualPage = optionSet;
	show_div("divButtons");	
	show_div("divFirstHR");	
	switch (optionSet) 
	{
 // 0: sharing  	
  	case 0:
		  show_div("divRescan"); 		
		  show_div("divContentdir"); 		  
		  show_div("divScantime");		
      configTitle = configTitle + translateOption('sharing') + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
     
  	break;
// 1: contentdir
//  	case 1:
//		  show_div("divContentdir");
//		  show_div("divIgnoredir"); 
//		  show_div("divCompilationsdir"); 		  
//		  show_div("divRescan"); 		
//			show_div("divRestart"); 		  
//      configTitle = configTitle + translateOption('contentidr') + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
//     
//  	break;

// 2: radio setup
  	case 2:
		  show_div("divRadio");  
		  //show_div("divRadioStations"); 
		  //show_div("divRadioreread"); 
		  show_div("divRadiogenre");  
			show_div("divRestart"); 		  
      configTitle = configTitle + translateOption('internetradio') + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";

  	break;
// 3: playlist setup
//  	case 3:
//		  show_div("divRandomizeplaylists"); 
//		  show_div("divPlaylistnumentries");  
//		  show_div("divPlaylists");  
//		  show_div("divPlaylistlastplayed");  		  	
//		  show_div("divPlaylistmostplayed");
//		  show_div("divNowplaying");
//			show_div("divRestart"); 		  
//      configTitle = configTitle + translateOption('playlists') + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";

    break;
// 4: 3rd party
  	case 4:
//		  show_div("divAdobepath");  
		  show_div("divItuneslib");  
//		  show_div("divWinamp");  		  		       		    		   		  		  				    		    		  			  	  		   
			show_div("divRestart"); 		  
      configTitle = configTitle + translateOption('3rdparty') + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";

  	break;
// 5: naming
  	case 5:
		  show_div("divInternetradio");      		    		   		  		  				    		   		  		  
		  show_div("divAdaptcase");
		  show_div("divFolderprefix"); 
		  show_div("divAlltracks");  
		  show_div("divPlaylists");  
		  show_div("divPlaylistlastplayed");  
		  show_div("divPlaylistmostplayed");  
		  show_div("divAllpictures");  
		  show_div("divAllvideos");  		  
		  show_div("divRootmusic");  		  
		  show_div("divRootpicture");  		  
		  show_div("divRootvideo");  		   
		  show_div("divAllname");
		  show_div("divTagspicture");		           		    		   		  		  				    		    		  			  	  		   
			show_div("divRestart"); 		  
      configTitle = configTitle + translateOption('naming') + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";

  	break;
// 6: musictree
  	case 6:
		  show_div("divTreetype"); 
		  show_div("divMusictree");    		    		   		  		  				    		    		  			  	  		   
			show_div("divRestart"); 		  
      configTitle = configTitle + translateOption('musictree') + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";

  	break;
// 7: picturetree
  	case 7:
		  show_div("divTreetype"); 
		  show_div("divPicturetree");       		    		   		  		  				    		    		  			  	  		   
			show_div("divRestart"); 		  
      configTitle = configTitle + translateOption('picturetree') + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";

  	break;
// 8: videotree
  	case 8:
		  show_div("divTreetype"); 
		  show_div("divVideotree");         		    		   		  		  				    		    		  			  	  		   
			show_div("divRestart"); 		  
      configTitle = configTitle + translateOption('videotree') + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";

  	break;
// 9: network
  	case 9:
		  //show_div("divEnableweb");  
		  show_div("divNicrestart");  
		  //show_div("divHttpport");  		  		  
		  //show_div("divRtpport");  
		  show_div("divIp");  
			show_div("divRestart"); 		  
      configTitle = configTitle + translateOption('network') + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";

  	break;

//11: miscellaneous
  	case 11:
		  show_div("divRandomizeplaylists"); 
		  show_div("divIgnoredir"); 
		  show_div("divCompilationsdir"); 		  
		  show_div("divStreambuffer");
		  show_div("divCachedir"); 
		  show_div("divCachemaxsize");
		  show_div("divNorescale");
		  //show_div("divDbdir");   
			show_div("divRestart"); 		          		    		   		  		  				    		    		  			  	  		   
      configTitle = configTitle + translateOption('miscellaneous') + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
      
  	break;
  	
//13: troubleshooting
  	case 13:
	
		  show_div("divTrouble"); 
		  //show_div("divClients"); 
		  //show_div("divNetgearrtp");  
		  //show_div("divNosearch"); 
		  show_div("divLogfile"); 
		  show_div("divRestart"); 		        		    		   		  		  				    		    		  			  	  		   
      configTitle = configTitle + translateOption('troubleshooting') + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";

  	break;
//14: status
  	case 14:
			hide_div("divButtons");  	
			hide_div("divFirstHR");  	
		  show_div("divStatus");     	
		  if (showCDKey) show_div("divCDKey");     	 	    		   		  		  				    		    		  			  	  		   
		  if (showCDKey) show_div("divButtons");    
		  if (showCDKey) show_div("divFirstHR");    
			if (showerror) show_div("divError");
      configTitle = configTitle + translateOption('status') + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
      if (reload) top.frames['CONT_FRAME'].location.reload();

  	break;		 
//15: other basic stuff
  	case 15:
		  show_div("divRestart"); 		        		    		   		  		  				    		    		  			  	  		   
		  show_div("divLanguage");
		  show_div("divFriendlyname"); 
		  show_div("divTreetype"); 
      configTitle = configTitle + translateOption('other') + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
      if (reload) top.frames['CONT_FRAME'].location.reload();

  	break;		 

//15: client/security
  	case 16:
		  show_div("divWebaccess");
		  show_div("divClientDB");
      configTitle = configTitle + translateOption('client/security') + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
      if (reload) top.frames['CONT_FRAME'].location.reload();

  	break;		 
  	
		  	  			  	
		default:  
		}
		title.innerHTML = configTitle;
} 