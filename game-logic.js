// ============================================
// GAME LOGIC - With Enhanced Melee Animations
// ============================================

// Game State
let gameState = 'start'; // 'start', 'wave', 'statSelect', 'shop', 'gameover'
let wave = 1;
let gold = GAME_DATA.PLAYER_START.gold;
let kills = 0;
let shopItems = [];
let spawnIndicators = [];
let selectedWeaponIndex = -1;
let visualEffects = []; // For animations

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
    
    // Stats from buffs
    lifeSteal: 0,
    criticalChance: 0,
    goldMultiplier: 0,
    healthRegen: 0,
    damageReduction: 0,
    lastRegen: 0,
    
    // Weapons (max 6 slots)
    weapons: [],
    projectiles: [],
    meleeAttacks: []
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

// UI Elements
const healthValue = document.getElementById('healthValue');
const damageValue = document.getElementById('damageValue');
const speedValue = document.getElementById('speedValue');
const goldValue = document.getElementById('goldValue');
const waveValue = document.getElementById('waveValue');
const killsValue = document.getElementById('killsValue');
const healthFill = document.getElementById('healthFill');

// Initialize Game
function initGame() {
    // Reset player
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
        meleeAttacks: []
    });
    
    // Give starting weapon
    const handgun = getWeaponById('handgun');
    player.weapons.push(new WeaponInstance(handgun));
    
    // Reset game state
    wave = 1;
    gold = GAME_DATA.PLAYER_START.gold;
    kills = 0;
    gameState = 'wave';
    selectedWeaponIndex = -1;
    visualEffects = [];
    
    // Clear game objects
    monsters = [];
    player.projectiles = [];
    player.meleeAttacks = [];
    spawnIndicators = [];
    
    // Generate initial shop
    shopItems = generateShopItems();
    
    // Hide start screen, show game
    startScreen.style.display = 'none';
    waveCompleteOverlay.style.display = 'none';
    gameOverOverlay.style.display = 'none';
    scrapWeaponBtn.style.display = 'none';
    
    // Start first wave
    startWave();
    
    // Update UI
    updateUI();
    updateWeaponDisplay();
    updateShopDisplay();
}

// Show spawn indicators
function showSpawnIndicators() {
    const waveConfig = getWaveConfig(wave);
    spawnIndicators = [];
    
    for (let i = 0; i < waveConfig.monsters; i++) {
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
            timer: 2000, // Show for 2 seconds
            startTime: Date.now()
        });
    }
}

// Start wave
function startWave() {
    gameState = 'wave';
    const waveConfig = getWaveConfig(wave);
    waveDisplay.textContent = `Wave ${wave}`;
    waveDisplay.style.opacity = 1;
    
    // Clear game objects
    monsters = [];
    player.projectiles = [];
    player.meleeAttacks = [];
    visualEffects = [];
    
    // Hide scrap button during wave
    scrapWeaponBtn.style.display = 'none';
    selectedWeaponIndex = -1;
    
    // Show spawn indicators
    showSpawnIndicators();
    
    // Spawn monsters after delay
    setTimeout(() => {
        // Spawn monsters based on wave configuration
        for (let i = 0; i < waveConfig.monsters; i++) {
            spawnMonster();
        }
        spawnIndicators = []; // Clear indicators after spawning
    }, 2000);
    
    // Fade out wave display
    setTimeout(() => {
        waveDisplay.style.opacity = 0.5;
    }, 2000);
}

// Spawn monster
function spawnMonster() {
    const waveConfig = getWaveConfig(wave);
    const side = Math.floor(Math.random() * 4);
    let x, y;
    
    switch(side) {
        case 0: x = -50; y = Math.random() * canvas.height; break;
        case 1: x = canvas.width + 50; y = Math.random() * canvas.height; break;
        case 2: x = Math.random() * canvas.width; y = -50; break;
        case 3: x = Math.random() * canvas.width; y = canvas.height + 50; break;
    }
    
    monsters.push({
        x, y,
        radius: 15 + Math.random() * 10,
        health: waveConfig.monsterHealth,
        maxHealth: waveConfig.monsterHealth,
        damage: waveConfig.monsterDamage,
        speed: 1 + wave * 0.1,
        color: `hsl(${Math.random() * 360}, 70%, 50%)`,
        type: Math.random() > 0.7 ? 'fast' : 'normal',
        lastAttack: 0,
        attackCooldown: GAME_DATA.MONSTER_ATTACK_COOLDOWN
    });
}

