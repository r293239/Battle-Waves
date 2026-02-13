// ============================================
// ENHANCED GAME DATA - New Weapons, Items, and Features
// ============================================

const GAME_DATA = {
    // Starting player stats
    PLAYER_START: {
        health: 20,
        maxHealth: 20,
        damage: 5,
        speed: 3,
        gold: 50,
        xp: 0,
        level: 1
    },

    // Monster attack cooldown in milliseconds
    MONSTER_ATTACK_COOLDOWN: 1000,

    // Wave configurations (extended to wave 20)
    WAVES: [
        { number: 1, monsters: 5, monsterHealth: 20, monsterDamage: 2, goldReward: 50, xpReward: 10 },
        { number: 2, monsters: 7, monsterHealth: 25, monsterDamage: 3, goldReward: 60, xpReward: 15 },
        { number: 3, monsters: 9, monsterHealth: 30, monsterDamage: 4, goldReward: 70, xpReward: 20 },
        { number: 4, monsters: 11, monsterHealth: 35, monsterDamage: 5, goldReward: 80, xpReward: 25 },
        { number: 5, monsters: 13, monsterHealth: 40, monsterDamage: 6, goldReward: 90, xpReward: 30 },
        { number: 6, monsters: 15, monsterHealth: 45, monsterDamage: 7, goldReward: 100, xpReward: 35 },
        { number: 7, monsters: 17, monsterHealth: 50, monsterDamage: 8, goldReward: 110, xpReward: 40 },
        { number: 8, monsters: 19, monsterHealth: 55, monsterDamage: 9, goldReward: 120, xpReward: 45 },
        { number: 9, monsters: 21, monsterHealth: 60, monsterDamage: 10, goldReward: 130, xpReward: 50 },
        { number: 10, monsters: 1, monsterHealth: 2000, monsterDamage: 15, goldReward: 500, xpReward: 200, isBoss: true, bossType: 'FIRE' },
        { number: 11, monsters: 30, monsterHealth: 70, monsterDamage: 11, goldReward: 140, xpReward: 55 },
        { number: 12, monsters: 33, monsterHealth: 75, monsterDamage: 12, goldReward: 150, xpReward: 60 },
        { number: 13, monsters: 36, monsterHealth: 80, monsterDamage: 13, goldReward: 160, xpReward: 65 },
        { number: 14, monsters: 39, monsterHealth: 85, monsterDamage: 14, goldReward: 170, xpReward: 70 },
        { number: 15, monsters: 1, monsterHealth: 3500, monsterDamage: 25, goldReward: 800, xpReward: 300, isBoss: true, bossType: 'ICE' },
        { number: 16, monsters: 45, monsterHealth: 95, monsterDamage: 16, goldReward: 200, xpReward: 80 },
        { number: 17, monsters: 50, monsterHealth: 100, monsterDamage: 18, goldReward: 220, xpReward: 90 },
        { number: 18, monsters: 55, monsterHealth: 110, monsterDamage: 20, goldReward: 240, xpReward: 100 },
        { number: 19, monsters: 60, monsterHealth: 120, monsterDamage: 22, goldReward: 260, xpReward: 110 },
        { number: 20, monsters: 1, monsterHealth: 5000, monsterDamage: 35, goldReward: 1200, xpReward: 500, isBoss: true, bossType: 'VOID' },
    ],

    // New and enhanced stat buffs
    STAT_BUFFS: [
        {
            id: 'health_boost',
            name: 'Health Boost',
            description: 'Increase max health by 15',
            icon: '❤️',
            effect: { maxHealth: 15, health: 15 }
        },
        {
            id: 'damage_boost',
            name: 'Damage Boost',
            description: 'Increase damage by 4',
            icon: '⚔️',
            effect: { damage: 4 }
        },
        {
            id: 'speed_boost',
            name: 'Speed Boost',
            description: 'Increase speed by 1.5',
            icon: '👟',
            effect: { speed: 1.5 }
        },
        {
            id: 'life_steal',
            name: 'Life Steal',
            description: 'Heal for 15% of damage dealt',
            icon: '🦇',
            effect: { lifeSteal: 0.15 }
        },
        {
            id: 'critical_chance',
            name: 'Critical Strike',
            description: '15% chance for double damage',
            icon: '🎯',
            effect: { criticalChance: 0.15 }
        },
        {
            id: 'gold_bonus',
            name: 'Gold Bonus',
            description: 'Earn 30% more gold',
            icon: '💰',
            effect: { goldMultiplier: 0.3 }
        },
        {
            id: 'regen',
            name: 'Health Regen',
            description: 'Regenerate 2 HP per second',
            icon: '🔄',
            effect: { healthRegen: 2 }
        },
        {
            id: 'armor',
            name: 'Armor',
            description: 'Reduce damage taken by 15%',
            icon: '🛡️',
            effect: { damageReduction: 0.15 }
        },
        {
            id: 'reload',
            name: 'Quick Hands',
            description: '20% faster reload speed',
            icon: '⚡',
            effect: { reloadTime: 0.8 }
        },
        {
            id: 'multi_shot',
            name: 'Multi-Shot',
            description: 'Fire 2 projectiles at once',
            icon: '🎯',
            effect: { projectileCount: 1 }
        },
        {
            id: 'pierce',
            name: 'Piercing Shots',
            description: 'Projectiles pierce 1 enemy',
            icon: '🏹',
            effect: { pierceCount: 1 }
        },
        {
            id: 'vampire',
            name: 'Vampire',
            description: '5% chance to instantly kill',
            icon: '🧛',
            effect: { instantKill: 0.05 }
        }
    ],

    // New Weapons
    WEAPONS: [
        // Existing weapons (keep all your current weapons)...
        // Add these new weapons:
        {
            id: 'flamethrower',
            name: 'Flamethrower',
            icon: '🔥',
            type: 'ranged',
            baseDamage: 2,
            attackSpeed: 10.0,
            range: 150,
            projectileSpeed: 5,
            cost: 150,
            description: 'Continuous flame that burns enemies',
            projectileColor: '#FF4500',
            animation: 'flame',
            usesAmmo: true,
            magazineSize: 100,
            reloadTime: 3000,
            damageOverTime: true,
            dotDamage: 1,
            dotDuration: 2000,
            tierMultipliers: {
                damage: [1, 1.2, 1.4, 1.7, 2.0, 2.5],
                attackSpeed: [1, 1.1, 1.2, 1.3, 1.4, 1.5],
                dotDamage: [1, 1.3, 1.6, 2.0, 2.5, 3.0],
                magazine: [1, 1.2, 1.4, 1.6, 1.8, 2.0]
            }
        },
        {
            id: 'ice_staff',
            name: 'Ice Staff',
            icon: '❄️',
            type: 'ranged',
            baseDamage: 4,
            attackSpeed: 2.0,
            range: 300,
            projectileSpeed: 8,
            cost: 130,
            description: 'Slows enemies on hit',
            projectileColor: '#00FFFF',
            animation: 'ice',
            slowAmount: 0.5,
            slowDuration: 1000,
            usesAmmo: true,
            magazineSize: 20,
            reloadTime: 2000,
            tierMultipliers: {
                damage: [1, 1.2, 1.4, 1.7, 2.0, 2.4],
                attackSpeed: [1, 1.1, 1.2, 1.3, 1.4, 1.5],
                slowAmount: [0.5, 0.55, 0.6, 0.65, 0.7, 0.75],
                magazine: [1, 1.1, 1.2, 1.3, 1.4, 1.5]
            }
        },
        {
            id: 'grenade_launcher',
            name: 'Grenade Launcher',
            icon: '💣',
            type: 'ranged',
            baseDamage: 20,
            attackSpeed: 0.5,
            range: 350,
            projectileSpeed: 6,
            cost: 200,
            description: 'Explodes on impact',
            projectileColor: '#FF8C00',
            animation: 'grenade',
            explosionRadius: 80,
            explosionDamage: 15,
            usesAmmo: true,
            magazineSize: 4,
            reloadTime: 3000,
            tierMultipliers: {
                damage: [1, 1.3, 1.6, 2.0, 2.5, 3.0],
                explosionRadius: [1, 1.1, 1.2, 1.3, 1.5, 1.7],
                explosionDamage: [1, 1.2, 1.4, 1.7, 2.0, 2.5],
                magazine: [1, 1, 1.2, 1.4, 1.6, 1.8]
            }
        },
        {
            id: 'lightning_rod',
            name: 'Lightning Rod',
            icon: '⚡',
            type: 'ranged',
            baseDamage: 15,
            attackSpeed: 0.8,
            range: 400,
            projectileSpeed: 30,
            cost: 250,
            description: 'Chains lightning between enemies',
            projectileColor: '#FFD700',
            animation: 'lightning',
            chainCount: 3,
            chainRange: 100,
            chainDamageReduction: 0.7,
            usesAmmo: true,
            magazineSize: 10,
            reloadTime: 2000,
            tierMultipliers: {
                damage: [1, 1.2, 1.4, 1.7, 2.0, 2.5],
                chainCount: [3, 3, 4, 4, 5, 6],
                chainRange: [1, 1.1, 1.2, 1.3, 1.4, 1.5],
                magazine: [1, 1.1, 1.2, 1.3, 1.4, 1.5]
            }
        },
        
        // New melee weapons
        {
            id: 'dual_blades',
            name: 'Dual Blades',
            icon: '⚔️',
            type: 'melee',
            meleeType: 'dual',
            baseDamage: 6,
            attackSpeed: 3.0,
            range: 60,
            cost: 140,
            description: 'Rapid dual strikes',
            swingColor: '#87CEEB',
            swingAngle: 60,
            animation: 'dualSword',
            trailColor: '#87CEEB',
            bladeColor: '#87CEEB',
            hiltColor: '#8B4513',
            usesAmmo: false,
            tierMultipliers: {
                damage: [1, 1.2, 1.5, 1.8, 2.2, 2.6],
                attackSpeed: [1, 1.1, 1.2, 1.3, 1.4, 1.5],
                range: [1, 1.05, 1.1, 1.15, 1.2, 1.25]
            }
        },
        {
            id: 'chain_sickle',
            name: 'Chain Sickle',
            icon: '⛓️',
            type: 'melee',
            meleeType: 'chain',
            baseDamage: 9,
            attackSpeed: 1.0,
            range: 120,
            cost: 180,
            description: 'Pulls enemies closer',
            swingColor: '#C0C0C0',
            swingAngle: 360,
            animation: 'sickle',
            trailColor: '#C0C0C0',
            pullStrength: 0.5,
            usesAmmo: false,
            tierMultipliers: {
                damage: [1, 1.2, 1.4, 1.7, 2.0, 2.5],
                attackSpeed: [1, 1.1, 1.2, 1.3, 1.4, 1.5],
                range: [1, 1.1, 1.2, 1.3, 1.4, 1.5],
                pullStrength: [0.5, 0.55, 0.6, 0.65, 0.7, 0.8]
            }
        }
    ],

    // New Items
    ITEMS: [
        // Existing items...
        {
            id: 'health_potion',
            name: 'Health Potion',
            icon: '❤️',
            type: 'consumable',
            cost: 40,
            description: 'Restore 25 health'
        },
        {
            id: 'damage_orb',
            name: 'Damage Orb',
            icon: '💎',
            type: 'permanent',
            cost: 100,
            description: 'Permanently +6 damage'
        },
        {
            id: 'speed_boots',
            name: 'Speed Boots',
            icon: '👟',
            type: 'permanent',
            cost: 80,
            description: 'Permanently +2.5 speed'
        },
        {
            id: 'health_upgrade',
            name: 'Health Upgrade',
            icon: '🛡️',
            type: 'permanent',
            cost: 120,
            description: 'Permanently +40 max health'
        },
        {
            id: 'ammo_pack',
            name: 'Ammo Pack',
            icon: '📦',
            type: 'consumable',
            cost: 30,
            description: 'Fully reload all ranged weapons'
        },
        // New items
        {
            id: 'crit_gloves',
            name: 'Crit Gloves',
            icon: '🧤',
            type: 'permanent',
            cost: 150,
            description: '+10% critical hit chance'
        },
        {
            id: 'life_steal_ring',
            name: 'Life Steal Ring',
            icon: '💍',
            type: 'permanent',
            cost: 180,
            description: 'Heal 5% of damage dealt'
        },
        {
            id: 'defense_amulet',
            name: 'Defense Amulet',
            icon: '📿',
            type: 'permanent',
            cost: 200,
            description: 'Reduce damage by 15%'
        },
        {
            id: 'explosive_bomb',
            name: 'Explosive Bomb',
            icon: '💥',
            type: 'consumable',
            cost: 100,
            description: 'Deals 50 damage to all enemies'
        },
        {
            id: 'freeze_grenade',
            name: 'Freeze Grenade',
            icon: '❄️',
            type: 'consumable',
            cost: 80,
            description: 'Freezes all enemies for 3 seconds'
        },
        {
            id: 'rage_potion',
            name: 'Rage Potion',
            icon: '⚡',
            type: 'consumable',
            cost: 120,
            description: '+100% damage for 10 seconds'
        },
        {
            id: 'shield_potion',
            name: 'Shield Potion',
            icon: '🛡️',
            type: 'consumable',
            cost: 90,
            description: 'Grants shield for 50% of max health'
        }
    ]
};

