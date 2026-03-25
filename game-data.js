// ============================================
// GAME DATA - Weapons, Items, and Stat Buffs
// ============================================

// Image cache for weapon icons
const weaponImageCache = {};
let imagesLoaded = false;
let imagesToLoad = 0;
let imagesLoadedCount = 0;

// Function to load weapon images
function loadWeaponImages(callback) {
    const weaponsWithImages = GAME_DATA.WEAPONS.filter(w => w.icon && w.icon.startsWith('assets/') && w.icon.endsWith('.png'));
    imagesToLoad = weaponsWithImages.length;
    imagesLoadedCount = 0;
    
    if (imagesToLoad === 0) {
        if (callback) callback(true);
        return;
    }
    
    weaponsWithImages.forEach(weapon => {
        const img = new Image();
        img.onload = () => {
            imagesLoadedCount++;
            weaponImageCache[weapon.id] = img;
            console.log(`Loaded: ${weapon.icon} (${imagesLoadedCount}/${imagesToLoad})`);
            if (imagesLoadedCount === imagesToLoad && callback) {
                imagesLoaded = true;
                callback(true);
            }
        };
        img.onerror = () => {
            console.error(`Failed to load: ${weapon.icon}`);
            imagesLoadedCount++;
            // Use fallback emoji
            weaponImageCache[weapon.id] = null;
            if (imagesLoadedCount === imagesToLoad && callback) {
                imagesLoaded = true;
                callback(false);
            }
        };
        img.src = weapon.icon;
    });
}

// Function to draw weapon icon (to be used in your render function)
function drawWeaponIcon(ctx, weapon, x, y, size, isShop = true) {
    // Check if this weapon uses an image file
    if (weapon.icon && weapon.icon.startsWith('assets/') && weapon.icon.endsWith('.png')) {
        const img = weaponImageCache[weapon.id];
        
        // Draw background for the icon slot
        ctx.fillStyle = '#2c3e50';
        ctx.fillRect(x, y, size, size);
        ctx.strokeStyle = '#ecf0f1';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, size, size);
        
        if (img && img.complete && img.naturalWidth > 0) {
            // Image loaded successfully - draw it
            ctx.drawImage(img, x + 2, y + 2, size - 4, size - 4);
        } else if (img && !img.complete) {
            // Still loading
            ctx.fillStyle = '#7f8c8d';
            ctx.font = `${Math.floor(size * 0.3)}px Arial`;
            ctx.fillText('Loading...', x + 5, y + size/2 + 5);
        } else {
            // Failed to load or no image - show fallback
            ctx.fillStyle = '#e67e22';
            ctx.font = `${Math.floor(size * 0.6)}px Arial`;
            ctx.fillText('🔫', x + size * 0.25, y + size * 0.75);
        }
    } else {
        // Text emoji icon
        ctx.fillStyle = '#2c3e50';
        ctx.fillRect(x, y, size, size);
        ctx.strokeStyle = '#ecf0f1';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, size, size);
        ctx.font = `${Math.floor(size * 0.7)}px Arial`;
        ctx.fillStyle = '#ecf0f1';
        ctx.fillText(weapon.icon, x + size * 0.25, y + size * 0.75);
    }
}

// Function to draw weapon in shop (example usage)
function drawShopWeapon(ctx, weapon, x, y, width, height, isSelected = false) {
    const iconSize = Math.min(width - 20, height - 60);
    const iconX = x + (width - iconSize) / 2;
    const iconY = y + 10;
    
    // Draw selection highlight
    if (isSelected) {
        ctx.fillStyle = 'rgba(52, 152, 219, 0.3)';
        ctx.fillRect(x, y, width, height);
        ctx.strokeStyle = '#3498db';
        ctx.lineWidth = 3;
        ctx.strokeRect(x, y, width, height);
    }
    
    // Draw weapon icon
    drawWeaponIcon(ctx, weapon, iconX, iconY, iconSize);
    
    // Draw weapon name
    ctx.fillStyle = '#ecf0f1';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(weapon.name, x + width/2, y + iconSize + 20);
    
    // Draw cost
    ctx.fillStyle = '#f1c40f';
    ctx.font = '10px Arial';
    ctx.fillText(`💰 ${weapon.cost}`, x + width/2, y + iconSize + 35);
    
    ctx.textAlign = 'left';
}

