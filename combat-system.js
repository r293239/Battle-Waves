// ============================================
// COMBAT SYSTEM MODULE - ENHANCED
// ============================================
// Handles monster AI (pathfinding, prediction, hive mind),
// weapon targeting with scoring system, and combat animations

// ============================================
// ADVANCED MONSTER AI
// ============================================

class MonsterAI {
    constructor() {
        this.hiveMind = {
            active: true,
            leader: null,
            formation: 'scatter',
            groupCohesion: 0.3,
            groupSeparation: 0.5,
            groupAlignment: 0.2,
            lastUpdate: 0
        };
        
        this.prediction = {
            enabled: true,
            predictionTime: 0.5, // seconds
            accuracy: 0.7 // 70% accuracy
        };
        
        this.obstacleGrid = null;
        this.pathCache = new Map();
        this.pathCacheTimeout = 1000; // ms
    }

    // ============================================
    // HIVE MIND BEHAVIOR
    // ============================================
    
    updateHiveMind(monsters, player, currentTime) {
        if (!this.hiveMind.active || monsters.length < 2) return;
        
        // Update hive mind every 0.5 seconds
        if (currentTime - this.hiveMind.lastUpdate < 500) return;
        this.hiveMind.lastUpdate = currentTime;
        
        // Find or assign leader (strongest monster)
        const sortedMonsters = [...monsters].sort((a, b) => b.health - a.health);
        this.hiveMind.leader = sortedMonsters[0];
        
        // Determine formation based on situation
        const playerDistance = this.getAverageDistanceToPlayer(monsters, player);
        if (playerDistance > 300) {
            this.hiveMind.formation = 'attack_wave';
        } else if (playerDistance < 150) {
            this.hiveMind.formation = 'encircle';
        } else {
            this.hiveMind.formation = 'scatter';
        }
        
        // Update each monster's behavior based on hive mind
        monsters.forEach((monster, index) => {
            if (monster === this.hiveMind.leader) {
                this.updateLeaderBehavior(monster, player, monsters);
            } else {
                this.updateFollowerBehavior(monster, this.hiveMind.leader, player, monsters, index);
            }
        });
    }
    
    getAverageDistanceToPlayer(monsters, player) {
        if (monsters.length === 0) return 0;
        const total = monsters.reduce((sum, m) => {
            const dx = m.x - player.x;
            const dy = m.y - player.y;
            return sum + Math.sqrt(dx * dx + dy * dy);
        }, 0);
        return total / monsters.length;
    }
    
    updateLeaderBehavior(leader, player, monsters) {
        // Leader charges directly at player
        const dx = player.x - leader.x;
        const dy = player.y - leader.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist > 0) {
            leader.targetX = player.x;
            leader.targetY = player.y;
            leader.isCharging = true;
        }
        
