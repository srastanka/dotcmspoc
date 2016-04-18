package ca.architech.dotcms.migration.template;

public class OneContainerTemplateBody implements TemplateBody {

    public static String TEMPLATE_NAME = "One Column One Container";

    String body;
    String drawedBody;

    public OneContainerTemplateBody(String siteName, String themeName) {
        setBody(siteName, themeName);
    }

    private void setBody(String siteName, String themeName) {
        body =  "<html>\n" +
                " <head>\n" +
                "  #dotParse('//" + siteName + "/application/themes/" + themeName + "/html_head.vtl')\n" +
                "  <link rel=\"stylesheet\" type=\"text/css\" href=\"/html/css/template/reset-fonts-grids.css\" />\n" +
                " </head>\n" +
                " <body>\n" +
                "  <div id=\"resp-template\" name=\"globalContainer\">\n" +
                "   <div id=\"hd-template\">\n" +
                "    #dotParse('//" + siteName + "/application/themes/" + themeName + "/header.vtl')\n" +
                "   </div>\n" +
                "   <div id=\"bd-template\">\n" +
                "    <div id=\"yui-main-template\">\n" +
                "     <div class=\"yui-b-template\" id=\"splitBody0\">\n" +
                "      #parseContainer('{container-1}')\n" +
                "     </div>\n" +
                "    </div>\n" +
                "   </div>\n" +
                "   <div id=\"ft-template\">\n" +
                "    #dotParse('//" + siteName + "/application/themes/" + themeName + "/footer.vtl')\n" +
                "   </div>\n" +
                "  </div>\n" +
                " </body>\n" +
                "</html>";

        drawedBody = "<div id=\"resp-template\" name=\"globalContainer\">" +
                "<div id=\"hd-template\"><h1>Header</h1></div>" +
                "<div id=\"bd-template\"><div id=\"yui-main-template\">" +
                "<div class=\"yui-b-template\" id=\"splitBody0\"><div class=\"addContainerSpan\"><a href=\"javascript: showAddContainerDialog('splitBody0');\" title=\"Add Container\"><span class=\"plusBlueIcon\"></span>Add Container</a></div><span class=\"titleContainerSpan\" id=\"splitBody0_span_{container-1}\" title=\"container_{container-1}\"><div class=\"removeDiv\"><a href=\"javascript: removeDrawedContainer('splitBody0','{container-1}');\" title=\"Remove Container\"><span class=\"minusIcon\"></span>Remove Container</a></div><div class=\"clear\"></div><h2>Container: Container 1</h2><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p></span><div style=\"display: none;\" title=\"container_{container-1}\" id=\"splitBody0_div_{container-1}\">#parseContainer('{container-1}')\n</div></div>" +
                "</div></div>" +
                "<div id=\"ft-template\"><h1>Footer</h1></div>" +
                "</div>";
    }

    @Override
    public String getBody() {
        return body;
    }

    @Override
    public String getDrawedBody() { return drawedBody; }

    @Override
    public int getContainerCount() {
        return 1;
    }

}
