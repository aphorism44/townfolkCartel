var CutScreen = function(game) {};

CutScreen.prototype = {
    
    create: function() {
        var state = this;
        this.stage.disableVisibilityChange = false;
        var bg = game.add.sprite(0, 0, 'townmenu-bg');
        
        if (gameOptions.playMusic) {
            musicPlayer.stop();
        }
        
        //textbox and graphic for dialogue
        this.textBox = game.add.image(5, 50, 'textBox');
        
        this.dialogueArray = GameModel[game.cutscene + 'Dialogue'];
        this.dialogueLength = this.dialogueArray.length;
        this.index = 0;
        this.updateTextbox();
        
        //only show interest during load
        if (game.cutscene == 'load') {
             this.textBox.addChild(this.game.add.text(50, 200, GameModel.formatBigNumToText(GameModel.idleMoneyMade), {
            font: '24px The Minion',
            fill: '#000000'
            }));
        }
        //final graphic; alpha only changes if you win
        this.winGraphic = game.add.image(10, 75, 'mizakRun');
        this.winGraphic.alpha = 0.0;
        
        //unless automated, add buttons backwards and forwards
        if (game.cutscene != 'win') {
            this.previousButton = this.add.button(100, 500, 'buttonBlack', this.previousText, this);
            this.previousButton.text = this.previousButton.addChild(this.game.add.text(75, 25, "Previous", {font:    '18px TheMinion', fill: 'White'}));

            this.nextButton = this.add.button(450, 500, 'buttonBlack', this.nextText, this);
            this.nextButton.text = this.nextButton.addChild(this.game.add.text(100, 25, "Next", {font: '18px TheMinion', fill: 'White'}));
        } else {
            this.runAutomatedScene();
        }
    }
    
    , previousText: function() {
        this.index == 0? 0: this.index--;
        this.updateTextbox();
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
    }
    
    , runAutomatedScene: function() {
        musicPlayer = game.add.audio('reasonEnding');
        musicPlayer.play();
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