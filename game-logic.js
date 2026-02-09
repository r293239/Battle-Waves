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
let currentShopItems = [];

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
    criticalChance: 0,
    lifeSteal: 0,
    goldMultiplier: 1,
    explosiveDamage: 0,
    
    get totalDamage() {
        return this.baseDamage;
    },
    
    weapons: [],
    projectiles: [],
    stats: {
        damage: 0,
        speed: 0,
        maxHealth: 0
    }
};

// Monsters
let monsters = [];
let mouseX = 400;
let mouseY = 300;

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

// Initialize Weapon Slots
function initWeaponSlots() {
    weaponsGrid.innerHTML = '';
    for (let i = 0; i < CONFIG.WEAPONS.SLOTS; i++) {
        const slot = document.createElement('div');
        slot.className = 'weapon-slot';
        slot.dataset.index = i;
        
        if (i === 0) {
            // Starting weapon
            const handgun = getWeaponById('handgun');
            const weaponInstance = new WeaponInstance(handgun, 1);
            player.weapons[0] = weaponInstance;
            
            slot.classList.add('occupied');
            slot.innerHTML = `
                <div class="weapon-icon">${handgun.icon}</div>
                <div class="weapon-level">Lvl ${weaponInstance.level}</div>
            `;
        } else {
            slot.innerHTML = '<div class="weapon-icon">➕</div>';
        }
        
        slot.addEventListener('click', () => handleWeaponSlotClick(i));
        weaponsGrid.appendChild(slot);
    }
    updateWeaponDisplay();
}

// Handle weapon slot click for merging
function handleWeaponSlotClick(index) {
    const slot = weaponsGrid.children[index];
    
    if (selectedWeaponSlot === null) {
        // First selection
        if (player.weapons[index]) {
            selectedWeaponSlot = index;
            slot.classList.add('active');
        }
    } else if (selectedWeaponSlot === index) {
        // Clicking same slot - deselect
        slot.classList.remove('active');
        selectedWeaponSlot = null;
    } else {
        // Second selection - try to merge
        const firstSlot = selectedWeaponSlot;
        const secondSlot = index;
        
        if (player.weapons[firstSlot] && player.weapons[secondSlot]) {
            // Both slots have weapons
            if (player.weapons[firstSlot].id === player.weapons[secondSlot].id) {
                // Same weapon type - merge/upgrade
                if (player.weapons[firstSlot].upgrade()) {
                    // Remove second weapon
                    player.weapons[secondSlot] = null;
                    weaponsGrid.children[secondSlot].innerHTML = '<div class="weapon-icon">➕</div>';
                    weaponsGrid.children[secondSlot].classList.remove('occupied', 'active');
                    
                    // Update first weapon display
                    updateWeaponDisplay();
                    
                    // Show merge message
                    showMessage(`Upgraded ${player.weapons[firstSlot].name} to Level ${player.weapons[firstSlot].level}!`);
                } else {
                    showMessage('Weapon at maximum level!');
                }
            } else {
                showMessage('Can only merge same weapon types!');
            }
        } else if (player.weapons[firstSlot] && !player.weapons[secondSlot]) {
            // Move weapon to empty slot
            player.weapons[secondSlot] = player.weapons[firstSlot];
            player.weapons[firstSlot] = null;
            updateWeaponDisplay();
        }
        
        // Clear selection
        weaponsGrid.children[firstSlot].classList.remove('active');
        selectedWeaponSlot = null;
    }
}

// Update weapon display
function updateWeaponDisplay() {
    for (let i = 0; i < CONFIG.WEAPONS.SLOTS; i++) {
        const slot = weaponsGrid.children[i];
        const weapon = player.weapons[i];
        
        if (weapon) {
            slot.classList.add('occupied');
            slot.classList.remove('active');
            slot.innerHTML = `
                <div class="weapon-icon">${weapon.icon}</div>
                <div class="weapon-level">Lvl ${weapon.level}</div>
            `;
        } else {
            slot.classList.remove('occupied', 'active');
            slot.innerHTML = '<div class="weapon-icon">➕</div>';
        }
    }
}

