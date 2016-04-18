/**
 * Equinix Maintenence
 * New Home Page Navigation - Scripting
 *
 * JavaScript
 *
 * @category Equinix
 * @package  NewNavigation
 * @author   Digital Trike <webmaster@digitaltrike.com>
 * @author   Kai Hatch <kai@digitaltrike.com>
 * @version  01/31/2014
 * @license  Digital Trike MSA
 * @link     http://www.equinix.com
 */

/***********
 * CONSTANTS -------------------------------------------------------------------
 ***********/

/**
 * Class name of menu div
 */
var NEWNAVIGATION_CONTAINER_LOCATION = ".menuContainer";

/**
 * Class name of for active div
 */
var NEWNAVIGATION_ACTIVE_CLASS = "active";

/**
 * JQuery slide speed
 */
var NEWNAVIGATION_TOGGLE_SPEED = "slow";

/**
 * Header + nav height
 */
var NEWNAVIGATION_HEADER_NAV_HEIGHT = "148";

/*********
 * GLOBALS ---------------------------------------------------------------------
 *********/

/**
 * Current class of the link clicked
 */
var _NewNavigation_currentClass = null;

/**
 * Show menu or not
 */
var _NewNavigation_showMenu = false;


/**
 * Current page is a homepage
 */
var _NewNavigation_isHomePage = false;


var menuContentPresent = false; /*newly added to display menu content in MainNav*/

/***********
 * FUNCTIONS -------------------------------------------------------------------
 ***********/

/**
 * Toggles on/off the respective main navigation link highlight based on what
 * link is clicked.
 *
 * @return void
 */
function toggleMenuHighlight()
{
var checkActive = "active";
    var link = $("#nav a." + _NewNavigation_currentClass);
    var linkParent = link.parent();
    linkParent.toggleClass(checkActive);

}

/**
 * Toggles on/off the respective menu content div based on the current main
 * navigation link clicked.
 *
 * @return void
 */
function toggleMenuContent()
{
    var selectorQuery = NEWNAVIGATION_CONTAINER_LOCATION +
                        " .menuContent div." +
                        _NewNavigation_currentClass;
    var menuContent = $(selectorQuery);
    menuContent.toggleClass(NEWNAVIGATION_ACTIVE_CLASS);
	
}

/**
 * Opens a menu based on link clicked in main navigation.  Also, takes care
 * of switching menu contexts if a new main navigation link is clicked.
 *
 * @param  <a>  link The link that was clicked
 * @return void
 */
function openMenu(link)
{

if(menuContentPresent == true) /*newly added to display menu content in MainNav*/
{
	var parentElement = $(link).parent();
	var parentClass = parentElement.attr("class");
	
	if(parentClass && parentClass.indexOf("active") != -1 )
	{
		closeMenu();
		  
	}
    else {

		// For exiting on close
		$.when($(NEWNAVIGATION_CONTAINER_LOCATION).scrollTop()).done(function(){

			// If menu already open
			if (_NewNavigation_showMenu) {
				toggleMenuContent();
				toggleMenuHighlight();
			}

			// Get clicked link's class
			var qLink = $(link);
			var qLinkClass = qLink.attr("class");

			// Exit early for industries
			/*if (qLinkClass == "navIndustries") {
				_NewNavigation_showMenu = false;
				$(NEWNAVIGATION_CONTAINER_LOCATION).css("display", "none");
				window.location = "#industries";
				return;
			}*/

			// Set current class
			_NewNavigation_currentClass = qLinkClass;

			// Activate new menu
			toggleMenuHighlight();
			toggleMenuContent();

			// Slide out menu
			if (!_NewNavigation_showMenu) {
                                    _NewNavigation_showMenu = true;
            $(NEWNAVIGATION_CONTAINER_LOCATION).slideToggle({
            	duration: NEWNAVIGATION_TOGGLE_SPEED, 
            	start: function() {
            	    

                	// Homepage-specific
                    if (_NewNavigation_isHomePage === true) {
                      // $("body").css("padding-top", NEWNAVIGATION_HEADER_NAV_HEIGHT + "px");
                        $("body > .container").css("margin-top", "0");
                    }
	            },
            	done: function() {
	                _NewNavigation_showMenu = true;
	                
	                // Homepage-specific
	                if (_NewNavigation_isHomePage === true) {
	                   //$("body").css("padding-top", NEWNAVIGATION_HEADER_NAV_HEIGHT + "px");
	                    $("body > .container").css("margin-top", "0");
	                    $(".menuContainer").css("height", "auto");
	                }
	            }, 
            });
        }
		});
	
	}//else
}//if	

}

