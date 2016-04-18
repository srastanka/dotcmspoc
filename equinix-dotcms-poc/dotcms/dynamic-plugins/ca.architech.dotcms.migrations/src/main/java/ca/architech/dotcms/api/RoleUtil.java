package ca.architech.dotcms.api;

import com.dotmarketing.business.APILocator;
import com.dotmarketing.business.Role;
import com.dotmarketing.exception.DotDataException;

public class RoleUtil {

    static public Role getAnonymousRole() throws DotDataException {
        return APILocator.getRoleAPI().loadCMSAnonymousRole();
    }

    static public Role getRoleByRoleName(String name) throws DotDataException {
        for (Role r : APILocator.getRoleAPI().findAllAssignableRoles(true)) {
            if (r.getName().equals(name)) {
                return r;
            }
        }
        throw new DotDataException("could not find role with name: " + name);
    }
}
