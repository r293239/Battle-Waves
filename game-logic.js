// ============================================
// ENHANCED GAME DATA
// ============================================

const GAME_DATA = {
    PLAYER_START: {
        health: 20,
        maxHealth: 20,
        damage: 5,
        speed: 3,
        gold: 50,
        xp: 0,
        level: 1
    },

    MONSTER_ATTACK_COOLDOWN: 1000,

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
        { number: 11, monsters: 25, monsterHealth: 70, monsterDamage: 11, goldReward: 140, xpReward: 55 },
        { number: 12, monsters: 28, monsterHealth: 75, monsterDamage: 12, goldReward: 150, xpReward: 60 },
        { number: 13, monsters: 31, monsterHealth: 80, monsterDamage: 13, goldReward: 160, xpReward: 65 },
        { number: 14, monsters: 34, monsterHealth: 85, monsterDamage: 14, goldReward: 170, xpReward: 70 },
        { number: 15, monsters: 1, monsterHealth: 3500, monsterDamage: 25, goldReward: 800, xpReward: 300, isBoss: true, bossType: 'ICE' },
        { number: 16, monsters: 38, monsterHealth: 95, monsterDamage: 16, goldReward: 200, xpReward: 80 },
        { number: 17, monsters: 42, monsterHealth: 100, monsterDamage: 18, goldReward: 220, xpReward: 90 },
        { number: 18, monsters: 46, monsterHealth: 110, monsterDamage: 20, goldReward: 240, xpReward: 100 },
        { number: 19, monsters: 50, monsterHealth: 120, monsterDamage: 22, goldReward: 260, xpReward: 110 },
        { number: 20, monsters: 1, monsterHealth: 5000, monsterDamage: 35, goldReward: 1200, xpReward: 500, isBoss: true, bossType: 'VOID' },
    ],

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
        }
    ],

    WEAPONS: [
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
        }
    ],

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
        goldValue: 10,
        xpValue: 5
    },
    FAST: {
        name: 'Fast',
        color: '#4ecdc4',
        speed: 2.5,
        healthMultiplier: 0.7,
        damageMultiplier: 0.8,
        sizeMultiplier: 0.8,
        icon: '⚡',
        goldValue: 15,
        xpValue: 8
    },
    TANK: {
        name: 'Tank',
        color: '#ffa500',
        speed: 0.5,
        healthMultiplier: 2.5,
        damageMultiplier: 1.2,
        sizeMultiplier: 1.4,
        icon: '🛡️',
        goldValue: 20,
        xpValue: 10
    },
    EXPLOSIVE: {
        name: 'Explosive',
        color: '#ff0000',
        speed: 0.8,
        healthMultiplier: 0.8,
        damageMultiplier: 1.5,
        sizeMultiplier: 1,
        icon: '💥',
        explosive: true,
        explosionRadius: 120,
        explosionDamage: 40,
        explosionDelay: 1000,
        goldValue: 25,
        xpValue: 15
    },
    BOSS_FIRE: {
        name: 'FIRE BOSS',
        color: '#ff4500',
        speed: 0.3,
        healthMultiplier: 10,
        damageMultiplier: 2,
        sizeMultiplier: 2.5,
        icon: '👑🔥',
        isBoss: true,
        shootsProjectiles: true,
        projectileDamage: 20,
        projectileSpeed: 4,
        projectileCount: 3,
        projectileSpread: 30,
        projectileCooldown: 1000,
        projectileColor: '#ff4500',
        projectileTrail: '#ff8c00',
        goldValue: 100,
        xpValue: 50
    },
    BOSS_ICE: {
        name: 'ICE BOSS',
        color: '#00bfff',
        speed: 0.25,
        healthMultiplier: 12,
        damageMultiplier: 1.8,
        sizeMultiplier: 2.5,
        icon: '👑❄️',
        isBoss: true,
        shootsProjectiles: true,
        projectileDamage: 15,
        projectileSpeed: 5,
        projectileCount: 5,
        projectileSpread: 45,
        projectileCooldown: 1200,
        projectileColor: '#00bfff',
        projectileTrail: '#87ceeb',
        slowAmount: 0.5,
        slowDuration: 2000,
        goldValue: 150,
        xpValue: 75
    },
    BOSS_VOID: {
        name: 'VOID BOSS',
        color: '#800080',
        speed: 0.2,
        healthMultiplier: 15,
        damageMultiplier: 2.5,
        sizeMultiplier: 3,
        icon: '👑🌑',
        isBoss: true,
        shootsProjectiles: true,
        projectileDamage: 25,
        projectileSpeed: 4.5,
        projectileCount: 8,
        projectileSpread: 360,
        projectileCooldown: 800,
        projectileColor: '#800080',
        projectileTrail: '#9370db',
        homing: true,
        homingStrength: 0.05,
        goldValue: 200,
        xpValue: 100
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
        
        this.lastAttackTime = 0;
        
        this.usesAmmo = weaponData.usesAmmo || false;
        if (this.usesAmmo) {
            this.magazineSize = weaponData.magazineSize;
            this.currentAmmo = this.magazineSize;
            this.reloadTime = weaponData.reloadTime;
            this.isReloading = false;
            this.reloadStart = 0;
        }
        
        this.pelletCount = weaponData.pelletCount || 1;
        this.spreadAngle = weaponData.spreadAngle || 0;
        this.bounceCount = weaponData.bounceCount || 0;
        this.bounceRange = weaponData.bounceRange || 0;
        this.pierceCount = weaponData.pierceCount || 1;
        
        this.bladeColor = weaponData.bladeColor || weaponData.swingColor;
        this.hiltColor = weaponData.hiltColor || '#8B4513';
        this.handleColor = weaponData.handleColor || '#654321';
        this.headColor = weaponData.headColor || '#696969';
        this.edgeColor = weaponData.edgeColor || '#CD7F32';
        this.shaftColor = weaponData.shaftColor || '#8B4513';
        this.prongColor = weaponData.prongColor || '#CD7F32';
        this.tipColor = weaponData.tipColor || '#FFD700';
        this.gripColor = weaponData.gripColor || '#8B4513';
        
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
        
        this.tierMultipliers = weaponData.tierMultipliers || {};
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
        }
    }

    canAttack(currentTime) {
        if (this.isReloading) return false;
        if (this.usesAmmo && this.currentAmmo <= 0) {
            this.startReload();
            return false;
        }
        if (this.lastAttackTime > 0 && currentTime - this.lastAttackTime < 5) return false;
        
        const timeSinceLastAttack = currentTime - this.lastAttack;
        const attackCooldown = 1000 / this.attackSpeed;
        return timeSinceLastAttack >= attackCooldown;
    }

    startReload() {
        if (!this.usesAmmo || this.isReloading || this.currentAmmo === this.magazineSize) return;
        
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
        if (this.currentAmmo <= 0) this.startReload();
    }

    attack(playerX, playerY, targetX, targetY) {
        const currentTime = Date.now();
        
        if (this.usesAmmo && !this.isReloading) this.useAmmo();
        
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
                    targetsHit: []
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
                bladeColor: this.bladeColor,
                hiltColor: this.hiltColor,
                handleColor: this.handleColor,
                headColor: this.headColor,
                edgeColor: this.edgeColor,
                shaftColor: this.shaftColor,
                prongColor: this.prongColor,
                tipColor: this.tipColor,
                gripColor: this.gripColor
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
            return 'RANGED';
        }
        if (this.meleeType === 'single') return 'SINGLE';
        if (this.meleeType === 'aoe') return 'AOE 360°';
        if (this.meleeType === 'pierce') return 'PIERCE';
        return 'MELEE';
    }
    
    getDisplayName() {
        if (this.tier === 1) return this.name;
        const tierNames = ['', 'II', 'III', 'IV', 'V', 'VI'];
        return `${this.name} ${tierNames[this.tier]}`;
    }
    
    getMergeCost(otherWeapon) {
        if (this.id !== otherWeapon.id || this.tier !== otherWeapon.tier) return 0;
        if (this.tier >= 5) return 0;
        return Math.floor(this.cost * 0.3 * this.tier);
    }
    
    merge(otherWeapon) {
        if (this.id !== otherWeapon.id || this.tier !== otherWeapon.tier) return null;
        if (this.tier >= 5) return null;
        const baseWeaponData = getWeaponById(this.id);
        return new WeaponInstance(baseWeaponData, this.tier + 1);
    }
}

