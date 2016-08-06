
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
//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
var sendgrid  = require('sendgrid').SendGrid('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');
var helper = require('sendgrid').mail;

var app = express();

var compression = require('compression');

app.use(compression()); //use compression

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



//for sendgrid intergration
// using SendGrid's Node.js Library
app.post('/book',function(req,res,next){
  console.log(req.body);
  var message = "New Booking Received <br> Name : <strong>"+req.body.name
                + " </strong> <br> Phone : <strong> "+req.body.phone+"</strong> <br>"
                + " Email : <strong> "+ req.body.email + "</strong><br>"
                + " Vechile Model : <strong>"+req.body.vechile+"</strong><br>"
                + " Location : <strong>"+req.body.location+"</strong><br>"
                + " Problem : <strong>"+req.body.problem;
  var requestBody = {
    "personalizations" : [
      {
        "to" : [
          {
            "email" : "themegamech@gmail.com",
            "name" : "Megamech"
          }
        ]
      },
    ],
    "from" : {
      "name" : req.body.name,
      "email" : req.body.email
    },
    "reply_to" : {
      "name" : req.body.name,
      "email" : req.body.email
    },
    "subject" : "New Booking Received",
    "content" : [
      {
        "type" : "text/html",
        "value" : message
      }
    ]
  };
  var request = sendgrid.emptyRequest();
  request.method = 'POST';
  request.path = '/v3/mail/send';
  request.body=requestBody;
  sendgrid.API(request,function(response){
    console.log(response.statusCode);
    console.log(response.body);
    console.log(response.headers);
    message = "Thank You for choosing Megamech. You gave the following details to us"
                  + " <br> Name : <strong>"+req.body.name
                  + " </strong> <br> Phone : <strong> "+req.body.phone+"</strong> <br>"
                  + " Email : <strong> "+ req.body.email + "</strong><br>"
                  + " Vechile Model : <strong>"+req.body.vechile+"</strong><br>"
                  + " Location : <strong>"+req.body.location+"</strong><br>"
                  + " Problem : <strong>"+req.body.problem+"</strong><br>"
                  + " Your Booking has been received. <br> "
                  + " The Megamech team will reach out to you soon.";
    var requestBody = {
      "personalizations" : [
        {
          "to" : [
            {
              "email" : req.body.email,
              "name" : req.body.name
            }
          ]
        },
      ],
      "from" : {
        "name" : "Megamech",
        "email" : "themegamech@gmail.com"
      },
      "reply_to" : {
        "name" : "Megamech",
        "email" : "themegamech@gmail.com"
      },
      "subject" : "Thank You for choosing Megamech",
      "content" : [
        {
          "type" : "text/html",
          "value" : message
        }
      ]
    };
    request.body=requestBody;
    sendgrid.API(request,function(response){
      console.log(response);
      res.status=200;
      res.send("Booking Succesfully Done");
    });
  });
});
app.post('/contactus',function(req,res,next){
  console.log(req.body.email + req.body.name+req.body.message);
  var requestBody = {
    "personalizations" : [
      {
        "to" : [
          {
            "email" : "themegamech@gmail.com",
            "name" : "Megamech"
          }
        ]
      }
    ],
    "from" : {
      "name" : req.body.name,
      "email" : req.body.email
    },
    "reply_to": {
      "name" : req.body.name,
      "email" : req.body.email
    },
    "subject" : "Contact Us Mail " + req.body.subject,
    "content" : [
      {
        "type" : "text/plain",
        "value" : 'Message from '+ req.body.name+' < '+req.body.email+ ' > ' + " Phone : " + req.body.phone
        +' : ' + req.body.message
      }
    ]
  };
  var request = sendgrid.emptyRequest();
  request.method = 'POST';
  request.path = '/v3/mail/send';
  request.body = requestBody;
  sendgrid.API(request, function (response) {
    console.log(response.statusCode);
    console.log(response.body);
    console.log(response.headers);
    var requestBody = {
      "personalizations" : [
        {
          "to" : [
            {
              "email" : req.body.email,
              "name" : req.body.name
            }
          ]
        },
      ],
      "from" : {
        "name" : "Megamech",
        "email" : "themegamech@gmail.com"
      },
      "reply_to": {
        "name" : "Megamech",
        "email" : "megamech@gmail.com"
      },
      "subject" : "Contact Us Mail from Megamech",
      "content" : [
        {
          "type" : "text/plain",
          "value" : "Thank You for connecting with us. We will get back to you shortly."
        }
      ]
    };
    var request = sendgrid.emptyRequest();
    request.method = 'POST';
    request.path = '/v3/mail/send';
    request.body = requestBody;
    sendgrid.API(request, function (response) {
      console.log(response.statusCode);
      console.log(response.body);
      console.log(response.headers);
      res.status=200;
      res.send({msg:"Your mail has been succesfully sent"});
    });
  });
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.redirect('/404.html')
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.get('/', function (req, res) {
  res.send('Hello World!');
});

//app.listen(3000, function () {
  // console.log('Example app listening on port 3000!');
// });

module.exports = app;
