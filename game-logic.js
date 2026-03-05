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
        icon: '👾',
        goldDrop: { min: 5, max: 15 }
    },
    FAST: {
        name: 'Fast',
        color: '#4ecdc4',
        speed: 2.5,
        healthMultiplier: 0.7,
        damageMultiplier: 0.8,
        sizeMultiplier: 0.8,
        icon: '⚡',
        goldDrop: { min: 3, max: 10 }
    },
    TANK: {
        name: 'Tank',
        color: '#ffa500',
        speed: 0.5,
        healthMultiplier: 2.5,
        damageMultiplier: 1.2,
        sizeMultiplier: 1.4,
        icon: '🛡️',
        goldDrop: { min: 8, max: 20 }
    },
    EXPLOSIVE: {
        name: 'Explosive',
        color: '#ff0000',
        speed: 1,
        healthMultiplier: 0.8,
        damageMultiplier: 1.5,
        sizeMultiplier: 1,
        icon: '💥',
        explosive: true,
        explosionRadius: 100,
        explosionDamage: 3.0,
        goldDrop: { min: 10, max: 25 }
    },
    GUNNER: {
        name: 'Gunner',
        color: '#ff69b4',
        speed: 0.9,
        healthMultiplier: 0.9,
        damageMultiplier: 1.2,
        sizeMultiplier: 0.9,
        icon: '🔫',
        ranged: true,
        projectileDamage: 8,
        projectileSpeed: 6,
        attackRange: 250,
        projectileColor: '#ff69b4',
        attackCooldown: 1500,
        goldDrop: { min: 12, max: 30 }
    },
    MINION: {
        name: 'Minion',
        color: '#9370db',
        speed: 1.5,
        healthMultiplier: 0.2,
        damageMultiplier: 0.4,
        sizeMultiplier: 0.5,
        icon: '👾',
        isMinion: true,
        goldDrop: { min: 1, max: 5 }
    },
    SPLITTER: {
        name: 'Splitter',
        color: '#00ff00',
        speed: 1.2,
        healthMultiplier: 0.6,
        damageMultiplier: 0.7,
        sizeMultiplier: 0.9,
        icon: '🔀',
        isSplitter: true,
        splitCount: 2,
        splitHealthPercent: 0.5,
        goldDrop: { min: 15, max: 25 }
    },
    DASHER: {
        name: 'Dasher',
        color: '#00ffff',
        speed: 1.5,
        dashSpeed: 4.0,
        healthMultiplier: 0.5,
        damageMultiplier: 1.3,
        sizeMultiplier: 0.8,
        icon: '⚡',
        isDasher: true,
        dashCooldown: 3000,
        dashRange: 300,
        goldDrop: { min: 20, max: 35 }
    },
    BOSS: {
        name: 'BOSS',
        color: '#ffd700',
        speed: 0.7,
        healthMultiplier: 15,
        damageMultiplier: 2.0,
        sizeMultiplier: 2.2,
        icon: '👑',
        isBoss: true,
        lifeSteal: 0.1,
        projectileSpeed: 5,
        projectileDamage: 15,
        projectileCooldown: 2000,
        goldDrop: { min: 100, max: 300 }
    }
};

// Boss melee weapons
const BOSS_WEAPONS = {
    DAGGER: {
        name: 'Shadow Dagger',
        type: 'melee',
        meleeType: 'pierce',
        baseDamage: 25,
        attackSpeed: 2.0,
        range: 150,
        description: 'Quick stabbing attacks',
        swingColor: '#8B0000',
        swingAngle: 45,
        animation: 'daggerStab',
        trailColor: '#FF0000',
        bladeColor: '#8B0000',
        hiltColor: '#4A0404',
        sparkleColor: '#FF4444',
        pierceCount: 3
    },
    WAR_HAMMER: {
        name: 'Crusher',
        type: 'melee',
        meleeType: 'aoe',
        baseDamage: 40,
        attackSpeed: 0.8,
        range: 180,
        description: 'Massive AOE slam',
        swingColor: '#8B4513',
        swingAngle: 360,
        animation: 'hammerSmash',
        trailColor: '#FF4500',
        headColor: '#696969',
        handleColor: '#8B4513',
        shockwaveColor: '#FF4500',
        shockwaveIntensity: 2.5
    },
    SCYTHE: {
        name: 'Soul Reaper',
        type: 'melee',
        meleeType: 'aoe',
        baseDamage: 35,
        attackSpeed: 1.2,
        range: 250,
        description: 'Dashing scythe slash with lifesteal',
        swingColor: '#4B0082',
        swingAngle: 270,
        animation: 'scytheSwing',
        trailColor: '#9400D3',
        bladeColor: '#4B0082',
        handleColor: '#2F4F4F',
        edgeColor: '#FF00FF',
        sparkleColor: '#FF69B4',
        dashRange: 500,
        dashSpeed: 15,
        lifeSteal: 0.15
    }
};

// Load scythe image
const scytheImage = new Image();
scytheImage.src = 'assets/scythe.png';

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
        this.baseCost = weaponData.cost || 0;
        this.lastAttack = 0;
        this.animation = weaponData.animation || 'default';
        
        this.spread = weaponData.spread || 0;
        this.lastAttackTime = 0;
        
        this.usesAmmo = weaponData.usesAmmo || false;
        this.isThrowable = weaponData.isThrowable || false;
        this.resetEachRound = weaponData.resetEachRound || false;
        this.projectileSize = weaponData.projectileSize || 4;
        this.spinSpeed = weaponData.spinSpeed || 0;
        
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
        this.returnSpeed = weaponData.returnSpeed || 0;
        this.maxTargets = weaponData.maxTargets || 1;
        this.useImage = weaponData.useImage || false;
        this.imagePath = weaponData.imagePath || null;
        this.pierceCount = weaponData.pierceCount || 1;
        
        // Dual daggers special property
        this.dualStrike = weaponData.dualStrike || false;
        
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
                if (!this.isThrowable) {
                    this.currentAmmo = this.magazineSize;
                }
            }
            
            if (this.pelletCount && this.tierMultipliers.pelletCount) {
                this.pelletCount = Math.round(this.pelletCount * this.tierMultipliers.pelletCount[this.tier]);
            }
            
            if (this.bounceCount && this.tierMultipliers.bounceCount) {
                this.bounceCount = Math.round(this.bounceCount * this.tierMultipliers.bounceCount[this.tier]);
            }
            
            if (this.maxTargets && this.tierMultipliers.maxTargets) {
                this.maxTargets = Math.round(this.maxTargets * this.tierMultipliers.maxTargets[this.tier]);
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
        if (this.isReloading) {
            return false;
        }
        
        if (this.usesAmmo && this.currentAmmo <= 0) {
            if (!this.isThrowable) {
                this.startReload();
            }
            return false;
        }
        
        if (this.lastAttackTime > 0 && currentTime - this.lastAttackTime < 5) {
            return false;
        }
        
        const timeSinceLastAttack = currentTime - this.lastAttack;
        const attackCooldown = 1000 / this.attackSpeed;
        
        return timeSinceLastAttack >= attackCooldown;
    }

    startReload() {
        if (!this.usesAmmo || this.isReloading || this.currentAmmo === this.magazineSize || this.isThrowable) {
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
        if (this.currentAmmo <= 0 && !this.isThrowable) {
            this.startReload();
        }
    }

    resetAmmo() {
        if (this.resetEachRound) {
            this.currentAmmo = this.magazineSize;
            this.isReloading = false;
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
                        isPellet: true,
                        startTime: currentTime,
                        size: 3
                    });
                }
                return attacks;
            } else if (this.id === 'boomerang') {
                const angle = Math.atan2(targetY - playerY, targetX - playerX);
                return {
                    type: 'ranged',
                    x: playerX,
                    y: playerY,
                    startX: playerX,
                    startY: playerY,
                    angle: angle,
                    speed: this.projectileSpeed,
                    returnSpeed: this.returnSpeed,
                    range: this.range,
                    damage: this.baseDamage,
                    color: this.projectileColor,
                    weaponId: this.id,
                    animation: this.animation,
                    isBoomerang: true,
                    useImage: this.useImage,
                    state: 'outgoing',
                    distanceTraveled: 0,
                    targetsHit: [],
                    maxTargets: this.maxTargets,
                    rotation: 0,
                    startTime: currentTime,
                    hitThisFrame: false,
                    size: 4
                };
            } else if (this.id === 'throwing_knives') {
                const angle = Math.atan2(targetY - playerY, targetX - playerX);
                // Add slight spread for throwing knives
                const spreadAmount = (Math.random() - 0.5) * this.spread;
                const finalAngle = angle + spreadAmount;
                
                return {
                    type: 'ranged',
                    x: playerX,
                    y: playerY,
                    angle: finalAngle,
                    speed: this.projectileSpeed,
                    range: this.range,
                    damage: this.baseDamage,
                    color: this.projectileColor,
                    weaponId: this.id,
                    animation: 'knife',
                    isThrowable: true,
                    startTime: currentTime,
                    size: this.projectileSize || 6,
                    spinSpeed: this.spinSpeed || 0,
                    rotation: 0
                };
            } else {
                const baseAngle = Math.atan2(targetY - playerY, targetX - playerX);
                const spreadAmount = (Math.random() - 0.5) * this.spread;
                const angle = baseAngle + spreadAmount;
                
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
                    startTime: currentTime,
                    size: 4
                };
            }
        } else {
            const angle = Math.atan2(targetY - playerY, targetX - playerX);
            
            if (this.dualStrike) {
                return {
                    type: 'melee',
                    x: playerX,
                    y: playerY,
                    radius: this.range,
                    damage: this.baseDamage,
                    color: this.swingColor,
                    startTime: Date.now(),
                    duration: 200,
                    swingAngle: this.swingAngle,
                    meleeType: 'dual',
                    angle: angle,
                    pierceCount: this.pierceCount,
                    weaponId: this.id,
                    animation: this.animation,
                    trailColor: this.trailColor,
                    sparkleColor: this.sparkleColor,
                    bladeColor: this.bladeColor,
                    hiltColor: this.hiltColor,
                    gripColor: this.gripColor,
                    dualStrike: true
                };
            }
            
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
        const baseValue = Math.floor(this.baseCost * 0.5);
        const tierMultiplier = 1 + (this.tier - 1) * 0.5;
        return Math.floor(baseValue * tierMultiplier);
    }
    
    getTypeDescription() {
        if (this.type === 'ranged') {
            if (this.id === 'shotgun') return 'SHOTGUN';
            if (this.id === 'laser') return 'ENERGY';
            if (this.id === 'boomerang') return 'BOOMERANG';
            if (this.id === 'throwing_knives') return 'THROWING';
            return 'RANGED';
        }
        if (this.meleeType === 'single') return 'SINGLE';
        if (this.meleeType === 'aoe') return 'AOE 360°';
        if (this.meleeType === 'pierce') return 'PIERCE';
        if (this.meleeType === 'dual') return 'DUAL';
        return 'MELEE';
    }
    
    getDisplayName() {
        if (this.tier === 1) return this.name;
        
        const tierNames = ['', 'II', 'III', 'IV', 'V', 'VI'];
        return `${this.name} ${tierNames[this.tier]}`;
    }
    
    getShopCost() {
        if (this.tier === 2) {
            return Math.floor(this.baseCost * 2 * 0.75);
        } else if (this.tier > 2) {
            return Math.floor(this.baseCost * Math.pow(1.8, this.tier - 1));
        }
        return this.baseCost;
    }
    
    getMergeCost(otherWeapon) {
        if (this.id !== otherWeapon.id || this.tier !== otherWeapon.tier) {
            return 0;
        }
        
        if (this.tier >= 5) {
            return 0;
        }
        
        return Math.floor(this.baseCost * 0.3 * this.tier);
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

let gameState = 'start';
let wave = 1;
let gold = 50;
let kills = 0;
let shopItems = [];
let spawnIndicators = [];
let selectedWeaponIndex = -1;
let visualEffects = [];
let mergeTargetIndex = -1;
let lastFrameTime = Date.now();
let refreshCount = 0;
let refreshCost = 5;
let waveActive = false;
let waveStartTime = 0;
let bossAbilities = {
    shotgun: false,
    asteroids: [],
    slowField: null,
    enraged: false,
    bossWeapon: null,
    bossWeaponAttack: 0,
    bossDash: false,
    bossDashTarget: { x: 0, y: 0 },
    bossDashStart: 0,
    bossDashCooldown: 0,
    bossDashDirection: { x: 0, y: 0 },
    bossDashDistance: 0,
    minionSpawnTimer: 0
};
let asteroidTimer = null;
let minionSpawnInterval = null;

// Dasher tracking
let dashers = [];
let splitterTracking = [];

// Tower tracking
let playerTowers = {
    landmines: {
        count: 0,
        max: 5,
        active: []
    }
};

// Temporary buffs
let activeBuffs = {
    rage: {
        active: false,
        endTime: 0,
        originalMultiplier: 1.0
    }
};

// Stats panel
let statsPanelVisible = false;

// Joystick variables
let joystickActive = false;
let joystickStartX = 0;
let joystickStartY = 0;
let joystickCurrentX = 0;
let joystickCurrentY = 0;
let joystickBaseX = 0;
let joystickBaseY = 0;
let joystickMaxDistance = 50;

// Message queue for notifications
let messageQueue = [];
let messageContainer = null;

// Touch handling
let touchStartTime = 0;
let touchMoved = false;
let lastTouchX = 0;
let lastTouchY = 0;

let keys = {
    w: false,
    a: false,
    s: false,
    d: false,
    up: false,
    down: false,
    left: false,
    right: false,
    space: false
};

// Game Objects
const player = {
    x: 400,
    y: 300,
    radius: 20,
    health: 20,
    maxHealth: 20,
    damageMultiplier: 1.0,
    speed: 3,
    baseSpeed: 3,
    speedMultiplier: 1.0,
    color: '#ff6b6b',
    
    lifeSteal: 0,
    criticalChance: 0,
    goldMultiplier: 0,
    healthRegen: 0,
    healthRegenPercent: 0,
    damageReduction: 0,
    lastRegen: 0,
    
    weapons: [],
    projectiles: [],
    meleeAttacks: [],
    
    ammoPack: false,
    
    dodgeChance: 0,
    thornsDamage: 0,
    attackSpeedMultiplier: 1,
    firstHitReduction: false,
    firstHitActive: false, // Tracks if the first hit reduction is still available this wave
    voidCrystalChance: 0,
    guardianAngelUsed: false,
    
    consumables: [],
    
    berserkerRing: false,
    sharpeningStone: false,
    sharpeningStoneWave: 0,
    enchantersInk: false,
    guardianAngel: false,
    bloodContract: false,
    bloodContractStacks: 0,
    bloodContractInterval: null,
    lastBloodDamage: 0,
    
    inSlowField: false,
    slowFieldTicks: 0,
    lastSlowFieldTick: 0,
    
    updateHealthDisplay: null
};

let monsters = [];
let mouseX = 400;
let mouseY = 300;

let groundFire = [];
let poisonClouds = [];
let voidZones = [];
let activeTraps = [];
let bossProjectiles = [];
let monsterProjectiles = [];

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
const consumablesGrid = document.getElementById('consumablesGrid');

const healthValue = document.getElementById('healthValue');
const damageValue = document.getElementById('damageValue');
const speedValue = document.getElementById('speedValue');
const goldValue = document.getElementById('goldValue');
const waveValue = document.getElementById('waveValue');
const killsValue = document.getElementById('killsValue');
const healthFill = document.getElementById('healthFill');

const boomerangImage = new Image();
boomerangImage.src = 'assets/boomerang.png';

player.updateHealthDisplay = function() {
    if (healthValue) {
        healthValue.textContent = `${Math.floor(this.health)}/${this.maxHealth}`;
    }
    if (healthFill) {
        const percent = (this.health / this.maxHealth) * 100;
        healthFill.style.width = `${percent}%`;
    }
};

// ============================================
// TOWER FUNCTIONS
// ============================================

function spawnRandomLandmine() {
    if (playerTowers.landmines.count <= 0) return;
    
    let x, y;
    const minDistanceFromPlayer = 100;
    let attempts = 0;
    let validPosition = false;
    
    while (!validPosition && attempts < 50) {
        x = 50 + Math.random() * (canvas.width - 100);
        y = 50 + Math.random() * (canvas.height - 100);
        
        const dx = x - player.x;
        const dy = y - player.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > minDistanceFromPlayer) {
            validPosition = true;
        }
        attempts++;
    }
    
    const landmine = {
        x: x,
        y: y,
        radius: 15,
        damage: 80,
        explosionRadius: 60,
        active: true,
        startTime: Date.now(),
        color: '#8B4513',
        triggerColor: '#FF0000'
    };
    
    playerTowers.landmines.active.push(landmine);
    
    addVisualEffect({
        type: 'landmineSpawn',
        x: x,
        y: y,
        radius: 20,
        color: '#8B4513',
        startTime: Date.now(),
        duration: 500
    });
    
    queueMessage("Landmine deployed!");
}

function checkLandmineTriggers() {
    for (let i = playerTowers.landmines.active.length - 1; i >= 0; i--) {
        const mine = playerTowers.landmines.active[i];
        
        for (let j = 0; j < monsters.length; j++) {
            const monster = monsters[j];
            const dx = monster.x - mine.x;
            const dy = monster.y - mine.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < mine.radius + monster.radius) {
                explodeLandmine(mine, i);
                break;
            }
        }
    }
}

function explodeLandmine(mine, index) {
    for (let i = monsters.length - 1; i >= 0; i--) {
        const monster = monsters[i];
        const dx = monster.x - mine.x;
        const dy = monster.y - mine.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mine.explosionRadius + monster.radius) {
            monster.health -= mine.damage;
            createDamageIndicator(monster.x, monster.y, mine.damage, true);
            
            if (monster.health <= 0) {
                const goldRange = monster.monsterType.goldDrop || { min: 5, max: 15 };
                const goldDrop = Math.floor(Math.random() * (goldRange.max - goldRange.min + 1)) + goldRange.min;
                const goldEarned = Math.floor(goldDrop * (1 + player.goldMultiplier));
                gold += goldEarned;
                createGoldPopup(monster.x, monster.y, goldEarned);
                
                monsters.splice(i, 1);
                kills++;
            }
        }
    }
    
    addVisualEffect({
        type: 'explosion',
        x: mine.x,
        y: mine.y,
        radius: mine.explosionRadius,
        color: '#FF4500',
        startTime: Date.now(),
        duration: 400
    });
    
    playerTowers.landmines.active.splice(index, 1);
}

