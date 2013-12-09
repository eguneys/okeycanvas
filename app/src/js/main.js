
function pageLoaded() {
    var stage = new createjs.Stage('testcanvas');

    var socket = io.connect('http://192.168.56.101:3000');

    var mainView = new MainView(stage);
    var mainController = new MainController(mainView, socket);

    mainController.initView();
    mainController.login();
}


$(document).ready(pageLoaded);
