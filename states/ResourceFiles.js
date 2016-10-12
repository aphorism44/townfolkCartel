var ResourceFiles = function(game) {};

ResourceFiles.prototype = {
    preload: function() {
        this.info = TownModel.getOverview();
        this.healthInfo = TownModel.getHealth();
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
        }, "ResourceFiles", 400, 500);
        
    }
    
    , timerTrigger: function() {
        TownModel.goAdventuring();
        TownModel.visitTown();        
        this.infoText.text = TownModel.getOverview();
        this.healthText.text = TownModel.getHealth();
    }
};

Phaser.Utils.mixinPrototype(ResourceFiles.prototype, mixins);