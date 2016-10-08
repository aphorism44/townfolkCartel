var ItemShop = function(game) {};

ItemShop.prototype = {
    
    getButtonImage: function() {
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
        game.add.sprite(0, 0, 'itemshop-bg');
        //scorekeepers
        this.playerGoldText = this.add.text(50, 50, 'Thalers: ' + CartelGameModel.moneyPool, {
            font: '24px Arial Black',
            fill: '#fff',
            strokeThickness: 4
        });
        this.goldRoll = this.add.text(300, 50, 'Extra Money Roll: ' + CartelGameModel.goldGainRoll, {
            font: '24px Arial Black',
            fill: '#fff',
            strokeThickness: 4
        });
        
        var itemShopButtonData = [
            {icon: 'swordA', name: "Upgrade Item Shop" }
        ];
        var info = "Level up your item shop\nto give adventurers more\nmoney when they fight."
        
        this.infoText = this.add.text(150, 200, info, {
            font: '24px The Minion',
            fill: '#d41515',
            strokeThickness: 0
        });
        
        itemShopGroup = this.game.add.group();
        var button;
        this.advImage = this.getButtonImage();
        itemShopButtonData.forEach(function(buttonData, index) {
            button = state.game.add.button(150, 100 + 50 * index, state.game.advImage);
            //button.icon = button.addChild(state.game.add.image(6, 6, buttonData.icon));
            button.name = buttonData.name;
            button.text = button.addChild(state.game.add.text(42, 6, button.name + " To Level " + Number(CartelGameModel.shopLevel + 1), { font: '16px TheMinion'}));
            button.cost = CartelGameModel.shopCost();
            button.costText = button.addChild(state.game.add.text(42, 24, 'Cost: ' + button.cost, {font: '16px TheMinion'}));
            button.events.onInputDown.add(state.upgradeItemShop, state);
            if (!CartelGameModel.hasAmount(button.cost)) {
                button.inputEnabled = false;
                button.alpha = 0.1;
            } else {
                button.inputEnabled = true;
                button.alpha = 1;
            }
            itemShopGroup.addChild(button);
        });
        game.add.sprite(500, 100, 'mizakFull');
        
        //timer
        this.gameTimer = game.time.events.loop(1000, this.timerTrigger, this);
        
        this.addMenuOption('Return', function () {
            game.state.start("Game")
        }, "ItemShop", 100, 500);
    }

    , upgradeItemShop: function(button, statePointer) {
        CartelGameModel.upgradeShop(button.cost);
        this.playerGoldText.text = 'Thalers: ' + CartelGameModel.moneyPool;
        this.goldRoll.text = 'Extra Money Roll: ' + CartelGameModel.goldGainRoll;
        //update cost and availability for all
        this.updateButtons(statePointer);
    }
    
    , updateButtons: function(statePointer) {
        //update the prices each button, even if you only click one
        itemShopGroup.forEach(function(button) {
            // make this a function so that it updates after we buy
            function getAdjustedCost() {
                return button.cost;
            }
            function getAdjustedLevel() {
                return Number(CartelGameModel.shopLevel + 1);
            }
            button.cost = CartelGameModel.shopCost();
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

Phaser.Utils.mixinPrototype(ItemShop.prototype, mixins);