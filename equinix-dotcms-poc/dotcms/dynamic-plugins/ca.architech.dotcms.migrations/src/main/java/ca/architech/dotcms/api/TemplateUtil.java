package ca.architech.dotcms.api;

import ca.architech.dotcms.migration.template.TemplateBody;
import ca.architech.dotcms.api.ContainerUtil;
import com.dotmarketing.beans.Host;
import com.dotmarketing.business.APILocator;
import com.dotmarketing.exception.DotDataException;
import com.dotmarketing.exception.DotSecurityException;
import com.dotmarketing.portlets.containers.model.Container;
import com.dotmarketing.portlets.folders.model.Folder;
import com.dotmarketing.portlets.templates.model.Template;
import com.dotmarketing.util.Logger;
import com.liferay.portal.model.User;
import java.util.List;

public class TemplateUtil {
    public static Template getTemplateByName(Host defaultHost, String templateName) throws DotDataException {
        List<Template> templates = APILocator.getTemplateAPI().findTemplatesAssignedTo(defaultHost);
        Logger.debug(TemplateUtil.class, "found: " + templates.size() + " templates.");
        for (Template t : templates) {
            Logger.debug(TemplateUtil.class, "friendly name: " + t.getTitle());
            if (t.getTitle().equals(templateName)) {
                return t;
            }
        }

        throw new DotDataException("couldn't find template named: " + templateName);
    }

    public static Template createNewTemplateWithBody(User user, Host host, TemplateBody templateBody,
                  String title, Folder themeFolder) throws DotDataException, DotSecurityException {

        Template newTemplate = new Template();
        newTemplate.setDrawed(true);
        newTemplate.setTitle(title);
        newTemplate.setTheme(themeFolder.getInode());
        String theBody = templateBody.getBody();
        String drawedBody = templateBody.getDrawedBody();

        // fill in inode values for conventionally named containers: Container 1, Container 2, etc
        for (int i = 1; i<=templateBody.getContainerCount(); i++) {
            Container container = ContainerUtil.getContainerByFriendlyName(user, "Default " + i);
            theBody = theBody.replace("{container-"+i+"}", container.getIdentifier());
            drawedBody = drawedBody.replace("{container-"+i+"}", container.getIdentifier());
        }
        newTemplate.setBody(theBody);
        newTemplate.setDrawedBody(drawedBody);
        newTemplate.setCountContainers(templateBody.getContainerCount());
        newTemplate.setCountAddContainer(templateBody.getContainerCount());
        newTemplate.setType("template");

        // create the body with all the main HTML tags

//        String themeHostId = APILocator.getFolderAPI().find(newTemplate.getTheme(), user, false).getHostId();
//        String themePath = null;

//        if(themeHostId.equals(host.getInode())) {
//            themePath = com.dotmarketing.portlets.templates.model.Template.THEMES_PATH + newTemplate.getThemeName() + "/";
//        } else {
//            Host themeHost = APILocator.getHostAPI().find(themeHostId, user, false);
//            themePath = "//" + themeHost.getHostname() + com.dotmarketing.portlets.templates.model.Template.THEMES_PATH + newTemplate.getThemeName() + "/";
//        }
//
//        StringBuffer endBody = DesignTemplateUtil.getBody(newTemplate.getBody(), newTemplate.getHeadCode(), themePath, true, true);

        // set the drawedBody for future edit


        return newTemplate;
    }

    public static Template createNewTemplateWithBodyByTitle(User user, Host host, TemplateBody templateBody,
                                    String title, Folder themeFolder) throws DotDataException, DotSecurityException {

        Template newTemplate = new Template();
        newTemplate.setDrawed(true);
        newTemplate.setTitle(title);
        newTemplate.setTheme(themeFolder.getInode());
        String theBody = templateBody.getBody();
        String drawedBody = templateBody.getDrawedBody();

        // fill in inode values for conventionally named containers: Container 1, Container 2, etc
        for (int i = 1; i<=templateBody.getContainerCount(); i++) {
            Container container = ContainerUtil.getContainerByTitle(user, "Default " + i);
            theBody = theBody.replace("{container-"+i+"}", container.getIdentifier());
            drawedBody = drawedBody.replace("{container-"+i+"}", container.getIdentifier());
        }
        newTemplate.setBody(theBody);
        newTemplate.setDrawedBody(drawedBody);
        newTemplate.setCountContainers(templateBody.getContainerCount());
        newTemplate.setCountAddContainer(templateBody.getContainerCount());
        newTemplate.setType("template");

        return newTemplate;
    }

    public static Template publishNewAdvancedTemplate(String title, TemplateBody templateBody, Host host, User user, Class classFrom)
            throws DotDataException, DotSecurityException {

        Logger.debug(classFrom, "Finding template: " + title);
        Template newTemplate = null;
        try {
            newTemplate = getTemplateByName(host, title);
        } catch (DotDataException e) {
            Logger.error(classFrom, e.getMessage());
        }

        if (newTemplate == null || newTemplate.getTitle() != null) {
            Logger.info(classFrom, "Creating template: " + title);
            newTemplate = new Template();
            newTemplate.setType("template");
            newTemplate.setTitle(title);
            newTemplate.setBody(templateBody.getBody());

            // Advance
            newTemplate.setDrawed(false);
            newTemplate.setCountContainers(0);
            newTemplate.setCountAddContainer(0);
            newTemplate.setTheme(null);
            newTemplate.setDrawedBody(null);

            APILocator.getTemplateAPI().saveTemplate(newTemplate, host, user, true);
            APILocator.getVersionableAPI().setLive(newTemplate);
        }

        Logger.debug(classFrom, "Return template: " + newTemplate.getTitle());
        return newTemplate;
    }
}
