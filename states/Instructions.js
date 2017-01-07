var Instructions = function(game) {};

Instructions.prototype = {
    preload: function() {
        this.info = GameModel.getOverview();
    }
    
    , create: function() {
        var state = this;
        this.stage.disableVisibilityChange = false;
        var bg = game.add.sprite(0, 0, 'parchment-bg');
        this.infoText = this.add.text(50, 50, this.info, {
            font: '24px The Minion',
            fill: '#000000',
            strokeThickness: 0
        });
        this.healthText = this.add.text(50, 300, this.healthInfo, {
            font: '24px The Minion',
            fill: '#000000',
            strokeThickness: 0
        });
        
        //timer
        this.gameTimer = game.time.events.loop(1000, this.timerTrigger, this);
        
        this.addMenuOption('Return', function () {
            game.state.start("Game")
        }, "Instructions", 400, 500);
        
    }
    
    , timerTrigger: function() {
        GameModel.goAdventuring();
        GameModel.visitTown();        
        this.infoText.text = GameModel.getOverview();
    }
};

Phaser.Utils.mixinPrototype(Instructions.prototype, mixins);