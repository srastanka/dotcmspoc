package ca.architech.dotcms.migration;

import ca.architech.dotcms.migration.annotation.MigrationOrder;
import org.junit.Test;
import org.junit.Before;

import java.util.ArrayList;

import static org.junit.Assert.*;


public class MigrationOrderTest {

    LocalMigrationService localMigrationService;

    @Before
    public void setup() {
        localMigrationService = new LocalMigrationService();
    }

    @Test
    public void migrationsShouldBeDefined() {
        assertTrue("expecting a migration to be defined", localMigrationService.getLocalMigrations().size() > 0);
    }

    @Test
    public void migrationsShouldBeASequenceOfNaturalNumbers() {
        int naturalOrder = 0;
        for (Class clazz : localMigrationService.getLocalMigrations()) {
            assertEquals("expecting Migration " + clazz.getName() + " to order to be next in sequence. ",  naturalOrder, ((MigrationOrder)clazz.getAnnotation(MigrationOrder.class)).order());
            naturalOrder ++;
        }
    }

}
