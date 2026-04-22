// ============================================
// GAME LOGIC - Main Game File
// Includes: DOM elements, game state, wave management,
// monster updates, drawing functions, event handlers
// ============================================

// Load data files (in HTML, include these in order)
// <script src="game-data.js"></script>
// <script src="combat-system.js"></script>
// <script src="game-logic.js"></script>

// ============================================
// GLOBAL VARIABLES
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
    shotgun: false, asteroids: [], slowField: null, enraged: false,
    bossWeapon: null, bossWeaponAttack: 0, bossDash: false,
    bossDashTarget: { x: 0, y: 0 }, bossDashStart: 0, bossDashCooldown: 0,
    bossDashDirection: { x: 0, y: 0 }, bossDashDistance: 0, minionSpawnTimer: 0,
    voidZones: [], teleportTimer: 0
};

let asteroidTimer = null;
let minionSpawnInterval = null;
let dashers = [];
let splitterTracking = [];

let playerTowers = {
    landmines: { count: 0, max: 5, active: [] },
    healingTowers: { active: [] }
};

let activeBuffs = { rage: { active: false, endTime: 0, originalMultiplier: 1.0 } };
let statsPanelVisible = false;

// Joystick variables
let joystickActive = false, joystickStartX = 0, joystickStartY = 0;
let joystickCurrentX = 0, joystickCurrentY = 0, joystickBaseX = 0, joystickBaseY = 0, joystickMaxDistance = 50;

let messageQueue = [], messageContainer = null;
let touchStartTime = 0, touchMoved = false, lastTouchX = 0, lastTouchY = 0;
let keys = { w: false, a: false, s: false, d: false, up: false, down: false, left: false, right: false, space: false };

// Game Objects
const player = {
    x: 400, y: 300, radius: 20, health: 20, maxHealth: 20,
    damageMultiplier: 1.0, speed: 3, baseSpeed: 3, speedMultiplier: 1.0, color: '#ff6b6b',
    lifeSteal: 0, criticalChance: 0, goldMultiplier: 0, healthRegen: 0, healthRegenPercent: 0,
    damageReduction: 0, lastRegen: 0, weapons: [], projectiles: [], meleeAttacks: [],
    ammoPack: false, dodgeChance: 0, thornsDamage: 0, attackSpeedMultiplier: 1,
    firstHitReduction: false, firstHitActive: false, voidCrystalChance: 0, guardianAngelUsed: false,
    consumables: [], berserkerRing: false, sharpeningStone: false, sharpeningStoneWave: 0,
    enchantersInk: false, guardianAngel: false, bloodContract: false, bloodContractStacks: 0,
    bloodContractInterval: null, lastBloodDamage: 0, inSlowField: false, slowFieldTicks: 0,
    lastSlowFieldTick: 0, facingAngle: 0, lastFacingAngle: 0, reloadSpeedMultiplier: 1.0,
    updateHealthDisplay: null
};

let monsters = [];
let mouseX = 400, mouseY = 300;
let groundFire = [], poisonClouds = [], voidZones = [], activeTraps = [];
let bossProjectiles = [], monsterProjectiles = [], placedBombs = [];

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

const healthValue = document.getElementById('healthValue');
const damageValue = document.getElementById('damageValue');
const speedValue = document.getElementById('speedValue');
const goldValue = document.getElementById('goldValue');
const waveValue = document.getElementById('waveValue');
const killsValue = document.getElementById('killsValue');
const healthFill = document.getElementById('healthFill');

const boomerangImage = new Image();
boomerangImage.src = 'assets/boomerang.png';

const scytheImage = new Image();
scytheImage.src = 'assets/scythe.png';

player.updateHealthDisplay = function() {
    if (healthValue) healthValue.textContent = `${Math.floor(this.health)}/${this.maxHealth}`;
    if (healthFill) healthFill.style.width = `${(this.health / this.maxHealth) * 100}%`;
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
        this.targetingPriority = weaponData.targetingPriority || 'normal';
        this.sniper = weaponData.sniper || false;
        this.knivesUsed = new Map();
        
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
            if (this.tierMultipliers.damage) this.baseDamage = Math.round(this.baseDamage * this.tierMultipliers.damage[this.tier]);
            if (this.tierMultipliers.attackSpeed) this.attackSpeed = this.attackSpeed * this.tierMultipliers.attackSpeed[this.tier];
            if (this.tierMultipliers.range) this.range = Math.round(this.range * this.tierMultipliers.range[this.tier]);
            if (this.usesAmmo && this.tierMultipliers.magazine) {
                this.magazineSize = Math.round(this.magazineSize * this.tierMultipliers.magazine[this.tier]);
                if (!this.isThrowable) this.currentAmmo = this.magazineSize;
            }
            if (this.pelletCount && this.tierMultipliers.pelletCount) this.pelletCount = Math.round(this.pelletCount * this.tierMultipliers.pelletCount[this.tier]);
            if (this.bounceCount && this.tierMultipliers.bounceCount) this.bounceCount = Math.round(this.bounceCount * this.tierMultipliers.bounceCount[this.tier]);
            if (this.maxTargets && this.tierMultipliers.maxTargets) this.maxTargets = Math.round(this.maxTargets * this.tierMultipliers.maxTargets[this.tier]);
            if (this.pierceCount && this.tierMultipliers.pierceCount) this.pierceCount = Math.round(this.pierceCount * this.tierMultipliers.pierceCount[this.tier]);
            if (this.shockwaveIntensity && this.tierMultipliers.shockwaveIntensity) this.shockwaveIntensity = this.shockwaveIntensity * this.tierMultipliers.shockwaveIntensity[this.tier];
        }
    }

    canAttack(currentTime) {
        if (this.isReloading) return false;
        if (this.usesAmmo && this.currentAmmo <= 0) {
            if (!this.isThrowable) this.startReload();
            return false;
        }
        if (this.lastAttackTime > 0 && currentTime - this.lastAttackTime < 5) return false;
        return (currentTime - this.lastAttack) >= (1000 / this.attackSpeed);
    }

    startReload() {
        if (!this.usesAmmo || this.isReloading || this.currentAmmo === this.magazineSize || this.isThrowable) return;
        this.isReloading = true;
        this.reloadStart = Date.now();
        const reloadMultiplier = player.reloadSpeedMultiplier || 1.0;
        const adjustedReloadTime = this.reloadTime / reloadMultiplier;
        if (typeof showReloadIndicator === 'function') showReloadIndicator(this.name);
        setTimeout(() => { this.currentAmmo = this.magazineSize; this.isReloading = false; }, adjustedReloadTime);
    }

    useAmmo() { if (!this.usesAmmo) return; this.currentAmmo--; if (this.currentAmmo <= 0 && !this.isThrowable) this.startReload(); }
    resetAmmo() { if (this.resetEachRound) { this.currentAmmo = this.magazineSize; this.isReloading = false; this.knivesUsed.clear(); } }
    trackKnifeHit(monster) { if (!this.isThrowable) return; this.knivesUsed.set(monster, (this.knivesUsed.get(monster) || 0) + 1); }
    returnKnives(monster) { if (!this.isThrowable) return 0; const hits = this.knivesUsed.get(monster) || 0; if (hits > 0) { this.knivesUsed.delete(monster); this.currentAmmo = Math.min(this.magazineSize, this.currentAmmo + hits); } return hits; }

    attack(playerX, playerY, targetX, targetY) {
        const currentTime = Date.now();
        if (this.usesAmmo && !this.isReloading) this.useAmmo();
        this.lastAttack = currentTime;
        this.lastAttackTime = currentTime;
        const angle = Math.atan2(targetY - playerY, targetX - playerX);
        
        if (this.type === 'ranged') {
            if (this.id === 'shotgun') {
                const attacks = [];
                for (let i = 0; i < this.pelletCount; i++) {
                    const spread = (Math.random() - 0.5) * (this.spreadAngle * Math.PI / 180);
                    attacks.push({ type: 'ranged', x: playerX, y: playerY, angle: angle + spread, speed: this.projectileSpeed, range: this.range, damage: this.baseDamage, color: this.projectileColor, weaponId: this.id, animation: this.animation, isPellet: true, startTime: currentTime, size: 3, weaponRef: this });
                }
                return attacks;
            }
            if (this.id === 'boomerang') {
                return { type: 'ranged', x: playerX, y: playerY, startX: playerX, startY: playerY, angle: angle, speed: this.projectileSpeed, returnSpeed: this.returnSpeed, range: this.range, damage: this.baseDamage, color: this.projectileColor, weaponId: this.id, animation: this.animation, isBoomerang: true, state: 'outgoing', distanceTraveled: 0, targetsHit: [], maxTargets: this.maxTargets, rotation: 0, startTime: currentTime, hitThisFrame: false, size: 4, weaponRef: this };
            }
            if (this.id === 'throwing_knives') {
                return { type: 'ranged', x: playerX, y: playerY, angle: angle + (Math.random() - 0.5) * this.spread, speed: this.projectileSpeed, range: this.range, damage: this.baseDamage, color: this.projectileColor, weaponId: this.id, animation: 'knife', isThrowable: true, startTime: currentTime, size: this.projectileSize || 6, spinSpeed: this.spinSpeed || 0, rotation: 0, weaponRef: this };
            }
            if (this.id === 'sniper') {
                return { type: 'ranged', x: playerX, y: playerY, angle: angle, speed: this.projectileSpeed, range: this.range, damage: this.baseDamage, color: this.projectileColor, weaponId: this.id, animation: 'sniper', startTime: currentTime, size: 6, weaponRef: this, sniper: true };
            }
            if (this.id === 'crossbow') {
                return { type: 'ranged', x: playerX, y: playerY, angle: angle, speed: this.projectileSpeed, range: this.range, damage: this.baseDamage, color: this.projectileColor, weaponId: this.id, animation: 'bolt', startTime: currentTime, size: 5, weaponRef: this, pierceCount: this.pierceCount, piercedEnemies: [] };
            }
            return { type: 'ranged', x: playerX, y: playerY, angle: angle + (Math.random() - 0.5) * this.spread, speed: this.projectileSpeed, range: this.range, damage: this.baseDamage, color: this.projectileColor, weaponId: this.id, animation: this.animation, bounceCount: this.bounceCount, bounceRange: this.bounceRange, targetsHit: [], startTime: currentTime, size: 4, weaponRef: this };
        } else {
            if (this.dualStrike) {
                return { type: 'melee', x: playerX, y: playerY, radius: this.range, damage: this.baseDamage, color: this.swingColor, startTime: Date.now(), duration: 200, swingAngle: this.swingAngle, meleeType: 'dual', angle: angle, pierceCount: this.pierceCount, weaponId: this.id, animation: this.animation, trailColor: this.trailColor, sparkleColor: this.sparkleColor, bladeColor: this.bladeColor, hiltColor: this.hiltColor, gripColor: this.gripColor, dualStrike: true };
            }
            return { type: 'melee', x: playerX, y: playerY, radius: this.range, damage: this.baseDamage, color: this.swingColor, startTime: Date.now(), duration: 300, swingAngle: this.swingAngle, meleeType: this.meleeType, angle: angle, pierceCount: this.pierceCount, weaponId: this.id, animation: this.animation, trailColor: this.trailColor, sparkleColor: this.sparkleColor, shockwaveColor: this.shockwaveColor, shockwaveIntensity: this.shockwaveIntensity, tier: this.tier, bladeColor: this.bladeColor, hiltColor: this.hiltColor, handleColor: this.handleColor, headColor: this.headColor, edgeColor: this.edgeColor, shaftColor: this.shaftColor, prongColor: this.prongColor, tipColor: this.tipColor, gripColor: this.gripColor };
        }
    }
    
    getScrapValue() { return Math.floor(this.baseCost * 0.5 * (1 + (this.tier - 1) * 0.5)); }
    getTypeDescription() {
        if (this.type === 'ranged') { if (this.id === 'shotgun') return 'SHOTGUN'; if (this.id === 'laser') return 'ENERGY'; if (this.id === 'boomerang') return 'BOOMERANG'; if (this.id === 'throwing_knives') return 'THROWING'; if (this.id === 'sniper') return 'SNIPER'; if (this.id === 'crossbow') return 'CROSSBOW'; return 'RANGED'; }
        if (this.meleeType === 'single') return 'SINGLE'; if (this.meleeType === 'aoe') return 'AOE 360°'; if (this.meleeType === 'pierce') return 'PIERCE'; if (this.meleeType === 'dual') return 'DUAL'; return 'MELEE';
    }
    getDisplayName() { return this.tier === 1 ? this.name : `${this.name} ${['', 'II', 'III', 'IV', 'V', 'VI'][this.tier]}`; }
    getShopCost() { return this.tier === 2 ? Math.floor(this.baseCost * 2 * 0.75) : (this.tier > 2 ? Math.floor(this.baseCost * Math.pow(1.8, this.tier - 1)) : this.baseCost); }
    getMergeCost(other) { return (this.id === other.id && this.tier === other.tier && this.tier < 5) ? Math.floor(this.baseCost * 0.3 * this.tier) : 0; }
    merge(other) { return (this.id === other.id && this.tier === other.tier && this.tier < 5) ? new WeaponInstance(GAME_DATA.WEAPONS.find(w => w.id === this.id), this.tier + 1) : null; }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function getWeaponById(id) { return GAME_DATA.WEAPONS.find(w => w.id === id); }
function getWaveConfig(waveNumber) { return GAME_DATA.WAVES[waveNumber - 1] || GAME_DATA.WAVES[GAME_DATA.WAVES.length - 1]; }
function getMonsterTypeForWave(waveNumber) {
    if (waveNumber % 10 === 0) return MONSTER_TYPES.BOSS;
    const comp = WAVE_COMPOSITIONS[waveNumber];
    if (!comp) return MONSTER_TYPES.NORMAL;
    const types = [];
    for (let i = 0; i < comp.normal; i++) types.push(MONSTER_TYPES.NORMAL);
    for (let i = 0; i < comp.fast; i++) types.push(MONSTER_TYPES.FAST);
    for (let i = 0; i < comp.tank; i++) types.push(MONSTER_TYPES.TANK);
    for (let i = 0; i < comp.explosive; i++) types.push(MONSTER_TYPES.EXPLOSIVE);
    for (let i = 0; i < comp.gunner; i++) types.push(MONSTER_TYPES.GUNNER);
    for (let i = 0; i < comp.splitter; i++) types.push(MONSTER_TYPES.SPLITTER);
    for (let i = 0; i < comp.dasher; i++) types.push(MONSTER_TYPES.DASHER);
    for (let i = 0; i < comp.vampire; i++) types.push(MONSTER_TYPES.VAMPIRE);
    return types;
}

function getNonBossMonsterTypesForWave(waveNumber) {
    const comp = WAVE_COMPOSITIONS[waveNumber];
    if (!comp) return [MONSTER_TYPES.NORMAL];
    const types = [];
    for (let i = 0; i < comp.normal; i++) types.push(MONSTER_TYPES.NORMAL);
    for (let i = 0; i < comp.fast; i++) types.push(MONSTER_TYPES.FAST);
    for (let i = 0; i < comp.tank; i++) types.push(MONSTER_TYPES.TANK);
    for (let i = 0; i < comp.explosive; i++) types.push(MONSTER_TYPES.EXPLOSIVE);
    for (let i = 0; i < comp.gunner; i++) types.push(MONSTER_TYPES.GUNNER);
    for (let i = 0; i < comp.splitter; i++) types.push(MONSTER_TYPES.SPLITTER);
    for (let i = 0; i < comp.dasher; i++) types.push(MONSTER_TYPES.DASHER);
    for (let i = 0; i < comp.vampire; i++) types.push(MONSTER_TYPES.VAMPIRE);
    return types.sort(() => Math.random() - 0.5);
}

