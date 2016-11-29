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
        //place buildings
        this.updateBuildings('sea');
        
         this.addMenuOption('[Return to Map]', function () {
            game.state.start("ResourceMap")
        }, 300, 525);
        
    }
        
    , timerTrigger: function() {
        TownModel.goAdventuring();
        TownModel.visitTown();
        this.playerGoldText.text = 'Thalers: ' + TownModel.moneyPool;
    }
    
    , updateBuildings: function(loc) {
        var bldgData = ResourceModel.getLocationBldgs(loc);
        var bldgTypes = ResourceModel.getIndustries(loc);
        bldgGroup = this.game.add.group();
        
        for (var i = 0; i < bldgTypes.length; i++) {
            for (var [key, value] of bldgData) {
                if (value.industry === bldgTypes[i]) {
                    var b = this.addBuilding(key, value, i);
                    bldgGroup.addChild(b);
                }
            }
        }
    }
    
    , addBuilding: function(key, value, col) {
        var bldg = game.add.button(25 + col * 130, 50 + value.level * 100, value.graphic);
        bldg.cost = value.cost;
        bldg.name = key;
        bldg.isPurchased = value.purchased;
        bldg.events.onInputDown.add(this.buyBuilding, this); //how to pass a parameter here?
        return bldg;
    }
    
    , buyBuilding: function(bName) {
        console.log(this.name);
        ResourceModel.buyBuilding(bName);
        this.updateBuildings();
    }
    
};

Phaser.Utils.mixinPrototype(OceanIndustries.prototype, mixins);