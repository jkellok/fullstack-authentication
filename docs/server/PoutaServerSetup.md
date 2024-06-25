# Pouta Server Setup and Configuration
This document provides step-by-step instructions for setting up a Pouta instance, configuring a domain name, and securing the server.

## Prerequisites
- A CSC Pouta account
- A domain name

## Setting Up the Pouta Instance
1. Log in to Pouta Service:
   - Access your CSC Pouta account through the Pouta web interface.

2. Create a New Instance:
   - Navigate to the "Instances" section.
   - Click on "Launch Instance."
   - Fill in the required details:
     - Instance Name: Choose a name for your instance.
     - Flavor: Select the appropriate flavor based on your resource needs (CPU, RAM).
     - Image: Choose the operating system image (e.g., Ubuntu 20.04 LTS).
     - Network: Select the network for your instance.
     - Key Pair: Create or select an existing key pair for SSH access.

3. Configure Security Groups:
   - Create a new security group with the following rules:
     - SSH Access: Port 22 (TCP)
     - HTTP Access: Port 80 (TCP)
     - HTTPS Access: Port 443 (TCP)
   - Assign this security group to your instance.

4. Launch the Instance:
   - Review your configuration and click on "Launch"

## Assign a Public IP

1. Allocate a Floating IP:
   - In the Pouta dashboard, go to the "Floating IPs" tab.
   - Click on "Allocate IP" to get a new floating IP.

2. Associate the Floating IP with Your Instance:
   - Go back to the "Instances" tab.
   - Find the instance you want to assign the public IP to.
   - Click on the dropdown arrow next to the instance and select "Associate Floating IP"
   - In the pop-up window, select the allocated floating IP from the dropdown menu.
   - Click "Associate"

3. Verify the Floating IP:
   - The floating IP should now appear next to your instance in the "Instances" list.

4. Update Security Groups:
   - Ensure your security group allows access to necessary ports from the public IP.
   - Go to the "Network" section and click on "Security Groups."

## SSH into Your Instance
1. Obtain the Instance IP Address:
   - Go to the "Instances" section and note the public IP address of your new instance.

2. SSH Access:
   - Open a terminal on your local machine and use the SSH command to access your instance:
    ssh ubuntu@your-instance-public-ip

## Set Up the Web Server
1. Update and Upgrade:
   - Update your instance’s package list and upgrade all packages:
     sudo apt update
     sudo apt upgrade -y

2. Install Apache2:
   - Install Apache2 on your instance:
     sudo apt install apache2 -y

3. Start Apache2:
   - Enable and start the Apache2 service:
     sudo systemctl enable apache2
     sudo systemctl start apache2

## Assign a Domain Name
1. Get a domain name from registrar

2. Set Up DNS Records:
   - Log in to your domain registrar’s control panel.
   - Navigate to the DNS settings for your domain.
   - Create an `A` record pointing to the public IP address of your Pouta instance.
     - Host: `@` (or `www` for a subdomain)
     - Type: `A`
     - Value: Your instance’s public IP address
     - TTL; Set it to your desired time, usually 3600 seconds.

## Configure the Server for the Domain
1. Update the Host File:
   - SSH into your Pouta instance and update the host file:
     sudo nano /etc/hosts

   - Add a line with your domain name and the server's IP:
     YOUR_SERVER_IP yourdomain.com

2. Configure Apache2 for Your Domain:
   - Create a new Apache configuration file for your domain:
     sudo nano /etc/apache2/sites-available/yourdomain.com.conf

     Add the following configuration:
     <VirtualHost *:80>
         ServerName yourdomain.com
         ServerAlias www.yourdomain.com
         DocumentRoot /var/www/html

         <Directory /var/www/html>
             Options Indexes FollowSymLinks
             AllowOverride All
             Require all granted
         </Directory>

         ErrorLog ${APACHE_LOG_DIR}/error.log
         CustomLog ${APACHE_LOG_DIR}/access.log combined
     </VirtualHost>

    - Reload Apache2:
     sudo systemctl reload apache2

## Configure Security
1. Install SSL Certificate (Let’s Encrypt):
   - Install Certbot:
     sudo apt-get install certbot python3-certbot-apache

   - Obtain an SSL certificate:
     sudo certbot --apache -d yourdomain.com -d www.yourdomain.com

   - Follow the prompts to complete the installation.

2. Configure Firewall:
   - Ensure UFW is installed:
     sudo apt-get install ufw

   - Allow necessary ports:
     sudo ufw allow OpenSSH
     sudo ufw allow 'Apache Full'
     sudo ufw enable

## Manage Users
1. Create a New User:
   - Add a new user:
    sudo adduser newusername

   - Follow the prompts to set the user’s password and other details.

2. Set Up SSH Keys for the New User:
    - On the server, create the `~/.ssh` directory for the new user and set the appropriate permissions:
       sudo mkdir -p /home/newusername/.ssh
       sudo chmod 700 /home/newusername/.ssh

    - Add the public key to the `authorized_keys` file and save it:
       sudo nano /home/newusername/.ssh/authorized_keys

    - Set the appropriate permissions for the `authorized_keys` file:
       sudo chmod 600 /home/newusername/.ssh/authorized_keys
       sudo chown -R newusername:newusername /home/newusername/.ssh

3. Delete the Default User:
   - Ensure you have another user with sudo privileges before deleting the default user.
   - Delete the default user (ubuntu):
    sudo deluser --remove-home defaultusername

4. Add Users to the Sudo Group:
   - Add the new user to the sudo group:
     sudo usermod -aG sudo newusername

## Verify Configuration
1.  Check Domain Resolution:
   - Open a browser and navigate to `http://yourdomain.com`. Ensure it resolves to your Pouta server.
   - Check the SSL certificate by navigating to `https://yourdomain.com`.