/**
 * Dynamically generates the new menu nav from given HTML nav
 *
 * @param  <a>  link The link that was clicked
 * @return void
 */
function closeMenu(slideSpeed)
{
	//event.preventDefault();
    // Optional parameter
    slideSpeed = typeof slideSpeed !== 'undefined' ? slideSpeed : NEWNAVIGATION_TOGGLE_SPEED;

     if (_NewNavigation_showMenu) {
       _NewNavigation_showMenu=false;
        $(NEWNAVIGATION_CONTAINER_LOCATION).slideToggle({
        	duration: slideSpeed,
        	done: function() {
        	    // Window width
        	    // Homepage-specific
                if (_NewNavigation_isHomePage === true) {
                    $("body").css("padding-top", "0");
                    //alert("inside if ishomepage");
                    if (windowWidth <= 767) {
                        $("body > .container").css("margin-top", "0px");
						//alert("inside if of windowWidth");
                    }
                    else {
                       // $("body > .container").css("margin-top", NEWNAVIGATION_HEADER_NAV_HEIGHT + "px");  
					     $("body > .container").css("margin-top", "0");
						//alert("inside else");
                    } 
                }
          
                    
            },
	
        });
        	     
                      setTimeout(
  function() 
  {
    //do something special
toggleMenuContent();
  }, 500);        
                      
                     
                     
			toggleMenuHighlight();  
                     var windowWidth = $(window).width();

    }
}


/**
 * Helper function to set the fixed of the header and main nav.
 */
function setFixedHeader(flag) {
    if (flag === true) {
        // Set header as fixed
        $("#header").css("position", "fixed");
        $("#header").css("top", "0");
        $("#header").css("left", "0");
        $("#header").css("right", "0");
        $("#header").css("z-index", "999");
    
        // Set MainNavigation as fixed
        //$(".mainNavigation").css("position", "fixed");
        //$(".mainNavigation").css("top", "50px");
        //$(".mainNavigation").css("left", "0");
        //$(".mainNavigation").css("right", "0");
    }
    
    else {
        // Set header as static
        $("#header").css("position", "static");
        $("#header").css("top", "auto");
        $("#header").css("left", "auto");
        $("#header").css("right", "auto");
        $("#header").css("z-index", "auto");
    
        // Set MainNavigation as static
        $(".mainNavigation").css("position", "static");
        $(".mainNavigation").css("top", "auto");
        $(".mainNavigation").css("left", "auto");
        $(".mainNavigation").css("right", "auto");
    }
}




/****************
 * GLOBAL SCRIPTS --------------------------------------------------------------
 ***************/

/**
 * Exit menu on scrolling
 */
