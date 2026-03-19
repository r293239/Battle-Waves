// ============================================
// GAME OBSTACLES - Walls, Barrels, and Pathfinding
// ============================================

// Obstacle types
const OBSTACLE_TYPES = {
    WALL: {
        name: 'Wall',
        color: '#555555',
        solid: true,
        destructible: false,
        health: Infinity
    },
    BARREL: {
        name: 'Barrel',
        color: '#8B4513',
        solid: true,
        destructible: true,
        health: 50,
        explosionRadius: 80,
        explosionDamage: 30
    },
    CRATE: {
        name: 'Crate',
        color: '#D2691E',
        solid: true,
        destructible: true,
        health: 30,
        goldDrop: { min: 5, max: 15 }
    },
    PILLAR: {
        name: 'Pillar',
        color: '#A9A9A9',
        solid: true,
        destructible: false,
        health: Infinity
    },
    SPIKES: {
        name: 'Spikes',
        color: '#C0C0C0',
        solid: false,
        destructible: false,
        damage: 10,
        damageInterval: 1000
    }
};

// Arena obstacles array
let obstacles = [];

// Node grid for pathfinding
let pathfindingGrid = [];
const GRID_SIZE = 20; // Size of each grid cell in pixels

// ============================================
// OBSTACLE GENERATION
// ============================================

function generateObstaclesForWave(waveNumber) {
    obstacles = [];
    
    // Number of obstacles increases with wave
    const numObstacles = Math.min(20, 5 + Math.floor(waveNumber / 2));
    
    for (let i = 0; i < numObstacles; i++) {
        // Determine obstacle type based on wave
        let type;
        const rand = Math.random();
        
        if (waveNumber < 5) {
            // Early waves: mostly crates
            if (rand < 0.7) type = OBSTACLE_TYPES.CRATE;
            else if (rand < 0.9) type = OBSTACLE_TYPES.BARREL;
            else type = OBSTACLE_TYPES.WALL;
        } else if (waveNumber < 10) {
            // Mid waves: more variety
            if (rand < 0.4) type = OBSTACLE_TYPES.CRATE;
            else if (rand < 0.7) type = OBSTACLE_TYPES.BARREL;
            else if (rand < 0.9) type = OBSTACLE_TYPES.WALL;
            else type = OBSTACLE_TYPES.PILLAR;
        } else {
            // Late waves: more walls and pillars
            if (rand < 0.3) type = OBSTACLE_TYPES.CRATE;
            else if (rand < 0.6) type = OBSTACLE_TYPES.BARREL;
            else if (rand < 0.8) type = OBSTACLE_TYPES.WALL;
            else type = OBSTACLE_TYPES.PILLAR;
        }
        
        // Try to place obstacle in valid position
        let placed = false;
        let attempts = 0;
        
        while (!placed && attempts < 50) {
            const x = 100 + Math.random() * (canvas.width - 200);
            const y = 100 + Math.random() * (canvas.height - 200);
            
            // Check distance from player spawn
            const distToPlayer = Math.sqrt(
                Math.pow(x - 400, 2) + Math.pow(y - 300, 2)
            );
            
            if (distToPlayer < 100) {
                attempts++;
                continue;
            }
            
            // Check distance from other obstacles
            let tooClose = false;
            for (let obs of obstacles) {
                const dist = Math.sqrt(
                    Math.pow(x - obs.x, 2) + Math.pow(y - obs.y, 2)
                );
                if (dist < 60) {
                    tooClose = true;
                    break;
                }
            }
            
            if (!tooClose) {
                // Create obstacle
                const size = 30 + Math.random() * 20;
                const obstacle = {
                    x: x,
                    y: y,
                    width: size,
                    height: size,
                    type: type,
                    health: type.health,
                    maxHealth: type.health,
                    active: true
                };
                
                obstacles.push(obstacle);
                placed = true;
            }
            
            attempts++;
        }
    }
    
    // Add some spikes in later waves
    if (waveNumber >= 8) {
        const numSpikes = Math.floor(waveNumber / 4);
        for (let i = 0; i < numSpikes; i++) {
            const x = 50 + Math.random() * (canvas.width - 100);
            const y = 50 + Math.random() * (canvas.height - 100);
            
            obstacles.push({
                x: x,
                y: y,
                width: 40,
                height: 40,
                type: OBSTACLE_TYPES.SPIKES,
                active: true,
                lastDamage: 0
            });
        }
    }
    
    // Rebuild pathfinding grid
    buildPathfindingGrid();
}

