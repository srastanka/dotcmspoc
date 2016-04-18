package ca.architech.dotcms.api;

import com.dotmarketing.business.APILocator;
import com.dotmarketing.exception.DotDataException;
import com.dotmarketing.exception.DotSecurityException;
import com.dotmarketing.portlets.languagesmanager.business.LanguageAPI;
import com.dotmarketing.portlets.languagesmanager.model.Language;
import com.dotmarketing.portlets.languagesmanager.model.LanguageKey;
import com.dotmarketing.util.Logger;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

/**
 * Created by Jeremy on 27/06/2014.
 */
public class LanguageUtil {

    public static final String ENGLISH = "English";
    public static final String FRENCH = "French";
    public static final String[] languages = {ENGLISH, FRENCH};

    public static void migrateLanguageVariables(Map<String, String> configuredKeys, String languageName, Class calledFrom)
        throws DotDataException, DotSecurityException {
        migrateLanguageVariables(configuredKeys, languageName, calledFrom, false);
    }

    public static void migrateLanguageVariables(Map<String, String> configuredKeys, String languageName, Class calledFrom, boolean overwriteExisting)
            throws DotDataException, DotSecurityException {

        Language language = getLanguageByName(languageName, calledFrom);
        if (language != null) {

            // Get existing keys
            Map<String, String> existingKeys = new HashMap<String, String>();
            if (!overwriteExisting) {
                for (LanguageKey key : getLanguageApi().getLanguageKeys(language)) {
                    Logger.debug(calledFrom, "Read language variable " + key.getKey() + " : " + key.getValue());
                    existingKeys.put(key.getKey(), key.getValue());
                }
            }

            // Add only new keys
            Map<String, String> newKeys = new HashMap <String, String>();
            for (String newKey : configuredKeys.keySet()) {
                if (!existingKeys.containsKey(newKey)) {
                    Logger.debug(calledFrom, "New key " + newKey);
                    newKeys.put(newKey, configuredKeys.get(newKey));
                } else {
                    Logger.debug(calledFrom, "Not replacing old key " + newKey);
                }
            }

            // Save keys
            if (configuredKeys.size() > 0) {
                getLanguageApi().saveLanguageKeys(language, newKeys, new HashMap<String, String>(), new HashSet<String>());
            }
        }
    }

    public static void renameLanguageVariables(Map<String, String> configuredKeys, String languageName, Class calledFrom)
            throws DotDataException, DotSecurityException {

        Language language = getLanguageByName(languageName, calledFrom);
        if (language != null) {

            // Get existing keys
            Map<String, String> existingKeys = new HashMap <String, String>();
            for (LanguageKey key : getLanguageApi().getLanguageKeys(language)) {
                Logger.debug(calledFrom, "Read language variable " + key.getKey() + " : " + key.getValue());
                existingKeys.put(key.getKey(), key.getValue());
            }

            // Add new keys with existing values
            Map<String, String> newKeys = new HashMap <String, String>();
            Set<String> deleteKeys = configuredKeys.keySet();
            for (String oldKey : deleteKeys) {
                if (existingKeys.containsKey(oldKey)) {
                    String newKey = configuredKeys.get(oldKey);
                    String oldValue = existingKeys.get(oldKey);
                    newKeys.put(newKey, oldValue);
                    Logger.debug(calledFrom, "New key " + newKey + " with old value " + oldValue);
                }
            }

            // Save Keys
            if (newKeys.size() > 0) {
                getLanguageApi().saveLanguageKeys(language, newKeys, new HashMap<String, String>(), deleteKeys);
            }
        }
    }

    public static void overwriteLanguageVariableValues(Map<String, String> configuredKeys, String languageName, Class calledFrom)
            throws DotDataException, DotSecurityException {

        Language language = getLanguageByName(languageName, calledFrom);
        if (language != null) {

            // Update keys
            getLanguageApi().saveLanguageKeys(language, configuredKeys, new HashMap<String, String>(), new HashSet<String>());
        }
    }

    public static void deleteLanguageVariables(Set<String> configuredKeys, String languageName, Class calledFrom)
            throws DotDataException, DotSecurityException {

        Language language = getLanguageByName(languageName, calledFrom);
        if (language != null) {
            getLanguageApi().saveLanguageKeys(language, new HashMap<String, String>(), new HashMap<String, String>(), configuredKeys);
        }
    }

    private static LanguageAPI getLanguageApi() {
        return APILocator.getLanguageAPI();
    }

    public static Language getLanguageByName(String language, Class calledFrom) {
        for (Language l : getLanguageApi().getLanguages()) {
            Logger.debug(calledFrom, "Language value " + l.getLanguage());
            if (l.getLanguage().equals(language)) {
                return l;
            }
        }
        return null;
    }
}
