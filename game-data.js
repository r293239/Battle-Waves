// ============================================
// GAME DATA - Weapons, Items, and Stat Buffs
// ============================================

const GAME_DATA = {
    // Starting player stats
    PLAYER_START: {
        health: 20,
        maxHealth: 20,
        damage: 5,
        speed: 3,
        gold: 50
    },

    // Monster attack cooldown in milliseconds
    MONSTER_ATTACK_COOLDOWN: 1000,

    // Wave configurations
    WAVES: [
        { number: 1, monsters: 5, monsterHealth: 20, monsterDamage: 2, goldReward: 50 },
        { number: 2, monsters: 7, monsterHealth: 25, monsterDamage: 3, goldReward: 60 },
        { number: 3, monsters: 9, monsterHealth: 30, monsterDamage: 4, goldReward: 70 },
        { number: 4, monsters: 11, monsterHealth: 35, monsterDamage: 5, goldReward: 80 },
        { number: 5, monsters: 13, monsterHealth: 40, monsterDamage: 6, goldReward: 90 },
        { number: 6, monsters: 15, monsterHealth: 45, monsterDamage: 7, goldReward: 100 },
        { number: 7, monsters: 17, monsterHealth: 50, monsterDamage: 8, goldReward: 110 },
        { number: 8, monsters: 19, monsterHealth: 55, monsterDamage: 9, goldReward: 120 },
        { number: 9, monsters: 21, monsterHealth: 60, monsterDamage: 10, goldReward: 130 },
        { number: 10, monsters: 23, monsterHealth: 65, monsterDamage: 11, goldReward: 140 }
    ],

    // Stat buffs that appear after each wave
    STAT_BUFFS: [
        {
            id: 'health_boost',
            name: 'Health Boost',
            description: 'Increase max health by 10',
            icon: '❤️',
            effect: { maxHealth: 10, health: 10 }
        },
        {
            id: 'damage_boost',
            name: 'Damage Boost',
            description: 'Increase damage by 3',
            icon: '⚔️',
            effect: { damage: 3 }
        },
        {
            id: 'speed_boost',
            name: 'Speed Boost',
            description: 'Increase speed by 1',
            icon: '👟',
            effect: { speed: 1 }
        },
        {
            id: 'life_steal',
            name: 'Life Steal',
            description: 'Heal for 10% of damage dealt',
            icon: '🦇',
            effect: { lifeSteal: 0.1 }
        },
        {
            id: 'critical_chance',
            name: 'Critical Strike',
            description: '10% chance for double damage',
            icon: '🎯',
            effect: { criticalChance: 0.1 }
        },
        {
            id: 'gold_bonus',
            name: 'Gold Bonus',
            description: 'Earn 20% more gold',
            icon: '💰',
            effect: { goldMultiplier: 0.2 }
        },
        {
            id: 'regen',
            name: 'Health Regen',
            description: 'Regenerate 1 HP per second',
            icon: '🔄',
            effect: { healthRegen: 1 }
        },
        {
            id: 'armor',
            name: 'Armor',
            description: 'Reduce damage taken by 10%',
            icon: '🛡️',
            effect: { damageReduction: 0.1 }
        }
    ],

    // Weapons available in shop
    WEAPONS: [
        // Ranged weapons
        {
            id: 'handgun',
            name: 'Handgun',
            icon: '🔫',
            type: 'ranged',
            baseDamage: 5,
            attackSpeed: 1.0, // attacks per second
            range: 300,
            projectileSpeed: 10,
            cost: 0, // Starting weapon
            description: 'Basic starting weapon',
            projectileColor: '#FFD700',
            animation: 'bullet'
        },
        {
            id: 'shotgun',
            name: 'Shotgun',
            icon: '💥',
            type: 'ranged',
            baseDamage: 15,
            attackSpeed: 0.5,
            range: 150,
            projectileSpeed: 8,
            cost: 80,
            description: 'Close range, high damage',
            projectileColor: '#FF6B6B',
            animation: 'shotgun'
        },
        {
            id: 'machinegun',
            name: 'Machine Gun',
            icon: '🔫',
            type: 'ranged',
            baseDamage: 3,
            attackSpeed: 5.0,
            range: 250,
            projectileSpeed: 15,
            cost: 120,
            description: 'Very fast attacks',
            projectileColor: '#4ECDC4',
            animation: 'bullet'
        },
        {
            id: 'laser',
            name: 'Laser Gun',
            icon: '⚡',
            type: 'ranged',
            baseDamage: 8,
            attackSpeed: 2.0,
            range: 350,
            projectileSpeed: 20,
            cost: 150,
            description: 'Fast, accurate shots',
            projectileColor: '#00FF00',
            animation: 'laser'
        },
        
        // Melee weapons - NEW TYPES
        {
            id: 'sword',
            name: 'Iron Sword',
            icon: '⚔️',
            type: 'melee',
            meleeType: 'single', // Single target
            baseDamage: 12,
            attackSpeed: 1.2,
            range: 50,
            cost: 60,
            description: 'Single target melee',
            swingColor: '#C0C0C0',
            swingAngle: 60, // Narrow arc
            animation: 'swordSwing',
            trailColor: '#FFFFFF',
            sparkleColor: '#FFD700'
        },
        {
            id: 'axe',
            name: 'Battle Axe',
            icon: '🪓',
            type: 'melee',
            meleeType: 'aoe', // Area of effect
            baseDamage: 8, // Lower damage because it hits multiple
            attackSpeed: 0.8,
            range: 60,
            cost: 100,
            description: '360° area damage',
            swingColor: '#8B4513',
            swingAngle: 360, // Full circle
            animation: 'axeSpin',
            trailColor: '#8B4513',
            shockwaveColor: '#FFA500'
        },
        {
            id: 'dagger',
            name: 'Swift Dagger',
            icon: '🗡️',
            type: 'melee',
            meleeType: 'single', // Single target
            baseDamage: 8,
            attackSpeed: 2.0, // Very fast
            range: 40,
            cost: 70,
            description: 'Fast single attacks',
            swingColor: '#4682B4',
            swingAngle: 45,
            animation: 'daggerStab',
            trailColor: '#4682B4',
            sparkleColor: '#00FFFF'
        },
        {
            id: 'hammer',
            name: 'War Hammer',
            icon: '🔨',
            type: 'melee',
            meleeType: 'aoe', // Area of effect
            baseDamage: 15, // High damage but slow
            attackSpeed: 0.5,
            range: 70,
            cost: 130,
            description: 'Slow but powerful AOE',
            swingColor: '#D2691E',
            swingAngle: 360,
            animation: 'hammerSmash',
            trailColor: '#D2691E',
            shockwaveColor: '#FF4500'
        },
        {
            id: 'spear',
            name: 'Long Spear',
            icon: '🔱',
            type: 'melee',
            meleeType: 'pierce', // Pierces through enemies
            baseDamage: 10,
            attackSpeed: 1.0,
            range: 80, // Longer range
            cost: 110,
            description: 'Pierces through enemies',
            swingColor: '#32CD32',
            swingAngle: 30,
            pierceCount: 2, // Hits up to 2 enemies
            animation: 'spearThrust',
            trailColor: '#32CD32',
            sparkleColor: '#90EE90'
        }
    ],

    // Items available in shop
    ITEMS: [
        {
            id: 'health_potion',
            name: 'Health Potion',
            icon: '❤️',
            type: 'consumable',
            cost: 40,
            description: 'Restore 20 health'
        },
        {
            id: 'damage_orb',
            name: 'Damage Orb',
            icon: '💎',
            type: 'permanent',
            cost: 100,
            description: 'Permanently +5 damage'
        },
        {
            id: 'speed_boots',
            name: 'Speed Boots',
            icon: '👟',
            type: 'permanent',
            cost: 80,
            description: 'Permanently +2 speed'
        },
        {
            id: 'health_upgrade',
            name: 'Health Upgrade',
            icon: '🛡️',
            type: 'permanent',
            cost: 120,
            description: 'Permanently +30 max health'
        }
    ]
};

