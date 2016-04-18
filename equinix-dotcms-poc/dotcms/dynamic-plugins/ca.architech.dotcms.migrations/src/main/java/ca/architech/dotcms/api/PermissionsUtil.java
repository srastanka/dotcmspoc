package ca.architech.dotcms.api;

import ca.architech.dotcms.api.model.Structure;
import com.dotmarketing.beans.Permission;
import com.dotmarketing.business.APILocator;
import com.dotmarketing.business.PermissionAPI;
import com.dotmarketing.business.Permissionable;
import com.dotmarketing.business.Role;
import com.dotmarketing.exception.DotDataException;
import com.dotmarketing.exception.DotSecurityException;
import com.dotmarketing.portlets.categories.business.CategoryAPI;
import com.dotmarketing.quartz.job.ResetPermissionsJob;
import com.dotmarketing.util.Logger;
import com.liferay.portal.model.User;
import java.util.ArrayList;
import java.util.List;
import com.dotmarketing.portlets.categories.model.Category;

public class PermissionsUtil {

    final static String CONTRIBUTOR_ROLE_KEY = "Contributor";
    final static String PUBLISHER_ROLE_KEY = "Publisher / Legal";

    public static int resetPublisherPermissionsToStructure(final Permissionable structure, User user)
            throws DotDataException, DotSecurityException {

        final Role anonymousRole = RoleUtil.getAnonymousRole();
        final Role contributorRole = RoleUtil.getRoleByRoleName(CONTRIBUTOR_ROLE_KEY);
        final Role publisherRole = RoleUtil.getRoleByRoleName(PUBLISHER_ROLE_KEY);

        // Add Anonymous Role
        APILocator.getPermissionAPI().assignPermissions(new ArrayList<Permission>() {{
            add(new Permission(structure.getPermissionId(), anonymousRole.getId(), PermissionAPI.PERMISSION_READ));
        }}, structure, user, false);

        // Add Contributor Role
        APILocator.getPermissionAPI().assignPermissions(new ArrayList<Permission>() {{
            add(new Permission(structure.getPermissionId(), contributorRole.getId(), PermissionAPI.PERMISSION_READ));
            add(new Permission(structure.getPermissionId(), contributorRole.getId(), PermissionAPI.PERMISSION_EDIT));
        }}, structure, user, false);

        // Add Publisher Role
        APILocator.getPermissionAPI().assignPermissions(new ArrayList<Permission>() {{
            add(new Permission(structure.getPermissionId(), publisherRole.getId(), PermissionAPI.PERMISSION_READ));
            add(new Permission(structure.getPermissionId(), publisherRole.getId(), PermissionAPI.PERMISSION_EDIT));
            add(new Permission(structure.getPermissionId(), publisherRole.getId(), PermissionAPI.PERMISSION_PUBLISH));
        }}, structure, user, false);

        ResetPermissionsJob.triggerJobImmediately(structure); //cascade child permissions.

        return 0;
    }

    public static int resetPublisherPermissionsToCategory(final Category category, User user)
            throws DotDataException, DotSecurityException {

        final Role anonymousRole = RoleUtil.getAnonymousRole();
        final Role contributorRole = RoleUtil.getRoleByRoleName(CONTRIBUTOR_ROLE_KEY);
        final Role publisherRole = RoleUtil.getRoleByRoleName(PUBLISHER_ROLE_KEY);

        // Add Anonymous Role
        APILocator.getPermissionAPI().assignPermissions(new ArrayList<Permission>() {{
            add(new Permission(category.getPermissionId(), anonymousRole.getId(), PermissionAPI.PERMISSION_READ));
        }}, category, user, false);

        // Add Contributor Role
        APILocator.getPermissionAPI().assignPermissions(new ArrayList<Permission>() {{
            add(new Permission(category.getPermissionId(), contributorRole.getId(), PermissionAPI.PERMISSION_READ));
        }}, category, user, false);

        // Add Publisher Role
        APILocator.getPermissionAPI().assignPermissions(new ArrayList<Permission>() {{
            add(new Permission(category.getPermissionId(), publisherRole.getId(), PermissionAPI.PERMISSION_READ));
        }}, category, user, false);

        ResetPermissionsJob.triggerJobImmediately(category); //cascade child permissions.

        Logger.info(PermissionsUtil.class, category.getCategoryName());
        CategoryAPI categoryAPI = APILocator.getCategoryAPI();
        List<Category> subCats = categoryAPI.getAllChildren(category, user, false);
        for (Category cat : subCats) {
            resetPublisherPermissionsToCategory(cat, user);
        }

        return 0;
    }

    public static int resetAllStructurePermissions(User user) throws DotDataException, DotSecurityException {
        for (Structure s : Structure.values()) {
            resetPublisherPermissionsToStructure(StructureUtil.getStructureByName(s.structureName()), user);
        }
        
        //set read permission on simple widget to publisher and contributor
        final com.dotmarketing.portlets.structure.model.Structure
                simpleWidget = StructureUtil.getStructureByName("Simple Widget");

        final Role anonymousRole = RoleUtil.getAnonymousRole();
        final Role contributorRole = RoleUtil.getRoleByRoleName(CONTRIBUTOR_ROLE_KEY);
        final Role publisherRole = RoleUtil.getRoleByRoleName(PUBLISHER_ROLE_KEY);

        // Add Anonymous Role
        APILocator.getPermissionAPI().assignPermissions(new ArrayList<Permission>() {{
            add(new Permission(simpleWidget.getPermissionId(), anonymousRole.getId(), PermissionAPI.PERMISSION_READ));
        }}, simpleWidget, user, false);

        // Add Contributor Role
        APILocator.getPermissionAPI().assignPermissions(new ArrayList<Permission>() {{
            add(new Permission(simpleWidget.getPermissionId(), contributorRole.getId(), PermissionAPI.PERMISSION_READ));
        }}, simpleWidget, user, false);

        // Add Publisher Role
        APILocator.getPermissionAPI().assignPermissions(new ArrayList<Permission>() {{
            add(new Permission(simpleWidget.getPermissionId(), publisherRole.getId(), PermissionAPI.PERMISSION_READ));
        }}, simpleWidget, user, false);

        ResetPermissionsJob.triggerJobImmediately(simpleWidget); //cascade child permissions.

        return 0;
    }
}