        // Mark this monster as the leader for visual effect
        leader.isLeader = true;
    }
    
    updateFollowerBehavior(follower, leader, player, monsters, index) {
        // Reset leader flag
        follower.isLeader = false;
        
        // Different behaviors based on formation
        switch(this.hiveMind.formation) {
            case 'attack_wave':
                // Followers form a V-shaped formation behind leader
                const angleToLeader = Math.atan2(leader.y - follower.y, leader.x - follower.x);
                const formationSpacing = 50;
                const formationIndex = Math.floor(index / 2);
                const side = index % 2 === 0 ? -1 : 1;
                
                const formationX = leader.x + Math.cos(angleToLeader - side * 0.5) * formationSpacing * (formationIndex + 1);
                const formationY = leader.y + Math.sin(angleToLeader - side * 0.5) * formationSpacing * (formationIndex + 1);
                
                follower.targetX = formationX;
                follower.targetY = formationY;
                break;
                
            case 'encircle':
                // Monsters try to surround the player
                const encircleAngle = (index / monsters.length) * Math.PI * 2 + Date.now() * 0.001;
                const encircleRadius = 200;
                const targetX = player.x + Math.cos(encircleAngle) * encircleRadius;
                const targetY = player.y + Math.sin(encircleAngle) * encircleRadius;
                
                follower.targetX = targetX;
                follower.targetY = targetY;
                break;
                
            case 'scatter':
                // Default: follow leader with some variation
                const offsetX = (Math.random() - 0.5) * 80;
                const offsetY = (Math.random() - 0.5) * 80;
                follower.targetX = leader.x + offsetX;
                follower.targetY = leader.y + offsetY;
                break;
        }
        
        // Apply cohesion (stay close to group)
        this.applyCohesion(follower, monsters);
        
        // Apply separation (avoid crowding)
        this.applySeparation(follower, monsters);
    }
    
    applyCohesion(monster, monsters) {
        let centerX = 0, centerY = 0;
        let count = 0;
        
        monsters.forEach(other => {
            if (other === monster) return;
            const dx = other.x - monster.x;
            const dy = other.y - monster.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 150) {
                centerX += other.x;
                centerY += other.y;
                count++;
            }
        });
        
        if (count > 0) {
            centerX /= count;
            centerY /= count;
            
            const dx = centerX - monster.x;
            const dy = centerY - monster.y;
            monster.cohesionForce = {
                x: dx * this.hiveMind.groupCohesion,
                y: dy * this.hiveMind.groupCohesion
            };
        }
    }
    
    applySeparation(monster, monsters) {
        let separationX = 0, separationY = 0;
        
        monsters.forEach(other => {
            if (other === monster) return;
            const dx = monster.x - other.x;
            const dy = monster.y - other.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 50 && dist > 0) {
                const force = (50 - dist) / dist;
                separationX += dx * force;
                separationY += dy * force;
            }
        });
        
        monster.separationForce = {
            x: separationX * this.hiveMind.groupSeparation,
            y: separationY * this.hiveMind.groupSeparation
        };
    }
    
    // ============================================
    // PLAYER MOVEMENT PREDICTION
    // ============================================
    
    predictPlayerPosition(player, playerVelocity, currentTime) {
        if (!this.prediction.enabled) return { x: player.x, y: player.y };
        
        // Check if player has recent movement history
        if (!player.movementHistory) {
            player.movementHistory = [];
        }
        
        // Store movement history
        player.movementHistory.push({
            x: player.x,
            y: player.y,
            time: currentTime
        });
        
        // Keep last 10 positions
        if (player.movementHistory.length > 10) {
            player.movementHistory.shift();
        }
        
        // Calculate average velocity
        let avgVX = 0, avgVY = 0;
        if (player.movementHistory.length > 1) {
            for (let i = 1; i < player.movementHistory.length; i++) {
                const dt = player.movementHistory[i].time - player.movementHistory[i-1].time;
                if (dt > 0) {
                    avgVX += (player.movementHistory[i].x - player.movementHistory[i-1].x) / dt;
                    avgVY += (player.movementHistory[i].y - player.movementHistory[i-1].y) / dt;
                }
            }
            avgVX /= (player.movementHistory.length - 1);
            avgVY /= (player.movementHistory.length - 1);
        }
        
        // Apply prediction with accuracy factor
        const predictionTime = this.prediction.predictionTime;
        const accuracy = this.prediction.accuracy;
        
        // Add some randomness for less perfect prediction
        const noise = (Math.random() - 0.5) * (1 - accuracy) * 100;
        
        return {
            x: player.x + avgVX * predictionTime + noise * (1 - accuracy),
            y: player.y + avgVY * predictionTime + noise * (1 - accuracy)
        };
    }
    
    // ============================================
    // ADVANCED PATHFINDING
    // ============================================
    
    findPath(monster, target, obstacles, gridSize = 20) {
        const cacheKey = `${Math.floor(monster.x / gridSize)},${Math.floor(monster.y / gridSize)}->${Math.floor(target.x / gridSize)},${Math.floor(target.y / gridSize)}`;
        
        // Check cache
        if (this.pathCache.has(cacheKey)) {
            const cached = this.pathCache.get(cacheKey);
            if (Date.now() - cached.timestamp < this.pathCacheTimeout) {
                return cached.path;
            }
        }
        
        // A* pathfinding
        const startGrid = {
            x: Math.floor(monster.x / gridSize),
            y: Math.floor(monster.y / gridSize)
        };
        const endGrid = {
            x: Math.floor(target.x / gridSize),
            y: Math.floor(target.y / gridSize)
        };
        
        // Create grid if not exists
        if (!this.obstacleGrid) {
            this.buildObstacleGrid(obstacles, gridSize);
        }
        
        const path = this.aStar(startGrid, endGrid, gridSize);
        
        // Cache result
        this.pathCache.set(cacheKey, {
            path: path,
            timestamp: Date.now()
        });
        
        return path;
    }
    
    buildObstacleGrid(obstacles, gridSize, canvasWidth, canvasHeight) {
        const cols = Math.ceil(canvasWidth / gridSize);
        const rows = Math.ceil(canvasHeight / gridSize);
        
        this.obstacleGrid = [];
        for (let y = 0; y < rows; y++) {
            this.obstacleGrid[y] = [];
            for (let x = 0; x < cols; x++) {
                this.obstacleGrid[y][x] = { walkable: true, cost: 1 };
            }
        }
        
        obstacles.forEach(obs => {
            if (obs.type && obs.type.solid) {
                const startX = Math.floor((obs.x - obs.width/2) / gridSize);
                const endX = Math.floor((obs.x + obs.width/2) / gridSize);
                const startY = Math.floor((obs.y - obs.height/2) / gridSize);
                const endY = Math.floor((obs.y + obs.height/2) / gridSize);
                
                for (let gy = Math.max(0, startY); gy <= Math.min(rows-1, endY); gy++) {
                    for (let gx = Math.max(0, startX); gx <= Math.min(cols-1, endX); gx++) {
                        if (this.obstacleGrid[gy] && this.obstacleGrid[gy][gx]) {
                            this.obstacleGrid[gy][gx].walkable = false;
                        }
                    }
                }
            }
        });
    }
    
    aStar(start, end, gridSize) {
        const openSet = [{ ...start, g: 0, h: this.heuristic(start, end), f: this.heuristic(start, end), parent: null }];
        const closedSet = new Set();
        
        while (openSet.length > 0) {
            // Get node with lowest f score
            let current = openSet.reduce((min, node) => node.f < min.f ? node : min);
            
            if (current.x === end.x && current.y === end.y) {
                // Reconstruct path
                const path = [];
                let node = current;
                while (node) {
                    path.unshift({
                        x: node.x * gridSize + gridSize/2,
                        y: node.y * gridSize + gridSize/2
                    });
                    node = node.parent;
                }
                return path;
            }
            
            // Move to closed set
            const currentIndex = openSet.indexOf(current);
            openSet.splice(currentIndex, 1);
            closedSet.add(`${current.x},${current.y}`);
            
            // Check neighbors (including diagonals)
            const neighbors = [
                { x: current.x + 1, y: current.y, cost: 1 },
                { x: current.x - 1, y: current.y, cost: 1 },
                { x: current.x, y: current.y + 1, cost: 1 },
                { x: current.x, y: current.y - 1, cost: 1 },
                { x: current.x + 1, y: current.y + 1, cost: 1.4 },
                { x: current.x - 1, y: current.y + 1, cost: 1.4 },
                { x: current.x + 1, y: current.y - 1, cost: 1.4 },
                { x: current.x - 1, y: current.y - 1, cost: 1.4 }
            ];
            
            for (const neighbor of neighbors) {
                // Check bounds
                if (neighbor.x < 0 || neighbor.x >= this.obstacleGrid[0].length ||
                    neighbor.y < 0 || neighbor.y >= this.obstacleGrid.length) {
                    continue;
                }
                
                // Check if walkable
                if (!this.obstacleGrid[neighbor.y][neighbor.x].walkable) continue;
                
                // Check if in closed set
                if (closedSet.has(`${neighbor.x},${neighbor.y}`)) continue;
                
                const g = current.g + neighbor.cost;
                
                // Check if in open set
                const openNode = openSet.find(node => node.x === neighbor.x && node.y === neighbor.y);
                
                if (!openNode) {
                    openSet.push({
                        ...neighbor,
                        g: g,
                        h: this.heuristic(neighbor, end),
                        f: g + this.heuristic(neighbor, end),
                        parent: current
                    });
                } else if (g < openNode.g) {
                    openNode.g = g;
                    openNode.f = g + openNode.h;
                    openNode.parent = current;
                }
            }
        }
        
        return null; // No path found
    }
    
    heuristic(a, b) {
        // Euclidean distance
        return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
    }
    
    // ============================================
    // DYNAMIC MOVEMENT
    // ============================================
    
    getMovementDirection(monster, player, obstacles, currentTime) {
        let targetX = player.x;
        let targetY = player.y;
        
        // Apply player prediction if enabled
        if (this.prediction.enabled && player.movementHistory) {
            const predicted = this.predictPlayerPosition(player, null, currentTime);
            targetX = predicted.x;
            targetY = predicted.y;
        }
        
        // Apply hive mind targets if set
        if (monster.targetX !== undefined && monster.targetY !== undefined) {
            targetX = monster.targetX;
            targetY = monster.targetY;
        }
        
        // Try pathfinding first
        const path = this.findPath(monster, { x: targetX, y: targetY }, obstacles);
        
        let moveX, moveY;
        
        if (path && path.length > 1) {
            // Follow path
            const nextPoint = path[1];
            moveX = nextPoint.x - monster.x;
            moveY = nextPoint.y - monster.y;
        } else {
            // Direct movement with obstacle avoidance
            const dx = targetX - monster.x;
            const dy = targetY - monster.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            moveX = dx / dist;
            moveY = dy / dist;
            
            // Simple obstacle avoidance
            for (const obs of obstacles) {
                if (obs.type && obs.type.solid) {
                    const obsDx = monster.x - obs.x;
                    const obsDy = monster.y - obs.y;
                    const obsDist = Math.sqrt(obsDx * obsDx + obsDy * obsDy);
                    const minDist = monster.radius + Math.max(obs.width, obs.height) / 2;
                    
                    if (obsDist < minDist + 30) {
                        const avoidForce = (minDist + 30 - obsDist) / obsDist;
                        moveX += obsDx * avoidForce * 0.5;
                        moveY += obsDy * avoidForce * 0.5;
                    }
                }
            }
            
            // Normalize
            const len = Math.sqrt(moveX * moveX + moveY * moveY);
            if (len > 0) {
                moveX /= len;
                moveY /= len;
            }
        }
        
        // Apply cohesion and separation forces
        if (monster.cohesionForce) {
            moveX += monster.cohesionForce.x;
            moveY += monster.cohesionForce.y;
        }
        if (monster.separationForce) {
            moveX += monster.separationForce.x;
            moveY += monster.separationForce.y;
        }
        
        // Normalize final direction
        const finalLen = Math.sqrt(moveX * moveX + moveY * moveY);
        if (finalLen > 0) {
            moveX /= finalLen;
            moveY /= finalLen;
        }
        
        return { x: moveX, y: moveY };
    }
    
    clearCache() {
        this.pathCache.clear();
    }
}

