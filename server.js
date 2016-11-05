var express = require('express');
var app = express();

var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');

var jwt    = require('jsonwebtoken'); 
var User   = require('./app/models/user');
var Entry   = require('./app/models/entry'); // get our mongoose models

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
	res.send('Hello this API is at  change4   '+ port+'/api');
});

app.all('*', function(req, res, next) {
   res.header('Access-Control-Allow-Origin', "*");
   res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With, token");
   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
   res.header("Access-Control-Request-Headers", "token");
   next();
});

app.post('/signup', function(req, res) {
  if (!req.body.name || !req.body.password || !req.body.email) {
    res.json({success: false, msg: 'Please pass all the information needed.'});
  } else {
    console.log(1);
    var newUser = new User({
      name: req.body.name,
      password: req.body.password,
      email: req.body.email,
      admin:false
    });
    // save the user
    newUser.save(function(err) {
      if (err) {
        return res.json({success: false, msg: 'Username already exists.'});
      }
      res.json({success: true, msg: 'Successfully created new user.'});
    });
  }
});


app.post('/authenticate', function(req, res) {
  User.findOne({
    name: req.body.name
  }, function(err, user) {
    if (err) throw err;
 
    if (!user) {
      res.send({success: false, msg: 'Authentication failed. User not found.'});
    } else {
      // check if password matches
      user.comparePassword(req.body.password,req.body.name, function (err, isMatch) {
        if (isMatch && !err) {
          // if user is found and password is right create a token
          var token = jwt.sign(user, config.secret);
          // return the information including token as JSON
          res.json({success: true, token: token});
        } else {
          res.send({success: false, msg: 'Authentication failed. Wrong password.'});
        }
      });
    }
  });
});

var apiRoutes=express.Router();

  
apiRoutes.use(function(req, res, next) {


  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers.token;
  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, app.get('superSecret'), function(err, decoded) {

      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });    
      } else {
        // if everything is good, save to request for use in other routes
        req.body.user=decoded._doc.name;
        req.body.email=decoded._doc.email;
        req.decoded = decoded;    
        next();
      }
    });

  } else {
    // if there is no token
    // return an error
    return res.status(403).send({ 
        success: false, 
        message: 'No token provided.' 
    });
    
  }
});

app.use('/api', apiRoutes);




//*****************Token Entry only

apiRoutes.get('/chronoInfo', function(req, res) { 
  Entry.find({'user':req.body.user,'email':req.body.email }, function(err, entries) {
    res.send({msg: entries});
  });
}); 

apiRoutes.post('/insertActivity', function(req, res) {
  if (!req.body.name || !req.body.timeelapsed || !req.body.user || !req.body.email) {
    res.json({success: false, msg: 'Please pass all the information required.'});
  } else {
    console.log(1);
    var newEntry = new Entry({
      name: req.body.name,
      timeelapsed: req.body.timeelapsed,
      user: req.body.user,
      email: req.body.email,
      dateposted: new Date()
    });
    // save the user
    newEntry.save(function(err) {
      if (err) {
        return res.json({success: false, msg: 'Entry already exists.'});
      }
      res.json({success: true, msg: 'Successfully inserted new Entry.'});
    });
  }
});

apiRoutes.post('/removeActivity', function(req, res) {

  Entry.remove(req.body, function(err, result) {
    if (err) throw err;
 
    if (!result) {
      res.send({success: false, msg: 'Deletion failed. Entry not found.'});
    } else {
      // check if password matches
      res.json({success: true, msg: 'Successfully deleted an Entry.'});
    }
  });
});