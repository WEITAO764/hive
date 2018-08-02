var express = require("express"),
    app = express();
var port = process.env.PORT || 8080;

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
