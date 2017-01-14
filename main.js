// Global Variables
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game')
    , Main = function () {}
    , gameOptions = {
        playSound: true
        , playMusic: true
    }
    , musicPlayer
    , gameTimer;

//NG API (still in beta)
var ngio = new Newgrounds.io.core("45307:BJ129YXO", "WqLFkO2+tVviQB1Lz68dgg==");

ngio.callComponent("Gateway.getDatetime", {}, function(result) {
   if (result.success) {
        console.log('The current date/time on the Newgrounds.io server is '+result.datetime);
   } else {
        console.log('ERROR!', result.error.message);
   }
});

Main.prototype = {

    preload: function () {
        game.load.image('stars',    'assets/images/stars.jpg');
        game.load.image('loading',  'assets/images/loading.png');
        game.load.image('brand',    'assets/images/logo44.png');
        game.load.image('parchment-bg', 'assets/images/parchment.jpg');
        game.load.script('polyfill',   'lib/polyfill.js');
        game.load.script('utils',   'lib/utils.js');
        game.load.script('splash',  'states/Splash.js');
    }

    , create: function () {
        game.state.add('Splash', Splash);
        game.state.start('Splash');
    }
};

game.state.add('Main', Main);
game.state.start('Main');