
(function(window){
    'use strict';
    
    function define_cartel_model() {
        
        var CartelGameModel = {};
        
        CartelGameModel.init = function() {
            this.adventurerList = [];
            this.deadAdventurerList = [];
            this.brokeAdventurerList = [];
            this.expPool = createExpPool(this.expData);
            this.monsterPool = createMonsterPool(this.monsterData);
            this.moneyPool = 0;
            //adjustable - how much it costs to heal damage
            this.costPerHP = 1;
            //adjustable - what percentage of damage monsters do in a fight
            this.hpLossPercentage = 0.1;
            //adjustable - die roll to add to damage adventurers lose in a fight
            this.hpLossRoll = 4;
            //adjustable - die roll to add extra experience when an adventurer kills a monster
            this.expGainRoll = 4;
            //adjustable - die roll to add extra gold when an adventurer kills a monster
            this.goldGainRoll = 4;
        }
        CartelGameModel.addAdventurers = function(num) {
            for (var i = 0; i < num; i++)
                this.adventurerList.push(new Adventurer(1, this.expPool.get(1)));
        }
        CartelGameModel.updateHealingCost = function(newCost) {
            this.costPerHP = newCost;
        }
        CartelGameModel.updateMonsterWeapons = function(newPercentage) {
            this.hpLossPercentage = newPercentage;
        }
        CartelGameModel.updateMonsterStrength = function(newRoll) {
            this.hpLossRoll = newRoll;
        }
        CartelGameModel.goAdventuring = function() {
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
                this.adventurerList[i].takeDamage(Math.round(this.adventurerList[i].hp * this.hpLossPercentage) + dieRoll(this.hpLossRoll) - this.adventurerList[i].armorModifier);
                if (this.adventurerList[i].alive) {
                    this.adventurerList[i].lootMonster(lev, this.expGainRoll, this.goldGainRoll);
                    this.adventurerList[i].checkLevel(this.expPool);
                } else {
                    this.deadAdventurerList.push(this.adventurerList.splice(i, 1));
                }
            }
        }
        CartelGameModel.visitTown = function() {
            var len = this.adventurerList.length;
            for (var i = len - 1; i > -1; i--) {
                //pay for healing
                this.moneyPool += this.adventurerList[i].heal(this.costPerHP);
                //other items go in here as needed...
                //if the adventurer is broke, handle accordingly
                if (this.adventurerList[i].broke)
                    this.brokeAdventurerList.push(this.adventurerList.splice(i, 1));
            }
        }
        CartelGameModel.getOverview = function() {
            var strBuild = "Total adventurers: " + this.adventurerList.length + "\n";
            strBuild += "Level 1-5: " + this.adventurerList.filter(function(a) { return a.level <= 5; }).length + "\n";
            strBuild += "Level 6-10: " + this.adventurerList.filter(function(a) { return a.level > 5 && a.level <= 10; }).length + "\n";
            strBuild += "Level 11-20: " + this.adventurerList.filter(function(a) { return a.level > 10 && a.level <= 20; }).length + "\n";
            strBuild += "Level 21-30: " + this.adventurerList.filter(function(a) { return a.level > 20 && a.level <= 30; }).length + "\n";
            strBuild += "Level 31+: " + this.adventurerList.filter(function(a) { return a.level > 30; }).length + "\n";
            strBuild += "Dead adventurers: " + this.deadAdventurerList.length + "\n";
            strBuild += "Bankrupt adventurers: " + this.brokeAdventurerList.length + "\n";            
            strBuild += "Current funds: " + this.moneyPool + "\n";
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
            var goldDrop = deadMonsterLevel * 2;
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
            var moneySpent = costPerHp * (this.hpMax - this.hp);
            if (this.gold < moneySpent) {
                this.gold = 0;
                this.broke = true;
                moneySpent = 0;
            } else {
                this.hp = this.hpMax;
                this.gold -= moneySpent;
                this.totalGoldSpent += moneySpent;
            }
            return moneySpent;
        }
        Adventurer.prototype.equipWeapon = function(name, modifier) {
            this.weapon = name;
            this.weaponModifier = modifier;
        }
        Adventurer.prototype.equipArmor = function(name, modifier) {
            this.armor = name;
            this.armorModifier = modifier;
        }
        //simplified - we no longer use this object (for now); logic moved to Adventurer.lootMonster method
        var Monster = function(level, levelStats, name) {
            Being.call(this, level, levelStats);
            this.name = name;
            this.goldDrop = level * 2;
            this.expDrop = Math.floor(Math.pow(level, 1.5));
        }
        Monster.prototype = Object.create(Being.prototype);
        Monster.prototype.constructor = Monster;
         
         
        function dieRoll(size) {
            return Math.floor(Math.random() * size) + 1;
        }
        
        //level 21+ = "Boss Level " + level - 20
        CartelGameModel.monsterData = [
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
        CartelGameModel.expData = [
            { 'level': 1,  'stats': [8, 9, 3] }
            , { 'level': 2,  'stats': [24, 11, 4] }
            , { 'level': 3,  'stats': [96, 14, 5] }
            , { 'level': 4,  'stats': [175, 18, 6] }
            , { 'level': 5,  'stats': [400, 23, 7] }
        ];
        
        CartelGameModel.init();
        return CartelGameModel;
    }
    
    //define globally if it doesn't already exist
    if(typeof(CartelGameModel) === 'undefined'){
        window.CartelGameModel = define_cartel_model();
    }
    else{
        console.log("CartelGameModel already defined.");
    }
})(window);