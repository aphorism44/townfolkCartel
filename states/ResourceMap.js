var ResourceMap = function(game) {};

ResourceMap.prototype = {
    preload: function() {
        this.info = GameModel.getOverview();
        }
    
    , create: function() {
        var state = this;
        this.stage.disableVisibilityChange = true;
        var bg = game.add.sprite(0, 0, 'map-bg');
        
        this.playerGoldText = this.add.text(50, 50, 'Gold: ' + GameModel.getMoneyPool(), {
            font: '24px Arial Black',
            fill: '#fff',
            strokeThickness: 4
        });
        
        
        //timer
        this.gameTimer = game.time.events.loop(1000, this.timerTrigger, this);
        
        //resource areas
        this.addMenuOption('Ocean', function () {
            game.currentIndustry = 'sea';
            game.state.start("Industries") 
        }, 600, 450);
        this.addMenuOption('Forest', function () {
            game.currentIndustry = 'forest';
            game.state.start("Industries") 
        }, 125, 175);
        this.addMenuOption('Mountains', function () {
            game.currentIndustry = 'mountains';
            game.state.start("Industries")
        }, 80, 300);
        this.addMenuOption('Prairie', function () {
            game.currentIndustry = 'prairie';
            game.state.start("Industries")
        }, 525, 75);
        this.addMenuOption('Pasture', function () {
            game.currentIndustry = 'pasture';
            game.state.start("Industries")
        }, 125, 430);
        
         this.addMenuOption('[Return]', function () {
            game.state.start("Game")
        }, 300, 525);
        
    }
        
    , timerTrigger: function() {
        GameModel.goAdventuring();
        GameModel.visitTown();
        this.playerGoldText.text = 'Gold: ' + GameModel.getMoneyPool();
    }
};

Phaser.Utils.mixinPrototype(ResourceMap.prototype, mixins);