// Generate random shop items (4 items total)
function generateShopItems() {
    const shopItems = [];
    
    // Get available weapons (except handgun which is starting weapon)
    const availableWeapons = GAME_DATA.WEAPONS.filter(w => w.id !== 'handgun');
    
    // Get available items
    const availableItems = [...GAME_DATA.ITEMS];
    
    // Add 2 random weapons
    for (let i = 0; i < 2; i++) {
        if (availableWeapons.length > 0) {
            const randomIndex = Math.floor(Math.random() * availableWeapons.length);
            const weapon = {...availableWeapons[randomIndex]};
            shopItems.push({
                type: 'weapon',
                data: weapon
            });
            availableWeapons.splice(randomIndex, 1);
        }
    }
    
    // Add 2 random items
    for (let i = 0; i < 2; i++) {
        if (availableItems.length > 0) {
            const randomIndex = Math.floor(Math.random() * availableItems.length);
            const item = {...availableItems[randomIndex]};
            shopItems.push({
                type: 'item',
                data: item
            });
        }
    }
    
    // Shuffle and return
    return shopItems.sort(() => Math.random() - 0.5);
}

// Generate random stat buffs (4 to choose from)
function generateStatBuffs() {
    const buffs = [...GAME_DATA.STAT_BUFFS];
    const selectedBuffs = [];
    
    for (let i = 0; i < 4; i++) {
        if (buffs.length > 0) {
            const randomIndex = Math.floor(Math.random() * buffs.length);
            selectedBuffs.push(buffs[randomIndex]);
            buffs.splice(randomIndex, 1);
        }
    }
    
    return selectedBuffs;
}

