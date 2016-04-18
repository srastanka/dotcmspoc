package ca.architech.dotcms.boot;

import com.dotcms.content.elasticsearch.business.ContentletIndexAPI;
import com.dotcms.content.elasticsearch.business.ESIndexAPI;
import com.dotmarketing.business.APILocator;
import com.dotmarketing.exception.DotDataException;
import com.dotmarketing.util.Logger;
import com.liferay.util.ExtPropertiesLoader;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;

public class IndexService {

    public static final int WAIT_INTERVAL = 10 * 1000; // 10 seconds
    public static final int WAIT_ATTEMPTS = 60; // 60 * 10 seconds = 10 minutes of waiting
    public static final int WAIT_PERIOD_MILLIS = WAIT_INTERVAL * WAIT_ATTEMPTS;
    public static final int WAIT_OPTIMIZE_COOLING_PERIOD = 120 * 1000; //2 minutes
    static final String WORKING_INDEX_PROPERTY = "index.working.name";
    static final String LIVE_INDEX_PROPERTY = "index.live.name";

    /**
     * check and wait for the working and live indices to be activated before returning
]    */
    public void waitForIndicesToActivate() throws IndicesNotAvailableException {
        ESIndexAPI esIndexAPI = APILocator.getESIndexAPI();
        ArrayList<String> indexNames = new ArrayList<String>(2);

        Logger.info(IndexService.class, "checking for index availability");

        boolean recentRestore = loadRestoreIndexNames(indexNames);
        boolean indicesReady = false;
        if (recentRestore) {
            for (int attempt = 0; attempt < WAIT_ATTEMPTS; attempt++) {
                try {
                    boolean allIndicesActive = true;
                    for (String indexName : indexNames) {
                        Logger.info(IndexService.class, "checking status of index: " + indexName);
                        if (!ESIndexAPI.Status.ACTIVE.equals(esIndexAPI.getIndexStatus(indexName))) {
                            allIndicesActive = false;
                            break;
                        }
                    }
                    if (allIndicesActive) {
                        indicesReady = true;
                        Logger.info(IndexService.class, "live and working indices are available, starting optimize cooling period");
                        /* The indices should be available now, but there is an asynchronous optimize operation that messes with results,
                           so defer starting the MigrationService for WAIT_OPTIMIZE_COOLING_PERIOD
                         */
                        Thread.sleep(WAIT_OPTIMIZE_COOLING_PERIOD);
                        Logger.info(IndexService.class, "... wait complete.");
                        break;
                    } else {
                        Logger.info(IndexService.class, "waiting for indices to be available...");
                        Thread.sleep(WAIT_INTERVAL);
                    }
                } catch (DotDataException e) {
                    Logger.warn(IndexService.class, e.getMessage());
                } catch (InterruptedException e) {
                    throw new IndicesNotAvailableException();
                }
            }
        }
        if (!indicesReady && recentRestore) {
            throw new IndicesNotAvailableException();
        }
    }

    private boolean loadRestoreIndexNames(ArrayList<String> indexNames) {
        String indexName = null;
        ExtPropertiesLoader loader = new ExtPropertiesLoader();
        loader.init("restore");
        indexName = loader.get(LIVE_INDEX_PROPERTY);
        if (indexName != null) indexNames.add(indexName);

        indexName = loader.get(WORKING_INDEX_PROPERTY);
        if (indexName != null) indexNames.add(indexName);

        if (indexNames.size() > 0) {
            Logger.info(IndexService.class,"found restore.properties");
            return isRecentRestore(indexNames.get(0));
        }
        else {
            return false;
        }
    }

    private boolean isRecentRestore(String indexName) {
        SimpleDateFormat sdf = new SimpleDateFormat("'live_'yyyyMMddHHmmss");
        try {
            Date restoreTime = sdf.parse(indexName);
            Date now = new Date();
            long modifiedMillis = Math.abs(now.getTime() - restoreTime.getTime());
            Logger.info(IndexService.class, " time elapsed since restore (in millis): " + modifiedMillis);
            if (modifiedMillis <= WAIT_PERIOD_MILLIS) {
                return true;
            }
            else {
                return false;
            }
        } catch (ParseException e) {
            Logger.error(IndexService.class, e.getMessage(), e);
        }
        return false;
    }

}
