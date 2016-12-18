
(function(window){
    'use strict';
    
    function define_town_model() {
        
        var GameModel = {};
        
        GameModel.init = function() {
            this.adventurerList = [];
            this.deadAdventurerList = [];
            this.brokeAdventurerList = [];
            this.expPool = createExpPool(this.expData);
            this.shopPool = createShopPool(this.shopData);
            this.shopButtonPool = createButtonPool(this.shopButtonData);
            this.lastIncome = 0;
            this.monsterPool = createMonsterPool(this.monsterData);
            this.moneyPool = new BigNumber(1000000);
            //blacksmith stats
            this.swordLevel = 0;
            this.hpLossRoll = 4; //adjustable - die roll to add to damage adventurers lose in a fight
            this.armorLevel = 0;
            this.hpLossPercentage = 0.4; //adjustable - what percentage of damage monsters do in a fight
            //inn stats
            this.innLevel = 0;
            this.maxAdventurers = 20; //adjustable at inn
            //temple stats
            this.templeLevel = 0;
            this.idleDayNumber = 1; //adjustable at temple
            //tavern stats
            this.tavernLevel = 0;
            this.expGainRoll = 4; //adjustable - die roll to add extra experience when an adventurer kills a monster
            //item shop stats
            this.shopLevel = 0;
            this.goldGainRoll = 4; //adjustable - die roll to add extra gold when an adventurer kills a monster    
            //exponential variables for maintenance
            this.swordMaintainExp = 1;
            this.armorMaintainExp = 1;
            this.tavernMaintainExp = 1;
            this.innMaintainExp = 1;
            this.templeMaintainExp = 1;
            this.shopMaintainExp = 1;
            //resource buildings (merged)
            this.buildingMap = createBldgMap(this.bldgData);
            this.itemMap = createItemMap(this.itemData);
            this.ultimateItemMap = createUltimaMap(this.ultimateItemData);
        }
        
        GameModel.addAdventurers = function(num) {
            this.moneyPool -= this.adventurerCost(num);
            for (var i = 0; i < num; i++)
                this.adventurerList.push(new Adventurer(1, this.expPool.get(1)));
        }
        GameModel.hasAmount = function(amount) {
            return amount <= this.moneyPool;
        }
        GameModel.upgradeTown = function(tag, cost) {
            this.moneyPool -= cost;
            var functionName = 'upgrade' + tag[0].toUpperCase() + tag.slice(1);
            console.log(functionName);
            GameModel[functionName]();
        }
        GameModel.upgradeInn = function() {
            this.innLevel++;
            this.maxAdventurers += 10;
        }
        GameModel.upgradeTemple = function() {
            this.templeLevel++;
            this.idleDayNumber++;
        }
        GameModel.upgradeTavern = function() {
            this.tavernLevel++;
            this.expGainRoll++;
        }
        GameModel.upgradeShop = function() {
            this.shopLevel++;
            this.goldGainRoll++;
        }
        GameModel.upgradeSword = function() {
            this.swordLevel++;
            this.hpLossRoll++;
        }
        GameModel.upgradeArmor = function() {
            this.armorLevel++;
            this.hpLossPercentage *= 0.9;
        }
        
        GameModel.adventurerCost = function(numOfAdv) {
            //need to account for exponential growth in cost of adventurers
            var numOfAdventurers = this.adventurerList.length;
            var cost = 0;
            for (var i = 0; i < numOfAdv; i++) {
                cost += this.newAdventurerCost(numOfAdventurers);
                numOfAdventurers++;
            }
            return cost;
        }
        //Price=BaseCost×Multiplier^(#Owned)
        GameModel.newAdventurerCost = function(numOfAdv) {
            return Math.floor(50 * Math.pow(1.07, numOfAdv));
        }
        GameModel.innCost = function() {
            return Math.floor(1000 * Math.pow(1.27, this.innLevel));
        }
        GameModel.templeCost = function() {
            return Math.floor(2000 * Math.pow(1.37, this.templeLevel));
        }
        GameModel.tavernCost = function() {
            return Math.floor(2000 * Math.pow(1.3, this.tavernLevel));
        }
        GameModel.shopCost = function() {
            return Math.floor(3000 * Math.pow(1.5, this.shopLevel));
        }
        GameModel.swordCost = function() {
            return Math.floor(2500 * Math.pow(1.07, this.swordLevel));
        }
        GameModel.armorCost = function() {
            return Math.floor(2500 * Math.pow(1.07, this.armorLevel));
        }
        
        GameModel.getStoreData = function(loc) {
            return this.shopPool.get(loc);
        }
        GameModel.getButtons = function(loc) {
            var buttons = new Map();
            for (var [key, value] of this.shopButtonPool)
                if (value.shop === loc)
                    buttons.set(key, value);
            return buttons;
        }
        
        //below 2 methods are main game loop
        GameModel.goAdventuring = function() {
            var len = this.adventurerList.length;
            for (var i = len - 1; i > -1; i--) {
                var lev = this.adventurerList[i].level + this.adventurerList[i].weaponModifier;
                this.adventurerList[i].takeDamage(Math.round(this.adventurerList[i].hpMax * this.hpLossPercentage) + dieRoll(this.hpLossRoll) - this.adventurerList[i].armorModifier);
                if (this.adventurerList[i].alive) {
                    this.adventurerList[i].lootMonster(lev, this.expGainRoll, this.goldGainRoll);
                    this.adventurerList[i].checkLevel(this.expPool);
                } else {
                    this.deadAdventurerList.push(this.adventurerList.splice(i, 1));
                }
            }
        }
        GameModel.visitTown = function() {
            var len = this.adventurerList.length;
            this.lastIncome = 0;
            for (var i = len - 1; i > -1; i--) {
                //pay for as much healing as possible
                this.lastIncome += this.adventurerList[i].heal(this.costPerHP);
            }
            this.moneyPool += this.lastIncome;
            this.moneyPool -= this.getMaintenanceCost;
        }
        GameModel.getMaintenanceCost = function() {
            return 1;
        }
        //below are reporting methods
        GameModel.getOverview = function() {
            var maintainance = this.getMaintenanceCost();
            var strBuild = "Active Adventurers: " + this.adventurerList.length + "\n";
            strBuild += "Level 1-5: " + this.adventurerList.filter(function(a) { return a.level <= 5; }).length + "\t\t\t";
            strBuild += "/   Level 6-10: " + this.adventurerList.filter(function(a) { return a.level > 5 && a.level <= 10; }).length + "\n";
            strBuild += "Level 11-15: " + this.adventurerList.filter(function(a) { return a.level > 10 && a.level <= 15; }).length + "\t\t\t";
            strBuild += "/   Level 16-20: " + this.adventurerList.filter(function(a) { return a.level > 15 && a.level <= 20; }).length + "\n";
            strBuild += "Level 21+: " + this.adventurerList.filter(function(a) { return a.level > 20; }).length + "\t\t\t";
            strBuild += "/   Dead adventurers: " + this.deadAdventurerList.length + "\n\n";
            //strBuild += "Bankrupt adventurers: " + this.brokeAdventurerList.length + "\n";
            strBuild += "Daily Costs: " + maintainance + " / Daily Revenue: " + this.lastIncome + " / Cash Flow: " + Number(this.lastIncome - maintainance) + "\n";
            strBuild += "Town funds: " + this.moneyPool + "\n\n";
            return strBuild;
        }
        GameModel.getHealth = function() {
            var full = 0, half = 0, low = 0, totalLevel = 0, totalAdv = 0, totalGold = 0;
            this.adventurerList.forEach(function(a) {
                totalLevel += a.level;
                totalGold += a.gold;
                totalAdv++;
                if (a.hp === a.hpMax)
                    full++;
                else if (a.hp < a.hpMax / 2)
                    low++;
                else
                    half++;
            });
            if (totalAdv == 0) totalAdv = 1;
            var strBuild = "Adventurer health:\n";
            strBuild += "Full HP: " + full + "\t\t\t";
            strBuild += "/   Half to Full HP: " + half + "\n";
            strBuild += "Less than Half HP: " + low + "\t\t\t";
            strBuild += "/   Average Level: " + totalLevel / totalAdv + "\n";
            strBuild += "Total Adventurer Cash: " + totalGold + "\n";            
            return strBuild;
        }
        
        function createMonsterPool(monsterData) {
            var pool = new Map();
            monsterData.forEach(function(m) {
                pool.set(m.level, m.name);
            });
            return pool;
        }
         function createExpPool(expData) {
            var pool = new Map();
            expData.forEach(function(e) {
                pool.set(e.level, e.stats);
            });
            return pool;
        }
        function createShopPool(shopData) {
            var pool = new Map();
            shopData.forEach(function(u) {
                pool.set(u.name, { 'graphic': u.graphic, 'text': u.text });
            });
            return pool;
        }
        function createButtonPool(buttonData) {
            var pool = new Map();
            buttonData.forEach(function(u) {
                
                pool.set(u.tag, { 'shop': u.shopName, 'goodsText': u.goodsText, 'labelText': u.labelText });
            });
            return pool;
        }
         
         
         var Being = function(level, levelStats) { 
             this.alive = true;
             this.level = level;
             this.hp = levelStats[1];
             this.fightStat = levelStats[2];
         }
         Being.prototype.takeDamage = function(hpLoss) {
             if (hpLoss > 0) {
                this.hp -= hpLoss;
                if (this.hp <= 0) {
                    this.hp = 0;
                    this.alive = false;
                } 
             }
         }
         
         var Adventurer = function(level, levelStats) {
             Being.call(this, level, levelStats);
             this.hpMax = levelStats[1];
             this.gold = 25;
             this.totalGoldEarned = 0;
             this.totalGoldSpent = 0;
             this.exp = 0;
             this.expToNext = levelStats[0];
             this.broke = false;
             this.weapon = null;
             this.armor = null;
             this.weaponModifier = 0;
             this.armorModifier = 0;
         }
        Adventurer.prototype = Object.create(Being.prototype);
        Adventurer.prototype.constructor = Adventurer;
        Adventurer.prototype.lootMonster = function(deadMonsterLevel, extraExpRoll, extraGoldRoll) {
            var goldDrop = 2 * Math.round(Math.pow(deadMonsterLevel, 1.5));
            var extraGold = dieRoll(extraGoldRoll);
            this.gold += goldDrop + extraGold;
            this.totalGoldEarned += goldDrop + extraGold;
            this.exp += Math.floor(Math.pow(deadMonsterLevel, 1.5)) + dieRoll(extraExpRoll);
        }
        Adventurer.prototype.checkLevel = function(expPool) {
            if (this.exp >= this.expToNext) {
                this.level++;
                if (this.level > 5) {
                    this.expToNext *= 2;
                    this.hpMax += this.level;
                    this.fightStat += Math.ceil(this.level / 10);
                } else {
                    this.expToNext = expPool.get(this.level)[0];
                    this.hpMax = expPool.get(this.level)[1];
                    this.fightStat = expPool.get(this.level)[2];
                }
            }
        }
        Adventurer.prototype.heal = function() {
            //heal as much HP as possible
            var needHeal = this.hpMax - this.hp;
            var healCost = 0;
            if (this.gold < needHeal)
                healCost = this.gold;
            else
                healCost = needHeal;
            this.hp += healCost;
            this.gold -= healCost;
            
            return healCost;
        }
         
        function dieRoll(size) {
            return Math.floor(Math.random() * size) + 1;
        }
        
        //level 21+ = "Boss Level " + level - 20
        GameModel.monsterData = [
            { 'level': 1 , 'name':  'Wolf' }
            , { 'level': 2 , 'name':  'Boar' }
            , { 'level': 3 , 'name':  'Eagle' }
            , { 'level': 4 , 'name':  'Lion' }
            , { 'level': 5 , 'name':  'Bear' }
            , { 'level': 6 , 'name':  'Direwolf' }
            , { 'level': 7 , 'name':  'Deathwolf' }
            , { 'level': 8 , 'name':  'Werewolf' }
            , { 'level': 9 , 'name':  'Hippopatamus' }
            , { 'level': 10 , 'name':  'Dragon' }
            , { 'level': 11 , 'name':  'Ghost' }
            , { 'level': 12 , 'name':  'Ghoul' }
            , { 'level': 13 , 'name':  'Doppleganger' }
            , { 'level': 14 , 'name':  'Fire Fairy' }
            , { 'level': 15 , 'name':  'Rogue Thief' }
            , { 'level': 16 , 'name':  'Rogue Knight' }
            , { 'level': 17 , 'name':  'Rogue Wizard' }
            , { 'level': 18 , 'name':  'Archer Prince' }
            , { 'level': 19 , 'name':  'Woodland Queen' }
            , { 'level': 20 , 'name':  'Forest King' }
        ];
        
        //[expNeeded, hpMax, fightStat]
        //follow this pattern after Level 5:
        //expNeeded = 2 * the previous
        //hpMax += levelJustRaisedTo
        //fightStat += level div 10
        GameModel.expData = [
            { 'level': 1,  'stats': [8, 9, 3] }
            , { 'level': 2,  'stats': [24, 11, 4] }
            , { 'level': 3,  'stats': [96, 14, 5] }
            , { 'level': 4,  'stats': [175, 18, 6] }
            , { 'level': 5,  'stats': [400, 23, 7] }
        ];
        GameModel.shopData = [
              { 'name': 'tavern', 'graphic': 'lissetteFull', 'text': 'Level up your tavern to give adventurers more experience when they fight.' }
            , { 'name': 'inn', 'graphic': 'clavoFull', 'text': 'Level up your inn to allow more adventurers to stay in town.' }
            , { 'name': 'temple', 'graphic': 'jera', 'text': 'Level up your temple to increase the game speed when you\'re not playing.' }
            , { 'name': 'itemshop', 'graphic': 'mizakFull', 'text': 'Level up your item shop to give adventurers more money when they fight.' }
            , { 'name': 'blacksmith', 'graphic': 'lemelFull', 'text': 'When you level up weapons, you increase adventurers\' HP loss per battle (more money made from healing). When you level up armor, you decrease adventurers\' HP damage. Balance these!' }
        ];
        GameModel.shopButtonData = [
            { 'shopName': 'inn', 'goodsText': 'Amenities', 'tag': 'inn', 'labelText': 'Maximum Adventurers' }
            , { 'shopName': 'tavern', 'goodsText': 'Food and Drink', 'tag': 'tavern', 'labelText': 'Extra Experience Roll' }
            , { 'shopName': 'itemshop', 'goodsText': 'Items', 'tag': 'shop', 'labelText': 'Extra Money Roll' }
            , { 'shopName': 'temple', 'goodsText': 'Medicine', 'tag': 'temple', 'labelText': 'Game Days per Idle Day' }
            , { 'shopName': 'blacksmith', 'goodsText': 'Weapons', 'tag': 'sword', 'labelText': 'HP Loss Roll' }
            , { 'shopName': 'blacksmith', 'goodsText': 'Armor', 'tag': 'armor', 'labelText': 'HP Loss %' }
        ];
        
        //resource building functions(merged)
        GameModel.getItemList = function(category, level) {
            var itemArray = [];
            if (level > 12) level = 12;
            for (var i = 0; i < level; i++)
                itemArray.push(" " + this.itemMap.get(category)[i]);
            if (itemArray.length < 1)
                return "nothing"
            
            return itemArray.join(",");
        }
        GameModel.getUltimateItemData = function(name) {
            return this.ultimateItemMap.get(name);
        }
        GameModel.getBuildingData = function() {
            return this.buildingMap;
        }
        GameModel.getPurchasedBuildings = function() {
            var purchasedBuildings = [];
            for (var [key, value] of this.buildingMap) {
                if (value.purchased)
                    purchasedBuildings.push(key);
            }
            return purchasedBuildings;
        }
        GameModel.buyBuilding = function(name) {
            this.buildingMap.get(name).purchased = true;
        }
        GameModel.isBuildingPurchased = function(name) {
            return this.buildingMap.get(name).purchased;
        }
        GameModel.isBuildingAvailable = function(name) {
            var needed = this.buildingMap.get(name).needsArray;
            var bought = this.getPurchasedBuildings();
            
            if (needed.length < 0)
                return true;
            
            for (var i = 0; i < needed.length; i++)
                if (!bought.includes(needed[i]))
                    return false;
            
            return true;
        }
        GameModel.getLocationBldgs = function(loc) {
            var locBuildings = new Map();
            for (var [key, value] of this.buildingMap) {
                if (value.location === loc)
                    locBuildings.set(key, value);
            }
            return locBuildings;
        }
        GameModel.isUltimateItemAvailable = function(name) {
            var needed = this.ultimateItemMap.get(name).needArray;
            var bought = this.getPurchasedBuildings();
            
            for (var i = 0; i < needed.length; i++)
                if (!bought.includes(needed[i]))
                    return false;
            
            return true;
        }
        GameModel.getIndustries = function(loc) {
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
        
        GameModel.ultimateItemData = [
           { 'name' : 'Arquebus', 'location': 'sword', 'needtext' : 'Iron Roller (castings)\nChemist (potassium)\nCharcoal Kiln (forge charcoal)', 'desc' : 'Mizak\'s Notes:   The newest weapon on the market – makes a crossbow look tame! Just load it with this newfangled “gunpowder,” aim, and pull a small metal trigger.', 'needList': 'Iron Roller, Chemist, Charcoal Kiln', 'tab': 'Ultimate Weapon' }
            , { 'name' : 'Brigandine', 'location': 'armor', 'needtext' : 'Iron Roller (plate)\nLoom (padding)\nCharcoal Kiln (forge charcoal)', 'desc' : 'Mizak\'s Notes:   Looking for armor that is strong but also light? Try the brigandine, with its thick padding with strategically placed sheets of armor stitched throughout.', 'needList': 'Iron Roller, Loom, Charcoal Kiln', 'tab': 'Ultimate Armor' }
            , { 'name' : 'Pemmican', 'location': 'shop', 'needtext' : 'Smokehouse (jerky)\nWinepress (leftover fruit)\nSawmill (firewood)', 'desc' : 'Mizak\'s Notes:   The ultimate in adventuring rations! A mixture of ground jerky, dried fruit, and fat, that will literally last decades!', 'needList': 'Smokehouse, Winepress, Sawmill', 'tab': 'Ultimate Item' }
            , { 'name' : 'Poultice', 'location': 'temple', 'needtext' : 'Hops Farm (herbs from weeds)\nLoom (cloth bangages)\nSaltern (sea minerals)', 'desc' : 'Mizak\'s Notes:   Suffering from a deep sword wound? We have the answer – our temple’s special mixture of medicine bandaged over the wound. The best choice until we invent penicillin….', 'needList': 'Hops Farm, Loom, Saltern', 'tab': 'Ultimate Medicine' }
            , { 'name' : 'Black Velvet', 'location': 'tavern', 'needtext' : 'Beer Brewery (stout)\nWinery (champagne)\nBakery (pretzels…)', 'desc' : 'Mizak\'s Notes:   Fancy! A beer cocktail that uses the darkest stout and the bubbliest champagne. A great mixture of flavor that goes straight to your head.', 'needList': 'Beer Brewery, Winery, Bakery', 'tab': 'Ultimate Drink' }
            , { 'name' : 'Bordello', 'location': 'inn', 'needtext' : 'Shearing Shed (sheepskins)\nWinery (booze)\nDocks (employees…)', 'desc' : 'Mizak\'s Notes:   Why should I be ashamed? It\’s the world’s oldest profession, and we need to accommodate our brave adventurers! I\’m not sexist – we’ll hire both men and women! And don\’t worry! I\’ll only hire from out of town, and we\’ll make everyone use protection!', 'needList': 'Shearing Shed, Winery, Docks', 'tab': 'Ultimate Inn' }
        ];

        GameModel.itemData = [
            {'category' : 'sword', 'list': 'club, knife, hatchet, morningstar, shortsword, shortbow, longsword, longbow, battleaxe, broadsword, falchion, crossbow' }
            , {'category' : 'armor', 'list': 'leather armor, buckler, short hauberk, roundshield, long hauberk, kite shield, lamellar, scale armor, partial plate, pavise, full plate, cuirass' }
            , {'category' : 'shop', 'list': 'knapsack, tent, flint, dried fruit, canteen, boots, cloak, jerky, waterproof poncho, cuttlefish, waterproof jersey, portable stove' }
            , {'category' : 'temple', 'list': 'chicken soup, bandages, splints, herbs, iodine, crutches, leeches, tincture, bloodletting, mineral salt, scalpel, elixir' }
            , {'category' : 'tavern', 'list': 'bread, cheese, stew, ale, coffee, fried chicken, whiskey, fish and chips, pork chops, steak, caviar, champagne' }
            , {'category' : 'inn', 'list': 'straw, blankets, pillows, bunkbeds, stable, singles, showers, catering, groom, hot baths, room service, hot tub' }
        ];

        GameModel.bldgData = [
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
        
        GameModel.init();
        return GameModel;
    }
    
    //define globally if it doesn't already exist
    if(typeof(GameModel) === 'undefined'){
        window.GameModel = define_town_model();
    }
    else{
        console.log("GameModel already defined.");
    }
})(window);