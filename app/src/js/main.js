var RED = 0;
var BLUE = 1;
var BLACK = 2;
var GREEN = 3;

var stoneGapX = 10;
var stoneGapY = 5;

var stoneWidth = 38;
var stoneHeight = 50;


var rakeStartX = 34;
var rakeStartY = 500;

var rakeWidth = (stoneWidth  + stoneGapX) * 14;
var rakeHeight = stoneHeight * 2 + stoneGapY;


function GameView() {
    var self = this;

    self.stage = new createjs.Stage('testcanvas');

    self.rake;

    self.DragEngine = new DragEngine(self);

    self.stoneData = new SpriteData();
    self.stoneSheet = new createjs.SpriteSheet(self.stoneData.StoneSheet);
    self.stoneS = [];
    self.stoneContainer = new createjs.Container();

    self.buildStone = function(s) {
	var shape = new createjs.Sprite(self.stoneSheet);
	shape.gotoAndStop(s.number - 1 + s.color * 13);

	return shape;
    }
    
    self.buildEmptyStone = function() {
	var shape = new createjs.Sprite(self.stoneSheet);
	shape.gotoAndStop(4 * 13);

	return shape;
    }

    self.buildFakeStone = function() {
	var shape = new createjs.Sprite(self.stoneSheet);
	shape.gotoAndStop(4 * 13 + 1);

	return shape;
    }

    self.buildMiddleStone = function () {
	var stone = self.buildEmptyStone();

	var ox = rakeStartX + rakeWidth / 2;
	var oy = rakeStartY / 2;

	self.DragEngine.buildDraggable(stone, null, function(s) {
	    self.DragEngine.dragStone(s, ox, oy, true);
	});

	self.DragEngine.dragStone(stone, ox, oy);
    }

    self.buildRake = function () {
	var shape = new createjs.Shape();

	shape.graphics.beginStroke("#000").drawRect(rakeStartX, rakeStartY, rakeWidth, rakeHeight);

	self.stage.addChild(shape);
    }

    self.buildStones = function (stones) {
	stones.forEach(function(item) {
	    self.rakeAddStone(item);
	});
    }

    self.rakeAddStone = function (item) {
	var stone = self.buildStone(item);
	    
	self.DragEngine.buildDraggable(stone, null, function (s) {
	    self.DragEngine.rakeSnap(s);
	});

	self.DragEngine.rakeSnap(stone, true);
	self.stoneS.push(stone);
    }

    
    self.buildScene = function() {
	self.buildRake();

	self.stage.addChild(self.stoneContainer);

	self.buildStones([
	    {number: 1, color: RED},
	    {number: 2, color: GREEN},
	    {number: 3, color: BLUE},
	    {number: 4, color: BLACK},
	    {number: 5, color: RED},

			 ]);

	self.buildMiddleStone();
	
	
	self.stage.update();
	createjs.Ticker.addEventListener("tick", self.stage);
	createjs.Ticker.setInterval(25);
	createjs.Ticker.setFPS(60);
    }
    
}

function DragEngine(base) {
    var self = this;

    self.base = base;
    
    self.buildDraggable = function (s, move, end) {
	self.base.stoneContainer.addChild(s);
	
	s.on("mousedown", function(evt) {
	    self.base.stoneContainer.setChildIndex(evt.target, self.base.stoneContainer.getNumChildren() - 1);
	    evt.target.ox = evt.target.x - evt.stageX;
	    evt.target.oy = evt.target.y - evt.stageY;
	    
	});
	s.on("pressmove", function(evt) {
	    evt.target.x = evt.stageX + evt.target.ox;
	    evt.target.y = evt.stageY + evt.target.oy;
	    self.base.stage.update();
	});

	s.on("pressup", function(evt) {
	    if (end) {
		end(evt.target);
	    }
	});
    }

    self.dragStone = function(s, x, y, animate) {
	if (animate) {
	    createjs.Tween.get(s).to({x: x, y: y}, 100, createjs.Ease.linear);
	} else {
	    s.x = x;
	    s.y = y;
	}

	self.base.stage.update();
    }

    self.rakeSnap =  function(s, animateDisabled) {
	self.dragStone(s, self.gridX(s.x), self.snapY(s.y), !animateDisabled);
    }

    self.gridX = function(x) {
	if (x < rakeStartX) x = rakeStartX;
	else if (x > rakeStartX + rakeWidth - stoneWidth) x = rakeStartX + rakeWidth - stoneWidth
	
	return x;
    }

    self.snapY = function (y) {
	if (y + stoneHeight / 2 > rakeStartY + (rakeHeight / 2))
	    y = rakeStartY + rakeHeight / 2 + stoneGapY;
	else
	    y = rakeStartY;
	return y ;
    }
    
}


function pageLoaded() {
    var view = new GameView();

    view.buildScene();
}


$(document).ready(pageLoaded);
