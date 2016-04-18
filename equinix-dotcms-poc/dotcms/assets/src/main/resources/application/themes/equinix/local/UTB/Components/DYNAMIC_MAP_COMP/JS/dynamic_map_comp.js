/***********
 * CONSTANTS -------------------------------------------------------------------
 ***********/

var COMP_SELECTOR = "div[id^='dynamic_map_comp']";

/******************
 * GLOBAL VARIABLES ------------------------------------------------------------
 ******************/

var mapArray = [];
var cachedLocations = {};
var defaultCenterArray = [];
var globalCenter = {lat: 20, long: 0, zoom: {global: 2, regional: 1, metro: 0}};

/************
 * MAP STYLES ------------------------------------------------------------------
 ************/
/** Enables trim in IE8 ***********************************/

if(typeof String.prototype.trim !== 'function') {
  String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, ''); 
  }
}


/** Minimal city style ************************************/
var metroStyle = [

	// Landscape color
	{
		"featureType": "landscape",
		"elementType": "all",
		"stylers": [
		    { "color": "#ededee" }
	    ]
	},

    // Disable transit
	{
		"featureType": "transit",
		"stylers": [
            { "visibility":	"off" }
        ]
	},

	// Disable Points-of-Interest
	{
		"featureType": "poi",
		"stylers": [
            { "visibility":	"off" }
        ]
	},

	// Enable parks geometry only
	{
		"featureType": "poi.park",
		"elementType": "geometry",
		"stylers": [
            { "visibility":	"on" },
            { "color":		"#c0d7b4" }
        ]
	},

	// Color water
	{
		"featureType": "water",
		"stylers": [
            { "color": "#cbd8e3" }
        ]
	},

	// Disable road icons
	{
		"featureType": "roads",
		"elementType": "labels.icon",
		"stylers": [
		    { "visibility": "off" }
		]
	},

	//** HIGHWAYS **********************
	{
	    "featureType": "road.highway",
	    "elementType": "labels.text.stroke",
	    "stylers": [
	        { "visibility": "off" }
	    ]
	 },

	 {
	    "featureType": "road.highway",
	    "elementType": "labels.text.fill",
	    "stylers": [
	        { "color": "#000000" }
	    ]
	 },

	 {
	    "featureType": "road.highway",
	    "elementType": "geometry.fill",
	    "stylers": [
	        { "color": "#d1d3d4" }
	    ]
	 },
	 {
	    "featureType": "road.highway",
	    "elementType": "geometry.stroke",
	    "stylers": [
	        { "color": "#bfc1c3" }
	    ]
	 },
	 {
	    "featureType": "road.highway",
	    "elementType": "labels.icon",
	    "stylers": [
	        { "visibility": "off" }
	    ]
	 },

	//** ARTERIAL ROADS ****************
	{
	    "featureType": "road.arterial",
	    "elementType": "labels.text.stroke",
	    "stylers": [
	        { "visibility": "off" }
	    ]
	 },

	 {
	    "featureType": "road.arterial",
	    "elementType": "labels.text.fill",
	    "stylers": [
	        { "color": "#000000" }
	    ]
	 },

	 {
	    "featureType": "road.arterial",
	    "elementType": "geometry.fill",
	    "stylers": [
	        { "color": "#d1d3d4" }
	    ]
	 },
	 {
	    "featureType": "road.arterial",
	    "elementType": "geometry.stroke",
	    "stylers": [
	        { "visibility": "off" }
	    ]
	 },

	 {
	     "featureType": "administrative.country",
	     "elementType": "labels",
	     "stylers": [
	         { "visibility": "off" }
	     ]
	 },

	 {
	     "featureType": "administrative.province",
//	     "elementType": "labels",
	     "stylers": [
	         { "visibility": "off" }
	     ]
	 },

	 {
	     "featureType": "administrative.neighborhood",
	     "stylers": [
	         { "visibility": "off" }
	     ]
	 }
];

