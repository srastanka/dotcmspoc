package ca.architech.dotcms.exploration;

import ca.architech.dotcms.api.TemplateUtil;
import com.dotmarketing.beans.Host;
import com.dotmarketing.business.APILocator;
import com.dotmarketing.exception.DotDataException;
import com.dotmarketing.exception.DotSecurityException;
import com.dotmarketing.portlets.containers.model.Container;
import com.dotmarketing.portlets.templates.model.Template;
import com.dotmarketing.util.Logger;
import com.liferay.portal.model.User;

import java.util.List;

public class StateWriter {

    public StateWriter(Host defaultHost, User user) throws DotDataException, DotSecurityException {
        go(defaultHost, user);
    }

    public void go(Host defaultHost, User user) throws DotDataException, DotSecurityException {
        Logger.info(StateWriter.class, "I'm the state writer!");

        List<Container> containers =APILocator.getContainerAPI().findAllContainers(user, true);

        log("containers: ");

        for(Container c : containers) {
            log(c.getInode());
            log(c.getFriendlyName());
            log(c.getCode());
            log(c.getType());
            log(c.getTitle());
            //log(c.getStructureInode());
        }

    }

    public void log(String message) {
        Logger.info(StateWriter.class, message);
    }
}
