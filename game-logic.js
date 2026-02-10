// ============================================
// GAME LOGIC
// ============================================

// Game Configuration
const CONFIG = {
    PLAYER: {
        SPEED: 5,
        MAX_HEALTH: 100,
        START_GOLD: 100,
        RADIUS: 20,
        BASE_DAMAGE: 10
    },
    WAVE: {
        START_MONSTERS: 5,
        MONSTER_INCREMENT: 2,
        GOLD_PER_WAVE: 50,
        WAVE_INCREMENT: 20
    },
    SHOP: {
        ITEM_COUNT: 4,
        REFRESH_COST: 25
    },
    WEAPONS: {
        SLOTS: 6
    }
};

// Game State
let gameState = 'shop'; // 'shop', 'wave', 'gameover'
let wave = 1;
let gold = CONFIG.PLAYER.START_GOLD;
let kills = 0;
let selectedWeaponSlot = null;

// Global mouse position
let mouseX = 400;
let mouseY = 300;

// Player Object
const player = {
    x: 400,
    y: 300,
    radius: CONFIG.PLAYER.RADIUS,
    health: CONFIG.PLAYER.MAX_HEALTH,
    maxHealth: CONFIG.PLAYER.MAX_HEALTH,
    speed: CONFIG.PLAYER.SPEED,
    color: '#ff6b6b',
    baseDamage: CONFIG.PLAYER.BASE_DAMAGE,
    
    // Stats from items
    criticalChance: 0,
    lifeSteal: 0,
    goldMultiplier: 1,
    cleave: 0,
    bleed: 0,
    pierce: 0,
    homing: 0,
    
    get totalDamage() {
        return this.baseDamage;
    },
    
    weapons: Array(6).fill(null), // Fixed: Initialize with 6 slots
    projectiles: [],
    meleeAttacks: []
};

// Monsters
let monsters = [];

// DOM Elements
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const waveDisplay = document.getElementById('waveDisplay');
const gameOverlay = document.getElementById('gameOverlay');
const overlayTitle = document.getElementById('overlayTitle');
const overlayText = document.getElementById('overlayText');
const weaponsGrid = document.getElementById('weaponsGrid');
const shopItems = document.getElementById('shopItems');
const refreshShopBtn = document.getElementById('refreshShop');
const startWaveBtn = document.getElementById('startWave');
const continueBtn = document.getElementById('continueBtn');
const restartBtn = document.getElementById('restartBtn');

// UI Elements
const healthValue = document.getElementById('healthValue');
const damageValue = document.getElementById('damageValue');
const speedValue = document.getElementById('speedValue');
const goldValue = document.getElementById('goldValue');
const waveValue = document.getElementById('waveValue');
const killsValue = document.getElementById('killsValue');
const healthFill = document.getElementById('healthFill');

// Initialize Weapon Slots (FIXED)
function initWeaponSlots() {
    weaponsGrid.innerHTML = '';
    
    for (let i = 0; i < CONFIG.WEAPONS.SLOTS; i++) {
        const slot = document.createElement('div');
        slot.className = 'weapon-slot';
        slot.dataset.index = i;
        
        if (i === 0 && !player.weapons[i]) {
            // Starting weapon
            const handgun = getWeaponById('handgun');
            const weaponInstance = new WeaponInstance(handgun, 1);
            player.weapons[i] = weaponInstance;
        }
        
        updateWeaponSlotDisplay(i);
        
        slot.addEventListener('click', (e) => {
            e.stopPropagation();
            handleWeaponSlotClick(i);
        });
        
        weaponsGrid.appendChild(slot);
    }
}

// Update single weapon slot display
function updateWeaponSlotDisplay(index) {
    const slot = weaponsGrid.children[index];
    if (!slot) return;
    
    const weapon = player.weapons[index];
    
    if (weapon) {
        slot.classList.add('occupied');
        slot.classList.remove('active');
        slot.innerHTML = `
            <div class="weapon-icon">${weapon.icon}</div>
            <div class="weapon-level">Lvl ${weapon.level}</div>
            <span class="item-tag ${weapon.type === 'melee' ? 'melee-tag' : 'ranged-tag'}">
                ${weapon.type === 'melee' ? 'MELEE' : 'RANGED'}
            </span>
        `;
    } else {
        slot.classList.remove('occupied', 'active');
        slot.innerHTML = '<div class="weapon-icon">➕</div>';
    }
}

