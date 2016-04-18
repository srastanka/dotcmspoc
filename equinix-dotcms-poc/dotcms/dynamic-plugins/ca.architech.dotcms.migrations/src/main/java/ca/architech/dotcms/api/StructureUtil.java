package ca.architech.dotcms.api;

import com.dotmarketing.beans.Host;
import com.dotmarketing.business.CacheLocator;
import com.dotmarketing.exception.DotDataException;
import com.dotmarketing.exception.DotHibernateException;
import com.dotmarketing.portlets.structure.factories.FieldFactory;
import com.dotmarketing.portlets.structure.factories.StructureFactory;
import com.dotmarketing.portlets.structure.model.Field;
import com.dotmarketing.portlets.structure.model.Structure;
import com.dotmarketing.portlets.widget.business.WidgetAPI;
import com.dotmarketing.services.StructureServices;
import com.liferay.portal.model.User;

import java.util.List;

public class StructureUtil {

    static public boolean isStructure(String structureName) {
        Structure test = CacheLocator.getContentTypeCache().getStructureByName(structureName);
        return test != null && structureName.equals(test.getName());
    }

    static public Structure getStructureByName(String structureName) throws DotDataException {
        Structure structure = CacheLocator.getContentTypeCache().getStructureByName(structureName);
        if (structure != null) {
            return structure;
        }
        throw new DotDataException("could not find structure with name: " + structureName);
    }

    public static Structure createWidgetStructureAndFields(Host defaultHost, User user,
                                                           String structureName, String structureVelocityName, String structureDescription,
                                                           String widgetCode)
            throws DotHibernateException
    {
        Structure structure = createWidgetStructure(defaultHost, user, structureName, structureVelocityName, structureDescription);
        addWidgetStructureFields(structure, widgetCode);
        return structure;
    }

    private static Structure createWidgetStructure(Host defaultHost, User user,
                                                   String structureName, String structureVelocityName,
                                                   String structureDescription)
            throws DotHibernateException
    {
        Structure structure = new Structure();
        structure.setHost(defaultHost.getIdentifier());
        structure.setName(structureName);
        structure.setStructureType(Structure.STRUCTURE_TYPE_WIDGET);
        structure.setOwner(user.getUserId());
        structure.setVelocityVarName(structureVelocityName);
        structure.setDescription(structureDescription);

        StructureFactory.saveStructure(structure);

        return structure;
    }

    private static void addWidgetStructureFields(Structure structure, String widgetCode) throws DotHibernateException {
        int i = 1;

        // Default Widget Structure Fields
        Field field = new Field(WidgetAPI.WIDGET_TITLE_FIELD_NAME, Field.FieldType.TEXT, Field.DataType.TEXT, structure,
                true, true, true, i++, true, false, true);
        field.setVelocityVarName("widgetTitle");
        field.setValues("Widget Title");
        FieldFactory.saveField(field);

        // Default Widget Structure Fields
        field = new Field(WidgetAPI.WIDGET_USAGE_FIELD_NAME, Field.FieldType.CONSTANT, Field.DataType.LONG_TEXT, structure,
                false, false, false, i++, true, false, false);
        field.setVelocityVarName("widgetUsage");
        FieldFactory.saveField(field);

        // Default Widget Structure Fields
        field = new Field(WidgetAPI.WIDGET_PRE_EXECUTE_FIELD_NAME, Field.FieldType.CONSTANT, Field.DataType.LONG_TEXT, structure,
                false, false, false, i++, true, false, false);
        field.setVelocityVarName("widgetPreexecute");
        FieldFactory.saveField(field);

        // Default Widget Structure Fields
        field = new Field(WidgetAPI.WIDGET_CODE_FIELD_NAME, Field.FieldType.CONSTANT, Field.DataType.LONG_TEXT, structure,
                false, false, false, i++, true, false, false);
        field.setVelocityVarName("widgetCode");
        field.setValues("Widget Code");
        field.setValues(WidgetUtil.WIDGET_CODE_TEMPLATE.replace("{widgetVTL}", widgetCode));
        FieldFactory.saveField(field);

    }

    public static void reorderFields(Structure structure, String[] fieldNames) throws DotHibernateException {
        List<Field> fields = structure.getFieldsBySortOrder();
        int seqOther = fieldNames.length + 1; //If you miss a fieldName, place it at the end
        for (Field field: fields) {
            int thisSeq = -1;
            for (int i=0; i<fieldNames.length; i++) {
                if (fieldNames[i].equalsIgnoreCase(field.getVelocityVarName())) {
                    thisSeq = i + 1;
                    break;
                }
            }
            field.setSortOrder(thisSeq == -1 ? seqOther++ : thisSeq);
            FieldFactory.saveField(field);
        }
    }

    // REQUIRES RE-INDEXING AFTER
    public static void renameStructure(String oldVelocityVarName, String newName, String newVelocityVarName, String newDescription) {
        Structure structure = StructureFactory.getStructureByVelocityVarName(oldVelocityVarName);
        if (structure != null && structure.getVelocityVarName() != null && structure.getVelocityVarName().equals(oldVelocityVarName)) {
            structure.setName(newName);
            structure.setVelocityVarName(newVelocityVarName);
            structure.setDescription(newDescription);
            // Refreshes cache, REQUIRES RE-INDEXING
            CacheLocator.getContentTypeCache().remove(structure);
            CacheLocator.getContentTypeCache().add(structure);
            StructureServices.removeStructureFile(structure);
        }
    }
}
