var Achievements = function(game) {};

Achievements.prototype = {
    preload: function() {
        this.info = GameModel.getOverview();
        this.healthInfo = GameModel.getHealth();
        }
    
    , create: function() {
        var state = this;
        this.stage.disableVisibilityChange = false;
        var bg = game.add.sprite(0, 0, 'parchment-bg');
        
        this.stateGroup = this.game.add.group();
        
        this.playerGoldText = this.add.text(50, 50, 'Gold: ' + GameModel.getMoneyPool(), {
            font: '24px Arial Black',
            fill: '#fff',
            strokeThickness: 4
        });
        
        //timer
        this.gameTimer = game.time.events.loop(1000, this.timerTrigger, this);
        
        //tabs at top
        this.tabGroup = this.game.add.group();
        this.addTabs(this); //placed into group in this functionW
        
        //tab-specific graphic and text
        this.tabGraphic = game.add.sprite(50, 250, ''); 
        this.tabText = game.add.text(300, 175, 'Click Tabs for Info', {
            font: '24px The Minion'
            ,fill: '#0b0101'
            ,strokeThickness: 0
            ,wordWrap: true
            ,wordWrapWidth: 450 
        });
        this.needsTextbox = game.add.text(50, 400, '', {
            font: '24px The Minion'
            ,fill: '#150101'
            ,strokeThickness: 0
            ,wordWrap: true
            ,wordWrapWidth: 300
        });
        
         this.addMenuOption('Return', function () {
            game.state.start("Game")
        }, 400, 500);
        
    }
       
    , addTabs: function() {
        var i = 0;
        for (var [key, value] of GameModel.ultimateItemMap) {
            //why does the below work???
            var tab;
            tab = this.add.button(i * 125, 100, 'buttonTab');
            tab.width = 150;
            tab.height = 75;
            tab.name = key;
            tab.desc = value.desc;
            tab.needText = value.needText;
            tab.needArray = value.needArray;
            tab.itemName = value.name;
            tab.inputEnabled = true;
            tab.tabText = tab.addChild(this.game.add.text(80, 20, value.tab.replace(' ', '\n'), {    
                font: '20px TheMinion'
                , wordWrap: true
                , wordWrapWidth: 150
                }));
            tab.events.onInputDown.add(this.updatePage, this);
            this.tabGroup.addChild(tab);
            i++;
        }
    }
    
    , updatePage: function(tab) {
        this.tabGraphic.destroy();
        var gName = 'ult' + tab.name[0].toUpperCase() + tab.name.slice(1, tab.name.length);
        this.tabGraphic = game.add.sprite(50, 200, gName);
        var needTextArray = tab.needText.split("\n");
        this.needsTextbox.text = "Requirements:\n";
        //using parallel arrays
        for (var i = 0; i < tab.needArray.length; i++) {
            if (GameModel.isBuildingPurchased(tab.needArray[i])) {
                this.needsTextbox.text += "$ ";
            } else {
                this.needsTextbox.text += "* ";i
            }
            this.needsTextbox.text += needTextArray[i] + "\n";
        }
        if (!GameModel.isUltimateItemAvailable(tab.name)) {
            this.tabGraphic.tint = "0x000000";
            this.tabText.text = "This item is not yet available. You still need to purchase the resources marked by an asterisk(*).";
        } else {
            this.tabGraphic.tint = "0xFFFFFF";
            this.tabText.text = tab.itemName + "\n\n" + tab.desc;
        }
        
        
    }
      
    , timerTrigger: function() {
        GameModel.goAdventuring();
        GameModel.visitTown();
        this.playerGoldText.text = 'Gold: ' + GameModel.getMoneyPool();
    }
};

Phaser.Utils.mixinPrototype(Achievements.prototype, mixins);