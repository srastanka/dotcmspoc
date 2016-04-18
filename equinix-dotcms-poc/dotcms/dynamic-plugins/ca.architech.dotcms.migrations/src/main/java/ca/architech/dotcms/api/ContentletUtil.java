package ca.architech.dotcms.api;

import com.dotmarketing.business.APILocator;
import com.dotmarketing.cache.FieldsCache;
import com.dotmarketing.exception.DotDataException;
import com.dotmarketing.exception.DotSecurityException;
import com.dotmarketing.portlets.contentlet.business.ContentletAPI;
import com.dotmarketing.portlets.contentlet.model.Contentlet;
import com.dotmarketing.portlets.languagesmanager.model.Language;
import com.dotmarketing.portlets.structure.factories.StructureFactory;
import com.dotmarketing.portlets.structure.model.Field;
import com.dotmarketing.portlets.structure.model.Relationship;
import com.dotmarketing.portlets.structure.model.Structure;
import com.dotmarketing.quartz.job.ResetPermissionsJob;
import com.dotmarketing.util.Logger;
import com.liferay.portal.model.User;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ContentletUtil {

    public static final String FILLER_TEXT = "<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium dolorem ducimus enim error, nesciunt optio provident qui sequi ut voluptatum.</p>";

    public static void setFieldValue(Contentlet contentlet, String fieldName, Object value) {
        //Get all the fields for the structure
        Field fieldToUpdate = null;
        List<Field> fields = FieldsCache.getFieldsByStructureInode(contentlet.getStructureInode());
        for (Field field : fields) {
            if (field.getVelocityVarName().equals(fieldName)) {
                fieldToUpdate = field;
                break;
            }
        }

        if (fieldToUpdate != null) {
            APILocator.getContentletAPI().setContentletProperty(contentlet, fieldToUpdate, value);
        }
        else {
            throw new RuntimeException("setFieldValue could not locate field " + fieldName + " in contentlet of structure " + contentlet.getStructure().getName() );
        }
    }

    public static void saveAndPublishContentlet(User user, Contentlet contentlet) throws DotSecurityException, DotDataException {
        contentlet = APILocator.getContentletAPI().checkin(contentlet, user, false);
        APILocator.getContentletAPI().isInodeIndexed(contentlet.getInode());
        APILocator.getContentletAPI().publish(contentlet,user, false);
        APILocator.getContentletAPI().unlock(contentlet,user, false);
        ResetPermissionsJob.triggerJobImmediately(contentlet.getStructure()); // Cascade child permissions
    }

    public static void saveAndPublishContentlet(User user, Contentlet contentlet, HashMap<Relationship, List<Contentlet>> relationships)
            throws DotSecurityException, DotDataException {
        contentlet = APILocator.getContentletAPI().checkin(contentlet, relationships, user, true);
        APILocator.getContentletAPI().isInodeIndexed(contentlet.getInode());
        APILocator.getContentletAPI().publish(contentlet,user, false);
        APILocator.getContentletAPI().unlock(contentlet,user, false);
        ResetPermissionsJob.triggerJobImmediately(contentlet.getStructure()); // Cascade child permissions
    }

    public static void updateContentletFields(Contentlet contentlet, Map<String, String> newValues, User user, Class classFrom)
            throws DotSecurityException, DotDataException {

        if (newValues != null && newValues.size() > 0) {
            contentlet = APILocator.getContentletAPI().checkout(contentlet.getInode(), user, false);
            for (String key: newValues.keySet()) {
                Logger.info(classFrom, "Update: '" + contentlet.getTitle() + "' field: '" + key + "' to: '" + newValues.get(key) + "'");
                ContentletUtil.setFieldValue(contentlet, key, newValues.get(key));
            }
            ContentletUtil.saveAndPublishContentlet(user, contentlet);
        }
    }

    static public void deleteContentlets(List<Contentlet> contentlets, User user)
            throws DotSecurityException, DotDataException {
        if (contentlets != null) {
            System.out.println("Deleting number of items: " + contentlets.size());
            ContentletAPI contentletAPI = APILocator.getContentletAPI();
            contentletAPI.unpublish(contentlets, user, false);
            contentletAPI.archive(contentlets, user, false);
            contentletAPI.delete(contentlets, user, false);
        }
    }

    public static void deleteContentlet(Contentlet contentlet, User user) throws DotSecurityException, DotDataException {
        if (contentlet != null) {
            System.out.println("Deleting " + contentlet.getStructure().getName() + ": " + contentlet.getTitle());
            ContentletAPI contentletAPI = APILocator.getContentletAPI();
            contentletAPI.unpublish(contentlet, user, false);
            contentletAPI.archive(contentlet, user, false);
            contentletAPI.delete(contentlet, user, false);
        }
    }

    public static Contentlet findContentletByTitle(User user, Structure structure, String language, String contentletTitle) throws DotSecurityException, DotDataException {
        Language languageObj = LanguageUtil.getLanguageByName(language, ContentletUtil.class);
        long languageId = languageObj.getId();

        List<Contentlet> contentlets = APILocator.getContentletAPI().findByStructure(structure, user, false, 0, 0);
        for (Contentlet contentlet: contentlets) {
            if (contentlet.getTitle().equals(contentletTitle) && contentlet.getLanguageId() == languageId) {
                return contentlet;
            }
        }
        return null;
    }

}
