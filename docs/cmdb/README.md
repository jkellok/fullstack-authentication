# Configuration Management Database (CMDB)

This directory contains all necessary configuration files and scripts for managing the Recruitzilla system, including server configurations, backup scripts, and firewall rules.

## Directory Structure

- **app-server/**: Configuration files and scripts related to the application server.
  - **apache-sites/**: Apache configuration files.
    - `authzilla.ilab.fi.conf`: Configuration file for the Apache site `authzilla.ilab.fi`.
  - **ufw/**: Uncomplicated Firewall (UFW) rules for the application server.
    - `after.rules`: Rules applied after UFW has processed its own rules.
    - `before.rules`: Rules applied before UFW processes its own rules.
    - `user.rules`: User-defined UFW rules.
  - `app-backup.sh`: Backup script for the application server.

- **keycloak-server/**: Configuration files and scripts related to the Keycloak server.
  - **ufw/**: Uncomplicated Firewall (UFW) rules for the Keycloak server.
    - `after.rules`: Rules applied after UFW has processed its own rules.
    - `before.rules`: Rules applied before UFW processes its own rules.
    - `user.rules`: User-defined UFW rules.
  - `backup.sh`: Backup script for the Keycloak server.

## Details

### app-server/

#### apache-sites/
- **authzilla.ilab.fi.conf**: This is the Apache configuration file for the site `authzilla.ilab.fi`. It includes directives and settings specific to this virtual host.

#### ufw/
- **after.rules**: This file contains UFW rules that are applied after UFW's own rules. It can be used to override or add additional rules.
- **before.rules**: This file contains UFW rules that are applied before UFW's own rules. It is typically used for low-level customization.
- **user.rules**: This file contains user-defined UFW rules that supplement or override default UFW settings.

#### app-backup.sh
- **app-backup.sh**: This is a shell script for backing up the application server's data and configurations.

### keycloak-server/

#### ufw/
- **after.rules**: This file contains UFW rules that are applied after UFW's own rules. It can be used to override or add additional rules.
- **before.rules**: This file contains UFW rules that are applied before UFW's own rules. It is typically used for low-level customization.
- **user.rules**: This file contains user-defined UFW rules that supplement or override default UFW settings.

#### backup.sh
- **backup.sh**: This is a shell script for backing up the Keycloak server's data and configurations.
