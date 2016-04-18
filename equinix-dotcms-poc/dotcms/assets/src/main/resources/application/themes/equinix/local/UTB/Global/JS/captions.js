/**
 * This file has gone through multiple revisions as of right now it looks for 
 * these different caption classes:
 * 1) caption-[top/bottom/testimonial]-[black/white]
 * 2) caption
 * 3) callout-[top/bottom]-[white/black/red]-[left/center]-hex
 *
 * The final generated HTML will be similar to the code below, with the only
 * change being the classes on the inner div.caption:
 * 
 * <div class='captions-wrapper'>
 *      <div class='caption top black'>
 *          Caption Text
 *      </div>
 *      <img ...>
 * </div>
 */

/***********
 * FUNCTIONS -------------------------------------------------------------------
 ***********/

function buildCaption(userCaption) {
console.log("userCaption   "+userCaption.attr("class"));
    // Get image associated with caption
    var image = userCaption.next();

    // Tokenize caption class
    var tokens = userCaption.attr("class").split("-");

    // Default state is caption with no image
    var captionType;
    var textLocation;
    var textColor = "black";
    var textAlignment;
    var backgroundColor;

    // caption-[top/bottom/testimonial]-[black/white]
    if (tokens.length === 3) {
        captionType = tokens[1];
        textColor = tokens[2];
    }

    // callout-[top/bottom]-[white/black/red]-[left/center]-hex
    else if (tokens.length === 5) {
        captionType = tokens[0];
        textLocation = tokens[1];
        textColor = tokens[2];
        textAlignment = tokens[3];
        backgroundColor = "#" + tokens[4];
    }

    // Create outer wrapper
    var wrapper = $(document.createElement("div"));
    wrapper.addClass("captions-wrapper");

    // Create inner caption
    var inner = $(document.createElement("div"));
    inner.addClass("caption");
    inner.addClass(captionType);
    inner.addClass(textColor);
    inner.html(userCaption.html());
    inner.appendTo(wrapper);
    if (textAlignment) {
        inner.addClass(textAlignment);
    }

    // Add associated image
    if (image.is("img")) {
        console.log("image   "+backgroundColor);
        if (tokens.length < 5) {
            wrapper.append($(image));
        }

        else if (tokens.length === 5) {
            if (textLocation === "top") {
                image.appendTo(inner);
            }

            else {
                image.prependTo(inner);
            }
        }
    }

    // Replace user-defined caption with built caption
    userCaption.after(wrapper);
    userCaption.remove();

    // Testimonial caption styling
    if (captionType === "testimonial") {

        // Get associated image size
        var imgWidth = wrapper.children("img").width();

        // Set wrapper width
        wrapper.css("width", imgWidth + "px");
    }

    // callout-[top/bottom]-[white/black/red]-[left/center]-hex styling
    else if (tokens.length === 5) {
        console.log("tokens   "+tokens);
       console.log("backgroundColor2  "+backgroundColor);
        // Set background color
        inner.css("background-color", backgroundColor);
      //  wrapper.css("background-color", backgroundColor);
var itemClass = inner.closest('div[class^="item"]');
itemClass .css("background-color", backgroundColor);


        console.log("inner   "+inner);
console.log("inner   "+inner.attr("class"));
console.log("inner css  "+inner.css("background-color"));


        // Adjust image class
        image.removeClass("image-reponsive");
        image.addClass("img-responsive");
console.log("inner   "+inner.attr("class"));
console.log("inner css  "+inner.css("background-color"));

    }
}
/****************
 * GLOBAL SCRIPTS --------------------------------------------------------------
 ****************/

/**
 * Window Load
 */
//$(window).load(function() {
//
//    // Run caption logic on each found ".caption"
//    $("[class^=caption]").each(function() {
//        buildCaption($(this));
//    });
//
//    // Run caption logic on each found ".callout"
//    $("[class^=callout]").each(function() {
//        buildCaption($(this));
//    });
//});
