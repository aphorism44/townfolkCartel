var CutScreen = function(game) {};

CutScreen.prototype = {
    
    create: function() {
        var state = this;
        this.stage.disableVisibilityChange = false;
        var bg = game.add.sprite(0, 0, 'townmenu-bg');
        
        //below are text/graphics for beginning and the 2 endings
        
        var dialogue1 = [
            
            
            
        ];
        
        
        //go backwards and forwards
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

Phaser.Utils.mixinPrototype(CutScreen.prototype, mixins);