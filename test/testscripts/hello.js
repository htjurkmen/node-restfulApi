var http = require('http');
var fileutils = require('../utils/fileutils');
var assertutils = require('../utils/assertutils');

exports.testHelloWorld = function(callback,url){
	var expectedMessage = 'Hello World!';
	http.get(url+"/hello", function(res) {
	  res.setEncoding('utf8');
	  res.on('data', function (data) {
		var messageonFailure = "ERROR: Actual message: "+data+" Expected message:"+ expectedMessage;
		assertutils.assertEqual(data, expectedMessage,"testHelloWorld", messageonFailure);
		callback();
	  });
	}).on('error', function(e) {
	  console.log("Got error: " + e.message);
	  callback();
	});
}

exports.testHelloWorld1 = function(callback,url){
	var expectedMessage = 'Hello Worl!';
	http.get(url+"/hello", function(res) {
	  res.setEncoding('utf8');
	  res.on('data', function (data) {
		var messageonFailure = "ERROR: Actual message: "+data+" Expected message:"+ expectedMessage;
		assertutils.assertEqual(data, expectedMessage,"testHelloWorld", messageonFailure);
		callback();
	  });
	}).on('error', function(e) {
	  console.log("Got error: " + e.message);
	  callback();
	});
}

