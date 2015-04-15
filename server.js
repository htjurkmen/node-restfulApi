var express = require('express');
var hello = require('./routes/hello');
var users = require('./routes/users');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.get('/hello', hello.sayHello);
app.get('/user/all', users.getAll);
app.post('/user/create', users.createUser);
app.post('/user/delete/', users.deleteUser);
 
app.listen(3001);
console.log('Listening on port 3001...');