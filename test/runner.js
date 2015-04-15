var http = require('http');
var hello = require('./testscripts/hello');
var usersApi = require('./testscripts/usersApi');
var fileutils = require('./utils/fileutils');
var mongoDb = require('../routes/dbUtils');
var async = require('async');

reportFilePath = 'C:\\Users\\hjusein\\Desktop\\work\\Training\\nodeJStraining\\restfulApi\\test\\report\\results.log';
htmlReportFilePath = 'C:\\Users\\hjusein\\Desktop\\work\\Training\\nodeJStraining\\restfulApi\\test\\report\\execution_report.html';
var hostWithPort = 'http://localhost:3001';
var host = 'localhost';

async.series([
	function (callback){
		console.log("Database cleaning started....");
		var db = mongoDb.getDbInstance();
		mongoDb.cleanUpDatabase(function(){console.log("Database cleaning finished."); callback(); },db);
	},
	function (callback){
		console.log("File created");	
		fileutils.createFile(function(){console.log("File creation finished."); callback(); }, reportFilePath);
	},
	function (callback){
		console.log("Task 1 started...");	
		hello.testHelloWorld(function(){console.log("Task 1 finished"); callback();},hostWithPort);
	},
	function (callback){
		console.log("Task 2 started...");
		hello.testHelloWorld1(function(){console.log("Task 2 finished");callback();}, hostWithPort);
	},
	function(callback){
		console.log("Task 3 started...");	
		usersApi.createUser(function(){console.log("Task 3 finished"); callback();}, host, '1', 'testuser1');
	},
	function(callback){
		console.log("Task 4 started...");	
		usersApi.tryToCreateExistingUser(function(){console.log("Task 4 finished"); callback();}, host, '2', 'testuser2');
	},
    function(callback){
		console.log("Task 5 started...");
		usersApi.getAllUsers(function(){console.log("Task 5 finished"); callback();}, hostWithPort);
	},
	function(callback){
		console.log("Task 6 started...");
		usersApi.deleteUser(function(){console.log("Task 6 finished"); callback();}, host, '1');
	},
	function(callback){
		console.log("Task 7 started...");
		usersApi.tryToDeleteUserWithEmptyId(function(){console.log("Task 7 finished"); callback();}, host);
	},
    function(callback){
		console.log("Html report preparation started...");
		fileutils.generateHtmlReport(function(){console.log("\nHtml Report Created"); callback();}, reportFilePath);
	}
]);
