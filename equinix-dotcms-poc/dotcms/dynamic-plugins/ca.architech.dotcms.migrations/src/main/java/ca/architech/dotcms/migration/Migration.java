package ca.architech.dotcms.migration;

import com.dotmarketing.beans.Host;
import com.dotmarketing.exception.DotDataException;
import com.dotmarketing.exception.DotSecurityException;
import com.liferay.portal.model.User;

public interface Migration {
    public String getComment();
    public int migrate(Host defaultHost, User user) throws DotDataException, DotSecurityException;

    // some constants useful for migrations
    public static final String PATTERN_URL_VALIDATION = "^((http|ftp|https):\\/\\/w{3}[\\d]*.|(http|ftp|https):\\/\\/|w{3}[\\d]*.)([\\w\\d\\._\\-#\\(\\)\\[\\]\\,;:]+@[\\w\\d\\._\\-#\\(\\)\\[\\]\\,;:])?([a-z0-9]+.)*[a-z\\-0-9]+.([a-z]{2,3})?[a-z]{2,6}(:[0-9]+)?(\\/[\\/a-zA-Z0-9\\._\\-,%\\s]+)*(\\/|\\?[a-z0-9=%&\\.\\-,#]+)?$";
}
