package ca.architech.dotcms.api;

import com.dotmarketing.beans.Host;
import com.dotmarketing.business.APILocator;
import com.dotmarketing.exception.DotDataException;
import com.dotmarketing.exception.DotSecurityException;
import com.dotmarketing.portlets.contentlet.business.ContentletAPI;
import com.dotmarketing.portlets.contentlet.model.Contentlet;
import com.dotmarketing.portlets.folders.model.Folder;
import com.liferay.portal.model.User;
import java.util.ArrayList;
import java.util.List;

public class FileAssetUtil {

    public static List<Contentlet> findFileAssetsInFolderByNames(String folderName, List<String> fileNames, Host host, User user)
            throws DotSecurityException, DotDataException {

        Folder folder = APILocator.getFolderAPI().findFolderByPath(folderName, host, user, false);
        List<Contentlet> contentlets = APILocator.getContentletAPI().findContentletsByFolder(folder, user, false);
        List<Contentlet> foundFiles = new ArrayList<Contentlet>();

        System.out.println("Finding " + fileNames.size() + " files in " + folderName + ": ");
        if (fileNames != null && fileNames.size() > 0) {
            for (Contentlet contentlet: contentlets) {
                if (fileNames.contains(contentlet.getTitle())) {
                    foundFiles.add(contentlet);
                    fileNames.remove(contentlet.getTitle());
                    System.out.println(foundFiles.size() + " - " + contentlet.getTitle());
                    if (fileNames.size() < 1) {
                        break;
                    }
                }
            }
        }
        if (fileNames.size() > 0) {
            for (String name: fileNames) {
                System.out.println("* Not found: " + name);
            }
        }
        return foundFiles;
    }
}
