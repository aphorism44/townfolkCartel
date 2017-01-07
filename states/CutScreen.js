var CutScreen = function(game) {};

CutScreen.prototype = {
    
    create: function() {
        var state = this;
        this.stage.disableVisibilityChange = false;
        var bg = game.add.sprite(0, 0, 'townmenu-bg');
        
        if (gameOptions.playMusic) {
            musicPlayer.stop();
        }
        
        //textboxes and graphics for dialogue
        this.textBox = game.add.image(5, 50, 'textBox');
        this.interestBox = game.add.text(100, 200, '', {
            font: '24px The Minion',
            fill: '#000000'
        });
        
        this.dialogueArray = GameModel[game.cutscene + 'Dialogue'];
        this.dialogueLength = this.dialogueArray.length;
        this.index = 0;
        this.updateTextbox();
        
        //only show interest during load; need to account for number crunching time
         
        if (game.cutscene == 'load') {
            this.interestBox.text = "Calculating..."
            if (GameModel.loadGame()) {
                this.automateLoadInfo();
            } else {
                 this.interestBox.text = "Nothing!"
            }
        }
        //final graphic; alpha only changes if you win
        this.winGraphic = game.add.image(10, 75, 'mizakRun');
        this.winGraphic.alpha = 0.0;
        
        //unless automated, add buttons backwards and forwards
        if (game.cutscene == 'win') {
            this.runAutomatedScene();
        } else {
            if (musicPlayer.name !== "daylightsOpening" && gameOptions.playMusic) {
                musicPlayer.stop();
                musicPlayer = game.add.audio('daylightsOpening');
                musicPlayer.loop = true;
                musicPlayer.play();
            }
            
            this.previousButton = this.add.button(100, 500, 'buttonBlack', this.previousText, this);
            this.previousButton.text = this.previousButton.addChild(this.game.add.text(75, 25, "Previous", {font:    '18px TheMinion', fill: 'White'}));

            this.nextButton = this.add.button(450, 500, 'buttonBlack', this.nextText, this);
            this.nextButton.text = this.nextButton.addChild(this.game.add.text(100, 25, "Next", {font: '18px TheMinion', fill: 'White'}));
            
            if (game.cutscene == 'load') {
                this.previousButton.inputEnabled = false;
                this.nextButton.inputEnabled = false;
                this.previousButton.alpha = 0;
                this.nextButton.alpha = 0;
            } else {
                this.checkButtons();
            }
        }
    }
    
    , checkButtons: function() {
        if (this.index == 0) {
            this.previousButton.inputEnabled = false;
            this.previousButton.alpha = 0.1;
        } else {
            this.previousButton.inputEnabled = true;
            this.previousButton.alpha = 1;
        }
    }
    
    , previousText: function() {
        this.index == 0? 0: this.index--;
        this.updateTextbox();
        this.checkButtons();
    }
    
    , nextText: function() {
        this.index++;
        if (this.index >= this.dialogueLength) {
            if (game.cutscene == 'lose') {
                game.state.start("MainMenu");
            } else { //open and load scenes
                game.state.start("Game");
            }
        } else {
            this.updateTextbox();
        }
        this.checkButtons();
    }
    
    , runAutomatedScene: function() {
        if (musicPlayer.name !== "reasonEnding" && gameOptions.playMusic) {
            musicPlayer.stop();
            musicPlayer = game.add.audio('reasonEnding');
            musicPlayer.play();
        }
        //automate the final cutscene; stop at last line 
        game.time.events.loop(7000, this.updateAuto, this);
        //show the final graphic slowly while enlarging and rotating
        game.time.events.add(25000, this.revealPicture, this);
        //finally return to main screen when music done
        game.time.events.add(51000, this.endGame, this);
    }
    
    , updateTextbox: function() {
        this.textBox.removeChildren();
        var headGraphic = game.add.image(400, 175, this.dialogueArray[this.index].graphic);
        this.textBox.addChild(headGraphic);
        this.textBox.addChild(this.game.add.text(50, 50, this.dialogueArray[this.index].text, {
            font: '24px The Minion',
            fill: '#000000',
            wordWrap: true,
            wordWrapWidth: 500 
        }));
        this.textBox.addChild(this.game.add.text(100, 300, this.dialogueArray[this.index].speaker, {
            font: '42px The Minion',
            fill: '#000000'
        }));
    }
    
    , updateAuto: function() {
        if (this.index < this.dialogueLength - 1) {
            this.index++;
            this.updateTextbox();
        }
    }
    
     , automateLoadInfo: function() {
        game.time.events.add(250, this.startLoadLoop, this);
    }
    
    , startLoadLoop: function() {
        GameModel.simulateIdleTime();
        game.time.events.loop(100, this.updateLoadText, this);
    }
    
    , updateLoadText: function() {
        if (GameModel.isIdleCalculated()) {
            this.interestBox.text = GameModel.formatBigNumToText(GameModel.idleMoneyMade);
            this.nextButton.inputEnabled = true;
            this.nextButton.alpha = 1;
        }
    }
    
    , revealPicture: function() {
        game.add.tween(this.winGraphic).to( { alpha: 1 }, 12500, Phaser.Easing.Linear.None, true);
        game.add.tween(this.winGraphic).from( { angle: -180 }, 12500, Phaser.Easing.Linear.None, true);
        game.add.tween(this.winGraphic.scale).from( { x: 0.1, y: 0.1 }, 12500, Phaser.Easing.Linear.None, true);
    }
    
    , endGame: function() {
        game.state.start("MainMenu");
    }
    
};

Phaser.Utils.mixinPrototype(CutScreen.prototype, mixins);