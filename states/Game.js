var Game = function(game) {};

Game.prototype = {

    preload: function () {
        this.stage.disableVisibilityChange = true;
        if (gameOptions.playMusic) {
            musicPlayer.stop();
            //pick music later
            //musicPlayer = game.add.audio('exit');
            //musicPlayer.play();
        }
        
        
    }
    
    , create: function () {
        var state = this;
        //console.log(TownModel.getOverview());
        this.stage.disableVisibilityChange = false;
        game.add.sprite(0, 0, 'townmenu-bg');
        //this.addMenuOption('Quit ->', function (e) {
        //    this.game.state.start("GameOver");
        //});
        //scorekeepers
        this.playerGoldText = this.add.text(50, 50, 'Thalers: ' + TownModel.moneyPool, {
            font: '24px Arial Black',
            fill: '#fff',
            strokeThickness: 4
        });
        this.playerAdvText = this.add.text(300, 50, 'Adventurers: ' + TownModel.adventurerList.length + " / " + TownModel.maxAdventurers, {
            font: '24px Arial Black',
            fill: '#fff',
            strokeThickness: 4
        });
        
        this.maintCostText = this.add.text(50, 275, 'Daily Costs: ' + TownModel.maintenance, {
            font: '24px Arial Black',
            fill: '#fff',
            strokeThickness: 4
        });
        
        //adventurer control buttons
        var advButtonsData = [
            {icon: 'swordA', name: "Add 1 Adventurer", multiplier: 1 }
            , {icon: 'swordB', name: "Add 10 Adventurers", multiplier: 10 }
            , {icon: 'swordC', name: "Add 100 Adventurers", multiplier: 100 }
        ];
        
        advButtons = this.game.add.group();
        
        var button;
        advButtonsData.forEach(function(buttonData, index) {
            button = 
            button = state.game.add.button(200, 100 + 50 * index, state.game.cache.getBitmapData('button'));
            button.icon = button.addChild(state.game.add.image(6, 6, buttonData.icon));
            button.text = button.addChild(state.game.add.text(42, 6, buttonData.name, { font: '16px TheMinion'}));
            button.multiplier = buttonData.multiplier;
            button.cost = TownModel.adventurerCost() * buttonData.multiplier;
            button.costText = button.addChild(state.game.add.text(42, 24, 'Cost: ' + button.cost, {font: '16px TheMinion'}));
            button.events.onInputDown.add(state.addAdventurers, state);
            if (!TownModel.hasAmount(button.cost) || TownModel.adventurerList.length + button.multiplier >= TownModel.maxAdventurers) {
                button.inputEnabled = false;
                button.alpha = 0.1;
            } else {
                button.inputEnabled = true;
                button.alpha = 1;
            }
            advButtons.addChild(button);
            
        });
        
        //timer
        this.gameTimer = game.time.events.loop(1000, this.timerTrigger, this);
        //navigation buttons
        var navButtonsData = [
            { name: "Tavern", color: "#f79764", nav: "TownShop", shop: "tavern" }
            , { name: "Inn", color: "#64f7db", nav: "TownShop", shop: "inn" }
            , { name: "Temple", color: "#fdf8f6", nav: "TownShop", shop: "temple" }
            , { name: "Blacksmith", color: "#c1b3b3", nav: "TownShop", shop: "blacksmith" }
            , { name: "Item Shop", color: "#6cf26c", nav: "TownShop", shop: "itemshop" }
            , { name: "Statistics", color: "#f7e664", nav: "Statistics" }
            , { name: "Buy Resources", color: "#d564f7", nav: "ResourceMap" }
            , { name: "Achievements", color: "#e89541", nav: "Achievements" }
        ];
        
        navButtonsData.forEach(function(buttonData, index) {
            var buttonImage = this.game.add.bitmapData(476, 48);
            buttonImage.ctx.fillStyle = buttonData.color;
            buttonImage.ctx.strokeStyle = '#35371c';
            buttonImage.ctx.lineWidth = 4;
            buttonImage.ctx.fillRect(0, 0, 225, 48);
            buttonImage.ctx.strokeRect(0, 0, 225, 48);
            var button;
            var x = 25 + 250 * (index % 2);
            var y = 325 + 50 * Math.floor(index / 2);
            button = this.game.add.button(x, y, buttonImage);
            //button.icon = button.addChild(this.game.add.image(6, 6, 'dagger'));
            button.text = button.addChild(this.game.add.text(12, 6, buttonData.name, {font: '18px TheMinion', fill: 'Black'}));
            button.events.onInputDown.add(function() {
                if (buttonData.shop)
                    game.currentShop = buttonData.shop;
                game.state.start(buttonData.nav);
            });
        });
        
    }
    
    , timerTrigger: function() {
        TownModel.goAdventuring();
        TownModel.visitTown();        
        this.playerGoldText.text = 'Thalers: ' + TownModel.moneyPool;
        this.playerAdvText.text = 'Adventurers: ' + TownModel.adventurerList.length+ " / " + TownModel.maxAdventurers;
        this.updateButtons();
    }
    
    , addAdventurers: function(button, statePointer) {
        TownModel.addAdventurers(button.multiplier, button.cost);
        this.playerGoldText.text = 'Thalers: ' + TownModel.moneyPool;
        this.playerAdvText.text = 'Adventurers: ' + TownModel.adventurerList.length+ " / " + TownModel.maxAdventurers;
        //update cost and availability for all
        this.updateButtons(statePointer);
    }
    
    , updateButtons: function(statePointer) {
        //update the prices each button, even if you only click one
        advButtons.forEach(function(button) {
            // make this a function so that it updates after we buy
            function getAdjustedCost() {
                return button.cost;
            }
            button.cost = TownModel.adventurerCost() * button.multiplier;
            button.costText.text = 'Cost: ' + getAdjustedCost();
            if (!TownModel.hasAmount(button.cost) || TownModel.adventurerList.length + button.multiplier > TownModel.maxAdventurers) {
                button.inputEnabled = false;
                button.alpha = 0.1;
            } else {
                button.inputEnabled = true;
                button.alpha = 1;
            }
        });
    }
    
};
