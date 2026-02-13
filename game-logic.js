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
        speed: 0.3,
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
    
    ammoPack: false,
    
    // New player stats for items
    dodgeChance: 0,
    thornsDamage: 0,
    attackSpeedMultiplier: 1,
    firstHitReduction: false,
    voidCrystalChance: 0,
    guardianAngelUsed: false,
    bloodContractDamage: 0
};

let monsters = [];
let mouseX = 400;
let mouseY = 300;

// New arrays for additional effects
let groundFire = [];
let poisonClouds = [];
let voidZones = [];
let activeTraps = [];

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
        ammoPack: false,
        
        // Reset new stats
        dodgeChance: 0,
        thornsDamage: 0,
        attackSpeedMultiplier: 1,
        firstHitReduction: false,
        voidCrystalChance: 0,
        guardianAngelUsed: false,
        bloodContractDamage: 0
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
    
    // Reset effect arrays
    groundFire = [];
    poisonClouds = [];
    voidZones = [];
    activeTraps = [];
    
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
    
    // Reset first hit reduction for new wave
    if (player.firstHitReduction) {
        player.firstHitReduction = false;
    }
    
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
            if (rand < 0.5) monsterType = MONSTER_TYPES.NORMAL;
            else if (rand < 0.7) monsterType = MONSTER_TYPES.FAST;
            else if (rand < 0.9) monsterType = MONSTER_TYPES.TANK;
            else monsterType = MONSTER_TYPES.EXPLOSIVE;
        } else if (wave < 10) {
            if (rand < 0.3) monsterType = MONSTER_TYPES.NORMAL;
            else if (rand < 0.45) monsterType = MONSTER_TYPES.FAST;
            else if (rand < 0.6) monsterType = MONSTER_TYPES.TANK;
            else if (rand < 0.7) monsterType = MONSTER_TYPES.EXPLOSIVE;
            else if (rand < 0.8) monsterType = MONSTER_TYPES.TELEPORTER;
            else if (rand < 0.9) monsterType = MONSTER_TYPES.HEALER;
            else monsterType = MONSTER_TYPES.SPITTER;
        } else {
            const monsterTypes = [
                MONSTER_TYPES.NORMAL, MONSTER_TYPES.FAST, MONSTER_TYPES.TANK, 
                MONSTER_TYPES.EXPLOSIVE, MONSTER_TYPES.TELEPORTER, MONSTER_TYPES.HEALER,
                MONSTER_TYPES.SPITTER, MONSTER_TYPES.SHIELDED, MONSTER_TYPES.MIMIC,
                MONSTER_TYPES.PHANTOM, MONSTER_TYPES.FROST, MONSTER_TYPES.VAMPIRE,
                MONSTER_TYPES.GOLEM
            ];
            monsterType = monsterTypes[Math.floor(Math.random() * monsterTypes.length)];
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
        speed: (waveConfig.isBoss ? 0.3 : (1 + wave * 0.1)) * monsterType.speed,
        color: monsterType.color,
        type: monsterType.name,
        monsterType: monsterType,
        lastAttack: 0,
        attackCooldown: waveConfig.isBoss ? 1500 : GAME_DATA.MONSTER_ATTACK_COOLDOWN,
        isBoss: waveConfig.isBoss,
        
        // New monster properties
        lastTeleport: 0,
        lastHeal: 0,
        shieldHealth: monsterType.shieldHealth || 0,
        intangible: false,
        intangibleUntil: 0,
        slowed: false,
        slowUntil: 0,
        frozen: false,
        frozenUntil: 0,
        stunned: false,
        stunnedUntil: 0
    };
    
    // Add mimic disguise
    if (monsterType === MONSTER_TYPES.MIMIC && Math.random() < monsterType.disguiseChance) {
        monster.color = '#8B4513';
        monster.icon = '📦';
    }
    
    monsters.push(monster);
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
                const cooldownTime = 1000 / (weapon.attackSpeed * player.attackSpeedMultiplier);
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
                <div class="weapon-info">${weapon.getDisplayName()}<br>Dmg: ${weapon.baseDamage}<br>Spd: ${(weapon.attackSpeed * player.attackSpeedMultiplier).toFixed(1)}/s</div>
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
                    else if (data.meleeType === 'dual') tagClass = 'dual-tag';
                    else if (data.meleeType === 'chain') tagClass = 'chain-tag';
                    else if (data.meleeType === 'defensive') tagClass = 'defensive-tag';
                    else tagClass = 'single-tag';
                } else {
                    if (data.id === 'shotgun') tagClass = 'shotgun-tag';
                    else if (data.id === 'laser') tagClass = 'energy-tag';
                    else if (data.id === 'flamethrower') tagClass = 'fire-tag';
                    else if (data.id === 'railgun') tagClass = 'rail-tag';
                    else if (data.id === 'boomerang') tagClass = 'return-tag';
                    else if (data.id === 'crossbow') tagClass = 'sniper-tag';
                    else if (data.id === 'grenade_launcher') tagClass = 'explosive-tag';
                    else if (data.id.includes('staff')) {
                        if (data.id.includes('fire')) tagClass = 'fire-tag';
                        else if (data.id.includes('ice')) tagClass = 'ice-tag';
                        else if (data.id.includes('lightning')) tagClass = 'lightning-tag';
                        else if (data.id.includes('poison')) tagClass = 'poison-tag';
                        else if (data.id.includes('arcane')) tagClass = 'arcane-tag';
                    }
                    else tagClass = 'ranged-tag';
                }
            }
            
            let typeText = '';
            if (shopItem.type === 'weapon') {
                if (data.id === 'shotgun') typeText = 'SHOTGUN';
                else if (data.id === 'laser') typeText = 'ENERGY';
                else if (data.id === 'flamethrower') typeText = 'FIRE';
                else if (data.id === 'railgun') typeText = 'RAIL';
                else if (data.id === 'boomerang') typeText = 'RETURN';
                else if (data.id === 'crossbow') typeText = 'SNIPER';
                else if (data.id === 'grenade_launcher') typeText = 'EXPLOSIVE';
                else if (data.id.includes('staff')) {
                    if (data.id.includes('fire')) typeText = 'FIRE';
                    else if (data.id.includes('ice')) typeText = 'ICE';
                    else if (data.id.includes('lightning')) typeText = 'LIGHTNING';
                    else if (data.id.includes('poison')) typeText = 'POISON';
                    else if (data.id.includes('arcane')) typeText = 'ARCANE';
                }
                else if (data.type === 'melee') typeText = data.meleeType.toUpperCase();
                else typeText = 'RANGED';
            } else {
                typeText = 'ITEM';
            }
            
            itemElement.innerHTML = `
                <div class="item-info">
                    <div class="item-name">
                        ${data.icon} ${data.name}
                        ${tagClass ? `<span class="item-tag ${tagClass}">${typeText}</span>` : ''}
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
            
        // New items
        case 'vampire_teeth':
            player.lifeSteal += 0.05;
            break;
        case 'berserker_ring':
            // Applied dynamically in damage calculation
            player.berserkerRing = true;
            break;
        case 'ninja_scroll':
            player.dodgeChance += 0.15;
            break;
        case 'alchemist_stone':
            player.goldMultiplier += 0.2;
            // Item value bonus would affect shop prices
            break;
        case 'thorns_armor':
            player.thornsDamage = 0.25;
            break;
        case 'wind_charm':
            player.attackSpeedMultiplier += 0.15;
            break;
        case 'runic_plate':
            player.firstHitReduction = true;
            break;
        case 'explosive_trap':
            // Place a trap
            activeTraps.push({
                x: player.x,
                y: player.y,
                active: true,
                damage: 100,
                radius: 80
            });
            break;
        case 'healing_fountain':
            player.healthRegen += 2;
            break;
        case 'sharpening_stone':
            // Temporary buff for 1 wave
            player.sharpeningStone = true;
            player.sharpeningStoneWave = wave;
            break;
        case 'enchanters_ink':
            // Random elemental effect on weapon
            player.enchantersInk = true;
            break;
        case 'void_crystal':
            player.voidCrystalChance += 0.1;
            break;
        case 'guardian_angel':
            player.guardianAngel = true;
            break;
        case 'dice_of_fate':
            // Random effect
            const rand = Math.random();
            if (rand < 0.33) {
                player.baseDamage *= 2;
                showMessage("DOUBLE DAMAGE!");
            } else if (rand < 0.66) {
                player.health = player.maxHealth;
                showMessage("FULL HEAL!");
            } else {
                gold += 100;
                showMessage("+100 GOLD!");
            }
            break;
        case 'blood_contract':
            player.baseDamage *= 1.3;
            player.bloodContract = true;
            player.lastBloodDamage = Date.now();
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
    
    // Reset temporary buffs
    if (player.sharpeningStone && player.sharpeningStoneWave === wave) {
        player.sharpeningStone = false;
    }
    
    showStatBuffs();
}

function gameOver() {
    gameState = 'gameover';
    
    // Guardian angel check
    if (player.guardianAngel && !player.guardianAngelUsed) {
        player.guardianAngelUsed = true;
        player.health = player.maxHealth * 0.5;
        gameState = 'wave';
        showMessage("GUARDIAN ANGEL SAVED YOU!");
        return;
    }
    
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
    drawGroundEffects();
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

function drawGroundEffects() {
    // Draw ground fire
    groundFire.forEach(fire => {
        const progress = (Date.now() - fire.startTime) / fire.duration;
        if (progress > 1) return;
        
        ctx.save();
        ctx.globalAlpha = 1 - progress * 0.5;
        ctx.fillStyle = '#FF4500';
        ctx.shadowColor = '#FF4500';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(fire.x, fire.y, fire.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Inner glow
        ctx.fillStyle = '#FFD700';
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.arc(fire.x, fire.y, fire.radius * 0.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    });
    
    // Draw poison clouds
    poisonClouds.forEach(cloud => {
        const progress = (Date.now() - cloud.startTime) / cloud.duration;
        if (progress > 1) return;
        
        ctx.save();
        ctx.globalAlpha = 0.4 * (1 - progress);
        ctx.fillStyle = '#32CD32';
        ctx.shadowColor = '#32CD32';
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.arc(cloud.x, cloud.y, cloud.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    });
    
    // Draw void zones
    voidZones.forEach(zone => {
        const progress = (Date.now() - zone.startTime) / zone.duration;
        if (progress > 1) return;
        
        ctx.save();
        ctx.globalAlpha = 0.6 * (1 - progress);
        ctx.fillStyle = '#4B0082';
        ctx.shadowColor = '#9400D3';
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.arc(zone.x, zone.y, zone.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Inner swirl
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(zone.x, zone.y, zone.radius * 0.5, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
    });
    
    // Draw traps
    activeTraps.forEach(trap => {
        if (!trap.active) return;
        
        ctx.save();
        ctx.fillStyle = '#FF0000';
        ctx.shadowColor = '#FF0000';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(trap.x, trap.y, 15, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(trap.x, trap.y, 20, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
    });
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
            // New weapons fall back to default animations
            default:
                if (attack.animation === 'katanaSlash') {
                    drawKatana(ctx, attack, angle, progress, distance, alpha);
                } else if (attack.animation === 'dualStab') {
                    drawDualDaggers(ctx, attack, angle, progress, distance, alpha);
                } else if (attack.animation === 'scytheSweep') {
                    drawScythe(ctx, attack, angle, progress, distance, alpha);
                } else if (attack.animation === 'flailSpin') {
                    drawFlail(ctx, attack, angle, progress, distance, alpha);
                } else if (attack.animation === 'tonfaBlock') {
                    drawTonfa(ctx, attack, angle, progress, distance, alpha);
                } else {
                    // Default fallback
                    drawDefaultMelee(ctx, attack, angle, progress, distance, alpha);
                }
                break;
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
    for (let i = 0; i < 3; i++) {
        ctx.fillRect(i * 20, -4, 2, 8);
    }
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

// New melee weapon animations
function drawKatana(ctx, attack, angle, progress, distance, alpha) {
    const swingProgress = Math.sin(progress * Math.PI);
    const currentAngle = angle - 0.7 + swingProgress * 1.4;
    
    ctx.rotate(currentAngle);
    ctx.shadowColor = 'rgba(255, 69, 0, 0.5)';
    ctx.shadowBlur = 15 * alpha;
    
    ctx.save();
    ctx.translate(10, 0);
    
    const gradient = ctx.createLinearGradient(0, -4, attack.radius * 0.9, -4);
    gradient.addColorStop(0, '#FF4500');
    gradient.addColorStop(0.5, '#FF8C00');
    gradient.addColorStop(1, '#FFD700');
    
    ctx.fillStyle = gradient;
    ctx.shadowColor = 'rgba(255, 140, 0, 0.7)';
    
    ctx.beginPath();
    ctx.moveTo(0, -4);
    ctx.lineTo(attack.radius * 0.9, -2);
    ctx.lineTo(attack.radius * 0.9, 2);
    ctx.lineTo(0, 4);
    ctx.closePath();
    ctx.fill();
    
    if (attack.fireTrail && progress > 0.3 && progress < 0.8) {
        ctx.fillStyle = `rgba(255, 69, 0, ${alpha * 0.5})`;
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.arc(attack.radius * 0.5, 0, 10 * progress, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.restore();
    
    ctx.save();
    ctx.fillStyle = '#DAA520';
    ctx.fillRect(-5, -3, 15, 6);
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(-8, -5, 5, 10);
    ctx.restore();
}

function drawDualDaggers(ctx, attack, angle, progress, distance, alpha) {
    const stabProgress = Math.sin(progress * Math.PI);
    
    ctx.save();
    ctx.rotate(angle - 0.2);
    ctx.translate(distance * 0.8, -5);
    ctx.fillStyle = '#9400D3';
    ctx.shadowColor = '#8A2BE2';
    ctx.shadowBlur = 10 * alpha;
    ctx.beginPath();
    ctx.moveTo(0, -2);
    ctx.lineTo(30, -1);
    ctx.lineTo(30, 1);
    ctx.lineTo(0, 2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    
    ctx.save();
    ctx.rotate(angle + 0.2);
    ctx.translate(distance * 0.8, 5);
    ctx.fillStyle = '#9400D3';
    ctx.beginPath();
    ctx.moveTo(0, -2);
    ctx.lineTo(30, -1);
    ctx.lineTo(30, 1);
    ctx.lineTo(0, 2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}

function drawScythe(ctx, attack, angle, progress, distance, alpha) {
    const sweepAngle = progress * Math.PI * 2;
    ctx.rotate(angle - 1 + sweepAngle);
    
    ctx.save();
    ctx.fillStyle = '#4A4A4A';
    ctx.shadowColor = '#2F4F4F';
    ctx.shadowBlur = 15 * alpha;
    ctx.fillRect(-3, -attack.radius, 6, attack.radius * 2);
    
    ctx.translate(0, -attack.radius * 0.8);
    ctx.rotate(-0.5);
    ctx.fillStyle = '#2F4F4F';
    ctx.beginPath();
    ctx.moveTo(0, -10);
    ctx.lineTo(40, -15);
    ctx.lineTo(40, 5);
    ctx.lineTo(0, 10);
    ctx.closePath();
    ctx.fill();
    
    ctx.fillStyle = '#C0C0C0';
    ctx.shadowColor = '#C0C0C0';
    ctx.beginPath();
    ctx.arc(40, -5, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}

function drawFlail(ctx, attack, angle, progress, distance, alpha) {
    const spinAngle = progress * Math.PI * 6;
    
    ctx.save();
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(-3, -attack.radius * 0.5, 6, attack.radius);
    ctx.restore();
    
    ctx.save();
    ctx.translate(attack.radius * 0.7 * Math.sin(spinAngle), 
                  attack.radius * 0.7 * Math.cos(spinAngle));
    
    ctx.fillStyle = '#B87333';
    ctx.shadowColor = '#CD7F32';
    ctx.shadowBlur = 15 * alpha;
    ctx.beginPath();
    ctx.arc(0, 0, 15, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.strokeStyle = '#696969';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-attack.radius * 0.5 * Math.sin(spinAngle), 
               -attack.radius * 0.5 * Math.cos(spinAngle));
    ctx.stroke();
    ctx.restore();
}

function drawTonfa(ctx, attack, angle, progress, distance, alpha) {
    ctx.rotate(angle);
    
    ctx.save();
    ctx.fillStyle = '#708090';
    ctx.shadowColor = '#778899';
    ctx.shadowBlur = 10 * alpha;
    ctx.fillRect(0, -10, 30, 20);
    
    ctx.fillStyle = '#2F4F4F';
    ctx.fillRect(5, -5, 20, 10);
    ctx.restore();
    
    if (attack.blockReduction > 0 && progress < 0.3) {
        ctx.save();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(15, 0, 30, -0.5, 0.5);
        ctx.stroke();
        ctx.restore();
    }
}

function drawDefaultMelee(ctx, attack, angle, progress, distance, alpha) {
    ctx.rotate(angle);
    ctx.translate(distance, 0);
    
    ctx.fillStyle = attack.color || '#FFFFFF';
    ctx.shadowColor = attack.color || '#FFFFFF';
    ctx.shadowBlur = 15 * alpha;
    ctx.beginPath();
    ctx.arc(0, 0, 10, 0, Math.PI * 2);
    ctx.fill();
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
    
    // Blood contract damage
    if (player.bloodContract && currentTime - player.lastBloodDamage >= 5000) {
        player.health = Math.max(1, player.health - 1);
        player.lastBloodDamage = currentTime;
    }
    
    updateWeapons();
    updateProjectiles();
    updateMeleeAttacks();
    updateMonsters(currentTime);
    updateGroundEffects(currentTime);
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
        
        // Apply attack speed multiplier
        const originalAttackSpeed = weapon.attackSpeed;
        weapon.attackSpeed = originalAttackSpeed * player.attackSpeedMultiplier;
        const canAttack = weapon.canAttack(currentTime);
        weapon.attackSpeed = originalAttackSpeed;
        
        if (canAttack) {
            let closestMonster = null;
            let closestDistance = Infinity;
            
            monsters.forEach(monster => {
                // Skip intangible monsters
                if (monster.intangible && monster.intangibleUntil > currentTime) return;
                
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
                    
                    // Handle multiple strikes for dual weapons
                    if (weapon.strikesPerAttack > 1) {
                        for (let i = 1; i < weapon.strikesPerAttack; i++) {
                            setTimeout(() => {
                                const followUpAttack = weapon.attack(player.x, player.y, closestMonster.x, closestMonster.y);
                                player.meleeAttacks.push(followUpAttack);
                            }, weapon.strikeDelay * i);
                        }
                    }
                }
            }
        }
    });
}

function updateProjectiles() {
    const currentTime = Date.now();
    
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
                if (monster.intangible && monster.intangibleUntil > currentTime) return;
                
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
            
            // Skip intangible monsters
            if (monster.intangible && monster.intangibleUntil > currentTime) continue;
            
            const dx = projectile.x - monster.x;
            const dy = projectile.y - monster.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < (projectile.isPellet ? 3 : 5) + monster.radius) {
                let damage = projectile.damage;
                
                // Apply sharpening stone buff
                if (player.sharpeningStone && player.sharpeningStoneWave === wave) {
                    damage *= 1.5;
                }
                
                // Apply berserker ring
                if (player.berserkerRing) {
                    const missingHealthPercent = (player.maxHealth - player.health) / player.maxHealth;
                    const bonus = Math.floor(missingHealthPercent * 10) * 0.1;
                    damage *= (1 + bonus);
                }
                
                let isCritical = false;
                if (Math.random() < player.criticalChance) {
                    damage *= 2;
                    isCritical = true;
                }
                
                // Apply shield reduction
                if (monster.shieldHealth > 0) {
                    monster.shieldHealth -= damage;
                    if (monster.shieldHealth <= 0) {
                        monster.shieldHealth = 0;
                    } else {
                        damage = 0;
                    }
                }
                
                if (damage > 0) {
                    // Apply armor
                    if (monster.monsterType && monster.monsterType.armor) {
                        damage *= (1 - monster.monsterType.armor);
                    }
                    
                    monster.health -= damage;
                }
                
                createDamageIndicator(monster.x, monster.y, Math.floor(damage), isCritical);
                
                if (player.lifeSteal > 0 && damage > 0) {
                    const healAmount = damage * player.lifeSteal;
                    player.health = Math.min(player.maxHealth, player.health + healAmount);
                    createHealthPopup(player.x, player.y, Math.floor(healAmount));
                }
                
                // Apply slow effect
                if (projectile.slowAmount > 0 && damage > 0) {
                    monster.slowed = true;
                    monster.slowUntil = currentTime + projectile.slowDuration;
                    monster.originalSpeed = monster.speed;
                    monster.speed *= (1 - projectile.slowAmount);
                }
                
                // Apply freeze effect
                if (projectile.freezeChance && Math.random() < projectile.freezeChance && damage > 0) {
                    monster.frozen = true;
                    monster.frozenUntil = currentTime + projectile.freezeDuration;
                    monster.originalSpeed = monster.speed;
                    monster.speed = 0;
                }
                
                // Apply stun effect
                if (projectile.stunChance && Math.random() < projectile.stunChance && damage > 0) {
                    monster.stunned = true;
                    monster.stunnedUntil = currentTime + projectile.stunDuration;
                }
                
                // Apply burn effect
                if (projectile.burnDamage > 0 && damage > 0) {
                    monster.burning = true;
                    monster.burnDamage = projectile.burnDamage;
                    monster.burnUntil = currentTime + projectile.burnDuration;
                    monster.lastBurnTick = currentTime;
                }
                
                // Apply poison effect
                if (projectile.poisonDamage > 0 && damage > 0) {
                    monster.poisoned = true;
                    monster.poisonDamage = projectile.poisonDamage;
                    monster.poisonUntil = currentTime + projectile.poisonDuration;
                    monster.lastPoisonTick = currentTime;
                }
                
                // Create ground fire
                if (projectile.groundFireDuration > 0) {
                    groundFire.push({
                        x: monster.x,
                        y: monster.y,
                        radius: projectile.groundFireRadius || 30,
                        damage: projectile.burnDamage,
                        startTime: currentTime,
                        duration: projectile.groundFireDuration
                    });
                }
                
                if (!projectile.bounceCount || !projectile.targetsHit) {
                    if (projectile.returnDamage > 0) {
                        // Boomerang return
                        setTimeout(() => {
                            const returnProjectile = {
                                ...projectile,
                                x: monster.x,
                                y: monster.y,
                                angle: Math.atan2(player.y - monster.y, player.x - monster.x),
                                damage: projectile.returnDamage,
                                isReturning: true
                            };
                            player.projectiles.push(returnProjectile);
                        }, 100);
                    }
                    player.projectiles.splice(i, 1);
                } else {
                    if (!projectile.targetsHit.includes(monster)) {
                        projectile.targetsHit.push(monster);
                    }
                }
                
                if (monster.health <= 0) {
                    // Handle mimic gold drop
                    if (monster.monsterType === MONSTER_TYPES.MIMIC) {
                        const mimicGold = monster.monsterType.goldAmount || 50;
                        gold += mimicGold;
                        createGoldPopup(monster.x, monster.y, mimicGold);
                    }
                    
                    // Handle void crystal
                    if (player.voidCrystalChance > 0 && Math.random() < player.voidCrystalChance) {
                        voidZones.push({
                            x: monster.x,
                            y: monster.y,
                            radius: 80,
                            damage: 5,
                            startTime: currentTime,
                            duration: 3000,
                            lastTick: currentTime
                        });
                    }
                    
                    addVisualEffect({
                        type: 'death',
                        x: monster.x,
                        y: monster.y,
                        color: monster.color,
                        startTime: currentTime,
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
            
            // Skip intangible monsters
            if (monster.intangible && monster.intangibleUntil > currentTime) continue;
            
            const dx = monster.x - attack.x;
            const dy = monster.y - attack.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < attack.radius + monster.radius) {
                let damage = attack.damage;
                
                // Apply sharpening stone buff
                if (player.sharpeningStone && player.sharpeningStoneWave === wave) {
                    damage *= 1.5;
                }
                
                // Apply berserker ring
                if (player.berserkerRing) {
                    const missingHealthPercent = (player.maxHealth - player.health) / player.maxHealth;
                    const bonus = Math.floor(missingHealthPercent * 10) * 0.1;
                    damage *= (1 + bonus);
                }
                
                let isCritical = false;
                if (Math.random() < player.criticalChance) {
                    damage *= 2;
                    isCritical = true;
                }
                
                // Apply shield reduction
                if (monster.shieldHealth > 0) {
                    monster.shieldHealth -= damage;
                    if (monster.shieldHealth <= 0) {
                        monster.shieldHealth = 0;
                    } else {
                        damage = 0;
                    }
                }
                
                if (damage > 0) {
                    // Apply armor
                    if (monster.monsterType && monster.monsterType.armor) {
                        damage *= (1 - monster.monsterType.armor);
                    }
                    
                    monster.health -= damage;
                }
                
                createDamageIndicator(monster.x, monster.y, Math.floor(damage), isCritical);
                
                if (player.lifeSteal > 0 && damage > 0) {
                    const healAmount = damage * player.lifeSteal;
                    player.health = Math.min(player.maxHealth, player.health + healAmount);
                    createHealthPopup(player.x, player.y, Math.floor(healAmount));
                }
                
                // Apply pull effect
                if (attack.pullStrength > 0 && damage > 0) {
                    const angle = Math.atan2(player.y - monster.y, player.x - monster.x);
                    monster.x += Math.cos(angle) * attack.pullStrength * 10;
                    monster.y += Math.sin(angle) * attack.pullStrength * 10;
                }
                
                // Apply stun effect
                if (attack.stunChance && Math.random() < attack.stunChance && damage > 0) {
                    monster.stunned = true;
                    monster.stunnedUntil = currentTime + attack.stunDuration;
                }
                
                // Create fire trail
                if (attack.fireTrail && damage > 0) {
                    groundFire.push({
                        x: monster.x,
                        y: monster.y,
                        radius: 30,
                        damage: attack.fireDamage,
                        startTime: currentTime,
                        duration: attack.fireDuration
                    });
                }
                
                hits++;
                
                if (attack.meleeType === 'pierce' && hits >= attack.pierceCount) {
                    break;
                }
                
                if (monster.health <= 0) {
                    // Handle mimic gold drop
                    if (monster.monsterType === MONSTER_TYPES.MIMIC) {
                        const mimicGold = monster.monsterType.goldAmount || 50;
                        gold += mimicGold;
                        createGoldPopup(monster.x, monster.y, mimicGold);
                    }
                    
                    // Handle void crystal
                    if (player.voidCrystalChance > 0 && Math.random() < player.voidCrystalChance) {
                        voidZones.push({
                            x: monster.x,
                            y: monster.y,
                            radius: 80,
                            damage: 5,
                            startTime: currentTime,
                            duration: 3000,
                            lastTick: currentTime
                        });
                    }
                    
                    addVisualEffect({
                        type: 'death',
                        x: monster.x,
                        y: monster.y,
                        color: monster.color,
                        startTime: currentTime,
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

function updateMonsters(currentTime) {
    monsters.forEach(monster => {
        // Reset status effects
        if (monster.slowed && monster.slowUntil < currentTime) {
            monster.slowed = false;
            monster.speed = monster.originalSpeed;
        }
        
        if (monster.frozen && monster.frozenUntil < currentTime) {
            monster.frozen = false;
            monster.speed = monster.originalSpeed;
        }
        
        if (monster.stunned && monster.stunnedUntil < currentTime) {
            monster.stunned = false;
        }
        
        if (monster.intangible && monster.intangibleUntil < currentTime) {
            monster.intangible = false;
        }
        
        // Don't move if stunned or frozen
        if (monster.stunned || monster.frozen) {
            return;
        }
        
        // Teleporter ability
        if (monster.monsterType === MONSTER_TYPES.TELEPORTER && 
            currentTime - monster.lastTeleport > monster.monsterType.teleportCooldown &&
            Math.random() < monster.monsterType.teleportChance) {
            
            const angle = Math.random() * Math.PI * 2;
            const distance = monster.monsterType.teleportRange;
            monster.x += Math.cos(angle) * distance;
            monster.y += Math.sin(angle) * distance;
            
            // Keep on screen
            monster.x = Math.max(monster.radius, Math.min(canvas.width - monster.radius, monster.x));
            monster.y = Math.max(monster.radius, Math.min(canvas.height - monster.radius, monster.y));
            
            monster.lastTeleport = currentTime;
            addVisualEffect({
                type: 'teleport',
                x: monster.x,
                y: monster.y,
                color: '#8A2BE2',
                startTime: currentTime,
                duration: 200
            });
        }
        
        // Healer ability
        if (monster.monsterType === MONSTER_TYPES.HEALER && 
            currentTime - monster.lastHeal > monster.monsterType.healCooldown) {
            
            monsters.forEach(otherMonster => {
                const dx = otherMonster.x - monster.x;
                const dy = otherMonster.y - monster.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < monster.monsterType.healRadius && otherMonster.health < otherMonster.maxHealth) {
                    otherMonster.health = Math.min(otherMonster.maxHealth, otherMonster.health + monster.monsterType.healAmount);
                    createHealthPopup(otherMonster.x, otherMonster.y, monster.monsterType.healAmount);
                }
            });
            
            monster.lastHeal = currentTime;
        }
        
        // Phantom ability
        if (monster.monsterType === MONSTER_TYPES.PHANTOM && 
            Math.random() < monster.monsterType.phaseChance) {
            monster.intangible = true;
            monster.intangibleUntil = currentTime + monster.monsterType.intangibilityDuration;
        }
        
        // Frost aura
        if (monster.monsterType === MONSTER_TYPES.FROST && monster.monsterType.slowAura) {
            monsters.forEach(otherMonster => {
                if (otherMonster === monster) return;
                
                const dx = otherMonster.x - monster.x;
                const dy = otherMonster.y - monster.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < monster.monsterType.slowRadius) {
                    otherMonster.slowed = true;
                    otherMonster.slowUntil = currentTime + 1000;
                    if (!otherMonster.originalSpeed) {
                        otherMonster.originalSpeed = otherMonster.speed;
                    }
                    otherMonster.speed = otherMonster.originalSpeed * (1 - monster.monsterType.slowAmount);
                }
            });
        }
        
        // Burn damage over time
        if (monster.burning && currentTime - monster.lastBurnTick > 500) {
            monster.health -= monster.burnDamage;
            createDamageIndicator(monster.x, monster.y, monster.burnDamage, false);
            monster.lastBurnTick = currentTime;
            if (monster.health <= 0) {
                // Monster death will be handled in projectile/melee loops
            }
        }
        
        // Poison damage over time
        if (monster.poisoned && currentTime - monster.lastPoisonTick > 500) {
            monster.health -= monster.poisonDamage;
            createDamageIndicator(monster.x, monster.y, monster.poisonDamage, false);
            monster.lastPoisonTick = currentTime;
            if (monster.health <= 0) {
                // Monster death will be handled in projectile/melee loops
            }
        }
        
        // Move towards player
        const dx = player.x - monster.x;
        const dy = player.y - monster.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 0) {
            monster.x += (dx / distance) * monster.speed;
            monster.y += (dy / distance) * monster.speed;
        }
        
        // Attack player
        if (distance < player.radius + monster.radius) {
            if (currentTime - monster.lastAttack >= monster.attackCooldown) {
                let actualDamage = monster.damage;
                
                // Check dodge
                if (Math.random() < player.dodgeChance) {
                    showMessage("DODGE!");
                    monster.lastAttack = currentTime;
                    return;
                }
                
                // First hit reduction
                if (player.firstHitReduction) {
                    actualDamage *= 0.5;
                    player.firstHitReduction = false;
                }
                
                if (player.damageReduction > 0) {
                    actualDamage *= (1 - player.damageReduction);
                }
                
                player.health -= actualDamage;
                monster.lastAttack = currentTime;
                
                // Thorns damage
                if (player.thornsDamage > 0) {
                    const thornsDamage = actualDamage * player.thornsDamage;
                    monster.health -= thornsDamage;
                    createDamageIndicator(monster.x, monster.y, Math.floor(thornsDamage), false);
                }
                
                // Vampire life steal
                if (monster.monsterType === MONSTER_TYPES.VAMPIRE && monster.monsterType.lifeSteal) {
                    const healAmount = actualDamage * monster.monsterType.lifeSteal;
                    monster.health = Math.min(monster.maxHealth, monster.health + healAmount);
                    createHealthPopup(monster.x, monster.y, Math.floor(healAmount));
                }
                
                // Golem smash attack
                if (monster.monsterType === MONSTER_TYPES.GOLEM && monster.monsterType.smashAttack) {
                    const distanceToPlayer = Math.sqrt(
                        Math.pow(player.x - monster.x, 2) + 
                        Math.pow(player.y - monster.y, 2)
                    );
                    if (distanceToPlayer < monster.monsterType.smashRadius) {
                        const smashDamage = actualDamage * monster.monsterType.smashDamage;
                        player.health -= smashDamage;
                        createDamageIndicator(player.x, player.y, Math.floor(smashDamage), true);
                    }
                }
                
                createDamageIndicator(player.x, player.y, Math.floor(actualDamage), false);
                
                // Explosive monster on death
                if (monster.monsterType && monster.monsterType.explosive) {
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

function updateGroundEffects(currentTime) {
    // Update ground fire
    for (let i = groundFire.length - 1; i >= 0; i--) {
        const fire = groundFire[i];
        if (currentTime - fire.startTime > fire.duration) {
            groundFire.splice(i, 1);
            continue;
        }
        
        // Damage monsters in fire
        monsters.forEach(monster => {
            const dx = monster.x - fire.x;
            const dy = monster.y - fire.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < fire.radius + monster.radius) {
                if (!monster.lastFireTick || currentTime - monster.lastFireTick > 500) {
                    monster.health -= fire.damage;
                    createDamageIndicator(monster.x, monster.y, fire.damage, false);
                    monster.lastFireTick = currentTime;
                }
            }
        });
    }
    
    // Update poison clouds
    for (let i = poisonClouds.length - 1; i >= 0; i--) {
        const cloud = poisonClouds[i];
        if (currentTime - cloud.startTime > cloud.duration) {
            poisonClouds.splice(i, 1);
            continue;
        }
        
        monsters.forEach(monster => {
            const dx = monster.x - cloud.x;
            const dy = monster.y - cloud.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < cloud.radius + monster.radius) {
                if (!monster.lastPoisonTick || currentTime - monster.lastPoisonTick > 500) {
                    monster.health -= cloud.damage;
                    createDamageIndicator(monster.x, monster.y, cloud.damage, false);
                    monster.lastPoisonTick = currentTime;
                }
            }
        });
    }
    
    // Update void zones
    for (let i = voidZones.length - 1; i >= 0; i--) {
        const zone = voidZones[i];
        if (currentTime - zone.startTime > zone.duration) {
            voidZones.splice(i, 1);
            continue;
        }
        
        monsters.forEach(monster => {
            const dx = monster.x - zone.x;
            const dy = monster.y - zone.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < zone.radius + monster.radius) {
                if (!zone.lastTick || currentTime - zone.lastTick > 500) {
                    monster.health -= zone.damage;
                    createDamageIndicator(monster.x, monster.y, zone.damage, false);
                    zone.lastTick = currentTime;
                }
            }
        });
    }
    
    // Update traps
    for (let i = activeTraps.length - 1; i >= 0; i--) {
        const trap = activeTraps[i];
        if (!trap.active) continue;
        
        monsters.forEach(monster => {
            const dx = monster.x - trap.x;
            const dy = monster.y - trap.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < trap.radius + monster.radius) {
                monster.health -= trap.damage;
                createDamageIndicator(monster.x, monster.y, trap.damage, true);
                trap.active = false;
                
                addVisualEffect({
                    type: 'explosion',
                    x: trap.x,
                    y: trap.y,
                    color: '#FF0000',
                    startTime: currentTime,
                    duration: 300
                });
            }
        });
        
        if (!trap.active) {
            activeTraps.splice(i, 1);
        }
    }
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
                
            case 'explosion':
                ctx.fillStyle = `rgba(255, 69, 0, ${alpha})`;
                ctx.shadowColor = '#FF4500';
                ctx.shadowBlur = 20;
                ctx.beginPath();
                ctx.arc(effect.x, effect.y, 40 * (1 - progress), 0, Math.PI * 2);
                ctx.fill();
                break;
                
            case 'teleport':
                ctx.strokeStyle = `rgba(138, 43, 226, ${alpha})`;
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.arc(effect.x, effect.y, 30 * progress, 0, Math.PI * 2);
                ctx.stroke();
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
        
        if (projectile.beamWidth > 0) {
            // Railgun beam
            ctx.lineWidth = projectile.beamWidth;
            ctx.beginPath();
            ctx.moveTo(projectile.x, projectile.y);
            ctx.lineTo(projectile.x + Math.cos(projectile.angle) * 50, 
                      projectile.y + Math.sin(projectile.angle) * 50);
            ctx.stroke();
        } else {
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
        }
    });
}

function drawMonsters() {
    const currentTime = Date.now();
    
    monsters.forEach(monster => {
        ctx.save();
        ctx.translate(monster.x, monster.y);
        
        // Handle intangible effect
        if (monster.intangible && monster.intangibleUntil > currentTime) {
            ctx.globalAlpha = 0.5;
        }
        
        // Body
        ctx.fillStyle = monster.color;
        ctx.shadowColor = monster.color;
        ctx.shadowBlur = monster.isBoss ? 20 : 10;
        ctx.beginPath();
        ctx.arc(0, 0, monster.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Shield overlay
        if (monster.shieldHealth > 0) {
            ctx.strokeStyle = '#00FFFF';
            ctx.lineWidth = 3;
            ctx.shadowColor = '#00FFFF';
            ctx.beginPath();
            ctx.arc(0, 0, monster.radius + 5, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        // Stun overlay
        if (monster.stunned && monster.stunnedUntil > currentTime) {
            ctx.fillStyle = 'rgba(255, 255, 0, 0.3)';
            ctx.beginPath();
            ctx.arc(0, 0, monster.radius, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Freeze overlay
        if (monster.frozen && monster.frozenUntil > currentTime) {
            ctx.fillStyle = 'rgba(0, 255, 255, 0.3)';
            ctx.beginPath();
            ctx.arc(0, 0, monster.radius, 0, Math.PI * 2);
            ctx.fill();
        }
        
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
        
        // Shield bar
        if (monster.shieldHealth > 0) {
            const shieldPercent = monster.shieldHealth / (monster.monsterType.shieldHealth || 30);
            const shieldBarY = barY - 6;
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(barX, shieldBarY, barWidth, barHeight);
            ctx.fillStyle = '#00FFFF';
            ctx.fillRect(barX, shieldBarY, barWidth * shieldPercent, barHeight);
        }
        
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

// Start game loop
gameLoop();
