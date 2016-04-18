# dotCMS Skeleton Project docCMS assets #

## to build:##
* run the following 1 command:
* npm install (ensure you have the latest nodeJS + npm installed, v4.1.1 or greater)
* edit ../webdav-sync.properties, at a minimum, you'll need to set dev.sourceDirectory and dev.targetURL to match your environment
* login to your dotCMS instance, and create a site called skel.dotcms.com
* in the dotCMS site browser create a folder named 'application' under that site
* run the following 1 command: `gulp build-send-watch`

## Create Home Screen ##
*Prerequisite that the migrations dynamic plugin has run first to create the home widget.*

The home page will be `/home/index` and is created by the migrations plugin. There are a few follow up manual steps to 
get it running

* **Add a Home Widget**
  1. From the site browser edit /home/index.
  2. Click Add Content -> Add Widget -> Simple Widget
  3. Choose: Home Widget
  4. Click Save and Publish
  
* **Create Vanity URL for Home Page**
  1. Under the site browser menu, choose Vanity URLs and Click 'Add New Vanity URL'
  2. Fill in the following fields:
    * Title: cmsHomePage
    * URL: /cmsHomePage
    * URL to Redirect to: /home/index
  3. Save
  4. In your browser's address bar go to http://{yourhost}:8080/ to verify. 

