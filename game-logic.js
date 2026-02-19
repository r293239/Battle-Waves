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
        explosive: true,
        explosionRadius: 100,
        explosionDamage: 3.0
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
        attackCooldown: 1500
    },
    BOSS: {
        name: 'BOSS',
        color: '#ffd700',
        speed: 0.8,
        healthMultiplier: 20,
        damageMultiplier: 2.5,
        sizeMultiplier: 2.5,
        icon: '👑',
        isBoss: true,
        projectileSpeed: 5,
        projectileDamage: 20,
        projectileCooldown: 1800
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
        
        // Spread factor for weapons (0 = perfect accuracy, higher = more spread)
        this.spread = weaponData.spread || 0;
        
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
        
        // Boomerang specific properties
        this.returnSpeed = weaponData.returnSpeed || 0;
        this.maxTargets = weaponData.maxTargets || 1;
        this.useImage = weaponData.useImage || false;
        this.imagePath = weaponData.imagePath || null;
        
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
                        isPellet: true,
                        startTime: currentTime
                    });
                }
                return attacks;
            } else if (this.id === 'boomerang') {
                // Boomerang specific attack - only one boomerang
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
                    hitThisFrame: false
                };
            } else {
                // Apply spread to all other ranged weapons - NO HOMING
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
                    startTime: currentTime
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
            if (this.id === 'boomerang') return 'BOOMERANG';
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
    
    // Player stats
    dodgeChance: 0,
    thornsDamage: 0,
    attackSpeedMultiplier: 1,
    firstHitReduction: false,
    voidCrystalChance: 0,
    guardianAngelUsed: false,
    bloodContractDamage: 0,
    
    // Consumable inventory
    consumables: [],
    
    // Permanent item flags
    berserkerRing: false,
    sharpeningStone: false,
    sharpeningStoneWave: 0,
    enchantersInk: false,
    guardianAngel: false,
    bloodContract: false,
    lastBloodDamage: 0
};

let monsters = [];
let mouseX = 400;
let mouseY = 300;

// Effect arrays
let groundFire = [];
let poisonClouds = [];
let voidZones = [];
let activeTraps = [];
let bossProjectiles = [];
let monsterProjectiles = []; // For gunner monster projectiles

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

// Add consumables container to UI
const consumablesContainer = document.createElement('div');
consumablesContainer.className = 'consumables-container';
consumablesContainer.innerHTML = '<h4>Consumables</h4><div class="consumables-grid" id="consumablesGrid"></div>';
document.querySelector('.ui-panel').insertBefore(consumablesContainer, document.querySelector('.panel-section:last-child'));

const consumablesGrid = document.getElementById('consumablesGrid');

