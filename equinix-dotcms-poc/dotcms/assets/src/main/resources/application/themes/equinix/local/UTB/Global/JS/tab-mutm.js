function createLine(lineDiv, x1,y1, x2,y2){
    
    // Calculate transforms
    var length = Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2));
    var angle  = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
    var transform = 'rotate('+angle+'deg)';

    // Set transforms
    lineDiv.css('transform', transform);
    lineDiv.width(length);
    lineDiv.css("left", x1 + "px");
    lineDiv.css("top", y1 + "px");
}

function calcLine(bubbleLine, currentButton) {
    
    // Get head center coords
    var currentHead = bubbleLine.siblings("a");
    var headOriginX = currentHead.position().left;
    var headOriginY = currentHead.position().top;
    var headWidth = parseInt(currentHead.width());
    var headHeight = parseInt(currentHead.height());
    var headCenterX = headOriginX + headWidth / 2.0;
    var headCenterY = headOriginY + headHeight / 4.0;
    
    // Get cooresponding bubble center coords
    var bubbleOriginX = currentButton.position().left;
    var bubbleOriginY = currentButton.position().top;
    var bubbleWidth = parseInt(currentButton.width());
    var bubbleHeight = parseInt(currentButton.height());
    var bubbleCenterX = bubbleOriginX + bubbleWidth / 2.0;
    var bubbleCenterY = bubbleOriginY + bubbleHeight / 2.0;
    
    // Do line
    createLine(bubbleLine, bubbleCenterX,bubbleCenterY, headCenterX,headCenterY);
}

/**
 * Windows resize
 */
$( document ).ready(function() {
       var isButtonClicked="false";
       var defaultQuestion="<p class='question'>Questions...</p>";
	var personaWrapper = $(".tab_mutm-wrapper.persona");
	var tabLinks = personaWrapper.find(" > ul > li");
	
	var tabLinkLength = tabLinks.length;

// Set image width to be smaller if there are 6 or less personas
	 if(tabLinks.length < 6 ) {
      var imageWidth = 100/6;
    }
    else {
      var imageWidth = 100 / tabLinks.length;
    }	
 

    tabLinks.each(function() {
		
        var currentLI = $(this);
        currentLI.css("width", imageWidth + "%");	   
         
 var sprite=currentLI.find("> a > i");
 sprite.css("height", currentLI.width());

		var buttons = currentLI.children("button");
		var emptyButton = $(document.createElement("button"));
        emptyButton.addClass("doNotUse");
       
		if (buttons.length === 1) {
                    emptyButton.insertBefore(buttons);
			//emptyButton.insertAfter(buttons);
        }
		if (buttons.length === 2) {
            emptyButton.insertAfter(buttons.eq(0));	
        }
		 
      
    });

 // Call func to center the personas
    change_left_persona_offset();


	    tabLinks.children("button").each(function(index) {
        var currentButton = $(this);
        var currentTab = currentButton.parent();
        
        // Don't use unused buttons
        if (currentButton.hasClass("doNotUse")) {
            return;
        }
        
        // Bubble numbering
        currentButton.on("click", function() {
            isButtonClicked="true";
            // Clear all other buttons, and set active
            tabLinks.find("button").removeClass("active");
            $(this).addClass("active");
            tabLinks.removeClass("active");
            currentTab.addClass("active");


            
            // Move question text
            var questionText = $(this).children(".question").clone();
            personaWrapper.children(".questionBox").html(questionText);
             personaWrapper.children(".questionBox").css("visibility", "visible"); 
            var sTabRow = currentButton.find(" > .row > .pull-left.col-xs-12").clone().html();
             var row="";
            if(sTabRow )
           {
            row="<div class='sub-tab-content'>"+sTabRow +"</div>";
           } 
          else
          {
           row="<div class='sub-tab-content'></div>";
          }
           
              
                  
                var tabID = currentButton.siblings("a").attr("href");
                var tab = personaWrapper.find(" > .tab-content " + tabID + " > .eq-tab > .row > .pull-left.col-xs-12");
                tab.children(".media-body").css("display", "none");
                tab.children(".sub-tab-content").remove();
                tab.append(row);
                 var tabContents=personaWrapper.find(" > .tab-content > .tab-pane ");
                  tabContents.removeClass("active"); 
                  var currentTabContent=personaWrapper.find(" > .tab-content "+ tabID);
                  currentTabContent.addClass("active"); 
              
              
                            
            // Set current persona as active
            $(this).siblings("a").addClass("active");  
        });
        
        
    });
    
    $(".tab_mutm-wrapper.persona > ul > li > .bubbleLine").each(function() {
        var currentIndex = $(this).index();
        var currentButton = $(this).siblings("button:not(.doNotUse)").eq(currentIndex);
        calcLine($(this), currentButton);
    });
 tabLinks.on("click", function(e) {
        var childLinkID = $(this).children("a").attr("href");
        var targetID = $(e.target).attr("href");
        if(isButtonClicked!=="true")
        {
       
         personaWrapper.children(".questionBox").css("visibility", "hidden");

        tabLinks.find("button").removeClass("active"); 
        var tab = personaWrapper.find(" > .tab-content " +childLinkID+ " > .eq-tab > .row > .pull-left.col-xs-12");
               tab.children(".sub-tab-content").remove();
                tab.children(".media-body").css("display", "block");
                
        //personaWrapper.children(".questionBox").html(defaultQuestion);
       }
        isButtonClicked="false";
      
 
        
        if (childLinkID !== targetID ) {
            
            $(this).children("a").trigger("click");
        }
    });

});

// Changes the leftmost persona's padding based on the screen size
function change_left_persona_offset() {
    var personaWrapper = $(".tab_mutm-wrapper.persona");
    var tabLinks = personaWrapper.find(" > ul > li");

    if(tabLinks.length < 6 ) {
        // Set a margin for the left item to make the personas look centered
        var ulWidth = $('ul.nav.nav-tabs').width();
        var liWidth = $('ul.nav.nav-tabs li:first').width();
        var totalLiWidth = liWidth * tabLinks.length;
        var leftImageOffset = (ulWidth - totalLiWidth) / 2;


        $('.tab_mutm-wrapper.persona > ul.nav.nav-tabs li:first').css('margin-left', leftImageOffset);
    }
}

$(window).resize(function() {
   $(".tab_mutm-wrapper.persona > ul > li").each(function() {
      var currentLI = $(this);

        currentLI.find(".persona-sprite").css("height", currentLI.width());

    });

    

    $(".tab_mutm-wrapper.persona > ul > li > .bubbleLine").each(function() {

        var currentIndex = $(this).index();

        var currentButton = $(this).siblings("button:not(.doNotUse)").eq(currentIndex);

        calcLine($(this), currentButton);

    });
 change_left_persona_offset();

 });

