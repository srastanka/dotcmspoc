package ca.architech.dotcms.api;

import com.dotmarketing.business.APILocator;
import com.dotmarketing.exception.DotDataException;
import com.dotmarketing.exception.DotSecurityException;
import com.dotmarketing.portlets.containers.model.Container;
import com.liferay.portal.model.User;

import java.util.List;

public class ContainerUtil {

    public static Container getContainerByFriendlyName(User user, String containerName) throws DotDataException, DotSecurityException{

        List<Container> containers = APILocator.getContainerAPI().findAllContainers(user, true);

        for(Container c : containers) {
            if (c.getFriendlyName().equals(containerName)) {
                return c;
            }
        }
        throw new DotDataException("couldn't find requested container, named: " + containerName);
        }

    public static Container getContainerByTitle(User user, String containerName) throws DotDataException, DotSecurityException {
        List<Container> containers = APILocator.getContainerAPI().findAllContainers(user, true);

        for(Container c : containers) {
            if (c.getTitle().startsWith(containerName)) {
                return c;
            }
        }
        throw new DotDataException("couldn't find requested container, named: " + containerName);
    }
}
