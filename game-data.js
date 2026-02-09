// ============================================
// GAME DATA - Weapons and Items
// ============================================

const GAME_DATA = {
    WEAPONS: [
        {
            id: 'handgun',
            name: 'Handgun',
            icon: '🔫',
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
            icon: '🔪',
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
            icon: '💥',
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
        {
            id: 'rocketlauncher',
            name: 'Rocket Launcher',
            icon: '🚀',
            baseDamage: 50,
            attackSpeed: 2.0,
            range: 400,
            projectileSpeed: 8,
            cost: 350,
            description: 'Explosive area damage',
            maxLevel: 5,
            upgradeBonus: {
                damage: 20,
                attackSpeed: 0.3,
                range: 30
            }
        },
        {
            id: 'laser',
            name: 'Laser Rifle',
            icon: '⚡',
            baseDamage: 20,
            attackSpeed: 0.8,
            range: 350,
            projectileSpeed: 30,
            cost: 300,
            description: 'Instant hit, accurate',
            maxLevel: 5,
            upgradeBonus: {
                damage: 10,
                attackSpeed: 0.2,
                range: 25
            }
        },
        {
            id: 'flamethrower',
            name: 'Flamethrower',
            icon: '🔥',
            baseDamage: 12,
            attackSpeed: 0.05,
            range: 100,
            projectileSpeed: 5,
            cost: 250,
            description: 'Continuous fire, burns enemies',
            maxLevel: 5,
            upgradeBonus: {
                damage: 4,
                attackSpeed: 0.01,
                range: 5
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
        {
            id: 'explosive_rounds',
            name: 'Explosive Rounds',
            icon: '💣',
            type: 'stat',
            effect: 'explosive',
            value: 20,
            cost: 220,
            description: 'Bullets explode on impact'
        }
    ]
};

// Helper function to get weapon by ID
function getWeaponById(id) {
    return GAME_DATA.WEAPONS.find(w => w.id === id);
}

// Helper function to get item by ID
function getItemById(id) {
    return GAME_DATA.ITEMS.find(i => i.id === id);
}

// Generate random shop items
function generateShopItems(count = 4) {
    const availableItems = GAME_DATA.ITEMS.filter(item => 
        !['health_potion'].includes(item.id) // Don't include health potions in random generation
    );
    const availableWeapons = GAME_DATA.WEAPONS.filter(weapon => 
        weapon.id !== 'handgun' // Don't include starting weapon
    );
    
    const shopItems = [];
    
    // Add 2 random weapons
    for (let i = 0; i < 2; i++) {
        if (availableWeapons.length > 0) {
            const randomIndex = Math.floor(Math.random() * availableWeapons.length);
            const weapon = {...availableWeapons[randomIndex]};
            shopItems.push({
                type: 'weapon',
                data: weapon,
                cost: weapon.cost
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
        this.level = level;
        this.baseDamage = weaponData.baseDamage;
        this.attackSpeed = weaponData.attackSpeed;
        this.range = weaponData.range;
        this.projectileSpeed = weaponData.projectileSpeed;
        this.description = weaponData.description;
        this.maxLevel = weaponData.maxLevel;
        this.upgradeBonus = weaponData.upgradeBonus;
        this.lastAttack = 0;
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

    canAttack(currentTime) {
        return currentTime - this.lastAttack >= (1000 / this.currentAttackSpeed);
    }

    attack(targetX, targetY, playerX, playerY) {
        const angle = Math.atan2(targetY - playerY, targetX - playerX);
        const damage = this.damage;
        
        this.lastAttack = Date.now();
        
        return {
            x: playerX,
            y: playerY,
            targetX,
            targetY,
            angle,
            speed: this.projectileSpeed,
            range: this.currentRange,
            damage,
            weaponType: this.id,
            color: this.getProjectileColor()
        };
    }

    getProjectileColor() {
        const colors = {
            handgun: '#FFD700',
            shotgun: '#FF6B6B',
            machinegun: '#4ECDC4',
            rocketlauncher: '#FF9F43',
            laser: '#00FF00',
            flamethrower: '#FF3300'
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
