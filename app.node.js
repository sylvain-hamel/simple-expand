var express = require("express"),
app = express();
app.use(express.static(__dirname));
app.listen(3001);
console.log('Service static files from ' + __dirname + ' at http://localhost:3001/')