// ============================================
// ADVANCED WEAPON TARGETING SYSTEM
// ============================================

class AdvancedTargetingSystem {
    constructor() {
        this.attackedMonsters = new Map(); // monster -> timestamp
        this.weaponTargets = new Map(); // weaponId -> monster
        this.targetHistory = new Map(); // monster -> times targeted
        this.scoreCache = new Map(); // monster -> last score
        this.cacheTimeout = 100; // ms
    }
    
    // Main scoring function for weapon target selection
    getTargetScore(monster, player, weapon, allMonsters, currentTime) {
        const dx = monster.x - player.x;
        const dy = monster.y - player.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > weapon.range) return -Infinity;
        
        let score = 0;
        
        // ============================================
        // BASE SCORING
        // ============================================
        
        // Distance score (closer = better)
        const distanceScore = 1000 - distance;
        score += distanceScore * 0.5;
        
        // Angle to facing direction (monsters in front get bonus)
        const angleToMonster = Math.atan2(dy, dx);
        const facingAngle = player.facingAngle || 0;
        let angleDiff = angleToMonster - facingAngle;
        while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
        while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
        const angleScore = Math.max(0, Math.cos(angleDiff)) * 300;
        score += angleScore;
        
        // Health percentage (lower health = higher priority for finishing off)
        const healthPercent = monster.health / monster.maxHealth;
        const healthScore = (1 - healthPercent) * 200;
        score += healthScore;
        
