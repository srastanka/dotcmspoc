
/***
GLOBAL DECLARATIONS

***/
var urlParamMap = null;
var date = new Date();

var USR_SESSION_TIMEOUT_IN_HOUR=1;                 //We can change the session time out. For session to expire in oneday set '24'

date.setTime(date.getTime() +(USR_SESSION_TIMEOUT_IN_HOUR*60*60*1000));
var timeout_interval = "expires="+date.toGMTString();
var referrerValue='';

/***********************************
 * FUNCTION DEFINITIONS (if missing) -------------------------------------------
 ***********************************/
if (!Array.prototype.indexOf) {
	Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {
		"use strict";
		if (this == null) {
			throw new TypeError();
		}
		var t = Object(this);
		var len = t.length >>> 0;
		if (len === 0) {
			return -1;
		}
		var n = 0;
		if (arguments.length > 1) {
			n = Number(arguments[1]);
			if (n != n) { // shortcut for verifying if it's NaN
				n = 0;
			} else if (n != 0 && n != Infinity && n != -Infinity) {
				n = (n > 0 || -1) * Math.floor(Math.abs(n));
			}
		}
		if (n >= len) {
			return -1;
		}
		var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
		for (; k < len; k++) {
			if (k in t && t[k] === searchElement) {
				return k;
			}
		}
		return -1;
	}
}
/************************
 * Detect browser version ------------------------------------------------------
 ************************/
var userAgent = window.navigator.userAgent;
var msie = userAgent.indexOf("MSIE");		// IE 10-

// IE 10-
if (msie > -1) {

	// Version
	var version = parseInt (userAgent.substring(msie+5, userAgent.indexOf(".", msie)));

	// IE8
	if (version < 9) {
		$("html").addClass("lt-ie9");
	}

	// IE9-
	else if (version < 10) {
		$("html").addClass("lt-ie10");
	}

	// IE10
	else if (version >= 10) {
		$("html").addClass("ie10");
	}
}

// IE 11
else if (!!navigator.userAgent.match(/Trident\/7\./)) {
    $("html").addClass("ie11");
}

// Safari
if (userAgent.indexOf("Safari") > -1) {
    $("html").addClass("safari");
    
    if (!userAgent.match(' Chrom') && !!userAgent.match(' Version/5.')) {
        $("html").addClass("safari5");
    }
}