// Handle weapon slot click for merging (FIXED)
function handleWeaponSlotClick(index) {
    const slot = weaponsGrid.children[index];
    const weapon = player.weapons[index];
    
    if (selectedWeaponSlot === null) {
        // First selection
        if (weapon) {
            selectedWeaponSlot = index;
            slot.classList.add('active');
        }
    } else if (selectedWeaponSlot === index) {
        // Clicking same slot - deselect
        slot.classList.remove('active');
        selectedWeaponSlot = null;
    } else {
        // Second selection
        const firstIndex = selectedWeaponSlot;
        const secondIndex = index;
        const firstWeapon = player.weapons[firstIndex];
        const secondWeapon = player.weapons[secondIndex];
        
        // Clear previous selection
        weaponsGrid.children[firstIndex].classList.remove('active');
        
        if (firstWeapon && secondWeapon) {
            // Both slots have weapons
            if (firstWeapon.id === secondWeapon.id) {
                // Same weapon type - merge/upgrade
                if (firstWeapon.upgrade()) {
                    // Remove second weapon
                    player.weapons[secondIndex] = null;
                    updateWeaponSlotDisplay(secondIndex);
                    
                    // Update first weapon display
                    updateWeaponSlotDisplay(firstIndex);
                    
                    showMessage(`Upgraded ${firstWeapon.name} to Level ${firstWeapon.level}!`);
                } else {
                    showMessage('Weapon at maximum level!');
                }
            } else {
                // Different weapons - swap them
                player.weapons[firstIndex] = secondWeapon;
                player.weapons[secondIndex] = firstWeapon;
                updateWeaponSlotDisplay(firstIndex);
                updateWeaponSlotDisplay(secondIndex);
                showMessage('Swapped weapons!');
            }
        } else if (firstWeapon && !secondWeapon) {
            // Move weapon to empty slot
            player.weapons[secondIndex] = firstWeapon;
            player.weapons[firstIndex] = null;
            updateWeaponSlotDisplay(firstIndex);
            updateWeaponSlotDisplay(secondIndex);
        } else if (!firstWeapon && secondWeapon) {
            // Move weapon from second to first
            player.weapons[firstIndex] = secondWeapon;
            player.weapons[secondIndex] = null;
            updateWeaponSlotDisplay(firstIndex);
            updateWeaponSlotDisplay(secondIndex);
        }
        
        selectedWeaponSlot = null;
    }
}

// Initialize Shop (FIXED: Won't refresh automatically)
function initShop() {
    shopItems.innerHTML = '';
    
    // Only generate if not already generated
    if (currentShopItems.length === 0) {
        currentShopItems = initShopItems();
    }
    
    currentShopItems.forEach((shopItem, index) => {
        const itemElement = document.createElement('div');
        itemElement.className = 'shop-item';
        itemElement.dataset.index = index;
        
        let icon, name, description, cost, tag;
        
        if (shopItem.type === 'weapon') {
            icon = shopItem.data.icon;
            name = shopItem.data.name;
            description = shopItem.data.description;
            cost = shopItem.cost;
            tag = shopItem.data.type === 'melee' ? 'melee' : 'ranged';
        } else {
            icon = shopItem.data.icon;
            name = shopItem.data.name;
            description = shopItem.data.description;
            cost = shopItem.cost;
            tag = shopItem.data.effect;
        }
        
        itemElement.innerHTML = `
            <div class="item-info">
                <div class="item-name">
                    ${icon} ${name}
                    ${shopItem.type === 'weapon' ? 
                        `<span class="item-tag ${tag === 'melee' ? 'melee-tag' : 'ranged-tag'}">
                            ${tag.toUpperCase()}
                        </span>` : ''
                    }
                </div>
                <div class="item-effect">${description}</div>
            </div>
            <div class="item-cost">${cost}g</div>
        `;
        
        itemElement.addEventListener('click', () => purchaseItem(index));
        shopItems.appendChild(itemElement);
    });
}

