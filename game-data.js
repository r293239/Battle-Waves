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
        { number: 10, monsters: 1, monsterHealth: 2000, monsterDamage: 15, goldReward: 300, isBoss: true },
        { number: 11, monsters: 30, monsterHealth: 70, monsterDamage: 11, goldReward: 140 },
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
        },
        {
            id: 'reload',
            name: 'Quick Hands',
            description: 'Quicker Reload speed',
            icon: '🔄',
            effect: { reloadTime: 0.9 }
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
            meleeType: 'shotgun',
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
        
        // Melee weapons - Enhanced with realistic animations
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
            bladeColor: 'linear-gradient(45deg, #C0C0C0, #E8E8E8)',
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
        },
        
        // ========== NEW RANGED WEAPONS ==========
        {
            id: 'flamethrower',
            name: 'Flamethrower',
            icon: '🔥',
            type: 'ranged',
            baseDamage: 2,
            attackSpeed: 4.0,
            range: 150,
            projectileSpeed: 6,
            cost: 140,
            description: 'Continuous fire that leaves burning ground',
            projectileColor: '#FF4500',
            animation: 'flame',
            usesAmmo: true,
            magazineSize: 40,
            reloadTime: 2000,
            burnDamage: 1,
            burnDuration: 3000,
            burnTickRate: 500,
            groundFireDuration: 2000,
            groundFireRadius: 30,
            tierMultipliers: {
                damage: [1, 1.2, 1.4, 1.7, 2.0, 2.4],
                attackSpeed: [1, 1.1, 1.2, 1.3, 1.4, 1.5],
                magazine: [1, 1.2, 1.4, 1.6, 1.8, 2.0],
                burnDamage: [1, 1.3, 1.6, 2.0, 2.5, 3.0]
            }
        },
        {
            id: 'railgun',
            name: 'Rail Cannon',
            icon: '⚡',
            type: 'ranged',
            baseDamage: 30,
            attackSpeed: 0.3,
            range: 600,
            projectileSpeed: 30,
            cost: 200,
            description: 'Pierces all enemies in a line',
            projectileColor: '#4169E1',
            animation: 'railgun',
            usesAmmo: true,
            magazineSize: 3,
            reloadTime: 3000,
            pierceCount: 999,
            beamWidth: 8,
            chargeTime: 500,
            tierMultipliers: {
                damage: [1, 1.4, 1.9, 2.5, 3.2, 4.0],
                attackSpeed: [1, 1.1, 1.2, 1.3, 1.4, 1.5],
                magazine: [1, 1, 2, 2, 3, 3],
                beamWidth: [1, 1.1, 1.2, 1.3, 1.4, 1.5]
            }
        },
        {
            id: 'boomerang',
            name: 'Boomerang Blade',
            icon: '🪃',
            type: 'ranged',
            baseDamage: 8,
            attackSpeed: 1.5,
            range: 400,
            projectileSpeed: 12,
            cost: 90,
            description: 'Returns to player, can hit twice',
            projectileColor: '#8B4513',
            animation: 'boomerang',
            usesAmmo: false,
            returnDamage: 12,
            arcHeight: 100,
            tierMultipliers: {
                damage: [1, 1.2, 1.5, 1.8, 2.2, 2.7],
                attackSpeed: [1, 1.1, 1.2, 1.3, 1.4, 1.5],
                range: [1, 1.1, 1.2, 1.3, 1.4, 1.5],
                returnDamage: [1, 1.3, 1.6, 2.0, 2.5, 3.0]
            }
        },
        {
            id: 'crossbow',
            name: 'Heavy Crossbow',
            icon: '🏹',
            type: 'ranged',
            baseDamage: 18,
            attackSpeed: 0.6,
            range: 450,
            projectileSpeed: 20,
            cost: 110,
            description: 'Slows enemies on hit',
            projectileColor: '#DAA520',
            animation: 'arrow',
            usesAmmo: true,
            magazineSize: 5,
            reloadTime: 1800,
            slowAmount: 0.4,
            slowDuration: 1500,
            tierMultipliers: {
                damage: [1, 1.3, 1.7, 2.2, 2.8, 3.5],
                attackSpeed: [1, 1.1, 1.2, 1.3, 1.4, 1.5],
                magazine: [1, 1.2, 1.4, 1.6, 1.8, 2.0],
                slowAmount: [1, 1.1, 1.2, 1.3, 1.4, 1.5]
            }
        },
        {
            id: 'grenade_launcher',
            name: 'Grenade Launcher',
            icon: '💣',
            type: 'ranged',
            baseDamage: 15,
            attackSpeed: 0.7,
            range: 350,
            projectileSpeed: 8,
            cost: 160,
            description: 'Explodes on impact, damages area',
            projectileColor: '#556B2F',
            animation: 'grenade',
            usesAmmo: true,
            magazineSize: 4,
            reloadTime: 2200,
            explosionRadius: 80,
            explosionDamage: 20,
            fuseTime: 800,
            tierMultipliers: {
                damage: [1, 1.3, 1.7, 2.2, 2.8, 3.5],
                attackSpeed: [1, 1.1, 1.2, 1.3, 1.4, 1.5],
                magazine: [1, 1, 1.5, 2, 2.5, 3],
                explosionRadius: [1, 1.1, 1.2, 1.3, 1.4, 1.5],
                explosionDamage: [1, 1.3, 1.6, 2.0, 2.5, 3.0]
            }
        },

        // ========== NEW MELEE WEAPONS ==========
        {
            id: 'katana',
            name: 'Dragon Katana',
            icon: '🗡️',
            type: 'melee',
            meleeType: 'single',
            baseDamage: 14,
            attackSpeed: 1.8,
            range: 95,
            cost: 150,
            description: 'Fast slashes that leave fire trails',
            swingColor: '#FF4500',
            swingAngle: 120,
            animation: 'katanaSlash',
            trailColor: '#FF8C00',
            sparkleColor: '#FFD700',
            bladeColor: 'linear-gradient(45deg, #FF4500, #FF8C00)',
            hiltColor: '#DAA520',
            gripColor: '#8B4513',
            fireTrail: true,
            fireDamage: 2,
            fireDuration: 2000,
            usesAmmo: false,
            tierMultipliers: {
                damage: [1, 1.4, 1.8, 2.3, 2.9, 3.6],
                attackSpeed: [1, 1.2, 1.4, 1.6, 1.8, 2.0],
                range: [1, 1.1, 1.2, 1.3, 1.4, 1.5],
                fireDamage: [1, 1.3, 1.6, 2.0, 2.5, 3.0]
            }
        },
        {
            id: 'dual_daggers',
            name: 'Shadow Daggers',
            icon: '🗡️🗡️',
            type: 'melee',
            meleeType: 'dual',
            baseDamage: 6,
            attackSpeed: 3.0,
            range: 45,
            cost: 130,
            description: 'Two rapid strikes per attack',
            swingColor: '#9400D3',
            swingAngle: 20,
            animation: 'dualStab',
            trailColor: '#8A2BE2',
            sparkleColor: '#FF00FF',
            bladeColor: '#9400D3',
            hiltColor: '#4B0082',
            gripColor: '#2F4F4F',
            strikesPerAttack: 2,
            strikeDelay: 50,
            usesAmmo: false,
            tierMultipliers: {
                damage: [1, 1.2, 1.5, 1.9, 2.4, 3.0],
                attackSpeed: [1, 1.2, 1.4, 1.6, 1.8, 2.0],
                range: [1, 1.05, 1.1, 1.15, 1.2, 1.25],
                strikesPerAttack: [1, 1, 2, 2, 3, 3]
            }
        },
        {
            id: 'scythe',
            name: 'Reaper Scythe',
            icon: '🌾',
            type: 'melee',
            meleeType: 'aoe',
            baseDamage: 16,
            attackSpeed: 0.7,
            range: 110,
            cost: 180,
            description: 'Wide sweeping arc that pulls enemies',
            swingColor: '#4A4A4A',
            swingAngle: 180,
            animation: 'scytheSweep',
            trailColor: '#2F4F4F',
            sparkleColor: '#C0C0C0',
            bladeColor: '#2F4F4F',
            handleColor: '#8B4513',
            edgeColor: '#C0C0C0',
            pullStrength: 0.5,
            soulCollect: true,
            usesAmmo: false,
            tierMultipliers: {
                damage: [1, 1.5, 2.0, 2.6, 3.3, 4.0],
                attackSpeed: [1, 1.1, 1.2, 1.3, 1.4, 1.5],
                range: [1, 1.1, 1.2, 1.3, 1.4, 1.5],
                pullStrength: [1, 1.2, 1.4, 1.6, 1.8, 2.0]
            }
        },
        {
            id: 'flail',
            name: 'Morning Star',
            icon: '⛓️',
            type: 'melee',
            meleeType: 'chain',
            baseDamage: 13,
            attackSpeed: 0.9,
            range: 85,
            cost: 140,
            description: 'Spinning chain weapon with stun',
            swingColor: '#B87333',
            swingAngle: 360,
            animation: 'flailSpin',
            trailColor: '#CD7F32',
            sparkleColor: '#FFD700',
            headColor: '#B87333',
            handleColor: '#8B4513',
            chainColor: '#696969',
            stunChance: 0.3,
            stunDuration: 800,
            usesAmmo: false,
            tierMultipliers: {
                damage: [1, 1.3, 1.7, 2.2, 2.8, 3.5],
                attackSpeed: [1, 1.1, 1.2, 1.3, 1.4, 1.5],
                range: [1, 1.1, 1.2, 1.3, 1.4, 1.5],
                stunChance: [1, 1.3, 1.6, 2.0, 2.5, 3.0]
            }
        },
        {
            id: 'tonfa',
            name: 'Defender Tonfa',
            icon: '🛡️',
            type: 'melee',
            meleeType: 'defensive',
            baseDamage: 8,
            attackSpeed: 1.5,
            range: 40,
            cost: 120,
            description: 'Blocks damage while attacking',
            swingColor: '#708090',
            swingAngle: 60,
            animation: 'tonfaBlock',
            trailColor: '#778899',
            sparkleColor: '#FFFFFF',
            bladeColor: '#708090',
            gripColor: '#2F4F4F',
            blockReduction: 0.5,
            counterDamage: 2.0,
            usesAmmo: false,
            tierMultipliers: {
                damage: [1, 1.2, 1.4, 1.7, 2.1, 2.5],
                attackSpeed: [1, 1.1, 1.2, 1.3, 1.4, 1.5],
                range: [1, 1.05, 1.1, 1.15, 1.2, 1.25],
                blockReduction: [1, 1.1, 1.2, 1.3, 1.4, 1.5]
            }
        },

        // ========== MAGIC WEAPONS ==========
        {
            id: 'fire_staff',
            name: 'Fire Staff',
            icon: '🔮',
            type: 'ranged',
            baseDamage: 7,
            attackSpeed: 1.2,
            range: 300,
            projectileSpeed: 12,
            cost: 130,
            description: 'Fireball that explodes',
            projectileColor: '#FF6347',
            animation: 'fireball',
            usesAmmo: false,
            explosionRadius: 60,
            explosionDamage: 10,
            burnDamage: 2,
            burnDuration: 2000,
            tierMultipliers: {
                damage: [1, 1.3, 1.7, 2.2, 2.8, 3.5],
                attackSpeed: [1, 1.1, 1.2, 1.3, 1.4, 1.5],
                explosionRadius: [1, 1.2, 1.4, 1.6, 1.8, 2.0],
                burnDamage: [1, 1.3, 1.6, 2.0, 2.5, 3.0]
            }
        },
        {
            id: 'ice_staff',
            name: 'Ice Staff',
            icon: '❄️',
            type: 'ranged',
            baseDamage: 6,
            attackSpeed: 1.0,
            range: 280,
            projectileSpeed: 14,
            cost: 130,
            description: 'Freezes enemies in place',
            projectileColor: '#87CEEB',
            animation: 'ice',
            usesAmmo: false,
            freezeDuration: 1000,
            freezeChance: 0.7,
            splashRadius: 40,
            tierMultipliers: {
                damage: [1, 1.2, 1.5, 1.9, 2.4, 3.0],
                attackSpeed: [1, 1.1, 1.2, 1.3, 1.4, 1.5],
                freezeDuration: [1, 1.2, 1.4, 1.6, 1.8, 2.0],
                freezeChance: [1, 1.1, 1.2, 1.3, 1.4, 1.5]
            }
        },
        {
            id: 'lightning_staff',
            name: 'Storm Staff',
            icon: '🌩️',
            type: 'ranged',
            baseDamage: 10,
            attackSpeed: 0.9,
            range: 320,
            projectileSpeed: 18,
            cost: 150,
            description: 'Chains lightning between enemies',
            projectileColor: '#FFD700',
            animation: 'lightning',
            usesAmmo: false,
            chainCount: 4,
            chainRange: 80,
            chainDamageFalloff: 0.7,
            stunChance: 0.2,
            stunDuration: 500,
            tierMultipliers: {
                damage: [1, 1.3, 1.7, 2.2, 2.8, 3.5],
                attackSpeed: [1, 1.1, 1.2, 1.3, 1.4, 1.5],
                chainCount: [1, 1, 2, 2, 3, 4],
                chainRange: [1, 1.1, 1.2, 1.3, 1.4, 1.5]
            }
        },
        {
            id: 'poison_staff',
            name: 'Venom Staff',
            icon: '🧪',
            type: 'ranged',
            baseDamage: 5,
            attackSpeed: 1.1,
            range: 260,
            projectileSpeed: 11,
            cost: 140,
            description: 'Poison clouds that spread',
            projectileColor: '#32CD32',
            animation: 'poison',
            usesAmmo: false,
            poisonDamage: 3,
            poisonDuration: 4000,
            poisonTickRate: 500,
            cloudDuration: 3000,
            cloudRadius: 50,
            spreadChance: 0.3,
            tierMultipliers: {
                damage: [1, 1.2, 1.4, 1.7, 2.1, 2.5],
                attackSpeed: [1, 1.1, 1.2, 1.3, 1.4, 1.5],
                poisonDamage: [1, 1.3, 1.7, 2.2, 2.8, 3.5],
                cloudRadius: [1, 1.1, 1.2, 1.3, 1.4, 1.5]
            }
        },
        {
            id: 'arcane_staff',
            name: 'Arcane Staff',
            icon: '✨',
            type: 'ranged',
            baseDamage: 20,
            attackSpeed: 0.5,
            range: 350,
            projectileSpeed: 16,
            cost: 170,
            description: 'Homing projectiles that multiply',
            projectileColor: '#9370DB',
            animation: 'arcane',
            usesAmmo: false,
            homingStrength: 0.8,
            splitCount: 2,
            splitDamageMultiplier: 0.5,
            extraProjectileChance: 0.3,
            tierMultipliers: {
                damage: [1, 1.4, 1.9, 2.5, 3.2, 4.0],
                attackSpeed: [1, 1.1, 1.2, 1.3, 1.4, 1.5],
                splitCount: [1, 1, 2, 2, 3, 3],
                homingStrength: [1, 1.1, 1.2, 1.3, 1.4, 1.5]
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
        },
        
        // ========== NEW ITEMS ==========
        {
            id: 'vampire_teeth',
            name: 'Vampire Fangs',
            icon: '🧛',
            type: 'permanent',
            cost: 150,
            description: 'Gain 5% lifesteal'
        },
        {
            id: 'berserker_ring',
            name: 'Berserker Ring',
            icon: '💍',
            type: 'permanent',
            cost: 180,
            description: '+10% damage for each 10% missing health'
        },
        {
            id: 'ninja_scroll',
            name: 'Ninja Scroll',
            icon: '📜',
            type: 'permanent',
            cost: 140,
            description: '+15% dodge chance'
        },
        {
            id: 'alchemist_stone',
            name: 'Alchemist Stone',
            icon: '💎',
            type: 'permanent',
            cost: 200,
            description: 'Permanent +20% gold find and +20% item value'
        },
        {
            id: 'thorns_armor',
            name: 'Thorned Carapace',
            icon: '🌵',
            type: 'permanent',
            cost: 160,
            description: 'Reflect 25% of damage taken back to attackers'
        },
        {
            id: 'wind_charm',
            name: 'Wind Charm',
            icon: '🍃',
            type: 'permanent',
            cost: 120,
            description: '+15% attack speed for all weapons'
        },
        {
            id: 'runic_plate',
            name: 'Runic Plating',
            icon: '🔰',
            type: 'permanent',
            cost: 190,
            description: 'First hit of each wave deals 50% less damage'
        },
        {
            id: 'explosive_trap',
            name: 'Explosive Trap',
            icon: '💥',
            type: 'consumable',
            cost: 70,
            description: 'Place a trap that explodes for 100 damage'
        },
        {
            id: 'healing_fountain',
            name: 'Healing Totem',
            icon: '🏺',
            type: 'permanent',
            cost: 180,
            description: 'Regenerate 2 HP every second'
        },
        {
            id: 'sharpening_stone',
            name: 'Sharpening Stone',
            icon: '🪨',
            type: 'consumable',
            cost: 60,
            description: 'Increases melee weapon damage by 50% for 1 wave'
        },
        {
            id: 'enchanters_ink',
            name: 'Enchanter\'s Ink',
            icon: '🖋️',
            type: 'consumable',
            cost: 80,
            description: 'Adds random elemental effect to a weapon for 2 waves'
        },
        {
            id: 'void_crystal',
            name: 'Void Crystal',
            icon: '🟣',
            type: 'permanent',
            cost: 250,
            description: '10% chance on kill to spawn a void zone that damages enemies'
        },
        {
            id: 'guardian_angel',
            name: 'Guardian Angel',
            icon: '👼',
            type: 'permanent',
            cost: 300,
            description: 'Once per game, prevent death and restore 50% HP'
        },
        {
            id: 'dice_of_fate',
            name: 'Dice of Fate',
            icon: '🎲',
            type: 'consumable',
            cost: 50,
            description: 'Random effect: double damage, full heal, or 100 bonus gold'
        },
        {
            id: 'blood_contract',
            name: 'Blood Contract',
            icon: '📝',
            type: 'permanent',
            cost: 150,
            description: '+30% damage but lose 1 HP every 5 seconds'
        }
    ]
};

