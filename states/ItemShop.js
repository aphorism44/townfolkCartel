var ItemShop = function(game) {};

ItemShop.prototype = {
    
    create: function() {
        var state = this;
        this.stage.disableVisibilityChange = false;
        game.add.sprite(0, 0, 'itemshop-bg');
        //scorekeepers
        this.playerGoldText = this.add.text(50, 50, 'Thalers: ' + TownModel.moneyPool, {
            font: '24px Arial Black',
            fill: '#fff',
            strokeThickness: 4
        });
        this.goldRoll = this.add.text(300, 50, 'Extra Money Roll: ' + TownModel.goldGainRoll, {
            font: '24px Arial Black',
            fill: '#fff',
            strokeThickness: 4
        });
        
        var itemShopButtonData = [
            {icon: 'shopIcon', name: "Upgrade" }
        ];
        var info = "Level up your item shop\nto give adventurers more\nmoney when they fight."
        
        this.infoText = this.add.text(75, 200, info, {
            font: '24px The Minion',
            fill: '#d41515',
            strokeThickness: 0
        });
        var list = "Available Items: " + ResourceModel.getItemList("items", TownModel.shopLevel);
        this.itemText = this.add.text(75, 350, list, {
            font: '24px The Minion',
            fill: '#d41515',
            wordWrap: true,
            wordWrapWidth: 400,
            align: 'left'
        });
        
        itemShopGroup = this.game.add.group();
        var button;
        itemShopButtonData.forEach(function(buttonData, index) {
            button = state.game.add.button(150, 100 + 50 * index, state.game.cache.getBitmapData('button'));
            button.icon = button.addChild(state.game.add.image(6, 6, buttonData.icon));
            button.name = buttonData.name;
            button.level = TownModel.shopLevel;
            button.text = button.addChild(state.game.add.text(42, 6, button.name + " To Level " + Number( button.level + 1), { font: '16px TheMinion'}));
            button.cost = TownModel.shopCost();
            button.costText = button.addChild(state.game.add.text(42, 24, 'Cost: ' + button.cost, {font: '16px TheMinion'}));
            button.events.onInputDown.add(state.upgradeItemShop, state);
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
            itemShopGroup.addChild(button);
        });
        game.add.sprite(500, 100, 'mizakFull');
        
        //timer
        this.gameTimer = game.time.events.loop(1000, this.timerTrigger, this);
        
        this.addMenuOption('Return', function () {
            game.state.start("Game")
        }, 100, 500);
    }

    , upgradeItemShop: function(button, statePointer) {
        TownModel.upgradeShop(button.cost);
        this.playerGoldText.text = 'Thalers: ' + TownModel.moneyPool;
        this.goldRoll.text = 'Extra Money Roll: ' + TownModel.goldGainRoll;
        this.itemText.text = "Available Items: " + ResourceModel.getItemList("items", TownModel.shopLevel);
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
                button.level = TownModel.shopLevel;
                return Number(button.level + 1);
            }
            button.cost = TownModel.shopCost();
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
        this.updateButtons();
    }
};

Phaser.Utils.mixinPrototype(ItemShop.prototype, mixins);