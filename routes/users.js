var mongoDb = require('./dbUtils');

var db = mongoDb.createDbInstance();
 
exports.createUser = function(req, res) {

	var id = req.body.id;
    var username = req.body.username;
			
	if(typeof username != 'undefined' && typeof id != 'undefined' && id.length > 0 && username.length > 0){
		db.collection('users', function(err, collection) {			
			collection.find({id: id}).toArray(function(err, items) {
				var recordsWithSameId = items;
				if(recordsWithSameId.length == 0){
					console.log('Adding user: ' + JSON.stringify(username));
					collection.insert({ id: id, username: username }, {safe:true}, function(err) {
						if (err) {
							res.status(500);
							res.send({'error':'An error has occurred'});
						} else {								
							console.log({'success' :'User with id= ' + id +' is added in the database'});
							res.status(201);
							//res.send({'success': 'User with id= ' + id +' is added in the database.'});	
							var userCreated = JSON.stringify({id: id, username: username});			
							res.send(userCreated);							
						}
					});
				}else{
					res.status(409);
					res.send({'error':'User with id = '+id+' already exists in the database'});
				}
			});
		});
	}else{
		res.status(400);
		res.send({'error:':'UserID or Username is empty.Record is not created in the database'});
	}
}

exports.deleteUser = function(req, res) {
    var id = req.body.id;
    console.log('Deleting user: ' + id);
	
	if(typeof id != 'undefined' && id.length > 0){	
		db.collection('users', function(err, collection) {
			collection.remove({ id: id}, {safe:true}, function(err) {
				if (err) {
					res.status(500);
					res.send({'error':'An error has occurred'});
				} else {
					console.log({'success': 'User with id= ' + id +' is deleted from the database'});
					res.send({'success': 'User with id= ' + id +' is deleted from the database'});
				}
			});
		});
	}else{
		res.status(400);
		res.send({'error': 'UserID is not passed. Deletion is not executed'});
	}
}

exports.getAll = function(req, res) {
    db.collection('users', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
			console.log('{"success" : "All users returned."}');
        });
    });
};