// ============================================
// MONSTER TYPES
// ============================================

const MONSTER_TYPES = {
    NORMAL: {
        name: 'Normal',
        color: '#ff6b6b',
        speed: 1,
        healthMultiplier: 1,
        damageMultiplier: 1,
        sizeMultiplier: 1,
        icon: '👾'
    },
    FAST: {
        name: 'Fast',
        color: '#4ecdc4',
        speed: 2.5,
        healthMultiplier: 0.7,
        damageMultiplier: 0.8,
        sizeMultiplier: 0.8,
        icon: '⚡'
    },
    TANK: {
        name: 'Tank',
        color: '#ffa500',
        speed: 0.5,
        healthMultiplier: 2.5,
        damageMultiplier: 1.2,
        sizeMultiplier: 1.4,
        icon: '🛡️'
    },
    EXPLOSIVE: {
        name: 'Explosive',
        color: '#ff0000',
        speed: 1,
        healthMultiplier: 0.8,
        damageMultiplier: 1.5,
        sizeMultiplier: 1,
        icon: '💥',
        explosive: true
    },
    BOSS: {
        name: 'BOSS',
        color: '#ffd700',
        speed: 2,
        healthMultiplier: 10,
        damageMultiplier: 2,
        sizeMultiplier: 2.5,
        icon: '👑',
        isBoss: true
    },
    
    // ========== NEW MONSTER TYPES ==========
    TELEPORTER: {
        name: 'Teleporter',
        color: '#8A2BE2',
        speed: 1,
        healthMultiplier: 0.9,
        damageMultiplier: 0.8,
        sizeMultiplier: 0.9,
        icon: '🌀',
        teleportChance: 0.3,
        teleportCooldown: 3000,
        teleportRange: 200
    },
    HEALER: {
        name: 'Healer',
        color: '#98FB98',
        speed: 0.6,
        healthMultiplier: 1.2,
        damageMultiplier: 0.5,
        sizeMultiplier: 1,
        icon: '💚',
        healRadius: 150,
        healAmount: 5,
        healCooldown: 2000
    },
    SPITTER: {
        name: 'Spitter',
        color: '#32CD32',
        speed: 0.8,
        healthMultiplier: 0.7,
        damageMultiplier: 1.3,
        sizeMultiplier: 0.9,
        icon: '🤮',
        ranged: true,
        projectileDamage: 8,
        projectileSpeed: 6,
        attackRange: 200,
        projectileColor: '#32CD32'
    },
    SHIELDED: {
        name: 'Shielded',
        color: '#C0C0C0',
        speed: 0.4,
        healthMultiplier: 1.5,
        damageMultiplier: 1,
        sizeMultiplier: 1.2,
        icon: '🛡️',
        shieldHealth: 30,
        shieldRecharge: 5000,
        damageReduction: 0.7
    },
    MIMIC: {
        name: 'Mimic',
        color: '#8B4513',
        speed: 0.7,
        healthMultiplier: 1.3,
        damageMultiplier: 1.2,
        sizeMultiplier: 1,
        icon: '📦',
        dropsGold: true,
        goldAmount: 50,
        disguiseChance: 0.5
    },
    PHANTOM: {
        name: 'Phantom',
        color: '#9370DB',
        speed: 1.2,
        healthMultiplier: 0.6,
        damageMultiplier: 1.1,
        sizeMultiplier: 0.8,
        icon: '👻',
        phaseChance: 0.5,
        intangible: true,
        intangibilityDuration: 2000
    },
    FROST: {
        name: 'Frost',
        color: '#87CEEB',
        speed: 0.9,
        healthMultiplier: 1.1,
        damageMultiplier: 0.9,
        sizeMultiplier: 1,
        icon: '❄️',
        slowAura: true,
        slowRadius: 100,
        slowAmount: 0.3
    },
    VAMPIRE: {
        name: 'Vampire',
        color: '#8B0000',
        speed: 1.1,
        healthMultiplier: 1.2,
        damageMultiplier: 1.2,
        sizeMultiplier: 1,
        icon: '🧛',
        lifeSteal: 0.2,
        summonChance: 0.1,
        summonType: 'NORMAL'
    },
    GOLEM: {
        name: 'Golem',
        color: '#808080',
        speed: 0.3,
        healthMultiplier: 3.0,
        damageMultiplier: 1.5,
        sizeMultiplier: 1.8,
        icon: '🗿',
        armor: 0.5,
        smashAttack: true,
        smashRadius: 80,
        smashDamage: 2.0
    }
};

// ============================================
// WEAPON INSTANCE CLASS
// ============================================