// ============================================
// ENHANCED MONSTER TYPES
// ============================================

const MONSTER_TYPES = {
    NORMAL: {
        name: 'Normal',
        color: '#ff6b6b',
        speed: 1,
        healthMultiplier: 1,
        damageMultiplier: 1,
        sizeMultiplier: 1,
        icon: '👾',
        goldMultiplier: 1,
        xpMultiplier: 1
    },
    FAST: {
        name: 'Fast',
        color: '#4ecdc4',
        speed: 2.5,
        healthMultiplier: 0.7,
        damageMultiplier: 0.8,
        sizeMultiplier: 0.8,
        icon: '⚡',
        goldMultiplier: 1.2,
        xpMultiplier: 1.2
    },
    TANK: {
        name: 'Tank',
        color: '#ffa500',
        speed: 0.5,
        healthMultiplier: 2.5,
        damageMultiplier: 1.2,
        sizeMultiplier: 1.4,
        icon: '🛡️',
        goldMultiplier: 1.5,
        xpMultiplier: 1.5
    },
    EXPLOSIVE: {
        name: 'Explosive',
        color: '#ff0000',
        speed: 0.8,
        healthMultiplier: 0.6,
        damageMultiplier: 1.0,
        sizeMultiplier: 1,
        icon: '💥',
        explosive: true,
        explosionRadius: 100,
        explosionDamage: 30,
        explosionDelay: 1000,
        goldMultiplier: 1.3,
        xpMultiplier: 1.3
    },
    HEALER: {
        name: 'Healer',
        color: '#98fb98',
        speed: 0.7,
        healthMultiplier: 1.2,
        damageMultiplier: 0.5,
        sizeMultiplier: 1.1,
        icon: '💚',
        healer: true,
        healAmount: 10,
        healCooldown: 3000,
        goldMultiplier: 1.4,
        xpMultiplier: 1.4
    },
    NINJA: {
        name: 'Ninja',
        color: '#9370db',
        speed: 3.0,
        healthMultiplier: 0.5,
        damageMultiplier: 1.5,
        sizeMultiplier: 0.7,
        icon: '🥷',
        goldMultiplier: 1.6,
        xpMultiplier: 1.6
    },
    VAMPIRE: {
        name: 'Vampire',
        color: '#8b0000',
        speed: 1.2,
        healthMultiplier: 1.3,
        damageMultiplier: 1.2,
        sizeMultiplier: 1,
        icon: '🧛',
        lifeSteal: 0.3,
        goldMultiplier: 1.7,
        xpMultiplier: 1.7
    },
    BOSS_FIRE: {
        name: 'Fire Boss',
        color: '#ff4500',
        speed: 1.5,
        healthMultiplier: 15,
        damageMultiplier: 2.5,
        sizeMultiplier: 2.5,
        icon: '👑🔥',
        isBoss: true,
        shootsProjectiles: true,
        projectileDamage: 20,
        projectileSpeed: 4,
        projectileCount: 3,
        projectileSpread: 30,
        projectileCooldown: 1000,
        goldMultiplier: 5,
        xpMultiplier: 5
    },
    BOSS_ICE: {
        name: 'Ice Boss',
        color: '#00bfff',
        speed: 1,
        healthMultiplier: 20,
        damageMultiplier: 2,
        sizeMultiplier: 2.5,
        icon: '👑❄️',
        isBoss: true,
        shootsProjectiles: true,
        projectileDamage: 15,
        projectileSpeed: 6,
        projectileCount: 5,
        projectileSpread: 45,
        projectileCooldown: 1500,
        slowProjectiles: true,
        goldMultiplier: 6,
        xpMultiplier: 6
    },
    BOSS_VOID: {
        name: 'Void Boss',
        color: '#800080',
        speed: 0.8,
        healthMultiplier: 25,
        damageMultiplier: 3,
        sizeMultiplier: 3,
        icon: '👑🌑',
        isBoss: true,
        shootsProjectiles: true,
        projectileDamage: 30,
        projectileSpeed: 5,
        projectileCount: 8,
        projectileSpread: 360,
        projectileCooldown: 800,
        homingProjectiles: true,
        goldMultiplier: 7,
        xpMultiplier: 7
    }
};