// ============================================
// CONSUMABLE FUNCTIONS
// ============================================

function useBomb() {
    for (let i = monsters.length - 1; i >= 0; i--) {
        const monster = monsters[i];
        monster.health -= 100;
        createDamageIndicator(monster.x, monster.y, 100, true);
        
        if (monster.health <= 0) {
            const goldRange = monster.monsterType.goldDrop || { min: 5, max: 15 };
            const goldDrop = Math.floor(Math.random() * (goldRange.max - goldRange.min + 1)) + goldRange.min;
            const goldEarned = Math.floor(goldDrop * (1 + player.goldMultiplier));
            gold += goldEarned;
            createGoldPopup(monster.x, monster.y, goldEarned);
            
            monsters.splice(i, 1);
            kills++;
        }
    }
    
    addVisualEffect({
        type: 'screenExplosion',
        x: canvas.width / 2,
        y: canvas.height / 2,
        radius: 300,
        color: '#FF4500',
        startTime: Date.now(),
        duration: 500
    });
    
    queueMessage("BOOM! All monsters damaged!");
}

function activateRagePotion() {
    activeBuffs.rage.active = true;
    activeBuffs.rage.originalMultiplier = player.damageMultiplier;
    activeBuffs.rage.endTime = Date.now() + 10000;
    
    player.damageMultiplier *= 1.5;
    
    addVisualEffect({
        type: 'rage',
        x: player.x,
        y: player.y,
        radius: 50,
        color: '#FF0000',
        startTime: Date.now(),
        duration: 10000
    });
    
    queueMessage("RAGE! +50% damage for 10 seconds!");
    
    setTimeout(() => {
        if (activeBuffs.rage.active) {
            activeBuffs.rage.active = false;
            player.damageMultiplier = activeBuffs.rage.originalMultiplier;
            queueMessage("Rage effect ended");
        }
    }, 10000);
}

function useExpScroll() {
    if (player.weapons.length === 0) {
        queueMessage("No weapons to upgrade!");
        return;
    }
    
    const randomIndex = Math.floor(Math.random() * player.weapons.length);
    const weapon = player.weapons[randomIndex];
    
    if (weapon.tier >= 5) {
        queueMessage(`${weapon.name} is already max tier!`);
        return;
    }
    
    const oldTier = weapon.tier;
    weapon.tier++;
    weapon.applyTierBonuses();
    
    // Reset ammo for throwable weapons after upgrade
    if (weapon.resetEachRound) {
        weapon.resetAmmo();
    }
    
    addVisualEffect({
        type: 'upgrade',
        x: player.x,
        y: player.y,
        radius: 40,
        color: '#FFD700',
        startTime: Date.now(),
        duration: 1000
    });
    
    queueMessage(`${weapon.name} upgraded from Tier ${oldTier} to Tier ${weapon.tier}!`);
    updateWeaponDisplay();
}

// ============================================
// MESSAGE QUEUE SYSTEM
// ============================================

function createMessageContainer() {
    messageContainer = document.createElement('div');
    messageContainer.id = 'messageContainer';
    messageContainer.className = 'message-container';
    document.body.appendChild(messageContainer);
}

function queueMessage(text, duration = 2000) {
    messageQueue.push({ text, duration });
    if (messageQueue.length === 1) {
        showNextMessage();
    }
}

function showNextMessage() {
    if (messageQueue.length === 0 || !messageContainer) return;
    
    const message = messageQueue[0];
    const messageElement = document.createElement('div');
    messageElement.className = 'message-item';
    messageElement.textContent = message.text;
    
    messageContainer.appendChild(messageElement);
    
    setTimeout(() => {
        messageElement.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        messageElement.classList.remove('show');
        messageElement.classList.add('hide');
        
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.parentNode.removeChild(messageElement);
            }
            messageQueue.shift();
            showNextMessage();
        }, 300);
    }, message.duration);
}

// ============================================
// JOYSTICK
// ============================================

function createJoystick() {
    const joystickContainer = document.createElement('div');
    joystickContainer.id = 'joystickContainer';
    joystickContainer.className = 'joystick-container';
    joystickContainer.innerHTML = `
        <div id="joystickBase" class="joystick-base">
            <div id="joystickHandle" class="joystick-handle"></div>
        </div>
    `;
    
    document.body.appendChild(joystickContainer);
    
    const joystickBase = document.getElementById('joystickBase');
    const joystickHandle = document.getElementById('joystickHandle');
    
    function getJoystickPosition(e) {
        const touch = e.touches[0];
        const rect = joystickBase.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        let deltaX = touch.clientX - centerX;
        let deltaY = touch.clientY - centerY;
        
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        if (distance > joystickMaxDistance) {
            deltaX = (deltaX / distance) * joystickMaxDistance;
            deltaY = (deltaY / distance) * joystickMaxDistance;
        }
        
        return { deltaX, deltaY };
    }
    
    joystickBase.addEventListener('touchstart', (e) => {
        e.preventDefault();
        joystickActive = true;
        const rect = joystickBase.getBoundingClientRect();
        joystickBaseX = rect.left + rect.width / 2;
        joystickBaseY = rect.top + rect.height / 2;
        
        const { deltaX, deltaY } = getJoystickPosition(e);
        joystickCurrentX = deltaX;
        joystickCurrentY = deltaY;
        
        joystickHandle.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
        joystickBase.classList.add('active');
    });
    
    joystickBase.addEventListener('touchmove', (e) => {
        e.preventDefault();
        if (!joystickActive) return;
        
        const { deltaX, deltaY } = getJoystickPosition(e);
        joystickCurrentX = deltaX;
        joystickCurrentY = deltaY;
        
        joystickHandle.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    });
    
    joystickBase.addEventListener('touchend', (e) => {
        e.preventDefault();
        joystickActive = false;
        joystickCurrentX = 0;
        joystickCurrentY = 0;
        
        joystickHandle.style.transform = 'translate(0px, 0px)';
        joystickBase.classList.remove('active');
    });
    
    joystickBase.addEventListener('touchcancel', (e) => {
        e.preventDefault();
        joystickActive = false;
        joystickCurrentX = 0;
        joystickCurrentY = 0;
        
        joystickHandle.style.transform = 'translate(0px, 0px)';
        joystickBase.classList.remove('active');
    });
}

// ============================================
// STATS PANEL
// ============================================

function createStatsPanel() {
    const panel = document.createElement('div');
    panel.id = 'statsPanel';
    panel.className = 'stats-panel-hidden';
    panel.innerHTML = `
        <div class="stats-header">
            <h3>Player Stats</h3>
            <button id="closeStatsBtn">✕</button>
        </div>
        <div class="stats-content">
            <div class="stat-row">
                <span class="stat-label">❤️ Health:</span>
                <span class="stat-value" id="stat-health">0/0</span>
            </div>
            <div class="stat-row">
                <span class="stat-label">⚔️ Damage Multiplier:</span>
                <span class="stat-value" id="stat-damage">100%</span>
            </div>
            <div class="stat-row">
                <span class="stat-label">👟 Speed Multiplier:</span>
                <span class="stat-value" id="stat-speed">100%</span>
            </div>
            <div class="stat-row">
                <span class="stat-label">💰 Gold:</span>
                <span class="stat-value" id="stat-gold">0</span>
            </div>
            <div class="stat-row">
                <span class="stat-label">👾 Kills:</span>
                <span class="stat-value" id="stat-kills">0</span>
            </div>
            <div class="stat-row">
                <span class="stat-label">🌊 Wave:</span>
                <span class="stat-value" id="stat-wave">0</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-row">
                <span class="stat-label">🦇 Life Steal:</span>
                <span class="stat-value" id="stat-lifesteal">0%</span>
            </div>
            <div class="stat-row">
                <span class="stat-label">🎯 Critical:</span>
                <span class="stat-value" id="stat-critical">0%</span>
            </div>
            <div class="stat-row">
                <span class="stat-label">💰 Gold Multi:</span>
                <span class="stat-value" id="stat-goldmulti">0%</span>
            </div>
            <div class="stat-row">
                <span class="stat-label">🔄 Regen:</span>
                <span class="stat-value" id="stat-regen">0%</span>
            </div>
            <div class="stat-row">
                <span class="stat-label">🛡️ Damage Red:</span>
                <span class="stat-value" id="stat-dmgred">0%</span>
            </div>
            <div class="stat-row">
                <span class="stat-label">💨 Dodge:</span>
                <span class="stat-value" id="stat-dodge">0%</span>
            </div>
            <div class="stat-row">
                <span class="stat-label">🌵 Thorns:</span>
                <span class="stat-value" id="stat-thorns">0%</span>
            </div>
            <div class="stat-row">
                <span class="stat-label">⚡ Attack Speed:</span>
                <span class="stat-value" id="stat-attackspeed">1.0x</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-row">
                <span class="stat-label">💣 Landmines:</span>
                <span class="stat-value" id="stat-landmines">0/5</span>
            </div>
            <div class="stat-row">
                <span class="stat-label">🔰 Runic Plate:</span>
                <span class="stat-value" id="stat-runic">No</span>
            </div>
            <div class="stat-row">
                <span class="stat-label">📜 Blood Contract:</span>
                <span class="stat-value" id="stat-bloodcontract">No (0)</span>
            </div>
            <div class="stat-row">
                <span class="stat-label">😇 Guardian Angel:</span>
                <span class="stat-value" id="stat-guardian">No</span>
            </div>
            <div class="stat-row">
                <span class="stat-label">⚡ Berserker Ring:</span>
                <span class="stat-value" id="stat-berserker">No</span>
            </div>
        </div>
    `;
    
    document.body.appendChild(panel);
    
    document.getElementById('closeStatsBtn').addEventListener('click', toggleStatsPanel);
    document.getElementById('closeStatsBtn').addEventListener('touchstart', (e) => {
        e.preventDefault();
        toggleStatsPanel();
    });
}

function toggleStatsPanel() {
    const panel = document.getElementById('statsPanel');
    statsPanelVisible = !statsPanelVisible;
    panel.className = statsPanelVisible ? 'stats-panel-visible' : 'stats-panel-hidden';
    
    if (statsPanelVisible) {
        updateStatsPanel();
    }
}

function updateStatsPanel() {
    if (!statsPanelVisible) return;
    
    document.getElementById('stat-health').textContent = `${Math.floor(player.health)}/${player.maxHealth}`;
    document.getElementById('stat-damage').textContent = (player.damageMultiplier * 100).toFixed(0) + '%';
    document.getElementById('stat-speed').textContent = (player.speedMultiplier * 100).toFixed(0) + '%';
    document.getElementById('stat-gold').textContent = gold;
    document.getElementById('stat-kills').textContent = kills;
    document.getElementById('stat-wave').textContent = wave;
    document.getElementById('stat-landmines').textContent = `${playerTowers.landmines.count}/${playerTowers.landmines.max}`;
    document.getElementById('stat-runic').textContent = player.firstHitReduction ? 'Yes' : 'No';
    
    document.getElementById('stat-lifesteal').textContent = Math.floor(player.lifeSteal * 100) + '%';
    document.getElementById('stat-critical').textContent = Math.floor(player.criticalChance * 100) + '%';
    document.getElementById('stat-goldmulti').textContent = Math.floor(player.goldMultiplier * 100) + '%';
    document.getElementById('stat-regen').textContent = Math.floor((player.healthRegenPercent || 0) * 100) + '%';
    document.getElementById('stat-dmgred').textContent = Math.floor(player.damageReduction * 100) + '%';
    document.getElementById('stat-dodge').textContent = Math.floor(player.dodgeChance * 100) + '%';
    document.getElementById('stat-thorns').textContent = Math.floor(player.thornsDamage * 100) + '%';
    document.getElementById('stat-attackspeed').textContent = player.attackSpeedMultiplier.toFixed(1) + 'x';
    
    document.getElementById('stat-bloodcontract').textContent = player.bloodContract ? `Yes (${player.bloodContractStacks})` : 'No (0)';
    document.getElementById('stat-guardian').textContent = player.guardianAngel ? 'Yes' : 'No';
    document.getElementById('stat-berserker').textContent = player.berserkerRing ? 'Yes' : 'No';
}

// ============================================
// SAVE/LOAD FUNCTIONS
// ============================================

function saveGame() {
    if (gameState === 'start' || gameState === 'gameover') return;
    
    const gameData = {
        wave: wave,
        gold: gold,
        kills: kills,
        gameState: gameState,
        waveActive: waveActive,
        refreshCount: refreshCount,
        refreshCost: refreshCost,
        player: {
            x: player.x,
            y: player.y,
            health: player.health,
            maxHealth: player.maxHealth,
            damageMultiplier: player.damageMultiplier,
            speed: player.speed,
            baseSpeed: player.baseSpeed,
            speedMultiplier: player.speedMultiplier,
            lifeSteal: player.lifeSteal,
            criticalChance: player.criticalChance,
            goldMultiplier: player.goldMultiplier,
            healthRegen: player.healthRegen,
            healthRegenPercent: player.healthRegenPercent,
            damageReduction: player.damageReduction,
            dodgeChance: player.dodgeChance,
            thornsDamage: player.thornsDamage,
            attackSpeedMultiplier: player.attackSpeedMultiplier,
            firstHitReduction: player.firstHitReduction,
            firstHitActive: player.firstHitActive,
            guardianAngel: player.guardianAngel,
            guardianAngelUsed: player.guardianAngelUsed,
            bloodContract: player.bloodContract,
            bloodContractStacks: player.bloodContractStacks,
            berserkerRing: player.berserkerRing,
            sharpeningStone: player.sharpeningStone,
            sharpeningStoneWave: player.sharpeningStoneWave,
            enchantersInk: player.enchantersInk,
            consumables: player.consumables
        },
        towers: {
            landmines: {
                count: playerTowers.landmines.count,
                max: playerTowers.landmines.max
            }
        },
        weapons: player.weapons.map(w => ({
            id: w.id,
            tier: w.tier,
            currentAmmo: w.currentAmmo,
            isReloading: w.isReloading
        })),
        shopItems: shopItems,
        timestamp: Date.now()
    };
    
    localStorage.setItem('gameSave', JSON.stringify(gameData));
    queueMessage('Game saved!');
}

function loadGame() {
    const saved = localStorage.getItem('gameSave');
    if (!saved) {
        queueMessage('No saved game found!');
        return false;
    }
    
    try {
        const gameData = JSON.parse(saved);
        
        wave = gameData.wave;
        gold = gameData.gold;
        kills = gameData.kills;
        gameState = gameData.gameState;
        waveActive = gameData.waveActive;
        refreshCount = gameData.refreshCount || 0;
        refreshCost = gameData.refreshCost || 5;
        
        Object.assign(player, gameData.player);
        
        if (gameData.towers) {
            playerTowers.landmines.count = gameData.towers.landmines.count || 0;
            playerTowers.landmines.max = gameData.towers.landmines.max || 5;
        }
        
        player.weapons = [];
        gameData.weapons.forEach(w => {
            const weaponData = GAME_DATA.WEAPONS.find(weap => weap.id === w.id);
            if (weaponData) {
                const weapon = new WeaponInstance(weaponData, w.tier);
                if (weapon.usesAmmo) {
                    weapon.currentAmmo = w.currentAmmo;
                    weapon.isReloading = w.isReloading;
                }
                player.weapons.push(weapon);
            }
        });
        
        shopItems = gameData.shopItems || [];
        
        if (player.bloodContract) {
            if (player.bloodContractInterval) {
                clearInterval(player.bloodContractInterval);
            }
            
            player.bloodContractInterval = setInterval(() => {
                if (gameState === 'wave') {
                    const damagePercent = 0.01 * player.bloodContractStacks;
                    const damageAmount = Math.max(1, Math.floor(player.maxHealth * damagePercent));
                    
                    if (player.health > damageAmount) {
                        player.health -= damageAmount;
                    } else {
                        player.health = 1;
                    }
                    
                    updateUI();
                    createDamageIndicator(player.x, player.y, damageAmount, false);
                }
            }, 1000);
        }
        
        startScreen.style.display = 'none';
        waveCompleteOverlay.style.display = 'none';
        gameOverOverlay.style.display = 'none';
        
        if (gameState === 'wave') {
            startWave();
        } else if (gameState === 'shop') {
            nextWaveBtn.style.display = 'block';
            updateShopDisplay();
        } else if (gameState === 'statSelect') {
            showStatBuffs();
        }
        
        updateUI();
        updateWeaponDisplay();
        updateShopDisplay();
        updateConsumablesDisplay();
        
        queueMessage('Game loaded!');
        return true;
    } catch (e) {
        console.error('Failed to load game:', e);
        queueMessage('Failed to load save file!');
        return false;
    }
}

function clearSave() {
    localStorage.removeItem('gameSave');
    queueMessage('Save file cleared!');
}

function checkForSave() {
    const saved = localStorage.getItem('gameSave');
    if (saved) {
        const continueBtn = document.createElement('button');
        continueBtn.id = 'continueGameBtn';
        continueBtn.textContent = 'Continue Game';
        continueBtn.style.marginTop = '10px';
        continueBtn.style.background = 'linear-gradient(45deg, #4CAF50, #45a049)';
        
        continueBtn.addEventListener('click', (e) => {
            e.preventDefault();
            loadGame();
            startScreen.style.display = 'none';
        });
        
        continueBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            loadGame();
            startScreen.style.display = 'none';
        });
        
        if (!document.getElementById('continueGameBtn')) {
            startScreen.appendChild(continueBtn);
        }
    }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function getWeaponById(id) {
    return GAME_DATA.WEAPONS.find(w => w.id === id);
}