/** Minimalist world style ********************************/
//var worldStyle = [
//
//    // Disable all
//    {
//    	"stylers": [
//    	    { "visibility": "off" }
//    	]
//    },
//
//    // Landscape color
//    {
//    	"featureType": "landscape",
//    	"stylers": [
//    	    { "visibility": "on" },
//    	    { "color": "#E1E2E3"},
//    	]
//    },
//
//    // Water color
//    {
//    	"featureType": "water",
//    	"stylers": [
//    	    { "visibility": "on" },
//    	    { "color": "#ffffff"},
//    	]
//    },
//];

/***********
 * FUNCTIONS -------------------------------------------------------------------
 ***********/

/**
 * Remove old controls
 * @param currentComp jQuery HTML object container map
 */
function removeOldControls(currentComp) {
    var oldControls = currentComp.find(".on_gmap.gmap_controls");
    var mapType = currentComp.attr("data-menu");
    if (mapType === "dropdown" ||
        mapType === "list") {
        
        oldControls.remove();
    }
}

/**
 * Loads the map points from the given JQuery HTML object
 * @param currentComp JQuery HTML object to parse locations
 */
function loadLocations(currentComp) {
	// Final resting place of the locations parsed
	var results = [];
	
	// Data Center view
	var wrapperComp = $(currentComp).parents(COMP_SELECTOR);
	if (wrapperComp.length === 0) {
		wrapperComp = currentComp;
	}
	var wrapperView = wrapperComp.attr("data-view");
	
	// Data Center view
	if (wrapperView === "dataCenter") {
		var dataCenter = currentComp.children("[data-title]");
		var title = dataCenter.attr("data-title");
		var popupText = dataCenter.children(".streetPopup").html();
		
		var address = dataCenter.attr("data-address").trim();
		var tokens = address.split(" ");
		
		var lat = parseFloat(tokens[0]);
		var long = parseFloat(tokens[1]);
		
		// Make new Maplace location object
		var location = {};
		location.title = title;
	    location.html = popupText;
		//location.html = '<div class="dtCustomWrapper">' + popupText + '</div>';
		location.lat = lat;
		location.lon = long;
		location.icon = "${dotTheme.path}local/UTB/Global/Images/placemarker1.png";

		// Custom marker
		var customMarker = wrapperComp.attr("data-markerSrc");
		if (customMarker !== undefined) {
			location.icon = customMarker;
		}
		
		// Push and return singular data center location
		results.push(location);
		return results;
	}

	// Non-Data Center view
	else {
		// Non-streetview IBX
		var dtChildren = currentComp.children("[data-title]");
		if (dtChildren.length > 0) {
			dtChildren.each(function() {

				var marker = $(this);
				var title = marker.attr("data-title");
				var popupText = null;
				
				// Metro view IBX
				var metroPopup = marker.children(".metroPopup");
				if (metroPopup.length > 0) {
					popupText = metroPopup.html();
				}
				
				// City
				else {
					popupText = marker.children(".popup").html();
				}
				
				popupText = '<div class="customHeightWrapper">' +
                                //'<div class="vertAlign">' +
                                //    '<img src="/Global/Images/eq_fortress.png"/>' +
                                //'</div>' + 
                                popupText + 
                            '</div>';
				
				var lat = null;
				var long = null;

				/* ENABLE THIS WHEN USING LAT/LONG FALLBACK */
				var address = marker.attr("data-address").trim();
				var tokens = address.split(" ");
				lat = parseFloat(tokens[0]);
				long = parseFloat(tokens[1]);
		
				/* ENABLE THIS WHEN HAVE GOOGLE API KEY THING */
	//			var address = marker.attr("data-address").trim();
	//			address = address.replace(/ /g, '+');
	//			
	//			var cache = cachedLocations[address];
	//			if (cache !== undefined) {
	//				lat = cache
	//			}
	//	
	//	        $.ajax({
	//	            url: "https://maps.googleapis.com/maps/api/geocode/json?address=" + address,
	//	            async: false,
	//	            dataType: "json",
	//	            success: function(data) {
	//	                lat = data.results[0].geometry.location.lat;
	//	                long = data.results[0].geometry.location.lng;
	//	            },
	//	        });
		
				// Make new Maplace location object
				var location = {};
				location.title = title;
				location.html = popupText ;
				location.lat = lat;
				location.lon = long;
				location.icon = "${dotTheme.path}local/UTB/Global/Images/placemarker1.png";
				
				// Custom marker
				var customMarker = wrapperComp.attr("data-markerSrc");
				if (customMarker !== undefined) {
					location.icon = customMarker;
				}
		
				// Store in array
				results.push(location);
			});
		
			// Return locations parsed
		    return results;
		}
		
		// IBX center (street-view)
		else {
			var marker = currentComp;
			
			// Location variables
			var title = marker.attr("data-title");
			var popupText = marker.children(".streetPopup").html();
			var lat = null;
			var long = null;
			
			/* ENABLE THIS WHEN USING LAT/LONG FALLBACK */
			var address = marker.attr("data-address").trim();
			var tokens = address.split(" ");
			lat = parseFloat(tokens[0]);
			long = parseFloat(tokens[1]);
			
			/* ENABLE THIS WHEN HAVE GOOGLE API KEY THING */
	//		var address = marker.attr("data-address").trim();
	//		address = address.replace(/ /g, '+');
	//
	//        $.ajax({
	//            url: "https://maps.googleapis.com/maps/api/geocode/json?address=" + address,
	//            async: false,
	//            dataType: "json",
	//            success: function(data) {
	//                lat = data.results[0].geometry.location.lat;
	//                long = data.results[0].geometry.location.lng;
	//            },
	//        });
	
			// Make new Maplace location object
			var location = {};
			location.title = title;
			location.html = popupText ;
			
			//var wrapperView = wrapperComp.attr("data-view");
			//if (wrapperView == "metro") {
			//	location.html = '<div style="width: 150px; height: 100px;">' + popupText + '</div>';
			//}
			
			location.lat = lat;
			location.lon = long;
			location.icon = "${dotTheme.path}local/UTB/Global/Images/placemarker1.png";
			
			// Custom marker
			var customMarker = wrapperComp.attr("data-markerSrc");
			if (customMarker !== undefined) {
				location.icon = customMarker;
			}
	
			// Push and return singular data center location
			results.push(location);
			return results;
		}
	}
}

