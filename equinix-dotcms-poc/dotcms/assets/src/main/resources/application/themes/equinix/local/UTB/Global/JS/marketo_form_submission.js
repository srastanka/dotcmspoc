	//This entire JS file is imported through  "** A: MarketoJS import ". Check out the PDF flow diagram

	//Section 1 Starts : ***** variable declaration  ********
	var EXPLICIT_FORM = "explicit";
	var GHOST_FORM = "blind";
	var FORM_TYPE_FIELD = "blindExplicit";
	var emailURLParameter = "email";
	var customEmailCookieName = "memail";
	var marketoEmailField = "Email";


	var FETCHED = "fetched";
	var NOT_FETCHED = "not_fetched";
	var isDefaultValuesJSON = NOT_FETCHED; // Refer to 1 in the PDF flow diagram
	var defaultValueJSON = ""; // Refer to 2 in the PDF flow diagram
	var getDefaultValues_RepeatCallInterval = 1000;
	var submitGhostForm_RepeatCallInterval = 1000;
	var jsonLocation = "/marketo_json/";
	 

	//var canSubmitGhostForm = true; // Refer to 3 in PDF flow diagram
	//Section 1 Ends : ***** variable declaration ********


	//Section 2 Starts : ***** loadExplicitForm   ********
	function loadExplicitMarketoFormObsolete(mktoFormID) {

		  MktoForms2.loadForm("http://app-sjg.marketo.com",
							  "180-SLL-021",
							  mktoFormID ,
							  function(marketoForm){
								setupMarketoForm(marketoForm, EXPLICIT_FORM);
							  }// Marketo.loadForm() call back
							); //end MktoForms2.loadForm (part of example)

		   getDefaultValues();

	}//end of 	loadExplicitMarketoForm()

	//Section 2 Ends : ***** loadExplicitForm   ********


	//Section 3 Starts : ****** GhostForm submission related  methods  **********

	/* Code Snippet of MarketoGhostFormSubmission_HeaderTracker must define the following
				>  submitGhostForm_RepeatCallInterval = 1000;
				>  marketoGhostFormID = {1} i.e This value would be dynamically replaced with locale specific value
				>  isDebugEnabled = true;
				>  submitGhostForm();
	 */

	function submitGhostForm(marketoGhostFormID){
	    printLogLevels();
		//setEvent_N_Callback(eventArray_4_onload, callBackArray_4_GhostFormSubmission);



		window.addEventListener("load",  function(){
											submitGhostFormCallback_For_OtherBrowsers(marketoGhostFormID);
										 } ,
		false);

		setEmailFromReqParam2Cookie();

	}


	function submitGhostFormCallback_For_IE(marketoGhostFormID){
	    getDefaultValuesCallback();
		var formValues = getAllValues_Of_A_Cookie_As_ValuesArray(EQXUSR_COOKIE);
		prepareFormPlaceholderForIE();
		loadGhostMarketoForm(marketoGhostFormID);
		initiateRepeatCall_4_submitGhostForm(submitGhostForm_RepeatCallInterval, formValues, marketoGhostFormID);
	}


	function submitGhostFormCallback_For_OtherBrowsers(marketoGhostFormID){
	    getDefaultValuesCallback();
		var formValues = getAllValues_Of_A_Cookie_As_ValuesArray(EQXUSR_COOKIE);
		prepareFormPlaceholderForOtherBrowsers(marketoGhostFormID);
		loadGhostMarketoForm(marketoGhostFormID);
		initiateRepeatCall_4_submitGhostForm(submitGhostForm_RepeatCallInterval, formValues, marketoGhostFormID);
	}

	function createAttribute(marketoGhostFormID){
		marketoForm = document.createElement("form");
		id_Attribute = document.createAttribute("id");
		style_Attribute = document.createAttribute("style");
		formIdAttrValue = "mktoForm_" + marketoGhostFormID;
		styleAttrValue = "display:none";
	}

	function prepareFormPlaceholderForIE(){
		createAttribute();
		id_Attribute.value =  formIdAttrValue;
		style_Attribute.value = styleAttrValue;
		marketoForm.setAttribute(id_Attribute);
		marketoForm.setAttribute(style_Attribute);
		document.body.appendChild(marketoForm);
	}


	function prepareFormPlaceholderForOtherBrowsers(marketoGhostFormID){
		createAttribute(marketoGhostFormID);
		id_Attribute.nodeValue = formIdAttrValue;
		style_Attribute.nodeValue = styleAttrValue;
		marketoForm.setAttributeNode(id_Attribute);
		marketoForm.setAttributeNode(style_Attribute);
		document.body.appendChild(marketoForm);
	}

	function loadGhostMarketoForm(marketoGhostFormID){
		MktoForms2.loadForm("http://app-sjg.marketo.com", "180-SLL-021", marketoGhostFormID , function(marketoForm){
		});
	}

	var repeat_call_interval_4_submitGhostForm = [];
	var repeat_call_interval_4_submitGhostForm_array_counter = 0;


	function initiateRepeatCall_4_submitGhostForm(milliseconds, formValues, marketoGhostFormID){
		var funcArg = {val:formValues,
					   arrayCounter:repeat_call_interval_4_submitGhostForm_array_counter,
					   ghostFormID:marketoGhostFormID,
					   canSubmitTheForm:true};
		repeat_call_interval_4_submitGhostForm[repeat_call_interval_4_submitGhostForm_array_counter] = window.setInterval(function(){
																											repeat_call_4_submitGhostForm(funcArg);
																										}, milliseconds);

		customLog.debug("repeat_call_interval_4_submitGhostForm got created --> " + repeat_call_interval_4_submitGhostForm[repeat_call_interval_4_submitGhostForm_array_counter] );
		repeat_call_interval_4_submitGhostForm_array_counter ++;

	}



	function repeat_call_4_submitGhostForm(context){
		formValues = context.val;
		repeat_call_interval_4_submitGhostForm_counter = context.arrayCounter;
		blindFormID = context.ghostFormID;
		var marketoForm = MktoForms2.getForm(blindFormID);	// Refer to 4 in the PDF flow diagram
		customLog.debug("canSubmitTheForm :" + context.canSubmitTheForm + ", isDefaultValuesJSON :" + isDefaultValuesJSON +  ", marketoForm :" + marketoForm);
		if(context.canSubmitTheForm && isDefaultValuesJSON == FETCHED && marketoForm){
			/*if(formValues != undefined && formValues != null){
				//@RAJESH 04Dec2014: Added this snippet To fix the formid and formVid issue.
				/*for (var property in formValues) {
							if (formValues.hasOwnProperty(property)) {
								var value = formValues[property];
								if(property.toLowerCase() == 'formid')
								{
									value = marketoForm.getId();
								}
								//customLog.debug("Field(" + property + "), value(" + value + ")");
								formValues[property] = value;
							}
				}
				//End of formid and formVid issue fix.

				marketoForm.setValues(formValues);
			}
			var formValuesArr = marketoForm.getValues();*/
			if(formValues != undefined){
				formValues['formid'] = marketoForm.getId();
				marketoForm.setValues(formValues);
			}
			setupMarketoForm(marketoForm);	// Configure the Marketo callbacks
			marketoForm.submit();
			context.canSubmitTheForm = false;
			customLog.debug("GhostForm: Clearing repeat_call_interval --> " + repeat_call_interval_4_submitGhostForm[repeat_call_interval_4_submitGhostForm_counter] );
			window.clearInterval(repeat_call_interval_4_submitGhostForm[repeat_call_interval_4_submitGhostForm_counter]);

		}else{
			customLog.debug("Ghost form is not submitted because one or more criteria(s) is/are not satisfied....");
		}
	}

	//Section 3 Ends : ****** GhostForm submission related  methods  **********







	//Section 4 Starts : ****** GetDefaultValues JSON  methods   **********
	/* Code Snippet of MarketoDefaultValuesPreparation_HeaderTracker must define the following
				>  getDefaultValues_RepeatCallInterval = 2000;
				>  jsonLocation = //;
				>  isDebugEnabled = true;
				>  getDefaultValues();

	 */
	function getDefaultValues(){
		printLogLevels();
		setEvent_N_Callback(eventArray_4_onload, callBackArray_4_GetDefaultValues);
	}


	function getDefaultValuesCallback(){
		initiateRepeatCall_4_getDefaultValues(getDefaultValues_RepeatCallInterval);
	}


	var repeat_call_interval_4_getDefaultValues = [];
	var repeat_call_interval_4_getDefaultValues_array_counter = 0;

	function initiateRepeatCall_4_getDefaultValues(milliseconds){
		repeat_call_interval_4_getDefaultValues[repeat_call_interval_4_getDefaultValues_array_counter] = window.setInterval(repeat_call_4_getDefaultValues, milliseconds);
		repeat_call_interval_4_getDefaultValues_array_counter ++;
	}


	function repeat_call_4_getDefaultValues(){
		customLog.debug("isDefaultValuesJSON :" + isDefaultValuesJSON + ", defaultValueJSON :" + defaultValueJSON );
		if(isDefaultValuesJSON == NOT_FETCHED ){
			getJson(); // This method would use the jsonLocation from MarketoDefaultValuesPreparation_HeaderTracker
			customLog.debug("getJson() is called , After that,  defaultValueJSON :" + defaultValueJSON );
			if(defaultValueJSON && defaultValueJSON != ""){
				isDefaultValuesJSON = FETCHED;
				clear_repeat_call_interval_4_getDefaultValues();
				customLog.debug("JSON is fetchced...");
			}
		}else{
			customLog.debug("defaultValues JSON will not be fetched again, as it's already done for this window context....");
			clear_repeat_call_interval_4_getDefaultValues();
		}
	}
	//Section 4 Ends : ****** GetDefaultValues JSON  methods  ends **********


	function clear_repeat_call_interval_4_getDefaultValues(){
		for (var i = 0; i < repeat_call_interval_4_getDefaultValues.length; i++) {
			customLog.debug("clearing the repeat interval --> " + repeat_call_interval_4_getDefaultValues[i]);
			window.clearInterval(repeat_call_interval_4_getDefaultValues[i]);
		}
	}



	//Section 5 Starts : ****** Email needs for Explicit-form and Marketo  **********
	function getEmailForMarketoFormSubmission(marketoForm, formtype){
		var explicitFormFields = marketoForm.getValues();
		var explicitFormEmail = explicitFormFields[marketoEmailField];
		var cookiedEmail = getCookie(customEmailCookieName);
		customLog.debug("cookiedEmail : " + cookiedEmail + ", explicitFormEmail: " + explicitFormEmail);

		var emailForMarketoFormSubmission = cookiedEmail;

		if(formtype == EXPLICIT_FORM && cookiedEmail != explicitFormEmail){
			customLog.debug("cookiedEmail and explicitFormEmail did not match: ");
			emailForMarketoFormSubmission = explicitFormEmail;
			setCookie(customEmailCookieName, emailForMarketoFormSubmission, 365);
			customLog.debug("browser cookie --> " + customEmailCookieName + " : " + getCookie(customEmailCookieName));
		}
		return emailForMarketoFormSubmission;
	}


	function setEmailFieldInMarketo(marketoForm){
		//var explicitFormFields = marketoForm.getValues();
		var emailObj = {};
		var cookiedEmail = getCookie(customEmailCookieName);
		emailObj[marketoEmailField] = cookiedEmail;
		marketoForm.setValues(emailObj);
		//explicitFormFields[marketoEmailField] = cookiedEmail;
		customLog.debug("cookiedEmail for Explicit form: " + cookiedEmail);
	}

	function setAllFieldsInMarketo(marketoForm){
		var allValues = getAllValues_Of_A_Cookie_As_ValuesArray(EQXUSR_COOKIE);
		if(allValues.length == 0){
			return;
		}

		var cookieValues = {};
		for (var property in allValues) {
			if (allValues.hasOwnProperty(property)) {
				var value = allValues[property];
				if(property.toLowerCase() == 'formid')
				{
					value = marketoForm.getId();
				}
				//customLog.debug("Field(" + property + "), value(" + value + ")");
				cookieValues[property] = value;
			}
		}

		marketoForm.setValues(cookieValues);
	}
	//Section 5 Ends : ****** Email needs for Explicit-form and Marketo  **********


	//Section 6 Starts : ***** setupMarketoForm is called when a Ghost or Explicit form is loaded ******
	function setupMarketoForm(marketoForm, formtype){


		if(formtype == EXPLICIT_FORM ){
			setEmailFieldInMarketo(marketoForm);
			setAllFieldsInMarketo(marketoForm);
			setEvent_N_Callback(eventArray_4_ExplicitForm_Submission_Complete, callBackArray_4_ExplicitForm_Submission_Complete);

		}else{
			formtype = GHOST_FORM;
		}

		marketoForm.onValidate(
				function(isUserInputOK){
					if(!isUserInputOK){
						customLog.info("ERROR: Some mandatory form fields are missing !!!!!!!!! for form -->" + marketoForm.getId() );
					}
				}
		);

		marketoForm.onSubmit(function(form){
			var formId = form.getId();
			var hiddenFieldsForMarketo = getHiddenFieldsForMarketo(formId);
			hiddenFieldsForMarketo[marketoEmailField] = getEmailForMarketoFormSubmission(marketoForm, formtype);
			hiddenFieldsForMarketo[FORM_TYPE_FIELD] = formtype;
			form.addHiddenFields(hiddenFieldsForMarketo);
		});

		marketoForm.onSuccess(
				function(values, followUpUrl){
					customLog.info("******************  Beginning  of " + formtype + "(" + marketoForm.getId() + ")  submission  *************" );
					customLog.info("SUCESS: Here are the fields submitted  for form -->" + marketoForm.getId() );
					var formValues="";
					for (var property in values) {
						if (values.hasOwnProperty(property)) {
							formValues += "Field(" + property + "), value(" + values[property] + ") \n";
						}
					}
					customLog.info(formValues);
					//location.href = "http://localhost:8080/poc/redirect.jsp";
					//dataLayer.push({'event' : 'form submit'});
					if(formtype == EXPLICIT_FORM ){
						/*var explicitFormID = "mktoForm_" + marketoExplicitFormID;
						var explicitFormElement = document.getElementById(explicitFormID);
						explicitFormElement.innerHTML = "";
						loadExplicitMarketoForm();
						//explicitFormElement.innerHTML += "<font color='red'>submitted successfully; Check your mail sent by Marketo </font>";*/
						window.dispatchEvent(getCustomEventObject(EXPLICIT_FORM_SUBMISSION_COMPLETE, values));  //Pritam: 17th Oct
						return true;
					}else{
						return false;
					}
					customLog.info("******************  End of " + formtype + "(" + marketoForm.getId() + ")  submission  *************" );

				}
		);

	}


	//getDummyValues4ExplicitForm is purely a test method , required to test Marekto forms which has mandatory fields.
	//This is not required for actual PROD use cases.
	function getDummyValues4ExplicitForm(){

		// These are test values required only for testing...
		// As long as the Ghost form is not ready, this can be used to fill the need for mandatory fields
		var dummyFormValues = {
				"FirstName" :  "GhostFirstName1",
				"LastName" : "GhostLastName1",
				"Email" :  "great@man.com",
				"Phone" :  "1232323",
				"Company" :  "GhostCompany1",
				"Title" :  "GhostTitle1",
				"Industry" :  "Other",
				"Country_Web_To_Lead2__c" :  "United States",
				"State" :  "California"
		};
		return dummyFormValues;
	}
	//Section 6 Ends : ***** setupMarketoForm is called when a Ghost or Explicit form is loaded ******




