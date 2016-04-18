package ca.architech.dotcms.api;

import com.dotmarketing.beans.Host;
import com.dotmarketing.business.APILocator;
import com.dotmarketing.exception.DotDataException;
import com.dotmarketing.exception.DotSecurityException;
import com.dotmarketing.portlets.contentlet.model.Contentlet;
import com.dotmarketing.portlets.structure.factories.StructureFactory;
import com.dotmarketing.portlets.structure.model.Structure;
import com.dotmarketing.util.Logger;
import com.dotmarketing.util.UtilMethods;
import com.liferay.portal.model.User;
import java.util.List;

public class WidgetUtil {

    public static String WIDGET_CODE_TEMPLATE = "#dotParse('/application/vtl/widgets/{widgetVTL}')";
    public static String THEME_WIDGET_CODE_TEMPLATE = "#dotParse('/application/themes/{theme}/vtl/widgets/{widgetVTL}')";
    public static String WIDGET_STRUCTURE_VELOCITY_NAME = "SimpleWidget";
    public static String WIDGET_FIELD_TITLE = "widgetTitle";
    public static String WIDGET_FIELD_CODE = "code";

    public static Contentlet createSimpleWidget(Host host, String widgetName, String widgetVTL) {
        return createSimpleWidget(host, widgetName, widgetVTL, null);
    }

    public static Contentlet createSimpleWidget(Host host, String widgetName, String widgetVTL, String optionalTheme) {
        String vtlDestination = getWidgetVtlDestination(widgetVTL, optionalTheme);

        Structure widgetStructure = StructureFactory.getStructureByVelocityVarName(WIDGET_STRUCTURE_VELOCITY_NAME);
        Contentlet contentlet = new Contentlet();
        contentlet.setStructureInode(widgetStructure.getInode());
        contentlet.setHost(host.getIdentifier());
        ContentletUtil.setFieldValue(contentlet, WIDGET_FIELD_TITLE, widgetName);
        ContentletUtil.setFieldValue(contentlet, WIDGET_FIELD_CODE, vtlDestination);

        return contentlet;
    }

    /**
     * Finds and checks out {@link com.dotmarketing.portlets.contentlet.business.ContentletAPI#checkout(String, User, boolean)}
     * a widget and updates it's {@link WidgetUtil#WIDGET_FIELD_CODE} velocity template.
     *
     * The returned {@link Contentlet} which represents the Simple Widget must be checked in for the changes to take effect.
     * @param host
     * @param user
     * @param widgetName
     * @param widgetVTL
     * @param theme
     * @return
     * @throws DotDataException
     * @throws DotSecurityException
     */
    public static Contentlet updateSimpleWidgetVTLPathAndTheme(Host host, User user, String widgetName, String widgetVTL, String theme)
            throws DotDataException, DotSecurityException {
        String vtlDestination = getWidgetVtlDestination(widgetVTL, theme);


        //find contentlet
        Contentlet foundContentlet = findSimpleWidgetByTitle(user, widgetName);
        Contentlet contentlet = APILocator.getContentletAPI().checkout(foundContentlet.getInode(), user, false);

        ContentletUtil.setFieldValue(contentlet, WIDGET_FIELD_CODE, vtlDestination);

        return contentlet;

    }

    public static Contentlet renameSimpleWidget(Class classFrom, String oldWidgetTitle, String widgetTitle, String widgetVTL, User user, String optionalTheme)
            throws DotSecurityException, DotDataException {

        String vtlDestination = getWidgetVtlDestination(widgetVTL, optionalTheme);

        Contentlet contentlet = findSimpleWidgetByTitle(user, oldWidgetTitle);
        if (UtilMethods.isSet(contentlet)) {
            Logger.info(classFrom, "Renaming Simple Widget: " + contentlet.getTitle() + " to " + widgetTitle);
            contentlet = APILocator.getContentletAPI().checkout(contentlet.getInode(), user, false);
            ContentletUtil.setFieldValue(contentlet, WIDGET_FIELD_TITLE, widgetTitle);
            ContentletUtil.setFieldValue(contentlet, WIDGET_FIELD_CODE, vtlDestination);
            return contentlet;
        }
        return null;
    }

    private static String getWidgetVtlDestination(String widgetVTL, String optionalTheme) {
        String vtlDestination = optionalTheme != null ?
                THEME_WIDGET_CODE_TEMPLATE.replace("{theme}", optionalTheme) :
                WIDGET_CODE_TEMPLATE;
        vtlDestination = vtlDestination.replace("{widgetVTL}", widgetVTL);
        return vtlDestination;
    }

    public static Contentlet findSimpleWidgetByTitle(User user, String contentletTitle) throws DotSecurityException, DotDataException {
        Structure widgetStructure = StructureFactory.getStructureByVelocityVarName(WIDGET_STRUCTURE_VELOCITY_NAME);

        List<Contentlet> contentlets = APILocator.getContentletAPI().findByStructure(widgetStructure, user, false, 0, 0);
        for (Contentlet contentlet: contentlets) {
            if (contentlet.getTitle().equals(contentletTitle)) {
                return contentlet;
            }
        }
        return null;
    }

    public static boolean isSimpleWidget(User user, String contentletTitle) throws DotSecurityException, DotDataException {
        return null != findSimpleWidgetByTitle(user, contentletTitle);
    }
}
