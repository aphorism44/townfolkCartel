var HelpScreen = function(game) {};

HelpScreen.prototype = {
    preload: function() {
        }
    
    , create: function() {
        var state = this;
        this.stage.disableVisibilityChange = false;
        var bg = game.add.sprite(0, 0, 'parchment-bg');
        
        this.addMenuOption('Return', function () {
            game.state.start("Game")
        }, 400, 500);
    }
};

Phaser.Utils.mixinPrototype(HelpScreen.prototype, mixins);