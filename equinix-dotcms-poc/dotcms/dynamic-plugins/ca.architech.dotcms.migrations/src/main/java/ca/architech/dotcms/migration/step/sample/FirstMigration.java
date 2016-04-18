package ca.architech.dotcms.migration.step.sample;

import ca.architech.dotcms.migration.Migration;
import ca.architech.dotcms.migration.annotation.MigrationOrder;
import com.dotmarketing.beans.Host;
import com.dotmarketing.exception.DotDataException;
import com.dotmarketing.exception.DotSecurityException;
import com.dotmarketing.util.Logger;
import com.liferay.portal.model.User;

@MigrationOrder(order = 0)
public class FirstMigration implements Migration {

    @Override
    public int migrate(Host defaultHost, User user) throws DotDataException, DotSecurityException {
        Logger.debug(FirstMigration.class, "Applying first migration.");
        return 0;
    }

    @Override
    public String getComment() {
        return "Demonstrates how a migration is constructed";
    }
}