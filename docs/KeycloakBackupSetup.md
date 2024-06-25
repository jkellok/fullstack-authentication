# Keycloak Backup Configuration

This document explains the backup setup for Keycloak on the Pouta server, including the systemd timer configuration. The backup script is stored in the CMDB.

## Backup Directory
/var/backups/keycloak

## Backup Script
The backup script is located in the CMDB: cmdb/keycloak-server/backup.sh

## Systemd Service
The systemd service unit file is located at: /etc/systemd/system/keycloak-backup.service

## Systemd Timer
The systemd timer unit file is located at: /etc/systemd/system/keycloak-backup.timer

## Enabling and Starting the Timer
To enable and start the timer:
- sudo systemctl daemon-reload
- sudo systemctl enable keycloak-backup.timer
- sudo systemctl start keycloak-backup.timer

## Verification
To check the status of the timer and service:
- sudo systemctl status keycloak-backup.timer
- sudo systemctl status keycloak-backup.service
- sudo journalctl -u keycloak-backup.service

## Manual Backup
To manually trigger a backup: sudo systemctl start keycloak-backup.service
