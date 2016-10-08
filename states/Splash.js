var Splash = function () {};

Splash.prototype = {

        loadScripts: function () {
            game.load.script('style', 'lib/style.js');
            game.load.script('mixins', 'lib/mixins.js');
            game.load.script('WebFont', 'vendor/webfontloader.js');
            game.load.script('mainmenu','states/MainMenu.js');
            game.load.script('gameover','states/GameOver.js');
            game.load.script('credits', 'states/Credits.js');
            game.load.script('options', 'states/Options.js');

            game.load.script('game', 'states/Game.js');
            game.load.script('tavern', 'states/Tavern.js');
            game.load.script('inn', 'states/Inn.js');
            game.load.script('itemshop', 'states/ItemShop.js');
            game.load.script('blacksmith', 'states/Blacksmith.js');
            game.load.script('temple', 'states/Temple.js');
            game.load.script('dossiers', 'states/Dossiers.js');
            
            game.load.script('gameModel',  'js/mainLibrary.js');
    }

    , loadBgm: function () {
        game.load.audio('menumusic', 'assets/bgm/circularPrelude.mp3');
        game.load.audio('exit', 'assets/bgm/Exit the Premises.mp3');
    }
    
    , loadImages: function () {
        //backgrounds (800x600)
        game.load.image('mainmenu-bg', 'assets/images/town.jpg');
        game.load.image('townmenu-bg', 'assets/images/townmenu.jpg');
        game.load.image('tavern-bg', 'assets/images/tavern.jpg');
        game.load.image('inn-bg', 'assets/images/inn.jpg');
        game.load.image('blacksmith-bg', 'assets/images/smith.jpg');
        game.load.image('itemshop-bg', 'assets/images/itemshop.jpg');
        game.load.image('temple-bg', 'assets/images/temple.jpg');
        
        //character images (200x200)
        game.load.image('mizak', 'assets/images/mizak.png');
        game.load.image('lemel', 'assets/images/lemel.png');
        game.load.image('lissette', 'assets/images/lissette.png');
        game.load.image('jera', 'assets/images/jera.png');
        game.load.image('widow', 'assets/images/widow.png');
        
        game.load.image('mizakFull', 'assets/images/mizakFull.png');
        game.load.image('lemelFull', 'assets/images/lemelFull.png');
        game.load.image('lissetteFull', 'assets/images/lissetteFull.png');
        game.load.image('clavoFull', 'assets/images/clavoFull.png');
        
        
        
        
        //button info
        game.load.image('swordA', 'assets/images/greenSword.png');
        game.load.image('swordB', 'assets/images/yellowSword.png');
        game.load.image('swordC', 'assets/images/redSword.png');
        
        //other
        game.load.image('mizakDeform', 'assets/images/mizakCartoon.png'); //200x600
    }

    , loadFonts: function () {
        WebFontConfig = {
            custom: {
                families: ['TheMinion'],
                urls: ['assets/style/theminion.css']
            }
        }
    }

    , init: function () {
        this.loadingBar = game.make.sprite(game.world.centerX-(387/2), 400, "loading");
        this.logo       = game.make.sprite(game.world.centerX, 200, 'brand');
        this.status     = game.make.text(game.world.centerX, 380, 'Loading...', {fill: 'white'});
        utils.centerGameObjects([this.logo, this.status]);
    }

    , preload: function () {
        game.add.sprite(0, 0, 'parchment-bg');
        game.add.existing(this.logo).scale.setTo(0.5);
        game.add.existing(this.loadingBar);
        game.add.existing(this.status);
        this.load.setPreloadSprite(this.loadingBar);

        this.loadScripts();
        this.loadImages();
        this.loadFonts();
        this.loadBgm();
    }

    , addGameStates: function () {
        game.state.add("MainMenu", MainMenu);
        game.state.add("Game", Game);
        game.state.add("Blacksmith", Blacksmith);
        game.state.add("ItemShop", ItemShop);
        game.state.add("Tavern", Tavern);
        game.state.add("Inn", Inn);
        game.state.add("Temple", Temple);
        game.state.add("Dossiers", Dossiers);
        game.state.add("GameOver", GameOver);
        game.state.add("Credits", Credits);
        game.state.add("Options", Options);
    }

    , addGameMusic: function () {
        musicPlayer = game.add.audio('menumusic');
        musicPlayer.loop = true;
        musicPlayer.volume = 0.5;
        musicPlayer.play();
    }
    
    , create: function() {
        this.status.setText('Ready!');
        this.addGameStates();
        this.addGameMusic();

    setTimeout(function () {
        game.state.start("MainMenu");
        }, 1000);
    }
};