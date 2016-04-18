package ca.architech.dotcms.api;

import com.dotmarketing.beans.Host;
import com.dotmarketing.business.APILocator;
import com.dotmarketing.exception.DotDataException;
import com.dotmarketing.exception.DotSecurityException;
import com.dotmarketing.portlets.folders.model.Folder;
import com.dotmarketing.util.InodeUtils;
import com.liferay.portal.model.User;

/**
 *
 */
public class FolderUtil {

    public static Folder findFolderByPath(String path, Host host, User user, boolean respectFrontEndPermissions) throws DotSecurityException, DotDataException {
        Folder folder = APILocator.getFolderAPI().findFolderByPath(path, host, user, respectFrontEndPermissions);

        if (folder == null || !InodeUtils.isSet(folder.getInode())) {
            return null;
        } else {
            return folder;
        }
    }
}
