function MainController(view, socket) {
    var self = this;

    self.View = view;

    self.socket = socket;

    self.Me;

    self.login = function () {
	socket.emit('login');
    }

    socket.on('welcome', function(data) {
	self.Me = data;

    
	self.View.Events.playNow.attach(function () {
	    self.socket.emit('play now');
	});

    });

    socket.on('info availableGame', function(data) {
        self.View.clearScene();

        var gameView = new GameView(self.View.stage);
	var gameController = new GameController(gameView, self.Me, self.socket, data);

	gameController.initView();
    });

    self.initView = function () {
	self.View.buildScene();
    }

}

function GameModel (data) {
    var self = this;

    self.gameid = data.ID;
    
    self.players = data.Players;
    self.rack = [];
    self.wastestones = {
	BOTTOM: [],
	LEFT: [],
	TOP: [],
	RIGHT: []
    };

    self.gosterge;

    self.turn;
    
}

function GameController(view, me, socket, data) {
    var self = this;

    self.View = view;

    self.Model = new GameModel(data);
    
    self.me = me;

    self.myside;

    self.socket = socket;

    self.init = function() {
	for (var i in self.Model.players) {
	    self.View.sitPlayer(self.Model.players[i], DIRECTION_TOTAG[i]);
	}
    }

    self.init();

    self.myServerSide = function(players) {
	for (i in players) {
	    if (self.Model.players[i].ID == self.me.ID) return i;
	}
    }

    self.relativeSide = function(side, myside) {
	var delta = side - BOTTOM;
	var relativeSide = delta - myside;
	return (relativeSide + 8) % 4;
    }

    self.relativeSideTag = function(side) {
	return DIRECTION_TOTAG[self.relativeSide(side, self.myside)];
    }

    self.turnChange = function() {
	self.Model.turn++;
	self.Model.turn = self.Model.turn % 4;
    }
    
    self.playerJoin = function(player, side) {
	self.Model.players[side] = player;
	self.View.sitPlayer(player, DIRECTION_TOTAG[side]);
    }
    
    self.startGame = function (players, turn, gosterge) {

	self.Model.turn = turn;
	self.Model.gosterge = gosterge;
	
	var myside = self.myServerSide(players);
	self.myside = myside;
	
	 for (var i in players) {
	     self.Model.players[self.relativeSide(i, myside)] = players[i];
	     self.View.changePlayer(players[i], self.relativeSideTag(i));
	 }

	self.View.turnPlayer(self.relativeSideTag(self.Model.turn));
    }

    self.roundInfo = function (rack) {
	self.Model.rack = rack;
	self.View.buildStones(rack);
    }

    self.playerDrawInfo = function () {
	
    }

    self.playerThrowStone = function (stone) {
	if (self.Model.turn == self.myside) {
	    self.View.throwStone();
	} else {
	    self.View.addThrowStone(stone, self.relativeSideTag(self.Model.turn));
	}
	self.View.clearPlayer(self.relativeSideTag(self.Model.turn));
	self.turnChange();
	self.View.turnPlayer(self.relativeSideTag(self.Model.turn));

    }

    self.playerDrawSideStone = function () {
	if (self.Model.turn == self.myside) {
	    self.View.drawBottomStone();
	} else {
	    self.View.drawStone(self.relativeSideTag((self.Model.turn + 3) % 4));
	}
    }

    self.playerDrawMiddleStone = function (data) {
	if (self.Model.turn == self.myside) {
	    self.View.drawMiddleStone(data);
	}
    }
    

    self.socket.on('game playerJoin', function(data) {
	self.playerJoin(data.player, data.side);
    });

    self.socket.on('game newRound', function(data) {
	self.startGame(data.Players, data.Turn, data.Gosterge);
    });

    self.socket.on('game roundInfo', function(data) {
	self.roundInfo(data.istaka);
    });

    self.socket.on('game info tasat', function(data) {
	    self.playerThrowStone(data);
    });

    self.socket.on('game info ortatas', function(data) {
	self.playerDrawMiddleStone(data);
    });

    self.socket.on('game info yantas', function(data) {
	self.playerDrawSideStone();
    });

    self.socket.on('game autoplay', function(data) {
	self.playerDrawMiddleStone(data);
	self.playerThrowStone(data);
    });


    self.initView = function (){
	view.buildScene();
    }
    

    self.View.Events.drawMiddleStone.attach(function (sender, stone) {
	self.socket.emit('game request ortacek');
    });

    self.View.Events.throwStone.attach(function (sender, stone) {
	console.log('throw');
	console.log(stone);
	self.socket.emit('game request tasat', stone.data);
    });

    self.View.Events.drawBottomStone.attach(function(sender, stone) {
        self.socket.emit('game request yancek');
    });

    self.View.Events.sitTable.attach(function (sender, side) {
	self.socket.emit('join game', { gameid: self.Model.gameid, side: DIRECTION_TOCODE[side] });
    });


    

}