/************************
 * Marketo Enhancement- capturing URL parameters per session ------------------------------------------------------
 ************************/
                referrerValue=getReferrer(); 
                 var nonReferralValue='';
                var pageUrl = window.location.href;
                 var path = "path=/";
		 var urlParamCookie=getCookie("eqx_sess");
               var updatedCookieVal='';
               var queryPath='';
		if (pageUrl.indexOf('?') != -1)
		{
			var landingUrlString = pageUrl.split("?");
			var queryPath = landingUrlString[1];
			if (queryPath) {
				urlParamMap = getUrlParamMap(queryPath);
				if(urlParamCookie=='' || urlParamCookie==null)
				{
		          document.cookie = "eqx_sess=" + queryPath+ "; " + path;
				}
				else
				{
				var urlParamCookieMap=getUrlParamMap(urlParamCookie);

					for (key in urlParamMap)
					{
					if (key) {

							urlParamCookieMap[key]=urlParamMap[key];


							 }
					}
					for (key in urlParamCookieMap)
					{
                                         var keyValue=updatedcookie=key+"="+urlParamCookieMap[key];
                                          if(referrerValue.indexOf("equinix.com")!=-1 && keyValue.indexOf("refCookieVal")!=-1 )
                                           {
                                            nonReferralValue= urlParamCookieMap[key];
                                           }
						else
                                           {
						if(updatedCookieVal=='')
						{
						updatedCookieVal=updatedCookieVal+keyValue;
						}
						else
						{
						updatedCookieVal=updatedCookieVal+"&"+keyValue;
						}
                                          }

					}
                                     document.cookie = 'eqx_sess=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                                     document.cookie = "eqx_sess=" + updatedCookieVal+ "; " + path;
          

					
					urlParamMap=urlParamCookieMap;

				}
			}

		}
		else if(urlParamCookie!='' && urlParamCookie!=null)

			{
				urlParamMap=getUrlParamMap(urlParamCookie);
			}
             
           var refCookieValue='';
            var refStartCookieVal='';
            if(referrerValue!='')
             {
               refCookieValue='&refCookieVal='+referrerValue;
               refStartCookieVal='refCookieVal='+referrerValue;

             }  
                   
            if(referrerValue.indexOf("equinix.com")==-1)
            {
           if(updatedCookieVal=='')
             {
              if(queryPath!='')
				{
                         updatedCookieVal=queryPath+refCookieValue;

				}
                else
             {
              updatedCookieVal=refStartCookieVal;

             }
             }
             else
             {
               updatedCookieVal=updatedCookieVal+refCookieValue;
             }
             document.cookie = 'eqx_sess=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
           document.cookie = "eqx_sess=" + updatedCookieVal+ "; " + path;
          
             }
              
             
              else{
                 if(nonReferralValue!='')
                 { 
                  referrerValue=nonReferralValue;
                  }
               else
               {
            var  eqxSessCookie=getCookie("eqx_sess");
           referrerValue=getReferralValue(eqxSessCookie);
              }
            }
          
	    function getReferralValue(eqxSessCookie)
	   {
           var refVal='';
  	    var refIndex=eqxSessCookie.indexOf("refCookieVal");
            if(refIndex!=-1)
            {
	     refVal=eqxSessCookie.substring(refIndex+13);
            }

            else
           {
            refVal='';
           }
	    return refVal;
	   }  


          function getUrlParamMap(queryPath) {
		var queryStrings = queryPath.split("&");

		var keyValMap = new Object();

		for ( var i = 0; i < queryStrings.length; i++) {
			var keyVal = queryStrings[i];
			if (keyVal.match(/[=]/)) {
				var keyValLen = keyVal.split("=");
				if (keyValLen[0] != null && keyValLen[1] != null) {
                          keyValMap[decodeURI(keyValLen[0])] = decodeURI(keyValLen[1]);
                                     
				}
			}

		}

		return keyValMap;
	}
         

/********************************************
 * Don't know if these are needed or not, meh ----------------------------------
 ********************************************/

$("header li.dropdown").hover(
	// Mouse enter event
	function() {
		$(this).children(".dropdown-menu").css("display", "block");
	},

	// Mouse leave event
	function() {
		$(this).children(".dropdown-menu").css("display", "none");
	}
);
 	$(".dropdown-toggle").on('click', function() {
		$('.dropdown-menu').toggleClass('hidden');
	});

/*********
 * AddThis ---------------------------------------------------------------------
 *********/

/**
 * Dynamically add "AddThis" script at the bottom of every page OLD
 */
// $(document).ready(function() {
// 	var addThisDiv = '<div class="addthis-wrapper"><div class="addthis_sharing_toolbox"></div></div>';
// 	$(".addthis").append(addThisDiv);

// 	var s = $(document.createElement("script"));
// //    s.type = "text/javascript";
// //    s.src = "http://s7.addthis.com/js/300/addthis_widget.js#pubid=ra-53ab1ece6ed71f3b";
// 	s.attr("type", "text/javascript");
// 	s.attr("src", "//s7.addthis.com/js/300/addthis_widget.js#pubid=ra-53ab1ece6ed71f3b");
//     $("body").append(s);

// });
/**
 * Dynamically add "AddThis" script at the bottom of every page NEW
 */
$(document).ready(function() {
    if (window.self === window.top) {
        addThis();
    }
});

function addThis() {
    var addThisDiv = '<div class="addthis-wrapper"><div class="addthis_sharing_toolbox"></div></div>';
    $(".addthis").append(addThisDiv);
    var s = $(document.createElement("script"));
    s.attr("type", "text/javascript");
    s.attr("src", "//s7.addthis.com/js/300/addthis_widget.js#pubid=ra-53ab1ece6ed71f3b");
    $("body").append(s);
}

/*************************
 * Component-related stuff -----------------------------------------------------
 *************************/

/**
 * Loads the components from the given list
 * @param compList Array of component names
 */

