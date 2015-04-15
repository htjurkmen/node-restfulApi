var http = require('http');
var fileutils = require('../utils/fileutils');
var assertutils = require('../utils/assertutils');
var mongoDb = require('../../routes/dbUtils');

var db = mongoDb.getDbInstance(); 

exports.getAllUsers = function(callback,url){	
	http.get(url+"/user/all", function(res) {
	  res.setEncoding('utf8');
	  res.on('data', function (data) {
		mongoDb.getAllUsersFromDb(db,function(items){
			var expectedResult = JSON.stringify(items);
			var messageonFailure = 'Actual result: '+data+' Expected result: '+expectedResult;
			assertutils.assertEqual(data, expectedResult,"getAllUsers", messageonFailure);
			callback();
		});
	  });	  
	}).on('error', function(e) {
	  console.log("Got error: " + e.message);
	});
}

var initialize = function(url, userId, username, methodType, path, callback){
	var optionsAndUserString = [];

	var user = {
				  id: userId,
				  username: username
				};
				
	var userString = JSON.stringify(user);
				
	var headers = {
				  'Content-Type': 'application/json',
				  'Content-Length': userString.length
	};
				
	var options = {
				  host: url,
				  port: 3001,
				  //path: '/user/create',
				  path: path,
				  //method: 'POST',
				  method: methodType,
				  headers: headers
	};
	
	optionsAndUserString.push(userString);
	optionsAndUserString.push(options);
	callback(optionsAndUserString); 
}

exports.createUser = function(callback, url, userId, username){
	
	mongoDb.getUserById(db,userId, function(items){
		var check = items.length;
		if(check == 0){				
			initialize(url, userId, username, 'POST', '/user/create', function(optionsAndUserString){
				
				var req = http.request(optionsAndUserString[1], function(res) {
				  res.setEncoding('utf-8');

				  var responseString = '';

				  res.on('data', function(data) {
					responseString += data;
					mongoDb.getUserById(db,userId, function(items){
						var expectedResult = items.length;
						var messageonFailure = 'The user with userId: '+userId+' is not created in DB!';
						assertutils.assertEqual(1, expectedResult,"createUser", messageonFailure);
						callback();
					});		
				  });

				  res.on('end', function() {
					var resultObject = JSON.parse(responseString);
				  });
				});

				req.on('error', function(e) {
				  console.log("Create user request failed for some reason");
				});

				req.write(optionsAndUserString[0]);
				req.end();
			});			
		}else{
			var reason = "User already exists in DB and test is skipped"
			fileutils.writeSkippedTestCaseExecution(reportFilePath, "createUser", reason);
			callback();
		}
	});
}

exports.tryToCreateExistingUser = function(callback, url, userId, username){

mongoDb.getUserById(db,userId, function(items){
	var check = items.length;
	if(check == 0){	
		initialize(url, userId, username, 'POST', '/user/create', function(optionsAndUserString){
					
			var req = http.request(optionsAndUserString[1], function(res) {
				res.setEncoding('utf-8');

				var responseString = '';

				res.on('data', function(data) {
					responseString += data;
					
					var req1 = http.request(optionsAndUserString[1], function(res1) {
					res1.setEncoding('utf-8');

					var responseString1 = '';

					res1.on('data', function(data) {
						responseString1 += data;	
						var messageonFailure = "Deduplication check on user creation is not working";
						var expectedResult = '{"error":"User with id = '+userId+ ' already exists in the database"}';
						assertutils.assertEqual(responseString1, expectedResult,"tryToCreateExistingUser", messageonFailure);
						callback();
					});

					res1.on('end', function() {
						var resultObject1 = JSON.parse(responseString1);
						});
					});

					req1.on('error', function(e) {
						console.log("Create user request failed for some reason");
					});

					req1.write(optionsAndUserString[0]);
					req1.end();
					
					
				});

				res.on('end', function() {
					var resultObject = JSON.parse(responseString);
					});
				});

				req.on('error', function(e) {
					console.log("Create user request failed for some reason");
				});

				req.write(optionsAndUserString[0]);
				req.end();	
		});
	}else{
				var reason = "Test data is not created in DB, because already exists in DB"
				fileutils.writeSkippedTestCaseExecution(reportFilePath, "createUser", reason);
				callback();
	}
});
}

exports.deleteUser = function(callback, url, userId){
		
	initialize(url, userId, '', 'POST', '/user/delete', function(optionsAndUserString){
				
		var req = http.request(optionsAndUserString[1], function(res) {
			res.setEncoding('utf-8');

			var responseString = '';

			res.on('data', function(data) {
				responseString += data;
				mongoDb.getUserById(db,userId, function(items){
						var expectedResult = items.length;
						var messageonFailure = 'The user with userId: '+userId+' is not deleted from DB!';
						assertutils.assertEqual(0, expectedResult,"deleteUser", messageonFailure);
						callback();
				});		
			});

			res.on('end', function() {
					var resultObject = JSON.parse(responseString);
				});
		});

		req.on('error', function(e) {
				  console.log("Delete user request failed for some reason");
		});

		req.write(optionsAndUserString[0]);
		req.end();
	});			
}

exports.tryToDeleteUserWithEmptyId = function(callback, url, userId){
		
	initialize(url, userId, '', 'POST', '/user/delete', function(optionsAndUserString){
				
		var req = http.request(optionsAndUserString[1], function(res) {
			res.setEncoding('utf-8');

			var responseString = '';

			res.on('data', function(data) {
				responseString += data;
				var expectedResult = '{"error":"UserID is not passed. Deletion is not executed"}';
				var messageonFailure = 'An eror message for empty ID did not appear!';
				console.log(responseString);
				assertutils.assertEqual(responseString, expectedResult,"tryToDeleteUserWithEmptyId", messageonFailure);
				callback();	
			});
			res.on('end', function() {
					var resultObject = JSON.parse(responseString);
				});
		});

		req.on('error', function(e) {
				  console.log("Delete user request failed for some reason");
		});

		req.write(optionsAndUserString[0]);
		req.end();
	});			
}