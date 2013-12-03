function SpriteData() {
    var self = this;

    self.frameData = function (dx, dy) {
	var xdelta = 0;
	var ydelta = 0;
	return function(array) {
	    array[0] += xdelta;
	    array[1] += ydelta;
	    xdelta += dx;
	    ydelta += dy;
	    return array;
	};
    }

    self.frameStone = self.frameData(0, 50);
    self.frameStone2 = self.frameData(0, 50);
    self.frameStone3 = self.frameData(0, 50);
    self.frameStone4 = self.frameData(0, 50);
    self.frameStone5 = self.frameData(0, 50);
    
    self.StoneSheet = {
	images: ["taslar.png"],
	frames: [
	    self.frameStone([0, 0, 38, 50, 0]),
	    self.frameStone([0, 0, 38, 50, 0]),
	    self.frameStone([0, 0, 38, 50, 0]),
	    self.frameStone([0, 0, 38, 50, 0]),
	    self.frameStone([0, 0, 38, 50, 0]),
	    self.frameStone([0, 0, 38, 50, 0]),
	    self.frameStone([0, 0, 38, 50, 0]),
	    self.frameStone([0, 0, 38, 50, 0]),
	    self.frameStone([0, 0, 38, 50, 0]),
	    self.frameStone([0, 0, 38, 50, 0]),
	    self.frameStone([0, 0, 38, 50, 0]),
	    self.frameStone([0, 0, 38, 50, 0]),
	    self.frameStone([0, 0, 38, 50, 0]),

	    self.frameStone2([38, 0, 38, 50, 0]),
	    self.frameStone2([38, 0, 38, 50, 0]),
	    self.frameStone2([38, 0, 38, 50, 0]),
	    self.frameStone2([38, 0, 38, 50, 0]),
	    self.frameStone2([38, 0, 38, 50, 0]),
	    self.frameStone2([38, 0, 38, 50, 0]),
	    self.frameStone2([38, 0, 38, 50, 0]),
	    self.frameStone2([38, 0, 38, 50, 0]),
	    self.frameStone2([38, 0, 38, 50, 0]),
	    self.frameStone2([38, 0, 38, 50, 0]),
	    self.frameStone2([38, 0, 38, 50, 0]),
	    self.frameStone2([38, 0, 38, 50, 0]),
	    self.frameStone2([38, 0, 38, 50, 0]),

	    self.frameStone3([76, 0, 38, 50, 0]),
	    self.frameStone3([76, 0, 38, 50, 0]),
	    self.frameStone3([76, 0, 38, 50, 0]),
	    self.frameStone3([76, 0, 38, 50, 0]),
	    self.frameStone3([76, 0, 38, 50, 0]),
	    self.frameStone3([76, 0, 38, 50, 0]),
	    self.frameStone3([76, 0, 38, 50, 0]),
	    self.frameStone3([76, 0, 38, 50, 0]),
	    self.frameStone3([76, 0, 38, 50, 0]),
	    self.frameStone3([76, 0, 38, 50, 0]),
	    self.frameStone3([76, 0, 38, 50, 0]),
	    self.frameStone3([76, 0, 38, 50, 0]),
	    self.frameStone3([76, 0, 38, 50, 0]),

	    self.frameStone4([114, 0, 38, 50, 0]),
	    self.frameStone4([114, 0, 38, 50, 0]),
	    self.frameStone4([114, 0, 38, 50, 0]),
	    self.frameStone4([114, 0, 38, 50, 0]),
	    self.frameStone4([114, 0, 38, 50, 0]),
	    self.frameStone4([114, 0, 38, 50, 0]),
	    self.frameStone4([114, 0, 38, 50, 0]),
	    self.frameStone4([114, 0, 38, 50, 0]),
	    self.frameStone4([114, 0, 38, 50, 0]),
	    self.frameStone4([114, 0, 38, 50, 0]),
	    self.frameStone4([114, 0, 38, 50, 0]),
	    self.frameStone4([114, 0, 38, 50, 0]),
	    self.frameStone4([114, 0, 38, 50, 0]),

	    self.frameStone5([152, 0, 38, 50, 0]), // Empty Stone
	    self.frameStone5([152, 0, 38, 50, 0]), // Fake Stone
	    
	]
    };
    

}