// ============================================
// EXPLOSIVE MONSTER HANDLER
// ============================================

class ExplosiveMonsterHandler {
    constructor(monster) {
        this.monster = monster;
        this.exploding = false;
        this.explosionTimer = 0;
        this.explosionRadius = monster.monsterType.explosionRadius || 120;
        this.explosionDamage = monster.monsterType.explosionDamage || 40;
        this.explosionDelay = monster.monsterType.explosionDelay || 1000;
    }
    
    startExplosion() {
        if (this.exploding) return;
        this.exploding = true;
        this.explosionTimer = Date.now();
        
        addVisualEffect({
            type: 'explosion_warning',
            x: this.monster.x,
            y: this.monster.y,
            radius: this.explosionRadius,
            startTime: Date.now(),
            duration: this.explosionDelay,
            color: '#ff0000'
        });
        
        setTimeout(() => {
            if (this.monster.health <= 0) {
                this.explode();
            }
        }, this.explosionDelay);
    }
    
    explode() {
        const dx = player.x - this.monster.x;
        const dy = player.y - this.monster.y;
        const distanceToPlayer = Math.sqrt(dx * dx + dy * dy);
        
        if (distanceToPlayer < this.explosionRadius) {
            let damage = this.explosionDamage;
            if (player.damageReduction > 0) {
                damage *= (1 - player.damageReduction);
            }
            
            player.health -= damage;
            createDamageIndicator(player.x, player.y, Math.floor(damage), true, '#ff0000');
            
            const angle = Math.atan2(dy, dx);
            player.x += Math.cos(angle) * 80;
            player.y += Math.sin(angle) * 80;
            
            player.x = Math.max(player.radius, Math.min(canvas.width - player.radius, player.x));
            player.y = Math.max(player.radius, Math.min(canvas.height - player.radius, player.y));
            
            if (player.health <= 0) gameOver();
        }
        
        monsters.forEach(monster => {
            if (monster === this.monster) return;
            
            const dx = monster.x - this.monster.x;
            const dy = monster.y - this.monster.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < this.explosionRadius) {
                monster.health -= this.explosionDamage * 0.5;
                createDamageIndicator(monster.x, monster.y, Math.floor(this.explosionDamage * 0.5), false, '#ff8800');
                if (monster.health <= 0) handleMonsterDeath(monster);
            }
        });
        
