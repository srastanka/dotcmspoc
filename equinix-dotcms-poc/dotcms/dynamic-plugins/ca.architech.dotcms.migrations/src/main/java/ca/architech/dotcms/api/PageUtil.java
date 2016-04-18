package ca.architech.dotcms.api;

import com.dotmarketing.beans.Host;
import com.dotmarketing.business.APILocator;
import com.dotmarketing.business.FactoryLocator;
import com.dotmarketing.exception.DotDataException;
import com.dotmarketing.exception.DotSecurityException;
import com.dotmarketing.portlets.folders.business.FolderAPI;
import com.dotmarketing.portlets.folders.model.Folder;
import com.dotmarketing.portlets.htmlpages.factories.HTMLPageFactory;
import com.dotmarketing.portlets.htmlpages.model.HTMLPage;
import com.dotmarketing.portlets.templates.model.Template;
import com.dotmarketing.util.Logger;
import com.liferay.portal.model.User;

public class PageUtil {

    static public HTMLPage getHtmlPageByPath(String path, Host defaultHost) throws DotSecurityException, DotDataException {
        HTMLPage page = FactoryLocator.getHTMLPageFactory().getLiveHTMLPageByPath(path, defaultHost);
        if (page.getTitle() == null || page.getTitle().length() == 0) {
            throw new DotDataException("expecting to find a page with a defined title for path: " + path);
        } else {
            return page;
        }
    }

    static public Folder getOrCreateFolder(String folderName, Host defaultHost, User user)
            throws DotDataException, DotSecurityException {
        FolderAPI folderAPI = APILocator.getFolderAPI();
        Folder folder;

        if (folderAPI.exists(folderName)) {
            folder = APILocator.getFolderAPI().findFolderByPath(folderName, defaultHost, user, false);
        } else {
            folder = APILocator.getFolderAPI().createFolders(folderName, defaultHost, user, true);
            folder.setShowOnMenu(false);
            folder.setSortOrder(0);
            APILocator.getFolderAPI().save(folder, user, true);
        }
        return folder;
    }

    static public void savePageAndPublish(Folder folder, String pageTitle, String pageUrl, Template template, User user, boolean showOnMenu)
            throws DotSecurityException, DotDataException {
        HTMLPage newPage = new HTMLPage();
        newPage.setTitle(pageTitle);
        newPage.setFriendlyName(pageTitle);
        newPage.setPageUrl(pageUrl);
        newPage.setShowOnMenu(showOnMenu);
        APILocator.getHTMLPageAPI().saveHTMLPage(newPage, template, folder, user, true);
        APILocator.getVersionableAPI().setLive(newPage);
    }

    static public void renamePageUrlTitle(Class classFrom, String path, String oldPageUrl, String pageTitle, String pageUrl, Host host, User user)
            throws DotSecurityException, DotDataException {

        HTMLPage page = FactoryLocator.getHTMLPageFactory().getLiveHTMLPageByPath(path + "/" + oldPageUrl, host);
        Logger.info(classFrom, "In path: " + path + " renaming " + page.getPageUrl() + " to " + pageUrl);
        if (page != null && page.getTitle() != null && page.getTitle().length() > 0) {
            page.setTitle(pageTitle);
            page.setFriendlyName(pageTitle);
            page.setPageUrl(pageUrl + ".html");
            try {
                HTMLPageFactory.renameHTMLPage(page, pageUrl, user);
            } catch (Exception e) {
                e.printStackTrace();
                throw new DotDataException(e.getMessage());
            }
        }
    }

    static public void deletePageIfExists(String path, Host defaultHost, User user) throws DotSecurityException, DotDataException {
        // Get old contributor.html
        HTMLPage page = FactoryLocator.getHTMLPageFactory().getLiveHTMLPageByPath(path, defaultHost);
        if (page.getTitle() != null && page.getTitle().length() > 0) {

            // Archive page
            APILocator.getVersionableAPI().setDeleted(page, true);

            // Delete page from archive
            try {
                APILocator.getHTMLPageAPI().delete(page, user, false);
            } catch (Exception e) {
                throw new DotDataException(e.getMessage());
            }
        }
    }
}