class WeaponInstance {
    constructor(weaponData, tier = 1) {
        this.id = weaponData.id;
        this.name = weaponData.name;
        this.icon = weaponData.icon;
        this.type = weaponData.type;
        this.meleeType = weaponData.meleeType || 'single';
        this.tier = tier;
        this.baseDamage = weaponData.baseDamage;
        this.attackSpeed = weaponData.attackSpeed;
        this.range = weaponData.range;
        this.description = weaponData.description;
        this.cost = weaponData.cost || 0;
        this.lastAttack = 0;
        this.animation = weaponData.animation || 'default';
        
        // Track last attack time for stagger
        this.lastAttackTime = 0;
        
        // Ammo system
        this.usesAmmo = weaponData.usesAmmo || false;
        if (this.usesAmmo) {
            this.magazineSize = weaponData.magazineSize;
            this.currentAmmo = this.magazineSize;
            this.reloadTime = weaponData.reloadTime;
            this.isReloading = false;
            this.reloadStart = 0;
        }
        
        // Shotgun specific properties
        this.pelletCount = weaponData.pelletCount || 1;
        this.spreadAngle = weaponData.spreadAngle || 0;
        
        // Energy gun bounce properties
        this.bounceCount = weaponData.bounceCount || 0;
        this.bounceRange = weaponData.bounceRange || 0;
        
        // Melee properties
        this.pierceCount = weaponData.pierceCount || 1;
        
        // Weapon appearance properties
        this.bladeColor = weaponData.bladeColor || weaponData.swingColor;
        this.hiltColor = weaponData.hiltColor || '#8B4513';
        this.handleColor = weaponData.handleColor || '#654321';
        this.headColor = weaponData.headColor || '#696969';
        this.edgeColor = weaponData.edgeColor || '#CD7F32';
        this.shaftColor = weaponData.shaftColor || '#8B4513';
        this.prongColor = weaponData.prongColor || '#CD7F32';
        this.tipColor = weaponData.tipColor || '#FFD700';
        this.gripColor = weaponData.gripColor || '#8B4513';
        
        // New weapon properties
        this.burnDamage = weaponData.burnDamage || 0;
        this.burnDuration = weaponData.burnDuration || 0;
        this.burnTickRate = weaponData.burnTickRate || 500;
        this.groundFireDuration = weaponData.groundFireDuration || 0;
        this.groundFireRadius = weaponData.groundFireRadius || 0;
        this.beamWidth = weaponData.beamWidth || 0;
        this.chargeTime = weaponData.chargeTime || 0;
        this.returnDamage = weaponData.returnDamage || 0;
        this.arcHeight = weaponData.arcHeight || 0;
        this.slowAmount = weaponData.slowAmount || 0;
        this.slowDuration = weaponData.slowDuration || 0;
        this.explosionRadius = weaponData.explosionRadius || 0;
        this.explosionDamage = weaponData.explosionDamage || 0;
        this.fuseTime = weaponData.fuseTime || 0;
        this.fireTrail = weaponData.fireTrail || false;
        this.fireDamage = weaponData.fireDamage || 0;
        this.fireDuration = weaponData.fireDuration || 0;
        this.strikesPerAttack = weaponData.strikesPerAttack || 1;
        this.strikeDelay = weaponData.strikeDelay || 0;
        this.pullStrength = weaponData.pullStrength || 0;
        this.soulCollect = weaponData.soulCollect || false;
        this.stunChance = weaponData.stunChance || 0;
        this.stunDuration = weaponData.stunDuration || 0;
        this.blockReduction = weaponData.blockReduction || 0;
        this.counterDamage = weaponData.counterDamage || 0;
        this.freezeDuration = weaponData.freezeDuration || 0;
        this.freezeChance = weaponData.freezeChance || 0;
        this.splashRadius = weaponData.splashRadius || 0;
        this.chainCount = weaponData.chainCount || 0;
        this.chainRange = weaponData.chainRange || 0;
        this.chainDamageFalloff = weaponData.chainDamageFalloff || 1;
        this.poisonDamage = weaponData.poisonDamage || 0;
        this.poisonDuration = weaponData.poisonDuration || 0;
        this.poisonTickRate = weaponData.poisonTickRate || 500;
        this.cloudDuration = weaponData.cloudDuration || 0;
        this.cloudRadius = weaponData.cloudRadius || 0;
        this.spreadChance = weaponData.spreadChance || 0;
        this.homingStrength = weaponData.homingStrength || 0;
        this.splitCount = weaponData.splitCount || 0;
        this.splitDamageMultiplier = weaponData.splitDamageMultiplier || 1;
        this.extraProjectileChance = weaponData.extraProjectileChance || 0;
        
        if (this.type === 'ranged') {
            this.projectileSpeed = weaponData.projectileSpeed;
            this.projectileColor = weaponData.projectileColor;
        } else {
            this.swingColor = weaponData.swingColor;
            this.swingAngle = weaponData.swingAngle || 90;
            this.trailColor = weaponData.trailColor || '#FFFFFF';
            this.sparkleColor = weaponData.sparkleColor || '#FFD700';
            this.shockwaveColor = weaponData.shockwaveColor || '#FFA500';
            this.shockwaveIntensity = weaponData.shockwaveIntensity || 1;
        }
        
        // Tier multipliers
        this.tierMultipliers = weaponData.tierMultipliers || {};
        
        // Apply tier bonuses
        this.applyTierBonuses();
    }

    applyTierBonuses() {
        if (this.tier > 1 && this.tierMultipliers) {
            if (this.tierMultipliers.damage) {
                this.baseDamage = Math.round(this.baseDamage * this.tierMultipliers.damage[this.tier]);
            }
            
            if (this.tierMultipliers.attackSpeed) {
                this.attackSpeed = this.attackSpeed * this.tierMultipliers.attackSpeed[this.tier];
            }
            
            if (this.tierMultipliers.range) {
                this.range = Math.round(this.range * this.tierMultipliers.range[this.tier]);
            }
            
            if (this.usesAmmo && this.tierMultipliers.magazine) {
                this.magazineSize = Math.round(this.magazineSize * this.tierMultipliers.magazine[this.tier]);
                this.currentAmmo = this.magazineSize;
            }
            
            if (this.pelletCount && this.tierMultipliers.pelletCount) {
                this.pelletCount = Math.round(this.pelletCount * this.tierMultipliers.pelletCount[this.tier]);
            }
            
            if (this.bounceCount && this.tierMultipliers.bounceCount) {
                this.bounceCount = Math.round(this.bounceCount * this.tierMultipliers.bounceCount[this.tier]);
            }
            
            if (this.pierceCount && this.tierMultipliers.pierceCount) {
                this.pierceCount = Math.round(this.pierceCount * this.tierMultipliers.pierceCount[this.tier]);
            }
            
            if (this.shockwaveIntensity && this.tierMultipliers.shockwaveIntensity) {
                this.shockwaveIntensity = this.shockwaveIntensity * this.tierMultipliers.shockwaveIntensity[this.tier];
            }
            
            // New tier multipliers
            if (this.burnDamage && this.tierMultipliers.burnDamage) {
                this.burnDamage = Math.round(this.burnDamage * this.tierMultipliers.burnDamage[this.tier]);
            }
            
            if (this.beamWidth && this.tierMultipliers.beamWidth) {
                this.beamWidth = Math.round(this.beamWidth * this.tierMultipliers.beamWidth[this.tier]);
            }
            
            if (this.returnDamage && this.tierMultipliers.returnDamage) {
                this.returnDamage = Math.round(this.returnDamage * this.tierMultipliers.returnDamage[this.tier]);
            }
            
            if (this.slowAmount && this.tierMultipliers.slowAmount) {
                this.slowAmount = Math.min(0.8, this.slowAmount * this.tierMultipliers.slowAmount[this.tier]);
            }
            
            if (this.explosionRadius && this.tierMultipliers.explosionRadius) {
                this.explosionRadius = Math.round(this.explosionRadius * this.tierMultipliers.explosionRadius[this.tier]);
            }
            
            if (this.explosionDamage && this.tierMultipliers.explosionDamage) {
                this.explosionDamage = Math.round(this.explosionDamage * this.tierMultipliers.explosionDamage[this.tier]);
            }
            
            if (this.fireDamage && this.tierMultipliers.fireDamage) {
                this.fireDamage = Math.round(this.fireDamage * this.tierMultipliers.fireDamage[this.tier]);
            }
            
            if (this.strikesPerAttack && this.tierMultipliers.strikesPerAttack) {
                this.strikesPerAttack = Math.round(this.strikesPerAttack * this.tierMultipliers.strikesPerAttack[this.tier]);
            }
            
            if (this.pullStrength && this.tierMultipliers.pullStrength) {
                this.pullStrength = Math.min(1, this.pullStrength * this.tierMultipliers.pullStrength[this.tier]);
            }
            
            if (this.stunChance && this.tierMultipliers.stunChance) {
                this.stunChance = Math.min(1, this.stunChance * this.tierMultipliers.stunChance[this.tier]);
            }
            
            if (this.blockReduction && this.tierMultipliers.blockReduction) {
                this.blockReduction = Math.min(0.8, this.blockReduction * this.tierMultipliers.blockReduction[this.tier]);
            }
            
            if (this.freezeDuration && this.tierMultipliers.freezeDuration) {
                this.freezeDuration = Math.round(this.freezeDuration * this.tierMultipliers.freezeDuration[this.tier]);
            }
            
            if (this.freezeChance && this.tierMultipliers.freezeChance) {
                this.freezeChance = Math.min(1, this.freezeChance * this.tierMultipliers.freezeChance[this.tier]);
            }
            
            if (this.chainCount && this.tierMultipliers.chainCount) {
                this.chainCount = Math.round(this.chainCount * this.tierMultipliers.chainCount[this.tier]);
            }
            
            if (this.chainRange && this.tierMultipliers.chainRange) {
                this.chainRange = Math.round(this.chainRange * this.tierMultipliers.chainRange[this.tier]);
            }
            
            if (this.poisonDamage && this.tierMultipliers.poisonDamage) {
                this.poisonDamage = Math.round(this.poisonDamage * this.tierMultipliers.poisonDamage[this.tier]);
            }
            
            if (this.cloudRadius && this.tierMultipliers.cloudRadius) {
                this.cloudRadius = Math.round(this.cloudRadius * this.tierMultipliers.cloudRadius[this.tier]);
            }
            
            if (this.homingStrength && this.tierMultipliers.homingStrength) {
                this.homingStrength = Math.min(1, this.homingStrength * this.tierMultipliers.homingStrength[this.tier]);
            }
            
            if (this.splitCount && this.tierMultipliers.splitCount) {
                this.splitCount = Math.round(this.splitCount * this.tierMultipliers.splitCount[this.tier]);
            }
        }
    }

    canAttack(currentTime) {
        if (this.isReloading) {
            return false;
        }
        
        if (this.usesAmmo && this.currentAmmo <= 0) {
            this.startReload();
            return false;
        }
        
        // Add 5ms stagger to prevent same weapon attacks from overlapping
        if (this.lastAttackTime > 0 && currentTime - this.lastAttackTime < 5) {
            return false;
        }
        
        const timeSinceLastAttack = currentTime - this.lastAttack;
        const attackCooldown = 1000 / this.attackSpeed;
        
        return timeSinceLastAttack >= attackCooldown;
    }

    startReload() {
        if (!this.usesAmmo || this.isReloading || this.currentAmmo === this.magazineSize) {
            return;
        }
        
        this.isReloading = true;
        this.reloadStart = Date.now();
        
        if (typeof showReloadIndicator === 'function') {
            showReloadIndicator(this.name);
        }
        
        setTimeout(() => {
            this.currentAmmo = this.magazineSize;
            this.isReloading = false;
        }, this.reloadTime);
    }

    useAmmo() {
        if (!this.usesAmmo) return;
        
        this.currentAmmo--;
        if (this.currentAmmo <= 0) {
            this.startReload();
        }
    }

