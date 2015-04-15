var mongo = require('mongodb');

var initialize = function(){
	var Server = mongo.Server,
	Db = mongo.Db,
	BSON = mongo.BSONPure;
	var server = new Server('localhost', 27017, {auto_reconnect: true});
	var db = new Db('restfulApiDB', server);
	return db;
}

exports.getDbInstance = function(){
	var db = initialize();
	return db;
}

exports.createDbInstance = function(){
	var db = initialize();
	db.open(function(err, db) {
		if(!err) {
			console.log("Connected to 'restfulApiDB' database");
			db.createCollection('users', function(err, collection) {});
		}
	});
	return db;
}

exports.getAllUsersFromDb = function(db,callback){
	db.open(function(err, db) {
		if(!err) {
			db.collection('users', function(err, collection) {
				collection.find().toArray(function(err, items) {
				callback(items);
				db.close();
				});
			});
		}
	});
}

exports.cleanUpDatabase = function(callback,db){
	db.open(function(err, db) {
		if(!err) {
			db.collection('users', function(err, collection) {
				collection.remove({});
				callback();
				db.close();
			});
		}
	});
}

exports.getUserById = function(db,userId,callback){
	db.open(function(err, db) {
		if(!err) {
			db.collection('users', function(err, collection) {
				collection.find({id: userId}).toArray(function(err, items) {
				callback(items);
				db.close();
				});
			});
		}
	});
}

