package ca.architech.dotcms.migration.template;

public class RSSTemplateBody implements TemplateBody {

    public static String TEMPLATE_NAME = "RSS";
    final String body;

    public RSSTemplateBody(String vtl) {
        body = "#dotParse(\"" + vtl + "\")";
    }

    @Override
    public String getBody() {
        return body;
    }

    @Override
    public String getDrawedBody() { return null; }

    @Override
    public int getContainerCount() {
        return 0;
    }
}
