var express = require('express');
var app = express();
var bodyParser = require('body-parser');//for parsing JSON and url-encoded data
var multer = require('multer');//for parsing multipart/form data
var upload = multer();
var session = require('express-session');
var cookieParser = require('cookie-parser');// cookie-parser is a middleware which parses cookies attached to the client request object
var mongoose = require('mongoose');
var routes = require('./routes/');
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;

mongoose.connect('mongodb://localhost:27017/Spyder', {
    useMongoClient: true,
});


// for parsing application/json
app.use(bodyParser.json());

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true }));
//form-urlencoded

// for parsing multipart/form-data
app.use(upload.array());

app.use(cookieParser());
app.use(session({ secret: "Your secret key" }));
app.use('/', routes);

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');



var port = 8083;
app.listen(port, () => {
    console.log("Server listening on port " + port);
});

module.exports = app;