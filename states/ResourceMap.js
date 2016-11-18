var ResourceMap = function(game) {};

ResourceMap.prototype = {
    preload: function() {
        this.info = TownModel.getOverview();
        this.healthInfo = TownModel.getHealth();
        }
    
    , create: function() {
        var state = this;
        this.stage.disableVisibilityChange = false;
        var bg = game.add.sprite(0, 0, 'map-bg');
        
        this.playerGoldText = this.add.text(50, 50, 'Thalers: ' + TownModel.moneyPool, {
            font: '24px Arial Black',
            fill: '#fff',
            strokeThickness: 4
        });
        
        
        //timer
        this.gameTimer = game.time.events.loop(1000, this.timerTrigger, this);
        
        //resource areas
        this.addMenuOption('Ocean', function () {
            game.state.start("OceanIndustries")
        }, 600, 450);
        this.addMenuOption('Forest', function () {
            game.state.start("ForestIndustries")
        }, 125, 175);
        this.addMenuOption('Mountains', function () {
            game.state.start("MountainIndustries")
        }, 80, 300);
        this.addMenuOption('Prairie', function () {
            game.state.start("PrairieIndustries")
        }, 525, 75);
        this.addMenuOption('Pasture', function () {
            game.state.start("PastureIndustries")
        }, 125, 430);
        
         this.addMenuOption('[Return]', function () {
            game.state.start("Game")
        }, 300, 525);
        
    }
        
    , timerTrigger: function() {
        TownModel.goAdventuring();
        TownModel.visitTown();
        this.playerGoldText.text = 'Thalers: ' + TownModel.moneyPool;
    }
};

Phaser.Utils.mixinPrototype(ResourceMap.prototype, mixins);