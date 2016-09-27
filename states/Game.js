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
    
    , addAdventurerButton: function(x, y, text, iconName, multiplier) {
        var buttonImage = this.game.add.bitmapData(476, 48);
        buttonImage.ctx.fillStyle = "White";
        buttonImage.ctx.strokeStyle = '#35371c';
        buttonImage.ctx.lineWidth = 4;
        buttonImage.ctx.fillRect(0, 0, 250, 48);
        buttonImage.ctx.strokeRect(0, 0, 250, 48);
        var button;
        button = this.game.add.button(x, y, buttonImage);
        button.icon = button.addChild(this.game.add.image(6, 6, iconName));
        button.text = button.addChild(this.game.add.text(45, 6, text, {font: '18px TheMinion', fill: 'Black'}));
        button.details = {cost: CartelGameModel.adventurerCost() * multiplier
                         , multiplier: multiplier};
        button.costText = button.addChild(this.game.add.text(42, 24, 'Cost: ' + button.details.cost, {font: '16px TheMinion'}));
        button.multiplier = multiplier;
        button.events.onInputDown.add(this.addAdventurers, this);
        //below works but have to also dim the button somehow
        if (!CartelGameModel.hasAmount(button.details.cost)) {
            button.inputEnabled = false;
            button.alpha = 0.1;
        }
        
    }
    
    /*
     function create() {        
        buttonA = game.add.sprite(100, 100, 'buttonA');
        buttonA.variable = "Hi there!"        
        buttonA.inputEnabled = true;        
        buttonA.events.onInputDown.add(doSomething, this);    
        
        }    
        function doSomething (item) {        console.log(item.variable);    }
    */

    , addAdventurers: function(button) {
        CartelGameModel.addAdventurers(button.details.multiplier, button.details.cost);
        this.playerGoldText.text = 'Thalers: ' + CartelGameModel.moneyPool;
        this.playerAdvText.text = 'Adventurers: ' + CartelGameModel.adventurerList.length;
    }
    
    , create: function () {
        //console.log(CartelGameModel.getOverview());
        this.stage.disableVisibilityChange = false;
        game.add.sprite(0, 0, 'townmenu-bg');
        //this.addMenuOption('Quit ->', function (e) {
        //    this.game.state.start("GameOver");
        //});
        CartelGameModel.addAdventurers(100);
        //scorekeepers
        this.playerGoldText = this.add.text(50, 50, 'Thalers: ' + CartelGameModel.moneyPool, {
            font: '24px Arial Black',
            fill: '#fff',
            strokeThickness: 4
        });
        this.playerAdvText = this.add.text(200, 50, 'Adventurers: ' + CartelGameModel.adventurerList.length, {
            font: '24px Arial Black',
            fill: '#fff',
            strokeThickness: 4
        });
        
        //adventurer control buttons
        var addAdvA = this.addAdventurerButton(200, 100, "Add 1 Adventurer", "swordA", 1);
        var addAdvB = this.addAdventurerButton(200, 150, "Add 10 Adventurers", "swordB", 10);
        var addAdvC = this.addAdventurerButton(200, 200, "Add 100 Adventurers", "swordC", 100);
        
        //navigation buttons
        this.addMovementButton(25, 325, "Visit Tavern", "Tavern", '#f79764');
        this.addMovementButton(275, 325, "Visit Inn", "Inn", '#64f7db');
        this.addMovementButton(25, 425, "Visit Temple", "Temple", '#fdf8f6');
        this.addMovementButton(275, 425, "Visit Blacksmith", "Blacksmith", '#c1b3b3');
        this.addMovementButton(25, 525, "Visit Item Shop", "ItemShop", '#6cf26c');
        this.addMovementButton(275, 525, "Dossiers", "Dossiers", '#f7e664');
        game.add.sprite(450, 100, 'mizakDeform')
    }
    
    , update: function() {
        this.playerGoldText.text = 'Thalers: ' + CartelGameModel.moneyPool;
        this.playerAdvText.text = 'Adventurers: ' + CartelGameModel.adventurerList.length;
    }
};