function generateShopItems() {
    const items = [];
    let availWeapons = GAME_DATA.WEAPONS.filter(w => w.id !== 'handgun' && !player.weapons.some(pw => pw.id === w.id && pw.tier >= 5));
    for (let i = 0; i < 2; i++) {
        if (availWeapons.length) {
            const idx = Math.floor(Math.random() * availWeapons.length);
            const w = { ...availWeapons[idx] };
            const tier = Math.random() < 0.3 ? 2 : 1;
            items.push({ type: 'weapon', data: w, tier, instance: new WeaponInstance(w, tier) });
            availWeapons.splice(idx, 1);
        }
    }
    let availItems = [...GAME_DATA.ITEMS].filter(it => !(it.id === 'landmine' && playerTowers.landmines.count >= playerTowers.landmines.max));
    for (let i = 0; i < 2; i++) {
        if (availItems.length) {
            const idx = Math.floor(Math.random() * availItems.length);
            const it = { ...availItems[idx] };
            items.push({ type: it.type === 'tower' ? 'tower' : 'item', data: it });
            availItems.splice(idx, 1);
        }
    }
    return items.sort(() => Math.random() - 0.5);
}

function refreshShop() {
    if (gold < refreshCost) { queueMessage(`Not enough gold! Need ${refreshCost}g`); return; }
    gold -= refreshCost;
    refreshCount++;
    refreshCost = 5 + refreshCount * 2;
    refreshCostSpan.textContent = `${refreshCost}g`;
    refreshCounter.textContent = `Refreshes: ${refreshCount}`;
    shopItems = generateShopItems();
    updateShopDisplay();
    updateUI();
    queueMessage(`Shop refreshed! Cost increased to ${refreshCost}g`);
}

function generateStatBuffs() {
    const b = [...GAME_DATA.STAT_BUFFS];
    const s = [];
    for (let i = 0; i < 4; i++) {
        if (b.length) {
            const idx = Math.floor(Math.random() * b.length);
            s.push(b[idx]);
            b.splice(idx, 1);
        }
    }
    return s;
}

// ============================================
// WAVE MANAGEMENT
// ============================================

function showSpawnIndicators() {
    const waveConfig = getWaveConfig(wave);
    spawnIndicators = [];
    let totalMonsters = waveConfig.monsters;
    if (waveConfig.isBoss) totalMonsters = 1 + waveConfig.monsters;
    
    const numClusters = Math.min(5, Math.max(2, Math.floor(totalMonsters / 6)));
    const clusterCenters = [];
    for (let c = 0; c < numClusters; c++) {
        clusterCenters.push({ x: 100 + Math.random() * (canvas.width - 200), y: 100 + Math.random() * (canvas.height - 200) });
    }
    
    for (let i = 0; i < totalMonsters; i++) {
        let x, y;
        if (waveConfig.isBoss && i === 0) {
            x = canvas.width / 2;
            y = canvas.height / 2;
        } else {
            const cluster = clusterCenters[Math.floor(Math.random() * clusterCenters.length)];
            const angle = Math.random() * Math.PI * 2;
            const distance = 40 + Math.random() * 100;
            x = cluster.x + Math.cos(angle) * distance;
            y = cluster.y + Math.sin(angle) * distance;
            x = Math.max(50, Math.min(canvas.width - 50, x));
            y = Math.max(50, Math.min(canvas.height - 50, y));
        }
        spawnIndicators.push({ x, y, timer: 2000, startTime: Date.now(), isBoss: waveConfig.isBoss && i === 0, index: i });
    }
}

function createMonster(monsterType, isBoss = false, spawnX = null, spawnY = null) {
    const waveConfig = getWaveConfig(wave);
    let health, damage;
    
    if (isBoss) {
        health = waveConfig.bossHealth || (waveConfig.monsterHealth * monsterType.healthMultiplier);
        damage = waveConfig.monsterDamage * monsterType.damageMultiplier;
    } else {
        health = Math.floor(waveConfig.monsterHealth * monsterType.healthMultiplier);
        damage = Math.floor(waveConfig.monsterDamage * monsterType.damageMultiplier);
    }
    
    let x, y;
    if (spawnX !== null && spawnY !== null) { x = spawnX; y = spawnY; }
    else {
        const side = Math.floor(Math.random() * 4);
        switch(side) {
            case 0: x = 50; y = Math.random() * (canvas.height - 100) + 50; break;
            case 1: x = canvas.width - 50; y = Math.random() * (canvas.height - 100) + 50; break;
            case 2: x = Math.random() * (canvas.width - 100) + 50; y = 50; break;
            default: x = Math.random() * (canvas.width - 100) + 50; y = canvas.height - 50;
        }
    }
    
    const monster = {
        x, y, radius: isBoss ? 45 : (15 + Math.random() * 10) * monsterType.sizeMultiplier,
        health: health, maxHealth: health, damage: damage,
        speed: (isBoss ? 0.7 : (1 + wave * 0.05)) * monsterType.speed, color: monsterType.color,
        type: monsterType.name, monsterType: monsterType, lastAttack: 0,
        attackCooldown: monsterType.attackCooldown || GAME_DATA.MONSTER_ATTACK_COOLDOWN,
        isBoss: isBoss || false, isMinion: monsterType.isMinion || false,
        isSplitter: monsterType.isSplitter || false, isDasher: monsterType.isDasher || false,
        isVampire: monsterType.isVampire || false, lifeSteal: monsterType.lifeSteal || 0,
        splitCount: monsterType.splitCount || 0, splitHealthPercent: monsterType.splitHealthPercent || 0.5,
        dashSpeed: monsterType.dashSpeed || 1.5, dashCooldown: monsterType.dashCooldown || 3000,
        lastDash: 0, isDashing: false, dashTarget: null, slowed: false, slowUntil: 0,
        frozen: false, frozenUntil: 0, stunned: false, stunnedUntil: 0,
        explosive: monsterType.explosive || false, isGunner: monsterType === MONSTER_TYPES.GUNNER,
        originalSpeed: (isBoss ? 0.7 : (1 + wave * 0.05)) * monsterType.speed
    };
    addVisualEffect({ type: 'spawn', x, y, color: monsterType.color, startTime: Date.now(), duration: 300 });
    return monster;
}

function startWave() {
    gameState = 'wave';
    waveActive = true;
    waveStartTime = Date.now();
    if (player.firstHitReduction) player.firstHitActive = true;
    player.inSlowField = false;
    player.slowFieldTicks = 0;
    player.speed = player.baseSpeed * player.speedMultiplier;
    player.weapons.forEach(w => { if (w.resetEachRound) w.resetAmmo(); });
    
    bossAbilities = {
        shotgun: false, asteroids: [], slowField: null, enraged: false, bossWeapon: null,
        bossWeaponAttack: 0, bossDash: false, bossDashTarget: { x: 0, y: 0 }, bossDashStart: 0,
        bossDashCooldown: 0, bossDashDirection: { x: 0, y: 0 }, bossDashDistance: 0, minionSpawnTimer: 0,
        voidZones: [], teleportTimer: 0
    };
    
    if (asteroidTimer) clearInterval(asteroidTimer);
    if (minionSpawnInterval) clearInterval(minionSpawnInterval);
    
    const waveConfig = getWaveConfig(wave);
    waveDisplay.textContent = `Wave ${wave}`;
    waveDisplay.classList.remove('boss-wave');
    if (waveConfig.isBoss) {
        if (wave === 10) waveDisplay.textContent = `BOSS WAVE 10 - SHADOW DAGGER`;
        else if (wave === 20) waveDisplay.textContent = `BOSS WAVE 20 - WAR HAMMER`;
        else if (wave === 30) waveDisplay.textContent = `BOSS WAVE 30 - SOUL REAPER`;
        else if (wave === 40) waveDisplay.textContent = `BOSS WAVE 40 - VOID BLADE`;
        else waveDisplay.textContent = `BOSS WAVE ${wave}`;
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
    setTimeout(() => { if (playerTowers.landmines.count > 0) spawnRandomLandmine(); }, 500);
    
    const totalMonsters = waveConfig.monsters;
    const monsterTypes = getMonsterTypeForWave(wave);
    const spawnDelay = waveConfig.spawnDelay || 300;
    let spawned = 0;
    
    if (waveConfig.isBoss) {
        const boss = createMonster(MONSTER_TYPES.BOSS, true, canvas.width / 2, canvas.height / 2);
        if (boss) {
            boss.lifeSteal = 0.1;
            if (wave === 10) {
                bossAbilities.bossWeapon = { ...BOSS_WEAPONS.DAGGER };
                bossAbilities.bossWeapon.lastAttack = 0;
                boss.color = '#8B0000';
                bossAbilities.shotgun = true;
            } else if (wave === 20) {
                bossAbilities.bossWeapon = { ...BOSS_WEAPONS.WAR_HAMMER };
                bossAbilities.bossWeapon.lastAttack = 0;
                boss.color = '#8B4513';
                asteroidTimer = setInterval(() => {
                    if (waveActive && monsters.some(m => m.isBoss)) {
                        for (let i = 0; i < 5; i++) setTimeout(() => { if (waveActive) spawnAsteroid(); }, i * 200);
                    }
                }, 4000);
            } else if (wave === 30) {
                bossAbilities.bossWeapon = { ...BOSS_WEAPONS.SCYTHE };
                bossAbilities.bossWeapon.lastAttack = 0;
                boss.color = '#4B0082';
                bossAbilities.slowField = { active: true, radius: 200, lastDamage: 0 };
            } else if (wave === 40) {
                bossAbilities.bossWeapon = { ...BOSS_WEAPONS.VOID_BLADE };
                bossAbilities.bossWeapon.lastAttack = 0;
                boss.color = '#0f0f1f';
                bossAbilities.voidZones = [];
                bossAbilities.teleportTimer = 0;
                setInterval(() => {
                    if (waveActive && monsters.some(m => m.isBoss)) {
                        const boss = monsters.find(m => m.isBoss);
                        if (boss) {
                            const angle = Math.random() * Math.PI * 2;
                            const dist = 150;
                            boss.x = Math.max(50, Math.min(canvas.width - 50, player.x + Math.cos(angle) * dist));
                            boss.y = Math.max(50, Math.min(canvas.height - 50, player.y + Math.sin(angle) * dist));
                            addVisualEffect({ type: 'teleport', x: boss.x, y: boss.y, radius: 50, color: '#6a0dad', startTime: Date.now(), duration: 300 });
                            voidZones.push({ x: boss.x, y: boss.y, radius: 80, damage: BOSS_WEAPONS.VOID_BLADE.voidZoneDamage, startTime: Date.now(), duration: BOSS_WEAPONS.VOID_BLADE.voidZoneDuration });
                        }
                    }
                }, 5000);
            }
            monsters.push(boss);
            addVisualEffect({ type: 'bossSpawn', x: boss.x, y: boss.y, radius: 100, startTime: Date.now(), duration: 800, color: boss.color });
        }
        
        const bossWaveMonsterTypes = getNonBossMonsterTypesForWave(wave);
        
        const spawnInterval = setInterval(() => {
            if (gameState !== 'wave') { clearInterval(spawnInterval); return; }
            if (spawned >= totalMonsters) { clearInterval(spawnInterval); return; }
            const monsterType = bossWaveMonsterTypes[spawned];
            const indicatorIndex = spawned + 1;
            if (spawnIndicators.length > indicatorIndex) {
                const indicator = spawnIndicators[indicatorIndex];
                const monster = createMonster(monsterType, false, indicator.x, indicator.y);
                if (monster) monsters.push(monster);
            } else {
                const monster = createMonster(monsterType, false);
                if (monster) monsters.push(monster);
            }
            spawned++;
        }, spawnDelay);
    } else {
        const spawnInterval = setInterval(() => {
            if (gameState !== 'wave') { clearInterval(spawnInterval); return; }
            if (spawned >= totalMonsters) { clearInterval(spawnInterval); return; }
            const monsterType = monsterTypes[spawned] || MONSTER_TYPES.NORMAL;
            if (spawnIndicators.length > spawned) {
                const indicator = spawnIndicators[spawned];
                const monster = createMonster(monsterType, false, indicator.x, indicator.y);
                if (monster) { monsters.push(monster); if (monsterType === MONSTER_TYPES.DASHER) dashers.push(monster); }
            } else {
                const monster = createMonster(monsterType, false);
                if (monster) { monsters.push(monster); if (monsterType === MONSTER_TYPES.DASHER) dashers.push(monster); }
            }
            spawned++;
            if (spawned >= totalMonsters) spawnIndicators = [];
        }, spawnDelay);
    }
    
    setTimeout(() => { waveDisplay.style.opacity = 0.5; }, 2500);
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
    addVisualEffect({ type: 'asteroidWarning', x, y, radius, startTime: Date.now(), duration: 800 });
    setTimeout(() => {
        if (!waveActive) return;
        if (Math.hypot(player.x - x, player.y - y) < radius + player.radius) {
            player.health -= 25;
            createDamageIndicator(player.x, player.y, 25, true);
            if (player.health <= 0) gameOver();
        }
        for (let i = monsters.length - 1; i >= 0; i--) {
            const m = monsters[i];
            if (Math.hypot(m.x - x, m.y - y) < radius + m.radius && !m.isBoss) {
                m.health -= 75;
                createDamageIndicator(m.x, m.y, 75, true);
                if (m.health <= 0) handleMonsterDeath(m, i);
            }
        }
        addVisualEffect({ type: 'asteroid', x, y, radius, startTime: Date.now(), duration: 500 });
    }, 800);
}

function handleSplitterDeath(monster) {
    if (!monster.isSplitter) return;
    const splitCount = monster.splitCount || 2;
    const splitHealth = Math.floor(monster.maxHealth * (monster.splitHealthPercent || 0.5));
    for (let i = 0; i < splitCount; i++) {
        const angle = (i / splitCount) * Math.PI * 2;
        const distance = 30;
        const x = monster.x + Math.cos(angle) * distance;
        const y = monster.y + Math.sin(angle) * distance;
        monsters.push({
            ...monster, x, y, health: splitHealth, maxHealth: splitHealth,
            radius: monster.radius * 0.7, isSplitter: false, color: '#aaffaa',
            originalSpeed: monster.originalSpeed * 1.2
        });
    }
    addVisualEffect({ type: 'explosion', x: monster.x, y: monster.y, radius: 50, color: '#0F0', startTime: Date.now(), duration: 300 });
}

function updateDasher(dasher, currentTime) {
    if (!dasher.isDasher) return;
    if (dasher.isDashing) {
        const dx = dasher.dashTarget.x - dasher.x, dy = dasher.dashTarget.y - dasher.y, dist = Math.hypot(dx, dy);
        if (dist < 5) { dasher.isDashing = false; dasher.speed = dasher.originalSpeed; }
        else { dasher.x += (dx / dist) * dasher.dashSpeed; dasher.y += (dy / dist) * dasher.dashSpeed; }
    } else if (currentTime - dasher.lastDash >= dasher.dashCooldown && Math.hypot(player.x - dasher.x, player.y - dasher.y) < 300) {
        dasher.isDashing = true;
        dasher.dashTarget = { x: player.x, y: player.y };
        dasher.lastDash = currentTime;
        addVisualEffect({ type: 'shockwave', x: dasher.x, y: dasher.y, radius: 30, color: '#0FF', startTime: currentTime, duration: 200 });
    }
}

function handleMonsterDeath(monster, index) {
    attackedMonsters.delete(monster);
    weaponTargets.forEach((target, weaponId) => { if (target === monster) weaponTargets.delete(weaponId); });
    monsters.splice(index, 1);
    player.weapons.forEach(weapon => { if (weapon.isThrowable) { const returned = weapon.returnKnives(monster); if (returned > 0) createHealthPopup(monster.x, monster.y, returned); } });
    
    let goldDrop = 0;
    if (monster.monsterType && monster.monsterType.goldDrop) {
        goldDrop = Math.floor((Math.random() * (monster.monsterType.goldDrop.max - monster.monsterType.goldDrop.min + 1) + monster.monsterType.goldDrop.min) * (1 + player.goldMultiplier));
    } else {
        goldDrop = Math.floor((5 + Math.random() * 10) * (1 + player.goldMultiplier));
    }
    gold += goldDrop;
    kills++;
    createGoldPopup(monster.x, monster.y, goldDrop);
    addVisualEffect({ type: 'death', x: monster.x, y: monster.y, startTime: Date.now(), duration: 300 });
    
    if (monster.explosive) {
        const explosionRadius = 100;
        const explosionDamage = monster.damage * 2;
        addVisualEffect({ type: 'explosion', x: monster.x, y: monster.y, radius: explosionRadius, color: '#FF4500', startTime: Date.now(), duration: 400 });
        monsters.forEach((otherMonster, otherIndex) => {
            if (otherMonster !== monster && Math.hypot(otherMonster.x - monster.x, otherMonster.y - monster.y) < explosionRadius + otherMonster.radius) {
                otherMonster.health -= explosionDamage;
                createDamageIndicator(otherMonster.x, otherMonster.y, explosionDamage, false);
                if (otherMonster.health <= 0) handleMonsterDeath(otherMonster, otherIndex);
            }
        });
        if (Math.hypot(player.x - monster.x, player.y - monster.y) < explosionRadius + player.radius) {
            player.health -= explosionDamage;
            createDamageIndicator(player.x, player.y, explosionDamage, false);
            if (player.health <= 0) gameOver();
        }
    }
    if (monster.isSplitter) handleSplitterDeath(monster);
    if (monster.isDasher) { const dasherIndex = dashers.indexOf(monster); if (dasherIndex > -1) dashers.splice(dasherIndex, 1); }
    if (player.berserkerRing) player.damageMultiplier = (player.baseDamageMultiplier || 1.0) + (1 - player.health / player.maxHealth) * 0.5;
    updateUI();
}

function endWave() {
    gameState = 'statSelect';
    waveActive = false;
    playerTowers.landmines.active = [];
    placedBombs = [];
    player.inSlowField = false;
    player.slowFieldTicks = 0;
    player.speed = player.baseSpeed * player.speedMultiplier;
    if (asteroidTimer) clearInterval(asteroidTimer);
    if (minionSpawnInterval) clearInterval(minionSpawnInterval);
    bossAbilities = {
        shotgun: false, asteroids: [], slowField: null, enraged: false, bossWeapon: null,
        bossWeaponAttack: 0, bossDash: false, bossDashTarget: { x: 0, y: 0 }, bossDashStart: 0,
        bossDashCooldown: 0, bossDashDirection: { x: 0, y: 0 }, bossDashDistance: 0, minionSpawnTimer: 0,
        voidZones: [], teleportTimer: 0
    };
    const waveConfig = getWaveConfig(wave);
    gold += Math.floor(waveConfig.goldReward * (1 + player.goldMultiplier));
    player.weapons.forEach(w => { if (w.usesAmmo && !w.isThrowable) { w.currentAmmo = w.magazineSize; w.isReloading = false; } });
    if (player.sharpeningStone && player.sharpeningStoneWave === wave) player.sharpeningStone = false;
    showStatBuffs();
}

function gameOver() {
    gameState = 'gameover';
    waveActive = false;
    player.inSlowField = false;
    player.slowFieldTicks = 0;
    player.speed = player.baseSpeed * player.speedMultiplier;
    if (asteroidTimer) clearInterval(asteroidTimer);
    if (minionSpawnInterval) clearInterval(minionSpawnInterval);
    if (player.bloodContractInterval) clearInterval(player.bloodContractInterval);
    clearSave();
    if (player.guardianAngel && !player.guardianAngelUsed && player.health <= 0) {
        player.guardianAngelUsed = true;
        player.health = Math.max(1, Math.floor(player.maxHealth * 0.5));
        gameState = 'wave';
        waveActive = true;
        queueMessage("GUARDIAN ANGEL SAVED YOU! 50% health restored.");
        addVisualEffect({ type: 'guardianAngel', x: player.x, y: player.y, radius: 50, color: '#FF0', startTime: Date.now(), duration: 1000 });
        updateUI();
        return;
    }
    gameOverText.textContent = `You survived ${wave} waves with ${kills} kills.`;
    gameOverOverlay.style.display = 'flex';
}

// ============================================
// UI UPDATE FUNCTIONS
// ============================================

function updateUI() {
    healthValue.textContent = `${Math.floor(player.health)}/${player.maxHealth}`;
    damageValue.textContent = (player.damageMultiplier * 100).toFixed(0) + '%';
    speedValue.textContent = (player.speedMultiplier * 100).toFixed(0) + '%';
    goldValue.textContent = gold;
    waveValue.textContent = wave;
    killsValue.textContent = kills;
    const hpPct = (player.health / player.maxHealth) * 100;
    healthFill.style.width = `${hpPct}%`;
    healthFill.style.background = hpPct > 60 ? 'linear-gradient(90deg, #11998e, #38ef7d)' : (hpPct > 30 ? 'linear-gradient(90deg, #f7971e, #ffd200)' : 'linear-gradient(90deg, #ff416c, #ff4b2b)');
    monsterCount.textContent = `Monsters: ${monsters.length}`;
    if (statsPanelVisible) updateStatsPanel();
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
            if (mergeTargetIndex === i) { slot.style.borderColor = '#0F0'; slot.style.boxShadow = '0 0 15px rgba(0,255,0,0.5)'; }
            let cooldownPercent = 100;
            if (weapon.lastAttack > 0) {
                const cooldownTime = 1000 / (weapon.attackSpeed * player.attackSpeedMultiplier);
                cooldownPercent = Math.min(100, ((currentTime - weapon.lastAttack) / cooldownTime) * 100);
            }
            const effectiveDamage = Math.floor(weapon.baseDamage * player.damageMultiplier);
            let ammoDisplay = '';
            if (weapon.usesAmmo) {
                ammoDisplay = weapon.isThrowable ?
                    `<div class="throwable-ammo-small"><span class="ammo-count">${weapon.currentAmmo}</span><span class="ammo-max">/${weapon.magazineSize}</span></div>` :
                    `<div class="ammo-display">${weapon.currentAmmo}/${weapon.magazineSize}</div>`;
            }
            slot.innerHTML = `<div>${weapon.icon}</div>${weapon.tier > 1 ? `<div class="tier-badge">${weapon.tier}</div>` : ''}<div class="weapon-level">${weapon.type === 'melee' ? '⚔️' : '🔫'}</div><div class="melee-type">${weapon.getTypeDescription()}</div>${ammoDisplay}<div class="weapon-info">${weapon.getDisplayName()}<br>Base: ${weapon.baseDamage}<br>Total: ${effectiveDamage}<br>Spd: ${(weapon.attackSpeed * player.attackSpeedMultiplier).toFixed(1)}/s</div><div class="cooldown-bar"><div class="cooldown-fill" style="width: ${cooldownPercent}%; ${weapon.isReloading ? 'background: linear-gradient(90deg, #ff0000, #ff8800);' : ''}"></div></div>`;
            slot.addEventListener('click', (e) => { e.preventDefault(); selectWeapon(i); });
            slot.addEventListener('touchstart', (e) => { e.preventDefault(); selectWeapon(i); });
        } else {
            slot.innerHTML = '<div class="empty-slot">+</div>';
        }
        weaponsGrid.appendChild(slot);
    }
}

