package ca.architech.dotcms.migration.template;

public class EmptyTemplateBody implements TemplateBody {

    public static String TEMPLATE_NAME = "Empty";
    final String body;

    public EmptyTemplateBody(String vtl) {
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