    attack(playerX, playerY, targetX, targetY) {
        const currentTime = Date.now();
        
        if (this.usesAmmo && !this.isReloading) {
            this.useAmmo();
        }
        
        this.lastAttack = currentTime;
        this.lastAttackTime = currentTime;
        
        if (this.type === 'ranged') {
            if (this.id === 'shotgun') {
                const attacks = [];
                const mainAngle = Math.atan2(targetY - playerY, targetX - playerX);
                
                for (let i = 0; i < this.pelletCount; i++) {
                    const spread = (Math.random() - 0.5) * (this.spreadAngle * Math.PI / 180);
                    const angle = mainAngle + spread;
                    
                    attacks.push({
                        type: 'ranged',
                        x: playerX,
                        y: playerY,
                        angle: angle,
                        speed: this.projectileSpeed,
                        range: this.range,
                        damage: this.baseDamage,
                        color: this.projectileColor,
                        weaponId: this.id,
                        animation: this.animation,
                        isPellet: true
                    });
                }
                return attacks;
            } else {
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
                    animation: this.animation,
                    bounceCount: this.bounceCount,
                    bounceRange: this.bounceRange,
                    targetsHit: [],
                    
                    // New weapon properties
                    burnDamage: this.burnDamage,
                    burnDuration: this.burnDuration,
                    groundFireDuration: this.groundFireDuration,
                    groundFireRadius: this.groundFireRadius,
                    beamWidth: this.beamWidth,
                    returnDamage: this.returnDamage,
                    arcHeight: this.arcHeight,
                    slowAmount: this.slowAmount,
                    slowDuration: this.slowDuration,
                    explosionRadius: this.explosionRadius,
                    explosionDamage: this.explosionDamage,
                    fuseTime: this.fuseTime,
                    freezeDuration: this.freezeDuration,
                    freezeChance: this.freezeChance,
                    splashRadius: this.splashRadius,
                    chainCount: this.chainCount,
                    chainRange: this.chainRange,
                    chainDamageFalloff: this.chainDamageFalloff,
                    poisonDamage: this.poisonDamage,
                    poisonDuration: this.poisonDuration,
                    cloudDuration: this.cloudDuration,
                    cloudRadius: this.cloudRadius,
                    spreadChance: this.spreadChance,
                    homingStrength: this.homingStrength,
                    splitCount: this.splitCount,
                    splitDamageMultiplier: this.splitDamageMultiplier,
                    extraProjectileChance: this.extraProjectileChance
                };
            }
        } else {
            const angle = Math.atan2(targetY - playerY, targetX - playerX);
            return {
                type: 'melee',
                x: playerX,
                y: playerY,
                radius: this.range,
                damage: this.baseDamage,
                color: this.swingColor,
                startTime: Date.now(),
                duration: 300,
                swingAngle: this.swingAngle,
                meleeType: this.meleeType,
                angle: angle,
                pierceCount: this.pierceCount,
                weaponId: this.id,
                animation: this.animation,
                trailColor: this.trailColor,
                sparkleColor: this.sparkleColor,
                shockwaveColor: this.shockwaveColor,
                shockwaveIntensity: this.shockwaveIntensity,
                tier: this.tier,
                
                // Weapon appearance properties
                bladeColor: this.bladeColor,
                hiltColor: this.hiltColor,
                handleColor: this.handleColor,
                headColor: this.headColor,
                edgeColor: this.edgeColor,
                shaftColor: this.shaftColor,
                prongColor: this.prongColor,
                tipColor: this.tipColor,
                gripColor: this.gripColor,
                
                // New melee properties
                fireTrail: this.fireTrail,
                fireDamage: this.fireDamage,
                fireDuration: this.fireDuration,
                strikesPerAttack: this.strikesPerAttack,
                strikeDelay: this.strikeDelay,
                pullStrength: this.pullStrength,
                soulCollect: this.soulCollect,
                stunChance: this.stunChance,
                stunDuration: this.stunDuration,
                blockReduction: this.blockReduction,
                counterDamage: this.counterDamage
            };
        }
    }
    
    getScrapValue() {
        const baseValue = Math.floor(this.cost * 0.5);
        const tierMultiplier = 1 + (this.tier - 1) * 0.5;
        return Math.floor(baseValue * tierMultiplier);
    }
    
    getTypeDescription() {
        if (this.type === 'ranged') {
            if (this.id === 'shotgun') return 'SHOTGUN';
            if (this.id === 'laser') return 'ENERGY';
            if (this.id === 'flamethrower') return 'FIRE';
            if (this.id === 'railgun') return 'RAIL';
            if (this.id === 'boomerang') return 'RETURN';
            if (this.id === 'crossbow') return 'SNIPER';
            if (this.id === 'grenade_launcher') return 'EXPLOSIVE';
            if (this.id.includes('staff')) {
                if (this.id.includes('fire')) return 'FIRE';
                if (this.id.includes('ice')) return 'ICE';
                if (this.id.includes('lightning')) return 'LIGHTNING';
                if (this.id.includes('poison')) return 'POISON';
                if (this.id.includes('arcane')) return 'ARCANE';
            }
            return 'RANGED';
        }
        if (this.meleeType === 'single') return 'SINGLE';
        if (this.meleeType === 'aoe') return 'AOE 360°';
        if (this.meleeType === 'pierce') return 'PIERCE';
        if (this.meleeType === 'dual') return 'DUAL';
        if (this.meleeType === 'chain') return 'CHAIN';
        if (this.meleeType === 'defensive') return 'DEFENSIVE';
        return 'MELEE';
    }
    
    getDisplayName() {
        if (this.tier === 1) return this.name;
        
        const tierNames = ['', 'II', 'III', 'IV', 'V', 'VI'];
        return `${this.name} ${tierNames[this.tier]}`;
    }
    
    getMergeCost(otherWeapon) {
        if (this.id !== otherWeapon.id || this.tier !== otherWeapon.tier) {
            return 0;
        }
        
        if (this.tier >= 5) {
            return 0;
        }
        
        return Math.floor(this.cost * 0.3 * this.tier);
    }
    
    merge(otherWeapon) {
        if (this.id !== otherWeapon.id || this.tier !== otherWeapon.tier) {
            return null;
        }
        
        if (this.tier >= 5) {
            return null;
        }
        
        const baseWeaponData = getWeaponById(this.id);
        const mergedWeapon = new WeaponInstance(baseWeaponData, this.tier + 1);
        
        return mergedWeapon;
    }
}

// Helper function to get weapon by ID
function getWeaponById(id) {
    return GAME_DATA.WEAPONS.find(w => w.id === id);
}

// ============================================
// GAME LOGIC
// ============================================

// Game State
let gameState = 'start';
let wave = 1;
let gold = GAME_DATA.PLAYER_START.gold;
let kills = 0;
let shopItems = [];
let spawnIndicators = [];
let selectedWeaponIndex = -1;
let visualEffects = [];
let mergeTargetIndex = -1;
let lastFrameTime = Date.now();
let refreshCount = 0;
let refreshCost = 5;

// Game Objects
const player = {
    x: 400,
    y: 300,
    radius: 20,
    health: GAME_DATA.PLAYER_START.health,
    maxHealth: GAME_DATA.PLAYER_START.maxHealth,
    baseDamage: GAME_DATA.PLAYER_START.damage,
    speed: GAME_DATA.PLAYER_START.speed,
    color: '#ff6b6b',
    
    lifeSteal: 0,
    criticalChance: 0,
    goldMultiplier: 0,
    healthRegen: 0,
    damageReduction: 0,
    lastRegen: 0,
    
    weapons: [],
    projectiles: [],
    meleeAttacks: [],
    
    ammoPack: false
};

let monsters = [];
let mouseX = 400;
let mouseY = 300;

// DOM Elements
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const waveDisplay = document.getElementById('waveDisplay');
const monsterCount = document.getElementById('monsterCount');
const startScreen = document.getElementById('startScreen');
const waveCompleteOverlay = document.getElementById('waveCompleteOverlay');
const gameOverOverlay = document.getElementById('gameOverOverlay');
const gameOverText = document.getElementById('gameOverText');
const statBuffs = document.getElementById('statBuffs');
const weaponsGrid = document.getElementById('weaponsGrid');
const shopItemsContainer = document.getElementById('shopItems');
const startGameBtn = document.getElementById('startGameBtn');
const restartBtn = document.getElementById('restartBtn');
const nextWaveBtn = document.getElementById('nextWaveBtn');
const scrapWeaponBtn = document.getElementById('scrapWeaponBtn');
const mergeWeaponBtn = document.getElementById('mergeWeaponBtn');
const mergeInfo = document.getElementById('mergeInfo');
const reloadIndicator = document.getElementById('reloadIndicator');
const refreshShopBtn = document.getElementById('refreshShopBtn');
const refreshCostSpan = document.getElementById('refreshCost');
const refreshCounter = document.getElementById('refreshCounter');

// UI Elements
const healthValue = document.getElementById('healthValue');
const damageValue = document.getElementById('damageValue');
const speedValue = document.getElementById('speedValue');
const goldValue = document.getElementById('goldValue');
const waveValue = document.getElementById('waveValue');
const killsValue = document.getElementById('killsValue');
const healthFill = document.getElementById('healthFill');

// ============================================
// HELPER FUNCTIONS
// ============================================

function getWeaponById(id) {
    return GAME_DATA.WEAPONS.find(w => w.id === id);
}

function getWaveConfig(waveNumber) {
    if (waveNumber <= GAME_DATA.WAVES.length) {
        return GAME_DATA.WAVES[waveNumber - 1];
    } else {
        const baseWave = GAME_DATA.WAVES[GAME_DATA.WAVES.length - 1];
        const scaleFactor = 1 + (waveNumber - 10) * 0.2;
        return {
            number: waveNumber,
            monsters: Math.floor(baseWave.monsters * scaleFactor),
            monsterHealth: Math.floor(baseWave.monsterHealth * scaleFactor),
            monsterDamage: Math.floor(baseWave.monsterDamage * scaleFactor),
            goldReward: Math.floor(baseWave.goldReward * scaleFactor),
            isBoss: false
        };
    }
}

function generateShopItems() {
    const shopItems = [];
    
    const availableWeapons = GAME_DATA.WEAPONS.filter(w => w.id !== 'handgun');
    const availableItems = [...GAME_DATA.ITEMS];
    
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
    
    return shopItems.sort(() => Math.random() - 0.5);
}

function refreshShop() {
    if (gold < refreshCost) {
        showMessage(`Not enough gold! Need ${refreshCost}g`);
        return;
    }
    
    gold -= refreshCost;
    refreshCount++;
    refreshCost = 5 + (refreshCount * 2);
    refreshCostSpan.textContent = `${refreshCost}g`;
    refreshCounter.textContent = `Refreshes: ${refreshCount}`;
    
    shopItems = generateShopItems();
    updateShopDisplay();
    updateUI();
    
    showMessage(`Shop refreshed! Cost increased to ${refreshCost}g`);
}

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

// ============================================
// INITIALIZATION
// ============================================

function initGame() {
    Object.assign(player, {
        x: 400,
        y: 300,
        radius: 20,
        health: GAME_DATA.PLAYER_START.health,
        maxHealth: GAME_DATA.PLAYER_START.maxHealth,
        baseDamage: GAME_DATA.PLAYER_START.damage,
        speed: GAME_DATA.PLAYER_START.speed,
        color: '#ff6b6b',
        lifeSteal: 0,
        criticalChance: 0,
        goldMultiplier: 0,
        healthRegen: 0,
        damageReduction: 0,
        lastRegen: Date.now(),
        weapons: [],
        projectiles: [],
        meleeAttacks: [],
        ammoPack: false
    });
    
    const handgun = getWeaponById('handgun');
    player.weapons.push(new WeaponInstance(handgun));
    
    wave = 1;
    gold = GAME_DATA.PLAYER_START.gold;
    kills = 0;
    gameState = 'wave';
    selectedWeaponIndex = -1;
    mergeTargetIndex = -1;
    visualEffects = [];
    refreshCount = 0;
    refreshCost = 5;
    refreshCostSpan.textContent = '5g';
    refreshCounter.textContent = 'Refreshes: 0';
    
    monsters = [];
    player.projectiles = [];
    player.meleeAttacks = [];
    spawnIndicators = [];
    
    shopItems = generateShopItems();
    
    startScreen.style.display = 'none';
    waveCompleteOverlay.style.display = 'none';
    gameOverOverlay.style.display = 'none';
    scrapWeaponBtn.style.display = 'none';
    mergeWeaponBtn.style.display = 'none';
    mergeInfo.style.display = 'none';
    reloadIndicator.style.display = 'none';
    
    startWave();
    
    updateUI();
    updateWeaponDisplay();
    updateShopDisplay();
}

// ============================================
// WAVE MANAGEMENT
// ============================================

