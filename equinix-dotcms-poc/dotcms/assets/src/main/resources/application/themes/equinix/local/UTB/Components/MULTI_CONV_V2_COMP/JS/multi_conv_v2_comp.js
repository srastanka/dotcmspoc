/******************
 * GLOBAL VARIABLES ------------------------------------------------------------
 ******************/

var ANIMATION_SPEED =   100;
var PADDING_OFFSET =    10;
var CURRENT_FLAG =      false;

/***********
 * FUNCTIONS -------------------------------------------------------------------
 ***********/

/**
 * Loads in any components that MULTI_CONV needs
 */
function loadMultiConvComps() {
    
    // Required components
    var comps = [

        // LIGHTBOX
        {
            name: "lightbox_comp",
            params: null
        },
        
        // Facebook
        {
            name: "twit_dcm_comp",
            params: null
        }
    ];
    
    // Call global loadComp function
    loadComponents(comps); 
}

/**
 * Display flag content
 */
function showFlagContent() {
    
    // Get content
    var content = CURRENT_FLAG.children(".content");
    
    // If flag has content
    if (content) {
        
        // Get dimensions
        var flagHeight = CURRENT_FLAG.outerHeight();
        var width = content.outerWidth();
        var height = content.outerHeight();
        
		//***ADDED BY FWTEAM - BEGIN ***
		var anchorTag;
		var anchorTagWidth;
		anchorTag = CURRENT_FLAG.children("a");
		if(anchorTag !== undefined && anchorTag.length)
		{
			anchorTagWidth = anchorTag.outerWidth();
		}
		if(anchorTagWidth !== undefined)
		{
			width = width + anchorTagWidth;
		}
		//***END - ADDED BY FWTEAM ***
		
        // Calculate center
        var alignWidth = -width;
        var alignHeight = -(height / 2.0) + (flagHeight / 2.0);
        
        // Set CSS
       content.css("display",  "block");
        content.css("top",          alignHeight + "px");
        content.css("right",        alignWidth + "px");
    }
	
}

/**
 * Take care of flag popout
 */
