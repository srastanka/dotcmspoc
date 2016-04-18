/**
 * This function looks for sections that have the attribute 'data-ccls'.  It
 * will then adjust the bootstrap classes in its parents and adjust to columns.
 *
 * It will then look for its siblings and see if any of them do not have a
 * data-cols it will calculate the proper columns for it.  This function by
 * default assumes only 2 total columns so any cobinaation of 2 columns will
 * work:
 * 1 - 11
 * 2 - 10
 * 3 - 9
 * 4 - 8
 * 5 - 7
 * 6 - 6
 */
var columnsAdjust = {
    /**
     * Takes a single jquery Object (assumed to be a section[data-cols] and
     * adjust the number of bootstrap columns that its parents is taking up.
     */
    start : function(section) {
        var cols = section.attr("data-cols");
        /**
         * This handles a case where cols is not a number not to do anything
         */
        if (isNaN(cols) || cols === "") {
            return true;
        }
        var parentContainer = this.findParentColumns(section);
        if (!parentContainer) {
            return false;
        }
        parentContainer.attr("class", this.newClass(parentContainer, cols));

        /*************************
         * If MORE THAN 2 SIBLINGS (Non-normal BS MO) --------------------------
         *************************/

        var mediaObjectChildren = parentContainer.parent().children();
        if (mediaObjectChildren.length > 2) {
            var colCount = 0;
            mediaObjectChildren.each(function() {
                var datacols = $(this).children().attr("data-cols") * 1;
                if (colCount + datacols > 12) {
                    console.log("colCount = " + colCount);
                    console.log("datacols = " + datacols);
                    $(this).before("<div class='clearfix'></div>");
                    colCount = 0;
                }
                colCount += datacols;
            });
            return;
        }

        /*****************************
         * SIBLING CALCS IF 2 SIBLINGS (Normal BS MO) --------------------------
         *****************************/
        else {
            /*
             * first we take care of the easy case where the second section is
             * missing a data-col.
             */
            var siblingContainer = this.findSiblingColumns(parentContainer, false);
            if (siblingContainer) {
                siblingContainer.attr("class", this.newClass(siblingContainer, (12 - cols)));
            }

            /**
             * We need to look at the parent and sibling and determine if either of
             * them have a media-object div that does not have an img.  If it does
             * not have an img it removes that section and gives the other column a
             * col-sm-12 to take up the full space
             */
            var parentcontainerimg = this.findMissingImage(parentContainer);
            var siblingcontainerimg = this.findMissingImage(siblingContainer);

            if (parentcontainerimg || siblingcontainerimg) {
                var missingimg = parentcontainerimg || siblingcontainerimg;
                if (missingimg) {
                    if (missingimg.siblings()) {
                        var contentdiv = missingimg.siblings();
                        contentdiv.attr("class", this.newClass(contentdiv, 12));
                        missingimg.remove();
                    }
                }
            }

            /**
             * Now we look for other case where both sections contain a data-cols
             * and then we will verify that they match up to 12 if not we will change
             * one of them so they match up to 12
             */
            var secondDataColContainer = this.findSiblingColumns(parentContainer, true);
            if (secondDataColContainer) {
                var expectedCols = 12 - cols;
                var actualCols = secondDataColContainer.find("section[data-cols]").attr('data-cols');
                if (actualCols != expectedCols) {
                    secondDataColContainer.attr("class", this.newClass(secondDataColContainer, expectedCols));
                }
            }

        }
    },

    /**
     * Locates the ancestor that holds the col-xx-## that needs to be adjusted.
     * This function does not do the adjusting of the columns just locates the
     * node that needs to  be updated
     */
    findParentColumns: function(child) {
        var count = 0;
        var newNode = child;
        var classes = "";
        while (!classes.match(/(col-)/)) {
            newNode = newNode.parent();
            classes = newNode.attr("class");
            if (classes === undefined) {
                classes = "";
            }
            /**
             * stop the loop if the parent with the cols class has not been
             * found five levels up.  Used to prevent an infinite loop
             */
            if (++count == 5) {
                return false;
            }
        }
        return newNode;
    },

    /**
     * Takes the parent of the section passed adjustColumns and locates its
     * siblings to see if it has a [data-cols] attribute.  If it does false will
     * be returned otherwise it will return the node.
     */
    findSiblingColumns: function(firstSibling, containsDataCols) {
        var selector = "";
        if (containsDataCols) {
            selector = 'section[data-cols]';
        } else {
            selector = "section:not([data-cols])";
        }
        var prev = firstSibling.prev();
        if (prev.length > 0) {
            prevSection = prev.find(selector);
            if (prevSection.length > 0) {
                return prev;
            }
        }
        var next = firstSibling.next();
        if (next.length > 0) {
            nextSection = next.find(selector);
            if (nextSection.length > 0) {
                return next;
            }
        }
        if (prev) {
            return prev;
        } else if (next) {
            return next;
        }
        return false;
    },

    /**
     * Lets check is one of the columns is empty (missing image) and if so we
     * will return the div missing the img
     */
    findMissingImage: function(node) {
        if (node.find(".media-object").length > 0) {
            var mediaObject = node.find(".media-object");
            if (mediaObject.find("img").length === 0) {
                return node;
            } else {
                return false;
            }
        } else {
            return false;
        }
    },

    /**
     * calculate the new class string for node
     */
    newClass: function(node, cols) {
        if (node.attr("class") === undefined) {
            return;
        }
        var nodeClasses = node.attr("class").split(" ");
        var nodeNewClass = "col-sm-" + cols;
        /**
         * Goes through all attached classes of this node and removes all col
         * classes other than col-xs (since col-xs should always be 12)
         */
        for (var i = 0; i < nodeClasses.length; i++) {
            if (nodeClasses[i].slice(0, 3) != "col" || nodeClasses[i].slice(0, 6) == "col-xs") {
                nodeNewClass += " " + nodeClasses[i];
            }
        }
        return nodeNewClass;
    },

    /**
     * Return value of JQuery object's "col-sm-*"
     */
    getSMCols: function(element) {
        var tokens = element.attr("class").split(" ");
        for (var i = 0; i < tokens.length; i++) {
            var currentToken = tokens[i];

            // Set col-sm value if found
            if (currentToken.indexOf("col-sm") !== -1) {
                tokens = currentToken.split("-");
                return parseInt(tokens[tokens.length-1]);
            }
        }

        return -1;
    },

    /**
     * Adjust section parents if multiple
     */
    adjustParents: function(element) {
        var parentContainer = this.findParentColumns(element);
        if (!parentContainer) {
            return;
        }


//
//      // Make sure this parent not already adjusted
//      if (parentContainer.hasClass("colAdjusted")) {
//          return;
//      }
//
//      // Find next parent sibling
//      var nextSibling = parentContainer.next();
//
//      // Sibling is not valid
//      if (nextSibling.length === 0) {
//          parentContainer.addClass("colAdjusted");
//          return;
//      }
//
//      // Find sibling col-sm value
//      var parentCols = this.getSMCols(parentContainer);
//      var nextSiblingCols = this.getSMCols(nextSibling);
//      var totalCols = parentCols + nextSiblingCols;
//
//      if (totalCols <= 12) {
//          parentContainer.addClass("colAdjusted");
//          nextSibling.addClass("colAdjusted");
//      }
//
//      else if (totalCols > 12) {
//          parentContainer.addClass("colAdjusted");
//          parentContainer.attr("class", this.newClass(parentContainer, 12));
//      }
    }
};

(function($) {
$(document).ready(function(){
    $.each($("section"), function(i, element) {
        var self = this;
        //lets get an object of all attributes on each section tag
        var attributes = $(self).getAttributes();
        for (var a in attributes) {
            //if any of the attributes are a number between 1 - 12 lets add
            //datacols to the element
            if (a.match(/^[0-9]+$/) && a >= 1 && a <=12) {
                $(self).attr("data-cols", a);
                $(self).get(0).removeAttribute(a);
            }
        }
    });
    $("section[data-cols]").each(function() {
        columnsAdjust.start($(this));
    });

    $("section[data-cols]").each(function() {
        columnsAdjust.adjustParents($(this));
    });
});
})(jQuery);

(function($) {
    $.fn.getAttributes = function() {
        var attributes = {};

        if( this.length ) {
            $.each( this[0].attributes, function( index, attr ) {
                attributes[ attr.name ] = attr.value;
            } );
        }

        return attributes;
    };
})(jQuery);
