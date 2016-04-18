package ca.architech.dotcms.api;

import com.dotmarketing.exception.DotDataException;
import com.dotmarketing.exception.DotHibernateException;
import com.dotmarketing.exception.DotSecurityException;
import com.dotmarketing.portlets.structure.factories.RelationshipFactory;
import com.dotmarketing.portlets.structure.factories.StructureFactory;
import com.dotmarketing.portlets.structure.model.Relationship;
import com.dotmarketing.portlets.structure.model.Structure;
import com.dotmarketing.util.Logger;
import com.dotmarketing.util.UtilMethods;

public class RelationshipUtil {

    public static final int CARDINALITY_ONE_TO_MANY = 0;
    public static final int CARDINALITY_MANY_TO_MANY = 1;

    public static boolean isRelationship(String relationshipType) {
        boolean relationshipExists = false;

        Relationship relationship = RelationshipFactory.getRelationshipByRelationTypeValue(relationshipType);
        // TODO Move Relationship content also // RelationshipFactory.

        if (relationship != null && relationship.getChildRelationName() != null && relationship.getParentRelationName() != null){
            System.out.println("Found relationship (" + relationshipType + "): " + relationship.getParentStructure().getName() + "|" + relationship.getChildStructure().getName());
            relationshipExists = true;
        } else {
            System.out.println("Relationship not found : " + relationshipType);
        }

        return relationshipExists;
    }

    public static int createRelationship(String parentStructureName, boolean parentRequired,
                                         String childStructureName, boolean childRequired,
                                         int cardinality, String relationshipName)
            throws DotDataException, DotSecurityException {

        Structure parentStructure = StructureFactory.getStructureByVelocityVarName(parentStructureName);
        Structure childStructure = StructureFactory.getStructureByVelocityVarName(childStructureName);

        String theRelationshipName = parentStructure.getVelocityVarName() + "-" + childStructure.getVelocityVarName();
        if (relationshipName != null && relationshipName.length() > 0) {
            theRelationshipName = relationshipName;
        }

        if (RelationshipUtil.isRelationship(theRelationshipName)) {
            return Constants.STATUS_RELATIONSHIP_ALREADY_EXISTS;
        }

        Relationship relationship = new Relationship();

        return saveRelationship(relationship, theRelationshipName,
                parentStructure, parentRequired,
                childStructure, childRequired, cardinality);
    }

    public static int createRelationship(String parentStructureName, boolean parentRequired,
            String childStructureName, boolean childRequired,
            int cardinality)
            throws DotDataException, DotSecurityException {

        return  createRelationship(parentStructureName, parentRequired, childStructureName, childRequired, cardinality, null);
    }

    public static int renameRelationship(Class classFrom,
                                         String oldParentStructureName, String oldChildStructureName,
                                         String newParentStructureName, String newChildStructureName)
            throws DotDataException, DotSecurityException {

        String oldRelationshipName = oldParentStructureName + "-" + oldChildStructureName;
        String newRelationshipName = newParentStructureName + "-" + newChildStructureName;
        Structure newParentStructure = StructureFactory.getStructureByVelocityVarName(newParentStructureName);
        Structure newChildStructure = StructureFactory.getStructureByVelocityVarName(newChildStructureName);
        Logger.info(classFrom, "Renaming relationship " + oldRelationshipName + " to " + newRelationshipName);

        Relationship relationship = RelationshipFactory.getRelationshipByRelationTypeValue(oldRelationshipName);
        if (!UtilMethods.isSet(relationship)) {
            return Constants.STATUS_RELATIONSHIP_DOESNT_EXIST;
        }

        return saveRelationship(relationship, newRelationshipName,
                newParentStructure, relationship.isParentRequired(),
                newChildStructure, relationship.isChildRequired(),
                relationship.getCardinality());
    }

    private static int saveRelationship(Relationship relationship, String relationshipName,
                                 Structure parentStructure, boolean parentRequired,
                                 Structure childStructure, boolean childRequired,
                                 int cardinality) throws DotHibernateException {

        // Set Parent Info
        relationship.setParentStructureInode(parentStructure.getInode());
        relationship.setParentRelationName(parentStructure.getName());
        relationship.setParentRequired(parentRequired);
        // Set Child Info
        relationship.setChildStructureInode(childStructure.getInode());
        relationship.setChildRelationName(childStructure.getName());
        relationship.setChildRequired(childRequired);
        // Set general info
        relationship.setRelationTypeValue(relationshipName);
        relationship.setCardinality(cardinality);

        // Save it
        RelationshipFactory.saveRelationship(relationship);

        return Constants.STATUS_CREATED_OK;
    }
}
