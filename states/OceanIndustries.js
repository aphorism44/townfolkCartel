var OceanIndustries = function(game) {};

OceanIndustries.prototype = {
    preload: function() {
        this.info = TownModel.getOverview();
        this.healthInfo = TownModel.getHealth();
        }
    
    , create: function() {
        var state = this;
        this.stage.disableVisibilityChange = false;
        var bg = game.add.sprite(0, 0, 'sea-bg');
        
        this.playerGoldText = this.add.text(50, 50, 'Thalers: ' + TownModel.moneyPool, {
            font: '24px Arial Black',
            fill: '#fff',
            strokeThickness: 4
        });
        
        
        //timer
        this.gameTimer = game.time.events.loop(1000, this.timerTrigger, this);
        
        //buildings
        this.oceanBldgData = ResourceModel.getLocationBldgs('sea');
         for (var [key, value] of this.oceanBldgData) {
             var button;
             button = state.game.add.button(value.level * 100, value.level * 100, value.graphic);
             
             console.log(ResourceModel.getIndustries('sea'));
             
             //button.events.onInputDown.add(, this);
             
                //place level 1 near bottom and 3 at top
                //if available, place it, otherwise black it out
                //if available, mouseOver = text description appears
             
                //console.log(value);
                //if (value.purchased)
                    
            }
        
        
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

Phaser.Utils.mixinPrototype(OceanIndustries.prototype, mixins);