        addVisualEffect({
            type: 'explosion',
            x: this.monster.x,
            y: this.monster.y,
            radius: this.explosionRadius,
            color: '#ff0000',
            startTime: Date.now(),
            duration: 500
        });
    }
}

// ============================================
// BOSS PROJECTILE SYSTEM
// ============================================

class BossProjectile {
    constructor(boss, target, bossType) {
        this.x = boss.x;
        this.y = boss.y;
        this.target = target;
        this.bossType = bossType;
        
        const angle = Math.atan2(target.y - boss.y, target.x - boss.x);
        this.angle = angle;
        
        this.speed = boss.monsterType.projectileSpeed || 5;
        this.damage = boss.monsterType.projectileDamage || 15;
        this.radius = 8;
        
        this.color = boss.monsterType.projectileColor || '#ff4500';
        this.trailColor = boss.monsterType.projectileTrail || '#ff8c00';
        
        if (bossType === 'ICE') {
            this.slowAmount = boss.monsterType.slowAmount || 0.5;
            this.slowDuration = boss.monsterType.slowDuration || 2000;
        }
        
        if (bossType === 'VOID') {
            this.homing = boss.monsterType.homing || true;
            this.homingStrength = boss.monsterType.homingStrength || 0.05;
        }
        
        this.startTime = Date.now();
        this.lifetime = 5000;
        this.trail = [];
    }
    
    update() {
        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > 5) this.trail.shift();
        