// ============================================
// PATHFINDING GRID
// ============================================

function buildPathfindingGrid() {
    const cols = Math.ceil(canvas.width / GRID_SIZE);
    const rows = Math.ceil(canvas.height / GRID_SIZE);
    
    // Initialize grid
    pathfindingGrid = [];
    for (let y = 0; y < rows; y++) {
        pathfindingGrid[y] = [];
        for (let x = 0; x < cols; x++) {
            pathfindingGrid[y][x] = {
                walkable: true,
                cost: 1
            };
        }
    }
    
    // Mark obstacles as unwalkable
    obstacles.forEach(obs => {
        if (obs.type.solid) {
            const startX = Math.floor((obs.x - obs.width/2) / GRID_SIZE);
            const endX = Math.floor((obs.x + obs.width/2) / GRID_SIZE);
            const startY = Math.floor((obs.y - obs.height/2) / GRID_SIZE);
            const endY = Math.floor((obs.y + obs.height/2) / GRID_SIZE);
            
            for (let gy = Math.max(0, startY); gy <= Math.min(rows-1, endY); gy++) {
                for (let gx = Math.max(0, startX); gx <= Math.min(cols-1, endX); gx++) {
                    if (pathfindingGrid[gy] && pathfindingGrid[gy][gx]) {
                        pathfindingGrid[gy][gx].walkable = false;
                    }
                }
            }
        }
    });
}

// A* Pathfinding algorithm
function findPath(startX, startY, targetX, targetY) {
    const startGridX = Math.floor(startX / GRID_SIZE);
    const startGridY = Math.floor(startY / GRID_SIZE);
    const targetGridX = Math.floor(targetX / GRID_SIZE);
    const targetGridY = Math.floor(targetY / GRID_SIZE);
    
    // Check if target is walkable
    if (!isGridWalkable(targetGridX, targetGridY)) {
        return null;
    }
    
    // Priority queue for open nodes
    const openSet = [];
    const closedSet = new Set();
    
    const startNode = {
        x: startGridX,
        y: startGridY,
        g: 0,
        h: Math.abs(startGridX - targetGridX) + Math.abs(startGridY - targetGridY),
        parent: null
    };
    startNode.f = startNode.g + startNode.h;
    
    openSet.push(startNode);
    
    while (openSet.length > 0) {
        // Get node with lowest f score
        let current = openSet.reduce((min, node) => 
            node.f < min.f ? node : min
        );
        
        // Check if reached target
        if (current.x === targetGridX && current.y === targetGridY) {
            // Reconstruct path
            const path = [];
            let node = current;
            while (node) {
                path.unshift({
                    x: node.x * GRID_SIZE + GRID_SIZE/2,
                    y: node.y * GRID_SIZE + GRID_SIZE/2
                });
                node = node.parent;
            }
            return path;
        }
        
        // Move current from open to closed
        const currentIndex = openSet.indexOf(current);
        openSet.splice(currentIndex, 1);
        closedSet.add(`${current.x},${current.y}`);
        
        // Check neighbors
        const neighbors = [
            { x: current.x + 1, y: current.y, cost: 1 },
            { x: current.x - 1, y: current.y, cost: 1 },
            { x: current.x, y: current.y + 1, cost: 1 },
            { x: current.x, y: current.y - 1, cost: 1 },
            // Diagonal movement (optional, comment out to disable)
            { x: current.x + 1, y: current.y + 1, cost: 1.4 },
            { x: current.x - 1, y: current.y + 1, cost: 1.4 },
            { x: current.x + 1, y: current.y - 1, cost: 1.4 },
            { x: current.x - 1, y: current.y - 1, cost: 1.4 }
        ];
        
        for (let n of neighbors) {
            // Skip if out of bounds
            if (n.x < 0 || n.x >= pathfindingGrid[0].length || 
                n.y < 0 || n.y >= pathfindingGrid.length) {
                continue;
            }
            
            // Skip if in closed set
            if (closedSet.has(`${n.x},${n.y}`)) continue;
            
            // Skip if not walkable
            if (!pathfindingGrid[n.y][n.x].walkable) continue;
            
            // Calculate g score
            const g = current.g + n.cost;
            
            // Check if in open set
            const openNode = openSet.find(node => node.x === n.x && node.y === n.y);
            
            if (!openNode) {
                // Add to open set
                const newNode = {
                    x: n.x,
                    y: n.y,
                    g: g,
                    h: Math.abs(n.x - targetGridX) + Math.abs(n.y - targetGridY),
                    parent: current
                };
                newNode.f = newNode.g + newNode.h;
                openSet.push(newNode);
            } else if (g < openNode.g) {
                // Update existing node
                openNode.g = g;
                openNode.f = openNode.g + openNode.h;
                openNode.parent = current;
            }
        }
    }
    
    // No path found
    return null;
}

