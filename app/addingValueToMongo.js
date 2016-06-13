var express = require('express');
var app = express();
var mongoose = require('mongoose'); 

var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)

//creating connection with mongoose
mongoose.connect('mongodb://localhost/rockrock')


var db=mongoose.connection;

//checking the mongodb connection
db.on('error',console.error.bind(console,'connection error:'));
db.once('open',function(){
    //Connected test message on console
    console.log("database connected successfully");
});

var en = mongoose.model('en', {
    	"key": String,
        "value": String,
        "description":String
});

var product = mongoose.model('product', {
     id: Number,
"productName": String,
"productPrice": String,
"productType": String,
"imagePath":String,
"productDetails":String,
"imgs": {"url": String},
 "features": { "name" :String, "details" : String}
});

var a = [1,2];

for (x in  a){
    //entering data in temp file name
    product.create({
	 id: 12,
"productName": "micromax-canvas-knight-2",
"productPrice": "600",
"productType": "Handset",
"imagePath":"images/Phone-Imges/micromax-canvas-knight-2.jpg",
"productDetails":"micromax-canvas-knight-2 provies best calling facility",
"imgs": [
    {
      "url": "images/front_image.jpg"
    },
    {
      "url": "images/side-left.jpg"
    },
    {
      "url": "images/side-right.jpeg"
    },
    {
      "url": "images/back-view.jpeg"
    }
  ],
 "features": [
    {
      "name": "camera",
      "details": "Primary: 20MP, Secondary: 7MP"
    },
    {
      "name": "Internal Memory",
      "details": "32GB"
    },
    {
      "name": "RAM",
      "details": "4GB"
    },
    {
      "name": "Battery",
      "details": "4300mAh"
    }
  ]
 }, function(err, todo) {
        console.log(err)
    });
  
}

console.log("Data Entry Done in Database RogersApp");
