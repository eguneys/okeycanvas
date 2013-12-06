var path = require('path');
var express = require('express');

var app = express();

app.configure(function() {
    app.use(express.static(path.join(__dirname, "../src")));
    app.use(express.static(path.join(__dirname, "../lib")));
    app.use(express.static(path.join(__dirname, "../assets")));
});

var port = 3000;
app.listen(3000, function () {
    console.log(' - listening on port ' + port + 'dirname ' + __dirname);
});