// Load boomerang image
const boomerangImage = new Image();
boomerangImage.src = 'assets/boomerang.png';

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
        // For waves beyond 30, scale up progressively
        const baseWave = GAME_DATA.WAVES[GAME_DATA.WAVES.length - 1];
        const extraWaves = waveNumber - GAME_DATA.WAVES.length;
        const scaleFactor = 1 + extraWaves * 0.15;
        return {
            number: waveNumber,
            monsters: Math.floor(baseWave.monsters * scaleFactor),
            monsterHealth: Math.floor(baseWave.monsterHealth * scaleFactor),
            monsterDamage: Math.floor(baseWave.monsterDamage * scaleFactor),
            goldReward: Math.floor(baseWave.goldReward * scaleFactor),
            isBoss: (waveNumber % 10 === 0), // Boss every 10 waves
            spawnDelay: Math.max(50, 200 - extraWaves * 5) // Faster spawns in later waves
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
        
        // Reset stats
        dodgeChance: 0,
        thornsDamage: 0,
        attackSpeedMultiplier: 1,
        firstHitReduction: false,
        voidCrystalChance: 0,
        guardianAngelUsed: false,
        bloodContractDamage: 0,
        
        // Reset consumables and permanent items
        consumables: [],
        berserkerRing: false,
        sharpeningStone: false,
        sharpeningStoneWave: 0,
        enchantersInk: false,
        guardianAngel: false,
        bloodContract: false,
        lastBloodDamage: 0
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
    bossProjectiles = [];
    monsterProjectiles = [];
    
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
        waveDisplay.textContent = `BOSS WAVE ${wave} - TANKY BOSS!`;
        waveDisplay.classList.add('boss-wave');
    }
    
    waveDisplay.style.opacity = 1;
    
    monsters = [];
    player.projectiles = [];
    player.meleeAttacks = [];
    visualEffects = [];
    bossProjectiles = [];
    monsterProjectiles = [];
    
    // Reset first hit reduction for new wave
    if (player.firstHitReduction) {
        player.firstHitReduction = false;
    }
    
    scrapWeaponBtn.style.display = 'none';
    mergeWeaponBtn.style.display = 'none';
    selectedWeaponIndex = -1;
    mergeTargetIndex = -1;
    
    showSpawnIndicators();
    
    // STAGGERED SPAWNING - monsters spawn one by one with delay
    setTimeout(() => {
        const monsterCount = waveConfig.monsters;
        const spawnDelay = waveConfig.spawnDelay || 200;
        
        if (waveConfig.isBoss) {
            // Boss spawns immediately
            for (let i = 0; i < monsterCount; i++) {
                spawnMonster();
            }
        } else {
            // Staggered spawning for regular monsters
            for (let i = 0; i < monsterCount; i++) {
                setTimeout(() => {
                    if (gameState === 'wave') { // Only spawn if wave is still active
                        spawnMonster();
                    }
                }, i * spawnDelay);
            }
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
            else if (rand < 0.75) monsterType = MONSTER_TYPES.EXPLOSIVE;
            else monsterType = MONSTER_TYPES.GUNNER;
        } else if (wave < 15) {
            if (rand < 0.25) monsterType = MONSTER_TYPES.NORMAL;
            else if (rand < 0.4) monsterType = MONSTER_TYPES.FAST;
            else if (rand < 0.55) monsterType = MONSTER_TYPES.TANK;
            else if (rand < 0.7) monsterType = MONSTER_TYPES.EXPLOSIVE;
            else if (rand < 0.85) monsterType = MONSTER_TYPES.GUNNER;
            else monsterType = MONSTER_TYPES.BOSS; // Mini-boss spawns
        } else {
            // Waves 15+ have all types with higher chance of tougher enemies
            if (rand < 0.2) monsterType = MONSTER_TYPES.NORMAL;
            else if (rand < 0.35) monsterType = MONSTER_TYPES.FAST;
            else if (rand < 0.5) monsterType = MONSTER_TYPES.TANK;
            else if (rand < 0.65) monsterType = MONSTER_TYPES.EXPLOSIVE;
            else if (rand < 0.8) monsterType = MONSTER_TYPES.GUNNER;
            else monsterType = MONSTER_TYPES.BOSS; // Mini-boss spawns
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
        waveConfig.monsterHealth * monsterType.healthMultiplier : 
        Math.floor(waveConfig.monsterHealth * monsterType.healthMultiplier);
    
    const damage = waveConfig.isBoss ?
        waveConfig.monsterDamage * monsterType.damageMultiplier :
        Math.floor(waveConfig.monsterDamage * monsterType.damageMultiplier);
    
    const monster = {
        x, y,
        radius: waveConfig.isBoss ? 45 : (15 + Math.random() * 10) * monsterType.sizeMultiplier,
        health: health,
        maxHealth: health,
        damage: damage,
        speed: (waveConfig.isBoss ? 0.8 : (1 + wave * 0.1)) * monsterType.speed,
        color: monsterType.color,
        type: monsterType.name,
        monsterType: monsterType,
        lastAttack: 0,
        attackCooldown: monsterType.attackCooldown || GAME_DATA.MONSTER_ATTACK_COOLDOWN,
        isBoss: waveConfig.isBoss || monsterType.isBoss || false,
        
        // Status effects
        slowed: false,
        slowUntil: 0,
        frozen: false,
        frozenUntil: 0,
        stunned: false,
        stunnedUntil: 0,
        
        // Explosive properties
        explosive: monsterType.explosive || false,
        
        // Gunner properties
        isGunner: monsterType === MONSTER_TYPES.GUNNER,
        
        originalSpeed: monsterType.speed
    };
    
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

function updateConsumablesDisplay() {
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
        
        slot.addEventListener('click', () => useConsumable(index));
        consumablesGrid.appendChild(slot);
    });
}

function useConsumable(index) {
    if (gameState !== 'wave') {
        showMessage("Can only use consumables during waves!");
        return;
    }
    
    const consumable = player.consumables[index];
    
    switch(consumable.id) {
        case 'health_potion':
            player.health = Math.min(player.maxHealth, player.health + 20);
            showMessage("Used Health Potion! +20 HP");
            break;
        case 'ammo_pack':
            player.weapons.forEach(weapon => {
                if (weapon.usesAmmo) {
                    weapon.currentAmmo = weapon.magazineSize;
                    weapon.isReloading = false;
                }
            });
            showMessage("Used Ammo Pack! All weapons reloaded");
            break;
        case 'explosive_trap':
            activeTraps.push({
                x: player.x,
                y: player.y,
                active: true,
                damage: 100,
                radius: 80,
                startTime: Date.now()
            });
            showMessage("Placed Explosive Trap!");
            break;
    }
    
    // Remove consumed item
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
                    else if (data.id === 'boomerang') tagClass = 'boomerang-tag';
                    else tagClass = 'ranged-tag';
                }
            }
            
            let typeText = '';
            if (shopItem.type === 'weapon') {
                if (data.id === 'shotgun') typeText = 'SHOTGUN';
                else if (data.id === 'laser') typeText = 'ENERGY';
                else if (data.id === 'boomerang') typeText = 'BOOMERANG';
                else if (data.type === 'melee') typeText = data.meleeType.toUpperCase();
                else typeText = 'RANGED';
            } else {
                typeText = data.type === 'consumable' ? 'CONSUMABLE' : 'PERMANENT';
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
        if (data.type === 'consumable') {
            // Add to consumables inventory
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
            showMessage(`Added ${data.name} to consumables!`);
            updateConsumablesDisplay();
        } else {
            // Permanent item
            applyPermanentItemEffect(data);
            showMessage(`Purchased ${data.name}!`);
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
            player.baseDamage += 5;
            break;
        case 'speed_boots':
            player.speed += 2;
            break;
        case 'health_upgrade':
            player.maxHealth += 30;
            player.health += 30;
            break;
        case 'vampire_teeth':
            player.lifeSteal += 0.05;
            break;
        case 'berserker_ring':
            player.berserkerRing = true;
            break;
        case 'ninja_scroll':
            player.dodgeChance += 0.15;
            break;
        case 'alchemist_stone':
            player.goldMultiplier += 0.2;
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
        case 'healing_fountain':
            player.healthRegen += 2;
            break;
        case 'guardian_angel':
            player.guardianAngel = true;
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
    drawBossProjectiles();
    drawMonsterProjectiles();
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
        } else {
            // Default projectile
            ctx.shadowColor = projectile.color;
            ctx.shadowBlur = 15;
            ctx.fillStyle = projectile.color;
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
        
        ctx.restore();
    });
}

