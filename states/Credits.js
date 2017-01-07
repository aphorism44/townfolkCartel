var Credits = function(game) {};

Credits.prototype = {

    preload: function () {
        this.optionCount = 1;
        this.creditCount = 0;
    },

    addCredit: function(task, author) {
        var authorStyle = { font: '40pt TheMinion', fill: 'white', align: 'center', stroke: 'rgba(0,0,0,0)', strokeThickness: 4};
        var taskStyle = { font: '30pt TheMinion', fill: 'white', align: 'center', stroke: 'rgba(0,0,0,0)', strokeThickness: 4};
        var authorText = game.add.text(game.world.centerX, 900, author, authorStyle);
        var taskText = game.add.text(game.world.centerX, 950, task, taskStyle);
        authorText.anchor.setTo(0.5);
        authorText.stroke = "rgb(0, 0, 0)";
        authorText.strokeThickness = 4;
        taskText.anchor.setTo(0.5);
        taskText.stroke = "rgb(0, 0, 0";
        taskText.strokeThickness = 4;
        game.add.tween(authorText).to( { y: -300 }, 20000, Phaser.Easing.Cubic.Out, true, this.creditCount * 10000);
        game.add.tween(taskText).to( { y: -200 }, 20000, Phaser.Easing.Cubic.Out, true, this.creditCount * 10000);
        this.creditCount ++;
    },

    addMenuOption: function(text, callback) {
        var optionStyle = { font: '30pt TheMinion', fill: 'Black', align: 'left', stroke: 'Black', srokeThickness: 4};
        var txt = game.add.text(10, (this.optionCount * 80) + 450, text, optionStyle);

        txt.stroke = "rgba(0,0,0,0";
        txt.strokeThickness = 4;
        var onOver = function (target) {
            target.fill = "rgb(239, 16, 16)";
            target.stroke = "Black";
            txt.useHandCursor = true;
        };
        var onOut = function (target) {
            target.fill = "white";
            target.stroke = "Black";
            txt.useHandCursor = false;
        };
        //txt.useHandCursor = true;
        txt.inputEnabled = true;
        txt.events.onInputUp.add(callback, this);
        txt.events.onInputOver.add(onOver, this);
        txt.events.onInputOut.add(onOut, this);

        this.optionCount ++;
    },

    create: function () {
        this.stage.disableVisibilityChange = true;

        if (musicPlayer.name !== "unpluggedCredits" && gameOptions.playMusic) {
            musicPlayer.stop();
            musicPlayer = game.add.audio('unpluggedCredits');
            musicPlayer.loop = true;
            musicPlayer.play();
        }
        
        var bg = game.add.sprite(0, 0, 'tavern-bg');
        this.addCredit('Music', 'Exit Vehicles');
        this.addCredit('Character Design', 'AerinBoy');
        this.addCredit('Backgrounds', 'Pixelstalk.net and\nWallpapercave.com');
        this.addCredit('Industrial Building Art', 'Nicubunu at Deviantart');
        this.addCredit('Miscellaneous Backgrounds', 'Alex Alten\nAction RPG Pack ');
        this.addCredit('Developer', 'Dominic Jesse/Aphorism44');
        this.addCredit('Phaser.io', 'Powered By');
        this.addCredit('Phaser Boilerplate', 'Matt McFarland');
        this.addCredit('for playing', 'Thank you');
        this.addMenuOption('<- Back', function (e) {
            game.state.start("MainMenu");
        }, "Credits", 100, 500);
    game.add.tween(bg).to({alpha: 0}, 20000, Phaser.Easing.Cubic.Out, true, 40000);
    }

};
