#!/bin/bash

# Directories to back up
APP_DIR="/opt/projects/fullstack-authentication"
BACKUP_DIR="/var/backups/app"
TIMESTAMP=$(date +"%Y%m%d%H%M%S")

# Check that  backup directory exists
mkdir -p $BACKUP_DIR

# Create the backup
tar -czf $BACKUP_DIR/app-backup-$TIMESTAMP.tar.gz $APP_DIR

# Print completion message
echo "Backup completed successfully at $TIMESTAMP"
