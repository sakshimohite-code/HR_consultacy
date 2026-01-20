var express = require('express');
var bodyParser = require('body-parser');
var fileupload = require('express-fileupload');
var session = require('express-session');

var admin = require('./routes/admin');
var user = require('./routes/user');
var admin_login = require('./routes/admin_login');

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(fileupload());

app.use(session({
    secret: 'ABCD56789',
    resave: true,
    saveUninitialized: true
}));

app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

app.use('/admin', admin);
app.use('/', user);
app.use('/admin_login', admin_login);

app.listen(1000, () => {
    console.log("Server running on port 1000");
});