function loadComponents(compList)
{
	// For every component
	for (var compIndex = 0; compIndex < compList.length; compIndex++) {
		var compObj = compList[compIndex];

		// Component properties
		var compName = compObj.name;			// help_dcm_comp
		var compParams = compObj.params;

		// Component name
		compName = $.trim(compName);			// No native trim() in IE8 -_-
		compName = compName.toLowerCase();		// help_dcm_comp

		// Component JQuery selector
		//var compSelector = "#" + compName;
		var compSelector = "div[id^='" + compName+ "']";

		// Rebuild directory
		var compDir = compName.toUpperCase();	// HELP_DCM_COMP

		// Find HTML partial for component
		var compElement = $(compSelector);
        
        //commented out by FWTEAM - For IE8 blanking out issue - 22-10-2015
        //var compPath = "${dotTheme.path}local/UTB/Components/" + compDir + "/HTML/" + compName + ".html";
        
        /*Added by FWTEAM - For IE8 blanking out issue - 22-10-2015*/
        /*START*/
        var compPath;
        if(compName !== undefined && compName == "lightbox_comp")
        {
            compPath = "/lightbox-comp-html/";
        } else {
            compPath = "${dotTheme.path}local/UTB/Components/" + compDir + "/HTML/" + compName + ".html";
        }
        /*END*/

		// JQuery AJAX call
		$.ajax({
			url: compPath,
			async: false,
			complete: function(jqXHR, textStatus) {

				// Load response partial
				compElement.append(jqXHR.responseText);

				// Call custom component function
				if (compParams !== null) {
					var customFunc = compName + "_func";
					customFunc = window[customFunc];
					customFunc(compParams);
				}
			}
		});
	}
}

/*****************************
 * Utility navigation (topbar) -------------------------------------------------
 *****************************/

$(document).ready(function() {

	/**
	 * Change language link to correct domain (DESKTOP/TABLET)
	 */
	$("#header > .navbar .hidden-xs .login + ul.nav li a").each(function() {

		// Combine current link href and current page
		var pageUrl = window.location.pathname;
		var linkHref = $(this).attr("href");
		linkHref += pageUrl;

		// Set new link href
		$(this).attr("href", linkHref);
	});

	/**
	 * Change language link to correct domain (MOBILE)
	 */
	$("#header > .navbar .visible-xs #languageMenu li a").each(function() {

		// Combine current link href and current page
		var pageUrl = window.location.pathname;
		var linkHref = $(this).attr("href");
		linkHref += pageUrl;

		// Set new link href
		$(this).attr("href", linkHref);
	});
});



/***********************
 * Show IE8 update modal -------------------------------------------------------
 ***********************/

