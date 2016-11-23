
(function(window){
    'use strict';
    
    function define_resource_model() {
        
        var ResourceModel = {};
        
        ResourceModel.init = function() {
            this.buildingMap = createBldgMap(this.bldgData);
            this.itemMap = createItemMap(this.itemData);
            this.ultimateItemMap = createUltimaMap(this.ultimateItemData);    
        }
        
        ResourceModel.getItemList = function(category, level) {
            var itemArray = [];
            if (level > 12) level = 12;
            for (var i = 0; i < level; i++)
                itemArray.push(" " + this.itemMap.get(category)[i]);
            if (itemArray.length < 1)
                return "nothing"
            
            return itemArray.join(",");
        }
        ResourceModel.getUltimateItemData = function(name) {
            return this.ultimateItemMap.get(name);
        }
        ResourceModel.getBuildingData = function() {
            return this.buildingMap;
        }
        ResourceModel.getPurchasedBuildings = function() {
            var purchasedBuildings = [];
            for (var [key, value] of this.buildingMap) {
                if (value.purchased)
                    purchasedBuildings.push(key);
            }
            return purchasedBuildings;
        }
        ResourceModel.buyBuilding = function(name) {
            this.buildingMap.get(name).purchased = true;
        }
        ResourceModel.isBuildingAvailable = function(name) {
            var needed = this.buildingMap.get(name).needsArray;
            var bought = this.getPurchasedBuildings();
            
            if (needed.length < 0)
                return true;
            
            for (var i = 0; i < needed.length; i++)
                if (!bought.includes(needed[i]))
                    return false;
            
            return true;
        }
        ResourceModel.getLocationBldgs = function(loc) {
            var locBuildings = new Map();
            for (var [key, value] of this.buildingMap) {
                if (value.location === loc)
                    locBuildings.set(key, value);
            }
            return locBuildings;
        }
        ResourceModel.isUltimateItemAvailable = function(name) {
            var needed = this.ultimateItemMap.get(name).needArray;
            var bought = this.getPurchasedBuildings();
            
            for (var i = 0; i < needed.length; i++)
                if (!bought.includes(needed[i]))
                    return false;
            
            return true;
        }
        ResourceModel.getIndustries = function(loc) {
            var industrySet = new Set();
            this.buildingMap.forEach(function(key, value) {
              if (value.location === loc)
                  industrySet.add(value.industry);
            });
            
            console.log(0);
        }
        
        function createBldgMap(bldgData) {
            var pool = new Map();
            bldgData.forEach(function(b) {
                pool.set(b.name, {'level': b.level, 'needsArray': b.needs.length > 0 ? b.needs.split(",").map(function(e) { return e.trim(); }): [], 'cost': b.cost, 'graphic': b.graphic, 'location': b.location, 'purchased': false });
            });
            return pool;
        }
        function createItemMap(itemData) {
            var pool = new Map();
            itemData.forEach(function(i) {
                pool.set(i.category, i.list.split(",").map(function(e) { return e.trim(); }));
            });
            return pool;
        }
        function createUltimaMap(ultimateItemData) {
            var pool = new Map();
            ultimateItemData.forEach(function(u) {
                pool.set(u.name, { 'needArray': u.needList.split(",").map(function(e) { return e.trim(); }), 'location': u.location, 'needText': u.needtext, 'desc': u.desc });
            });
            return pool;
        }
        
        ResourceModel.ultimateItemData = [
           { 'name' : 'Arquebus', 'location': 'Blacksmith', 'needtext' : 'Forge (iron castings)\nLixiviator (potassium)\nCharcoal Kiln (charcoal)', 'desc' : 'The newest weapon on the market – makes a crossbow look lame! Just load it with this new “gunpowder” mixture, aim, and fire!', 'needList': 'Forge, Lixiviator, Charcoal Kiln' }
            , { 'name' : 'Brigandine', 'location': 'Blacksmith', 'needtext' : 'Forge (iron patches)\nSpinning Jenny (padding)\nCharcoal Kiln (charcoal)', 'desc' : 'Looking for armor that is strong but also light? Try the brigandine, with its thick padding with strategically placed sheets of armor stitched throughout.', 'needList': 'Forge, Spinning Jenny, Lixiciator' }
            , { 'name' : 'Pemmican', 'location': 'Item Shop', 'needtext' : 'Smokehouse (jerky)\nDistillery (leftover fruit)\nCharcoal Kiln (charcoal)', 'desc' : 'The ultimate in adventuring rations! A mixture of ground jerky, fruit, and fat, that will literally last decades!', 'needList': 'Smokehouse, Distillery, Charcoal Kiln' }
            , { 'name' : 'Poultice', 'location': 'Temple', 'needtext' : 'Lixiciator (alum)\nSpinning Jenny (cloth)\nSaltern (salt)', 'desc' : 'Suffering from a deep sword wound? We have the answer – our temple’s special mixture of medicine bandaged over the wound. The best choice until we invent penicillin….', 'needList': 'Lixiciator, Spinning Jenny, Saltern' }
            , { 'name' : 'Black Velvet', 'location': 'Tavern', 'needtext' : 'Ale Brewery (dark ale)\nBeer Brewery (stout)\nDistillery (champagne)', 'desc' : 'Fancy! A beer cocktail that uses the darkest stout and the bubbliest champagne. A great mixture of flavor that goes straight to your head.', 'needList': 'Ale Brewery, Beer Brewery, Distillery' }
        ];

        ResourceModel.itemData = [
            {'category' : 'weapons', 'list': 'club, knife, hatchet, morningstar, shortsword, shortbow, longsword, longbow, battleaxe, broadsword, falchion, crossbow' }
            , {'category' : 'armor', 'list': 'leather armor, buckler, short hauberk, roundshield, long hauberk, kite shield, lamellar, scale armor, partial plate, pavise, full plate, cuirass' }
            , {'category' : 'items', 'list': 'knapsack, tent, flint, dried fruit, canteen, boots, cloak, jerky, waterproof poncho, cuttlefish, waterproof jersey, portable stove' }
            , {'category' : 'medicine', 'list': 'chicken soup, bandages, splints, herbs, iodine, crutches, leeches, tincture, bloodletting, mineral salt, scalpel, elixir' }
            , {'category' : 'tavern', 'list': 'bread, cheese, stew, ale, coffee, fried chicken, whiskey, fish and chips, pork chops, steak, caviar, champagne' }
            , {'category' : 'inn', 'list': 'straw, blankets, pillows, bunkbeds, stable, singles, showers, catering, groom, hot baths, room service, bordello' }
        ];

        ResourceModel.bldgData = [
            { 'level' : 1, 'name': 'Docks', 'needs': '', 'cost': 10000, 'graphic' : 'bldgDock', 'location': 'sea', 'industry': 'fish' }
            , { 'level' : 1, 'name': 'Saltbeds', 'needs': '', 'cost': 10000, 'graphic' : 'bldgSaltbeds', 'location': 'sea', 'industry': 'salt' }
            , { 'level' : 2, 'name': 'Fishery', 'needs': 'Dock', 'cost': 1000000, 'graphic' : 'bldgFishery', 'location': 'sea', 'industry': 'fish' }
            , { 'level' : 2, 'name': 'Saltpans', 'needs': 'Saltbeds', 'cost': 1000000, 'graphic' : 'bldgSaltpans', 'location': 'sea', 'industry': 'salt' }
            , { 'level' : 3, 'name': 'Brinery', 'needs': 'Fishery, Sawmill, Saltbeds', 'cost': 10000000, 'graphic' : 'bldgBrinery', 'location': 'sea', 'industry': 'fish' }
            , { 'level' : 3, 'name': 'Saltern', 'needs': 'Saltpans, Sawmill', 'cost': 10000000, 'graphic' : 'bldgIodiner', 'location': 'sea', 'industry': 'salt' }
            
            , { 'level' : 1, 'name': 'Lumberjack Camp', 'needs': '', 'cost': 10000, 'graphic' : 'bldgCamp', 'location': 'forest', 'industry': 'wood' }
            , { 'level' : 2, 'name': 'Sawmill', 'needs': 'Lumberjack Camp', 'cost': 1000000, 'graphic' : 'bldgSawmill', 'location': 'forest', 'industry': 'wood' }
            , { 'level' : 3, 'name': 'Charcoal Kiln', 'needs': 'Sawmill', 'cost': 10000000, 'graphic' : 'bldgKiln', 'location': 'forest', 'industry': 'wood' }
            
            , { 'level' : 1, 'name': 'Ore Mine', 'needs': '', 'cost': 10000, 'graphic' : 'bldgOreMine', 'location': 'mountains', 'industry': 'ore' }
            , { 'level' : 1, 'name': 'Alum Mine', 'needs': '', 'cost': 10000, 'graphic' : 'bldgAlumMine', 'location': 'mountains', 'industry': 'alum' }
            , { 'level' : 2, 'name': 'Smelter', 'needs': 'Ore Mine', 'cost': 1000000, 'graphic' : 'bldgSmelter', 'location': 'mountains', 'industry': 'ore' }
            , { 'level' : 2, 'name': 'Seperator', 'needs': 'Alum Mine', 'cost': 1000000, 'graphic' : 'bldgSeperator', 'location': 'mountains', 'industry': 'alum' }
            , { 'level' : 3, 'name': 'Iron Roller', 'needs': 'Smelter, Charcoal Kiln', 'cost': 10000000, 'graphic' : 'bldgRoller', 'location': 'mountains', 'industry': 'ore' }
            , { 'level' : 3, 'name': 'Chemist', 'needs': 'Seperator', 'cost': 10000000, 'graphic' : 'bldgChemist', 'location': 'mountains', 'industry': 'alum' }
            
            , { 'level' : 1, 'name': 'Grain Farm', 'needs': '', 'cost': 10000, 'graphic' : 'bldgWheatFarm', 'location': 'prairie', 'industry': 'grain' }
            , { 'level' : 1, 'name': 'Hops Farm', 'needs': '', 'cost': 10000, 'graphic' : 'bldgHopsFarm', 'location': 'prairie', 'industry': 'hops' }
            , { 'level' : 1, 'name': 'Vineyard', 'needs': '', 'cost': 10000, 'graphic' : 'bldgVineyard', 'location': 'prairie', 'industry': 'wine' }
            , { 'level' : 2, 'name': 'Mill', 'needs': 'Grain Farm', 'cost': 1000000, 'graphic' : 'bldgMill', 'location': 'prairie', 'industry': 'grain' }
            , { 'level' : 2, 'name': 'Ale Brewery', 'needs': 'Grain Farm', 'cost': 1000000, 'graphic' : 'bldgAleBrewery', 'location': 'prairie', 'industry': 'grain' }
            , { 'level' : 2, 'name': 'Beer Brewery', 'needs': 'Grain Farm, Hops Farm', 'cost': 1000000, 'graphic' : 'bldgBeerBrewery', 'location': 'prairie', 'industry': 'hops' }
            , { 'level' : 2, 'name': 'Winepress', 'needs': 'Vineyard', 'cost': 1000000, 'graphic' : 'bldgWinepress', 'location': 'prairie', 'industry': 'wine' }
            , { 'level' : 3, 'name': 'Bakery', 'needs': 'Mill, Sawmill', 'cost': 10000000, 'graphic' : 'bldgBakery', 'location': 'prairie', 'industry': 'grain' }
            , { 'level' : 3, 'name': 'Ale Bottler', 'needs': 'Ale Brewery', 'cost': 10000000, 'graphic' : 'bldgAleBottler', 'location': 'prairie', 'industry': 'grain' }
            , { 'level' : 3, 'name': 'Beer Bottler', 'needs': 'Beer Brewery', 'cost': 10000000, 'graphic' : 'bldgBeerBottler', 'location': 'prairie', 'industry': 'hops' }
            , { 'level' : 3, 'name': 'Winery', 'needs': 'Winepress, Charcoal Kiln', 'cost': 10000000, 'graphic' : 'bldgWinery', 'location': 'prairie', 'industry': 'wine' }
            
            , { 'level' : 1, 'name': 'Sheep Pasture', 'needs': '', 'cost': 10000, 'graphic' : 'bldgSheep', 'location': 'pasture', 'industry': 'wool' }
            , { 'level' : 1, 'name': 'Cattle Ranch', 'needs': '', 'cost': 10000, 'graphic' : 'bldgCattle', 'location': 'pasture', 'industry': 'beef' }
            , { 'level' : 2, 'name': 'Shearing Shed', 'needs': 'Sheep Pasture', 'cost': 1000000, 'graphic' : 'bldgShearer', 'location': 'pasture', 'industry': 'wool' }
            , { 'level' : 2, 'name': 'Slaughterhouse', 'needs': 'Cattle Ranch', 'cost': 1000000, 'graphic' : 'bldgSlaughterhouse', 'location': 'pasture', 'industry': 'beef' }
            , { 'level' : 3, 'name': 'Loom', 'needs': 'Shearing Shed, Sawmill, Forge', 'cost': 10000000, 'graphic' : 'bldgLoom', 'location': 'pasture', 'industry': 'wool' }
            , { 'level' : 3, 'name': 'Smokehouse', 'needs': 'Slaughterhouse, Sawmill', 'cost': 10000000, 'graphic' : 'bldgSmokehouse', 'location': 'pasture', 'industry': 'beef' }
        ];
        
           
        ResourceModel.init();
        return ResourceModel;
    }
    
    //define globally if it doesn't already exist
    if(typeof(ResourceModel) === 'undefined'){
        window.ResourceModel = define_resource_model();
    }
    else{
        console.log("ResourceModel already defined.");
    }
})(window);