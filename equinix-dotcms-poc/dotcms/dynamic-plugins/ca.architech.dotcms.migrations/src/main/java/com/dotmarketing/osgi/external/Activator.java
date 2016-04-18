package com.dotmarketing.osgi.external;

import ca.architech.dotcms.boot.IndexService;
import ca.architech.dotcms.boot.IndicesNotAvailableException;

import com.dotcms.repackage.org.osgi.framework.BundleContext;
import com.dotmarketing.osgi.GenericBundleActivator;

import ca.architech.dotcms.migration.*;

import java.util.Hashtable;

public class Activator extends GenericBundleActivator {

    @SuppressWarnings ("unchecked")
    public void start ( BundleContext context ) throws Exception {

        Hashtable<String, String> props = new Hashtable<String, String>();
        props.put( "Language", "English" );

        System.out.println("Migrations plugin starting...");

        boolean runMigrations = true;

        IndexService indexService = new IndexService();
        try {
            indexService.waitForIndicesToActivate();
        } catch (IndicesNotAvailableException e) {
            System.out.println("live or working index not available, skipping Migrations");
            runMigrations = false;
        }

        if (runMigrations) {
            MigrationService service = new MigrationService();
            System.out.println(service.applyMigrations());
        }

    }

    public void stop ( BundleContext context ) throws Exception {
    }

}