// Purchase item from shop
function purchaseItem(index) {
    if (index >= currentShopItems.length) return;
    
    const shopItem = currentShopItems[index];
    
    if (gold < shopItem.cost) {
        showMessage(`Not enough gold! Need ${shopItem.cost}, have ${gold}`);
        return;
    }
    
    gold -= shopItem.cost;
    
    if (shopItem.type === 'weapon') {
        // Find empty weapon slot
        const emptySlot = player.weapons.findIndex(w => !w);
        
        if (emptySlot === -1) {
            showMessage('No empty weapon slots!');
            gold += shopItem.cost; // Refund
            return;
        }
        
        const weaponInstance = new WeaponInstance(shopItem.data, 1);
        player.weapons[emptySlot] = weaponInstance;
        updateWeaponSlotDisplay(emptySlot);
        showMessage(`Purchased ${weaponInstance.name}!`);
        
        // Remove from shop and replace with new item
        currentShopItems.splice(index, 1);
        
        // Add new random item to shop
        const availableItems = GAME_DATA.ITEMS.filter(item => 
            !['health_potion'].includes(item.id) &&
            !currentShopItems.some(si => si.type === 'item' && si.data.id === item.id)
        );
        
        if (availableItems.length > 0) {
            const randomIndex = Math.floor(Math.random() * availableItems.length);
            const newItem = {...availableItems[randomIndex]};
            currentShopItems.push({
                type: 'item',
                data: newItem,
                cost: newItem.cost
            });
        }
        
    } else {
        // Apply item effect
        applyItemEffect(shopItem.data);
        showMessage(`Purchased ${shopItem.data.name}!`);
        
        // Remove from shop and replace with new item
        currentShopItems.splice(index, 1);
        
        // Add new random weapon to shop
        const availableWeapons = GAME_DATA.WEAPONS.filter(weapon => 
            weapon.id !== 'handgun' &&
            !currentShopItems.some(si => si.type === 'weapon' && si.data.id === weapon.id)
        );
        
        if (availableWeapons.length > 0) {
            const randomIndex = Math.floor(Math.random() * availableWeapons.length);
            const newWeapon = {...availableWeapons[randomIndex]};
            currentShopItems.push({
                type: 'weapon',
                data: newWeapon,
                cost: newWeapon.cost
            });
        }
    }
    
    // Update shop display
    initShop();
    updateUI();
}

// Apply item effects
function applyItemEffect(item) {
    switch(item.effect) {
        case 'heal':
            player.health = Math.min(player.maxHealth, player.health + item.value);
            break;
        case 'damage':
            player.baseDamage += item.value;
            break;
        case 'speed':
            player.speed += item.value;
            break;
        case 'maxHealth':
            player.maxHealth += item.value;
            player.health += item.value;
            break;
        case 'critical':
            player.criticalChance += item.value;
            break;
        case 'lifeSteal':
            player.lifeSteal += item.value;
            break;
        case 'goldMultiplier':
            player.goldMultiplier += item.value;
            break;
        case 'cleave':
            player.cleave += item.value;
            break;
        case 'bleed':
            player.bleed += item.value;
            break;
        case 'pierce':
            player.pierce += item.value;
            break;
        case 'homing':
            player.homing += item.value;
            break;
    }
    updateUI();
}

// Start Wave
function startWave() {
    if (gameState !== 'shop') return;
    
    gameState = 'wave';
    gameOverlay.style.display = 'none';
    waveDisplay.textContent = `Wave ${wave}`;
    waveDisplay.style.opacity = 1;
    
    // Clear previous game objects
    monsters = [];
    player.projectiles = [];
    player.meleeAttacks = [];
    
    // Spawn monsters
    const monsterCount = CONFIG.WAVE.START_MONSTERS + (wave - 1) * CONFIG.WAVE.MONSTER_INCREMENT;
    
    for (let i = 0; i < monsterCount; i++) {
        spawnMonster();
    }
    
    // Fade out wave display
    setTimeout(() => {
        waveDisplay.style.opacity = 0.5;
    }, 2000);
}

