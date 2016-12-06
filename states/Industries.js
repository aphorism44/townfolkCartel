var Industries = function(game) {};

Industries.prototype = {
    preload: function() {
        this.info = TownModel.getOverview();
        this.healthInfo = TownModel.getHealth();
        this.locationName = game.currentIndustry;
        }
    
    , create: function() {
        var state = this;
        this.stage.disableVisibilityChange = false;
        var bg = game.add.sprite(0, 0, this.locationName + '-bg');
        
        this.playerGoldText = this.add.text(50, 50, 'Thalers: ' + TownModel.moneyPool, {
            font: '24px Arial Black',
            fill: '#fff',
            strokeThickness: 4
        });
        
        //timer
        this.gameTimer = game.time.events.loop(1000, this.timerTrigger, this);
        //buildings
        this.bldgGroup = this.game.add.group();
        this.updateBuildings(this.locationName);
        //textbox
        this.bldgText = this.add.text(450, 100, '', {
            font: '24px The Minion',
            fill: 'Black',
            strokeThickness: 0,
            wordWrap: true,
            wordWrapWidth: 300
        });
        
         this.addMenuOption('[Return to Map]', function () {
            game.state.start("ResourceMap")
        }, 300, 525);
        
    }
        
    , timerTrigger: function() {
        TownModel.goAdventuring();
        TownModel.visitTown();
        this.playerGoldText.text = 'Thalers: ' + TownModel.moneyPool;
    }
    
    , updateBuildings: function() {
        this.bldgGroup.removeAll();
        var bldgData = ResourceModel.getLocationBldgs(this.locationName);
        var bldgTypes = ResourceModel.getIndustries(this.locationName);
        for (var i = 0; i < bldgTypes.length; i++) {
            for (var [key, value] of bldgData) {
                if (value.industry === bldgTypes[i]) {
                    var b = this.addBuilding(key, value, i);
                    this.bldgGroup.addChild(b);
                }
            }
        }
    }
    
    , addBuilding: function(key, value, col) {
        var bldg = game.add.button(25 + col * 130, 50 + value.level * 100, value.graphic);
        bldg.cost = value.cost;
        bldg.name = key;
        bldg.isPurchased = value.purchased;
        bldg.requires = value.needsArray.length < 1 ? 'nothing': value.needsArray.join(', ');
        bldg.isAvailable = ResourceModel.isBuildingAvailable(bldg.name);
        bldg.desc = value.desc;
        bldg.events.onInputOver.add(this.describeBuilding, this);
        //black out unavailable bldgs; mark sold as such; others are clickable
        if (bldg.isPurchased) {
            bldg.text = bldg.addChild(this.game.add.text(50, 50, "SOLD", { font: '16px TheMinion', fill: '#d90e0e' }));
        }
        if (bldg.isAvailable && !bldg.isPurchased) {
            bldg.events.onInputDown.add(function() { 
                this.buyBuilding(bldg.name); 
            } , this);
        }
        if (!bldg.isAvailable) {
            bldg.tint = "0x000000";
        } else {
            bldg.tint = "0xFFFFFF"
        }
        
        return bldg;
    }
    
    , describeBuilding: function(button) {
        this.bldgText.text = button.name + "\n\nRequires: " + button.requires + "\n\n" + button.desc;
    }
    
    , buyBuilding: function(bName) {
        ResourceModel.buyBuilding(bName);
        this.updateBuildings(this.locationName);
    }
    
};

Phaser.Utils.mixinPrototype(Industries.prototype, mixins);