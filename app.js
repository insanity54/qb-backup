var express = require('express');
var session = require('express-session');
var nconf = require('nconf');
var fs = require('fs');
var https = require('https');
var OAuth2 = require('oauth').OAuth2;
var rest = require('restler');
var schedule = require('node-schedule');
var mailer = require('mailer');
var smtpTransport = require('nodemailer-smtp-transport');

//
// ENV
//
nconf.file({file: 'config.json'});
nconf.defaults({
    'PORT': '38999'
});

var port = nconf.get('PORT');
var backpack = nconf.get('BACKPACKURL');
var emailServer = nconf.get('EMAILSERVER');
var emailSSL = nconf.get('EMAILSSL');
var emailUsername = nconf.get('EMAILUSERNAME');
var emailPassword = nconf.get('EMAILPASSWORD');
var emailTo = nconf.get('EMAILTO');
var emailFrom = nconf.get('EMAILFROM');
var emailSubject = nconf.get('EMAILSUBJECT');

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
transporter.sendMail({
    from: emailFrom,
    to: emailTo,
    subject: emailSubject,
    text: 'software aleeert of some kind ktnxbai'
});

//
// FUNKIES
//

var checkConfig = function checkConfig() {
    if (!backpack) throw new Error('backpack url not defined config file');
    if (!port) throw new Error('port number not defined in config file or nconf defaults');
}

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

checkConfig();

// every weekday at 8AM, check backpack reminders
var daily = schedule.scheduleJob('0 8 * * 1-5', function() {
    console.log('checking backpack reminders');
    
});

// testing every minute of every weekday
var minutely = schedule.scheduleJob('* * * * 1-5', function() {
    console.log('checking backpack reminders (test)');

    checkBackpack(function(err, reply) {
});

var checkReminders = function checkReminders() {

    rest.get(backpack, {timeout: 180000}).on('timeout', function() {
	sendError('');
	console.log('timed out trying to connect to backpack');
	

});

rest.get('http://someslowdomain.com',{timeout: 10000}).on('timeout', function(ms){
  console.log('did not return within '+ms+' ms');
}).on('complete',function(data,response){
  console.log('did not time out');
});
