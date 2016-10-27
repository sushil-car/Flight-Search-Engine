var express = require('express'),
    http = require('http');
var app = express();
var server = http.createServer(app);
var BASEURL = 'localhost';

var s = server.listen(3000, BASEURL, function() {
    var host = s.address().address;
    var port = s.address().port;
    console.log('Group Poll app listening at http://%s:%s', host, port);
});

app.use(express.static(__dirname + '/ng'));