
var express = require('express');
var cfenv = require('cfenv');
var mongoose = require('mongoose');
var morgan = require('morgan'); 
var bodyParser = require('body-parser'); 
var methodOverride = require('method-override'); 

var app = express();

var appEnv = cfenv.getAppEnv();
if (appEnv.bind == 'localhost') {
   mongoose.connect('mongodb://localhost/test');   
} else {
   mongoose.connect('mongodb://techmmgdbdev:techmmgdbdev@ds025180.mlab.com:25180/techmmgdbdev');
}

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', true);
  return next();
});

var db = mongoose.connection;
//checking the mongodb connection
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    //Connected test message on console
    console.log("Server : Mongo database connected successfully");
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

var loginDetail = mongoose.model('login-detail', {
    "email": {
        type: String,
        unique: true
    },
    "confmEmail": String,
    "dateOfBirth": String,
    "password": String,
    "contact": Number,
    "password": String,
});
var addShipping = mongoose.model('add-Shipping', {
    "email": {
        type: String,
        unique: true
    },
    "address": String,
    "country": String,
    "state": String,
    "contact": Number,
    "city": String,
});


app.post('/api/addShippingAddress', function(req, res) {
      console.log("req.body.email"+req.body.email); 
        addShipping.create({
        "email": req.body.email,
        "address": req.body.address,
        "country": req.body.country,
        "state": req.body.state,
        "contact": req.body.contact,
        "city": req.body.city,
    }, function(err, todo) {
        if (err)
            res.send(err);
        else {
            res.send(todo);
        }
    });
});
app.post('/api/updateShippingAddress', function(req, res) {
    addShipping.update({
        "email": req.body.email
    }, {
        $set: {
        "address": req.body.address,
        "country": req.body.country,
        "state": req.body.state,
        "contact": req.body.contact,
        "city": req.body.city
        }
    }, function(err, todo) {
        if (err)
            res.send(err);
        else {
            res.send(todo);
        }
    });
});
app.get('/api/getShippingAddress/:email', function(req, res) {
      console.log("req.body.id"+req.params.email);
    // use mongoose to get all commands in the database
    addShipping.find({ "email": req.params.email},function(err, filenames) {
        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err)
            res.send(err)
            else
        res.send(filenames); // return all fielname in JSON format
    });
   });

/* POST to adduser */

app.post('/api/adduser', function(req, res) {
    loginDetail.create({
        "email": req.body.email,
        "confmEmail": req.body.confmEmail,
        "dateOfBirth": req.body.dateOfBirth,
        "password": req.body.password,
        "contact": req.body.contact,
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
         "productDetails": { 
                "id": Number,
                "productName": String,
                "price": Number,
                "Quantity": Number},
    "email": String      
});
var products = mongoose.model('product', {
     id: Number,
    "productName": String,
    "productPrice": String,
    "productType": String,
    "imagePath":String,
    "productDetails":String,
    "imgs": Object,
     "features": Object
});

app.post('/api/addProduct', function(req, res) {
     console.log("req.body.features"+req.body.features);
    products.create({
        id: req.body.id,
        "productName": req.body.productName,
        "productPrice": req.body.productPrice,
        "productType": req.body.productType,
        "imagePath":req.body.imagePath,
        "productDetails":req.body.productDetails,
        "imgs": req.body.imgs,
         "features": req.body.features
    }, function(err, todo) {
        if (err)
            res.send(err);
        else {
            res.send(todo);
        }
    });
});
app.post('/api/updateProduct', function(req, res) {
     console.log("req.body.productPrice"+req.body.productPrice);
       products.update({
        id: req.body.id
    }, {
        $set: {
        id: req.body.id,
        "productName": req.body.productName,
        "productPrice": req.body.productPrice,
        "productType": req.body.productType,
        "imagePath":req.body.imagePath,
        "productDetails":req.body.productDetails,
        "imgs": req.body.imgs,
         "features": req.body.features
        }
    }, function(err, todo) {
        if (err)
            res.send(err);
        else {
            res.send(todo);
        }
    });

});
app.get('/api/getProduct', function(req, res) {
    
    // use mongoose to get all commands in the database
    products.find({},function(err, filenames) {
        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err)
            res.send(err)
        res.json(filenames); // return all fielname in JSON format
    });
   });
app.get('/api/getPurchase/:email', function(req, res) {
    
    // use mongoose to get all commands in the database
    purchase.find({ email: req.params.email },function(err, filenames) {
        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err)
            res.send(err)
        res.json(filenames); // return all fielname in JSON format
    });
   });
