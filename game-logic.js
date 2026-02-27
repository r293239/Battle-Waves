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
    MINION: {
        name: 'Minion',
        color: '#9370db',
        speed: 1.5,
        healthMultiplier: 0.2,
        damageMultiplier: 0.4,
        sizeMultiplier: 0.5,
        icon: '👾',
        isMinion: true
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
        projectileCooldown: 2000
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
        range: 200,
        description: 'Dashing scythe slash with lifesteal',
        swingColor: '#4B0082',
        swingAngle: 270,
        animation: 'scytheSwing',
        trailColor: '#9400D3',
        bladeColor: '#4B0082',
        handleColor: '#2F4F4F',
        edgeColor: '#FF00FF',
        sparkleColor: '#FF69B4',
        dashRange: 300,
        lifeSteal: 0.15
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
    bossDashTarget: null,
    bossDashStart: 0,
    bossDashCooldown: 0,
    minionSpawnTimer: 0
};
let asteroidTimer = null;
let minionSpawnInterval = null;

// Player movement keys
let keys = {
    w: false,
    a: false,
    s: false,
    d: false,
    up: false,
    down: false,
    left: false,
    right: false
};

// UI Movement Buttons
let movementButtons = {
    up: false,
    down: false,
    left: false,
    right: false
};

// Save game state to localStorage
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
            baseDamage: player.baseDamage,
            speed: player.speed,
            baseSpeed: player.baseSpeed,
            lifeSteal: player.lifeSteal,
            criticalChance: player.criticalChance,
            goldMultiplier: player.goldMultiplier,
            healthRegen: player.healthRegen,
            damageReduction: player.damageReduction,
            dodgeChance: player.dodgeChance,
            thornsDamage: player.thornsDamage,
            attackSpeedMultiplier: player.attackSpeedMultiplier,
            firstHitReduction: player.firstHitReduction,
            guardianAngel: player.guardianAngel,
            guardianAngelUsed: player.guardianAngelUsed,
            bloodContract: player.bloodContract,
            berserkerRing: player.berserkerRing,
            sharpeningStone: player.sharpeningStone,
            sharpeningStoneWave: player.sharpeningStoneWave,
            enchantersInk: player.enchantersInk,
            consumables: player.consumables
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
    showMessage('Game saved!');
}

// Load game state from localStorage
function loadGame() {
    const saved = localStorage.getItem('gameSave');
    if (!saved) {
        showMessage('No saved game found!');
        return false;
    }
    
    try {
        const gameData = JSON.parse(saved);
        
        // Restore game state
        wave = gameData.wave;
        gold = gameData.gold;
        kills = gameData.kills;
        gameState = gameData.gameState;
        waveActive = gameData.waveActive;
        refreshCount = gameData.refreshCount || 0;
        refreshCost = gameData.refreshCost || 5;
        
        // Restore player
        Object.assign(player, gameData.player);
        
        // Restore weapons
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
        
        // Restore shop items
        shopItems = gameData.shopItems || [];
        
        // Clear any existing blood contract interval
        if (player.bloodContract) {
            if (player.bloodContractInterval) {
                clearInterval(player.bloodContractInterval);
            }
            
            // Restart blood contract drain
            player.bloodContractInterval = setInterval(() => {
                if (gameState === 'wave') {
                    if (player.health > 1) {
                        player.health -= 1;
                    } else {
                        player.health = 1;
                    }
                    updateUI();
                    createDamageIndicator(player.x, player.y, 1, false);
                }
            }, 1000);
        }
        
        // Update UI
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
        
        showMessage('Game loaded!');
        return true;
    } catch (e) {
        console.error('Failed to load game:', e);
        showMessage('Failed to load save file!');
        return false;
    }
}

// Clear saved game
function clearSave() {
    localStorage.removeItem('gameSave');
    showMessage('Save file cleared!');
}