        if (this.homing && this.target && this.target.health > 0) {
            const targetAngle = Math.atan2(this.target.y - this.y, this.target.x - this.x);
            let angleDiff = targetAngle - this.angle;
            while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
            while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
            this.angle += angleDiff * this.homingStrength;
        }
        
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
    }
    
    draw(ctx) {
        ctx.save();
        
        for (let i = 0; i < this.trail.length; i++) {
            const point = this.trail[i];
            const alpha = i / this.trail.length * 0.5;
            ctx.globalAlpha = alpha;
            ctx.fillStyle = this.trailColor;
            ctx.shadowBlur = 10;
            ctx.shadowColor = this.color;
            ctx.beginPath();
            ctx.arc(point.x, point.y, this.radius * (i / this.trail.length), 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.shadowBlur = 10;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius - 2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
}

// ============================================
// GAME STATE
// ============================================

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
let bossProjectiles = [];
let xp = 0;
let level = 1;
let xpToNextLevel = 100;
let freezeTimer = 0;

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
    
    xp: 0,
    level: 1,
    xpToNextLevel: 100,
    shield: 0,
    maxShield: 0,
    
    weapons: [],
    projectiles: [],
    meleeAttacks: [],
    
    ammoPack: false,
    
    slowed: false,
    slowAmount: 0,
    slowEndTime: 0,
    burning: false,
    burnDamage: 0,
    burnEndTime: 0,
    lastBurn: 0
};

let monsters = [];
let mouseX = 400;
let mouseY = 300;

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
        const scaleFactor = 1 + (waveNumber - 20) * 0.2;
        return {
            number: waveNumber,
            monsters: Math.floor(baseWave.monsters * scaleFactor),
            monsterHealth: Math.floor(baseWave.monsterHealth * scaleFactor),
            monsterDamage: Math.floor(baseWave.monsterDamage * scaleFactor),
            goldReward: Math.floor(baseWave.goldReward * scaleFactor),
            xpReward: Math.floor(baseWave.xpReward * scaleFactor),
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
            shopItems.push({ type: 'weapon', data: weapon });
            availableWeapons.splice(randomIndex, 1);
        }
    }
    
    for (let i = 0; i < 2; i++) {
        if (availableItems.length > 0) {
            const randomIndex = Math.floor(Math.random() * availableItems.length);
            const item = {...availableItems[randomIndex]};
            shopItems.push({ type: 'item', data: item });
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
        xp: 0,
        level: 1,
        xpToNextLevel: 100,
        shield: 0,
        maxShield: 0,
        weapons: [],
        projectiles: [],
        meleeAttacks: [],
        ammoPack: false,
        slowed: false,
        slowAmount: 0,
        slowEndTime: 0,
        burning: false,
        burnDamage: 0,
        burnEndTime: 0,
        lastBurn: 0
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
    freezeTimer = 0;
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
    if (waveConfig.isBoss) monsterCount = 1;
    
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
        waveDisplay.textContent = `BOSS WAVE ${wave} - ${waveConfig.bossType} BOSS!`;
        waveDisplay.classList.add('boss-wave');
    }
    
    waveDisplay.style.opacity = 1;
    
    monsters = [];
    player.projectiles = [];
    player.meleeAttacks = [];
    bossProjectiles = [];
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
        switch(waveConfig.bossType) {
            case 'FIRE': monsterType = MONSTER_TYPES.BOSS_FIRE; break;
            case 'ICE': monsterType = MONSTER_TYPES.BOSS_ICE; break;
            case 'VOID': monsterType = MONSTER_TYPES.BOSS_VOID; break;
            default: monsterType = MONSTER_TYPES.BOSS_FIRE;
        }
    } else {
        const rand = Math.random();
        if (wave < 3) {
            monsterType = MONSTER_TYPES.NORMAL;
        } else if (wave < 6) {
            if (rand < 0.6) monsterType = MONSTER_TYPES.NORMAL;
            else if (rand < 0.8) monsterType = MONSTER_TYPES.FAST;
            else monsterType = MONSTER_TYPES.TANK;
        } else if (wave < 10) {
            if (rand < 0.4) monsterType = MONSTER_TYPES.NORMAL;
            else if (rand < 0.6) monsterType = MONSTER_TYPES.FAST;
            else if (rand < 0.8) monsterType = MONSTER_TYPES.TANK;
            else monsterType = MONSTER_TYPES.EXPLOSIVE;
        } else {
            if (rand < 0.3) monsterType = MONSTER_TYPES.NORMAL;
            else if (rand < 0.5) monsterType = MONSTER_TYPES.FAST;
            else if (rand < 0.7) monsterType = MONSTER_TYPES.TANK;
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
    
    const health = waveConfig.isBoss ? waveConfig.monsterHealth : Math.floor(waveConfig.monsterHealth * monsterType.healthMultiplier);
    const damage = waveConfig.isBoss ? waveConfig.monsterDamage : Math.floor(waveConfig.monsterDamage * monsterType.damageMultiplier);
    
    const monster = {
        x, y,
        radius: waveConfig.isBoss ? 45 : (15 + Math.random() * 10) * monsterType.sizeMultiplier,
        health: health,
        maxHealth: health,
        damage: damage,
        speed: (waveConfig.isBoss ? monsterType.speed : (1 + wave * 0.05)) * monsterType.speed,
        color: monsterType.color,
        type: monsterType.name,
        monsterType: monsterType,
        lastAttack: 0,
        lastShot: 0,
        attackCooldown: waveConfig.isBoss ? 1500 : GAME_DATA.MONSTER_ATTACK_COOLDOWN,
        isBoss: waveConfig.isBoss,
        goldValue: monsterType.goldValue || 10,
        xpValue: monsterType.xpValue || 5,
        explosiveHandler: null
    };
    
    if (monster.monsterType.explosive) {
        monster.explosiveHandler = new ExplosiveMonsterHandler(monster);
    }
    
    monsters.push(monster);
}

// ============================================
// MONSTER DEATH HANDLER
// ============================================

function handleMonsterDeath(monster) {
    if (monster.monsterType && monster.monsterType.explosive && monster.explosiveHandler) {
        monster.explosiveHandler.startExplosion();
    }
    
    addVisualEffect({
        type: 'death',
        x: monster.x,
        y: monster.y,
        color: monster.color,
        startTime: Date.now(),
        duration: 300
    });
    
    const goldEarned = Math.floor((monster.goldValue || 10) * (1 + player.goldMultiplier));
    const xpEarned = monster.xpValue || 5;
    
    gold += goldEarned;
    player.xp += xpEarned;
    kills++;
    
    while (player.xp >= player.xpToNextLevel) {
        player.level++;
        player.xp -= player.xpToNextLevel;
        player.xpToNextLevel = Math.floor(100 * (1 + player.level * 0.2));
        player.maxHealth += 10;
        player.health += 10;
        player.baseDamage += 2;
        showMessage(`LEVEL UP! Level ${player.level} ❤️+10 ⚔️+2`);
        addVisualEffect({
            type: 'level_up',
            x: player.x,
            y: player.y,
            startTime: Date.now(),
            duration: 1000
        });
    }
    
    createGoldPopup(monster.x, monster.y, goldEarned);
    createXPPopup(monster.x, monster.y, xpEarned);
    
    if (monster.isBoss) {
        showMessage(`BOSS DEFEATED! +${goldEarned}g`);
        player.health = Math.min(player.maxHealth, player.health + 50);
        createHealthPopup(player.x, player.y, 50);
    }
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
            if (selectedWeaponIndex === i) slot.classList.add('selected');
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
                setTimeout(() => mergeInfo.style.display = 'none', 3000);
            } else {
                mergeInfo.textContent = firstWeapon.tier >= 5 ? 'Max tier reached!' : 'Cannot merge these weapons';
                mergeInfo.style.display = 'block';
                setTimeout(() => mergeInfo.style.display = 'none', 2000);
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
            createHealthPopup(player.x, player.y, 20);
            break;
        case 'damage_orb':
            player.baseDamage += 5;
            showMessage(`Damage increased to ${player.baseDamage}!`);
            break;
        case 'speed_boots':
            player.speed += 2;
            showMessage(`Speed increased to ${player.speed.toFixed(1)}!`);
            break;
        case 'health_upgrade':
            player.maxHealth += 30;
            player.health += 30;
            showMessage(`Max health increased to ${player.maxHealth}!`);
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
        player.health += buff.effect.health || buff.effect.maxHealth;
    }
    if (buff.effect.damage) player.baseDamage += buff.effect.damage;
    if (buff.effect.speed) player.speed += buff.effect.speed;
    if (buff.effect.lifeSteal) player.lifeSteal += buff.effect.lifeSteal;
    if (buff.effect.criticalChance) player.criticalChance += buff.effect.criticalChance;
    if (buff.effect.goldMultiplier) player.goldMultiplier += buff.effect.goldMultiplier;
    if (buff.effect.healthRegen) player.healthRegen += buff.effect.healthRegen;
    if (buff.effect.damageReduction) player.damageReduction += buff.effect.damageReduction;
    
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
        if (message.parentNode) message.parentNode.removeChild(message);
    }, 2000);
}