//If we put document.ready function, then for below ie9 versions, it's not going inside document.ready function, so we have commented out this function's start and end lines. Added by fw team


    // Show modal on all IE8 pages and only on test page for other browsers
    if ($("html").hasClass("lt-ie9") ||
        $("html").hasClass("safari5") ||
        window.location.pathname === "/NonComponents_Test/IE8_MODAL/HTML/l3-7.html") {
        
        var modalID = "updateIE8_modal";

        var modalDiv = $(document.createElement("div"));
        modalDiv.attr("id", "lightbox_comp");
        modalDiv.addClass("updateIE8_lightbox")
        $("body").prepend(modalDiv);

        var modalLink = $(document.createElement("a"));
        modalLink.addClass("updateIE8_link");
        modalLink.attr("href", "#");
        modalLink.attr("data-toggle", "modal");
        modalLink.attr("data-target", "#" + modalID);
        $("body").prepend(modalLink);

        // Required components
        var comps = [

            // LIGHTBOX
            {
                name: "lightbox_comp",
                params: null
            }
        ];

        // Call global loadComp function
        loadComponents(comps);

        // Update modal settings
        var ie8_modal = $(".updateIE8_lightbox #myModal");
        ie8_modal.attr("id", modalID);
        ie8_modal.find("#myModalLabel").html("Equinix");
        ie8_modal.find(".modal-body h2").html("Your browser is out-of-date!");
        ie8_modal.find(".modal-body p").html("Your current browser is out-of-date and cannot display all features of Equinix.com. Please download one of these up-to-date and free browsers to view our website:");

        // Make browser row
        var browserRow = $(document.createElement("div"));
        ie8_modal.find(".modal-body section").append(browserRow);
        browserRow.addClass("row");

        // Browser data
        var browserInfo = [
            ["http://support.apple.com/downloads/#safari", "${dotTheme.path}local/UTB/Global/Images/ie8_safari.png", "Safari"],
            ["http://www.google.com/intl/en/chrome/browser/#brand=CHMB&utm_campaign=en&utm_source=en-ha-na-us-sk&utm_medium=ha","${dotTheme.path}local/UTB/Global/Images/ie8_chrome.png", "Chrome"],
            ["http://www.mozilla.org/en-US/firefox/new/", "${dotTheme.path}local/UTB/Global/Images/ie8_firefox.png", "Firefox"],
            ["http://windows.microsoft.com/en-us/internet-explorer/download-ie", "${dotTheme.path}local/UTB/Global/Images/ie8_ie.png", "Internet Explorer"],
        ];

        // For each browser
        for (var i = 0; i < 4; i++) {
            var browserCol = $(document.createElement("div"));
            browserCol.appendTo(browserRow);
            browserCol.addClass("col-xs-3");

            var browserDiv = $(document.createElement("div"));
            browserDiv.appendTo(browserCol);
            browserDiv.addClass("browser");

            var browserLink = $(document.createElement("a"));
            browserLink.appendTo(browserDiv);
            browserLink.attr("href", browserInfo[i][0]);

            var browserImg = $(document.createElement("img"));
            browserImg.appendTo(browserLink);
            browserImg.attr("src", browserInfo[i][1]);
            browserImg.attr("alt", browserInfo[i][2]);

            var browserText = $(document.createElement("p"));
            browserText.appendTo(browserLink);
            browserText.html(browserInfo[i][2]);
        }

        // Force modal
        $(".updateIE8_link").trigger("click");
    }
//});

/*******************
 * RESPONSIVE IFRAME -----------------------------------------------------------
 *******************/

$(document).ready(function() {
    $("cdn_embed").each(function() {
        var children = $(this).children().length;
        var iframeChildren = $(this).children("iframe").length;

        // Only if one iframe in an embed
        if (children === 1 && iframeChildren === 1) {
            var iframe = $(this).children("iframe");
	//***START- Code for Changing the iframe src value based on sl_locale for cdn domain - Added by FWTEAM INDIA ***
		var SrcValue=$(this).children("iframe").attr('src');
		if(SrcValue && SrcValue.indexOf("cdn.equinix.com/")!=-1)
		{
			$(this).children("iframe").attr('src',editIframeSrcValueBasedOnSlLocale(SrcValue,iframeLocale+'/'));
		}
	//***END- Code for Changing the iframe src value based on sl_locale for cdn domain - Added by FWTEAM INDIA ***
            var height = iframe.attr("height");

            // Create responsive container and set height
            var container = $(document.createElement("div"));
            container.addClass("responsive_iframe_container");
            container.css("padding-bottom", height + "px");
            iframe.appendTo(container);

            // Append to DOM
            $(this).after(container);
            $(this).remove();
        }
    })
});

/*********************
 * STYLE GUIDE SCRIPTS ---------------------------------------------------------
 *********************/
$(document).ready(function() {
    if (window.location.pathname === "/style_guide.html") {
        $("span.Icon").each(function() {
            var name = $(this).attr("class").split(" ")[1];

            var nameP = $(document.createElement("p"));
            nameP.html(name);
            $(this).after(nameP);
        });
    }
});

/***********************
 * <custom> PADDING HACK -------------------------------------------------------
 ***********************/
$(document).ready(function() {
    $("div.row > div.pull-left.col-xs-12").each(function() {

        var mediaBody = $(this).children("div.media-body");

        if (mediaBody.length > 0) {
            $(this).css("padding-left", 0);
            $(this).css("padding-right", 0);
        }
    });
})

