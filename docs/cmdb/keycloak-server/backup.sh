#!/bin/bash

# Source and destination directories
CONFIG_DIR="/opt/keycloak/conf"
KEYCLOAK_THEMES_DIR="/opt/keycloak/themes"
SSL_CERTS_DIR="/etc/ssl"

# Backup directory
BACKUP_DIR="/var/backups/keycloak"

TIMESTAMP=$(date +"%Y%m%d%H%M%S")
BACKUP_PATH="${BACKUP_DIR}/keycloak-backup-${TIMESTAMP}.tar.gz"

# Check that backup directory exists
mkdir -p $BACKUP_DIR

# Create backup
tar -czf $BACKUP_PATH $CONFIG_DIR $KEYCLOAK_THEMES_DIR $SSL_CERTS_DIR

# Remove backups older than 7 days
find $BACKUP_DIR -type f -name "*.tar.gz" -mtime +7 -exec rm {} \;

echo "Backup completed successfully at $TIMESTAMP"
