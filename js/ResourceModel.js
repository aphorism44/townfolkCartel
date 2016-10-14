
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
            for (var i = 0; i < level; i++)
                itemArray.push(this.itemMap.get(category)[i]);
            if (itemArray.length < 1)
                return "Nothing"
            
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
        ResourceModel.isUltimateItemAvailable = function(name) {
            var needed = this.ultimateItemMap.get(name).needArray;
            var bought = this.getPurchasedBuildings();
            
            for (var i = 0; i < needed.length; i++)
                if (!bought.includes(needed[i]))
                    return false;
            
            return true;
        }
        function createBldgMap(bldgData) {
            var pool = new Map();
            bldgData.forEach(function(b) {
                pool.set(b.name, {'level': b.level, 'needsArray': b.needs.length > 0 ? b.needs.split(",").map(function(e) { return e.trim(); }): [], 'cost': b.cost, 'produce': b.produce, 'purchased': false });
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
        
        ResourceModel.bldgData = [
            { 'level' : 0, 'name': 'Mountains', 'needs': '', 'cost': 1000, 'produce' : '' }
            , { 'level' : 0, 'name': 'Prairie', 'needs': '', 'cost': 1000, 'produce' : '' }
            , { 'level' : 0, 'name': 'Pastures', 'needs': '', 'cost': 1000, 'produce' : '' }
            , { 'level' : 0, 'name': 'Seacoast', 'needs': '', 'cost': 1000, 'produce' : '' }
            , { 'level' : 0, 'name': 'Forest', 'needs': '', 'cost': 1000, 'produce' : '' }
            , { 'level' : 1, 'name': 'Ore Mine', 'needs': 'Mountains', 'cost': 10000, 'produce' : 'Ore' }
            , { 'level' : 1, 'name': 'Alum Mine', 'needs': 'Mountains', 'cost': 10000, 'produce' : 'Shale' }
            , { 'level' : 1, 'name': 'Grain Farm', 'needs': 'Prairie', 'cost': 10000, 'produce' : 'Grain' }
            , { 'level' : 1, 'name': 'Hops Farm', 'needs': 'Prairie', 'cost': 10000, 'produce' : 'Hops' }
            , { 'level' : 1, 'name': 'Vineyard', 'needs': 'Prairie', 'cost': 10000, 'produce' : 'Grapes' }
            , { 'level' : 1, 'name': 'Sheep Pasture', 'needs': 'Pasture', 'cost': 10000, 'produce' : 'Sheep' }
            , { 'level' : 1, 'name': 'Cattle Ranch', 'needs': 'Pasture', 'cost': 10000, 'produce' : 'Cattle' }
            , { 'level' : 1, 'name': 'Dock', 'needs': 'Seacoast', 'cost': 10000, 'produce' : 'Fish' }
            , { 'level' : 1, 'name': 'Saltbeds', 'needs': 'Seacoast', 'cost': 10000, 'produce' : 'Brine' }
            , { 'level' : 1, 'name': 'Lumberjack Camp', 'needs': 'Forest', 'cost': 10000, 'produce' : 'Logs' }
            , { 'level' : 2, 'name': 'Blast Furnace', 'needs': 'Ore Mine', 'cost': 1000000, 'produce' : 'Slag' }
            , { 'level' : 2, 'name': 'Calcinator', 'needs': 'Alum Mine', 'cost': 1000000, 'produce' : 'Sulfates' }
            , { 'level' : 2, 'name': 'Mill', 'needs': 'Grain Farm', 'cost': 1000000, 'produce' : 'Flour' }
            , { 'level' : 2, 'name': 'Ale Brewery', 'needs': 'Grain Farm', 'cost': 1000000, 'produce' : 'Small Ale' }
            , { 'level' : 2, 'name': 'Beer Brewery', 'needs': 'Grain Farm, Hops Farm', 'cost': 1000000, 'produce' : 'Small Beer' }
            , { 'level' : 2, 'name': 'Winery', 'needs': 'Vineyard', 'cost': 1000000, 'produce' : 'Wine' }
            , { 'level' : 2, 'name': 'Shearing Shed', 'needs': 'Sheep Station', 'cost': 1000000, 'produce' : 'Wool' }
            , { 'level' : 2, 'name': 'Slaughterhouse', 'needs': 'Cattle Ranch', 'cost': 1000000, 'produce' : 'Meat' }
            , { 'level' : 2, 'name': 'Fishery', 'needs': 'Dock', 'cost': 1000000, 'produce' : 'Fish Fillets' }
            , { 'level' : 2, 'name': 'Saltpans', 'needs': 'Saltbeds', 'cost': 1000000, 'produce' : 'Crast' }
            , { 'level' : 2, 'name': 'Sawmill', 'needs': 'Lumberjack Camp', 'cost': 1000000, 'produce' : 'Timber' }
            , { 'level' : 3, 'name': 'Forge', 'needs': 'Blast Furnace, Charcoal Kiln', 'cost': 10000000, 'produce' : 'Iron' }
            , { 'level' : 3, 'name': 'Lixiviator', 'needs': 'Calcinator', 'cost': 10000000, 'produce' : 'Alum' }
            , { 'level' : 3, 'name': 'Bakery', 'needs': 'Mill, Sawmill', 'cost': 10000000, 'produce' : 'Bread' }
            , { 'level' : 3, 'name': 'Ale Conditioner', 'needs': 'Ale Brewery', 'cost': 10000000, 'produce' : 'Dark Ale' }
            , { 'level' : 3, 'name': 'Beer Filtrator', 'needs': 'Beer Brewery', 'cost': 10000000, 'produce' : 'Bright Beer' }
            , { 'level' : 3, 'name': 'Distillery', 'needs': 'Winery, Charcoal Kiln', 'cost': 10000000, 'produce' : 'Liquor' }
            , { 'level' : 3, 'name': 'Spinning Jenny', 'needs': 'Shearing Shed, Sawmill, Forge', 'cost': 10000000, 'produce' : 'Yarn' }
            , { 'level' : 3, 'name': 'Smokehouse', 'needs': 'Slaughterhouse, Sawmill', 'cost': 10000000, 'produce' : 'Jerky' }
            , { 'level' : 3, 'name': 'Brinery', 'needs': 'Fishery, Sawmill, Saltbeds', 'cost': 10000000, 'produce' : 'Saltfish' }
            , { 'level' : 3, 'name': 'Saltern', 'needs': 'Saltpans, Sawmill', 'cost': 10000000, 'produce' : 'Salt' }
            , { 'level' : 3, 'name': 'Charcoal Kiln', 'needs': 'Sawmill', 'cost': 10000000, 'produce' : 'Charcoal' }
        ];
        
        ResourceModel.itemData = [
            {'category' : 'weapons', 'list': 'club, knife, hatchet, morningstar, shortsword, shortbow, longsword, longbow, battleaxe, broadsword, falchion, crossbow' }
            , {'category' : 'armor', 'list': 'leather armon, buckler, short hauberk, roundshield, long hauberk, kite shield, lamellar, scale armor, partial plate, pavise, full plate, cuirass' }
            , {'category' : 'items', 'list': 'knapsack, tent, flint, dried fruit, canteen, boots, cloak, jerky, waterproof poncho, cuttlefish, waterproof jersey, portable stove' }
            , {'category' : 'medicine', 'list': 'chicken soup, bandages, splints, herbs, iodine, crutches, leeches, tincture, bloodletting, mineral salt, scalpel, elixir' }
        ];
        
        ResourceModel.ultimateItemData = [
           { 'name' : 'Arquebus', 'location': 'Blacksmith', 'needtext' : 'Forge (iron castings)\nLixiviator (potassium)\nCharcoal Kiln (charcoal)', 'desc' : 'The newest weapon on the market – makes a crossbow look tame! Just load it with this new “gunpowder” powder, aim, and shoot!', 'needList': 'Forge, Lixiviator, Charcoal Kiln' }
            , { 'name' : 'Brigandine', 'location': 'Blacksmith', 'needtext' : 'Forge (iron patches)\nSpinning Jenny (padding)\nCharcoal Kiln (charcoal)', 'desc' : 'Looking for armor that is strong but also light? Try the brigandine, with its thick padding with strategically placed sheets of armot stitched throughout.', 'needList': 'Forge, Spinning Jenny, Lixiciator' }
            , { 'name' : 'Pemmican', 'location': 'Item Shop', 'needtext' : 'Smokehouse (jerky)\nDistillery (leftover fruit)\nCharcoal Kiln (charcoal)', 'desc' : 'The ultimate in adventuring rations! A mixture of ground jerky, fruit, and fat, that will literally last decades!', 'needList': 'Smokehouse, Distillery, Charcoal Kiln' }
            , { 'name' : 'Poultice', 'location': 'Temple', 'needtext' : 'Lixiciator (alum)\nSpinning Jenny (cloth)\nSaltern (salt)', 'desc' : 'Suffering from a deep sword wound? We have the answer – our temple’s special mixture of medicine bandaged over the wound. The best choice until we invent penicillin….', 'needList': 'Lixiciator, Spinning Jenny, Saltern' }
            , { 'name' : 'Black Velvet', 'location': 'Tavern', 'needtext' : 'Ale Brewery (dark ale)\nBeer Brewery (stout)\nDistillery (champagne)', 'desc' : 'Fancy! A beer cocktail that uses the darkest stout and the bubbliest champagne. A great mixture of flavor that goes straight to your head.', 'needList': 'Ale Brewery, Beer Brewery, Distillery' }
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