function setupFlags() {
    
	//*** FOR HOVER ACTION - BEGIN***
	
    $(".multi_conv_wrapper .flag.hover").on("mouseenter", function() {
        
        // Flag already open
        if (CURRENT_FLAG !== false) {
            
            // Store flag
            CURRENT_FLAG = $(this);
            CURRENT_FLAG.children("a").addClass("active");
            
            // Turn off current flag
			/* - COMMENTED OUT BY FW TEAM
            CURRENT_FLAG.siblings().children("a").removeClass("active");
            CURRENT_FLAG.siblings().children(".content").css("visibility", "hidden");
			*/
			
			//*** ADDED BY FWTEAM - BEGIN ***
			CURRENT_FLAG.siblings(".hover").children("a").removeClass("active");
           CURRENT_FLAG.siblings(".hover").children(".content").css("display", "none");
            //*** ADDED BY FWTEAM - END ***
			
            // Show content
            showFlagContent();
			
        }
        
        // No flag open
        else {
			
            // Store flag
            CURRENT_FLAG = $(this);
            CURRENT_FLAG.children("a").addClass("active");
            
            // Extend out flags
            CURRENT_FLAG.parent().children(".flag").animate(
               
                // CSS values
                {
                    //paddingLeft: PADDING_OFFSET + "px" //COMMENTED OUT BY FWTEAM***
                },
                
                // Render options
                {
                    duration:   ANIMATION_SPEED,
                    complete:   showFlagContent
                }
            );
			
        }
    });
    
    $(".multi_conv_wrapper").on("mouseleave", function() {
		
        var wrapper = $(this);
        
        CURRENT_FLAG = false;
        wrapper.find(".flag.hover > a").removeClass("active");
        wrapper.find(".flag.hover > .content").css("display", "none");
        
        wrapper.children(".flag.hover").animate(
           
            // CSS values
            {
                //paddingLeft: "0px" //COMMENTED OUT BY FWTEAM***
            },
            
            // Render options
            {
                duration: ANIMATION_SPEED
            }
        );
		
    });
	
	/*ADDED BY FWTEAM - BEGIN*/
	$(".multi_conv_wrapper .flag.hover").on("mouseleave", function() {
		
        var wrapper = $(this);
        
        CURRENT_FLAG = false;
        wrapper.children("a").removeClass("active");
        wrapper.children(".content").css("display", "none");
        
        wrapper.animate(
           
            // CSS values
            {
                //paddingLeft: "0px" //COMMENTED OUT BY FWTEAM***
            },
            
            // Render options
            {
                duration: ANIMATION_SPEED
            }
        );
		
    });
	/*ADDED BY FWTEAM - END*/
	
	//*** END - FOR HOVER ACTION ***
	
	//*** FOR SLIDE ACTION - BEGIN***
	
	// For each link
    $(".multi_conv_wrapper .flag.slide > a").each(function() {
        
        // When clicked
        $(this).on("click", function(event) {
            
            // Block default if no redirect
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
            
            // Variables going to use
            var link = $(this);                         // Current link
            var content = link.siblings(".content");    // Current content
            var flag = link.parent();                   // Current flag
            var speed = 500;                            // Animation speed
            
            // If no content
            if (content.length === 0) {
                return;
            }
            
            // If flag open
            if (link.hasClass("active")) {
                
                // Reset link color
                link.toggleClass("active");
                
                // Slide flag offscreen
                flag.animate(
                    {
                        left: "-" + content.width() + "px" 
                    },
                    
                    {
                        duration: speed,
                        complete: function() {
                            $(this).css("left", "-30px");       // Reset flag
                            content.toggleClass("active");      // Reset content
                            flag.toggleClass("active");         // Set flag
                        }
                    }
                );
				
            }
            
            // No flag open
            else {
				
                content.toggleClass("active");                  // Set content
                link.toggleClass("active");                     // Set link
                flag.toggleClass("active");                     // Set flag
                flag.css("left", "-" + content.width() + "px"); // Set flag
				
                // Slide flag out
                flag.animate(
                    {
                        left: "0px" 
                    },
                    
                    {
                        duration: speed
                    }
                );
				
            }
        });
    });
	
	//*** END - FOR SLIDE ACTION ***
	
}

/**
 * Take care of moving flags into main nav on mobile
 */
