# Application Server Backup Configuration

This document explains the backup setup for the application on the Pouta server, including the systemd timer configuration. The backup script is stored in the CMDB.

## Backup Directory
/var/backups/app

## Backup Script
The backup script is located in the CMDB: cmdb/app-server/app-backup.sh

## Systemd Service
The systemd service unit file is located at: /etc/systemd/system/app-backup.service

## Systemd Timer
The systemd timer unit file is located at: /etc/systemd/system/app-backup.timer

## Enabling and Starting the Timer
To enable and start the timer:
- sudo systemctl daemon-reload
- sudo systemctl enable app-backup.timer
- sudo systemctl start app-backup.timer

## Verification
To check the status of the timer and service:
- sudo systemctl status app-backup.timer
- sudo systemctl status app-backup.service
- sudo journalctl -u app-backup.service

## Manual Backup
To manually trigger a backup: sudo systemctl start app-backup.service
