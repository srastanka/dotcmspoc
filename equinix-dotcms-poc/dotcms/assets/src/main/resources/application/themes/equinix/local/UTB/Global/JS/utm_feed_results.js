
var ARTICLE = "article";
var PR = "pr";
var EVENT = "event";
var BLOG = "blog";
var FORUM = "forum";


function feedData(data, random_var)
{
	
	if(data !== undefined && random_var !== undefined )
	{

		if(isNaN(random_var))
		{
			var loaderClass = $('.utm_loader_'+random_var);
			var resultsClass = $('.utm_results_'+random_var);
			
			if(loaderClass.length && resultsClass.length )
			{
				resultsClass.each(function(index) {
					$(this).html(data);
				});
				loaderClass.each(function(index) {
					$(this).css("display","none");
				});
				resultsClass.each(function(index) {
					$(this).css("display","block");
				});
			}
		} else {
			var feedLoaderId = "utm_loader_" + random_var;
			var feedResultsId = "utm_results_" + random_var;

			if($('#'+feedLoaderId).length && $('#'+feedResultsId).length )
			{
				$('#'+feedResultsId).html(data);
				$('#'+feedLoaderId).css("display","none");
				$('#'+feedResultsId).css("display","block");
			}
		}

	}
}



function getRandomValue(feedType)
{
	var random_var; 
	if(feedType !== undefined)
	{
		if(feedType == BLOG)
		{
			random_var = blog_random_var;
		}
		else if(feedType == FORUM)
		{
			random_var = forum_random_var;
		}
		else if(feedType == ARTICLE)
		{
			random_var = article_random_var;
		}
		else if(feedType == PR)
		{
			random_var = pr_random_var;
		}
		else if(feedType == EVENT)
		{
			random_var = event_random_var;
		}
	}
	return random_var;
}

function getFeed(feedType, feedCount)
{
	
	var utm_random_var;
	
	if(getRandomValue(feedType) !== undefined)
	{
		utm_random_var = getRandomValue(feedType);
	}

	//alert("inside getFeed "+ feedType + " "+ feedCount);

       var url = "/feed/utm/";
       var params = "?feedType="+feedType+"&feedCount="+feedCount; 

	   var xmlHttp = getBrowserBasedXmlHttp();
       xmlHttp.open("GET", url + params ,true);
        
       try
	   {
	    customLog.debug("Before ajax call initiated for feedType--------->"+feedType );
		xmlHttp.send();
	   } 
	   catch(err){
        customLog.debug("feed ajax failed for feedType --->"+feedType);		
	   } 
	   
	    xmlHttp.onreadystatechange=function()
    	{
		  if (xmlHttp.readyState==4 && xmlHttp.status==200)
		  {			
		        customLog.debug("on success of feed ajax for feedType --->"+feedType);
                var responseText = xmlHttp.responseText;
                if(responseText !== undefined && responseText !== null && responseText !== "")
				{
				   //customLog.deepDebug("feed data from is  " + data);
					//document.write(data);
					if(utm_random_var !== undefined)
					{
						feedData(responseText, utm_random_var);
					}	
				}
		  }
		  
    	}
	
}


var blogFeedURL="https://blog.equinix.com/feed/";
var forumFeedURL="https://forum.equinix.com/rss/feed/all";
var prFeedURL="http://equinix.mediaroom.com/api/newsfeed_releases/list.php";

// Test Invalid XML scenarios
//var forumFeedURL="http://sv2lxwwwfwdev03.sv2.corp.equinix.com/test.xml";

var blog_mcf_random_var;
var forum_mcf_random_var;

function getMCFFeed(feedType,feedCount,feed_random_var)
{
	var count = 10;
	if(feedCount !== undefined && feedCount !== null && feedCount !== "")
	{
		count = feedCount;
	}
	
	if(feedType !== undefined && feedType !== null)
	{
		feedType = feedType.trim();
		if(feedType.toLowerCase() == "blog")
		{
			
			if(feed_random_var !== undefined && feed_random_var !== null)
			{
				blog_mcf_random_var = feed_random_var;
			}
			
			getRSSFeed(count,"mcf",BLOG);
		}
		else if(feedType.toLowerCase() == "forum")	//forum
		{
			
			if(feed_random_var !== undefined && feed_random_var !== null)
			{
				forum_mcf_random_var = feed_random_var;
			}
			
			getRSSFeed(count,"mcf",FORUM);
		}		
	}
}

