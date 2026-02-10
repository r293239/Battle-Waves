// ============================================
// GAME LOGIC
// ============================================

// Game State
let gameState = 'shop'; // 'wave', 'statSelect', 'shop', 'gameover'
let wave = 1;
let gold = GAME_DATA.PLAYER_START.gold;
let kills = 0;
let shopItems = [];

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
const waveCompleteOverlay = document.getElementById('waveCompleteOverlay');
const gameOverOverlay = document.getElementById('gameOverOverlay');
const gameOverText = document.getElementById('gameOverText');
const statBuffs = document.getElementById('statBuffs');
const weaponsGrid = document.getElementById('weaponsGrid');
const shopItemsContainer = document.getElementById('shopItems');
const startWaveBtn = document.getElementById('startWave');
const restartBtn = document.getElementById('restartBtn');

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
    gameState = 'shop';
    
    // Clear game objects
    monsters = [];
    player.projectiles = [];
    player.meleeAttacks = [];
    
    // Generate initial shop
    shopItems = generateShopItems();
    
    // Update UI
    updateUI();
    updateWeaponDisplay();
    updateShopDisplay();
    
    // Hide overlays
    waveCompleteOverlay.style.display = 'none';
    gameOverOverlay.style.display = 'none';
    
    // Start game loop
    gameLoop();
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
            slot.innerHTML = `
                <div>${weapon.icon}</div>
                <div class="weapon-level">${weapon.type === 'melee' ? '⚔️' : '🔫'}</div>
            `;
        } else {
            slot.innerHTML = '<div class="empty-slot">+</div>';
        }
        
        weaponsGrid.appendChild(slot);
    }
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
                        <span class="item-tag ${shopItem.type === 'weapon' ? (data.type === 'melee' ? 'melee-tag' : 'ranged-tag') : ''}">
                            ${shopItem.type === 'weapon' ? (data.type === 'melee' ? 'MELEE' : 'RANGED') : 'ITEM'}
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

// Start wave
function startWave() {
    if (gameState !== 'shop') return;
    
    gameState = 'wave';
    waveDisplay.textContent = `Wave ${wave}`;
    waveDisplay.style.opacity = 1;
    
    // Clear game objects
    monsters = [];
    player.projectiles = [];
    player.meleeAttacks = [];
    
    // Spawn monsters based on wave number
    const monsterCount = 5 + wave * 2;
    
    for (let i = 0; i < monsterCount; i++) {
        spawnMonster();
    }
    
    // Fade out wave display
    setTimeout(() => {
        waveDisplay.style.opacity = 0.5;
    }, 2000);
}

// Spawn monster
function spawnMonster() {
    const side = Math.floor(Math.random() * 4);
    let x, y;
    
    switch(side) {
        case 0: x = -50; y = Math.random() * canvas.height; break;
        case 1: x = canvas.width + 50; y = Math.random() * canvas.height; break;
        case 2: x = Math.random() * canvas.width; y = -50; break;
        case 3: x = Math.random() * canvas.width; y = canvas.height + 50; break;
    }
    
    // Monster stats scale with wave
    const baseHealth = 20 + wave * 5;
    const baseDamage = 3 + wave;
    const baseSpeed = 1 + wave * 0.1;
    
    monsters.push({
        x, y,
        radius: 15 + Math.random() * 10,
        health: baseHealth,
        maxHealth: baseHealth,
        damage: baseDamage,
        speed: Math.min(3, baseSpeed),
        color: `hsl(${Math.random() * 360}, 70%, 50%)`,
        type: Math.random() > 0.7 ? 'fast' : 'normal'
    });
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
}

// End wave
function endWave() {
    gameState = 'statSelect';
    
    // Calculate gold reward
    const waveReward = 30 + wave * 10;
    gold += Math.floor(waveReward * (1 + player.goldMultiplier));
    
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
    
    // Check if wave is complete
    if (monsters.length === 0) {
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
                }
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
                
                // Critical chance
                if (Math.random() < player.criticalChance) {
                    damage *= 2;
                }
                
                // Apply damage reduction
                if (player.damageReduction > 0) {
                    damage *= (1 - player.damageReduction);
                }
                
                monster.health -= damage;
                
                // Life steal
                if (player.lifeSteal > 0) {
                    player.health = Math.min(player.maxHealth, player.health + damage * player.lifeSteal);
                }
                
                // Remove projectile
                player.projectiles.splice(i, 1);
                
                // Check if monster is dead
                if (monster.health <= 0) {
                    monsters.splice(j, 1);
                    kills++;
                    gold += Math.floor(10 * (1 + player.goldMultiplier));
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
        
        // Check collision with monsters
        for (let j = monsters.length - 1; j >= 0; j--) {
            const monster = monsters[j];
            const dx = monster.x - attack.x;
            const dy = monster.y - attack.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < attack.radius + monster.radius) {
                // Calculate damage
                let damage = attack.damage;
                
                // Critical chance
                if (Math.random() < player.criticalChance) {
                    damage *= 2;
                }
                
                // Apply damage reduction
                if (player.damageReduction > 0) {
                    damage *= (1 - player.damageReduction);
                }
                
                monster.health -= damage;
                
                // Life steal
                if (player.lifeSteal > 0) {
                    player.health = Math.min(player.maxHealth, player.health + damage * player.lifeSteal);
                }
                
                // Check if monster is dead
                if (monster.health <= 0) {
                    monsters.splice(j, 1);
                    kills++;
                    gold += Math.floor(10 * (1 + player.goldMultiplier));
                }
            }
        }
    }
}

function updateMonsters() {
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
        const alpha = 0.5 * (1 - progress);
        
        ctx.fillStyle = `rgba(${hexToRgb(attack.color)}, ${alpha})`;
        ctx.beginPath();
        ctx.arc(attack.x, attack.y, attack.radius, 0, Math.PI * 2);
        ctx.fill();
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

startWaveBtn.addEventListener('click', startWave);
restartBtn.addEventListener('click', initGame);

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

// Initialize the game when page loads
window.addEventListener('load', initGame);