/*$(window).scroll(function(){
    var offset = $('header').offset();
    $.when($(NEWNAVIGATION_CONTAINER_LOCATION)).done(function() {
        if (window.location.pathname === "/ComponentLibrary/index.html") {
            return;
        }
        else if ((_NewNavigation_isHomePage === true && offset.top >= 15) ||
            (_NewNavigation_isHomePage === false && offset.top >= 0)){
            closeMenu();
        }
    });
});*/
$(window).scroll(function(){
//    var offset;
//    
//    if (_NewNavigation_isHomePage === true) {
//        offset = $(".mainNavigation").offset();
//    }
//    
//    else {
//       offset = $('header').offset();
//    }
    if($('.menuContainer').is(":visible")) {
			
           closeMenu();
        }
    var offset = $(".mainNavigation").offset();
    
//    $.when($(NEWNAVIGATION_CONTAINER_LOCATION)).done(function() {
//        if (window.location.pathname === "/ComponentLibrary/index.html") {
//            return;
//        }
////        else if ((_NewNavigation_isHomePage === true && offset.top >= 15) ||
////            (_NewNavigation_isHomePage === false && offset.top >= 0)){
////            closeMenu();
////        }
//        else if (offset.top >= 0) {
//            closeMenu();
//        }
//    });
    
    //if (_NewNavigation_isHomePage === true && $(window).outerWidth() > 767) {
    if ($(window).outerWidth() > 767) {
        var offset = $(window).scrollTop();
        
        if (offset < 100) {
            $("#header").removeClass("minimal");
            $(".mainNavigation").removeClass("minimal");
            
            var logoContainer = $(".mainNavigation > .container > .row > div:nth-child(1)");
            logoContainer.removeClass("col-sm-1");
            logoContainer.addClass("col-sm-2");
            
            var logoContainer2 = $(".mainNavigation > .container > .row > div:nth-child(2)");
            logoContainer2.removeClass("col-sm-9");
            logoContainer2.addClass("col-sm-10");
        }
        
        else {
            $("#header").addClass("minimal");
            $(".mainNavigation").addClass("minimal");
            
            var logoContainer = $(".mainNavigation.minimal > .container > .row > div:nth-child(1)");
            logoContainer.removeClass("col-sm-2");
            logoContainer.addClass("col-sm-1");
            
            var logoContainer2 = $(".mainNavigation.minimal > .container > .row > div:nth-child(2)");
            logoContainer2.removeClass("col-sm-10");
            logoContainer2.addClass("col-sm-9");
        }
    }
});


/**
 * Enable/disable mobile menu
 */
$(document).ready(function() {
    // Window width
   
    var windowWidth = $(window).width();
	
	// Make header and main nav fixed if homepage
    if (window.location.pathname === "/" ||
        window.location.pathname === "/Themes/EQ_HOME-PAGE_THM/HTML/home-page.html") {
        _NewNavigation_isHomePage = true;
        
        // Set global margin
        //$("body > .container").css("margin-top", "148px");
        
        // Set header as fixed
        if (windowWidth > 767) {
            setFixedHeader(true);
        }
    }

    var querySelector = "#nav .panel:not(.multi_conv_flag) > a";

    // Enable mobile menu on load
    if (windowWidth <= 767) {
        $(querySelector).attr("data-toggle", "collapse");
        $(querySelector).attr("onclick", "");
        
        // Homepage-specific
        if (_NewNavigation_isHomePage === true) {
            $("body > .container").css("margin-top", "0");
        }
    }
    
    // Non-mobile
    else {        $(querySelector).attr("data-toggle", "");
        $(querySelector).attr("onclick", "openMenu(this);");
    }

    // When window is resized
  
});

$(document).ready(function(){

    $("nav.navbar-default .navbar-toggle").click(function(){
        if ($(this).hasClass("collapsed")) {
            $(this).children("span:nth-child(2)").addClass("glyphicon glyphicon-remove").removeClass("icon-bar");
            $(this).children("span.icon-bar").css("display", "none");
            $(this).children("span:nth-child(2)").css("width", "22px");
        } else {
            $(this).children("span:nth-child(2)").addClass("icon-bar").removeClass("glyphicon glyphicon-remove");
            $(this).children("span.icon-bar").css("display", "block");
            $(this).children("span:nth-child(2)").css("width", "22px");
        }
    });
});

/*Begin-newly added to display menu content in MainNav*/
$(window).load(function() {
       var selectorQueryTemp = NEWNAVIGATION_CONTAINER_LOCATION +
                        ".menuContent div." +
                        _NewNavigation_currentClass;
		
       var menuContentTemp = $(selectorQueryTemp);
	
       if (menuContentTemp!=null) { 
         menuContentPresent = true;
       }

});
/*End-newly added to display menu content in MainNav*/