// ============================================
// BOSS PROJECTILE CLASS
// ============================================

class BossProjectile {
    constructor(boss, target, type) {
        this.x = boss.x;
        this.y = boss.y;
        this.target = target;
        this.type = type;
        
        const angle = Math.atan2(target.y - boss.y, target.x - boss.x);
        this.angle = angle;
        
        this.speed = boss.projectileSpeed || 5;
        this.damage = boss.projectileDamage || 15;
        this.radius = 6;
        
        if (type === 'FIRE') {
            this.color = '#ff4500';
            this.trailColor = '#ff8c00';
            this.dotDamage = 2;
            this.dotDuration = 2000;
        } else if (type === 'ICE') {
            this.color = '#00bfff';
            this.trailColor = '#87ceeb';
            this.slowAmount = 0.5;
            this.slowDuration = 1000;
        } else if (type === 'VOID') {
            this.color = '#800080';
            this.trailColor = '#9370db';
            this.homing = true;
            this.homingStrength = 0.05;
        }
        
        this.startTime = Date.now();
        this.lifetime = 5000;
    }
    
    update() {
        if (this.homing && this.target && this.target.health > 0) {
            const targetAngle = Math.atan2(this.target.y - this.y, this.target.x - this.x);
            let angleDiff = targetAngle - this.angle;
            
            // Normalize angle difference
            while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
            while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
            
            this.angle += angleDiff * this.homingStrength;
        }
        
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
    }
    
    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        
        // Trail effect
        for (let i = 1; i <= 3; i++) {
            ctx.globalAlpha = 0.3 / i;
            ctx.fillStyle = this.trailColor || this.color;
            ctx.shadowColor = this.color;
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.arc(-Math.cos(this.angle) * this.speed * i * 2, 
                   -Math.sin(this.angle) * this.speed * i * 2, 
                   this.radius - i, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Main projectile
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 15;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Inner core
        ctx.shadowBlur = 10;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(0, 0, this.radius - 2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
}

// ============================================
// ENHANCED GAME STATE
// ============================================

// Add to game state
let xp = 0;
let level = 1;
let xpToNextLevel = 100;
let activeBuffs = [];
let bossProjectiles = [];
let consumableEffects = [];
let freezeTimer = 0;
let rageTimer = 0;
let shield = 0;
let maxShield = 0;

// Add to player object in initGame
player.xp = 0;
player.level = 1;
player.xpToNextLevel = 100;
player.shield = 0;
player.maxShield = 0;
player.projectileCount = 1;
player.pierceCount = 0;
player.instantKill = 0;
player.rageMultiplier = 1;
player.rageTimer = 0;

// ============================================
// FIXED EXPLOSIVE MONSTER IMPLEMENTATION
// ============================================

class ExplosiveMonster {
    constructor(monster) {
        this.monster = monster;
        this.exploding = false;
        this.explosionTimer = 0;
        this.explosionRadius = monster.monsterType.explosionRadius || 100;
        this.explosionDamage = monster.monsterType.explosionDamage || 30;
        this.explosionDelay = monster.monsterType.explosionDelay || 1000;
    }
    
    startExplosion() {
        if (this.exploding) return;
        this.exploding = true;
        this.explosionTimer = Date.now();
        
        // Show warning indicator
        addVisualEffect({
            type: 'explosion_warning',
            x: this.monster.x,
            y: this.monster.y,
            radius: this.explosionRadius,
            startTime: Date.now(),
            duration: this.explosionDelay
        });
        
        // Trigger explosion after delay
        setTimeout(() => {
            if (this.monster.health <= 0) {
                this.explode();
            }
        }, this.explosionDelay);
    }
    
    explode() {
        // Check distance to player
        const dx = player.x - this.monster.x;
        const dy = player.y - this.monster.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < this.explosionRadius) {
            let damage = this.explosionDamage;
            
            // Apply damage reduction
            if (player.damageReduction > 0) {
                damage *= (1 - player.damageReduction);
            }
            
            player.health -= damage;
            createDamageIndicator(player.x, player.y, Math.floor(damage), true);
            
            // Knockback player
            const knockbackAngle = Math.atan2(dy, dx);
            player.x += Math.cos(knockbackAngle) * 50;
            player.y += Math.sin(knockbackAngle) * 50;
            
            // Clamp to canvas
            player.x = Math.max(player.radius, Math.min(canvas.width - player.radius, player.x));
            player.y = Math.max(player.radius, Math.min(canvas.height - player.radius, player.y));
        }
        
        // Damage nearby monsters
        monsters.forEach(monster => {
            if (monster === this.monster) return;
            
            const dx = monster.x - this.monster.x;
            const dy = monster.y - this.monster.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < this.explosionRadius) {
                monster.health -= this.explosionDamage * 0.5;
                createDamageIndicator(monster.x, monster.y, Math.floor(this.explosionDamage * 0.5), true);
                
                if (monster.health <= 0) {
                    handleMonsterDeath(monster);
                }
            }
        });
        
        // Visual effect
        addVisualEffect({
            type: 'explosion',
            x: this.monster.x,
            y: this.monster.y,
            radius: this.explosionRadius,
            color: '#ff0000',
            startTime: Date.now(),
            duration: 300
        });
    }
}

// ============================================
// BOSS PROJECTILE SYSTEM
// ============================================

function updateBossProjectiles() {
    const currentTime = Date.now();
    
    // Bosses shoot projectiles
    monsters.forEach(monster => {
        if (monster.isBoss && monster.monsterType.shootsProjectiles) {
            if (!monster.lastShot) monster.lastShot = 0;
            
            const cooldown = monster.monsterType.projectileCooldown || 1000;
            
            if (currentTime - monster.lastShot >= cooldown) {
                monster.lastShot = currentTime;
                
                const projectileCount = monster.monsterType.projectileCount || 1;
                const spread = monster.monsterType.projectileSpread || 0;
                
                for (let i = 0; i < projectileCount; i++) {
                    let angle;
                    
                    if (spread === 360) {
                        // Full circle spread
                        angle = (Math.PI * 2 * i) / projectileCount;
                    } else {
                        // Aim at player with spread
                        const baseAngle = Math.atan2(player.y - monster.y, player.x - monster.x);
                        const spreadOffset = (Math.random() - 0.5) * (spread * Math.PI / 180);
                        angle = baseAngle + spreadOffset;
                    }
                    
                    const projectile = new BossProjectile({
                        x: monster.x,
                        y: monster.y,
                        projectileSpeed: monster.monsterType.projectileSpeed || 5,
                        projectileDamage: monster.monsterType.projectileDamage || 15
                    }, player, monster.monsterType.bossType || 'FIRE');
                    
                    projectile.angle = angle;
                    bossProjectiles.push(projectile);
                }
            }
        }
    });
    
    // Update boss projectiles
    for (let i = bossProjectiles.length - 1; i >= 0; i--) {
        const projectile = bossProjectiles[i];
        projectile.update();
        
        // Remove if out of bounds or too old
        if (projectile.x < -50 || projectile.x > canvas.width + 50 ||
            projectile.y < -50 || projectile.y > canvas.height + 50 ||
            Date.now() - projectile.startTime > projectile.lifetime) {
            bossProjectiles.splice(i, 1);
            continue;
        }
        
        // Check collision with player
        const dx = projectile.x - player.x;
        const dy = projectile.y - player.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < player.radius + projectile.radius) {
            let damage = projectile.damage;
            
            // Apply damage reduction
            if (player.damageReduction > 0) {
                damage *= (1 - player.damageReduction);
            }
            
            // Apply shield
            if (player.shield > 0) {
                const shieldDamage = Math.min(player.shield, damage);
                player.shield -= shieldDamage;
                damage -= shieldDamage;
                
                createDamageIndicator(player.x, player.y, shieldDamage, false, '#00ffff');
            }
            
            if (damage > 0) {
                player.health -= damage;
            }
            
            createDamageIndicator(player.x, player.y, Math.floor(damage), false);
            
            // Apply special effects
            if (projectile.dotDamage) {
                // Add burning effect
                player.burning = true;
                player.burnDamage = projectile.dotDamage;
                player.burnEndTime = Date.now() + projectile.dotDuration;
            }
            
            if (projectile.slowAmount) {
                // Slow player
                player.slowed = true;
                player.slowAmount = projectile.slowAmount;
                player.slowEndTime = Date.now() + projectile.slowDuration;
            }
            
            bossProjectiles.splice(i, 1);
            
            if (player.health <= 0) {
                gameOver();
            }
        }
    }
}