/**
 * Change location to new set of points depending on given JQuery HTML object
 * @param newElement JQuery HTML object
 */
function changeLocation(newElement) {

	// Get current map
	var currentComp = $(newElement).parents(COMP_SELECTOR);
	var tokens = currentComp.attr("id").split("-");
	var currentCompIndex = parseInt(tokens[1]);	// Shift to 0-index
	var currentMap = mapArray[currentCompIndex];

	// Delete old controls (reloading locations will make duplicate controls)
	removeOldControls(currentComp);

    // Set new locations
    var locationArray = loadLocations(newElement);
	currentMap.SetLocations(locationArray, true);
    
	// Custom zoom
	var customZoom = newElement.attr("data-zoom");
	if (customZoom !== undefined) {
		//google.maps.event.addListenerOnce(currentMap.oMap, 'bounds_changed', function(event) {
		//	if (this.getZoom()) {
				currentMap.oMap.setZoom(parseInt(customZoom));
		//	}
		//});
	}
}

/**
 * Handles the two custom EQ controls.  A normal map reset (when the 
 * "Reset Map" button is pushed) is with "allLocs" false.  This resets map to 
 * the initial view state.  If the "All Locations" button is clicked, the 
 * function is called with "allLocs" set to true.  This call is the same as
 * when "allLocs" is false, except the final zoom/center is on a global scale.
 * 
 * @param	allLocs	True or False depending on if "All Locations" or "Reset Map"
 * 					was clicked.
 */
