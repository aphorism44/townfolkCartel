
(function(window){
    'use strict';
    
    function define_game_model() {
        
        var GameModel = {};
        
        GameModel.init = function() {
            this.day = 0;
            this.adventurerList = [];
            this.deadAdventurerList = [];
            this.expPool = createExpPool(this.expData);
            this.shopPool = createShopPool(this.shopData);
            this.shopButtonPool = createButtonPool(this.shopButtonData);
            this.moneyPool = new BigNumber(50);
            this.maxTownLevel = 70;
            this.itemsPerStore = 12;
            //keep records for charts and update display
            this.moneyRecord = [];
            this.adventurerRecord = [];
            this.idleMoneyMade = new BigNumber(0);
            this.gameDaysPassed = 0;
            this.originalFunds = new BigNumber(0);
            this.counter = 0;
            //blacksmith stats
            this.swordLevel = 0;
            this.hpLossRoll = 4; //adjustable - die roll to add to damage adventurers lose in a fight
            this.armorLevel = 0;
            this.hpLossPercentage = 0.4; //adjustable - what percentage of damage monsters do in a fight
            //inn stats
            this.innLevel = 0;
            this.maxAdventurers = 10; //adjustable at inn
            //temple stats
            this.templeLevel = 0;
            this.idleHourDays = 1; //adjustable at temple
            //tavern stats
            this.tavernLevel = 0;
            this.expGainRoll = 4; //adjustable - die roll to add extra experience when an adventurer kills a monster
            //item shop stats
            this.shopLevel = 0;
            this.goldGainRoll = 4; //adjustable - die roll to add extra gold when an adventurer kills a monster    
            //cost variables for shop maintenance; NOTE - the maintenance function will not charge if it's 1
            this.swordMaintainCost = 1;
            this.armorMaintainCost = 1;
            this.tavernMaintainCost = 1;
            this.innMaintainCost = 1;
            this.templeMaintainCost = 1;
            this.shopMaintainCost = 1;
            this.upgradeTownMultiplier = 1.1;
            //resource buildings (merged)
            this.buildingMap = createBldgMap(this.bldgData);
            this.itemMap = createItemMap(this.itemData);
            this.ultimateItemMap = createUltimaMap(this.ultimateItemData);  
            var format = {
                groupSeparator: ','
                , groupSize: 3
            };
            //graphic note - this shows how many days of data are shown in graphs
            this.graphDays = 90;
            BigNumber.config({ FORMAT: format, DECIMAL_PLACES: 2 });
        }
        GameModel.isBankrupt = function() {
            return this.moneyPool.lessThan(0);
        }
        GameModel.isComplete = function() { 
            var lCount = this.swordLevel + this.armorLevel + this.templeLevel + this.innLevel + this.shopLevel + this.tavernLevel; //420 max
            var iCount = 0;
            this.industryNames.forEach(function(n) {
                iCount += GameModel.getBoughtIndustries(n);
            });
            return lCount >= 420 && iCount >= this.industryNames.length * 3;
        }
        GameModel.supportsLocalStorage = function() {
            var test = 'localStorageTester';
            try {
                localStorage.setItem(test, test);
                localStorage.removeItem(test);
                return true;
            } catch(e) {
                return false;
            } 
        }
        GameModel.hasGameData = function() {
            if (localStorage.getItem("townfolkCartelSaveData") === null) 
                return false;
            else
                return true;
        }
        GameModel.saveGame = function() {
            //running init and then restoring the below items captures the entire game state
            localStorage.removeItem("townfolkCartelSaveData");
            var saveObject = {
                 day : this.day
                , adventurerList : this.adventurerList
                , deadAdventurerList : this.deadAdventurerList
                , moneyPool : this.moneyPool
                , moneyRecord : this.moneyRecord
                , adventurerRecord : this.adventurerRecord
                , swordLevel : this.swordLevel
                , hpLossRoll : this.hpLossRoll
                , armorLevel : this.armorLevel
                , hpLossPercentage : this.hpLossPercentage
                , innLevel : this.innLevel
                , maxAdventurers : this.maxAdventurers
                , templeLevel : this.templeLevel
                , idleHourDays : this.idleHourDays
                , tavernLevel : this.tavernLevel
                , expGainRoll : this.expGainRoll
                , shopLevel : this.shopLevel
                , goldGainRoll : this.goldGainRoll
                , swordMaintainCost : this.swordMaintainCost
                , armorMaintainCost : this.armorMaintainCost
                , tavernMaintainCost : this.tavernMaintainCost
                , innMaintainCost : this.innMaintainCost
                , templeMaintainCost : this.templeMaintainCost
                , shopMaintainCost : this.shopMaintainCost
                , purchasedBuildingArray : this.getPurchasedBuildings()
            };
            saveObject.dateSaved = new Date();
            localStorage.setItem("townfolkCartelSaveData", JSON.stringify(saveObject));
        }
        GameModel.loadGame = function() {
            //parse and set the saved variables
            this.init();
            var loadObject = JSON.parse(localStorage.getItem("townfolkCartelSaveData"));
            //set the simple objects
            if (loadObject) {
                this.day = loadObject.day;
                this.moneyPool = new BigNumber(loadObject.moneyPool); //needs to be transformed
                this.moneyRecord = loadObject.moneyRecord;
                this.adventurerRecord = loadObject.adventurerRecord;
                this.swordLevel = loadObject.swordLevel;
                this.hpLossRoll = loadObject.hpLossRoll;
                this.armorLevel = loadObject.armorLevel;
                this.hpLossPercentage = loadObject.hpLossPercentage;
                this.innLevel = loadObject.innLevel;
                this.maxAdventurers = loadObject.maxAdventurers;
                this.templeLevel = loadObject.templeLevel;
                this.idleHourDays = loadObject.idleHourDays;
                this.tavernLevel = loadObject.tavernLevel;
                this.expGainRoll = loadObject.expGainRoll;
                this.shopLevel = loadObject.shopLevel;
                this.goldGainRoll = loadObject.goldGainRoll;
                this.swordMaintainCost = loadObject.swordMaintainCost;
                this.armorMaintainCost = loadObject.armorMaintainCost;
                this.tavernMaintainCost = loadObject.tavernMaintainCost;
                this.innMaintainCost = loadObject.innMaintainCost;
                this.templeMaintainCost = loadObject.templeMaintainCost;
                this.shopMaintainCost = loadObject.shopMaintainCost;
                
                //the json strings of adventurer objects need to be recreated as objects
                this.addLoadedAdventurers(loadObject.adventurerList, this.adventurerList);
                this.addLoadedAdventurers(loadObject.deadAdventurerList, this.deadAdventurerList);
                //buildings just need to be marked as purchased
                loadObject.purchasedBuildingArray.forEach(function(bData) {
                    GameModel.buildingMap.get(bData).purchased = true;
                });
                //finally get the saved date and add that extra money
                this.prepareIdleStats(loadObject.dateSaved);
                return true;
            } else {
                //if this runs there's a bug
                console.log("no saved game!");
                return false;
            }
            
        }
        GameModel.prepareIdleStats = function(saveDate) {
            this.counter = 0;
            this.gameDaysPassed = 0;
            this.originalFunds = new BigNumber(0);
            this.idleMoneyMade = new BigNumber(0);
            var saveDate = new Date(saveDate);
            var today = new Date();
            //limit hoursPassed to 7 days
            var hoursPassed = Math.floor(Math.abs(today - saveDate) / 3600000);
            if (hoursPassed > 168)
                hoursPassed = 168;
            //hoursPassed = 168; //testing only
            this.gameDaysPassed  = hoursPassed  * this.idleHourDays;
            this.originalFunds = this.moneyPool;
        }
        GameModel.simulateIdleTime = function() {
            for (this.counter = 0; this.counter < this.gameDaysPassed; this.counter++) {
                this.goAdventuring();
                this.visitTown();
            }
            this.idleMoneyMade = this.moneyPool.minus(this.originalFunds);
        }
        GameModel.isIdleCalculated = function() {
            return this.counter >= this.gameDaysPassed;
        }
        GameModel.addLoadedAdventurers = function(advArray, targetArray) {
            advArray.forEach(function(adv) {
                var advObject = new Adventurer(1, [1,1,1]);
                advObject.loadAdventurerData(adv.level, adv.hp, adv.fightStat, adv.hpMax, adv.gold, adv.totalGoldEarned, adv.totalGoldSpent, adv.exp, adv.expToNext);
                targetArray.push(advObject);
            });
        }
        //below functions used to format numbers expected to get really large
        GameModel.getMoneyPool = function() {
            return this.formatBigNumToText(this.moneyPool);
        }
        GameModel.formatBigNumToText = function(bigNum) {
            var million = new BigNumber(1000000);
            var billion = new BigNumber(1000000000);
            var trillion = new BigNumber(1000000000000);
            var quadrillion = new BigNumber(1000000000000000);
            
           if (bigNum.greaterThanOrEqualTo(quadrillion)) {
                return bigNum.dividedBy(quadrillion) + " quadrillion";
            } else if (bigNum.greaterThanOrEqualTo(trillion)) {
                return bigNum.dividedBy(trillion) + " trillion";
            } else if (bigNum.greaterThanOrEqualTo(billion)) {
                return bigNum.dividedBy(billion) + " billion";
            } else if (bigNum.greaterThanOrEqualTo(million)) {
                return bigNum.dividedBy(million) + " million";
            } else {
                return bigNum.toFormat();
            }  
        }
        GameModel.formatNumToText = function(num) {
            var bigNum = new BigNumber(num);
            return this.formatBigNumToText(bigNum);
        }
        GameModel.hasAmount = function(amount) {
            return this.moneyPool.greaterThanOrEqualTo(new BigNumber(amount));
        }
        GameModel.addAdventurers = function(num) {
            this.moneyPool = this.moneyPool.minus(new BigNumber(this.adventurerCost(num)));
            for (var i = 0; i < num; i++)
                this.adventurerList.push(new Adventurer(1, this.expPool.get(1)));
        }
        GameModel.upgradeTown = function(tag, cost) {
            this.moneyPool = this.moneyPool.minus(new BigNumber(cost));
            var functionName = 'upgrade' + tag[0].toUpperCase() + tag.slice(1);
            GameModel[functionName]();
        }
                
        GameModel.upgradeInn = function() {
            this.innLevel++;
            this.innMaintainCost *= this.upgradeTownMultiplier;
            this.maxAdventurers += 50;
        }
        GameModel.upgradeTemple = function() {
            this.templeLevel++;
            this.templeMaintainCost *= this.upgradeTownMultiplier;
            this.idleHourDays++;
        }
        GameModel.upgradeTavern = function() {
            this.tavernLevel++;
            this.tavernMaintainCost *= this.upgradeTownMultiplier;
            this.expGainRoll++;
        }
        GameModel.upgradeShop = function() {
            this.shopLevel++;
            this.shopMaintainCost *= this.upgradeTownMultiplier;
            this.goldGainRoll++;
        }
        GameModel.upgradeSword = function() {
            this.swordLevel++;
            this.swordMaintainCost *= this.upgradeTownMultiplier;
            this.hpLossRoll++;
        }
        GameModel.upgradeArmor = function() {
            this.armorLevel++;
            this.armorMaintainCost *= this.upgradeTownMultiplier;
            this.hpLossPercentage *= 0.99;
        }
        GameModel.getShopStat = function(varName) {
            //this is needed since some of the variables are decimal
            if (varName === 'hpLossPercentage')
                return this[varName].toFixed(3);
            else
                return this[varName];
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
            return Math.floor(50 + 50 * Math.pow(numOfAdv, 1.75));
        }
        GameModel.innCost = function() {
            return Math.floor(1000 * Math.pow(this.innLevel + 1, 2));
        }
        GameModel.templeCost = function() {
            return Math.floor(2000 * Math.pow(this.templeLevel + 1, 3));
        }
        GameModel.tavernCost = function() {
            return Math.floor(2000 * Math.pow(this.tavernLevel + 1, 3));
        }
        GameModel.shopCost = function() {
            return Math.floor(3000 * Math.pow(this.shopLevel + 1, 3));
        }
        GameModel.swordCost = function() {
            return Math.floor(2500 * Math.pow(this.swordLevel + 1, 3));
        }
        GameModel.armorCost = function() {
            return Math.floor(2500 * Math.pow(this.armorLevel + 1, 3));
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
                var lev = this.adventurerList[i].level + this.hpLossRoll;
                this.adventurerList[i].takeDamage(Math.round(this.adventurerList[i].hpMax * this.hpLossPercentage) + dieRoll(this.adventurerList[i].level) - this.adventurerList[i].armorModifier);
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
            var adventurerIncome = 0;
            for (var i = len - 1; i > -1; i--) {
                //pay for as much healing as possible                
                adventurerIncome += this.adventurerList[i].heal();
                //next visit the shop, tavern, and inn; adventurer pays percentage of their money depending on the shop levels; was thinking of penalizing them if they don't have enough money but that might unbalance the game
                adventurerIncome += this.adventurerList[i].visitTownBuilding(this.shopLevel);
                adventurerIncome += this.adventurerList[i].visitTownBuilding(this.tavernLevel);
                adventurerIncome += this.adventurerList[i].visitTownBuilding(this.templeLevel);
                adventurerIncome += this.adventurerList[i].visitTownBuilding(this.swordLevel);
                adventurerIncome += this.adventurerList[i].visitTownBuilding(this.armorLevel);
                adventurerIncome += this.adventurerList[i].visitTownBuilding(this.innLevel);
            }
            this.dailyIncomeUpdate(adventurerIncome);
        }
        GameModel.dailyIncomeUpdate = function(advIn) {
            var totalIncome = advIn;
            //totalIncome -= this.getMaintenanceCost();
            if (totalIncome > 0)
                totalIncome += Math.round(Math.pow(advIn, this.getResourceExponent()));
            this.moneyPool = this.moneyPool.plus(new BigNumber(totalIncome));
            this.recordData(totalIncome);
            this.day++;
        }
        //below is for keeping track of some numbers for graphic purposes; currently limited to 90 days; see main variables
        GameModel.recordData = function(income) {
            if (this.moneyRecord.length > this.graphDays)
                this.moneyRecord.shift();
            if (this.adventurerRecord.length > this.graphDays)
                this.adventurerRecord.shift();
            this.moneyRecord.push(income);
            this.adventurerRecord.push(this.adventurerList.length);
        }
        GameModel.getMaintenanceCost = function() {
            //when you level up town buildings, the maintenance cost is a slow-growing linear function; level 1 should cost nothing            
            var cost = 0;
            cost += this.swordMaintainCost > 1 ? this.swordMaintainCost : 0;
            cost += this.armorMaintainCost > 1 ? this.armorMaintainCost : 0;
            cost += this.tavernMaintainCost > 1 ? this.tavernMaintainCost : 0; 
            cost += this.innMaintainCost > 1 ? this.innMaintainCost : 0;
            cost += this.templeMaintainCost > 1 ? this.templeMaintainCost : 0; 
            cost += this.shopMaintainCost > 1 ? this.shopMaintainCost : 0;
            return Math.round(cost);
        }
        GameModel.getResourceExponent= function() {
            //when you buy resource buildings, they provide an exponential increase
            //of your base income; since maintenance growth in linear, this will more than cancel it out
            var baseExponent = 1;
            //each building adds (.001 * building level) to the exponent, for a max of 1.03
            for (var [key, value] of this.buildingMap)
                if (value.purchased)
                    baseExponent += value.level * .001;
            
            return baseExponent;
        }
        //below are reporting methods
        GameModel.getOverview = function() {
            var maintainance = this.getMaintenanceCost();
            var strBuild = "Active Adventurers: " + this.adventurerList.length + "\n";
            strBuild += "Level 1-10: " + this.adventurerList.filter(function(a) { return a.level <= 10; }).length + "\t\t\t";
            strBuild += "/   Level 11-20: " + this.adventurerList.filter(function(a) { return a.level > 10 && a.level <= 20; }).length + "\t\t\t";
            strBuild += "/   Level 21-30: " + this.adventurerList.filter(function(a) { return a.level > 20 && a.level <= 30; }).length + "\n";
            strBuild += "Level 31-50: " + this.adventurerList.filter(function(a) { return a.level > 30 && a.level <= 50; }).length + "\t\t\t";
            strBuild += "/   Level 50+: " + this.adventurerList.filter(function(a) { return a.level > 50; }).length + "\t\t\t";
            strBuild += "/   Dead adventurers: " + this.deadAdventurerList.length + "\n\n";
            strBuild += "Day: " + this.day +  "\n";
            strBuild += "Current Gold: " + this.moneyPool.toFormat() + "\n\n";
            return strBuild;
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
                pool.set(u.tag, { 'shop': u.shopName, 'goodsText': u.goodsText, 'labelText': u.labelText, 'variable': u.variable, 'headGraphic': u.headGraphic });
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
             this.weaponModifier = 0; //currently unused
             this.armorModifier = 0; //currently unused
         }
        Adventurer.prototype = Object.create(Being.prototype);
        Adventurer.prototype.constructor = Adventurer;
        //the below is needed when you load a game
        Adventurer.prototype.loadAdventurerData = function(level, hp, fightStat, hpMax, gold, totalGoldEarned, totalGoldSpent, exp, expToNext) {
            this.level = level;
            this.hp = hp;
            this.fightStat = fightStat;
            this.hpMax = hpMax;
            this.gold = gold;
            this.totalGoldEarned = totalGoldEarned;
            this.totalGoldSpent = totalGoldSpent;
            this.exp = exp;
            this.expToNext = expToNext;
        }
        Adventurer.prototype.lootMonster = function(deadMonsterLevel, extraExpRoll, extraGoldRoll) {
            var goldDrop = 10 * Math.round(Math.pow(deadMonsterLevel, 2));
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
        Adventurer.prototype.visitTownBuilding = function(level) {
            var goldSpent = Math.round(this.gold * (level / 500));
            this.gold -= goldSpent;
            return goldSpent;
        }
        
        function dieRoll(size) {
            return Math.floor(Math.random() * size) + 1;
        }
        
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
            , { 'name': 'temple', 'graphic': 'jera', 'text': 'Level up your temple to increase the game speed when you\'re not playing. You can collect up to one week of idle play at a time.' }
            , { 'name': 'itemshop', 'graphic': 'mizakFull', 'text': 'Level up your item shop to give adventurers more money when they fight.' }
            , { 'name': 'blacksmith', 'graphic': 'lemelFull', 'text': 'Weapon levels increase the damage adventurers inflict on monsters. Armor levels decrease adventurers\' damage from monsters.' }
        ];
        GameModel.shopButtonData = [
            { 'shopName': 'inn', 'goodsText': 'Amenities', 'tag': 'inn', 'labelText': 'Maximum Adventurers', variable: 'maxAdventurers', 'headGraphic': 'clavoFrown' }
            , { 'shopName': 'tavern', 'goodsText': 'Food and Drink', 'tag': 'tavern', 'labelText': 'Extra Experience Roll', variable: 'expGainRoll', 'headGraphic': 'lissetteFrown' }
            , { 'shopName': 'blacksmith', 'goodsText': 'Armor', 'tag': 'armor', 'labelText': 'HP Loss %', variable: 'hpLossPercentage', 'headGraphic': 'lemelFrown' }
            , { 'shopName': 'itemshop', 'goodsText': 'Items', 'tag': 'shop', 'labelText': 'Extra Money Roll', variable: 'goldGainRoll', 'headGraphic': 'mizakNormal' }
            , { 'shopName': 'temple', 'goodsText': 'Medicine', 'tag': 'temple', 'labelText': 'Days Per Idle Hour', variable: 'idleHourDays', 'headGraphic': 'jera' }
            , { 'shopName': 'blacksmith', 'goodsText': 'Weapons', 'tag': 'sword', 'labelText': 'HP Loss Roll', variable: 'hpLossRoll', 'headGraphic': 'lemelFrown' }
        ];
        
        //resource building functions(merged)
        GameModel.getItemList = function(category, level) {
            var itemArray = [];
            //instead of one item per level (too easy to max out), update at intervals
            if (level > this.maxTownLevel) level = this.maxTownLevel;
            level = Math.ceil(level / (this.maxTownLevel / this.itemsPerStore));
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
            this.moneyPool = this.moneyPool.minus(new BigNumber(this.buildingMap.get(name).cost));
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
                if (loc === null || value.location === loc)
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
        GameModel.getBoughtIndustries = function(indName) {
            var iName = indName.toLowerCase(), count = 0;
            for (var [key, value] of this.buildingMap)
                if (value.industry === iName && value.purchased)
                    count++;
            return count;
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
                pool.set(u.location,  {'name': u.name, 'needArray': u.needList.split(",").map(function(e) { return e.trim(); }), 'location': u.location, 'needText': u.needtext, 'desc': u.desc, 'tab': u.tab });
            });
            return pool;
        }
        
        GameModel.ultimateItemData = [
           { 'name' : 'Arquebus', 'location': 'sword', 'needtext' : 'Iron Roller (castings)\nChemist (potassium)\nCharcoal Kiln (forge charcoal)', 'desc' : 'Mizak\'s Notes:   The newest weapon on the market – makes a crossbow look tame! Just load it with this newfangled “gunpowder,” aim, and pull a small metal trigger.', 'needList': 'Iron Roller, Chemist, Charcoal Kiln', 'tab': 'Ultimate Weapon' }
            , { 'name' : 'Brigandine', 'location': 'armor', 'needtext' : 'Iron Roller (plate)\nLoom (padding)\nCharcoal Kiln (forge charcoal)', 'desc' : 'Mizak\'s Notes:   Looking for armor that is strong but also light? Try the brigandine, with its thick padding with strategically placed sheets of armor stitched throughout.', 'needList': 'Iron Roller, Loom, Charcoal Kiln', 'tab': 'Ultimate Armor' }
            , { 'name' : 'Pemmican', 'location': 'shop', 'needtext' : 'Smokehouse (jerky)\nWinepress (leftover fruit)\nSawmill (firewood)', 'desc' : 'Mizak\'s Notes:   The ultimate in adventuring rations! A mixture of ground jerky, dried fruit, and fat that will literally last decades!', 'needList': 'Smokehouse, Winepress, Sawmill', 'tab': 'Ultimate Item' }
            , { 'name' : 'Poultice', 'location': 'temple', 'needtext' : 'Hops Farm (herbs)\nLoom (cloth bangages)\nSaltern (sea minerals)', 'desc' : 'Mizak\'s Notes:   Suffering from a deep sword wound? We have the answer – our temple’s special mixture of medicine bandaged over the wound. The best choice until we invent penicillin….', 'needList': 'Hops Farm, Loom, Saltern', 'tab': 'Ultimate Medicine' }
            , { 'name' : 'Black Velvet', 'location': 'tavern', 'needtext' : 'Beer Brewery (stout)\nWinery (champagne)\nBakery (pretzels)', 'desc' : 'Mizak\'s Notes:   Fancy! A beer cocktail that uses the darkest stout and the bubbliest champagne. A great mixture of flavor that goes straight to your head.', 'needList': 'Beer Brewery, Winery, Bakery', 'tab': 'Ultimate Drink' }
            , { 'name' : 'Bordello', 'location': 'inn', 'needtext' : 'Shearing Shed (sheepskins)\nWinery (booze)\nDocks (employees)', 'desc' : 'Mizak\'s Notes:   You can\'t have a decent inn without a whorehouse! It\’s the world’s oldest profession, and we need to accommodate our brave adventurers! Well-stocked with beautiful girls and pretty boys, we offer companionship for a reasonable fee.', 'needList': 'Shearing Shed, Winery, Docks', 'tab': 'Ultimate Inn' }
        ];

        GameModel.itemData = [
            {'category' : 'sword', 'list': 'club, knife, hatchet, morningstar, shortsword, shortbow, longsword, longbow, battleaxe, broadsword, falchion, crossbow' }
            , {'category' : 'armor', 'list': 'leather armor, buckler, short hauberk, roundshield, long hauberk, kite shield, lamellar, scale armor, partial plate, pavise, full plate, cuirass' }
            , {'category' : 'shop', 'list': 'knapsack, tent, flint, dried fruit, canteen, boots, cloak, jerky, waterproof poncho, cuttlefish, waterproof jersey, portable stove' }
            , {'category' : 'temple', 'list': 'chicken soup, bandages, splints, herbs, iodine, crutches, leeches, tincture, bloodletting, mineral salt, scalpel, elixir' }
            , {'category' : 'tavern', 'list': 'bread, cheese, stew, ale, coffee, fried chicken, whiskey, fish and chips, pork chops, steak, caviar, champagne' }
            , {'category' : 'inn', 'list': 'straw, blankets, pillows, bunkbeds, stable, singles, showers, catering, groom, hot baths, room service, hot tub' }
        ];
        
        GameModel.industryNames = ['Alum','Beef','Fish','Grain', 'Hops','Ore','Salt','Wine', 'Wood', 'Wool'];
        
        GameModel.bldgData = [
            { 'level' : 1, 'name': 'Lumberjack Camp', 'needs': '', 'cost': 1000000, 'graphic' : 'bldgCamp' , 'location': 'forest', 'industry': 'wood', 'desc': 'Allows logging.' }
            , { 'level' : 2, 'name': 'Sawmill', 'needs': 'Lumberjack Camp', 'cost': 1000000000, 'graphic' : 'bldgSawmill' , 'location': 'forest', 'industry': 'wood', 'desc': 'Produces timber from logs.' }
            , { 'level' : 3, 'name': 'Charcoal Kiln', 'needs': 'Sawmill', 'cost': 1000000000000, 'graphic' : 'bldgKiln' , 'location': 'forest', 'industry': 'wood', 'desc': 'Produces charcoal from timber.' }
            
            , { 'level' : 1, 'name': 'Ore Mine', 'needs': '', 'cost': 1000000, 'graphic' : 'bldgOreMine' , 'location': 'mountains', 'industry': 'ore', 'desc': 'Extracts rock with metals.' }
            , { 'level' : 1, 'name': 'Alum Mine', 'needs': '', 'cost': 1000000, 'graphic' : 'bldgAlumMine' , 'location': 'mountains', 'industry': 'alum', 'desc': 'Extracts rock with certain minerals.' }
            , { 'level' : 2, 'name': 'Smelter', 'needs': 'Ore Mine', 'cost': 1000000000, 'graphic' : 'bldgSmelter' , 'location': 'mountains', 'industry': 'ore', 'desc': 'Seperates metal from ore.' }
            , { 'level' : 2, 'name': 'Seperator', 'needs': 'Alum Mine', 'cost': 1000000000, 'graphic' : 'bldgSeperator' , 'location': 'mountains', 'industry': 'alum', 'desc': 'Seperates chemicals from rock.' }
            , { 'level' : 3, 'name': 'Iron Roller', 'needs': 'Smelter, Charcoal Kiln', 'cost': 1000000000000, 'graphic' : 'bldgRoller' , 'location': 'mountains', 'industry': 'ore', 'desc': 'Produces metal ingots.' }
            , { 'level' : 3, 'name': 'Chemist', 'needs': 'Seperator', 'cost': 1000000000000, 'graphic' : 'bldgChemist' , 'location': 'mountains', 'industry': 'alum', 'desc': 'Refines alum and other chemicals.' }
            
            , { 'level' : 1, 'name': 'Sheep Pasture', 'needs': '', 'cost': 1000000, 'graphic' : 'bldgSheep' , 'location': 'pasture', 'industry': 'wool', 'desc': 'Raises sheep.' }
            , { 'level' : 1, 'name': 'Cattle Ranch', 'needs': '', 'cost': 1000000, 'graphic' : 'bldgCattle' , 'location': 'pasture', 'industry': 'beef', 'desc': 'Raises cattle and other food animals.' }
            , { 'level' : 2, 'name': 'Shearing Shed', 'needs': 'Sheep Pasture', 'cost': 1000000000, 'graphic' : 'bldgShearer' , 'location': 'pasture', 'industry': 'wool', 'desc': 'Produces wool.' }
            , { 'level' : 2, 'name': 'Slaughterhouse', 'needs': 'Cattle Ranch', 'cost': 1000000000, 'graphic' : 'bldgSlaughterhouse' , 'location': 'pasture', 'industry': 'beef', 'desc': 'Produces raw meat.' }
            , { 'level' : 3, 'name': 'Loom', 'needs': 'Shearing Shed, Sawmill, Iron Roller', 'cost': 1000000000000, 'graphic' : 'bldgLoom' , 'location': 'pasture', 'industry': 'wool', 'desc': 'Produces yarn from wool.' }
            , { 'level' : 3, 'name': 'Smokehouse', 'needs': 'Slaughterhouse, Sawmill', 'cost': 1000000000000, 'graphic' : 'bldgSmokehouse' , 'location': 'pasture', 'industry': 'beef', 'desc': 'Produces preserved jerky.' }
            
            , { 'level' : 1, 'name': 'Grain Farm', 'needs': '', 'cost': 1000000, 'graphic' : 'bldgWheatFarm' , 'location': 'prairie', 'industry': 'grain', 'desc': 'Grows cereals like wheat and corn.' }
            , { 'level' : 1, 'name': 'Hops Farm', 'needs': '', 'cost': 1000000, 'graphic' : 'bldgHopsFarm' , 'location': 'prairie', 'industry': 'hops', 'desc': 'Exclusively grows hops for beer.' }
            , { 'level' : 1, 'name': 'Vineyard', 'needs': '', 'cost': 1000000, 'graphic' : 'bldgVineyard' , 'location': 'prairie', 'industry': 'wine', 'desc': 'Grows grapes and fruit for wine.' }
            , { 'level' : 2, 'name': 'Mill', 'needs': 'Grain Farm', 'cost': 1000000000, 'graphic' : 'bldgMill' , 'location': 'prairie', 'industry': 'grain', 'desc': 'Grinds grains into flour.' }
            , { 'level' : 2, 'name': 'Beer Brewery', 'needs': 'Grain Farm, Hops Farm', 'cost': 1000000000, 'graphic' : 'bldgBeerBrewery' , 'location': 'prairie', 'industry': 'hops', 'desc': 'Produces alcoholic beer.' }
            , { 'level' : 2, 'name': 'Winepress', 'needs': 'Vineyard', 'cost': 1000000000, 'graphic' : 'bldgWinepress' , 'location': 'prairie', 'industry': 'wine', 'desc': 'Presses juice out of fruits.' }
            , { 'level' : 3, 'name': 'Bakery', 'needs': 'Mill, Sawmill', 'cost': 1000000000000, 'graphic' : 'bldgBakery' , 'location': 'prairie', 'industry': 'grain', 'desc': 'Produces baked goods from flour.' }
            , { 'level' : 3, 'name': 'Beer Bottler', 'needs': 'Beer Brewery', 'cost': 1000000000000, 'graphic' : 'bldgBeerBottler' , 'location': 'prairie', 'industry': 'hops', 'desc': 'Prepares beer for trade.' }
            , { 'level' : 3, 'name': 'Winery', 'needs': 'Winepress, Charcoal Kiln', 'cost': 1000000000000, 'graphic' : 'bldgWinery' , 'location': 'prairie', 'industry': 'wine', 'desc': 'Ages and bottles wine.' }
            
            , { 'level' : 1, 'name': 'Docks', 'needs': '', 'cost': 1000000, 'graphic' : 'bldgDock' , 'location': 'sea', 'industry': 'fish', 'desc': 'Allows catching of fish.' }
            , { 'level' : 1, 'name': 'Saltbeds', 'needs': '', 'cost': 1000000, 'graphic' : 'bldgSaltbeds' , 'location': 'sea', 'industry': 'salt', 'desc': 'Captures seawater.' }
            , { 'level' : 2, 'name': 'Fishery', 'needs': 'Docks', 'cost': 1000000000, 'graphic' : 'bldgFishery' , 'location': 'sea', 'industry': 'fish', 'desc': 'Guts and cleans fresh fish.' }
            , { 'level' : 2, 'name': 'Saltpans', 'needs': 'Saltbeds', 'cost': 1000000000, 'graphic' : 'bldgSaltpans' , 'location': 'sea', 'industry': 'salt', 'desc': 'Evaporates seawater.' }
            , { 'level' : 3, 'name': 'Brinery', 'needs': 'Fishery, Sawmill, Saltpans', 'cost': 1000000000000, 'graphic' : 'bldgBrinery' , 'location': 'sea', 'industry': 'fish', 'desc': 'Produces preserved salt fish.' }
            , { 'level' : 3, 'name': 'Saltern', 'needs': 'Saltpans, Sawmill', 'cost': 1000000000000, 'graphic' : 'bldgIodiner' , 'location': 'sea', 'industry': 'salt', 'desc': 'Refines salt from seawater residue.' }
        ];
        
        GameModel.openDialogue = [
             { 'speaker': 'Mizak', 'graphic': 'mizakNormal', 'text': 'Man, I\'m tired. How are you guys holding up?' }
            , { 'speaker': 'Lissette', 'graphic': 'lissetteFrown', 'text': 'I couldn\'t have gotten more than four hours of sleep this week, with all those adventurers visiting the tavern.' }
            , { 'speaker': 'Clavo', 'graphic': 'clavoFrown', 'text': 'My aunt\'s inn is crammed to the rafters, and they still keep coming into town.' }
            , { 'speaker': 'Lemel', 'graphic': 'lemelFrown', 'text': 'I can barely lift my arms, I\'ve forged so many swords.' }
            , { 'speaker': 'Mizak', 'graphic': 'mizakNormal', 'text': 'Hasn\'t anyone raised their prices since adventurers started hitting the dungeon? They\'re bringing in lots of treasure; they can afford it.' }
            , { 'speaker': 'Lissette', 'graphic': 'lissetteFrown', 'text': 'Actually, that makes sense. Maybe if we raised our prices, we wouldn\'t be be so busy.' }
            , { 'speaker': 'Lemel', 'graphic': 'lemelFrown', 'text': 'But then we\'ll lose business!' }
            , { 'speaker': 'Mizak', 'graphic': 'mizakNormal', 'text': 'Think, big guy! If we charge more, we won\'t need as many customers. And since we\'re the only village in the area, they don\'t have a choice! I have a great plan! I just need to borrow-' }
            , { 'speaker': 'Lemel', 'graphic': 'lemelOut', 'text': 'Here it comes....' }
            , { 'speaker': 'Mizak', 'graphic': 'mizakNormal', 'text': '-50 thalers. Lissette, you can spare that much, can\'t you?' }
            , { 'speaker': 'Lissette', 'graphic': 'lissetteAngry', 'text': 'The last time I lent you money, you took eight months to pay it back!' }
            , { 'speaker': 'Mizak', 'graphic': 'mizakNormal', 'text': 'Okay, I made a mistake back then. But I have a foolproof plan now.' }
            , { 'speaker': 'Clavo', 'graphic': 'clavoFrown', 'text': 'The last time you had a plan, you trapped us in the dungeon and nearly got us all killed.' }
            , { 'speaker': 'Mizak', 'graphic': 'mizakLaugh', 'text': 'Look. It\'s only a few gold coins. I just need to recruit some more adventurers, work with you guys to improve the shops a bit, and then start buying up the local industries. I\'m telling you, we could be rich!' }
            , { 'speaker': 'Lissette', 'graphic': 'lissetteAngry', 'text': 'Here\'s the money. If I don\'t get it back, I\'m going to beat your ass!' }
            , { 'speaker': 'Mizak', 'graphic': 'mizakNormal', 'text': 'No worries. Just follow my lead...\n\n(Press next to start game)' }
        ];
        
        GameModel.winDialogue = [
            { 'speaker': 'Mizak', 'graphic': 'mizakLaugh', 'text': 'I did it! We have a monopoly on everything! We\'re rich!' }
            , { 'speaker': 'Lissette', 'graphic': 'lissetteAngry', 'text': 'Then where\'s all the gold?!? I need that fifty I loaned you back!' }
            , { 'speaker': 'Mizak', 'graphic': 'mizakNormal', 'text': 'Umm...well you see, the money\'s tied up in the property. We\'ll start getting gold coins back again...maybe in a few months....' }
            , { 'speaker': 'Lissette', 'graphic': 'lissetteAngry', 'text': 'That\'s it!!!' }
        ];
        
        GameModel.loadDialogue = [
            { 'speaker': 'Mizak', 'graphic': 'mizakNormal', 'text': 'While you were idle, your adventurers brought in this much money:' }
        ];
        
        GameModel.loseDialogue = [
            { 'speaker': 'N/A', 'graphic': '', 'text': 'Bankrupt! Game Over.' }
        ];
        
        return GameModel;
    }
    
    //define globally if it doesn't already exist
    if(typeof(GameModel) === 'undefined'){
        window.GameModel = define_game_model();
    }
    else{
        console.log("GameModel already defined.");
    }
})(window);