function showReloadIndicator(weaponName) {
    if (gameState === 'wave') {
        reloadIndicator.textContent = `${weaponName} - RELOADING...`;
        reloadIndicator.style.display = 'block';
        setTimeout(() => reloadIndicator.style.display = 'none', 1000);
    }
}

// ============================================
// GAME LOOP
// ============================================

function gameLoop() {
    const currentTime = Date.now();
    const deltaTime = currentTime - lastFrameTime;
    lastFrameTime = currentTime;
    
    if (freezeTimer > 0) {
        freezeTimer -= deltaTime;
        if (freezeTimer < 0) freezeTimer = 0;
    }
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    
    if (gameState === 'wave') {
        updateGame(deltaTime);
    }
    
    drawSpawnIndicators();
    drawMonsters();
    drawBossProjectiles();
    drawProjectiles();
    drawMeleeAttacks();
    drawVisualEffects();
    drawPlayer();
    drawShield();
    drawXPBar();
    drawBuffs();
    
    if (gameState === 'wave' || gameState === 'shop' || gameState === 'statSelect') {
        updateWeaponDisplay();
    }
    
    requestAnimationFrame(gameLoop);
}

// ============================================
// DRAW FUNCTIONS
// ============================================

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

function drawShield() {
    if (player.shield > 0) {
        ctx.save();
        ctx.translate(player.x, player.y);
        ctx.strokeStyle = '#00ffff';
        ctx.lineWidth = 3;
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#00ffff';
        ctx.beginPath();
        ctx.arc(0, 0, player.radius + 5, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = '#00ffff';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowBlur = 5;
        ctx.fillText(`🛡️${Math.floor(player.shield)}`, 0, -player.radius - 15);
        ctx.restore();
    }
}

function drawXPBar() {
    const barX = 20;
    const barY = canvas.height - 30;
    const barWidth = 200;
    const barHeight = 15;
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(barX, barY, barWidth, barHeight);
    
    const xpPercent = player.xp / player.xpToNextLevel;
    ctx.fillStyle = '#00ffff';
    ctx.shadowBlur = 5;
    ctx.shadowColor = '#00ffff';
    ctx.fillRect(barX, barY, barWidth * xpPercent, barHeight);
    ctx.shadowBlur = 0;
    
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Level ${player.level} - ${Math.floor(xpPercent * 100)}%`, barX, barY - 5);
}

function drawBuffs() {
    let y = 100;
    if (freezeTimer > 0) {
        const remaining = Math.ceil(freezeTimer / 1000);
        ctx.fillStyle = '#00bfff';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`❄️ FROZEN: ${remaining}s`, canvas.width - 120, y);
        y += 25;
    }
    if (player.slowed && Date.now() < player.slowEndTime) {
        const remaining = Math.ceil((player.slowEndTime - Date.now()) / 1000);
        ctx.fillStyle = '#00bfff';
        ctx.font = 'bold 14px Arial';
        ctx.fillText(`🐌 SLOWED: ${remaining}s`, canvas.width - 120, y);
    }
}

function drawBossProjectiles() {
    bossProjectiles.forEach(projectile => projectile.draw(ctx));
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
        
        if (monster.monsterType && monster.monsterType.icon) {
            ctx.fillStyle = 'white';
            ctx.font = `${monster.radius}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(monster.monsterType.icon, 0, 0);
        }
        
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
            case 'sword': drawSword(ctx, attack, angle, progress, distance, alpha); break;
            case 'axe': drawAxe(ctx, attack, angle, progress, distance, alpha); break;
            case 'dagger': drawDagger(ctx, attack, angle, progress, distance, alpha); break;
            case 'hammer': drawHammer(ctx, attack, angle, progress, distance, alpha); break;
            case 'spear': drawTrident(ctx, attack, angle, progress, distance, alpha); break;
        }
        ctx.restore();
    });
}

