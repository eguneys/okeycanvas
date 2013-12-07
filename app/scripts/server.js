var path = require('path');
var express = require('express');
var socketio = require('socket.io');
var http = require('http');
var okeyserver = require('./okey.js');


var app = express();

app.configure(function() {
    app.use(express.static(path.join(__dirname, "../src")));
    app.use(express.static(path.join(__dirname, "../lib")));
    app.use(express.static(path.join(__dirname, "../assets")));
});



var server = http.createServer(app);
var io = socketio.listen(server, { log: false});



var port = 3000;
server.listen(3000, function () {
    console.log(' - listening on port ' + port + 'dirname ' + __dirname);
});




var connectionHandler = function(socket) {
    var player = null;

    socket.on('login', function(data) {
        player = {
	    data: okeyServer.playerJoin(data),
	    socket: socket
		 };
        socket.emit('welcome', player.data.Info());

	
	  socket.on('info server', function(data) {
	      var info = okeyServer.Info();
	      socket.emit('info server', info);
	  });

	  socket.on('play now', function() {
	      var availableGame = okeyServer.playerPlayNow(player);
	      console.log(availableGame);
	      socket.emit('info availableGame', availableGame);
	  });

	  socket.on('join game', function (data) {
	      var gameid = data.gameid;
	      var side = data.side;
	      okeyServer.playerJoinGame(player, gameid, side);
	  });


    });

    socket.on('disconnect', function () {
	if (player == null) return;
        okeyServer.playerLeave(player);
        io.sockets.emit('player leave', player.data.Info());
    });

    socket.on('error', function() {
        console.log('error');
    });

}



io.sockets.on('connection', connectionHandler);

var okeyServer = new okeyserver.OkeyServer();
