
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
            var types = new Set();
            for (var [key, value] of this.buildingMap)
                if (value.location === loc)
                    types.add(value.industry);
            return Array.from(types);
        }
        function createBldgMap(bldgData) {
            var pool = new Map();
            bldgData.forEach(function(b) {
                pool.set(b.name, {'level': b.level, 'needsArray': b.needs.length > 0 ? b.needs.split(",").map(function(e) { return e.trim(); }): [], 'cost': b.cost, 'graphic': b.graphic, 'location': b.location, 'industry': b.industry, 'desc': b.desc, 'purchased': false });
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
                pool.set(u.location,  {'name': u.name, 'needArray': u.needList.split(",").map(function(e) { return e.trim(); }), 'location': u.location, 'needText': u.needtext, 'desc': u.desc, 'tab': u.tab, 'purchased': false });
            });
            return pool;
        }
        
        ResourceModel.ultimateItemData = [
           { 'name' : 'Arquebus', 'location': 'sword', 'needtext' : 'Iron Roller (castings)\nChemist (potassium)\nCharcoal Kiln (forge charcoal)', 'desc' : '<b>Mizak\’s Notes.</b> The newest weapon on the market – makes a crossbow look tame! Just load it with this new “gunpowder” powder, aim, and shoot!', 'needList': 'Iron Roller, Chemist, Charcoal Kiln', 'tab': 'Ultimate Weapon' }
            , { 'name' : 'Brigandine', 'location': 'armor', 'needtext' : 'Iron Roller (plate)\nLoom (padding)\nCharcoal Kiln (forge charcoal)', 'desc' : '<b>Mizak\’s Notes.</b> Looking for armor that is strong but also light? Try the brigandine, with its thick padding with strategically placed sheets of armot stitched throughout.', 'needList': 'Iron Roller, Loom, Charcoal Kiln', 'tab': 'Ultimate Armor' }
            , { 'name' : 'Pemmican', 'location': 'shop', 'needtext' : 'Smokehouse (jerky)\nWinepress (leftover fruit)\nSawmill (firewood)', 'desc' : '<b>Mizak\’s Notes.</b> The ultimate in adventuring rations! A mixture of ground jerky, dried fruit, and fat, that will literally last decades!', 'needList': 'Smokehouse, Winepress, Sawmill', 'tab': 'Ultimate Item' }
            , { 'name' : 'Poultice', 'location': 'temple', 'needtext' : 'Hops Farm (herbs from weeds)\nLoom (cloth bangages)\nSaltern (sea minerals)', 'desc' : '<b>Mizak\’s Notes.</b> Suffering from a deep sword wound? We have the answer – our temple’s special mixture of medicine bandaged over the wound. The best choice until we invent penicillin….', 'needList': 'Hops Farm, Loom, Saltern', 'tab': 'Ultimate Medicine' }
            , { 'name' : 'Black Velvet', 'location': 'tavern', 'needtext' : 'Beer Brewery (stout)\nWinery (champagne)\nBakery (pretzels…)', 'desc' : '<b>Mizak\’s Notes.</b> Fancy! A beer cocktail that uses the darkest stout and the bubbliest champagne. A great mixture of flavor that goes straight to your head.', 'needList': 'Beer Brewery, Winery, Bakery', 'tab': 'Ultimate Drink' }
            , { 'name' : 'Bordello', 'location': 'inn', 'needtext' : 'Shearing Shed (sheepskins)\nWinery (booze)\nDocks (employees…)', 'desc' : '<b>Mizak\’s Notes.</b> Why should I be ashamed? It\’s the world’s oldest profession, and we need to accommodate our brave adventurers! I\’m not sexist – we’ll hire both men and women! And don\’t worry! I\’ll only hire from out of town, and we\’ll make everyone use protection!', 'needList': 'Shearing Shed, Winery, Docks', 'tab': 'Ultimate Inn' }
        ];

        ResourceModel.itemData = [
            {'category' : 'sword', 'list': 'club, knife, hatchet, morningstar, shortsword, shortbow, longsword, longbow, battleaxe, broadsword, falchion, crossbow' }
            , {'category' : 'armor', 'list': 'leather armor, buckler, short hauberk, roundshield, long hauberk, kite shield, lamellar, scale armor, partial plate, pavise, full plate, cuirass' }
            , {'category' : 'shop', 'list': 'knapsack, tent, flint, dried fruit, canteen, boots, cloak, jerky, waterproof poncho, cuttlefish, waterproof jersey, portable stove' }
            , {'category' : 'temple', 'list': 'chicken soup, bandages, splints, herbs, iodine, crutches, leeches, tincture, bloodletting, mineral salt, scalpel, elixir' }
            , {'category' : 'tavern', 'list': 'bread, cheese, stew, ale, coffee, fried chicken, whiskey, fish and chips, pork chops, steak, caviar, champagne' }
            , {'category' : 'inn', 'list': 'straw, blankets, pillows, bunkbeds, stable, singles, showers, catering, groom, hot baths, room service, hot tub' }
        ];

        ResourceModel.bldgData = [
            { 'level' : 1, 'name': 'Lumberjack Camp', 'needs': '', 'cost': 10000, 'graphic' : 'bldgCamp' , 'location': 'forest', 'industry': 'wood', 'desc': 'Allows logging.' }
            , { 'level' : 2, 'name': 'Sawmill', 'needs': 'Lumberjack Camp', 'cost': 1000000, 'graphic' : 'bldgSawmill' , 'location': 'forest', 'industry': 'wood', 'desc': 'Produces timber from logs.' }
            , { 'level' : 3, 'name': 'Charcoal Kiln', 'needs': 'Sawmill', 'cost': 10000000, 'graphic' : 'bldgKiln' , 'location': 'forest', 'industry': 'wood', 'desc': 'Produces charcoal from timber.' }
            
            , { 'level' : 1, 'name': 'Ore Mine', 'needs': '', 'cost': 10000, 'graphic' : 'bldgOreMine' , 'location': 'mountains', 'industry': 'ore', 'desc': 'Extracts rock with metals.' }
            , { 'level' : 1, 'name': 'Alum Mine', 'needs': '', 'cost': 10000, 'graphic' : 'bldgAlumMine' , 'location': 'mountains', 'industry': 'alum', 'desc': 'Extracts rock with certain minerals.' }
            , { 'level' : 2, 'name': 'Smelter', 'needs': 'Ore Mine', 'cost': 1000000, 'graphic' : 'bldgSmelter' , 'location': 'mountains', 'industry': 'ore', 'desc': 'Seperates metal from ore.' }
            , { 'level' : 2, 'name': 'Seperator', 'needs': 'Alum Mine', 'cost': 1000000, 'graphic' : 'bldgSeperator' , 'location': 'mountains', 'industry': 'alum', 'desc': 'Seperates chemicals from rock.' }
            , { 'level' : 3, 'name': 'Iron Roller', 'needs': 'Smelter, Charcoal Kiln', 'cost': 10000000, 'graphic' : 'bldgRoller' , 'location': 'mountains', 'industry': 'ore', 'desc': 'Produces metal ingots.' }
            , { 'level' : 3, 'name': 'Chemist', 'needs': 'Seperator', 'cost': 10000000, 'graphic' : 'bldgChemist' , 'location': 'mountains', 'industry': 'alum', 'desc': 'Refines alum and other chemicals.' }
            
            , { 'level' : 1, 'name': 'Sheep Pasture', 'needs': '', 'cost': 10000, 'graphic' : 'bldgSheep' , 'location': 'pasture', 'industry': 'wool', 'desc': 'Raises sheep.' }
            , { 'level' : 1, 'name': 'Cattle Ranch', 'needs': '', 'cost': 10000, 'graphic' : 'bldgCattle' , 'location': 'pasture', 'industry': 'beef', 'desc': 'Raises cattle and other food animals.' }
            , { 'level' : 2, 'name': 'Shearing Shed', 'needs': 'Sheep Pasture', 'cost': 1000000, 'graphic' : 'bldgShearer' , 'location': 'pasture', 'industry': 'wool', 'desc': 'Produces wool.' }
            , { 'level' : 2, 'name': 'Slaughterhouse', 'needs': 'Cattle Ranch', 'cost': 1000000, 'graphic' : 'bldgSlaughterhouse' , 'location': 'pasture', 'industry': 'beef', 'desc': 'Produces raw meat.' }
            , { 'level' : 3, 'name': 'Loom', 'needs': 'Shearing Shed, Sawmill, Iron Roller', 'cost': 10000000, 'graphic' : 'bldgLoom' , 'location': 'pasture', 'industry': 'wool', 'desc': 'Produces yarn from wool.' }
            , { 'level' : 3, 'name': 'Smokehouse', 'needs': 'Slaughterhouse, Sawmill', 'cost': 10000000, 'graphic' : 'bldgSmokehouse' , 'location': 'pasture', 'industry': 'beef', 'desc': 'Produces preserved jerky.' }
            
            , { 'level' : 1, 'name': 'Grain Farm', 'needs': '', 'cost': 10000, 'graphic' : 'bldgWheatFarm' , 'location': 'prairie', 'industry': 'grain', 'desc': 'Grows cereals like wheat and corn.' }
            , { 'level' : 1, 'name': 'Hops Farm', 'needs': '', 'cost': 10000, 'graphic' : 'bldgHopsFarm' , 'location': 'prairie', 'industry': 'hops', 'desc': 'Exclusively grows hops for beer.' }
            , { 'level' : 1, 'name': 'Vineyard', 'needs': '', 'cost': 10000, 'graphic' : 'bldgVineyard' , 'location': 'prairie', 'industry': 'wine', 'desc': 'Grows grapes and fruit for wine.' }
            , { 'level' : 2, 'name': 'Mill', 'needs': 'Grain Farm', 'cost': 1000000, 'graphic' : 'bldgMill' , 'location': 'prairie', 'industry': 'grain', 'desc': 'Grinds grains into flour.' }
            , { 'level' : 2, 'name': 'Beer Brewery', 'needs': 'Grain Farm, Hops Farm', 'cost': 1000000, 'graphic' : 'bldgBeerBrewery' , 'location': 'prairie', 'industry': 'hops', 'desc': 'Produces alcoholic beer.' }
            , { 'level' : 2, 'name': 'Winepress', 'needs': 'Vineyard', 'cost': 1000000, 'graphic' : 'bldgWinepress' , 'location': 'prairie', 'industry': 'wine', 'desc': 'Presses juice out of fruits.' }
            , { 'level' : 3, 'name': 'Bakery', 'needs': 'Mill, Sawmill', 'cost': 10000000, 'graphic' : 'bldgBakery' , 'location': 'prairie', 'industry': 'grain', 'desc': 'Produces baked goods from flour.' }
            , { 'level' : 3, 'name': 'Beer Bottler', 'needs': 'Beer Brewery', 'cost': 10000000, 'graphic' : 'bldgBeerBottler' , 'location': 'prairie', 'industry': 'hops', 'desc': 'Prepares beer for trade.' }
            , { 'level' : 3, 'name': 'Winery', 'needs': 'Winepress, Charcoal Kiln', 'cost': 10000000, 'graphic' : 'bldgWinery' , 'location': 'prairie', 'industry': 'wine', 'desc': 'Ages and bottles wine.' }
            
            , { 'level' : 1, 'name': 'Docks', 'needs': '', 'cost': 10000, 'graphic' : 'bldgDock' , 'location': 'sea', 'industry': 'fish', 'desc': 'Allows catching of fish.' }
            , { 'level' : 1, 'name': 'Saltbeds', 'needs': '', 'cost': 10000, 'graphic' : 'bldgSaltbeds' , 'location': 'sea', 'industry': 'salt', 'desc': 'Captures seawater.' }
            , { 'level' : 2, 'name': 'Fishery', 'needs': 'Docks', 'cost': 1000000, 'graphic' : 'bldgFishery' , 'location': 'sea', 'industry': 'fish', 'desc': 'Guts and cleans fresh fish.' }
            , { 'level' : 2, 'name': 'Saltpans', 'needs': 'Saltbeds', 'cost': 1000000, 'graphic' : 'bldgSaltpans' , 'location': 'sea', 'industry': 'salt', 'desc': 'Evaporates seawater.' }
            , { 'level' : 3, 'name': 'Brinery', 'needs': 'Fishery, Sawmill, Saltpans', 'cost': 10000000, 'graphic' : 'bldgBrinery' , 'location': 'sea', 'industry': 'fish', 'desc': 'Produces preserved salt fish.' }
            , { 'level' : 3, 'name': 'Saltern', 'needs': 'Saltpans, Sawmill', 'cost': 10000000, 'graphic' : 'bldgIodiner' , 'location': 'sea', 'industry': 'salt', 'desc': 'Refines salt from seawater residue.' }
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