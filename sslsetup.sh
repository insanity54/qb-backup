#!/bin/bash -ex

# create a server private key
openssl genrsa -out ./ssl/ssl-key.pem 1024

# create a csr
openssl req -new -key ./ssl/ssl-key.pem -out ./ssl/ssl-csr.pem -config openssl.conf -batch

# self sign
openssl x509 -req -in ./ssl/ssl-csr.pem -signkey ./ssl/ssl-key.pem -out ./ssl/ssl-cert.pem
