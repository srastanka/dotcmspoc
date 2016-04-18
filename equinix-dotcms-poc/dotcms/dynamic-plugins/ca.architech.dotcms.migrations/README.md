# ca.architech.dotcms.migrations

An OSGI (dynamic) dotCMS plugin in the style of liquibase/rails migrations that does programmatic configuration of dotCMS that can be reused across dotCMS environments.

Adapted from the 3rd-party dynamic plugin example in the dotCMS documentation.

## Building

To install all you need to do is build the JAR. to do this run
./gradlew
This will run the tests and build a jar in the build/libs directory


## Deploying

### To install this bundle:

Copy the bundle jar file inside the Felix OSGI container (dotCMS/felix/load).

**OR**

Upload the bundle jar file using the dotCMS UI (CMS Admin->Dynamic Plugins->Upload Plugin).

**OR**

Run ./gradlew deploy

Note: In order to use the ./gradlew deploy task, ensure the following are setup:

* All of the scp settings at the beginning of the build.gradle file are correct or are overriden in a gradle.properties
or through command line using the `-P` option.
* A public ssh key is generated from the included private key file `ssh_key` and added to the 
/home/{scpUser}/.ssh/authorized_keys file on the target server.

### To uninstall this bundle:

Remove the bundle jar file from the Felix OSGI container (dotCMS/felix/load).

**OR**

Undeploy the bundle using the dotCMS UI (CMS Admin->Dynamic Plugins->Undeploy).