function doMobileFlags() {
    $(".multi_conv_wrapper .flag > a").each(function(index) {

        // Helper variables
        var navAccordion = $(".mainNavigation #navAccordion");
        var linkTitle = $(this).children("span").attr("title");
        var linkIcon = $(this).children("span").attr("class");
        var dataUrl = $(this).attr("data-url");
        
        // Setup menu <li>
        var menuLI = $(document.createElement("li"));
        menuLI.appendTo(navAccordion);
        menuLI.addClass("panel");
        menuLI.addClass("multi_conv_flag");
        
            // Setup <a>
            var menuLink = $(document.createElement("a"));
            menuLink.appendTo(menuLI);
            menuLink.attr("href", "#");
            menuLink.attr("onclick", "");
            menuLink.attr("data-parent", "#navAccordion");
            menuLink.attr("data-target", "#multi_conv_flag" + index);
            menuLink.attr("data-toggle", "collapse");
            menuLink.html(linkTitle);
            
            // Icon
            var menuIcon = $(document.createElement("span"));
            menuIcon.prependTo(menuLink);
            menuIcon.addClass(linkIcon);
           
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
                menuDiv.attr("id", "multi_conv_flag" + index);
                menuDiv.addClass("multi_conv_flag");
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
}

/****************
 * GLOBAL SCRIPTS --------------------------------------------------------------
 ****************/
$(document).ready(function() {
    //loadMultiConvComps();
    setupFlags();
    doMobileFlags();
});

/******** CUSTOM SCRIPT ADDED BY FW TEAM 02-02-2015 - FOR LIVECHAT SHOW/NOT_SHOW *********/
/********  START *************/

function show_LiveChat(liveChatFlag_Identifier)
{
	//var liveChatFlag = $('.flag.live_chat');
	var liveChatFlag = $(liveChatFlag_Identifier);
	if(liveChatFlag)
	{
		liveChatFlag.each(function(index){
			var liveChatDiv = liveChatFlag.eq(index).find($('*[id^="inqC2C"]'));
			if(liveChatDiv)
			{
				if(liveChatDiv.html().trim().length > 0 && liveChatDiv.html().trim()!=='<div> </div>' )
				{
					liveChatFlag.eq(index).show();	
				}	
			}
		});
	}
}

function show_no_show_LiveChat()
{
	show_LiveChat('.flag.live_chat');
	show_LiveChat('.footerFlag.live_chat');
	clearTimeOut();	
}

 var timeOutId;

 function clearTimeOut() {
  window.clearTimeout(timeOutId);
}

$(window).load(function(){
	
	timeOutId = window.setTimeout(show_no_show_LiveChat, 2000);
});

/********** END **********/


/*Added by FW TEAM - To make the MODAL overlay render in center position - when MCF Flag contains MODAL Marketo Form.
  And also to fix width issue with MODAL Window having Marketo Form in MCF Flag
*/
/*START*/
function setModalWidthForMarketoForm(lightbox_comp_identifier)
{
	//var lightbox_comp = $('.flag #lightbox_comp');
	var lightbox_comp = $(lightbox_comp_identifier);
	if(lightbox_comp !== undefined)
	{
		lightbox_comp.each(function(index) {
			var comp = lightbox_comp.eq(index);
			var modal_dialog = comp.find('div.modal-dialog');
			var modal_content;
			var modal_body;
			var form_elem;
			if(modal_dialog !== undefined)
			{
				modal_content = modal_dialog.find('div.modal-content');
			}	
			if(modal_content !== undefined)
			{
				modal_body = modal_content.find('div.modal-body');
			}
			if(modal_body !== undefined)
			{
				form_elem = modal_body.find('form');
			}
				
			if(form_elem !== undefined)
			{
				var form_width = form_elem.width();
				if(Math.floor(form_width) == form_width && $.isNumeric(form_width))
				{
					if(form_width > 0)
					{
						var modal_dialog_width = form_width + 40;
						modal_dialog.width(modal_dialog_width);
					}
				} 
				
			}

		});
	}
}

function appendModalDivToBody(modalDivIdentifier)
{
	var modalDivElement = $(modalDivIdentifier);
       var MKTOForm=$(".mktoForm");
	
	
	//alert("modalDivElement ......."+modalDivElement);

	if(modalDivElement !== undefined && modalDivElement.length)
	{
		       modalDivElement.each(function(index) {
                     var formElement = modalDivElement.eq(index).find(MKTOForm);
                     if(formElement !== undefined && formElement.length)
                     {
                        var scriptElement = formElement.siblings("script")
                        if(scriptElement !== undefined && scriptElement.length)
                        {
                            scriptElement.remove();
                        }
                     }
			         modalDivElement.eq(index).appendTo("body");
		});
      
		
	}
	
}

$(window).load(function() {
	appendModalDivToBody('#lightbox_comp.persistentFooter');
	setModalWidthForMarketoForm('.flag #lightbox_comp');
	setModalWidthForMarketoForm('#lightbox_comp.persistentFooter');
});
/*END*/



/**
 * SLIDE UP FOOTER BAR ON SCROLL
 */
$(function(){
	$(window).scroll(function(e){
		if ($(this).scrollTop() > 5){
			if (! $('.homePage-utilityFooter').hasClass('on')){
				$('.homePage-utilityFooter').addClass('on');
                        }
		} else {
			$('.homePage-utilityFooter').removeClass('on');
		}
	});
});