function getWaveConfig(waveNumber) {
    if (waveNumber <= GAME_DATA.WAVES.length) {
        const waveData = GAME_DATA.WAVES[waveNumber - 1];
        return {
            number: waveData.number,
            monsters: waveData.monsters,
            monsterHealth: waveData.monsterHealth,
            monsterDamage: waveData.monsterDamage,
            goldReward: waveData.goldReward,
            isBoss: waveData.isBoss || false,
            minions: waveData.minions || 0,
            spawnDelay: waveData.spawnDelay || 150
        };
    } else {
        const baseWave = GAME_DATA.WAVES[GAME_DATA.WAVES.length - 1];
        const extraWaves = waveNumber - GAME_DATA.WAVES.length;
        const scaleFactor = 1 + extraWaves * 0.15;
        return {
            number: waveNumber,
            monsters: Math.floor(baseWave.monsters * scaleFactor),
            monsterHealth: Math.floor(baseWave.monsterHealth * scaleFactor),
            monsterDamage: Math.floor(baseWave.monsterDamage * scaleFactor),
            goldReward: Math.floor(baseWave.goldReward * scaleFactor),
            isBoss: (waveNumber % 10 === 0),
            minions: (waveNumber % 10 === 0) ? 8 : 0,
            spawnDelay: Math.max(50, 200 - extraWaves * 5)
        };
    }
}

function generateShopItems() {
    const shopItems = [];
    
    const availableWeapons = GAME_DATA.WEAPONS.filter(w => w.id !== 'handgun');
    
    for (let i = 0; i < 2; i++) {
        if (availableWeapons.length > 0) {
            const randomIndex = Math.floor(Math.random() * availableWeapons.length);
            const weapon = {...availableWeapons[randomIndex]};
            
            const tier = Math.random() < 0.3 ? 2 : 1;
            
            const weaponInstance = new WeaponInstance(weapon, tier);
            
            shopItems.push({
                type: 'weapon',
                data: weapon,
                tier: tier,
                instance: weaponInstance
            });
            availableWeapons.splice(randomIndex, 1);
        }
    }
    
    const availableItems = [...GAME_DATA.ITEMS];
    for (let i = 0; i < 2; i++) {
        if (availableItems.length > 0) {
            const randomIndex = Math.floor(Math.random() * availableItems.length);
            const item = {...availableItems[randomIndex]};
            shopItems.push({
                type: item.type === 'tower' ? 'tower' : 'item',
                data: item
            });
        }
    }
    
    return shopItems.sort(() => Math.random() - 0.5);
}

function refreshShop() {
    if (gold < refreshCost) {
        queueMessage(`Not enough gold! Need ${refreshCost}g`);
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
    
    queueMessage(`Shop refreshed! Cost increased to ${refreshCost}g`);
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
    if (player.bloodContractInterval) {
        clearInterval(player.bloodContractInterval);
        player.bloodContractInterval = null;
    }
    
    if (minionSpawnInterval) {
        clearInterval(minionSpawnInterval);
        minionSpawnInterval = null;
    }
    
    Object.assign(player, {
        x: 400,
        y: 300,
        radius: 20,
        health: GAME_DATA.PLAYER_START.health,
        maxHealth: GAME_DATA.PLAYER_START.maxHealth,
        damageMultiplier: 1.0,
        speed: GAME_DATA.PLAYER_START.speed,
        baseSpeed: GAME_DATA.PLAYER_START.speed,
        speedMultiplier: 1.0,
        color: '#ff6b6b',
        lifeSteal: 0,
        criticalChance: 0,
        goldMultiplier: 0,
        healthRegen: 0,
        healthRegenPercent: 0,
        damageReduction: 0,
        lastRegen: Date.now(),
        weapons: [],
        projectiles: [],
        meleeAttacks: [],
        ammoPack: false,
        
        dodgeChance: 0,
        thornsDamage: 0,
        attackSpeedMultiplier: 1,
        firstHitReduction: false,
        firstHitActive: false,
        voidCrystalChance: 0,
        guardianAngelUsed: false,
        
        consumables: [],
        berserkerRing: false,
        sharpeningStone: false,
        sharpeningStoneWave: 0,
        enchantersInk: false,
        guardianAngel: false,
        bloodContract: false,
        bloodContractStacks: 0,
        bloodContractInterval: null,
        lastBloodDamage: 0,
        
        inSlowField: false,
        slowFieldTicks: 0,
        lastSlowFieldTick: 0
    });
    
    // Reset towers
    playerTowers.landmines.count = 0;
    playerTowers.landmines.active = [];
    
    const handgun = getWeaponById('handgun');
    player.weapons.push(new WeaponInstance(handgun));
    
    wave = 1;
    gold = GAME_DATA.PLAYER_START.gold;
    kills = 0;
    gameState = 'wave';
    waveActive = false;
    
    selectedWeaponIndex = -1;
    mergeTargetIndex = -1;
    visualEffects = [];
    refreshCount = 0;
    refreshCost = 5;
    refreshCostSpan.textContent = '5g';
    refreshCounter.textContent = 'Refreshes: 0';
    
    groundFire = [];
    poisonClouds = [];
    voidZones = [];
    activeTraps = [];
    bossProjectiles = [];
    monsterProjectiles = [];
    dashers = [];
    splitterTracking = [];
    bossAbilities.asteroids = [];
    bossAbilities.slowField = null;
    bossAbilities.enraged = false;
    bossAbilities.bossWeapon = null;
    bossAbilities.bossWeaponAttack = 0;
    bossAbilities.bossDash = false;
    bossAbilities.bossDashTarget = { x: 0, y: 0 };
    bossAbilities.bossDashStart = 0;
    bossAbilities.bossDashCooldown = 0;
    bossAbilities.bossDashDirection = { x: 0, y: 0 };
    bossAbilities.bossDashDistance = 0;
    bossAbilities.minionSpawnTimer = 0;
    if (asteroidTimer) {
        clearInterval(asteroidTimer);
        asteroidTimer = null;
    }
    if (minionSpawnInterval) {
        clearInterval(minionSpawnInterval);
        minionSpawnInterval = null;
    }
    
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
    
    updateConsumablesDisplay();
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
    
    let totalMonsters = waveConfig.monsters;
    if (waveConfig.isBoss) {
        totalMonsters = 1;
        if (waveConfig.minions) {
            totalMonsters += waveConfig.minions;
        }
    }
    
    for (let i = 0; i < totalMonsters; i++) {
        let x, y;
        
        if (waveConfig.isBoss && i === 0) {
            x = canvas.width / 2;
            y = canvas.height / 2;
        } else {
            const side = Math.floor(Math.random() * 4);
            switch(side) {
                case 0: x = 30 + Math.random() * 100; y = Math.random() * (canvas.height - 60) + 30; break;
                case 1: x = canvas.width - 30 - Math.random() * 100; y = Math.random() * (canvas.height - 60) + 30; break;
                case 2: x = Math.random() * (canvas.width - 60) + 30; y = 30 + Math.random() * 100; break;
                case 3: x = Math.random() * (canvas.width - 60) + 30; y = canvas.height - 30 - Math.random() * 100; break;
            }
        }
        
        spawnIndicators.push({
            x, y,
            timer: 2000,
            startTime: Date.now(),
            isBoss: waveConfig.isBoss && i === 0,
            isMinion: waveConfig.isBoss && i > 0,
            index: i
        });
    }
}

function spawnMinions(count, centerX, centerY) {
    for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        const distance = 80 + Math.random() * 60;
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;
        
        const minion = createMonster(MONSTER_TYPES.MINION, false, x, y);
        if (minion) {
            minion.isMinion = true;
            minion.health = minion.maxHealth * 0.5;
            monsters.push(minion);
        }
    }
}

function startMinionSpawning(boss) {
    if (minionSpawnInterval) {
        clearInterval(minionSpawnInterval);
    }
    
    minionSpawnInterval = setInterval(() => {
        if (waveActive && boss && boss.health > 0) {
            const minionCount = 3 + Math.floor(Math.random() * 3);
            spawnMinions(minionCount, boss.x, boss.y);
            queueMessage("Minions spawned!");
        } else {
            clearInterval(minionSpawnInterval);
            minionSpawnInterval = null;
        }
    }, 5000);
}

function startWave() {
    gameState = 'wave';
    waveActive = true;
    waveStartTime = Date.now();
    
    // Reset Runic Plate for new wave
    if (player.firstHitReduction) {
        player.firstHitActive = true;
    }
    
    player.inSlowField = false;
    player.slowFieldTicks = 0;
    player.speed = player.baseSpeed * player.speedMultiplier;
    
    // Reset throwable weapon ammo
    player.weapons.forEach(weapon => {
        if (weapon.resetEachRound) {
            weapon.resetAmmo();
        }
    });
    
    bossAbilities.asteroids = [];
    bossAbilities.slowField = null;
    bossAbilities.enraged = false;
    bossAbilities.bossWeapon = null;
    bossAbilities.bossWeaponAttack = 0;
    bossAbilities.bossDash = false;
    bossAbilities.bossDashTarget = { x: 0, y: 0 };
    bossAbilities.bossDashStart = 0;
    bossAbilities.bossDashCooldown = 0;
    bossAbilities.bossDashDirection = { x: 0, y: 0 };
    bossAbilities.bossDashDistance = 0;
    bossAbilities.minionSpawnTimer = 0;
    if (asteroidTimer) {
        clearInterval(asteroidTimer);
        asteroidTimer = null;
    }
    if (minionSpawnInterval) {
        clearInterval(minionSpawnInterval);
        minionSpawnInterval = null;
    }
    
    const waveConfig = getWaveConfig(wave);
    waveDisplay.textContent = `Wave ${wave}`;
    waveDisplay.classList.remove('boss-wave');
    
    if (waveConfig.isBoss) {
        if (wave === 10) {
            waveDisplay.textContent = `BOSS WAVE 10 - SHADOW DAGGER`;
        } else if (wave === 20) {
            waveDisplay.textContent = `BOSS WAVE 20 - WAR HAMMER`;
        } else if (wave === 30) {
            waveDisplay.textContent = `BOSS WAVE 30 - SOUL REAPER`;
        } else {
            waveDisplay.textContent = `BOSS WAVE ${wave}`;
        }
        waveDisplay.classList.add('boss-wave');
    }
    
    waveDisplay.style.opacity = 1;
    
    monsters = [];
    player.projectiles = [];
    player.meleeAttacks = [];
    visualEffects = [];
    bossProjectiles = [];
    monsterProjectiles = [];
    dashers = [];
    splitterTracking = [];
    
    scrapWeaponBtn.style.display = 'none';
    mergeWeaponBtn.style.display = 'none';
    selectedWeaponIndex = -1;
    mergeTargetIndex = -1;
    
    showSpawnIndicators();
    
    // Spawn a landmine if player has any
    setTimeout(() => {
        if (playerTowers.landmines.count > 0) {
            spawnRandomLandmine();
        }
    }, 500);
    
    setTimeout(() => {
        const monsterCount = waveConfig.monsters;
        const spawnDelay = waveConfig.spawnDelay || 200;
        
        if (waveConfig.isBoss) {
            const boss = createMonster(MONSTER_TYPES.BOSS, true, canvas.width / 2, canvas.height / 2);
            if (boss) {
                boss.lifeSteal = 0.1;
                boss.maxHealth = waveConfig.monsterHealth * 15;
                boss.health = boss.maxHealth;
                
                if (wave === 10) {
                    bossAbilities.bossWeapon = {...BOSS_WEAPONS.DAGGER};
                    bossAbilities.bossWeapon.lastAttack = 0;
                    boss.color = '#8B0000';
                } else if (wave === 20) {
                    bossAbilities.bossWeapon = {...BOSS_WEAPONS.WAR_HAMMER};
                    bossAbilities.bossWeapon.lastAttack = 0;
                    boss.color = '#8B4513';
                } else if (wave === 30) {
                    bossAbilities.bossWeapon = {...BOSS_WEAPONS.SCYTHE};
                    bossAbilities.bossWeapon.lastAttack = 0;
                    boss.color = '#4B0082';
                }
                
                monsters.push(boss);
                
                startMinionSpawning(boss);
                
                addVisualEffect({
                    type: 'bossSpawn',
                    x: boss.x,
                    y: boss.y,
                    radius: 100,
                    startTime: Date.now(),
                    duration: 800,
                    color: boss.color
                });
                
                if (waveConfig.minions > 0) {
                    spawnMinions(waveConfig.minions, boss.x, boss.y);
                }
                
                if (wave === 10) {
                    bossAbilities.shotgun = true;
                } else if (wave === 20) {
                    asteroidTimer = setInterval(() => {
                        if (waveActive && monsters.some(m => m.isBoss)) {
                            for (let i = 0; i < 5; i++) {
                                setTimeout(() => {
                                    if (waveActive) spawnAsteroid();
                                }, i * 200);
                            }
                        }
                    }, 4000);
                } else if (wave === 30) {
                    bossAbilities.slowField = {
                        active: true,
                        radius: 200,
                        lastDamage: 0
                    };
                }
            }
            spawnIndicators = [];
        } else {
            let spawnedCount = 0;
            
            for (let i = 0; i < monsterCount; i++) {
                setTimeout(() => {
                    if (gameState === 'wave') {
                        let monsterType;
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
                            else if (rand < 0.75) monsterType = MONSTER_TYPES.EXPLOSIVE;
                            else monsterType = MONSTER_TYPES.GUNNER;
                        } else {
                            if (rand < 0.15) monsterType = MONSTER_TYPES.NORMAL;
                            else if (rand < 0.3) monsterType = MONSTER_TYPES.FAST;
                            else if (rand < 0.45) monsterType = MONSTER_TYPES.TANK;
                            else if (rand < 0.6) monsterType = MONSTER_TYPES.EXPLOSIVE;
                            else if (rand < 0.75) monsterType = MONSTER_TYPES.GUNNER;
                            else if (rand < 0.875) monsterType = MONSTER_TYPES.SPLITTER;
                            else monsterType = MONSTER_TYPES.DASHER;
                        }
                        
                        if (spawnIndicators.length > i) {
                            const indicator = spawnIndicators[i];
                            const monster = createMonster(monsterType, false, indicator.x, indicator.y);
                            if (monster) {
                                monsters.push(monster);
                                if (monsterType === MONSTER_TYPES.DASHER) {
                                    dashers.push(monster);
                                }
                            }
                        } else {
                            const monster = createMonster(monsterType, false);
                            if (monster) {
                                monsters.push(monster);
                                if (monsterType === MONSTER_TYPES.DASHER) {
                                    dashers.push(monster);
                                }
                            }
                        }
                        spawnedCount++;
                        
                        if (spawnedCount >= monsterCount) {
                            spawnIndicators = [];
                        }
                    }
                }, i * spawnDelay);
            }
        }
    }, 2000);
    
    setTimeout(() => {
        waveDisplay.style.opacity = 0.5;
    }, 2500);
}

function spawnAsteroid() {
    if (!waveActive) return;
    
    const boss = monsters.find(m => m.isBoss);
    if (!boss) return;
    
    const angle = Math.random() * Math.PI * 2;
    const distance = 150 + Math.random() * 100;
    const x = boss.x + Math.cos(angle) * distance;
    const y = boss.y + Math.sin(angle) * distance;
    const radius = 40;
    
    addVisualEffect({
        type: 'asteroidWarning',
        x: x,
        y: y,
        radius: radius,
        startTime: Date.now(),
        duration: 800
    });
    
    setTimeout(() => {
        if (!waveActive) return;
        
        const dx = player.x - x;
        const dy = player.y - y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < radius + player.radius) {
            const damage = 25;
            player.health -= damage;
            createDamageIndicator(player.x, player.y, damage, true);
            
            if (player.health <= 0) {
                gameOver();
            }
        }
        
        for (let i = monsters.length - 1; i >= 0; i--) {
            const monster = monsters[i];
            const dx = monster.x - x;
            const dy = monster.y - y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < radius + monster.radius && !monster.isBoss) {
                monster.health -= 75;
                createDamageIndicator(monster.x, monster.y, 75, true);
                
                if (monster.health <= 0) {
                    monsters.splice(i, 1);
                    kills++;
                    
                    const goldRange = monster.monsterType.goldDrop || { min: 5, max: 15 };
                    const goldDrop = Math.floor(Math.random() * (goldRange.max - goldRange.min + 1)) + goldRange.min;
                    const goldEarned = Math.floor(goldDrop * (1 + player.goldMultiplier));
                    gold += goldEarned;
                    createGoldPopup(monster.x, monster.y, goldEarned);
                }
            }
        }
        
        addVisualEffect({
            type: 'asteroid',
            x: x,
            y: y,
            radius: radius,
            startTime: Date.now(),
            duration: 500
        });
    }, 800);
}

function createMonster(monsterType, isBoss = false, spawnX = null, spawnY = null) {
    const waveConfig = getWaveConfig(wave);
    
    let health, damage;
    
    if (isBoss) {
        health = waveConfig.monsterHealth * monsterType.healthMultiplier;
        damage = waveConfig.monsterDamage * monsterType.damageMultiplier;
    } else {
        health = Math.floor(waveConfig.monsterHealth * monsterType.healthMultiplier);
        damage = Math.floor(waveConfig.monsterDamage * monsterType.damageMultiplier);
    }
    
    let x, y;
    
    if (spawnX !== null && spawnY !== null) {
        x = spawnX;
        y = spawnY;
    } else {
        const side = Math.floor(Math.random() * 4);
        switch(side) {
            case 0: x = 50; y = Math.random() * (canvas.height - 100) + 50; break;
            case 1: x = canvas.width - 50; y = Math.random() * (canvas.height - 100) + 50; break;
            case 2: x = Math.random() * (canvas.width - 100) + 50; y = 50; break;
            case 3: x = Math.random() * (canvas.width - 100) + 50; y = canvas.height - 50; break;
        }
    }
    
    const monster = {
        x, y,
        radius: isBoss ? 45 : (15 + Math.random() * 10) * monsterType.sizeMultiplier,
        health: health,
        maxHealth: health,
        damage: damage,
        speed: (isBoss ? 0.7 : (1 + wave * 0.05)) * monsterType.speed,
        color: monsterType.color,
        type: monsterType.name,
        monsterType: monsterType,
        lastAttack: 0,
        attackCooldown: monsterType.attackCooldown || GAME_DATA.MONSTER_ATTACK_COOLDOWN,
        isBoss: isBoss || false,
        isMinion: monsterType.isMinion || false,
        isSplitter: monsterType.isSplitter || false,
        isDasher: monsterType.isDasher || false,
        lifeSteal: monsterType.lifeSteal || 0,
        
        splitCount: monsterType.splitCount || 0,
        splitHealthPercent: monsterType.splitHealthPercent || 0.5,
        
        dashSpeed: monsterType.dashSpeed || 1.5,
        dashCooldown: monsterType.dashCooldown || 3000,
        lastDash: 0,
        isDashing: false,
        dashTarget: null,
        
        slowed: false,
        slowUntil: 0,
        frozen: false,
        frozenUntil: 0,
        stunned: false,
        stunnedUntil: 0,
        
        explosive: monsterType.explosive || false,
        
        isGunner: monsterType === MONSTER_TYPES.GUNNER,
        
        originalSpeed: (isBoss ? 0.7 : (1 + wave * 0.05)) * monsterType.speed
    };
    
    addVisualEffect({
        type: 'spawn',
        x: x,
        y: y,
        color: monsterType.color,
        startTime: Date.now(),
        duration: 300
    });
    
    return monster;
}

