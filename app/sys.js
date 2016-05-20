var express = require('express');
var app = express();
var mongoose = require('mongoose');
//var validator = require('validator');
var morgan = require('morgan'); // log requests to the console (express4)
var bodyParser = require('body-parser'); // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
//creating connection with mongoose
mongoose.connect('mongodb://localhost/SYS')
    //mongoose.connect('mongodb://root:sukhoi123@localhost/local')
var db = mongoose.connection;
//checking the mongodb connection
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    //Connected test message on console
    console.log("Server : Mongo database connected successfully");
});

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type, Authorization, Cache-Control');
  res.setHeader('Access-Control-Allow-Credentials', true);
  return next();
});

//configurations
app.use(express.static(__dirname + '/')); // set the static files location /public/img will be /img for users
app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.urlencoded({
    'extended': 'true'
})); // parse application/x-www-form-urlencoded                              
app.use(bodyParser.json({
    type: 'application/vnd.api+json'
})); // parse application/vnd.api+json as json
app.use(methodOverride());
//defining model for command to intract with REST
//format provide for the collections is 
//{"to-destination":"6477462814","from-destination":"vocal.backend.telus.com","command-//type":"upgrade","container":"apk","filename":"f-name"}
//var commandsCollection = mongoose.model('commands-collection', {
var loginDetail = mongoose.model('login-detail', {
    "firstName": String,
    "email": {
        type: String,
        unique: false
    },
    "password": String,
    "contact": Number,
    "Address": String,
});

var tempFileName = mongoose.model('tempFileName', {
    _id: Number,
    __v: String,
    "fileName": String
});
var hobbyDetail = mongoose.model('hobby-Detail', {
    _id:String,
    "query": {
        "index": Number,
        "name": String,
        "locationUrl": String
    },
    "location": String,
    "description": String,
    "availableDays": String,
    "charge": String,
     "email": {
        type: String,
        unique: false
    }
});
app.get('/api/getService/:email', function(req, res) {

    // use mongoose to get all commands in the database
    hobbyDetail.find({
            "email": req.params.email
        },

        function(err, data) {
            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)
                else{
            res.json(data); 
                }// return all fielname in JSON format
        });
});
app.post('/api/deleteHobby', function(req, res) {
    console.log("req.params.id" + req.body.id);
    hobbyDetail.remove({
           // _id:req.body.email + req.body.query.name
        _id: req.body.id
        },
        function(err, filenames) {
            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)
            res.json(filenames); // return all fielname in JSON format
        });
});
app.post('/api/addHobby', function(req, res) {
    hobbyDetail.create({
        _id:req.body.email + req.body.query.name,
        "query": req.body.query,
        "location": req.body.location,
        "description": req.body.description,
        "availableDays": req.body.availableDays,
        "charge": req.body.charge,
        "email": req.body.email
    }, function(err, todo) {
        if (err)
            res.send(err);
        else {
            res.send(todo);
        }
    });
});
app.post('/api/updateHobby', function(req, res) {
    hobbyDetail.update({
	   "email": req.body.email
	},{ 
	$set: {
        "location": req.body.location,
        "description": req.body.description,
        "availableDays": req.body.availableDays,
        "charge": req.body.charge,
        "email": req.body.email
		}
    }, function(err, todo) {
        if (err)
            res.send(err);
        else {
            res.send(todo);
        }
    });
});
var addCart = mongoose.model('add-cart', {
    _id: String,
    "totalBuy": {
        "availableDays": String,
        "charge": Number,
        "description": String,
        "email": String
    },
    "loggedEmail": String,
});
var purchase = mongoose.model('purchase', {
     _id: String,
     "loggedEmail": String,
      "totalBuy.availableDays": String,
      "totalBuy.charge": String,
      "totalBuy.description": String,
      "totalBuy.email": String
});
app.post('/api/addCart', function(req, res) {
    console.log("req.body.loggedEmail," + req.body.totalBuy.email)
    addCart.create({
        _id: req.body.loggedEmail + req.body.totalBuy.email,
        "totalBuy": req.body.totalBuy,
        "loggedEmail": req.body.loggedEmail
    }, function(err, todo) {
        if (err)
            res.send(err);
        else {
            res.send(todo);
        }
    });
});
app.get('/api/getCart/:email', function(req, res) {

    // use mongoose to get all commands in the database
    addCart.find({
            "loggedEmail": req.params.email
        },

        function(err, data) {
            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)
                else{
            res.json(data); 
                }// return all fielname in JSON format
        });
});
app.get('/api/getCartHistory/:email', function(req, res) {
console.log("req.params.loggedEmail"+req.params.email);
    // use mongoose to get all commands in the database
    purchase.find({
            "loggedEmail": req.params.email
        },

        function(err, data) {
            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)
                else{
            res.json(data); 
                }// return all fielname in JSON format
        });
});
app.post('/api/removeCart', function(req, res) {
    console.log("req.params.id" + req.body.id);
    addCart.remove({
            _id: req.body.id
        },
        function(err, filenames) {
            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)
            res.json(filenames); // return all fielname in JSON format
        });
});

