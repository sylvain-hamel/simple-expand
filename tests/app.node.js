/* This app serves files in order to run unit tests because cookie-related
   tests require a server. 
*/
var express = require("express"),
app = express();
app.use(express.static(__dirname));
app.listen(3001);
console.log('Service static files from ' + __dirname + ' at http://localhost:3001/')