app.post('/api/removeProduct', function(req, res) {
     console.log("req.body.id"+req.body.id);
 products.remove({ id: req.body.id },
                        
    function(err, filenames) {
        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err)
            res.send(err)
        res.json(filenames); // return all fielname in JSON format
    }); 
   });

var purchase = mongoose.model('purchase', {
     "email": String,
     "status": String,
      "productDetails.id": String,
      "productDetails.productName": String,
      "productDetails.price": String,
      "productDetails.Quantity": String
});
app.post('/api/addCart', function(req, res) {
    addCart.create({
         _id: req.body.productDetails.id+req.body.email,
        "productDetails": req.body.productDetails,
        "email": req.body.email     
    }, function(err, todo) {
        if (err)
            res.send(err);
        else {
            res.send(todo);
        }
    });
});
app.post('/api/updateCart', function(req, res) {
    console.log("req.body.id"+req.body.id);
    addCart.update({_id: req.body.id},{$inc: { "productDetails.Quantity": 1 }}, function(err, todo) {
        if (err)
            res.send(err);
        else {
            res.send(todo);
        }
    });

});

app.post('/api/sendEmail', function(req, res) {
    var request = require('request');

//Lets configure and request
request({
    url: 'http://10.10.21.172:3000/send', //URL to hit
   
    method: 'post', //Specify the method
    headers: { //We can define headers too
       'Content-Type': 'application/json'
    },
    // json: {"name":"John", "lastname":"Doe"},
   json:{
                    "from" : req.body.from,
                    "to" : req.body.to,
                    "subject" : req.body.subject,
                    "text" : req.body.text,
                    "html" : req.body.html,
                }  
    
}, function(error, response, body){
   if(error) {
         res.send(error);
    } else {
         res.send(response);
}
});
    


});

app.post('/api/removeCart', function(req, res) {
    console.log("todo[i].productDetails.id"+req.body.name)
    addCart.find({ email: req.body.email }, function(err,todo) {
        for(var i=0;i<todo.length;i++){
            console.log("todo[i].productDetails.id"+todo[i].productDetails.id)
        purchase.create({
            "email": todo[i].email,
            "productDetails.id":todo[i].productDetails.id,
            "productDetails.productName":todo[i].productDetails.productName,
            "productDetails.price":todo[i].productDetails.price,
            "productDetails.Quantity":todo[i].productDetails.Quantity,
            "status":"submit"
     });
      
        }
               addCart.remove({ email: req.body.email },
                        
    function(err, filenames) {
        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err)
            res.send(err)
        res.json(filenames); // return all fielname in JSON format
    });  
});
    });


app.get('/api/getCart/:email', function(req, res) {
    
    // use mongoose to get all commands in the database
    addCart.find({ "email": req.params.email},
                        
    function(err, filenames) {
        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err)
            res.send(err)
        res.json(filenames); // return all fielname in JSON format
    });
   });
app.get('/api/getHistory/:email', function(req, res) {
    
    // use mongoose to get all commands in the database
    purchase.find({ "email": req.params.email},
                        
    function(err, filenames) {
        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err)
            res.send(err)
        res.json(filenames); // return all fielname in JSON format
    });
   });
app.post('/api/statusUpdate', function(req, res) {
    
      purchase.update({
        _id: req.body.id
    }, {
        $set: {
            "status": req.body.status
        }
    }, function(err, todo) {
        if (err)
            res.send(err);
        else {
            res.send(todo);
        }
    });
   });
app.post('/api/updateUser', function(req, res) {
    loginDetail.update({
        "email": req.body.email
    }, {
        $set: {
            "dateOfBirth": req.body.dateOfBirth,
            "password": req.body.password,
            "contact": req.body.contact,
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
app.get('/api/getSingleUser/:email', function(req, res) {
    
    // use mongoose to get all commands in the database
    loginDetail.findOne({ "email": req.params.email},
                        
    function(err, filenames) {
        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err)
            res.send(err)
        res.json(filenames); // return all fielname in JSON format
    });
   });


app.get('/', function(req, res) {
    res.redirect('/index.html');
});

var host;
var port;
if (appEnv.bind == 'localhost') {
  port = 9005;
  host = '10.10.20.209';
} else {
  port = appEnv.port;
  host = appEnv.bind;
}

var server = app.listen(port, host, function() {
  console.log("server starting on host --- " + host);
  console.log("server starting on port --- " + port);
});