// ============================================
// ENHANCED WAVE SPAWNING
// ============================================

function spawnMonster() {
    const waveConfig = getWaveConfig(wave);
    
    let monsterType;
    
    if (waveConfig.isBoss) {
        // Spawn boss with specific type
        switch(waveConfig.bossType) {
            case 'FIRE':
                monsterType = MONSTER_TYPES.BOSS_FIRE;
                break;
            case 'ICE':
                monsterType = MONSTER_TYPES.BOSS_ICE;
                break;
            case 'VOID':
                monsterType = MONSTER_TYPES.BOSS_VOID;
                break;
            default:
                monsterType = MONSTER_TYPES.BOSS_FIRE;
        }
    } else {
        // More varied monster spawning
        const rand = Math.random();
        if (wave < 3) {
            monsterType = MONSTER_TYPES.NORMAL;
        } else if (wave < 6) {
            if (rand < 0.5) monsterType = MONSTER_TYPES.NORMAL;
            else if (rand < 0.7) monsterType = MONSTER_TYPES.FAST;
            else if (rand < 0.9) monsterType = MONSTER_TYPES.TANK;
            else monsterType = MONSTER_TYPES.EXPLOSIVE;
        } else if (wave < 10) {
            if (rand < 0.3) monsterType = MONSTER_TYPES.NORMAL;
            else if (rand < 0.5) monsterType = MONSTER_TYPES.FAST;
            else if (rand < 0.65) monsterType = MONSTER_TYPES.TANK;
            else if (rand < 0.8) monsterType = MONSTER_TYPES.EXPLOSIVE;
            else if (rand < 0.9) monsterType = MONSTER_TYPES.HEALER;
            else monsterType = MONSTER_TYPES.NINJA;
        } else {
            if (rand < 0.2) monsterType = MONSTER_TYPES.NORMAL;
            else if (rand < 0.35) monsterType = MONSTER_TYPES.FAST;
            else if (rand < 0.5) monsterType = MONSTER_TYPES.TANK;
            else if (rand < 0.6) monsterType = MONSTER_TYPES.EXPLOSIVE;
            else if (rand < 0.7) monsterType = MONSTER_TYPES.HEALER;
            else if (rand < 0.8) monsterType = MONSTER_TYPES.NINJA;
            else monsterType = MONSTER_TYPES.VAMPIRE;
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
    
    const monster = {
        x, y,
        radius: waveConfig.isBoss ? 40 : (15 + Math.random() * 10) * monsterType.sizeMultiplier,
        health: health,
        maxHealth: health,
        damage: damage,
        speed: (waveConfig.isBoss ? 0.3 : (1 + wave * 0.05)) * monsterType.speed,
        color: monsterType.color,
        type: monsterType.name,
        monsterType: monsterType,
        lastAttack: 0,
        attackCooldown: waveConfig.isBoss ? 1500 : GAME_DATA.MONSTER_ATTACK_COOLDOWN,
        isBoss: waveConfig.isBoss,
        lastHeal: 0,
        lifeSteal: monsterType.lifeSteal || 0,
        goldValue: Math.floor(10 * (monsterType.goldMultiplier || 1)),
        xpValue: Math.floor(5 * (monsterType.xpMultiplier || 1))
    };
    
    monsters.push(monster);
}

// ============================================
// ENHANCED MONSTER DEATH HANDLER
// ============================================

function handleMonsterDeath(monster) {
    // Handle explosive monster
    if (monster.monsterType && monster.monsterType.explosive) {
        const explosive = new ExplosiveMonster(monster);
        explosive.startExplosion();
    }
    
    // Add visual effect
    addVisualEffect({
        type: 'death',
        x: monster.x,
        y: monster.y,
        color: monster.color,
        startTime: Date.now(),
        duration: 300
    });
    
    // Calculate rewards
    const goldEarned = Math.floor((monster.goldValue || 10) * (1 + player.goldMultiplier));
    gold += goldEarned;
    
    const xpEarned = monster.xpValue || 5;
    xp += xpEarned;
    player.xp += xpEarned;
    
    kills++;
    
    // Level up system
    while (player.xp >= player.xpToNextLevel) {
        player.level++;
        player.xp -= player.xpToNextLevel;
        player.xpToNextLevel = Math.floor(100 * (1 + player.level * 0.2));
        
        // Reward on level up
        player.maxHealth += 10;
        player.health += 10;
        player.baseDamage += 2;
        
        showMessage(`LEVEL UP! Now level ${player.level} ❤️+10 ⚔️+2`);
    }
    
    createGoldPopup(monster.x, monster.y, goldEarned);
    createXPPopup(monster.x, monster.y, xpEarned);
}

// ============================================
// ENHANCED ITEM EFFECTS
// ============================================

function applyItemEffect(item) {
    switch(item.id) {
        case 'health_potion':
            player.health = Math.min(player.maxHealth, player.health + 25);
            createHealthPopup(player.x, player.y, 25);
            break;
        case 'damage_orb':
            player.baseDamage += 6;
            showMessage(`Damage increased to ${player.baseDamage}!`);
            break;
        case 'speed_boots':
            player.speed += 2.5;
            showMessage(`Speed increased to ${player.speed.toFixed(1)}!`);
            break;
        case 'health_upgrade':
            player.maxHealth += 40;
            player.health += 40;
            showMessage(`Max health increased to ${player.maxHealth}!`);
            break;
        case 'ammo_pack':
            player.weapons.forEach(weapon => {
                if (weapon.usesAmmo) {
                    weapon.currentAmmo = weapon.magazineSize;
                    weapon.isReloading = false;
                }
            });
            showMessage("All weapons fully reloaded!");
            break;
        case 'crit_gloves':
            player.criticalChance += 0.1;
            showMessage(`Critical chance: ${Math.floor(player.criticalChance * 100)}%!`);
            break;
        case 'life_steal_ring':
            player.lifeSteal += 0.05;
            showMessage(`Life steal: ${Math.floor(player.lifeSteal * 100)}%!`);
            break;
        case 'defense_amulet':
            player.damageReduction += 0.15;
            showMessage(`Damage reduction: ${Math.floor(player.damageReduction * 100)}%!`);
            break;
        case 'explosive_bomb':
            addVisualEffect({
                type: 'massive_explosion',
                x: player.x,
                y: player.y,
                radius: 200,
                startTime: Date.now(),
                duration: 500
            });
            
            monsters.forEach(monster => {
                const dx = monster.x - player.x;
                const dy = monster.y - player.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 200) {
                    monster.health -= 50;
                    createDamageIndicator(monster.x, monster.y, 50, true);
                    
                    if (monster.health <= 0) {
                        handleMonsterDeath(monster);
                    }
                }
            });
            
            monsters = monsters.filter(m => m.health > 0);
            showMessage("Explosive bomb detonated!");
            break;
        case 'freeze_grenade':
            freezeTimer = 3000; // 3 seconds freeze
            monsters.forEach(monster => {
                monster.slowed = true;
                monster.originalSpeed = monster.speed;
                monster.speed *= 0.1;
                monster.color = '#00bfff';
            });
            showMessage("All enemies frozen for 3 seconds!");
            break;
        case 'rage_potion':
            rageTimer = 10000; // 10 seconds rage
            player.rageMultiplier = 2;
            showMessage("RAGE MODE! 2x damage for 10 seconds!");
            break;
        case 'shield_potion':
            const shieldAmount = Math.floor(player.maxHealth * 0.5);
            player.shield = shieldAmount;
            player.maxShield = shieldAmount;
            showMessage(`Shield gained: ${shieldAmount} HP!`);
            break;
    }
}

// ============================================
// ENHANCED DAMAGE CALCULATION
// ============================================

function calculateDamage(baseDamage, source = 'player') {
    let damage = baseDamage;
    
    // Rage mode
    if (rageTimer > 0 && source === 'player') {
        damage *= player.rageMultiplier;
    }
    
    // Critical hit
    let isCritical = false;
    if (source === 'player' && Math.random() < player.criticalChance) {
        damage *= 2;
        isCritical = true;
    }
    
    // Instant kill
    if (source === 'player' && Math.random() < player.instantKill) {
        return { damage: 999999, isCritical: true, isInstantKill: true };
    }
    
    // Add player base damage
    if (source === 'player') {
        damage += player.baseDamage;
    }
    
    return { damage: Math.floor(damage), isCritical };
}

// ============================================
// ENHANCED DRAW FUNCTIONS
// ============================================

function drawBossProjectiles() {
    bossProjectiles.forEach(projectile => {
        projectile.draw(ctx);
    });
}

function drawXPBar() {
    const barX = 20;
    const barY = canvas.height - 30;
    const barWidth = 200;
    const barHeight = 15;
    
    // Background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(barX, barY, barWidth, barHeight);
    
    // XP fill
    const xpPercent = player.xp / player.xpToNextLevel;
    ctx.fillStyle = '#00ffff';
    ctx.shadowBlur = 5;
    ctx.shadowColor = '#00ffff';
    ctx.fillRect(barX, barY, barWidth * xpPercent, barHeight);
    ctx.shadowBlur = 0;
    
    // Text
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Level ${player.level} - ${Math.floor(xpPercent * 100)}%`, barX, barY - 5);
}

function drawShield() {
    if (player.shield > 0) {
        ctx.save();
        ctx.translate(player.x, player.y);
        
        // Shield ring
        ctx.strokeStyle = '#00ffff';
        ctx.lineWidth = 3;
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#00ffff';
        ctx.beginPath();
        ctx.arc(0, 0, player.radius + 5, 0, Math.PI * 2);
        ctx.stroke();
        
        // Shield amount text
        ctx.fillStyle = '#00ffff';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowBlur = 5;
        ctx.fillText(`🛡️${Math.floor(player.shield)}`, 0, -player.radius - 15);
        
        ctx.restore();
    }
}

function drawBuffs() {
    let y = 100;
    
    if (rageTimer > 0) {
        const remaining = Math.ceil(rageTimer / 1000);
        ctx.fillStyle = '#ff4500';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`⚡ RAGE: ${remaining}s`, canvas.width - 120, y);
        y += 25;
    }
    
    if (freezeTimer > 0) {
        const remaining = Math.ceil(freezeTimer / 1000);
        ctx.fillStyle = '#00bfff';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`❄️ FROZEN: ${remaining}s`, canvas.width - 120, y);
        y += 25;
    }
}

// ============================================
// ENHANCED GAME LOOP
// ============================================

function updateGame(deltaTime) {
    // Update timers
    if (freezeTimer > 0) {
        freezeTimer -= deltaTime;
        if (freezeTimer <= 0) {
            monsters.forEach(monster => {
                if (monster.originalSpeed) {
                    monster.speed = monster.originalSpeed;
                }
                monster.color = monster.monsterType.color;
            });
        }
    }
    
    if (rageTimer > 0) {
        rageTimer -= deltaTime;
        if (rageTimer <= 0) {
            player.rageMultiplier = 1;
            showMessage("Rage mode ended!");
        }
    }
    
    // Player movement
    const dx = mouseX - player.x;
    const dy = mouseY - player.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Apply slow effect
    let currentSpeed = player.speed;
    if (player.slowed && Date.now() < player.slowEndTime) {
        currentSpeed *= (1 - player.slowAmount);
    } else {
        player.slowed = false;
    }
    
    if (distance > currentSpeed) {
        player.x += (dx / distance) * currentSpeed;
        player.y += (dy / distance) * currentSpeed;
    }
    
    player.x = Math.max(player.radius, Math.min(canvas.width - player.radius, player.x));
    player.y = Math.max(player.radius, Math.min(canvas.height - player.radius, player.y));
    
    // Burn damage
    if (player.burning && Date.now() < player.burnEndTime) {
        if (!player.lastBurn) player.lastBurn = 0;
        if (Date.now() - player.lastBurn >= 1000) {
            player.health -= player.burnDamage;
            createDamageIndicator(player.x, player.y, player.burnDamage, false, '#ff4500');
            player.lastBurn = Date.now();
            
            if (player.health <= 0) {
                gameOver();
            }
        }
    }
    
    // Health regen
    const currentTime = Date.now();
    if (player.healthRegen > 0 && currentTime - player.lastRegen >= 1000) {
        player.health = Math.min(player.maxHealth, player.health + player.healthRegen);
        player.lastRegen = currentTime;
        createHealthPopup(player.x, player.y, player.healthRegen);
    }
    
    // Update healer monsters
    monsters.forEach(monster => {
        if (monster.monsterType && monster.monsterType.healer) {
            if (!monster.lastHeal) monster.lastHeal = 0;
            if (currentTime - monster.lastHeal >= monster.monsterType.healCooldown) {
                monsters.forEach(other => {
                    if (other !== monster && other.health < other.maxHealth) {
                        const dx = other.x - monster.x;
                        const dy = other.y - monster.y;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        
                        if (distance < 150) {
                            other.health = Math.min(other.maxHealth, other.health + monster.monsterType.healAmount);
                            createHealthPopup(other.x, other.y, monster.monsterType.healAmount);
                            monster.lastHeal = currentTime;
                        }
                    }
                });
            }
        }
    });
    
    updateWeapons();
    updateProjectiles();
    updateMeleeAttacks();
    updateBossProjectiles();
    updateMonsters();
    updateVisualEffects();
    
    if (monsters.length === 0 && spawnIndicators.length === 0) {
        wave++;
        endWave();
    }
    
    updateUI();
}

// ============================================
// ENHANCED UI UPDATE
// ============================================

function updateUI() {
    healthValue.textContent = `${Math.floor(player.health)}/${player.maxHealth}`;
    damageValue.textContent = Math.floor(player.baseDamage * (player.rageMultiplier || 1));
    speedValue.textContent = player.speed.toFixed(1);
    goldValue.textContent = gold;
    waveValue.textContent = wave;
    killsValue.textContent = kills;
    
    // Add shield to health display
    if (player.shield > 0) {
        healthValue.textContent += ` + 🛡️${Math.floor(player.shield)}`;
    }
    
    const healthPercent = (player.health / player.maxHealth) * 100;
    healthFill.style.width = `${healthPercent}%`;
    
    if (healthPercent > 60) {
        healthFill.style.background = 'linear-gradient(90deg, #11998e, #38ef7d)';
    } else if (healthPercent > 30) {
        healthFill.style.background = 'linear-gradient(90deg, #f7971e, #ffd200)';
    } else {
        healthFill.style.background = 'linear-gradient(90deg, #ff416c, #ff4b2b)';
    }
    
    // Add rage effect to damage display
    if (rageTimer > 0) {
        damageValue.style.color = '#ff4500';
        damageValue.style.textShadow = '0 0 10px #ff4500';
    } else {
        damageValue.style.color = '';
        damageValue.style.textShadow = '';
    }
    
    monsterCount.textContent = `Monsters: ${monsters.length}`;
}

// ============================================
// ADDITIONAL POPUP FUNCTIONS
// ============================================

function createXPPopup(x, y, amount) {
    const popup = document.createElement('div');
    popup.className = 'xp-popup';
    popup.textContent = '+' + amount + ' XP';
    popup.style.color = '#00ffff';
    
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
// MODIFIED GAME LOOP TO INCLUDE NEW DRAW FUNCTIONS
// ============================================

// Add these to your existing gameLoop function:
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
    drawBossProjectiles(); // Add this
    drawProjectiles();
    drawMeleeAttacks();
    drawVisualEffects();
    drawPlayer();
    drawShield(); // Add this
    drawXPBar(); // Add this
    drawBuffs(); // Add this
    
    if (gameState === 'wave' || gameState === 'shop' || gameState === 'statSelect') {
        updateWeaponDisplay();
    }
    
    requestAnimationFrame(gameLoop);
}

// ============================================
// ENHANCED VISUAL EFFECTS
// ============================================

function drawVisualEffects() {
    const currentTime = Date.now();
    
    visualEffects.forEach(effect => {
        const progress = (currentTime - effect.startTime) / effect.duration;
        if (progress >= 1) return;
        
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
                
            case 'explosion':
                ctx.shadowBlur = 30;
                ctx.shadowColor = effect.color;
                ctx.fillStyle = `rgba(255, 0, 0, ${alpha})`;
                ctx.beginPath();
                ctx.arc(effect.x, effect.y, effect.radius * progress, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.fillStyle = `rgba(255, 165, 0, ${alpha * 0.7})`;
                ctx.beginPath();
                ctx.arc(effect.x, effect.y, effect.radius * progress * 0.7, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.fillStyle = `rgba(255, 255, 0, ${alpha * 0.5})`;
                ctx.beginPath();
                ctx.arc(effect.x, effect.y, effect.radius * progress * 0.4, 0, Math.PI * 2);
                ctx.fill();
                break;
                
            case 'explosion_warning':
                ctx.strokeStyle = `rgba(255, 0, 0, ${alpha})`;
                ctx.lineWidth = 3;
                ctx.shadowBlur = 15;
                ctx.shadowColor = '#ff0000';
                
                // Pulsing ring
                const pulse = Math.sin(progress * Math.PI * 8) * 0.2 + 0.8;
                ctx.beginPath();
                ctx.arc(effect.x, effect.y, effect.radius * pulse, 0, Math.PI * 2);
                ctx.stroke();
                
                // Warning symbol
                ctx.font = '20px Arial';
                ctx.fillStyle = `rgba(255, 0, 0, ${alpha})`;
                ctx.shadowBlur = 15;
                ctx.fillText('⚠️', effect.x - 15, effect.y - 30);
                break;
                
            case 'massive_explosion':
                ctx.shadowBlur = 40;
                ctx.shadowColor = '#ff0000';
                
                // Multiple rings
                for (let i = 0; i < 3; i++) {
                    const offset = i * 0.3;
                    const ringProgress = Math.max(0, Math.min(1, progress - offset) * 2);
                    if (ringProgress > 0 && ringProgress < 1) {
                        ctx.strokeStyle = `rgba(255, ${100 - i * 30}, 0, ${1 - ringProgress})`;
                        ctx.lineWidth = 4 - i;
                        ctx.beginPath();
                        ctx.arc(effect.x, effect.y, effect.radius * ringProgress, 0, Math.PI * 2);
                        ctx.stroke();
                    }
                }
                break;
        }
        
        ctx.restore();
    });
}

// ============================================
// ADD CSS STYLES FOR NEW POPUPS
// ============================================

const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        0% { opacity: 1; }
        70% { opacity: 1; }
        100% { opacity: 0; }
    }
    
    .xp-popup {
        position: absolute;
        color: #00ffff;
        font-weight: bold;
        font-size: 1.2rem;
        pointer-events: none;
        z-index: 1000;
        animation: floatUp 1s forwards;
        text-shadow: 0 0 10px #00ffff;
    }
    
    .health-popup {
        position: absolute;
        color: #00ff00;
        font-weight: bold;
        font-size: 1.2rem;
        pointer-events: none;
        z-index: 1000;
        animation: floatUp 1s forwards;
        text-shadow: 0 0 10px #00ff00;
    }
    
    .gold-popup {
        position: absolute;
        color: #ffd700;
        font-weight: bold;
        font-size: 1.2rem;
        pointer-events: none;
        z-index: 1000;
        animation: floatUp 1s forwards;
        text-shadow: 0 0 10px #ffd700;
    }
    
    @keyframes floatUp {
        0% { transform: translateY(0); opacity: 1; }
        100% { transform: translateY(-50px); opacity: 0; }
    }
    
    .damage-indicator {
        position: absolute;
        color: #ff0000;
        font-weight: bold;
        font-size: 1.2rem;
        pointer-events: none;
        z-index: 1000;
        animation: fadeOut 1s forwards;
        text-shadow: 0 0 10px #ff0000;
    }
`;
document.head.appendChild(style);

// ============================================
// MODIFIED MONSTER DEATH HANDLER IN EXISTING FUNCTIONS
// ============================================

// Replace the monster death logic in updateProjectiles and updateMeleeAttacks with:
// if (monster.health <= 0) {
//     handleMonsterDeath(monster);
//     monsters.splice(j, 1);
// }

// ============================================
// INITIALIZATION WITH NEW STATS
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
        
        // New stats
        xp: 0,
        level: 1,
        xpToNextLevel: 100,
        shield: 0,
        maxShield: 0,
        projectileCount: 1,
        pierceCount: 0,
        instantKill: 0,
        rageMultiplier: 1,
        rageTimer: 0,
        
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
    xp = 0;
    level = 1;
    gameState = 'wave';
    selectedWeaponIndex = -1;
    mergeTargetIndex = -1;
    visualEffects = [];
    bossProjectiles = [];
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

// Export the enhanced game
