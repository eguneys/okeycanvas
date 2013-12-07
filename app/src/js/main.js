
function pageLoaded() {
    var stage = new createjs.Stage('testcanvas');

    var mainView = new MainView(stage);

    mainView.Events.playNow.attach(function () {

	mainView.clearScene();
	
	var view = new GameView(stage);
	
    });

    mainView.buildScene();
    

}


$(document).ready(pageLoaded);
