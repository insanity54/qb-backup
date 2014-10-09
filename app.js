var express = require('express');
var session = require('express-session');
var nconf = require('nconf');
var fs = require('fs');
var https = require('https');
var OAuth2 = require('oauth').OAuth2;
var rest = require('restler');
var schedule = require('node-schedule');
var mailer = require('mailer');


//
// ENV
//
nconf.file({file: 'config.json'});
nconf.defaults({
    'PORT': '8888'
});

var port = nconf.get('PORT');
var backpack = nconf.get('BACKPACKURL');
var transporter = nodemailer.createTransport({
    service: 

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
