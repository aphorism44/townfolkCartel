var Inn = function(game) {};

Inn.prototype = {
    
    create: function() {
        var state = this;
        this.stage.disableVisibilityChange = false;
        game.add.sprite(0, 0, 'inn-bg');
        //scorekeepers
        this.playerGoldText = this.add.text(50, 50, 'Thalers: ' + TownModel.moneyPool, {
            font: '24px Arial Black',
            fill: '#fff',
            strokeThickness: 4
        });
        this.maxAdvText = this.add.text(300, 50, 'Maximum Adventurers: ' + TownModel.maxAdventurers, {
            font: '24px Arial Black',
            fill: '#fff',
            strokeThickness: 4
        });
        
        var innButtonData = [
            {icon: 'innIcon', name: "Upgrade" }
        ];
        
        var info = "Level up your inn\nto allow more adventurers to\nstay in town."
        
        this.infoText = this.add.text(300, 200, info, {
            font: '24px The Minion',
            fill: '#d41515',
            strokeThickness: 0
        });
        var list = "Available Items: " + ResourceModel.getItemList("inn", TownModel.innLevel);
        this.itemText = this.add.text(300, 350, list, {
            font: '24px The Minion',
            fill: '#d41515',
            wordWrap: true,
            wordWrapWidth: 400,
            align: 'left'
        });
        
        innGroup = this.game.add.group();
        
        var button;
        innButtonData.forEach(function(buttonData, index) {
            button = state.game.add.button(300, 100 + 50 * index, state.game.cache.getBitmapData('button'));
            button.icon = button.addChild(state.game.add.image(6, 6, buttonData.icon));
            button.name = buttonData.name;
            button.level = TownModel.innLevel;
            button.text = button.addChild(state.game.add.text(42, 6, button.name + " To Level " + Number(button.level + 1), { font: '16px TheMinion'}));
            button.cost = TownModel.innCost();
            button.costText = button.addChild(state.game.add.text(42, 24, 'Cost: ' + button.cost, {font: '16px TheMinion'}));
            button.events.onInputDown.add(state.upgradeInn, state);
            if (button.level > 11) {
                button.inputEnabled = false;
                button.alpha = 0.1;
                button.text.text = 'MAXED';
                button.costText.text = 'OUT';
            } else if (!TownModel.hasAmount(button.cost)) {
                button.inputEnabled = false;
                button.alpha = 0.1;
            } else {
                button.inputEnabled = true;
                button.alpha = 1;
            }
            innGroup.addChild(button);
        });
        game.add.sprite(100, 100, 'clavoFull');
        
        //timer
        this.gameTimer = game.time.events.loop(1000, this.timerTrigger, this);
        
        this.addMenuOption('Return', function () {
            game.state.start("Game")
        }, 400, 500);
    }

    , upgradeInn: function(button, statePointer) {
        TownModel.upgradeInn(button.cost);
        this.playerGoldText.text = 'Thalers: ' + TownModel.moneyPool;
        this.maxAdvText.text = 'Maximum Adventurers: ' + TownModel.maxAdventurers;
        this.itemText.text = "Available Items: " + ResourceModel.getItemList("inn", TownModel.innLevel);
        //update cost and availability for all
        this.updateButtons();
    }
    
    , updateButtons: function(statePointer) {
        //update the prices each button, even if you only click one
        innGroup.forEach(function(button) {
            // make this a function so that it updates after we buy
            function getAdjustedCost() {
                return button.cost;
            }
            function getAdjustedLevel() {
                button.level = TownModel.innLevel;
                return Number(button.level + 1);
            }
            button.cost = TownModel.innCost();
            button.text.text = button.name + " To Level " + getAdjustedLevel();
            button.costText.text = 'Cost: ' + getAdjustedCost();
            if (button.level > 11) {
                button.inputEnabled = false;
                button.alpha = 0.1;
                button.text.text = 'MAXED';
                button.costText.text = 'OUT';
            } else if (!TownModel.hasAmount(button.cost)) {
                button.inputEnabled = false;
                button.alpha = 0.1;
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
    }
};

Phaser.Utils.mixinPrototype(Inn.prototype, mixins);