app.post('/api/deleteCart', function(req, res) {
     console.log("loggedEmadsfsdfdfil"+req.body.loggedEmail)
    addCart.find({ loggedEmail: req.body.loggedEmail }, function(err,todo) {
        for(var i=0;i<todo.length;i++){
            console.log("loggedEmail"+todo[i].loggedEmail)
        purchase.create({
             _id: todo[i].loggedEmail+todo[i].totalBuy.email,
            "loggedEmail": todo[i].loggedEmail,
            "totalBuy.availableDays":todo[i].totalBuy.availableDays,
            "totalBuy.charge":todo[i].totalBuy.charge,
            "totalBuy.description":todo[i].totalBuy.description,
            "totalBuy.email":todo[i].totalBuy.email,
         
     });
      
        }
               addCart.remove({ loggedEmail: req.body.loggedEmail },
                        
    function(err, filenames) {
        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err)
            res.send(err)
        res.json(filenames); // return all fielname in JSON format
    });  
});
    });
// generating our Express routes to handle our API calls
/*
 * POST to adduser.
 */

app.post('/api/adduser', function(req, res) {
    loginDetail.create({
        "firstName": req.body.name,
        "email": req.body.email,
        "password": req.body.password,
        "contact": req.body.phone,
    }, function(err, todo) {
        if (err)
            res.send(err);
        else {
            res.send(todo);
        }
    });
});

app.post('/api/updateUser', function(req, res) {
    console.log("req.body.Address" + req.body.Address)
    loginDetail.update({
        "email": req.body.email
    }, {
        $set: {
            "firstName": req.body.firstName,
            "contact": req.body.contact,
            "Address": req.body.Address
        }
    }, function(err, todo) {
        if (err)
            res.send(err);
        else {
            res.send(todo);
        }
    });
});
//to get the filname and container information to the user.

//to get the filname and container information to the user.
app.get('/api/getSingleUser/:email', function(req, res) {

    // use mongoose to get all commands in the database
    loginDetail.findOne({
            "email": req.params.email
        },

        function(err, filenames) {
            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)
            res.json(filenames); // return all fielname in JSON format
        });
});

//to get the filname and container information to the user.
app.get('/api/getHobby/:hobby', function(req, res) {
    // use mongoose to get all commands in the database
    hobbyDetail.find({
        "query.name": req.params.hobby
    }, {
        _id: false,
        __v: false
    }, function(err, filenames) {
        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err)
            res.send(err)
        res.json(filenames); // return all fielname in JSON format
    });
});

app.get('/api/getPhone', function(req, res) {
    // use mongoose to get all commands in the database
    phone.find({}, {
        _id: false,
        __v: false
    }, function(err, filenames) {
        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err)
            res.send(err)
        res.json(filenames); // return all fielname in JSON format
    });
});

app.get('/', function(req, res) {
    res.redirect('/index.html');
});
//app.listen(8080);
var server = app.listen(9006, function() {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
})