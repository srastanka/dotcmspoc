/*
 * MyFonts Webfont Build ID 789528, 2011-04-19T18:18:28-0400
 *
 * The fonts listed in this notice are subject to the End User License
 * Agreement(s) entered into by the website owner. All other parties are
 * explicitly restricted from using the Licensed Webfonts(s).
 *
 * You may obtain a valid license at the URLs below.
 *
 * Webfont: Proxima Nova Regular
 * URL: http://new.myfonts.com/fonts/marksimonson/proxima-nova/regular/
 * Foundry: Mark Simonson
 * Copyright: Copyright (c) Mark Simonson, 2005. All rights reserved.
 * License: http://www.myfonts.com/viewlicense?1056
 * Licensed pageviews: 200,000/month
 * CSS font-family: ProximaNova-Regular
 * CSS font-weight: normal
 *
 * Webfont: Proxima Nova Semibold
 * URL: http://new.myfonts.com/fonts/marksimonson/proxima-nova/semibold/
 * Foundry: Mark Simonson
 * Copyright: Copyright (c) Mark Simonson, 2005. All rights reserved.
 * License: http://www.myfonts.com/viewlicense?1056
 * Licensed pageviews: 200,000/month
 * CSS font-family: ProximaNova-Semibold
 * CSS font-weight: normal
 *
 * Webfont: Proxima Nova Light
 * URL: http://new.myfonts.com/fonts/marksimonson/proxima-nova/light/
 * Foundry: Mark Simonson
 * Copyright: Copyright (c) Mark Simonson, 2005. All rights reserved.
 * License: http://www.myfonts.com/viewlicense?1056
 * Licensed pageviews: 200,000/month
 * CSS font-family: ProximaNova-Light
 * CSS font-weight: normal
 *
 * Webfont: Proxima Nova Bold
 * URL: http://new.myfonts.com/fonts/marksimonson/proxima-nova/bold/
 * Foundry: Mark Simonson
 * Copyright: Copyright (c) Mark Simonson, 2005. All rights reserved.
 * License: http://www.myfonts.com/viewlicense?1056
 * Licensed pageviews: 200,000/month
 * CSS font-family: ProximaNova-Bold
 * CSS font-weight: normal
 *
 * (c) 2011 Bitstream, Inc
 * @license
 * MyFonts Webfont Build ID 2797496, 2014-04-18T17:41:32-0400
 *
 * The fonts listed in this notice are subject to the End User License
 * Agreement(s) entered into by the website owner. All other parties are
 * explicitly restricted from using the Licensed Webfonts(s).
 *
 * You may obtain a valid license at the URLs below.
 *
 * Webfont: Proxima Nova S Extrabold by Mark Simonson
 * URL: http://www.myfonts.com/fonts/marksimonson/proxima-nova/s-extrabld/
 *
 * Webfont: Proxima Nova A Extrabold by Mark Simonson
 * URL: http://www.myfonts.com/fonts/marksimonson/proxima-nova/a-extrabld/
 *
 * Webfont: Proxima Nova Extrabold by Mark Simonson
 * URL: http://www.myfonts.com/fonts/marksimonson/proxima-nova/extrabld/
 *
 *
 * License: http://www.myfonts.com/viewlicense?type=web&buildid=2797496
 * Licensed pageviews: 1,000,000
 * Webfonts copyright: Copyright (c) Mark Simonson, 2005. All rights reserved.
 *
 * � 2014 MyFonts Inc
*/



// safari 3.1: data-css
// firefox 3.6+: woff
// firefox 3.5+: data-css
// chrome 4+: data-css
// chrome 6+: woff
// IE 5+: eot
// IE 9: woff
// opera 10.1+: data-css
// mobile safari: svg/data-css
// android: data-css

var browserName, browserVersion, webfontType,  webfontTypeOverride;

 customPath = '${dotTheme.path}local/UTB/Global/CSS';

if (typeof(customPath) == 'undefined')
    var customPath = false;