/******************************
 *  * Icomoon EQ Icons padding hax ------------------------------------------------
 *******************************/
 /* -- Commented out By FW TEAm - Provided in JIRA 681 to Fix icomoon
$(document).ready(function() {

    // Grab all icons, not (File-Empty and Newspaper)
         var eqIconSelector = 'span[class*="EQ-"]:not(.EQ-File-Empty):not(.EQ-Newspaper)';
    
    // Set dimensions equal to font-size
         $(eqIconSelector).each(function() {
              var currentIcon = $(this);
              var fontSize = currentIcon.css("font-size");
              currentIcon.css("width", fontSize);
              currentIcon.css("height", fontSize);
         });
});
 */   


// ***START - This function is used for changing the iframe src value based on locale for cdn domain - Added  by FWTEAM INDIA***
function editIframeSrcValueBasedOnSlLocale(SrcValue,iframeLocale) {

var domainMap=[
					{"localeName":"en-GB","localeValue":"cdn.equinix.co.uk"},
					{"localeName":"en-AE","localeValue":"cdn.equinix.ae"},
					{"localeName":"de-CH","localeValue":"cdn.de.equinix.ch"},
					{"localeName":"fr-CH","localeValue":"cdn.fr.equinix.ch"},
					{"localeName":"en-CH","localeValue":"cdn.equinix.ch"},
					{"localeName":"en-NL","localeValue":"cdn.equinix.nl"},
					{"localeName":"de-DE","localeValue":"cdn.equinix.de"},
					{"localeName":"fr-FR","localeValue":"cdn.equinix.fr"},
					{"localeName":"en-SG","localeValue":"cdn.equinix.sg"},
					{"localeName":"ja-JP","localeValue":"cdn.equinix.co.jp"},
					{"localeName":"en-HK","localeValue":"cdn.equinix.hk"},
					{"localeName":"en-CN","localeValue":"cdn.en.equinix.cn"},
					{"localeName":"zh-CN","localeValue":"cdn.equinix.cn"},
					{"localeName":"en-AU","localeValue":"cdn.equinix.com.au"},
					{"localeName":"pt-BR","localeValue":"cdn.equinix.com.br"}
					];

var domain="cdn.equinix.com";
	for(var i = 0; i < domainMap.length; i++) {
			if(domainMap[i].localeName==iframeLocale)
			{
				domain = domainMap[i].localeValue ;
			}
		}

SrcValue = SrcValue.replace("cdn.equinix.com",domain );
return SrcValue+"?locale="+iframeLocale;

	}
// ***END - This function is used for changing the iframe src value based on locale for cdn domain - Added  by FWTEAM INDIA***

/**CUSTOM CODE ADDED BY FWTEAM - FOR CONSENT PAGE**/
/*START*/

(function ($) {

$(document).ready(function() {

	//modal
	var consentModal = $('#modalC');

	//theme
	var consentPageTheme = $('#consentPage_theme');
	var consentWrapperTheme = $('#consentWrapper_theme');
	var consentPageThemeContent;

	//footer
	var consentPageFooter = $('#consentPage_footer');
	var consentWrapperFooter = $('#consentWrapper_footer');
	var consentPageFooterContent;

	//theme
	if(consentPageTheme !== undefined)
	{
		consentPageThemeContent = consentPageTheme.clone(true,true);
		consentPageTheme.remove();
	}

	//footer
	if(consentPageFooter !== undefined)
	{
		consentPageFooterContent = consentPageFooter.clone(true,true);
		consentPageFooter.remove();
	}

	//theme
	if(consentPageTheme !== undefined && consentModal !== undefined)
	{
		consentModal.modal('show');
	}

	$("#agree").on('click', function() {

		$("#modalC .close").trigger("click");

		//theme
		if(consentPageThemeContent !== undefined)
		{
		consentWrapperTheme.html(consentPageThemeContent);
		consentWrapperTheme.css("display", "block");
		consentPageTheme = consentWrapperTheme.children('#consentPage_theme');
		consentPageTheme.css("display", "block");
		}

		//footer
		if(consentPageFooterContent !== undefined)
		{
		consentWrapperFooter.html(consentPageFooterContent);
		consentWrapperFooter.css("display", "block");
		consentPageFooter = consentWrapperFooter.children('#consentPage_footer');
		consentPageFooter.css("display", "block");
		}

	});

	$("#disagree").on('click', function() {
        var disagreeContent = $('#disagreeContent');
		if(disagreeContent !== undefined)
		{
			disagreeContent.css("display","block");
		}
	});

 });

})(jQuery);

