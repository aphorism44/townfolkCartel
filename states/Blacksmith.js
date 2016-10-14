var Blacksmith = function(game) {};

Blacksmith.prototype = {
    
    create: function() {
        var state = this;
        this.stage.disableVisibilityChange = false;
        game.add.sprite(0, 0, 'blacksmith-bg');
        
        //scorekeepers
        this.playerGoldText = this.add.text(50, 50, 'Thalers: ' + TownModel.moneyPool, {
            font: '24px Arial Black',
            fill: '#fff',
            strokeThickness: 4
        });
        this.hpRollLoss = this.add.text(300, 50, 'HP Loss Roll: ' + TownModel.hpLossRoll, {
            font: '24px Arial Black',
            fill: '#fff',
            strokeThickness: 4
        });
        this.hpPercentLoss = this.add.text(500, 50, 'HP Loss %: ' + TownModel.hpLossPercentage.toFixed(2), {
            font: '24px Arial Black',
            fill: '#fff',
            strokeThickness: 4
        });
        var smithButtonData = [
            {icon: 'swordIcon', name: "Upgrade Swords", level: 1, key: "sword"}
            , {icon: 'armorIcon', name: "Upgrade Armor", level: 1, key: "armor" }
        ];
        
        var info = "When you level up swords, you increase\npossible HP loss per battle (a random\nroll). When you level up armor, you decrease\nHP damage taken every battle."
        
        this.infoText = this.add.text(50, 215, info, {
            font: '24px The Minion',
            fill: '#d41515',
            strokeThickness: 0
        });
        
        smithGroup = this.game.add.group();
        
        var button;
        smithButtonData.forEach(function(buttonData, index) {
            //don't use button image here
            button = state.game.add.button(200, 100 + 50 * index, "");
            button.icon = button.addChild(state.game.add.image(6, 6, buttonData.icon));
            button.key = buttonData.key;
            button.name = buttonData.name;
            button.level = TownModel.getBlacksmithLevel(button.key);
            button.text = button.addChild(state.game.add.text(42, 6, button.name + " To Level " + Number( button.level + 1), { font: '16px TheMinion'}));
            button.cost = TownModel.getBlacksmithCost(button.key);
            button.costText = button.addChild(state.game.add.text(42, 24, 'Cost: ' + button.cost, {font: '16px TheMinion'}));
            
            button.events.onInputDown.add(state.upgradeBlacksmith, state);
            if (!TownModel.hasAmount(button.cost)) {
                button.inputEnabled = false;
                button.alpha = 0.1;
            } else if (button.level > 11) {
                button.inputEnabled = false;
                button.alpha = 0.1;
                button.costText.text = 'MAXED OUT';
            } else {
                button.inputEnabled = true;
                button.alpha = 1;
            }
            smithGroup.addChild(button);
        });
        game.add.sprite(550, 100, 'lemelFull');
        
        this.addMenuOption('Return', function () {
            game.state.start("Game");
        }, 100, 500);
    }

    , upgradeBlacksmith: function(button, statePointer) {
        TownModel.upgradeBlackSmith(button.key, button.cost);
        this.playerGoldText.text = 'Thalers: ' + TownModel.moneyPool;
        this.hpRollLoss.text = 'HP Loss Roll: ' + TownModel.hpLossRoll;
        this.hpPercentLoss.text = 'HP Loss %: ' + TownModel.hpLossPercentage.toFixed(2);
        //update cost and availability for all
        this.updateButtons(statePointer);
    }
    
    , updateButtons: function(statePointer) {
        //update the prices each button, even if you only click one
        smithGroup.forEach(function(button) {
            // make this a function so that it updates after we buy
            function getAdjustedCost() {
                return button.cost;
            }
            function getAdjustedLevel() {
                button.level = TownModel.getBlacksmithLevel(button.key); 
                return Number(button.level + 1);
            }
            button.cost = TownModel.getBlacksmithCost(button.key);
            button.text.text = button.name + " To Level " + getAdjustedLevel();
            button.costText.text = 'Cost: ' + getAdjustedCost();
            if (!TownModel.hasAmount(button.cost)) {
                button.inputEnabled = false;
                button.alpha = 0.1;
            } else if (button.level > 11) {
                button.inputEnabled = false;
                button.alpha = 0.1;
                button.costText.text = 'MAXED OUT';
            } else {
                button.inputEnabled = true;
                button.alpha = 1;
            }
        });
    }
    
    , timerTrigger: function() {
        TownModel.goAdventuring();
        TownModel.visitTown();        
        this.playerGoldText.text = 'Thalers: ' + TownModel.moneyPool;
        this.updateButtons();
    }
    
};

Phaser.Utils.mixinPrototype(Blacksmith.prototype, mixins);