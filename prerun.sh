#!/bin/bash


bindir="$(dirname "$(readlink -fn "$0")")"

####
## passBox()
## 
## creates a pretty shell output
## showing either PASS or FAIL
##
## @param name   The name of the dependency
## @param check  0 for pass or
##               1 for fail
##
function passBox {
    if [[ $2 -eq 1 ]]; then
        echo -e "$1:  [${red}FAIL${nc}]"
    else
        echo -e "$1:  [${green}PASS${nc}]"
    fi
}

echo 'check openssl is installed'
if ! hash openssl 2>/dev/null; then
    echo 'openssl not installed. installing'
    sudo apt-get -y install openssl
fi
echo $(passBox openssl 0);


# make sure we have a ssl configured
echo 'check ssl keys are in place'
if [[ ! -e "$bindir/ssl/ssl-key.pem" ]]; then
    echo $(passBox ssl-key.pem 1);    
    echo 'ssl private key does not exist, creating...'
    "$bindir/sslsetup.sh"
fi
echo $(passBox ssl-key.pem 0);

if [[ ! -e "$bindir/ssl/ssl-csr.pem" ]]; then
    echo $(passBox ssl-csr.pem 1);    
    echo 'ssl certificate signing request does not exist, creating...'
    "$bindir/sslsetup.sh"
fi
echo $(passBox ssl-csr.pem 0);

if [[ ! -e "$bindir/ssl/ssl-cert.pem" ]]; then
    echo $(passBox ssl-cert.pem 1);    
    echo 'ssl certificate does not exist, creating...'
    "$bindir/sslsetup.sh"
fi
echo $(passBox ssl-cert.pem 0);


# check config file exists
if [[ ! -e "$bindir/config.json" ]]; then
    echo $(passBox config.json 1);
    echo 'config.json does not exist, generating...'
    "$bindir/configsetup.sh"

    # ensure config file generated successfully
    if [[ $? -ne 0 ]]; then
	echo $(passBox config.json 1);
	echo 'config.json not generated successfully. plz try again or open issue on github https://github.com/insanity54/qb-backup/issues'
	exit 1
    fi
fi

    
node ./app.js