$(document).ready(function() {

    $(".mainNavigation #navAccordion .panel > a").each(function() {
        
        // Block default if no redirect
        $(this).on("click", function(event) {
            if ($(this).attr("href") === "#") {
                
                // Non-IE
                if (event.preventDefault) {
                    event.preventDefault();
                }
                
                // IE
                else {
                    event.returnValue = false;
                }
            }
        });
    });
});
/* Header scroll function */
$(document).ready(function() {
    
    // Old header
    $("#header .add-navs.hidden-xs ul.navbar-nav li.dropdown div.dropdown-menu").each(function(index) {
        var minimalDropdown = $(".mainNavigation > .container > .row > div:nth-child(3) > div.dropdown").eq(index);
        minimalDropdown.append($(this).clone());     
    });
    $("#header #navbar form.navbar-form").each(function() {
        var minimalDropdown = $(".mainNavigation > .container > .row > div:nth-child(3) > div.dropdown:last .dropdown-menu");
        minimalDropdown.append($(this).clone());  
    });
    
    // HomePage 2.0 header
    $("#header-v2 .headerWrapper").each(function() {
        var minimalDropdown = $(".mainNavigation > .container > .row > div:nth-child(3)");
        minimalDropdown.empty();
        minimalDropdown.append($(this).clone()); 
    });
    
    /******************************
     * LangSelector DropDown Links - Appending the current page's relative url with the domain url in Language Selector dropdown links
     ******************************/
    frameLanguageSelectorDropDownLinks();
    
});

/**
 * This function gets the current page's relative path and
 * language menu container for normal and minimal header.
 * Then it calls functions with appropriate parameters
 * to frame the Language Selector DropDown links in
 * Normal and Minimal header.
 */
function frameLanguageSelectorDropDownLinks()
{
    var currentPageRelativePath = location.pathname;
    var languageMenuContainer = $("#header-v2 .hoverMenu .menuBody.language");
    var languageMenuContainerMinimal = $(".mainNavigation .hoverMenu .menuBody.language");
    
    frameLinks(languageMenuContainer, currentPageRelativePath);
    frameLinks(languageMenuContainerMinimal, currentPageRelativePath);
}

/**
 * This function gets the current page's relative path and
 * language menu container as input.
 * Here the current page's relative path is 
 * appended to the domain url present in each of the 
 * Language Selector DropDown links present in the language menu container.
 * @param {Object} languageMenuContainer 
 * @param {String} currentPageRelativePath
 */
function frameLinks(languageMenuContainer, currentPageRelativePath)
{
    if(languageMenuContainer !== undefined && languageMenuContainer.length)
    {
        var listElement = languageMenuContainer.find("ul li");
        if(listElement !== undefined && listElement.length)
        {
            listElement.each(function(index){
                var anchorElement = $(this).find("a");
                if(anchorElement !== undefined && anchorElement.length)
                {
                    var anchorHrefValue = anchorElement.attr("href");
                    anchorElement.attr("href", anchorHrefValue + currentPageRelativePath);
                }//if
            });
        }//if
    }//if
}


$(document).ready(function() {
    //if (_NewNavigation_isHomePage === true) {
        var offset = $(window).scrollTop();
        
        if (offset > 100) {
            $("#header").addClass("minimal");
            $(".mainNavigation").addClass("minimal");
            
            var logoContainer = $(".mainNavigation.minimal > .container > .row > div:nth-child(1)");
            logoContainer.removeClass("col-sm-2");
            logoContainer.addClass("col-sm-1");
            
            var logoContainer2 = $(".mainNavigation.minimal > .container > .row > div:nth-child(2)");
            logoContainer2.removeClass("col-sm-10");
            logoContainer2.addClass("col-sm-9");
        }
    //}
});
/*END*/
/*Added by FW TEAM - for Utility Nav Search Functionality - 05-May-2015*/
/*START*/

function navSearch(inputElement)
{
	var search_query='';
	if(inputElement !== undefined && inputElement.length)
	{
		search_query=inputElement.val();
	}
 	window.location.href = "/search-results/?q="+search_query.trim();
}

$(document ).ready(function(){

/*$('#nav_search_form').submit(function(event){
	var inputElement = $('#nav_search_input');
	navSearch(inputElement);
	event.preventDefault();
});*/

/*
$('#nav_search_form_res').submit(function(event){
	var inputElement = $('#nav_search_input_res');
	navSearch(inputElement);
	event.preventDefault();
});
*/

});

//function onkeydown from search input header
function searchEnter(element, event)
{	
	if(event!== undefined && element!== undefined)
	{
		var code = (event.keyCode ? event.keyCode : event.which);
		if (code == 13) {
			var inputElement = $(element);
			navSearch(inputElement);
			event.preventDefault();
		}
	}
	
}
/*END*/