        // ============================================
        // WEAPON-SPECIFIC SCORING
        // ============================================
        
        switch(weapon.id) {
            case 'sniper':
                // Sniper prioritizes high HP enemies
                score += monster.health * 1.5;
                // Bonus for enemies far away (sniper's specialty)
                score += Math.min(distance / 10, 100);
                // Extra bonus for boss enemies
                if (monster.isBoss) score += 500;
                break;
                
            case 'crossbow':
                // Crossbow prioritizes lined-up enemies
                const linedUpScore = this.calculateLineUpScore(monster, allMonsters, player);
                score += linedUpScore * 3;
                // Bonus for enemies in straight lines
                break;
                
            case 'shotgun':
                // Shotgun prioritizes groups
                const nearbyCount = this.countNearbyEnemies(monster, allMonsters, 100);
                score += nearbyCount * 80;
                // Bonus for clusters
                break;
                
            case 'throwing_knives':
                // Throwing knives prioritize low HP for execution
                score += (1 - healthPercent) * 300;
                // Also prioritize fast enemies
                if (monster.monsterType === window.MONSTER_TYPES?.FAST) score += 150;
                if (monster.monsterType === window.MONSTER_TYPES?.DASHER) score += 200;
                break;
                
            case 'boomerang':
                // Boomerang prioritizes groups and enemies at max range
                const maxRangeBonus = Math.abs(distance - weapon.range) < 50 ? 100 : 0;
                score += maxRangeBonus;
                score += this.countNearbyEnemies(monster, allMonsters, 80) * 60;
                break;
                
            case 'laser':
                // Laser prioritizes lined-up enemies (piercing)
                const pierceScore = this.calculateLineUpScore(monster, allMonsters, player) * 4;
                score += pierceScore;
                break;
                
            default:
                // Default melee weapons
                if (weapon.meleeType === 'aoe') {
                    // AOE weapons prioritize groups
                    score += this.countNearbyEnemies(monster, allMonsters, weapon.range) * 100;
                } else if (weapon.meleeType === 'pierce') {
                    // Pierce weapons prioritize lined-up enemies
                    score += this.calculateLineUpScore(monster, allMonsters, player) * 2;
                } else if (weapon.meleeType === 'dual') {
                    // Dual weapons prioritize fast enemies
                    if (monster.monsterType === window.MONSTER_TYPES?.FAST) score += 100;
                    if (monster.monsterType === window.MONSTER_TYPES?.DASHER) score += 150;
                }
                break;
        }
        
