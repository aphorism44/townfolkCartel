var PastureIndustries = function(game) {};

PastureIndustries.prototype = {
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
        
        //buildings
        this.oceanBldgData = ResourceMap.getLocationBldgs('pasture');
        console.log(this.oceanBldgData);
        
        
        
         this.addMenuOption('[Return to Map]', function () {
            game.state.start("ResourceMap")
        }, 300, 525);
        
    }
        
    , timerTrigger: function() {
        TownModel.goAdventuring();
        TownModel.visitTown();
        this.playerGoldText.text = 'Thalers: ' + TownModel.moneyPool;
    }
};

Phaser.Utils.mixinPrototype(PastureIndustries.prototype, mixins);