function updateConsumablesDisplay() {
    if (!consumablesGrid) return;
    consumablesGrid.innerHTML = '';
    if (player.consumables.length === 0) { consumablesGrid.innerHTML = '<div class="empty-consumable">No consumables</div>'; return; }
    player.consumables.forEach((consumable, index) => {
        const slot = document.createElement('div');
        slot.className = 'consumable-slot';
        slot.innerHTML = `<div class="consumable-icon">${consumable.icon}</div><div class="consumable-name">${consumable.name}</div><div class="consumable-count">${consumable.count || 1}</div>`;
        slot.addEventListener('click', (e) => { e.preventDefault(); useConsumable(index); });
        slot.addEventListener('touchstart', (e) => { e.preventDefault(); useConsumable(index); });
        consumablesGrid.appendChild(slot);
    });
}

function useConsumable(index) {
    if (gameState !== 'wave') { queueMessage("Can only use consumables during waves!"); return; }
    const consumable = player.consumables[index];
    switch(consumable.id) {
        case 'health_potion': const healAmount = Math.floor(player.maxHealth * 0.25); applyHealing(healAmount); queueMessage(`Used Health Potion! +${healAmount} HP (25%)`); break;
        case 'ammo_pack': player.weapons.forEach(w => { if (w.usesAmmo && !w.isThrowable) { w.currentAmmo = w.magazineSize; w.isReloading = false; } }); queueMessage("Used Ammo Pack! All weapons reloaded"); break;
        case 'rage_potion': activateRagePotion(); break;
        case 'bomb': useBomb(); break;
        case 'exp_scroll': useExpScroll(); break;
        case 'healing_tower': placeHealingTower(); break;
    }
    if (consumable.count && consumable.count > 1) consumable.count--;
    else player.consumables.splice(index, 1);
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
                setTimeout(() => { mergeInfo.style.display = 'none'; }, 3000);
            } else {
                mergeInfo.textContent = firstWeapon.tier >= 5 ? 'Max tier reached!' : 'Cannot merge these weapons';
                mergeInfo.style.display = 'block';
                setTimeout(() => { mergeInfo.style.display = 'none'; }, 2000);
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
    if (weapon1.id !== weapon2.id || weapon1.tier !== weapon2.tier) { queueMessage("Can only merge identical weapons of same tier!"); return; }
    if (weapon1.tier >= 5) { queueMessage("Maximum tier (5) reached!"); return; }
    const mergeCost = weapon1.getMergeCost(weapon2);
    if (gold < mergeCost) { queueMessage(`Need ${mergeCost} gold to merge!`); return; }
    gold -= mergeCost;
    const mergedWeapon = weapon1.merge(weapon2);
    if (!mergedWeapon) { queueMessage("Merge failed!"); return; }
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
    if (weapon.id === 'handgun' && player.weapons.length === 1) { queueMessage("Cannot scrap your only weapon!"); return; }
    gold += weapon.getScrapValue();
    player.weapons.splice(selectedWeaponIndex, 1);
    selectedWeaponIndex = -1;
    scrapWeaponBtn.style.display = 'none';
    queueMessage(`Scrapped ${weapon.getDisplayName()} for ${weapon.getScrapValue()} gold!`);
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
            let tierText = '', tierClass = '';
            if (shopItem.type === 'weapon') {
                const tier = shopItem.tier || 1;
                cost = new WeaponInstance(data, tier).getShopCost();
                if (tier > 1) { tierText = ` Tier ${tier}`; tierClass = ` tier-${tier}`; }
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
                    else if (data.id === 'sniper') tagClass = 'sniper-tag';
                    else if (data.id === 'crossbow') tagClass = 'crossbow-tag';
                    else tagClass = 'ranged-tag';
                }
            } else if (shopItem.type === 'tower') tagClass = 'tower-tag';
            
            let typeText = '';
            if (shopItem.type === 'weapon') {
                if (data.id === 'shotgun') typeText = 'SHOTGUN';
                else if (data.id === 'laser') typeText = 'ENERGY';
                else if (data.id === 'boomerang') typeText = 'BOOMERANG';
                else if (data.id === 'throwing_knives') typeText = 'THROWING';
                else if (data.id === 'sniper') typeText = 'SNIPER';
                else if (data.id === 'crossbow') typeText = 'CROSSBOW';
                else if (data.type === 'melee') typeText = data.meleeType.toUpperCase();
                else typeText = 'RANGED';
            } else if (shopItem.type === 'tower') typeText = 'TOWER';
            else typeText = data.type === 'consumable' ? 'CONSUMABLE' : 'PERMANENT';
            
            itemElement.innerHTML = `<div class="item-info"><div class="item-name">${data.icon} ${data.name}${tierText}${tagClass ? `<span class="item-tag ${tagClass}${tierClass}">${typeText}</span>` : ''}</div><div class="item-effect">${data.description}</div></div><div class="item-cost">${cost}g</div>`;
            itemElement.addEventListener('click', (e) => { e.preventDefault(); purchaseItem(i); });
            itemElement.addEventListener('touchstart', (e) => { e.preventDefault(); purchaseItem(i); });
        } else {
            itemElement.className = 'shop-item empty';
            itemElement.innerHTML = `<div class="item-info"><div class="item-name">Empty Slot</div><div class="item-effect">Already purchased</div></div><div class="item-cost">-</div>`;
        }
        shopItemsContainer.appendChild(itemElement);
    }
}