        // ============================================
        // ENEMY TYPE PRIORITIES
        // ============================================
        
        // Priority based on monster type
        if (monster.isBoss) {
            score += 1000; // Boss is highest priority
        } else if (monster.monsterType === window.MONSTER_TYPES?.EXPLOSIVE) {
            score += 300; // Explosive enemies are dangerous
        } else if (monster.monsterType === window.MONSTER_TYPES?.GUNNER) {
            score += 250; // Gunners are ranged threats
        } else if (monster.monsterType === window.MONSTER_TYPES?.SPLITTER) {
            score += 200; // Splitters create more enemies
        } else if (monster.monsterType === window.MONSTER_TYPES?.DASHER) {
            score += 150; // Dashers are fast and dangerous
        } else if (monster.monsterType === window.MONSTER_TYPES?.TANK) {
            score += 100; // Tanks are high HP
        } else if (monster.monsterType === window.MONSTER_TYPES?.FAST) {
            score += 80; // Fast enemies are annoying
        }
        
        // ============================================
        // DIVERSITY SCORING (Avoid targeting same enemy)
        // ============================================
        
        // Penalty for recently attacked monsters
        const lastAttacked = this.attackedMonsters.get(monster);
        if (lastAttacked) {
            const timeSinceAttack = currentTime - lastAttacked;
            if (timeSinceAttack < 2000) {
                const recencyPenalty = Math.max(0, 200 - (timeSinceAttack / 10));
                score -= recencyPenalty;
            }
        }
        
