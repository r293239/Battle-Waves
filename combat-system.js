// ============================================
// COMBAT SYSTEM - Weapon Targeting, Damage, Projectiles
// ============================================

// Weapon targeting tracking
let attackedMonsters = new Set();
let weaponTargets = new Map();

// ============================================
// WEAPON PRIORITY TARGETING SYSTEM
// ============================================

function getTargetPriority(monster, player, weapon, currentTime) {
    const dx = monster.x - player.x;
    const dy = monster.y - player.y;
    const distance = Math.hypot(dx, dy);
    
    if (distance > weapon.range) return -Infinity;
    
    let score = 10000 - distance;
    
    const angleToMonster = Math.atan2(dy, dx);
    const facingAngle = player.facingAngle || 0;
    let angleDiff = angleToMonster - facingAngle;
    while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
    while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
    const angleScore = Math.max(0, Math.cos(angleDiff));
    score += angleScore * 300;
    
    if (attackedMonsters.has(monster)) score -= 200;
    
    let targetCount = 0;
    weaponTargets.forEach((targetedMonster, weaponId) => {
        if (targetedMonster === monster && weaponId !== weapon.id) targetCount++;
    });
    score -= targetCount * 150;
    
    // Weapon-specific priorities
    if (weapon.sniper) {
        score += monster.health * 1.5;
        if (distance > 200 && distance < 500) score += 200;
    } else if (weapon.id === 'shotgun') {
        let nearbyCount = 0;
        monsters.forEach(other => {
            if (other !== monster && Math.hypot(other.x - monster.x, other.y - monster.y) < 100) nearbyCount++;
        });
        score += nearbyCount * 80;
        if (distance < 150) score += 300;
    } else if (weapon.id === 'crossbow') {
        score += angleScore * 250;
        let linedUpCount = 0;
        monsters.forEach(other => {
            if (other !== monster && Math.abs(Math.sin(angleDiff) * 100) < 50) linedUpCount++;
        });
        score += linedUpCount * 100;
    } else if (weapon.id === 'throwing_knives') {
        score += (1 - monster.health / monster.maxHealth) * 400;
        if (distance < 150) score += 200;
    } else if (weapon.id === 'boomerang') {
        let nearbyCount = 0;
        monsters.forEach(other => {
            if (other !== monster && Math.hypot(other.x - monster.x, other.y - monster.y) < 150) nearbyCount++;
        });
        score += nearbyCount * 120;
    } else if (weapon.id === 'laser') {
        let linedUpCount = 0;
        monsters.forEach(other => {
            if (other !== monster && Math.abs(Math.sin(angleDiff) * 100) < 30) linedUpCount++;
        });
        score += linedUpCount * 150;
    } else if (weapon.meleeType === 'aoe') {
        let nearbyCount = 0;
        monsters.forEach(other => {
            if (other !== monster && Math.hypot(other.x - monster.x, other.y - monster.y) < weapon.range * 1.5) nearbyCount++;
        });
        score += nearbyCount * 100;
        if (distance < weapon.range) score += 150;
    } else if (weapon.meleeType === 'pierce') {
        score += angleScore * 200;
        if (distance > weapon.range * 0.7) score += 100;
    } else if (weapon.meleeType === 'single' && distance < 80) {
        score += 500;
    }
    
    // Emergency close range override
    if (distance < 50) score += 2000;
    
    // Monster type priorities
    if (monster.isBoss) score += 3000;
    if (monster.isSplitter) score += 500;
    if (monster.explosive) score += 400;
    if (monster.isGunner) score += 300;
    if (monster.isDasher) score += 250;
    if (monster.isVampire) score += 350;
    
    return score;
}

function selectTargetForWeapon(weapon, currentTime) {
    if (monsters.length === 0) return null;
    let bestMonster = null;
    let bestPriority = -Infinity;
    monsters.forEach(monster => {
        const priority = getTargetPriority(monster, player, weapon, currentTime);
        if (priority > bestPriority) {
            bestPriority = priority;
            bestMonster = monster;
        }
    });
    return bestMonster;
}