function getUTMFeed(feedType, feedCount)
{
	
	var count = 10;
	if(feedCount !== undefined && feedCount !== null && feedCount !== "")
	{
		count = feedCount;
	}

	if(feedType !== undefined && feedType !== null)
	{
		feedType = feedType.trim();
		if(feedType.toLowerCase() == "blog")
		{
			if(blog_posts !== undefined && blog_posts !== "")
			{
			count = blog_posts;
			}
			getRSSFeed(count,"body",BLOG);
		} 
		else if(feedType.toLowerCase() == "forum")
		{
			if(forum_posts !== undefined && forum_posts !== "")
			{
			count = forum_posts;
			}
			getRSSFeed(count,"body",FORUM);
		}
		else if(feedType.toLowerCase() == "article")
		{
			//alert("inside article feed");
			if(article_posts !== undefined && article_posts !== "")
			{
			count = article_posts;
			}
			getFeed(ARTICLE,count);
		}
		else if(feedType.toLowerCase() == "pr")
		{
			//console.log("inside feedtype pr");
			if(pr_posts !== undefined && pr_posts !== "")
			{
			count = pr_posts;
			}
			getRSSFeed(count,"body",PR);
		}
		else if(feedType.toLowerCase() == "event")
		{
			if(event_posts !== undefined && event_posts !== "")
			{
			count = event_posts;
			}
			getFeed(EVENT,count);
		}
	}

}

function getRSSFeed(feedCount, placement, feedType)
{

    var utm_random_var;
	if(getRandomValue(feedType) !== undefined)
	{
		utm_random_var = getRandomValue(feedType);
	}
	
    var ajaxFeedUrl = getAjaxFeedUrl(feedType);
    if(ajaxFeedUrl !== undefined)
    {

       var url = "/rss-feed/";
       var params = "?feed_url="+ajaxFeedUrl+"&feed_type="+feedType+"&feed_count="+feedCount; 

	   var xmlHttp = getBrowserBasedXmlHttp();
       xmlHttp.open("GET", url + params ,true);
        
       try
	   {
	    customLog.debug("Before ajax call initiated for feedType--------->"+feedType );
		xmlHttp.send();
	   } 
	   catch(err){
        customLog.debug("feed ajax failed for feedType --->"+feedType);		
	   } 
	   
	    xmlHttp.onreadystatechange=function()
    	{
		  if (xmlHttp.readyState==4 && xmlHttp.status==200)
		  {			
		        customLog.debug("on success of feed ajax for feedType --->"+feedType);
                var responseText = xmlHttp.responseText;
                if(responseText !== undefined && responseText !== null && responseText !== "")
				{
				
				    if(placement !== undefined && placement == "mcf")
				    {
                        if(feedType == BLOG && blog_mcf_random_var !== undefined)
                        {
                            feedData(responseText, blog_mcf_random_var);
                        } else if(feedType == FORUM && forum_mcf_random_var !== undefined)
                        {
                            feedData(responseText, forum_mcf_random_var);
                        }
                        
                    } else if(placement !== undefined && placement == "body")
				    {
                        if(utm_random_var !== undefined)
                        {
                            feedData(responseText, utm_random_var);
                        }
                    } 
						
				}
		  }
		  
    	}
	
    }
}

function getAjaxFeedUrl(feedType)
{
    var ajaxFeedUrl;
    if(feedType == BLOG)
    {
        ajaxFeedUrl = blogFeedURL;
    } else if(feedType == FORUM)
    {
        ajaxFeedUrl = forumFeedURL;
    } else if(feedType == PR)
    {
        ajaxFeedUrl = prFeedURL;
    }
    return ajaxFeedUrl;
}

/****PR-PHASE-2 CODING STARTS****/

function getCurrentRelativePath()
{
    var relativePath = window.location.pathname;
    return relativePath.split(/[?&]/)[0];
}

function load_PR_Pagination()
{
    
    var url = "/fetch-pr-pagination/"; 
    var currentRelativePath = getCurrentRelativePath();
    var params;
    
    if(page !== undefined && page && prTotalCount !== undefined && prTotalCount)
    {
        params = "?page=" + page + "&prTotalCount=" + prTotalCount + "&relativePath=" + currentRelativePath;
    }

    if(params !== undefined)
    {
	   var xmlHttp = getBrowserBasedXmlHttp();
       xmlHttp.open("GET", url + params ,true);
        
       try
	   {
	    customLog.debug("Before ajax call initiated for pr-pagination********" );
		xmlHttp.send();
	   } 
	   catch(err){
        customLog.debug("feed ajax failed for pr-pagination********");		
	   } 
	   
	    xmlHttp.onreadystatechange=function()
    	{
		  if (xmlHttp.readyState==4 && xmlHttp.status==200)
		  {			
		        customLog.debug("on success of ajax for pr-pagination********");
                var responseText = xmlHttp.responseText;
                if(responseText !== undefined && responseText !== null && responseText !== "")
				{
				    var paginationElement =  $(".pr_utm .pr_utm_pagination");
				    if(paginationElement !== undefined && paginationElement.length )
				    {
                        paginationElement.html(responseText);
                        paginationElement.css("display","block");
                    }
						
				}
		  }
		  
    	}
    	
   	}//if param !== undefined
    
}
/****PR-PHASE-2 CODING ENDS****/
