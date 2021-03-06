var express = require('express');
var app = express();

var mongojs = require('mongojs');
var mongodbString = 'mongodb://' + process.env.MONGOLAB_URI + '?auto_reconnect=true';
var db = mongojs(mongodbString,['contactlist']);

var bodyParser = require('body-parser');

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());


app.get('/contactList', function(req, res) {
	db.contactlist.find(function(err, docs) {
		console.log(docs);
		res.json(docs);
	});
});
app.post('/contactList', function(req, res) {
	console.log(req.body);
	db.contactlist.insert(req.body, function(err, doc) {
		res.json(doc);
	});
});

app.delete('/contactlist/:id', function(req, res) {
	var id = req.params.id;
	console.log(id);
	db.contactlist.remove({_id: mongojs.ObjectId(id)}, function(err, doc) {
		res.json(doc);
	});
});

app.get('/contactList/:id', function(req, res) {
	var id = req.params.id;
	console.log(id);
	db.contactlist.findOne({_id : mongojs.ObjectId(id)}, function(err, docs) {
		res.json(docs);
	});
});

app.put('/contactList/:id', function(req, res) {
	var id = req.params.id;
	console.log(req.body.name);
	db.contactlist.findAndModify({ query : {_id : mongojs.ObjectId(id)}, 
		update : {$set : {name: req.body.name, email: req.body.email, number: req.body.number}},
		new: true}, function(err, doc) {
			res.json(doc);
	});
});

app.listen(process.env.PORT || 5000);
console.log("Server running on port");