function drawSword(ctx, attack, angle, progress, distance, alpha) {
    const swingProgress = Math.sin(progress * Math.PI);
    const currentAngle = angle - 0.5 + swingProgress * 1;
    ctx.rotate(currentAngle);
    ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
    ctx.shadowBlur = 10 * alpha;
    
    ctx.save();
    ctx.translate(10, 0);
    const gradient = ctx.createLinearGradient(0, -5, attack.radius * 0.9, -5);
    gradient.addColorStop(0, '#C0C0C0');
    gradient.addColorStop(1, '#E8E8E8');
    ctx.fillStyle = gradient;
    ctx.shadowColor = 'rgba(192, 192, 192, 0.5)';
    ctx.shadowBlur = 15 * alpha;
    ctx.beginPath();
    ctx.moveTo(0, -5);
    ctx.lineTo(attack.radius * 0.9, -2);
    ctx.lineTo(attack.radius * 0.9, 2);
    ctx.lineTo(0, 5);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, -5);
    ctx.lineTo(attack.radius * 0.9, -2);
    ctx.moveTo(0, 5);
    ctx.lineTo(attack.radius * 0.9, 2);
    ctx.stroke();
    ctx.fillStyle = '#FFD700';
    ctx.shadowColor = 'rgba(255, 215, 0, 0.7)';
    ctx.beginPath();
    ctx.arc(attack.radius * 0.9, 0, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    
    ctx.save();
    ctx.fillStyle = '#8B4513';
    ctx.shadowColor = 'rgba(139, 69, 19, 0.5)';
    ctx.fillRect(-5, -4, 15, 8);
    ctx.fillStyle = '#B87333';
    ctx.fillRect(-8, -8, 8, 16);
    ctx.fillStyle = '#CD7F32';
    ctx.beginPath();
    ctx.arc(-10, 0, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    
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
    const spinAngle = progress * Math.PI * 4;
    ctx.rotate(spinAngle);
    ctx.shadowColor = 'rgba(139, 69, 19, 0.5)';
    ctx.shadowBlur = 15 * alpha;
    
    ctx.save();
    ctx.fillStyle = '#654321';
    ctx.fillRect(-3, -attack.radius * 0.8, 6, attack.radius * 1.6);
    ctx.restore();
    
    ctx.save();
    ctx.translate(0, -attack.radius * 0.4);
    ctx.rotate(-0.3);
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
    ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(35, -15);
    ctx.lineTo(35, -5);
    ctx.stroke();
    ctx.restore();
    
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
    const stabProgress = Math.min(progress * 2, 1);
    const stabDistance = distance * 1.5;
    ctx.rotate(angle);
    ctx.translate(stabDistance, 0);
    ctx.shadowColor = 'rgba(70, 130, 180, 0.5)';
    ctx.shadowBlur = 10 * alpha;
    
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
    ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, -3);
    ctx.lineTo(40, -1);
    ctx.moveTo(0, 3);
    ctx.lineTo(40, 1);
    ctx.stroke();
    ctx.restore();
    
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
    
    ctx.save();
    ctx.fillStyle = '#2F4F4F';
    ctx.fillRect(-8, -4, 12, 8);
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(-8, -3, 10, 6);
    ctx.fillStyle = '#4682B4';
    ctx.beginPath();
    ctx.arc(-12, 0, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}

function drawHammer(ctx, attack, angle, progress, distance, alpha) {
    ctx.rotate(angle);
    const lift = Math.sin(progress * Math.PI) * 30;
    const smashY = progress < 0.3 ? -lift : progress > 0.6 ? (progress - 0.6) * 40 : 0;
    ctx.translate(20, -30 + lift - smashY);
    ctx.shadowColor = 'rgba(105, 105, 105, 0.7)';
    ctx.shadowBlur = 20 * alpha;
    
    ctx.save();
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(-3, 0, 6, 50);
    ctx.restore();
    
    ctx.save();
    ctx.translate(0, -15);
    ctx.fillStyle = '#696969';
    ctx.shadowColor = 'rgba(105, 105, 105, 0.7)';
    ctx.fillRect(-15, -15, 30, 20);
    ctx.fillStyle = '#808080';
    ctx.fillRect(-18, -15, 6, 20);
    ctx.fillRect(12, -15, 6, 20);
    ctx.fillStyle = '#A9A9A9';
    ctx.fillRect(-15, -20, 30, 5);
    ctx.restore();
    
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
    const thrustProgress = Math.min(progress * 1.5, 1);
    const thrustDistance = distance * 1.3 * thrustProgress;
    ctx.rotate(angle);
    ctx.translate(thrustDistance, 0);
    ctx.shadowColor = 'rgba(50, 205, 50, 0.5)';
    ctx.shadowBlur = 15 * alpha;
    
    ctx.save();
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(-3, -3, attack.radius + 20, 6);
    ctx.fillStyle = '#654321';
    for (let i = 0; i < 3; i++) ctx.fillRect(i * 20, -4, 2, 8);
    ctx.restore();
    
    ctx.save();
    ctx.translate(attack.radius + 10, 0);
    ctx.fillStyle = '#CD7F32';
    ctx.beginPath();
    ctx.moveTo(0, -2);
    ctx.lineTo(20, -4);
    ctx.lineTo(20, 4);
    ctx.lineTo(0, 2);
    ctx.closePath();
    ctx.fill();
    
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
                           effect.y + Math.sin(angle) * distance, 3, 0, Math.PI * 2);
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
                const pulse = Math.sin(progress * Math.PI * 8) * 0.2 + 0.8;
                ctx.beginPath();
                ctx.arc(effect.x, effect.y, effect.radius * pulse, 0, Math.PI * 2);
                ctx.stroke();
                ctx.font = '24px Arial';
                ctx.fillStyle = `rgba(255, 0, 0, ${alpha})`;
                ctx.shadowBlur = 15;
                ctx.fillText('⚠️', effect.x - 15, effect.y - 40);
                break;
            case 'level_up':
                ctx.font = '32px Arial';
                ctx.fillStyle = `rgba(255, 215, 0, ${alpha})`;
                ctx.shadowBlur = 20;
                ctx.shadowColor = '#ffd700';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('LEVEL UP!', effect.x, effect.y - 50 * progress);
                break;
        }
        ctx.restore();
    });
}

