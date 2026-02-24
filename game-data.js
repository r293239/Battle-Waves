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

    // Wave configurations - 30 waves, boss every 10th wave
    WAVES: [
        // Wave 1-9: Regular waves
        { number: 1, monsters: 5, monsterHealth: 20, monsterDamage: 2, goldReward: 50, isBoss: false },
        { number: 2, monsters: 7, monsterHealth: 25, monsterDamage: 3, goldReward: 60, isBoss: false },
        { number: 3, monsters: 9, monsterHealth: 30, monsterDamage: 4, goldReward: 70, isBoss: false },
        { number: 4, monsters: 11, monsterHealth: 35, monsterDamage: 5, goldReward: 80, isBoss: false },
        { number: 5, monsters: 13, monsterHealth: 40, monsterDamage: 6, goldReward: 90, isBoss: false },
        { number: 6, monsters: 15, monsterHealth: 45, monsterDamage: 7, goldReward: 100, isBoss: false },
        { number: 7, monsters: 17, monsterHealth: 50, monsterDamage: 8, goldReward: 110, isBoss: false },
        { number: 8, monsters: 19, monsterHealth: 55, monsterDamage: 9, goldReward: 120, isBoss: false },
        { number: 9, monsters: 21, monsterHealth: 60, monsterDamage: 10, goldReward: 130, isBoss: false },
        
        // Wave 10: First Boss Wave
        { number: 10, monsters: 1, monsterHealth: 3000, monsterDamage: 15, goldReward: 300, isBoss: true },

        // Waves 11-19: Regular waves
        { number: 11, monsters: 30, monsterHealth: 70, monsterDamage: 11, goldReward: 140, isBoss: false },
        { number: 12, monsters: 32, monsterHealth: 75, monsterDamage: 12, goldReward: 150, isBoss: false },
        { number: 13, monsters: 34, monsterHealth: 80, monsterDamage: 13, goldReward: 160, isBoss: false },
        { number: 14, monsters: 36, monsterHealth: 85, monsterDamage: 14, goldReward: 170, isBoss: false },
        { number: 15, monsters: 38, monsterHealth: 90, monsterDamage: 15, goldReward: 180, isBoss: false },
        { number: 16, monsters: 40, monsterHealth: 95, monsterDamage: 16, goldReward: 190, isBoss: false },
        { number: 17, monsters: 42, monsterHealth: 100, monsterDamage: 17, goldReward: 200, isBoss: false },
        { number: 18, monsters: 44, monsterHealth: 110, monsterDamage: 18, goldReward: 210, isBoss: false },
        { number: 19, monsters: 46, monsterHealth: 120, monsterDamage: 19, goldReward: 220, isBoss: false },
        
        // Wave 20: Second Boss Wave
        { number: 20, monsters: 1, monsterHealth: 5000, monsterDamage: 25, goldReward: 500, isBoss: true },

        // Waves 21-29: Regular waves
        { number: 21, monsters: 55, monsterHealth: 130, monsterDamage: 20, goldReward: 240, isBoss: false },
        { number: 22, monsters: 60, monsterHealth: 140, monsterDamage: 21, goldReward: 260, isBoss: false },
        { number: 23, monsters: 65, monsterHealth: 150, monsterDamage: 22, goldReward: 280, isBoss: false },
        { number: 24, monsters: 70, monsterHealth: 160, monsterDamage: 23, goldReward: 300, isBoss: false },
        { number: 25, monsters: 75, monsterHealth: 170, monsterDamage: 24, goldReward: 320, isBoss: false },
        { number: 26, monsters: 80, monsterHealth: 180, monsterDamage: 25, goldReward: 340, isBoss: false },
        { number: 27, monsters: 85, monsterHealth: 200, monsterDamage: 26, goldReward: 360, isBoss: false },
        { number: 28, monsters: 90, monsterHealth: 220, monsterDamage: 27, goldReward: 380, isBoss: false },
        { number: 29, monsters: 95, monsterHealth: 250, monsterDamage: 28, goldReward: 400, isBoss: false },
        
        // Wave 30: Third Boss Wave
        { number: 30, monsters: 1, monsterHealth: 12000, monsterDamage: 40, goldReward: 1000, isBoss: true }
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
            tierMultipliers: {
                damage: [1, 1.2, 1.4, 1.7, 2.1, 2.5],
                attackSpeed: [1, 1.1, 1.2, 1.3, 1.4, 1.5],
                magazine: [1, 1.2, 1.4, 1.6, 1.8, 2.0]
            }
        },
        {
            id: 'shotgun',
            name: 'Shotgun',
            icon: '💥',
            type: 'ranged',
            baseDamage: 3,
            attackSpeed: 0.8,
            range: 200,
            projectileSpeed: 8,
            cost: 80,
            description: '10 pellets in wide arc, 3 damage each',
            projectileColor: '#FF6B6B',
            animation: 'shotgun',
            pelletCount: 10,
            spreadAngle: 60,
            usesAmmo: true,
            magazineSize: 6,
            reloadTime: 2000,
            tierMultipliers: {
                damage: [1, 1.3, 1.6, 2.0, 2.5, 3.0],
                attackSpeed: [1, 1.05, 1.1, 1.15, 1.2, 1.25],
                pelletCount: [1, 1, 1, 1.2, 1.4, 1.6],
                magazine: [1, 1.1, 1.2, 1.3, 1.4, 1.5]
            }
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
            animation: 'bullet',
            usesAmmo: true,
            magazineSize: 30,
            reloadTime: 2500,
            tierMultipliers: {
                damage: [1, 1.1, 1.2, 1.3, 1.4, 1.5],
                attackSpeed: [1, 1.2, 1.4, 1.6, 1.8, 2.0],
                magazine: [1, 1.3, 1.6, 1.9, 2.2, 2.5]
            }
        },
        {
            id: 'laser',
            name: 'Energy Gun',
            icon: '⚡',
            type: 'ranged',
            baseDamage: 8,
            attackSpeed: 2.0,
            range: 350,
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
            tierMultipliers: {
                damage: [1, 1.2, 1.4, 1.7, 2.0, 2.4],
                attackSpeed: [1, 1.1, 1.2, 1.3, 1.4, 1.5],
                bounceCount: [1, 1, 2, 2, 3, 4],
                magazine: [1, 1.2, 1.4, 1.6, 1.8, 2.0]
            }
        },
        {
            id: 'boomerang',
            name: 'Boomerang',
            icon: '🪃',
            type: 'ranged',
            baseDamage: 8,
            attackSpeed: 1.2,
            range: 450,
            projectileSpeed: 10,
            returnSpeed: 15,
            cost: 95,
            description: 'Throws a returning boomerang that hits on both paths',
            projectileColor: '#8B4513',
            animation: 'boomerang',
            usesAmmo: false,
            maxTargets: 4,
            useImage: true,
            imagePath: 'assets/boomerang.png',
            tierMultipliers: {
                damage: [1, 1.3, 1.6, 2.0, 2.4, 2.9],
                attackSpeed: [1, 1.1, 1.2, 1.3, 1.4, 1.5],
                range: [1, 1.1, 1.2, 1.3, 1.4, 1.5],
                maxTargets: [1, 1, 2, 2, 3, 4]
            }
        },
        
        // Melee weapons
        {
            id: 'sword',
            name: 'Iron Sword',
            icon: '⚔️',
            type: 'melee',
            meleeType: 'single',
            baseDamage: 12,
            attackSpeed: 1.2,
            range: 100,
            cost: 60,
            description: 'Swing a longsword in an arc',
            swingColor: '#C0C0C0',
            swingAngle: 90,
            animation: 'swordSwing',
            trailColor: '#FFFFFF',
            sparkleColor: '#FFD700',
            bladeColor: '#C0C0C0',
            hiltColor: '#8B4513',
            usesAmmo: false,
            tierMultipliers: {
                damage: [1, 1.3, 1.6, 2.0, 2.5, 3.0],
                attackSpeed: [1, 1.1, 1.2, 1.3, 1.4, 1.5],
                range: [1, 1.1, 1.2, 1.3, 1.4, 1.5]
            }
        },
        {
            id: 'axe',
            name: 'Battle Axe',
            icon: '🪓',
            type: 'melee',
            meleeType: 'aoe',
            baseDamage: 8,
            attackSpeed: 0.8,
            range: 70,
            cost: 100,
            description: '360° spinning axe with shockwave',
            swingColor: '#8B4513',
            swingAngle: 360,
            animation: 'axeSpin',
            trailColor: '#8B4513',
            bladeColor: '#8B4513',
            edgeColor: '#CD7F32',
            handleColor: '#654321',
            shockwaveColor: '#FFA500',
            shockwaveIntensity: 1.5,
            usesAmmo: false,
            tierMultipliers: {
                damage: [1, 1.4, 1.8, 2.3, 2.9, 3.5],
                attackSpeed: [1, 1.05, 1.1, 1.15, 1.2, 1.25],
                range: [1, 1.1, 1.2, 1.3, 1.4, 1.5],
                shockwaveIntensity: [1, 1.2, 1.4, 1.6, 1.8, 2.0]
            }
        },
        {
            id: 'dagger',
            name: 'Swift Dagger',
            icon: '🗡️',
            type: 'melee',
            meleeType: 'single',
            baseDamage: 8,
            attackSpeed: 2.0,
            range: 50,
            cost: 70,
            description: 'Quick stabbing dagger',
            swingColor: '#4682B4',
            swingAngle: 30,
            animation: 'daggerStab',
            trailColor: '#4682B4',
            bladeColor: '#4682B4',
            hiltColor: '#2F4F4F',
            gripColor: '#8B4513',
            sparkleColor: '#00FFFF',
            usesAmmo: false,
            tierMultipliers: {
                damage: [1, 1.2, 1.4, 1.6, 1.8, 2.0],
                attackSpeed: [1, 1.2, 1.4, 1.6, 1.8, 2.0],
                range: [1, 1.05, 1.1, 1.15, 1.2, 1.25]
            }
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
            swingColor: '#D2691E',
            swingAngle: 360,
            animation: 'hammerSmash',
            trailColor: '#D2691E',
            headColor: '#696969',
            handleColor: '#8B4513',
            shockwaveColor: '#FF4500',
            shockwaveIntensity: 2.0,
            usesAmmo: false,
            tierMultipliers: {
                damage: [1, 1.5, 2.0, 2.6, 3.3, 4.0],
                attackSpeed: [1, 1.1, 1.2, 1.3, 1.4, 1.5],
                range: [1, 1.15, 1.3, 1.45, 1.6, 1.75],
                shockwaveIntensity: [1, 1.3, 1.6, 1.9, 2.2, 2.5]
            }
        },
        {
            id: 'spear',
            name: 'Trident',
            icon: '🔱',
            type: 'melee',
            meleeType: 'pierce',
            baseDamage: 10,
            attackSpeed: 1.0,
            range: 90,
            cost: 110,
            description: 'Three-pronged thrust that pierces',
            swingColor: '#32CD32',
            swingAngle: 0,
            animation: 'spearThrust',
            trailColor: '#32CD32',
            shaftColor: '#8B4513',
            prongColor: '#CD7F32',
            tipColor: '#FFD700',
            pierceCount: 2,
            usesAmmo: false,
            tierMultipliers: {
                damage: [1, 1.3, 1.6, 2.0, 2.5, 3.0],
                attackSpeed: [1, 1.1, 1.2, 1.3, 1.4, 1.5],
                pierceCount: [1, 1, 2, 2, 3, 4],
                range: [1, 1.1, 1.2, 1.3, 1.4, 1.5]
            }
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
        },
        {
            id: 'ammo_pack',
            name: 'Ammo Pack',
            icon: '📦',
            type: 'consumable',
            cost: 30,
            description: 'Fully reload all ranged weapons'
        }
    ]
};

// Verify data is loaded
console.log('GAME_DATA loaded with', GAME_DATA.WAVES.length, 'waves');
