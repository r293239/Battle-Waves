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
            projectileColor: '#FFD700'
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
            projectileColor: '#FF6B6B'
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
            projectileColor: '#4ECDC4'
        },
        {
            id: 'sword',
            name: 'Iron Sword',
            icon: '⚔️',
            type: 'melee',
            baseDamage: 8,
            attackSpeed: 1.2,
            range: 50,
            cost: 60,
            description: 'Basic melee weapon',
            swingColor: '#C0C0C0'
        },
        {
            id: 'axe',
            name: 'Battle Axe',
            icon: '🪓',
            type: 'melee',
            baseDamage: 12,
            attackSpeed: 0.8,
            range: 60,
            cost: 100,
            description: 'Slow but powerful',
            swingColor: '#8B4513'
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
            projectileColor: '#00FF00'
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

// Weapon instance class
class WeaponInstance {
    constructor(weaponData) {
        this.id = weaponData.id;
        this.name = weaponData.name;
        this.icon = weaponData.icon;
        this.type = weaponData.type;
        this.baseDamage = weaponData.baseDamage;
        this.attackSpeed = weaponData.attackSpeed;
        this.range = weaponData.range;
        this.description = weaponData.description;
        this.lastAttack = 0;
        
        if (this.type === 'ranged') {
            this.projectileSpeed = weaponData.projectileSpeed;
            this.projectileColor = weaponData.projectileColor;
        } else {
            this.swingColor = weaponData.swingColor;
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
                color: this.projectileColor
            };
        } else {
            // Melee weapons create a temporary attack area
            return {
                type: 'melee',
                x: playerX,
                y: playerY,
                radius: this.range,
                damage: this.baseDamage,
                color: this.swingColor,
                startTime: Date.now(),
                duration: 200 // ms
            };
        }
    }
}
