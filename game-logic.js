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
let waveSpawnGroups = [];
let currentSpawnGroup = 0;
let spawnTimer = 0;
let inventory = {
    weapons: [],
    items: []
};

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
    
    // Monster projectiles (for ranged monsters)
    monsterProjectiles: []
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
const weaponStats = document.getElementById('weaponStats');
const weaponDamage = document.getElementById('weaponDamage');
const weaponAttackSpeed = document.getElementById('weaponAttackSpeed');
const weaponRange = document.getElementById('weaponRange');
const weaponTier = document.getElementById('weaponTier');
const weaponType = document.getElementById('weaponType');
const inventoryGrid = document.getElementById('inventoryGrid');
const tabButtons = document.querySelectorAll('.tab-btn');
const autoMergeBtn = document.getElementById('autoMergeBtn');
const sortWeaponsBtn = document.getElementById('sortWeaponsBtn');
const waveSpawnInfo = document.getElementById('waveSpawnInfo');

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
        monsterProjectiles: []
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
    inventory = {
        weapons: [],
        items: []
    };
    
    // Clear game objects
    monsters = [];
    player.projectiles = [];
    player.meleeAttacks = [];
    player.monsterProjectiles = [];
    spawnIndicators = [];
    waveSpawnGroups = [];
    currentSpawnGroup = 0;
    spawnTimer = 0;
    
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
    weaponStats.style.display = 'none';
    
    // Set active tab
    tabButtons.forEach(btn => {
        if (btn.dataset.tab === 'weapons') {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Start first wave
    startWave();
    
    // Update UI
    updateUI();
    updateWeaponDisplay();
    updateShopDisplay();
    updateInventoryDisplay('weapons');
}

// Show spawn indicators
function showSpawnIndicators() {
    const waveConfig = getWaveConfig(wave);
    spawnIndicators = [];
    
    // Calculate spawn groups for this wave
    calculateSpawnGroups();
    
    for (let i = 0; i < waveSpawnGroups[currentSpawnGroup]; i++) {
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

// Calculate spawn groups for the wave
function calculateSpawnGroups() {
    const waveConfig = getWaveConfig(wave);
    
    if (waveConfig.boss) {
        // Boss wave: single boss monster
        waveSpawnGroups = [1];
    } else {
        // Normal wave: split monsters into groups
        const groupSize = Math.min(8, Math.max(3, Math.floor(waveConfig.monsters / 3)));
        const groups = Math.ceil(waveConfig.monsters / groupSize);
        waveSpawnGroups = [];
        
        for (let i = 0; i < groups; i++) {
            const remainingMonsters = waveConfig.monsters - waveSpawnGroups.reduce((a, b) => a + b, 0);
            const thisGroupSize = i === groups - 1 ? remainingMonsters : groupSize;
            waveSpawnGroups.push(thisGroupSize);
        }
    }
    
    currentSpawnGroup = 0;
    spawnTimer = 0;
    
    // Update spawn info display
    updateSpawnInfoDisplay();
}

// Update spawn info display
function updateSpawnInfoDisplay() {
    let info = `Wave ${wave}: ${waveSpawnGroups.length} spawn groups<br>`;
    
    waveSpawnGroups.forEach((count, index) => {
        const groupTypes = getMonsterTypesForGroup(index);
        info += `<div class="spawn-group">Group ${index + 1}: ${count} monsters`;
        if (groupTypes.length > 0) {
            info += ` (${groupTypes.map(t => GAME_DATA.MONSTER_TYPES[t].icon).join(' ')})`;
        }
        info += `</div>`;
    });
    
    waveSpawnInfo.innerHTML = info;
}

// Get monster types for a spawn group
function getMonsterTypesForGroup(groupIndex) {
    const types = [];
    const waveConfig = getWaveConfig(wave);
    
    // Boss wave
    if (waveConfig.boss) {
        return ['boss'];
    }
    
    // Early waves have more normal monsters
    if (wave < 5) {
        types.push('normal', 'normal', 'normal', 'fast');
    } else if (wave < 10) {
        types.push('normal', 'normal', 'fast', 'tank');
    } else {
        types.push('normal', 'fast', 'tank', 'ranged');
    }
    
    return types.slice(0, Math.min(3, waveSpawnGroups[groupIndex]));
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
    player.monsterProjectiles = [];
    visualEffects = [];
    
    // Hide buttons during wave
    scrapWeaponBtn.style.display = 'none';
    mergeWeaponBtn.style.display = 'none';
    selectedWeaponIndex = -1;
    mergeTargetIndex = -1;
    weaponStats.style.display = 'none';
    
    // Show spawn indicators for first group
    showSpawnIndicators();
    
    // Fade out wave display
    setTimeout(() => {
        waveDisplay.style.opacity = 0.5;
    }, 2000);
}

// Spawn monster
function spawnMonster(type) {
    const waveConfig = getWaveConfig(wave);
    const side = Math.floor(Math.random() * 4);
    let x, y;
    
    switch(side) {
        case 0: x = -50; y = Math.random() * canvas.height; break;
        case 1: x = canvas.width + 50; y = Math.random() * canvas.height; break;
        case 2: x = Math.random() * canvas.width; y = -50; break;
        case 3: x = Math.random() * canvas.width; y = canvas.height + 50; break;
    }
    
    const monsterType = waveConfig.boss ? 'boss' : (type || getRandomMonsterType(wave));
    const typeData = monsterType === 'boss' ? {
        name: "Boss",
        icon: "👑",
        healthMultiplier: 10,
        damageMultiplier: 3,
        speedMultiplier: 0.8,
        radius: 40,
        color: '#FF0000',
        attackRange: 150,
        projectileSpeed: 8,
        attackCooldown: 3000
    } : GAME_DATA.MONSTER_TYPES[monsterType];
    
    const monster = {
        x, y,
        radius: typeData.radius,
        health: Math.floor(waveConfig.monsterHealth * typeData.healthMultiplier),
        maxHealth: Math.floor(waveConfig.monsterHealth * typeData.healthMultiplier),
        damage: Math.floor(waveConfig.monsterDamage * typeData.damageMultiplier),
        speed: (1 + wave * 0.1) * typeData.speedMultiplier,
        color: typeData.color,
        type: monsterType,
        lastAttack: 0,
        attackCooldown: typeData.attackCooldown || GAME_DATA.MONSTER_ATTACK_COOLDOWN,
        icon: typeData.icon,
        name: typeData.name,
        isBoss: monsterType === 'boss'
    };
    
    // Add special properties for ranged monsters
    if (monsterType === 'ranged' || monsterType === 'boss') {
        monster.attackRange = typeData.attackRange;
        monster.projectileSpeed = typeData.projectileSpeed;
        monster.lastRangedAttack = 0;
        monster.rangedAttackCooldown = typeData.attackCooldown || 2000;
    }
    
    monsters.push(monster);
    return monster;
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
    
    const remainingMonsters = monsters.length + waveSpawnGroups.slice(currentSpawnGroup).reduce((a, b) => a + b, 0);
    monsterCount.textContent = `Monsters: ${remainingMonsters}`;
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
            
            // Add tier-based border color
            if (weapon.tier >= 2) {
                slot.classList.add(`tier-${weapon.tier}`);
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
            slot.addEventListener('click', () => equipWeaponFromInventory(i));
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
        
        // Show weapon stats
        showWeaponStats(weapon);
    } else if (selectedWeaponIndex === index) {
        // Clicked same weapon again, deselect
        selectedWeaponIndex = -1;
        scrapWeaponBtn.style.display = 'none';
        mergeWeaponBtn.style.display = 'none';
        mergeInfo.style.display = 'none';
        mergeTargetIndex = -1;
        weaponStats.style.display = 'none';
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
            
            // Show weapon stats
            showWeaponStats(weapon);
        }
    }
    
    updateWeaponDisplay();
}

// Show weapon stats
function showWeaponStats(weapon) {
    const stats = weapon.getStats();
    weaponDamage.textContent = stats.damage;
    weaponAttackSpeed.textContent = stats.attackSpeed + '/s';
    weaponRange.textContent = stats.range;
    weaponTier.textContent = stats.tier;
    weaponType.textContent = stats.type;
    weaponStats.style.display = 'block';
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
    weaponStats.style.display = 'none';
    
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
    
    // Move weapon to inventory instead of destroying it
    inventory.weapons.push(weapon);
    
    player.weapons.splice(selectedWeaponIndex, 1);
    
    selectedWeaponIndex = -1;
    scrapWeaponBtn.style.display = 'none';
    weaponStats.style.display = 'none';
    
    showMessage(`Scrapped ${weapon.getDisplayName()} for ${scrapValue} gold! (Moved to inventory)`);
    
    updateUI();
    updateWeaponDisplay();
    updateInventoryDisplay('weapons');
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
            // Move to inventory instead
            inventory.weapons.push(new WeaponInstance(data));
            showMessage(`Purchased ${data.name}! (Moved to inventory - equip from inventory)`);
        } else {
            player.weapons.push(new WeaponInstance(data));
            showMessage(`Purchased ${data.name}!`);
        }
    } else {
        // Check if item already exists in inventory
        const existingItem = inventory.items.find(item => item.id === data.id);
        if (existingItem && existingItem.count >= data.maxStack) {
            showMessage(`Cannot carry more than ${data.maxStack} ${data.name}s!`);
            gold += data.cost;
            return;
        }
        
        applyItemEffect(data, false);
        showMessage(`Purchased ${data.name}!`);
    }
    
    shopItems[index] = null;
    
    updateUI();
    updateWeaponDisplay();
    updateShopDisplay();
    updateInventoryDisplay('weapons');
}

// Apply item effect
function applyItemEffect(item, fromInventory = true) {
    switch(item.id) {
        case 'health_potion':
            player.health = Math.min(player.maxHealth, player.health + 20);
            if (!fromInventory) {
                addToInventory('items', { id: item.id, name: item.name, icon: item.icon, count: 1 });
            }
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
            if (!fromInventory) {
                addToInventory('items', { id: item.id, name: item.name, icon: item.icon, count: 1 });
            }
            showMessage("All weapons reloaded!");
            break;
        case 'grenade':
            if (!fromInventory) {
                addToInventory('items', { id: item.id, name: item.name, icon: item.icon, count: 1 });
            }
            break;
    }
}

// Add item to inventory
function addToInventory(category, item) {
    const existingItem = inventory[category].find(i => i.id === item.id);
    
    if (existingItem) {
        existingItem.count = (existingItem.count || 1) + (item.count || 1);
    } else {
        inventory[category].push({ ...item, count: item.count || 1 });
    }
}

// Update inventory display
function updateInventoryDisplay(tab) {
    inventoryGrid.innerHTML = '';
    
    const items = inventory[tab];
    
    if (items.length === 0) {
        const emptyMsg = document.createElement('div');
        emptyMsg.style.gridColumn = '1 / -1';
        emptyMsg.style.textAlign = 'center';
        emptyMsg.style.padding = '20px';
        emptyMsg.style.color = '#5555aa';
        emptyMsg.textContent = `No ${tab} in inventory`;
        inventoryGrid.appendChild(emptyMsg);
        return;
    }
    
    items.forEach((item, index) => {
        const slot = document.createElement('div');
        slot.className = 'inventory-slot';
        
        if (tab === 'weapons') {
            slot.classList.add('occupied');
            if (item.tier >= 2) {
                slot.classList.add(`tier-${item.tier}`);
            }
            
            slot.innerHTML = `
                <div>${item.icon}</div>
                ${item.tier > 1 ? `<div class="tier-badge">${item.tier}</div>` : ''}
                <div class="inventory-count">${item.count || 1}</div>
            `;
            
            slot.addEventListener('click', () => equipWeaponFromInventory(index));
        } else {
            slot.classList.add('occupied');
            slot.innerHTML = `
                <div>${item.icon}</div>
                <div class="inventory-count">${item.count || 1}</div>
            `;
            
            slot.addEventListener('click', () => useItemFromInventory(index));
        }
        
        inventoryGrid.appendChild(slot);
    });
}

// Equip weapon from inventory
function equipWeaponFromInventory(inventoryIndex, weaponSlotIndex = -1) {
    if (gameState !== 'shop' && gameState !== 'statSelect') return;
    
    const weapon = inventory.weapons[inventoryIndex];
    
    if (!weapon) return;
    
    if (weaponSlotIndex === -1) {
        // Find empty slot
        weaponSlotIndex = player.weapons.length;
        if (weaponSlotIndex >= 6) {
            showMessage("No empty weapon slots! Remove a weapon first.");
            return;
        }
    }
    
    // Add to player weapons
    player.weapons.splice(weaponSlotIndex, 0, weapon);
    
    // Remove from inventory
    if (weapon.count && weapon.count > 1) {
        weapon.count--;
    } else {
        inventory.weapons.splice(inventoryIndex, 1);
    }
    
    showMessage(`Equipped ${weapon.getDisplayName()}!`);
    
    updateWeaponDisplay();
    updateInventoryDisplay('weapons');
}

// Use item from inventory
function useItemFromInventory(index) {
    const item = inventory.items[index];
    
    if (!item) return;
    
    switch(item.id) {
        case 'health_potion':
            applyItemEffect(item, true);
            if (item.count && item.count > 1) {
                item.count--;
            } else {
                inventory.items.splice(index, 1);
            }
            showMessage(`Used ${item.name}!`);
            break;
            
        case 'ammo_pack':
            applyItemEffect(item, true);
            if (item.count && item.count > 1) {
                item.count--;
            } else {
                inventory.items.splice(index, 1);
            }
            break;
            
        case 'grenade':
            // Throw grenade at mouse position
            throwGrenade(mouseX, mouseY);
            if (item.count && item.count > 1) {
                item.count--;
            } else {
                inventory.items.splice(index, 1);
            }
            showMessage(`Threw ${item.name}!`);
            break;
    }
    
    updateInventoryDisplay('items');
    updateUI();
}

// Throw grenade
function throwGrenade(x, y) {
    // Create explosion effect
    addVisualEffect({
        type: 'explosion',
        x: x,
        y: y,
        radius: 0,
        maxRadius: 100,
        color: '#FF4500',
        startTime: Date.now(),
        duration: 500
    });
    
    // Damage monsters in radius
    monsters.forEach((monster, index) => {
        const dx = monster.x - x;
        const dy = monster.y - y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
            const damage = 50 * (1 - distance / 100); // Less damage farther from center
            monster.health -= damage;
            
            createDamageIndicator(monster.x, monster.y, Math.floor(damage), false);
            
            if (monster.health <= 0) {
                monsters.splice(index, 1);
                kills++;
                const goldEarned = Math.floor(10 * (1 + player.goldMultiplier));
                gold += goldEarned;
                createGoldPopup(monster.x, monster.y, goldEarned);
            }
        }
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
    console.log('Selected buff:', buff);
    
    // Apply the buff effects directly to player stats
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
    updateUI();
    
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

// Auto-merge weapons
function autoMergeWeapons() {
    if (gold < 50) {
        showMessage("Need 50 gold for auto-merge!");
        return;
    }
    
    const weaponGroups = {};
    let mergeCount = 0;
    
    // Group weapons by id and tier (from inventory and equipped)
    const allWeapons = [...player.weapons, ...inventory.weapons];
    
    allWeapons.forEach((weapon, index) => {
        const key = `${weapon.id}_${weapon.tier}`;
        if (!weaponGroups[key]) weaponGroups[key] = [];
        weaponGroups[key].push({ weapon, index, source: index < player.weapons.length ? 'equipped' : 'inventory' });
    });
    
    // Merge groups with 2+ weapons
    Object.values(weaponGroups).forEach(group => {
        if (group.length >= 2) {
            const weapon1 = group[0].weapon;
            const weapon2 = group[1].weapon;
            
            if (weapon1.tier < 5) {
                // Create merged weapon
                const mergedWeapon = weapon1.merge(weapon2);
                
                if (mergedWeapon) {
                    // Remove original weapons
                    if (group[0].source === 'equipped') {
                        const equippedIndex = player.weapons.indexOf(weapon1);
                        if (equippedIndex > -1) player.weapons.splice(equippedIndex, 1);
                    } else {
                        const inventoryIndex = inventory.weapons.indexOf(weapon1);
                        if (inventoryIndex > -1) inventory.weapons.splice(inventoryIndex, 1);
                    }
                    
                    if (group[1].source === 'equipped') {
                        const equippedIndex = player.weapons.indexOf(weapon2);
                        if (equippedIndex > -1) player.weapons.splice(equippedIndex, 1);
                    } else {
                        const inventoryIndex = inventory.weapons.indexOf(weapon2);
                        if (inventoryIndex > -1) inventory.weapons.splice(inventoryIndex, 1);
                    }
                    
                    // Add merged weapon to inventory
                    inventory.weapons.push(mergedWeapon);
                    mergeCount++;
                }
            }
        }
    });
    
    if (mergeCount > 0) {
        gold -= 50;
        showMessage(`Auto-merged ${mergeCount} weapon pairs! Check inventory.`);
        updateUI();
        updateWeaponDisplay();
        updateInventoryDisplay('weapons');
    } else {
        showMessage("No mergeable weapons found!");
    }
}

// Sort weapons
function sortWeapons() {
    player.weapons.sort((a, b) => {
        // Sort by type (ranged first), then by damage, then by tier
        if (a.type !== b.type) return a.type === 'ranged' ? -1 : 1;
        if (b.baseDamage !== a.baseDamage) return b.baseDamage - a.baseDamage;
        return b.tier - a.tier;
    });
    updateWeaponDisplay();
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
    drawMonsterProjectiles();
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
    
    // Update spawn timer
    if (currentSpawnGroup < waveSpawnGroups.length) {
        spawnTimer += deltaTime;
        
        if (spawnTimer >= 3000) { // Spawn new group every 3 seconds
            spawnTimer = 0;
            
            // Spawn monsters for current group
            const groupTypes = getMonsterTypesForGroup(currentSpawnGroup);
            for (let i = 0; i < waveSpawnGroups[currentSpawnGroup]; i++) {
                const type = groupTypes[i % groupTypes.length];
                spawnMonster(type);
            }
            
            // Show indicators for next group
            currentSpawnGroup++;
            if (currentSpawnGroup < waveSpawnGroups.length) {
                showSpawnIndicators();
            }
        }
    }
    
    // Update weapons and attacks
    updateWeapons();
    
    // Update projectiles
    updateProjectiles();
    
    // Update monster projectiles
    updateMonsterProjectiles();
    
    // Update melee attacks
    updateMeleeAttacks();
    
    // Update monsters
    updateMonsters();
    
    // Update visual effects
    updateVisualEffects();
    
    // Check if wave is complete
    if (monsters.length === 0 && spawnIndicators.length === 0 && currentSpawnGroup >= waveSpawnGroups.length) {
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
                } else if (weapon.type === 'ranged') {
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
                    if (monster.isBoss) goldEarned *= 5;
                    gold += goldEarned;
                    
                    createGoldPopup(monster.x, monster.y, goldEarned);
                }
                
                break;
            }
        }
    }
}

