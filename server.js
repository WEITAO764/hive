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
var ejs = require('ejs');
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
app.set('view engine', 'html');
app.engine('html', ejs.renderFile);
app.set('views', 'public');
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
    console.log(logintype);
    var username = req.body.username;
    console.log(username);
    var password = encrypt.sha1hash(req.body.password);
    console.log(password);
    if (logintype === "0")

    //0 means patient and 1 means doctor
    {
        con.query('SELECT * from patients WHERE username = \"' + username + '\" AND password = \"' + password + '\"', function (err, rows, fields) {
            if (!err) {
                console.log(rows[0]);

                if (rows.length > 0) {
                    //Login fine
                    var username = username;
                    var patientID = rows[0].patientID;
                    var firstname = rows[0].firstname;
                    var lastname = rows[0].lastname;
                    var address = rows[0].address;

                    var suburb = rows[0].suburb;
                    var postcode = rows[0].postcode;
                    var country = rows[0].country;
                    var dateofbirth = rows[0].dateofbirth;
                    var phoneno = rows[0].phoneno;
                    var email = rows[0].email;

                    res.render(__dirname + '/public/backend/dashboard.html', {
                        username: username,
                        patientID: patientID,
                        firstname: firstname,
                        lastname: lastname,
                        address: address,
                        suburb: suburb,
                        postcode: postcode,
                        country: country,
                        dateofbirth: dateofbirth,
                        phoneno: phoneno,
                        email: email
                    });
                }
                else {
                    //Fail
                    res.render(__dirname + '/public/backend/login.html');
                }
            }
            else {
                //ERROR
                res.render(__dirname + '/public/backend/login.html');
            }
        });
    }
    else {
        con.query('SELECT * from doctors WHERE username = \"' + username + '\" AND password = \"' + password + '\"', function (err, rows, fields) {
            if (!err) {
                console.log(rows);
                if (rows.length > 0) {
                    //Login fine

                    //var username = username;
                    var doctorID = rows[0].doctorID;
                    var firstname = rows[0].firstname;
                    var lastname = rows[0].lastname;

                    var dateofbirth = rows[0].dateofbirth;
                    var phoneno = rows[0].phoneno;
                    var email = rows[0].email;

                    res.render(__dirname + '/public/backend/dashboard.html', {
                        username: username, doctorID: doctorID, firstname: firstname,
                        lastname: lastname, dateofbirth: dateofbirth, phoneno: phoneno, email: email
                    });
                }
                else {
                    //Fail
                    res.render(__dirname + '/public/backend/login.html');
                }
            }
            else {
                //ERROR
                res.render(__dirname + '/public/backend/login.html');
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
    if (registertype === "1") {
        //Well the doctor need a clinic Name
        var clinicname = req.body.clinicname;
    }
    /*
    registertype = 1;
    //General Information
    firstname = "Petty2";
    lastname = "Citizen";
    clinicname = "Test Clinic2";
    address = "Monash High Way";
    suburb = "Mont waverley";
    postcode = "3133";
    country = "AU";

    dateofbirth = "21081955";
    phoneno = "0450720711";
    //For later login
    username = "doctor3";
    password = encrypt.sha1hash("password");
    email = "tes3@test.com";
*/
    dateofbirth = "12081994";
    console.log(registertype);
    if (registertype === "0")
    //0 means patient and 1 means doctor
    {
        con.query('SELECT * from patients WHERE username = \"' + username + '\" OR email = \"' + email + '\"', function (err, rows, fields) {
            if (!err) {
                console.log("NO ERROR");
                console.log(rows);
                if (rows.length > 0) {
                    //duplicate username
                    console.log("rows.length > 0");
                    res.sendFile(__dirname + '/public/backend/login.html');
                }
                else {
                    //INSERT INTO patients (phoneno, email, username, password)
                    // VALUES (value1, value2, value3,...)
                    console.log("rows.length < 0");
                    con.query("INSERT INTO patients (username,password,firstname,lastname,address,suburb,postcode,country," +
                        "dateofbirth,phoneno,email) VALUES ('" + username + "','" + password + "','" + firstname + "','" +
                        lastname + "','" + address + "','" + suburb + "','" + postcode + "','" + country + "','" +
                        dateofbirth + "','" + phoneno + "','" + email + "')",
                        function (err, rows, fields) {
                            if (!err) {
                                console.log(rows[0]);
                                if (rows.length > 0) {
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
                //console.log(rows);
                if (rows.length > 0) {
                    //duplicate username
                    res.sendFile(__dirname + '/public/backend/login.html');
                }
                else {
                    var clinicID = 0;
                    con.query('SELECT * from clinics WHERE name = \"' + clinicname + '\"', function (err, rows, fields) {
                        if (!err) {
                            console.log(rows);
                            if (rows.length > 0) {
                                //Has exit clinic
                                clinicID = rows[0].clinicID;
                            }
                            else {
                                //Add new clinic
                                con.query("INSERT INTO clinics (name,address,suburb,postcode,country) VALUES ('" +
                                    clinicname + "','" + address + "','" + suburb + "','" + postcode + "','" + country +
                                    "')",
                                    function (err, result, fields) {
                                        if (!err) {
                                            //console.log(rows[0]);
                                            clinicID = result.insertId;
                                        }
                                        else {
                                            //ERROR
                                            res.sendFile(__dirname + '/public/backend/register.html');
                                        }
                                    });
                            }

                            con.query("INSERT INTO doctors (username,password,firstname,lastname," +
                                "dateofbirth,phoneno,email,clinicID) VALUES ('" + username + "','" + password + "','" +
                                firstname + "','" + lastname + "','" +
                                dateofbirth + "','" + phoneno + "','" + email + "','" + clinicID + "')",
                                function (err, result, fields) {
                                    if (!err) {
                                        res.sendFile(__dirname + '/public/backend/dashboard.html');
                                    }
                                    else {
                                        //ERROR
                                        res.sendFile(__dirname + '/public/backend/register.html');
                                    }
                                });
                        }
                        else {
                            //ERROR
                            res.sendFile(__dirname + '/public/backend/login.html');
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

app.get("/dashboard", function (request, response) {
    response.sendFile(__dirname + '/public/backend/dashboard.html');
});
/*
*  Booking Part
*  Note: The default backend should check session status, if fail (unlogin), then should go to here.
* */

app.post("/booking", function (request, response) {
    //response.render(__dirname + '/public/backend/dashboard.html');
    if (request.body.constructor === Object && Object.keys(request.body).length === 0) {
        response.render(__dirname + '/public/backend/dashboard.html');
    }

    var bookingType = request.body.bookingType;
    //General Information
    var bookingDatetime = request.body.bookingDatetime;
    var bookingNote = request.body.bookingNote;
    var patientID = request.body.patientID;
    var doctorID = request.body.doctorID;
    var bookingID = 0;
    console.log('Prepared data');
    con.query("INSERT INTO bookings (bookingType,bookingDatetime,bookingNote,patientID,doctorID) VALUES ('" +
        bookingType + "','" + bookingDatetime + "','" + bookingNote + "','" + patientID + "','" + doctorID +
        "')",
        function (err, result, fields) {
            if (!err) {
                //console.log(rows[0]);
                bookingID = result.insertId;
                console.log('Insert booking successful: ID = ' + bookingID);
                response.render(__dirname + '/public/backend/booking-finished.html');
            }
            else {
                //ERROR
                console.log('Database Error');
                response.render(__dirname + '/public/backend/dashboard.html');
            }
        });

});

/*
*  Payment Part
*  Note: The default backend should check session status, if fail (unlogin), then should go to here.
* */
app.post("/payment", function (request, response) {
    //response.render(__dirname + '/public/backend/dashboard.html');
    if (request.body.constructor === Object && Object.keys(request.body).length === 0) {
        response.render(__dirname + '/public/backend/dashboard.html');
    }

    var bookingID = request.body.bookingType;
    //General Information
    var paymentType = request.body.paymentType;
    var ccType = request.body.ccType;
    var ccName = request.body.ccName;
    var ccExpiry = request.body.ccExpiry;
    var ccCVV = request.body.ccCVV;
    var ddBSB = request.body.ddBSB;
    var ddName = request.body.ddName;
    var ddNumber = request.body.ddNumber;
    var ptBSB = request.body.ptBSB;
    var ptName = request.body.ptName;
    var ptNumber = request.body.ptNumber;
    var paymentID = 0;
    console.log('Prepared data');
    con.query("INSERT INTO payments (bookingID,paymentType,ccType,ccName,ccExpiry,ccCVV,ddBSB,ddName," +
        "ddNumber,ptBSB,ptName,ptNumber) VALUES ('" + bookingID + "','" + paymentType + "','" + ccType + "','" +
        ccName + "','" + ccExpiry + "','" + ccCVV + "','" + ddBSB + "','" + ddName + "','" +
        ddNumber + "','" + ptBSB + "','" + ptName + "','" + ptNumber + "')",
        function (err, rows, fields) {
            if (!err) {
                //console.log(rows[0]);
                paymentID = result.insertId;
                console.log('Insert payment successful: ID = ' + paymentID);
                response.render(__dirname + '/public/backend/payment-finished.html');
            }
            else {
                //ERROR
                console.log('Database Error');
                response.render(__dirname + '/public/backend/dashboard.html');
            }
        });

});

//////////////////////////////////////////////////////////////////////////////////////////////////

/* Application Start */
app.listen(port);
console.log("Listening on port ", port);
require("cf-deployment-tracker-client").track();