// Splitter death handler
function handleSplitterDeath(monster) {
    if (!monster.isSplitter) return;
    
    const splitCount = monster.splitCount || 2;
    const splitHealth = Math.floor(monster.maxHealth * (monster.splitHealthPercent || 0.5));
    
    for (let i = 0; i < splitCount; i++) {
        const angle = (i / splitCount) * Math.PI * 2;
        const distance = 30;
        const x = monster.x + Math.cos(angle) * distance;
        const y = monster.y + Math.sin(angle) * distance;
        
        const splitMonster = {
            ...monster,
            x, y,
            health: splitHealth,
            maxHealth: splitHealth,
            radius: monster.radius * 0.7,
            isSplitter: false,
            color: '#aaffaa',
            originalSpeed: monster.originalSpeed * 1.2
        };
        
        monsters.push(splitMonster);
    }
    
    addVisualEffect({
        type: 'explosion',
        x: monster.x,
        y: monster.y,
        radius: 50,
        color: '#00ff00',
        startTime: Date.now(),
        duration: 300
    });
}

// Dasher AI update
function updateDasher(dasher, currentTime) {
    if (!dasher.isDasher) return;
    
    if (dasher.isDashing) {
        const dx = dasher.dashTarget.x - dasher.x;
        const dy = dasher.dashTarget.y - dasher.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 5) {
            dasher.isDashing = false;
            dasher.speed = dasher.originalSpeed;
        } else {
            const moveX = (dx / dist) * dasher.dashSpeed;
            const moveY = (dy / dist) * dasher.dashSpeed;
            dasher.x += moveX;
            dasher.y += moveY;
        }
    } else if (currentTime - dasher.lastDash >= dasher.dashCooldown) {
        const dx = player.x - dasher.x;
        const dy = player.y - dasher.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 300) {
            dasher.isDashing = true;
            dasher.dashTarget = { x: player.x, y: player.y };
            dasher.lastDash = currentTime;
            
            addVisualEffect({
                type: 'shockwave',
                x: dasher.x,
                y: dasher.y,
                radius: 30,
                color: '#00ffff',
                startTime: currentTime,
                duration: 200
            });
        }
    }
}

// ============================================
// UI UPDATE FUNCTIONS
// ============================================

function updateUI() {
    const damagePercent = (player.damageMultiplier * 100).toFixed(0);
    const speedPercent = (player.speedMultiplier * 100).toFixed(0);
    
    healthValue.textContent = `${Math.floor(player.health)}/${player.maxHealth}`;
    damageValue.textContent = damagePercent + '%';
    speedValue.textContent = speedPercent + '%';
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
    
    if (statsPanelVisible) {
        updateStatsPanel();
    }
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
            
            const effectiveDamage = Math.floor(weapon.baseDamage * player.damageMultiplier);
            
            // Special display for throwable weapons (like Throwing Knives)
            let ammoDisplay = '';
            if (weapon.usesAmmo) {
                if (weapon.isThrowable) {
                    // Show as knife icons or count
                    const ammoPercent = (weapon.currentAmmo / weapon.magazineSize) * 100;
                    ammoDisplay = `
                        <div class="throwable-ammo">
                            ${'🔪'.repeat(Math.min(weapon.currentAmmo, 5))}
                            <span>${weapon.currentAmmo}/${weapon.magazineSize}</span>
                        </div>
                    `;
                } else {
                    ammoDisplay = `<div class="ammo-display">${weapon.currentAmmo}/${weapon.magazineSize}</div>`;
                }
            }
            
            slot.innerHTML = `
                <div>${weapon.icon}</div>
                ${weapon.tier > 1 ? `<div class="tier-badge">${weapon.tier}</div>` : ''}
                <div class="weapon-level">${weapon.type === 'melee' ? '⚔️' : '🔫'}</div>
                <div class="melee-type">${weapon.getTypeDescription()}</div>
                ${ammoDisplay}
                <div class="weapon-info">${weapon.getDisplayName()}<br>Base: ${weapon.baseDamage}<br>Total: ${effectiveDamage}<br>Spd: ${(weapon.attackSpeed * player.attackSpeedMultiplier).toFixed(1)}/s</div>
                <div class="cooldown-bar">
                    <div class="cooldown-fill" style="width: ${cooldownPercent}%; 
                         ${weapon.isReloading ? 'background: linear-gradient(90deg, #ff0000, #ff8800);' : ''}"></div>
                </div>
            `;
            
            slot.addEventListener('click', (e) => {
                e.preventDefault();
                selectWeapon(i);
            });
            
            slot.addEventListener('touchstart', (e) => {
                e.preventDefault();
                selectWeapon(i);
            });
        } else {
            slot.innerHTML = '<div class="empty-slot">+</div>';
        }
        
        weaponsGrid.appendChild(slot);
    }
}

function updateConsumablesDisplay() {
    if (!consumablesGrid) return;
    
    consumablesGrid.innerHTML = '';
    
    if (player.consumables.length === 0) {
        consumablesGrid.innerHTML = '<div class="empty-consumable">No consumables</div>';
        return;
    }
    
    player.consumables.forEach((consumable, index) => {
        const slot = document.createElement('div');
        slot.className = 'consumable-slot';
        slot.innerHTML = `
            <div class="consumable-icon">${consumable.icon}</div>
            <div class="consumable-name">${consumable.name}</div>
            <div class="consumable-count">${consumable.count || 1}</div>
        `;
        
        slot.addEventListener('click', (e) => {
            e.preventDefault();
            useConsumable(index);
        });
        
        slot.addEventListener('touchstart', (e) => {
            e.preventDefault();
            useConsumable(index);
        });
        
        consumablesGrid.appendChild(slot);
    });
}

function useConsumable(index) {
    if (gameState !== 'wave') {
        queueMessage("Can only use consumables during waves!");
        return;
    }
    
    const consumable = player.consumables[index];
    
    switch(consumable.id) {
        case 'health_potion':
            const healAmount = Math.floor(player.maxHealth * 0.25);
            player.health = Math.min(player.maxHealth, player.health + healAmount);
            queueMessage(`Used Health Potion! +${healAmount} HP (25%)`);
            break;
            
        case 'ammo_pack':
            player.weapons.forEach(weapon => {
                if (weapon.usesAmmo && !weapon.isThrowable) {
                    weapon.currentAmmo = weapon.magazineSize;
                    weapon.isReloading = false;
                }
            });
            queueMessage("Used Ammo Pack! All weapons reloaded");
            break;
            
        case 'rage_potion':
            activateRagePotion();
            break;
            
        case 'bomb':
            useBomb();
            break;
            
        case 'exp_scroll':
            useExpScroll();
            break;
    }
    
    if (consumable.count && consumable.count > 1) {
        consumable.count--;
    } else {
        player.consumables.splice(index, 1);
    }
    
    updateConsumablesDisplay();
    updateUI();
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
        queueMessage("Can only merge identical weapons of same tier!");
        return;
    }
    
    if (weapon1.tier >= 5) {
        queueMessage("Maximum tier (5) reached!");
        return;
    }
    
    const mergeCost = weapon1.getMergeCost(weapon2);
    
    if (gold < mergeCost) {
        queueMessage(`Need ${mergeCost} gold to merge!`);
        return;
    }
    
    gold -= mergeCost;
    
    const mergedWeapon = weapon1.merge(weapon2);
    
    if (!mergedWeapon) {
        queueMessage("Merge failed!");
        return;
    }
    
    player.weapons[selectedWeaponIndex] = mergedWeapon;
    player.weapons.splice(mergeTargetIndex, 1);
    
    selectedWeaponIndex = -1;
    mergeTargetIndex = -1;
    scrapWeaponBtn.style.display = 'none';
    mergeWeaponBtn.style.display = 'none';
    
    queueMessage(`Merged to create ${mergedWeapon.getDisplayName()}!`);
    
    updateUI();
    updateWeaponDisplay();
}

function scrapWeapon() {
    if (selectedWeaponIndex === -1 || selectedWeaponIndex >= player.weapons.length) return;
    
    const weapon = player.weapons[selectedWeaponIndex];
    
    if (weapon.id === 'handgun' && player.weapons.length === 1) {
        queueMessage("Cannot scrap your only weapon!");
        return;
    }
    
    const scrapValue = weapon.getScrapValue();
    gold += scrapValue;
    
    player.weapons.splice(selectedWeaponIndex, 1);
    
    selectedWeaponIndex = -1;
    scrapWeaponBtn.style.display = 'none';
    
    queueMessage(`Scrapped ${weapon.getDisplayName()} for ${scrapValue} gold!`);
    
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
            
            let cost = data.cost;
            let tierText = '';
            let tierClass = '';
            
            if (shopItem.type === 'weapon') {
                const tier = shopItem.tier || 1;
                const weaponInstance = shopItem.instance || new WeaponInstance(data, tier);
                cost = weaponInstance.getShopCost();
                
                if (tier > 1) {
                    tierText = ` Tier ${tier}`;
                    tierClass = ` tier-${tier}`;
                }
            }
            
            let tagClass = '';
            if (shopItem.type === 'weapon') {
                if (data.type === 'melee') {
                    if (data.meleeType === 'aoe') tagClass = 'aoe-tag';
                    else if (data.meleeType === 'pierce') tagClass = 'pierce-tag';
                    else if (data.meleeType === 'dual') tagClass = 'dual-tag';
                    else tagClass = 'single-tag';
                } else {
                    if (data.id === 'shotgun') tagClass = 'shotgun-tag';
                    else if (data.id === 'laser') tagClass = 'energy-tag';
                    else if (data.id === 'boomerang') tagClass = 'boomerang-tag';
                    else if (data.id === 'throwing_knives') tagClass = 'throwing-tag';
                    else tagClass = 'ranged-tag';
                }
            } else if (shopItem.type === 'tower') {
                tagClass = 'tower-tag';
            }
            
            let typeText = '';
            if (shopItem.type === 'weapon') {
                if (data.id === 'shotgun') typeText = 'SHOTGUN';
                else if (data.id === 'laser') typeText = 'ENERGY';
                else if (data.id === 'boomerang') typeText = 'BOOMERANG';
                else if (data.id === 'throwing_knives') typeText = 'THROWING';
                else if (data.type === 'melee') typeText = data.meleeType.toUpperCase();
                else typeText = 'RANGED';
            } else if (shopItem.type === 'tower') {
                typeText = 'TOWER';
            } else {
                typeText = data.type === 'consumable' ? 'CONSUMABLE' : 'PERMANENT';
            }
            
            itemElement.innerHTML = `
                <div class="item-info">
                    <div class="item-name">
                        ${data.icon} ${data.name}${tierText}
                        ${tagClass ? `<span class="item-tag ${tagClass}${tierClass}">${typeText}</span>` : ''}
                    </div>
                    <div class="item-effect">${data.description}</div>
                </div>
                <div class="item-cost">${cost}g</div>
            `;
            
            itemElement.addEventListener('click', (e) => {
                e.preventDefault();
                purchaseItem(i);
            });
            
            itemElement.addEventListener('touchstart', (e) => {
                e.preventDefault();
                purchaseItem(i);
            });
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
    
    let cost = data.cost;
    if (shopItem.type === 'weapon') {
        const tier = shopItem.tier || 1;
        const weaponInstance = shopItem.instance || new WeaponInstance(data, tier);
        cost = weaponInstance.getShopCost();
    }
    
    if (gold < cost) {
        queueMessage(`Not enough gold! Need ${cost}, have ${gold}`);
        return;
    }
    
    gold -= cost;
    
    if (shopItem.type === 'weapon') {
        if (player.weapons.length >= 6) {
            queueMessage('No empty weapon slots!');
            gold += cost;
            return;
        }
        
        const tier = shopItem.tier || 1;
        player.weapons.push(new WeaponInstance(data, tier));
        queueMessage(`Purchased ${data.name} Tier ${tier}!`);
        
    } else if (shopItem.type === 'tower') {
        // Handle tower purchases
        if (data.id === 'landmine') {
            if (playerTowers.landmines.count >= playerTowers.landmines.max) {
                queueMessage(`Maximum landmines (${playerTowers.landmines.max}) reached!`);
                gold += cost;
                return;
            }
            
            playerTowers.landmines.count++;
            queueMessage(`Purchased Landmine! (${playerTowers.landmines.count}/${playerTowers.landmines.max})`);
        }
        
    } else {
        if (data.type === 'consumable') {
            const existingConsumable = player.consumables.find(c => c.id === data.id);
            if (existingConsumable) {
                existingConsumable.count = (existingConsumable.count || 1) + 1;
            } else {
                player.consumables.push({
                    id: data.id,
                    name: data.name,
                    icon: data.icon,
                    count: 1
                });
            }
            queueMessage(`Added ${data.name} to consumables!`);
            updateConsumablesDisplay();
        } else {
            applyPermanentItemEffect(data);
            queueMessage(`Purchased ${data.name}!`);
        }
    }
    
    shopItems[index] = null;
    
    updateUI();
    updateWeaponDisplay();
    updateShopDisplay();
}

function applyPermanentItemEffect(item) {
    switch(item.id) {
        case 'damage_orb':
            player.damageMultiplier += 0.15;
            queueMessage(`Damage increased by 15%! Now ${Math.floor(player.damageMultiplier * 100)}%`);
            break;
        case 'speed_boots':
            player.speedMultiplier += 0.15;
            player.speed = player.baseSpeed * player.speedMultiplier;
            queueMessage(`Speed increased by 15%! Now ${Math.floor(player.speedMultiplier * 100)}%`);
            break;
        case 'health_upgrade':
            const oldMax = player.maxHealth;
            player.maxHealth = Math.floor(oldMax * 1.25);
            player.health += player.maxHealth - oldMax;
            queueMessage(`Max health increased by 25%! Now ${player.maxHealth}`);
            break;
        case 'vampire_teeth':
            player.lifeSteal += 0.05;
            queueMessage(`Life steal increased by 5%! Now ${Math.floor(player.lifeSteal * 100)}%`);
            break;
        case 'berserker_ring':
            player.berserkerRing = true;
            queueMessage("Berserker Ring equipped! Damage increases as health decreases");
            break;
        case 'ninja_scroll':
            player.dodgeChance += 0.15;
            queueMessage(`Dodge chance increased by 15%! Now ${Math.floor(player.dodgeChance * 100)}%`);
            break;
        case 'alchemist_stone':
            player.goldMultiplier += 0.2;
            queueMessage(`Gold multiplier increased by 20%! Now +${Math.floor(player.goldMultiplier * 100)}% gold`);
            break;
        case 'thorns_armor':
            player.thornsDamage = 0.25;
            queueMessage("Thorns Armor equipped! Reflect 25% of damage back to attackers");
            break;
        case 'wind_charm':
            player.attackSpeedMultiplier += 0.15;
            queueMessage(`Attack speed increased by 15%! Now ${player.attackSpeedMultiplier.toFixed(1)}x`);
            break;
        case 'runic_plate':
            player.firstHitReduction = true;
            player.firstHitActive = true;
            queueMessage("Runic Plate equipped! First hit each wave deals 50% less damage");
            break;
        case 'guardian_angel':
            player.guardianAngel = true;
            queueMessage("Guardian Angel equipped! Once per game, survive fatal damage with 50% health");
            break;
        case 'blood_contract':
            if (!player.bloodContract) {
                player.bloodContract = true;
                player.bloodContractStacks = 1;
                player.lifeSteal += 0.03;
                player.healthRegen = 0;
                player.healthRegenPercent = 0;
                
                if (player.bloodContractInterval) {
                    clearInterval(player.bloodContractInterval);
                }
                
                player.bloodContractInterval = setInterval(() => {
                    if (gameState === 'wave') {
                        const damagePercent = 0.01 * player.bloodContractStacks;
                        const damageAmount = Math.max(1, Math.floor(player.maxHealth * damagePercent));
                        
                        if (player.health > damageAmount) {
                            player.health -= damageAmount;
                        } else {
                            player.health = 1;
                        }
                        
                        updateUI();
                        createDamageIndicator(player.x, player.y, damageAmount, false);
                    }
                }, 1000);
                queueMessage(`Blood Contract activated! +3% lifesteal, lose ${player.bloodContractStacks}% HP per second`);
            } else {
                player.bloodContractStacks++;
                player.lifeSteal += 0.03;
                queueMessage(`Blood Contract stacked! Now ${player.bloodContractStacks} stacks (${Math.floor(player.lifeSteal * 100)}% lifesteal, lose ${player.bloodContractStacks}% HP per second)`);
            }
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
        
        buffElement.addEventListener('click', (e) => {
            e.preventDefault();
            selectStatBuff(buff);
        });
        
        buffElement.addEventListener('touchstart', (e) => {
            e.preventDefault();
            selectStatBuff(buff);
        });
        
        statBuffs.appendChild(buffElement);
    });
    
    waveCompleteOverlay.style.display = 'flex';
}

