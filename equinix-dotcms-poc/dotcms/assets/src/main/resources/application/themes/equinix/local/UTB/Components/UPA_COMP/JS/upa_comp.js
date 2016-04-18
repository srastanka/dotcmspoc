(function($, undefined) { //ADDED BY FWTEAM 29-04-2015

	
/******************
 * GLOBAL VARIABLES ------------------------------------------------------------
 ******************/
var videoPlaying = false;

/***********
 * FUNCTIONS -------------------------------------------------------------------
 ***********/

/**
 * Hides carousel indicators when there's only one slide
 */
var hide = function() {
    var count = $("#carousel .carousel-inner .item").length;
    if (count == 1) {
        $("#carousel ol.carousel-indicators").remove();
        $("#carousel div.col-xs-12.col-sm-12").remove();
        //$("#carousel .carousel-inner .item .carousel-caption").css("top", "30%");
    }
};
/**
 * Makes carousel indicators work in IE8
 */
var slide = function(){
	$(".carousel").on("slid", function(e) {
    if($("html").is(".lt-ie9")) {
        var carousel = $(this);
        var items = $(".carousel-inner .item", carousel);
        var indicators = $(".carousel-indicators", carousel).children();
        if (items.length !== indicators.length) {
            setTimeout(function() {
                var active_index = items.filter(".active").index();
                indicators.removeClass("active'");
                $(indicators.filter("li").get(active_index)).addClass("active");
            }, 0);
        }
        //return false;
    }
});

};

/****************
 * GLOBAL SCRIPTS --------------------------------------------------------------
 ****************/

/**
 * Document ready
 */

//(function($, undefined) { //ADDED BY FWTEAM 29-04-2015

$(window).load(function(){

    // Hide carousel indicators
	hide();
	// Display carousel indicators in IE8
	slide();
    
	// IE8 border-radius
	if (window.PIE) {
        $("#carousel.carousel.slide .carousel-indicators li").each(function() {
            PIE.attach(this);
            $(this).css("border-radius", "6px");
        });
    }
	
	// Make text center vertical on 1 img
	// if ($("#carousel .item").length === 1) {
	// 	$("#carousel .item .row").css("height", "100%");
	// 	$("#carousel .item .row .col-sm-6").css("height", "100%");
	// 	$("#carousel .item .row .col-sm-6").addClass("verticalCenter");
	// 	$("#carousel .item .row .col-sm-6 p").css("display", "inline-block");
	// 	$("#carousel .item .row .col-sm-6 p").css("vertical-align", "middle");
	// }
	
	/**
	 * Pause carousel on video play
	 */
	$(".videoMask").click(function() {
	    
	    //alert("inside .videoMask click()");
	    // Set video to autoplay
	    var iframe = $(this).siblings("iframe");
	    var src = iframe.attr("src");
	    
	    if (src.indexOf("?") > -1) {
	        var newUrl = src + "&autoplay=1";
	        //alert(newUrl);
	        iframe.attr("src", newUrl);
	    }
	    
	    else {
	        var newUrl = src + "?autoplay=1";
	        //alert(newUrl);
	        iframe.attr("src", newUrl);
	    }
	    
	    // Hide mask
	    //$(this).toggle();
	    $(this).css("display", "none");
	    
	    // Pause carousel
	    $("#carousel").carousel("pause");
	    
	    // Set flag
	    videoPlaying = true;
	});
	
	/**
	 * Start up carousel again on control push
	 */
	$("#carousel").on("slide.bs.carousel", function() {

	    if (videoPlaying === true) {
    	    // Show mask
    	    //$('.videoMask').show();
	        $(".videoMask").css("display", "block");
    	    
    	    // Reset src of all videos
    	    $("#carousel").find("iframe").each(function(key, value) {
    	        var url = $(this).attr("src");
                
    	        if (url.indexOf("?autoplay=1") > -1) {
	                var tokens = url.split("?autoplay=1");
	                $(this).attr("src", tokens[0]);
    	        }
    	        
    	        else {
    	            var tokens = url.split("&autoplay=1");
    	            $(this).attr("src", tokens[0]);
    	        }
    	        
    	        //if(url.indexOf("autoplay") > 0) {
                //    var new_url = url.substring(0, url.indexOf("?"));
                //    $(this).attr('src', new_url);
                //}
    	        //alert(tokens[0]);
    	        
            });
    	    
    	    // Restart carousel
    	    $(this).carousel("cycle");
    	    
    	    // Reset flag
    	    videoPlaying = false;
	    }
	});
});

//}) (jQuery); //ADDED BY FWTEAM - 29-04-2015

/*ADDED BY FW TEAM - TO FIX ISSUE WITH VIDEO IN MODAL - 29-04-2015*/
/*START*/

function resetVideo(modalDivElement)
{
	//console.log("inside resetVideo()");
	//console.log("videoPlaying = "+videoPlaying);
	if (videoPlaying === true) {
	   //console.log("inside videoPlaying == true");
		// Show mask
		//$('.videoMask').show();
		$(".videoMask").css("display", "block");
		
		// Reset src of all videos
		if(modalDivElement !== undefined && modalDivElement.length )
		{
		var parentElement = modalDivElement.parents("#carousel");
		
		if(parentElement !== undefined && parentElement.length )
		{
		
		parentElement.find("iframe").each(function(key, value) {
		      //console.log("inside #carousel.find(iframe)");
		      //console.log("#carousel each key== "+ key);
			var url = $(this).attr("src");
			//alert("url="+url);			

			if (url.indexOf("?autoplay=1") > -1) {
			     //console.log("inside ?autoplay=1");
				var tokens = url.split("?autoplay=1");
				//console.log("tokens[0]= "+tokens[0]);
				$(this).attr("src", tokens[0]);
			}
			
			else {
			     //console.log("inside &autoplay=1");			
				var tokens = url.split("&autoplay=1");
				//console.log("tokens[0]= "+tokens[0]);
				$(this).attr("src", tokens[0]);

			}
			
			//if(url.indexOf("autoplay") > 0) {
			//    var new_url = url.substring(0, url.indexOf("?"));
			//    $(this).attr('src', new_url);
			//}
			//alert(tokens[0]);
			
		});
		
        }//if
		
	   }//if
		
		// Reset flag
		videoPlaying = false;
	}

}

//(function($, undefined) {

$(document).ready(function() {

 	var modalDivs = $(' div#upa_comp div[id^="myModalForm_"]');
	if(modalDivs !== undefined)
	{
		modalDivs.each(function(index){
		
		      //console.log("modalDivs index=="+index);
			modalDivs.eq(index).on('shown.bs.modal', function (e) {
				//console.log("inside shown.bs.modal");
				resetVideo($(this));
				// Pause carousel
 			    $("#carousel").carousel("pause");	
			});

			modalDivs.eq(index).on('hidden.bs.modal', function (e) {
				//console.log("inside hidden.bs.modal");
				resetVideo($(this));
				// Restart carousel
				$("#carousel").carousel("cycle");
			});

		}) ;
	}

});

//}) (jQuery);

/*END*/


}) (jQuery); //ADDED BY FWTEAM - 29-04-2015