function showSpawnIndicators() {
    const waveConfig = getWaveConfig(wave);
    spawnIndicators = [];
    
    let monsterCount = waveConfig.monsters;
    if (waveConfig.isBoss) {
        monsterCount = 1;
    }
    
    for (let i = 0; i < monsterCount; i++) {
        const side = Math.floor(Math.random() * 4);
        let x, y;
        
        switch(side) {
            case 0: x = -50; y = Math.random() * canvas.height; break;
            case 1: x = canvas.width + 50; y = Math.random() * canvas.height; break;
            case 2: x = Math.random() * canvas.width; y = -50; break;
            case 3: x = Math.random() * canvas.width; y = canvas.height + 50; break;
        }
        
        spawnIndicators.push({
            x, y,
            timer: 2000,
            startTime: Date.now(),
            isBoss: waveConfig.isBoss
        });
    }
}

function startWave() {
    gameState = 'wave';
    const waveConfig = getWaveConfig(wave);
    waveDisplay.textContent = `Wave ${wave}`;
    waveDisplay.classList.remove('boss-wave');
    
    if (waveConfig.isBoss) {
        waveDisplay.textContent = `BOSS WAVE ${wave} - GIANT MONSTER!`;
        waveDisplay.classList.add('boss-wave');
    }
    
    waveDisplay.style.opacity = 1;
    
    monsters = [];
    player.projectiles = [];
    player.meleeAttacks = [];
    visualEffects = [];
    
    scrapWeaponBtn.style.display = 'none';
    mergeWeaponBtn.style.display = 'none';
    selectedWeaponIndex = -1;
    mergeTargetIndex = -1;
    
    showSpawnIndicators();
    
    setTimeout(() => {
        for (let i = 0; i < (waveConfig.isBoss ? 1 : waveConfig.monsters); i++) {
            spawnMonster();
        }
        spawnIndicators = [];
    }, 2000);
    
    setTimeout(() => {
        waveDisplay.style.opacity = 0.5;
    }, 2000);
}

function spawnMonster() {
    const waveConfig = getWaveConfig(wave);
    
    let monsterType;
    
    if (waveConfig.isBoss) {
        monsterType = MONSTER_TYPES.BOSS;
    } else {
        const rand = Math.random();
        if (wave < 3) {
            monsterType = MONSTER_TYPES.NORMAL;
        } else if (wave < 6) {
            if (rand < 0.6) monsterType = MONSTER_TYPES.NORMAL;
            else if (rand < 0.8) monsterType = MONSTER_TYPES.FAST;
            else monsterType = MONSTER_TYPES.TANK;
        } else {
            if (rand < 0.4) monsterType = MONSTER_TYPES.NORMAL;
            else if (rand < 0.6) monsterType = MONSTER_TYPES.FAST;
            else if (rand < 0.8) monsterType = MONSTER_TYPES.TANK;
            else monsterType = MONSTER_TYPES.EXPLOSIVE;
        }
    }
    
    const side = Math.floor(Math.random() * 4);
    let x, y;
    
    switch(side) {
        case 0: x = -50; y = Math.random() * canvas.height; break;
        case 1: x = canvas.width + 50; y = Math.random() * canvas.height; break;
        case 2: x = Math.random() * canvas.width; y = -50; break;
        case 3: x = Math.random() * canvas.width; y = canvas.height + 50; break;
    }
    
    const health = waveConfig.isBoss ? 
        waveConfig.monsterHealth : 
        Math.floor(waveConfig.monsterHealth * monsterType.healthMultiplier);
    
    const damage = waveConfig.isBoss ?
        waveConfig.monsterDamage :
        Math.floor(waveConfig.monsterDamage * monsterType.damageMultiplier);
    
    monsters.push({
        x, y,
        radius: waveConfig.isBoss ? 40 : (15 + Math.random() * 10) * monsterType.sizeMultiplier,
        health: health,
        maxHealth: health,
        damage: damage,
        speed: (waveConfig.isBoss ? 0.3 : (1 + wave * 0.1)) * monsterType.speed,
        color: monsterType.color,
        type: monsterType.name,
        monsterType: monsterType,
        lastAttack: 0,
        attackCooldown: waveConfig.isBoss ? 1500 : GAME_DATA.MONSTER_ATTACK_COOLDOWN,
        isBoss: waveConfig.isBoss
    });
}

// ============================================
// UI UPDATE FUNCTIONS
// ============================================

function updateUI() {
    healthValue.textContent = `${Math.floor(player.health)}/${player.maxHealth}`;
    damageValue.textContent = Math.floor(player.baseDamage);
    speedValue.textContent = player.speed.toFixed(1);
    goldValue.textContent = gold;
    waveValue.textContent = wave;
    killsValue.textContent = kills;
    
    const healthPercent = (player.health / player.maxHealth) * 100;
    healthFill.style.width = `${healthPercent}%`;
    
    if (healthPercent > 60) {
        healthFill.style.background = 'linear-gradient(90deg, #11998e, #38ef7d)';
    } else if (healthPercent > 30) {
        healthFill.style.background = 'linear-gradient(90deg, #f7971e, #ffd200)';
    } else {
        healthFill.style.background = 'linear-gradient(90deg, #ff416c, #ff4b2b)';
    }
    
    monsterCount.textContent = `Monsters: ${monsters.length}`;
}

function updateWeaponDisplay() {
    weaponsGrid.innerHTML = '';
    const currentTime = Date.now();
    
    for (let i = 0; i < 6; i++) {
        const slot = document.createElement('div');
        slot.className = 'weapon-slot';
        
        if (i < player.weapons.length) {
            const weapon = player.weapons[i];
            slot.classList.add('occupied');
            
            if (selectedWeaponIndex === i) {
                slot.classList.add('selected');
            }
            
            if (mergeTargetIndex === i) {
                slot.style.borderColor = '#00ff00';
                slot.style.boxShadow = '0 0 15px rgba(0, 255, 0, 0.5)';
            }
            
            let cooldownPercent = 100;
            if (weapon.lastAttack > 0) {
                const timeSinceLastAttack = currentTime - weapon.lastAttack;
                const cooldownTime = 1000 / weapon.attackSpeed;
                cooldownPercent = Math.min(100, (timeSinceLastAttack / cooldownTime) * 100);
            }
            
            let reloadPercent = 0;
            if (weapon.usesAmmo && weapon.isReloading) {
                const timeSinceReloadStart = currentTime - weapon.reloadStart;
                reloadPercent = Math.min(100, (timeSinceReloadStart / weapon.reloadTime) * 100);
            }
            
            slot.innerHTML = `
                <div>${weapon.icon}</div>
                ${weapon.tier > 1 ? `<div class="tier-badge">${weapon.tier}</div>` : ''}
                <div class="weapon-level">${weapon.type === 'melee' ? '⚔️' : '🔫'}</div>
                <div class="melee-type">${weapon.getTypeDescription()}</div>
                ${weapon.usesAmmo ? `<div class="ammo-display">${weapon.currentAmmo}/${weapon.magazineSize}</div>` : ''}
                <div class="weapon-info">${weapon.getDisplayName()}<br>Dmg: ${weapon.baseDamage}<br>Spd: ${weapon.attackSpeed.toFixed(1)}/s</div>
                <div class="cooldown-bar">
                    <div class="cooldown-fill" style="width: ${cooldownPercent}%; 
                         ${weapon.isReloading ? 'background: linear-gradient(90deg, #ff0000, #ff8800);' : ''}"></div>
                </div>
            `;
            
            slot.addEventListener('click', () => selectWeapon(i));
        } else {
            slot.innerHTML = '<div class="empty-slot">+</div>';
        }
        
        weaponsGrid.appendChild(slot);
    }
}

function selectWeapon(index) {
    if (gameState !== 'shop' && gameState !== 'statSelect') return;
    
    if (index >= player.weapons.length) return;
    
    const weapon = player.weapons[index];
    
    if (selectedWeaponIndex === -1) {
        selectedWeaponIndex = index;
        scrapWeaponBtn.innerHTML = `<span class="icon">🗑️</span> Scrap ${weapon.getDisplayName()} (Get ${weapon.getScrapValue()} gold)`;
        scrapWeaponBtn.style.display = 'block';
        mergeWeaponBtn.style.display = 'none';
        mergeInfo.style.display = 'none';
        mergeTargetIndex = -1;
    } else if (selectedWeaponIndex === index) {
        selectedWeaponIndex = -1;
        scrapWeaponBtn.style.display = 'none';
        mergeWeaponBtn.style.display = 'none';
        mergeInfo.style.display = 'none';
        mergeTargetIndex = -1;
    } else {
        const firstWeapon = player.weapons[selectedWeaponIndex];
        
        if (firstWeapon.id === weapon.id && firstWeapon.tier === weapon.tier) {
            mergeTargetIndex = index;
            const mergeCost = firstWeapon.getMergeCost(weapon);
            
            if (mergeCost > 0 && firstWeapon.tier < 5) {
                mergeWeaponBtn.innerHTML = `<span class="icon">🔄</span> Merge ${firstWeapon.getDisplayName()} + ${weapon.getDisplayName()} (Cost: ${mergeCost} gold)`;
                mergeWeaponBtn.style.display = 'block';
                
                mergeInfo.textContent = `Merge to create ${firstWeapon.name} Tier ${firstWeapon.tier + 1}!`;
                mergeInfo.style.display = 'block';
                setTimeout(() => {
                    mergeInfo.style.display = 'none';
                }, 3000);
            } else {
                mergeInfo.textContent = firstWeapon.tier >= 5 ? 'Max tier reached!' : 'Cannot merge these weapons';
                mergeInfo.style.display = 'block';
                setTimeout(() => {
                    mergeInfo.style.display = 'none';
                }, 2000);
            }
        } else {
            selectedWeaponIndex = index;
            scrapWeaponBtn.innerHTML = `<span class="icon">🗑️</span> Scrap ${weapon.getDisplayName()} (Get ${weapon.getScrapValue()} gold)`;
            scrapWeaponBtn.style.display = 'block';
            mergeWeaponBtn.style.display = 'none';
            mergeInfo.style.display = 'none';
            mergeTargetIndex = -1;
        }
    }
    
    updateWeaponDisplay();
}

function mergeWeapons() {
    if (selectedWeaponIndex === -1 || mergeTargetIndex === -1) return;
    
    const weapon1 = player.weapons[selectedWeaponIndex];
    const weapon2 = player.weapons[mergeTargetIndex];
    
    if (weapon1.id !== weapon2.id || weapon1.tier !== weapon2.tier) {
        showMessage("Can only merge identical weapons of same tier!");
        return;
    }
    
    if (weapon1.tier >= 5) {
        showMessage("Maximum tier (5) reached!");
        return;
    }
    
    const mergeCost = weapon1.getMergeCost(weapon2);
    
    if (gold < mergeCost) {
        showMessage(`Need ${mergeCost} gold to merge!`);
        return;
    }
    
    gold -= mergeCost;
    
    const mergedWeapon = weapon1.merge(weapon2);
    
    if (!mergedWeapon) {
        showMessage("Merge failed!");
        return;
    }
    
    player.weapons[selectedWeaponIndex] = mergedWeapon;
    player.weapons.splice(mergeTargetIndex, 1);
    
    selectedWeaponIndex = -1;
    mergeTargetIndex = -1;
    scrapWeaponBtn.style.display = 'none';
    mergeWeaponBtn.style.display = 'none';
    
    showMessage(`Merged to create ${mergedWeapon.getDisplayName()}!`);
    
    updateUI();
    updateWeaponDisplay();
}

function scrapWeapon() {
    if (selectedWeaponIndex === -1 || selectedWeaponIndex >= player.weapons.length) return;
    
    const weapon = player.weapons[selectedWeaponIndex];
    
    if (weapon.id === 'handgun' && player.weapons.length === 1) {
        showMessage("Cannot scrap your only weapon!");
        return;
    }
    
    const scrapValue = weapon.getScrapValue();
    gold += scrapValue;
    
    player.weapons.splice(selectedWeaponIndex, 1);
    
    selectedWeaponIndex = -1;
    scrapWeaponBtn.style.display = 'none';
    
    showMessage(`Scrapped ${weapon.getDisplayName()} for ${scrapValue} gold!`);
    
    updateUI();
    updateWeaponDisplay();
}

