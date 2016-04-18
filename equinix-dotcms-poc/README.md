# Equinix dotCMS

## Local Vagrant VM Setup
The following instructions will set you up with a clean VM running Ubuntu 14.04 LTS along with dotCMS 3.3 using a MySQL database

### Prerequisites
- VirtualBox (https://www.virtualbox.org/)
- Vagrant (https://www.vagrantup.com/)

### Windows Users
Before running the following instructions, you must do the following:

- Disable Hyper-V: Search for "Windows Features", Select "Turn Windows Features On and Off" and then uncheck "Hyper-V" and press Ok.
- Install Git-Bash (http://git-scm.com/downloads) and run the commands from it, not Windows Console.

### Instructions
```sh
$ cd <YOUR_PATH_TO_THIS_REPO>
$ 'vagrant up'
```
This will provision a new VM on your local machine with the following attributes:

- Static IP of 192.168.56.210
- User/Pass 'vagrant'/'vagrant'
- Port 22 open for SSH
- Port 3306 open for MySQL
- Port 8080 open for HTTP
- Port 8443 open for HTTPS

dotCMS will run as soon as the box has been provisioned.

### Suggestion
Add 192.168.56.210 to your /etc/hosts file as an alias such as:
```sh
192.168.56.210   dev.local.com vm
```
So you can access it at these aliases instead of trying to remember the static IP.

### dotCMS Migrations and Assets

change directory to dotcms/dynamic-plugins/ca.architech.dotcms.migrations and follow the directions in the README.md
change directory to dotcms/assets and follow the directions in the README.md