function resetMap(clickedElement, e, allLocs) {
	// Get which DYNAMIC_MAP_COMP this map is in
	var currentComp = clickedElement.parents(COMP_SELECTOR);
    var tokens = currentComp.attr("id").split("-");
    var currentIndex = parseInt(tokens[1]);
    
    // Get default center/zoom
    var centerLat = defaultCenterArray[currentIndex].lat;
    var centerLong = defaultCenterArray[currentIndex].long;
    var centerZoom = defaultCenterArray[currentIndex].zoom;
    var newCenter = {lat: centerLat, lng: centerLong};
    
    // If "All Locations" button clicked
    if (allLocs === true) {
    	centerLat = globalCenter.lat;
    	centerLong = globalCenter.long;
    	newCenter = {lat: centerLat, lng: centerLong};

    	// Set zoom
    	var view = currentComp.attr("data-view");
    	switch (view) {
    		case "global":
    			centerZoom = globalCenter.zoom.global;
    			break;
    		case "regional":
    		case "country":
    			centerZoom = globalCenter.zoom.regional;
    			break;
    		case "metro":
    		case "dataCenter":
    			centerZoom = globalCenter.zoom.metro;
    			break;
    	}
    }
    
    // Reload initial markers
    var locationArray = loadLocations(currentComp);    
    
    // Delete old controls (reloading locations will make duplicate controls)
    removeOldControls(currentComp);
    
    // Update map with new options
    var currentMap = mapArray[currentIndex];
	currentMap.SetLocations(locationArray, true);
    currentMap.oMap.setCenter(newCenter);
    currentMap.oMap.setZoom(centerZoom);
}

/****************
 * GLOBAL SCRIPTS --------------------------------------------------------------
 ****************/

/**
 * Called when an InfoWindow is clicked on.  Responsible for level-zoom logic
 * when clicking a link when "enableLevelZoom" is true.
 */
$(document).on("click", ".gm-style-iw a", function(e){
	
	// Don't do link redirect
    e.preventDefault();

    // Get which DYNAMIC_MAP_COMP this map is in
    var currentComp = $(this).parents(COMP_SELECTOR);
    
    // InfoWindow link
    //var aTag = $(this).find("a");
    var aTag = $(this);
    
    /*******************
     * For FatWire team:
     * 
     * Here is where redirects happen.  The text for the InfoWindows is 
     * populated by either "div.popup", "div.metroPopup", or "div.streetPopup".
     * The <a> tags inside these <div> are set to "#" for their "href".  
     * To make a redirect happen, the "#" needs to be replaced in the HTML
     * with an actual URL.  This can be seen on the DT Beta site:
     * 
     * http://equinix-cleanbootstrap.digitaltrike.com/Components_Test/DYNAMIC_MAP/HTML/dynamic_map.html
     * 
     * There are two examples where redirects are current in-place:
     * 
     *      1.  If you click on the "Seattle" marker, then click on "Seattle 
     *          Centers and Colocations", it will redirect to 
     *          "http://www.equinix.com".
     *          
     *      2.  If you click on the "Silicon Valley" marker, then click on 
     *          "Silicon Valley Centers and Colocations", then click on the
     *          "SV8" marker (the uppermost marker), then click on 
     *          "SV8 - Silicon Valley IBX Data Center", it will redirect to 
     *          "http://www.digitaltrike.com".
     *          
     * I have also placed HTML comments in the actual DYNAMIC_MAP HTML on the
     * link given above to show where the modified <a> tags are.  To facilitate
     * ease of searching, both comments start "REDIRECT EXAMPLE".
     *******************/
    //var href = aTag.attr("href");  //Commented out by FW TEAM - To fix issue: Click on Map text - redirects to Page not found

	/*Added by FW TEAM - To fix issue: Click on Map text - redirects to Page not found*/
	/*START*/
       var href;
       if(aTag)
	{
		href = aTag.attr("href");
	}
	/*END*/

    if (href && href !== "#") {	//'href' Added by FW TEAM - To fix issue: Click on Map text - redirects to Page not found
        window.location.href = href;
        return;
    }
    
    // Get popup text
    //var popupText = $.trim($(this).children("div").text());
    var popupText = $.trim(aTag.text());
    
    // Find *all* divs[data-title] that have that text within them
    var query = "[data-title]:contains('" + popupText + "')";
    var nodeList = currentComp.find(query);
    
    // Singleton city/IBX marker
    if (nodeList.length === 1) {
    	
    	// Check level-zoom enabled
    	var currentComp = $(nodeList).parents(COMP_SELECTOR);
    	var enableLevelZoom = currentComp.attr("data-enableLevelZoom");
    	
    	// Level-zoom enabled, overides default links
    	if (enableLevelZoom == "true") {
    	
	    	// City marker with IBXs
	    	if (nodeList.children("div").length > 0) {
	            changeLocation(nodeList);
	        }
    	}
    }
    
    // IBX marker (1 for city div + 1 for actual IBX div = 2)
    else if (nodeList.length === 2) {
    	
    	// Check level-zoom enabled
    	var currentComp = $(nodeList[1]).parents(COMP_SELECTOR);
    	var enableLevelZoom = currentComp.attr("data-enableLevelZoom");
    	
    	// Level-zoom enabled, overrides default links
    	if (enableLevelZoom == "true") {
    		changeLocation($(nodeList[1]));
    	}
    }
});

