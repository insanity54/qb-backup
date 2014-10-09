#!/bin/bash

# generate a config file for node

bindir="$(dirname "$(readlink -fn "$0")")"

# defaults
portdefault=29834
scheddefault='0 8 * * 1-5'

# get some input
read -p "Enter your backpack URL in the format https://companyname.backpackit.com: " url
read -p "Enter the (cron style) schedule defining how often to run (default is every weekday @ 8AM) [$scheddefault]: " runsched
read -p "Enter the port number you want the node server to run on [29834]: " port
echo "SMTP email alert setup"
read -p "Enter the email address to send admin alerts from: " emailfrom
read -p "Enter the SMTP password for $emailfrom: " emailpass
read -p "Enter the email address to send admin alerts to: " emailto
port=${port:-$portdefault} # if nothing entered for port, set our default
runsched=${runsched:-$scheddefault} # if nothing entered for port, set our default

# @todo next time we do this, just do it all in JS!
#       that way, we get JSON parsing built in
echo -e \
"{
  \"BACKPACKURL\"  : \"$url\",
  \"RUNSCHED\"     : \"$runsched\",
  \"PORT\"         : \"$port\",
  \"EMAILFROM\"    : \"$emailfrom\",
  \"EMAILPASS\"    : \"$emailpass\",
  \"EMAILTO\"      : \"$emailto\"
}" > $bindir/config.json

echo 'config.json generated.'