//Section 7 Starts :***** Following methods are meant for pulling default values JSON and helper method to prepare the hidden fields for Marketo ********
    
	var landingUrl = window.location.href;
	var relativePath = window.location.pathname;
	var processedRelativePath = null;
	var landingURLWithoutParameters = location.protocol + "//" + location.host + location.pathname;
	var queryMap = new Object();
	//var referrerValue = getReferrer(); //getting Http Referer value
	var seoValue = "seo";
	var marketoJsonValuePresent = false; //for getMarketoJsonMap(...) function - generating MarketoJson Map
	if(relativePath.indexOf('/en_US/')!=-1){
		relativePath = relativePath.replace("/en_US","");
	}
	if(relativePath.indexOf('&') != -1){
		var index = relativePath.indexOf('&');
		var queryString = relativePath.substring(index);
		relativePath = relativePath.replace(queryString,"");
	}
          
    
       	function getHiddenFieldsForMarketo(formId){
		var marketoHiddenFielsValues = new Object();
		customLog.debug("Preparing hidden fields for form :" + formId);
		if(!defaultValueJSON) {
			customLog.debug("Inside !defaultValueJSON.........");
			return marketoHiddenFielsValues;
		}
	customLog.debug("OUTSide !defaultValueJSON.........");
        var marketoJsonMap = getMarketoJsonMap(defaultValueJSON, formId);
		for (var mapKey in marketoJsonMap){
			customLog.debug("Key......." + mapKey +"     Value......" + marketoJsonMap[mapKey]);
			marketoHiddenFielsValues[mapKey] = marketoJsonMap[mapKey];
		}
		return marketoHiddenFielsValues;
	}


	function getJson() {
		customLog.debug("Inside function getJson()..........");
		$.ajax({
			url: jsonLocation,
			dataType: "text",
			cache: false,
			success: function(data) {

				//data downloaded so we call parseJSON function
				//and pass downloaded data
				//now json variable contains data in json format
				if(data){
						data = data.replace("<pre>","");
						data = data.replace("</pre>","");
						json = $.parseJSON(data);
						customLog.debug("Inside data.........."+json);
					}
				if(json){
					defaultValueJSON = json;
					customLog.debug("Inside JSON.........."+json);
				}
			}
		});
	}



	

	function getLocaleBasedJSON(queryMap)
	{
		var updatedQueryMap = new Object();
		var currLocale = currentLocale;
		if(currLocale=='null' || currLocale=='undefined' || currLocale=='')
		{
			currLocale = "en-US";
		}
		for (var key in queryMap) {
			if (queryMap.hasOwnProperty(key)) {
				var value = queryMap[key].replace(/{lang}/gi, localeMap[currLocale]);
				updatedQueryMap[key] = value;
			}
		}
		return updatedQueryMap;
	}

	function getURLProcessedJSON(queryMap)
	{
		var updatedQueryMap = new Object();

		for (var key in queryMap) {
			if (queryMap.hasOwnProperty(key)) {
				var value = queryMap[key].replace(/{url}/gi, landingURLWithoutParameters);
				updatedQueryMap[key] = value;
			}
		}
		return updatedQueryMap;
	}

    //Added by FW TEAM - 23-Nov-2015
	function getReferrerProcessedJSON(queryMap)
	{
		var updatedQueryMap = new Object();
        var referrer_value = referrerValue;
        if(referrer_value == undefined || referrer_value == null)
        {
             referrer_value = "";     
        }
		for (var key in queryMap) {
			if (queryMap.hasOwnProperty(key)) {
				var value = queryMap[key].replace(/{referer}/gi, referrer_value);
				updatedQueryMap[key] = value;
			}
		}

		return updatedQueryMap;
	}    

	//Custom Newly created function
	function getH1ProcessedJSON(queryMap)
	{
		var updatedQueryMap = new Object();
		if(h1_value!='null' && h1_value!='undefined' && h1_value!='' && h1_value )
		{
			h1_value = h1_value.trim();
			var h1Parsed_value=getH1parsed(h1_value);
			for (var key in queryMap) {
				if (queryMap.hasOwnProperty(key)) {
					var value = queryMap[key].replace(/{h1}/gi, h1_value);
					value = value.replace(/{h1#parsed}/gi, h1Parsed_value);
					updatedQueryMap[key] = value;
				}
			}
		}
		return updatedQueryMap;
	}

     function getH1parsed(h1title)
      {
        var inputStr = h1title;
        var res = inputStr.split(" ");

        var final="";
        var str = "";
		 for(i=0;i<res.length;i++)
		{
		if(i==0)
		{
		str=res[i];
		if(str.indexOf("-")==0)
		{
		str = str.replace("-","");
		}
		final = final+str;
		}
		else
		{
		str = res[i];
		if(str !="" && str  !="-")
		{
		if(str.indexOf("-")==0)
		{
		str = str.replace("-","");
		}
		final =final+"-"+str ;
		}
		}
		}
		return final;

	 }	//Custom Modified function
	function getUTXProcessedJSON(queryMap)
	{
		queryMap = getLocaleBasedJSON(queryMap);
		queryMap = getURLProcessedJSON(queryMap);
		queryMap = getH1ProcessedJSON(queryMap);
		queryMap = getReferrerProcessedJSON(queryMap); //Added by FW TEAM - 23-Nov-2015
		return queryMap;
	}

	function getMarketoQueryMap(queryMap, marketoFields, marketoValue){

		var spitMarketoFields = marketoFields.split(',');
		for(var i=0; i< spitMarketoFields.length; i++) {
			if(spitMarketoFields[i].trim() != ""){
				var marketoField = spitMarketoFields[i].trim();
				queryMap[decodeURI(marketoField)] = decodeURI(marketoValue);
			}
		}
		return queryMap;
	}

	function getMarketoJsonMap(defaultValueJSON, formId){

		var mappingObject = defaultValueJSON['mapping-data']['mapping'];

		if (mappingObject){

			var mappingElementsCount = Object.keys(mappingObject).length;

			if(mappingElementsCount > 0)
			{

			for (key in mappingObject) {
				if (key) {

						marketoJsonValuePresent = false;

						setQueryMapUponUrlParameters(mappingObject, key);

						setQueryMapUponReferrerValue(mappingObject, key);

						setQueryMapUponJsonUrl(mappingObject, key, formId);
						
						setQueryMapUponJsonGlobal(mappingObject, key, formId);

				}//if key

			}// for loop

			return getUTXProcessedJSON(queryMap);

			} else {
				customLog.debug("Warning! mapping object is empty");
			}

		} else {
			customLog.debug("Warning! mapping object not available");
		}
	}

	function setQueryMapUponUrlParameters(mappingObject, key)
	{
		if (urlParamMap && urlParamMap.hasOwnProperty(key))
		{
			var value = null;
			// this section will get value from browser url parameter
			value=getValueFromURLParamsMap(urlParamMap,mappingObject[key]);
			setQueryMap(mappingObject, key, value);
		}
	}

	function setQueryMapUponReferrerValue(mappingObject, key)
	{
		if(!marketoJsonValuePresent && referrerValue !== undefined && referrerValue !== null && referrerValue !== "")
		{
			var value = null;
			if(key.toLowerCase().trim() == "utm_source")
			{
				value = referrerValue;
			} 
			else if (key.toLowerCase().trim() == "utm_medium")
			{
				value = seoValue;   
			}
			
			setQueryMap(mappingObject, key, value);
		}
	}

	function setQueryMapUponJsonUrl(mappingObject, key, formId)
	{
		if(!marketoJsonValuePresent)
		{
			var value = null;
			// this section will get value if exact or partial url is present in json
			value=getValueFromJSONURL(relativePath,json,key,formId);
			setQueryMap(mappingObject, key, value);
		}
	}

	function setQueryMapUponJsonGlobal(mappingObject, key, formId)
	{
		if(!marketoJsonValuePresent)
		{
			var value = null;
			// this section will get value from global
			value=getValueFromJSONGlobal(key, json, formId);
			setQueryMap(mappingObject, key, value);
		}
	}

	function setQueryMap(mappingObject, key, value)
	{
		if(value != null)
		{
			queryMap =getMarketoQueryMap(queryMap,mappingObject[key], value);
			marketoJsonValuePresent = true;
		}
	}
	
	function getValueFromURLParamsMap(urlParamMap,mappingObjectValue)
	{
		for ( var mapKey in urlParamMap)
		{
			if (key.trim() == mapKey.trim())
			{
				if(mappingObjectValue)
				{

					return urlParamMap[mapKey];

				}
			}
		}// for loop
		return null;
	}

	function mappingkeyPresentInJSONGlobal(key,json)
	{
		var globalDataObject = json['mapping-data']['global'];
		if (globalDataObject && globalDataObject.hasOwnProperty(key))
		{
			return true;
		}
		return false;

	}

	function mappingkeyPresentinJSONURL(relativePath,key)
	{
		var mappingDataObject = json['mapping-data'];

		var lastChar=relativePath.substring(relativePath.length - 1, relativePath.length);
		if(lastChar!='/')
		relativePath=relativePath+"/";
		if (mappingDataObject.hasOwnProperty(relativePath))
		{
			if (mappingDataObject[relativePath])
			{
				var keyValJsonObject = mappingDataObject[relativePath];
				if (keyValJsonObject.hasOwnProperty(key))
				{
					return true;

				}

			}
		}
		return false;
	}

	function getValueFromJSONGlobal(key,json,formId)
	{
		var globalDataObject = json['mapping-data']['global'];



		if (globalDataObject && globalDataObject.hasOwnProperty(key))
		{

			if (globalDataObject[key])
			{
				var jsonArray = globalDataObject[key];

				if(jsonArray){
					if(formId!=null){
						value=getValueFromJsonArray(jsonArray,formId);
					}
					if(value==null)
					{
						value=getValueFromJsonArray(jsonArray,'ALL');
					}
					if(value==null){
						value="";
					}
				}
				return value;

			}
		}

		return "";

	}

	//Custom Modified function
	function getValueFromJSONURL(relativePath,json,key,formId)
	{
		var mappingDataObject = json['mapping-data'];
		var value=null;
		var loopEnd = false;
		var lastChar=relativePath.substring(relativePath.length - 1, relativePath.length);
		if(lastChar!='/')
		{
			relativePath=relativePath+"/";
		}

		processedRelativePath = relativePath.trim();

		var count = 1;
		while(!loopEnd )
		{
			if (mappingDataObject.hasOwnProperty(processedRelativePath))
			{
				if (mappingDataObject[processedRelativePath])
				{
					var keyValJsonObject = mappingDataObject[processedRelativePath];
					var keyValJsonArray=getKeyValue(key,keyValJsonObject);
					if(keyValJsonArray!=null)
					{
						if(formId!=null)
						{
							value=getValueFromJsonArray(keyValJsonArray,formId);
						}
						if(value==null)
						{
							value=getValueFromJsonArray(keyValJsonArray,'ALL');
						}
					}
				}
			}//if

			if(value!=null)
			{
				loopEnd = true;
			} else if(processedRelativePath=='/*') {
				loopEnd = true;
			}

			if(!loopEnd)
			{
				if(count == 1)
				{
					processedRelativePath = processedRelativePath + "*";
				} else {
					var endIndex = processedRelativePath.lastIndexOf("/");
					if(endIndex!=-1)
					{
						processedRelativePath = processedRelativePath.substring(0,endIndex).trim();
					}
					endIndex = processedRelativePath.lastIndexOf("/");
					if(endIndex!=-1)
					{
						processedRelativePath = processedRelativePath.substring(0,endIndex+1).trim() + "*";
					}
				}

			}//if NOT loopEnd

			count++;
		}//while

		return value;
	}

	function getValueFromJsonArray(keyValJsonArray,value)
	{


		for(var jsonObj in keyValJsonArray)
		{

			if(keyValJsonArray[jsonObj].hasOwnProperty(value))
			{

				var temp=keyValJsonArray[jsonObj];

				return temp[value];
			}


		}
		return null;

	}
	function getKeyValue(key,jsonObject)
	{


		if (jsonObject.hasOwnProperty(key))
		{
			return jsonObject[key];

		}

	}

	//Section 7 Ends :*****  methods are meant for pulling default values JSON and helper method to prepare the hidden fields for Marketo ********