function updateShopDisplay() {
    shopItemsContainer.innerHTML = '';
    
    for (let i = 0; i < 4; i++) {
        const shopItem = shopItems[i];
        const itemElement = document.createElement('div');
        
        if (shopItem) {
            itemElement.className = 'shop-item';
            const data = shopItem.data;
            const cost = data.cost;
            
            let tagClass = '';
            if (shopItem.type === 'weapon') {
                if (data.type === 'melee') {
                    if (data.meleeType === 'aoe') tagClass = 'aoe-tag';
                    else if (data.meleeType === 'pierce') tagClass = 'pierce-tag';
                    else tagClass = 'single-tag';
                } else {
                    if (data.id === 'shotgun') tagClass = 'shotgun-tag';
                    else if (data.id === 'laser') tagClass = 'energy-tag';
                    else tagClass = 'ranged-tag';
                }
            }
            
            itemElement.innerHTML = `
                <div class="item-info">
                    <div class="item-name">
                        ${data.icon} ${data.name}
                        ${tagClass ? `<span class="item-tag ${tagClass}">${shopItem.type === 'weapon' ? (data.id === 'shotgun' ? 'SHOTGUN' : data.id === 'laser' ? 'ENERGY' : data.type === 'melee' ? data.meleeType.toUpperCase() : 'RANGED') : 'ITEM'}</span>` : ''}
                    </div>
                    <div class="item-effect">${data.description}</div>
                </div>
                <div class="item-cost">${cost}g</div>
            `;
            
            itemElement.addEventListener('click', () => purchaseItem(i));
        } else {
            itemElement.className = 'shop-item empty';
            itemElement.innerHTML = `
                <div class="item-info">
                    <div class="item-name">Empty Slot</div>
                    <div class="item-effect">Already purchased</div>
                </div>
                <div class="item-cost">-</div>
            `;
        }
        
        shopItemsContainer.appendChild(itemElement);
    }
}

function purchaseItem(index) {
    if (index >= shopItems.length || !shopItems[index]) return;
    
    const shopItem = shopItems[index];
    const data = shopItem.data;
    
    if (gold < data.cost) {
        showMessage(`Not enough gold! Need ${data.cost}, have ${gold}`);
        return;
    }
    
    gold -= data.cost;
    
    if (shopItem.type === 'weapon') {
        if (player.weapons.length >= 6) {
            showMessage('No empty weapon slots!');
            gold += data.cost;
            return;
        }
        
        player.weapons.push(new WeaponInstance(data));
        showMessage(`Purchased ${data.name}!`);
        
    } else {
        applyItemEffect(data);
        showMessage(`Purchased ${data.name}!`);
    }
    
    shopItems[index] = null;
    
    updateUI();
    updateWeaponDisplay();
    updateShopDisplay();
}

function applyItemEffect(item) {
    switch(item.id) {
        case 'health_potion':
            player.health = Math.min(player.maxHealth, player.health + 20);
            break;
        case 'damage_orb':
            player.baseDamage += 5;
            break;
        case 'speed_boots':
            player.speed += 2;
            break;
        case 'health_upgrade':
            player.maxHealth += 30;
            player.health += 30;
            break;
        case 'ammo_pack':
            player.weapons.forEach(weapon => {
                if (weapon.usesAmmo) {
                    weapon.currentAmmo = weapon.magazineSize;
                    weapon.isReloading = false;
                }
            });
            showMessage("All weapons reloaded!");
            break;
        // New items will need their effects implemented here
    }
}

function showStatBuffs() {
    gameState = 'statSelect';
    const buffs = generateStatBuffs();
    
    statBuffs.innerHTML = '';
    buffs.forEach(buff => {
        const buffElement = document.createElement('div');
        buffElement.className = 'stat-buff';
        buffElement.innerHTML = `
            <div class="buff-name">${buff.icon} ${buff.name}</div>
            <div class="buff-description">${buff.description}</div>
        `;
        
        buffElement.addEventListener('click', () => selectStatBuff(buff));
        statBuffs.appendChild(buffElement);
    });
    
    waveCompleteOverlay.style.display = 'flex';
}

function selectStatBuff(buff) {
    if (buff.effect.maxHealth) {
        player.maxHealth += buff.effect.maxHealth;
        if (buff.effect.health) {
            player.health += buff.effect.health;
        } else {
            player.health += buff.effect.maxHealth;
        }
    }
    
    if (buff.effect.damage) {
        player.baseDamage += buff.effect.damage;
    }
    
    if (buff.effect.speed) {
        player.speed += buff.effect.speed;
    }
    
    if (buff.effect.lifeSteal) {
        player.lifeSteal += buff.effect.lifeSteal;
    }
    
    if (buff.effect.criticalChance) {
        player.criticalChance += buff.effect.criticalChance;
    }
    
    if (buff.effect.goldMultiplier) {
        player.goldMultiplier += buff.effect.goldMultiplier;
    }
    
    if (buff.effect.healthRegen) {
        player.healthRegen += buff.effect.healthRegen;
    }
    
    if (buff.effect.damageReduction) {
        player.damageReduction += buff.effect.damageReduction;
    }
    
    showMessage(`Selected: ${buff.name}`);
    
    waveCompleteOverlay.style.display = 'none';
    gameState = 'shop';
    
    shopItems = generateShopItems();
    updateShopDisplay();
    updateUI();
    
    nextWaveBtn.style.display = 'block';
    scrapWeaponBtn.style.display = 'none';
    mergeWeaponBtn.style.display = 'none';
    selectedWeaponIndex = -1;
    mergeTargetIndex = -1;
}

function endWave() {
    gameState = 'statSelect';
    
    const waveConfig = getWaveConfig(wave);
    gold += Math.floor(waveConfig.goldReward * (1 + player.goldMultiplier));
    
    player.weapons.forEach(weapon => {
        if (weapon.usesAmmo) {
            weapon.currentAmmo = weapon.magazineSize;
            weapon.isReloading = false;
        }
    });
    
    showStatBuffs();
}

function gameOver() {
    gameState = 'gameover';
    gameOverText.textContent = `You survived ${wave} waves with ${kills} kills.`;
    gameOverOverlay.style.display = 'flex';
}

