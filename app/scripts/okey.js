var util = require('./util.js');

var Event = util.Event;

var TOP = 0;
var LEFT = 1;
var BOTTOM = 2;
var RIGHT = 3;

var NONE = 0;
var RED = 1;
var YELLOW = 2;
var BLUE = 3;
var GRAY = 4;


function PlayerEvents(base) {
    
    var self = this;

    self.base = base;

    self.timesUp = new Event(self.base);
}


function OkeyEvents (base) {
    var self = this;

    self.base = base;

    self.roundStart = new Event(self.base);
}


function OkeyStone (data) {
    var self = this;

    self.number = data.number;
    self.color = data.color;
    self.isGosterge = function() { return number == 14; }


    self.same = function(stone) {
	return stone.color == self.color && stone.number == self.number;
    }
    
    self.Info =function() {
	var info = {
	    number: self.number,
	    color: self.color,
	};
	return info;
    }
};

function OkeyPlayer(data) {
    var self = this;

    self.Events = new PlayerEvents(this);

    self.ID = Date.now();
    self.name = data.Name;
    self.score = 0;

    self.socket;

    self.istaka = [];

    self.wasteStones = [];

    self.stoneCount = function () {
	var result = 0;
	for (var i in self.istaka) {
	    result ++;
	}
	return result;
    }
    
    self.turnTime = 15000;
    self.timeout = undefined;

    self.Turn = function () {
	self.timeout = setTimeout(function () {
	    self.Events.timesUp.notify();
	}, self.turnTime);
    }


    self.TurnClear = function () {
	if (self.timeout) {
	    clearTimeout(self.timeout);
	}
	self.timeout = undefined;
    }

    self.ShouldAddStone = function() {
	return self.stoneCount() < 14;
    }

    self.AddStone = function(stone) {
	if (self.stoneCount() < 14) {
	    self.istaka.push(stone);
	    return true;
	}
	 return false;
    }

    self.RemoveStone = function (stone) {
	var removethis = null;
	for (var i in self.istaka) {
	    var s = self.istaka[i];
	    if (stone.same(s)) {
		removethis = s;
		break;
	    }
	}

	if (removethis) {
	    self.istaka.splice(self.istaka.indexOf(removethis), 1);
	} else {
	    console.log('ERROR CANT REMOVE');
	}

	
	return removethis;
    }

    self.Info = function () {
	var info = {
	    Name: self.name,
	    Score: self.score,
	    ID: self.ID
	};

	return info;
    }

    self.RoundInfo = function () {
	var istaka = [];
	self.istaka.forEach(function (stone) {
	    istaka.push(stone.Info());
	});
	var info = {
	    istaka : istaka
	}
	return info;
    }

    self.notify = function(message, data) {
	self.socket.emit(message, data);
    }
};

function OkeyRound(base) {
    var self = this;

    self.base = base;
    
    self.players = [];
    self.stones = [];
    self.turn = 0;

    self.gostergeStone = null;

    self.InitPlayers = function (players) {
	for (var i in players) {
	    self.players[i] = players[i].data;

	    self.players[i].Events.timesUp.attach(function(sender) {
		if (sender.ShouldAddStone()) {
		    self.AutoPlay(sender);
		} else {
		    self.PlayerTasAt(sender, sender.istaka[13]);
		}
	    });
	}
    }

    self.IsTurn = function (player) {
	return self.players[self.turn].ID == player.ID;
    }

    self.NextTurn = function () {
	
	self.players[self.turn].TurnClear();

	self.turn = (self.turn + 1) % 4;

	self.players[self.turn].Turn();

	console.log(self.turn + " " + self.players[self.turn].name);
    }

    self.PrevPlayer = function(turn) {
	var x = (self.turn + 3) % 4;
	return self.players[x];
    }

    self.NextPlayer = function(turn) {
	var x = (self.turn + 1) % 4;
	return self.players[x];
    }

    self.AutoPlay = function(player) {
	var stone;
	if (self.IsTurn(player)) {
	    stone = self.stones.pop();
	    self.NextPlayer(self.turn).wasteStones.push(stone);
	    self.NextTurn();
	}

	self.base.notifyPlayers("game autoplay", stone);
    }

    self.PlayerTasCek = function (player, from) {
	if (self.IsTurn(player) && player.ShouldAddStone()) {
	    if (from == "orta") {
		var stone = self.stones.pop();
		player.AddStone(stone);

		player.notify("game info ortatas", stone);
		
	    } else {
		player.AddStone(self.PrevPlayer(self.turn).wasteStones.pop());
	    }
	}
    }

    self.PlayerTasAt = function(player, stone) {
	if (self.IsTurn(player)) {
	    var rs = player.RemoveStone(stone);
	    if (rs) {
		self.NextPlayer(self.turn).wasteStones.push(rs);
		
		self.base.notifyPlayers("game info tasat", rs);
		self.NextTurn();
	    }
	} else {
	    console.log('non turn player');
	}
    }


    self.EndRound = function (turn) {
	self.players.forEach(function (p) {
	    p.istaka = [];
	});
	
	self.stones = [];
	self.turn = turn;
    }

    self.NewRound = function (turn) {

	self.EndRound(turn);

	for (var k = 0; k < 2; k++) 
	for (var i = 1; i<14; i++) {
	    for (var color = RED; color <= GRAY; color++) {
		var stone = new OkeyStone({number: i, color: color});
		self.stones.push(stone);
	    }
	}

	var gosterge1 = new OkeyStone({number: 14});
	var gosterge2 = new OkeyStone({number: 14});

	self.stones.push(gosterge1);
	self.stones.push(gosterge2);

//	self.stones.shuffle();

	for (var i = 0; i<4; i++) {
	    if (self.players[i]) {
		var p = self.players[i];
		for (var c = 0; c < 13; c++) p.istaka.push(self.stones.pop());
	    }
	}

	self.NextPlayer(turn).istaka.push(self.stones.pop());

	self.gostergeStone = self.stones.pop();

	self.NextTurn();
    }

    self.isAvailable = function () {

    }

    self.Info = function() {
	var players = [];

	self.players.forEach(function (p) {
	    players.push(p.Info());
	});

	var info = {
	    Players: players,
	    Turn: self.turn,
	    Gosterge: self.gostergeStone
	};
	return info;
    }
}