// ============================================
// UPDATE FUNCTIONS
// ============================================

function updateGame(deltaTime) {
    const currentTime = Date.now();
    
    let currentSpeed = player.speed;
    if (player.slowed && currentTime < player.slowEndTime) {
        currentSpeed *= (1 - player.slowAmount);
    } else {
        player.slowed = false;
    }
    
    const dx = mouseX - player.x;
    const dy = mouseY - player.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > currentSpeed) {
        player.x += (dx / distance) * currentSpeed;
        player.y += (dy / distance) * currentSpeed;
    }
    
    player.x = Math.max(player.radius, Math.min(canvas.width - player.radius, player.x));
    player.y = Math.max(player.radius, Math.min(canvas.height - player.radius, player.y));
    
    if (player.healthRegen > 0 && currentTime - player.lastRegen >= 1000) {
        player.health = Math.min(player.maxHealth, player.health + player.healthRegen);
        player.lastRegen = currentTime;
        createHealthPopup(player.x, player.y, player.healthRegen);
    }
    
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
                
                createDamageIndicator(monster.x, monster.y, Math.floor(damage), isCritical, projectile.color);
                
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
                    handleMonsterDeath(monster);
                    monsters.splice(j, 1);
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
                
                createDamageIndicator(monster.x, monster.y, Math.floor(damage), isCritical, attack.color);
                
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
                    handleMonsterDeath(monster);
                    monsters.splice(j, 1);
                }
            }
        }
    }
}

