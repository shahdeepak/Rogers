var express = require('express');
var nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport")
var app = express();

var smtpTransport = nodemailer.createTransport(smtpTransport({
    host : "PUNEXCHMBX001.techmahindra.com",
                authMethod:'NTLM',
            secure:false,
            tls: {rejectUnauthorized: false},
            debug:true
  //  secureConnection : false,
   // port: 25,
   // auth : {
      //  user : "YourEmail",
      //  pass : "YourEmailPassword"
  //  }
}));
app.get('/send',function(req,res){
    var mailOptions={
        from : "GJ00437070@techmahindra.com",
        to : "AP00349479@techmahindra.com",
        subject : "NODE SE AAYA hu MAIL..LE CHUtiye",
        
    }
    console.log(mailOptions);
    smtpTransport.sendMail(mailOptions, function(error, response){
        if(error){
            console.log(error);
            res.end("error");
        }else{
            console.log(response.response.toString());
            console.log("Message sent: " + response.message);
            res.end("sent");
        }
    });
});

app.listen(3000,function(){
    console.log("Express Started on Port 3000");
});