/*FOR PERSISTENT FOOTER - BEGIN*/
$(document).ready(function() {
    $(".homePage-utilityFooter .footerFlag").on("mouseenter", function() {
        $(this).animate(
            {
                top: "-15px"
            },
            
            {
                duration: 100,
                complete: function() {
                    var currentContent = $(this).children(".content");
                    
                    if (currentContent) {
                        if (currentContent.attr("data-leave") !== "true") {
                            var flagWidth = $(this).outerWidth();
                            var contentWidth = currentContent.outerWidth();
                            
                            var offset = (flagWidth / 2.0) - (contentWidth / 2.0);
                            
                            currentContent.css("left", offset);
                            currentContent.css("display", "block");  
                        }
                    } 
                }
            }
        );
    });
    
    $(".homePage-utilityFooter .footerFlag").on("mouseleave", function() {
        var currentContent = $(this).children(".content");
        if (currentContent) {
            currentContent.css("display", "none");
            currentContent.attr("data-leave", "true");
        }
        
        $(this).animate(
            {
                top: "0px"
            },
            
            {
                duration: 100,
                complete: function() {
                    var currentContent = $(this).children(".content");
                    if (currentContent) {
                        currentContent.attr("data-leave", "false");
                    }
                }
            }
        );
    });
    
    $(".homePage-utilityFooter .footerFlag > a").on("click", function(event) {
        var currentLink = $(this);
        
        if (currentLink.attr("href") === "#") {
            // Non-IE
            if (event.preventDefault) {
                event.preventDefault();
            }
            
            // IE
            else {
                event.returnValue = false;
            }
        }
    });
});
/*FOR PERSISTENT FOOTER - END*/

$(window).load(function() {
    /*FOR PERSISTENT FOOTER - BEGIN*/
    $(".homePage-utilityFooter .footerFlag > a").each(function(index) {
        
        // Helper variables
        var navAccordion = $(".mainNavigation #navAccordion");
        var firstMCF = navAccordion.children(".multi_conv_flag").first();
        var dataUrl = $(this).attr("data-url");
        
        // Setup menu <li>
        var menuLI = $(document.createElement("li"));
        
        if (firstMCF.length === 0) {
            menuLI.appendTo(navAccordion);
        }
        else {
            firstMCF.before(menuLI);
        }
 
        menuLI.addClass("panel");
        menuLI.addClass("footerFlag");
        
            // Setup <a>
            var menuLink = $(document.createElement("a"));
            menuLink.appendTo(menuLI);
            menuLink.attr("href", "#");
            menuLink.attr("onclick", "");
            menuLink.attr("data-parent", "#navAccordion");
            menuLink.attr("data-target", "#footerFlag" + index);
            menuLink.attr("data-toggle", "collapse");
            menuLink.html($(this).html());
            
            // Icon
            //var menuIcon = $(document.createElement("span"));
            //menuIcon.prependTo(menuLink);
            //menuIcon.addClass(linkIcon);
            
            if(dataUrl !== undefined && dataUrl)
            {
                dataUrl = dataUrl.trim();
                menuLink.attr("href", dataUrl);
                if(dataUrl.indexOf("/") !== 0)
                {
                    menuLink.attr("target", "_blank");
                }
            } else {
            
            // Setup <div> content
            if ($(this).siblings(".content").length === 1) {
                var menuDiv = $(document.createElement("div"));
                menuDiv.appendTo(menuLI);
                menuDiv.attr("id", "footerFlag" + index);
                menuDiv.addClass("footerFlag");
                menuDiv.addClass("panel-collapse");
                menuDiv.addClass("collapse");
                menuDiv.html($(this).siblings(".content").html());
            }
            
            // Page redirect
            else if ($(this).attr("href") !== "#") {
                menuLink.attr("href", $(this).attr("href"));
                menuLink.attr("target", "_blank");
            }
            
            // Modal
            else if ($(this).attr("data-toggle") === "modal") {
                menuLink.removeAttr("onclick");
                menuLink.removeAttr("data-parent");
                menuLink.attr("data-target", $(this).attr("data-target"));
                menuLink.attr("data-toggle", $(this).attr("data-toggle"));
            }
            
            }
            
            // Block default if no redirect
            menuLink.on("click", function(event2) {
                if (menuLink.attr("href") === "#") {
                    
                    // Non-IE
                    if (event2.preventDefault) {
                        event2.preventDefault();
                    }
                    
                    // IE
                    else {
                        event2.returnValue = false;
                    }
                }
            });
    });
    /*FOR PERSISTENT FOOTER - END*/

/* -- Commented out By FW TEAm - Provided in JIRA 681 to Fix icomoon
 // Grab all icons, not (File-Empty and Newspaper)
    var eqIconSelector = 'span[class*="EQ-"]:not(.EQ-File-Empty):not(.EQ-Newspaper)';

    // Set dimensions equal to font-size
    $(eqIconSelector).each(function() {
        var currentIcon = $(this);
        var fontSize = currentIcon.css("font-size");
        currentIcon.css("width", fontSize);
        currentIcon.css("height", fontSize);
    });
*/
});