// Helper function to get weapon by ID
function getWeaponById(id) {
    return GAME_DATA.WEAPONS.find(w => w.id === id);
}

// Get wave configuration
function getWaveConfig(waveNumber) {
    // Use predefined waves for first 10 waves, then scale
    if (waveNumber <= GAME_DATA.WAVES.length) {
        return GAME_DATA.WAVES[waveNumber - 1];
    } else {
        // Scale after wave 10
        const baseWave = GAME_DATA.WAVES[GAME_DATA.WAVES.length - 1];
        const scaleFactor = 1 + (waveNumber - 10) * 0.2;
        return {
            number: waveNumber,
            monsters: Math.floor(baseWave.monsters * scaleFactor),
            monsterHealth: Math.floor(baseWave.monsterHealth * scaleFactor),
            monsterDamage: Math.floor(baseWave.monsterDamage * scaleFactor),
            goldReward: Math.floor(baseWave.goldReward * scaleFactor)
        };
    }
}

// Weapon instance class
class WeaponInstance {
    constructor(weaponData) {
        this.id = weaponData.id;
        this.name = weaponData.name;
        this.icon = weaponData.icon;
        this.type = weaponData.type;
        this.meleeType = weaponData.meleeType || 'single';
        this.baseDamage = weaponData.baseDamage;
        this.attackSpeed = weaponData.attackSpeed;
        this.range = weaponData.range;
        this.description = weaponData.description;
        this.cost = weaponData.cost || 0;
        this.lastAttack = 0;
        this.animation = weaponData.animation || 'default';
        
        if (this.type === 'ranged') {
            this.projectileSpeed = weaponData.projectileSpeed;
            this.projectileColor = weaponData.projectileColor;
        } else {
            this.swingColor = weaponData.swingColor;
            this.swingAngle = weaponData.swingAngle || 90;
            this.pierceCount = weaponData.pierceCount || 1;
            this.trailColor = weaponData.trailColor || '#FFFFFF';
            this.sparkleColor = weaponData.sparkleColor || '#FFD700';
            this.shockwaveColor = weaponData.shockwaveColor || '#FFA500';
        }
    }

    canAttack(currentTime) {
        return currentTime - this.lastAttack >= (1000 / this.attackSpeed);
    }

    attack(playerX, playerY, targetX, targetY) {
        this.lastAttack = Date.now();
        
        if (this.type === 'ranged') {
            const angle = Math.atan2(targetY - playerY, targetX - playerX);
            return {
                type: 'ranged',
                x: playerX,
                y: playerY,
                angle: angle,
                speed: this.projectileSpeed,
                range: this.range,
                damage: this.baseDamage,
                color: this.projectileColor,
                weaponId: this.id,
                animation: this.animation
            };
        } else {
            // Melee weapons create a temporary attack area
            const angle = Math.atan2(targetY - playerY, targetX - playerX);
            return {
                type: 'melee',
                x: playerX,
                y: playerY,
                radius: this.range,
                damage: this.baseDamage,
                color: this.swingColor,
                startTime: Date.now(),
                duration: 300, // ms - increased for better animation
                swingAngle: this.swingAngle,
                meleeType: this.meleeType,
                angle: angle, // Direction player is facing
                pierceCount: this.pierceCount,
                weaponId: this.id,
                animation: this.animation,
                trailColor: this.trailColor,
                sparkleColor: this.sparkleColor,
                shockwaveColor: this.shockwaveColor
            };
        }
    }
    
    // Get scrap value (50% of original cost)
    getScrapValue() {
        return Math.floor(this.cost * 0.5);
    }
    
    // Get weapon type description
    getTypeDescription() {
        if (this.type === 'ranged') return 'RANGED';
        if (this.meleeType === 'single') return 'SINGLE';
        if (this.meleeType === 'aoe') return 'AOE 360°';
        if (this.meleeType === 'pierce') return 'PIERCE';
        return 'MELEE';
    }
}