/**
 * Custom EQ map controls "Reset Map" and "All Locations"
 */
$(document).on("click", ".eq_resetControl", function(e) {
	resetMap($(this), e, false);
});
$(document).on("click", ".eq_allLocationsControl", function(e) {
	resetMap($(this), e, true);
});

/**
 * Redraw all maps on resize for responsive
 */
$(window).resize(function() {
	for (var i = 0; i < mapArray.length; i++) {
		var currentMap = mapArray[i];
		
		// Redraw all points on map
		currentMap.Load({
			start: 0
		});
		
		// Set default center
		var centerLat = defaultCenterArray[i].lat;
		var centerLong = defaultCenterArray[i].long;
		currentMap.oMap.setCenter({lat: centerLat, lng: centerLong});
	}
});

/*$(window).load(function(){
	renderingMap();
});*/
/**
 * Called when DOM is loaded.  Loads initial maps for all DYNAMIC_MAP_COMPs 
 * on this page, based on data-attrs set on each DYNAMIC_MAP_COMP.
 * Changed from jquery ready function to normal function on 15-July-2015- 
 */
function renderingMap()
{
	// Find all Dynamic_Maps
	var newMap;
	var customCenter = null;
       var customZoom =null;
	$(COMP_SELECTOR).each(function(index) {
		// Currently used DynamicMap
		var currentComp = $(this);

		// Pull out COMP ID
		var tokens = currentComp.attr("id").split("-");
		var currentCompIndex = 0;
		if (tokens.length > 1) {
			currentCompIndex = parseInt(tokens[1]);
		} 
		else {
            currentComp.attr("id", currentComp.attr("id") + "-" + currentCompIndex);
        }

		// Divs for current DynamicMap, set matching IDs with COMP
		var currentControls = currentComp.find("#controls");
		var currentGMap = currentComp.find("#gmap");
		currentControls.attr("id", "controls-" + currentCompIndex);
		currentGMap.attr("id", "gmap-" + currentCompIndex);

		// Selector queries for divs
		var currentControlsQuery = "#" + currentControls.attr("id");
		var currentGMapQuery = "#" + currentGMap.attr("id");

		// Default Maplace options
		var options = {

	    	// Disable controls
	    	map_options: {
	    		mapTypeControl: false,
	    		zoomControl: true,
	    		scrollwheel: false,
	    		zoomControlOptions: {
	    	        position: google.maps.ControlPosition.LEFT_BOTTOM,
	    	        style: google.maps.ZoomControlStyle.SMALL
	    	    },
	    	    panControl: false
	    	},
	    	
//	    	beforeOpenInfowindow: function(index, location, marker) {
//	    	    //console.log(this);
//	    	    //console.log(index);
//	    	    //console.log(location);
//	    	    //console.log(marker);
//	    	    
//	    	    var mapID = parseInt(this.map_div.split("-")[1]);
//	    	    mapArray[mapID].oMap.setCenter({lat: location.lat, lng: location.lon});
//	    	},

	    	// Disable controls
	    	generate_controls: false,

	    	// Set Controls div
	    	controls_div: currentControlsQuery,

	    	// Set GMap div
	    	map_div: currentGMapQuery,

	    	// Metro style
	    	styles: {
	    		"Equinix Style": metroStyle
	    	}
		};
		
		// Location points
		var locationsArray = loadLocations(currentComp);
		options.locations = locationsArray;

		// Custom marker
		//var markerSrc = currentComp.attr("data-markerSrc");

		// Menu flag
		var menuType = currentComp.attr("data-menu");
			
		// List outside (above) map
		if (menuType === "top") {
			options.controls_type =              "list";
			options.controls_on_map =            false;
			options.generate_controls =          true;
			options.force_generate_controls =    true;
			currentControls.css("display", "block");
		}
		
		// Dropdown inside map
		else if (menuType === "dropdown") {
		    options.controls_title=           "Choose a location:";
		    options.controls_type =           "dropdown";
		    options.controls_on_map =         true;
		    options.generate_controls =       true;
		    options.force_generate_controls = true;
		}
		
		// List inside map
		else if (menuType === "list") {
		    options.controls_title=           "Choose a location:";
		    options.controls_type =           "list";
            options.controls_on_map =         true;
            options.generate_controls =       true;
            options.force_generate_controls = true;
		}
		
		// Map type flag (polygon or polyline only)
		var mapType = currentComp.attr("data-mapType");
		if (mapType === "polygon" || mapType === "polyline") {
			options.type = mapType;
		}

		// Set default view coords
		
		var customView = currentComp.attr("data-view");
		if (customView == "global") {
			currentComp.addClass(customView);
			customCenter = {lat: globalCenter.lat, lng: globalCenter.long};
		}
		else if (customView == "regional") {
			currentComp.addClass(customView);
		}
		else if (customView == "country") {
			currentComp.addClass(customView);
		}
		else if (customView == "metro") {
			currentComp.addClass(customView);
		}
		else if (customView == "dataCenter") {
			currentComp.addClass(customView);
		}

		// Create new Maplace and render
		newMap = new Maplace(options);
		newMap.Load();

		// Store map
		mapArray.push(newMap);

		// Custom zoom
		   customZoom = currentComp.attr("data-zoom");
		if (customZoom !== undefined) {
               newMap.oMap.setZoom(parseInt(customZoom));

			//CUSTOM CODE ADDED BY FW TEAM - TO FIX ISSUE WITH SINGLE PIN IN MAP - 11-Feb-2015
			//*********CUSTOM CODE STARTS - FW TEAM
			var dtChildren = currentComp.children("[data-title]");
			if(dtChildren.length == 1)
			{
				var tokens = currentComp.attr("id").split("-");
				var currentIndex = parseInt(tokens[1]);
				
				var marker = dtChildren;
				
				var data_zoom = marker.attr("data-zoom");
				var zoom = 0;
				if(data_zoom !== undefined)
				{
					zoom = parseInt(data_zoom.trim());
				}
				// Setting the zoom value for the Map
				var currentMap = mapArray[currentIndex];
				currentMap.oMap.setZoom(zoom);
				
			}
				

			//*********CUSTOM CODE ENDS - FW TEAM
			google.maps.event.addListenerOnce(newMap.oMap, 'bounds_changed', function(event) {
				if (this.getZoom()) {
					/*
					// Set custom cetner
					if (customCenter !== null) {
						this.setCenter(customCenter);
					}
                                   */ 					
					// Set custom zoom
					this.setZoom(parseInt(customZoom));
                                
					// Save map center
					var currentCenter = newMap.oMap.getCenter();
                                 if(currentCenter)
                               {
					var savedCenter = {lat: currentCenter.lat(), long: currentCenter.lng(), zoom: parseInt(customZoom)};
                                
					defaultCenterArray.push(savedCenter);
                                   
					}
					if (customView == "dataCenter") {
						newMap.ViewOnMap(1);
					}
				}
			});
		}
               
		// Create custom "Reset" control
		var resetControl = document.createElement("button");
		resetControl.id = "eq_resetControl-" + currentCompIndex;
		resetControl.className = "eq_resetControl";
		resetControl.innerHTML = "Reset Map";
		resetControl.index = 0;
		newMap.oMap.controls[google.maps.ControlPosition.TOP_LEFT].push(resetControl);
		
		// Create custom "All Locations" control
		var allLocationsControl = document.createElement("button");
		allLocationsControl.id = "eq_allLocationsControl-" + currentCompIndex;
		allLocationsControl.className = "eq_allLocationsControl";
		allLocationsControl.innerHTML = "All Locations";
		allLocationsControl.index = 1;
		newMap.oMap.controls[google.maps.ControlPosition.TOP_LEFT].push(allLocationsControl);
		
	});
	// custom new code for tab click
$(document).on("click", ".nav-tabs li", function(e) {
        //var selected = $(this).text();
        if(newMap != undefined)	
        {
        newMap.oMap.setZoom(parseInt(customZoom));	
     	google.maps.event.trigger(newMap.oMap, "resize");
		newMap.oMap.setCenter(customCenter);
		}
});

     
}