$(window).resize(function() {

    /* -- Commented out By FW TEAm - Provided in JIRA 681 to Fix icomoon
    // Grab all icons, not (File-Empty and Newspaper)
    var eqIconSelector = 'span[class*="EQ-"]:not(.EQ-File-Empty):not(.EQ-Newspaper)';

    // Set dimensions equal to font-size
    $(eqIconSelector).each(function() {
        var currentIcon = $(this);
        var fontSize = currentIcon.css("font-size");
        currentIcon.css("width", fontSize);
        currentIcon.css("height", fontSize);
    }); 
    */
    
	var querySelector = "#nav .panel:not(.multi_conv_flag) > a";
	var windowWidth = $(window).width();

        // Window is mobile size
        if (windowWidth <= 767) {
            $(querySelector).attr("data-toggle", "collapse");
            $(querySelector).attr("onclick", "");
           
            // Homepage-specific
           // if (_NewNavigation_isHomePage === true) {
           //     $("body > .container").css("margin-top", "0");
           //     setFixedHeader(false);
            $("#header").removeClass("minimal");
                $(".mainNavigation").removeClass("minimal");
                
                var logoContainer = $(".mainNavigation > .container > .row > div:nth-child(1)");
                logoContainer.removeClass("col-sm-1");
                logoContainer.addClass("col-sm-2");
                
                var logoContainer2 = $(".mainNavigation > .container > .row > div:nth-child(2)");
                logoContainer2.removeClass("col-sm-9");
                logoContainer2.addClass("col-sm-10");
		   //}
            closeMenu(0);
        } 
        
        // Non-mobile
        else {
            $(querySelector).attr("data-toggle", "");               // Disable collapse
            $(querySelector).attr("onclick", "openMenu(this);");    // Enable full menu
            
            // Homepage-specific
         //   if (_NewNavigation_isHomePage === true) {
            //    if (_NewNavigation_showMenu === false) {
            //        $("body > .container").css("margin-top", NEWNAVIGATION_HEADER_NAV_HEIGHT + "px");
             //   }
             //   else {
             //       $("body > .container").css("margin-top", "0");
             //  }
                
             //   setFixedHeader(true);
			  var offset = $(window).scrollTop();
                if (offset > 100) {
                    $("#header").addClass("minimal");
                    $(".mainNavigation").addClass("minimal");
                    
                    var logoContainer = $(".mainNavigation.minimal > .container > .row > div:nth-child(1)");
                    logoContainer.removeClass("col-sm-2");
                    logoContainer.addClass("col-sm-1");
                    
                    var logoContainer2 = $(".mainNavigation.minimal > .container > .row > div:nth-child(2)");
                    logoContainer2.removeClass("col-sm-10");
                    logoContainer2.addClass("col-sm-9");
                }
          //  }

            // Close mobile menu
            $(querySelector).removeClass("collapsed");
          //  jQuery(function($){
            $(".in").collapse("toggle");
           // }(document.id));
        }
	
});


$(document).click(function(event) { 
    if(!$(event.target).closest('.menuContainer').length) {
		if(!$(event.target).closest('#nav').length) {
        if($('.menuContainer').is(":visible")) {
			
           closeMenu();
        }
		}
    }        
});