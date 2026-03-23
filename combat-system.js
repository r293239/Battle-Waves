// ============================================
// COMBAT SYSTEM MODULE
// ============================================
// Handles monster AI, weapon mechanics, item effects, and combat animations
// Data imported from GAME_DATA in the main data file

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
        
        // Visual properties
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
                if (!this.isThrowable) this.currentAmmo = this.magazineSize;
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
        if (this.isReloading) return false;
        if (this.usesAmmo && this.currentAmmo <= 0 && !this.isThrowable) {
            this.startReload();
            return false;
        }
        
        const timeSinceLastAttack = currentTime - this.lastAttack;
        const attackCooldown = 1000 / (this.attackSpeed * (window.player?.attackSpeedMultiplier || 1));
        return timeSinceLastAttack >= attackCooldown;
    }

    startReload() {
        if (!this.usesAmmo || this.isReloading || this.currentAmmo === this.magazineSize || this.isThrowable) return;
        
        this.isReloading = true;
        this.reloadStart = Date.now();
        
        if (typeof window.showReloadIndicator === 'function') {
            window.showReloadIndicator(this.name);
        }
        
        setTimeout(() => {
            this.currentAmmo = this.magazineSize;
            this.isReloading = false;
        }, this.reloadTime);
    }

    useAmmo() {
        if (!this.usesAmmo) return;
        this.currentAmmo--;
        if (this.currentAmmo <= 0 && !this.isThrowable) {
            this.startReload();
        }
    }

    resetAmmo() {
        if (this.resetEachRound) {
            this.currentAmmo = this.magazineSize;
            this.isReloading = false;
            this.knivesUsed.clear();
        }
    }

    trackKnifeHit(monster) {
        if (!this.isThrowable) return;
        const currentCount = this.knivesUsed.get(monster) || 0;
        this.knivesUsed.set(monster, currentCount + 1);
    }

    returnKnives(monster) {
        if (!this.isThrowable) return 0;
        const knivesHit = this.knivesUsed.get(monster) || 0;
        if (knivesHit > 0) {
            this.knivesUsed.delete(monster);
            this.currentAmmo = Math.min(this.magazineSize, this.currentAmmo + knivesHit);
            return knivesHit;
        }
        return 0;
    }

    attack(playerX, playerY, targetX, targetY) {
        const currentTime = Date.now();
        
        if (this.usesAmmo && !this.isReloading) {
            this.useAmmo();
        }
        
        this.lastAttack = currentTime;
        this.lastAttackTime = currentTime;
        
        if (this.type === 'ranged') {
            return this.createRangedAttack(playerX, playerY, targetX, targetY, currentTime);
        } else {
            return this.createMeleeAttack(playerX, playerY, targetX, targetY, currentTime);
        }
    }

    createRangedAttack(playerX, playerY, targetX, targetY, currentTime) {
        const angle = Math.atan2(targetY - playerY, targetX - playerX);
        
        if (this.id === 'shotgun') {
            return this.createShotgunAttack(playerX, playerY, angle, currentTime);
        } else if (this.id === 'boomerang') {
            return this.createBoomerangAttack(playerX, playerY, angle, currentTime);
        } else if (this.id === 'throwing_knives') {
            return this.createThrowingKnifeAttack(playerX, playerY, angle, currentTime);
        } else if (this.id === 'sniper') {
            return this.createSniperAttack(playerX, playerY, angle, currentTime);
        } else if (this.id === 'crossbow') {
            return this.createCrossbowAttack(playerX, playerY, angle, currentTime);
        } else {
            return this.createStandardRangedAttack(playerX, playerY, angle, currentTime);
        }
    }

    createShotgunAttack(playerX, playerY, baseAngle, currentTime) {
        const attacks = [];
        for (let i = 0; i < this.pelletCount; i++) {
            const spread = (Math.random() - 0.5) * (this.spreadAngle * Math.PI / 180);
            const angle = baseAngle + spread;
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
                startTime: currentTime,
                size: 3,
                weaponRef: this
            });
        }
        return attacks;
    }

    createBoomerangAttack(playerX, playerY, angle, currentTime) {
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
            hitThisFrame: false,
            size: 4,
            weaponRef: this
        };
    }

    createThrowingKnifeAttack(playerX, playerY, angle, currentTime) {
        const spreadAmount = (Math.random() - 0.5) * this.spread;
        const finalAngle = angle + spreadAmount;
        
        return {
            type: 'ranged',
            x: playerX,
            y: playerY,
            angle: finalAngle,
            speed: this.projectileSpeed,
            range: this.range,
            damage: this.baseDamage,
            color: this.projectileColor,
            weaponId: this.id,
            animation: 'knife',
            isThrowable: true,
            startTime: currentTime,
            size: this.projectileSize || 6,
            spinSpeed: this.spinSpeed || 0,
            rotation: 0,
            weaponRef: this
        };
    }

    createSniperAttack(playerX, playerY, angle, currentTime) {
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
            animation: 'sniper',
            startTime: currentTime,
            size: 6,
            weaponRef: this,
            sniper: true
        };
    }

    createCrossbowAttack(playerX, playerY, angle, currentTime) {
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
            animation: 'bolt',
            startTime: currentTime,
            size: 5,
            weaponRef: this,
            pierceCount: this.pierceCount,
            piercedEnemies: []
        };
    }

    createStandardRangedAttack(playerX, playerY, baseAngle, currentTime) {
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
            startTime: currentTime,
            size: 4,
            weaponRef: this
        };
    }

    createMeleeAttack(playerX, playerY, targetX, targetY, currentTime) {
        const angle = Math.atan2(targetY - playerY, targetX - playerX);
        
        const baseAttack = {
            type: 'melee',
            x: playerX,
            y: playerY,
            radius: this.range,
            damage: this.baseDamage,
            color: this.swingColor,
            startTime: currentTime,
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
        
        if (this.dualStrike) {
            baseAttack.dualStrike = true;
            return baseAttack;
        }
        
        return baseAttack;
    }
    
    getScrapValue() {
        const baseValue = Math.floor(this.baseCost * 0.5);
        const tierMultiplier = 1 + (this.tier - 1) * 0.5;
        return Math.floor(baseValue * tierMultiplier);
    }
    
    getTypeDescription() {
        if (this.type === 'ranged') {
            if (this.id === 'shotgun') return 'SHOTGUN';
            if (this.id === 'laser') return 'ENERGY';
            if (this.id === 'boomerang') return 'BOOMERANG';
            if (this.id === 'throwing_knives') return 'THROWING';
            if (this.id === 'sniper') return 'SNIPER';
            if (this.id === 'crossbow') return 'CROSSBOW';
            return 'RANGED';
        }
        if (this.meleeType === 'single') return 'SINGLE';
        if (this.meleeType === 'aoe') return 'AOE 360°';
        if (this.meleeType === 'pierce') return 'PIERCE';
        if (this.meleeType === 'dual') return 'DUAL';
        return 'MELEE';
    }
    
    getDisplayName() {
        if (this.tier === 1) return this.name;
        const tierNames = ['', 'II', 'III', 'IV', 'V', 'VI'];
        return `${this.name} ${tierNames[this.tier]}`;
    }
    
    getShopCost() {
        if (this.tier === 2) return Math.floor(this.baseCost * 2 * 0.75);
        if (this.tier > 2) return Math.floor(this.baseCost * Math.pow(1.8, this.tier - 1));
        return this.baseCost;
    }
    
    getMergeCost(otherWeapon) {
        if (this.id !== otherWeapon.id || this.tier !== otherWeapon.tier) return 0;
        if (this.tier >= 5) return 0;
        return Math.floor(this.baseCost * 0.3 * this.tier);
    }
    
    merge(otherWeapon) {
        if (this.id !== otherWeapon.id || this.tier !== otherWeapon.tier) return null;
        if (this.tier >= 5) return null;
        const baseWeaponData = window.getWeaponById ? window.getWeaponById(this.id) : null;
        if (!baseWeaponData) return null;
        return new WeaponInstance(baseWeaponData, this.tier + 1);
    }
}

