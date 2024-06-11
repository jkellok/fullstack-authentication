Keycloak is an open-source Identity and Access Management solution designed for modern applications and services. It offers features such as single sign-on, user federation, strong authentication, user management, and fine-grained authorization. This document provides instructions to set up and configure Keycloak on a Pouta server, ensuring secure access using HTTPS with Let's Encrypt certificates. This Keycloak instance will be used to manage user authentication for the application.

## Prerequisites
- Access to a Pouta server with sudo privileges.
- Java Development Kit (JDK) 11 or higher installed.
- Let's Encrypt certificates for your domain.

## Installation
1. Download the latest Keycloak release from the official website:
cd /opt
sudo wget https://github.com/keycloak/keycloak/releases/download/24.0.0/keycloak-24.0.0.tar.gz (Replace 24.0.0 if needed)
sudo tar -xzvf keycloak-24.0.0.tar.gz
sudo mv keycloak-24.0.0 keycloak
sudo chown -R keycloakadmin:keycloakadmin keycloak

2. Create keycloak.conf file under /opt/keycloak/conf directory with following configurations:
# HTTP/HTTPS settings
http-enabled=true
http-port=8080
https-port=8443
hostname=keycloak.ilab.fi (adjust host name)
hostname-strict=false
hostname-strict-https=false
# TLS/SSL settings
https-certificate-file=/etc/letsencrypt/live/keycloak.ilab.fi/fullchain.pem
https-certificate-key-file=/etc/letsencrypt/live/keycloak.ilab.fi/privkey.pem
https-key-store-password=${KEYCLOAK_HTTPS_KEY_STORE_PASSWORD}
https-key-password=${KEYCLOAK_HTTPS_KEY_PASSWORD}

Passwords are saved in /etc/keycloak.env and this file should be included in /etc/systemd/system/keycloak.service as EnvironmentFile = /etc/keycloak.env

## Commands:
- Restart keycloak: sudo systemctl restart keycloak
- Enable Keycloak to start on boot: sudo systemctl enable keycloak

After installation admin console can be reached https://keycloak.ilab.fi:8443