/*END*/

/*Added by FW TEAM - To fix video playing issue in Modal - LINK-UTX IMPLEMENTATION*/
/*START*/

(function ($) {

$(document).ready(function() {

 	var modalDivs = $('div[id^="linkUTX_Modal_"]');
	if(modalDivs !== undefined)
	{
		modalDivs.each(function(index){

			modalDivs.eq(index).on('hidden.bs.modal', function (e) {
				modalDivs.eq(index).find("iframe").each(function(key, value) {
					var url = $(this).attr("src");
					$(this).attr("src","");
					$(this).attr("src",url);
				});
			});

		}) ;
	}

});

})(jQuery);

/*END*/

/*Added by FW TEAM - To fix video playing issue in Tab - TCM IMPLEMENTATION*/
/*START*/

function processTab(tab)
{
    if(tab !== undefined)
	  {
		//console.log("XXX");
		//console.log("aria-controls == "+ tab.attr("aria-controls") );
		
		var tabContentDivId = tab.attr("aria-controls");
		var tabContentDivElement;
		if(tabContentDivId !== undefined)
		{
			tabContentDivElement = $("#"+tabContentDivId);
		}
		if(tabContentDivElement !== undefined)
		{
			tabContentDivElement.find("iframe").each(function(key, value) {
				//console.log(">>>iframe processTab()");
				var url = $(this).attr("src");							    
			    $(this).attr("src","");
			    $(this).attr("src",url);
			});
		}

		}
}

(function ($) {

$(document).ready(function() {

	$('a[data-toggle="tab"]').on('show.bs.tab', function (e) {
	  //e.target // activated tab
	  //e.relatedTarget // previous tab
	  var previousActiveTab = $(e.relatedTarget);
	  processTab(previousActiveTab);
	  
	  if(isFirefox())
	  {
	       //console.log(">>>>isFirefox()");
	       var activatedTab = $(e.target);
	       processTab(activatedTab);
	  }

	});

});

})(jQuery);

/*
*TCM tab ajax call on load of window - 17-JULY-2015
*
*/
$(window).load(function(){
	//code added for tab ajax call dynamically
if($('.tab-content > div').length >0)
{
$('.tab-content > div').each(function(index){	

if($("#tabAssetInput").length)
{

var assettypeandid = $("#tabAssetInput").val().split(",");
var childid =$(this).attr('id');
if(childid.match("^tab-"))
{
var res = childid.split("-");
   if(res[1]>0)
	  {	
  loadTabContent(assettypeandid[0],assettypeandid[1],res[1],childid,currentLocale);
 	  }	 
		  
	
}

}
    }).promise().done( function(){ 
	
	setTimeout(function(){
	renderingMap();	
	//alert("AF rendering");
}, 5000) });
}
else{
	renderingMap();
}
} );

/**************************************
 * YouTubes in IE8 disregarding z-index ----------------------------------------
 **************************************/

$(window).load(function() {
    if ($("html").hasClass("lt-ie9") ||     // IE8
        $("html").hasClass("lt-ie10") ||    // IE9
        $("html").hasClass("ie10") ||       // IE10
        $("html").hasClass("ie11")) {       // IE11

        $("iframe").each(function() {
           var src = $(this).attr("src");

            if(src !== undefined)
            {

            if (src.indexOf("?") > -1) {
               var tokens = src.split("?");
               var newUrl = tokens[0] + "?wmode=opaque&" + tokens[1];
               $(this).attr("src", newUrl);
            }
            else {
               var newUrl = src + "?wmode=opaque";
               $(this).attr("src", newUrl);
            }
            
            }
        });
    }
	});

/**************************************
 * Resource components search. Added as part of WCM-859.
 **************************************/


