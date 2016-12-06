var Achievements = function(game) {};

Achievements.prototype = {
    preload: function() {
        this.info = TownModel.getOverview();
        this.healthInfo = TownModel.getHealth();
        }
    
    , create: function() {
        var state = this;
        this.stage.disableVisibilityChange = false;
        var bg = game.add.sprite(0, 0, 'parchment-bg');
        
        this.playerGoldText = this.add.text(50, 50, 'Thalers: ' + TownModel.moneyPool, {
            font: '24px Arial Black',
            fill: '#fff',
            strokeThickness: 4
        });
        
        this.ultimateItemList = ResourceModel.ultimateItemMap;
        console.log(this.ultimateItemList);
        
        
        
        //timer
        this.gameTimer = game.time.events.loop(1000, this.timerTrigger, this);
        
        //tabs at top
        tabGroup = this.game.add.group();
        this.tabData = [
            { 'industry': 'sword', 'color': 'Red' }
            , { 'industry': 'armor', 'color': 'Blue' }
            , { 'industry': 'shop', 'color': 'Brown' }
            , { 'industry': 'temple', 'color': 'Pink' }
            , { 'industry': 'tavern', 'color': 'Orange' }
            , { 'industry': 'inn', 'color': 'Yellow' }
        ];
        this.tabData.forEach(function(d, index) {
            var tab = game.add.button(25 + (index * 50), 25, 'button' + d.color);
            tab.name = d.industry;
            tab.tabText = tab.addChild(game.add.text(42, 6, ResourceModel.getUltItemTabText(d.industry), { font: '16px TheMinion'}));
            tab.events.onInputDown.add(this.updateText);
            tabGroup.addChild(tab);
        });
        
        //tab-specific graphic and text
        
        
         this.addMenuOption('Return', function () {
            game.state.start("Game")
        }, 400, 500);
        
    }
    
    , updateText: function() {
    
    }
        
    , timerTrigger: function() {
        TownModel.goAdventuring();
        TownModel.visitTown();
        this.playerGoldText.text = 'Thalers: ' + TownModel.moneyPool;
    }
};

Phaser.Utils.mixinPrototype(Achievements.prototype, mixins);