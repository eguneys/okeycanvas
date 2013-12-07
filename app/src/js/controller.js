function GameModel () {
    var self = this;

    self.players = {};
    self.rack = [];
    self.wastestones = {
	BOTTOM: [],
	LEFT: [],
	TOP: [],
	RIGHT: []
    };

    self.turn;
    
}

function GameController(view) {
    var self = this;

    self.View = view;

    self.Model = new GameModel();
    
    self.me;


    self.welcome = function (me) {
	self.me = me;
    }
    
    self.startGame = function () {
	
    }

    self.roundInfo = function () {
	
    }

    self.playerDrawInfo = function () {

    }

    self.playerThrowStone = function () {

    }

    self.playerDrawSideStone = function () {

    }

    self.playerDrawMiddleStone = function () {
    }

    




    self.initView = function (){
	view.buildScene();
    }
    

        view.Events.drawMiddleStone.attach(function (sender, stone) {
            view.drawMiddleStone({number: 1, color: BLACK});
        });

        view.Events.throwStone.attach(function (sender, stone) {
            view.throwStone(stone, "BOTTOM");
        });

        view.Events.drawBottomStone.attach(function(sender, stone) {
            view.drawBottomStone(stone);
        });

        view.Events.sitTable.attach(function (sender, side) {
            view.sitPlayer({name: "helo"}, side);
        });


    

}