function showMessage(text) {
    const message = document.createElement('div');
    message.textContent = text;
    message.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.9);
        color: #ffcc00;
        padding: 20px 40px;
        border-radius: 10px;
        border: 2px solid #ffcc00;
        z-index: 1001;
        font-size: 1.2rem;
        font-weight: bold;
        pointer-events: none;
        animation: fadeOut 2s forwards;
    `;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        if (message.parentNode) {
            message.parentNode.removeChild(message);
        }
    }, 2000);
}

function showReloadIndicator(weaponName) {
    if (gameState === 'wave') {
        reloadIndicator.textContent = `${weaponName} - RELOADING...`;
        reloadIndicator.style.display = 'block';
        
        setTimeout(() => {
            reloadIndicator.style.display = 'none';
        }, 1000);
    }
}

// ============================================
// GAME LOOP
// ============================================

function gameLoop() {
    const currentTime = Date.now();
    const deltaTime = currentTime - lastFrameTime;
    lastFrameTime = currentTime;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    drawGrid();
    
    if (gameState === 'wave') {
        updateGame(deltaTime);
    }
    
    drawSpawnIndicators();
    drawMonsters();
    drawProjectiles();
    drawMeleeAttacks();
    drawVisualEffects();
    drawPlayer();
    
    if (gameState === 'wave' || gameState === 'shop' || gameState === 'statSelect') {
        updateWeaponDisplay();
    }
    
    requestAnimationFrame(gameLoop);
}

function drawGrid() {
    ctx.strokeStyle = 'rgba(100, 100, 150, 0.1)';
    ctx.lineWidth = 1;
    
    for (let x = 0; x < canvas.width; x += 50) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    
    for (let y = 0; y < canvas.height; y += 50) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
}

function drawSpawnIndicators() {
    const currentTime = Date.now();
    
    for (let i = spawnIndicators.length - 1; i >= 0; i--) {
        const indicator = spawnIndicators[i];
        const elapsed = currentTime - indicator.startTime;
        
        if (elapsed > indicator.timer) {
            spawnIndicators.splice(i, 1);
            continue;
        }
        
        ctx.save();
        ctx.translate(indicator.x, indicator.y);
        
        if (indicator.isBoss) {
            ctx.strokeStyle = '#ffd700';
            ctx.lineWidth = 4;
            ctx.shadowColor = '#ffd700';
            ctx.shadowBlur = 10;
        } else {
            ctx.strokeStyle = '#ff0000';
            ctx.lineWidth = 3;
        }
        
        ctx.lineCap = 'round';
        
        ctx.beginPath();
        ctx.moveTo(-15, -15);
        ctx.lineTo(15, 15);
        ctx.moveTo(15, -15);
        ctx.lineTo(-15, 15);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(0, 0, indicator.isBoss ? 30 : 20, 0, Math.PI * 2);
        ctx.strokeStyle = indicator.isBoss ? 'rgba(255, 215, 0, 0.5)' : 'rgba(255, 0, 0, 0.3)';
        ctx.lineWidth = indicator.isBoss ? 3 : 2;
        ctx.stroke();
        
        ctx.restore();
    }
}

function drawPlayer() {
    ctx.save();
    ctx.translate(player.x, player.y);
    
    ctx.shadowColor = 'rgba(255, 107, 107, 0.5)';
    ctx.shadowBlur = 15;
    
    ctx.fillStyle = player.color;
    ctx.beginPath();
    ctx.arc(0, 0, player.radius, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.shadowBlur = 0;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, player.radius, 0, Math.PI * 2);
    ctx.stroke();
    
    const angle = Math.atan2(mouseY - player.y, mouseX - player.x);
    const indicatorX = Math.cos(angle) * (player.radius + 5);
    const indicatorY = Math.sin(angle) * (player.radius + 5);
    
    ctx.fillStyle = '#ffcc00';
    ctx.shadowColor = 'rgba(255, 204, 0, 0.5)';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(indicatorX, indicatorY, 5, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
}

// ============================================
// REALISTIC WEAPON ANIMATIONS
// ============================================

function drawMeleeAttacks() {
    const currentTime = Date.now();
    
    player.meleeAttacks.forEach(attack => {
        const progress = (currentTime - attack.startTime) / attack.duration;
        if (progress < 0 || progress > 1) return;
        
        ctx.save();
        ctx.translate(attack.x, attack.y);
        
        const angle = attack.angle;
        const distance = attack.radius * (progress * 1.2);
        const alpha = 1 - progress * 0.7;
        
        switch(attack.weaponId) {
            case 'sword':
                drawSword(ctx, attack, angle, progress, distance, alpha);
                break;
            case 'axe':
                drawAxe(ctx, attack, angle, progress, distance, alpha);
                break;
            case 'dagger':
                drawDagger(ctx, attack, angle, progress, distance, alpha);
                break;
            case 'hammer':
                drawHammer(ctx, attack, angle, progress, distance, alpha);
                break;
            case 'spear':
                drawTrident(ctx, attack, angle, progress, distance, alpha);
                break;
            // New melee weapon animations would be added here
        }
        
        ctx.restore();
    });
}

function drawSword(ctx, attack, angle, progress, distance, alpha) {
    // Sword animation - arc swing
    const swingProgress = Math.sin(progress * Math.PI);
    const currentAngle = angle - 0.5 + swingProgress * 1;
    
    ctx.rotate(currentAngle);
    ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
    ctx.shadowBlur = 10 * alpha;
    
    // Blade
    ctx.save();
    ctx.translate(10, 0);
    
    // Blade gradient
    const gradient = ctx.createLinearGradient(0, -5, attack.radius, -5);
    gradient.addColorStop(0, '#C0C0C0');
    gradient.addColorStop(1, '#E8E8E8');
    
    ctx.fillStyle = gradient;
    ctx.shadowColor = 'rgba(192, 192, 192, 0.5)';
    ctx.shadowBlur = 15 * alpha;
    
    // Blade shape
    ctx.beginPath();
    ctx.moveTo(0, -5);
    ctx.lineTo(attack.radius * 0.9, -2);
    ctx.lineTo(attack.radius * 0.9, 2);
    ctx.lineTo(0, 5);
    ctx.closePath();
    ctx.fill();
    
    // Edge highlight
    ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, -5);
    ctx.lineTo(attack.radius * 0.9, -2);
    ctx.moveTo(0, 5);
    ctx.lineTo(attack.radius * 0.9, 2);
    ctx.stroke();
    
    // Tip
    ctx.fillStyle = '#FFD700';
    ctx.shadowColor = 'rgba(255, 215, 0, 0.7)';
    ctx.beginPath();
    ctx.arc(attack.radius * 0.9, 0, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    
    // Hilt
    ctx.save();
    ctx.fillStyle = '#8B4513';
    ctx.shadowColor = 'rgba(139, 69, 19, 0.5)';
    ctx.fillRect(-5, -4, 15, 8);
    
    // Guard
    ctx.fillStyle = '#B87333';
    ctx.fillRect(-8, -8, 8, 16);
    
    // Pommel
    ctx.fillStyle = '#CD7F32';
    ctx.beginPath();
    ctx.arc(-10, 0, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    
    // Trail effect
    if (progress < 0.5) {
        ctx.save();
        ctx.rotate(-0.2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.5})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(10, 0);
        ctx.lineTo(attack.radius * 0.7, 0);
        ctx.stroke();
        ctx.restore();
    }
}

function drawAxe(ctx, attack, angle, progress, distance, alpha) {
    // Axe animation - spinning
    const spinAngle = progress * Math.PI * 4;
    
    ctx.rotate(spinAngle);
    ctx.shadowColor = 'rgba(139, 69, 19, 0.5)';
    ctx.shadowBlur = 15 * alpha;
    
    // Handle
    ctx.save();
    ctx.fillStyle = '#654321';
    ctx.fillRect(-3, -attack.radius * 0.8, 6, attack.radius * 1.6);
    ctx.restore();
    
    // Axe head
    ctx.save();
    ctx.translate(0, -attack.radius * 0.4);
    ctx.rotate(-0.3);
    
    // Blade
    const bladeGradient = ctx.createLinearGradient(0, -15, 30, -15);
    bladeGradient.addColorStop(0, '#8B4513');
    bladeGradient.addColorStop(1, '#CD7F32');
    
    ctx.fillStyle = bladeGradient;
    ctx.shadowColor = 'rgba(205, 127, 50, 0.7)';
    
    ctx.beginPath();
    ctx.moveTo(0, -10);
    ctx.lineTo(35, -15);
    ctx.lineTo(35, -5);
    ctx.lineTo(0, 10);
    ctx.closePath();
    ctx.fill();
    
    // Edge
    ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(35, -15);
    ctx.lineTo(35, -5);
    ctx.stroke();
    ctx.restore();
    
    // Shockwave ring for AOE
    if (attack.meleeType === 'aoe' && progress > 0.3 && progress < 0.7) {
        ctx.save();
        ctx.rotate(0);
        ctx.strokeStyle = `rgba(255, 165, 0, ${alpha * 0.5})`;
        ctx.lineWidth = 3;
        const ringScale = 1 + (progress - 0.3) * 3;
        ctx.beginPath();
        ctx.arc(0, 0, attack.radius * ringScale, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
    }
}

function drawDagger(ctx, attack, angle, progress, distance, alpha) {
    // Dagger animation - quick stab forward
    const stabProgress = Math.min(progress * 2, 1);
    const stabDistance = distance * 1.5;
    
    ctx.rotate(angle);
    ctx.translate(stabDistance, 0);
    ctx.shadowColor = 'rgba(70, 130, 180, 0.5)';
    ctx.shadowBlur = 10 * alpha;
    
    // Blade
    ctx.save();
    const bladeGradient = ctx.createLinearGradient(0, -3, 40, -3);
    bladeGradient.addColorStop(0, '#4682B4');
    bladeGradient.addColorStop(1, '#87CEEB');
    
    ctx.fillStyle = bladeGradient;
    ctx.beginPath();
    ctx.moveTo(0, -3);
    ctx.lineTo(40, -1);
    ctx.lineTo(40, 1);
    ctx.lineTo(0, 3);
    ctx.closePath();
    ctx.fill();
    
    // Edge highlight
    ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, -3);
    ctx.lineTo(40, -1);
    ctx.moveTo(0, 3);
    ctx.lineTo(40, 1);
    ctx.stroke();
    ctx.restore();
    
    // Tip sparkle
    if (progress > 0.7) {
        ctx.save();
        ctx.translate(40, 0);
        ctx.fillStyle = `rgba(0, 255, 255, ${alpha})`;
        ctx.shadowColor = 'rgba(0, 255, 255, 0.7)';
        ctx.beginPath();
        ctx.arc(0, 0, 3 * (1 - progress), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
    
    // Hilt
    ctx.save();
    ctx.fillStyle = '#2F4F4F';
    ctx.fillRect(-8, -4, 12, 8);
    
    // Grip
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(-8, -3, 10, 6);
    
    // Pommel
    ctx.fillStyle = '#4682B4';
    ctx.beginPath();
    ctx.arc(-12, 0, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}

function drawHammer(ctx, attack, angle, progress, distance, alpha) {
    // Hammer animation - overhead smash
    ctx.rotate(angle);
    
    const lift = Math.sin(progress * Math.PI) * 30;
    const smashY = progress < 0.3 ? -lift : progress > 0.6 ? (progress - 0.6) * 40 : 0;
    
    ctx.translate(20, -30 + lift - smashY);
    ctx.shadowColor = 'rgba(105, 105, 105, 0.7)';
    ctx.shadowBlur = 20 * alpha;
    
    // Handle
    ctx.save();
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(-3, 0, 6, 50);
    ctx.restore();
    
    // Hammer head
    ctx.save();
    ctx.translate(0, -15);
    
    ctx.fillStyle = '#696969';
    ctx.shadowColor = 'rgba(105, 105, 105, 0.7)';
    ctx.fillRect(-15, -15, 30, 20);
    
    // Striking face
    ctx.fillStyle = '#808080';
    ctx.fillRect(-18, -15, 6, 20);
    ctx.fillRect(12, -15, 6, 20);
    
    // Top
    ctx.fillStyle = '#A9A9A9';
    ctx.fillRect(-15, -20, 30, 5);
    ctx.restore();
    
    // Impact shockwave
    if (progress > 0.5 && progress < 0.8) {
        ctx.save();
        ctx.translate(0, 0);
        ctx.rotate(0);
        const shockProgress = (progress - 0.5) * 3.33;
        ctx.strokeStyle = `rgba(255, 69, 0, ${alpha * (1 - shockProgress)})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 30, attack.radius * shockProgress, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
    }
}

function drawTrident(ctx, attack, angle, progress, distance, alpha) {
    // Trident animation - straight thrust forward
    const thrustProgress = Math.min(progress * 1.5, 1);
    const thrustDistance = distance * 1.3 * thrustProgress;
    
    ctx.rotate(angle);
    ctx.translate(thrustDistance, 0);
    ctx.shadowColor = 'rgba(50, 205, 50, 0.5)';
    ctx.shadowBlur = 15 * alpha;
    
    // Shaft
    ctx.save();
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(-3, -3, attack.radius + 20, 6);
    
    // Shaft detail
    ctx.fillStyle = '#654321';
    for (let i = 0; i < 3; i++) {
        ctx.fillRect(i * 20, -4, 2, 8);
    }
    ctx.restore();
    
    // Three prongs
    ctx.save();
    ctx.translate(attack.radius + 10, 0);
    
    // Center prong
    ctx.fillStyle = '#CD7F32';
    ctx.beginPath();
    ctx.moveTo(0, -2);
    ctx.lineTo(20, -4);
    ctx.lineTo(20, 4);
    ctx.lineTo(0, 2);
    ctx.closePath();
    ctx.fill();
    
    // Left prong
    ctx.save();
    ctx.translate(0, -8);
    ctx.rotate(-0.1);
    ctx.beginPath();
    ctx.moveTo(0, -2);
    ctx.lineTo(18, -4);
    ctx.lineTo(18, 4);
    ctx.lineTo(0, 2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    
    // Right prong
    ctx.save();
    ctx.translate(0, 8);
    ctx.rotate(0.1);
    ctx.beginPath();
    ctx.moveTo(0, -2);
    ctx.lineTo(18, -4);
    ctx.lineTo(18, 4);
    ctx.lineTo(0, 2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    
    // Tips
    ctx.fillStyle = '#FFD700';
    ctx.shadowColor = 'rgba(255, 215, 0, 0.7)';
    
    ctx.beginPath();
    ctx.arc(20, 0, 3, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(18, -8, 3, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(18, 8, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}

function updateGame(deltaTime) {
    const dx = mouseX - player.x;
    const dy = mouseY - player.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > player.speed) {
        player.x += (dx / distance) * player.speed;
        player.y += (dy / distance) * player.speed;
    }
    
    player.x = Math.max(player.radius, Math.min(canvas.width - player.radius, player.x));
    player.y = Math.max(player.radius, Math.min(canvas.height - player.radius, player.y));
    
    const currentTime = Date.now();
    if (player.healthRegen > 0 && currentTime - player.lastRegen >= 1000) {
        player.health = Math.min(player.maxHealth, player.health + player.healthRegen);
        player.lastRegen = currentTime;
    }
    
    updateWeapons();
    updateProjectiles();
    updateMeleeAttacks();
    updateMonsters();
    updateVisualEffects();
    
    if (monsters.length === 0 && spawnIndicators.length === 0) {
        wave++;
        endWave();
    }
    
    updateUI();
}

function updateWeapons() {
    const currentTime = Date.now();
    
    player.weapons.forEach(weapon => {
        if (!weapon || monsters.length === 0) return;
        
        if (weapon.canAttack(currentTime)) {
            let closestMonster = null;
            let closestDistance = Infinity;
            
            monsters.forEach(monster => {
                const dx = monster.x - player.x;
                const dy = monster.y - player.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < closestDistance && distance < weapon.range) {
                    closestDistance = distance;
                    closestMonster = monster;
                }
            });
            
            if (closestMonster) {
                const attack = weapon.attack(player.x, player.y, closestMonster.x, closestMonster.y);
                
                if (weapon.id === 'shotgun') {
                    player.projectiles.push(...attack);
                } else if (weapon.type === 'ranged') {
                    player.projectiles.push(attack);
                } else {
                    player.meleeAttacks.push(attack);
                }
            }
        }
    });
}

function updateProjectiles() {
    for (let i = player.projectiles.length - 1; i >= 0; i--) {
        const projectile = player.projectiles[i];
        
        projectile.x += Math.cos(projectile.angle) * projectile.speed;
        projectile.y += Math.sin(projectile.angle) * projectile.speed;
        
        const dx = projectile.x - player.x;
        const dy = projectile.y - player.y;
        const distanceFromPlayer = Math.sqrt(dx * dx + dy * dy);
        
        if (distanceFromPlayer > projectile.range) {
            player.projectiles.splice(i, 1);
            continue;
        }
        
        if (projectile.bounceCount > 0 && projectile.targetsHit) {
            let nextTarget = null;
            let nextTargetDistance = Infinity;
            
            monsters.forEach(monster => {
                if (projectile.targetsHit.includes(monster)) return;
                
                const dx = projectile.x - monster.x;
                const dy = projectile.y - monster.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < nextTargetDistance && distance < projectile.bounceRange) {
                    nextTargetDistance = distance;
                    nextTarget = monster;
                }
            });
            
            if (nextTarget) {
                projectile.angle = Math.atan2(nextTarget.y - projectile.y, nextTarget.x - projectile.x);
                projectile.targetsHit.push(nextTarget);
                projectile.bounceCount--;
                continue;
            }
        }
        
        for (let j = monsters.length - 1; j >= 0; j--) {
            const monster = monsters[j];
            const dx = projectile.x - monster.x;
            const dy = projectile.y - monster.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < (projectile.isPellet ? 3 : 5) + monster.radius) {
                let damage = projectile.damage;
                let isCritical = false;
                
                if (Math.random() < player.criticalChance) {
                    damage *= 2;
                    isCritical = true;
                }
                
                damage += player.baseDamage;
                
                monster.health -= damage;
                
                createDamageIndicator(monster.x, monster.y, Math.floor(damage), isCritical);
                
                if (player.lifeSteal > 0) {
                    const healAmount = damage * player.lifeSteal;
                    player.health = Math.min(player.maxHealth, player.health + healAmount);
                    createHealthPopup(player.x, player.y, Math.floor(healAmount));
                }
                
                if (!projectile.bounceCount || !projectile.targetsHit) {
                    player.projectiles.splice(i, 1);
                } else {
                    if (!projectile.targetsHit.includes(monster)) {
                        projectile.targetsHit.push(monster);
                    }
                }
                
                if (monster.health <= 0) {
                    addVisualEffect({
                        type: 'death',
                        x: monster.x,
                        y: monster.y,
                        color: monster.color,
                        startTime: Date.now(),
                        duration: 300
                    });
                    
                    monsters.splice(j, 1);
                    kills++;
                    const goldEarned = Math.floor(10 * (1 + player.goldMultiplier));
                    gold += goldEarned;
                    
                    createGoldPopup(monster.x, monster.y, goldEarned);
                }
                
                break;
            }
        }
    }
}

function updateMeleeAttacks() {
    const currentTime = Date.now();
    
    for (let i = player.meleeAttacks.length - 1; i >= 0; i--) {
        const attack = player.meleeAttacks[i];
        
        if (currentTime - attack.startTime > attack.duration) {
            player.meleeAttacks.splice(i, 1);
            continue;
        }
        
        let hits = 0;
        
        for (let j = monsters.length - 1; j >= 0; j--) {
            const monster = monsters[j];
            const dx = monster.x - attack.x;
            const dy = monster.y - attack.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < attack.radius + monster.radius) {
                let damage = attack.damage;
                let isCritical = false;
                
                if (Math.random() < player.criticalChance) {
                    damage *= 2;
                    isCritical = true;
                }
                
                damage += player.baseDamage;
                
                monster.health -= damage;
                
                createDamageIndicator(monster.x, monster.y, Math.floor(damage), isCritical);
                
                if (player.lifeSteal > 0) {
                    const healAmount = damage * player.lifeSteal;
                    player.health = Math.min(player.maxHealth, player.health + healAmount);
                    createHealthPopup(player.x, player.y, Math.floor(healAmount));
                }
                
                hits++;
                
                if (attack.meleeType === 'pierce' && hits >= attack.pierceCount) {
                    break;
                }
                
                if (monster.health <= 0) {
                    addVisualEffect({
                        type: 'death',
                        x: monster.x,
                        y: monster.y,
                        color: monster.color,
                        startTime: Date.now(),
                        duration: 300
                    });
                    
                    monsters.splice(j, 1);
                    kills++;
                    const goldEarned = Math.floor(10 * (1 + player.goldMultiplier));
                    gold += goldEarned;
                    
                    createGoldPopup(monster.x, monster.y, goldEarned);
                    
                    j--;
                }
            }
        }
    }
}