// Update UI
function updateUI() {
    healthValue.textContent = `${Math.floor(player.health)}/${player.maxHealth}`;
    damageValue.textContent = player.baseDamage;
    speedValue.textContent = player.speed;
    goldValue.textContent = gold;
    waveValue.textContent = wave;
    killsValue.textContent = kills;
    
    const healthPercent = (player.health / player.maxHealth) * 100;
    healthFill.style.width = `${healthPercent}%`;
    
    // Update health bar color
    if (healthPercent > 60) {
        healthFill.style.background = 'linear-gradient(90deg, #11998e, #38ef7d)';
    } else if (healthPercent > 30) {
        healthFill.style.background = 'linear-gradient(90deg, #f7971e, #ffd200)';
    } else {
        healthFill.style.background = 'linear-gradient(90deg, #ff416c, #ff4b2b)';
    }
    
    // Update monster count
    monsterCount.textContent = `Monsters: ${monsters.length}`;
}

// Update weapon display
function updateWeaponDisplay() {
    weaponsGrid.innerHTML = '';
    
    for (let i = 0; i < 6; i++) {
        const slot = document.createElement('div');
        slot.className = 'weapon-slot';
        
        if (i < player.weapons.length) {
            const weapon = player.weapons[i];
            slot.classList.add('occupied');
            if (selectedWeaponIndex === i) {
                slot.classList.add('selected');
            }
            
            slot.innerHTML = `
                <div>${weapon.icon}</div>
                <div class="weapon-level">${weapon.type === 'melee' ? '⚔️' : '🔫'}</div>
                <div class="melee-type">${weapon.getTypeDescription()}</div>
                <div class="weapon-info">${weapon.name}<br>Dmg: ${weapon.baseDamage}<br>Spd: ${weapon.attackSpeed}/s</div>
            `;
            
            // Add click handler for weapon selection
            slot.addEventListener('click', () => selectWeapon(i));
        } else {
            slot.innerHTML = '<div class="empty-slot">+</div>';
        }
        
        weaponsGrid.appendChild(slot);
    }
}

// Select weapon for scrapping
function selectWeapon(index) {
    if (gameState !== 'shop') return;
    
    if (index >= player.weapons.length) return;
    
    // Toggle selection
    if (selectedWeaponIndex === index) {
        selectedWeaponIndex = -1;
        scrapWeaponBtn.style.display = 'none';
    } else {
        selectedWeaponIndex = index;
        const weapon = player.weapons[index];
        scrapWeaponBtn.innerHTML = `<span class="icon">🗑️</span> Scrap ${weapon.name} (Get ${weapon.getScrapValue()} gold)`;
        scrapWeaponBtn.style.display = 'block';
    }
    
    updateWeaponDisplay();
}

// Scrap selected weapon
function scrapWeapon() {
    if (selectedWeaponIndex === -1 || selectedWeaponIndex >= player.weapons.length) return;
    
    const weapon = player.weapons[selectedWeaponIndex];
    const scrapValue = weapon.getScrapValue();
    
    // Don't allow scrapping starting handgun
    if (weapon.id === 'handgun') {
        showMessage("Cannot scrap starting weapon!");
        return;
    }
    
    // Add gold
    gold += scrapValue;
    
    // Remove weapon
    player.weapons.splice(selectedWeaponIndex, 1);
    
    // Reset selection
    selectedWeaponIndex = -1;
    scrapWeaponBtn.style.display = 'none';
    
    // Show message
    showMessage(`Scrapped ${weapon.name} for ${scrapValue} gold!`);
    
    // Update displays
    updateUI();
    updateWeaponDisplay();
}