// ============================================
// MONSTER AI AND BEHAVIOR
// ============================================

const MONSTER_AI = {
    // Get monster type based on wave composition
    getMonsterTypeForWave(waveNumber, waveCompositions) {
        if (waveNumber % 10 === 0) return window.MONSTER_TYPES?.BOSS;
        
        const comp = waveCompositions[waveNumber];
        if (!comp) return window.MONSTER_TYPES?.NORMAL;
        
        const types = [];
        for (let i = 0; i < comp.normal; i++) types.push(window.MONSTER_TYPES.NORMAL);
        for (let i = 0; i < comp.fast; i++) types.push(window.MONSTER_TYPES.FAST);
        for (let i = 0; i < comp.tank; i++) types.push(window.MONSTER_TYPES.TANK);
        for (let i = 0; i < comp.explosive; i++) types.push(window.MONSTER_TYPES.EXPLOSIVE);
        for (let i = 0; i < comp.gunner; i++) types.push(window.MONSTER_TYPES.GUNNER);
        for (let i = 0; i < comp.splitter; i++) types.push(window.MONSTER_TYPES.SPLITTER);
        for (let i = 0; i < comp.dasher; i++) types.push(window.MONSTER_TYPES.DASHER);
        
        return types;
    },

    createMonster(monsterType, waveNumber, waveConfig, isBoss = false, spawnX = null, spawnY = null) {
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
            const side = Math.floor(Math.random() * 4);
            switch(side) {
                case 0: x = 50; y = Math.random() * (window.canvas?.height - 100) + 50; break;
                case 1: x = window.canvas?.width - 50; y = Math.random() * (window.canvas?.height - 100) + 50; break;
                case 2: x = Math.random() * (window.canvas?.width - 100) + 50; y = 50; break;
                case 3: x = Math.random() * (window.canvas?.width - 100) + 50; y = window.canvas?.height - 50; break;
            }
        }
        
        const monster = {
            x, y,
            radius: isBoss ? 45 : (15 + Math.random() * 10) * monsterType.sizeMultiplier,
            health: health,
            maxHealth: health,
            damage: damage,
            speed: (isBoss ? 0.7 : (1 + waveNumber * 0.05)) * monsterType.speed,
            color: monsterType.color,
            type: monsterType.name,
            monsterType: monsterType,
            lastAttack: 0,
            attackCooldown: monsterType.attackCooldown || window.GAME_DATA?.MONSTER_ATTACK_COOLDOWN || 1000,
            isBoss: isBoss || false,
            isMinion: monsterType.isMinion || false,
            isSplitter: monsterType.isSplitter || false,
            isDasher: monsterType.isDasher || false,
            lifeSteal: monsterType.lifeSteal || 0,
            splitCount: monsterType.splitCount || 0,
            splitHealthPercent: monsterType.splitHealthPercent || 0.5,
            dashSpeed: monsterType.dashSpeed || 1.5,
            dashCooldown: monsterType.dashCooldown || 3000,
            lastDash: 0,
            isDashing: false,
            dashTarget: null,
            slowed: false,
            slowUntil: 0,
            frozen: false,
            frozenUntil: 0,
            stunned: false,
            stunnedUntil: 0,
            explosive: monsterType.explosive || false,
            isGunner: monsterType === window.MONSTER_TYPES?.GUNNER,
            originalSpeed: (isBoss ? 0.7 : (1 + waveNumber * 0.05)) * monsterType.speed
        };
        
        if (window.addVisualEffect) {
            window.addVisualEffect({
                type: 'spawn',
                x: x,
                y: y,
                color: monsterType.color,
                startTime: Date.now(),
                duration: 300
            });
        }
        
        return monster;
    },

    updateDasher(dasher, player, currentTime, addVisualEffect) {
        if (!dasher.isDasher) return;
        
        if (dasher.isDashing) {
            const dx = dasher.dashTarget.x - dasher.x;
            const dy = dasher.dashTarget.y - dasher.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 5) {
                dasher.isDashing = false;
                dasher.speed = dasher.originalSpeed;
            } else {
                const moveX = (dx / dist) * dasher.dashSpeed;
                const moveY = (dy / dist) * dasher.dashSpeed;
                dasher.x += moveX;
                dasher.y += moveY;
            }
        } else if (Date.now() - dasher.lastDash >= dasher.dashCooldown) {
            const dx = player.x - dasher.x;
            const dy = player.y - dasher.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 300) {
                dasher.isDashing = true;
                dasher.dashTarget = { x: player.x, y: player.y };
                dasher.lastDash = currentTime;
                
                if (addVisualEffect) {
                    addVisualEffect({
                        type: 'shockwave',
                        x: dasher.x,
                        y: dasher.y,
                        radius: 30,
                        color: '#00ffff',
                        startTime: currentTime,
                        duration: 200
                    });
                }
            }
        }
    },

    handleSplitterDeath(monster, monsters, addVisualEffect) {
        if (!monster.isSplitter) return;
        
        const splitCount = monster.splitCount || 2;
        const splitHealth = Math.floor(monster.maxHealth * (monster.splitHealthPercent || 0.5));
        
        for (let i = 0; i < splitCount; i++) {
            const angle = (i / splitCount) * Math.PI * 2;
            const distance = 30;
            const x = monster.x + Math.cos(angle) * distance;
            const y = monster.y + Math.sin(angle) * distance;
            
            const splitMonster = {
                ...monster,
                x, y,
                health: splitHealth,
                maxHealth: splitHealth,
                radius: monster.radius * 0.7,
                isSplitter: false,
                color: '#aaffaa',
                originalSpeed: monster.originalSpeed * 1.2
            };
            
            monsters.push(splitMonster);
        }
        
        if (addVisualEffect) {
            addVisualEffect({
                type: 'explosion',
                x: monster.x,
                y: monster.y,
                radius: 50,
                color: '#00ff00',
                startTime: Date.now(),
                duration: 300
            });
        }
    }
};

