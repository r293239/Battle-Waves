// ============================================
// GAME LOGIC - With Enhanced Weapons System
// ============================================

// Game State
let gameState = 'start'; // 'start', 'wave', 'statSelect', 'shop', 'gameover'
let wave = 1;
let gold = GAME_DATA.PLAYER_START.gold;
let kills = 0;
let shopItems = [];
let spawnIndicators = [];
let selectedWeaponIndex = -1;
let visualEffects = [];
let mergeTargetIndex = -1;
let lastFrameTime = Date.now();

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
    meleeAttacks: [],
    
    // Ammo
    ammoPack: false
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
const mergeWeaponBtn = document.getElementById('mergeWeaponBtn');
const mergeInfo = document.getElementById('mergeInfo');
const reloadIndicator = document.getElementById('reloadIndicator');

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
        meleeAttacks: [],
        ammoPack: false
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
    mergeTargetIndex = -1;
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
    mergeWeaponBtn.style.display = 'none';
    mergeInfo.style.display = 'none';
    reloadIndicator.style.display = 'none';
    
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
            timer: 2000,
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
    
    // Hide buttons during wave
    scrapWeaponBtn.style.display = 'none';
    mergeWeaponBtn.style.display = 'none';
    selectedWeaponIndex = -1;
    mergeTargetIndex = -1;
    
    // Show spawn indicators
    showSpawnIndicators();
    
    // Spawn monsters after delay
    setTimeout(() => {
        for (let i = 0; i < waveConfig.monsters; i++) {
            spawnMonster();
        }
        spawnIndicators = [];
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

// Update weapon display
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
            
            // Calculate cooldown percentage
            let cooldownPercent = 100;
            if (weapon.lastAttack > 0) {
                const timeSinceLastAttack = currentTime - weapon.lastAttack;
                const cooldownTime = 1000 / weapon.attackSpeed;
                cooldownPercent = Math.min(100, (timeSinceLastAttack / cooldownTime) * 100);
            }
            
            // Calculate reload percentage for weapons with ammo
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
            
            // Add click handler for weapon selection/merging
            slot.addEventListener('click', () => selectWeapon(i));
        } else {
            slot.innerHTML = '<div class="empty-slot">+</div>';
        }
        
        weaponsGrid.appendChild(slot);
    }
}