        // Penalty for being targeted by other weapons this frame
        let targetCount = 0;
        this.weaponTargets.forEach((targetedMonster, weaponId) => {
            if (targetedMonster === monster && weaponId !== weapon.id) {
                targetCount++;
            }
        });
        score -= targetCount * 150;
        
        // Penalty for being targeted multiple times recently
        const targetHistory = this.targetHistory.get(monster) || 0;
        score -= targetHistory * 50;
        
        // ============================================
        // POSITIONAL ADVANTAGE
        // ============================================
        
        // Bonus for monsters that are blocking others
        const blockingScore = this.calculateBlockingScore(monster, allMonsters, player);
        score += blockingScore * 100;
        
        // Bonus for monsters approaching from behind (threat assessment)
        const behindAngle = Math.abs(angleDiff) > Math.PI / 2;
        if (behindAngle) {
            score += 80; // Enemies behind are dangerous
        }
        
        // ============================================
        // EMERGENCY OVERRIDE
        // ============================================
        
        // Emergency: monster is very close
        if (distance < 80) {
            score += 500;
        }
        
        // Emergency: monster is about to attack (if we have attack animation data)
        if (monster.isAttacking) {
            score += 400;
        }
        
        // Emergency: monster is a splitter that's about to die
        if (monster.isSplitter && healthPercent < 0.3) {
            score += 200; // Kill it before it splits
        }
        
        return score;
    }
    
    calculateLineUpScore(monster, allMonsters, player) {
        // Check how many monsters are in a line behind this target
        const angleToMonster = Math.atan2(monster.y - player.y, monster.x - player.x);
        let count = 0;
        
        for (const other of allMonsters) {
            if (other === monster) continue;
            
            const angleToOther = Math.atan2(other.y - player.y, other.x - player.x);
            const angleDiff = Math.abs(angleToMonster - angleToOther);
            
            if (angleDiff < 0.2) { // Within ~11 degrees
                const distToOther = Math.sqrt(
                    Math.pow(other.x - player.x, 2) + 
                    Math.pow(other.y - player.y, 2)
                );
                const distToMonster = Math.sqrt(
                    Math.pow(monster.x - player.x, 2) + 
                    Math.pow(monster.y - player.y, 2)
                );
                
                if (distToOther > distToMonster) {
                    count++;
                }
            }
        }
        
        return count;
    }
    
    countNearbyEnemies(monster, allMonsters, radius) {
        let count = 0;
        for (const other of allMonsters) {
            if (other === monster) continue;
            const dx = other.x - monster.x;
            const dy = other.y - monster.y;
            if (Math.sqrt(dx * dx + dy * dy) < radius) {
                count++;
            }
        }
        return count;
    }
    
    calculateBlockingScore(monster, allMonsters, player) {
        // Check if this monster is blocking other monsters from reaching player
        let blockingCount = 0;
        const angleToMonster = Math.atan2(monster.y - player.y, monster.x - player.x);
        
        for (const other of allMonsters) {
            if (other === monster) continue;
            
            const angleToOther = Math.atan2(other.y - player.y, other.x - player.x);
            const angleDiff = Math.abs(angleToMonster - angleToOther);
            
            if (angleDiff < 0.3) {
                const distToMonster = Math.sqrt(
                    Math.pow(monster.x - player.x, 2) + 
                    Math.pow(monster.y - player.y, 2)
                );
                const distToOther = Math.sqrt(
                    Math.pow(other.x - player.x, 2) + 
                    Math.pow(other.y - player.y, 2)
                );
                
                if (distToOther > distToMonster) {
                    blockingCount++;
                }
            }
        }
        
        return blockingCount;
    }
    
    selectTargetForWeapon(weapon, monsters, player, currentTime) {
        if (!monsters || monsters.length === 0) return null;
        
        let bestMonster = null;
        let bestScore = -Infinity;
        
        // Clear score cache for old entries
        if (currentTime % 30 === 0) {
            for (const [monster, timestamp] of this.scoreCache.entries()) {
                if (currentTime - timestamp > this.cacheTimeout) {
                    this.scoreCache.delete(monster);
                }
            }
        }
        
        for (const monster of monsters) {
            let score;
            
            // Use cached score if available
            const cached = this.scoreCache.get(monster);
            if (cached && currentTime - cached.timestamp < this.cacheTimeout) {
                score = cached.score;
            } else {
                score = this.getTargetScore(monster, player, weapon, monsters, currentTime);
                this.scoreCache.set(monster, { score, timestamp: currentTime });
            }
            
            if (score > bestScore) {
                bestScore = score;
                bestMonster = monster;
            }
        }
        
        return bestMonster;
    }
    
    markAttacked(monster, currentTime) {
        this.attackedMonsters.set(monster, currentTime);
        
        // Update target history
        const historyCount = (this.targetHistory.get(monster) || 0) + 1;
        this.targetHistory.set(monster, historyCount);
        
        // Clear history after some time
        setTimeout(() => {
            const current = this.targetHistory.get(monster) || 0;
            if (current <= 1) {
                this.targetHistory.delete(monster);
            } else {
                this.targetHistory.set(monster, current - 1);
            }
        }, 5000);
    }
    
    recordTarget(weaponId, monster) {
        this.weaponTargets.set(weaponId, monster);
    }
    
    clearTargets() {
        this.weaponTargets.clear();
    }
    
    reset() {
        this.attackedMonsters.clear();
        this.weaponTargets.clear();
        this.targetHistory.clear();
        this.scoreCache.clear();
    }
}

