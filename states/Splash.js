var Splash = function () {};

Splash.prototype = {

        loadScripts: function () {
            game.load.script('style', 'lib/style.js');
            game.load.script('mixins', 'lib/mixins.js');
            game.load.script('bignumber', 'vendor/bignumber.min.js');
            
            game.load.script('WebFont', 'vendor/webfontloader.js');
            game.load.script('mainmenu','states/MainMenu.js');
            game.load.script('gameover','states/GameOver.js');
            game.load.script('credits', 'states/Credits.js');
            game.load.script('options', 'states/Options.js');

            game.load.script('game', 'states/Game.js');
            game.load.script('tavern', 'states/Tavern.js');
            game.load.script('inn', 'states/Inn.js');
            game.load.script('itemshop', 'states/ItemShop.js');
            game.load.script('blacksmith', 'states/Blacksmith.js');
            game.load.script('temple', 'states/Temple.js');
            game.load.script('statistics', 'states/Statistics.js');
            game.load.script('instructions', 'states/Instructions.js');
            game.load.script('resourcemap', 'states/ResourceMap.js');
            game.load.script('resourcefiles', 'states/ResourceFiles.js');
            
            game.load.script('oceanindustries', 'states/OceanIndustries.js');
            game.load.script('forestindustries', 'states/ForestIndustries.js');
            game.load.script('mountainindustries', 'states/MountainIndustries.js');
            game.load.script('prairieindustries', 'states/PrairieIndustries.js');
            game.load.script('pastureindustries', 'states/PastureIndustries.js');
            
            game.load.script('townModel',  'js/TownModel.js');
            game.load.script('resourceModel',  'js/ResourceModel.js');
    }

    , loadBgm: function () {
        game.load.audio('menumusic', 'assets/bgm/circularPrelude.mp3');
        game.load.audio('exit', 'assets/bgm/Exit the Premises.mp3');
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
        
        //character images (200x200)
        game.load.image('mizak', 'assets/images/mizak.png');
        game.load.image('lemel', 'assets/images/lemel.png');
        game.load.image('lissette', 'assets/images/lissette.png');
        game.load.image('jera', 'assets/images/jera.png');
        game.load.image('widow', 'assets/images/widow.png');
        
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
        
        //other
        game.load.image('mizakDeform', 'assets/images/mizakCartoon.png'); //200x600
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
        //make button bitmap data
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
        game.state.add("Blacksmith", Blacksmith);
        game.state.add("ItemShop", ItemShop);
        game.state.add("Tavern", Tavern);
        game.state.add("Inn", Inn);
        game.state.add("Temple", Temple);
        game.state.add("Statistics", Statistics);
        game.state.add("Instructions", Instructions);
        game.state.add("ResourceMap", ResourceMap);
        game.state.add("OceanIndustries", OceanIndustries);
        game.state.add("ForestIndustries", ForestIndustries);
        game.state.add("MountainIndustries", MountainIndustries);
        game.state.add("PrairieIndustries", PrairieIndustries);
        game.state.add("PastureIndustries", PastureIndustries);
        game.state.add("ResourceFiles", ResourceFiles);
        game.state.add("GameOver", GameOver);
        game.state.add("Credits", Credits);
        game.state.add("Options", Options);
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