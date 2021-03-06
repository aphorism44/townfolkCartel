var Splash = function () {};

Splash.prototype = {

        loadScripts: function () {
            game.load.script('style', 'lib/style.js');
            game.load.script('mixins', 'lib/mixins.js');
            game.load.script('bignumber', 'vendor/bignumber.min.js');
            
            game.load.script('WebFont', 'vendor/webfontloader.js');
            game.load.script('MainMenu','states/MainMenu.js');
            game.load.script('Credits', 'states/Credits.js');
            game.load.script('Options', 'states/Options.js');
            game.load.script('Game', 'states/Game.js');
            game.load.script('TownShop', 'states/TownShop.js');
            game.load.script('Statistics', 'states/Statistics.js');
            game.load.script('Instructions', 'states/Instructions.js');
            game.load.script('ResourceMap', 'states/ResourceMap.js');
            game.load.script('UltimateItems', 'states/UltimateItems.js');
            game.load.script('Achievements', 'states/Achievements.js');
            game.load.script('HelpScreen', 'states/HelpScreen.js');
            game.load.script('Industries', 'states/Industries.js');
            game.load.script('CutScreen', 'states/CutScreen.js');
            game.load.script('GameModel',  'js/GameModel.js');
            
            //my first Phaser.io plugin/API
            game.plugin = game.plugins.add(Phaser.Plugin.BarchartPlugin);
    }

    , loadBgm: function () {
        game.load.audio('menumusic', 'assets/bgm/circularPrelude.mp3');
        game.load.audio('reasonEnding', 'assets/bgm/reasonEnding.mp3');
        game.load.audio('nightCredits', 'assets/bgm/nightCredits.mp3');
        game.load.audio('daylightsOpening', 'assets/bgm/daylightsOpening.mp3');
        game.load.audio('gameMusic', 'assets/bgm/gameMusic.mp3');
    }
    
    , loadImages: function () {
        //backgrounds (800x600)
        game.load.image('mainmenu-bg', 'assets/images/town.jpg');
        game.load.image('townmenu-bg', 'assets/images/townmenu.jpg');
        game.load.image('tavern-bg', 'assets/images/tavern.jpg');
        game.load.image('inn-bg', 'assets/images/inn.jpg');
        game.load.image('blacksmith-bg', 'assets/images/smith.jpg');
        game.load.image('itemshop-bg', 'assets/images/itemshop.jpg');
        game.load.image('temple-bg', 'assets/images/temple.jpg');
        game.load.image('map-bg', 'assets/images/resourceMap.jpg');
        game.load.image('sea-bg', 'assets/images/seaBg.jpg');
        game.load.image('mountains-bg', 'assets/images/mountainBg.jpg');
        game.load.image('forest-bg', 'assets/images/forestBg.jpg');
        game.load.image('prairie-bg', 'assets/images/prairieBg.jpg');
        game.load.image('pasture-bg', 'assets/images/pastureBg.jpg');
        
        //character images (200x200)
        game.load.image('mizakNormal', 'assets/images/mizakNormal.png');
        game.load.image('mizakLaugh', 'assets/images/mizakLaugh.png');
        game.load.image('lemelFrown', 'assets/images/lemelFrown.png');
        game.load.image('lemelOut', 'assets/images/lemelOut.png');
        game.load.image('lissetteAngry', 'assets/images/lissetteAngry.png');
        game.load.image('lissetteFrown', 'assets/images/lissetteFrown.png');
        game.load.image('clavoTalk', 'assets/images/clavoTalk.png');
        game.load.image('clavoFrown', 'assets/images/clavoFrown.png');
        
        game.load.image('jera', 'assets/images/jera.png');
        
        game.load.image('mizakFull', 'assets/images/mizakFull.png');
        game.load.image('lemelFull', 'assets/images/lemelFull.png');
        game.load.image('lissetteFull', 'assets/images/lissetteFull.png');
        game.load.image('clavoFull', 'assets/images/clavoFull.png');
        
        //button icons
        game.load.image('swordA', 'assets/images/greenSword.png');
        game.load.image('swordB', 'assets/images/yellowSword.png');
        game.load.image('swordC', 'assets/images/redSword.png');
        
        game.load.image('tavernIcon', 'assets/images/tavernIcon.png');
        game.load.image('innIcon', 'assets/images/innIcon.png');
        game.load.image('shopIcon', 'assets/images/shopIcon.png');
        game.load.image('swordIcon', 'assets/images/swordIcon.png');
        game.load.image('armorIcon', 'assets/images/armorIcon.png');
        game.load.image('templeIcon', 'assets/images/templeIcon.png');
        
        //resource buildings
        game.load.image('bldgDock', 'assets/images/docks.png');
        game.load.image('bldgFishery', 'assets/images/fishery.png');
        game.load.image('bldgBrinery', 'assets/images/brinery.png');
        game.load.image('bldgSaltbeds', 'assets/images/saltbeds.png');
        game.load.image('bldgSaltpans', 'assets/images/saltpans.png');
        game.load.image('bldgIodiner', 'assets/images/iodiner.png');
        
        game.load.image('bldgCamp', 'assets/images/lumberCamp.png');
        game.load.image('bldgSawmill', 'assets/images/lumbermill.png');
        game.load.image('bldgKiln', 'assets/images/kiln.png');
        
        game.load.image('bldgOreMine', 'assets/images/oreMine.png');
        game.load.image('bldgSmelter', 'assets/images/smelter.png');
        game.load.image('bldgRoller', 'assets/images/roller.png');
        game.load.image('bldgAlumMine', 'assets/images/alumMine.png');
        game.load.image('bldgSeperator', 'assets/images/seperator.png');
        game.load.image('bldgChemist', 'assets/images/chemist.png');
        
        game.load.image('bldgWheatFarm', 'assets/images/wheatFarm.png');
        game.load.image('bldgMill', 'assets/images/mill.png');
        game.load.image('bldgBakery', 'assets/images/bakery.png');
        game.load.image('bldgHopsFarm', 'assets/images/hopsFarm.png');
        game.load.image('bldgAleBrewery', 'assets/images/aleBrewery.png');
        game.load.image('bldgAleBottler', 'assets/images/aleBottler.png');
        game.load.image('bldgBeerBrewery', 'assets/images/beerBrewery.png');
        game.load.image('bldgBeerBottler', 'assets/images/beerBottler.png');
        game.load.image('bldgVineyard', 'assets/images/vineyard.png');
        game.load.image('bldgWinepress', 'assets/images/winepress.png');
        game.load.image('bldgWinery', 'assets/images/winery.png');
        
        game.load.image('bldgSheep', 'assets/images/sheepRanch.png');
        game.load.image('bldgShearer', 'assets/images/shearer.png');
        game.load.image('bldgLoom', 'assets/images/loom.png');
        game.load.image('bldgCattle', 'assets/images/cattleRanch.png');
        game.load.image('bldgSlaughterhouse', 'assets/images/slaughterhouse.png');
        game.load.image('bldgSmokehouse', 'assets/images/smokehouse.png');
        
        //items
        game.load.image('ultSword', 'assets/images/ultSword.png');
        game.load.image('ultArmor', 'assets/images/ultArmor.png');
        game.load.image('ultShop', 'assets/images/ultShop.png');
        game.load.image('ultTemple', 'assets/images/ultTemple.png');
        game.load.image('ultTavern', 'assets/images/ultTavern.png');
        game.load.image('ultInn', 'assets/images/ultInn.png');
        
        //buttons
        game.load.image('buttonBlack', 'assets/images/buttonBlack.png');
        game.load.image('buttonBlue', 'assets/images/buttonBlue.png');
        game.load.image('buttonLtBlue', 'assets/images/buttonLtBlue.png');
        game.load.image('buttonBrown', 'assets/images/buttonBrown.png');
        game.load.image('buttonRed', 'assets/images/buttonRed.png');
        game.load.image('buttonOrange', 'assets/images/buttonOrange.png');
        game.load.image('buttonGreen', 'assets/images/buttonGreen.png');
        game.load.image('buttonPurple', 'assets/images/buttonPurple.png');
        game.load.image('buttonYellow', 'assets/images/buttonYellow.png');
        game.load.image('buttonPink', 'assets/images/buttonPink.png');
        game.load.image('buttonTab', 'assets/images/tab.png');
        
        //other
        game.load.image('mizakDeform', 'assets/images/mizakCartoon.png'); //200x600
        game.load.image('mizakRun', 'assets/images/mizakRun.png'); //790x428
        game.load.image('checkmark', 'assets/images/checkmark.png'); //200x600
        game.load.image('help1', 'assets/images/help1.png');
        game.load.image('help2', 'assets/images/help2.png');
        game.load.image('help3', 'assets/images/help3.png');
        game.load.image('textBox', 'assets/images/npc-info.png');
        game.load.image('speakerIcon', 'assets/images/speakerIcon.png'); //50x50
    }

    , loadFonts: function () {
        WebFontConfig = {
            custom: {
                families: ['TheMinion'],
                urls: ['assets/style/theminion.css']
            }
        }
    }

    , init: function () {
        this.loadingBar = game.make.sprite(game.world.centerX-(387/2), 400, "loading");
        this.logo       = game.make.sprite(game.world.centerX, 200, 'brand');
        this.status     = game.make.text(game.world.centerX, 380, 'Loading...', {fill: 'white'});
        utils.centerGameObjects([this.logo, this.status]);
    }

    , preload: function () {
        game.add.sprite(0, 0, 'parchment-bg');
        game.add.existing(this.logo).scale.setTo(0.5);
        game.add.existing(this.loadingBar);
        game.add.existing(this.status);
        this.load.setPreloadSprite(this.loadingBar);
        
        //create button bitmap data
        var buttonImage = this.game.add.bitmapData(500, 48);
        buttonImage.ctx.fillStyle = 'white';
        buttonImage.ctx.strokeStyle = '#35371c';
        buttonImage.ctx.lineWidth = 2;
        buttonImage.ctx.fillRect(0, 0, 225, 48);
        buttonImage.ctx.strokeRect(0, 0, 225, 48);
        this.game.cache.addBitmapData('button', buttonImage);
        
        this.loadScripts();
        this.loadImages();
        this.loadFonts();
        this.loadBgm();
    }

    , addGameStates: function () {
        
        game.state.add("MainMenu", MainMenu);
        game.state.add("Game", Game);
        game.state.add("Statistics", Statistics);
        game.state.add("Instructions", Instructions);
        game.state.add("ResourceMap", ResourceMap);
        game.state.add("TownShop", TownShop);
        game.state.add("Industries", Industries);
        game.state.add("UltimateItems", UltimateItems);
        game.state.add("Achievements", Achievements);
        game.state.add("HelpScreen", HelpScreen);
        game.state.add("Credits", Credits);
        game.state.add("Options", Options);
        game.state.add("CutScreen", CutScreen);
        
    }

    , addGameMusic: function () {
        musicPlayer = game.add.audio('menumusic');
        musicPlayer.loop = true;
        musicPlayer.volume = 0.5;
        musicPlayer.play();
    }
    
    , create: function() {
        this.status.setText('Ready!');
        this.addGameStates();
        this.addGameMusic();

    setTimeout(function () {
        game.state.start("MainMenu");
        }, 1000);
    }
};