// Select weapon for scrapping or merging
function selectWeapon(index) {
    if (gameState !== 'shop' && gameState !== 'statSelect') return;
    
    if (index >= player.weapons.length) return;
    
    const weapon = player.weapons[index];
    
    if (selectedWeaponIndex === -1) {
        // First weapon selected
        selectedWeaponIndex = index;
        scrapWeaponBtn.innerHTML = `<span class="icon">🗑️</span> Scrap ${weapon.getDisplayName()} (Get ${weapon.getScrapValue()} gold)`;
        scrapWeaponBtn.style.display = 'block';
        mergeWeaponBtn.style.display = 'none';
        mergeInfo.style.display = 'none';
        mergeTargetIndex = -1;
    } else if (selectedWeaponIndex === index) {
        // Clicked same weapon again, deselect
        selectedWeaponIndex = -1;
        scrapWeaponBtn.style.display = 'none';
        mergeWeaponBtn.style.display = 'none';
        mergeInfo.style.display = 'none';
        mergeTargetIndex = -1;
    } else {
        // Second weapon selected for merging
        const firstWeapon = player.weapons[selectedWeaponIndex];
        
        if (firstWeapon.id === weapon.id && firstWeapon.tier === weapon.tier) {
            // Same type and tier, can merge
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
            // Different weapons, switch selection
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

// Merge selected weapons
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
    
    // Create merged weapon
    const mergedWeapon = weapon1.merge(weapon2);
    
    if (!mergedWeapon) {
        showMessage("Merge failed!");
        return;
    }
    
    // Replace first weapon with merged version
    player.weapons[selectedWeaponIndex] = mergedWeapon;
    
    // Remove second weapon
    player.weapons.splice(mergeTargetIndex, 1);
    
    // Reset selection
    selectedWeaponIndex = -1;
    mergeTargetIndex = -1;
    scrapWeaponBtn.style.display = 'none';
    mergeWeaponBtn.style.display = 'none';
    
    showMessage(`Merged to create ${mergedWeapon.getDisplayName()}!`);
    
    updateUI();
    updateWeaponDisplay();
}

// Scrap selected weapon
function scrapWeapon() {
    if (selectedWeaponIndex === -1 || selectedWeaponIndex >= player.weapons.length) return;
    
    const weapon = player.weapons[selectedWeaponIndex];
    
    // Don't allow scrapping starting handgun
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

// Update shop display
function updateShopDisplay() {
    shopItemsContainer.innerHTML = '';
    
    for (let i = 0; i < 4; i++) {
        const shopItem = shopItems[i];
        const itemElement = document.createElement('div');
        
        if (shopItem) {
            itemElement.className = 'shop-item';
            const data = shopItem.data;
            const cost = data.cost;
            
            // Determine tag type
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
        case 'ammo_pack':
            // Reload all weapons
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

// Select stat buff - FIXED VERSION
function selectStatBuff(buff) {
    console.log('Selected buff:', buff);
    
    // Apply the buff effects directly to player stats
    if (buff.effect.maxHealth) {
        player.maxHealth += buff.effect.maxHealth;
        if (buff.effect.health) {
            player.health += buff.effect.health;
        } else {
            player.health += buff.effect.maxHealth; // Heal when getting max health boost
        }
    }
    
    if (buff.effect.damage) {
        player.baseDamage += buff.effect.damage;
        console.log('Damage increased to:', player.baseDamage);
    }
    
    if (buff.effect.speed) {
        player.speed += buff.effect.speed;
        console.log('Speed increased to:', player.speed);
    }
    
    if (buff.effect.lifeSteal) {
        player.lifeSteal += buff.effect.lifeSteal;
        console.log('Life steal increased to:', player.lifeSteal);
    }
    
    if (buff.effect.criticalChance) {
        player.criticalChance += buff.effect.criticalChance;
        console.log('Critical chance increased to:', player.criticalChance);
    }
    
    if (buff.effect.goldMultiplier) {
        player.goldMultiplier += buff.effect.goldMultiplier;
        console.log('Gold multiplier increased to:', player.goldMultiplier);
    }
    
    if (buff.effect.healthRegen) {
        player.healthRegen += buff.effect.healthRegen;
        console.log('Health regen increased to:', player.healthRegen);
    }
    
    if (buff.effect.damageReduction) {
        player.damageReduction += buff.effect.damageReduction;
        console.log('Damage reduction increased to:', player.damageReduction);
    }
    
    showMessage(`Selected: ${buff.name}`);
    
    waveCompleteOverlay.style.display = 'none';
    gameState = 'shop';
    
    shopItems = generateShopItems();
    updateShopDisplay();
    updateUI(); // Make sure UI updates after applying buffs
    
    nextWaveBtn.style.display = 'block';
    scrapWeaponBtn.style.display = 'none';
    mergeWeaponBtn.style.display = 'none';
    selectedWeaponIndex = -1;
    mergeTargetIndex = -1;
}

// End wave
function endWave() {
    gameState = 'statSelect';
    
    const waveConfig = getWaveConfig(wave);
    gold += Math.floor(waveConfig.goldReward * (1 + player.goldMultiplier));
    
    // Reload all weapons for free between waves
    player.weapons.forEach(weapon => {
        if (weapon.usesAmmo) {
            weapon.currentAmmo = weapon.magazineSize;
            weapon.isReloading = false;
        }
    });
    
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

// Show reload indicator
function showReloadIndicator(weaponName) {
    if (gameState === 'wave') {
        reloadIndicator.textContent = `${weaponName} - RELOADING...`;
        reloadIndicator.style.display = 'block';
        
        setTimeout(() => {
            reloadIndicator.style.display = 'none';
        }, 1000);
    }
}

// Add visual effect
function addVisualEffect(effect) {
    visualEffects.push(effect);
}

// Game Loop
function gameLoop() {
    const currentTime = Date.now();
    const deltaTime = currentTime - lastFrameTime;
    lastFrameTime = currentTime;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid background
    drawGrid();
    
    if (gameState === 'wave') {
        updateGame(deltaTime);
    }
    
    // Draw spawn indicators
    drawSpawnIndicators();
    
    // Draw everything
    drawMonsters();
    drawProjectiles();
    drawMeleeAttacks();
    drawVisualEffects();
    drawPlayer();
    
    // Update weapon cooldown displays
    if (gameState === 'wave' || gameState === 'shop' || gameState === 'statSelect') {
        updateWeaponDisplay();
    }
    
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
        
        ctx.save();
        ctx.translate(indicator.x, indicator.y);
        
        ctx.strokeStyle = '#ff0000';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        
        ctx.beginPath();
        ctx.moveTo(-15, -15);
        ctx.lineTo(15, 15);
        ctx.moveTo(15, -15);
        ctx.lineTo(-15, 15);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(0, 0, 20, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 0, 0, 0.3)';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        ctx.restore();
    }
}

// Update game state during wave
function updateGame(deltaTime) {
    // Update player position
    const dx = mouseX - player.x;
    const dy = mouseY - player.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > player.speed) {
        player.x += (dx / distance) * player.speed;
        player.y += (dy / distance) * player.speed;
    }
    
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
                
                if (weapon.id === 'shotgun') {
                    // Shotgun returns array of pellets
                    player.projectiles.push(...attack);
                    createShotgunAnimation(player.x, player.y, closestMonster.x, closestMonster.y, weapon);
                } else if (weapon.type === 'ranged') {
                    player.projectiles.push(attack);
                    if (weapon.id === 'laser') {
                        createEnergyAnimation(player.x, player.y, closestMonster.x, closestMonster.y);
                    }
                } else {
                    player.meleeAttacks.push(attack);
                    createWeaponAnimation(weapon, player.x, player.y, closestMonster.x, closestMonster.y);
                }
            }
        }
    });
}

// Create shotgun animation
function createShotgunAnimation(playerX, playerY, targetX, targetY, weapon) {
    const angle = Math.atan2(targetY - playerY, targetX - playerX);
    
    // Create blast effect
    addVisualEffect({
        type: 'shotgunBlast',
        x: playerX,
        y: playerY,
        angle: angle,
        color: weapon.projectileColor,
        startTime: Date.now(),
        duration: 200,
        intensity: weapon.tier
    });
    
    // Create individual pellet trails
    for (let i = 0; i < weapon.pelletCount; i++) {
        const spread = (Math.random() - 0.5) * (weapon.spreadAngle * Math.PI / 180);
        const pelletAngle = angle + spread;
        
        addVisualEffect({
            type: 'pelletTrail',
            x: playerX,
            y: playerY,
            angle: pelletAngle,
            color: weapon.projectileColor,
            startTime: Date.now(),
            duration: 150
        });
    }
}

// Create energy gun animation
function createEnergyAnimation(playerX, playerY, targetX, targetY) {
    addVisualEffect({
        type: 'energyBeam',
        x: playerX,
        y: playerY,
        targetX: targetX,
        targetY: targetY,
        color: '#00FFFF',
        startTime: Date.now(),
        duration: 100
    });
}

// Create weapon-specific animation
function createWeaponAnimation(weapon, playerX, playerY, targetX, targetY) {
    const angle = Math.atan2(targetY - playerY, targetX - playerX);
    
    switch(weapon.animation) {
        case 'swordSwing':
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
            // Spinning axe with multiple blades
            for (let i = 0; i < 8; i++) {
                const bladeAngle = (Math.PI * 2 * i) / 8;
                addVisualEffect({
                    type: 'spinningBlade',
                    x: playerX,
                    y: playerY,
                    angle: bladeAngle,
                    color: weapon.trailColor,
                    startTime: Date.now(),
                    duration: 400
                });
            }
            // Shockwave effect
            addVisualEffect({
                type: 'shockwaveRing',
                x: playerX,
                y: playerY,
                color: weapon.shockwaveColor,
                startTime: Date.now(),
                duration: 500,
                intensity: weapon.shockwaveIntensity
            });
            // Ground cracks
            for (let i = 0; i < 6; i++) {
                const crackAngle = Math.random() * Math.PI * 2;
                addVisualEffect({
                    type: 'groundCrack',
                    x: playerX + Math.cos(crackAngle) * (weapon.range * 0.7),
                    y: playerY + Math.sin(crackAngle) * (weapon.range * 0.7),
                    angle: crackAngle,
                    color: '#8B4513',
                    startTime: Date.now(),
                    duration: 600
                });
            }
            break;
            
        case 'daggerStab':
            addVisualEffect({
                type: 'daggerTrail',
                x: playerX,
                y: playerY,
                angle: angle,
                color: weapon.trailColor,
                startTime: Date.now(),
                duration: 150
            });
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
            // Hammer impact effect
            addVisualEffect({
                type: 'hammerImpact',
                x: playerX,
                y: playerY,
                color: weapon.trailColor,
                startTime: Date.now(),
                duration: 500
            });
            // Massive shockwave
            addVisualEffect({
                type: 'shockwaveRing',
                x: playerX,
                y: playerY,
                color: weapon.shockwaveColor,
                startTime: Date.now(),
                duration: 700,
                intensity: weapon.shockwaveIntensity * 1.5
            });
            // Debris and ground cracks
            for (let i = 0; i < 16; i++) {
                const debrisAngle = Math.random() * Math.PI * 2;
                const distance = Math.random() * weapon.range;
                addVisualEffect({
                    type: 'particle',
                    x: playerX + Math.cos(debrisAngle) * distance,
                    y: playerY + Math.sin(debrisAngle) * distance,
                    color: weapon.trailColor,
                    startTime: Date.now(),
                    duration: 500 + Math.random() * 300
                });
            }
            // Radial ground cracks
            for (let i = 0; i < 8; i++) {
                const crackAngle = (Math.PI * 2 * i) / 8;
                addVisualEffect({
                    type: 'groundCrack',
                    x: playerX,
                    y: playerY,
                    angle: crackAngle,
                    color: '#654321',
                    startTime: Date.now(),
                    duration: 800,
                    length: weapon.range
                });
            }
            break;
            
        case 'spearThrust':
            addVisualEffect({
                type: 'spearTrail',
                x: playerX,
                y: playerY,
                angle: angle,
                color: weapon.trailColor,
                startTime: Date.now(),
                duration: 250
            });
            for (let i = 0; i < weapon.pierceCount; i++) {
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
        
        // Check for bounces (energy gun)
        if (projectile.bounceCount > 0 && projectile.targetsHit) {
            // Find next target for bounce
            let nextTarget = null;
            let nextTargetDistance = Infinity;
            
            monsters.forEach(monster => {
                // Skip already hit monsters
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
                // Change direction to bounce to next target
                projectile.angle = Math.atan2(nextTarget.y - projectile.y, nextTarget.x - projectile.x);
                
                // Add bounce effect
                addVisualEffect({
                    type: 'energyBounce',
                    x: projectile.x,
                    y: projectile.y,
                    color: projectile.color,
                    startTime: Date.now(),
                    duration: 100
                });
                
                // Add target to hit list
                projectile.targetsHit.push(nextTarget);
                projectile.bounceCount--;
                
                // Continue without checking collision this frame
                continue;
            }
        }
        
        // Check collision with monsters
        for (let j = monsters.length - 1; j >= 0; j--) {
            const monster = monsters[j];
            const dx = projectile.x - monster.x;
            const dy = projectile.y - monster.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < (projectile.isPellet ? 3 : 5) + monster.radius) {
                // Calculate damage
                let damage = projectile.damage;
                let isCritical = false;
                
                if (Math.random() < player.criticalChance) {
                    damage *= 2;
                    isCritical = true;
                }
                
                if (player.damageReduction > 0) {
                    damage *= (1 - player.damageReduction);
                }
                
                monster.health -= damage;
                
                createDamageIndicator(monster.x, monster.y, Math.floor(damage), isCritical);
                
                if (player.lifeSteal > 0) {
                    const healAmount = damage * player.lifeSteal;
                    player.health = Math.min(player.maxHealth, player.health + healAmount);
                    createHealthPopup(player.x, player.y, Math.floor(healAmount));
                }
                
                // Remove projectile (unless it bounces)
                if (!projectile.bounceCount || !projectile.targetsHit) {
                    player.projectiles.splice(i, 1);
                } else {
                    // For energy gun, add monster to hit list
                    if (!projectile.targetsHit.includes(monster)) {
                        projectile.targetsHit.push(monster);
                    }
                }
                
                addVisualEffect({
                    type: 'hit',
                    x: monster.x,
                    y: monster.y,
                    color: projectile.color,
                    startTime: Date.now(),
                    duration: 200
                });
                
                if (monster.health <= 0) {
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
                if (attack.swingAngle < 360) {
                    const monsterAngle = Math.atan2(dy, dx);
                    const angleDiff = Math.abs(monsterAngle - attack.angle);
                    const normalizedDiff = Math.abs((angleDiff + Math.PI) % (2 * Math.PI) - Math.PI);
                    
                    if (normalizedDiff > (attack.swingAngle * Math.PI / 360)) {
                        continue;
                    }
                }
                
                let damage = attack.damage;
                let isCritical = false;
                
                if (Math.random() < player.criticalChance) {
                    damage *= 2;
                    isCritical = true;
                }
                
                if (player.damageReduction > 0) {
                    damage *= (1 - player.damageReduction);
                }
                
                monster.health -= damage;
                
                createDamageIndicator(monster.x, monster.y, Math.floor(damage), isCritical);
                
                if (player.lifeSteal > 0) {
                    const healAmount = damage * player.lifeSteal;
                    player.health = Math.min(player.maxHealth, player.health + healAmount);
                    createHealthPopup(player.x, player.y, Math.floor(healAmount));
                }
                
                hits++;
                
                addVisualEffect({
                    type: 'blood',
                    x: monster.x,
                    y: monster.y,
                    color: '#FF0000',
                    startTime: Date.now(),
                    duration: 300
                });
                
                if (attack.meleeType === 'pierce' && hits >= attack.pierceCount) {
                    break;
                }
                
                if (monster.health <= 0) {
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
        const dx = player.x - monster.x;
        const dy = player.y - monster.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        monster.x += (dx / distance) * monster.speed;
        monster.y += (dy / distance) * monster.speed;
        
        if (distance < player.radius + monster.radius) {
            if (currentTime - monster.lastAttack >= monster.attackCooldown) {
                // Apply player's damage reduction to monster damage
                let actualDamage = monster.damage;
                if (player.damageReduction > 0) {
                    actualDamage *= (1 - player.damageReduction);
                }
                
                player.health -= actualDamage;
                monster.lastAttack = currentTime;
                
                createDamageIndicator(player.x, player.y, Math.floor(actualDamage), false);
                
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
                
            case 'shockwaveRing':
                ctx.translate(effect.x, effect.y);
                const scale = progress * (effect.intensity || 1);
                ctx.strokeStyle = `rgba(${hexToRgb(effect.color)}, ${alpha * 0.7})`;
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.arc(0, 0, 20 * scale, 0, Math.PI * 2);
                ctx.stroke();
                ctx.strokeStyle = `rgba(${hexToRgb(effect.color)}, ${alpha * 0.3})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.arc(0, 0, 40 * scale, 0, Math.PI * 2);
                ctx.stroke();
                break;
                
            case 'spinningBlade':
                ctx.translate(effect.x, effect.y);
                ctx.rotate(effect.angle + progress * Math.PI * 4);
                ctx.fillStyle = `rgba(${hexToRgb(effect.color)}, ${alpha})`;
                // Draw blade shape
                ctx.beginPath();
                ctx.moveTo(0, -10);
                ctx.lineTo(20, -5);
                ctx.lineTo(20, 5);
                ctx.lineTo(0, 10);
                ctx.closePath();
                ctx.fill();
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
                
            case 'hammerImpact':
                ctx.translate(effect.x, effect.y);
                const hammerScale = 1 + Math.sin(progress * Math.PI) * 0.5;
                ctx.fillStyle = `rgba(${hexToRgb(effect.color)}, ${alpha})`;
                // Draw hammer head
                ctx.beginPath();
                ctx.arc(0, 0, 25 * hammerScale, 0, Math.PI * 2);
                ctx.fill();
                // Draw hammer handle
                ctx.fillStyle = `rgba(139, 69, 19, ${alpha})`;
                ctx.fillRect(-5, 25 * hammerScale, 10, 30 * hammerScale);
                break;
                
            case 'groundCrack':
                ctx.translate(effect.x, effect.y);
                ctx.rotate(effect.angle || 0);
                const crackLength = effect.length || 30;
                ctx.strokeStyle = `rgba(${hexToRgb(effect.color)}, ${alpha})`;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(0, 0);
                // Jagged crack line
                for (let i = 0; i < 5; i++) {
                    const segment = (i + 1) / 5;
                    const x = crackLength * segment * (1 - progress * 0.5);
                    const y = (Math.random() - 0.5) * 10;
                    ctx.lineTo(x, y);
                }
                ctx.stroke();
                break;
                
            case 'shotgunBlast':
                ctx.translate(effect.x, effect.y);
                ctx.rotate(effect.angle);
                const blastSize = 30 * (1 + Math.sin(progress * Math.PI));
                ctx.fillStyle = `rgba(${hexToRgb(effect.color)}, ${alpha})`;
                // Draw blast cone
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.arc(0, 0, blastSize, -0.3, 0.3);
                ctx.closePath();
                ctx.fill();
                break;
                
            case 'pelletTrail':
                ctx.translate(effect.x, effect.y);
                ctx.rotate(effect.angle);
                const pelletLength = 50 * (1 - progress);
                ctx.strokeStyle = `rgba(${hexToRgb(effect.color)}, ${alpha})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(pelletLength, 0);
                ctx.stroke();
                break;
                
            case 'energyBeam':
                ctx.strokeStyle = `rgba(${hexToRgb(effect.color)}, ${alpha})`;
                ctx.lineWidth = 3;
                ctx.lineCap = 'round';
                ctx.beginPath();
                ctx.moveTo(effect.x, effect.y);
                ctx.lineTo(effect.targetX, effect.targetY);
                ctx.stroke();
                // Glow effect
                ctx.strokeStyle = `rgba(${hexToRgb(effect.color)}, ${alpha * 0.3})`;
                ctx.lineWidth = 8;
                ctx.beginPath();
                ctx.moveTo(effect.x, effect.y);
                ctx.lineTo(effect.targetX, effect.targetY);
                ctx.stroke();
                break;
                
            case 'energyBounce':
                ctx.translate(effect.x, effect.y);
                const bounceScale = 1 + Math.sin(progress * Math.PI * 4) * 0.3;
                ctx.fillStyle = `rgba(${hexToRgb(effect.color)}, ${alpha})`;
                ctx.beginPath();
                ctx.arc(0, 0, 10 * bounceScale, 0, Math.PI * 2);
                ctx.fill();
                break;
                
            case 'particle':
                ctx.fillStyle = `rgba(${hexToRgb(effect.color)}, ${alpha})`;
                const size = 2 + progress * 3;
                ctx.beginPath();
                ctx.arc(effect.x, effect.y, size, 0, Math.PI * 2);
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

function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
    ctx.stroke();
    
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
        ctx.fillStyle = monster.color;
        ctx.beginPath();
        ctx.arc(monster.x, monster.y, monster.radius, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(monster.x, monster.y, monster.radius, 0, Math.PI * 2);
        ctx.stroke();
        
        const angleToPlayer = Math.atan2(player.y - monster.y, player.x - monster.x);
        const eyeRadius = monster.radius * 0.2;
        
        const leftEyeX = monster.x + Math.cos(angleToPlayer - 0.3) * (monster.radius * 0.6);
        const leftEyeY = monster.y + Math.sin(angleToPlayer - 0.3) * (monster.radius * 0.6);
        
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(leftEyeX, leftEyeY, eyeRadius, 0, Math.PI * 2);
        ctx.fill();
        
        const rightEyeX = monster.x + Math.cos(angleToPlayer + 0.3) * (monster.radius * 0.6);
        const rightEyeY = monster.y + Math.sin(angleToPlayer + 0.3) * (monster.radius * 0.6);
        
        ctx.beginPath();
        ctx.arc(rightEyeX, rightEyeY, eyeRadius, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#000000';
        const pupilX = monster.x + Math.cos(angleToPlayer) * (monster.radius * 0.7);
        const pupilY = monster.y + Math.sin(angleToPlayer) * (monster.radius * 0.7);
        
        ctx.beginPath();
        ctx.arc(pupilX, pupilY, eyeRadius * 0.5, 0, Math.PI * 2);
        ctx.fill();
        
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
        ctx.arc(projectile.x, projectile.y, projectile.isPellet ? 2 : 4, 0, Math.PI * 2);
        ctx.fill();
        
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
        
        if (attack.swingAngle >= 360) {
            const pulse = 1 + Math.sin(progress * Math.PI * 4) * 0.2;
            ctx.fillStyle = `rgba(${hexToRgb(attack.color)}, ${alpha * 0.3})`;
            ctx.beginPath();
            ctx.arc(0, 0, attack.radius * pulse, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.strokeStyle = `rgba(${hexToRgb(attack.color)}, ${alpha})`;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(0, 0, attack.radius, 0, Math.PI * 2);
            ctx.stroke();
            
            // Tier visual effect
            if (attack.tier > 1) {
                ctx.strokeStyle = `rgba(255, 215, 0, ${alpha * 0.5})`;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(0, 0, attack.radius * 1.1, 0, Math.PI * 2);
                ctx.stroke();
            }
        } else {
            const swingProgress = progress * 2;
            const currentAngle = attack.angle - (attack.swingAngle * Math.PI / 360) + 
                                (swingProgress * attack.swingAngle * Math.PI / 180);
            
            ctx.rotate(currentAngle);
            
            ctx.fillStyle = `rgba(${hexToRgb(attack.color)}, ${alpha * 0.4})`;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.arc(0, 0, attack.radius, -attack.swingAngle * Math.PI / 360, attack.swingAngle * Math.PI / 360);
            ctx.closePath();
            ctx.fill();
            
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
        mergeWeaponBtn.style.display = 'none';
        selectedWeaponIndex = -1;
        mergeTargetIndex = -1;
    }
});

// Scrap weapon button
scrapWeaponBtn.addEventListener('click', scrapWeapon);

// Merge weapon button
mergeWeaponBtn.addEventListener('click', mergeWeapons);

// Restart button
restartBtn.addEventListener('click', () => {
    gameOverOverlay.style.display = 'none';
    initGame();
});

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === ' ') {
        // Space to start next wave in shop mode
        if (gameState === 'shop' && nextWaveBtn.style.display !== 'none') {
            nextWaveBtn.click();
        }
    } else if (e.key === 'r') {
        // R to reload all weapons (in shop mode)
        if (gameState === 'shop') {
            player.weapons.forEach(weapon => {
                if (weapon.usesAmmo && !weapon.isReloading) {
                    weapon.startReload();
                }
            });
        }
    }
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

// Start game loop
gameLoop();
