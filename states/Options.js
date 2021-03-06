var Options = function(game) {};

Options.prototype = {

    menuConfig: {
        className: "inverse",
        startY: 260,
        startX: "center"
    }


    , init: function () {
        this.titleText = game.make.text(game.world.centerX, 150, "The Townsfolk\nCartel", {
            font: 'bold 60pt TheMinion',
            fill: '#fc962f',
            align: 'center'
        });
        this.titleText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
        this.titleText.anchor.set(0.5);
        this.optionCount = 1;
    }

    , create: function () {
        //var playSound = gameOptions.playSound,
        //playMusic = gameOptions.playMusic;
        game.add.sprite(0, 0, 'parchment-bg');
        game.add.existing(this.titleText);
        
        this.addMenuOption(gameOptions.playMusic ? 'Mute Music' : 'Play Music', function (target) {
            gameOptions.playMusic = !gameOptions.playMusic;
            target.text = gameOptions.playMusic ? 'Mute Music' : 'Play Music';
            musicPlayer.volume = gameOptions.playMusic ? 1 : 0;
        }, 200, 260);
        
        /*this.addMenuOption(gameOptions.playSound ? 'Mute Sound' : 'Play Sound', function (target) {
            gameOptions.playSound = !gameOptions.playSound;
            target.text = gameOptions.playSound ? 'Mute Sound' : 'Play Sound';
        }, 200, 320);*/
        
        this.addMenuOption('<- Back', function () {
            game.state.start("MainMenu");
        }, 200, 380);
    }
};

Phaser.Utils.mixinPrototype(Options.prototype, mixins);