// ============================================
// ITEM AND CONSUMABLE EFFECTS
// ============================================

const ItemEffects = {
    applyPermanentItem(item, player, queueMessage) {
        switch(item.id) {
            case 'damage_orb':
                player.damageMultiplier += 0.15;
                queueMessage(`Damage increased by 15%! Now ${Math.floor(player.damageMultiplier * 100)}%`);
                break;
            case 'speed_boots':
                player.speedMultiplier += 0.15;
                player.speed = player.baseSpeed * player.speedMultiplier;
                queueMessage(`Speed increased by 15%! Now ${Math.floor(player.speedMultiplier * 100)}%`);
                break;
            case 'health_upgrade':
                const oldMax = player.maxHealth;
                player.maxHealth = Math.floor(oldMax * 1.25);
                player.health += player.maxHealth - oldMax;
                queueMessage(`Max health increased by 25%! Now ${player.maxHealth}`);
                break;
            case 'vampire_teeth':
                player.lifeSteal += 0.05;
                queueMessage(`Life steal increased by 5%! Now ${Math.floor(player.lifeSteal * 100)}%`);
                break;
            case 'berserker_ring':
                player.berserkerRing = true;
                queueMessage("Berserker Ring equipped! Damage increases as health decreases");
                break;
            case 'ninja_scroll':
                player.dodgeChance += 0.15;
                queueMessage(`Dodge chance increased by 15%! Now ${Math.floor(player.dodgeChance * 100)}%`);
                break;
            case 'alchemist_stone':
                player.goldMultiplier += 0.2;
                queueMessage(`Gold multiplier increased by 20%! Now +${Math.floor(player.goldMultiplier * 100)}% gold`);
                break;
            case 'thorns_armor':
                player.thornsDamage = 0.25;
                queueMessage("Thorns Armor equipped! Reflect 25% of damage back to attackers");
                break;
            case 'wind_charm':
                player.attackSpeedMultiplier += 0.15;
                queueMessage(`Attack speed increased by 15%! Now ${player.attackSpeedMultiplier.toFixed(1)}x`);
                break;
            case 'runic_plate':
                player.firstHitReduction = true;
                player.firstHitActive = true;
                queueMessage("Runic Plate equipped! First hit each wave deals 50% less damage");
                break;
            case 'guardian_angel':
                player.guardianAngel = true;
                queueMessage("Guardian Angel equipped! Once per game, survive fatal damage with 50% health");
                break;
            case 'blood_contract':
                if (!player.bloodContract) {
                    player.bloodContract = true;
                    player.bloodContractStacks = 1;
                    player.lifeSteal += 0.03;
                    player.healthRegen = 0;
                    player.healthRegenPercent = 0;
                    
                    if (player.bloodContractInterval) clearInterval(player.bloodContractInterval);
                    
                    player.bloodContractInterval = setInterval(() => {
                        if (window.gameState === 'wave') {
                            const damagePercent = 0.01 * player.bloodContractStacks;
                            const damageAmount = Math.max(1, Math.floor(player.maxHealth * damagePercent));
                            if (player.health > damageAmount) player.health -= damageAmount;
                            else player.health = 1;
                            if (window.updateUI) window.updateUI();
                            if (window.createDamageIndicator) window.createDamageIndicator(player.x, player.y, damageAmount, false);
                        }
                    }, 1000);
                    queueMessage(`Blood Contract activated! +3% lifesteal, lose ${player.bloodContractStacks}% HP per second`);
                } else {
                    player.bloodContractStacks++;
                    player.lifeSteal += 0.03;
                    queueMessage(`Blood Contract stacked! Now ${player.bloodContractStacks} stacks (${Math.floor(player.lifeSteak * 100)}% lifesteal, lose ${player.bloodContractStacks}% HP per second)`);
                }
                break;
        }
    },

    useConsumable(consumable, player, monsters, gold, queueMessage, applyHealing, updateUI, updateConsumablesDisplay) {
        switch(consumable.id) {
            case 'health_potion':
                const healAmount = Math.floor(player.maxHealth * 0.25);
                applyHealing(healAmount);
                queueMessage(`Used Health Potion! +${healAmount} HP (25%)`);
                break;
            case 'ammo_pack':
                player.weapons.forEach(weapon => {
                    if (weapon.usesAmmo && !weapon.isThrowable) {
                        weapon.currentAmmo = weapon.magazineSize;
                        weapon.isReloading = false;
                    }
                });
                queueMessage("Used Ammo Pack! All weapons reloaded");
                break;
            case 'rage_potion':
                this.activateRagePotion(player, queueMessage);
                break;
            case 'bomb':
                if (window.placeBomb) window.placeBomb();
                break;
            case 'exp_scroll':
                this.useExpScroll(player, queueMessage, updateWeaponDisplay);
                break;
            case 'healing_tower':
                if (window.placeHealingTower) window.placeHealingTower();
                break;
        }
        
        return true;
    },

    activateRagePotion(player, queueMessage) {
        if (window.activeBuffs) {
            window.activeBuffs.rage.active = true;
            window.activeBuffs.rage.originalMultiplier = player.damageMultiplier;
            window.activeBuffs.rage.endTime = Date.now() + 10000;
        }
        
        player.damageMultiplier *= 1.5;
        
        if (window.addVisualEffect) {
            window.addVisualEffect({
                type: 'rage',
                x: player.x,
                y: player.y,
                radius: 50,
                color: '#FF0000',
                startTime: Date.now(),
                duration: 10000
            });
        }
        
        queueMessage("RAGE! +50% damage for 10 seconds!");
        
        setTimeout(() => {
            if (window.activeBuffs?.rage.active) {
                window.activeBuffs.rage.active = false;
                player.damageMultiplier = window.activeBuffs.rage.originalMultiplier;
                queueMessage("Rage effect ended");
            }
        }, 10000);
    },

    useExpScroll(player, queueMessage, updateWeaponDisplay) {
        if (player.weapons.length === 0) {
            queueMessage("No weapons to upgrade!");
            return;
        }
        
        const randomIndex = Math.floor(Math.random() * player.weapons.length);
        const weapon = player.weapons[randomIndex];
        
        if (weapon.tier >= 5) {
            queueMessage(`${weapon.name} is already max tier!`);
            return;
        }
        
        const oldTier = weapon.tier;
        weapon.tier++;
        weapon.applyTierBonuses();
        
        if (weapon.resetEachRound) weapon.resetAmmo();
        
        if (window.addVisualEffect) {
            window.addVisualEffect({
                type: 'upgrade',
                x: player.x,
                y: player.y,
                radius: 40,
                color: '#FFD700',
                startTime: Date.now(),
                duration: 1000
            });
        }
        
        queueMessage(`${weapon.name} upgraded from Tier ${oldTier} to Tier ${weapon.tier}!`);
        if (updateWeaponDisplay) updateWeaponDisplay();
    }
};

