// ============================================
// GAME DATA - Weapons, Items, Waves, Stat Buffs
// ============================================

const GAME_DATA = {
    PLAYER_START: { health: 20, maxHealth: 20, damage: 5, speed: 3, gold: 50 },
    MONSTER_ATTACK_COOLDOWN: 1000,
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
        { number: 10, monsters: 15, monsterHealth: 40, monsterDamage: 10, goldReward: 400, isBoss: true, bossHealth: 3000 },
        { number: 11, monsters: 30, monsterHealth: 70, monsterDamage: 11, goldReward: 140, isBoss: false },
        { number: 12, monsters: 32, monsterHealth: 75, monsterDamage: 12, goldReward: 150, isBoss: false },
        { number: 13, monsters: 34, monsterHealth: 80, monsterDamage: 13, goldReward: 160, isBoss: false },
        { number: 14, monsters: 36, monsterHealth: 85, monsterDamage: 14, goldReward: 170, isBoss: false },
        { number: 15, monsters: 38, monsterHealth: 90, monsterDamage: 15, goldReward: 180, isBoss: false },
        { number: 16, monsters: 40, monsterHealth: 95, monsterDamage: 16, goldReward: 190, isBoss: false },
        { number: 17, monsters: 42, monsterHealth: 100, monsterDamage: 17, goldReward: 200, isBoss: false },
        { number: 18, monsters: 44, monsterHealth: 110, monsterDamage: 18, goldReward: 210, isBoss: false },
        { number: 19, monsters: 46, monsterHealth: 120, monsterDamage: 19, goldReward: 220, isBoss: false },
        { number: 20, monsters: 25, monsterHealth: 60, monsterDamage: 18, goldReward: 500, isBoss: true, bossHealth: 5000 },
        { number: 21, monsters: 55, monsterHealth: 130, monsterDamage: 20, goldReward: 240, isBoss: false },
        { number: 22, monsters: 60, monsterHealth: 140, monsterDamage: 21, goldReward: 260, isBoss: false },
        { number: 23, monsters: 65, monsterHealth: 150, monsterDamage: 22, goldReward: 280, isBoss: false },
        { number: 24, monsters: 70, monsterHealth: 160, monsterDamage: 23, goldReward: 300, isBoss: false },
        { number: 25, monsters: 75, monsterHealth: 170, monsterDamage: 24, goldReward: 320, isBoss: false },
        { number: 26, monsters: 80, monsterHealth: 180, monsterDamage: 25, goldReward: 340, isBoss: false },
        { number: 27, monsters: 85, monsterHealth: 200, monsterDamage: 26, goldReward: 360, isBoss: false },
        { number: 28, monsters: 90, monsterHealth: 220, monsterDamage: 27, goldReward: 380, isBoss: false },
        { number: 29, monsters: 95, monsterHealth: 250, monsterDamage: 28, goldReward: 400, isBoss: false },
        { number: 30, monsters: 35, monsterHealth: 100, monsterDamage: 25, goldReward: 1000, isBoss: true, bossHealth: 10000 },
        { number: 31, monsters: 100, monsterHealth: 300, monsterDamage: 28, goldReward: 450, isBoss: false }
    ],
    STAT_BUFFS: [
        { id: 'health_boost', name: 'Health Boost', description: 'Increase max health by 10%', icon: '❤️', effect: { maxHealthPercent: 0.1, healthPercent: 0.1 } },
        { id: 'damage_boost', name: 'Damage Boost', description: 'Increase damage by 10%', icon: '⚔️', effect: { damagePercent: 0.1 } },
        { id: 'speed_boost', name: 'Speed Boost', description: 'Increase speed by 10%', icon: '👟', effect: { speedPercent: 0.1 } },
        { id: 'life_steal', name: 'Life Steal', description: 'Heal for 1% of damage dealt', icon: '🦇', effect: { lifeSteal: 0.01 } },
        { id: 'critical_chance', name: 'Critical Strike', description: '5% chance for double damage', icon: '🎯', effect: { criticalChance: 0.05 } },
        { id: 'gold_bonus', name: 'Gold Bonus', description: 'Earn 10% more gold', icon: '💰', effect: { goldMultiplier: 0.1 } },
        { id: 'regen', name: 'Health Regen', description: 'Regenerate 1% HP per second', icon: '🔄', effect: { healthRegenPercent: 0.01 } },
        { id: 'armor', name: 'Armor', description: 'Reduce damage taken by 3%', icon: '🛡️', effect: { damageReduction: 0.03 } },
        { id: 'reload_speed', name: 'Quick Hands', description: 'Reload weapons 15% faster (stacks)', icon: '⚡', effect: { reloadSpeedMultiplier: 0.15 } }
    ],
    WEAPONS: [
        { id: 'handgun', name: 'Handgun', icon: '🔫', type: 'ranged', baseDamage: 7, attackSpeed: 1.0, range: 300, projectileSpeed: 10, cost: 0, description: 'Basic starting weapon', projectileColor: '#FFD700', animation: 'bullet', usesAmmo: true, magazineSize: 8, reloadTime: 1500, spread: 0.05, tierMultipliers: { damage: [1, 1.2, 1.4, 1.7, 2.1, 2.5], attackSpeed: [1, 1.1, 1.2, 1.3, 1.4, 1.5], magazine: [1, 1.2, 1.4, 1.6, 1.8, 2.0] } },
        { id: 'shotgun', name: 'Shotgun', icon: '🔫', type: 'ranged', baseDamage: 4, attackSpeed: 0.8, range: 200, projectileSpeed: 8, cost: 95, description: '10 pellets in wide arc', projectileColor: '#FF6B6B', animation: 'shotgun', pelletCount: 10, spreadAngle: 60, usesAmmo: true, magazineSize: 6, reloadTime: 2000, spread: 0.2, tierMultipliers: { damage: [1, 1.3, 1.6, 2.0, 2.5, 3.0], attackSpeed: [1, 1.05, 1.1, 1.15, 1.2, 1.25], pelletCount: [1, 1, 1, 1.2, 1.4, 1.6], magazine: [1, 1.1, 1.2, 1.3, 1.4, 1.5] } },
        { id: 'machinegun', name: 'Machine Gun', icon: '🔫', type: 'ranged', baseDamage: 3, attackSpeed: 5.0, range: 275, projectileSpeed: 15, cost: 120, description: 'Very fast attacks', projectileColor: '#4ECDC4', animation: 'bullet', usesAmmo: true, magazineSize: 50, reloadTime: 2500, spread: 0.75, tierMultipliers: { damage: [1, 1.1, 1.2, 1.3, 1.4, 1.5], attackSpeed: [1, 1.2, 1.4, 1.6, 1.8, 2.0], magazine: [1, 1.3, 1.6, 1.9, 2.2, 2.5] } },
        { id: 'laser', name: 'Energy Gun', icon: '⚡', type: 'ranged', baseDamage: 8, attackSpeed: 2.0, range: 400, projectileSpeed: 20, cost: 150, description: 'Bounces between enemies', projectileColor: '#00FFFF', animation: 'laser', bounceCount: 3, bounceRange: 100, usesAmmo: true, magazineSize: 15, reloadTime: 1800, spread: 0, tierMultipliers: { damage: [1, 1.2, 1.4, 1.7, 2.0, 2.4], attackSpeed: [1, 1.1, 1.2, 1.3, 1.4, 1.5], bounceCount: [1, 1, 2, 2, 3, 4], magazine: [1, 1.2, 1.4, 1.6, 1.8, 2.0] } },
        { id: 'boomerang', name: 'Boomerang', icon: '🪃', type: 'ranged', baseDamage: 5, attackSpeed: 1.2, range: 450, projectileSpeed: 10, returnSpeed: 15, cost: 95, description: 'Throws a returning boomerang', projectileColor: '#8B4513', animation: 'boomerang', usesAmmo: false, maxTargets: 4, spread: 0, tierMultipliers: { damage: [1, 1.3, 1.6, 2.0, 2.4, 2.9], attackSpeed: [1, 1.1, 1.2, 1.3, 1.4, 1.5], range: [1, 1.1, 1.2, 1.3, 1.4, 1.5], maxTargets: [1, 1, 2, 2, 3, 4] } },
        { id: 'throwing_knives', name: 'Throwing Knives', icon: '🔪', type: 'ranged', baseDamage: 7, attackSpeed: 2.0, range: 250, projectileSpeed: 12, cost: 55, description: 'Limited knives per round', projectileColor: '#C0C0C0', animation: 'knife', usesAmmo: true, magazineSize: 7, reloadTime: 0, isThrowable: true, resetEachRound: true, spread: 0.02, tierMultipliers: { damage: [1, 1.2, 1.4, 1.7, 2.0, 2.4], attackSpeed: [1, 1.1, 1.2, 1.3, 1.4, 1.5], magazine: [1, 1.4, 1.8, 2.2, 2.6, 3.0], range: [1, 1.1, 1.2, 1.3, 1.4, 1.5] } },
        { id: 'sniper', name: 'Sniper Rifle', icon: '🎯', type: 'ranged', baseDamage: 35, attackSpeed: 0.5, range: 500, projectileSpeed: 20, cost: 180, description: 'Long range, targets highest HP', projectileColor: '#FF4500', animation: 'sniper', usesAmmo: true, magazineSize: 3, reloadTime: 2500, spread: 0, sniper: true, tierMultipliers: { damage: [1, 1.4, 1.8, 2.3, 2.9, 3.5], attackSpeed: [1, 1.1, 1.2, 1.3, 1.4, 1.5], magazine: [1, 1, 1.2, 1.4, 1.6, 1.8] } },
        { id: 'crossbow', name: 'Crossbow', icon: '🏹', type: 'ranged', baseDamage: 18, attackSpeed: 1.2, range: 350, projectileSpeed: 15, cost: 120, description: 'Pierces through enemies', projectileColor: '#8B4513', animation: 'bolt', usesAmmo: true, magazineSize: 1, reloadTime: 1200, spread: 0, pierceCount: 3, tierMultipliers: { damage: [1, 1.3, 1.6, 2.0, 2.5, 3.0], attackSpeed: [1, 1.1, 1.2, 1.3, 1.4, 1.5], pierceCount: [1, 2, 2, 3, 3, 4] } },
        { id: 'sword', name: 'Iron Sword', icon: '⚔️', type: 'melee', meleeType: 'single', baseDamage: 10, attackSpeed: 1.2, range: 100, cost: 60, description: 'Swing a longsword in an arc', usesAmmo: false, tierMultipliers: { damage: [1, 1.3, 1.6, 2.0, 2.5, 3.0], attackSpeed: [1, 1.1, 1.2, 1.3, 1.4, 1.5], range: [1, 1.1, 1.2, 1.3, 1.4, 1.5] } },
        { id: 'axe', name: 'Battle Axe', icon: '🪓', type: 'melee', meleeType: 'aoe', baseDamage: 12, attackSpeed: 0.8, range: 80, cost: 100, description: '360° spinning axe', usesAmmo: false, tierMultipliers: { damage: [1, 1.4, 1.8, 2.3, 2.9, 3.5], attackSpeed: [1, 1.05, 1.1, 1.15, 1.2, 1.25], range: [1, 1.1, 1.2, 1.3, 1.3, 1.3] } },
        { id: 'dual_daggers', name: 'Dual Daggers', icon: '🗡️🗡️', type: 'melee', meleeType: 'single', baseDamage: 5, attackSpeed: 3.0, range: 60, cost: 90, description: 'Two fast daggers', usesAmmo: false, dualStrike: true, tierMultipliers: { damage: [1, 1.2, 1.4, 1.7, 2.0, 2.4], attackSpeed: [1, 1.2, 1.4, 1.6, 1.8, 2.0], range: [1, 1.05, 1.1, 1.15, 1.2, 1.2] } },
        { id: 'dagger', name: 'Swift Dagger', icon: '🗡️', type: 'melee', meleeType: 'single', baseDamage: 6, attackSpeed: 2.0, range: 50, cost: 70, description: 'Quick stabbing dagger', usesAmmo: false, tierMultipliers: { damage: [1, 1.2, 1.4, 1.6, 1.8, 2.0], attackSpeed: [1, 1.2, 1.4, 1.6, 1.8, 2.0], range: [1, 1.05, 1.1, 1.15, 1.2, 1.25] } },
        { id: 'hammer', name: 'War Hammer', icon: '🔨', type: 'melee', meleeType: 'aoe', baseDamage: 15, attackSpeed: 0.5, range: 80, cost: 130, description: 'Massive overhead smash', usesAmmo: false, tierMultipliers: { damage: [1, 1.5, 2.0, 2.6, 3.3, 4.0], attackSpeed: [1, 1.1, 1.2, 1.3, 1.4, 1.5], range: [1, 1.15, 1.3, 1.45, 1.6, 1.75] } },
        { id: 'spear', name: 'Trident', icon: '🔱', type: 'melee', meleeType: 'pierce', baseDamage: 10, attackSpeed: 1.0, range: 100, cost: 110, description: 'Three-pronged thrust', usesAmmo: false, pierceCount: 3, tierMultipliers: { damage: [1, 1.3, 1.6, 2.0, 2.5, 3.0], attackSpeed: [1, 1.1, 1.2, 1.3, 1.4, 1.5], pierceCount: [1, 1, 2, 2, 3, 4], range: [1, 1.1, 1.2, 1.3, 1.4, 1.5] } }
    ],
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

