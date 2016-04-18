package ca.architech.dotcms.migration;

import ca.architech.dotcms.migration.annotation.MigrationOrder;
import ca.architech.dotcms.migration.annotation.MigrationOrderComparator;

import java.io.File;
import java.lang.annotation.Annotation;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class LocalMigrationService {
    public List<Class<?>> getLocalMigrations(){
        String pkgname = MigrationService.PACKAGE_CONFIGURATION_STEPS.replaceAll("/", ".");
        List<Class<?>> classes = new ArrayList<Class<?>>();
        URL resource = ClassLoader.getSystemClassLoader().getResource(MigrationService.PACKAGE_CONFIGURATION_STEPS);

        //System.out.println("ClassDiscovery: Resource = " + resource);
        if (resource == null) {
            throw new RuntimeException("No resource for " + MigrationService.PACKAGE_CONFIGURATION_STEPS);
        }
        //System.out.println("ClassDiscovery: FullPath = " + resource);

        addClassFromResource(pkgname, classes);

        Collections.sort(classes, new MigrationOrderComparator());
        //System.out.println("found " + classes.size() + " Migration class(es)");
        return classes;
    }

    private void addClassFromResource(String pkgname, List<Class<?>> classes) {

        URL resource = ClassLoader.getSystemClassLoader().getResource(pkgname.replace(".", "/"));
        File directory = null;
        try {
            directory = new File(resource.toURI());
        } catch (URISyntaxException e) {
            throw new RuntimeException(" (" + resource + ") does not appear to be a valid URL / URI.  Strange, since we got it from the system...", e);
        } catch (IllegalArgumentException e) {
            directory = null;
        }

        if (directory != null && directory.exists()) {
            // Get the list of the files contained in the package
            String[] files = directory.list();
            for (int i = 0; i < files.length; i++) {
                // we are only interested in .class files
                if (files[i].endsWith(".class")) {
                    // removes the .class extension
                    String className = pkgname + '.' + files[i].substring(0, files[i].length() - 6);
                    try {
                        @SuppressWarnings("rawtypes")
                        Class aClass = Class.forName(className);
                        Annotation[] annotations = aClass.getAnnotations();
                        for (Annotation annotation : annotations){
                            if (annotation.annotationType() == MigrationOrder.class){
                                classes.add(aClass);
                            }
                        }

                    }
                    catch (ClassNotFoundException e) {
                        throw new RuntimeException("ClassNotFoundException loading " + className);
                    }
                }else{
                    addClassFromResource(pkgname + "." + files[i], classes);
                }
            }
        }

    }
}