function updateBossProjectiles() {
    const currentTime = Date.now();
    
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
                        angle = (Math.PI * 2 * i) / projectileCount;
                    } else {
                        const baseAngle = Math.atan2(player.y - monster.y, player.x - monster.x);
                        const spreadOffset = (Math.random() - 0.5) * (spread * Math.PI / 180);
                        angle = baseAngle + spreadOffset;
                    }
                    
                    const projectile = new BossProjectile(
                        monster, 
                        player, 
                        monster.monsterType.name.split(' ')[0]
                    );
                    projectile.angle = angle;
                    bossProjectiles.push(projectile);
                }
            }
        }
    });
    
    for (let i = bossProjectiles.length - 1; i >= 0; i--) {
        const projectile = bossProjectiles[i];
        projectile.update();
        
        if (projectile.x < -50 || projectile.x > canvas.width + 50 ||
            projectile.y < -50 || projectile.y > canvas.height + 50 ||
            Date.now() - projectile.startTime > projectile.lifetime) {
            bossProjectiles.splice(i, 1);
            continue;
        }
        
        const dx = projectile.x - player.x;
        const dy = projectile.y - player.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < player.radius + projectile.radius) {
            let damage = projectile.damage;
            if (player.damageReduction > 0) {
                damage *= (1 - player.damageReduction);
            }
            
            player.health -= damage;
            createDamageIndicator(player.x, player.y, Math.floor(damage), true, projectile.color);
            
            if (projectile.bossType === 'ICE') {
                player.slowed = true;
                player.slowAmount = projectile.slowAmount || 0.5;
                player.slowEndTime = Date.now() + (projectile.slowDuration || 2000);
            }
            
            bossProjectiles.splice(i, 1);
            
            if (player.health <= 0) {
                gameOver();
            }
        }
    }
}

function updateMonsters() {
    const currentTime = Date.now();
    
    monsters.forEach(monster => {
        if (freezeTimer > 0) return;
        
        const dx = player.x - monster.x;
        const dy = player.y - monster.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 0) {
            monster.x += (dx / distance) * monster.speed;
            monster.y += (dy / distance) * monster.speed;
        }
        
        if (distance < player.radius + monster.radius) {
            if (currentTime - monster.lastAttack >= monster.attackCooldown) {
                let actualDamage = monster.damage;
                if (player.damageReduction > 0) {
                    actualDamage *= (1 - player.damageReduction);
                }
                
                player.health -= actualDamage;
                monster.lastAttack = currentTime;
                createDamageIndicator(player.x, player.y, Math.floor(actualDamage), false, '#ff0000');
                
                if (player.health <= 0) gameOver();
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
        }
    }
}

// ============================================
// POPUP FUNCTIONS
// ============================================

function createDamageIndicator(x, y, damage, isCritical, color = '#ff0000') {
    const indicator = document.createElement('div');
    indicator.className = 'damage-indicator';
    indicator.textContent = damage.toString();
    
    if (isCritical) {
        indicator.textContent = 'CRIT! ' + damage;
        indicator.style.color = '#FFD700';
        indicator.style.fontSize = '1.5rem';
        indicator.style.textShadow = '0 0 10px #FFD700';
    } else {
        indicator.style.color = color;
        indicator.style.textShadow = `0 0 10px ${color}`;
    }
    
    indicator.style.left = (x + Math.random() * 20 - 10) + 'px';
    indicator.style.top = (y + Math.random() * 20 - 10) + 'px';
    
    document.querySelector('.canvas-container').appendChild(indicator);
    
    setTimeout(() => {
        if (indicator.parentNode) indicator.parentNode.removeChild(indicator);
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
        if (popup.parentNode) popup.parentNode.removeChild(popup);
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
        if (popup.parentNode) popup.parentNode.removeChild(popup);
    }, 1000);
}

function createXPPopup(x, y, amount) {
    const popup = document.createElement('div');
    popup.className = 'xp-popup';
    popup.textContent = '+' + amount + ' XP';
    popup.style.color = '#00ffff';
    popup.style.left = (x + Math.random() * 20 - 10) + 'px';
    popup.style.top = (y + Math.random() * 20 - 10) + 'px';
    document.querySelector('.canvas-container').appendChild(popup);
    setTimeout(() => {
        if (popup.parentNode) popup.parentNode.removeChild(popup);
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

// ============================================
// CSS STYLES
// ============================================

const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        0% { opacity: 1; transform: scale(1); }
        70% { opacity: 1; transform: scale(1.2); }
        100% { opacity: 0; transform: scale(0.8); }
    }
    
    @keyframes floatUp {
        0% { transform: translateY(0); opacity: 1; }
        100% { transform: translateY(-50px); opacity: 0; }
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
    
    .damage-indicator {
        position: absolute;
        font-weight: bold;
        font-size: 1.2rem;
        pointer-events: none;
        z-index: 1000;
        animation: fadeOut 1s forwards;
    }
`;
document.head.appendChild(style);

// Start the game
gameLoop();
