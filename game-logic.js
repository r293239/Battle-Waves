// ============================================
// GAME CORE - Player, Arena, Stats, UI, Controls
// ============================================

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
    },
    healingTowers: {
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

// Message queue
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

// Weapon targeting tracking
let attackedMonsters = new Set();
let weaponTargets = new Map();

// ============================================
// PLAYER OBJECT
// ============================================

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
    lastSlowFieldTick: 0,
    
    facingAngle: 0,
    lastFacingAngle: 0,
    
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
let placedBombs = [];

// ============================================
// DOM ELEMENTS
// ============================================

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
// HEALING FUNCTIONS
// ============================================

function applyHealing(amount) {
    if (player.health >= player.maxHealth) return;
    
    pendingHealing += amount;
    
    while (pendingHealing >= 1) {
        player.health = Math.min(player.maxHealth, player.health + 1);
        pendingHealing -= 1;
        createHealthPopup(player.x, player.y, 1);
    }
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
                <span class="stat-label">🏥 Healing Towers:</span>
                <span class="stat-value" id="stat-towers">0/3</span>
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
    
    document.getElementById('stat-bloodcontract').textContent = player.bloodContract ? `Yes (${player.bloodContractStacks})` : 'No (0)';
    document.getElementById('stat-guardian').textContent = player.guardianAngel ? 'Yes' : 'No';
    document.getElementById('stat-berserker').textContent = player.berserkerRing ? 'Yes' : 'No';
}

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
// MESSAGE QUEUE
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
// TOUCH CONTROLS
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

// ============================================
// DRAWING FUNCTIONS - ARENA
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
                
            case 'bombPlaced':
                ctx.strokeStyle = effect.color;
                ctx.lineWidth = 3;
                ctx.shadowColor = effect.color;
                ctx.shadowBlur = 20 * alpha;
                ctx.beginPath();
                ctx.arc(effect.x, effect.y, effect.radius * (1 + progress), 0, Math.PI * 2);
                ctx.stroke();
                
                ctx.strokeStyle = '#FFA500';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(effect.x, effect.y, effect.radius * 0.7, 0, Math.PI * 2);
                ctx.stroke();
                break;
                
            case 'guardianAngel':
                ctx.fillStyle = `rgba(255, 255, 0, ${alpha * 0.3})`;
                ctx.shadowColor = '#FFFF00';
                ctx.shadowBlur = 30;
                ctx.beginPath();
                ctx.arc(effect.x, effect.y, effect.radius * (1 + progress), 0, Math.PI * 2);
                ctx.fill();
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
                
            case 'towerSpawn':
                ctx.strokeStyle = effect.color;
                ctx.lineWidth = 3;
                ctx.shadowColor = effect.color;
                ctx.shadowBlur = 15 * alpha;
                ctx.beginPath();
                ctx.arc(effect.x, effect.y, effect.radius * (1 + progress), 0, Math.PI * 2);
                ctx.stroke();
                break;
                
            case 'heal':
                ctx.fillStyle = `rgba(0, 255, 0, ${alpha * 0.3})`;
                ctx.shadowColor = '#00FF00';
                ctx.shadowBlur = 15 * alpha;
                ctx.beginPath();
                ctx.arc(effect.x, effect.y, effect.radius * (1 + progress), 0, Math.PI * 2);
                ctx.fill();
                break;
                
            case 'hit':
                ctx.fillStyle = `rgba(255, 0, 0, ${alpha * 0.5})`;
                ctx.beginPath();
                ctx.arc(effect.x, effect.y, effect.radius * (1 - progress), 0, Math.PI * 2);
                ctx.fill();
                break;
        }
        
        ctx.restore();
    });
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
            
            let ammoDisplay = '';
            if (weapon.usesAmmo) {
                if (weapon.isThrowable) {
                    ammoDisplay = `
                        <div class="throwable-ammo-small">
                            <span class="ammo-count">${weapon.currentAmmo}</span>
                            <span class="ammo-max">/${weapon.magazineSize}</span>
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
                    else if (data.id === 'sniper') tagClass = 'sniper-tag';
                    else if (data.id === 'crossbow') tagClass = 'crossbow-tag';
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
                else if (data.id === 'sniper') typeText = 'SNIPER';
                else if (data.id === 'crossbow') typeText = 'CROSSBOW';
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

// ============================================
// POPUP FUNCTIONS
// ============================================

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
        pendingHealing: pendingHealing,
        towers: {
            landmines: {
                count: playerTowers.landmines.count,
                max: playerTowers.landmines.max
            },
            healingTowers: {
                active: playerTowers.healingTowers.active.map(t => ({
                    x: t.x,
                    y: t.y,
                    health: t.health
                }))
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
        pendingHealing = gameData.pendingHealing || 0;
        
        if (gameData.towers) {
            playerTowers.landmines.count = gameData.towers.landmines.count || 0;
            playerTowers.landmines.max = gameData.towers.landmines.max || 5;
            
            if (gameData.towers.healingTowers && gameData.towers.healingTowers.active) {
                playerTowers.healingTowers.active = gameData.towers.healingTowers.active.map(t => ({
                    ...t,
                    radius: 20,
                    healAmount: 1,
                    lastHeal: Date.now()
                }));
            }
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
    
    if (gameState === 'wave' || gameState === 'shop' || gameState === 'statSelect') {
        updateWeaponDisplay();
    }
    
    requestAnimationFrame(gameLoop);
}

// ============================================
// INITIALIZATION
// ============================================

const controlHint = document.createElement('div');
controlHint.className = 'control-hint';
controlHint.innerHTML = 'Joystick | WASD | Space: Next Wave | 📊 Stats | R: Reload | Ctrl+S: Save | Ctrl+L: Load';
document.body.appendChild(controlHint);

// Export for use in other files
window.player = player;
window.monsters = monsters;
window.gameState = gameState;
window.wave = wave;
window.gold = gold;
window.kills = kills;
window.shopItems = shopItems;
window.spawnIndicators = spawnIndicators;
window.selectedWeaponIndex = selectedWeaponIndex;
window.visualEffects = visualEffects;
window.mergeTargetIndex = mergeTargetIndex;
window.refreshCount = refreshCount;
window.refreshCost = refreshCost;
window.waveActive = waveActive;
window.waveStartTime = waveStartTime;
window.bossAbilities = bossAbilities;
window.asteroidTimer = asteroidTimer;
window.minionSpawnInterval = minionSpawnInterval;
window.dashers = dashers;
window.splitterTracking = splitterTracking;
window.playerTowers = playerTowers;
window.activeBuffs = activeBuffs;
window.statsPanelVisible = statsPanelVisible;
window.joystickActive = joystickActive;
window.joystickCurrentX = joystickCurrentX;
window.joystickCurrentY = joystickCurrentY;
window.joystickMaxDistance = joystickMaxDistance;
window.messageQueue = messageQueue;
window.messageContainer = messageContainer;
window.touchStartTime = touchStartTime;
window.touchMoved = touchMoved;
window.lastTouchX = lastTouchX;
window.lastTouchY = lastTouchY;
window.keys = keys;
window.attackedMonsters = attackedMonsters;
window.weaponTargets = weaponTargets;
window.groundFire = groundFire;
window.poisonClouds = poisonClouds;
window.voidZones = voidZones;
window.activeTraps = activeTraps;
window.bossProjectiles = bossProjectiles;
window.monsterProjectiles = monsterProjectiles;
window.placedBombs = placedBombs;
window.mouseX = mouseX;
window.mouseY = mouseY;
window.ctx = ctx;
window.waveDisplay = waveDisplay;
window.monsterCount = monsterCount;
window.startScreen = startScreen;
window.waveCompleteOverlay = waveCompleteOverlay;
window.gameOverOverlay = gameOverOverlay;
window.gameOverText = gameOverText;
window.statBuffs = statBuffs;
window.weaponsGrid = weaponsGrid;
window.shopItemsContainer = shopItemsContainer;
window.startGameBtn = startGameBtn;
window.restartBtn = restartBtn;
window.nextWaveBtn = nextWaveBtn;
window.scrapWeaponBtn = scrapWeaponBtn;
window.mergeWeaponBtn = mergeWeaponBtn;
window.mergeInfo = mergeInfo;
window.reloadIndicator = reloadIndicator;
window.refreshShopBtn = refreshShopBtn;
window.refreshCostSpan = refreshCostSpan;
window.refreshCounter = refreshCounter;
window.consumablesGrid = consumablesGrid;
window.healthValue = healthValue;
window.damageValue = damageValue;
window.speedValue = speedValue;
window.goldValue = goldValue;
window.waveValue = waveValue;
window.killsValue = killsValue;
window.healthFill = healthFill;
window.boomerangImage = boomerangImage;
window.pendingHealing = pendingHealing;

// Export functions
window.applyHealing = applyHealing;
window.createStatsPanel = createStatsPanel;
window.toggleStatsPanel = toggleStatsPanel;
window.updateStatsPanel = updateStatsPanel;
window.createStatsButton = createStatsButton;
window.createJoystick = createJoystick;
window.createMessageContainer = createMessageContainer;
window.queueMessage = queueMessage;
window.updateUI = updateUI;
window.updateWeaponDisplay = updateWeaponDisplay;
window.updateConsumablesDisplay = updateConsumablesDisplay;
window.updateShopDisplay = updateShopDisplay;
window.createDamageIndicator = createDamageIndicator;
window.createGoldPopup = createGoldPopup;
window.createHealthPopup = createHealthPopup;
window.saveGame = saveGame;
window.loadGame = loadGame;
window.clearSave = clearSave;
window.checkForSave = checkForSave;
window.gameLoop = gameLoop;
window.drawGrid = drawGrid;
window.drawSpawnIndicators = drawSpawnIndicators;
window.drawSlowField = drawSlowField;
window.drawGroundEffects = drawGroundEffects;
window.drawVisualEffects = drawVisualEffects;