// ============================================
// HEALING SYSTEM
// ============================================

let pendingHealing = 0;

function applyHealing(amount) {
    if (player.health >= player.maxHealth || amount <= 0) return;
    pendingHealing += Math.ceil(amount);
    const healAmount = Math.min(pendingHealing, player.maxHealth - player.health);
    if (healAmount > 0) {
        player.health += healAmount;
        pendingHealing -= healAmount;
        createHealthPopup(player.x, player.y, healAmount);
        addVisualEffect({ type: 'heal', x: player.x, y: player.y, radius: 20, color: '#00FF00', startTime: Date.now(), duration: 400 });
    }
    if (player.updateHealthDisplay) player.updateHealthDisplay();
}

// ============================================
// PROJECTILE UPDATES
// ============================================

function updateProjectiles() {
    const currentTime = Date.now();
    for (let i = player.projectiles.length - 1; i >= 0; i--) {
        const projectile = player.projectiles[i];
        if (!projectile.startX) {
            projectile.startX = projectile.x;
            projectile.startY = projectile.y;
            projectile.startTime = currentTime;
        }
        
        if (projectile.isBoomerang) {
            if (projectile.state === 'outgoing') {
                projectile.x += Math.cos(projectile.angle) * projectile.speed;
                projectile.y += Math.sin(projectile.angle) * projectile.speed;
                projectile.distanceTraveled = Math.hypot(projectile.x - projectile.startX, projectile.y - projectile.startY);
                if (projectile.distanceTraveled >= projectile.range / 2) projectile.state = 'returning';
            } else {
                const dx = player.x - projectile.x, dy = player.y - projectile.y;
                if (Math.hypot(dx, dy) < 10) {
                    player.projectiles.splice(i, 1);
                    continue;
                }
                const angle = Math.atan2(dy, dx);
                projectile.x += Math.cos(angle) * projectile.returnSpeed;
                projectile.y += Math.sin(angle) * projectile.returnSpeed;
                projectile.angle = angle;
            }
            projectile.rotation = (projectile.rotation || 0) + 0.2;
        } else {
            projectile.x += Math.cos(projectile.angle) * projectile.speed;
            projectile.y += Math.sin(projectile.angle) * projectile.speed;
            if (Math.hypot(projectile.x - player.x, projectile.y - player.y) > projectile.range) {
                player.projectiles.splice(i, 1);
                continue;
            }
        }
        
        // Bounce logic
        if (projectile.bounceCount > 0 && projectile.targetsHit) {
            let nextTarget = null, nextTargetDistance = Infinity;
            monsters.forEach(monster => {
                if (projectile.targetsHit.includes(monster)) return;
                const dist = Math.hypot(projectile.x - monster.x, projectile.y - monster.y);
                if (dist < nextTargetDistance && dist < projectile.bounceRange) {
                    nextTargetDistance = dist;
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
        
        // Crossbow piercing
        if (projectile.weaponId === 'crossbow' && projectile.pierceCount > 0) {
            if (!projectile.piercedEnemies) projectile.piercedEnemies = [];
            for (let j = monsters.length - 1; j >= 0; j--) {
                const monster = monsters[j];
                if (projectile.piercedEnemies.includes(monster)) continue;
                if (Math.hypot(projectile.x - monster.x, projectile.y - monster.y) < 8 + monster.radius) {
                    let damage = projectile.damage, isCritical = false;
                    if (Math.random() < player.criticalChance) { damage *= 2; isCritical = true; }
                    damage = Math.floor(damage * player.damageMultiplier);
                    monster.health -= damage;
                    if (projectile.weaponRef && projectile.weaponRef.isThrowable) projectile.weaponRef.trackKnifeHit(monster);
                    createDamageIndicator(monster.x, monster.y, damage, isCritical);
                    projectile.piercedEnemies.push(monster);
                    projectile.pierceCount--;
                    if (player.lifeSteal > 0) applyHealing(damage * player.lifeSteal);
                    if (monster.isBoss && monster.lifeSteal) {
                        const bossHeal = Math.floor(damage * monster.lifeSteal);
                        if (bossHeal > 0) {
                            monster.health = Math.min(monster.maxHealth, monster.health + bossHeal);
                            createHealthPopup(monster.x, monster.y, bossHeal);
                        }
                    }
                    if (monster.health <= 0) handleMonsterDeath(monster, j);
                    if (projectile.pierceCount <= 0) {
                        player.projectiles.splice(i, 1);
                        break;
                    }
                }
            }
        } else {
            // Normal projectile hit detection
            for (let j = monsters.length - 1; j >= 0; j--) {
                const monster = monsters[j];
                if (Math.hypot(projectile.x - monster.x, projectile.y - monster.y) < (projectile.size || 4) + monster.radius) {
                    let damage = projectile.damage, isCritical = false;
                    if (Math.random() < player.criticalChance) { damage *= 2; isCritical = true; }
                    damage = Math.floor(damage * player.damageMultiplier);
                    monster.health -= damage;
                    if (projectile.weaponRef && projectile.weaponRef.isThrowable) projectile.weaponRef.trackKnifeHit(monster);
                    createDamageIndicator(monster.x, monster.y, damage, isCritical);
                    if (player.lifeSteal > 0) applyHealing(damage * player.lifeSteal);
                    if (monster.isBoss && monster.lifeSteal) {
                        const bossHeal = Math.floor(damage * monster.lifeSteal);
                        if (bossHeal > 0) {
                            monster.health = Math.min(monster.maxHealth, monster.health + bossHeal);
                            createHealthPopup(monster.x, monster.y, bossHeal);
                        }
                    }
                    if (projectile.isBoomerang && !projectile.targetsHit.includes(monster)) projectile.targetsHit.push(monster);
                    if (!projectile.isBoomerang) {
                        if (!projectile.bounceCount || !projectile.targetsHit) player.projectiles.splice(i, 1);
                        else if (!projectile.targetsHit.includes(monster)) projectile.targetsHit.push(monster);
                    } else if (projectile.isBoomerang && projectile.targetsHit.length >= projectile.maxTargets) {
                        player.projectiles.splice(i, 1);
                        break;
                    }
                    if (monster.health <= 0) handleMonsterDeath(monster, j);
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
        if (currentTime - attack.startTime > attack.duration) {
            player.meleeAttacks.splice(i, 1);
            continue;
        }
        let hits = 0;
        for (let j = monsters.length - 1; j >= 0; j--) {
            const monster = monsters[j];
            if (Math.hypot(monster.x - attack.x, monster.y - attack.y) < attack.radius + monster.radius) {
                let damage = attack.damage, isCritical = false;
                if (Math.random() < player.criticalChance) { damage *= 2; isCritical = true; }
                damage = Math.floor(damage * player.damageMultiplier);
                monster.health -= damage;
                createDamageIndicator(monster.x, monster.y, damage, isCritical);
                if (player.lifeSteal > 0) applyHealing(damage * player.lifeSteal);
                if (monster.isBoss && monster.lifeSteal) {
                    const bossHeal = Math.floor(damage * monster.lifeSteal);
                    if (bossHeal > 0) {
                        monster.health = Math.min(monster.maxHealth, monster.health + bossHeal);
                        createHealthPopup(monster.x, monster.y, bossHeal);
                    }
                }
                hits++;
                if (attack.meleeType === 'pierce' && hits >= attack.pierceCount) break;
                if (monster.health <= 0) {
                    handleMonsterDeath(monster, j);
                    j--;
                }
            }
        }
    }
}

function updateWeapons() {
    const currentTime = Date.now();
    weaponTargets.clear();
    player.weapons.forEach(weapon => {
        if (!weapon || monsters.length === 0) return;
        const originalAttackSpeed = weapon.attackSpeed;
        weapon.attackSpeed = originalAttackSpeed * player.attackSpeedMultiplier;
        const canAttack = weapon.canAttack(currentTime);
        weapon.attackSpeed = originalAttackSpeed;
        if (canAttack) {
            const targetMonster = selectTargetForWeapon(weapon, currentTime);
            if (targetMonster) {
                weaponTargets.set(weapon.id, targetMonster);
                const attack = weapon.attack(player.x, player.y, targetMonster.x, targetMonster.y);
                if (weapon.id === 'shotgun') {
                    player.projectiles.push(...attack);
                } else if (weapon.type === 'ranged') {
                    player.projectiles.push(attack);
                } else {
                    player.meleeAttacks.push(attack);
                    if (weapon.dualStrike) {
                        player.meleeAttacks.push({ ...attack, angle: attack.angle + 0.2 });
                    }
                }
                attackedMonsters.add(targetMonster);
            }
        }
    });
}

// ============================================
// MONSTER PROJECTILES
// ============================================

function shootGunnerProjectile(gunner) {
    const currentTime = Date.now();
    const angle = Math.atan2(player.y - gunner.y, player.x - gunner.x);
    monsterProjectiles.push({
        x: gunner.x, y: gunner.y,
        vx: Math.cos(angle) * MONSTER_TYPES.GUNNER.projectileSpeed,
        vy: Math.sin(angle) * MONSTER_TYPES.GUNNER.projectileSpeed,
        damage: MONSTER_TYPES.GUNNER.projectileDamage,
        radius: 5, color: MONSTER_TYPES.GUNNER.projectileColor,
        startTime: currentTime, lifetime: 3000
    });
}

function updateMonsterProjectiles(currentTime) {
    for (let i = monsterProjectiles.length - 1; i >= 0; i--) {
        const proj = monsterProjectiles[i];
        proj.x += proj.vx;
        proj.y += proj.vy;
        if (currentTime - proj.startTime > proj.lifetime) {
            monsterProjectiles.splice(i, 1);
            continue;
        }
        if (Math.hypot(player.x - proj.x, player.y - proj.y) < player.radius + proj.radius) {
            let damage = proj.damage;
            if (player.firstHitActive) {
                damage *= 0.5;
                player.firstHitActive = false;
                queueMessage("Runic Plate absorbed 50% damage!");
            }
            if (player.damageReduction > 0) damage *= (1 - player.damageReduction);
            player.health -= damage;
            createDamageIndicator(player.x, player.y, Math.floor(damage), false);
            if (player.health <= 0) gameOver();
            monsterProjectiles.splice(i, 1);
        }
        if (proj.x < -50 || proj.x > canvas.width + 50 || proj.y < -50 || proj.y > canvas.height + 50) {
            monsterProjectiles.splice(i, 1);
        }
    }
}

// ============================================
// BOSS PROJECTILES WITH HOMING
// ============================================

function shootBossProjectiles(boss) {
    const currentTime = Date.now();
    const baseAngle = Math.atan2(player.y - boss.y, player.x - boss.x);
    
    if (wave === 10) {
        // 4 wide-spread + 1 homing
        for (let i = -2; i <= 2; i++) {
            if (i === 0) continue;
            const angle = baseAngle + (i * 0.35);
            bossProjectiles.push({
                x: boss.x, y: boss.y, vx: Math.cos(angle) * 6, vy: Math.sin(angle) * 6,
                damage: 10, radius: 5, color: '#ff8888', startTime: currentTime,
                lifetime: 2500, isHoming: false
            });
        }
        bossProjectiles.push({
            x: boss.x, y: boss.y, vx: Math.cos(baseAngle) * 5, vy: Math.sin(baseAngle) * 5,
            damage: 12, radius: 6, color: '#ff4444', startTime: currentTime,
            lifetime: 4000, isHoming: true, homingStrength: 0.03, target: { x: player.x, y: player.y }
        });
    } else if (wave === 20) {
        // 4 wide-spread + 2 homing
        for (let i = -2; i <= 2; i++) {
            if (i === 0) continue;
            const angle = baseAngle + (i * 0.4);
            bossProjectiles.push({
                x: boss.x, y: boss.y, vx: Math.cos(angle) * 5, vy: Math.sin(angle) * 5,
                damage: 12, radius: 6, color: '#ff4444', startTime: currentTime,
                lifetime: 3000, isHoming: false
            });
        }
        for (let h = -1; h <= 1; h++) {
            if (h === 0) continue;
            const angle = baseAngle + (h * 0.2);
            bossProjectiles.push({
                x: boss.x, y: boss.y, vx: Math.cos(angle) * 4.5, vy: Math.sin(angle) * 4.5,
                damage: 15, radius: 7, color: '#ff6600', startTime: currentTime,
                lifetime: 4000, isHoming: true, homingStrength: 0.04, target: { x: player.x, y: player.y }
            });
        }
    } else if (wave === 30) {
        // 6 wide-spread + 3 homing
        for (let i = -3; i <= 3; i++) {
            if (i === 0) continue;
            const angle = baseAngle + (i * 0.3);
            bossProjectiles.push({
                x: boss.x, y: boss.y, vx: Math.cos(angle) * 5.5, vy: Math.sin(angle) * 5.5,
                damage: 14, radius: 6, color: '#ff4444', startTime: currentTime,
                lifetime: 3000, isHoming: false
            });
        }
        for (let h = -1; h <= 1; h++) {
            const angle = baseAngle + (h * 0.25);
            bossProjectiles.push({
                x: boss.x, y: boss.y, vx: Math.cos(angle) * 5, vy: Math.sin(angle) * 5,
                damage: 18, radius: 8, color: '#ff0000', startTime: currentTime,
                lifetime: 4500, isHoming: true, homingStrength: 0.05, target: { x: player.x, y: player.y }
            });
        }
    } else {
        for (let i = -2; i <= 2; i++) {
            const angle = baseAngle + (i * 0.25);
            bossProjectiles.push({
                x: boss.x, y: boss.y, vx: Math.cos(angle) * 5, vy: Math.sin(angle) * 5,
                damage: 15, radius: 8, color: '#ff4444', startTime: currentTime,
                lifetime: 3000, isHoming: false
            });
        }
    }
}

function updateBossProjectiles(currentTime) {
    for (let i = bossProjectiles.length - 1; i >= 0; i--) {
        const proj = bossProjectiles[i];
        if (proj.isHoming) {
            proj.target = { x: player.x, y: player.y };
            const dx = proj.target.x - proj.x, dy = proj.target.y - proj.y;
            const distance = Math.hypot(dx, dy);
            if (distance > 0.01) {
                const currentAngle = Math.atan2(proj.vy, proj.vx);
                const targetAngle = Math.atan2(dy, dx);
                let angleDiff = targetAngle - currentAngle;
                while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
                while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
                const newAngle = currentAngle + Math.min(proj.homingStrength, Math.abs(angleDiff)) * Math.sign(angleDiff);
                const speed = Math.hypot(proj.vx, proj.vy);
                proj.vx = Math.cos(newAngle) * speed;
                proj.vy = Math.sin(newAngle) * speed;
            }
        }
        proj.x += proj.vx;
        proj.y += proj.vy;
        if (currentTime - proj.startTime > proj.lifetime) {
            bossProjectiles.splice(i, 1);
            continue;
        }
        if (Math.hypot(player.x - proj.x, player.y - proj.y) < player.radius + proj.radius) {
            let damage = proj.damage;
            if (player.firstHitActive) {
                damage *= 0.5;
                player.firstHitActive = false;
                queueMessage("Runic Plate absorbed 50% damage!");
            }
            if (player.damageReduction > 0) damage *= (1 - player.damageReduction);
            player.health -= damage;
            createDamageIndicator(player.x, player.y, Math.floor(damage), true);
            if (player.health <= 0) gameOver();
            bossProjectiles.splice(i, 1);
        }
        if (proj.x < -50 || proj.x > canvas.width + 50 || proj.y < -50 || proj.y > canvas.height + 50) {
            bossProjectiles.splice(i, 1);
        }
    }
}
