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
        
        //timer
        this.gameTimer = game.time.events.loop(1000, this.timerTrigger, this);
        
        //tabs at top
        this.tabGroup = this.game.add.group();
        this.addTabs();
        
        //tab-specific graphic and text
        this.tabGraphic = game.add.sprite(100, 250, '');
        this.tabText = this.add.text(100, 350, 'Click Tabs for Info', {
            font: '24px Arial Black'
            , fill: '#d41515'
            , strokeThickness = 0
            , wordWrap = true
            , wordWrapWidth = 600
        });
        
         this.addMenuOption('Return', function () {
            game.state.start("Game")
        }, 400, 500);
        
    }
    
    , addTabs: function() {
        var i = 0;
        for (var [key, value] of ResourceModel.ultimateItemMap) {
            var tab = game.add.button(i * 125, 100, 'buttonTab');
            tab.width = 150;
            tab.height = 150;
            tab.name = key;
            tab.desc = value.desc;
            tab.inputEnabled = true;
            tab.tabText = tab.addChild(game.add.text(80, 20, value.tab.replace(' ', '\n'), {    
                font: '20px TheMinion'
                , wordWrap: true
                , wordWrapWidth: 150
                }));
            tab.events.onInputDown.add(this.updateTabs, tab);
            this.tabGroup.addChild(tab);
            i++;
        }
    }
    
    , updateTabs: function(tab) {
        //console.log(tab);
        this.tabGraphic.image = 'ultItem' + tab.name;
        this.tabText.text = tab.desc;
    }
        
    , timerTrigger: function() {
        TownModel.goAdventuring();
        TownModel.visitTown();
        this.playerGoldText.text = 'Thalers: ' + TownModel.moneyPool;
    }
};

Phaser.Utils.mixinPrototype(Achievements.prototype, mixins);