if (typeof(woffEnabled) == 'undefined')
    var woffEnabled = true;


if (/myfonts_test=on/.test(window.location.search))
    var myfonts_webfont_test = true;

else if (typeof(myfonts_webfont_test) == 'undefined')
    var myfonts_webfont_test = false;


if (customPath)
    var path = customPath;

else {
    var scripts = document.getElementsByTagName("SCRIPT");
    var script = scripts[scripts.length-1].src;

    if (!script.match("://") && script.charAt(0) != '/')
        script = "./"+script;

    var path = script.replace(/\\/g,'/').replace(/\/[^\/]*\/?$/, '');
}


if (myfonts_webfont_test)
    document.write('<script type="text/javascript" src="' +path+ '/MyFontsWebfontsOrderM2873526_test.js"></script>');


if (/webfont=(woff|ttf|eot)/.test(window.location.search))
{
    webfontTypeOverride = RegExp.$1;

    if (webfontTypeOverride == 'ttf')
        webfontTypeOverride = 'data-css';
}


if (/MSIE (\d+\.\d+)/.test(navigator.userAgent))
{
    browserName = 'MSIE';
    browserVersion = new Number(RegExp.$1);
    if (browserVersion >= 9.0 && woffEnabled)
        webfontType = 'woff';
    else if (browserVersion >= 5.0)
        webfontType = 'eot';
}
else if (/Firefox[\/\s](\d+\.\d+)/.test(navigator.userAgent))
{
    browserName = 'Firefox';
    browserVersion = new Number(RegExp.$1);
    if (browserVersion >= 3.6 && woffEnabled)
        webfontType = 'woff';
    else if (browserVersion >= 3.5)
        webfontType = 'data-css';
}
else if (/Chrome\/(\d+\.\d+)/.test(navigator.userAgent)) // must check before safari
{
    browserName = 'Chrome';
    browserVersion = new Number(RegExp.$1);

    if (browserVersion >= 6.0 && woffEnabled)
        webfontType = 'woff';

    else if (browserVersion >= 4.0)
        webfontType = 'data-css';
}
else if (/Mozilla.*(iPhone|iPad).* OS (\d+)_(\d+).* AppleWebKit.*Safari/.test(navigator.userAgent))
{
        browserName = 'MobileSafari';
        browserVersion = new Number(RegExp.$2) + (new Number(RegExp.$3) / 10)

    if(browserVersion >= 4.2)
        webfontType = 'data-css';

    else
        webfontType = 'svg';
}
else if (/Mozilla.*(iPhone|iPad|BlackBerry).*AppleWebKit.*Safari/.test(navigator.userAgent))
{
    browserName = 'MobileSafari';
    webfontType = 'svg';
}
else if (/Safari\/(\d+\.\d+)/.test(navigator.userAgent))
{
    browserName = 'Safari';
    if (/Version\/(\d+\.\d+)/.test(navigator.userAgent))
    {
        browserVersion = new Number(RegExp.$1);
        if (browserVersion >= 3.1)
            webfontType = 'data-css';
    }
}
else if (/Opera\/(\d+\.\d+)/.test(navigator.userAgent))
{
    browserName = 'Opera';
    if (/Version\/(\d+\.\d+)/.test(navigator.userAgent))
    {
        browserVersion = new Number(RegExp.$1);

        if (browserVersion >= 11.1 && woffEnabled)
            webfontType = 'woff';
        else if (browserVersion >= 10.1)
            webfontType = 'data-css';
    }
}


if (webfontTypeOverride)
    webfontType = webfontTypeOverride;

