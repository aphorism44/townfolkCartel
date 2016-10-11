
(function(window){
    'use strict';
    
    function define_resource_model() {
        
        var ResourceModel = {};
        
        ResourceModel.init = function() {
            this.adventurerList = [];
            this.deadAdventurerList = [];
            this.brokeAdventurerList = [];
            this.expPool = createExpPool(this.expData);
            this.maintenance = 0;
            //this.monsterPool = createMonsterPool(this.monsterData);
            this.moneyPool = new BigNumber(50);
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
            this.costPerHP = 1; //adjustable - cost to heal each lost HP
            //tavern stats
            this.tavernLevel = 0;
            this.expGainRoll = 4; //adjustable - die roll to add extra experience when an adventurer kills a monster
            //item shop stats
            this.shopLevel = 0;
            this.goldGainRoll = 4; //adjustable - die roll to add extra gold when an adventurer kills a monster        
        }
        ResourceModel.addAdventurers = function(num, cost) {
            this.moneyPool -= cost;
            for (var i = 0; i < num; i++)
                this.adventurerList.push(new Adventurer(1, this.expPool.get(1)));
        }
        
        ResourceModel.hasAmount = function(amount) {
            return amount <= this.moneyPool;
        }
        ResourceModel.upgradeInn = function(cost) {
            this.moneyPool -= cost;
            this.innLevel++;
            this.maintenance += Math.pow(this.innLevel, 2);
            this.maxAdventurers += 10;
        }
        ResourceModel.upgradeTemple = function(cost) {
            this.moneyPool -= cost;
            this.templeLevel++;
            this.maintenance += Math.pow(this.templeLevel, 2);
            this.costPerHP++;
        }
        ResourceModel.upgradeTavern = function(cost) {
            this.moneyPool -= cost;
            this.tavernLevel++;
            this.maintenance += Math.pow(this.tavernLevel, 2);
            this.expGainRoll++;
        }
        ResourceModel.upgradeShop = function(cost) {
            this.moneyPool -= cost;
            this.shopLevel++;
            this.maintenance += Math.pow(this.shopLevel, 2);
            this.goldGainRoll++;
        }
        ResourceModel.upgradeBlackSmith = function(key, cost) {
            this.moneyPool -= cost;
            if (key === "sword") {
                this.swordLevel++;
                this.maintenance += Math.pow(this.swordLevel, 2);
                this.hpLossRoll++;
            } else if (key === "armor") {
                this.armorLevel++;
                this.maintenance += Math.pow(this.armorLevel, 2);
                this.hpLossPercentage *= 0.9;
            }
        }
        
        //need these
        ResourceModel.getBlacksmithLevel = function(key) {
            if (key === "sword")
                return this.swordLevel;
            else if (key === "armor")
                return this.armorLevel;
        }
        
        //Price=BaseCost×Multiplier^(#Owned)
        ResourceModel.adventurerCost = function() {
            return Math.floor(50 * Math.pow(1.07, this.adventurerList.length));
        }
        ResourceModel.innCost = function() {
            return Math.floor(1000 * Math.pow(1.27, this.innLevel));
        }
        ResourceModel.templeCost = function() {
            return Math.floor(2000 * Math.pow(1.37, this.templeLevel));
        }
        ResourceModel.tavernCost = function() {
            return Math.floor(2000 * Math.pow(1.3, this.tavernLevel));
        }
        ResourceModel.shopCost = function() {
            return Math.floor(3000 * Math.pow(1.5, this.shopLevel));
        }
        
        
        ResourceModel.getBlacksmithCost = function(key) {
            if (key === "sword") {
                return Math.floor(2500 * Math.pow(1.07, this.swordLevel));
            } else if (key === "armor") {
                return Math.floor(2500 * Math.pow(1.07, this.armorLevel));
            }
        }
        
        //below 2 methods are main game loop
        ResourceModel.goAdventuring = function() {
            var len = this.adventurerList.length;
            for (var i = len - 1; i > -1; i--) {
                var lev = this.adventurerList[i].level + this.adventurerList[i].weaponModifier;
                /*var monName = "";
                if (lev > 20)
                    monName = "Boss Level " + lev;
                else
                    monName = this.monsterPool.get(lev);
                var m = new Monster(lev, [0, Math.floor(this.adventurerList[i].hp / 2), Math.floor(this.adventurerList[i].fightStat / 2)], monName);*/
                //SIMPLIFY - simulate battle by removing some percentage of adventurer's HP and giving a return based on level
                this.adventurerList[i].takeDamage(Math.round(this.adventurerList[i].hpMax * this.hpLossPercentage) + dieRoll(this.hpLossRoll) - this.adventurerList[i].armorModifier);
                if (this.adventurerList[i].alive) {
                    this.adventurerList[i].lootMonster(lev, this.expGainRoll, this.goldGainRoll);
                    this.adventurerList[i].checkLevel(this.expPool);
                } else {
                    this.deadAdventurerList.push(this.adventurerList.splice(i, 1));
                }
            }
        }
        ResourceModel.visitTown = function() {
            var len = this.adventurerList.length;
            for (var i = len - 1; i > -1; i--) {
                //pay for as much healing as possible
                this.moneyPool += this.adventurerList[i].heal(this.costPerHP);
                //other items go in here as needed...
                //if (this.adventurerList[i].broke)
                    //this.brokeAdventurerList.push(this.adventurerList.splice(i, 1));
            }
            this.moneyPool -= this.maintenance;
        }
        //below are reporting methods
        ResourceModel.getOverview = function() {
            var strBuild = "Active Adventurers: " + this.adventurerList.length + "\n";
            strBuild += "Level 1-5: " + this.adventurerList.filter(function(a) { return a.level <= 5; }).length + "\t\t\t";
            strBuild += "/   Level 6-10: " + this.adventurerList.filter(function(a) { return a.level > 5 && a.level <= 10; }).length + "\n";
            strBuild += "Level 11-15: " + this.adventurerList.filter(function(a) { return a.level > 10 && a.level <= 15; }).length + "\t\t\t";
            strBuild += "/   Level 16-20: " + this.adventurerList.filter(function(a) { return a.level > 15 && a.level <= 20; }).length + "\n";
            strBuild += "Level 21+: " + this.adventurerList.filter(function(a) { return a.level > 20; }).length + "\t\t\t";
            strBuild += "/   Dead adventurers: " + this.deadAdventurerList.length + "\n\n";
            //strBuild += "Bankrupt adventurers: " + this.brokeAdventurerList.length + "\n";
            strBuild += "Town funds: " + this.moneyPool + "\n\n";
            return strBuild;
        }
        ResourceModel.getHealth = function() {
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
        
        /*function createMonsterPool(monsterData) {
            var pool = new Map();
            monsterData.forEach(function(m) {
                pool.set(m.level, m.name);
            });
            return pool;
        }*/
        
         function createExpPool(expData) {
            var pool = new Map();
            expData.forEach(function(e) {
                pool.set(e.level, e.stats);
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
        Adventurer.prototype.heal = function(costPerHp) {
            //heal as much HP as possible
            var needHeal = costPerHp * (this.hpMax - this.hp);
            var healCost = 0;
            if (this.gold < needHeal)
                healCost = Math.floor(this.gold / costPerHp);
            else
                healCost = needHeal;
            
            this.hp += healCost / costPerHp;
            this.gold -= healCost;
            
            return healCost;
        }
        //weapons/armor currently not used
        Adventurer.prototype.equipWeapon = function(name, modifier) {
            this.weapon = name;
            this.weaponModifier = modifier;
        }
        Adventurer.prototype.equipArmor = function(name, modifier) {
            this.armor = name;
            this.armorModifier = modifier;
        }
        //simplified - we no longer use this object (for now); logic moved to Adventurer.lootMonster method
        /*
        var Monster = function(level, levelStats, name) {
            Being.call(this, level, levelStats);
            this.name = name;
            this.goldDrop = level * 2;
            this.expDrop = Math.floor(Math.pow(level, 1.5));
        }
        Monster.prototype = Object.create(Being.prototype);
        Monster.prototype.constructor = Monster;
        */
         
        function dieRoll(size) {
            return Math.floor(Math.random() * size) + 1;
        }
        
        //level 21+ = "Boss Level " + level - 20
        /*ResourceModel.monsterData = [
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
        ];*/
        
        //[expNeeded, hpMax, fightStat]
        //follow this pattern after Level 5:
        //expNeeded = 2 * the previous
        //hpMax += levelJustRaisedTo
        //fightStat += level div 10
        ResourceModel.expData = [
            { 'level': 1,  'stats': [8, 9, 3] }
            , { 'level': 2,  'stats': [24, 11, 4] }
            , { 'level': 3,  'stats': [96, 14, 5] }
            , { 'level': 4,  'stats': [175, 18, 6] }
            , { 'level': 5,  'stats': [400, 23, 7] }
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