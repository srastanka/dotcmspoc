// Required components
var comps = [

    // UPA
    {
    	name: "upa_comp",
    	params: null
    },
    
    // UPDT_UTM
    {
    	name: "updt_utm_comp",
    	params: null
    },
    
    // PR_DCM
    {
    	name: "pr_dcm_comp",
    	params: null
    },
    
    // DYNAMIC_MAP
    {
    	name: "dynamic_map_comp",
    	params: null
    },
    
    // MMP
    {
    	name: "mmp_comp",
    	params: null
    },
    
    // HOMEPAGE_SLIDERNAV
    {
    	name: "homepage_slidernav_comp",
    	params: null
    },
    // HOME_IND_BOXES_COMP
    {
    	name: "home_ind_boxes_comp",
    	params: null
    },
    // HOME_CUST_BOXES_COMP
    {
    	name: "home_cust_boxes_comp",
    	params: null
    },
    // HOME_CUST_UPA_COMP
    {
    	name: "home_cust_upa_comp",
    	params: null
    },
    
    // contactus_comp
    {
    	name: "contactus_comp",
    	params: null
    }
];


//Global function to AJAX in components
//loadComponents(comps); //-- COMMENTED OUT BY FATWIRE TEAM - NOT NEEDED

/****************
 * GLOBAL SCRIPTS --------------------------------------------------------------
 ****************/

/**
 * Create UPA1 slides
 * 
 * Total slides: 3
 * 
 * - Slide 1 
 *      - Background image 
 *          940x340
 *      
 *      - Left
 *          Image (max: 400x260)
 *      
 *      - Right
 *          Banner
 *          Caption
 *          Button
 * 
 * - Slide 2
 *      - Background image
 *          940x340
 *  
 *      - Left
 *          Banner
 *          Caption
 *          Button
 *  
 *      - Right
 *          Video
 *
 * - Slide 3
 *      - Background image
 *          940x340
 *      
 *      - Left
 *          Banner
 *          Caption
 *          Button
 * 
 *      - Right
 *          Paragraph
 */
 /* -- COMMENTED OUT BY FATWIRE TEAM - NOT NEEDED
$(document).ready(function() {
    
    // Column Two, Image
    var colTwoImg = $(document.createElement("img"));
    colTwoImg.attr("class", "img-responsive");
    colTwoImg.attr("src", "http://placehold.it/400x200/6DB077/6DB0B0");
    
    // Column Two, Video
    var colTwoVideo = $(document.createElement("div"));
    colTwoVideo.addClass("videoWrapper");
    var video = $(document.createElement("iframe"));
    video.appendTo(colTwoVideo);
    video.attr("width",             "400");
    video.attr("height",            "300");
    video.attr("src",               "//www.youtube.com/embed/T5xMMQ8ZjTc");
    video.attr("frameborder",       "0");
    video.attr("allowfullscreen",   "true");

    var mask = $(document.createElement("div"));
    mask.addClass("videoMask");
    mask.appendTo(colTwoVideo);
        
    // Column Two, Paragraph
    var paragraph = "PARAGRAPH - Lorem ipsum dolor sit amet, consectetur " +
    "adipisicing elit, sed do eiusmod tempor incididunt ut labore et " +
    "dolore magna aliqua. Ut enim ad minim veniam, quis nostrud " +
    "exercitation ullamco laboris nisi ut aliquip ex ea commodo " +
    "consequat.";
    var colTwoParagraph = $(document.createElement("p"));
    colTwoParagraph.append(paragraph);
    
    // Slides ------------------------------------------------------------------
    var slides = [
        
        // Slide 1
        {
            bkgdImg:        "http://placehold.it/940x340/B06D6D/6DB0B0",
            col1Class:      "pull-right",
            bannerText:     "BANNER",
            captionText:    "CAPTION - Lorem ipsum dolor sit amet, consectetur " +
                            "adipisicing elit, sed do eiusmod tempor incididunt " +
                            "ut labore et dolore.",
            buttonText:     "Button1",
            colTwoContent:  colTwoImg,
        },
        
        // Slide 2
        {
            bkgdImg:        "http://placehold.it/940x340/6DB077/6DB0B0",
            col1Class:      null,
            bannerText:     "BANNER",
            captionText:    "CAPTION - Lorem ipsum dolor sit amet, consectetur " +
                            "adipisicing elit, sed do eiusmod tempor incididunt " +
                            "ut labore et dolore.",
            buttonText:     "Button2",
            colTwoContent:  colTwoVideo,
        },
        
        // Slide 3
        {
            bkgdImg:        "http://placehold.it/940x340/7A6DB0/6DB0B0",
            col1Class:      null,
            bannerText:     "BANNER",
            captionText:    "CAPTION - Lorem ipsum dolor sit amet, consectetur " +
                            "adipisicing elit, sed do eiusmod tempor incididunt " +
                            "ut labore et dolore.",
            buttonText:     "Button3",
            colTwoContent:  colTwoParagraph
        }
    ];
    */
	
    /* Setup UPA carousel ----------------------------------------------------*/
    /* -- COMMENTED OUT BY FATWIRE TEAM - NOT NEEDED
    // 1.  Set up indicators (bubbles)
    var indicatorList = $("#carousel .carousel-indicators");
    for (var bubbleIndex = 0; bubbleIndex < slides.length; bubbleIndex++) {
        var li = $(document.createElement("li"));
        li.appendTo(indicatorList);
        li.attr("data-target", "#carousel");
        li.attr("data-slide-to", bubbleIndex);
        
        if (bubbleIndex === 0) {
            li.addClass("active");
        }
    }
    
    // 2.  Create and add slides
    var innerCarousel = $("#carousel .carousel-inner");
    for (var slideIndex = 0; slideIndex < slides.length; slideIndex++) {
        var newSlide = createSlide(slides[slideIndex]);
        innerCarousel.append(newSlide);
        
        if (slideIndex === 0) {
            newSlide.addClass("active");
        }
    }
});
*/
/***********
 * FUNCTIONS -------------------------------------------------------------------
 ***********/