// ============================================
// BOSS MECHANICS
// ============================================

const BossMechanics = {
    bossWeapons: {
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
            range: 250,
            description: 'Dashing scythe slash with lifesteal',
            swingColor: '#4B0082',
            swingAngle: 270,
            animation: 'scytheSwing',
            trailColor: '#9400D3',
            bladeColor: '#4B0082',
            handleColor: '#2F4F4F',
            edgeColor: '#FF00FF',
            sparkleColor: '#FF69B4',
            dashRange: 500,
            dashSpeed: 15,
            lifeSteal: 0.15
        }
    },

    shootBossProjectiles(boss, wave, player, bossProjectiles) {
        const currentTime = Date.now();
        
        if (wave === 10) {
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
            const directions = [
                { vx: 1, vy: 1 }, { vx: -1, vy: 1 },
                { vx: -1, vy: -1 }, { vx: 1, vy: -1 }
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
    },

    updateBossDash(boss, player, bossAbilities, currentTime, addVisualEffect) {
        if (bossAbilities.bossDash && bossAbilities.bossDashDirection) {
            const dashSpeed = this.bossWeapons.SCYTHE.dashSpeed;
            boss.x += bossAbilities.bossDashDirection.x * dashSpeed;
            boss.y += bossAbilities.bossDashDirection.y * dashSpeed;
            bossAbilities.bossDashDistance += dashSpeed;
            
            if (!bossAbilities.bossWeaponAttack && bossAbilities.bossDashDistance < 100) {
                const angle = Math.atan2(player.y - boss.y, player.x - boss.x);
                bossAbilities.bossWeaponAttack = {
                    type: 'melee',
                    x: boss.x,
                    y: boss.y,
                    radius: this.bossWeapons.SCYTHE.range,
                    damage: this.bossWeapons.SCYTHE.baseDamage,
                    color: this.bossWeapons.SCYTHE.swingColor,
                    startTime: currentTime,
                    duration: 300,
                    swingAngle: this.bossWeapons.SCYTHE.swingAngle,
                    meleeType: this.bossWeapons.SCYTHE.meleeType,
                    angle: angle,
                    lifeSteal: this.bossWeapons.SCYTHE.lifeSteal
                };
            }
        }
    }
};

// ============================================
// WEAPON PRIORITY TARGETING SYSTEM
// ============================================

class TargetingSystem {
    constructor() {
        this.attackedMonsters = new Set();
        this.weaponTargets = new Map();
    }
    
    getTargetPriority(monster, player, weapon) {
        const dx = monster.x - player.x;
        const dy = monster.y - player.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > weapon.range) return -Infinity;
        
        let score = 1000 - distance;
        
        const angleToMonster = Math.atan2(dy, dx);
        const facingAngle = player.facingAngle || 0;
        let angleDiff = angleToMonster - facingAngle;
        while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
        while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
        
        const angleScore = Math.max(0, Math.cos(angleDiff));
        score += angleScore * 300;
        
        if (this.attackedMonsters.has(monster)) score -= 200;
        
        let targetCount = 0;
        this.weaponTargets.forEach((targetedMonster, weaponId) => {
            if (targetedMonster === monster && weaponId !== weapon.id) targetCount++;
        });
        score -= targetCount * 150;
        
        if (weapon.sniper) score += monster.health * 2;
        else if (weapon.id === 'shotgun') {
            let nearbyCount = 0;
            if (window.monsters) {
                window.monsters.forEach(other => {
                    if (other === monster) return;
                    const odx = other.x - monster.x;
                    const ody = other.y - monster.y;
                    if (Math.sqrt(odx * odx + ody * ody) < 100) nearbyCount++;
                });
            }
            score += nearbyCount * 50;
        } else if (weapon.id === 'crossbow') score += angleScore * 200;
        else if (weapon.id === 'throwing_knives') {
            const healthPercent = monster.health / monster.maxHealth;
            score += (1 - healthPercent) * 200;
        } else if (weapon.meleeType === 'aoe') {
            let nearbyCount = 0;
            if (window.monsters) {
                window.monsters.forEach(other => {
                    if (other === monster) return;
                    const odx = other.x - monster.x;
                    const ody = other.y - monster.y;
                    if (Math.sqrt(odx * odx + ody * ody) < weapon.range * 1.5) nearbyCount++;
                });
            }
            score += nearbyCount * 100;
        }
        
        if (distance < 50) score += 1000;
        
        return score;
    }
    
    selectTargetForWeapon(weapon, monsters, player) {
        if (!monsters || monsters.length === 0) return null;
        
        let bestMonster = null;
        let bestPriority = -Infinity;
        
        monsters.forEach(monster => {
            const priority = this.getTargetPriority(monster, player, weapon);
            if (priority > bestPriority) {
                bestPriority = priority;
                bestMonster = monster;
            }
        });
        
        return bestMonster;
    }
    
    markAttacked(monster) {
        this.attackedMonsters.add(monster);
        setTimeout(() => this.attackedMonsters.delete(monster), 500);
    }
    
    recordTarget(weaponId, monster) {
        this.weaponTargets.set(weaponId, monster);
    }
    
    clearTargets() {
        this.weaponTargets.clear();
    }
}

