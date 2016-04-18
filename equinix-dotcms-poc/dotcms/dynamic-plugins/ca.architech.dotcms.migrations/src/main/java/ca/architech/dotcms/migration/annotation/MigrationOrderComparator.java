package ca.architech.dotcms.migration.annotation;

import java.util.Comparator;

public class MigrationOrderComparator implements Comparator<Class> {

    @SuppressWarnings("unchecked")
    @Override
    public int compare(Class step1, Class step2) {
        int step1Value = 0;
        int step2Value = 0;

        step1Value = ((MigrationOrder) step1.getAnnotation(MigrationOrder.class)).order();
        step2Value = ((MigrationOrder) step2.getAnnotation(MigrationOrder.class)).order();

        return step1Value - step2Value;
    }
}