function drawMonsterProjectiles() {
    monsterProjectiles.forEach(proj => {
        ctx.save();
        ctx.translate(proj.x, proj.y);
        
        // Draw gunner projectile
        ctx.shadowColor = proj.color;
        ctx.shadowBlur = 15;
        ctx.fillStyle = proj.color;
        ctx.beginPath();
        ctx.arc(0, 0, 5, 0, Math.PI * 2);
        ctx.fill();
        
        // Inner core
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(0, 0, 2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    });
}

function drawBossProjectiles() {
    bossProjectiles.forEach(proj => {
        ctx.save();
        ctx.translate(proj.x, proj.y);
        
        // Draw boss projectile
        ctx.shadowColor = '#ff0000';
        ctx.shadowBlur = 15;
        
        // Outer glow
        ctx.fillStyle = '#ff8888';
        ctx.beginPath();
        ctx.arc(0, 0, proj.radius + 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Inner projectile
        ctx.fillStyle = proj.color;
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.arc(0, 0, proj.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Skull icon for boss projectiles
        ctx.fillStyle = '#000000';
        ctx.shadowBlur = 0;
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('💀', 0, 0);
        
        ctx.restore();
    });
}

function drawBoomerangProjectile(ctx, projectile, currentTime) {
    // Boomerang with spinning animation using PNG
    const rotation = (projectile.rotation || 0) + 0.1;
    projectile.rotation = rotation;
    
    if (boomerangImage.complete && boomerangImage.naturalHeight > 0) {
        // Draw the PNG image
        ctx.save();
        ctx.translate(projectile.x, projectile.y);
        ctx.rotate(rotation);
        ctx.shadowColor = '#8B4513';
        ctx.shadowBlur = 15;
        ctx.drawImage(boomerangImage, -20, -20, 40, 40);
        ctx.restore();
        
        // Draw trail when returning
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
        // Fallback drawing if image not loaded
        ctx.save();
        ctx.translate(projectile.x, projectile.y);
        ctx.rotate(rotation);
        
        ctx.shadowColor = 'rgba(139, 69, 19, 0.5)';
        ctx.shadowBlur = 15;
        
        // Boomerang shape
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
        
        // Edge highlight when returning
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
    
    // Tiny trail
    ctx.shadowBlur = 5;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.beginPath();
    ctx.arc(projectile.x - Math.cos(projectile.angle) * 5, 
            projectile.y - Math.sin(projectile.angle) * 5, 2, 0, Math.PI * 2);
    ctx.fill();
}

function drawLaserProjectile(ctx, projectile, currentTime) {
    // Laser beam with pulsing effect
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
    
    // Inner core
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(projectile.x - Math.cos(projectile.angle) * 10, 
               projectile.y - Math.sin(projectile.angle) * 10);
    ctx.lineTo(projectile.x, projectile.y);
    ctx.stroke();
    
    // Glow
    ctx.fillStyle = 'rgba(0, 255, 255, 0.3)';
    ctx.shadowBlur = 30;
    ctx.beginPath();
    ctx.arc(projectile.x, projectile.y, 6, 0, Math.PI * 2);
    ctx.fill();
}

function drawMachinegunProjectile(ctx, projectile, currentTime) {
    // Fast bullet with trail
    ctx.shadowColor = '#FFD700';
    ctx.shadowBlur = 15;
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(projectile.x, projectile.y, 3, 0, Math.PI * 2);
    ctx.fill();
    
    // Trail
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
            default:
                // Default fallback
                drawDefaultMelee(ctx, attack, angle, progress, distance, alpha);
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
    updateMonsterProjectiles(currentTime);
    updateBossProjectiles(currentTime);
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
        
        // Move projectile
        proj.x += proj.vx;
        proj.y += proj.vy;
        
        // Check lifetime
        if (currentTime - proj.startTime > proj.lifetime) {
            monsterProjectiles.splice(i, 1);
            continue;
        }
        
        // Check collision with player
        const dx = player.x - proj.x;
        const dy = player.y - proj.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < player.radius + proj.radius) {
            let damage = proj.damage;
            
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
        
        // Remove if off screen
        if (proj.x < -50 || proj.x > canvas.width + 50 || 
            proj.y < -50 || proj.y > canvas.height + 50) {
            monsterProjectiles.splice(i, 1);
        }
    }
}

function updateBossProjectiles(currentTime) {
    for (let i = bossProjectiles.length - 1; i >= 0; i--) {
        const proj = bossProjectiles[i];
        
        // Move projectile
        proj.x += proj.vx;
        proj.y += proj.vy;
        
        // Check lifetime
        if (currentTime - proj.startTime > proj.lifetime) {
            bossProjectiles.splice(i, 1);
            continue;
        }
        
        // Check collision with player
        const dx = player.x - proj.x;
        const dy = player.y - proj.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < player.radius + proj.radius) {
            let damage = proj.damage;
            
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
        
        // Remove if off screen
        if (proj.x < -50 || proj.x > canvas.width + 50 || 
            proj.y < -50 || proj.y > canvas.height + 50) {
            bossProjectiles.splice(i, 1);
        }
    }
}

function shootBossProjectiles(boss) {
    // Shoot projectiles in 4 diagonal directions
    const directions = [
        { angle: Math.PI / 4, vx: 1, vy: 1 },     // Down-right
        { angle: 3 * Math.PI / 4, vx: -1, vy: 1 }, // Down-left
        { angle: 5 * Math.PI / 4, vx: -1, vy: -1 }, // Up-left
        { angle: 7 * Math.PI / 4, vx: 1, vy: -1 }   // Up-right
    ];
    
    directions.forEach(dir => {
        bossProjectiles.push({
            x: boss.x,
            y: boss.y,
            vx: dir.vx * MONSTER_TYPES.BOSS.projectileSpeed,
            vy: dir.vy * MONSTER_TYPES.BOSS.projectileSpeed,
            damage: MONSTER_TYPES.BOSS.projectileDamage,
            radius: 8,
            color: '#ff4444',
            startTime: Date.now(),
            lifetime: 3000
        });
    });
}

// ============================================
// FIXED: UPDATED PROJECTILES FUNCTION - Boomerang now uses SAME damage system as other weapons
// ============================================

function updateProjectiles() {
    const currentTime = Date.now();
    
    for (let i = player.projectiles.length - 1; i >= 0; i--) {
        const projectile = player.projectiles[i];
        
        // Store start position for distance calculation
        if (!projectile.startX) {
            projectile.startX = projectile.x;
            projectile.startY = projectile.y;
            projectile.startTime = currentTime;
        }
        
        if (projectile.isBoomerang) {
            // Boomerang specific movement
            if (projectile.state === 'outgoing') {
                projectile.x += Math.cos(projectile.angle) * projectile.speed;
                projectile.y += Math.sin(projectile.angle) * projectile.speed;
                
                const dx = projectile.x - projectile.startX;
                const dy = projectile.y - projectile.startY;
                projectile.distanceTraveled = Math.sqrt(dx * dx + dy * dy);
                
                // Switch to returning state after reaching max distance
                if (projectile.distanceTraveled >= projectile.range / 2) {
                    projectile.state = 'returning';
                }
            } else {
                // Return to player
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
            
            // Increment rotation for spinning effect
            projectile.rotation = (projectile.rotation || 0) + 0.2;
        } else {
            // Regular projectile movement - NO HOMING, just straight line
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
        
        // Handle bouncing for energy gun
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
        
        // Check collision with monsters - SAME FOR ALL PROJECTILES
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
                
                // Track hits for boomerang (but DON'T prevent death detection)
                if (projectile.isBoomerang) {
                    if (!projectile.targetsHit.includes(monster)) {
                        projectile.targetsHit.push(monster);
                    }
                }
                
                // Remove projectile if it's not a boomerang or if boomerang has hit max targets
                if (!projectile.isBoomerang) {
                    if (!projectile.bounceCount || !projectile.targetsHit) {
                        player.projectiles.splice(i, 1);
                    } else {
                        if (!projectile.targetsHit.includes(monster)) {
                            projectile.targetsHit.push(monster);
                        }
                    }
                } else if (projectile.isBoomerang && projectile.targetsHit.length >= projectile.maxTargets) {
                    // Remove boomerang if it's hit max targets
                    player.projectiles.splice(i, 1);
                    break;
                }
                
                // FIXED: Check if monster health is <= 0 and remove it - WITH AOE EXPLOSION THAT DAMAGES OTHER MONSTERS
                if (monster.health <= 0) {
                    // Explosive monster death explosion - AOE damages player AND other monsters
                    if (monster.monsterType && monster.monsterType.explosive) {
                        const explosionRadius = MONSTER_TYPES.EXPLOSIVE.explosionRadius;
                        const explosionDamage = monster.damage * MONSTER_TYPES.EXPLOSIVE.explosionDamage;
                        
                        // Damage player if within range
                        const dxToPlayer = player.x - monster.x;
                        const dyToPlayer = player.y - monster.y;
                        const distanceToPlayer = Math.sqrt(dxToPlayer * dxToPlayer + dyToPlayer * dyToPlayer);
                        
                        if (distanceToPlayer < explosionRadius + player.radius) {
                            player.health -= explosionDamage;
                            createDamageIndicator(player.x, player.y, Math.floor(explosionDamage), true);
                            
                            // Check if player died from explosion
                            if (player.health <= 0) {
                                gameOver();
                            }
                        }
                        
                        // AOE: Damage OTHER monsters within explosion radius
                        for (let k = monsters.length - 1; k >= 0; k--) {
                            const otherMonster = monsters[k];
                            
                            // Skip the exploding monster itself
                            if (otherMonster === monster) continue;
                            
                            const dx = otherMonster.x - monster.x;
                            const dy = otherMonster.y - monster.y;
                            const distance = Math.sqrt(dx * dx + dy * dy);
                            
                            if (distance < explosionRadius + otherMonster.radius) {
                                // Damage other monsters
                                otherMonster.health -= explosionDamage;
                                createDamageIndicator(otherMonster.x, otherMonster.y, Math.floor(explosionDamage), true);
                                
                                // Check if other monster died from explosion
                                if (otherMonster.health <= 0) {
                                    // Don't trigger chain explosions - just remove and give rewards
                                    monsters.splice(k, 1);
                                    kills++;
                                    const goldEarned = Math.floor(10 * (1 + player.goldMultiplier));
                                    gold += goldEarned;
                                    createGoldPopup(otherMonster.x, otherMonster.y, goldEarned);
                                    
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
                        
                        // Visual explosion effects
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
                
                // FIXED: Check if monster health is <= 0 and remove it - WITH AOE EXPLOSION THAT DAMAGES OTHER MONSTERS
                if (monster.health <= 0) {
                    // Explosive monster death explosion - AOE damages player AND other monsters
                    if (monster.monsterType && monster.monsterType.explosive) {
                        const explosionRadius = MONSTER_TYPES.EXPLOSIVE.explosionRadius;
                        const explosionDamage = monster.damage * MONSTER_TYPES.EXPLOSIVE.explosionDamage;
                        
                        // Damage player if within range
                        const dxToPlayer = player.x - monster.x;
                        const dyToPlayer = player.y - monster.y;
                        const distanceToPlayer = Math.sqrt(dxToPlayer * dxToPlayer + dyToPlayer * dyToPlayer);
                        
                        if (distanceToPlayer < explosionRadius + player.radius) {
                            player.health -= explosionDamage;
                            createDamageIndicator(player.x, player.y, Math.floor(explosionDamage), true);
                            
                            // Check if player died from explosion
                            if (player.health <= 0) {
                                gameOver();
                            }
                        }
                        
                        // AOE: Damage OTHER monsters within explosion radius
                        for (let k = monsters.length - 1; k >= 0; k--) {
                            const otherMonster = monsters[k];
                            
                            // Skip the exploding monster itself
                            if (otherMonster === monster) continue;
                            
                            const dx = otherMonster.x - monster.x;
                            const dy = otherMonster.y - monster.y;
                            const distance = Math.sqrt(dx * dx + dy * dy);
                            
                            if (distance < explosionRadius + otherMonster.radius) {
                                // Damage other monsters
                                otherMonster.health -= explosionDamage;
                                createDamageIndicator(otherMonster.x, otherMonster.y, Math.floor(explosionDamage), true);
                                
                                // Check if other monster died from explosion
                                if (otherMonster.health <= 0) {
                                    // Don't trigger chain explosions - just remove and give rewards
                                    monsters.splice(k, 1);
                                    kills++;
                                    const goldEarned = Math.floor(10 * (1 + player.goldMultiplier));
                                    gold += goldEarned;
                                    createGoldPopup(otherMonster.x, otherMonster.y, goldEarned);
                                    
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
                        
                        // Visual explosion effects
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
        
        const dx = player.x - monster.x;
        const dy = player.y - monster.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 0) {
            monster.x += (dx / distance) * monster.speed;
            monster.y += (dy / distance) * monster.speed;
        }
        
        // Gunner projectile attack
        if (monster.isGunner && currentTime - monster.lastAttack >= monster.attackCooldown) {
            shootGunnerProjectile(monster);
            monster.lastAttack = currentTime;
        }
        
        // Boss projectile attack
        if (monster.isBoss && currentTime - monster.lastAttack >= monster.attackCooldown) {
            shootBossProjectiles(monster);
            monster.lastAttack = currentTime;
        }
        
        if (distance < player.radius + monster.radius) {
            if (currentTime - monster.lastAttack >= monster.attackCooldown) {
                let actualDamage = monster.damage;
                
                if (Math.random() < player.dodgeChance) {
                    showMessage("DODGE!");
                    monster.lastAttack = currentTime;
                    return;
                }
                
                if (player.firstHitReduction) {
                    actualDamage *= 0.5;
                    player.firstHitReduction = false;
                }
                
                if (player.damageReduction > 0) {
                    actualDamage *= (1 - player.damageReduction);
                }
                
                player.health -= actualDamage;
                monster.lastAttack = currentTime;
                
                if (player.thornsDamage > 0) {
                    const thornsDamage = actualDamage * player.thornsDamage;
                    monster.health -= thornsDamage;
                    createDamageIndicator(monster.x, monster.y, Math.floor(thornsDamage), false);
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
                const explosionSize = (effect.radius || 40) * (1 - progress * 0.5);
                const gradient = ctx.createRadialGradient(effect.x, effect.y, 0, effect.x, effect.y, explosionSize);
                gradient.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
                gradient.addColorStop(0.3, `rgba(255, 200, 0, ${alpha})`);
                gradient.addColorStop(0.6, `rgba(255, 100, 0, ${alpha * 0.7})`);
                gradient.addColorStop(1, `rgba(255, 0, 0, 0)`);
                
                ctx.fillStyle = gradient;
                ctx.shadowColor = '#FF4500';
                ctx.shadowBlur = 30;
                ctx.beginPath();
                ctx.arc(effect.x, effect.y, explosionSize, 0, Math.PI * 2);
                ctx.fill();
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
        
        // FIXED: Health bar - ensure it never goes below 0
        const healthPercent = Math.max(0, Math.min(1, monster.health / monster.maxHealth));
        const barWidth = monster.radius * 2;
        const barHeight = 4;
        const barX = -monster.radius;
        const barY = -monster.radius - 10;
        
        // Background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(barX, barY, barWidth, barHeight);
        
        // Health fill - only draw if health > 0
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
    }
    
    .consumable-slot:hover {
        transform: translateY(-2px);
        border-color: #ffd700;
        box-shadow: 0 5px 15px rgba(255, 215, 0, 0.3);
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
`;
document.head.appendChild(style);

// Start game loop
gameLoop();
