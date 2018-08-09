/**
 * @file server.js
 * #Hive project core webservice
 *
 * DO NOT EDIT IF YOU DO NOT KNOW WHAT YOU ARE DOING
 */
//////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * @EXPRESS
 */
var express = require("express"),
    app = express();

/**
 * @MYSQL
 */
var mysql = require('mysql');
/**
 * @csurf
 */
var csrf = require('csurf');
/**
 * @Client-Session
 */
var sessions = require("client-sessions");
/**
 * @cookie-parser
 * @body-parser
 */
var cookieParser = require('cookie-parser');
var bodyParser = require("body-parser");
//////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * @Configuration
 */
var port = process.env.PORT || 8080;
var con = mysql.createConnection({
    host: "sl-us-south-1-portal.30.dblayer.com",
    port: "52603",
    user: "admin",
    password: "OKVUNZLWUSILFSNB",
    database: "hivedb"
});
//////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * @middlewares
 */
var csrfProtection = csrf({cookie: true});
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());
var encrypt = require('./library/encryption');
/* Default Route. Static middleware */
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/public/backend'));
//////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * //START THE DATABASE CONNECTION
 */
con.connect();
//////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * @Routes
 */
/*
*  Login Part
*  Note: The default backend should check session status, if fail (unlogin), then should go to here.
* */
app.get("/login", function (request, response) {
    response.sendFile(__dirname + '/public/backend/login.html');
});

app.post('/loginsubmit', function (req, res) {
    //Check the db if login confirmed
    //1. Get rid of BS submit
    //2. Return
    //console.log(req.body.username);
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
        res.sendFile(__dirname + '/public/backend/login.html');
    }
    var logintype = req.body.logintype;
    var username = req.body.username;
    var password = encrypt.sha1hash(req.body.password);
    if (logintype === 0)
    //0 means patient and 1 means doctor
    {
        con.query('SELECT * from patients WHERE username = \"' + username + '\" AND password = \"' + password + '\"', function (err, rows, fields) {
            if (!err) {
                console.log(rows[0]);
                if (rows.length > 0 && rows[0].username === username) {
                    //Login fine
                    res.sendFile(__dirname + '/public/backend/dashboard.html');
                }
                else {
                    //Fail
                    res.sendFile(__dirname + '/public/backend/login.html');
                }
            }
            else {
                //ERROR
                res.sendFile(__dirname + '/public/backend/login.html');
            }
        });
    }
    else {
        con.query('SELECT * from doctors WHERE username = \"' + username + '\" AND password = \"' + password + '\"', function (err, rows, fields) {
            if (!err) {
                console.log(rows);
                if (rows.length > 0 && rows[0].username === username) {
                    //Login fine
                    res.sendFile(__dirname + '/public/backend/dashboard.html');
                }
                else {
                    //Fail
                    res.sendFile(__dirname + '/public/backend/login.html');
                }
            }
            else {
                //ERROR
                res.sendFile(__dirname + '/public/backend/login.html');
            }

        });
    }
});

/*
*  Register Part
*  Note: The default backend should check session status, if fail (unlogin), then should go to here.
* */

app.get("/register", function (request, response) {
    response.sendFile(__dirname + '/public/backend/register.html');
});

app.post('/registersubmit', function (req, res) {
    //Check the db if register confirmed
    //1. Get rid of BS submit
    //2. Get check existed
    //3. Register
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
        res.sendFile(__dirname + '/public/backend/register.html');
    }
    //Register type: 0 means patient and 1 means doctor
    /*
    var registertype = req.body.registertype;
    //General Information
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var address = req.body.address;
    var suburb = req.body.suburb;
    var postcode = req.body.postcode;

    var country = req.body.country;
    var dateofbirth = req.body.dateofbirth;
    var phoneno = req.body.phoneno;
    //For later login
    var username = req.body.username;
    var password = encrypt.sha1hash(req.body.password);
    var email = req.body.email;
*/
    registertype = 1;
    //General Information
    firstname = "Petty";
    lastname = "Citizen";
    address = "Monash High Way";
    suburb = "Mont waverley";
    postcode = "3133";

    country = "AU";
    dateofbirth = "21081955";
    phoneno = "0450720711";
    //For later login
    username = "doctor";
    password = encrypt.sha1hash("password");
    email = "test@test.com";

    if (registertype === 0)
    //0 means patient and 1 means doctor
    {
        con.query('SELECT * from patients WHERE username = \"' + username + '\" OR email = \"' + email + '\"', function (err, rows, fields) {
            if (!err) {
                console.log(rows);
                if (rows.length > 0) {
                    //duplicate username
                    res.sendFile(__dirname + '/public/backend/login.html');
                }
                else {
                    //INSERT INTO patients (phoneno, email, username, password)
                    // VALUES (value1, value2, value3,...)
                    //INSERT INTO customers (name, address) VALUES ('Company Inc', 'Highway 37')
                    con.query("INSERT INTO patients (username,password,firstname,lastname,address,suburb,postcode,country," +
                        "dateofbirth,phoneno,email) VALUES ('" + username + "','" + password + "','" + firstname + "','" +
                        lastname + "','" + address + "','" + suburb + "','" + postcode + "','" + country + "','" +
                        dateofbirth + "','" + phoneno + "','" + email + "')",
                        function (err, rows, fields) {
                            if (!err) {
                                console.log(rows[0]);
                                if (rows.length > 0 && rows[0].username === username) {
                                    //Login fine
                                    res.sendFile(__dirname + '/public/backend/dashboard.html');
                                }
                                else {
                                    //Fail
                                    res.sendFile(__dirname + '/public/backend/register.html');
                                }
                            }
                            else {
                                //ERROR
                                res.sendFile(__dirname + '/public/backend/register.html');
                            }
                        });
                }
            }
            else {
                //ERROR
                console.log(err);
                res.sendFile(__dirname + '/public/backend/register.html');
            }
        });

    }
    else {
        con.query('SELECT * from doctors WHERE username = \"' + username + '\" OR email = \"' + email + '\"', function (err, rows, fields) {
            if (!err) {
                console.log(rows);
                if (rows.length > 0) {
                    //duplicate username
                    res.sendFile(__dirname + '/public/backend/login.html');
                }
                else {
                    //INSERT INTO patients (phoneno, email, username, password)
                    // VALUES (value1, value2, value3,...)
                    //INSERT INTO customers (name, address) VALUES ('Company Inc', 'Highway 37')
                    con.query("INSERT INTO patients (username,password,firstname,lastname,address,suburb,postcode,country," +
                        "dateofbirth,phoneno,email) VALUES ('" + username + "','" + password + "','" + firstname + "','" +
                        lastname + "','" + address + "','" + suburb + "','" + postcode + "','" + country + "','" +
                        dateofbirth + "','" + phoneno + "','" + email + "')",
                        function (err, rows, fields) {
                            if (!err) {
                                console.log(rows[0]);
                                if (rows.length > 0 && rows[0].username === username) {
                                    //Login fine
                                    res.sendFile(__dirname + '/public/backend/dashboard.html');
                                }
                                else {
                                    //Fail
                                    res.sendFile(__dirname + '/public/backend/register.html');
                                }
                            }
                            else {
                                //ERROR
                                res.sendFile(__dirname + '/public/backend/register.html');
                            }
                        });
                }
            }
            else {
                //ERROR
                console.log(err);
                res.sendFile(__dirname + '/public/backend/register.html');
            }
        });
    }
});
//////////////////////////////////////////////////////////////////////////////////////////////////

/* Application Start */
app.listen(port);
console.log("Listening on port ", port);
require("cf-deployment-tracker-client").track();
