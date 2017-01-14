var Achievements = function(game) {};

Achievements.prototype = {
    preload: function() {
        }
    
    , create: function() {
        var state = this;
        this.stage.disableVisibilityChange = true;
        var bg = game.add.sprite(0, 0, 'parchment-bg');
        
        this.playerGoldText = this.add.text(50, 50, 'Gold: ' + GameModel.getMoneyPool(), {
            font: '24px Arial Black',
            fill: '#fff',
            strokeThickness: 4
        });
        
        this.mainLabel = this.add.text(50, 100, 'Shop Upgrade Progress', {
            font: '24px Arial Black'
        });
        
        //the store levels
        this.shopData = GameModel.shopButtonPool;
        var i = 0;
        for (var key in this.shopData) {
            var head = this.add.sprite(40 + (i * 130), 150, this.shopData[key].headGraphic);
            head.width = 75;
            head.height = 75;
            this.add.text(40 + (i * 130), 240
            , this.shopData[key].goodsText + "\n" + GameModel[key + 'Level'] + " / " + GameModel.maxTownLevel , {
                font: '18px The Minion',
                fill: 'Black'
            });
            i++;
        }
        
        
        this.resourceLabel = this.add.text(50, 300, 'Industry Cartel Progress', {
            font: '24px Arial Black'
        });
        //the purchased resources
        this.industryData = GameModel.industryNames;
        for (var j = 0; j < this.industryData.length; j++) {
            this.add.text(20 + (j % 3 * 125), 350 + (Math.floor(j / 3) * 50)
            , this.industryData[j] + ": " + GameModel.getBoughtIndustries(this.industryData[j]) + " / 3", {
                font: '18px The Minion',
                fill: 'Black'
            });
        }
          
        //button if you can win
        if (GameModel.isComplete()) {
             var winButton = this.add.button(500, 325, 'buttonBlack'); winButton.addChild(this.game.add.text(25, 25, "Press to Win!", {font: '18px TheMinion', fill: 'White'}));
            winButton.onInputDown.add(function() {
                game.cutscene = 'win';
                game.state.start("CutScreen");
            });
        } else {
            this.add.text(500, 325, 'Return here when you complete all the winning conditions.', {
                font: '24px The Minion',
                fill: '#000000',
                strokeThickness: 0,
                wordWrap: true,
                wordWrapWidth: 290 
            });
        }
        
        
        
        //timer
        this.gameTimer = game.time.events.loop(1000, this.timerTrigger, this);
        
         this.addMenuOption('Return', function () {
            game.state.start("Game")
        }, 400, 500);
        
    }
    
    , updatePage: function(tab) {
        
        
        
    }
      
    , timerTrigger: function() {
        GameModel.goAdventuring();
        GameModel.visitTown();
        this.playerGoldText.text = 'Gold: ' + GameModel.getMoneyPool();
    }
};

Phaser.Utils.mixinPrototype(Achievements.prototype, mixins);