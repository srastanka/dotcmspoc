package ca.architech.dotcms.api;

import java.util.ArrayList;
import java.util.List;
import ca.architech.dotcms.api.model.CategoryVO;
import com.dotmarketing.business.APILocator;
import com.dotmarketing.db.HibernateUtil;
import com.dotmarketing.exception.DotDataException;
import com.dotmarketing.exception.DotSecurityException;
import com.dotmarketing.portlets.categories.business.CategoryAPI;
import com.dotmarketing.portlets.categories.model.Category;
import com.dotmarketing.portlets.contentlet.business.ContentletAPI;
import com.dotmarketing.portlets.contentlet.model.Contentlet;
import com.dotmarketing.util.Logger;
import com.liferay.portal.model.User;

public class CategoryUtil {

    public static int saveCategory(CategoryVO categoryVO, User user) throws DotDataException, DotSecurityException {
        HibernateUtil.startTransaction();
        int status = recursiveSaveCategory(null, categoryVO, user); // Runs categoryAPI.save
        HibernateUtil.commitTransaction();
        return status;
    }

    private static int recursiveSaveCategory(CategoryVO parentCategoryVO, CategoryVO categoryVO, User user) throws DotDataException, DotSecurityException {
        CategoryAPI categoryAPI = APILocator.getCategoryAPI();
        Category parentCategory;

        // Get parent if exists
        if (parentCategoryVO != null && doesCategoryExist(parentCategoryVO.getCategory().getKey(), user)) {
            parentCategory = getCategoryByKey(parentCategoryVO.getCategory().getKey(), user);
        } else {
            parentCategory = null;
        }

        // Get category if not exists and save with parent
        Category category = categoryVO.getCategory();
        if (doesCategoryExist(category.getKey(), user)) {
            Logger.debug(CategoryUtil.class, "Category '" + category.getCategoryName() + "' already exists.");
        } else {
            Logger.debug(CategoryUtil.class, "Saving child: " + category.getCategoryName() + " at " + category.getSortOrder());
            categoryAPI.save(parentCategory, category, user, false);
        }

        // Loop and save children categories if exist
        List<CategoryVO> childrenCategories = categoryVO.getChildren();
        if (childrenCategories != null && childrenCategories.size() > 0) {
            for (CategoryVO childCategoryVO: childrenCategories) {
                recursiveSaveCategory(categoryVO, childCategoryVO, user);
            }
        }
        return 0;
    }

    public static boolean doesCategoryExist(String categoryKeyName, User user) throws DotDataException, DotSecurityException {
        Category category = getCategoryByKey(categoryKeyName, user);
        if (category != null && category.isActive()) {
            return true;
        }
        return false;
    }

    public static Category getCategoryByKey(String key, User user) throws DotSecurityException, DotDataException {
        CategoryAPI categoryAPI = APILocator.getCategoryAPI();
        return categoryAPI.findByKey(key, user, false);
    }

    public static void fixDuplicateCategories(Class classFrom, User user, String parentKey) throws DotDataException {
        try {
            List<Category[]> duplicatePairs = getDuplicatePairs(parentKey, user);

            if (duplicatePairs.size() > 0) {
                Logger.info(classFrom, "==================== " + parentKey.toUpperCase() + " ====================");

                // Get list of duplicate categories for category name
                for (Category[] pair : duplicatePairs) {
                    migrateCategory(classFrom, user, pair[0], pair[1]);
                }
                Logger.info(classFrom, "==================== Duplicate Category Migration Complete ====================");

            } else {
                Logger.info(classFrom, "No duplicate keys in category: " + parentKey);
            }
        } catch (Exception e) {
            e.printStackTrace();
            throw new DotDataException(e.getMessage());
        }
    }

    public static void migrateCategory(Class classFrom, User user, Category gone, Category keep) throws DotSecurityException, DotDataException {

        // Find contentlets with category id to delete with contentletAPI
        ContentletAPI contentletAPI = APILocator.getContentletAPI();
        List<Contentlet> contentlets = contentletAPI.search("+categories:" + gone.getCategoryVelocityVarName(), 0, 0, "title asc", user, false);

        if (contentlets.size() > 0) {
            CategoryAPI categoryAPI = APILocator.getCategoryAPI();
            int totalCount = 0;
            int count = 0;
            int countK = 0;
            int countD = 0;

            Logger.info(classFrom, gone.getCategoryId() + " -> " + keep.getCategoryId() + " | " + gone.getCategoryVelocityVarName() + " (" + contentlets.size() + ")");

            // Get list of categories for each contentlet with categoryAPI
            for (Contentlet c : contentlets) {

                // Check each category to find a match to delete
                List<Category> cats = categoryAPI.getParents(c, user, false);
                for (Category cat : cats) {
                    String msg = " | " + c.getTitle().substring(0, Math.min(25, c.getTitle().length()))
                            + "... | " + c.getStructure().getVelocityVarName()
                            + " | lang: " + c.getLanguageId() + (!c.isLive() ? " | *Not Live*" : "");

                    // If match for delete
                    if (cat.getCategoryId().equals(gone.getCategoryId())) {
                        count++;
                        totalCount++;

                        categoryAPI.removeParent(c, gone, user, false);
                        if (!cats.contains(keep)) {
                            categoryAPI.addParent(c, keep, user, false);
                            Logger.info(classFrom, "\tSwapped" + msg);
                        } else {
                            countD++;
                            Logger.info(classFrom, "\tRemoved" + msg);
                        }

                        // Log kept matches
                    } else if (cat.getCategoryId().equals(keep.getCategoryId())) {
                        countK++;
                        totalCount++;
                        Logger.debug(classFrom, "\t\tKept" + msg);
                    }
                }
            }
            categoryAPI.delete(gone, user, false);
            Logger.info(classFrom, "\t:: Swapped: " + count + " | Kept: " + countK + " | Has Both: " + countD + " | Total: " + contentlets.size() + " matches " + totalCount);

        } else {
            Logger.info(classFrom, "No contentlets found with category key: " + gone.getCategoryVelocityVarName());
        }
    }

    private static List<Category[]> getDuplicatePairs(String parent, User user) throws DotSecurityException, DotDataException {
        CategoryAPI categoryAPI = APILocator.getCategoryAPI();
        List<Category[]> ret = new ArrayList<Category[]>();
        Category c = categoryAPI.findByKey(parent, user, false);
        for (Category cat: categoryAPI.getAllChildren(c, user, false)) {
            Category cat2 = categoryAPI.findByKey(cat.getKey(), user, false);
            if (!cat.getInode().equals(cat2.getInode())) {
                ret.add(new Category[]{cat, cat2});
            }
        }
        return ret;
    }
}
