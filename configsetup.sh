#!/bin/bash

# generate a config file for node

bindir="$(dirname "$(readlink -fn "$0")")"

# defaults
portdefault=29834
scheddefault='0 8 * * 1-5'
emailssldefault='false'
emailsubjectdefault='qb-backup software alert'
smbuserdefault='guest'
smbpassdefault='guest'

# get some input
read -p "Enter your backpack URL in the format https://companyname.backpackit.com: " url
read -P "Enter your backack Authentication token (obtained from the \"My Info\" page on Backpack): " token
read -p "Enter the (cron style) schedule defining how often to run (default is every weekday @ 8AM) [$scheddefault]: " runsched
read -p "Enter the port number you want the node server to run on [29834]: " port
echo "SMTP email alert setup"
read -p "Enter the SMTP server that will be sending your mail: " emailserver
read -p "Does your SMTP server require? Enter true or [false]: " emailssl
read -p "Enter the SMTP username: " emailusername
read -p "Enter the SMTP password for $emailfrom: " emailpass
read -p "Enter the email address to send admin alerts from: " emailfrom
read -p "Enter the email address to send admin alerts to: " emailto
read -p "Enter the email subject the alert will contain, or leave blank for default: " emailsubject
echo "SAMBA server setup"
read -p "Enter the smb address for your samba server where QB backups are stored (ex: //server): " smbserver
read -p "Enter the smb username [guest]: " smbuser
read -p "Enter the smb password [guest]: " smbpass

port=${port:-$portdefault}                            # if nothing entered for port, set our default
runsched=${runsched:-$scheddefault}                   # if nothing entered for port, set our default
emailssl=${emailssl:-$emailssldefault}                # if nothing entered for ssl, set to default
emailsubject=${emailsubject:-$emailsubjectdefault}    # if nothing entered for email subject, set to defaultpp
smbuser=${smbuser:-$smbuserdefault}
smbpass=${smbpass:-$smbpassdefault}

# @todo next time we do this, just do it all in JS!
#       that way, we get JSON parsing built in
#       and we can actually make use of nconf's default functionality
echo -e \
"{
  \"BACKPACKURL\"  : \"$url\",
  \"BACKPACKTOKEN\": \"$token\",
  \"RUNSCHED\"     : \"$runsched\",
  \"PORT\"         : \"$port\",
  \"EMAILFROM\"    : \"$emailfrom\",
  \"EMAILTO\"      : \"$emailto\",
  \"EMAILSERVER\"  : \"$emailserver\",
  \"EMAILUSERNAME\": \"$emailusername\",
  \"EMAILSSL\"     : \"$emailssl\",
  \"EMAILPASSWORD\": \"$emailpass\",
  \"EMAILSUBJECT\" : \"$emailsubject\"
}" > $bindir/config.json

echo 'config.json generated.'