function isGridWalkable(gridX, gridY) {
    if (gridX < 0 || gridX >= pathfindingGrid[0].length ||
        gridY < 0 || gridY >= pathfindingGrid.length) {
        return false;
    }
    return pathfindingGrid[gridY][gridX].walkable;
}

// Enhanced monster movement with pathfinding
function moveMonsterWithPathfinding(monster, targetX, targetY) {
    const path = findPath(monster.x, monster.y, targetX, targetY);
    
    if (path && path.length > 1) {
        // Move towards next waypoint
        const nextPoint = path[1];
        const dx = nextPoint.x - monster.x;
        const dy = nextPoint.y - monster.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist > 0) {
            monster.x += (dx / dist) * monster.speed;
            monster.y += (dy / dist) * monster.speed;
        }
        return true;
    }
    
    return false; // No path found
}

// ============================================
// OBSTACLE INTERACTIONS
// ============================================

function updateObstacles(currentTime) {
    for (let i = obstacles.length - 1; i >= 0; i--) {
        const obs = obstacles[i];
        
        // Handle destructible obstacles
        if (obs.type.destructible && obs.health <= 0) {
            // Drop gold if applicable
            if (obs.type.goldDrop) {
                const goldAmount = Math.floor(
                    Math.random() * (obs.type.goldDrop.max - obs.type.goldDrop.min + 1) + 
                    obs.type.goldDrop.min
                );
                gold += goldAmount;
                createGoldPopup(obs.x, obs.y, goldAmount);
            }
            
            // Explode if barrel
            if (obs.type === OBSTACLE_TYPES.BARREL) {
                explodeBarrel(obs);
            }
            
            // Remove obstacle
            obstacles.splice(i, 1);
            addVisualEffect({
                type: 'explosion',
                x: obs.x,
                y: obs.y,
                radius: 30,
                color: '#FFA500',
                startTime: currentTime,
                duration: 300
            });
            
            // Rebuild pathfinding grid
            buildPathfindingGrid();
            continue;
        }
        
        // Handle spike damage
        if (obs.type === OBSTACLE_TYPES.SPIKES) {
            // Damage monsters on spikes
            monsters.forEach(monster => {
                const dx = monster.x - obs.x;
                const dy = monster.y - obs.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < obs.width/2 + monster.radius) {
                    if (!obs.lastDamage || currentTime - obs.lastDamage > obs.type.damageInterval) {
                        monster.health -= obs.type.damage;
                        createDamageIndicator(monster.x, monster.y, obs.type.damage, false);
                        obs.lastDamage = currentTime;
                        
                        if (monster.health <= 0) {
                            handleMonsterDeath(monster, monsters.indexOf(monster));
                        }
                    }
                }
            });
        }
    }
}