// Spawn a monster
function spawnMonster() {
    const side = Math.floor(Math.random() * 4);
    let x, y;
    
    switch(side) {
        case 0: x = -50; y = Math.random() * canvas.height; break;
        case 1: x = canvas.width + 50; y = Math.random() * canvas.height; break;
        case 2: x = Math.random() * canvas.width; y = -50; break;
        case 3: x = Math.random() * canvas.width; y = canvas.height + 50; break;
    }
    
    const baseHealth = 30 + wave * 10;
    const baseDamage = 5 + wave * 2;
    const baseSpeed = 1 + wave * 0.2;
    
    const monsterTypes = ['normal', 'fast', 'tank'];
    const type = monsterTypes[Math.floor(Math.random() * monsterTypes.length)];
    
    let radius, health, damage, speed, color;
    
    switch(type) {
        case 'fast':
            radius = 12;
            health = baseHealth * 0.7;
            damage = baseDamage * 0.8;
            speed = baseSpeed * 1.5;
            color = '#4ECDC4'; // Teal
            break;
        case 'tank':
            radius = 25;
            health = baseHealth * 2;
            damage = baseDamage * 1.5;
            speed = baseSpeed * 0.7;
            color = '#FF6B6B'; // Red
            break;
        default: // normal
            radius = 18;
            health = baseHealth;
            damage = baseDamage;
            speed = baseSpeed;
            color = `hsl(${Math.random() * 60}, 70%, 50%)`;
    }
    
    monsters.push({
        x, y,
        radius,
        health,
        maxHealth: health,
        damage,
        speed: Math.min(5, speed),
        color,
        type,
        bleedStacks: 0,
        bleedDamage: 0
    });
}

// End Wave
function endWave() {
    gameState = 'shop';
    const waveReward = CONFIG.WAVE.GOLD_PER_WAVE + wave * CONFIG.WAVE.WAVE_INCREMENT;
    gold += Math.floor(waveReward * player.goldMultiplier);
    wave++;
    
    overlayTitle.textContent = 'Wave Complete!';
    overlayText.textContent = `You survived! Earned ${Math.floor(waveReward * player.goldMultiplier)} gold.`;
    gameOverlay.style.display = 'flex';
    
    updateUI();
}

// Game Over
function gameOver() {
    gameState = 'gameover';
    overlayTitle.textContent = 'Game Over!';
    overlayText.textContent = `Survived ${wave - 1} waves with ${kills} kills.`;
    gameOverlay.style.display = 'flex';
}

// Update UI
function updateUI() {
    // Calculate total weapon damage
    let totalWeaponDamage = 0;
    player.weapons.forEach(weapon => {
        if (weapon) totalWeaponDamage += weapon.damage;
    });
    
    healthValue.textContent = `${Math.floor(player.health)}/${player.maxHealth}`;
    damageValue.textContent = player.baseDamage + totalWeaponDamage;
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

// Game Loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid background
    drawGrid();
    
    if (gameState === 'wave') {
        updateGame();
    }
    
    // Draw everything
    drawMonsters();
    drawProjectiles();
    drawMeleeAttacks();
    drawPlayer();
    
    requestAnimationFrame(gameLoop);
}

// Update game state during wave
function updateGame() {
    // Update player position
    updatePlayerPosition();
    
    // Update weapons and attacks
    updateWeapons();
    
    // Update projectiles
    updateProjectiles();
    
    // Update melee attacks
    updateMeleeAttacks();
    
    // Update monsters
    updateMonsters();
    
    // Clean up dead monsters
    monsters = monsters.filter(monster => monster.health > 0);
    
    // Check if wave is complete
    if (monsters.length === 0) {
        endWave();
    }
}

function updatePlayerPosition() {
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
}

function updateWeapons() {
    const currentTime = Date.now();
    
    player.weapons.forEach(weapon => {
        if (!weapon || monsters.length === 0) return;
        
        if (weapon.canAttack(currentTime)) {
            if (weapon.type === 'ranged') {
                // Find target for ranged weapon
                let closestMonster = null;
                let closestDistance = Infinity;
                
                monsters.forEach(monster => {
                    const dx = monster.x - player.x;
                    const dy = monster.y - player.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < closestDistance && distance < weapon.currentRange) {
                        closestDistance = distance;
                        closestMonster = monster;
                    }
                });
                
                if (closestMonster) {
                    mouseX = closestMonster.x;
                    mouseY = closestMonster.y;
                    const projectile = weapon.attack(player.x, player.y);
                    player.projectiles.push(projectile);
                }
            } else {
                // Melee weapon attacks automatically in range
                const meleeAttack = weapon.attack(player.x, player.y, player);
                player.meleeAttacks.push(meleeAttack);
            }
        }
    });
}

