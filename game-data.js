// ============================================
// GAME DATA - Weapons and Items
// ============================================

const GAME_DATA = {
    WEAPONS: [
        // Ranged Weapons
        {
            id: 'handgun',
            name: 'Handgun',
            icon: '🔫',
            type: 'ranged',
            baseDamage: 15,
            attackSpeed: 0.5,
            range: 300,
            projectileSpeed: 15,
            cost: 0,
            description: 'Basic starting weapon',
            maxLevel: 5,
            upgradeBonus: {
                damage: 5,
                attackSpeed: 0.1,
                range: 20
            }
        },
        {
            id: 'shotgun',
            name: 'Shotgun',
            icon: '💥',
            type: 'ranged',
            baseDamage: 25,
            attackSpeed: 1.2,
            range: 150,
            projectileSpeed: 10,
            cost: 150,
            description: 'Close range, high damage',
            maxLevel: 5,
            upgradeBonus: {
                damage: 8,
                attackSpeed: 0.15,
                range: 10
            }
        },
        {
            id: 'machinegun',
            name: 'Machine Gun',
            icon: '🔫',
            type: 'ranged',
            baseDamage: 8,
            attackSpeed: 0.1,
            range: 250,
            projectileSpeed: 20,
            cost: 200,
            description: 'Rapid fire, low damage',
            maxLevel: 5,
            upgradeBonus: {
                damage: 3,
                attackSpeed: 0.02,
                range: 15
            }
        },
        // Melee Weapons
        {
            id: 'sword',
            name: 'Iron Sword',
            icon: '⚔️',
            type: 'melee',
            baseDamage: 30,
            attackSpeed: 0.8,
            range: 50,
            swingRadius: 60,
            cost: 120,
            description: 'Basic melee weapon',
            maxLevel: 5,
            upgradeBonus: {
                damage: 10,
                attackSpeed: 0.1,
                range: 10,
                swingRadius: 10
            }
        },
        {
            id: 'axe',
            name: 'Battle Axe',
            icon: '🪓',
            type: 'melee',
            baseDamage: 40,
            attackSpeed: 1.5,
            range: 40,
            swingRadius: 70,
            cost: 180,
            description: 'Heavy hitting melee',
            maxLevel: 5,
            upgradeBonus: {
                damage: 15,
                attackSpeed: 0.2,
                range: 5,
                swingRadius: 15
            }
        },
        {
            id: 'dagger',
            name: 'Swift Dagger',
            icon: '🗡️',
            type: 'melee',
            baseDamage: 20,
            attackSpeed: 0.3,
            range: 35,
            swingRadius: 45,
            cost: 100,
            description: 'Fast melee attacks',
            maxLevel: 5,
            upgradeBonus: {
                damage: 6,
                attackSpeed: 0.05,
                range: 5,
                swingRadius: 8
            }
        },
        {
            id: 'hammer',
            name: 'War Hammer',
            icon: '🔨',
            type: 'melee',
            baseDamage: 50,
            attackSpeed: 2.0,
            range: 45,
            swingRadius: 80,
            cost: 250,
            description: 'Slow but devastating',
            maxLevel: 5,
            upgradeBonus: {
                damage: 20,
                attackSpeed: 0.3,
                range: 8,
                swingRadius: 20
            }
        }
    ],

    ITEMS: [
        {
            id: 'health_potion',
            name: 'Health Potion',
            icon: '❤️',
            type: 'consumable',
            effect: 'heal',
            value: 50,
            cost: 75,
            description: 'Restores 50 health'
        },
        {
            id: 'damage_boost',
            name: 'Damage Crystal',
            icon: '💎',
            type: 'stat',
            effect: 'damage',
            value: 10,
            cost: 120,
            description: 'Permanently increases damage by 10'
        },
        {
            id: 'speed_boost',
            name: 'Speed Boots',
            icon: '👟',
            type: 'stat',
            effect: 'speed',
            value: 2,
            cost: 100,
            description: 'Permanently increases movement speed by 2'
        },
        {
            id: 'max_health',
            name: 'Vitality Orb',
            icon: '🛡️',
            type: 'stat',
            effect: 'maxHealth',
            value: 50,
            cost: 150,
            description: 'Increases max health by 50'
        },
        {
            id: 'critical_chance',
            name: 'Critical Charm',
            icon: '🎯',
            type: 'stat',
            effect: 'critical',
            value: 0.1,
            cost: 200,
            description: '10% chance for critical hits'
        },
        {
            id: 'life_steal',
            name: 'Vampire Tooth',
            icon: '🦇',
            type: 'stat',
            effect: 'lifeSteal',
            value: 0.1,
            cost: 180,
            description: 'Heal 10% of damage dealt'
        },
        {
            id: 'gold_magnet',
            name: 'Gold Magnet',
            icon: '🧲',
            type: 'stat',
            effect: 'goldMultiplier',
            value: 0.2,
            cost: 160,
            description: '20% more gold from kills'
        },
        // Melee-specific items
        {
            id: 'cleave_effect',
            name: 'Cleaving Edge',
            icon: '🌀',
            type: 'stat',
            effect: 'cleave',
            value: 2,
            cost: 220,
            description: 'Melee attacks hit 2 additional enemies'
        },
        {
            id: 'bleed_effect',
            name: 'Bleeding Blade',
            icon: '🩸',
            type: 'stat',
            effect: 'bleed',
            value: 5,
            cost: 190,
            description: 'Melee attacks cause bleeding damage over time'
        },
        // Ranged-specific items
        {
            id: 'pierce_effect',
            name: 'Piercing Rounds',
            icon: '➰',
            type: 'stat',
            effect: 'pierce',
            value: 2,
            cost: 210,
            description: 'Ranged attacks pierce through 2 enemies'
        },
        {
            id: 'homing_effect',
            name: 'Homing Module',
            icon: '🎯',
            type: 'stat',
            effect: 'homing',
            value: 0.3,
            cost: 240,
            description: 'Projectiles have 30% homing capability'
        }
    ]
};

