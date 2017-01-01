var MainMenu = function() {};


MainMenu.prototype = {
    
    init: function () {
        this.titleText = game.make.text(game.world.centerX, 100, "The Townsfolk\nCartel", {
            font: 'bold 60pt TheMinion',
            fill: '#fc962f',
            align: 'center'
        });
        this.titleText.setShadow(3, 3, '#000000', 5);
        this.titleText.anchor.set(0.5);
    }

    , create: function () {

        if (musicPlayer.name !== "menumusic" && gameOptions.playMusic) {
            musicPlayer.stop();
            musicPlayer = game.add.audio('menumusic');
            musicPlayer.loop = true;
            musicPlayer.play();
        }
        game.stage.disableVisibilityChange = true;
        game.add.sprite(0, 0, 'mainmenu-bg');
        game.add.existing(this.titleText);

        this.addMenuOption('Start', function () {
            game.state.start("Game");
        }, 200, 260);
        
        
        this.addMenuOption('Load Game', function () {
            GameModel.loadGame();
            game.state.start("Game");
        }, 200, 320);
        
        this.addMenuOption('Options', function () {
            game.state.start("Options");
        }, 200, 380);
        
        this.addMenuOption('Credits', function () {
            game.state.start("Credits");
        }, 200, 440);
        
        game.add.sprite(525, 125, 'mizakDeform');
    }
};

Phaser.Utils.mixinPrototype(MainMenu.prototype, mixins);