function updateMonsterProjectiles() {
    for (let i = player.monsterProjectiles.length - 1; i >= 0; i--) {
        const projectile = player.monsterProjectiles[i];
        
        // Move projectile
        projectile.x += Math.cos(projectile.angle) * projectile.speed;
        projectile.y += Math.sin(projectile.angle) * projectile.speed;
        
        // Check if out of bounds
        if (projectile.x < -50 || projectile.x > canvas.width + 50 || 
            projectile.y < -50 || projectile.y > canvas.height + 50) {
            player.monsterProjectiles.splice(i, 1);
            continue;
        }
        
        // Check collision with player
        const dx = projectile.x - player.x;
        const dy = projectile.y - player.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 5 + player.radius) {
            // Apply damage to player
            let damage = projectile.damage;
            if (player.damageReduction > 0) {
                damage *= (1 - player.damageReduction);
            }
            
            player.health -= damage;
            createDamageIndicator(player.x, player.y, Math.floor(damage), false);
            
            player.monsterProjectiles.splice(i, 1);
            
            if (player.health <= 0) {
                gameOver();
            }
            
            break;
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
                    if (monster.isBoss) goldEarned *= 5;
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
        
        // Move monster
        monster.x += (dx / distance) * monster.speed;
        monster.y += (dy / distance) * monster.speed;
        
        // Ranged monster attack
        if ((monster.type === 'ranged' || monster.type === 'boss') && monster.attackRange) {
            if (distance < monster.attackRange && currentTime - monster.lastRangedAttack >= monster.rangedAttackCooldown) {
                // Fire projectile at player
                const angle = Math.atan2(player.y - monster.y, player.x - monster.x);
                
                player.monsterProjectiles.push({
                    x: monster.x,
                    y: monster.y,
                    angle: angle,
                    speed: monster.projectileSpeed,
                    damage: monster.damage,
                    color: monster.type === 'boss' ? '#FF0000' : '#9C27B0'
                });
                
                monster.lastRangedAttack = currentTime;
            }
        }
        
        // Melee attack
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
        // Draw monster body
        ctx.fillStyle = monster.color;
        ctx.beginPath();
        ctx.arc(monster.x, monster.y, monster.radius, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(monster.x, monster.y, monster.radius, 0, Math.PI * 2);
        ctx.stroke();
        
        // Draw monster icon
        ctx.fillStyle = '#FFFFFF';
        ctx.font = `${monster.radius * 1.5}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(monster.icon, monster.x, monster.y);
        
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
        
        // Draw boss crown
        if (monster.isBoss) {
            ctx.fillStyle = '#FFD700';
            ctx.beginPath();
            ctx.moveTo(monster.x - 15, monster.y - monster.radius - 10);
            ctx.lineTo(monster.x, monster.y - monster.radius - 25);
            ctx.lineTo(monster.x + 15, monster.y - monster.radius - 10);
            ctx.closePath();
            ctx.fill();
        }
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

function drawMonsterProjectiles() {
    player.monsterProjectiles.forEach(projectile => {
        ctx.fillStyle = projectile.color;
        ctx.beginPath();
        ctx.arc(projectile.x, projectile.y, 4, 0, Math.PI * 2);
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

// Draw visual effects
function drawVisualEffects() {
    const currentTime = Date.now();
    
    visualEffects.forEach(effect => {
        const progress = (currentTime - effect.startTime) / effect.duration;
        const alpha = 1 - progress;
        
        ctx.save();
        
        switch(effect.type) {
            case 'explosion':
                ctx.translate(effect.x, effect.y);
                const radius = effect.radius + (effect.maxRadius - effect.radius) * progress;
                const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
                gradient.addColorStop(0, `rgba(${hexToRgb(effect.color)}, ${alpha})`);
                gradient.addColorStop(0.7, `rgba(${hexToRgb(effect.color)}, ${alpha * 0.3})`);
                gradient.addColorStop(1, 'transparent');
                
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(0, 0, radius, 0, Math.PI * 2);
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
        nextWaveBtn.style.display = 'block';
        scrapWeaponBtn.style.display = 'none';
        mergeWeaponBtn.style.display = 'none';
        selectedWeaponIndex = -1;
        mergeTargetIndex = -1;
        weaponStats.style.display = 'none';
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

// Auto-merge button
autoMergeBtn.addEventListener('click', autoMergeWeapons);

// Sort weapons button
sortWeaponsBtn.addEventListener('click', sortWeapons);

// Inventory tabs
tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        tabButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        updateInventoryDisplay(btn.dataset.tab);
    });
});

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === ' ') {
        // Space to start next wave in shop mode
        if (gameState === 'shop' && nextWaveBtn.style.display !== 'none') {
            nextWaveBtn.click();
        }
    } else if (e.key === 'r' || e.key === 'R') {
        // R to reload all weapons (in shop mode)
        if (gameState === 'shop') {
            player.weapons.forEach(weapon => {
                if (weapon.usesAmmo && !weapon.isReloading) {
                    weapon.startReload();
                }
            });
        }
    } else if (e.key === 'm' || e.key === 'M') {
        // M for auto-merge
        if (gameState === 'shop') {
            autoMergeWeapons();
        }
    } else if (e.key === 's' || e.key === 'S') {
        // S for sort weapons
        if (gameState === 'shop' || gameState === 'statSelect') {
            sortWeapons();
        }
    } else if (e.key === '1') {
        // 1-6 for quick weapon selection
        const index = parseInt(e.key) - 1;
        if (index < player.weapons.length && (gameState === 'shop' || gameState === 'statSelect')) {
            selectWeapon(index);
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