function purchaseItem(index) {
    if (index >= shopItems.length || !shopItems[index]) return;
    const shopItem = shopItems[index];
    const data = shopItem.data;
    let cost = data.cost;
    if (shopItem.type === 'weapon') cost = new WeaponInstance(data, shopItem.tier || 1).getShopCost();
    if (gold < cost) { queueMessage(`Not enough gold! Need ${cost}, have ${gold}`); return; }
    gold -= cost;
    
    if (shopItem.type === 'weapon') {
        if (player.weapons.length >= 6) { queueMessage('No empty weapon slots!'); gold += cost; return; }
        player.weapons.push(new WeaponInstance(data, shopItem.tier || 1));
        queueMessage(`Purchased ${data.name} Tier ${shopItem.tier || 1}!`);
    } else if (shopItem.type === 'tower') {
        if (data.id === 'landmine') {
            if (playerTowers.landmines.count >= playerTowers.landmines.max) { queueMessage(`Maximum landmines (${playerTowers.landmines.max}) reached!`); gold += cost; return; }
            playerTowers.landmines.count++;
            queueMessage(`Purchased Landmine! (${playerTowers.landmines.count}/${playerTowers.landmines.max})`);
            if (gameState === 'wave') setTimeout(() => spawnRandomLandmine(), 100);
        } else if (data.id === 'healing_tower') {
            const existing = player.consumables.find(c => c.id === 'healing_tower');
            if (existing) existing.count = (existing.count || 1) + 1;
            else player.consumables.push({ id: 'healing_tower', name: 'Healing Tower', icon: '🏥', count: 1 });
            queueMessage(`Added Healing Tower to consumables!`);
            updateConsumablesDisplay();
        }
    } else {
        if (data.type === 'consumable') {
            const existing = player.consumables.find(c => c.id === data.id);
            if (existing) existing.count = (existing.count || 1) + 1;
            else player.consumables.push({ id: data.id, name: data.name, icon: data.icon, count: 1 });
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
        case 'damage_orb': player.damageMultiplier += 0.15; queueMessage(`Damage increased by 15%! Now ${Math.floor(player.damageMultiplier * 100)}%`); break;
        case 'speed_boots': player.speedMultiplier += 0.15; player.speed = player.baseSpeed * player.speedMultiplier; queueMessage(`Speed increased by 15%! Now ${Math.floor(player.speedMultiplier * 100)}%`); break;
        case 'health_upgrade': const oldMax = player.maxHealth; player.maxHealth = Math.floor(oldMax * 1.25); player.health += player.maxHealth - oldMax; queueMessage(`Max health increased by 25%! Now ${player.maxHealth}`); break;
        case 'vampire_teeth': player.lifeSteal += 0.05; queueMessage(`Life steal increased by 5%! Now ${Math.floor(player.lifeSteal * 100)}%`); break;
        case 'berserker_ring': player.berserkerRing = true; queueMessage("Berserker Ring equipped! Damage increases as health decreases"); break;
        case 'ninja_scroll': player.dodgeChance += 0.15; queueMessage(`Dodge chance increased by 15%! Now ${Math.floor(player.dodgeChance * 100)}%`); break;
        case 'alchemist_stone': player.goldMultiplier += 0.2; queueMessage(`Gold multiplier increased by 20%! Now +${Math.floor(player.goldMultiplier * 100)}% gold`); break;
        case 'thorns_armor': player.thornsDamage = 0.25; queueMessage("Thorns Armor equipped! Reflect 25% of damage back to attackers"); break;
        case 'wind_charm': player.attackSpeedMultiplier += 0.15; queueMessage(`Attack speed increased by 15%! Now ${player.attackSpeedMultiplier.toFixed(1)}x`); break;
        case 'runic_plate': player.firstHitReduction = true; player.firstHitActive = true; queueMessage("Runic Plate equipped! First hit each wave deals 50% less damage"); break;
        case 'guardian_angel': player.guardianAngel = true; queueMessage("Guardian Angel equipped! Once per game, survive fatal damage with 50% health"); break;
        case 'blood_contract':
            if (!player.bloodContract) {
                player.bloodContract = true; player.bloodContractStacks = 1; player.lifeSteal += 0.03;
                if (player.bloodContractInterval) clearInterval(player.bloodContractInterval);
                player.bloodContractInterval = setInterval(() => {
                    if (gameState === 'wave') {
                        const damageAmount = Math.max(1, Math.floor(player.maxHealth * 0.01 * player.bloodContractStacks));
                        if (player.health > damageAmount) player.health -= damageAmount;
                        else player.health = 1;
                        updateUI();
                        createDamageIndicator(player.x, player.y, damageAmount, false);
                    }
                }, 1000);
                queueMessage(`Blood Contract activated! +3% lifesteal, lose ${player.bloodContractStacks}% HP per second`);
            } else {
                player.bloodContractStacks++; player.lifeSteal += 0.03;
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
        buffElement.innerHTML = `<div class="buff-name">${buff.icon} ${buff.name}</div><div class="buff-description">${buff.description}</div>`;
        buffElement.addEventListener('click', (e) => { e.preventDefault(); selectStatBuff(buff); });
        buffElement.addEventListener('touchstart', (e) => { e.preventDefault(); selectStatBuff(buff); });
        statBuffs.appendChild(buffElement);
    });
    waveCompleteOverlay.style.display = 'flex';
}

function selectStatBuff(buff) {
    if (buff.effect.maxHealthPercent) { const oldMax = player.maxHealth; player.maxHealth = Math.floor(oldMax * (1 + buff.effect.maxHealthPercent)); player.health += player.maxHealth - oldMax; }
    if (buff.effect.damagePercent) player.damageMultiplier += buff.effect.damagePercent;
    if (buff.effect.speedPercent) { player.speedMultiplier += buff.effect.speedPercent; player.speed = player.baseSpeed * player.speedMultiplier; }
    if (buff.effect.lifeSteal) player.lifeSteal += buff.effect.lifeSteal;
    if (buff.effect.criticalChance) player.criticalChance += buff.effect.criticalChance;
    if (buff.effect.goldMultiplier) player.goldMultiplier += buff.effect.goldMultiplier;
    if (buff.effect.healthRegenPercent) player.healthRegenPercent += buff.effect.healthRegenPercent;
    if (buff.effect.damageReduction) player.damageReduction += buff.effect.damageReduction;
    if (buff.effect.reloadSpeedMultiplier) {
        player.reloadSpeedMultiplier += buff.effect.reloadSpeedMultiplier;
        queueMessage(`Reload speed increased by ${Math.floor(buff.effect.reloadSpeedMultiplier * 100)}%! Now ${(player.reloadSpeedMultiplier * 100).toFixed(0)}% faster`);
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

function showReloadIndicator(weaponName) {
    if (gameState === 'wave') {
        reloadIndicator.textContent = `${weaponName} - RELOADING...`;
        reloadIndicator.style.display = 'block';
        setTimeout(() => { reloadIndicator.style.display = 'none'; }, 1000);
    }
}

// ============================================
// INITIALIZATION
// ============================================

function initGame() {
    if (player.bloodContractInterval) clearInterval(player.bloodContractInterval);
    if (minionSpawnInterval) clearInterval(minionSpawnInterval);
    pendingHealing = 0;
    
    Object.assign(player, {
        x: 400, y: 300, radius: 20, health: GAME_DATA.PLAYER_START.health, maxHealth: GAME_DATA.PLAYER_START.maxHealth,
        damageMultiplier: 1.0, speed: GAME_DATA.PLAYER_START.speed, baseSpeed: GAME_DATA.PLAYER_START.speed,
        speedMultiplier: 1.0, color: '#ff6b6b', lifeSteal: 0, criticalChance: 0, goldMultiplier: 0,
        healthRegen: 0, healthRegenPercent: 0, damageReduction: 0, lastRegen: Date.now(), weapons: [],
        projectiles: [], meleeAttacks: [], ammoPack: false, dodgeChance: 0, thornsDamage: 0, attackSpeedMultiplier: 1,
        firstHitReduction: false, firstHitActive: false, voidCrystalChance: 0, guardianAngelUsed: false,
        consumables: [], berserkerRing: false, sharpeningStone: false, sharpeningStoneWave: 0,
        enchantersInk: false, guardianAngel: false, bloodContract: false, bloodContractStacks: 0,
        bloodContractInterval: null, lastBloodDamage: 0, inSlowField: false, slowFieldTicks: 0,
        lastSlowFieldTick: 0, facingAngle: 0, lastFacingAngle: 0, reloadSpeedMultiplier: 1.0
    });
    
    attackedMonsters.clear();
    weaponTargets.clear();
    playerTowers.landmines.count = 0;
    playerTowers.landmines.active = [];
    playerTowers.healingTowers.active = [];
    placedBombs = [];
    
    const handgun = GAME_DATA.WEAPONS.find(w => w.id === 'handgun');
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
    bossAbilities = {
        shotgun: false, asteroids: [], slowField: null, enraged: false, bossWeapon: null,
        bossWeaponAttack: 0, bossDash: false, bossDashTarget: { x: 0, y: 0 }, bossDashStart: 0,
        bossDashCooldown: 0, bossDashDirection: { x: 0, y: 0 }, bossDashDistance: 0, minionSpawnTimer: 0,
        voidZones: [], teleportTimer: 0
    };
    if (asteroidTimer) clearInterval(asteroidTimer);
    if (minionSpawnInterval) clearInterval(minionSpawnInterval);
    
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
// TOWER FUNCTIONS
// ============================================

function spawnRandomLandmine() {
    if (playerTowers.landmines.count <= 0 || playerTowers.landmines.active.length >= playerTowers.landmines.count) return;
    let x, y, valid = false;
    for (let attempts = 0; attempts < 100; attempts++) {
        x = 50 + Math.random() * (canvas.width - 100);
        y = 50 + Math.random() * (canvas.height - 100);
        if (Math.hypot(x - player.x, y - player.y) < 100) continue;
        let tooClose = false;
        for (let mine of playerTowers.landmines.active) {
            if (Math.hypot(x - mine.x, y - mine.y) < 50 + mine.radius) { tooClose = true; break; }
        }
        if (!tooClose) { valid = true; break; }
    }
    if (!valid) { x = 100 + Math.random() * (canvas.width - 200); y = 100 + Math.random() * (canvas.height - 200); }
    playerTowers.landmines.active.push({ x, y, radius: 15, damage: 80, explosionRadius: 60, active: true, startTime: Date.now(), color: '#8B4513' });
    addVisualEffect({ type: 'landmineSpawn', x, y, radius: 20, color: '#8B4513', startTime: Date.now(), duration: 500 });
    queueMessage(`Landmine deployed! (${playerTowers.landmines.active.length}/${playerTowers.landmines.count})`);
}

function checkLandmineTriggers() {
    for (let i = playerTowers.landmines.active.length - 1; i >= 0; i--) {
        const mine = playerTowers.landmines.active[i];
        for (let j = 0; j < monsters.length; j++) {
            if (Math.hypot(monsters[j].x - mine.x, monsters[j].y - mine.y) < mine.radius + monsters[j].radius) {
                for (let k = monsters.length - 1; k >= 0; k--) {
                    if (Math.hypot(monsters[k].x - mine.x, monsters[k].y - mine.y) < mine.explosionRadius + monsters[k].radius) {
                        monsters[k].health -= mine.damage;
                        createDamageIndicator(monsters[k].x, monsters[k].y, mine.damage, true);
                        if (monsters[k].health <= 0) handleMonsterDeath(monsters[k], k);
                    }
                }
                addVisualEffect({ type: 'explosion', x: mine.x, y: mine.y, radius: mine.explosionRadius, color: '#FF4500', startTime: Date.now(), duration: 400 });
                playerTowers.landmines.active.splice(i, 1);
                break;
            }
        }
    }
}

function placeHealingTower() {
    if (playerTowers.healingTowers.active.length >= 3) { queueMessage("Maximum towers reached (3)!"); return false; }
    playerTowers.healingTowers.active.push({ x: player.x, y: player.y, radius: 20, health: 30, healAmount: 1, lastHeal: Date.now(), id: Date.now() + Math.random() });
    addVisualEffect({ type: 'towerSpawn', x: player.x, y: player.y, radius: 30, color: '#4CAF50', startTime: Date.now(), duration: 500 });
    queueMessage(`Healing Tower placed! (${playerTowers.healingTowers.active.length}/3)`);
    return true;
}

function updateHealingTowers(currentTime) {
    playerTowers.healingTowers.active.forEach(tower => {
        if (currentTime - tower.lastHeal >= 2000 && player.health < player.maxHealth) {
            applyHealing(tower.healAmount);
            tower.lastHeal = currentTime;
        }
    });
}

function findPathToTarget(enemy, target) {
    const dx = target.x - enemy.x, dy = target.y - enemy.y, dist = Math.hypot(dx, dy);
    if (dist < 5) return { x: 0, y: 0 };
    let moveX = dx / dist, moveY = dy / dist;
    for (let tower of playerTowers.healingTowers.active) {
        if (tower === target) continue;
        const toTowerDist = Math.hypot(tower.x - enemy.x, tower.y - enemy.y);
        if (toTowerDist < 50) {
            const avoidX = (enemy.x - tower.x) / toTowerDist, avoidY = (enemy.y - tower.y) / toTowerDist;
            moveX = (moveX + avoidX * 0.5) / 1.5;
            moveY = (moveY + avoidY * 0.5) / 1.5;
            const newDist = Math.hypot(moveX, moveY);
            moveX /= newDist;
            moveY /= newDist;
        }
    }
    return { x: moveX, y: moveY };
}

function placeBomb() {
    const bomb = { x: player.x, y: player.y, radius: 20, damage: 100, explosionRadius: 150, active: true, startTime: Date.now(), detonateTime: Date.now() + 2000, color: '#F00' };
    placedBombs.push(bomb);
    addVisualEffect({ type: 'bombPlaced', x: bomb.x, y: bomb.y, radius: 20, color: '#F00', startTime: Date.now(), duration: 2000 });
    queueMessage("Bomb placed! 2 second fuse...");
    setTimeout(() => detonateBomb(bomb), 2000);
}

function detonateBomb(bomb) {
    if (!bomb.active) return;
    let hitCount = 0;
    for (let i = monsters.length - 1; i >= 0; i--) {
        if (Math.hypot(monsters[i].x - bomb.x, monsters[i].y - bomb.y) < bomb.explosionRadius + monsters[i].radius) {
            monsters[i].health -= bomb.damage;
            createDamageIndicator(monsters[i].x, monsters[i].y, bomb.damage, true);
            hitCount++;
            if (monsters[i].health <= 0) handleMonsterDeath(monsters[i], i);
        }
    }
    addVisualEffect({ type: 'explosion', x: bomb.x, y: bomb.y, radius: bomb.explosionRadius, color: '#FF4500', startTime: Date.now(), duration: 400 });
    const index = placedBombs.indexOf(bomb);
    if (index > -1) placedBombs.splice(index, 1);
    bomb.active = false;
    queueMessage(hitCount > 0 ? `Boom! Hit ${hitCount} monsters!` : "Bomb exploded but missed everything!");
}

function useBomb() { placeBomb(); }

function activateRagePotion() {
    activeBuffs.rage.active = true;
    activeBuffs.rage.originalMultiplier = player.damageMultiplier;
    activeBuffs.rage.endTime = Date.now() + 10000;
    player.damageMultiplier *= 1.5;
    addVisualEffect({ type: 'rage', x: player.x, y: player.y, radius: 50, color: '#F00', startTime: Date.now(), duration: 10000 });
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
    if (player.weapons.length === 0) { queueMessage("No weapons to upgrade!"); return; }
    const upgradableWeapons = player.weapons.filter(w => w.tier < 5);
    if (upgradableWeapons.length === 0) { queueMessage("All weapons are already max tier (5)!"); return; }
    const randomIndex = Math.floor(Math.random() * upgradableWeapons.length);
    const weapon = upgradableWeapons[randomIndex];
    const oldTier = weapon.tier;
    weapon.tier++;
    weapon.applyTierBonuses();
    if (weapon.resetEachRound) weapon.resetAmmo();
    addVisualEffect({ type: 'upgrade', x: player.x, y: player.y, radius: 40, color: '#FFD700', startTime: Date.now(), duration: 1000 });
    queueMessage(`${weapon.name} upgraded from Tier ${oldTier} to Tier ${weapon.tier}!`);
    updateWeaponDisplay();
}

// ============================================
// MESSAGE SYSTEM
// ============================================

function createMessageContainer() {
    messageContainer = document.createElement('div');
    messageContainer.id = 'messageContainer';
    messageContainer.className = 'message-container';
    document.body.appendChild(messageContainer);
}

function queueMessage(text, duration = 2000) {
    messageQueue.push({ text, duration });
    if (messageQueue.length === 1) showNextMessage();
}

function showNextMessage() {
    if (messageQueue.length === 0 || !messageContainer) return;
    const message = messageQueue[0];
    const messageElement = document.createElement('div');
    messageElement.className = 'message-item';
    messageElement.textContent = message.text;
    messageContainer.appendChild(messageElement);
    setTimeout(() => messageElement.classList.add('show'), 10);
    setTimeout(() => {
        messageElement.classList.remove('show');
        messageElement.classList.add('hide');
        setTimeout(() => {
            if (messageElement.parentNode) messageElement.parentNode.removeChild(messageElement);
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
    joystickContainer.innerHTML = `<div id="joystickBase" class="joystick-base"><div id="joystickHandle" class="joystick-handle"></div></div>`;
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
        const distance = Math.hypot(deltaX, deltaY);
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
        <div class="stats-header"><h3>Player Stats</h3><button id="closeStatsBtn">✕</button></div>
        <div class="stats-content">
            <div class="stat-row"><span class="stat-label">❤️ Health:</span><span class="stat-value" id="stat-health">0/0</span></div>
            <div class="stat-row"><span class="stat-label">⚔️ Damage Multiplier:</span><span class="stat-value" id="stat-damage">100%</span></div>
            <div class="stat-row"><span class="stat-label">👟 Speed Multiplier:</span><span class="stat-value" id="stat-speed">100%</span></div>
            <div class="stat-row"><span class="stat-label">💰 Gold:</span><span class="stat-value" id="stat-gold">0</span></div>
            <div class="stat-row"><span class="stat-label">👾 Kills:</span><span class="stat-value" id="stat-kills">0</span></div>
            <div class="stat-row"><span class="stat-label">🌊 Wave:</span><span class="stat-value" id="stat-wave">0</span></div>
            <div class="stat-divider"></div>
            <div class="stat-row"><span class="stat-label">🦇 Life Steal:</span><span class="stat-value" id="stat-lifesteal">0%</span></div>
            <div class="stat-row"><span class="stat-label">🎯 Critical:</span><span class="stat-value" id="stat-critical">0%</span></div>
            <div class="stat-row"><span class="stat-label">💰 Gold Multi:</span><span class="stat-value" id="stat-goldmulti">0%</span></div>
            <div class="stat-row"><span class="stat-label">🔄 Regen:</span><span class="stat-value" id="stat-regen">0%</span></div>
            <div class="stat-row"><span class="stat-label">🛡️ Damage Red:</span><span class="stat-value" id="stat-dmgred">0%</span></div>
            <div class="stat-row"><span class="stat-label">💨 Dodge:</span><span class="stat-value" id="stat-dodge">0%</span></div>
            <div class="stat-row"><span class="stat-label">🌵 Thorns:</span><span class="stat-value" id="stat-thorns">0%</span></div>
            <div class="stat-row"><span class="stat-label">⚡ Attack Speed:</span><span class="stat-value" id="stat-attackspeed">1.0x</span></div>
            <div class="stat-row"><span class="stat-label">⚡ Reload Speed:</span><span class="stat-value" id="stat-reload">1.0x</span></div>
            <div class="stat-divider"></div>
            <div class="stat-row"><span class="stat-label">💣 Landmines:</span><span class="stat-value" id="stat-landmines">0/5</span></div>
            <div class="stat-row"><span class="stat-label">🏥 Healing Towers:</span><span class="stat-value" id="stat-towers">0/3</span></div>
            <div class="stat-row"><span class="stat-label">🔰 Runic Plate:</span><span class="stat-value" id="stat-runic">No</span></div>
            <div class="stat-row"><span class="stat-label">📜 Blood Contract:</span><span class="stat-value" id="stat-bloodcontract">No (0)</span></div>
            <div class="stat-row"><span class="stat-label">😇 Guardian Angel:</span><span class="stat-value" id="stat-guardian">No</span></div>
            <div class="stat-row"><span class="stat-label">⚡ Berserker Ring:</span><span class="stat-value" id="stat-berserker">No</span></div>
        </div>
    `;
    document.body.appendChild(panel);
    document.getElementById('closeStatsBtn').addEventListener('click', toggleStatsPanel);
    document.getElementById('closeStatsBtn').addEventListener('touchstart', (e) => { e.preventDefault(); toggleStatsPanel(); });
}

function toggleStatsPanel() {
    const panel = document.getElementById('statsPanel');
    statsPanelVisible = !statsPanelVisible;
    panel.className = statsPanelVisible ? 'stats-panel-visible' : 'stats-panel-hidden';
    if (statsPanelVisible) updateStatsPanel();
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
    document.getElementById('stat-towers').textContent = `${playerTowers.healingTowers.active.length}/3`;
    document.getElementById('stat-runic').textContent = player.firstHitReduction ? 'Yes' : 'No';
    document.getElementById('stat-lifesteal').textContent = Math.floor(player.lifeSteal * 100) + '%';
    document.getElementById('stat-critical').textContent = Math.floor(player.criticalChance * 100) + '%';
    document.getElementById('stat-goldmulti').textContent = Math.floor(player.goldMultiplier * 100) + '%';
    document.getElementById('stat-regen').textContent = Math.floor((player.healthRegenPercent || 0) * 100) + '%';
    document.getElementById('stat-dmgred').textContent = Math.floor(player.damageReduction * 100) + '%';
    document.getElementById('stat-dodge').textContent = Math.floor(player.dodgeChance * 100) + '%';
    document.getElementById('stat-thorns').textContent = Math.floor(player.thornsDamage * 100) + '%';
    document.getElementById('stat-attackspeed').textContent = player.attackSpeedMultiplier.toFixed(1) + 'x';
    document.getElementById('stat-reload').textContent = player.reloadSpeedMultiplier.toFixed(1) + 'x';
    document.getElementById('stat-bloodcontract').textContent = player.bloodContract ? `Yes (${player.bloodContractStacks})` : 'No (0)';
    document.getElementById('stat-guardian').textContent = player.guardianAngel ? 'Yes' : 'No';
    document.getElementById('stat-berserker').textContent = player.berserkerRing ? 'Yes' : 'No';
}

// ============================================
// SAVE/LOAD
// ============================================

function saveGame() {
    if (gameState === 'start' || gameState === 'gameover') return;
    const gameData = {
        wave, gold, kills, gameState, waveActive, refreshCount, refreshCost,
        player: {
            x: player.x, y: player.y, health: player.health, maxHealth: player.maxHealth,
            damageMultiplier: player.damageMultiplier, speed: player.speed, baseSpeed: player.baseSpeed,
            speedMultiplier: player.speedMultiplier, lifeSteal: player.lifeSteal, criticalChance: player.criticalChance,
            goldMultiplier: player.goldMultiplier, healthRegen: player.healthRegen, healthRegenPercent: player.healthRegenPercent,
            damageReduction: player.damageReduction, dodgeChance: player.dodgeChance, thornsDamage: player.thornsDamage,
            attackSpeedMultiplier: player.attackSpeedMultiplier, firstHitReduction: player.firstHitReduction,
            firstHitActive: player.firstHitActive, guardianAngel: player.guardianAngel, guardianAngelUsed: player.guardianAngelUsed,
            bloodContract: player.bloodContract, bloodContractStacks: player.bloodContractStacks, berserkerRing: player.berserkerRing,
            sharpeningStone: player.sharpeningStone, sharpeningStoneWave: player.sharpeningStoneWave,
            enchantersInk: player.enchantersInk, consumables: player.consumables, reloadSpeedMultiplier: player.reloadSpeedMultiplier
        },
        pendingHealing,
        towers: {
            landmines: { count: playerTowers.landmines.count, max: playerTowers.landmines.max },
            healingTowers: { active: playerTowers.healingTowers.active.map(t => ({ x: t.x, y: t.y, health: t.health })) }
        },
        weapons: player.weapons.map(w => ({ id: w.id, tier: w.tier, currentAmmo: w.currentAmmo, isReloading: w.isReloading })),
        shopItems, timestamp: Date.now()
    };
    localStorage.setItem('gameSave', JSON.stringify(gameData));
    queueMessage('Game saved!');
}

function loadGame() {
    const saved = localStorage.getItem('gameSave');
    if (!saved) { queueMessage('No saved game found!'); return false; }
    try {
        const gameData = JSON.parse(saved);
        wave = gameData.wave; gold = gameData.gold; kills = gameData.kills; gameState = gameData.gameState;
        waveActive = gameData.waveActive; refreshCount = gameData.refreshCount || 0; refreshCost = gameData.refreshCost || 5;
        Object.assign(player, gameData.player);
        pendingHealing = gameData.pendingHealing || 0;
        if (gameData.towers) {
            playerTowers.landmines.count = gameData.towers.landmines.count || 0;
            playerTowers.landmines.max = gameData.towers.landmines.max || 5;
            if (gameData.towers.healingTowers && gameData.towers.healingTowers.active) {
                playerTowers.healingTowers.active = gameData.towers.healingTowers.active.map(t => ({ ...t, radius: 20, healAmount: 1, lastHeal: Date.now() }));
            }
        }
        player.weapons = [];
        gameData.weapons.forEach(w => {
            const weaponData = GAME_DATA.WEAPONS.find(wp => wp.id === w.id);
            if (weaponData) {
                const weapon = new WeaponInstance(weaponData, w.tier);
                if (weapon.usesAmmo) { weapon.currentAmmo = w.currentAmmo; weapon.isReloading = w.isReloading; }
                player.weapons.push(weapon);
            }
        });
        shopItems = gameData.shopItems || [];
        if (player.bloodContract && !player.bloodContractInterval) {
            player.bloodContractInterval = setInterval(() => {
                if (gameState === 'wave') {
                    const damageAmount = Math.max(1, Math.floor(player.maxHealth * 0.01 * player.bloodContractStacks));
                    if (player.health > damageAmount) player.health -= damageAmount;
                    else player.health = 1;
                    updateUI();
                    createDamageIndicator(player.x, player.y, damageAmount, false);
                }
            }, 1000);
        }
        startScreen.style.display = 'none';
        waveCompleteOverlay.style.display = 'none';
        gameOverOverlay.style.display = 'none';
        if (gameState === 'wave') startWave();
        else if (gameState === 'shop') { nextWaveBtn.style.display = 'block'; updateShopDisplay(); }
        else if (gameState === 'statSelect') showStatBuffs();
        updateUI(); updateWeaponDisplay(); updateShopDisplay(); updateConsumablesDisplay();
        queueMessage('Game loaded!');
        return true;
    } catch(e) { console.error(e); queueMessage('Failed to load save file!'); return false; }
}

function clearSave() { localStorage.removeItem('gameSave'); queueMessage('Save file cleared!'); }

function checkForSave() {
    if (localStorage.getItem('gameSave')) {
        const continueBtn = document.createElement('button');
        continueBtn.id = 'continueGameBtn';
        continueBtn.textContent = 'Continue Game';
        continueBtn.style.marginTop = '10px';
        continueBtn.style.background = 'linear-gradient(45deg, #4CAF50, #45a049)';
        continueBtn.addEventListener('click', (e) => { e.preventDefault(); loadGame(); startScreen.style.display = 'none'; });
        continueBtn.addEventListener('touchstart', (e) => { e.preventDefault(); loadGame(); startScreen.style.display = 'none'; });
        if (!document.getElementById('continueGameBtn')) startScreen.appendChild(continueBtn);
    }
}

// ============================================
// VISUAL EFFECTS
// ============================================

function addVisualEffect(effect) { visualEffects.push(effect); }

function updateVisualEffects() {
    const currentTime = Date.now();
    for (let i = visualEffects.length - 1; i >= 0; i--) {
        if (currentTime - visualEffects[i].startTime > visualEffects[i].duration) visualEffects.splice(i, 1);
    }
}

function createDamageIndicator(x, y, damage, isCritical) {
    const indicator = document.createElement('div');
    indicator.className = 'damage-indicator';
    indicator.textContent = damage.toString();
    if (isCritical) { indicator.textContent = 'CRIT! ' + damage; indicator.style.color = '#FFD700'; indicator.style.fontSize = '1.5rem'; }
    indicator.style.left = (x + Math.random() * 20 - 10) + 'px';
    indicator.style.top = (y + Math.random() * 20 - 10) + 'px';
    document.querySelector('.canvas-container').appendChild(indicator);
    setTimeout(() => { if (indicator.parentNode) indicator.parentNode.removeChild(indicator); }, 1000);
}

function createGoldPopup(x, y, amount) {
    const popup = document.createElement('div');
    popup.className = 'gold-popup';
    popup.textContent = '+' + amount + 'g';
    popup.style.left = (x + Math.random() * 20 - 10) + 'px';
    popup.style.top = (y + Math.random() * 20 - 10) + 'px';
    document.querySelector('.canvas-container').appendChild(popup);
    setTimeout(() => { if (popup.parentNode) popup.parentNode.removeChild(popup); }, 1000);
}

function createHealthPopup(x, y, amount) {
    const popup = document.createElement('div');
    popup.className = 'health-popup';
    popup.textContent = '+' + amount + ' HP';
    popup.style.left = (x + Math.random() * 20 - 10) + 'px';
    popup.style.top = (y + Math.random() * 20 - 10) + 'px';
    document.querySelector('.canvas-container').appendChild(popup);
    setTimeout(() => { if (popup.parentNode) popup.parentNode.removeChild(popup); }, 1000);
}

function createStatsButton() {
    const button = document.createElement('button');
    button.id = 'statsButton';
    button.className = 'stats-button';
    button.innerHTML = '📊 Stats';
    button.addEventListener('click', toggleStatsPanel);
    button.addEventListener('touchstart', (e) => { e.preventDefault(); toggleStatsPanel(); });
    document.body.appendChild(button);
}

// ============================================
// GAME LOOP AND UPDATE
// ============================================

function updateGame(deltaTime) {
    const currentTime = Date.now();
    checkLandmineTriggers();
    updateHealingTowers(currentTime);
    
    // Slow field effect (wave 30)
    if (bossAbilities.slowField && bossAbilities.slowField.active) {
        const boss = monsters.find(m => m.isBoss && wave === 30);
        if (boss) {
            const inField = Math.hypot(player.x - boss.x, player.y - boss.y) < bossAbilities.slowField.radius;
            const wasInField = player.inSlowField;
            player.inSlowField = inField;
            if (inField) {
                player.speed = (player.baseSpeed * player.speedMultiplier) * 0.5;
                if (currentTime - player.lastSlowFieldTick >= 1000) {
                    player.baseSpeed = Math.max(1, player.baseSpeed - 1);
                    player.speed = (player.baseSpeed * player.speedMultiplier) * 0.5;
                    player.slowFieldTicks++;
                    player.lastSlowFieldTick = currentTime;
                    createDamageIndicator(player.x, player.y, 1, false);
                    queueMessage("Speed decreased by 1!");
                }
            } else if (wasInField) {
                player.speed = player.baseSpeed * player.speedMultiplier;
            }
        }
    }
    
    // Boss enrage (wave 20)
    if (wave === 20 && !bossAbilities.enraged) {
        const boss = monsters.find(m => m.isBoss);
        if (boss && boss.health <= boss.maxHealth / 2) {
            bossAbilities.enraged = true;
            boss.attackCooldown = 800;
            boss.color = '#f44';
            boss.speed = boss.originalSpeed * 1.3;
            queueMessage("BOSS ENRAGED - ATTACK SPEED AND MOVEMENT INCREASED!");
        }
    }
    
    // Boss dash for wave 30
    if (wave === 30 && bossAbilities.bossWeapon) {
        const boss = monsters.find(m => m.isBoss);
        if (boss && !bossAbilities.bossDash && currentTime - bossAbilities.bossDashCooldown > 3000) {
            const dx = player.x - boss.x, dy = player.y - boss.y, dist = Math.hypot(dx, dy);
            const direction = { x: dx / dist, y: dy / dist };
            bossAbilities.bossDash = true;
            bossAbilities.bossDashDirection = direction;
            bossAbilities.bossDashStart = currentTime;
            bossAbilities.bossDashDistance = 0;
            bossAbilities.bossDashTarget = { x: boss.x + direction.x * BOSS_WEAPONS.SCYTHE.dashRange, y: boss.y + direction.y * BOSS_WEAPONS.SCYTHE.dashRange };
            setTimeout(() => { bossAbilities.bossDash = false; bossAbilities.bossDashCooldown = currentTime; bossAbilities.bossDashDistance = 0; }, 500);
        }
        if (bossAbilities.bossDash && bossAbilities.bossDashDirection) {
            const dashSpeed = BOSS_WEAPONS.SCYTHE.dashSpeed;
            boss.x += bossAbilities.bossDashDirection.x * dashSpeed;
            boss.y += bossAbilities.bossDashDirection.y * dashSpeed;
            bossAbilities.bossDashDistance += dashSpeed;
            if (!bossAbilities.bossWeaponAttack && bossAbilities.bossDashDistance < 100) {
                const angle = Math.atan2(player.y - boss.y, player.x - boss.x);
                bossAbilities.bossWeaponAttack = {
                    type: 'melee', x: boss.x, y: boss.y, radius: BOSS_WEAPONS.SCYTHE.range,
                    damage: BOSS_WEAPONS.SCYTHE.baseDamage, color: BOSS_WEAPONS.SCYTHE.swingColor,
                    startTime: currentTime, duration: 300, swingAngle: BOSS_WEAPONS.SCYTHE.swingAngle,
                    meleeType: BOSS_WEAPONS.SCYTHE.meleeType, angle: angle, lifeSteal: BOSS_WEAPONS.SCYTHE.lifeSteal
                };
            }
            if (Math.hypot(player.x - boss.x, player.y - boss.y) < boss.radius + player.radius) {
                const damage = BOSS_WEAPONS.SCYTHE.baseDamage * 0.5;
                player.health -= damage;
                createDamageIndicator(player.x, player.y, damage, true);
                const healAmount = damage * BOSS_WEAPONS.SCYTHE.lifeSteal;
                boss.health = Math.min(boss.maxHealth, boss.health + healAmount);
                createHealthPopup(boss.x, boss.y, Math.floor(healAmount));
            }
        }
    }
    
    // Wave 40 boss: Void Blade
    if (wave === 40 && bossAbilities.bossWeapon) {
        const boss = monsters.find(m => m.isBoss);
        if (boss && Math.hypot(player.x - boss.x, player.y - boss.y) <= bossAbilities.bossWeapon.range && currentTime - (bossAbilities.bossWeapon.lastAttack || 0) > 1500) {
            const angle = Math.atan2(player.y - boss.y, player.x - boss.x);
            bossAbilities.bossWeaponAttack = {
                type: 'melee', x: boss.x, y: boss.y, radius: bossAbilities.bossWeapon.range,
                damage: bossAbilities.bossWeapon.baseDamage, color: bossAbilities.bossWeapon.swingColor,
                startTime: currentTime, duration: 300, swingAngle: bossAbilities.bossWeapon.swingAngle,
                meleeType: bossAbilities.bossWeapon.meleeType, angle: angle,
                pierceCount: 5, voidBlade: true
            };
            bossAbilities.bossWeapon.lastAttack = currentTime;
        }
        // Update void zones
        for (let i = voidZones.length - 1; i >= 0; i--) {
            const zone = voidZones[i];
            if (currentTime - zone.startTime > zone.duration) {
                voidZones.splice(i, 1);
                continue;
            }
            if (Math.hypot(player.x - zone.x, player.y - zone.y) < zone.radius + player.radius) {
                if (!player.lastVoidTick || currentTime - player.lastVoidTick > 500) {
                    player.health -= zone.damage;
                    createDamageIndicator(player.x, player.y, zone.damage, true);
                    player.lastVoidTick = currentTime;
                    if (player.health <= 0) gameOver();
                }
            }
        }
    }
    
    // Boss melee attacks for waves 10 and 20
    if (bossAbilities.bossWeapon && wave !== 30 && wave !== 40) {
        const boss = monsters.find(m => m.isBoss);
        if (boss && Math.hypot(player.x - boss.x, player.y - boss.y) <= bossAbilities.bossWeapon.range && currentTime - (bossAbilities.bossWeapon.lastAttack || 0) > 2000) {
            const angle = Math.atan2(player.y - boss.y, player.x - boss.x);
            bossAbilities.bossWeaponAttack = {
                type: 'melee', x: boss.x, y: boss.y, radius: bossAbilities.bossWeapon.range,
                damage: bossAbilities.bossWeapon.baseDamage, color: bossAbilities.bossWeapon.swingColor,
                startTime: currentTime, duration: 300, swingAngle: bossAbilities.bossWeapon.swingAngle,
                meleeType: bossAbilities.bossWeapon.meleeType, angle: angle,
                pierceCount: bossAbilities.bossWeapon.pierceCount || 1
            };
            bossAbilities.bossWeapon.lastAttack = currentTime;
        }
    }
    
    // Health regeneration
    if ((player.healthRegen > 0 || player.healthRegenPercent > 0) && currentTime - player.lastRegen >= 1000) {
        let regenAmount = 0;
        if (player.healthRegen > 0) regenAmount += player.healthRegen;
        if (player.healthRegenPercent > 0) regenAmount += Math.floor(player.maxHealth * player.healthRegenPercent);
        if (regenAmount > 0 && player.health < player.maxHealth) applyHealing(Math.max(1, regenAmount));
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
    
    if (waveActive && monsters.length === 0 && spawnIndicators.length === 0) { wave++; endWave(); }
    updateUI();
}

function updateMonsters(currentTime) {
    dashers = monsters.filter(m => m.isDasher);
    dashers.forEach(dasher => updateDasher(dasher, currentTime));
    
    monsters.forEach(monster => {
        if (monster.slowed && monster.slowUntil < currentTime) { monster.slowed = false; monster.speed = monster.originalSpeed; }
        if (monster.frozen && monster.frozenUntil < currentTime) { monster.frozen = false; monster.speed = monster.originalSpeed; }
        if (monster.stunned && monster.stunnedUntil < currentTime) monster.stunned = false;
        if (monster.stunned || monster.frozen) return;
        if (monster.isDasher && monster.isDashing) return;
        
        let targetX = player.x, targetY = player.y, targetIsTower = false, targetTower = null;
        if (playerTowers.healingTowers.active.length > 0) {
            let closestTowerDist = Infinity, closestTower = null;
            playerTowers.healingTowers.active.forEach(tower => {
                const dist = Math.hypot(tower.x - monster.x, tower.y - monster.y);
                if (dist < closestTowerDist) { closestTowerDist = dist; closestTower = tower; }
            });
            const distToPlayer = Math.hypot(player.x - monster.x, player.y - monster.y);
            if (closestTower && closestTowerDist < distToPlayer) {
                targetX = closestTower.x; targetY = closestTower.y;
                targetIsTower = true; targetTower = closestTower;
            }
        }
        
        const moveDir = findPathToTarget(monster, { x: targetX, y: targetY });
        if (moveDir.x !== 0 || moveDir.y !== 0) {
            monster.x += moveDir.x * monster.speed;
            monster.y += moveDir.y * monster.speed;
        }
        
        if (monster.isGunner && currentTime - monster.lastAttack >= monster.attackCooldown) {
            shootGunnerProjectile(monster);
            monster.lastAttack = currentTime;
        }
        if (monster.isBoss && currentTime - monster.lastAttack >= monster.attackCooldown) {
            shootBossProjectiles(monster);
            monster.lastAttack = currentTime;
        }
        
        const distToTarget = Math.hypot(targetX - monster.x, targetY - monster.y);
        if (distToTarget < monster.radius + (targetIsTower ? 20 : player.radius) && currentTime - monster.lastAttack >= monster.attackCooldown) {
            if (targetIsTower && targetTower) {
                targetTower.health -= monster.damage;
                createDamageIndicator(targetTower.x, targetTower.y, monster.damage, false);
                if (targetTower.health <= 0) {
                    const index = playerTowers.healingTowers.active.indexOf(targetTower);
                    if (index > -1) {
                        playerTowers.healingTowers.active.splice(index, 1);
                        addVisualEffect({ type: 'explosion', x: targetTower.x, y: targetTower.y, radius: 30, color: '#8B0000', startTime: currentTime, duration: 300 });
                        queueMessage("Healing Tower destroyed!");
                    }
                }
            } else {
                let actualDamage = monster.damage;
                if (Math.random() < player.dodgeChance) { queueMessage("DODGE!"); monster.lastAttack = currentTime; return; }
                if (player.firstHitActive) { actualDamage *= 0.5; player.firstHitActive = false; queueMessage("Runic Plate absorbed 50% damage!"); }
                if (player.damageReduction > 0) actualDamage *= (1 - player.damageReduction);
                player.health -= actualDamage;
                
                if (monster.isVampire && monster.lifeSteal > 0) {
                    const healAmount = Math.floor(actualDamage * monster.lifeSteal);
                    monster.health = Math.min(monster.maxHealth, monster.health + healAmount);
                    createHealthPopup(monster.x, monster.y, healAmount);
                }
                if (player.thornsDamage > 0) {
                    const thornsDamage = Math.floor(actualDamage * player.thornsDamage);
                    if (thornsDamage > 0) {
                        monster.health -= thornsDamage;
                        createDamageIndicator(monster.x, monster.y, thornsDamage, false);
                    }
                }
                createDamageIndicator(player.x, player.y, Math.floor(actualDamage), false);
                if (player.health <= 0) gameOver();
            }
            monster.lastAttack = currentTime;
        }
    });
}

function updateGroundEffects(currentTime) {
    for (let i = groundFire.length - 1; i >= 0; i--) {
        const fire = groundFire[i];
        if (currentTime - fire.startTime > fire.duration) { groundFire.splice(i, 1); continue; }
        monsters.forEach(monster => {
            if (Math.hypot(monster.x - fire.x, monster.y - fire.y) < fire.radius + monster.radius) {
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
        if (currentTime - cloud.startTime > cloud.duration) { poisonClouds.splice(i, 1); continue; }
        monsters.forEach(monster => {
            if (Math.hypot(monster.x - cloud.x, monster.y - cloud.y) < cloud.radius + monster.radius) {
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
            if (Math.hypot(monster.x - trap.x, monster.y - trap.y) < trap.radius + monster.radius) {
                monster.health -= trap.damage;
                createDamageIndicator(monster.x, monster.y, trap.damage, true);
                trap.active = false;
            }
        });
        if (!trap.active) activeTraps.splice(i, 1);
    }
}

// ============================================
// DRAWING FUNCTIONS
// ============================================

function gameLoop() {
    const currentTime = Date.now();
    const deltaTime = currentTime - lastFrameTime;
    lastFrameTime = currentTime;
    
    if (gameState === 'wave') {
        let moveX = 0, moveY = 0;
        if (keys.w || keys.up) moveY -= 1;
        if (keys.s || keys.down) moveY += 1;
        if (keys.a || keys.left) moveX -= 1;
        if (keys.d || keys.right) moveX += 1;
        if (joystickActive) {
            const strength = Math.min(1, Math.hypot(joystickCurrentX, joystickCurrentY) / joystickMaxDistance);
            moveX += (joystickCurrentX / joystickMaxDistance) * strength;
            moveY += (joystickCurrentY / joystickMaxDistance) * strength;
        }
        if (moveX !== 0 || moveY !== 0) {
            const length = Math.hypot(moveX, moveY);
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
    if (gameState === 'wave') updateGame(deltaTime);
    drawSpawnIndicators();
    drawTowers();
    drawBombs();
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
    if (gameState === 'wave' || gameState === 'shop' || gameState === 'statSelect') updateWeaponDisplay();
    requestAnimationFrame(gameLoop);
}

function drawGrid() {
    ctx.strokeStyle = 'rgba(100,100,150,0.1)';
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

function drawBombs() {
    placedBombs.forEach(bomb => {
        if (!bomb.active) return;
        ctx.save();
        ctx.translate(bomb.x, bomb.y);
        const timeLeft = bomb.detonateTime - Date.now();
        const progress = Math.max(0, Math.min(1, timeLeft / 2000));
        const pulse = Math.sin(Date.now() * 0.01) * 0.2 + 0.8;
        ctx.shadowColor = '#F00';
        ctx.shadowBlur = 20;
        ctx.strokeStyle = '#FFA500';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, bomb.radius * (1 + (1 - progress)), 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(0, 0, bomb.radius * pulse, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#FFA500';
        ctx.beginPath();
        ctx.arc(0, -bomb.radius, 3, 0, Math.PI * 2);
        ctx.fill();
        if (progress < 0.2) {
            ctx.fillStyle = '#F00';
            ctx.beginPath();
            ctx.arc(0, -bomb.radius - 5, 2, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.fillStyle = '#FFF';
        ctx.font = 'bold 10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${Math.ceil(timeLeft / 1000)}s`, 0, bomb.radius + 15);
        ctx.restore();
    });
}

function drawHealingTowers() {
    playerTowers.healingTowers.active.forEach(tower => {
        ctx.save();
        ctx.translate(tower.x, tower.y);
        ctx.fillStyle = '#2E7D32';
        ctx.shadowColor = '#4CAF50';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(0, 0, tower.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#FFF';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('+', 0, 0);
        const healthPercent = tower.health / 30;
        ctx.fillStyle = '#000';
        ctx.fillRect(-tower.radius, -tower.radius - 10, tower.radius * 2, 5);
        ctx.fillStyle = '#0F0';
        ctx.fillRect(-tower.radius, -tower.radius - 10, tower.radius * 2 * healthPercent, 5);
        ctx.restore();
    });
}

function drawTowers() {
    playerTowers.landmines.active.forEach(mine => {
        ctx.save();
        ctx.translate(mine.x, mine.y);
        const pulse = Math.sin(Date.now() * 0.01) * 0.2 + 0.8;
        ctx.shadowColor = '#8B4513';
        ctx.shadowBlur = 15;
        ctx.strokeStyle = '#F00';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, mine.radius * pulse, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = mine.color;
        ctx.beginPath();
        ctx.arc(0, 0, mine.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#FF4500';
        ctx.beginPath();
        ctx.arc(0, 0, mine.radius * 0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#FFF';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('💣', 0, 0);
        ctx.restore();
    });
    drawHealingTowers();
}

function drawSpawnIndicators() {
    const currentTime = Date.now();
    for (let i = spawnIndicators.length - 1; i >= 0; i--) {
        const indicator = spawnIndicators[i];
        const elapsed = currentTime - indicator.startTime;
        const progress = elapsed / indicator.timer;
        if (elapsed > indicator.timer) { spawnIndicators.splice(i, 1); continue; }
        const pulseScale = 1 + Math.sin(progress * Math.PI * 4) * 0.2;
        const alpha = 1 - progress * 0.5;
        ctx.save();
        ctx.translate(indicator.x, indicator.y);
        if (indicator.isBoss) {
            ctx.strokeStyle = `rgba(255,215,0,${alpha})`;
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
        } else {
            ctx.strokeStyle = `rgba(255,0,0,${alpha})`;
            ctx.lineWidth = 3;
            ctx.shadowColor = '#f00';
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
        ctx.save();
        ctx.translate(boss.x, boss.y);
        const pulse = Math.sin(Date.now() * 0.005) * 0.1 + 0.9;
        ctx.fillStyle = `rgba(100,100,255,0.3)`;
        ctx.shadowColor = '#6464ff';
        ctx.shadowBlur = 30;
        ctx.beginPath();
        ctx.arc(0, 0, bossAbilities.slowField.radius * pulse, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = `rgba(200,200,255,0.3)`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, bossAbilities.slowField.radius * 0.7, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = 'white';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('SLOW FIELD', 0, -bossAbilities.slowField.radius - 20);
        if (player.inSlowField && player.slowFieldTicks > 0) {
            ctx.fillStyle = 'rgba(255,100,100,0.9)';
            ctx.font = 'bold 14px Arial';
            ctx.fillText(`Speed Lost: ${player.slowFieldTicks}`, 0, bossAbilities.slowField.radius + 30);
        }
        ctx.restore();
    }
}

function drawProjectiles() {
    const currentTime = Date.now();
    player.projectiles.forEach(projectile => {
        ctx.save();
        if (projectile.isBoomerang) drawBoomerangProjectile(ctx, projectile, currentTime);
        else if (projectile.weaponId === 'shotgun') drawShotgunPellet(ctx, projectile, currentTime);
        else if (projectile.weaponId === 'laser') drawLaserProjectile(ctx, projectile, currentTime);
        else if (projectile.weaponId === 'machinegun') drawMachinegunProjectile(ctx, projectile, currentTime);
        else if (projectile.animation === 'knife') drawThrowingKnife(ctx, projectile, currentTime);
        else if (projectile.weaponId === 'sniper') drawSniperProjectile(ctx, projectile, currentTime);
        else if (projectile.weaponId === 'crossbow') drawCrossbowProjectile(ctx, projectile, currentTime);
        else {
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
            ctx.moveTo(projectile.x - Math.cos(projectile.angle) * 10, projectile.y - Math.sin(projectile.angle) * 10);
            ctx.lineTo(projectile.x, projectile.y);
            ctx.stroke();
        }
        ctx.restore();
    });
}

function drawSniperProjectile(ctx, projectile, currentTime) {
    ctx.save();
    ctx.translate(projectile.x, projectile.y);
    ctx.shadowColor = '#FF4500';
    ctx.shadowBlur = 20;
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(0, 0, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#FF4500';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-Math.cos(projectile.angle) * 15, -Math.sin(projectile.angle) * 15);
    ctx.lineTo(0, 0);
    ctx.stroke();
    const age = currentTime - projectile.startTime;
    if (age < 100) {
        ctx.fillStyle = `rgba(255,200,0,${1 - age/100})`;
        ctx.shadowBlur = 30;
        ctx.beginPath();
        ctx.arc(-Math.cos(projectile.angle) * 10, -Math.sin(projectile.angle) * 10, 8, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.restore();
}

function drawCrossbowProjectile(ctx, projectile, currentTime) {
    ctx.save();
    ctx.translate(projectile.x, projectile.y);
    ctx.rotate(projectile.angle);
    ctx.shadowColor = '#8B4513';
    ctx.shadowBlur = 15;
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(-15, -2, 30, 4);
    ctx.fillStyle = '#C0C0C0';
    ctx.beginPath();
    ctx.moveTo(15, -3);
    ctx.lineTo(25, 0);
    ctx.lineTo(15, 3);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#F00';
    ctx.beginPath();
    ctx.moveTo(-15, -4);
    ctx.lineTo(-25, -8);
    ctx.lineTo(-15, -2);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-15, 4);
    ctx.lineTo(-25, 8);
    ctx.lineTo(-15, 2);
    ctx.closePath();
    ctx.fill();
    if (projectile.pierceCount && projectile.pierceCount < 3) {
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 2;
        ctx.shadowColor = '#FFD700';
        ctx.beginPath();
        ctx.arc(0, 0, 8, 0, Math.PI * 2);
        ctx.stroke();
    }
    ctx.restore();
}

function drawThrowingKnife(ctx, projectile, currentTime) {
    projectile.rotation = (projectile.rotation || 0) + (projectile.spinSpeed || 0);
    ctx.save();
    ctx.translate(projectile.x, projectile.y);
    ctx.rotate(projectile.rotation);
    ctx.shadowColor = '#C0C0C0';
    ctx.shadowBlur = 15;
    ctx.fillStyle = '#C0C0C0';
    ctx.strokeStyle = '#808080';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, -projectile.size);
    ctx.lineTo(projectile.size, 0);
    ctx.lineTo(0, projectile.size);
    ctx.lineTo(-projectile.size, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(-projectile.size * 0.3, -projectile.size * 0.8, projectile.size * 0.6, projectile.size * 1.6);
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
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
        ctx.fillStyle = '#FFF';
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
        ctx.fillStyle = '#FFF';
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(0, 0, proj.radius, 0, Math.PI * 2);
        ctx.fill();
        if (proj.isHoming) {
            ctx.strokeStyle = '#FF0';
            ctx.lineWidth = 2;
            ctx.globalAlpha = alpha * 0.8;
            ctx.beginPath();
            ctx.arc(0, 0, proj.radius + 5, 0, Math.PI * 2);
            ctx.stroke();
            for (let i = 0; i < 3; i++) {
                ctx.beginPath();
                ctx.moveTo(Math.cos(i * Math.PI * 2 / 3) * (proj.radius + 8), Math.sin(i * Math.PI * 2 / 3) * (proj.radius + 8));
                ctx.lineTo(Math.cos((i + 0.5) * Math.PI * 2 / 3) * (proj.radius + 3), Math.sin((i + 0.5) * Math.PI * 2 / 3) * (proj.radius + 3));
                ctx.stroke();
            }
        }
        ctx.restore();
    });
}

function drawBoomerangProjectile(ctx, projectile, currentTime) {
    projectile.rotation = (projectile.rotation || 0) + 0.1;
    if (boomerangImage.complete && boomerangImage.naturalHeight) {
        ctx.save();
        ctx.translate(projectile.x, projectile.y);
        ctx.rotate(projectile.rotation);
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
                ctx.rotate(projectile.rotation - i * 0.1);
                ctx.drawImage(boomerangImage, -15, -15, 30, 30);
                ctx.restore();
            }
            ctx.restore();
        }
    } else {
        ctx.save();
        ctx.translate(projectile.x, projectile.y);
        ctx.rotate(projectile.rotation);
        ctx.shadowColor = 'rgba(139,69,19,0.5)';
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
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.beginPath();
    ctx.arc(projectile.x - Math.cos(projectile.angle) * 5, projectile.y - Math.sin(projectile.angle) * 5, 2, 0, Math.PI * 2);
    ctx.fill();
}

function drawLaserProjectile(ctx, projectile, currentTime) {
    const pulse = Math.sin(currentTime * 0.02) * 2;
    ctx.shadowColor = '#0FF';
    ctx.shadowBlur = 20;
    ctx.strokeStyle = '#0FF';
    ctx.lineWidth = 4 + pulse;
    ctx.beginPath();
    ctx.moveTo(projectile.x - Math.cos(projectile.angle) * 10, projectile.y - Math.sin(projectile.angle) * 10);
    ctx.lineTo(projectile.x, projectile.y);
    ctx.stroke();
    ctx.strokeStyle = '#FFF';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(projectile.x - Math.cos(projectile.angle) * 10, projectile.y - Math.sin(projectile.angle) * 10);
    ctx.lineTo(projectile.x, projectile.y);
    ctx.stroke();
    ctx.fillStyle = 'rgba(0,255,255,0.3)';
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
        ctx.fillStyle = `rgba(255,215,0,${0.3 - i * 0.1})`;
        ctx.beginPath();
        ctx.arc(projectile.x - Math.cos(projectile.angle) * i * 8, projectile.y - Math.sin(projectile.angle) * i * 8, 2, 0, Math.PI * 2);
        ctx.fill();
    }
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
            case 'dual_daggers': drawDualDaggers(ctx, attack, angle, progress, distance, alpha); break;
            default: drawDefaultMelee(ctx, attack, angle, progress, distance, alpha); break;
        }
        ctx.restore();
    });
}

function drawDualDaggers(ctx, attack, angle, progress, distance, alpha) {
    ctx.save();
    ctx.rotate(angle - 0.2);
    ctx.translate(distance * 0.8, 0);
    ctx.shadowColor = 'rgba(70,130,180,0.5)';
    ctx.shadowBlur = 10 * alpha;
    ctx.fillStyle = attack.bladeColor || '#4682B4';
    ctx.beginPath();
    ctx.moveTo(0, -3);
    ctx.lineTo(30, -1);
    ctx.lineTo(30, 1);
    ctx.lineTo(0, 3);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = attack.hiltColor || '#2F4F4F';
    ctx.fillRect(-5, -4, 8, 8);
    ctx.fillStyle = attack.sparkleColor || '#0FF';
    ctx.globalAlpha = alpha * 0.3;
    ctx.beginPath();
    ctx.arc(30, 0, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    ctx.save();
    ctx.rotate(angle + 0.2);
    ctx.translate(distance * 0.8, 0);
    ctx.shadowColor = 'rgba(70,130,180,0.5)';
    ctx.shadowBlur = 10 * alpha;
    ctx.fillStyle = attack.bladeColor || '#4682B4';
    ctx.beginPath();
    ctx.moveTo(0, -3);
    ctx.lineTo(30, -1);
    ctx.lineTo(30, 1);
    ctx.lineTo(0, 3);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = attack.hiltColor || '#2F4F4F';
    ctx.fillRect(-5, -4, 8, 8);
    ctx.fillStyle = attack.sparkleColor || '#0FF';
    ctx.globalAlpha = alpha * 0.3;
    ctx.beginPath();
    ctx.arc(30, 0, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    if (progress < 0.5) {
        ctx.save();
        ctx.rotate(angle);
        ctx.strokeStyle = `rgba(255,255,255,${alpha * 0.3})`;
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
    if (progress < 0 || progress > 1) { bossAbilities.bossWeaponAttack = null; return; }
    ctx.save();
    ctx.translate(attack.x, attack.y);
    const angle = attack.angle;
    const distance = attack.radius * (progress * 1.2);
    const alpha = 1 - progress * 0.7;
    if (wave === 10) drawBossDagger(ctx, attack, angle, progress, distance, alpha);
    else if (wave === 20) drawBossHammer(ctx, attack, angle, progress, distance, alpha);
    else if (wave === 30) drawBossScythe(ctx, attack, angle, progress, distance, alpha);
    else if (wave === 40) drawVoidBlade(ctx, attack, angle, progress, distance, alpha);
    ctx.restore();
}

function drawBossDagger(ctx, attack, angle, progress, distance, alpha) {
    const stabProgress = Math.min(progress * 2, 1);
    const stabDistance = distance * 1.5;
    ctx.rotate(angle);
    ctx.translate(stabDistance, 0);
    ctx.shadowColor = 'rgba(139,0,0,0.7)';
    ctx.shadowBlur = 20 * alpha;
    ctx.save();
    const bladeGradient = ctx.createLinearGradient(0, -5, 60, -5);
    bladeGradient.addColorStop(0, '#8B0000');
    bladeGradient.addColorStop(1, '#F44');
    ctx.fillStyle = bladeGradient;
    ctx.beginPath();
    ctx.moveTo(0, -5);
    ctx.lineTo(60, -3);
    ctx.lineTo(60, 3);
    ctx.lineTo(0, 5);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
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
        ctx.fillStyle = `rgba(255,0,0,${alpha})`;
        ctx.shadowColor = 'rgba(255,0,0,0.7)';
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
    const smashY = progress < 0.3 ? -lift : (progress > 0.6 ? (progress - 0.6) * 60 : 0);
    ctx.translate(30, -50 + lift - smashY);
    ctx.shadowColor = 'rgba(105,105,105,0.7)';
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
        ctx.strokeStyle = `rgba(255,69,0,${alpha * (1 - shockProgress)})`;
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
    ctx.shadowColor = 'rgba(75,0,130,0.7)';
    ctx.shadowBlur = 20 * alpha;
    if (scytheImage.complete && scytheImage.naturalHeight) {
        ctx.save();
        ctx.translate(40, -20);
        ctx.rotate(-0.3);
        ctx.scale(1.5, 1.5);
        ctx.shadowColor = 'rgba(148,0,211,0.7)';
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
        ctx.shadowColor = 'rgba(148,0,211,0.7)';
        ctx.beginPath();
        ctx.moveTo(0, -15);
        ctx.lineTo(80, -25);
        ctx.lineTo(80, -5);
        ctx.lineTo(0, 15);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = `rgba(255,105,180,${alpha})`;
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
        ctx.strokeStyle = `rgba(148,0,211,${alpha * 0.3})`;
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
        ctx.fillStyle = `rgba(255,105,180,${alpha * 0.5})`;
        ctx.beginPath();
        ctx.arc(0, 0, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

function drawVoidBlade(ctx, attack, angle, progress, distance, alpha) {
    const swingProgress = Math.sin(progress * Math.PI);
    const currentAngle = angle - 1.5 + swingProgress * 3;
    ctx.rotate(currentAngle);
    ctx.shadowColor = '#6a0dad';
    ctx.shadowBlur = 25 * alpha;
    ctx.save();
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(-8, -attack.radius * 0.6, 16, attack.radius * 1.2);
    ctx.restore();
    ctx.save();
    ctx.translate(0, -attack.radius * 0.4);
    ctx.rotate(-0.4);
    const bladeGradient = ctx.createLinearGradient(0, -25, 90, -25);
    bladeGradient.addColorStop(0, '#0f0f1f');
    bladeGradient.addColorStop(1, '#6a0dad');
    ctx.fillStyle = bladeGradient;
    ctx.shadowColor = '#9b59b6';
    ctx.beginPath();
    ctx.moveTo(0, -20);
    ctx.lineTo(90, -30);
    ctx.lineTo(90, -10);
    ctx.lineTo(0, 20);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = `rgba(155,89,182,${alpha})`;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(90, -30);
    ctx.lineTo(90, -10);
    ctx.stroke();
    ctx.fillStyle = `rgba(106,13,173,${alpha * 0.3})`;
    ctx.beginPath();
    ctx.arc(90, -20, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    if (progress > 0.3 && progress < 0.9) {
        ctx.save();
        ctx.rotate(0);
        ctx.strokeStyle = `rgba(106,13,173,${alpha * 0.4})`;
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(30, -30);
        ctx.lineTo(110, -50);
        ctx.stroke();
        ctx.restore();
    }
}

function drawSword(ctx, attack, angle, progress, distance, alpha) {
    const swingProgress = Math.sin(progress * Math.PI);
    const currentAngle = angle - 0.5 + swingProgress * 1;
    ctx.rotate(currentAngle);
    ctx.shadowColor = 'rgba(255,255,255,0.5)';
    ctx.shadowBlur = 10 * alpha;
    ctx.save();
    ctx.translate(10, 0);
    const gradient = ctx.createLinearGradient(0, -5, attack.radius * 0.9, -5);
    gradient.addColorStop(0, '#C0C0C0');
    gradient.addColorStop(1, '#E8E8E8');
    ctx.fillStyle = gradient;
    ctx.shadowColor = 'rgba(192,192,192,0.5)';
    ctx.shadowBlur = 15 * alpha;
    ctx.beginPath();
    ctx.moveTo(0, -5);
    ctx.lineTo(attack.radius * 0.9, -2);
    ctx.lineTo(attack.radius * 0.9, 2);
    ctx.lineTo(0, 5);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, -5);
    ctx.lineTo(attack.radius * 0.9, -2);
    ctx.moveTo(0, 5);
    ctx.lineTo(attack.radius * 0.9, 2);
    ctx.stroke();
    ctx.fillStyle = '#FFD700';
    ctx.shadowColor = 'rgba(255,215,0,0.7)';
    ctx.beginPath();
    ctx.arc(attack.radius * 0.9, 0, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    ctx.save();
    ctx.fillStyle = '#8B4513';
    ctx.shadowColor = 'rgba(139,69,19,0.5)';
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
        ctx.strokeStyle = `rgba(255,255,255,${alpha * 0.5})`;
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
    ctx.shadowColor = 'rgba(139,69,19,0.5)';
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
    ctx.shadowColor = 'rgba(205,127,50,0.7)';
    ctx.beginPath();
    ctx.moveTo(0, -10);
    ctx.lineTo(35, -15);
    ctx.lineTo(35, -5);
    ctx.lineTo(0, 10);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(35, -15);
    ctx.lineTo(35, -5);
    ctx.stroke();
    ctx.restore();
    if (attack.meleeType === 'aoe' && progress > 0.3 && progress < 0.7) {
        ctx.save();
        ctx.rotate(0);
        ctx.strokeStyle = `rgba(255,165,0,${alpha * 0.5})`;
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
    ctx.shadowColor = 'rgba(70,130,180,0.5)';
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
    ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
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
        ctx.fillStyle = `rgba(0,255,255,${alpha})`;
        ctx.shadowColor = 'rgba(0,255,255,0.7)';
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
    const smashY = progress < 0.3 ? -lift : (progress > 0.6 ? (progress - 0.6) * 40 : 0);
    ctx.translate(20, -30 + lift - smashY);
    ctx.shadowColor = 'rgba(105,105,105,0.7)';
    ctx.shadowBlur = 20 * alpha;
    ctx.save();
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(-3, 0, 6, 50);
    ctx.restore();
    ctx.save();
    ctx.translate(0, -15);
    ctx.fillStyle = '#696969';
    ctx.shadowColor = 'rgba(105,105,105,0.7)';
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
        ctx.strokeStyle = `rgba(255,69,0,${alpha * (1 - shockProgress)})`;
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
    ctx.shadowColor = 'rgba(50,205,50,0.5)';
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
    ctx.shadowColor = 'rgba(255,215,0,0.7)';
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
    ctx.fillStyle = attack.color || '#FFF';
    ctx.shadowColor = attack.color || '#FFF';
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
        ctx.fillStyle = '#F00';
        ctx.shadowColor = '#F00';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(trap.x, trap.y, 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#FFF';
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
    let moveX = 0, moveY = 0;
    if (keys.w || keys.up) moveY -= 1;
    if (keys.s || keys.down) moveY += 1;
    if (keys.a || keys.left) moveX -= 1;
    if (keys.d || keys.right) moveX += 1;
    if (joystickActive) {
        const strength = Math.min(1, Math.hypot(joystickCurrentX, joystickCurrentY) / joystickMaxDistance);
        moveX += (joystickCurrentX / joystickMaxDistance) * strength;
        moveY += (joystickCurrentY / joystickMaxDistance) * strength;
    }
    const isMoving = moveX !== 0 || moveY !== 0;
    let facingAngle = player.lastFacingAngle || 0;
    if (isMoving) { facingAngle = Math.atan2(moveY, moveX); player.lastFacingAngle = facingAngle; }
    else facingAngle = Math.atan2(mouseY - player.y, mouseX - player.x);
    player.facingAngle = facingAngle;
    ctx.shadowColor = 'rgba(255,107,107,0.5)';
    ctx.shadowBlur = 15;
    ctx.fillStyle = player.color;
    ctx.beginPath();
    ctx.arc(0, 0, player.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = '#FFF';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, player.radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.save();
    ctx.rotate(facingAngle);
    ctx.fillStyle = '#FFF';
    ctx.shadowBlur = 5;
    ctx.shadowColor = '#FFF';
    ctx.beginPath();
    ctx.arc(8, -5, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(8, 5, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#000';
    ctx.shadowBlur = 0;
    let pupilX = 8, pupilY = -5;
    if (isMoving) {
        pupilX += Math.cos(facingAngle) * 1.5;
        pupilY += Math.sin(facingAngle) * 1.5;
    } else {
        const mouseAngle = Math.atan2(mouseY - player.y, mouseX - player.x) - facingAngle;
        pupilX += Math.cos(mouseAngle) * 1.5;
        pupilY += Math.sin(mouseAngle) * 1.5;
    }
    ctx.beginPath();
    ctx.arc(pupilX, pupilY - 5, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(pupilX, pupilY + 5, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    if (isMoving) {
        ctx.beginPath();
        ctx.moveTo(12, -2);
        ctx.lineTo(18, 0);
        ctx.lineTo(12, 2);
        ctx.stroke();
    } else {
        ctx.beginPath();
        ctx.moveTo(12, -1);
        ctx.lineTo(18, 0);
        ctx.moveTo(12, 1);
        ctx.lineTo(18, 0);
        ctx.stroke();
    }
    ctx.restore();
    ctx.save();
    ctx.rotate(facingAngle);
    ctx.strokeStyle = '#fc0';
    ctx.lineWidth = 3;
    ctx.shadowColor = '#fc0';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.moveTo(player.radius + 2, 0);
    ctx.lineTo(player.radius + 15, 0);
    ctx.stroke();
    ctx.fillStyle = '#fc0';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(player.radius + 18, 0, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    if (player.firstHitReduction && player.firstHitActive) {
        ctx.shadowColor = '#0FF';
        ctx.shadowBlur = 20;
        ctx.strokeStyle = '#0FF';
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
        ctx.shadowColor = '#F00';
        ctx.shadowBlur = 30;
        ctx.strokeStyle = '#F00';
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
            ctx.fillStyle = 'rgba(255,100,100,0.9)';
            ctx.font = 'bold 14px Arial';
            ctx.textAlign = 'center';
            ctx.shadowColor = '#f00';
            ctx.shadowBlur = 10;
            ctx.fillText(`-${player.slowFieldTicks} SPD`, 0, -player.radius - 20);
        }
    }
    ctx.restore();
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
            ctx.fillStyle = 'rgba(255,255,0,0.3)';
            ctx.beginPath();
            ctx.arc(0, 0, monster.radius, 0, Math.PI * 2);
            ctx.fill();
        }
        if (monster.frozen && monster.frozenUntil > currentTime) {
            ctx.fillStyle = 'rgba(0,255,255,0.3)';
            ctx.beginPath();
            ctx.arc(0, 0, monster.radius, 0, Math.PI * 2);
            ctx.fill();
        }
        if (monster.isDasher && monster.isDashing) {
            ctx.strokeStyle = '#0FF';
            ctx.lineWidth = 3;
            ctx.shadowColor = '#0FF';
            ctx.shadowBlur = 15;
            ctx.beginPath();
            ctx.arc(0, 0, monster.radius + 5, 0, Math.PI * 2);
            ctx.stroke();
        }
        if (monster.isVampire) {
            ctx.strokeStyle = '#F00';
            ctx.lineWidth = 2;
            ctx.shadowColor = '#F00';
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.arc(0, 0, monster.radius + 3, 0, Math.PI * 2);
            ctx.stroke();
        }
        ctx.shadowBlur = 0;
        ctx.strokeStyle = '#000';
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
        ctx.fillStyle = '#FFF';
        ctx.shadowBlur = 5;
        ctx.beginPath();
        ctx.arc(Math.cos(angleToPlayer - 0.3) * monster.radius * 0.6, Math.sin(angleToPlayer - 0.3) * monster.radius * 0.6, eyeRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(Math.cos(angleToPlayer + 0.3) * monster.radius * 0.6, Math.sin(angleToPlayer + 0.3) * monster.radius * 0.6, eyeRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#000';
        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.arc(Math.cos(angleToPlayer) * monster.radius * 0.7, Math.sin(angleToPlayer) * monster.radius * 0.7, eyeRadius * 0.5, 0, Math.PI * 2);
        ctx.fill();
        const healthPercent = Math.max(0, Math.min(1, monster.health / monster.maxHealth));
        const barWidth = monster.radius * 2, barHeight = 4, barX = -monster.radius, barY = -monster.radius - 10;
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(barX, barY, barWidth, barHeight);
        if (healthPercent > 0) {
            ctx.fillStyle = healthPercent > 0.5 ? '#0F0' : (healthPercent > 0.2 ? '#FF0' : '#F00');
            ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);
        }
        ctx.restore();
    });
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
                ctx.fillStyle = `rgba(255,0,0,${alpha})`;
                for (let i = 0; i < 8; i++) {
                    const angle = (Math.PI * 2 * i) / 8 + progress * Math.PI;
                    const distance = progress * 30;
                    ctx.beginPath();
                    ctx.arc(effect.x + Math.cos(angle) * distance, effect.y + Math.sin(angle) * distance, 3, 0, Math.PI * 2);
                    ctx.fill();
                }
                break;
            case 'spawn':
                ctx.strokeStyle = effect.color || '#fff';
                ctx.lineWidth = 3 * (1 - progress);
                ctx.shadowColor = effect.color || '#fff';
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
                gradient.addColorStop(0.5, `rgba(255,100,0,${alpha * 0.7})`);
                gradient.addColorStop(1, 'rgba(0,0,0,0)');
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
                expGradient.addColorStop(0, `rgba(255,255,255,${alpha})`);
                expGradient.addColorStop(0.3, `rgba(255,200,0,${alpha})`);
                expGradient.addColorStop(0.6, `rgba(255,100,0,${alpha * 0.7})`);
                expGradient.addColorStop(1, `rgba(255,0,0,0)`);
                ctx.fillStyle = expGradient;
                ctx.shadowColor = '#FF4500';
                ctx.shadowBlur = 30;
                ctx.beginPath();
                ctx.arc(effect.x, effect.y, explosionSize, 0, Math.PI * 2);
                ctx.fill();
                break;
            case 'heal':
                ctx.fillStyle = `rgba(0,255,0,${alpha * 0.3})`;
                ctx.shadowColor = '#0F0';
                ctx.shadowBlur = 15 * alpha;
                ctx.beginPath();
                ctx.arc(effect.x, effect.y, effect.radius * (1 + progress), 0, Math.PI * 2);
                ctx.fill();
                break;
            default:
                break;
        }
        ctx.restore();
    });
}

// ============================================
// EVENT HANDLERS
// ============================================

document.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    if (key === 'w' || key === 'arrowup') { keys.w = true; keys.up = true; e.preventDefault(); }
    if (key === 's' || key === 'arrowdown') { keys.s = true; keys.down = true; e.preventDefault(); }
    if (key === 'a' || key === 'arrowleft') { keys.a = true; keys.left = true; e.preventDefault(); }
    if (key === 'd' || key === 'arrowright') { keys.d = true; keys.right = true; e.preventDefault(); }
    if (key === ' ') { if (gameState === 'shop') { keys.space = true; nextWaveBtn.click(); } e.preventDefault(); }
    if (key === 'r') { if (gameState === 'shop') { player.weapons.forEach(w => { if (w.usesAmmo && !w.isReloading && !w.isThrowable) w.startReload(); }); } e.preventDefault(); }
    if (key === 's' && e.ctrlKey) { e.preventDefault(); saveGame(); }
    if (key === 'l' && e.ctrlKey) { e.preventDefault(); loadGame(); }
});

document.addEventListener('keyup', (e) => {
    const key = e.key.toLowerCase();
    if (key === 'w' || key === 'arrowup') { keys.w = false; keys.up = false; e.preventDefault(); }
    if (key === 's' || key === 'arrowdown') { keys.s = false; keys.down = false; e.preventDefault(); }
    if (key === 'a' || key === 'arrowleft') { keys.a = false; keys.left = false; e.preventDefault(); }
    if (key === 'd' || key === 'arrowright') { keys.d = false; keys.right = false; e.preventDefault(); }
    if (key === ' ') { keys.space = false; e.preventDefault(); }
});

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

canvas.addEventListener('touchend', (e) => { e.preventDefault(); });
canvas.addEventListener('touchcancel', (e) => { e.preventDefault(); });
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
});

startGameBtn.addEventListener('click', (e) => { e.preventDefault(); initGame(); });
startGameBtn.addEventListener('touchstart', (e) => { e.preventDefault(); initGame(); });
nextWaveBtn.addEventListener('click', (e) => { e.preventDefault(); if (gameState === 'shop') { gameState = 'wave'; startWave(); nextWaveBtn.style.display = 'none'; scrapWeaponBtn.style.display = 'none'; mergeWeaponBtn.style.display = 'none'; selectedWeaponIndex = -1; mergeTargetIndex = -1; } });
nextWaveBtn.addEventListener('touchstart', (e) => { e.preventDefault(); if (gameState === 'shop') { gameState = 'wave'; startWave(); nextWaveBtn.style.display = 'none'; scrapWeaponBtn.style.display = 'none'; mergeWeaponBtn.style.display = 'none'; selectedWeaponIndex = -1; mergeTargetIndex = -1; } });
scrapWeaponBtn.addEventListener('click', (e) => { e.preventDefault(); scrapWeapon(); });
scrapWeaponBtn.addEventListener('touchstart', (e) => { e.preventDefault(); scrapWeapon(); });
mergeWeaponBtn.addEventListener('click', (e) => { e.preventDefault(); mergeWeapons(); });
mergeWeaponBtn.addEventListener('touchstart', (e) => { e.preventDefault(); mergeWeapons(); });
refreshShopBtn.addEventListener('click', (e) => { e.preventDefault(); refreshShop(); });
refreshShopBtn.addEventListener('touchstart', (e) => { e.preventDefault(); refreshShop(); });
restartBtn.addEventListener('click', (e) => { e.preventDefault(); gameOverOverlay.style.display = 'none'; clearSave(); initGame(); });
restartBtn.addEventListener('touchstart', (e) => { e.preventDefault(); gameOverOverlay.style.display = 'none'; clearSave(); initGame(); });

// ============================================
// STYLES
// ============================================

const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut{0%{opacity:1}70%{opacity:1}100%{opacity:0}}
    @keyframes slideIn{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}
    @keyframes slideOut{from{transform:translateX(0);opacity:1}to{transform:translateX(100%);opacity:0}}
    .consumables-container{margin-top:20px;padding:10px;background:rgba(40,40,80,0.6);border-radius:10px;border:1px solid #5555aa}
    .consumables-container h4{color:#fc0;margin-bottom:10px;font-size:1.1rem}
    .consumables-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}
    .consumable-slot{aspect-ratio:1;background:rgba(60,60,120,0.5);border:2px solid #4ecdc4;border-radius:8px;display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative;cursor:pointer;transition:all 0.2s;padding:5px;-webkit-tap-highlight-color:transparent;user-select:none}
    .consumable-slot:hover{transform:translateY(-2px);border-color:#ffd700;box-shadow:0 5px 15px rgba(255,215,0,0.3)}
    .consumable-slot:active{transform:scale(0.95)}
    .consumable-icon{font-size:1.5rem}
    .consumable-name{font-size:0.7rem;text-align:center;color:#aaf}
    .consumable-count{position:absolute;top:2px;right:2px;background:#ffd700;color:#000;width:16px;height:16px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:0.7rem;font-weight:bold}
    .empty-consumable{grid-column:span 4;text-align:center;color:#55a;padding:10px;font-size:0.9rem}
    .joystick-container{position:fixed;bottom:30px;left:30px;z-index:100;-webkit-tap-highlight-color:transparent;user-select:none;touch-action:none}
    .joystick-base{width:120px;height:120px;border-radius:50%;background:rgba(255,255,255,0.15);border:3px solid rgba(255,255,255,0.3);backdrop-filter:blur(5px);display:flex;align-items:center;justify-content:center;transition:all 0.2s}
    .joystick-base.active{background:rgba(255,255,255,0.25);border-color:rgba(255,215,0,0.5)}
    .joystick-handle{width:50px;height:50px;border-radius:50%;background:rgba(255,255,255,0.3);border:2px solid rgba(255,255,255,0.6);transition:transform 0.05s ease;pointer-events:none}
    @media (max-width:768px){.joystick-base{width:100px;height:100px}.joystick-handle{width:40px;height:40px}}
    .message-container{position:fixed;top:100px;right:20px;z-index:1000;display:flex;flex-direction:column;gap:10px;pointer-events:none;max-width:300px}
    .message-item{background:rgba(0,0,0,0.8);color:#fc0;padding:12px 20px;border-radius:8px;border:2px solid #fc0;font-size:1rem;font-weight:bold;transform:translateX(100%);opacity:0;transition:all 0.3s ease;box-shadow:0 4px 15px rgba(0,0,0,0.5)}
    .message-item.show{transform:translateX(0);opacity:1}
    .message-item.hide{transform:translateX(100%);opacity:0}
    #continueGameBtn{margin-top:10px;padding:10px 30px;background:linear-gradient(45deg,#4CAF50,#45a049);color:#fff;border:none;border-radius:5px;cursor:pointer;font-size:1.2rem;font-weight:bold;transition:transform 0.2s;-webkit-tap-highlight-color:transparent;user-select:none}
    #continueGameBtn:hover{transform:scale(1.05);box-shadow:0 0 20px rgba(76,175,80,0.5)}
    #continueGameBtn:active{transform:scale(0.98)}
    .shop-item,.weapon-slot,.stat-buff{-webkit-tap-highlight-color:transparent;user-select:none}
    .stats-button{position:fixed;top:20px;right:20px;z-index:200;padding:10px 20px;background:linear-gradient(45deg,#ffd700,#ffaa00);color:#000;border:none;border-radius:25px;font-size:1.1rem;font-weight:bold;cursor:pointer;box-shadow:0 4px 6px rgba(0,0,0,0.3);transition:all 0.2s;-webkit-tap-highlight-color:transparent;user-select:none}
    .stats-button:hover{transform:scale(1.05);box-shadow:0 0 20px rgba(255,215,0,0.5)}
    .stats-button:active{transform:scale(0.95)}
    #statsPanel{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:300px;max-height:80vh;background:rgba(20,20,40,0.95);backdrop-filter:blur(10px);border:2px solid #ffd700;border-radius:15px;padding:20px;z-index:1000;color:#fff;box-shadow:0 0 30px rgba(255,215,0,0.3);transition:all 0.3s;overflow-y:auto}
    .stats-panel-hidden{opacity:0;visibility:hidden;pointer-events:none}
    .stats-panel-visible{opacity:1;visibility:visible;pointer-events:all}
    .stats-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:15px;padding-bottom:10px;border-bottom:1px solid #ffd700}
    .stats-header h3{margin:0;color:#ffd700;font-size:1.3rem}
    #closeStatsBtn{background:none;border:none;color:#ffd700;font-size:1.5rem;cursor:pointer;padding:0 5px;transition:transform 0.2s;-webkit-tap-highlight-color:transparent}
    #closeStatsBtn:hover{transform:scale(1.2)}
    #closeStatsBtn:active{transform:scale(0.9)}
    .stats-content{display:flex;flex-direction:column;gap:8px}
    .stat-row{display:flex;justify-content:space-between;align-items:center;padding:5px 10px;background:rgba(255,255,255,0.1);border-radius:5px}
    .stat-label{color:#aaf;font-size:0.9rem}
    .stat-value{color:#ffd700;font-weight:bold;font-size:1rem}
    .stat-divider{height:1px;background:rgba(255,215,0,0.3);margin:10px 0}
    .control-hint{position:fixed;bottom:10px;right:10px;color:rgba(255,255,255,0.5);font-size:0.8rem;background:rgba(0,0,0,0.3);padding:5px 10px;border-radius:5px;pointer-events:none;z-index:100}
    .throwable-ammo-small{position:absolute;top:2px;right:2px;background:rgba(0,0,0,0.7);border-radius:8px;padding:2px 4px;font-size:0.65rem;font-weight:bold;color:#fa0;border:1px solid #fa0;display:flex;align-items:center;gap:1px}
    .throwable-ammo-small .ammo-count{color:#fff;font-size:0.7rem}
    .throwable-ammo-small .ammo-max{color:#888;font-size:0.55rem}
`;
document.head.appendChild(style);

const controlHint = document.createElement('div');
controlHint.className = 'control-hint';
controlHint.innerHTML = 'Joystick | WASD | Space: Next Wave | 📊 Stats | R: Reload | Ctrl+S: Save | Ctrl+L: Load';
document.body.appendChild(controlHint);

// ============================================
// INITIALIZE
// ============================================

createMessageContainer();
createJoystick();
createStatsPanel();
createStatsButton();
checkForSave();

gameLoop();
