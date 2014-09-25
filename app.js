var express = require('express');
var session = require('express-session');
var nconf = require('nconf');
var fs = require('fs');
var https = require('https');
var OAuth2 = require('oauth').OAuth2;
var restify = require('restify');

//
// ENV
//
nconf.env(['PORT'])
     .file({file: 'config.json'});
nconf.defaults({
    'PORT': '8888',
});
var port = nconf.get('PORT');


//
// FUNKIES
//

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

restify.
    GET /#{token}/reminders.xml
