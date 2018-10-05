QB-Backup
===

[![Greenkeeper badge](https://badges.greenkeeper.io/insanity54/qb-backup.svg)](https://greenkeeper.io/)

What it do
---

Checks 37signals backpack reminders daily. If a reminder has been triggered that mentions "quickbooks" and "backup", the script copies the latest quickbooks backup to a local directory, and prepares the backup in XFburn for burning to a CD.

Installation
---

* Set up openssl config (./openssl.conf.master). Change it to ./openssl.conf Put your organization's info in there
* run ssl config (./sslsetup.sh)
* satisfy node prereqs (npm install)
* run node (npm start)