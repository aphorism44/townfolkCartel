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
        this.bldgData = ResourceModel.getLocationBldgs('sea');
        this.bldgTypes = ResourceModel.getIndustries('sea');
        bldgGroup = this.game.add.group();
        
        for (var i = 0; i < this.bldgTypes.length; i++) {
            for (var [key, value] of this.bldgData) {
                if (value.industry === this.bldgTypes[i]) {
                    var b = this.addBuilding(key, value, i);
                    bldgGroup.addChild(b);
                }
            }
        };
        
        
         this.addMenuOption('[Return to Map]', function () {
            game.state.start("ResourceMap")
        }, 300, 525);
        
    }
        
    , timerTrigger: function() {
        TownModel.goAdventuring();
        TownModel.visitTown();
        this.playerGoldText.text = 'Thalers: ' + TownModel.moneyPool;
    }
    
    , addBuilding: function(key, value, col) {
        var bldg = game.add.sprite(25 + col * 130, 50 + value.level * 100, value.graphic);
        return bldg;
    }
};

Phaser.Utils.mixinPrototype(OceanIndustries.prototype, mixins);