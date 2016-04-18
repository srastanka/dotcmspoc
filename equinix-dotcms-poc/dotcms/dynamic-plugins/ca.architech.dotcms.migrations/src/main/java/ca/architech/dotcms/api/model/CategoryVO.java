package ca.architech.dotcms.api.model;

import com.dotmarketing.portlets.categories.model.Category;
import java.util.ArrayList;
import java.util.List;

public class CategoryVO {

    private Category category = new Category();
    private List<CategoryVO> children = new ArrayList<>();

    public CategoryVO(String velocityPrefix, String name, int order, List<CategoryVO> children) {
        category.setCategoryName(name);
        category.setKey(convertNameToCategoryKey(velocityPrefix, name));
        category.setCategoryVelocityVarName(convertNameToVelocityVar(velocityPrefix, name));
        category.setSortOrder(order);
        category.setKeywords(null);
        if (children != null) {
            this.children = children;
        }
    }

    public CategoryVO(String velocityPrefix, String name, int order) {
        this(velocityPrefix, name, order, null);
    }

    public CategoryVO addChildByName(String name) {
        CategoryVO category = new CategoryVO(this.category.getKey(), name, this.children.size());
        this.children.add(category);
        return category;
    }

    private static String convertNameToCategoryKey(String prefix, String name) {
        StringBuilder convertedKey = new StringBuilder();

        // Remove all non-word characters from name
        name = name.replaceAll("[^\\w|]", "");

        // Add prefix
        if (prefix != null && prefix.length() > 0) {
            convertedKey.append(prefix + ".");
        }

        // Camel-case name
        convertedKey.append(name.substring(0, 1).toLowerCase())
                    .append(name.substring(1));

        return convertedKey.toString();
    }

    private static String convertNameToVelocityVar(String prefix, String name) {
        StringBuilder convertedKey = new StringBuilder();

        // Remove all non-word characters from name
        name = name.replaceAll("[^\\w|]", "");

        // Add prefix and camel-case separated words
        if (prefix != null && prefix.length() > 0) {
            for (String str : prefix.split("\\.")) {
                if (convertedKey.length() == 0) {
                    convertedKey.append(str);
                } else {
                    convertedKey.append(str.substring(0, 1).toUpperCase())
                                .append(str.substring(1));
                }
            }

            convertedKey.append(name.substring(0, 1).toUpperCase())
                        .append(name.substring(1));
        } else {
            convertedKey.append(name.substring(0, 1).toLowerCase())
                        .append(name.substring(1));
        }
        return convertedKey.toString();
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public List<CategoryVO> getChildren() {
        return children;
    }

    public void setChildren(List<CategoryVO> children) {
        this.children = children;
    }
}
