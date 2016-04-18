package ca.architech.dotcms.migration;

import ca.architech.dotcms.api.ContentletUtil;
//import ca.architech.dotcms.exploration.StateWriter;
import ca.architech.dotcms.migration.annotation.MigrationOrder;
import ca.architech.dotcms.migration.annotation.MigrationOrderComparator;
import ca.architech.dotcms.migration.bootstrap.BootMigration;

import com.dotcms.repackage.edu.emory.mathcs.backport.java.util.Collections;
import com.dotcms.repackage.org.osgi.framework.Bundle;
import com.dotcms.repackage.org.osgi.framework.BundleContext;
import com.dotmarketing.beans.Host;
import com.dotmarketing.business.APILocator;
import com.dotmarketing.cache.FieldsCache;
import com.dotmarketing.db.HibernateUtil;
import com.dotmarketing.exception.DotDataException;
import com.dotmarketing.exception.DotHibernateException;
import com.dotmarketing.exception.DotSecurityException;
import com.dotmarketing.osgi.HostActivator;
import com.dotmarketing.portlets.contentlet.business.HostAPI;
import com.dotmarketing.portlets.contentlet.model.Contentlet;
import com.dotmarketing.portlets.structure.factories.StructureFactory;
import com.dotmarketing.portlets.structure.model.Structure;
import com.dotmarketing.util.Logger;
import com.liferay.portal.model.User;

//import org.mozilla.javascript.edu.emory.mathcs.backport.java.util.Collections;



import java.lang.annotation.Annotation;
import java.net.URL;
import java.util.ArrayList;
import java.util.Date;
import java.util.Enumeration;
import java.util.List;

public class MigrationService {

    private static User user;
    private static Host defaultHost;

    private final static String BUNDLE_SERVICE_NAME = "ca.architech.dotcms.migrations";
    protected final static String PACKAGE_CONFIGURATION_STEPS = "ca/architech/dotcms/migration/step";

    public int applyMigrations() throws DotDataException, DotSecurityException {
        HostAPI hostAPI = APILocator.getHostAPI();
        FieldsCache.clearCache();

        user = APILocator.getUserAPI().getSystemUser();
        defaultHost = hostAPI.findDefaultHost( user, false );

        // find out which initialization step we currently are on
        // get all configuration-step classes through reflection

        Logger.info(MigrationService.class, "Start MigrationService...");

        bootstrap(defaultHost, user);

        List<Class<?>> classes = getBundleMigrations(getLastestMigration(user));

        Logger.debug(MigrationService.class, "processing " + classes.size() + " Migrations ");

        for (Class<?> aClass : classes) {
            try {
                Migration migration = (Migration) aClass.newInstance();

                if (!isMigrationApplied(migration.getClass().getAnnotation(MigrationOrder.class).order(), user)) {
                    if (migration.getComment() == null || migration.getComment().length() == 0) {
                        throw new DotDataException("Migration " + migration.getClass().getName() + " did not provide a comment (which is required)");
                    }
                    Logger.debug(MigrationService.class, "> " + migration.getClass().getName());
                    try {
                        HibernateUtil.startTransaction();
                        migration.migrate(defaultHost, user);
                        Logger.info(MigrationService.class, "Begin Migration: " + migration.getClass().getSimpleName() + " - " + migration.getComment());
                        recordMigration(defaultHost, user, migration);
                        Logger.debug(MigrationService.class, "About to commit: " + migration.getClass().getSimpleName());
                        HibernateUtil.commitTransaction();
                        Logger.info(MigrationService.class, "Committed Migration: " + migration.getClass().getName());
                    } catch (DotDataException e) {
                        Logger.error(MigrationService.class, "Rollback transaction for: " + migration.getClass().getName() + " - " + e.getMessage());
                        HibernateUtil.rollbackTransaction();
                        throw e;
                    } catch (DotSecurityException e) {
                        Logger.error(MigrationService.class, "Rollback transaction for: " + migration.getClass().getName() + " - " + e.getMessage());
                        HibernateUtil.rollbackTransaction();
                        throw e;
                    }
                }
            } catch (InstantiationException e) {
                Logger.error(MigrationService.class, e.getMessage());
                throw new RuntimeException(e);
            } catch (IllegalAccessException e) {
                Logger.error(MigrationService.class, e.getMessage());
                throw new RuntimeException(e);
            } catch (DotDataException e) {
                Logger.error(MigrationService.class, e.getMessage());
                throw e;
            } catch (DotSecurityException e) {
                Logger.error(MigrationService.class, e.getMessage());
                throw e;
            }
        }
        Logger.info(MigrationService.class, "Finished MigrationService");

        //use this to debug system state
        //new StateWriter(defaultHost, user);

        return 0;
    }