// ============================================
// MONSTER TYPES
// ============================================

const MONSTER_TYPES = {
    NORMAL: { name: 'Normal', color: '#ff6b6b', speed: 1, healthMultiplier: 1, damageMultiplier: 1, sizeMultiplier: 1, icon: '👾', goldDrop: { min: 5, max: 15 } },
    FAST: { name: 'Fast', color: '#4ecdc4', speed: 2.5, healthMultiplier: 0.7, damageMultiplier: 0.8, sizeMultiplier: 0.8, icon: '⚡', goldDrop: { min: 3, max: 10 } },
    TANK: { name: 'Tank', color: '#ffa500', speed: 0.5, healthMultiplier: 2.5, damageMultiplier: 1.2, sizeMultiplier: 1.4, icon: '🛡️', goldDrop: { min: 8, max: 20 } },
    EXPLOSIVE: { name: 'Explosive', color: '#ff0000', speed: 1, healthMultiplier: 0.8, damageMultiplier: 1.5, sizeMultiplier: 1, icon: '💥', explosive: true, explosionRadius: 100, explosionDamage: 3.0, goldDrop: { min: 10, max: 25 } },
    GUNNER: { name: 'Gunner', color: '#ff69b4', speed: 0.9, healthMultiplier: 0.9, damageMultiplier: 1.2, sizeMultiplier: 0.9, icon: '🔫', ranged: true, projectileDamage: 8, projectileSpeed: 5, attackRange: 270, projectileColor: '#ff69b4', attackCooldown: 3000, goldDrop: { min: 12, max: 30 } },
    MINION: { name: 'Minion', color: '#9370db', speed: 1.5, healthMultiplier: 0.2, damageMultiplier: 0.4, sizeMultiplier: 0.5, icon: '👾', isMinion: true, goldDrop: { min: 1, max: 5 } },
    SPLITTER: { name: 'Splitter', color: '#00ff00', speed: 1.2, healthMultiplier: 0.6, damageMultiplier: 0.7, sizeMultiplier: 0.9, icon: '🔀', isSplitter: true, splitCount: 2, splitHealthPercent: 0.5, goldDrop: { min: 15, max: 25 } },
    DASHER: { name: 'Dasher', color: '#00ffff', speed: 1.5, dashSpeed: 4.0, healthMultiplier: 0.5, damageMultiplier: 1.3, sizeMultiplier: 0.8, icon: '⚡', isDasher: true, dashCooldown: 3000, dashRange: 300, goldDrop: { min: 20, max: 35 } },
    VAMPIRE: { name: 'Vampire', color: '#8B008B', speed: 1.2, healthMultiplier: 1.2, damageMultiplier: 1.1, sizeMultiplier: 0.9, icon: '🧛', isVampire: true, lifeSteal: 0.2, goldDrop: { min: 15, max: 35 } },
    BOSS: { name: 'BOSS', color: '#ffd700', speed: 0.7, healthMultiplier: 15, damageMultiplier: 2.0, sizeMultiplier: 2.2, icon: '👑', isBoss: true, lifeSteal: 0.1, projectileSpeed: 5, projectileDamage: 15, projectileCooldown: 2000, goldDrop: { min: 100, max: 300 } }
};

