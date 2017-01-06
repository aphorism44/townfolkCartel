var HelpScreen = function(game) {};

HelpScreen.prototype = {
    preload: function() {
    }
    
    , create: function() {
        var state = this;
        this.stage.disableVisibilityChange = false;
        var bg = game.add.sprite(0, 0, 'parchment-bg');
         this.playerGoldText = this.add.text(50, 50, 'Gold: ' + GameModel.getMoneyPool(), {
            font: '24px Arial Black',
            fill: '#fff',
            strokeThickness: 4
        });
        
        this.helpText = "Adventurers go out, fight monsters, and bring their treasure back into town.";
        
        this.townText = "Upgrading your town's facilities will increase the share of treasure adventurers spend when they return to town. In addition, upgrades have special effects as detailed.";
        
        this.resourceText = "As you save money, buy up local industries. Each will provide an increase to your income and unlock Ultimate Items.";
        
        this.winText = "Once you've maxed out all upgrades and purchased all available industries, visit the Achievements page to win the game.";
        
        this.help1 = game.add.sprite(10, 100, 'help1');
        this.helpTextBox = this.add.text(250, 100, this.helpText, {
            font: '24px The Minion',
            fill: '#000000',
            strokeThickness: 0,
            wordWrap: true,
            wordWrapWidth: 490
        });
        
        this.help2 = game.add.sprite(525, 200, 'help2');
        this.townTextBox = this.add.text(25, 185, this.townText, {
            font: '24px The Minion',
            fill: '#000000',
            strokeThickness: 0,
            wordWrap: true,
            wordWrapWidth: 500
        });
        
        this.help3 = game.add.sprite(25, 325, 'help3');
        this.resourceTextBox = this.add.text(200, 325, this.resourceText, {
            font: '24px The Minion',
            fill: '#000000',
            strokeThickness: 0,
            wordWrap: true,
            wordWrapWidth: 490 
        });
        
        this.winTextBox = this.add.text(25, 440, this.winText, {
            font: '24px The Minion',
            fill: '#000000',
            strokeThickness: 0,
            wordWrap: true,
            wordWrapWidth: 740 
        });
        
        this.addMenuOption('Return', function () {
            game.state.start("Game")
        }, 400, 525);
        
        //timer
        this.gameTimer = game.time.events.loop(1000, this.timerTrigger, this);
    }
    
    , timerTrigger: function() {
        GameModel.goAdventuring();
        GameModel.visitTown();
        this.playerGoldText.text = 'Gold: ' + GameModel.getMoneyPool();
    }
};

Phaser.Utils.mixinPrototype(HelpScreen.prototype, mixins);