function OkeyGame () {
    var self = this;

    self.ID = Date.now();;
    
    self.GameRound = null

    self.gameTurn = 0;
    self.totalPlayers = 0;

    self.Players = {};

    self.playerJoin = function (p, side) {
	if (self.totalPlayers < 4) {
	    if (!self.Players[side]) {
		p.data.socket = p.socket;
		self.Players[side] = p;

		self.attachListeners(p);
		
		self.totalPlayers++;

		var n = { side: side,
			  player: p.data.Info()
			};

		self.notifyPlayers('game playerJoin', n);
	    }
	}

	if (self.totalPlayers == 4) {
	    self.startRound();
	}
    }

    self.startRound = function () {
	self.gameTurn ++;
	self.gameTurn = self.gameTurn % self.totalPlayers;
	self.GameRound = new OkeyRound(self);
	self.GameRound.InitPlayers(self.Players);
	self.GameRound.NewRound(self.gameTurn);

	self.notifyPlayers('game newRound', self.GameRound.Info());

	for (var i in self.Players) {
	    self.notifyPlayer('game roundInfo', self.GameRound.players[i].RoundInfo(), i);
	}
	
    }

    self.isAvailable = function () {
	return self.totalPlayers < 4;
    }

    self.Info = function (p) {
	var players = {};

	for (var i in self.Players) {
	    players[i] = self.Players[i].data.Info();
	}
	

	var info = {
	    ID: self.ID,
	    GameTurn: self.gameTurn,
	    Players: players,
	    GameRound: (self.GameRound)?self.GameRound.Info():null
	};
	return info;
    }

    self.attachListeners = function(p) {
	p.socket.on('game request ortacek', function() {
	    self.GameRound.PlayerTasCek(p.data, "orta");
	});

	p.socket.on('game request tasat', function(data) {
	    console.log(data);
	    self.GameRound.PlayerTasAt(p.data, new OkeyStone(data));
	});
    }

    self.notifyPlayer = function(message, data, side) {
	self.Players[side].socket.emit(message, data);
    }

    self.notifyPlayers = function(message, data) {
	for (var i in self.Players) {
	    var p = self.Players[i];
	    p.socket.emit(message, data);
	}
    }

    self.Events = new OkeyEvents(self);
    
}


function OkeyServer() {
    var self = this;

    self.Games = {};
    self.Players = {};

    self.totalPlayers = 0;

    self.playerJoin = function (data) {
	self.totalPlayers++;
	
	var p = new OkeyPlayer(data);
	self.Players[p.ID] = p;
	return p;
    }

    self.playerLeave = function (p) {
	self.totalPlayers--;
	
    }

    self.playerJoinGame = function (p, gameid, side) {
	if (self.Games[gameid])
	    return self.Games[gameid].playerJoin(p, side);
    }

    self.playerPlayNow = function (p) {
	var available;
	for (var i in self.Games) {
	    var game = self.Games[i];
	    if (game.isAvailable()) {
		available = game;
		break;
	    }
	}

	if (!available) {
	    available = new OkeyGame();
	    self.Games[available.ID] = available;
	}
	return available.Info();
    }

    self.Info = function (p) {
	var players = [];
	for (var k in self.Players) {
	    players.push(self.Players[k].Info());
	}
	var info =
	    {
		TotalPlayers: self.totalPlayers,
		Players: players
	    };
	return info;
    }
    
}


exports.OkeyServer = OkeyServer;