// Function to draw equipped weapon (example usage)
function drawEquippedWeapon(ctx, weapon, x, y, size) {
    if (!weapon) return;
    
    // Draw background
    ctx.fillStyle = '#34495e';
    ctx.fillRect(x, y, size, size);
    ctx.strokeStyle = '#e67e22';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, size, size);
    
    // Draw weapon icon
    if (weapon.icon && weapon.icon.startsWith('assets/') && weapon.icon.endsWith('.png')) {
        const img = weaponImageCache[weapon.id];
        if (img && img.complete && img.naturalWidth > 0) {
            ctx.drawImage(img, x + 2, y + 2, size - 4, size - 4);
        } else {
            ctx.font = `${Math.floor(size * 0.6)}px Arial`;
            ctx.fillStyle = '#ecf0f1';
            ctx.fillText('⚔️', x + size * 0.25, y + size * 0.75);
        }
    } else {
        ctx.font = `${Math.floor(size * 0.6)}px Arial`;
        ctx.fillStyle = '#ecf0f1';
        ctx.fillText(weapon.icon, x + size * 0.25, y + size * 0.75);
    }
}

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
        { number: 1, monsters: 5, monsterHealth: 20, monsterDamage: 2, goldReward: 50, isBoss: false },
        { number: 2, monsters: 7, monsterHealth: 25, monsterDamage: 3, goldReward: 60, isBoss: false },
        { number: 3, monsters: 9, monsterHealth: 30, monsterDamage: 4, goldReward: 70, isBoss: false },
        { number: 4, monsters: 11, monsterHealth: 35, monsterDamage: 5, goldReward: 80, isBoss: false },
        { number: 5, monsters: 13, monsterHealth: 40, monsterDamage: 6, goldReward: 90, isBoss: false },
        { number: 6, monsters: 15, monsterHealth: 45, monsterDamage: 7, goldReward: 100, isBoss: false },
        { number: 7, monsters: 17, monsterHealth: 50, monsterDamage: 8, goldReward: 110, isBoss: false },
        { number: 8, monsters: 19, monsterHealth: 55, monsterDamage: 9, goldReward: 120, isBoss: false },
        { number: 9, monsters: 21, monsterHealth: 60, monsterDamage: 10, goldReward: 130, isBoss: false },
        { number: 10, monsters: 1, monsterHealth: 3000, monsterDamage: 15, goldReward: 400, isBoss: true, minions: 8 },
        { number: 11, monsters: 30, monsterHealth: 70, monsterDamage: 11, goldReward: 140, isBoss: false },
        { number: 12, monsters: 32, monsterHealth: 75, monsterDamage: 12, goldReward: 150, isBoss: false },
        { number: 13, monsters: 34, monsterHealth: 80, monsterDamage: 13, goldReward: 160, isBoss: false },
        { number: 14, monsters: 36, monsterHealth: 85, monsterDamage: 14, goldReward: 170, isBoss: false },
        { number: 15, monsters: 38, monsterHealth: 90, monsterDamage: 15, goldReward: 180, isBoss: false },
        { number: 16, monsters: 40, monsterHealth: 95, monsterDamage: 16, goldReward: 190, isBoss: false },
        { number: 17, monsters: 42, monsterHealth: 100, monsterDamage: 17, goldReward: 200, isBoss: false },
        { number: 18, monsters: 44, monsterHealth: 110, monsterDamage: 18, goldReward: 210, isBoss: false },
        { number: 19, monsters: 46, monsterHealth: 120, monsterDamage: 19, goldReward: 220, isBoss: false },
        { number: 20, monsters: 1, monsterHealth: 5000, monsterDamage: 25, goldReward: 500, isBoss: true },
        { number: 21, monsters: 55, monsterHealth: 130, monsterDamage: 20, goldReward: 240, isBoss: false },
        { number: 22, monsters: 60, monsterHealth: 140, monsterDamage: 21, goldReward: 260, isBoss: false },
        { number: 23, monsters: 65, monsterHealth: 150, monsterDamage: 22, goldReward: 280, isBoss: false },
        { number: 24, monsters: 70, monsterHealth: 160, monsterDamage: 23, goldReward: 300, isBoss: false },
        { number: 25, monsters: 75, monsterHealth: 170, monsterDamage: 24, goldReward: 320, isBoss: false },
        { number: 26, monsters: 80, monsterHealth: 180, monsterDamage: 25, goldReward: 340, isBoss: false },
        { number: 27, monsters: 85, monsterHealth: 200, monsterDamage: 26, goldReward: 360, isBoss: false },
        { number: 28, monsters: 90, monsterHealth: 220, monsterDamage: 27, goldReward: 380, isBoss: false },
        { number: 29, monsters: 95, monsterHealth: 250, monsterDamage: 28, goldReward: 400, isBoss: false },
        { number: 30, monsters: 1, monsterHealth: 10000, monsterDamage: 40, goldReward: 1000, isBoss: true },
        { number: 31, monsters: 100, monsterHealth: 300, monsterDamage: 28, goldReward: 450, isBoss: false }
    ],

    // Stat buffs
    STAT_BUFFS: [
        { id: 'health_boost', name: 'Health Boost', description: 'Increase max health by 10%', icon: '❤️', effect: { maxHealthPercent: 0.1, healthPercent: 0.1 } },
        { id: 'damage_boost', name: 'Damage Boost', description: 'Increase damage by 10%', icon: '⚔️', effect: { damagePercent: 0.1 } },
        { id: 'speed_boost', name: 'Speed Boost', description: 'Increase speed by 10%', icon: '👟', effect: { speedPercent: 0.1 } },
        { id: 'life_steal', name: 'Life Steal', description: 'Heal for 1% of damage dealt', icon: '🦇', effect: { lifeSteal: 0.01 } },
        { id: 'critical_chance', name: 'Critical Strike', description: '5% chance for double damage', icon: '🎯', effect: { criticalChance: 0.05 } },
        { id: 'gold_bonus', name: 'Gold Bonus', description: 'Earn 10% more gold', icon: '💰', effect: { goldMultiplier: 0.1 } },
        { id: 'regen', name: 'Health Regen', description: 'Regenerate 1% HP per second', icon: '🔄', effect: { healthRegenPercent: 0.01 } },
        { id: 'armor', name: 'Armor', description: 'Reduce damage taken by 3%', icon: '🛡️', effect: { damageReduction: 0.03 } }
    ],

    // Weapons - WITH FILE PATHS
    WEAPONS: [
        {
            id: 'handgun',
            name: 'Handgun',
            icon: 'assets/handgun.png',
            type: 'ranged',
            baseDamage: 7,
            attackSpeed: 1.0,
            range: 300,
            projectileSpeed: 10,
            cost: 0,
            description: 'Basic starting weapon',
            projectileColor: '#FFD700',
            animation: 'bullet',
            usesAmmo: true,
            magazineSize: 8,
            reloadTime: 1500,
            spread: 0.05,
            tierMultipliers: { damage: [1, 1.2, 1.4, 1.7, 2.1, 2.5], attackSpeed: [1, 1.1, 1.2, 1.3, 1.4, 1.5], magazine: [1, 1.2, 1.4, 1.6, 1.8, 2.0] }
        },
        {
            id: 'shotgun',
            name: 'Shotgun',
            icon: 'assets/shotgun.png',
            type: 'ranged',
            baseDamage: 4,
            attackSpeed: 0.8,
            range: 200,
            projectileSpeed: 8,
            cost: 95,
            description: '10 pellets in wide arc',
            projectileColor: '#FF6B6B',
            animation: 'shotgun',
            pelletCount: 10,
            spreadAngle: 60,
            usesAmmo: true,
            magazineSize: 6,
            reloadTime: 2000,
            spread: 0.2,
            tierMultipliers: { damage: [1, 1.3, 1.6, 2.0, 2.5, 3.0], attackSpeed: [1, 1.05, 1.1, 1.15, 1.2, 1.25], pelletCount: [1, 1, 1, 1.2, 1.4, 1.6], magazine: [1, 1.1, 1.2, 1.3, 1.4, 1.5] }
        },
        {
            id: 'machinegun',
            name: 'Machine Gun',
            icon: 'assets/machinegun.png',
            type: 'ranged',
            baseDamage: 3,
            attackSpeed: 5.0,
            range: 275,
            projectileSpeed: 15,
            cost: 120,
            description: 'Very fast attacks',
            projectileColor: '#4ECDC4',
            animation: 'bullet',
            usesAmmo: true,
            magazineSize: 50,
            reloadTime: 2500,
            spread: 0.75,
            tierMultipliers: { damage: [1, 1.1, 1.2, 1.3, 1.4, 1.5], attackSpeed: [1, 1.2, 1.4, 1.6, 1.8, 2.0], magazine: [1, 1.3, 1.6, 1.9, 2.2, 2.5] }
        },
        {
            id: 'laser',
            name: 'Energy Gun',
            icon: '⚡',
            type: 'ranged',
            baseDamage: 8,
            attackSpeed: 2.0,
            range: 400,
            projectileSpeed: 20,
            cost: 150,
            description: 'Bounces between enemies',
            projectileColor: '#00FFFF',
            animation: 'laser',
            bounceCount: 3,
            bounceRange: 100,
            usesAmmo: true,
            magazineSize: 15,
            reloadTime: 1800,
            spread: 0,
            tierMultipliers: { damage: [1, 1.2, 1.4, 1.7, 2.0, 2.4], attackSpeed: [1, 1.1, 1.2, 1.3, 1.4, 1.5], bounceCount: [1, 1, 2, 2, 3, 4], magazine: [1, 1.2, 1.4, 1.6, 1.8, 2.0] }
        },
        {
            id: 'boomerang',
            name: 'Boomerang',
            icon: 'assets/boomerang.png',
            type: 'ranged',
            baseDamage: 5,
            attackSpeed: 1.2,
            range: 450,
            projectileSpeed: 10,
            returnSpeed: 15,
            cost: 95,
            description: 'Throws a returning boomerang',
            projectileColor: '#8B4513',
            animation: 'boomerang',
            usesAmmo: false,
            maxTargets: 4,
            spread: 0,
            tierMultipliers: { damage: [1, 1.3, 1.6, 2.0, 2.4, 2.9], attackSpeed: [1, 1.1, 1.2, 1.3, 1.4, 1.5], range: [1, 1.1, 1.2, 1.3, 1.4, 1.5], maxTargets: [1, 1, 2, 2, 3, 4] }
        },
        {
            id: 'throwing_knives',
            name: 'Throwing Knives',
            icon: '🔪',
            type: 'ranged',
            baseDamage: 7,
            attackSpeed: 2.0,
            range: 250,
            projectileSpeed: 12,
            cost: 55,
            description: 'Limited knives per round',
            projectileColor: '#C0C0C0',
            animation: 'knife',
            usesAmmo: true,
            magazineSize: 7,
            reloadTime: 0,
            isThrowable: true,
            resetEachRound: true,
            spread: 0.02,
            tierMultipliers: { damage: [1, 1.2, 1.4, 1.7, 2.0, 2.4], attackSpeed: [1, 1.1, 1.2, 1.3, 1.4, 1.5], magazine: [1, 1.4, 1.8, 2.2, 2.6, 3.0], range: [1, 1.1, 1.2, 1.3, 1.4, 1.5] }
        },
        {
            id: 'sniper',
            name: 'Sniper Rifle',
            icon: 'assets/sniper.png',
            type: 'ranged',
            baseDamage: 35,
            attackSpeed: 0.5,
            range: 500,
            projectileSpeed: 20,
            cost: 180,
            description: 'Long range, targets highest HP',
            projectileColor: '#FF4500',
            animation: 'sniper',
            usesAmmo: true,
            magazineSize: 3,
            reloadTime: 2500,
            spread: 0,
            sniper: true,
            tierMultipliers: { damage: [1, 1.4, 1.8, 2.3, 2.9, 3.5], attackSpeed: [1, 1.1, 1.2, 1.3, 1.4, 1.5], magazine: [1, 1, 1.2, 1.4, 1.6, 1.8] }
        },
        {
            id: 'crossbow',
            name: 'Crossbow',
            icon: 'assets/crossbow.png',
            type: 'ranged',
            baseDamage: 18,
            attackSpeed: 1.2,
            range: 350,
            projectileSpeed: 15,
            cost: 120,
            description: 'Pierces through enemies',
            projectileColor: '#8B4513',
            animation: 'bolt',
            usesAmmo: true,
            magazineSize: 1,
            reloadTime: 1200,
            spread: 0,
            pierceCount: 3,
            tierMultipliers: { damage: [1, 1.3, 1.6, 2.0, 2.5, 3.0], attackSpeed: [1, 1.1, 1.2, 1.3, 1.4, 1.5], pierceCount: [1, 2, 2, 3, 3, 4] }
        },
        {
            id: 'sword',
            name: 'Iron Sword',
            icon: '⚔️',
            type: 'melee',
            meleeType: 'single',
            baseDamage: 10,
            attackSpeed: 1.2,
            range: 100,
            cost: 60,
            description: 'Swing a longsword in an arc',
            usesAmmo: false,
            tierMultipliers: { damage: [1, 1.3, 1.6, 2.0, 2.5, 3.0], attackSpeed: [1, 1.1, 1.2, 1.3, 1.4, 1.5], range: [1, 1.1, 1.2, 1.3, 1.4, 1.5] }
        },
        {
            id: 'axe',
            name: 'Battle Axe',
            icon: '🪓',
            type: 'melee',
            meleeType: 'aoe',
            baseDamage: 12,
            attackSpeed: 0.8,
            range: 80,
            cost: 100,
            description: '360° spinning axe',
            usesAmmo: false,
            tierMultipliers: { damage: [1, 1.4, 1.8, 2.3, 2.9, 3.5], attackSpeed: [1, 1.05, 1.1, 1.15, 1.2, 1.25], range: [1, 1.1, 1.2, 1.3, 1.3, 1.3] }
        },
        {
            id: 'dual_daggers',
            name: 'Dual Daggers',
            icon: '🗡️🗡️',
            type: 'melee',
            meleeType: 'single',
            baseDamage: 5,
            attackSpeed: 3.0,
            range: 60,
            cost: 90,
            description: 'Two fast daggers',
            usesAmmo: false,
            dualStrike: true,
            tierMultipliers: { damage: [1, 1.2, 1.4, 1.7, 2.0, 2.4], attackSpeed: [1, 1.2, 1.4, 1.6, 1.8, 2.0], range: [1, 1.05, 1.1, 1.15, 1.2, 1.2] }
        },
        {
            id: 'dagger',
            name: 'Swift Dagger',
            icon: '🗡️',
            type: 'melee',
            meleeType: 'single',
            baseDamage: 6,
            attackSpeed: 2.0,
            range: 50,
            cost: 70,
            description: 'Quick stabbing dagger',
            usesAmmo: false,
            tierMultipliers: { damage: [1, 1.2, 1.4, 1.6, 1.8, 2.0], attackSpeed: [1, 1.2, 1.4, 1.6, 1.8, 2.0], range: [1, 1.05, 1.1, 1.15, 1.2, 1.25] }
        },
        {
            id: 'hammer',
            name: 'War Hammer',
            icon: '🔨',
            type: 'melee',
            meleeType: 'aoe',
            baseDamage: 15,
            attackSpeed: 0.5,
            range: 80,
            cost: 130,
            description: 'Massive overhead smash',
            usesAmmo: false,
            tierMultipliers: { damage: [1, 1.5, 2.0, 2.6, 3.3, 4.0], attackSpeed: [1, 1.1, 1.2, 1.3, 1.4, 1.5], range: [1, 1.15, 1.3, 1.45, 1.6, 1.75] }
        },
        {
            id: 'spear',
            name: 'Trident',
            icon: '🔱',
            type: 'melee',
            meleeType: 'pierce',
            baseDamage: 10,
            attackSpeed: 1.0,
            range: 100,
            cost: 110,
            description: 'Three-pronged thrust',
            usesAmmo: false,
            pierceCount: 3,
            tierMultipliers: { damage: [1, 1.3, 1.6, 2.0, 2.5, 3.0], attackSpeed: [1, 1.1, 1.2, 1.3, 1.4, 1.5], pierceCount: [1, 1, 2, 2, 3, 4], range: [1, 1.1, 1.2, 1.3, 1.4, 1.5] }
        }
    ],

    // Items
    ITEMS: [
        { id: 'health_potion', name: 'Health Potion', icon: '❤️', type: 'consumable', cost: 50, description: 'Restore 25% of max health' },
        { id: 'ammo_pack', name: 'Ammo Pack', icon: '📦', type: 'consumable', cost: 40, description: 'Fully reload all ranged weapons' },
        { id: 'rage_potion', name: 'Rage Potion', icon: '🔥', type: 'consumable', cost: 60, description: '+50% damage for 10 seconds' },
        { id: 'bomb', name: 'Bomb', icon: '💣', type: 'consumable', cost: 75, description: 'Large area explosion' },
        { id: 'exp_scroll', name: 'Experience Scroll', icon: '📜✨', type: 'consumable', cost: 500, description: 'Upgrade a random weapon' },
        { id: 'healing_tower', name: 'Healing Tower', icon: '🏥', type: 'tower', category: 'tower', cost: 50, maxPerGame: 3, description: 'Heals 1 HP every 2 seconds' },
        { id: 'landmine', name: 'Landmine', icon: '💥', type: 'tower', category: 'tower', cost: 75, maxPerGame: 5, description: 'Deals 80 damage when triggered' },
        { id: 'damage_orb', name: 'Damage Orb', icon: '💎', type: 'permanent', cost: 100, description: 'Permanently +15% damage' },
        { id: 'speed_boots', name: 'Speed Boots', icon: '👟', type: 'permanent', cost: 80, description: 'Permanently +15% speed' },
        { id: 'health_upgrade', name: 'Health Upgrade', icon: '🛡️', type: 'permanent', cost: 140, description: 'Permanently +25% max health' },
        { id: 'vampire_teeth', name: 'Vampire Teeth', icon: '🦷', type: 'permanent', cost: 320, description: 'Permanently +5% life steal' },
        { id: 'berserker_ring', name: 'Berserker Ring', icon: '💍', type: 'permanent', cost: 250, description: 'Damage increases as health decreases' },
        { id: 'ninja_scroll', name: 'Ninja Scroll', icon: '📜', type: 'permanent', cost: 145, description: '+15% chance to dodge attacks' },
        { id: 'alchemist_stone', name: 'Alchemist Stone', icon: '🪨', type: 'permanent', cost: 150, description: 'Earn 20% more gold' },
        { id: 'thorns_armor', name: 'Thorns Armor', icon: '🌵', type: 'permanent', cost: 120, description: 'Reflect 25% of damage' },
        { id: 'wind_charm', name: 'Wind Charm', icon: '🍃', type: 'permanent', cost: 110, description: '+15% attack speed' },
        { id: 'runic_plate', name: 'Runic Plate', icon: '🔰', type: 'permanent', cost: 260, description: 'First hit each wave deals 50% less' },
        { id: 'guardian_angel', name: 'Guardian Angel', icon: '😇', type: 'permanent', cost: 200, description: 'Survive fatal damage once' },
        { id: 'blood_contract', name: 'Blood Contract', icon: '📜🩸', type: 'permanent', cost: 150, description: '+3% lifesteal per stack, lose 1% HP/sec' }
    ]
};

const TOWER_DATA = {
    landmine: { maxPerGame: 5, damage: 80, radius: 60, triggerRadius: 15, color: '#8B4513' },
    healingTower: { maxPerGame: 3, health: 30, healAmount: 1, healInterval: 2000, radius: 20, color: '#4CAF50' }
};

// Load images when the page loads
window.addEventListener('DOMContentLoaded', () => {
    loadWeaponImages((success) => {
        if (success) {
            console.log('All weapon images loaded successfully!');
        } else {
            console.log('Some weapon images failed to load, using fallback icons');
        }
    });
});

console.log('GAME_DATA loaded with', GAME_DATA.WAVES.length, 'waves');
console.log('Total weapons:', GAME_DATA.WEAPONS.length);
console.log('Total items:', GAME_DATA.ITEMS.length);