// ============================================
// MONSTER AI WITH PREDICTION
// ============================================

class EnhancedMonsterAI {
    constructor() {
        this.monsterAI = new MonsterAI();
        this.targetingSystem = new AdvancedTargetingSystem();
        this.lastUpdate = 0;
    }
    
    updateMonsters(monsters, player, obstacles, currentTime) {
        if (monsters.length === 0) return;
        
        // Update hive mind every 0.5 seconds
        this.monsterAI.updateHiveMind(monsters, player, currentTime);
        
        // Update each monster
        for (const monster of monsters) {
            // Skip if stunned or frozen
            if (monster.stunned || monster.frozen) continue;
            
            // Update dasher behavior
            if (monster.isDasher) {
                this.monsterAI.updateDasher(monster, player, currentTime);
                if (monster.isDashing) continue;
            }
            
            // Get movement direction with pathfinding and prediction
            const moveDir = this.monsterAI.getMovementDirection(monster, player, obstacles, currentTime);
            
            // Apply movement
            if (moveDir.x !== 0 || moveDir.y !== 0) {
                monster.x += moveDir.x * monster.speed;
                monster.y += moveDir.y * monster.speed;
            }
            
            // Apply slow/frozen effects
            if (monster.slowed && monster.slowUntil < currentTime) {
                monster.slowed = false;
                monster.speed = monster.originalSpeed;
            }
            
            if (monster.frozen && monster.frozenUntil < currentTime) {
                monster.frozen = false;
                monster.speed = monster.originalSpeed;
            }
            
            // Update attack cooldown
            if (monster.isGunner || monster.isBoss) {
                if (currentTime - monster.lastAttack >= monster.attackCooldown) {
                    monster.attackReady = true;
                }
            }
        }
        
        this.lastUpdate = currentTime;
    }
    
    // Helper method to clear AI cache when obstacles change
    clearPathCache() {
        this.monsterAI.clearCache();
    }
}

// ============================================
// WEAPON MANAGER WITH TARGETING
// ============================================

class WeaponManager {
    constructor() {
        this.targetingSystem = new AdvancedTargetingSystem();
        this.lastWeaponUpdate = 0;
    }
    