function updateProjectiles() {
    for (let i = player.projectiles.length - 1; i >= 0; i--) {
        const projectile = player.projectiles[i];
        
        // Move projectile
        projectile.x += Math.cos(projectile.angle) * projectile.speed;
        projectile.y += Math.sin(projectile.angle) * projectile.speed;
        
        // Check if reached max range
        const dx = projectile.x - player.x;
        const dy = projectile.y - player.y;
        const distanceFromPlayer = Math.sqrt(dx * dx + dy * dy);
        
        if (distanceFromPlayer > projectile.range) {
            player.projectiles.splice(i, 1);
            continue;
        }
        
        // Check collision with monsters
        let pierced = 0;
        for (let j = monsters.length - 1; j >= 0; j--) {
            const monster = monsters[j];
            const dx = projectile.x - monster.x;
            const dy = projectile.y - monster.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 10 + monster.radius) {
                // Calculate damage with critical chance
                let damage = projectile.damage;
                if (Math.random() < player.criticalChance) {
                    damage *= 2;
                }
                
                monster.health -= damage;
                
                // Apply life steal
                if (player.lifeSteal > 0) {
                    player.health = Math.min(player.maxHealth, player.health + damage * player.lifeSteal);
                }
                
                // Apply bleed if it's a melee weapon (for certain effects)
                if (player.bleed > 0 && Math.random() < 0.3) {
                    monster.bleedStacks = (monster.bleedStacks || 0) + 1;
                    monster.bleedDamage = player.bleed;
                }
                
                pierced++;
                
                // Check if monster is dead
                if (monster.health <= 0) {
                    monsters.splice(j, 1);
                    kills++;
                    gold += Math.floor(10 * player.goldMultiplier);
                }
                
                // Check pierce limit
                if (pierced > player.pierce) {
                    player.projectiles.splice(i, 1);
                    break;
                }
            }
        }
    }
}

function updateMeleeAttacks() {
    const currentTime = Date.now();
    
    for (let i = player.meleeAttacks.length - 1; i >= 0; i--) {
        const attack = player.meleeAttacks[i];
        
        // Check if attack is still active
        if (currentTime - attack.startTime > attack.activeTime) {
            player.meleeAttacks.splice(i, 1);
            continue;
        }
        
        // Check collision with monsters
        let hits = 0;
        for (let j = monsters.length - 1; j >= 0; j--) {
            const monster = monsters[j];
            const dx = monster.x - attack.x;
            const dy = monster.y - attack.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < attack.radius + monster.radius) {
                // Calculate damage with critical chance
                let damage = attack.damage;
                if (Math.random() < player.criticalChance) {
                    damage *= 2;
                }
                
                monster.health -= damage;
                
                // Apply life steal
                if (player.lifeSteal > 0) {
                    player.health = Math.min(player.maxHealth, player.health + damage * player.lifeSteal);
                }
                
                // Apply bleed
                if (player.bleed > 0) {
                    monster.bleedStacks = (monster.bleedStacks || 0) + 1;
                    monster.bleedDamage = player.bleed;
                }
                
                hits++;
                
                // Check if monster is dead
                if (monster.health <= 0) {
                    monsters.splice(j, 1);
                    kills++;
                    gold += Math.floor(10 * player.goldMultiplier);
                }
                
                // Check cleave limit
                if (hits > attack.cleave + 1) { // +1 for the primary target
                    break;
                }
            }
        }
    }
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
        
        // Apply bleed damage
        if (monster.bleedStacks > 0 && currentTime % 1000 < 16) { // Every second
            monster.health -= monster.bleedDamage * monster.bleedStacks;
        }
        
        // Check collision with player
        if (distance < player.radius + monster.radius) {
            player.health -= monster.damage;
            
            if (player.health <= 0) {
                gameOver();
            }
        }
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
    
    // Draw eyes
    const angle = Math.atan2(mouseY - player.y, mouseX - player.x);
    const eyeX = player.x + Math.cos(angle) * (player.radius * 0.6);
    const eyeY = player.y + Math.sin(angle) * (player.radius * 0.6);
    
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(eyeX, eyeY, player.radius * 0.3, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(eyeX, eyeY, player.radius * 0.15, 0, Math.PI * 2);
    ctx.fill();
}