/**
 * Add overlays to maps
 */
$(window).load(function() {


    /*COMMENTED OUT BY FW TEAM - TO CONSTRUCT THE OVERLAY ELEMENT FROM TEMPLATE CODE - 15-MAY-2015*/
    /*START*/
    /*
    // Create outer overlay
    var outer = $("<div>");
    outer.addClass("eq-map-overlay");
    
        // Create inner overlay
        var inner = $("<div>");
        inner.addClass("inner-overlay");
        inner.appendTo(outer);
        
            // Vertical align span
            var vertAlign = $("<span>");
            vertAlign.addClass("vertAlign");
            vertAlign.appendTo(inner);
            
            // Content div
            var content = $("<div>");
            content.addClass("overlayContent");
            content.appendTo(inner);
            
                var title = $("<p>");
                title.addClass("banner");
                title.html("Map Title Here");
                title.appendTo(content);
                
                var description = $("<p>");
                description.html("<a href='#'>Map link here</a> Map description here");
                description.appendTo(content);
            
            // Close button
            var closeButton = $("<div class='overlayClose'>");
            closeButton.html("<i class='fa fa-times'></i>");
            closeButton.appendTo(inner);
        
    // Add overlay to Gmaps
    $("div[id^='gmap']").prepend(outer);
     */
     /*END*/


	if( $(".eq-map-overlay").length )  {	//ADDED BY FW TEAM - 15-MAY-2015
    // Remove overlay on click
    $(".eq-map-overlay").on("click", function() {
        $(this).css("display", "none");
    });
	}	//ADDED BY FW TEAM - 15-MAY-2015

var mapDiv = $(".tab-content").find('div[id^="dynamic_map_comp-"]');
if(mapDiv!== undefined)
{

    $( ".nav-tabs li.active" ).trigger( "click" );
}   //ADDED BY FW TEAM - 24-JUN-2015



});