$(document ).ready(function(){

$('#search_button').click(function(){
	var search_query='';
	if($('#search_input').length)
	{

		search_query=$('#search_input').val();
	}
 	window.location.href = "/resources/results/?PlainText="+search_query.trim();
});

$('#search_input').keydown(function(event){
	if ( event.which == 13 ) {
		var search_query='';
		if($('#search_input').length)
		{
			search_query=$('#search_input').val();
		}
		if(search_query != null && search_query.trim() != '' && search_query != undefined )
		{
		
   			 window.location.href = "/resources/results/?PlainText="+search_query.trim();
  		}
	}
});
});

// tab load ajax call function homepage 2.0 - TCM IMPLEMENTATION
function loadTabContent(tabassettype,tabassetid, tabno,targetid,localeVal)
{
	var tid = "#"+targetid;
	var findchild = tid+" div.eq-tab";
	 var loaderId = "#loaderDiv"+tabno;
	if(targetid != 'tab-0' && $(findchild).find('div.row').length == 0)
	{
	
	var xmlhttp;
	var ajaxURL = "/utm_tab_content/?id="+tabassetid+"&type="+tabassettype+"&tabno="+tabno+"&sl_locale="+localeVal;
	if (window.XMLHttpRequest)
	{// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp=new XMLHttpRequest();
	}
	else
	{// code for IE6, IE5
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}

	xmlhttp.open("GET",ajaxURL,true);

	
	try
	{
		xmlhttp.send();
	} 
	catch(err){	
		customLog.info("Failed to make a AJAX call..."+err);
	} 
	// xmlhttp.send();

	xmlhttp.onreadystatechange=function()
	{
		if (xmlhttp.readyState==4)
		{
			
			if(xmlhttp.status==200){	
			$(loaderId).css("display", "none");
			$(tid).find('div.eq-tab').html(xmlhttp.responseText);
			//  renderingMap();
			var tabContentContainer = $(tid).find('div.eq-tab');
			loadCaption(tabContentContainer);
			setCustomTagPadding(tabContentContainer);
			setSectionDataColsAndAdjustColumns(tabContentContainer);
			}
		}
	}
		
	}
}

function loadCaption(tabContentContainer)
{
    if(tabContentContainer !== undefined && tabContentContainer.length)
    {
		// Run caption logic on each found ".caption"
		$(tabContentContainer).find("[class^=caption]").each(function() {
			buildCaption($(this));
		});
		
		// Run caption logic on each found ".callout"
		$(tabContentContainer).find("[class^=callout]").each(function() {
			buildCaption($(this));
		});
    }
}

function setCustomTagPadding(tabContentContainer)
{
    if(tabContentContainer !== undefined && tabContentContainer.length)
    {
    
    tabContentContainer.find("div.row > div.pull-left.col-xs-12").each(function() {

        var mediaBody = $(this).children("div.media-body");

        if (mediaBody.length > 0) {
            $(this).css("padding-left", 0);
            $(this).css("padding-right", 0);
        }
    });
    
    }//if
}

function getSectionAttributes(sectionElement)
{
    var attributes = {};

    if( sectionElement.length ) {
        $.each( sectionElement[0].attributes, function( index, attr ) {
            attributes[ attr.name ] = attr.value;
        } );
    }

    return attributes;
}

function setSectionDataColsAndAdjustColumns(tabContentContainer)
{
    if(tabContentContainer !== undefined && tabContentContainer.length)
    {
        
    tabContentContainer.find("section").each(function(i, element) {
        var self = this;
        //lets get an object of all attributes on each section tag
        var attributes = getSectionAttributes($(self));
        for (var a in attributes) {
            //if any of the attributes are a number between 1 - 12 lets add
            //datacols to the element
            if (a.match(/^[0-9]+$/) && a >= 1 && a <=12) {
                $(self).attr("data-cols", a);
                $(self).get(0).removeAttribute(a);
            }
        }
    });
    tabContentContainer.find("section[data-cols]").each(function() {
        columnsAdjust.start($(this));
    });

    tabContentContainer.find("section[data-cols]").each(function() {
        columnsAdjust.adjustParents($(this));
    });
        
    }//if
}

/*END*/
