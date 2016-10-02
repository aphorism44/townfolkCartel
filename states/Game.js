var Game = function(game) {};

Game.prototype = {

    preload: function () {
        this.optionCount = 1;
        this.stage.disableVisibilityChange = true;

        if (gameOptions.playMusic) {
            musicPlayer.stop();
            //pick music later
            //musicPlayer = game.add.audio('exit');
            //musicPlayer.play();
        }
        
        
    }
    
    , addMovementButton: function(x, y, text, nextState, color) {
        var buttonImage = this.game.add.bitmapData(476, 48);
        buttonImage.ctx.fillStyle = color;
        buttonImage.ctx.strokeStyle = '#35371c';
        buttonImage.ctx.lineWidth = 4;
        buttonImage.ctx.fillRect(0, 0, 225, 48);
        buttonImage.ctx.strokeRect(0, 0, 225, 48);
        var button;
        button = this.game.add.button(x, y, buttonImage);
        //button.icon = button.addChild(this.game.add.image(6, 6, 'dagger'));
        button.text = button.addChild(this.game.add.text(12, 6, text, {font: '18px TheMinion', fill: 'Black'}));
        //button.details = {cost: 5};
        //button.costText = button.addChild(this.game.add.text(42, 24, 'Cost: ' + //button.details.cost, {font: '16px Arial Black'}));
        button.events.onInputDown.add(function() {
            this.state.start(nextState);
        });
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

    , addAdventurers: function(button) {
        CartelGameModel.addAdventurers(button.details.multiplier, button.details.cost);
        this.playerGoldText.text = 'Thalers: ' + CartelGameModel.moneyPool;
        this.playerAdvText.text = 'Adventurers: ' + CartelGameModel.adventurerList.length;
        //update cost and availability for all
        this.updateButtons();
    }
    
    , create: function () {
        var state = this;
        //console.log(CartelGameModel.getOverview());
        this.stage.disableVisibilityChange = false;
        game.add.sprite(0, 0, 'townmenu-bg');
        //this.addMenuOption('Quit ->', function (e) {
        //    this.game.state.start("GameOver");
        //});
        //scorekeepers
        this.playerGoldText = this.add.text(50, 50, 'Thalers: ' + CartelGameModel.moneyPool, {
            font: '24px Arial Black',
            fill: '#fff',
            strokeThickness: 4
        });
        this.playerAdvText = this.add.text(300, 50, 'Adventurers: ' + CartelGameModel.adventurerList.length, {
            font: '24px Arial Black',
            fill: '#fff',
            strokeThickness: 4
        });
        
        //adventurer control buttons
        var advButtonsData = [
            {icon: 'swordA', name: "Add 1 Adventurer", cost: 50, multiplier: 1 }
            , {icon: 'swordB', name: "Add 10 Adventurers", cost: 500, multiplier: 10 }
            , {icon: 'swordC', name: "Add 100 Adventurers", cost: 5000, multiplier: 100 }
        ];
        
        advButtons = this.game.add.group();
        
        var button;
        this.advImage = this.getButtonImage();
        advButtonsData.forEach(function(buttonData, index) {
            button = state.game.add.button(200, 100 + 50 * index, state.game.advImage);
            button.icon = button.addChild(state.game.add.image(6, 6, buttonData.icon));
            button.text = button.addChild(state.game.add.text(42, 6, buttonData.name, { font: '16px TheMinion'}));
            button.details = buttonData;
            button.costText = button.addChild(state.game.add.text(42, 24, 'Cost: ' + buttonData.cost, {font: '16px TheMinion'}));
            button.events.onInputDown.add(state.addAdventurers, state);
            if (!CartelGameModel.hasAmount(button.details.cost)) {
                button.inputEnabled = false;
                button.alpha = 0.1;
            }
            advButtons.addChild(button);
            
        });
        
        //timer
        this.gameTimer = game.time.events.loop(1000, this.timerTrigger, this);
        
        //navigation buttons
        this.addMovementButton(25, 325, "Visit Tavern", "Tavern", '#f79764');
        this.addMovementButton(275, 325, "Visit Inn", "Inn", '#64f7db');
        this.addMovementButton(25, 425, "Visit Temple", "Temple", '#fdf8f6');
        this.addMovementButton(275, 425, "Visit Blacksmith", "Blacksmith", '#c1b3b3');
        this.addMovementButton(25, 525, "Visit Item Shop", "ItemShop", '#6cf26c');
        this.addMovementButton(275, 525, "Dossiers", "Dossiers", '#f7e664');
        game.add.sprite(450, 100, 'mizakDeform')
    }
    
    , timerTrigger: function() {
        CartelGameModel.goAdventuring();
        CartelGameModel.visitTown();        
        this.playerGoldText.text = 'Thalers: ' + CartelGameModel.moneyPool;
        this.playerAdvText.text = 'Adventurers: ' + CartelGameModel.adventurerList.length;
        this.updateButtons();
    }
    
    , updateButtons: function() {
        //update the prices each button, even if you only click one
        var state = this;
        advButtons.forEach(function(button) {
            button.details.cost = CartelGameModel.adventurerCost() * button.details.multiplier;
            button.costText = button.addChild(state.game.add.text(42, 24, 'Cost: ' + button.details.cost, {font: '16px TheMinion'}));
            if (!CartelGameModel.hasAmount(button.details.cost)) {
                button.inputEnabled = false;
                button.alpha = 0.1;
            } else {
                button.inputEnabled = true;
                button.alpha = 1;
            }
        });
    }
    
};
