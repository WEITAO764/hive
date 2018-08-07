var express = require("express"),
    app = express();
var mysql = require('mysql');
var port = process.env.PORT || 8080;

/* Database Connection */
var con = mysql.createConnection({
    host: "sl-us-south-1-portal.30.dblayer.com",
    port: "52603",
    user: "admin",
    password: "OKVUNZLWUSILFSNB",
    database: "hivedb"
});
con.connect();
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
var encrypt = require('./library/encryption');
//console.log(encrypt.sha1hash("password"));
/* Default Route. Static middleware */
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/public/backend'));

/* Call Login Page
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
    var logintype = req.body.logintype;
    var username = req.body.username;
    var password = encrypt.sha1hash(req.body.password);

    if (logintype === 0)
    //0 means patient and 1 means doctor
    {
        con.query('SELECT * from patients WHERE username = \"' + username + "\" AND password = \"" + password + "\"", function (err, rows, fields) {
            if (!err) {
                console.log(rows[0]);
                if (rows[0] === username) {
                    //Login
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
        con.query('SELECT * from doctors WHERE username = \"' + username + "\" AND password = \"" + password + "\"", function (err, rows, fields) {
            if (!err) {
                //console.log(rows);
                if (rows[0].username === username) {
                    //Login

                }
                else {
                    res.sendFile(__dirname + '/public/backend/login.html');
                }
            }
            else {

                res.sendFile(__dirname + '/public/backend/login.html');
            }

        });
    }
});

app.get("/register", function (request, response) {
    response.sendFile(__dirname + '/public/backend/register.html');
});

app.post('/registersubmit', function (req, res) {
    //Check the db if register confirmed
    //1. Get rid of BS submit
    //2. Get check existed
    //3. Register
});

/* Application Start */
app.listen(port);
console.log("Listening on port ", port);
require("cf-deployment-tracker-client").track();
