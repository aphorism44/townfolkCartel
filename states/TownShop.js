var TownShop = function(game) {};

TownShop.prototype = {
    
    create: function() {
        var state = this;
        this.loc = game.currentShop;
        this.stage.disableVisibilityChange = false;
        game.add.sprite(0, 0, this.loc + '-bg');
        
        //gold
        this.playerGoldText = this.add.text(50, 50, 'Gold: ' + GameModel.getMoneyPool(), {
            font: '24px Arial Black',
            fill: '#fff',
            strokeThickness: 4
        });
        
        //grab relevant data
        this.shopData = GameModel.getStoreData(this.loc);
        this.buttonData = GameModel.getButtons(this.loc);
        
        //add all the button data to page
        this.shopGroup = this.game.add.group();
        this.updatePage(this.buttonData);
        
        //shop-level info text
        this.infoText = this.add.text(275, 215, this.shopData.text, {
            font: '24px The Minion',
            fill: '#d41515',
            strokeThickness: 0,
            wordWrap: true,
            wordWrapWidth: 500 
        });
        
        //shop-level graphic
        game.add.sprite(0, 80, this.shopData.graphic);
        
        //timer
        this.gameTimer = game.time.events.loop(1000, this.timerTrigger, this);
        
        this.addMenuOption('Return', function () {
            game.state.start("Game")
        }, 75, 500);
    }

    , upgradeStore: function(button, statePointer) {
        GameModel.upgradeTown(button.name, button.cost);
        //update cost and availability for all
        this.buttonData = GameModel.getButtons(this.loc);
        //console.log(this.buttonData);
        this.updatePage(this.buttonData);
    }
    
    
    , updatePage: function(buttonMap) {
        this.shopGroup.removeAll();
        this.playerGoldText.text = 'Gold: ' + GameModel.getMoneyPool();
        this.addHeaderTags(buttonMap);
        this.addButtons(buttonMap);
        this.addLists(buttonMap);
    }
    
    , addHeaderTags: function(buttonMap) {
        var i = 0;
        for (var [key, value] of buttonMap) {
            var tag = this.add.text(300 + (200 * i), 50, value.labelText + ": " + GameModel.getShopStat(value.variable) , {
                font: '24px Arial Black',
                fill: '#fff',
                strokeThickness: 4
            });
            this.shopGroup.addChild(tag);
            
            i++;
        }
    }
    
    , addButtons: function(buttonMap) {
        var j = 0;
        for (var [key, value] of buttonMap) {
            var button;
            button = this.add.button(300, 100 + 50 * j, this.game.cache.getBitmapData('button'));
            button.icon = button.addChild(this.game.add.image(6, 6, key + 'Icon'));
            button.name = key;
            button.level = GameModel[key + "Level"];
            button.text = button.addChild(this.game.add.text(42, 6, button.name + " To Level " + Number( button.level + 1), { font: '16px TheMinion'}));
            button.cost = GameModel[key + 'Cost']();
            button.costText = button.addChild(this.game.add.text(42, 24, 'Cost: ' + GameModel.formatNumToText(button.cost), {font: '16px TheMinion'}));
            button.events.onInputDown.add(this.upgradeStore, this);
            if (!GameModel.hasAmount(button.cost)) {
                button.inputEnabled = false;
                button.alpha = 0.1;
            } else {
                button.inputEnabled = true;
                button.alpha = 1;
            }
            this.shopGroup.addChild(button);
            
            j++;
        }
    }
    
    , addLists: function(buttonMap) {
        var k = 0;
        for (var [key, value] of buttonMap) {
            var list = "Available " + value.goodsText + ": " + GameModel.getItemList(key, GameModel[key + 'Level']);
            var itemText = this.add.text(275, 350 + (100 * k), list, {
                font: '24px The Minion',
                fill: '#d41515',
                wordWrap: true,
                wordWrapWidth: 500,
                align: 'left'
            });
            this.shopGroup.addChild(itemText);
            k++;
        }
    }
    
    , timerTrigger: function() {
        GameModel.goAdventuring();
        GameModel.visitTown();        
        this.playerGoldText.text = 'Gold: ' + GameModel.getMoneyPool();
        this.buttonData = GameModel.getButtons(this.loc);
        this.updatePage(this.buttonData);
    }
};

Phaser.Utils.mixinPrototype(TownShop.prototype, mixins);