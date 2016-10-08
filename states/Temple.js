var Temple = function(game) {};

Temple.prototype = {
    
    menuConfig: {
        startY: 450,
        startX: 450
    }
    
    , getButtonImage: function() {
        //BUG - the button image below is not rendering; all other parts of button are
        var buttonImage = this.game.add.bitmapData(250, 48);
        buttonImage.ctx.fillStyle = "White";
        buttonImage.ctx.strokeStyle = '#35371c';
        buttonImage.ctx.lineWidth = 4;
        buttonImage.ctx.fillRect(0, 0, 250, 48);
        buttonImage.ctx.strokeRect(0, 0, 250, 48);
        
        return buttonImage;
    }
    
    , create: function() {
        var state = this;
        this.stage.disableVisibilityChange = false;
        game.add.sprite(0, 0, 'temple-bg');
        //scorekeepers
        this.playerGoldText = this.add.text(50, 50, 'Thalers: ' + CartelGameModel.moneyPool, {
            font: '24px Arial Black',
            fill: '#fff',
            strokeThickness: 4
        });
        this.hpCost = this.add.text(300, 50, 'Cost to Heal One HP: ' + CartelGameModel.costPerHP, {
            font: '24px Arial Black',
            fill: '#fff',
            strokeThickness: 4
        });
        
        var templeButtonData = [
            {icon: 'swordA', name: "Upgrade Temple" }
        ];
        
        var info = "Level up your temple to charge\nadventurers more for healing. Watch out - \nif they can't afford it, they might go\nbroke or die!"
        
        this.infoText = this.add.text(300, 200, info, {
            font: '24px The Minion',
            fill: '#d41515',
            strokeThickness: 0
        });
        
        templeGroup = this.game.add.group();
        
        var button;
        this.advImage = this.getButtonImage();
        templeButtonData.forEach(function(buttonData, index) {
            button = state.game.add.button(300, 100 + 50 * index, state.game.advImage);
            //button.icon = button.addChild(state.game.add.image(6, 6, buttonData.icon));
            button.name = buttonData.name;
            button.text = button.addChild(state.game.add.text(42, 6, button.name + " To Level " + Number(CartelGameModel.templeLevel + 1), { font: '16px TheMinion'}));
            button.cost = CartelGameModel.templeCost();
            button.costText = button.addChild(state.game.add.text(42, 24, 'Cost: ' + button.cost, {font: '16px TheMinion'}));
            button.events.onInputDown.add(state.upgradeTemple, state);
            if (!CartelGameModel.hasAmount(button.cost)) {
                button.inputEnabled = false;
                button.alpha = 0.1;
            } else {
                button.inputEnabled = true;
                button.alpha = 1;
            }
            templeGroup.addChild(button);
        });
        game.add.sprite(50, 100, 'jera');
        
        //timer
        this.gameTimer = game.time.events.loop(1000, this.timerTrigger, this);
        
        this.addMenuOption('Return', function () {
            game.state.start("Game")
        }, "Temple", 400, 500);
    }

    , upgradeTemple: function(button, statePointer) {
        CartelGameModel.upgradeTemple(button.cost);
        this.playerGoldText.text = 'Thalers: ' + CartelGameModel.moneyPool;
        this.hpCost.text = 'Cost to Heal One HP: ' + CartelGameModel.costPerHP;
        //update cost and availability for all
        this.updateButtons(statePointer);
    }
    
    , updateButtons: function(statePointer) {
        //update the prices each button, even if you only click one
        templeGroup.forEach(function(button) {
            // make this a function so that it updates after we buy
            function getAdjustedCost() {
                return button.cost;
            }
            function getAdjustedLevel() {
                return Number(CartelGameModel.templeLevel + 1);
            }
            button.cost = CartelGameModel.templeCost();
            button.text.text = button.name + " To Level " + getAdjustedLevel();
            button.costText.text = 'Cost: ' + getAdjustedCost();
            if (!CartelGameModel.hasAmount(button.cost)) {
                button.inputEnabled = false;
                button.alpha = 0.1;
            } else {
                button.inputEnabled = true;
                button.alpha = 1;
            }
        });
    }
    
    , timerTrigger: function() {
        CartelGameModel.goAdventuring();
        CartelGameModel.visitTown();        
        this.playerGoldText.text = 'Thalers: ' + CartelGameModel.moneyPool;
        this.updateButtons();
    }
};

Phaser.Utils.mixinPrototype(Temple.prototype, mixins);