/**
 * Creates and returns a slide from the given JSON object.
 * 
 * @param slideObject - a JSON object that contains:
 *      - bkgdSrc       URL for image
 *      - colOneClass   Extra CSS classes
 *      - bannerText    String for banner text
 *      - captionText   null or caption text
 *      - buttonText    null or button text
 *      - colTwoContent An HTML element for column two
 */
 /* -- COMMENTED OUT BY FATWIRE TEAM - NOT NEEDED
function createSlide(slideObject) {
    
    // Slide
    var slide = $(document.createElement("div"));
    slide.addClass("item");
        
        // Background image
        var bkgdImg = $(document.createElement("img"));
        bkgdImg.appendTo(slide);
        bkgdImg.attr("alt", "slide");
        bkgdImg.attr("src", slideObject.bkgdImg);
        
        // Caption
        var carouselCaption = $(document.createElement("div"));
        carouselCaption.appendTo(slide);
        carouselCaption.addClass("carousel-caption");
        
            var row = $(document.createElement("div"));
            row.appendTo(carouselCaption);
            row.addClass("row");
            
                var column1 = $(document.createElement("div"));
                column1.appendTo(row);
                column1.addClass("col-sm-6");
                if (slideObject.colOneClass !== null) {
                    column1.addClass(slideObject.colOneClass);
                }
                
                    var banner = $(document.createElement("p"))
                    banner.addClass("banner");
                    banner.appendTo(column1);
                    banner.append(slideObject.bannerText);
                    
                    if (slideObject.captionText !== null) {
                        var caption = $(document.createElement("p"));
                        caption.appendTo(column1);
                        caption.append(slideObject.captionText);
                    }
                    
                    if (slideObject.buttonText !== null) {
                        var button = $(document.createElement("button"));
                        button.addClass("pull-left btn btn-default");
                        button.appendTo(column1);
                        button.append(slideObject.buttonText);
                    }
                
                    if (slideObject.colTwoContent !== null) {
                        var colTwo = $(document.createElement("div"));
                        colTwo.addClass("col-sm-6 hidden-xs");
                        colTwo.appendTo(row);
                        colTwo.append(slideObject.colTwoContent);
                    }   
    
    // Return slide
    return slide;
}
*/

$('.carousel').on('slid', function(e) {
    if($('html').is('.lt-ie9')) {
        var carousel = $(this);
        var items = $('.carousel-inner .item', carousel);
        var indicators = $('.carousel-indicators', carousel).children();
        if (items.length !== indicators.length) {
            setTimeout(function() {
                var active_index = items.filter('.active').index();
                indicators.removeClass('active');
                $(indicators.filter('li').get(active_index)).addClass('active');
            }, 0);
        }
        return false;
    }
});

/**
 * Back-to-top button
 */
$(document).ready(function() {
    
    // Initial backToTop
    backToTop();
    
    // On scroll
    $(window).scroll(function() {
        backToTop();
    });
    
    // Scroll window to top on click
    $(".back-to-top").on("click", function(event) {
        event.preventDefault();
        
        // 500ms animation
        $("html, body").animate({
            scrollTop: 0
        }, 500);
        
        return false;
    });
});

function backToTop() {
    var offset = $(window).scrollTop();

    // Show backToTop
    if (offset >= 276) {
        $(".back-to-top").css("display", "block");
    }

    // Hide backToTop
    else {
        $(".back-to-top").css("display", "none");
    }
}

/**
 * UPA contaer fixes
 */
$(document).ready(function() {
    
    // Outer container fixes
//    var section = $(document.createElement("section"));
//    var container = $(document.createElement("div"));
//    var row = $(document.createElement("div"));
//    var div = $(document.createElement("div"));
//    
//    var pageContainer = $("body > .container");
//    
//    section.prependTo(pageContainer);
//    
//    container.addClass("container");
//    container.appendTo(section);
//    
//    row.addClass("row");
//    row.appendTo(container);
//    
//    div.addClass("col-sm-12");
//    div.appendTo(row);
//    
    var upa = $("body > .container > #upa_comp");
//    upa.appendTo(div);
    
    // Inner container fix
    upa.find(".item > .carousel-caption > .row").each(function() {
        $(this).wrap('<div class="container">');
    });
});

/**
 * TAB_MUTM container fix
 */
$(document).ready(function() {
    var tab_mutm = $("body > .container > .tab_mutm-wrapper");
    tab_mutm.addClass('container widescreen');

 var ccm_mutm = $('div.eq-slide-title').next();
    ccm_mutm.wrap('<div class="container widescreen">');

});