function drawMonsters() {
    monsters.forEach(monster => {
        // Draw monster body
        ctx.fillStyle = monster.color;
        ctx.beginPath();
        ctx.arc(monster.x, monster.y, monster.radius, 0, Math.PI * 2);
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
        
        // Draw bleed effect if applicable
        if (monster.bleedStacks > 0) {
            ctx.strokeStyle = '#ff0000';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(monster.x, monster.y, monster.radius + 2, 0, Math.PI * 2);
            ctx.stroke();
        }
    });
}

function drawProjectiles() {
    player.projectiles.forEach(projectile => {
        ctx.fillStyle = projectile.color;
        ctx.beginPath();
        ctx.arc(projectile.x, projectile.y, 5, 0, Math.PI * 2);
        ctx.fill();
        
        // Add glow
        ctx.shadowColor = projectile.color;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
    });
}

function drawMeleeAttacks() {
    const currentTime = Date.now();
    
    player.meleeAttacks.forEach(attack => {
        const progress = (currentTime - attack.startTime) / attack.activeTime;
        const alpha = 0.7 * (1 - progress);
        
        ctx.save();
        ctx.translate(attack.x, attack.y);
        ctx.rotate(attack.angle);
        
        // Draw melee swing arc
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.fillStyle = `rgba(255, 100, 100, ${alpha * 0.3})`;
        ctx.lineWidth = 3;
        
        ctx.beginPath();
        ctx.arc(0, 0, attack.radius, -Math.PI/6, Math.PI/6);
        ctx.lineTo(0, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        ctx.restore();
    });
}

// Event Listeners
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
});

refreshShopBtn.addEventListener('click', () => {
    if (gameState !== 'shop') return;
    
    if (gold >= CONFIG.SHOP.REFRESH_COST) {
        gold -= CONFIG.SHOP.REFRESH_COST;
        currentShopItems = refreshShopItems(); // Only refresh when button clicked
        initShop();
        updateUI();
        showMessage('Shop refreshed!');
    } else {
        showMessage(`Need ${CONFIG.SHOP.REFRESH_COST} gold to refresh!`);
    }
});

startWaveBtn.addEventListener('click', () => {
    if (gameState === 'shop') {
        startWave();
    }
});

continueBtn.addEventListener('click', () => {
    if (gameState === 'shop') {
        gameOverlay.style.display = 'none';
    } else if (gameState === 'gameover') {
        restartGame();
    }
});

restartBtn.addEventListener('click', restartGame);

// Restart Game
function restartGame() {
    // Reset player
    Object.assign(player, {
        x: 400,
        y: 300,
        health: CONFIG.PLAYER.MAX_HEALTH,
        maxHealth: CONFIG.PLAYER.MAX_HEALTH,
        speed: CONFIG.PLAYER.SPEED,
        baseDamage: CONFIG.PLAYER.BASE_DAMAGE,
        criticalChance: 0,
        lifeSteal: 0,
        goldMultiplier: 1,
        cleave: 0,
        bleed: 0,
        pierce: 0,
        homing: 0,
        weapons: Array(6).fill(null),
        projectiles: [],
        meleeAttacks: []
    });
    
    // Reset game state
    wave = 1;
    gold = CONFIG.PLAYER.START_GOLD;
    kills = 0;
    monsters = [];
    gameState = 'shop';
    
    // Clear shop items
    currentShopItems = [];
    
    // Reset UI
    updateUI();
    initWeaponSlots();
    initShop();
    gameOverlay.style.display = 'none';
    
    showMessage('Game restarted!');
}

// Initialize Game
function initGame() {
    // Add CSS animation for fadeOut
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeOut {
            0% { opacity: 1; }
            70% { opacity: 1; }
            100% { opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    // Initialize everything
    initWeaponSlots();
    initShop();
    updateUI();
    gameLoop();
}

// Start the game
window.addEventListener('load', initGame);
