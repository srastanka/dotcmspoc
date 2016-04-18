
	var isInfoEnabled  = true;
	var isDebugEnabled  = true;
	var isDeepDebugEnabled  = true;
	
	
	
	var eventArray_4_onload = ["onload", "load"]; // 1st for IE , 2nd for NON IE
	var callBackArray_4_GetDefaultValues = ["getDefaultValuesCallback"]; // For all the browsers
	var callBackArray_4_GhostFormSubmission = ["submitGhostFormCallback_For_IE", "submitGhostFormCallback_For_OtherBrowsers"]; // 1st for IE , 2nd for NON IE
	var EXPLICIT_FORM_SUBMISSION_COMPLETE = "EXPLICIT_FORM_SUBMISSION_COMPLETE"; //Pritam: 
	
	
	
	
	
	//Section 2 Starts :***** Common areas  ********
	var customLog = { 
			info:function(logString){
				if(isInfoEnabled){
					console.log(logString);
				}
			},
	
			debug:function(logString){
				if(isDebugEnabled){
					console.log(logString);
				}
			},
			
			deepDebug:function(logString){
				if(isDeepDebugEnabled){
					console.log(logString);
				}
			}
	
	};
	
	
	
	function printLogLevels(){
		console.log("isInfoEnabled(" + isInfoEnabled + "), isDebugEnabled(" + isDebugEnabled + "),  isDeepDebugEnabled(" + isDeepDebugEnabled + ")....");
	}

	/***ENCODING - DECODING FUNCTION DEFINITIONS STARTS ***/
	
	//Create Base64 object
	var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}

	function encode(value)
	{
		if(value)
		{
			return Base64.encode(value);
		}
		return "";
	}

	function decode(value)
	{
		if(value)
		{
			return Base64.decode(value);
		}
		return "";
	}
	/***ENCODING - DECODING FUNCTION DEFINITIONS ENDS ***/


	/***EVENT RELATED FUNCTION DEFINITIONS STARTS***/

	var DUMMY_EVENT_NAME = "DUMMY_EVENT_NAME"; //Pritam: 16th Oct

	function detectIE() {
		var ua = window.navigator.userAgent;
		var msie = ua.indexOf('MSIE ');
		var trident = ua.indexOf('Trident/');
		 customLog.debug("ua: " + ua ) ; 
		customLog.debug("msie: " + msie  + "trident: " + trident  ) ;
		if (msie > 0) {
			// IE 10 or older => return version number
			return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
		}

		if (trident > 0) {
			// IE 11 (or newer) => return version number
			var rv = ua.indexOf('rv:');
			return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
		}

		// other browser
		return -1;
	}
	
	//Added by FWTEAM - 17-Nov-2015
	function isSafari()
	{
        var ua = window.navigator.userAgent;
        var safari = ua.indexOf('Safari');
        var chrome = ua.indexOf('Chrome');
        if(safari > 0)
        {
            if(chrome > 0)
            {
                return false;
            } else {
                return true;
            }
        }
        return false;
    }
	
	//Added by FWTEAM - 11-Dec-2015
	function isFirefox()
	{
        var ua = window.navigator.userAgent;
        var firefox = ua.indexOf('Firefox');
        if(firefox > 0)
        {
            return true;
        }
        return false;
    }	
	
	var IE_8_OR_LOWER_BROWSER = "IE 8 or lower Browser ";
	var IE_9_OR_HIGHER_BROWSER = "IE 9 or higher Browser ";
	var NON_IE_BROWSER = "Non IE browser ";
	
	function detectBrowser() {
	    var browserDetails = {"version":"", "description":""};
		
		var detected_IE_Version =  detectIE();
		
		browserDetails["version"] = detected_IE_Version;	
		
		
		if(detected_IE_Version > 0 && detected_IE_Version  < 9){		
			browserDetails["description"] = IE_8_OR_LOWER_BROWSER;
			
		}else if (detected_IE_Version >= 9){			
			browserDetails["description"] = IE_9_OR_HIGHER_BROWSER;
			
		}else {
			browserDetails["description"] = NON_IE_BROWSER;
		}
		
		return browserDetails;
	}
	
	var browserDetailsObj = detectBrowser();
	console.log("Browser Type -->(" +  browserDetailsObj["description"] + "), Version -->(" + browserDetailsObj["version"] + ")...." ) ;
	

	function getCustomEventObject(specificEventName, objectTiedTo_D_Event){
		var eventName;
		if ( specificEventName != 'undefined' || specificEventName != null || specificEventName !='') {
			eventName = specificEventName;
		}else{
			eventName = "DUMMY_EVENT_NAME";
		}
		customLog.debug("eventName: " + eventName ) ;
		var detectedID = detectIE();
		customLog.debug("detectIE(): " +  detectedID) ;
		
		if(browserDetailsObj["description"] == IE_8_OR_LOWER_BROWSER ){	
			customLog.debug("Custom Event can not be fired for " + IE_8_OR_LOWER_BROWSER );
		
		}else if (browserDetailsObj["description"] == IE_9_OR_HIGHER_BROWSER || isSafari() ){
			var customEvent = document.createEvent('CustomEvent');
			customEvent.initCustomEvent(eventName, false, false, objectTiedTo_D_Event);	
            if(browserDetailsObj["description"] == IE_9_OR_HIGHER_BROWSER)
            {	
			     customLog.debug("Event " + eventName + " fired for " + IE_9_OR_HIGHER_BROWSER + ", and Version -->" + browserDetailsObj["version"]);
			} else {
			     customLog.debug("Event " + eventName + " fired for " + NON_IE_BROWSER );
			}
			return customEvent;
			
		}else {		
			var customEvent = new CustomEvent(eventName, {'detail': objectTiedTo_D_Event});			
			customLog.debug("Event " + eventName + " fired for " + NON_IE_BROWSER );
			return customEvent;
		}

	}
	
	
	
    
	
	function setEvent_N_Callback(eventArray, callbackArray){ 
		
		var eventName_1 = eventArray[0];
		var eventName_2 = eventArray[1];
		var eventName = eventName_1;
		
		var callback_1 = callbackArray[0];
		var callback_2 = callbackArray[1];
		var callback = callback_1;		
		
		if(window.addEventListener){
			// For IE(9/10/11)  &  NON-IE browsers
			if(eventName_2 != undefined || eventName_2 != null){
				eventName = eventName_2;
			}
			
			if(callback_2 != undefined || callback_2 != null){
				callback = callback_2;
			}			
			window.addEventListener(eventName,  function(customEventObj){
													var object_tied_2_D_event = customEventObj['detail'];
													customLog.debug(browserDetailsObj["description"] + " reacts to (" + eventName + ") and calls the method( " + callback + ") with object(" + object_tied_2_D_event + ")...");
													window[callback](object_tied_2_D_event);											
												} ,
			false);
			customLog.debug(browserDetailsObj["description"] + " registered for Event(" + eventName + ")  and callback(" + callback.toString() + ")");	
		}
	}	

	
	/***EVENT RELATED FUNCTION DEFINITIONS ENDS***/
	
	
	
	function setEncodedCookie(cookieName, clearTextCookieValue){	
		setCookie(cookieName, encode(clearTextCookieValue) , 365);
		customLog.debug(cookieName + " cookie has been encoded and set to the browser; It's value is --> " + clearTextCookieValue);
	}
	
	function getValues_Of_EncodedCookie(cookieName){
		var encodedCookieValue = getCookie(cookieName); //cookieValue --> usr=KUemail=pmohanty@equinix.com
		var decodedCookieValue = decode(encodedCookieValue);
		customLog.debug(cookieName + " is encoded; It's value is --> " + decodedCookieValue);
		return decodedCookieValue;
	}
	
	
	function generateCookieString_From_ValuesArray(valuesArr){
		var cookieValueString = "";
		var numb = 1;
		var formIdCheck="formid";
		var formVidCheck="formvid";
		var noOfItemsInCookie = 0;
		for (var property in valuesArr) {
			if (valuesArr.hasOwnProperty(property)) {	//Pritam: 17th Oct				
				//if(! (property.toLowerCase()==formIdCheck || property.toLowerCase()==formVidCheck) ){
					if(numb==1) {
						cookieValueString = property + "=" + valuesArr[property];
						numb++;
						noOfItemsInCookie ++;
					}
					else{
						cookieValueString = cookieValueString + "#" + property + "=" + valuesArr[property];
						noOfItemsInCookie ++;
					}
				//}
			}
		}
		console.log("*************  noOfItemsInCookie --> " + noOfItemsInCookie );
		return cookieValueString;
	}
	
	
	// This method would check for existing name=value pair in the cookie
	// If it finds, it would updated , encode and return 
	// If it does not, it would add a new name=value pair and return 
	function getUpdatedCookieValue_As_Cleartext(cookieName, name, value){
		var valuesArr = getAllValues_Of_A_Cookie_As_ValuesArray(cookieName);
		valuesArr[name] = value;
		var cookieValueString = generateCookieString_From_ValuesArray(valuesArr);		
		customLog.debug("cookie value after update --> " + cookieValueString);
		return cookieValueString;
		
		
	}
	
	
	//cookie example --> usr=KU#email=pmohanty@equinix.com;XXXX;YYYY
	function getAllValues_Of_A_Cookie_As_ValuesArray(cookieName){		
		var allValuesInTheCookie = {};
		var decodedCookieValue = getValues_Of_EncodedCookie(cookieName);
		var nameValuePairArray = decodedCookieValue.split('#'); // nameValuePairArray --> { "usr=KU"  , email=pmohanty@equinix.com }
		for(var i=0; i< nameValuePairArray.length; i++) {
			var  nameValuePair = nameValuePairArray[i].trim(); // nameValuePair --> usr=KU
			var  atomicValues = nameValuePair.split('='); // atomicValues  --> { "usr" , "KU" }
			if(atomicValues != null){
				var name = atomicValues[0]; // name --> usr
				if(name != null) name = name.trim();				
				var value = atomicValues[1]; // value --> KU
				if(value != null) value = value.trim();
				allValuesInTheCookie[name] = value;
				//customLog.debug("******allValuesInTheCookie[ " + name + " ] = " + value);
			}
			
		}
		return allValuesInTheCookie;
	
	}
	
	
	
	
	function isValidEmail(email) { 
		var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(email);
	} 
	
	function getParameterByName(name) {
		name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
		var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
		results = regex.exec(location.search);
		return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	}
	
	
	function getCookie(cname) {
		var name = cname + "=";
		var ca = document.cookie.split(';');
		for(var i=0; i<ca.length; i++) {
			var c = ca[i].trim();
			if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
		}
		return "";
	}
	
	
	function setCookie(cname, cvalue, exdays) {
		customLog.deepDebug("creating cookie... cookieName "+cname+" cookieValue "+cvalue);
		deleteCookie(cname);
		var d = new Date();
		d.setTime(d.getTime() + (exdays*24*60*60*1000));
		var expires = "expires="+d.toGMTString();
		var path = "path=/";
		document.cookie = cname + "=" + cvalue + "; " + expires + "; " + path;
	}
	
	
	function deleteCookie(cname){
		customLog.deepDebug("deleting old cookie... cookieName "+cname);
		document.cookie = cname + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
	}
	
	
	
	function setEmailFromReqParam2Cookie(){
		var emailFromReqParam = getParameterByName(emailURLParameter);
		customLog.info("Request parameter --> " + emailURLParameter + ":" +  emailFromReqParam + ", " + isValidEmail(emailFromReqParam));		
		if(isValidEmail(emailFromReqParam)){
			setCookie(customEmailCookieName, emailFromReqParam, 365);
			customLog.debug("browser cookie --> " + customEmailCookieName + " : " + getCookie(customEmailCookieName));
		}
	}
	
	//Section 2 Ends :***** Common areas ********

	var EQXUSR_COOKIE = "eqx";
	var USER_TYPE = "usr";
		
	var KNOWN_USER = "KU";
	var UNKNOWN_USER = "UU";	
	
	
	var eventArray_4_ExplicitForm_Submission_Complete = [EXPLICIT_FORM_SUBMISSION_COMPLETE]; // For all the browsers
	var callBackArray_4_ExplicitForm_Submission_Complete = ["createCookieAfterExplicitFormSubmission"];
	
	
	//Pritam:WCM-645  Blindform submission issue fix
	
	function override_the_eqx_cookie(valuesArr, eqxUSRCookieValueArr){
		var overridenCookieString = generateCookieString_From_ValuesArray(valuesArr);
		
		
		//Block A starts...
		for (var formField in valuesArr) {
			if (valuesArr.hasOwnProperty(formField)) {	
				var formFieldValueSubmitedByUser = valuesArr[formField];	
				//Override the cookie value, if the field is already present. If the field is not present, create a new one. 
				eqxUSRCookieValueArr[formField] = formFieldValueSubmitedByUser;				
			}
		}
		overridenCookieString = generateCookieString_From_ValuesArray(eqxUSRCookieValueArr);
		//Block A ends...
		
		
		if(overridenCookieString == ""){
			customLog.info("WARNING !!! -->  overridenCookieString is blank...");
		}
		return overridenCookieString;
	}
	
	
	//Pritam: 24th Nov 2014
	function createCookieAfterExplicitFormSubmission(valuesArr){		
					
		var eqxUSRCookieValueArr = getAllValues_Of_A_Cookie_As_ValuesArray(EQXUSR_COOKIE);
	
		if( eqxUSRCookieValueArr != undefined && eqxUSRCookieValueArr != null ){		
			customLog.debug("eqx cookie already exits; will override with new values...");
			var overridenCookieString = override_the_eqx_cookie(valuesArr, eqxUSRCookieValueArr);
			var userTypeFromCookie = eqxUSRCookieValueArr[USER_TYPE];
			customLog.debug("userTypeFromCookie --> " + userTypeFromCookie);				
			if(userTypeFromCookie == undefined || userTypeFromCookie == null || userTypeFromCookie =='' ){
				overridenCookieString = USER_TYPE + "=" + UNKNOWN_USER + "#" + overridenCookieString;
			}else{
				//do nothing ; Earlier piece of code kept appending usr=XX for every form submission; So that's been addressed here. 
			}
			setEncodedCookie(EQXUSR_COOKIE, overridenCookieString);
		}else{
			// "eqx" cookie gets created for the first time		
			customLog.debug("eqx cookie to be created for the 1st time...");			
			var cookieValueString = generateCookieString_From_ValuesArray(valuesArr);
			customLog.debug("cookieValueString --> " + cookieValueString);
			cookieValueString = USER_TYPE + "=" + UNKNOWN_USER + "#" + cookieValueString;			
			setEncodedCookie(EQXUSR_COOKIE, cookieValueString);
		}	
				
		
	}	
	
	
	var getDefaultValues_RepeatCallInterval = 1000;
	var submitGhostForm_RepeatCallInterval = 1000;
	var jsonLocation = "/marketo_json/";
	function loadExplicitMarketoForm(mktoFormID) { 	  

		  MktoForms2.loadForm("http://app-sjg.marketo.com", 
							  "180-SLL-021",
							  mktoFormID , 
							  function(marketoForm){								
								setupMarketoForm(marketoForm, EXPLICIT_FORM); 							
							  }// Marketo.loadForm() call back
							); //end MktoForms2.loadForm (part of example)
							
		   getDefaultValues();
		
	}//end of 	loadExplicitMarketoForm() 	 
	
	
    //FW TEAM (India): 25th Aug 2015
    function getBrowserBasedXmlHttp()
    {
        var xmlHttp;
        if (window.XMLHttpRequest)
        {// code for IE7+, Firefox, Chrome, Opera, Safari
            xmlHttp=new XMLHttpRequest();
        }
        else
        {// code for IE6, IE5
            xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");
        }
        return xmlHttp;
    }
    
    //To Get Referrer Value - FW TEAM (India): 23rd Nov 2015
    function getReferrer()
    {
        if(document !== undefined)
        {
            return document.referrer;
        } else {
            return null;
        }
    }