function explodeBarrel(barrel) {
    const explosionRadius = barrel.type.explosionRadius;
    const explosionDamage = barrel.type.explosionDamage;
    
    // Damage monsters
    monsters.forEach(monster => {
        const dx = monster.x - barrel.x;
        const dy = monster.y - barrel.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < explosionRadius + monster.radius) {
            monster.health -= explosionDamage;
            createDamageIndicator(monster.x, monster.y, explosionDamage, true);
            
            if (monster.health <= 0) {
                handleMonsterDeath(monster, monsters.indexOf(monster));
            }
        }
    });
    
    // Damage player if too close
    const dx = player.x - barrel.x;
    const dy = player.y - barrel.y;
    const distToPlayer = Math.sqrt(dx * dx + dy * dy);
    
    if (distToPlayer < explosionRadius + player.radius) {
        player.health -= explosionDamage;
        createDamageIndicator(player.x, player.y, explosionDamage, true);
        
        if (player.health <= 0) {
            gameOver();
        }
    }
    
    // Chain reaction - damage nearby obstacles
    obstacles.forEach(obs => {
        if (obs === barrel) return;
        
        const dx = obs.x - barrel.x;
        const dy = obs.y - barrel.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < explosionRadius + Math.max(obs.width, obs.height)/2) {
            if (obs.type.destructible) {
                obs.health -= explosionDamage;
            }
        }
    });
    
    addVisualEffect({
        type: 'explosion',
        x: barrel.x,
        y: barrel.y,
        radius: explosionRadius,
        color: '#FF4500',
        startTime: Date.now(),
        duration: 400
    });
}

// ============================================
// OBSTACLE DRAWING
// ============================================

