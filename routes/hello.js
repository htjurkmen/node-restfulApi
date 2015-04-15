exports.sayHello = function(req, res) {
	console.log({'success': 'Hello World!'});
    res.send('Hello World!');
}