function selectStatBuff(buff) {
    if (buff.effect.maxHealthPercent) {
        const oldMax = player.maxHealth;
        player.maxHealth = Math.floor(oldMax * (1 + buff.effect.maxHealthPercent));
        player.health += player.maxHealth - oldMax;
    }
    
    if (buff.effect.damagePercent) {
        player.damageMultiplier += buff.effect.damagePercent;
    }
    
    if (buff.effect.speedPercent) {
        player.speedMultiplier += buff.effect.speedPercent;
        player.speed = player.baseSpeed * player.speedMultiplier;
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
    
    if (buff.effect.healthRegenPercent) {
        player.healthRegenPercent += buff.effect.healthRegenPercent;
    }
    
    if (buff.effect.damageReduction) {
        player.damageReduction += buff.effect.damageReduction;
    }
    
    queueMessage(`Selected: ${buff.name}`);
    
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
    waveActive = false;
    
    // Clear active landmines at end of wave
    playerTowers.landmines.active = [];
    
    player.inSlowField = false;
    player.slowFieldTicks = 0;
    player.speed = player.baseSpeed * player.speedMultiplier;
    
    // Don't reset firstHitActive here - it's reset at the start of each wave
    
    if (asteroidTimer) {
        clearInterval(asteroidTimer);
        asteroidTimer = null;
    }
    if (minionSpawnInterval) {
        clearInterval(minionSpawnInterval);
        minionSpawnInterval = null;
    }
    bossAbilities.asteroids = [];
    bossAbilities.slowField = null;
    bossAbilities.enraged = false;
    bossAbilities.bossWeapon = null;
    bossAbilities.bossWeaponAttack = 0;
    bossAbilities.bossDash = false;
    bossAbilities.bossDashTarget = { x: 0, y: 0 };
    bossAbilities.bossDashStart = 0;
    
    const waveConfig = getWaveConfig(wave);
    gold += Math.floor(waveConfig.goldReward * (1 + player.goldMultiplier));
    
    player.weapons.forEach(weapon => {
        if (weapon.usesAmmo && !weapon.isThrowable) {
            weapon.currentAmmo = weapon.magazineSize;
            weapon.isReloading = false;
        }
    });
    
    if (player.sharpeningStone && player.sharpeningStoneWave === wave) {
        player.sharpeningStone = false;
    }
    
    showStatBuffs();
}

function gameOver() {
    gameState = 'gameover';
    waveActive = false;
    
    player.inSlowField = false;
    player.slowFieldTicks = 0;
    player.speed = player.baseSpeed * player.speedMultiplier;
    
    if (asteroidTimer) {
        clearInterval(asteroidTimer);
        asteroidTimer = null;
    }
    if (minionSpawnInterval) {
        clearInterval(minionSpawnInterval);
        minionSpawnInterval = null;
    }
    bossAbilities.asteroids = [];
    bossAbilities.slowField = null;
    bossAbilities.enraged = false;
    bossAbilities.bossWeapon = null;
    bossAbilities.bossWeaponAttack = 0;
    bossAbilities.bossDash = false;
    bossAbilities.bossDashTarget = { x: 0, y: 0 };
    bossAbilities.bossDashStart = 0;
    
    if (player.bloodContractInterval) {
        clearInterval(player.bloodContractInterval);
        player.bloodContractInterval = null;
    }
    
    clearSave();
    
    if (player.guardianAngel && !player.guardianAngelUsed) {
        player.guardianAngelUsed = true;
        player.health = player.maxHealth * 0.5;
        gameState = 'wave';
        waveActive = true;
        queueMessage("GUARDIAN ANGEL SAVED YOU!");
        return;
    }
    
    gameOverText.textContent = `You survived ${wave} waves with ${kills} kills.`;
    gameOverOverlay.style.display = 'flex';
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
    
    if (gameState === 'wave') {
        let moveX = 0;
        let moveY = 0;
        
        if (keys.w || keys.up) moveY -= 1;
        if (keys.s || keys.down) moveY += 1;
        if (keys.a || keys.left) moveX -= 1;
        if (keys.d || keys.right) moveX += 1;
        
        if (joystickActive) {
            const strength = Math.min(1, Math.sqrt(joystickCurrentX * joystickCurrentX + joystickCurrentY * joystickCurrentY) / joystickMaxDistance);
            moveX += (joystickCurrentX / joystickMaxDistance) * strength;
            moveY += (joystickCurrentY / joystickMaxDistance) * strength;
        }
        
        if (moveX !== 0 || moveY !== 0) {
            const length = Math.sqrt(moveX * moveX + moveY * moveY);
            moveX = moveX / length * player.speed;
            moveY = moveY / length * player.speed;
            
            player.x += moveX;
            player.y += moveY;
            
            player.x = Math.max(player.radius, Math.min(canvas.width - player.radius, player.x));
            player.y = Math.max(player.radius, Math.min(canvas.height - player.radius, player.y));
        }
    }
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    drawGrid();
    
    if (gameState === 'wave') {
        updateGame(deltaTime);
    }
    
    drawSpawnIndicators();
    drawTowers();
    drawMonsters();
    drawProjectiles();
    drawBossProjectiles();
    drawMonsterProjectiles();
    drawMeleeAttacks();
    drawBossMeleeAttacks();
    drawVisualEffects();
    drawGroundEffects();
    drawSlowField();
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

function drawTowers() {
    // Draw landmines
    playerTowers.landmines.active.forEach(mine => {
        ctx.save();
        ctx.translate(mine.x, mine.y);
        
        const pulse = Math.sin(Date.now() * 0.01) * 0.2 + 0.8;
        
        ctx.shadowColor = '#8B4513';
        ctx.shadowBlur = 15;
        
        // Outer ring (pulsing)
        ctx.strokeStyle = '#FF0000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, mine.radius * pulse, 0, Math.PI * 2);
        ctx.stroke();
        
        // Base
        ctx.fillStyle = mine.color;
        ctx.beginPath();
        ctx.arc(0, 0, mine.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Inner core
        ctx.fillStyle = '#FF4500';
        ctx.beginPath();
        ctx.arc(0, 0, mine.radius * 0.5, 0, Math.PI * 2);
        ctx.fill();
        
        // Danger symbol
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('💣', 0, 0);
        
        ctx.restore();
    });
}

function drawSpawnIndicators() {
    const currentTime = Date.now();
    
    for (let i = spawnIndicators.length - 1; i >= 0; i--) {
        const indicator = spawnIndicators[i];
        const elapsed = currentTime - indicator.startTime;
        const progress = elapsed / indicator.timer;
        
        if (elapsed > indicator.timer) {
            spawnIndicators.splice(i, 1);
            continue;
        }
        
        const pulseScale = 1 + Math.sin(progress * Math.PI * 4) * 0.2;
        const alpha = 1 - progress * 0.5;
        
        ctx.save();
        ctx.translate(indicator.x, indicator.y);
        
        if (indicator.isBoss) {
            ctx.strokeStyle = `rgba(255, 215, 0, ${alpha})`;
            ctx.lineWidth = 4;
            ctx.shadowColor = '#ffd700';
            ctx.shadowBlur = 20 * alpha;
            
            ctx.rotate(elapsed * 0.002);
            
            ctx.beginPath();
            ctx.arc(0, 0, 40 * pulseScale, 0, Math.PI * 2);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.arc(0, 0, 25, 0, Math.PI * 2);
            ctx.stroke();
            
            ctx.rotate(-elapsed * 0.002);
            ctx.beginPath();
            ctx.moveTo(-30, -30);
            ctx.lineTo(30, 30);
            ctx.moveTo(30, -30);
            ctx.lineTo(-30, 30);
            ctx.stroke();
        } else if (indicator.isMinion) {
            ctx.strokeStyle = `rgba(147, 112, 219, ${alpha})`;
            ctx.lineWidth = 3;
            ctx.shadowColor = '#9370db';
            ctx.shadowBlur = 10 * alpha;
            
            ctx.beginPath();
            ctx.arc(0, 0, 20 * pulseScale, 0, Math.PI * 2);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(-10, -10);
            ctx.lineTo(10, 10);
            ctx.moveTo(10, -10);
            ctx.lineTo(-10, 10);
            ctx.stroke();
        } else {
            ctx.strokeStyle = `rgba(255, 0, 0, ${alpha})`;
            ctx.lineWidth = 3;
            ctx.shadowColor = '#ff0000';
            ctx.shadowBlur = 10 * alpha;
            
            ctx.beginPath();
            ctx.arc(0, 0, 25 * pulseScale, 0, Math.PI * 2);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(-15, -15);
            ctx.lineTo(15, 15);
            ctx.moveTo(15, -15);
            ctx.lineTo(-15, 15);
            ctx.stroke();
        }
        
        ctx.restore();
    }
}

function drawSlowField() {
    if (bossAbilities.slowField && bossAbilities.slowField.active) {
        const boss = monsters.find(m => m.isBoss && wave === 30);
        if (!boss) return;
        
        const alpha = 0.3;
        
        ctx.save();
        ctx.translate(boss.x, boss.y);
        
        const pulse = Math.sin(Date.now() * 0.005) * 0.1 + 0.9;
        
        ctx.fillStyle = `rgba(100, 100, 255, ${alpha})`;
        ctx.shadowColor = '#6464ff';
        ctx.shadowBlur = 30;
        ctx.beginPath();
        ctx.arc(0, 0, bossAbilities.slowField.radius * pulse, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = `rgba(200, 200, 255, ${alpha})`;
        ctx.lineWidth = 3;
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.arc(0, 0, bossAbilities.slowField.radius * 0.7, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.fillStyle = 'white';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.shadowColor = '#6464ff';
        ctx.shadowBlur = 15;
        ctx.fillText('SLOW FIELD', 0, -bossAbilities.slowField.radius - 20);
        
        if (player.inSlowField && player.slowFieldTicks > 0) {
            ctx.fillStyle = 'rgba(255, 100, 100, 0.9)';
            ctx.font = 'bold 14px Arial';
            ctx.fillText(`Speed Lost: ${player.slowFieldTicks}`, 0, bossAbilities.slowField.radius + 30);
        }
        
        ctx.restore();
    }
}

// ============================================
// PROJECTILE DRAWING FUNCTIONS
// ============================================

function drawProjectiles() {
    const currentTime = Date.now();
    
    player.projectiles.forEach(projectile => {
        ctx.save();
        
        if (projectile.isBoomerang) {
            drawBoomerangProjectile(ctx, projectile, currentTime);
        } else if (projectile.weaponId === 'shotgun') {
            drawShotgunPellet(ctx, projectile, currentTime);
        } else if (projectile.weaponId === 'laser') {
            drawLaserProjectile(ctx, projectile, currentTime);
        } else if (projectile.weaponId === 'machinegun') {
            drawMachinegunProjectile(ctx, projectile, currentTime);
        } else if (projectile.animation === 'knife') {
            drawThrowingKnife(ctx, projectile, currentTime);
        } else {
            ctx.shadowColor = projectile.color;
            ctx.shadowBlur = 15;
            ctx.fillStyle = projectile.color;
            ctx.beginPath();
            ctx.arc(projectile.x, projectile.y, projectile.size || 4, 0, Math.PI * 2);
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
        
        ctx.restore();
    });
}

function drawThrowingKnife(ctx, projectile, currentTime) {
    // Update rotation for spinning
    projectile.rotation = (projectile.rotation || 0) + (projectile.spinSpeed || 0);
    
    ctx.save();
    ctx.translate(projectile.x, projectile.y);
    ctx.rotate(projectile.rotation);
    
    ctx.shadowColor = '#C0C0C0';
    ctx.shadowBlur = 15;
    
    // Draw knife
    ctx.fillStyle = '#C0C0C0';
    ctx.strokeStyle = '#808080';
    ctx.lineWidth = 2;
    
    // Blade
    ctx.beginPath();
    ctx.moveTo(0, -projectile.size);
    ctx.lineTo(projectile.size, 0);
    ctx.lineTo(0, projectile.size);
    ctx.lineTo(-projectile.size, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Handle
    ctx.fillStyle = '#8B4513';
    ctx.beginPath();
    ctx.rect(-projectile.size * 0.3, -projectile.size * 0.8, projectile.size * 0.6, projectile.size * 1.6);
    ctx.fill();
    
    // Glint
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.beginPath();
    ctx.arc(-projectile.size * 0.2, -projectile.size * 0.5, 1, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
}

function drawMonsterProjectiles() {
    monsterProjectiles.forEach(proj => {
        ctx.save();
        ctx.translate(proj.x, proj.y);
        
        ctx.shadowColor = proj.color;
        ctx.shadowBlur = 15;
        ctx.fillStyle = proj.color;
        ctx.beginPath();
        ctx.arc(0, 0, 5, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(0, 0, 2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    });
}

function drawBossProjectiles() {
    const currentTime = Date.now();
    
    bossProjectiles.forEach(proj => {
        const age = currentTime - proj.startTime;
        const alpha = Math.min(1, 1 - age / proj.lifetime);
        
        ctx.save();
        ctx.translate(proj.x, proj.y);
        
        ctx.shadowColor = proj.color;
        ctx.shadowBlur = 15 * alpha;
        
        ctx.fillStyle = proj.color;
        ctx.globalAlpha = alpha * 0.7;
        ctx.beginPath();
        ctx.arc(0, 0, proj.radius + 2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#FFFFFF';
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(0, 0, proj.radius, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    });
}

function drawBoomerangProjectile(ctx, projectile, currentTime) {
    const rotation = (projectile.rotation || 0) + 0.1;
    projectile.rotation = rotation;
    
    if (boomerangImage.complete && boomerangImage.naturalHeight > 0) {
        ctx.save();
        ctx.translate(projectile.x, projectile.y);
        ctx.rotate(rotation);
        ctx.shadowColor = '#8B4513';
        ctx.shadowBlur = 15;
        ctx.drawImage(boomerangImage, -20, -20, 40, 40);
        ctx.restore();
        
        if (projectile.state === 'returning') {
            ctx.save();
            ctx.globalAlpha = 0.3;
            for (let i = 1; i <= 3; i++) {
                const trailX = projectile.x - Math.cos(projectile.angle) * i * 5;
                const trailY = projectile.y - Math.sin(projectile.angle) * i * 5;
                ctx.save();
                ctx.translate(trailX, trailY);
                ctx.rotate(rotation - i * 0.1);
                ctx.drawImage(boomerangImage, -15, -15, 30, 30);
                ctx.restore();
            }
            ctx.restore();
        }
    } else {
        ctx.save();
        ctx.translate(projectile.x, projectile.y);
        ctx.rotate(rotation);
        
        ctx.shadowColor = 'rgba(139, 69, 19, 0.5)';
        ctx.shadowBlur = 15;
        
        ctx.fillStyle = '#8B4513';
        ctx.strokeStyle = '#654321';
        ctx.lineWidth = 2;
        
        ctx.beginPath();
        ctx.moveTo(0, -5);
        ctx.lineTo(20, -10);
        ctx.lineTo(25, 0);
        ctx.lineTo(20, 10);
        ctx.lineTo(0, 5);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        if (projectile.state === 'returning') {
            ctx.strokeStyle = '#FFD700';
            ctx.lineWidth = 2;
            ctx.shadowColor = '#FFD700';
            ctx.shadowBlur = 10;
            ctx.stroke();
        }
        
        ctx.restore();
    }
}

function drawShotgunPellet(ctx, projectile, currentTime) {
    ctx.shadowColor = projectile.color;
    ctx.shadowBlur = 10;
    ctx.fillStyle = projectile.color;
    ctx.beginPath();
    ctx.arc(projectile.x, projectile.y, 3, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.shadowBlur = 5;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.beginPath();
    ctx.arc(projectile.x - Math.cos(projectile.angle) * 5, 
            projectile.y - Math.sin(projectile.angle) * 5, 2, 0, Math.PI * 2);
    ctx.fill();
}

function drawLaserProjectile(ctx, projectile, currentTime) {
    const pulse = Math.sin(currentTime * 0.02) * 2;
    
    ctx.shadowColor = '#00FFFF';
    ctx.shadowBlur = 20;
    ctx.strokeStyle = '#00FFFF';
    ctx.lineWidth = 4 + pulse;
    ctx.beginPath();
    ctx.moveTo(projectile.x - Math.cos(projectile.angle) * 10, 
               projectile.y - Math.sin(projectile.angle) * 10);
    ctx.lineTo(projectile.x, projectile.y);
    ctx.stroke();
    
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(projectile.x - Math.cos(projectile.angle) * 10, 
               projectile.y - Math.sin(projectile.angle) * 10);
    ctx.lineTo(projectile.x, projectile.y);
    ctx.stroke();
    
    ctx.fillStyle = 'rgba(0, 255, 255, 0.3)';
    ctx.shadowBlur = 30;
    ctx.beginPath();
    ctx.arc(projectile.x, projectile.y, 6, 0, Math.PI * 2);
    ctx.fill();
}

function drawMachinegunProjectile(ctx, projectile, currentTime) {
    ctx.shadowColor = '#FFD700';
    ctx.shadowBlur = 15;
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(projectile.x, projectile.y, 3, 0, Math.PI * 2);
    ctx.fill();
    
    for (let i = 1; i <= 3; i++) {
        const alpha = 0.3 - i * 0.1;
        ctx.fillStyle = `rgba(255, 215, 0, ${alpha})`;
        ctx.beginPath();
        ctx.arc(projectile.x - Math.cos(projectile.angle) * i * 8, 
                projectile.y - Math.sin(projectile.angle) * i * 8, 
                2, 0, Math.PI * 2);
        ctx.fill();
    }
}

// ============================================
// MELEE WEAPON ANIMATIONS
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
            case 'dual_daggers':
                drawDualDaggers(ctx, attack, angle, progress, distance, alpha);
                break;
            default:
                drawDefaultMelee(ctx, attack, angle, progress, distance, alpha);
                break;
        }
        
        ctx.restore();
    });
}

function drawDualDaggers(ctx, attack, angle, progress, distance, alpha) {
    // First dagger
    ctx.save();
    ctx.rotate(angle - 0.2);
    ctx.translate(distance * 0.8, 0);
    
    ctx.shadowColor = 'rgba(70, 130, 180, 0.5)';
    ctx.shadowBlur = 10 * alpha;
    
    // Blade
    ctx.fillStyle = attack.bladeColor || '#4682B4';
    ctx.beginPath();
    ctx.moveTo(0, -3);
    ctx.lineTo(30, -1);
    ctx.lineTo(30, 1);
    ctx.lineTo(0, 3);
    ctx.closePath();
    ctx.fill();
    
    // Hilt
    ctx.fillStyle = attack.hiltColor || '#2F4F4F';
    ctx.fillRect(-5, -4, 8, 8);
    
    // Glow
    ctx.fillStyle = attack.sparkleColor || '#00FFFF';
    ctx.globalAlpha = alpha * 0.3;
    ctx.beginPath();
    ctx.arc(30, 0, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    
    // Second dagger (offset)
    ctx.save();
    ctx.rotate(angle + 0.2);
    ctx.translate(distance * 0.8, 0);
    
    ctx.shadowColor = 'rgba(70, 130, 180, 0.5)';
    ctx.shadowBlur = 10 * alpha;
    
    // Blade
    ctx.fillStyle = attack.bladeColor || '#4682B4';
    ctx.beginPath();
    ctx.moveTo(0, -3);
    ctx.lineTo(30, -1);
    ctx.lineTo(30, 1);
    ctx.lineTo(0, 3);
    ctx.closePath();
    ctx.fill();
    
    // Hilt
    ctx.fillStyle = attack.hiltColor || '#2F4F4F';
    ctx.fillRect(-5, -4, 8, 8);
    
    // Glow
    ctx.fillStyle = attack.sparkleColor || '#00FFFF';
    ctx.globalAlpha = alpha * 0.3;
    ctx.beginPath();
    ctx.arc(30, 0, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    
    // Trail effect
    if (progress < 0.5) {
        ctx.save();
        ctx.rotate(angle);
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.3})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(40, 0);
        ctx.stroke();
        ctx.restore();
    }
}

function drawBossMeleeAttacks() {
    if (!bossAbilities.bossWeapon || !bossAbilities.bossWeaponAttack) return;
    
    const currentTime = Date.now();
    const attack = bossAbilities.bossWeaponAttack;
    const progress = (currentTime - attack.startTime) / attack.duration;
    
    if (progress < 0 || progress > 1) {
        bossAbilities.bossWeaponAttack = null;
        return;
    }
    
    ctx.save();
    ctx.translate(attack.x, attack.y);
    
    const angle = attack.angle;
    const distance = attack.radius * (progress * 1.2);
    const alpha = 1 - progress * 0.7;
    
    if (wave === 10) {
        drawBossDagger(ctx, attack, angle, progress, distance, alpha);
    } else if (wave === 20) {
        drawBossHammer(ctx, attack, angle, progress, distance, alpha);
    } else if (wave === 30) {
        drawBossScythe(ctx, attack, angle, progress, distance, alpha);
    }
    
    ctx.restore();
}

function drawBossDagger(ctx, attack, angle, progress, distance, alpha) {
    const stabProgress = Math.min(progress * 2, 1);
    const stabDistance = distance * 1.5;
    
    ctx.rotate(angle);
    ctx.translate(stabDistance, 0);
    ctx.shadowColor = 'rgba(139, 0, 0, 0.7)';
    ctx.shadowBlur = 20 * alpha;
    
    ctx.save();
    const bladeGradient = ctx.createLinearGradient(0, -5, 60, -5);
    bladeGradient.addColorStop(0, '#8B0000');
    bladeGradient.addColorStop(1, '#FF4444');
    
    ctx.fillStyle = bladeGradient;
    ctx.beginPath();
    ctx.moveTo(0, -5);
    ctx.lineTo(60, -3);
    ctx.lineTo(60, 3);
    ctx.lineTo(0, 5);
    ctx.closePath();
    ctx.fill();
    
    ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, -5);
    ctx.lineTo(60, -3);
    ctx.moveTo(0, 5);
    ctx.lineTo(60, 3);
    ctx.stroke();
    ctx.restore();
    
    if (progress > 0.7) {
        ctx.save();
        ctx.translate(60, 0);
        ctx.fillStyle = `rgba(255, 0, 0, ${alpha})`;
        ctx.shadowColor = 'rgba(255, 0, 0, 0.7)';
        ctx.beginPath();
        ctx.arc(0, 0, 8 * (1 - progress), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
    
    ctx.save();
    ctx.fillStyle = '#4A0404';
    ctx.fillRect(-12, -6, 20, 12);
    
    ctx.fillStyle = '#8B0000';
    ctx.beginPath();
    ctx.arc(-18, 0, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}

function drawBossHammer(ctx, attack, angle, progress, distance, alpha) {
    ctx.rotate(angle);
    
    const lift = Math.sin(progress * Math.PI) * 50;
    const smashY = progress < 0.3 ? -lift : progress > 0.6 ? (progress - 0.6) * 60 : 0;
    
    ctx.translate(30, -50 + lift - smashY);
    ctx.shadowColor = 'rgba(105, 105, 105, 0.7)';
    ctx.shadowBlur = 30 * alpha;
    
    ctx.save();
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(-5, 0, 10, 80);
    ctx.restore();
    
    ctx.save();
    ctx.translate(0, -25);
    
    ctx.fillStyle = '#696969';
    ctx.fillRect(-25, -25, 50, 35);
    
    ctx.fillStyle = '#808080';
    ctx.fillRect(-30, -25, 10, 35);
    ctx.fillRect(20, -25, 10, 35);
    
    ctx.fillStyle = '#A9A9A9';
    ctx.fillRect(-25, -35, 50, 10);
    ctx.restore();
    
    if (progress > 0.5 && progress < 0.8) {
        ctx.save();
        ctx.translate(0, 0);
        ctx.rotate(0);
        const shockProgress = (progress - 0.5) * 3.33;
        ctx.strokeStyle = `rgba(255, 69, 0, ${alpha * (1 - shockProgress)})`;
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(0, 50, attack.radius * shockProgress, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
    }
}

function drawBossScythe(ctx, attack, angle, progress, distance, alpha) {
    const swingProgress = Math.sin(progress * Math.PI);
    const currentAngle = angle - 1 + swingProgress * 2;
    
    ctx.rotate(currentAngle);
    ctx.shadowColor = 'rgba(75, 0, 130, 0.7)';
    ctx.shadowBlur = 20 * alpha;
    
    if (scytheImage.complete && scytheImage.naturalHeight > 0) {
        ctx.save();
        ctx.translate(40, -20);
        ctx.rotate(-0.3);
        ctx.scale(1.5, 1.5);
        ctx.shadowColor = 'rgba(148, 0, 211, 0.7)';
        ctx.shadowBlur = 20;
        ctx.drawImage(scytheImage, -25, -25, 50, 50);
        ctx.restore();
    } else {
        ctx.save();
        ctx.fillStyle = '#2F4F4F';
        ctx.fillRect(-5, -attack.radius * 0.8, 10, attack.radius * 1.6);
        ctx.restore();
        
        ctx.save();
        ctx.translate(0, -attack.radius * 0.6);
        ctx.rotate(-0.5);
        
        const bladeGradient = ctx.createLinearGradient(0, -20, 80, -20);
        bladeGradient.addColorStop(0, '#4B0082');
        bladeGradient.addColorStop(1, '#9400D3');
        
        ctx.fillStyle = bladeGradient;
        ctx.shadowColor = 'rgba(148, 0, 211, 0.7)';
        
        ctx.beginPath();
        ctx.moveTo(0, -15);
        ctx.lineTo(80, -25);
        ctx.lineTo(80, -5);
        ctx.lineTo(0, 15);
        ctx.closePath();
        ctx.fill();
        
        ctx.strokeStyle = `rgba(255, 105, 180, ${alpha})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(80, -25);
        ctx.lineTo(80, -5);
        ctx.stroke();
        ctx.restore();
    }
    
    if (progress > 0.2 && progress < 0.8) {
        ctx.save();
        ctx.rotate(0);
        ctx.strokeStyle = `rgba(148, 0, 211, ${alpha * 0.3})`;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(20, -20);
        ctx.lineTo(100, -40);
        ctx.stroke();
        ctx.restore();
    }
    
    if (bossAbilities.bossDash) {
        ctx.save();
        ctx.translate(-50, 0);
        ctx.fillStyle = `rgba(255, 105, 180, ${alpha * 0.5})`;
        ctx.beginPath();
        ctx.arc(0, 0, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
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

function drawGroundEffects() {
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
        
        ctx.fillStyle = '#FFD700';
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.arc(fire.x, fire.y, fire.radius * 0.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    });
    
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
    
    // Runic Plate visual indicator
    if (player.firstHitReduction && player.firstHitActive) {
        ctx.shadowColor = '#00FFFF';
        ctx.shadowBlur = 20;
        ctx.strokeStyle = '#00FFFF';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, player.radius + 10, 0, Math.PI * 2);
        ctx.stroke();
    }
    
    if (player.bloodContract) {
        ctx.shadowColor = '#8B0000';
        ctx.shadowBlur = 20;
        ctx.strokeStyle = '#8B0000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, player.radius + 5 + Math.sin(Date.now() * 0.005) * 2, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.fillStyle = '#8B0000';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${player.bloodContractStacks}`, 0, -player.radius - 10);
    }
    
    if (activeBuffs.rage.active) {
        ctx.shadowColor = '#FF0000';
        ctx.shadowBlur = 30;
        ctx.strokeStyle = '#FF0000';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(0, 0, player.radius + 10 + Math.sin(Date.now() * 0.02) * 5, 0, Math.PI * 2);
        ctx.stroke();
    }
    
    if (player.inSlowField) {
        ctx.shadowColor = '#6464ff';
        ctx.shadowBlur = 15;
        ctx.strokeStyle = '#6464ff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, player.radius + 8 + Math.sin(Date.now() * 0.01) * 3, 0, Math.PI * 2);
        ctx.stroke();
        
        if (player.slowFieldTicks > 0) {
            ctx.fillStyle = 'rgba(255, 100, 100, 0.9)';
            ctx.font = 'bold 14px Arial';
            ctx.textAlign = 'center';
            ctx.shadowColor = '#ff0000';
            ctx.shadowBlur = 10;
            ctx.fillText(`-${player.slowFieldTicks} SPD`, 0, -player.radius - 20);
        }
    }
    
    ctx.restore();
}

function updateGame(deltaTime) {
    const currentTime = Date.now();
    
    // Check landmine triggers
    checkLandmineTriggers();
    
    if (bossAbilities.slowField && bossAbilities.slowField.active) {
        const boss = monsters.find(m => m.isBoss && wave === 30);
        if (boss) {
            const dx = player.x - boss.x;
            const dy = player.y - boss.y;
            const distToField = Math.sqrt(dx * dx + dy * dy);
            
            const wasInSlowField = player.inSlowField;
            player.inSlowField = distToField < bossAbilities.slowField.radius;
            
            if (player.inSlowField) {
                player.speed = (player.baseSpeed * player.speedMultiplier) * 0.5;
                
                if (currentTime - player.lastSlowFieldTick >= 1000) {
                    player.baseSpeed = Math.max(1, player.baseSpeed - 1);
                    player.speed = (player.baseSpeed * player.speedMultiplier) * 0.5;
                    player.slowFieldTicks++;
                    player.lastSlowFieldTick = currentTime;
                    
                    createDamageIndicator(player.x, player.y, 1, false);
                    queueMessage("Speed decreased by 1!");
                }
            } else if (wasInSlowField) {
                player.speed = player.baseSpeed * player.speedMultiplier;
            }
        }
    }
    
    if (wave === 20 && !bossAbilities.enraged) {
        const boss = monsters.find(m => m.isBoss);
        if (boss && boss.health <= boss.maxHealth / 2) {
            bossAbilities.enraged = true;
            boss.attackCooldown = 800;
            boss.color = '#ff4444';
            boss.speed = boss.originalSpeed * 1.3;
            queueMessage("BOSS ENRAGED - ATTACK SPEED AND MOVEMENT INCREASED!");
        }
    }
    
    if (wave === 30 && bossAbilities.bossWeapon) {
        const boss = monsters.find(m => m.isBoss);
        if (boss && !bossAbilities.bossDash && currentTime - bossAbilities.bossDashCooldown > 3000) {
            const dx = player.x - boss.x;
            const dy = player.y - boss.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            const dashDistance = BOSS_WEAPONS.SCYTHE.dashRange;
            const direction = { x: dx / distance, y: dy / distance };
            
            bossAbilities.bossDash = true;
            bossAbilities.bossDashDirection = direction;
            bossAbilities.bossDashStart = currentTime;
            bossAbilities.bossDashDistance = 0;
            bossAbilities.bossDashTarget = {
                x: boss.x + direction.x * dashDistance,
                y: boss.y + direction.y * dashDistance
            };
            
            setTimeout(() => {
                bossAbilities.bossDash = false;
                bossAbilities.bossDashCooldown = currentTime;
                bossAbilities.bossDashDistance = 0;
            }, 500);
        }
        
        if (bossAbilities.bossDash && bossAbilities.bossDashDirection) {
            const dashSpeed = BOSS_WEAPONS.SCYTHE.dashSpeed;
            boss.x += bossAbilities.bossDashDirection.x * dashSpeed;
            boss.y += bossAbilities.bossDashDirection.y * dashSpeed;
            
            bossAbilities.bossDashDistance += dashSpeed;
            
            if (!bossAbilities.bossWeaponAttack && bossAbilities.bossDashDistance < 100) {
                const angle = Math.atan2(player.y - boss.y, player.x - boss.x);
                bossAbilities.bossWeaponAttack = {
                    type: 'melee',
                    x: boss.x,
                    y: boss.y,
                    radius: BOSS_WEAPONS.SCYTHE.range,
                    damage: BOSS_WEAPONS.SCYTHE.baseDamage,
                    color: BOSS_WEAPONS.SCYTHE.swingColor,
                    startTime: currentTime,
                    duration: 300,
                    swingAngle: BOSS_WEAPONS.SCYTHE.swingAngle,
                    meleeType: BOSS_WEAPONS.SCYTHE.meleeType,
                    angle: angle,
                    lifeSteal: BOSS_WEAPONS.SCYTHE.lifeSteal
                };
            }
            
            const distToPlayer = Math.sqrt(
                Math.pow(player.x - boss.x, 2) + Math.pow(player.y - boss.y, 2)
            );
            if (distToPlayer < boss.radius + player.radius) {
                const damage = BOSS_WEAPONS.SCYTHE.baseDamage * 0.5;
                player.health -= damage;
                createDamageIndicator(player.x, player.y, damage, true);
                
                const healAmount = damage * BOSS_WEAPONS.SCYTHE.lifeSteal;
                boss.health = Math.min(boss.maxHealth, boss.health + healAmount);
                createHealthPopup(boss.x, boss.y, Math.floor(healAmount));
            }
        }
    }
    
    if (bossAbilities.bossWeapon && wave !== 30) {
        const boss = monsters.find(m => m.isBoss);
        if (boss) {
            const distanceToPlayer = Math.sqrt(
                Math.pow(player.x - boss.x, 2) + Math.pow(player.y - boss.y, 2)
            );
            
            if (distanceToPlayer <= bossAbilities.bossWeapon.range && 
                currentTime - (bossAbilities.bossWeapon.lastAttack || 0) > 2000) {
                
                const angle = Math.atan2(player.y - boss.y, player.x - boss.x);
                
                bossAbilities.bossWeaponAttack = {
                    type: 'melee',
                    x: boss.x,
                    y: boss.y,
                    radius: bossAbilities.bossWeapon.range,
                    damage: bossAbilities.bossWeapon.baseDamage,
                    color: bossAbilities.bossWeapon.swingColor,
                    startTime: currentTime,
                    duration: 300,
                    swingAngle: bossAbilities.bossWeapon.swingAngle,
                    meleeType: bossAbilities.bossWeapon.meleeType,
                    angle: angle,
                    pierceCount: bossAbilities.bossWeapon.pierceCount || 1
                };
                
                bossAbilities.bossWeapon.lastAttack = currentTime;
            }
        }
    }
    
    if ((player.healthRegen > 0 || player.healthRegenPercent > 0) && currentTime - player.lastRegen >= 1000) {
        let regenAmount = 0;
        if (player.healthRegen > 0) {
            regenAmount += player.healthRegen;
        }
        if (player.healthRegenPercent > 0) {
            regenAmount += Math.floor(player.maxHealth * player.healthRegenPercent);
        }
        player.health = Math.min(player.maxHealth, player.health + regenAmount);
        player.lastRegen = currentTime;
    }
    
    updateWeapons();
    updateProjectiles();
    updateMonsterProjectiles(currentTime);
    updateBossProjectiles(currentTime);
    updateMeleeAttacks();
    updateMonsters(currentTime);
    updateGroundEffects(currentTime);
    updateVisualEffects();
    
    if (waveActive && monsters.length === 0 && spawnIndicators.length === 0) {
        wave++;
        endWave();
    }
    
    updateUI();
}

function updateWeapons() {
    const currentTime = Date.now();
    
    player.weapons.forEach(weapon => {
        if (!weapon || monsters.length === 0) return;
        
        const originalAttackSpeed = weapon.attackSpeed;
        weapon.attackSpeed = originalAttackSpeed * player.attackSpeedMultiplier;
        const canAttack = weapon.canAttack(currentTime);
        weapon.attackSpeed = originalAttackSpeed;
        
        if (canAttack) {
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
                    
                    // For dual daggers, add second attack
                    if (weapon.dualStrike) {
                        const secondAttack = {...attack, angle: attack.angle + 0.2};
                        player.meleeAttacks.push(secondAttack);
                    }
                }
            }
        }
    });
}

function shootGunnerProjectile(gunner) {
    const currentTime = Date.now();
    const angle = Math.atan2(player.y - gunner.y, player.x - gunner.x);
    
    monsterProjectiles.push({
        x: gunner.x,
        y: gunner.y,
        vx: Math.cos(angle) * MONSTER_TYPES.GUNNER.projectileSpeed,
        vy: Math.sin(angle) * MONSTER_TYPES.GUNNER.projectileSpeed,
        damage: MONSTER_TYPES.GUNNER.projectileDamage,
        radius: 5,
        color: MONSTER_TYPES.GUNNER.projectileColor,
        startTime: currentTime,
        lifetime: 3000
    });
}

function updateMonsterProjectiles(currentTime) {
    for (let i = monsterProjectiles.length - 1; i >= 0; i--) {
        const proj = monsterProjectiles[i];
        
        proj.x += proj.vx;
        proj.y += proj.vy;
        
        if (currentTime - proj.startTime > proj.lifetime) {
            monsterProjectiles.splice(i, 1);
            continue;
        }
        
        const dx = player.x - proj.x;
        const dy = player.y - proj.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < player.radius + proj.radius) {
            let damage = proj.damage;
            
            // Runic Plate effect - reduce first hit damage
            if (player.firstHitActive) {
                damage *= 0.5;
                player.firstHitActive = false;
                queueMessage("Runic Plate absorbed 50% damage!");
            }
            
            if (player.damageReduction > 0) {
                damage *= (1 - player.damageReduction);
            }
            
            player.health -= damage;
            createDamageIndicator(player.x, player.y, Math.floor(damage), false);
            
            if (player.health <= 0) {
                gameOver();
            }
            
            monsterProjectiles.splice(i, 1);
        }
        
        if (proj.x < -50 || proj.x > canvas.width + 50 || 
            proj.y < -50 || proj.y > canvas.height + 50) {
            monsterProjectiles.splice(i, 1);
        }
    }
}

function updateBossProjectiles(currentTime) {
    for (let i = bossProjectiles.length - 1; i >= 0; i--) {
        const proj = bossProjectiles[i];
        
        proj.x += proj.vx;
        proj.y += proj.vy;
        
        if (currentTime - proj.startTime > proj.lifetime) {
            bossProjectiles.splice(i, 1);
            continue;
        }
        
        const dx = player.x - proj.x;
        const dy = player.y - proj.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < player.radius + proj.radius) {
            let damage = proj.damage;
            
            // Runic Plate effect - reduce first hit damage
            if (player.firstHitActive) {
                damage *= 0.5;
                player.firstHitActive = false;
                queueMessage("Runic Plate absorbed 50% damage!");
            }
            
            if (player.damageReduction > 0) {
                damage *= (1 - player.damageReduction);
            }
            
            player.health -= damage;
            createDamageIndicator(player.x, player.y, Math.floor(damage), true);
            
            if (player.health <= 0) {
                gameOver();
            }
            
            bossProjectiles.splice(i, 1);
        }
        
        if (proj.x < -50 || proj.x > canvas.width + 50 || 
            proj.y < -50 || proj.y > canvas.height + 50) {
            bossProjectiles.splice(i, 1);
        }
    }
}

function shootBossProjectiles(boss) {
    const currentTime = Date.now();
    
    if (wave === 10) {
        const baseAngle = Math.atan2(player.y - boss.y, player.x - boss.x);
        for (let i = -3; i <= 4; i++) {
            const angle = baseAngle + (i * 0.2);
            bossProjectiles.push({
                x: boss.x,
                y: boss.y,
                vx: Math.cos(angle) * 6,
                vy: Math.sin(angle) * 6,
                damage: 10,
                radius: 5,
                color: '#ff8888',
                startTime: currentTime,
                lifetime: 2500
            });
        }
    } else if (wave === 20 || wave === 30) {
        const baseAngle = Math.atan2(player.y - boss.y, player.x - boss.x);
        for (let i = -2; i <= 2; i++) {
            const angle = baseAngle + (i * 0.15);
            bossProjectiles.push({
                x: boss.x,
                y: boss.y,
                vx: Math.cos(angle) * 5,
                vy: Math.sin(angle) * 5,
                damage: 12,
                radius: 6,
                color: '#ff4444',
                startTime: currentTime,
                lifetime: 3000
            });
        }
    } else {
        const directions = [
            { vx: 1, vy: 1 },
            { vx: -1, vy: 1 },
            { vx: -1, vy: -1 },
            { vx: 1, vy: -1 }
        ];
        
        directions.forEach(dir => {
            bossProjectiles.push({
                x: boss.x,
                y: boss.y,
                vx: dir.vx * 5,
                vy: dir.vy * 5,
                damage: 15,
                radius: 8,
                color: '#ff4444',
                startTime: currentTime,
                lifetime: 3000
            });
        });
    }
}

// ============================================
// PROJECTILES UPDATE FUNCTION
// ============================================

function updateProjectiles() {
    const currentTime = Date.now();
    
    for (let i = player.projectiles.length - 1; i >= 0; i--) {
        const projectile = player.projectiles[i];
        
        if (!projectile.startX) {
            projectile.startX = projectile.x;
            projectile.startY = projectile.y;
            projectile.startTime = currentTime;
        }
        
        if (projectile.isBoomerang) {
            if (projectile.state === 'outgoing') {
                projectile.x += Math.cos(projectile.angle) * projectile.speed;
                projectile.y += Math.sin(projectile.angle) * projectile.speed;
                
                const dx = projectile.x - projectile.startX;
                const dy = projectile.y - projectile.startY;
                projectile.distanceTraveled = Math.sqrt(dx * dx + dy * dy);
                
                if (projectile.distanceTraveled >= projectile.range / 2) {
                    projectile.state = 'returning';
                }
            } else {
                const dx = player.x - projectile.x;
                const dy = player.y - projectile.y;
                const distanceToPlayer = Math.sqrt(dx * dx + dy * dy);
                
                if (distanceToPlayer < 10) {
                    player.projectiles.splice(i, 1);
                    continue;
                }
                
                const angle = Math.atan2(dy, dx);
                projectile.x += Math.cos(angle) * projectile.returnSpeed;
                projectile.y += Math.sin(angle) * projectile.returnSpeed;
                projectile.angle = angle;
            }
            
            projectile.rotation = (projectile.rotation || 0) + 0.2;
        } else {
            projectile.x += Math.cos(projectile.angle) * projectile.speed;
            projectile.y += Math.sin(projectile.angle) * projectile.speed;
            
            const dx = projectile.x - player.x;
            const dy = projectile.y - player.y;
            const distanceFromPlayer = Math.sqrt(dx * dx + dy * dy);
            
            if (distanceFromPlayer > projectile.range) {
                player.projectiles.splice(i, 1);
                continue;
            }
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
            
            if (distance < (projectile.size || 4) + monster.radius) {
                let damage = projectile.damage;
                let isCritical = false;
                
                if (Math.random() < player.criticalChance) {
                    damage *= 2;
                    isCritical = true;
                }
                
                damage = Math.floor(damage * player.damageMultiplier);
                
                monster.health -= damage;
                
                createDamageIndicator(monster.x, monster.y, damage, isCritical);
                
                if (player.lifeSteal > 0) {
                    const healAmount = Math.floor(damage * player.lifeSteal);
                    player.health = Math.min(player.maxHealth, player.health + healAmount);
                    createHealthPopup(player.x, player.y, healAmount);
                }
                
                if (monster.isBoss && monster.lifeSteal) {
                    const bossHeal = Math.floor(damage * monster.lifeSteal);
                    monster.health = Math.min(monster.maxHealth, monster.health + bossHeal);
                    createHealthPopup(monster.x, monster.y, bossHeal);
                }
                
                if (projectile.isBoomerang) {
                    if (!projectile.targetsHit.includes(monster)) {
                        projectile.targetsHit.push(monster);
                    }
                }
                
                if (!projectile.isBoomerang) {
                    if (!projectile.bounceCount || !projectile.targetsHit) {
                        player.projectiles.splice(i, 1);
                    } else {
                        if (!projectile.targetsHit.includes(monster)) {
                            projectile.targetsHit.push(monster);
                        }
                    }
                } else if (projectile.isBoomerang && projectile.targetsHit.length >= projectile.maxTargets) {
                    player.projectiles.splice(i, 1);
                    break;
                }
                
                if (monster.health <= 0) {
                    if (monster.isSplitter) {
                        handleSplitterDeath(monster);
                    }
                    
                    const goldRange = monster.monsterType.goldDrop || { min: 5, max: 15 };
                    const goldDrop = Math.floor(Math.random() * (goldRange.max - goldRange.min + 1)) + goldRange.min;
                    const goldEarned = Math.floor(goldDrop * (1 + player.goldMultiplier));
                    gold += goldEarned;
                    createGoldPopup(monster.x, monster.y, goldEarned);
                    
                    if (monster.monsterType && monster.monsterType.explosive) {
                        const explosionRadius = MONSTER_TYPES.EXPLOSIVE.explosionRadius;
                        const explosionDamage = monster.damage * MONSTER_TYPES.EXPLOSIVE.explosionDamage;
                        
                        const dxToPlayer = player.x - monster.x;
                        const dyToPlayer = player.y - monster.y;
                        const distanceToPlayer = Math.sqrt(dxToPlayer * dxToPlayer + dyToPlayer * dyToPlayer);
                        
                        if (distanceToPlayer < explosionRadius + player.radius) {
                            player.health -= explosionDamage;
                            createDamageIndicator(player.x, player.y, Math.floor(explosionDamage), true);
                            
                            if (player.health <= 0) {
                                gameOver();
                            }
                        }
                        
                        for (let k = monsters.length - 1; k >= 0; k--) {
                            const otherMonster = monsters[k];
                            
                            if (otherMonster === monster) continue;
                            
                            const dx = otherMonster.x - monster.x;
                            const dy = otherMonster.y - monster.y;
                            const distance = Math.sqrt(dx * dx + dy * dy);
                            
                            if (distance < explosionRadius + otherMonster.radius) {
                                otherMonster.health -= explosionDamage;
                                createDamageIndicator(otherMonster.x, otherMonster.y, Math.floor(explosionDamage), true);
                                
                                if (otherMonster.health <= 0) {
                                    if (otherMonster.isSplitter) {
                                        handleSplitterDeath(otherMonster);
                                    }
                                    
                                    monsters.splice(k, 1);
                                    kills++;
                                    
                                    const otherGoldRange = otherMonster.monsterType.goldDrop || { min: 5, max: 15 };
                                    const otherGoldDrop = Math.floor(Math.random() * (otherGoldRange.max - otherGoldRange.min + 1)) + otherGoldRange.min;
                                    const otherGoldEarned = Math.floor(otherGoldDrop * (1 + player.goldMultiplier));
                                    gold += otherGoldEarned;
                                    createGoldPopup(otherMonster.x, otherMonster.y, otherGoldEarned);
                                    
                                    addVisualEffect({
                                        type: 'death',
                                        x: otherMonster.x,
                                        y: otherMonster.y,
                                        color: otherMonster.color,
                                        startTime: Date.now(),
                                        duration: 300
                                    });
                                }
                            }
                        }
                        
                        addVisualEffect({
                            type: 'explosion',
                            x: monster.x,
                            y: monster.y,
                            radius: explosionRadius,
                            startTime: Date.now(),
                            duration: 500
                        });
                        
                        addVisualEffect({
                            type: 'shockwave',
                            x: monster.x,
                            y: monster.y,
                            radius: explosionRadius * 2,
                            startTime: Date.now(),
                            duration: 300
                        });
                    }
                    
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
                
                damage = Math.floor(damage * player.damageMultiplier);
                
                monster.health -= damage;
                
                createDamageIndicator(monster.x, monster.y, damage, isCritical);
                
                if (player.lifeSteal > 0) {
                    const healAmount = Math.floor(damage * player.lifeSteal);
                    player.health = Math.min(player.maxHealth, player.health + healAmount);
                    createHealthPopup(player.x, player.y, healAmount);
                }
                
                if (monster.isBoss && monster.lifeSteal) {
                    const bossHeal = Math.floor(damage * monster.lifeSteal);
                    monster.health = Math.min(monster.maxHealth, monster.health + bossHeal);
                    createHealthPopup(monster.x, monster.y, bossHeal);
                }
                
                hits++;
                
                if (attack.meleeType === 'pierce' && hits >= attack.pierceCount) {
                    break;
                }
                
                if (monster.health <= 0) {
                    if (monster.isSplitter) {
                        handleSplitterDeath(monster);
                    }
                    
                    const goldRange = monster.monsterType.goldDrop || { min: 5, max: 15 };
                    const goldDrop = Math.floor(Math.random() * (goldRange.max - goldRange.min + 1)) + goldRange.min;
                    const goldEarned = Math.floor(goldDrop * (1 + player.goldMultiplier));
                    gold += goldEarned;
                    createGoldPopup(monster.x, monster.y, goldEarned);
                    
                    if (monster.monsterType && monster.monsterType.explosive) {
                        const explosionRadius = MONSTER_TYPES.EXPLOSIVE.explosionRadius;
                        const explosionDamage = monster.damage * MONSTER_TYPES.EXPLOSIVE.explosionDamage;
                        
                        const dxToPlayer = player.x - monster.x;
                        const dyToPlayer = player.y - monster.y;
                        const distanceToPlayer = Math.sqrt(dxToPlayer * dxToPlayer + dyToPlayer * dyToPlayer);
                        
                        if (distanceToPlayer < explosionRadius + player.radius) {
                            player.health -= explosionDamage;
                            createDamageIndicator(player.x, player.y, Math.floor(explosionDamage), true);
                            
                            if (player.health <= 0) {
                                gameOver();
                            }
                        }
                        
                        for (let k = monsters.length - 1; k >= 0; k--) {
                            const otherMonster = monsters[k];
                            
                            if (otherMonster === monster) continue;
                            
                            const dx = otherMonster.x - monster.x;
                            const dy = otherMonster.y - monster.y;
                            const distance = Math.sqrt(dx * dx + dy * dy);
                            
                            if (distance < explosionRadius + otherMonster.radius) {
                                otherMonster.health -= explosionDamage;
                                createDamageIndicator(otherMonster.x, otherMonster.y, Math.floor(explosionDamage), true);
                                
                                if (otherMonster.health <= 0) {
                                    if (otherMonster.isSplitter) {
                                        handleSplitterDeath(otherMonster);
                                    }
                                    
                                    monsters.splice(k, 1);
                                    kills++;
                                    
                                    const otherGoldRange = otherMonster.monsterType.goldDrop || { min: 5, max: 15 };
                                    const otherGoldDrop = Math.floor(Math.random() * (otherGoldRange.max - otherGoldRange.min + 1)) + otherGoldRange.min;
                                    const otherGoldEarned = Math.floor(otherGoldDrop * (1 + player.goldMultiplier));
                                    gold += otherGoldEarned;
                                    createGoldPopup(otherMonster.x, otherMonster.y, otherGoldEarned);
                                    
                                    addVisualEffect({
                                        type: 'death',
                                        x: otherMonster.x,
                                        y: otherMonster.y,
                                        color: otherMonster.color,
                                        startTime: Date.now(),
                                        duration: 300
                                    });
                                }
                            }
                        }
                        
                        addVisualEffect({
                            type: 'explosion',
                            x: monster.x,
                            y: monster.y,
                            radius: explosionRadius,
                            startTime: Date.now(),
                            duration: 500
                        });
                        
                        addVisualEffect({
                            type: 'shockwave',
                            x: monster.x,
                            y: monster.y,
                            radius: explosionRadius * 2,
                            startTime: Date.now(),
                            duration: 300
                        });
                    }
                    
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
                    
                    j--;
                }
            }
        }
    }
}

function updateMonsters(currentTime) {
    dashers = monsters.filter(m => m.isDasher);
    dashers.forEach(dasher => updateDasher(dasher, currentTime));
    
    monsters.forEach(monster => {
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
        
        if (monster.stunned || monster.frozen) {
            return;
        }
        
        if (monster.isDasher && monster.isDashing) {
            return;
        }
        
        const dx = player.x - monster.x;
        const dy = player.y - monster.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 0) {
            monster.x += (dx / distance) * monster.speed;
            monster.y += (dy / distance) * monster.speed;
        }
        
        if (monster.isGunner && currentTime - monster.lastAttack >= monster.attackCooldown) {
            shootGunnerProjectile(monster);
            monster.lastAttack = currentTime;
        }
        
        if (monster.isBoss && currentTime - monster.lastAttack >= monster.attackCooldown) {
            shootBossProjectiles(monster);
            monster.lastAttack = currentTime;
        }
        
        if (distance < player.radius + monster.radius) {
            if (currentTime - monster.lastAttack >= monster.attackCooldown) {
                let actualDamage = monster.damage;
                
                if (Math.random() < player.dodgeChance) {
                    queueMessage("DODGE!");
                    monster.lastAttack = currentTime;
                    return;
                }
                
                // Runic Plate effect - reduce first hit damage
                if (player.firstHitActive) {
                    actualDamage *= 0.5;
                    player.firstHitActive = false;
                    queueMessage("Runic Plate absorbed 50% damage!");
                }
                
                if (player.damageReduction > 0) {
                    actualDamage *= (1 - player.damageReduction);
                }
                
                player.health -= actualDamage;
                monster.lastAttack = currentTime;
                
                if (player.thornsDamage > 0) {
                    const thornsDamage = Math.floor(actualDamage * player.thornsDamage);
                    monster.health -= thornsDamage;
                    createDamageIndicator(monster.x, monster.y, thornsDamage, false);
                }
                
                createDamageIndicator(player.x, player.y, Math.floor(actualDamage), false);
                
                if (player.health <= 0) {
                    gameOver();
                }
            }
        }
    });
}

function updateGroundEffects(currentTime) {
    for (let i = groundFire.length - 1; i >= 0; i--) {
        const fire = groundFire[i];
        if (currentTime - fire.startTime > fire.duration) {
            groundFire.splice(i, 1);
            continue;
        }
        
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
        if (progress > 1) return;
        
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
                
            case 'spawn':
                ctx.strokeStyle = effect.color || '#ffffff';
                ctx.lineWidth = 3 * (1 - progress);
                ctx.shadowColor = effect.color || '#ffffff';
                ctx.shadowBlur = 15 * alpha;
                
                for (let i = 0; i < 3; i++) {
                    ctx.beginPath();
                    ctx.arc(effect.x, effect.y, 15 + i * 10 + progress * 30, 0, Math.PI * 2);
                    ctx.stroke();
                }
                break;
                
            case 'bossSpawn':
                const gradient = ctx.createRadialGradient(effect.x, effect.y, 0, effect.x, effect.y, effect.radius);
                gradient.addColorStop(0, `rgba(${effect.color ? parseInt(effect.color.slice(1,3),16) : 255}, ${effect.color ? parseInt(effect.color.slice(3,5),16) : 215}, 0, ${alpha})`);
                gradient.addColorStop(0.5, `rgba(255, 100, 0, ${alpha * 0.7})`);
                gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
                
                ctx.fillStyle = gradient;
                ctx.shadowColor = '#ffd700';
                ctx.shadowBlur = 50;
                ctx.beginPath();
                ctx.arc(effect.x, effect.y, effect.radius * (1 - progress * 0.5), 0, Math.PI * 2);
                ctx.fill();
                break;
                
            case 'explosion':
                const explosionSize = (effect.radius || 40) * (1 - progress * 0.5);
                const expGradient = ctx.createRadialGradient(effect.x, effect.y, 0, effect.x, effect.y, explosionSize);
                expGradient.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
                expGradient.addColorStop(0.3, `rgba(255, 200, 0, ${alpha})`);
                expGradient.addColorStop(0.6, `rgba(255, 100, 0, ${alpha * 0.7})`);
                expGradient.addColorStop(1, `rgba(255, 0, 0, 0)`);
                
                ctx.fillStyle = expGradient;
                ctx.shadowColor = '#FF4500';
                ctx.shadowBlur = 30;
                ctx.beginPath();
                ctx.arc(effect.x, effect.y, explosionSize, 0, Math.PI * 2);
                ctx.fill();
                break;
                
            case 'landmineSpawn':
                ctx.strokeStyle = effect.color;
                ctx.lineWidth = 2;
                ctx.shadowColor = effect.color;
                ctx.shadowBlur = 15 * alpha;
                ctx.beginPath();
                ctx.arc(effect.x, effect.y, effect.radius * (1 + progress), 0, Math.PI * 2);
                ctx.stroke();
                break;
                
            case 'screenExplosion':
                ctx.fillStyle = `rgba(255, 69, 0, ${alpha * 0.3})`;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
                ctx.lineWidth = 5;
                ctx.beginPath();
                ctx.arc(effect.x, effect.y, effect.radius * progress, 0, Math.PI * 2);
                ctx.stroke();
                break;
                
            case 'rage':
                ctx.fillStyle = `rgba(255, 0, 0, ${alpha * 0.2})`;
                ctx.beginPath();
                ctx.arc(effect.x, effect.y, effect.radius * (1 + progress), 0, Math.PI * 2);
                ctx.fill();
                break;
                
            case 'upgrade':
                ctx.fillStyle = `rgba(255, 215, 0, ${alpha})`;
                ctx.shadowColor = '#FFD700';
                ctx.shadowBlur = 30;
                for (let i = 0; i < 5; i++) {
                    const angle = (i / 5) * Math.PI * 2 + progress * 2;
                    const distance = effect.radius * progress;
                    ctx.beginPath();
                    ctx.arc(effect.x + Math.cos(angle) * distance, 
                           effect.y + Math.sin(angle) * distance, 
                           3, 0, Math.PI * 2);
                    ctx.fill();
                }
                break;
                
            case 'asteroidWarning':
                ctx.strokeStyle = `rgba(255, 0, 0, ${alpha})`;
                ctx.lineWidth = 3;
                ctx.shadowColor = '#ff0000';
                ctx.shadowBlur = 20;
                ctx.beginPath();
                ctx.arc(effect.x, effect.y, effect.radius * (1 + progress), 0, Math.PI * 2);
                ctx.stroke();
                break;
                
            case 'asteroid':
                ctx.fillStyle = `rgba(139, 69, 19, ${alpha})`;
                ctx.shadowColor = '#8B4513';
                ctx.shadowBlur = 30;
                ctx.beginPath();
                ctx.arc(effect.x, effect.y, effect.radius * (1 - progress), 0, Math.PI * 2);
                ctx.fill();
                
                for (let i = 0; i < 4; i++) {
                    const angle = (i / 4) * Math.PI * 2 + progress * 2;
                    const distance = effect.radius * progress * 2;
                    ctx.fillStyle = `rgba(255, 140, 0, ${alpha})`;
                    ctx.beginPath();
                    ctx.arc(effect.x + Math.cos(angle) * distance, 
                           effect.y + Math.sin(angle) * distance, 
                           5, 0, Math.PI * 2);
                    ctx.fill();
                }
                break;
                
            case 'shockwave':
                ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
                ctx.lineWidth = 3;
                ctx.shadowColor = '#FFFFFF';
                ctx.shadowBlur = 20;
                ctx.beginPath();
                ctx.arc(effect.x, effect.y, (effect.radius || 80) * progress, 0, Math.PI * 2);
                ctx.stroke();
                break;
        }
        
        ctx.restore();
    });
}

function drawMonsters() {
    const currentTime = Date.now();
    
    monsters.forEach(monster => {
        ctx.save();
        ctx.translate(monster.x, monster.y);
        
        ctx.fillStyle = monster.color;
        ctx.shadowColor = monster.color;
        ctx.shadowBlur = monster.isBoss ? 20 : 10;
        ctx.beginPath();
        ctx.arc(0, 0, monster.radius, 0, Math.PI * 2);
        ctx.fill();
        
        if (monster.stunned && monster.stunnedUntil > currentTime) {
            ctx.fillStyle = 'rgba(255, 255, 0, 0.3)';
            ctx.beginPath();
            ctx.arc(0, 0, monster.radius, 0, Math.PI * 2);
            ctx.fill();
        }
        
        if (monster.frozen && monster.frozenUntil > currentTime) {
            ctx.fillStyle = 'rgba(0, 255, 255, 0.3)';
            ctx.beginPath();
            ctx.arc(0, 0, monster.radius, 0, Math.PI * 2);
            ctx.fill();
        }
        
        if (monster.isDasher && monster.isDashing) {
            ctx.strokeStyle = '#00ffff';
            ctx.lineWidth = 3;
            ctx.shadowColor = '#00ffff';
            ctx.shadowBlur = 15;
            ctx.beginPath();
            ctx.arc(0, 0, monster.radius + 5, 0, Math.PI * 2);
            ctx.stroke();
        }
        
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
        
        const healthPercent = Math.max(0, Math.min(1, monster.health / monster.maxHealth));
        const barWidth = monster.radius * 2;
        const barHeight = 4;
        const barX = -monster.radius;
        const barY = -monster.radius - 10;
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(barX, barY, barWidth, barHeight);
        
        if (healthPercent > 0) {
            ctx.fillStyle = healthPercent > 0.5 ? '#00ff00' : healthPercent > 0.2 ? '#ffff00' : '#ff0000';
            ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);
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
// STATS PANEL BUTTON
// ============================================

function createStatsButton() {
    const button = document.createElement('button');
    button.id = 'statsButton';
    button.className = 'stats-button';
    button.innerHTML = '📊 Stats';
    
    button.addEventListener('click', toggleStatsPanel);
    button.addEventListener('touchstart', (e) => {
        e.preventDefault();
        toggleStatsPanel();
    });
    
    document.body.appendChild(button);
}

// ============================================
// KEYBOARD CONTROLS
// ============================================

document.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    
    if (key === 'w' || key === 'arrowup') {
        keys.w = true;
        keys.up = true;
        e.preventDefault();
    }
    if (key === 's' || key === 'arrowdown') {
        keys.s = true;
        keys.down = true;
        e.preventDefault();
    }
    if (key === 'a' || key === 'arrowleft') {
        keys.a = true;
        keys.left = true;
        e.preventDefault();
    }
    if (key === 'd' || key === 'arrowright') {
        keys.d = true;
        keys.right = true;
        e.preventDefault();
    }
    
    if (key === ' ') {
        if (gameState === 'shop') {
            keys.space = true;
            nextWaveBtn.click();
        }
        e.preventDefault();
    }
    
    if (key === 'r') {
        if (gameState === 'shop') {
            player.weapons.forEach(weapon => {
                if (weapon.usesAmmo && !weapon.isReloading && !weapon.isThrowable) {
                    weapon.startReload();
                }
            });
        }
        e.preventDefault();
    }
    
    if (key === 's' && e.ctrlKey) {
        e.preventDefault();
        saveGame();
    }
    
    if (key === 'l' && e.ctrlKey) {
        e.preventDefault();
        loadGame();
    }
});

document.addEventListener('keyup', (e) => {
    const key = e.key.toLowerCase();
    
    if (key === 'w' || key === 'arrowup') {
        keys.w = false;
        keys.up = false;
        e.preventDefault();
    }
    if (key === 's' || key === 'arrowdown') {
        keys.s = false;
        keys.down = false;
        e.preventDefault();
    }
    if (key === 'a' || key === 'arrowleft') {
        keys.a = false;
        keys.left = false;
        e.preventDefault();
    }
    if (key === 'd' || key === 'arrowright') {
        keys.d = false;
        keys.right = false;
        e.preventDefault();
    }
    if (key === ' ') {
        keys.space = false;
        e.preventDefault();
    }
});

// ============================================
// TOUCH EVENT HANDLERS
// ============================================

canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    mouseX = touch.clientX - rect.left;
    mouseY = touch.clientY - rect.top;
    touchStartTime = Date.now();
    touchMoved = false;
    lastTouchX = mouseX;
    lastTouchY = mouseY;
});

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    mouseX = touch.clientX - rect.left;
    mouseY = touch.clientY - rect.top;
    touchMoved = true;
});

canvas.addEventListener('touchend', (e) => {
    e.preventDefault();
});

canvas.addEventListener('touchcancel', (e) => {
    e.preventDefault();
});

canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
});