switch (webfontType)
{
        case 'eot':
        document.write("<style>\n");
                document.write("@font-face {font-family:\"ProximaNova-Regular\";src:url(\"" + path + "/fonts/eot/style_148510.eot\");}\n");
                document.write("@font-face {font-family:\"ProximaNova-Semibold\";src:url(\"" + path + "/fonts/eot/style_148547.eot\");}\n");
                document.write("@font-face {font-family:\"ProximaNova-Light\";src:url(\"" + path + "/fonts/eot/style_148550.eot\");}\n");
                document.write("@font-face {font-family:\"ProximaNova-Bold\";src:url(\"" + path + "/fonts/eot/style_148514.eot\");}\n");
                document.write("@font-face {font-family:\"ProximaNova-Black\";src:url(\"" + path + "/fonts/eot/proximanova-black-webfont.eot\");}\n");
                document.write("@font-face {font-family:\"ProximaNovaS-Extrabld\";src:url(\"" + path + "/fonts/eot/2AAFB8_0_0.eot\");}\n");
                document.write("@font-face {font-family:\"ProximaNovaA-Extrabld\";src:url(\"" + path + "/fonts/eot/2AAFB8_1_0.eot\");}\n");
                document.write("@font-face {font-family:\"ProximaNova-Extrabld\";src:url(\"" + path + "/fonts/eot/2AAFB8_2_0.eot\");}\n");
                document.write("</style>");
        break;

        case 'woff':
        document.write("<style>\n");
                document.write("@font-face {font-family:\"ProximaNova-Regular\";src:url(\"" + path + "/fonts/woff/style_148510.woff\") format(\"woff\");}\n");
                document.write("@font-face {font-family:\"ProximaNova-Semibold\";src:url(\"" + path + "/fonts/woff/style_148547.woff\") format(\"woff\");}\n");
                document.write("@font-face {font-family:\"ProximaNova-Light\";src:url(\"" + path + "/fonts/woff/style_148550.woff\") format(\"woff\");}\n");
                document.write("@font-face {font-family:\"ProximaNova-Bold\";src:url(\"" + path + "/fonts/woff/style_148514.woff\") format(\"woff\");}\n");
                document.write("@font-face {font-family:\"ProximaNova-Black\";src:url(\"" + path + "/fonts/woff/proximanova-black-webfont.woff\") format(\"woff\");}\n");
                document.write("@font-face {font-family:\"ProximaNovaS-Extrabld\";src:url(\"" + path + "/fonts/woff/2AAFB8_0_0.woff\") format(\"woff\");}\n");
                document.write("@font-face {font-family:\"ProximaNovaA-Extrabld\";src:url(\"" + path + "/fonts/woff/2AAFB8_1_0.woff\") format(\"woff\");}\n");
                document.write("@font-face {font-family:\"ProximaNova-Extrabld\";src:url(\"" + path + "/fonts/woff/2AAFB8_2_0.woff\") format(\"woff\");}\n");
                document.write("</style>");
        break;

        case 'data-css':
        document.write("<link rel='stylesheet' type='text/css' href='" + path + "/fonts/datacss/MyFontsWebfontsOrderM2873526.css'>");
        break;

        case 'svg':
        document.write("<style>\n");
                document.write("@font-face {font-family:\"ProximaNova-Regular\";src:url(\"" + path + "/fonts/svg/style_148510.svg#ProximaNova-Regular\") format(\"svg\");}\n");
                document.write("@font-face {font-family:\"ProximaNova-Semibold\";src:url(\"" + path + "/fonts/svg/style_148547.svg#ProximaNova-Semibold\") format(\"svg\");}\n");
                document.write("@font-face {font-family:\"ProximaNova-Light\";src:url(\"" + path + "/fonts/svg/style_148550.svg#ProximaNova-Light\") format(\"svg\");}\n");
                document.write("@font-face {font-family:\"ProximaNova-Bold\";src:url(\"" + path + "/fonts/svg/style_148514.svg#ProximaNova-Bold\") format(\"svg\");}\n");
                document.write("@font-face {font-family:\"ProximaNova-Black\";src:url(\"" + path + "/fonts/svg/proximanova-black-webfont.svg#ProximaNova-Bold\") format(\"svg\");}\n");
                document.write("</style>");
        break;

    default:
        break;
}