// Generate random shop items (FIXED: Won't refresh on its own)
let currentShopItems = [];

function generateShopItems(count = 4) {
    const availableItems = GAME_DATA.ITEMS.filter(item => 
        !['health_potion'].includes(item.id)
    );
    const availableWeapons = GAME_DATA.WEAPONS.filter(weapon => 
        weapon.id !== 'handgun'
    );
    
    const shopItems = [];
    
    // Add 2 random weapons (1 melee, 1 ranged)
    const meleeWeapons = availableWeapons.filter(w => w.type === 'melee');
    const rangedWeapons = availableWeapons.filter(w => w.type === 'ranged');
    
    if (meleeWeapons.length > 0) {
        const randomIndex = Math.floor(Math.random() * meleeWeapons.length);
        const weapon = {...meleeWeapons[randomIndex]};
        shopItems.push({
            type: 'weapon',
            data: weapon,
            cost: weapon.cost
        });
    }
    
    if (rangedWeapons.length > 0) {
        const randomIndex = Math.floor(Math.random() * rangedWeapons.length);
        const weapon = {...rangedWeapons[randomIndex]};
        shopItems.push({
            type: 'weapon',
            data: weapon,
            cost: weapon.cost
        });
    }
    
    // Add 2 random items
    for (let i = 0; i < 2; i++) {
        if (availableItems.length > 0) {
            const randomIndex = Math.floor(Math.random() * availableItems.length);
            const item = {...availableItems[randomIndex]};
            shopItems.push({
                type: 'item',
                data: item,
                cost: item.cost
            });
        }
    }
    
    // Shuffle the shop items
    return shopItems.sort(() => Math.random() - 0.5);
}