// Initialize Shop
function initShop() {
    shopItems.innerHTML = '';
    currentShopItems = generateShopItems();
    
    currentShopItems.forEach((shopItem, index) => {
        const itemElement = document.createElement('div');
        itemElement.className = 'shop-item';
        itemElement.dataset.index = index;
        
        let icon, name, description, cost;
        
        if (shopItem.type === 'weapon') {
            icon = shopItem.data.icon;
            name = shopItem.data.name;
            description = shopItem.data.description;
            cost = shopItem.cost;
        } else {
            icon = shopItem.data.icon;
            name = shopItem.data.name;
            description = shopItem.data.description;
            cost = shopItem.cost;
        }
        
        itemElement.innerHTML = `
            <div class="item-info">
                <div class="item-name">${icon} ${name}</div>
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
        updateWeaponDisplay();
        showMessage(`Purchased ${weaponInstance.name}!`);
    } else {
        // Apply item effect
        applyItemEffect(shopItem.data);
        showMessage(`Purchased ${shopItem.data.name}!`);
    }
    
    // Remove from shop
    currentShopItems.splice(index, 1);
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
        case 'explosive':
            player.explosiveDamage += item.value;
            break;
    }
    updateUI();
}

// Start Wave
function startWave() {
    gameState = 'wave';
    gameOverlay.style.display = 'none';
    waveDisplay.textContent = `Wave ${wave}`;
    waveDisplay.style.opacity = 1;
    
    // Clear previous monsters and projectiles
    monsters = [];
    player.projectiles = [];
    
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
    
    monsters.push({
        x, y,
        radius: 15 + Math.random() * 10,
        health: baseHealth,
        maxHealth: baseHealth,
        damage: baseDamage,
        speed: Math.min(5, baseSpeed),
        color: `hsl(${Math.random() * 60}, 70%, 50%)`,
        type: Math.random() > 0.8 ? 'elite' : 'normal'
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
    initShop();
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
    healthValue.textContent = `${Math.floor(player.health)}/${player.maxHealth}`;
    damageValue.textContent = player.baseDamage + player.weapons.reduce((sum, w) => w ? sum + w.damage : sum, 0);
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
        background: rgba(0, 0, 0, 0.8);
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
        // Update player position
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
        
        // Update weapons and attack
        const currentTime = Date.now();
        player.weapons.forEach(weapon => {
            if (!weapon) return;
            
            if (monsters.length > 0 && weapon.canAttack(currentTime)) {
                // Find closest monster
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
                    const projectile = weapon.attack(closestMonster.x, closestMonster.y, player.x, player.y);
                    player.projectiles.push(projectile);
                }
            }
        });
        
        // Update projectiles
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
            for (let j = monsters.length - 1; j >= 0; j--) {
                const monster = monsters[j];
                const dx = projectile.x - monster.x;
                const dy = projectile.y - monster.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < player.radius + monster.radius) {
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
                    
                    // Remove projectile
                    player.projectiles.splice(i, 1);
                    
                    // Check if monster is dead
                    if (monster.health <= 0) {
                        monsters.splice(j, 1);
                        kills++;
                        gold += Math.floor(10 * player.goldMultiplier);
                        
                        // Spawn new monster if wave not complete
                        if (monsters.length === 0) {
                            endWave();
                        } else {
                            // Small chance to spawn replacement
                            if (Math.random() < 0.3) {
                                spawnMonster();
                            }
                        }
                    }
                    break;
                }
            }
        }
        
        // Update monsters
        monsters.forEach(monster => {
            // Move towards player
            const dx = player.x - monster.x;
            const dy = player.y - monster.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            monster.x += (dx / distance) * monster.speed;
            monster.y += (dy / distance) * monster.speed;
            
            // Check collision with player
            if (distance < player.radius + monster.radius) {
                player.health -= monster.damage;
                monster.health = 0; // Monster dies on collision
                
                if (player.health <= 0) {
                    gameOver();
                }
            }
        });
        
        // Clean up dead monsters
        monsters = monsters.filter(monster => monster.health > 0);
    }
    
    // Draw everything
    drawMonsters();
    drawProjectiles();
    drawPlayer();
    
    requestAnimationFrame(gameLoop);
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

// Event Listeners
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
});

refreshShopBtn.addEventListener('click', () => {
    if (gold >= CONFIG.SHOP.REFRESH_COST) {
        gold -= CONFIG.SHOP.REFRESH_COST;
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
        explosiveDamage: 0,
        weapons: [],
        projectiles: []
    });
    
    // Reset game state
    wave = 1;
    gold = CONFIG.PLAYER.START_GOLD;
    kills = 0;
    monsters = [];
    gameState = 'shop';
    
    // Reset UI
    updateUI();
    initWeaponSlots();
    initShop();
    gameOverlay.style.display = 'none';
    
    showMessage('Game restarted!');
}

// Initialize Game
function initGame() {
    initWeaponSlots();
    initShop();
    updateUI();
    gameLoop();
    
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
}

// Start the game
window.addEventListener('load', initGame);