// ============================================
// BOSS WEAPONS
// ============================================

const BOSS_WEAPONS = {
    DAGGER: { name: 'Shadow Dagger', type: 'melee', meleeType: 'pierce', baseDamage: 25, attackSpeed: 2.0, range: 150, description: 'Quick stabbing attacks', swingColor: '#8B0000', swingAngle: 45, animation: 'daggerStab', trailColor: '#FF0000', bladeColor: '#8B0000', hiltColor: '#4A0404', sparkleColor: '#FF4444', pierceCount: 3 },
    WAR_HAMMER: { name: 'Crusher', type: 'melee', meleeType: 'aoe', baseDamage: 40, attackSpeed: 0.8, range: 180, description: 'Massive AOE slam', swingColor: '#8B4513', swingAngle: 360, animation: 'hammerSmash', trailColor: '#FF4500', headColor: '#696969', handleColor: '#8B4513', shockwaveColor: '#FF4500', shockwaveIntensity: 2.5 },
    SCYTHE: { name: 'Soul Reaper', type: 'melee', meleeType: 'aoe', baseDamage: 35, attackSpeed: 1.2, range: 250, description: 'Dashing scythe slash with lifesteal', swingColor: '#4B0082', swingAngle: 270, animation: 'scytheSwing', trailColor: '#9400D3', bladeColor: '#4B0082', handleColor: '#2F4F4F', edgeColor: '#FF00FF', sparkleColor: '#FF69B4', dashRange: 500, dashSpeed: 15, lifeSteal: 0.15 }
};