    /**
     * Creates a structure to keep track of which migrations have been applied
     */
    private void bootstrap(Host defaultHost, User user) {
        Migration boot = new BootMigration();

        try {
            boot.migrate(defaultHost, user);
        } catch (Exception e) {
            Logger.info(MigrationService.class, "boot exception:  " + e.getMessage());
            throw new RuntimeException("couldn't boot " + e.getClass().getName() + " " + e.getMessage());
        }
    }

    private long getLastestMigration(User user) throws DotDataException, DotSecurityException {
        List<Contentlet> contentlets = APILocator.getContentletAPI().search("structureName:Migration", 1, 0, "Migration.id desc", user, true);
        if (contentlets.size() > 0)
            return contentlets.get(0).getLongProperty("id");
        else {
            return -1; //no migrations have ever been applied, we use a zero based numbering scheme
        }
    }

    private boolean isMigrationApplied(int migrationOrder, User user) throws DotDataException, DotSecurityException {
        List<Contentlet> contentlets = APILocator.getContentletAPI().search("structureName:Migration +Migration.id:" + migrationOrder, 1, 0, "Migration.id desc", user, true);
        return contentlets.size() > 0;
    }

    private void recordMigration(Host defaultHost, User user, Migration migration) throws DotDataException, DotSecurityException {

        //validate migration
        if ( (migration.getComment() == null) || migration.getComment().isEmpty() ) {
            throw new RuntimeException("migration " + migration.getClass().getName() + " has no comment defined");
        }


        Structure migrationStructure = StructureFactory.getStructureByVelocityVarName(BootMigration.VELOCITY_NAME);
        Contentlet contentlet = new Contentlet();
        contentlet.setStructureInode( migrationStructure.getInode() );
        contentlet.setHost(defaultHost.getIdentifier());
        ContentletUtil.setFieldValue(contentlet, "id", migration.getClass().getAnnotation(MigrationOrder.class).order());
        ContentletUtil.setFieldValue(contentlet, "className", migration.getClass().getName());
        ContentletUtil.setFieldValue(contentlet, "dateApplied", new Date());
        ContentletUtil.setFieldValue(contentlet, "comment", migration.getComment());

        //Save the contentlet
        contentlet = APILocator.getContentletAPI().checkin(contentlet, user, true);
        APILocator.getContentletAPI().isInodeIndexed(contentlet.getInode());
        APILocator.getContentletAPI().publish(contentlet,user, true);
    }

    public List<Class<?>> getBundleMigrations(long lastAppliedMigration) {
        Bundle serviceBundle = null;

        List<Class<?>> classes = new ArrayList<Class<?>>();
        BundleContext context = HostActivator.instance().getBundleContext();
        Bundle[] bundles = context.getBundles();
        for (Bundle bundle : bundles) {
            Logger.debug(MigrationService.class, "inspecting bundle: " + bundle.getSymbolicName());
            if (bundle.getSymbolicName().equalsIgnoreCase(BUNDLE_SERVICE_NAME)) {
                serviceBundle = bundle;
                break;
            }
        }

        if (serviceBundle != null) {
            Logger.debug(MigrationService.class, "looking for classes in bundle: " + serviceBundle.getSymbolicName());
            Enumeration<URL> urls = serviceBundle.findEntries(PACKAGE_CONFIGURATION_STEPS, "*", true);
            if (urls != null){
                while (urls.hasMoreElements()) {
                    URL url = urls.nextElement();
                    if (url.toString().endsWith(".class")){
                        try {
                            Class<?> aClass = serviceBundle.loadClass(url.getPath().replaceAll("/", ".").substring(1).replace(".class", ""));
                            Annotation[] annotations = aClass.getAnnotations();
                            for (Annotation annotation : annotations){
                                if ((annotation.annotationType() == MigrationOrder.class) && ((MigrationOrder)annotation).order() > lastAppliedMigration) {
                                    Logger.debug(MigrationService.class, " Adding class " + aClass.getName() + " to migrations");
                                    classes.add(aClass);
                                }
                            }

                        } catch (ClassNotFoundException e) {
                            e.printStackTrace();
                        }

                    }
                }
            }

        }

        Collections.sort(classes, new MigrationOrderComparator());
        return classes;
    }
}
