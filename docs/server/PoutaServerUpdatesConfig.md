# Pouta Server Automated Updates Configuration

This document outlines the configuration of automated updates on both Pouta servers. These steps ensure the servers remain up-to-date with the latest security patches and software updates.

## Set up Unattended Upgrades:

1. Installed unattended-upgrades package:
sudo apt-get update
sudo apt-get install unattended upgrades

2. Configured /etc/apt/apt.conf.d/50unattended-upgrades file:

 - Enabled automatic updates for security and other critical updates:
 Unattended-Upgrade::Allowed-Origins {
    "${distro_id}:${distro_codename}-security";
    "${distro_id}:${distro_codename}-updates";
};

- Configured email notifications for update statuses:
Unattended-Upgrade::Mail "email@example.com";
Unattended-Upgrade::MailReport "only-on-error";
Now email is set as "ekaterina.zavyalova@tuni.com". It can be changed as needed.

- Set up automatic removal of unused dependencies:
Unattended-Upgrade::Remove-Unused-Dependencies "true";

- Configured the system not to reboot automatically after updates:
Unattended-Upgrade::Automatic-Reboot "false";

3. Configured /etc/apt/apt.conf.d/20auto-upgrades for periodic updates:

- Configured the system to update the package list every day:
APT::Periodic::Update-Package-Lists "1";

- Configurated the system to download available package updates every day:
APT::Periodic::Download-Upgradeable-Packages "1";

- Comfigurated the system to remove outdated packages from the cache every 7 days:
APT::Periodic::AutocleanInterval "7";

- Configurated system to automatically install security and other critical update severy day:
APT::Periodic::Unattended-Upgrade "1";

## Enabled Systemd Timers for Automatic Updates:

1. Enable and start apt-daily.timer:
sudo systemctl enable apt-daily.timer
sudo systemctl start apt-daily.timer
sudo systemctl status apt-daily.timer

2. Enable and start apt-daily-upgrade.timer:
sudo systemctl enable apt-daily-upgrade.timer
sudo systemctl start apt-daily-upgrade.timer
sudo systemctl status apt-daily-upgrade.timer

## Verification and Monitoring:

1. Run dry-run tests to verify the configuration:
sudo unattended-upgrades --dry-run --debug

2. Set up log monitoring to check update activities:
sudo cat /var/log/unattended-upgrades/unattended-upgrades.log