// ============================================
// WAVE COMPOSITIONS (Normal monsters only for boss waves)
// ============================================

const WAVE_COMPOSITIONS = {
    1: { normal: 5, fast: 0, tank: 0, explosive: 0, gunner: 0, splitter: 0, dasher: 0, vampire: 0 },
    2: { normal: 5, fast: 2, tank: 0, explosive: 0, gunner: 0, splitter: 0, dasher: 0, vampire: 0 },
    3: { normal: 6, fast: 2, tank: 1, explosive: 0, gunner: 0, splitter: 0, dasher: 0, vampire: 0 },
    4: { normal: 6, fast: 3, tank: 1, explosive: 1, gunner: 0, splitter: 0, dasher: 0, vampire: 0 },
    5: { normal: 7, fast: 3, tank: 2, explosive: 1, gunner: 0, splitter: 0, dasher: 0, vampire: 1 },
    6: { normal: 7, fast: 4, tank: 2, explosive: 1, gunner: 1, splitter: 0, dasher: 0, vampire: 1 },
    7: { normal: 8, fast: 4, tank: 2, explosive: 2, gunner: 1, splitter: 0, dasher: 0, vampire: 1 },
    8: { normal: 8, fast: 5, tank: 3, explosive: 2, gunner: 1, splitter: 0, dasher: 0, vampire: 1 },
    9: { normal: 9, fast: 5, tank: 3, explosive: 2, gunner: 2, splitter: 0, dasher: 0, vampire: 2 },
    10: { normal: 15, fast: 0, tank: 0, explosive: 0, gunner: 0, splitter: 0, dasher: 0, vampire: 0 },
    11: { normal: 8, fast: 5, tank: 3, explosive: 2, gunner: 2, splitter: 2, dasher: 2, vampire: 2 },
    12: { normal: 9, fast: 5, tank: 3, explosive: 2, gunner: 2, splitter: 2, dasher: 3, vampire: 2 },
    13: { normal: 9, fast: 6, tank: 4, explosive: 3, gunner: 2, splitter: 2, dasher: 2, vampire: 2 },
    14: { normal: 10, fast: 6, tank: 4, explosive: 3, gunner: 3, splitter: 2, dasher: 2, vampire: 2 },
    15: { normal: 10, fast: 7, tank: 4, explosive: 3, gunner: 3, splitter: 3, dasher: 2, vampire: 3 },
    16: { normal: 11, fast: 7, tank: 5, explosive: 4, gunner: 3, splitter: 2, dasher: 2, vampire: 3 },
    17: { normal: 11, fast: 8, tank: 5, explosive: 4, gunner: 4, splitter: 2, dasher: 2, vampire: 3 },
    18: { normal: 12, fast: 8, tank: 6, explosive: 4, gunner: 4, splitter: 2, dasher: 2, vampire: 3 },
    19: { normal: 12, fast: 9, tank: 6, explosive: 5, gunner: 4, splitter: 2, dasher: 2, vampire: 4 },
    20: { normal: 25, fast: 0, tank: 0, explosive: 0, gunner: 0, splitter: 0, dasher: 0, vampire: 0 },
    21: { normal: 13, fast: 9, tank: 7, explosive: 5, gunner: 5, splitter: 4, dasher: 4, vampire: 3 },
    22: { normal: 14, fast: 10, tank: 7, explosive: 6, gunner: 5, splitter: 4, dasher: 4, vampire: 3 },
    23: { normal: 14, fast: 10, tank: 8, explosive: 6, gunner: 5, splitter: 5, dasher: 4, vampire: 3 },
    24: { normal: 15, fast: 11, tank: 8, explosive: 7, gunner: 5, splitter: 5, dasher: 4, vampire: 3 },
    25: { normal: 15, fast: 11, tank: 9, explosive: 7, gunner: 6, splitter: 4, dasher: 4, vampire: 4 },
    26: { normal: 16, fast: 12, tank: 9, explosive: 8, gunner: 6, splitter: 4, dasher: 4, vampire: 4 },
    27: { normal: 16, fast: 12, tank: 10, explosive: 8, gunner: 7, splitter: 4, dasher: 4, vampire: 4 },
    28: { normal: 17, fast: 13, tank: 10, explosive: 9, gunner: 7, splitter: 4, dasher: 4, vampire: 4 },
    29: { normal: 17, fast: 13, tank: 11, explosive: 9, gunner: 8, splitter: 4, dasher: 4, vampire: 5 },
    30: { normal: 35, fast: 0, tank: 0, explosive: 0, gunner: 0, splitter: 0, dasher: 0, vampire: 0 },
    31: { normal: 18, fast: 14, tank: 12, explosive: 10, gunner: 10, splitter: 8, dasher: 8, vampire: 6 }
};