function drawObstacles() {
    obstacles.forEach(obs => {
        ctx.save();
        ctx.translate(obs.x, obs.y);
        
        // Shadow
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetY = 3;
        
        // Draw based on type
        if (obs.type === OBSTACLE_TYPES.WALL) {
            // Brick wall pattern
            ctx.fillStyle = '#555555';
            ctx.fillRect(-obs.width/2, -obs.height/2, obs.width, obs.height);
            
            // Brick lines
            ctx.strokeStyle = '#333333';
            ctx.lineWidth = 2;
            ctx.shadowBlur = 0;
            
            const brickHeight = 15;
            for (let y = -obs.height/2 + brickHeight/2; y < obs.height/2; y += brickHeight) {
                ctx.beginPath();
                ctx.moveTo(-obs.width/2, y);
                ctx.lineTo(obs.width/2, y);
                ctx.stroke();
            }
            
            const brickWidth = 30;
            for (let x = -obs.width/2 + brickWidth/2; x < obs.width/2; x += brickWidth) {
                ctx.beginPath();
                ctx.moveTo(x, -obs.height/2);
                ctx.lineTo(x, obs.height/2);
                ctx.stroke();
            }
            
        } else if (obs.type === OBSTACLE_TYPES.BARREL) {
            // Barrel
            ctx.fillStyle = '#8B4513';
            ctx.beginPath();
            ctx.ellipse(0, 0, obs.width/2, obs.height/2, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // Metal bands
            ctx.strokeStyle = '#CD7F32';
            ctx.lineWidth = 4;
            ctx.shadowBlur = 5;
            
            for (let i = -1; i <= 1; i++) {
                ctx.beginPath();
                ctx.ellipse(0, i * obs.height/3, obs.width/2 + 2, 5, 0, 0, Math.PI * 2);
                ctx.stroke();
            }
            
            // Health bar for damaged barrels
            if (obs.health < obs.maxHealth) {
                ctx.shadowBlur = 0;
                ctx.fillStyle = '#000000';
                ctx.fillRect(-20, -obs.height/2 - 10, 40, 5);
                
                const healthPercent = obs.health / obs.maxHealth;
                ctx.fillStyle = healthPercent > 0.5 ? '#00FF00' : '#FF0000';
                ctx.fillRect(-20, -obs.height/2 - 10, 40 * healthPercent, 5);
            }
            
        } else if (obs.type === OBSTACLE_TYPES.CRATE) {
            // Crate
            ctx.fillStyle = '#D2691E';
            ctx.fillRect(-obs.width/2, -obs.height/2, obs.width, obs.height);
            
            // Wood grain
            ctx.strokeStyle = '#8B4513';
            ctx.lineWidth = 2;
            ctx.shadowBlur = 0;
            
            for (let i = -1; i <= 1; i++) {
                ctx.beginPath();
                ctx.moveTo(-obs.width/2, i * obs.height/4);
                ctx.lineTo(obs.width/2, i * obs.height/4);
                ctx.stroke();
            }
            
            for (let i = -1; i <= 1; i++) {
                ctx.beginPath();
                ctx.moveTo(i * obs.width/4, -obs.height/2);
                ctx.lineTo(i * obs.width/4, obs.height/2);
                ctx.stroke();
            }
            
            // Health bar
            if (obs.health < obs.maxHealth) {
                ctx.shadowBlur = 0;
                ctx.fillStyle = '#000000';
                ctx.fillRect(-20, -obs.height/2 - 10, 40, 5);
                
                const healthPercent = obs.health / obs.maxHealth;
                ctx.fillStyle = healthPercent > 0.5 ? '#00FF00' : '#FF0000';
                ctx.fillRect(-20, -obs.height/2 - 10, 40 * healthPercent, 5);
            }
            
        } else if (obs.type === OBSTACLE_TYPES.PILLAR) {
            // Pillar
            ctx.fillStyle = '#A9A9A9';
            ctx.beginPath();
            ctx.ellipse(0, 0, obs.width/2, obs.height/2, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // Top and bottom caps
            ctx.fillStyle = '#808080';
            ctx.beginPath();
            ctx.ellipse(0, -obs.height/2 + 5, obs.width/2 - 5, 5, 0, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.beginPath();
            ctx.ellipse(0, obs.height/2 - 5, obs.width/2 - 5, 5, 0, 0, Math.PI * 2);
            ctx.fill();
            
        } else if (obs.type === OBSTACLE_TYPES.SPIKES) {
            // Spikes
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#FF0000';
            
            const spikeCount = 5;
            const spikeWidth = obs.width / spikeCount;
            
            for (let i = 0; i < spikeCount; i++) {
                const spikeX = -obs.width/2 + i * spikeWidth + spikeWidth/2;
                
                ctx.fillStyle = '#C0C0C0';
                ctx.beginPath();
                ctx.moveTo(spikeX - spikeWidth/2, -obs.height/2);
                ctx.lineTo(spikeX, obs.height/2);
                ctx.lineTo(spikeX + spikeWidth/2, -obs.height/2);
                ctx.closePath();
                ctx.fill();
            }
            
            // Pulsing danger effect
            const pulse = Math.sin(Date.now() * 0.005) * 0.2 + 0.8;
            ctx.strokeStyle = `rgba(255, 0, 0, ${pulse * 0.5})`;
            ctx.lineWidth = 2;
            ctx.shadowBlur = 20;
            ctx.shadowColor = '#FF0000';
            ctx.beginPath();
            ctx.rect(-obs.width/2 - 2, -obs.height/2 - 2, obs.width + 4, obs.height + 4);
            ctx.stroke();
        }
        
        ctx.restore();
    });
}

// ============================================
// PROJECTILE COLLISION WITH OBSTACLES
// ============================================

function checkProjectileObstacleCollision(projectile) {
    for (let obs of obstacles) {
        if (!obs.type.solid) continue;
        
        const dx = projectile.x - obs.x;
        const dy = projectile.y - obs.y;
        const halfWidth = obs.width/2;
        const halfHeight = obs.height/2;
        
        // Simple box collision
        if (Math.abs(dx) < halfWidth && Math.abs(dy) < halfHeight) {
            // Obstacle hit
            if (obs.type.destructible) {
                obs.health -= projectile.damage;
                createDamageIndicator(obs.x, obs.y, projectile.damage, false);
            }
            
            // Create hit effect
            addVisualEffect({
                type: 'hit',
                x: projectile.x,
                y: projectile.y,
                radius: 10,
                color: '#FFFFFF',
                startTime: Date.now(),
                duration: 100
            });
            
            return true; // Projectile destroyed
        }
    }
    return false;
}

// ============================================
// EXPORTS
// ============================================

window.OBSTACLE_TYPES = OBSTACLE_TYPES;
window.obstacles = obstacles;
window.generateObstaclesForWave = generateObstaclesForWave;
window.buildPathfindingGrid = buildPathfindingGrid;
window.findPath = findPath;
window.moveMonsterWithPathfinding = moveMonsterWithPathfinding;
window.updateObstacles = updateObstacles;
window.drawObstacles = drawObstacles;
window.checkProjectileObstacleCollision = checkProjectileObstacleCollision;