// Weapon instance class
class WeaponInstance {
    constructor(weaponData, level = 1) {
        this.id = weaponData.id;
        this.name = weaponData.name;
        this.icon = weaponData.icon;
        this.type = weaponData.type;
        this.level = level;
        this.baseDamage = weaponData.baseDamage;
        this.attackSpeed = weaponData.attackSpeed;
        this.range = weaponData.range;
        this.description = weaponData.description;
        this.maxLevel = weaponData.maxLevel;
        this.upgradeBonus = weaponData.upgradeBonus;
        this.lastAttack = 0;
        
        if (this.type === 'melee') {
            this.swingRadius = weaponData.swingRadius || 50;
            this.swingAngle = 120; // degrees
        } else {
            this.projectileSpeed = weaponData.projectileSpeed || 15;
        }
    }

    get damage() {
        return this.baseDamage + (this.level - 1) * this.upgradeBonus.damage;
    }

    get currentAttackSpeed() {
        return Math.max(0.05, this.attackSpeed - (this.level - 1) * this.upgradeBonus.attackSpeed);
    }

    get currentRange() {
        return this.range + (this.level - 1) * this.upgradeBonus.range;
    }
    
    get currentSwingRadius() {
        return this.swingRadius + (this.level - 1) * (this.upgradeBonus.swingRadius || 0);
    }

    canAttack(currentTime) {
        return currentTime - this.lastAttack >= (1000 / this.currentAttackSpeed);
    }

    attack(playerX, playerY, playerStats) {
        this.lastAttack = Date.now();
        
        if (this.type === 'ranged') {
            return this.createRangedAttack(playerX, playerY);
        } else {
            return this.createMeleeAttack(playerX, playerY, playerStats);
        }
    }
    
    createRangedAttack(playerX, playerY) {
        return {
            type: 'ranged',
            x: playerX,
            y: playerY,
            angle: Math.atan2(mouseY - playerY, mouseX - playerX),
            speed: this.projectileSpeed,
            range: this.currentRange,
            damage: this.damage,
            weaponType: this.id,
            color: this.getProjectileColor()
        };
    }
    
    createMeleeAttack(playerX, playerY, playerStats) {
        return {
            type: 'melee',
            x: playerX,
            y: playerY,
            radius: this.currentSwingRadius,
            damage: this.damage,
            weaponType: this.id,
            color: this.getMeleeColor(),
            angle: Math.atan2(mouseY - playerY, mouseX - playerX),
            activeTime: 300, // ms
            startTime: Date.now(),
            cleave: playerStats.cleave || 0,
            bleed: playerStats.bleed || 0
        };
    }

    getProjectileColor() {
        const colors = {
            handgun: '#FFD700',
            shotgun: '#FF6B6B',
            machinegun: '#4ECDC4'
        };
        return colors[this.id] || '#FFFFFF';
    }
    
    getMeleeColor() {
        const colors = {
            sword: '#C0C0C0',
            axe: '#8B4513',
            dagger: '#4682B4',
            hammer: '#D2691E'
        };
        return colors[this.id] || '#FFFFFF';
    }

    upgrade() {
        if (this.level < this.maxLevel) {
            this.level++;
            return true;
        }
        return false;
    }

    getStats() {
        return {
            damage: this.damage,
            attackSpeed: this.currentAttackSpeed,
            range: this.currentRange,
            level: this.level
        };
    }
}

// Initialize shop items once
function initShopItems() {
    if (currentShopItems.length === 0) {
        currentShopItems = generateShopItems();
    }
    return currentShopItems;
}

// Refresh shop items manually
function refreshShopItems() {
    currentShopItems = generateShopItems();
    return currentShopItems;
}

// Helper functions
function getWeaponById(id) {
    return GAME_DATA.WEAPONS.find(w => w.id === id);
}

function getItemById(id) {
    return GAME_DATA.ITEMS.find(i => i.id === id);
}
