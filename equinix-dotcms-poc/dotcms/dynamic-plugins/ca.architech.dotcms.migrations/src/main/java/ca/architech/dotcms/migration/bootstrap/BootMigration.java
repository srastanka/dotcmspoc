package ca.architech.dotcms.migration.bootstrap;

import ca.architech.dotcms.api.StructureUtil;
import ca.architech.dotcms.migration.Migration;
import com.dotmarketing.beans.Host;
import com.dotmarketing.exception.DotDataException;
import com.dotmarketing.exception.DotSecurityException;
import com.dotmarketing.portlets.structure.factories.FieldFactory;
import com.dotmarketing.portlets.structure.factories.StructureFactory;
import com.dotmarketing.portlets.structure.model.Field;
import com.dotmarketing.portlets.structure.model.Structure;
import com.dotmarketing.util.Logger;
import com.liferay.portal.model.User;

public class BootMigration implements Migration {

    public static String STRUCTURE_NAME = "Migration";
    public static String VELOCITY_NAME = "Migration";
    public final String DESCRIPTION = "Records which migrations have been applied to dotCMS";

    @Override
    public String getComment() {
        return "Create structure to record all other migrations.";
    }

    @Override
    public int migrate(Host defaultHost, User user) throws DotDataException, DotSecurityException {

        if (false == StructureUtil.isStructure(VELOCITY_NAME)) {

            Logger.info(this.getClass(), "bootstrapping migration structure");

            /*
              boolean required, boolean listed, boolean indexed, int sortOrder, boolean fixed, boolean readOnly, boolean searchable
             */

            Structure migration = new Structure();
            migration.setHost(defaultHost.getIdentifier());
            migration.setName(STRUCTURE_NAME);
            migration.setStructureType(Structure.STRUCTURE_TYPE_CONTENT);
            migration.setOwner(user.getUserId());
            migration.setVelocityVarName(VELOCITY_NAME);
            migration.setDescription(DESCRIPTION);
            StructureFactory.saveStructure(migration);

            Field field = new Field("id", Field.FieldType.TEXT, Field.DataType.INTEGER, migration, true, true, true, 1, true, true, true);
            field.setVelocityVarName("id");
            FieldFactory.saveField(field);

            field = new Field("className", Field.FieldType.TEXT, Field.DataType.TEXT, migration, true, true, true, 3, true, true, true);
            field.setVelocityVarName("className");
            FieldFactory.saveField(field);

            field = new Field("dateApplied", Field.FieldType.DATE_TIME, Field.DataType.DATE, migration, true, true, true, 4, true, true, true);
            field.setVelocityVarName("dateApplied");
            FieldFactory.saveField(field);

            field = new Field("comment", Field.FieldType.TEXT, Field.DataType.LONG_TEXT, migration, true, true, true, 5, true, true, true);
            field.setVelocityVarName("comment");
            FieldFactory.saveField(field);

        }
        else {
            Logger.info(this.getClass(), "already bootstrapped.");
        }
        return 0;
    }

}
