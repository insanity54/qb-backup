var express = require('express');
var session = require('express-session');
var nconf = require('nconf');
var fs = require('fs');
var https = require('https');
var OAuth2 = require('oauth').OAuth2;
var rest = require('restler');
var schedule = require('node-schedule');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var SambaClient = require('samba-client');


//
// ENV
//
nconf.file({file: 'config.json'});
nconf.defaults({
    'PORT': '38999'
});

var port = nconf.get('PORT');
var backpack = nconf.get('BACKPACKURL');
var token = nconf.get('BACKPACKTOKEN');
var emailServer = nconf.get('EMAILSERVER');
var emailSSL = nconf.get('EMAILSSL');
var emailUsername = nconf.get('EMAILUSERNAME');
var emailPassword = nconf.get('EMAILPASSWORD');
var emailTo = nconf.get('EMAILTO');
var emailFrom = nconf.get('EMAILFROM');
var emailSubject = nconf.get('EMAILSUBJECT');
var smbServer = nconf.get('SMBSERVER');
var smbUser = nconf.get('SMBUSER');
var smbPass = nconf.get('SMBPASS');


// e-mail alert configuration
// this is all pulled from the app config file, config.json (via nconf)
var emailOptions = {
    host: emailServer,
    secure: emailSSL,
    auth: {
	user: emailUsername,
	pass: emailPassword,
    }
};
var transporter = nodemailer.createTransport(smtpTransport(emailOptions));

//
// FUNKIES
//

var sendError = function sendError(err) {
    transporter.sendMail({
	from: emailFrom,
	to: emailTo,
	subject: emailSubject,
	text: 'qb-backup alert:\n' + err
    });

}

var checkConfig = function checkConfig() {
    if (!backpack) throw new Error('backpack url not defined config file');
    if (!port) throw new Error('port number not defined in config file or nconf defaults');
}



checkConfig();

// every weekday at 8AM, check backpack reminders
var daily = schedule.scheduleJob('0 8 * * 1-5', function() {
    console.log('checking backpack reminders');
    
});

// testing every minute of every weekday
var count = 0;
var minutely = schedule.scheduleJob('* * * * 1-5', function() {
    console.log('checking backpack reminders (test)');

    checkReminders(function(err, reply) {
	if (err) return sendError(err);

	// see if qb backup is scheduled today
	compareTime(reply, function(err, match) {
	    if (err) return sendError(err);
	    if (!match) return console.log('no quickbooks backup scheduled today');

	    // qb backup is scheduled today
	    backupQB(function(err, status) {
		if (err) return sendError(err);
		console.log('backup status is ' + status.code);
	    });
	});
    });
});

var backupQB = function backupQB(callback) {
    console.log('backup');
    var smb = new SambaClient({
	address: smbServer,
	username: smbUser,
	password: smbPass
    });
};


// calls back (null, true) if quickbooks backup reminder is today
var compareTime = function compareTime(reply, callback) {

    // get today's date
    var date = new Date();
    var today = date.toISOString();
    today = today.substring(0, today.indexOf('T'));
    console.log('today: ' + today);

    // get reminders
    var reminders = reply.reminders.reminder;
    console.log(reminders);

    // go through each reminder and see if it is today
    for (var i = 0; i < Object.keys(reminders).length; i ++) {

	// if any of today's reminders mention "quickbooks backup", return true
	var remindAt = reminders[i].remind_at.toString().split(' ')[0];
	console.log('comparing ' + remindAt + ' and ' + today);

	if (remindAt == today) {
	    console.log('reminder today');

	    var content = reminders[i].content;
	    if (content.indexOf('quickbooks') && content.indexOf('backup')) return callback(null, true);
				
   	} else {
	    // reminder is not today
	    return callback(null, false);
	}
    }
};
    
var apiCall = function apiCall(options, token, callback) {
    var req = https.request(options, function(res) {
	console.log('status code: ', res.statusCode);
	
	var output = '';
	
	res.on('data', function(chunk) {
	    output += chunk;
	});
	
	res.on('end', function() {
	    console.dir(output);
	    xml2js.parseString(output, function(err, result) {
		//var page = result.response.page[0].belongings;
		console.dir(result.project['show-writeboards']);
		callback(res.statusCode, result);
	    });
	});
    });
    req.write('<request><token>' + token + '</token></request>');
    req.end();
    
    req.on('error', function(error) {
	console.error(error);
	callback('ERRRRRR', 'obj');
    });
};

var apiCall2 = function apiCall2(token, callback) {

    var options = {
	timeout: 180000
    };
    
    var req = rest.get(backpack + '/' + token + '/reminders.xml', options);
	    
    req.on('complete', function(data) {
	if (data instanceof Error) {
	    console.log('Error:' + res.message);
	    this.retry(5000);
	} else {
	    return callback(null, data);
	}
    });

    req.on('timeout', function(res) {
	return callback('timed out trying to connect to backpack', null);
    });
};


var checkReminders = function checkReminders(cb) {
    apiCall2(token, function(err, res) {
	if (err) return cb(err, null);
	return cb(null, res);
    });
}

var datetest = '2014-10-14 05:00:00';

var apiCall = function apiCall(options, token, callback) {
    var req = https.request(options, function(res) {
	console.log('status code: ', res.statusCode);
	
	var output = '';
	
	res.on('data', function(chunk) {
	    output += chunk;
	});
	
	res.on('end', function() {
	    console.dir(output);
	    xml2js.parseString(output, function(err, result) {
		//var page = result.response.page[0].belongings;
		console.dir(result.project['show-writeboards']);
		callback(res.statusCode, result);
	    });
	});
    });
    req.write('<request><token>' + token + '</token></request>');
    req.end();
    
    req.on('error', function(error) {
	console.error(error);
	callback('ERRRRRR', 'obj');
    });
};
