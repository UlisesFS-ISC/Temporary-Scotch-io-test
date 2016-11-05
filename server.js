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

var DATABASE_URL= "mongodb://Ulises:timerbolt4real@ds143767.mlab.com:43767/timerbolt";
mongoose.connect(DATABASE_URL); // connect to database
app.set('superSecret', 'blundell'); // secret variable


// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));

// make express look in the public directory for assets (css/js/img)
app.use(express.static(__dirname + '/public'));

var port = process.env.PORT || 8080; // used to create, sign, and verify tokens
app.listen(port, function(){
  console.log("Express server listening on port:" + port);
});

app.get('/', function(req,res){
	res.send('Hello this API is at  change3   '+ port+'/api');
});

app.all('*', function(req, res, next) {
   res.header('Access-Control-Allow-Origin', "*");
   res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With, token");
   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
   res.header("Access-Control-Request-Headers", "token");
   next();
});