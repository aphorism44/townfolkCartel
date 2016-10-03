var Blacksmith = function(game) {};

Blacksmith.prototype = {
    
    preload: function() {
        
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
    
    , upgradeBlacksmith: function() {
        
    }
    
    , create: function() {
        var state = this;
        this.stage.disableVisibilityChange = false;
        game.add.sprite(0, 0, 'blacksmith-bg');
        
        var smithButtonData = [
            {icon: 'swordA', name: "Upgrade Swords", cost: 1000 }
            , {icon: 'swordB', name: "Upgrade Armor", cost: 1000 }
        ];
        
        smithGroup = this.game.add.group();
        
        var button;
        this.advImage = this.getButtonImage();
        smithButtonData.forEach(function(buttonData, index) {
            button = state.game.add.button(200, 100 + 50 * index, state.game.advImage);
            //button.icon = button.addChild(state.game.add.image(6, 6, buttonData.icon));
            button.text = button.addChild(state.game.add.text(42, 6, buttonData.name, { font: '16px TheMinion'}));
            button.multiplier = 1;
            button.cost = CartelGameModel.adventurerCost() * buttonData.multiplier;
            button.costText = button.addChild(state.game.add.text(42, 24, 'Cost: ' + button.cost, {font: '16px TheMinion'}));
            button.events.onInputDown.add(state.upgradeBlacksmith, state);
            if (!CartelGameModel.hasAmount(button.cost)) {
                button.inputEnabled = false;
                button.alpha = 0.1;
            } else {
                button.inputEnabled = true;
                button.alpha = 1;
            }
            smithGroup.addChild(button);
        });
        game.add.sprite(450, 100, 'mizakDeform');
    }

    , update: function() {
        
    }
    
};