// Update shop display
function updateShopDisplay() {
    shopItemsContainer.innerHTML = '';
    
    // Always show 4 slots
    for (let i = 0; i < 4; i++) {
        const shopItem = shopItems[i];
        const itemElement = document.createElement('div');
        
        if (shopItem) {
            itemElement.className = 'shop-item';
            const data = shopItem.data;
            const cost = data.cost;
            
            itemElement.innerHTML = `
                <div class="item-info">
                    <div class="item-name">
                        ${data.icon} ${data.name}
                        <span class="item-tag ${shopItem.type === 'weapon' ? (data.type === 'melee' ? 
                            (data.meleeType === 'aoe' ? 'aoe-tag' : 
                             data.meleeType === 'pierce' ? 'pierce-tag' : 'single-tag') : 'ranged-tag') : ''}">
                            ${shopItem.type === 'weapon' ? (data.type === 'melee' ? 
                                (data.meleeType === 'aoe' ? 'AOE' : 
                                 data.meleeType === 'pierce' ? 'PIERCE' : 'SINGLE') : 'RANGED') : 'ITEM'}
                        </span>
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

// Purchase item from shop
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
        // Check if we have space for more weapons
        if (player.weapons.length >= 6) {
            showMessage('No empty weapon slots!');
            gold += data.cost; // Refund
            return;
        }
        
        // Add weapon
        player.weapons.push(new WeaponInstance(data));
        showMessage(`Purchased ${data.name}!`);
        
    } else {
        // Apply item effect
        applyItemEffect(data);
        showMessage(`Purchased ${data.name}!`);
    }
    
    // Replace purchased item with null (empty slot)
    shopItems[index] = null;
    
    updateUI();
    updateWeaponDisplay();
    updateShopDisplay();
}

// Apply item effect
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
    }
}

// Show stat buff selection
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

// Select stat buff
function selectStatBuff(buff) {
    // Apply buff effects
    if (buff.effect.maxHealth) {
        player.maxHealth += buff.effect.maxHealth;
        player.health += buff.effect.health || 0;
    }
    if (buff.effect.damage) player.baseDamage += buff.effect.damage;
    if (buff.effect.speed) player.speed += buff.effect.speed;
    if (buff.effect.lifeSteal) player.lifeSteal += buff.effect.lifeSteal;
    if (buff.effect.criticalChance) player.criticalChance += buff.effect.criticalChance;
    if (buff.effect.goldMultiplier) player.goldMultiplier += buff.effect.goldMultiplier;
    if (buff.effect.healthRegen) player.healthRegen += buff.effect.healthRegen;
    if (buff.effect.damageReduction) player.damageReduction += buff.effect.damageReduction;
    
    showMessage(`Selected: ${buff.name}`);
    
    // Go to shop
    waveCompleteOverlay.style.display = 'none';
    gameState = 'shop';
    
    // Generate new shop items
    shopItems = generateShopItems();
    updateShopDisplay();
    updateUI();
    
    // Show next wave button and scrap button
    nextWaveBtn.style.display = 'block';
    scrapWeaponBtn.style.display = 'none';
    selectedWeaponIndex = -1;
}

// End wave
function endWave() {
    gameState = 'statSelect';
    
    // Calculate gold reward
    const waveConfig = getWaveConfig(wave);
    gold += Math.floor(waveConfig.goldReward * (1 + player.goldMultiplier));
    
    // Show stat buff selection
    showStatBuffs();
}

// Game over
function gameOver() {
    gameState = 'gameover';
    gameOverText.textContent = `You survived ${wave} waves with ${kills} kills.`;
    gameOverOverlay.style.display = 'flex';
}

// Show temporary message
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

// Add visual effect
function addVisualEffect(effect) {
    visualEffects.push(effect);
}

// Game Loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid background
    drawGrid();
    
    if (gameState === 'wave') {
        updateGame();
    }
    
    // Draw spawn indicators
    drawSpawnIndicators();
    
    // Draw everything
    drawMonsters();
    drawProjectiles();
    drawMeleeAttacks();
    drawVisualEffects();
    drawPlayer();
    
    requestAnimationFrame(gameLoop);
}

// Draw spawn indicators
function drawSpawnIndicators() {
    const currentTime = Date.now();
    
    for (let i = spawnIndicators.length - 1; i >= 0; i--) {
        const indicator = spawnIndicators[i];
        const elapsed = currentTime - indicator.startTime;
        
        if (elapsed > indicator.timer) {
            spawnIndicators.splice(i, 1);
            continue;
        }
        
        // Draw X mark
        ctx.save();
        ctx.translate(indicator.x, indicator.y);
        
        ctx.strokeStyle = '#ff0000';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        
        // Draw X
        ctx.beginPath();
        ctx.moveTo(-15, -15);
        ctx.lineTo(15, 15);
        ctx.moveTo(15, -15);
        ctx.lineTo(-15, 15);
        ctx.stroke();
        
        // Draw circle around X
        ctx.beginPath();
        ctx.arc(0, 0, 20, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 0, 0, 0.3)';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        ctx.restore();
    }
}

// Update game state during wave
function updateGame() {
    // Update player position (move towards mouse)
    const dx = mouseX - player.x;
    const dy = mouseY - player.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > player.speed) {
        player.x += (dx / distance) * player.speed;
        player.y += (dy / distance) * player.speed;
    }
    
    // Keep player in bounds
    player.x = Math.max(player.radius, Math.min(canvas.width - player.radius, player.x));
    player.y = Math.max(player.radius, Math.min(canvas.height - player.radius, player.y));
    
    // Health regen
    const currentTime = Date.now();
    if (player.healthRegen > 0 && currentTime - player.lastRegen >= 1000) {
        player.health = Math.min(player.maxHealth, player.health + player.healthRegen);
        player.lastRegen = currentTime;
    }
    
    // Update weapons and attacks
    updateWeapons();
    
    // Update projectiles
    updateProjectiles();
    
    // Update melee attacks
    updateMeleeAttacks();
    
    // Update monsters
    updateMonsters();
    
    // Update visual effects
    updateVisualEffects();
    
    // Check if wave is complete
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
            // Find closest monster in range
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
                if (weapon.type === 'ranged') {
                    player.projectiles.push(attack);
                } else {
                    player.meleeAttacks.push(attack);
                    
                    // Add weapon-specific visual effects
                    createWeaponAnimation(weapon, player.x, player.y, closestMonster.x, closestMonster.y);
                }
            }
        }
    });
}

// Create weapon-specific animation
function createWeaponAnimation(weapon, playerX, playerY, targetX, targetY) {
    const angle = Math.atan2(targetY - playerY, targetX - playerX);
    
    switch(weapon.animation) {
        case 'swordSwing':
            // Sword swing with trail effect
            for (let i = 0; i < 5; i++) {
                addVisualEffect({
                    type: 'swordTrail',
                    x: playerX,
                    y: playerY,
                    angle: angle + (Math.random() - 0.5) * 0.5,
                    size: 20 + Math.random() * 10,
                    color: weapon.trailColor,
                    startTime: Date.now(),
                    duration: 200 + Math.random() * 100
                });
            }
            // Sparkles at impact point
            for (let i = 0; i < 3; i++) {
                addVisualEffect({
                    type: 'sparkle',
                    x: playerX + Math.cos(angle) * weapon.range,
                    y: playerY + Math.sin(angle) * weapon.range,
                    color: weapon.sparkleColor,
                    startTime: Date.now(),
                    duration: 300
                });
            }
            break;
            
        case 'axeSpin':
            // Axe spin with shockwave
            addVisualEffect({
                type: 'shockwave',
                x: playerX,
                y: playerY,
                color: weapon.shockwaveColor,
                startTime: Date.now(),
                duration: 400
            });
            // Spinning blade effects
            for (let i = 0; i < 8; i++) {
                const bladeAngle = (Math.PI * 2 * i) / 8;
                addVisualEffect({
                    type: 'blade',
                    x: playerX,
                    y: playerY,
                    angle: bladeAngle,
                    color: weapon.trailColor,
                    startTime: Date.now(),
                    duration: 400
                });
            }
            break;
            
        case 'daggerStab':
            // Dagger thrust with fast trail
            addVisualEffect({
                type: 'daggerTrail',
                x: playerX,
                y: playerY,
                angle: angle,
                color: weapon.trailColor,
                startTime: Date.now(),
                duration: 150
            });
            // Quick sparkles
            addVisualEffect({
                type: 'sparkle',
                x: playerX + Math.cos(angle) * weapon.range,
                y: playerY + Math.sin(angle) * weapon.range,
                color: weapon.sparkleColor,
                startTime: Date.now(),
                duration: 200
            });
            break;
            
        case 'hammerSmash':
            // Hammer smash with ground impact
            addVisualEffect({
                type: 'shockwave',
                x: playerX,
                y: playerY,
                color: weapon.shockwaveColor,
                startTime: Date.now(),
                duration: 500,
                intensity: 2
            });
            // Debris particles
            for (let i = 0; i < 12; i++) {
                const particleAngle = Math.random() * Math.PI * 2;
                const distance = Math.random() * weapon.range;
                addVisualEffect({
                    type: 'particle',
                    x: playerX + Math.cos(particleAngle) * distance,
                    y: playerY + Math.sin(particleAngle) * distance,
                    color: weapon.trailColor,
                    startTime: Date.now(),
                    duration: 400 + Math.random() * 200
                });
            }
            break;
            
        case 'spearThrust':
            // Spear thrust with piercing effect
            addVisualEffect({
                type: 'spearTrail',
                x: playerX,
                y: playerY,
                angle: angle,
                color: weapon.trailColor,
                startTime: Date.now(),
                duration: 250
            });
            // Glow effect along the path
            for (let i = 0; i < 3; i++) {
                const progress = 0.3 + i * 0.3;
                addVisualEffect({
                    type: 'glow',
                    x: playerX + Math.cos(angle) * weapon.range * progress,
                    y: playerY + Math.sin(angle) * weapon.range * progress,
                    color: weapon.sparkleColor,
                    startTime: Date.now(),
                    duration: 300
                });
            }
            break;
    }
}

function updateProjectiles() {
    for (let i = player.projectiles.length - 1; i >= 0; i--) {
        const projectile = player.projectiles[i];
        
        // Move projectile
        projectile.x += Math.cos(projectile.angle) * projectile.speed;
        projectile.y += Math.sin(projectile.angle) * projectile.speed;
        
        // Check if out of range
        const dx = projectile.x - player.x;
        const dy = projectile.y - player.y;
        const distanceFromPlayer = Math.sqrt(dx * dx + dy * dy);
        
        if (distanceFromPlayer > projectile.range) {
            player.projectiles.splice(i, 1);
            continue;
        }
        
        // Check collision with monsters
        for (let j = monsters.length - 1; j >= 0; j--) {
            const monster = monsters[j];
            const dx = projectile.x - monster.x;
            const dy = projectile.y - monster.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 5 + monster.radius) {
                // Calculate damage
                let damage = projectile.damage;
                let isCritical = false;
                
                // Critical chance
                if (Math.random() < player.criticalChance) {
                    damage *= 2;
                    isCritical = true;
                }
                
                // Apply damage reduction
                if (player.damageReduction > 0) {
                    damage *= (1 - player.damageReduction);
                }
                
                monster.health -= damage;
                
                // Show damage indicator
                createDamageIndicator(monster.x, monster.y, Math.floor(damage), isCritical);
                
                // Life steal
                if (player.lifeSteal > 0) {
                    const healAmount = damage * player.lifeSteal;
                    player.health = Math.min(player.maxHealth, player.health + healAmount);
                    createHealthPopup(player.x, player.y, Math.floor(healAmount));
                }
                
                // Remove projectile
                player.projectiles.splice(i, 1);
                
                // Add hit effect
                addVisualEffect({
                    type: 'hit',
                    x: monster.x,
                    y: monster.y,
                    color: projectile.color,
                    startTime: Date.now(),
                    duration: 200
                });
                
                // Check if monster is dead
                if (monster.health <= 0) {
                    // Add death effect
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
                    const waveConfig = getWaveConfig(wave);
                    const goldEarned = Math.floor(10 * (1 + player.goldMultiplier));
                    gold += goldEarned;
                    
                    // Show gold popup
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
        
        // Check if attack duration is over
        if (currentTime - attack.startTime > attack.duration) {
            player.meleeAttacks.splice(i, 1);
            continue;
        }
        
        let hits = 0;
        
        // Check collision with monsters based on melee type
        for (let j = monsters.length - 1; j >= 0; j--) {
            const monster = monsters[j];
            const dx = monster.x - attack.x;
            const dy = monster.y - attack.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < attack.radius + monster.radius) {
                // Check if monster is within swing angle (for non-360° attacks)
                if (attack.swingAngle < 360) {
                    const monsterAngle = Math.atan2(dy, dx);
                    const angleDiff = Math.abs(monsterAngle - attack.angle);
                    const normalizedDiff = Math.abs((angleDiff + Math.PI) % (2 * Math.PI) - Math.PI);
                    
                    if (normalizedDiff > (attack.swingAngle * Math.PI / 360)) {
                        continue; // Monster is outside swing arc
                    }
                }
                
                // Calculate damage
                let damage = attack.damage;
                let isCritical = false;
                
                // Critical chance
                if (Math.random() < player.criticalChance) {
                    damage *= 2;
                    isCritical = true;
                }
                
                // Apply damage reduction
                if (player.damageReduction > 0) {
                    damage *= (1 - player.damageReduction);
                }
                
                monster.health -= damage;
                
                // Show damage indicator
                createDamageIndicator(monster.x, monster.y, Math.floor(damage), isCritical);
                
                // Life steal
                if (player.lifeSteal > 0) {
                    const healAmount = damage * player.lifeSteal;
                    player.health = Math.min(player.maxHealth, player.health + healAmount);
                    createHealthPopup(player.x, player.y, Math.floor(healAmount));
                }
                
                hits++;
                
                // Add blood/hit effect for melee
                addVisualEffect({
                    type: 'blood',
                    x: monster.x,
                    y: monster.y,
                    color: '#FF0000',
                    startTime: Date.now(),
                    duration: 300
                });
                
                // Check pierce limit for pierce weapons
                if (attack.meleeType === 'pierce' && hits >= attack.pierceCount) {
                    break;
                }
                
                // Check if monster is dead
                if (monster.health <= 0) {
                    // Add death effect
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
                    
                    // Show gold popup
                    createGoldPopup(monster.x, monster.y, goldEarned);
                    
                    // Adjust index since we removed a monster
                    j--;
                }
            }
        }
    }
}

// Create damage indicator
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

// Create gold popup
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

// Create health popup
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

function updateMonsters() {
    const currentTime = Date.now();
    
    monsters.forEach(monster => {
        // Move towards player
        const dx = player.x - monster.x;
        const dy = player.y - monster.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        monster.x += (dx / distance) * monster.speed;
        monster.y += (dy / distance) * monster.speed;
        
        // Check collision with player (with attack cooldown)
        if (distance < player.radius + monster.radius) {
            if (currentTime - monster.lastAttack >= monster.attackCooldown) {
                player.health -= monster.damage;
                monster.lastAttack = currentTime;
                
                // Show player damage indicator
                createDamageIndicator(player.x, player.y, monster.damage, false);
                
                if (player.health <= 0) {
                    gameOver();
                }
            }
        }
    });
}

// Update visual effects
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

// Draw visual effects
function drawVisualEffects() {
    const currentTime = Date.now();
    
    visualEffects.forEach(effect => {
        const progress = (currentTime - effect.startTime) / effect.duration;
        const alpha = 1 - progress;
        
        ctx.save();
        
        switch(effect.type) {
            case 'swordTrail':
                ctx.translate(effect.x, effect.y);
                ctx.rotate(effect.angle + progress * Math.PI);
                ctx.strokeStyle = `rgba(${hexToRgb(effect.color)}, ${alpha})`;
                ctx.lineWidth = 3;
                ctx.lineCap = 'round';
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(effect.size * (1 - progress), 0);
                ctx.stroke();
                break;
                
            case 'shockwave':
                ctx.translate(effect.x, effect.y);
                const scale = progress * (effect.intensity || 1);
                ctx.strokeStyle = `rgba(${hexToRgb(effect.color)}, ${alpha * 0.5})`;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(0, 0, 30 * scale, 0, Math.PI * 2);
                ctx.stroke();
                break;
                
            case 'blade':
                ctx.translate(effect.x, effect.y);
                ctx.rotate(effect.angle + progress * Math.PI * 2);
                ctx.fillStyle = `rgba(${hexToRgb(effect.color)}, ${alpha})`;
                ctx.fillRect(-5, -15, 10, 30);
                break;
                
            case 'daggerTrail':
                ctx.translate(effect.x, effect.y);
                ctx.rotate(effect.angle);
                const trailLength = 40 * (1 - progress);
                ctx.strokeStyle = `rgba(${hexToRgb(effect.color)}, ${alpha})`;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(trailLength, 0);
                ctx.stroke();
                break;
                
            case 'particle':
                ctx.fillStyle = `rgba(${hexToRgb(effect.color)}, ${alpha})`;
                ctx.beginPath();
                ctx.arc(effect.x, effect.y, 2 + progress * 3, 0, Math.PI * 2);
                ctx.fill();
                break;
                
            case 'spearTrail':
                ctx.translate(effect.x, effect.y);
                ctx.rotate(effect.angle);
                const spearLength = 60 * (1 - progress);
                ctx.strokeStyle = `rgba(${hexToRgb(effect.color)}, ${alpha})`;
                ctx.lineWidth = 3;
                ctx.lineCap = 'round';
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(spearLength, 0);
                ctx.stroke();
                break;
                
            case 'glow':
                ctx.fillStyle = `rgba(${hexToRgb(effect.color)}, ${alpha * 0.3})`;
                ctx.beginPath();
                ctx.arc(effect.x, effect.y, 10 + progress * 5, 0, Math.PI * 2);
                ctx.fill();
                break;
                
            case 'hit':
                ctx.fillStyle = `rgba(${hexToRgb(effect.color)}, ${alpha})`;
                for (let i = 0; i < 5; i++) {
                    const angle = Math.random() * Math.PI * 2;
                    const distance = progress * 20;
                    ctx.beginPath();
                    ctx.arc(effect.x + Math.cos(angle) * distance, 
                           effect.y + Math.sin(angle) * distance, 
                           2, 0, Math.PI * 2);
                    ctx.fill();
                }
                break;
                
            case 'blood':
                ctx.fillStyle = `rgba(255, 0, 0, ${alpha * 0.7})`;
                for (let i = 0; i < 8; i++) {
                    const angle = Math.random() * Math.PI * 2;
                    const distance = progress * 30;
                    const size = 1 + Math.random() * 3;
                    ctx.beginPath();
                    ctx.arc(effect.x + Math.cos(angle) * distance, 
                           effect.y + Math.sin(angle) * distance, 
                           size, 0, Math.PI * 2);
                    ctx.fill();
                }
                break;
                
            case 'death':
                ctx.fillStyle = `rgba(${hexToRgb(effect.color)}, ${alpha})`;
                const particles = 12;
                for (let i = 0; i < particles; i++) {
                    const angle = (Math.PI * 2 * i) / particles + progress * Math.PI;
                    const distance = progress * 40;
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

// Drawing functions
function drawGrid() {
    ctx.strokeStyle = 'rgba(100, 100, 150, 0.1)';
    ctx.lineWidth = 1;
    
    // Vertical lines
    for (let x = 0; x < canvas.width; x += 50) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    
    // Horizontal lines
    for (let y = 0; y < canvas.height; y += 50) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
}

function drawPlayer() {
    // Draw player body
    ctx.fillStyle = player.color;
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw player outline
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
    ctx.stroke();
    
    // Draw direction indicator
    const angle = Math.atan2(mouseY - player.y, mouseX - player.x);
    const indicatorX = player.x + Math.cos(angle) * (player.radius + 5);
    const indicatorY = player.y + Math.sin(angle) * (player.radius + 5);
    
    ctx.fillStyle = '#ffcc00';
    ctx.beginPath();
    ctx.arc(indicatorX, indicatorY, 5, 0, Math.PI * 2);
    ctx.fill();
}

function drawMonsters() {
    monsters.forEach(monster => {
        // Draw monster body
        ctx.fillStyle = monster.color;
        ctx.beginPath();
        ctx.arc(monster.x, monster.y, monster.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw monster outline
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(monster.x, monster.y, monster.radius, 0, Math.PI * 2);
        ctx.stroke();
        
        // Draw eyes
        const angleToPlayer = Math.atan2(player.y - monster.y, player.x - monster.x);
        const eyeRadius = monster.radius * 0.2;
        
        // Left eye
        const leftEyeX = monster.x + Math.cos(angleToPlayer - 0.3) * (monster.radius * 0.6);
        const leftEyeY = monster.y + Math.sin(angleToPlayer - 0.3) * (monster.radius * 0.6);
        
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(leftEyeX, leftEyeY, eyeRadius, 0, Math.PI * 2);
        ctx.fill();
        
        // Right eye
        const rightEyeX = monster.x + Math.cos(angleToPlayer + 0.3) * (monster.radius * 0.6);
        const rightEyeY = monster.y + Math.sin(angleToPlayer + 0.3) * (monster.radius * 0.6);
        
        ctx.beginPath();
        ctx.arc(rightEyeX, rightEyeY, eyeRadius, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw pupils
        ctx.fillStyle = '#000000';
        const pupilX = monster.x + Math.cos(angleToPlayer) * (monster.radius * 0.7);
        const pupilY = monster.y + Math.sin(angleToPlayer) * (monster.radius * 0.7);
        
        ctx.beginPath();
        ctx.arc(pupilX, pupilY, eyeRadius * 0.5, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw health bar
        const healthPercent = monster.health / monster.maxHealth;
        const barWidth = monster.radius * 2;
        const barHeight = 4;
        const barX = monster.x - monster.radius;
        const barY = monster.y - monster.radius - 10;
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(barX, barY, barWidth, barHeight);
        
        ctx.fillStyle = healthPercent > 0.5 ? '#00ff00' : healthPercent > 0.2 ? '#ffff00' : '#ff0000';
        ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);
    });
}

function drawProjectiles() {
    player.projectiles.forEach(projectile => {
        ctx.fillStyle = projectile.color;
        ctx.beginPath();
        ctx.arc(projectile.x, projectile.y, 4, 0, Math.PI * 2);
        ctx.fill();
        
        // Add trail effect
        ctx.strokeStyle = projectile.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(projectile.x - Math.cos(projectile.angle) * 10, 
                   projectile.y - Math.sin(projectile.angle) * 10);
        ctx.lineTo(projectile.x, projectile.y);
        ctx.stroke();
    });
}

function drawMeleeAttacks() {
    const currentTime = Date.now();
    
    player.meleeAttacks.forEach(attack => {
        const progress = (currentTime - attack.startTime) / attack.duration;
        const alpha = 0.6 * (1 - progress * 0.5);
        
        ctx.save();
        ctx.translate(attack.x, attack.y);
        
        // Draw different shapes based on melee type
        if (attack.swingAngle >= 360) {
            // Full circle for AOE weapons with pulsing effect
            const pulse = 1 + Math.sin(progress * Math.PI * 4) * 0.2;
            ctx.fillStyle = `rgba(${hexToRgb(attack.color)}, ${alpha * 0.3})`;
            ctx.beginPath();
            ctx.arc(0, 0, attack.radius * pulse, 0, Math.PI * 2);
            ctx.fill();
            
            // Outer ring
            ctx.strokeStyle = `rgba(${hexToRgb(attack.color)}, ${alpha})`;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(0, 0, attack.radius, 0, Math.PI * 2);
            ctx.stroke();
        } else {
            // Arc for directional weapons with swinging animation
            const swingProgress = progress * 2;
            const currentAngle = attack.angle - (attack.swingAngle * Math.PI / 360) + 
                                (swingProgress * attack.swingAngle * Math.PI / 180);
            
            ctx.rotate(currentAngle);
            
            // Main attack arc
            ctx.fillStyle = `rgba(${hexToRgb(attack.color)}, ${alpha * 0.4})`;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.arc(0, 0, attack.radius, -attack.swingAngle * Math.PI / 360, attack.swingAngle * Math.PI / 360);
            ctx.closePath();
            ctx.fill();
            
            // Edge glow
            ctx.strokeStyle = `rgba(${hexToRgb(attack.color)}, ${alpha})`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(0, 0, attack.radius, -attack.swingAngle * Math.PI / 360, attack.swingAngle * Math.PI / 360);
            ctx.stroke();
        }
        
        ctx.restore();
    });
}

// Helper function to convert hex to rgb
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? 
        `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` 
        : '255, 255, 255';
}

// Event Listeners
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
});

// Start game button
startGameBtn.addEventListener('click', initGame);

// Next wave button
nextWaveBtn.addEventListener('click', () => {
    if (gameState === 'shop') {
        gameState = 'wave';
        startWave();
        nextWaveBtn.style.display = 'none';
        scrapWeaponBtn.style.display = 'none';
        selectedWeaponIndex = -1;
    }
});

// Scrap weapon button
scrapWeaponBtn.addEventListener('click', scrapWeapon);

// Restart button
restartBtn.addEventListener('click', () => {
    gameOverOverlay.style.display = 'none';
    initGame();
});

// Add CSS for fade animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        0% { opacity: 1; }
        70% { opacity: 1; }
        100% { opacity: 0; }
    }
`;
document.head.appendChild(style);

// Start game loop immediately
gameLoop();