// ============================================
// MELEE WEAPON ANIMATIONS
// ============================================

const MeleeAnimations = {
    drawSword(ctx, attack, angle, progress, distance, alpha) {
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
        ctx.beginPath();
        ctx.moveTo(0, -5);
        ctx.lineTo(attack.radius * 0.9, -2);
        ctx.lineTo(attack.radius * 0.9, 2);
        ctx.lineTo(0, 5);
        ctx.closePath();
        ctx.fill();
        
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(attack.radius * 0.9, 0, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        
        ctx.save();
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(-5, -4, 15, 8);
        ctx.fillStyle = '#B87333';
        ctx.fillRect(-8, -8, 8, 16);
        ctx.fillStyle = '#CD7F32';
        ctx.beginPath();
        ctx.arc(-10, 0, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    },

    drawAxe(ctx, attack, angle, progress, distance, alpha) {
        const spinAngle = progress * Math.PI * 4;
        ctx.rotate(spinAngle);
        
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
        ctx.beginPath();
        ctx.moveTo(0, -10);
        ctx.lineTo(35, -15);
        ctx.lineTo(35, -5);
        ctx.lineTo(0, 10);
        ctx.closePath();
        ctx.fill();
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
    },

    drawDagger(ctx, attack, angle, progress, distance, alpha) {
        const stabProgress = Math.min(progress * 2, 1);
        const stabDistance = distance * 1.5;
        
        ctx.rotate(angle);
        ctx.translate(stabDistance, 0);
        
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
        ctx.restore();
        
        if (progress > 0.7) {
            ctx.save();
            ctx.translate(40, 0);
            ctx.fillStyle = `rgba(0, 255, 255, ${alpha})`;
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
    },

    drawHammer(ctx, attack, angle, progress, distance, alpha) {
        ctx.rotate(angle);
        
        const lift = Math.sin(progress * Math.PI) * 30;
        const smashY = progress < 0.3 ? -lift : progress > 0.6 ? (progress - 0.6) * 40 : 0;
        
        ctx.translate(20, -30 + lift - smashY);
        
        ctx.save();
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(-3, 0, 6, 50);
        ctx.restore();
        
        ctx.save();
        ctx.translate(0, -15);
        ctx.fillStyle = '#696969';
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
    },

    drawTrident(ctx, attack, angle, progress, distance, alpha) {
        const thrustProgress = Math.min(progress * 1.5, 1);
        const thrustDistance = distance * 1.3 * thrustProgress;
        
        ctx.rotate(angle);
        ctx.translate(thrustDistance, 0);
        
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
    },

    drawDualDaggers(ctx, attack, angle, progress, distance, alpha) {
        ctx.save();
        ctx.rotate(angle - 0.2);
        ctx.translate(distance * 0.8, 0);
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
        ctx.fillStyle = attack.sparkleColor || '#00FFFF';
        ctx.globalAlpha = alpha * 0.3;
        ctx.beginPath();
        ctx.arc(30, 0, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        
        ctx.save();
        ctx.rotate(angle + 0.2);
        ctx.translate(distance * 0.8, 0);
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
        ctx.fillStyle = attack.sparkleColor || '#00FFFF';
        ctx.globalAlpha = alpha * 0.3;
        ctx.beginPath();
        ctx.arc(30, 0, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    },

    drawDefaultMelee(ctx, attack, angle, progress, distance, alpha) {
        ctx.rotate(angle);
        ctx.translate(distance, 0);
        ctx.fillStyle = attack.color || '#FFFFFF';
        ctx.beginPath();
        ctx.arc(0, 0, 10, 0, Math.PI * 2);
        ctx.fill();
    }
};

// ============================================
// PROJECTILE ANIMATIONS
// ============================================

const ProjectileAnimations = {
    drawBoomerang(ctx, projectile, currentTime, boomerangImage) {
        const rotation = (projectile.rotation || 0) + 0.1;
        projectile.rotation = rotation;
        
        if (boomerangImage?.complete && boomerangImage.naturalHeight > 0) {
            ctx.save();
            ctx.translate(projectile.x, projectile.y);
            ctx.rotate(rotation);
            ctx.drawImage(boomerangImage, -20, -20, 40, 40);
            ctx.restore();
        } else {
            ctx.save();
            ctx.translate(projectile.x, projectile.y);
            ctx.rotate(rotation);
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
            ctx.restore();
        }
    },

    drawThrowingKnife(ctx, projectile, currentTime) {
        projectile.rotation = (projectile.rotation || 0) + (projectile.spinSpeed || 0);
        
        ctx.save();
        ctx.translate(projectile.x, projectile.y);
        ctx.rotate(projectile.rotation);
        
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
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.beginPath();
        ctx.arc(-projectile.size * 0.2, -projectile.size * 0.5, 1, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    },

    drawSniper(ctx, projectile, currentTime) {
        ctx.save();
        ctx.translate(projectile.x, projectile.y);
        
        const trailLength = 15;
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(0, 0, 5, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = '#FF4500';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-Math.cos(projectile.angle) * trailLength, -Math.sin(projectile.angle) * trailLength);
        ctx.lineTo(0, 0);
        ctx.stroke();
        
        const age = currentTime - projectile.startTime;
        if (age < 100) {
            ctx.fillStyle = `rgba(255, 200, 0, ${1 - age/100})`;
            ctx.beginPath();
            ctx.arc(-Math.cos(projectile.angle) * 10, -Math.sin(projectile.angle) * 10, 8, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.restore();
    },

    drawCrossbow(ctx, projectile, currentTime) {
        ctx.save();
        ctx.translate(projectile.x, projectile.y);
        ctx.rotate(projectile.angle);
        
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(-15, -2, 30, 4);
        
        ctx.fillStyle = '#C0C0C0';
        ctx.beginPath();
        ctx.moveTo(15, -3);
        ctx.lineTo(25, 0);
        ctx.lineTo(15, 3);
        ctx.closePath();
        ctx.fill();
        
        ctx.fillStyle = '#FF0000';
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
            ctx.beginPath();
            ctx.arc(0, 0, 8, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        ctx.restore();
    },

    drawShotgunPellet(ctx, projectile, currentTime) {
        ctx.fillStyle = projectile.color;
        ctx.beginPath();
        ctx.arc(projectile.x, projectile.y, 3, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.beginPath();
        ctx.arc(projectile.x - Math.cos(projectile.angle) * 5, 
                projectile.y - Math.sin(projectile.angle) * 5, 2, 0, Math.PI * 2);
        ctx.fill();
    },

    drawLaser(ctx, projectile, currentTime) {
        const pulse = Math.sin(currentTime * 0.02) * 2;
        
        ctx.strokeStyle = '#00FFFF';
        ctx.lineWidth = 4 + pulse;
        ctx.beginPath();
        ctx.moveTo(projectile.x - Math.cos(projectile.angle) * 10, 
                   projectile.y - Math.sin(projectile.angle) * 10);
        ctx.lineTo(projectile.x, projectile.y);
        ctx.stroke();
        
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(projectile.x - Math.cos(projectile.angle) * 10, 
                   projectile.y - Math.sin(projectile.angle) * 10);
        ctx.lineTo(projectile.x, projectile.y);
        ctx.stroke();
        
        ctx.fillStyle = 'rgba(0, 255, 255, 0.3)';
        ctx.beginPath();
        ctx.arc(projectile.x, projectile.y, 6, 0, Math.PI * 2);
        ctx.fill();
    },

    drawMachinegun(ctx, projectile, currentTime) {
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(projectile.x, projectile.y, 3, 0, Math.PI * 2);
        ctx.fill();
        
        for (let i = 1; i <= 3; i++) {
            const alpha = 0.3 - i * 0.1;
            ctx.fillStyle = `rgba(255, 215, 0, ${alpha})`;
            ctx.beginPath();
            ctx.arc(projectile.x - Math.cos(projectile.angle) * i * 8, 
                    projectile.y - Math.sin(projectile.angle) * i * 8, 
                    2, 0, Math.PI * 2);
            ctx.fill();
        }
    },

    drawDefault(ctx, projectile, currentTime) {
        ctx.fillStyle = projectile.color;
        ctx.beginPath();
        ctx.arc(projectile.x, projectile.y, projectile.size || 4, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = projectile.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(projectile.x - Math.cos(projectile.angle) * 10, 
                   projectile.y - Math.sin(projectile.angle) * 10);
        ctx.lineTo(projectile.x, projectile.y);
        ctx.stroke();
    }
};

// ============================================
// BOSS MELEE ANIMATIONS
// ============================================

const BossMeleeAnimations = {
    drawDagger(ctx, attack, angle, progress, distance, alpha) {
        const stabProgress = Math.min(progress * 2, 1);
        const stabDistance = distance * 1.5;
        
        ctx.rotate(angle);
        ctx.translate(stabDistance, 0);
        
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
        
        if (progress > 0.7) {
            ctx.save();
            ctx.translate(60, 0);
            ctx.fillStyle = `rgba(255, 0, 0, ${alpha})`;
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
    },

    drawHammer(ctx, attack, angle, progress, distance, alpha) {
        ctx.rotate(angle);
        
        const lift = Math.sin(progress * Math.PI) * 50;
        const smashY = progress < 0.3 ? -lift : progress > 0.6 ? (progress - 0.6) * 60 : 0;
        
        ctx.translate(30, -50 + lift - smashY);
        
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(-5, 0, 10, 80);
        
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
    },

    drawScythe(ctx, attack, angle, progress, distance, alpha, scytheImage) {
        const swingProgress = Math.sin(progress * Math.PI);
        const currentAngle = angle - 1 + swingProgress * 2;
        
        ctx.rotate(currentAngle);
        
        if (scytheImage?.complete && scytheImage.naturalHeight > 0) {
            ctx.save();
            ctx.translate(40, -20);
            ctx.rotate(-0.3);
            ctx.scale(1.5, 1.5);
            ctx.drawImage(scytheImage, -25, -25, 50, 50);
            ctx.restore();
        } else {
            ctx.fillStyle = '#2F4F4F';
            ctx.fillRect(-5, -attack.radius * 0.8, 10, attack.radius * 1.6);
            
            ctx.save();
            ctx.translate(0, -attack.radius * 0.6);
            ctx.rotate(-0.5);
            
            const bladeGradient = ctx.createLinearGradient(0, -20, 80, -20);
            bladeGradient.addColorStop(0, '#4B0082');
            bladeGradient.addColorStop(1, '#9400D3');
            
            ctx.fillStyle = bladeGradient;
            ctx.beginPath();
            ctx.moveTo(0, -15);
            ctx.lineTo(80, -25);
            ctx.lineTo(80, -5);
            ctx.lineTo(0, 15);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }
        
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
    }
};

// ============================================
// EXPORTS
// ============================================

// Make classes and modules available globally
window.WeaponInstance = WeaponInstance;
window.MONSTER_AI = MONSTER_AI;
window.ItemEffects = ItemEffects;
window.BossMechanics = BossMechanics;
window.TargetingSystem = TargetingSystem;
window.MeleeAnimations = MeleeAnimations;
window.ProjectileAnimations = ProjectileAnimations;
window.BossMeleeAnimations = BossMeleeAnimations;