    updateWeapons(weapons, player, monsters, currentTime) {
        if (!weapons || weapons.length === 0 || monsters.length === 0) return [];
        
        const attacks = [];
        
        // Clear previous frame's targets
        this.targetingSystem.clearTargets();
        
        for (const weapon of weapons) {
            // Apply attack speed multiplier
            const originalAttackSpeed = weapon.attackSpeed;
            weapon.attackSpeed = originalAttackSpeed * (player.attackSpeedMultiplier || 1);
            const canAttack = weapon.canAttack(currentTime);
            weapon.attackSpeed = originalAttackSpeed;
            
            if (canAttack) {
                // Select best target using scoring system
                const target = this.targetingSystem.selectTargetForWeapon(weapon, monsters, player, currentTime);
                
                if (target) {
                    // Record this weapon's target
                    this.targetingSystem.recordTarget(weapon.id, target);
                    
                    // Perform attack
                    const attack = weapon.attack(player.x, player.y, target.x, target.y);
                    
                    // Handle multi-projectile weapons (shotgun)
                    if (Array.isArray(attack)) {
                        attacks.push(...attack);
                    } else {
                        attacks.push(attack);
                    }
                    
                    // Mark monster as attacked
                    this.targetingSystem.markAttacked(target, currentTime);
                }
            }
        }
        
        return attacks;
    }
    
    reset() {
        this.targetingSystem.reset();
    }
}

// ============================================
// VISUAL EFFECTS FOR HIVE MIND
// ============================================

class HiveMindEffects {
    static drawLeaderIndicator(ctx, monster) {
        if (!monster.isLeader) return;
        
        ctx.save();
        ctx.translate(monster.x, monster.y);
        
        const pulse = Math.sin(Date.now() * 0.005) * 0.5 + 0.5;
        
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#FFD700';
        ctx.strokeStyle = `rgba(255, 215, 0, ${0.5 + pulse * 0.3})`;
        ctx.lineWidth = 3;
        
        ctx.beginPath();
        ctx.arc(0, 0, monster.radius + 8, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(0, 0, monster.radius + 12, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.restore();
    }
    
    static drawFormationLines(ctx, monsters, formation) {
        if (monsters.length < 2) return;
        
        ctx.save();
        ctx.globalAlpha = 0.3;
        ctx.strokeStyle = `rgba(100, 200, 255, 0.3)`;
        ctx.lineWidth = 1;
        
        // Find leader
        const leader = monsters.find(m => m.isLeader);
        if (!leader) return;
        
        // Draw lines from followers to leader
        for (const monster of monsters) {
            if (monster === leader) continue;
            
            ctx.beginPath();
            ctx.moveTo(leader.x, leader.y);
            ctx.lineTo(monster.x, monster.y);
            ctx.stroke();
        }
        
        ctx.restore();
    }
    
    static drawPredictionMarker(ctx, predictedX, predictedY) {
        ctx.save();
        ctx.translate(predictedX, predictedY);
        
        const pulse = Math.sin(Date.now() * 0.008) * 0.5 + 0.5;
        
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#FF00FF';
        ctx.strokeStyle = `rgba(255, 0, 255, ${0.3 + pulse * 0.3})`;
        ctx.lineWidth = 2;
        
        ctx.beginPath();
        ctx.arc(0, 0, 15, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(-10, -10);
        ctx.lineTo(10, 10);
        ctx.moveTo(10, -10);
        ctx.lineTo(-10, 10);
        ctx.stroke();
        
        ctx.restore();
    }
}

// ============================================
// EXPORTS
// ============================================

window.MonsterAI = MonsterAI;
window.AdvancedTargetingSystem = AdvancedTargetingSystem;
window.EnhancedMonsterAI = EnhancedMonsterAI;
window.WeaponManager = WeaponManager;
window.HiveMindEffects = HiveMindEffects;
window.WeaponInstance = WeaponInstance; // Keep existing WeaponInstance class
window.MONSTER_AI = MONSTER_AI;
window.ItemEffects = ItemEffects;
window.BossMechanics = BossMechanics;
window.MeleeAnimations = MeleeAnimations;
window.ProjectileAnimations = ProjectileAnimations;
window.BossMeleeAnimations = BossMeleeAnimations;
