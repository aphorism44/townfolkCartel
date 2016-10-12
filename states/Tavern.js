var Tavern = function(game) {};

Tavern.prototype = {
    
    create: function() {
        var state = this;
        this.stage.disableVisibilityChange = false;
        game.add.sprite(0, 0, 'tavern-bg');
        //scorekeepers
        this.playerGoldText = this.add.text(50, 50, 'Thalers: ' + TownModel.moneyPool, {
            font: '24px Arial Black',
            fill: '#fff',
            strokeThickness: 4
        });
        this.expRoll = this.add.text(300, 50, 'Extra Experience Roll: ' + TownModel.expGainRoll, {
            font: '24px Arial Black',
            fill: '#fff',
            strokeThickness: 4
        });
        
        var tavernButtonData = [
            {icon: 'tavernIcon', name: "Upgrade" }
        ];
        
        var info = "Level up your tavern\nto give adventurers more\nexperience when they fight."
        
        this.infoText = this.add.text(300, 200, info, {
            font: '24px The Minion',
            fill: '#d41515',
            strokeThickness: 0
        });
        
        tavernGroup = this.game.add.group();
        
        var button;
        tavernButtonData.forEach(function(buttonData, index) {
            button = state.game.add.button(300, 100 + 50 * index, state.game.cache.getBitmapData('button'));
            button.icon = button.addChild(state.game.add.image(6, 6, buttonData.icon));
            button.name = buttonData.name;
            button.text = button.addChild(state.game.add.text(42, 6, button.name + " To Level " + Number(TownModel.tavernLevel + 1), { font: '16px TheMinion'}));
            button.cost = TownModel.tavernCost();
            button.costText = button.addChild(state.game.add.text(42, 24, 'Cost: ' + button.cost, {font: '16px TheMinion'}));
            button.events.onInputDown.add(state.upgradeTavern, state);
            if (!TownModel.hasAmount(button.cost)) {
                button.inputEnabled = false;
                button.alpha = 0.1;
            } else {
                button.inputEnabled = true;
                button.alpha = 1;
            }
            tavernGroup.addChild(button);
        });
        game.add.sprite(50, 100, 'lissetteFull');
        
        //timer
        this.gameTimer = game.time.events.loop(1000, this.timerTrigger, this);
        
        this.addMenuOption('Return', function () {
            game.state.start("Game")
        }, 400, 500);
    }

    , upgradeTavern: function(button, statePointer) {
        TownModel.upgradeTavern(button.cost);
        this.playerGoldText.text = 'Thalers: ' + TownModel.moneyPool;
        this.expRoll.text = 'Extra Experience Roll: ' + TownModel.expGainRoll;
        //update cost and availability for all
        this.updateButtons(statePointer);
    }
    
    , updateButtons: function(statePointer) {
        //update the prices each button, even if you only click one
        tavernGroup.forEach(function(button) {
            // make this a function so that it updates after we buy
            function getAdjustedCost() {
                return button.cost;
            }
            function getAdjustedLevel() {
                return Number(TownModel.tavernLevel + 1);
            }
            button.cost = TownModel.tavernCost();
            button.text.text = button.name + " To Level " + getAdjustedLevel();
            button.costText.text = 'Cost: ' + getAdjustedCost();
            if (!TownModel.hasAmount(button.cost)) {
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
        this.updateButtons();
    }
};

Phaser.Utils.mixinPrototype(Tavern.prototype, mixins);