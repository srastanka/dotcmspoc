package ca.architech.dotcms.api;

import com.dotmarketing.exception.DotHibernateException;
import com.dotmarketing.portlets.structure.factories.FieldFactory;
import com.dotmarketing.portlets.structure.model.Field;
import com.dotmarketing.portlets.structure.model.Structure;

public class FieldUtil {

    public static Field createAndSaveHostFolderField(Structure structure, int seq) throws DotHibernateException {
        Field field = new Field("Host/Folder", Field.FieldType.HOST_OR_FOLDER, Field.DataType.TEXT,
                structure, true, false, false, seq, false, false, false);
        field.setVelocityVarName("hostfolder");
        field.setHint(getDefaultHostFolderJsonString());
        FieldFactory.saveField(field);

        return field;
    }

    public static Field createAndSaveUiEnhancementsField(Structure structure, int seq) throws DotHibernateException {

        Field field = structure.getFieldVar("uiEnhancer");
        if (field != null) return field;

        field = new Field("UI Enhancer", Field.FieldType.CUSTOM_FIELD, Field.DataType.LONG_TEXT,
                structure, false, false, false, seq, false, false, false);
        field.setVelocityVarName("uiEnhancer");
        field.setValues("#dotParse(\"/application/vtl/fields/ui-enhancements.vm\")\n" +
                "#makeUiEnhancementsCustomField()");
        FieldFactory.saveField(field);

        return field;
    }

    public static Field makeHostFolderFieldUsePublisherDefault(Structure structure) throws DotHibernateException {
        Field field = null;
        try {
            field = structure.getFieldVar("hostfolder");
        } catch (Exception ex) {}
        if (field == null) {
            try {
                field = structure.getFieldVar("host");
            } catch (Exception ex) {}
        }
        if (field == null) {
            try {
                field = structure.getFieldVar("host1");
            } catch (Exception ex) {}
        }
        if (field == null) {
            try {
                field = structure.getFieldVar("contentHost");
            } catch (Exception ex) {}
        }
        field.setHint(getDefaultHostFolderJsonString());
        FieldFactory.saveField(field);
        return field;
    }

    /**
     * A "related cache" field will be always hidden on the dotcms admin page, and will be automatically be updated
     * based on what is in the 'relationshipName' table.
     */
    public static void setRelatedCache(Field field, String relationshipName, String fieldLabel) {
        field.setHint("{ \"relatedCache\" :" +
                "{ \"relationshipName\" : \"" + escapeJavaScript(relationshipName) + "\"," +
                "\"fieldLabel\":\"" + escapeJavaScript(fieldLabel) + "\"" +
                "} }");
    }

    private static String escapeJavaScript(String str) {
        return str.replace("'", "\\'").replace("\"", "\\\"");
    }

    private static String getDefaultHostFolderJsonString() {
        return "{\"defaultValue\":\"loyalty.com:/resources\"}";
    }
}
