var express = require("express"),
    app = express();
var mysql = require('mysql');
var port = process.env.PORT || 8080;

/* Database Connection */
var con = mysql.createConnection({
    host: "sl-us-south-1-portal.30.dblayer.com",
    port: "52603",
    user: "admin",
    password: "OKVUNZLWUSILFSNB"
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

/* Default Route. Static middleware */
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/public/backend'));

/* Call Login Page
*  Note: The default backend should check session status, if fail (unlogin), then should go to here.
* */
app.get("/login", function (request, response) {
    response.sendFile(__dirname + '/public/backend/login.html');
});

app.get("/register", function (request, response) {
    response.sendFile(__dirname + '/public/backend/register.html');
});

/* Application Start */
app.listen(port);
console.log("Listening on port ", port);
require("cf-deployment-tracker-client").track();
