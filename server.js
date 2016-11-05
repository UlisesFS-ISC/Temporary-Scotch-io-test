var express = require('express');
var app = express();

var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');

var jwt    = require('jsonwebtoken'); 

// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 8080;

// set the view engine to ejs
app.set('view engine', 'ejs');

// make express look in the public directory for assets (css/js/img)
app.use(express.static(__dirname + '/public'));

var port = process.env.PORT || 8080; // used to create, sign, and verify tokens
app.listen(port, function(){
  console.log("Express server listening on port: " + port);
});

app.get('/', function(req,res){
	res.send('Hello this API is at '+ port+'/api');
});