startGameBtn.addEventListener('click', (e) => {
    e.preventDefault();
    initGame();
});

startGameBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    initGame();
});

nextWaveBtn.addEventListener('click', (e) => {
    e.preventDefault();
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

nextWaveBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
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

scrapWeaponBtn.addEventListener('click', (e) => {
    e.preventDefault();
    scrapWeapon();
});

scrapWeaponBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    scrapWeapon();
});

mergeWeaponBtn.addEventListener('click', (e) => {
    e.preventDefault();
    mergeWeapons();
});

mergeWeaponBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    mergeWeapons();
});

refreshShopBtn.addEventListener('click', (e) => {
    e.preventDefault();
    refreshShop();
});

refreshShopBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    refreshShop();
});

restartBtn.addEventListener('click', (e) => {
    e.preventDefault();
    gameOverOverlay.style.display = 'none';
    clearSave();
    initGame();
});

restartBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    gameOverOverlay.style.display = 'none';
    clearSave();
    initGame();
});

// ============================================
// CSS STYLES
// ============================================

const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        0% { opacity: 1; }
        70% { opacity: 1; }
        100% { opacity: 0; }
    }

    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .consumables-container {
        margin-top: 20px;
        padding: 10px;
        background: rgba(40, 40, 80, 0.6);
        border-radius: 10px;
        border: 1px solid #5555aa;
    }
    
    .consumables-container h4 {
        color: #ffcc00;
        margin-bottom: 10px;
        font-size: 1.1rem;
    }
    
    .consumables-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 8px;
    }
    
    .consumable-slot {
        aspect-ratio: 1;
        background: rgba(60, 60, 120, 0.5);
        border: 2px solid #4ecdc4;
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        position: relative;
        cursor: pointer;
        transition: all 0.2s;
        padding: 5px;
        -webkit-tap-highlight-color: transparent;
        user-select: none;
        -webkit-user-select: none;
    }
    
    .consumable-slot:hover {
        transform: translateY(-2px);
        border-color: #ffd700;
        box-shadow: 0 5px 15px rgba(255, 215, 0, 0.3);
    }
    
    .consumable-slot:active {
        transform: scale(0.95);
    }
    
    .consumable-icon {
        font-size: 1.5rem;
    }
    
    .consumable-name {
        font-size: 0.7rem;
        text-align: center;
        color: #aaaaff;
    }
    
    .consumable-count {
        position: absolute;
        top: 2px;
        right: 2px;
        background: #ffd700;
        color: #000;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.7rem;
        font-weight: bold;
    }
    
    .empty-consumable {
        grid-column: span 4;
        text-align: center;
        color: #5555aa;
        padding: 10px;
        font-size: 0.9rem;
    }

    .joystick-container {
        position: fixed;
        bottom: 30px;
        left: 30px;
        z-index: 100;
        -webkit-tap-highlight-color: transparent;
        user-select: none;
        -webkit-user-select: none;
        touch-action: none;
    }

    .joystick-base {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.15);
        border: 3px solid rgba(255, 255, 255, 0.3);
        backdrop-filter: blur(5px);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
    }

    .joystick-base.active {
        background: rgba(255, 255, 255, 0.25);
        border-color: rgba(255, 215, 0, 0.5);
    }

    .joystick-handle {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        border: 2px solid rgba(255, 255, 255, 0.6);
        transition: transform 0.05s ease;
        pointer-events: none;
    }

    @media (max-width: 768px) {
        .joystick-base {
            width: 100px;
            height: 100px;
        }
        
        .joystick-handle {
            width: 40px;
            height: 40px;
        }
    }

    .message-container {
        position: fixed;
        top: 100px;
        right: 20px;
        z-index: 1000;
        display: flex;
        flex-direction: column;
        gap: 10px;
        pointer-events: none;
        max-width: 300px;
    }

    .message-item {
        background: rgba(0, 0, 0, 0.8);
        color: #ffcc00;
        padding: 12px 20px;
        border-radius: 8px;
        border: 2px solid #ffcc00;
        font-size: 1rem;
        font-weight: bold;
        transform: translateX(100%);
        opacity: 0;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
    }

    .message-item.show {
        transform: translateX(0);
        opacity: 1;
    }

    .message-item.hide {
        transform: translateX(100%);
        opacity: 0;
    }

    #continueGameBtn {
        margin-top: 10px;
        padding: 10px 30px;
        background: linear-gradient(45deg, #4CAF50, #45a049);
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 1.2rem;
        font-weight: bold;
        transition: transform 0.2s;
        -webkit-tap-highlight-color: transparent;
        user-select: none;
        -webkit-user-select: none;
        touch-action: manipulation;
    }

    #continueGameBtn:hover {
        transform: scale(1.05);
        box-shadow: 0 0 20px rgba(76, 175, 80, 0.5);
    }

    #continueGameBtn:active {
        transform: scale(0.98);
    }

    .shop-item {
        -webkit-tap-highlight-color: transparent;
        user-select: none;
        -webkit-user-select: none;
        touch-action: manipulation;
    }

    .weapon-slot {
        -webkit-tap-highlight-color: transparent;
        user-select: none;
        -webkit-user-select: none;
        touch-action: manipulation;
    }

    .stat-buff {
        -webkit-tap-highlight-color: transparent;
        user-select: none;
        -webkit-user-select: none;
        touch-action: manipulation;
    }

    .stats-button {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 200;
        padding: 10px 20px;
        background: linear-gradient(45deg, #ffd700, #ffaa00);
        color: #000;
        border: none;
        border-radius: 25px;
        font-size: 1.1rem;
        font-weight: bold;
        cursor: pointer;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
        transition: all 0.2s;
        -webkit-tap-highlight-color: transparent;
        user-select: none;
        -webkit-user-select: none;
        touch-action: manipulation;
    }

    .stats-button:hover {
        transform: scale(1.05);
        box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
    }

    .stats-button:active {
        transform: scale(0.95);
    }

    #statsPanel {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 300px;
        max-height: 80vh;
        background: rgba(20, 20, 40, 0.95);
        backdrop-filter: blur(10px);
        border: 2px solid #ffd700;
        border-radius: 15px;
        padding: 20px;
        z-index: 1000;
        color: white;
        box-shadow: 0 0 30px rgba(255, 215, 0, 0.3);
        transition: all 0.3s;
        overflow-y: auto;
    }

    .stats-panel-hidden {
        opacity: 0;
        visibility: hidden;
        pointer-events: none;
    }

    .stats-panel-visible {
        opacity: 1;
        visibility: visible;
        pointer-events: all;
    }

    .stats-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
        padding-bottom: 10px;
        border-bottom: 1px solid #ffd700;
    }

    .stats-header h3 {
        margin: 0;
        color: #ffd700;
        font-size: 1.3rem;
    }

    #closeStatsBtn {
        background: none;
        border: none;
        color: #ffd700;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0 5px;
        transition: transform 0.2s;
        -webkit-tap-highlight-color: transparent;
    }

    #closeStatsBtn:hover {
        transform: scale(1.2);
    }

    #closeStatsBtn:active {
        transform: scale(0.9);
    }

    .stats-content {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .stat-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 5px 10px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 5px;
    }

    .stat-label {
        color: #aaaaff;
        font-size: 0.9rem;
    }

    .stat-value {
        color: #ffd700;
        font-weight: bold;
        font-size: 1rem;
    }

    .stat-divider {
        height: 1px;
        background: rgba(255, 215, 0, 0.3);
        margin: 10px 0;
    }

    .control-hint {
        position: fixed;
        bottom: 10px;
        right: 10px;
        color: rgba(255, 255, 255, 0.5);
        font-size: 0.8rem;
        background: rgba(0, 0, 0, 0.3);
        padding: 5px 10px;
        border-radius: 5px;
        pointer-events: none;
        z-index: 100;
    }

    .throwable-ammo {
        display: flex;
        gap: 2px;
        font-size: 0.8rem;
    }
`;
document.head.appendChild(style);

// ============================================
// INITIALIZATION
// ============================================

const controlHint = document.createElement('div');
controlHint.className = 'control-hint';
controlHint.innerHTML = 'Joystick | WASD | Space: Next Wave | 📊 Stats | R: Reload | Ctrl+S: Save | Ctrl+L: Load';
document.body.appendChild(controlHint);

createMessageContainer();
createJoystick();
createStatsPanel();
createStatsButton();
checkForSave();

gameLoop();