function updateMonsters() {
    const currentTime = Date.now();
    
    monsters.forEach(monster => {
        const dx = player.x - monster.x;
        const dy = player.y - monster.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        monster.x += (dx / distance) * monster.speed;
        monster.y += (dy / distance) * monster.speed;
        
        if (distance < player.radius + monster.radius) {
            if (currentTime - monster.lastAttack >= monster.attackCooldown) {
                let actualDamage = monster.damage;
                
                if (player.damageReduction > 0) {
                    actualDamage *= (1 - player.damageReduction);
                }
                
                player.health -= actualDamage;
                monster.lastAttack = currentTime;
                
                createDamageIndicator(player.x, player.y, Math.floor(actualDamage), false);
                
                if (monster.monsterType && monster.monsterType.explosive) {
                    // Explosive monster explosion on death
                    setTimeout(() => {
                        if (monster.health <= 0) {
                            const explosionDamage = monster.damage * 2;
                            const distanceToPlayer = Math.sqrt(
                                Math.pow(player.x - monster.x, 2) + 
                                Math.pow(player.y - monster.y, 2)
                            );
                            
                            if (distanceToPlayer < 100) {
                                player.health -= explosionDamage;
                                createDamageIndicator(player.x, player.y, Math.floor(explosionDamage), true);
                            }
                        }
                    }, 50);
                }
                
                if (player.health <= 0) {
                    gameOver();
                }
            }
        }
    });
}

function addVisualEffect(effect) {
    visualEffects.push(effect);
}

function updateVisualEffects() {
    const currentTime = Date.now();
    
    for (let i = visualEffects.length - 1; i >= 0; i--) {
        const effect = visualEffects[i];
        
        if (currentTime - effect.startTime > effect.duration) {
            visualEffects.splice(i, 1);
            continue;
        }
    }
}

function drawVisualEffects() {
    const currentTime = Date.now();
    
    visualEffects.forEach(effect => {
        const progress = (currentTime - effect.startTime) / effect.duration;
        const alpha = 1 - progress;
        
        ctx.save();
        
        switch(effect.type) {
            case 'death':
                ctx.fillStyle = `rgba(255, 0, 0, ${alpha})`;
                const particles = 8;
                for (let i = 0; i < particles; i++) {
                    const angle = (Math.PI * 2 * i) / particles + progress * Math.PI;
                    const distance = progress * 30;
                    ctx.beginPath();
                    ctx.arc(effect.x + Math.cos(angle) * distance, 
                           effect.y + Math.sin(angle) * distance, 
                           3, 0, Math.PI * 2);
                    ctx.fill();
                }
                break;
        }
        
        ctx.restore();
    });
}

function drawProjectiles() {
    player.projectiles.forEach(projectile => {
        ctx.fillStyle = projectile.color;
        ctx.shadowColor = projectile.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(projectile.x, projectile.y, projectile.isPellet ? 2 : 4, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.shadowBlur = 0;
        ctx.strokeStyle = projectile.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(projectile.x - Math.cos(projectile.angle) * 10, 
                   projectile.y - Math.sin(projectile.angle) * 10);
        ctx.lineTo(projectile.x, projectile.y);
        ctx.stroke();
    });
}

function drawMonsters() {
    monsters.forEach(monster => {
        ctx.save();
        ctx.translate(monster.x, monster.y);
        
        // Body
        ctx.fillStyle = monster.color;
        ctx.shadowColor = monster.color;
        ctx.shadowBlur = monster.isBoss ? 20 : 10;
        ctx.beginPath();
        ctx.arc(0, 0, monster.radius, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.shadowBlur = 0;
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, monster.radius, 0, Math.PI * 2);
        ctx.stroke();
        
        // Type icon
        if (monster.monsterType && monster.monsterType.icon) {
            ctx.fillStyle = 'white';
            ctx.font = `${monster.radius}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(monster.monsterType.icon, 0, 0);
        }
        
        // Eyes
        const angleToPlayer = Math.atan2(player.y - monster.y, player.x - monster.x);
        const eyeRadius = monster.radius * 0.2;
        
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowBlur = 5;
        
        ctx.beginPath();
        ctx.arc(Math.cos(angleToPlayer - 0.3) * monster.radius * 0.6, 
                Math.sin(angleToPlayer - 0.3) * monster.radius * 0.6, 
                eyeRadius, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(Math.cos(angleToPlayer + 0.3) * monster.radius * 0.6, 
                Math.sin(angleToPlayer + 0.3) * monster.radius * 0.6, 
                eyeRadius, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#000000';
        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.arc(Math.cos(angleToPlayer) * monster.radius * 0.7, 
                Math.sin(angleToPlayer) * monster.radius * 0.7, 
                eyeRadius * 0.5, 0, Math.PI * 2);
        ctx.fill();
        
        // Health bar
        const healthPercent = monster.health / monster.maxHealth;
        const barWidth = monster.radius * 2;
        const barHeight = 4;
        const barX = -monster.radius;
        const barY = -monster.radius - 10;
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(barX, barY, barWidth, barHeight);
        
        ctx.fillStyle = healthPercent > 0.5 ? '#00ff00' : healthPercent > 0.2 ? '#ffff00' : '#ff0000';
        ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);
        
        ctx.restore();
    });
}

function createDamageIndicator(x, y, damage, isCritical) {
    const indicator = document.createElement('div');
    indicator.className = 'damage-indicator';
    indicator.textContent = damage.toString();
    if (isCritical) {
        indicator.textContent = 'CRIT! ' + damage;
        indicator.style.color = '#FFD700';
        indicator.style.fontSize = '1.5rem';
    }
    
    indicator.style.left = (x + Math.random() * 20 - 10) + 'px';
    indicator.style.top = (y + Math.random() * 20 - 10) + 'px';
    
    document.querySelector('.canvas-container').appendChild(indicator);
    
    setTimeout(() => {
        if (indicator.parentNode) {
            indicator.parentNode.removeChild(indicator);
        }
    }, 1000);
}

function createGoldPopup(x, y, amount) {
    const popup = document.createElement('div');
    popup.className = 'gold-popup';
    popup.textContent = '+' + amount + 'g';
    
    popup.style.left = (x + Math.random() * 20 - 10) + 'px';
    popup.style.top = (y + Math.random() * 20 - 10) + 'px';
    
    document.querySelector('.canvas-container').appendChild(popup);
    
    setTimeout(() => {
        if (popup.parentNode) {
            popup.parentNode.removeChild(popup);
        }
    }, 1000);
}

function createHealthPopup(x, y, amount) {
    const popup = document.createElement('div');
    popup.className = 'health-popup';
    popup.textContent = '+' + amount + ' HP';
    
    popup.style.left = (x + Math.random() * 20 - 10) + 'px';
    popup.style.top = (y + Math.random() * 20 - 10) + 'px';
    
    document.querySelector('.canvas-container').appendChild(popup);
    
    setTimeout(() => {
        if (popup.parentNode) {
            popup.parentNode.removeChild(popup);
        }
    }, 1000);
}

// ============================================
// EVENT LISTENERS
// ============================================

canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
});

startGameBtn.addEventListener('click', initGame);

nextWaveBtn.addEventListener('click', () => {
    if (gameState === 'shop') {
        gameState = 'wave';
        startWave();
        nextWaveBtn.style.display = 'none';
        scrapWeaponBtn.style.display = 'none';
        mergeWeaponBtn.style.display = 'none';
        selectedWeaponIndex = -1;
        mergeTargetIndex = -1;
    }
});

scrapWeaponBtn.addEventListener('click', scrapWeapon);
mergeWeaponBtn.addEventListener('click', mergeWeapons);
refreshShopBtn.addEventListener('click', refreshShop);

restartBtn.addEventListener('click', () => {
    gameOverOverlay.style.display = 'none';
    initGame();
});

document.addEventListener('keydown', (e) => {
    if (e.key === ' ') {
        if (gameState === 'shop' && nextWaveBtn.style.display !== 'none') {
            nextWaveBtn.click();
        }
    } else if (e.key === 'r') {
        if (gameState === 'shop') {
            player.weapons.forEach(weapon => {
                if (weapon.usesAmmo && !weapon.isReloading) {
                    weapon.startReload();
                }
            });
        }
    }
});

const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        0% { opacity: 1; }
        70% { opacity: 1; }
        100% { opacity: 0; }
    }
`;
document.head.appendChild(style);

gameLoop();