// Check for existing save on startup
function checkForSave() {
    const saved = localStorage.getItem('gameSave');
    if (saved) {
        // Add continue button to start screen
        const continueBtn = document.createElement('button');
        continueBtn.id = 'continueGameBtn';
        continueBtn.textContent = 'Continue Game';
        continueBtn.style.marginTop = '10px';
        continueBtn.style.background = 'linear-gradient(45deg, #4CAF50, #45a049)';
        
        continueBtn.addEventListener('click', () => {
            loadGame();
            startScreen.style.display = 'none';
        });
        
        // Check if button already exists
        if (!document.getElementById('continueGameBtn')) {
            startScreen.appendChild(continueBtn);
        }
    }
}

// Game Objects
const player = {
    x: 400,
    y: 300,
    radius: 20,
    health: 20,
    maxHealth: 20,
    baseDamage: 5,
    speed: 3,
    baseSpeed: 3, // Store base speed for slow field effect
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
    bloodContractInterval: null, // For tracking the drain interval
    lastBloodDamage: 0,
    
    // Slow field effect
    inSlowField: false,
    slowFieldTicks: 0,
    lastSlowFieldTick: 0
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
const consumablesGrid = document.getElementById('consumablesGrid');

// UI Elements
const healthValue = document.getElementById('healthValue');
const damageValue = document.getElementById('damageValue');
const speedValue = document.getElementById('speedValue');
const goldValue = document.getElementById('goldValue');
const waveValue = document.getElementById('waveValue');
const killsValue = document.getElementById('killsValue');
const healthFill = document.getElementById('healthFill');

// Load boomerang image
const boomerangImage = new Image();
boomerangImage.src = 'assets/boomerang.png';

// ============================================
// UI MOVEMENT BUTTONS
// ============================================

function createMovementButtons() {
    const container = document.createElement('div');
    container.className = 'movement-buttons';
    container.innerHTML = `
        <div class="movement-row">
            <button class="move-btn" id="move-up">⬆️</button>
        </div>
        <div class="movement-row">
            <button class="move-btn" id="move-left">⬅️</button>
            <button class="move-btn" id="move-down">⬇️</button>
            <button class="move-btn" id="move-right">➡️</button>
        </div>
    `;
    
    document.body.appendChild(container);
    
    // Add event listeners
    document.getElementById('move-up').addEventListener('mousedown', () => { movementButtons.up = true; });
    document.getElementById('move-up').addEventListener('mouseup', () => { movementButtons.up = false; });
    document.getElementById('move-up').addEventListener('mouseleave', () => { movementButtons.up = false; });
    
    document.getElementById('move-down').addEventListener('mousedown', () => { movementButtons.down = true; });
    document.getElementById('move-down').addEventListener('mouseup', () => { movementButtons.down = false; });
    document.getElementById('move-down').addEventListener('mouseleave', () => { movementButtons.down = false; });
    
    document.getElementById('move-left').addEventListener('mousedown', () => { movementButtons.left = true; });
    document.getElementById('move-left').addEventListener('mouseup', () => { movementButtons.left = false; });
    document.getElementById('move-left').addEventListener('mouseleave', () => { movementButtons.left = false; });
    
    document.getElementById('move-right').addEventListener('mousedown', () => { movementButtons.right = true; });
    document.getElementById('move-right').addEventListener('mouseup', () => { movementButtons.right = false; });
    document.getElementById('move-right').addEventListener('mouseleave', () => { movementButtons.right = false; });
    
    // Touch support for mobile
    document.getElementById('move-up').addEventListener('touchstart', (e) => { e.preventDefault(); movementButtons.up = true; });
    document.getElementById('move-up').addEventListener('touchend', (e) => { e.preventDefault(); movementButtons.up = false; });
    
    document.getElementById('move-down').addEventListener('touchstart', (e) => { e.preventDefault(); movementButtons.down = true; });
    document.getElementById('move-down').addEventListener('touchend', (e) => { e.preventDefault(); movementButtons.down = false; });
    
    document.getElementById('move-left').addEventListener('touchstart', (e) => { e.preventDefault(); movementButtons.left = true; });
    document.getElementById('move-left').addEventListener('touchend', (e) => { e.preventDefault(); movementButtons.left = false; });
    
    document.getElementById('move-right').addEventListener('touchstart', (e) => { e.preventDefault(); movementButtons.right = true; });
    document.getElementById('move-right').addEventListener('touchend', (e) => { e.preventDefault(); movementButtons.right = false; });
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
            isBoss: (waveNumber % 10 === 0),
            minions: (waveNumber % 10 === 0) ? 8 : 0,
            spawnDelay: Math.max(50, 200 - extraWaves * 5)
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
    // Clear any existing blood contract interval
    if (player.bloodContractInterval) {
        clearInterval(player.bloodContractInterval);
        player.bloodContractInterval = null;
    }
    
    // Clear any existing minion spawn interval
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
        baseDamage: GAME_DATA.PLAYER_START.damage,
        speed: GAME_DATA.PLAYER_START.speed,
        baseSpeed: GAME_DATA.PLAYER_START.speed,
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
        bloodContractInterval: null,
        lastBloodDamage: 0,
        
        // Slow field effect
        inSlowField: false,
        slowFieldTicks: 0,
        lastSlowFieldTick: 0
    });
    
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
    
    // Reset effect arrays
    groundFire = [];
    poisonClouds = [];
    voidZones = [];
    activeTraps = [];
    bossProjectiles = [];
    monsterProjectiles = [];
    bossAbilities.asteroids = [];
    bossAbilities.slowField = null;
    bossAbilities.enraged = false;
    bossAbilities.bossWeapon = null;
    bossAbilities.bossWeaponAttack = 0;
    bossAbilities.bossDash = false;
    bossAbilities.bossDashTarget = null;
    bossAbilities.bossDashStart = 0;
    bossAbilities.bossDashCooldown = 0;
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
        totalMonsters = 1; // Boss only gets one indicator at center
        if (waveConfig.minions) {
            totalMonsters += waveConfig.minions; // Add minion indicators
        }
    }
    
    for (let i = 0; i < totalMonsters; i++) {
        let x, y;
        
        if (waveConfig.isBoss && i === 0) {
            // Boss indicator at center
            x = canvas.width / 2;
            y = canvas.height / 2;
        } else {
            // Minion or regular monster indicators around the edges
            const side = Math.floor(Math.random() * 4);
            switch(side) {
                case 0: x = 30 + Math.random() * 100; y = Math.random() * (canvas.height - 60) + 30; break; // Left edge
                case 1: x = canvas.width - 30 - Math.random() * 100; y = Math.random() * (canvas.height - 60) + 30; break; // Right edge
                case 2: x = Math.random() * (canvas.width - 60) + 30; y = 30 + Math.random() * 100; break; // Top edge
                case 3: x = Math.random() * (canvas.width - 60) + 30; y = canvas.height - 30 - Math.random() * 100; break; // Bottom edge
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
        // Spawn minions in a circle around the boss
        const angle = (i / count) * Math.PI * 2;
        const distance = 80 + Math.random() * 60;
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;
        
        const minion = createMonster(MONSTER_TYPES.MINION, false, x, y);
        if (minion) {
            minion.isMinion = true;
            minion.health = minion.maxHealth * 0.5; // Make minions weaker
            monsters.push(minion);
        }
    }
}

// Continuous minion spawning for boss waves
function startMinionSpawning(boss) {
    if (minionSpawnInterval) {
        clearInterval(minionSpawnInterval);
    }
    
    // Spawn minions every 5 seconds during boss fights
    minionSpawnInterval = setInterval(() => {
        if (waveActive && boss && boss.health > 0) {
            const minionCount = 3 + Math.floor(Math.random() * 3); // 3-5 minions
            spawnMinions(minionCount, boss.x, boss.y);
            showMessage("Minions spawned!");
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
    
    // Reset player slow field effects
    player.inSlowField = false;
    player.slowFieldTicks = 0;
    player.speed = player.baseSpeed;
    
    // Reset boss abilities
    bossAbilities.asteroids = [];
    bossAbilities.slowField = null;
    bossAbilities.enraged = false;
    bossAbilities.bossWeapon = null;
    bossAbilities.bossWeaponAttack = 0;
    bossAbilities.bossDash = false;
    bossAbilities.bossDashTarget = null;
    bossAbilities.bossDashStart = 0;
    bossAbilities.bossDashCooldown = 0;
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
    
    // Simple boss text
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
    
    // Clear all arrays
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
    
    // Show spawn indicators
    showSpawnIndicators();
    
    // Spawn monsters after a short delay
    setTimeout(() => {
        const monsterCount = waveConfig.monsters;
        const spawnDelay = waveConfig.spawnDelay || 200;
        
        if (waveConfig.isBoss) {
            // Boss spawns at center
            const boss = createMonster(MONSTER_TYPES.BOSS, true, canvas.width / 2, canvas.height / 2);
            if (boss) {
                boss.lifeSteal = 0.1; // Add life steal to boss
                boss.maxHealth = waveConfig.monsterHealth * 15;
                boss.health = boss.maxHealth;
                
                // Assign boss weapon based on wave
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
                
                // Start continuous minion spawning for boss
                startMinionSpawning(boss);
                
                // Add dramatic spawn effect for boss
                addVisualEffect({
                    type: 'bossSpawn',
                    x: boss.x,
                    y: boss.y,
                    radius: 100,
                    startTime: Date.now(),
                    duration: 800,
                    color: boss.color
                });
                
                // Spawn initial minions
                if (waveConfig.minions > 0) {
                    spawnMinions(waveConfig.minions, boss.x, boss.y);
                }
                
                // Set up boss abilities based on wave
                if (wave === 10) {
                    bossAbilities.shotgun = true;
                } else if (wave === 20) {
                    // Asteroid ability - 5 at a time
                    asteroidTimer = setInterval(() => {
                        if (waveActive && monsters.some(m => m.isBoss)) {
                            // Spawn 5 asteroids at once around the boss
                            for (let i = 0; i < 5; i++) {
                                setTimeout(() => {
                                    if (waveActive) spawnAsteroid();
                                }, i * 200);
                            }
                        }
                    }, 4000); // Every 4 seconds
                } else if (wave === 30) {
                    // Slow field that follows the boss
                    bossAbilities.slowField = {
                        active: true,
                        radius: 200,
                        lastDamage: 0
                    };
                }
            }
            spawnIndicators = [];
        } else {
            // Staggered spawning for regular monsters
            let spawnedCount = 0;
            
            for (let i = 0; i < monsterCount; i++) {
                setTimeout(() => {
                    if (gameState === 'wave') {
                        let monsterType;
                        const rand = Math.random();
                        
                        // Determine monster type based on wave
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
                            if (rand < 0.2) monsterType = MONSTER_TYPES.NORMAL;
                            else if (rand < 0.35) monsterType = MONSTER_TYPES.FAST;
                            else if (rand < 0.5) monsterType = MONSTER_TYPES.TANK;
                            else if (rand < 0.65) monsterType = MONSTER_TYPES.EXPLOSIVE;
                            else if (rand < 0.8) monsterType = MONSTER_TYPES.GUNNER;
                            else monsterType = MONSTER_TYPES.MINION;
                        }
                        
                        // Use indicator position if available
                        if (spawnIndicators.length > i) {
                            const indicator = spawnIndicators[i];
                            const monster = createMonster(monsterType, false, indicator.x, indicator.y);
                            if (monster) {
                                monsters.push(monster);
                            }
                        } else {
                            const monster = createMonster(monsterType, false);
                            if (monster) {
                                monsters.push(monster);
                            }
                        }
                        spawnedCount++;
                        
                        // Clear indicators when last monster spawns
                        if (spawnedCount >= monsterCount) {
                            spawnIndicators = [];
                        }
                    }
                }, i * spawnDelay);
            }
        }
    }, 2000); // Wait 2 seconds for indicators to show
    
    setTimeout(() => {
        waveDisplay.style.opacity = 0.5;
    }, 2500);
}

function spawnAsteroid() {
    if (!waveActive) return;
    
    // Find boss position to spawn asteroids around it
    const boss = monsters.find(m => m.isBoss);
    if (!boss) return;
    
    // Random position around the boss
    const angle = Math.random() * Math.PI * 2;
    const distance = 150 + Math.random() * 100;
    const x = boss.x + Math.cos(angle) * distance;
    const y = boss.y + Math.sin(angle) * distance;
    const radius = 40;
    
    // Add warning indicator
    addVisualEffect({
        type: 'asteroidWarning',
        x: x,
        y: y,
        radius: radius,
        startTime: Date.now(),
        duration: 800
    });
    
    // Spawn asteroid after warning
    setTimeout(() => {
        if (!waveActive) return;
        
        // Damage players within radius
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
        
        // Damage monsters within radius (but not the boss)
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
                    gold += 5;
                }
            }
        }
        
        // Visual effect
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
        // Random edge spawn
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
        lifeSteal: monsterType.lifeSteal || 0,
        
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
        
        originalSpeed: (isBoss ? 0.7 : (1 + wave * 0.05)) * monsterType.speed
    };
    
    // Add spawn effect
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
            player.baseSpeed += 2;
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
        case 'blood_contract':
            // Blood Contract logic
            player.bloodContract = true;
            player.lifeSteal += 0.03; // +3% lifesteal
            player.healthRegen = 0; // Reset health regen
            
            // Clear any existing interval
            if (player.bloodContractInterval) {
                clearInterval(player.bloodContractInterval);
            }
            
            // Start health drain (every second) - ONLY DURING WAVES
            player.bloodContractInterval = setInterval(() => {
                // Only take damage during wave state
                if (gameState === 'wave') {
                    if (player.health > 1) {
                        player.health -= 1;
                    } else {
                        // Keep at 1 HP to prevent death from item
                        player.health = 1;
                    }
                    
                    // Update UI
                    updateUI();
                    
                    // Visual feedback
                    createDamageIndicator(player.x, player.y, 1, false);
                }
            }, 1000);
            
            showMessage("Blood Contract activated! +3% lifesteal, but -1 HP per second during waves");
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
        player.baseSpeed += buff.effect.speed;
        // Apply current slow field effect if active
        if (!player.inSlowField) {
            player.speed += buff.effect.speed;
        }
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
    waveActive = false;
    
    // Reset player slow field effects
    player.inSlowField = false;
    player.slowFieldTicks = 0;
    player.speed = player.baseSpeed;
    
    // Clear boss abilities
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
    bossAbilities.bossDashTarget = null;
    bossAbilities.bossDashStart = 0;
    
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
    waveActive = false;
    
    // Reset player slow field effects
    player.inSlowField = false;
    player.slowFieldTicks = 0;
    player.speed = player.baseSpeed;
    
    // Clear boss abilities
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
    bossAbilities.bossDashTarget = null;
    bossAbilities.bossDashStart = 0;
    
    // Clear blood contract interval
    if (player.bloodContractInterval) {
        clearInterval(player.bloodContractInterval);
        player.bloodContractInterval = null;
    }
    
    // Clear save file on death
    clearSave();
    
    // Guardian angel check
    if (player.guardianAngel && !player.guardianAngelUsed) {
        player.guardianAngelUsed = true;
        player.health = player.maxHealth * 0.5;
        gameState = 'wave';
        waveActive = true;
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
    
    // Handle keyboard movement
    if (gameState === 'wave') {
        let moveX = 0;
        let moveY = 0;
        
        // Keyboard input
        if (keys.w || keys.up) moveY -= 1;
        if (keys.s || keys.down) moveY += 1;
        if (keys.a || keys.left) moveX -= 1;
        if (keys.d || keys.right) moveX += 1;
        
        // UI button input
        if (movementButtons.up) moveY -= 1;
        if (movementButtons.down) moveY += 1;
        if (movementButtons.left) moveX -= 1;
        if (movementButtons.right) moveX += 1;
        
        if (moveX !== 0 || moveY !== 0) {
            const length = Math.sqrt(moveX * moveX + moveY * moveY);
            moveX = moveX / length * player.speed;
            moveY = moveY / length * player.speed;
            
            player.x += moveX;
            player.y += moveY;
            
            // Keep player in bounds
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
        
        // Animate the indicator
        const pulseScale = 1 + Math.sin(progress * Math.PI * 4) * 0.2;
        const alpha = 1 - progress * 0.5;
        
        ctx.save();
        ctx.translate(indicator.x, indicator.y);
        
        if (indicator.isBoss) {
            ctx.strokeStyle = `rgba(255, 215, 0, ${alpha})`;
            ctx.lineWidth = 4;
            ctx.shadowColor = '#ffd700';
            ctx.shadowBlur = 20 * alpha;
            
            // Rotating rings
            ctx.rotate(elapsed * 0.002);
            
            // Outer ring
            ctx.beginPath();
            ctx.arc(0, 0, 40 * pulseScale, 0, Math.PI * 2);
            ctx.stroke();
            
            // Inner ring
            ctx.beginPath();
            ctx.arc(0, 0, 25, 0, Math.PI * 2);
            ctx.stroke();
            
            // Cross
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
            
            // Pulsing circle
            ctx.beginPath();
            ctx.arc(0, 0, 20 * pulseScale, 0, Math.PI * 2);
            ctx.stroke();
            
            // Small x
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
            
            // Pulsing circle
            ctx.beginPath();
            ctx.arc(0, 0, 25 * pulseScale, 0, Math.PI * 2);
            ctx.stroke();
            
            // X marker
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
        // Find the boss to get its position
        const boss = monsters.find(m => m.isBoss && wave === 30);
        if (!boss) return;
        
        const alpha = 0.3;
        
        ctx.save();
        ctx.translate(boss.x, boss.y);
        
        // Pulsing slow field
        const pulse = Math.sin(Date.now() * 0.005) * 0.1 + 0.9;
        
        ctx.fillStyle = `rgba(100, 100, 255, ${alpha})`;
        ctx.shadowColor = '#6464ff';
        ctx.shadowBlur = 30;
        ctx.beginPath();
        ctx.arc(0, 0, bossAbilities.slowField.radius * pulse, 0, Math.PI * 2);
        ctx.fill();
        
        // Inner ring
        ctx.strokeStyle = `rgba(200, 200, 255, ${alpha})`;
        ctx.lineWidth = 3;
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.arc(0, 0, bossAbilities.slowField.radius * 0.7, 0, Math.PI * 2);
        ctx.stroke();
        
        // Slow field text
        ctx.fillStyle = 'white';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.shadowColor = '#6464ff';
        ctx.shadowBlur = 15;
        ctx.fillText('SLOW FIELD', 0, -bossAbilities.slowField.radius - 20);
        
        // Show permanent speed decrease ticks
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
    const currentTime = Date.now();
    
    bossProjectiles.forEach(proj => {
        const age = currentTime - proj.startTime;
        const alpha = Math.min(1, 1 - age / proj.lifetime);
        
        ctx.save();
        ctx.translate(proj.x, proj.y);
        
        // Draw boss projectile
        ctx.shadowColor = proj.color;
        ctx.shadowBlur = 15 * alpha;
        
        // Outer glow
        ctx.fillStyle = proj.color;
        ctx.globalAlpha = alpha * 0.7;
        ctx.beginPath();
        ctx.arc(0, 0, proj.radius + 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Inner projectile
        ctx.fillStyle = '#FFFFFF';
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(0, 0, proj.radius, 0, Math.PI * 2);
        ctx.fill();
        
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
    
    // Draw boss weapon based on wave
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
    
    // Handle
    ctx.save();
    ctx.fillStyle = '#2F4F4F';
    ctx.fillRect(-5, -attack.radius * 0.8, 10, attack.radius * 1.6);
    ctx.restore();
    
    // Blade
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
    
    // Edge
    ctx.strokeStyle = `rgba(255, 105, 180, ${alpha})`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(80, -25);
    ctx.lineTo(80, -5);
    ctx.stroke();
    ctx.restore();
    
    // Trail
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
    
    // Dash effect
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
    
    // Blood contract visual effect
    if (player.bloodContract) {
        ctx.shadowColor = '#8B0000';
        ctx.shadowBlur = 20;
        ctx.strokeStyle = '#8B0000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, player.radius + 5 + Math.sin(Date.now() * 0.005) * 2, 0, Math.PI * 2);
        ctx.stroke();
    }
    
    // Slow field effect indicator
    if (player.inSlowField) {
        ctx.shadowColor = '#6464ff';
        ctx.shadowBlur = 15;
        ctx.strokeStyle = '#6464ff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, player.radius + 8 + Math.sin(Date.now() * 0.01) * 3, 0, Math.PI * 2);
        ctx.stroke();
        
        // Show speed decrease
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
    
    // Apply slow field effect (Wave 30 boss)
    if (bossAbilities.slowField && bossAbilities.slowField.active) {
        const boss = monsters.find(m => m.isBoss && wave === 30);
        if (boss) {
            const dx = player.x - boss.x;
            const dy = player.y - boss.y;
            const distToField = Math.sqrt(dx * dx + dy * dy);
            
            const wasInSlowField = player.inSlowField;
            player.inSlowField = distToField < bossAbilities.slowField.radius;
            
            if (player.inSlowField) {
                // Apply 50% slow
                player.speed = player.baseSpeed * 0.5;
                
                // Every second, permanently decrease speed by 1
                if (currentTime - player.lastSlowFieldTick >= 1000) {
                    player.baseSpeed = Math.max(1, player.baseSpeed - 1);
                    player.speed = player.baseSpeed * 0.5; // Reapply 50% slow
                    player.slowFieldTicks++;
                    player.lastSlowFieldTick = currentTime;
                    
                    // Visual feedback
                    createDamageIndicator(player.x, player.y, 1, false);
                    showMessage("Speed decreased by 1!");
                }
            } else if (wasInSlowField) {
                // Exited slow field - restore normal speed
                player.speed = player.baseSpeed;
            }
        }
    }
    
    // Check for boss enrage (wave 20 boss at half health)
    if (wave === 20 && !bossAbilities.enraged) {
        const boss = monsters.find(m => m.isBoss);
        if (boss && boss.health <= boss.maxHealth / 2) {
            bossAbilities.enraged = true;
            boss.attackCooldown = 800; // Reduced cooldown
            boss.color = '#ff4444'; // Red enraged color
            boss.speed = boss.originalSpeed * 1.3; // Move faster when enraged
            showMessage("BOSS ENRAGED - ATTACK SPEED AND MOVEMENT INCREASED!");
        }
    }
    
    // Boss dash for wave 30 scythe boss
    if (wave === 30 && bossAbilities.bossWeapon) {
        const boss = monsters.find(m => m.isBoss);
        if (boss && !bossAbilities.bossDash && currentTime - bossAbilities.bossDashCooldown > 3000) {
            // Start dash every 3 seconds
            bossAbilities.bossDash = true;
            bossAbilities.bossDashTarget = { x: player.x, y: player.y };
            bossAbilities.bossDashStart = currentTime;
            
            // Dash duration
            setTimeout(() => {
                bossAbilities.bossDash = false;
                bossAbilities.bossDashTarget = null;
                bossAbilities.bossDashCooldown = currentTime;
            }, 500);
        }
        
        if (bossAbilities.bossDash && bossAbilities.bossDashTarget) {
            // Move boss towards dash target
            const dx = bossAbilities.bossDashTarget.x - boss.x;
            const dy = bossAbilities.bossDashTarget.y - boss.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist > 5) {
                boss.x += (dx / dist) * boss.speed * 3; // 3x speed during dash
                boss.y += (dy / dist) * boss.speed * 3;
            }
            
            // Perform scythe attack during dash
            if (!bossAbilities.bossWeaponAttack) {
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
                
                // Apply life steal if attack hits
                if (dist < BOSS_WEAPONS.SCYTHE.range) {
                    const healAmount = BOSS_WEAPONS.SCYTHE.baseDamage * BOSS_WEAPONS.SCYTHE.lifeSteal;
                    boss.health = Math.min(boss.maxHealth, boss.health + healAmount);
                    createHealthPopup(boss.x, boss.y, Math.floor(healAmount));
                }
            }
        }
    }
    
    // Boss melee attacks for wave 10 and 20
    if (bossAbilities.bossWeapon && wave !== 30) {
        const boss = monsters.find(m => m.isBoss);
        if (boss) {
            const distanceToPlayer = Math.sqrt(
                Math.pow(player.x - boss.x, 2) + Math.pow(player.y - boss.y, 2)
            );
            
            // Attack when in range
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
    
    // Health regen
    if (player.healthRegen > 0 && currentTime - player.lastRegen >= 1000) {
        player.health = Math.min(player.maxHealth, player.health + player.healthRegen);
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
    
    // Wave completion check
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
    const currentTime = Date.now();
    
    if (wave === 10) {
        // Shotgun blast for wave 10 boss
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
        // Spread shot for later bosses
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
        // Default 4-way spread for other bosses
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
                
                // Boss life steal
                if (monster.isBoss && monster.lifeSteal) {
                    const bossHeal = damage * monster.lifeSteal;
                    monster.health = Math.min(monster.maxHealth, monster.health + bossHeal);
                    createHealthPopup(monster.x, monster.y, Math.floor(bossHeal));
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
                
                // Check if monster health is <= 0 and remove it
                if (monster.health <= 0) {
                    // Explosive monster death explosion
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
                
                // Boss life steal
                if (monster.isBoss && monster.lifeSteal) {
                    const bossHeal = damage * monster.lifeSteal;
                    monster.health = Math.min(monster.maxHealth, monster.health + bossHeal);
                    createHealthPopup(monster.x, monster.y, Math.floor(bossHeal));
                }
                
                hits++;
                
                if (attack.meleeType === 'pierce' && hits >= attack.pierceCount) {
                    break;
                }
                
                if (monster.health <= 0) {
                    // Explosive monster death explosion
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
        
        // Boss projectile attack (additional ability, doesn't replace physical attacks)
        if (monster.isBoss && currentTime - monster.lastAttack >= monster.attackCooldown) {
            shootBossProjectiles(monster);
            monster.lastAttack = currentTime;
        }
        
        // Physical attack when touching player
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
        
        // Health bar
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

// Keyboard controls
document.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    
    // Movement keys
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
    
    // Space bar for next wave
    if (key === ' ') {
        if (gameState === 'shop' && nextWaveBtn.style.display !== 'none') {
            nextWaveBtn.click();
        }
        e.preventDefault();
    }
    
    // R key for reload
    if (key === 'r') {
        if (gameState === 'shop') {
            player.weapons.forEach(weapon => {
                if (weapon.usesAmmo && !weapon.isReloading) {
                    weapon.startReload();
                }
            });
        }
        e.preventDefault();
    }
    
    // S key for save
    if (key === 's' && e.ctrlKey) {
        e.preventDefault();
        saveGame();
    }
    
    // L key for load
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
});

// Mouse movement
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
    clearSave(); // Clear save file on restart
    initGame();
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

    .movement-buttons {
        position: fixed;
        bottom: 20px;
        left: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 5px;
        z-index: 100;
    }

    .movement-row {
        display: flex;
        gap: 10px;
        justify-content: center;
    }

    .move-btn {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.2);
        border: 2px solid rgba(255, 255, 255, 0.5);
        color: white;
        font-size: 24px;
        cursor: pointer;
        backdrop-filter: blur(5px);
        transition: all 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
    }

    .move-btn:hover {
        background: rgba(255, 255, 255, 0.3);
        transform: scale(1.1);
        border-color: #ffd700;
    }

    .move-btn:active {
        transform: scale(0.95);
        background: rgba(255, 215, 0, 0.3);
    }

    @media (max-width: 768px) {
        .move-btn {
            width: 50px;
            height: 50px;
            font-size: 20px;
        }
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
    }

    #continueGameBtn:hover {
        transform: scale(1.05);
        box-shadow: 0 0 20px rgba(76, 175, 80, 0.5);
    }
`;
document.head.appendChild(style);

// Add control hint
const controlHint = document.createElement('div');
controlHint.className = 'control-hint';
controlHint.innerHTML = 'WASD / Arrow Keys | Click buttons to move | Space: Next Wave | R: Reload | Ctrl+S: Save | Ctrl+L: Load';
document.body.appendChild(controlHint);

// Create movement buttons
createMovementButtons();

// Check for existing save on startup
checkForSave();

// Start game loop
gameLoop();
