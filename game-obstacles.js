// ============================================
// TEXTURE CONFIGURATION SYSTEM
// ============================================

// Texture presets for different ground types
const TEXTURE_PRESETS = {
    dirt: {
        name: "Dirt",
        baseColor: "#8B5A2B",
        pattern: "dots",
        patternColor: "#6B3E1A",
        patternSize: 4,
        patternSpacing: 16,
        secondaryPattern: "lines",
        secondaryColor: "#A56B2F",
        animation: {
            type: "none",
            speed: 0
        }
    },
    stone: {
        name: "Stone",
        baseColor: "#6B6E6F",
        pattern: "grid",
        patternColor: "#4A4D4E",
        patternSize: 2,
        patternSpacing: 20,
        secondaryPattern: "dots",
        secondaryColor: "#8E8F90",
        animation: {
            type: "none",
            speed: 0
        }
    },
    lava: {
        name: "Lava",
        baseColor: "#FF4500",
        pattern: "gradient",
        patternColor: "#FF8C00",
        patternSize: 8,
        patternSpacing: 0,
        secondaryPattern: "pulse",
        secondaryColor: "#FF0000",
        animation: {
            type: "pulse",
            speed: 0.5,
            intensity: 0.3
        }
    },
    gold: {
        name: "Gold",
        baseColor: "#FFD700",
        pattern: "sparkle",
        patternColor: "#FFA500",
        patternSize: 3,
        patternSpacing: 12,
        secondaryPattern: "shimmer",
        secondaryColor: "#FFFF00",
        animation: {
            type: "sparkle",
            speed: 0.8,
            intensity: 0.4
        }
    },
    marble: {
        name: "Marble",
        baseColor: "#E8E9EA",
        pattern: "veins",
        patternColor: "#B0B1B3",
        patternSize: 5,
        patternSpacing: 40,
        secondaryPattern: "specks",
        secondaryColor: "#C0C1C2",
        animation: {
            type: "none",
            speed: 0
        }
    },
    grass: {
        name: "Grass",
        baseColor: "#4A784A",
        pattern: "blades",
        patternColor: "#2C5E2C",
        patternSize: 3,
        patternSpacing: 8,
        secondaryPattern: "flowers",
        secondaryColor: "#FFD700",
        animation: {
            type: "sway",
            speed: 0.3,
            intensity: 0.2
        }
    },
    blood: {
        name: "Blood",
        baseColor: "#4A0A0A",
        pattern: "splatter",
        patternColor: "#8B0000",
        patternSize: 6,
        patternSpacing: 24,
        secondaryPattern: "drip",
        secondaryColor: "#B22222",
        animation: {
            type: "pulse",
            speed: 0.2,
            intensity: 0.2
        }
    },
    ice: {
        name: "Ice",
        baseColor: "#A0E0FF",
        pattern: "crystal",
        patternColor: "#FFFFFF",
        patternSize: 4,
        patternSpacing: 18,
        secondaryPattern: "glow",
        secondaryColor: "#80C0FF",
        animation: {
            type: "glow",
            speed: 0.6,
            intensity: 0.3
        }
    }
};

// Obstacle texture variations
const OBSTACLE_TEXTURES = {
    brick: {
        patterns: [
            { name: "standard", color: "#444444", width: 2, offset: 0 },
            { name: "weathered", color: "#666666", width: 1, offset: 5 }
        ],
        highlight: "#777777",
        shadow: "#333333",
        effects: {
            damaged: { color: "#AA8866", intensity: 0.5 },
            glowing: { enabled: false }
        }
    },
    barrel: {
        patterns: [
            { name: "bands", color: "#CD7F32", width: 3, offset: 0 },
            { name: "woodgrain", color: "#A0522D", width: 1, offset: 2 }
        ],
        highlight: "#B86F2C",
        shadow: "#5D2E0E",
        effects: {
            damaged: { color: "#FF6600", intensity: 0.7 },
            glowing: { enabled: true, color: "#FF4400", intensity: 0.3 }
        }
    },
    crate: {
        patterns: [
            { name: "planks", color: "#A0522D", width: 2, offset: 0 },
            { name: "nails", color: "#CD7F32", width: 1, offset: 0 }
        ],
        highlight: "#C8792E",
        shadow: "#6B2E0E",
        effects: {
            damaged: { color: "#8B4513", intensity: 0.4 },
            glowing: { enabled: false }
        }
    },
    pillar: {
        patterns: [
            { name: "cracks", color: "#808080", width: 2, offset: 0 },
            { name: "carvings", color: "#909090", width: 1, offset: 3 }
        ],
        highlight: "#B0B0B0",
        shadow: "#707070",
        effects: {
            damaged: { color: "#888888", intensity: 0.3 },
            glowing: { enabled: true, color: "#88AAFF", intensity: 0.2 }
        }
    },
    spikes: {
        patterns: [
            { name: "blood", color: "#8B0000", width: 2, offset: 0 },
            { name: "rust", color: "#CD5C5C", width: 1, offset: 1 }
        ],
        highlight: "#E0E0E0",
        shadow: "#808080",
        effects: {
            damaged: { enabled: false },
            glowing: { enabled: true, color: "#FF0000", intensity: 0.4, pulseSpeed: 2 }
        }
    }
};

// ============================================
// ENHANCED MAP CONFIGURATION
// ============================================

const MAP_PRESETS = {
    ARENA: {
        id: "ARENA",
        name: "Arena",
        description: "Standard arena with scattered obstacles",
        backgroundColor: "#2C3E2F",
        groundTexture: "dirt",
        ambientLight: { intensity: 0.7, color: "#FFFFFF" },
        spawnArea: { x: 400, y: 300, radius: 100 },
        waveGenerationRules: {
            baseObstacles: 5,
            incrementPerWave: 0.5,
            maxObstacles: 20,
            typeDistribution: {
                earlyWaves: { CRATE: 0.7, BARREL: 0.2, WALL: 0.1, PILLAR: 0, SPIKES: 0 },
                midWaves: { CRATE: 0.4, BARREL: 0.3, WALL: 0.2, PILLAR: 0.1, SPIKES: 0 },
                lateWaves: { CRATE: 0.3, BARREL: 0.2, WALL: 0.3, PILLAR: 0.2, SPIKES: 0 }
            },
            spikeThreshold: 8,
            spikesPerWave: 0.25
        },
        placementRules: {
            minDistanceFromSpawn: 100,
            minDistanceBetweenObstacles: 60,
            maxPlacementAttempts: 50,
            avoidCenterRadius: 0,
            avoidCorners: false,
            borderMargin: 50
        },
        modifiers: {
            goldMultiplier: 1.0,
            monsterSpeedMultiplier: 1.0,
            playerDamageMultiplier: 1.0
        },
        specialEffects: {
            fog: { enabled: false, density: 0 },
            weather: { type: "none", intensity: 0 }
        }
    },
    
    MAZE: {
        id: "MAZE",
        name: "Maze",
        description: "Navigate through winding corridors",
        backgroundColor: "#2C3E2F",
        groundTexture: "stone",
        ambientLight: { intensity: 0.6, color: "#AAAAAA" },
        spawnArea: { x: 400, y: 300, radius: 50 },
        waveGenerationRules: {
            baseObstacles: 15,
            incrementPerWave: 0.2,
            maxObstacles: 40,
            typeDistribution: {
                earlyWaves: { CRATE: 0.2, BARREL: 0.1, WALL: 0.7, PILLAR: 0, SPIKES: 0 },
                midWaves: { CRATE: 0.15, BARREL: 0.15, WALL: 0.65, PILLAR: 0.05, SPIKES: 0 },
                lateWaves: { CRATE: 0.1, BARREL: 0.2, WALL: 0.6, PILLAR: 0.1, SPIKES: 0 }
            },
            spikeThreshold: 6,
            spikesPerWave: 0.15
        },
        placementRules: {
            minDistanceFromSpawn: 80,
            minDistanceBetweenObstacles: 30,
            maxPlacementAttempts: 100,
            avoidCenterRadius: 0,
            avoidCorners: true,
            borderMargin: 30
        },
        modifiers: {
            goldMultiplier: 0.8,
            monsterSpeedMultiplier: 0.9,
            playerDamageMultiplier: 1.0
        },
        specialEffects: {
            fog: { enabled: true, density: 0.3, color: "#6688AA" },
            weather: { type: "mist", intensity: 0.4 }
        }
    },
    
    DEATH_PIT: {
        id: "DEATH_PIT",
        name: "Death Pit",
        description: "Careful where you step!",
        backgroundColor: "#2C1E2F",
        groundTexture: "lava",
        ambientLight: { intensity: 0.8, color: "#FF8844" },
        spawnArea: { x: 400, y: 300, radius: 150 },
        waveGenerationRules: {
            baseObstacles: 8,
            incrementPerWave: 0.3,
            maxObstacles: 25,
            typeDistribution: {
                earlyWaves: { CRATE: 0.3, BARREL: 0.3, WALL: 0.1, PILLAR: 0, SPIKES: 0.3 },
                midWaves: { CRATE: 0.2, BARREL: 0.3, WALL: 0.1, PILLAR: 0.1, SPIKES: 0.3 },
                lateWaves: { CRATE: 0.1, BARREL: 0.3, WALL: 0.1, PILLAR: 0.2, SPIKES: 0.3 }
            },
            spikeThreshold: 3,
            spikesPerWave: 0.5
        },
        placementRules: {
            minDistanceFromSpawn: 120,
            minDistanceBetweenObstacles: 50,
            maxPlacementAttempts: 60,
            avoidCenterRadius: 0,
            avoidCorners: false,
            borderMargin: 60
        },
        modifiers: {
            goldMultiplier: 1.2,
            monsterSpeedMultiplier: 1.1,
            playerDamageMultiplier: 1.0
        },
        specialEffects: {
            fog: { enabled: true, density: 0.2, color: "#FF4422" },
            weather: { type: "embers", intensity: 0.6 }
        }
    },
    
    TREASURE_ROOM: {
        id: "TREASURE_ROOM",
        name: "Treasure Room",
        description: "Break crates for extra gold!",
        backgroundColor: "#3C2E1F",
        groundTexture: "gold",
        ambientLight: { intensity: 0.9, color: "#FFDD88" },
        spawnArea: { x: 400, y: 300, radius: 80 },
        waveGenerationRules: {
            baseObstacles: 12,
            incrementPerWave: 0.4,
            maxObstacles: 30,
            typeDistribution: {
                earlyWaves: { CRATE: 0.9, BARREL: 0.05, WALL: 0.05, PILLAR: 0, SPIKES: 0 },
                midWaves: { CRATE: 0.8, BARREL: 0.1, WALL: 0.1, PILLAR: 0, SPIKES: 0 },
                lateWaves: { CRATE: 0.7, BARREL: 0.15, WALL: 0.15, PILLAR: 0, SPIKES: 0 }
            },
            spikeThreshold: 99,
            spikesPerWave: 0
        },
        placementRules: {
            minDistanceFromSpawn: 90,
            minDistanceBetweenObstacles: 40,
            maxPlacementAttempts: 70,
            avoidCenterRadius: 0,
            avoidCorners: false,
            borderMargin: 40
        },
        modifiers: {
            goldMultiplier: 2.0,
            monsterSpeedMultiplier: 1.2,
            playerDamageMultiplier: 1.0
        },
        specialEffects: {
            fog: { enabled: false, density: 0 },
            weather: { type: "sparkles", intensity: 0.5 }
        }
    },
    
    PILLAR_SANCTUARY: {
        id: "PILLAR_SANCTUARY",
        name: "Pillar Sanctuary",
        description: "Use pillars for cover!",
        backgroundColor: "#2F3E4F",
        groundTexture: "marble",
        ambientLight: { intensity: 0.7, color: "#CCDDFF" },
        spawnArea: { x: 400, y: 300, radius: 120 },
        waveGenerationRules: {
            baseObstacles: 10,
            incrementPerWave: 0.35,
            maxObstacles: 28,
            typeDistribution: {
                earlyWaves: { CRATE: 0.2, BARREL: 0.1, WALL: 0.1, PILLAR: 0.6, SPIKES: 0 },
                midWaves: { CRATE: 0.15, BARREL: 0.15, WALL: 0.15, PILLAR: 0.55, SPIKES: 0 },
                lateWaves: { CRATE: 0.1, BARREL: 0.2, WALL: 0.2, PILLAR: 0.5, SPIKES: 0 }
            },
            spikeThreshold: 10,
            spikesPerWave: 0.1
        },
        placementRules: {
            minDistanceFromSpawn: 100,
            minDistanceBetweenObstacles: 70,
            maxPlacementAttempts: 55,
            avoidCenterRadius: 0,
            avoidCorners: false,
            borderMargin: 50
        },
        modifiers: {
            goldMultiplier: 1.0,
            monsterSpeedMultiplier: 0.8,
            playerDamageMultiplier: 1.1
        },
        specialEffects: {
            fog: { enabled: true, density: 0.15, color: "#AACCFF" },
            weather: { type: "light", intensity: 0.3 }
        }
    },
    
    FOREST: {
        id: "FOREST",
        name: "Enchanted Forest",
        description: "Mystical forest with moving shadows",
        backgroundColor: "#1A3A1A",
        groundTexture: "grass",
        ambientLight: { intensity: 0.6, color: "#88AA66" },
        spawnArea: { x: 400, y: 300, radius: 110 },
        waveGenerationRules: {
            baseObstacles: 7,
            incrementPerWave: 0.45,
            maxObstacles: 24,
            typeDistribution: {
                earlyWaves: { CRATE: 0.5, BARREL: 0.1, WALL: 0.3, PILLAR: 0.1, SPIKES: 0 },
                midWaves: { CRATE: 0.4, BARREL: 0.2, WALL: 0.3, PILLAR: 0.1, SPIKES: 0 },
                lateWaves: { CRATE: 0.3, BARREL: 0.2, WALL: 0.4, PILLAR: 0.1, SPIKES: 0 }
            },
            spikeThreshold: 7,
            spikesPerWave: 0.2
        },
        placementRules: {
            minDistanceFromSpawn: 90,
            minDistanceBetweenObstacles: 55,
            maxPlacementAttempts: 65,
            avoidCenterRadius: 0,
            avoidCorners: false,
            borderMargin: 45
        },
        modifiers: {
            goldMultiplier: 1.1,
            monsterSpeedMultiplier: 1.0,
            playerDamageMultiplier: 1.0
        },
        specialEffects: {
            fog: { enabled: true, density: 0.25, color: "#88AA88" },
            weather: { type: "leaves", intensity: 0.4 }
        }
    },
    
    ICE_CAVERN: {
        id: "ICE_CAVERN",
        name: "Ice Cavern",
        description: "Slippery ice and frozen obstacles",
        backgroundColor: "#A0D0FF",
        groundTexture: "ice",
        ambientLight: { intensity: 0.8, color: "#CCFFFF" },
        spawnArea: { x: 400, y: 300, radius: 90 },
        waveGenerationRules: {
            baseObstacles: 6,
            incrementPerWave: 0.4,
            maxObstacles: 22,
            typeDistribution: {
                earlyWaves: { CRATE: 0.4, BARREL: 0.1, WALL: 0.4, PILLAR: 0.1, SPIKES: 0 },
                midWaves: { CRATE: 0.3, BARREL: 0.2, WALL: 0.4, PILLAR: 0.1, SPIKES: 0 },
                lateWaves: { CRATE: 0.2, BARREL: 0.2, WALL: 0.5, PILLAR: 0.1, SPIKES: 0 }
            },
            spikeThreshold: 5,
            spikesPerWave: 0.3
        },
        placementRules: {
            minDistanceFromSpawn: 85,
            minDistanceBetweenObstacles: 50,
            maxPlacementAttempts: 55,
            avoidCenterRadius: 0,
            avoidCorners: true,
            borderMargin: 40
        },
        modifiers: {
            goldMultiplier: 0.9,
            monsterSpeedMultiplier: 0.7,
            playerDamageMultiplier: 1.2,
            playerSpeedMultiplier: 0.8 // Slippery ice effect
        },
        specialEffects: {
            fog: { enabled: true, density: 0.2, color: "#BBFFFF" },
            weather: { type: "snow", intensity: 0.5 }
        }
    }
};

// ============================================
// TEXTURE RENDERER
// ============================================

function drawGroundTexture(ctx, x, y, width, height, textureName, time = 0) {
    const texture = TEXTURE_PRESETS[textureName] || TEXTURE_PRESETS.dirt;
    
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.clip();
    
    // Draw base color
    ctx.fillStyle = texture.baseColor;
    ctx.fillRect(x, y, width, height);
    
    // Draw patterns based on texture type
    switch(texture.pattern) {
        case 'dots':
            drawDotPattern(ctx, x, y, width, height, texture);
            break;
        case 'grid':
            drawGridPattern(ctx, x, y, width, height, texture);
            break;
        case 'gradient':
            drawGradientPattern(ctx, x, y, width, height, texture);
            break;
        case 'sparkle':
            drawSparklePattern(ctx, x, y, width, height, texture, time);
            break;
        case 'veins':
            drawVeinPattern(ctx, x, y, width, height, texture);
            break;
        case 'blades':
            drawBladePattern(ctx, x, y, width, height, texture, time);
            break;
        case 'splatter':
            drawSplatterPattern(ctx, x, y, width, height, texture);
            break;
        case 'crystal':
            drawCrystalPattern(ctx, x, y, width, height, texture, time);
            break;
    }
    
    // Draw secondary pattern if exists
    if (texture.secondaryPattern) {
        drawSecondaryPattern(ctx, x, y, width, height, texture, time);
    }
    
    // Apply animation effects
    if (texture.animation.type !== 'none') {
        applyTextureAnimation(ctx, x, y, width, height, texture, time);
    }
    
    ctx.restore();
}

function drawDotPattern(ctx, x, y, width, height, texture) {
    ctx.fillStyle = texture.patternColor;
    for (let i = x + texture.patternSpacing/2; i < x + width; i += texture.patternSpacing) {
        for (let j = y + texture.patternSpacing/2; j < y + height; j += texture.patternSpacing) {
            ctx.beginPath();
            ctx.arc(i, j, texture.patternSize, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

function drawGridPattern(ctx, x, y, width, height, texture) {
    ctx.strokeStyle = texture.patternColor;
    ctx.lineWidth = texture.patternSize;
    
    for (let i = x; i < x + width; i += texture.patternSpacing) {
        ctx.beginPath();
        ctx.moveTo(i, y);
        ctx.lineTo(i, y + height);
        ctx.stroke();
    }
    
    for (let j = y; j < y + height; j += texture.patternSpacing) {
        ctx.beginPath();
        ctx.moveTo(x, j);
        ctx.lineTo(x + width, j);
        ctx.stroke();
    }
}

function drawGradientPattern(ctx, x, y, width, height, texture) {
    const gradient = ctx.createLinearGradient(x, y, x + width, y + height);
    gradient.addColorStop(0, texture.baseColor);
    gradient.addColorStop(0.5, texture.patternColor);
    gradient.addColorStop(1, texture.baseColor);
    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, width, height);
}

function drawSparklePattern(ctx, x, y, width, height, texture, time) {
    const sparkleCount = 50;
    for (let i = 0; i < sparkleCount; i++) {
        const sparkleX = x + Math.random() * width;
        const sparkleY = y + Math.random() * height;
        const sparkleSize = texture.patternSize * (0.5 + Math.sin(time * 5 + i) * 0.5);
        
        ctx.fillStyle = texture.patternColor;
        ctx.beginPath();
        ctx.arc(sparkleX, sparkleY, sparkleSize, 0, Math.PI * 2);
        ctx.fill();
    }
}

function drawVeinPattern(ctx, x, y, width, height, texture) {
    ctx.strokeStyle = texture.patternColor;
    ctx.lineWidth = texture.patternSize;
    
    for (let i = 0; i < 15; i++) {
        ctx.beginPath();
        const startX = x + Math.random() * width;
        const startY = y + Math.random() * height;
        ctx.moveTo(startX, startY);
        
        let currentX = startX;
        let currentY = startY;
        
        for (let j = 0; j < 5; j++) {
            currentX += (Math.random() - 0.5) * texture.patternSpacing;
            currentY += (Math.random() - 0.5) * texture.patternSpacing;
            ctx.lineTo(currentX, currentY);
        }
        ctx.stroke();
    }
}

function drawBladePattern(ctx, x, y, width, height, texture, time) {
    ctx.fillStyle = texture.patternColor;
    const bladeCount = 30;
    
    for (let i = 0; i < bladeCount; i++) {
        const bladeX = x + Math.random() * width;
        const bladeY = y + Math.random() * height;
        const sway = Math.sin(time * 2 + bladeX) * texture.animation.intensity * 5;
        
        ctx.save();
        ctx.translate(bladeX, bladeY);
        ctx.rotate(sway);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-texture.patternSize/2, -texture.patternSpacing);
        ctx.lineTo(0, -texture.patternSpacing * 1.5);
        ctx.lineTo(texture.patternSize/2, -texture.patternSpacing);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }
}

function drawSplatterPattern(ctx, x, y, width, height, texture) {
    ctx.fillStyle = texture.patternColor;
    const splatterCount = 20;
    
    for (let i = 0; i < splatterCount; i++) {
        const splatterX = x + Math.random() * width;
        const splatterY = y + Math.random() * height;
        
        ctx.beginPath();
        ctx.ellipse(splatterX, splatterY, 
            texture.patternSize * (0.5 + Math.random()), 
            texture.patternSize * (0.3 + Math.random()), 
            Math.random() * Math.PI, 0, Math.PI * 2);
        ctx.fill();
        
        for (let j = 0; j < 3; j++) {
            ctx.beginPath();
            ctx.ellipse(splatterX + (Math.random() - 0.5) * 8, 
                splatterY + (Math.random() - 0.5) * 8,
                texture.patternSize * 0.3, texture.patternSize * 0.2,
                Math.random() * Math.PI, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

function drawCrystalPattern(ctx, x, y, width, height, texture, time) {
    ctx.fillStyle = texture.patternColor;
    const crystalCount = 25;
    
    for (let i = 0; i < crystalCount; i++) {
        const crystalX = x + Math.random() * width;
        const crystalY = y + Math.random() * height;
        const size = texture.patternSize * (0.5 + Math.sin(time * 3 + i) * 0.2);
        
        ctx.save();
        ctx.translate(crystalX, crystalY);
        ctx.rotate(Math.random() * Math.PI);
        ctx.beginPath();
        ctx.moveTo(0, -size);
        ctx.lineTo(size/2, 0);
        ctx.lineTo(0, size);
        ctx.lineTo(-size/2, 0);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }
}

function drawSecondaryPattern(ctx, x, y, width, height, texture, time) {
    const secondary = texture.secondaryPattern;
    const color = texture.secondaryColor;
    
    switch(secondary) {
        case 'shimmer':
            ctx.fillStyle = color;
            for (let i = 0; i < 30; i++) {
                const shimmerX = x + Math.random() * width;
                const shimmerY = y + Math.random() * height;
                ctx.globalAlpha = 0.5 + Math.sin(time * 8 + shimmerX) * 0.3;
                ctx.fillRect(shimmerX, shimmerY, 2, 2);
            }
            ctx.globalAlpha = 1;
            break;
        case 'flowers':
            ctx.fillStyle = color;
            for (let i = 0; i < 15; i++) {
                const flowerX = x + Math.random() * width;
                const flowerY = y + Math.random() * height;
                drawFlower(ctx, flowerX, flowerY, 3);
            }
            break;
        case 'drip':
            ctx.fillStyle = color;
            for (let i = 0; i < 40; i++) {
                const dripX = x + Math.random() * width;
                const dripY = y + Math.random() * height;
                ctx.fillRect(dripX, dripY, 1, 3);
            }
            break;
        case 'glow':
            ctx.fillStyle = color;
            ctx.globalAlpha = 0.3 + Math.sin(time * 3) * 0.2;
            for (let i = 0; i < 50; i++) {
                const glowX = x + Math.random() * width;
                const glowY = y + Math.random() * height;
                ctx.fillRect(glowX, glowY, 3, 3);
            }
            ctx.globalAlpha = 1;
            break;
    }
}

function applyTextureAnimation(ctx, x, y, width, height, texture, time) {
    switch(texture.animation.type) {
        case 'pulse':
            const pulseIntensity = 0.5 + Math.sin(time * texture.animation.speed) * texture.animation.intensity;
            ctx.fillStyle = `rgba(255, 100, 100, ${pulseIntensity * 0.2})`;
            ctx.fillRect(x, y, width, height);
            break;
        case 'sparkle':
            for (let i = 0; i < 20; i++) {
                const sparkleIntensity = Math.sin(time * 5 + i) * 0.5 + 0.5;
                ctx.fillStyle = `rgba(255, 255, 100, ${sparkleIntensity * 0.6})`;
                ctx.fillRect(x + Math.random() * width, y + Math.random() * height, 2, 2);
            }
            break;
        case 'sway':
            // Sway is handled in the pattern drawing
            break;
        case 'glow':
            ctx.globalCompositeOperation = 'lighter';
            ctx.fillStyle = `rgba(255, 255, 200, ${0.1 + Math.sin(time * 2) * 0.05})`;
            ctx.fillRect(x, y, width, height);
            ctx.globalCompositeOperation = 'source-over';
            break;
    }
}

function drawFlower(ctx, x, y, size) {
    ctx.fillStyle = "#FF69B4";
    for (let i = 0; i < 5; i++) {
        const angle = (i / 5) * Math.PI * 2;
        const petalX = x + Math.cos(angle) * size;
        const petalY = y + Math.sin(angle) * size;
        ctx.beginPath();
        ctx.ellipse(petalX, petalY, size/2, size/3, angle, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.fillStyle = "#FFD700";
    ctx.beginPath();
    ctx.arc(x, y, size/2, 0, Math.PI * 2);
    ctx.fill();
}

// ============================================
// MAP MANAGER
// ============================================

let currentMap = null;
let mapTime = 0;

function loadMap(mapId) {
    currentMap = MAP_PRESETS[mapId];
    if (!currentMap) {
        console.error(`Map ${mapId} not found!`);
        return false;
    }
    
    // Apply map modifiers to game systems
    if (currentMap.modifiers) {
        applyMapModifiers(currentMap.modifiers);
    }
    
    // Update game environment
    document.body.style.backgroundColor = currentMap.backgroundColor;
    
    // Regenerate obstacles with new map rules
    if (typeof generateObstaclesForWave === 'function') {
        generateObstaclesForWave(currentWave || 1);
    }
    
    console.log(`Loaded map: ${currentMap.name}`);
    return true;
}

function applyMapModifiers(modifiers) {
    // Apply to player
    if (player) {
        if (modifiers.playerDamageMultiplier) {
            player.damageMultiplier = modifiers.playerDamageMultiplier;
        }
        if (modifiers.playerSpeedMultiplier) {
            player.speedMultiplier = modifiers.playerSpeedMultiplier;
        }
    }
    
    // Apply to gold system
    if (modifiers.goldMultiplier && typeof goldMultiplier === 'undefined') {
        window.goldDropMultiplier = modifiers.goldMultiplier;
    }
}

function getCurrentMap() {
    return currentMap;
}

// ============================================
// ENHANCED OBSTACLE GENERATION
// ============================================

function generateObstaclesForWave(waveNumber) {
    if (!currentMap) {
        currentMap = MAP_PRESETS.ARENA;
    }
    
    obstacles = [];
    
    const rules = currentMap.waveGenerationRules;
    const placementRules = currentMap.placementRules;
    
    // Calculate number of obstacles based on wave
    let numObstacles = Math.min(
        rules.maxObstacles,
        rules.baseObstacles + Math.floor(waveNumber * rules.incrementPerWave)
    );
    
    // Determine wave tier
    let waveTier = 'earlyWaves';
    if (waveNumber >= 10) waveTier = 'lateWaves';
    else if (waveNumber >= 5) waveTier = 'midWaves';
    
    const distribution = rules.typeDistribution[waveTier];
    
    for (let i = 0; i < numObstacles; i++) {
        // Determine obstacle type based on distribution
        let type = null;
        const rand = Math.random();
        let cumulative = 0;
        
        for (const [typeName, probability] of Object.entries(distribution)) {
            cumulative += probability;
            if (rand < cumulative) {
                type = OBSTACLE_TYPES[typeName];
                break;
            }
        }
        
        if (!type) type = OBSTACLE_TYPES.CRATE;
        
        // Try to place obstacle with map rules
        let placed = false;
        let attempts = 0;
        
        while (!placed && attempts < placementRules.maxPlacementAttempts) {
            const margin = placementRules.borderMargin || 50;
            const x = margin + Math.random() * (canvas.width - margin * 2);
            const y = margin + Math.random() * (canvas.height - margin * 2);
            
            // Check distance from spawn
            const distToSpawn = Math.sqrt(
                Math.pow(x - currentMap.spawnArea.x, 2) + 
                Math.pow(y - currentMap.spawnArea.y, 2)
            );
            
            if (distToSpawn < placementRules.minDistanceFromSpawn) {
                attempts++;
                continue;
            }
            
            // Check avoid center radius
            if (placementRules.avoidCenterRadius > 0) {
                const distToCenter = Math.sqrt(Math.pow(x - canvas.width/2, 2) + Math.pow(y - canvas.height/2, 2));
                if (distToCenter < placementRules.avoidCenterRadius) {
                    attempts++;
                    continue;
                }
            }
            
            // Check avoid corners
            if (placementRules.avoidCorners) {
                const inCorner = (x < 100 && y < 100) || 
                                (x > canvas.width - 100 && y < 100) ||
                                (x < 100 && y > canvas.height - 100) ||
                                (x > canvas.width - 100 && y > canvas.height - 100);
                if (inCorner) {
                    attempts++;
                    continue;
                }
            }
            
            // Check distance from other obstacles
            let tooClose = false;
            for (let obs of obstacles) {
                const dist = Math.sqrt(
                    Math.pow(x - obs.x, 2) + Math.pow(y - obs.y, 2)
                );
                if (dist < placementRules.minDistanceBetweenObstacles) {
                    tooClose = true;
                    break;
                }
            }
            
            if (!tooClose) {
                // Create obstacle with size based on type
                let size = 30 + Math.random() * 20;
                if (type === OBSTACLE_TYPES.PILLAR) size = 25 + Math.random() * 15;
                if (type === OBSTACLE_TYPES.SPIKES) size = 35 + Math.random() * 15;
                
                const obstacle = {
                    x: x,
                    y: y,
                    width: size,
                    height: size,
                    type: type,
                    health: type.health,
                    maxHealth: type.health,
                    active: true,
                    texture: OBSTACLE_TEXTURES[type.drawStyle] || OBSTACLE_TEXTURES.crate
                };
                
                obstacles.push(obstacle);
                placed = true;
            }
            
            attempts++;
        }
    }
    
    // Add spikes based on wave rules
    if (waveNumber >= rules.spikeThreshold) {
        const numSpikes = Math.floor((waveNumber - rules.spikeThreshold + 1) * rules.spikesPerWave);
        for (let i = 0; i < numSpikes; i++) {
            const margin = placementRules.borderMargin || 50;
            const x = margin + Math.random() * (canvas.width - margin * 2);
            const y = margin + Math.random() * (canvas.height - margin * 2);
            
            obstacles.push({
                x: x,
                y: y,
                width: 40,
                height: 40,
                type: OBSTACLE_TYPES.SPIKES,
                texture: OBSTACLE_TEXTURES.spikes,
                active: true,
                lastDamage: 0
            });
        }
    }
    
    // Rebuild pathfinding grid
    buildPathfindingGrid();
}

// ============================================
// ENHANCED OBSTACLE DRAWING WITH TEXTURES
// ============================================

function drawObstacles() {
    obstacles.forEach(obs => {
        ctx.save();
        ctx.translate(obs.x, obs.y);
        
        // Apply lighting based on map
        if (currentMap && currentMap.ambientLight) {
            ctx.shadowBlur = 10;
            ctx.shadowColor = `rgba(0, 0, 0, ${0.3 * currentMap.ambientLight.intensity})`;
        } else {
            ctx.shadowBlur = 10;
            ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        }
        ctx.shadowOffsetY = 3;
        
        // Draw based on type with textures
        if (obs.type === OBSTACLE_TYPES.WALL) {
            drawBrickWall(ctx, obs);
        } else if (obs.type === OBSTACLE_TYPES.BARREL) {
            drawBarrelWithTexture(ctx, obs);
        } else if (obs.type === OBSTACLE_TYPES.CRATE) {
            drawCrateWithTexture(ctx, obs);
        } else if (obs.type === OBSTACLE_TYPES.PILLAR) {
            drawPillarWithTexture(ctx, obs);
        } else if (obs.type === OBSTACLE_TYPES.SPIKES) {
            drawSpikesWithEffect(ctx, obs);
        }
        
        ctx.restore();
    });
}

function drawBrickWall(ctx, obs) {
    const texture = obs.texture;
    
    // Base wall
    ctx.fillStyle = obs.type.color;
    ctx.fillRect(-obs.width/2, -obs.height/2, obs.width, obs.height);
    
    // Brick pattern
    ctx.strokeStyle = texture.patterns[0].color;
    ctx.lineWidth = texture.patterns[0].width;
    
    const brickHeight = 15;
    const brickWidth = obs.width / 4;
    
    for (let y = -obs.height/2 + brickHeight/2; y < obs.height/2; y += brickHeight) {
        const offset = (Math.floor((y + obs.height/2) / brickHeight) % 2) * brickWidth/2;
        for (let x = -obs.width/2 + offset; x < obs.width/2; x += brickWidth) {
            ctx.strokeRect(x, y - brickHeight/2, brickWidth, brickHeight);
        }
    }
    
    // Add weathering
    ctx.fillStyle = texture.highlight;
    ctx.globalAlpha = 0.3;
    for (let i = 0; i < 20; i++) {
        ctx.fillRect(
            -obs.width/2 + Math.random() * obs.width,
            -obs.height/2 + Math.random() * obs.height,
            2, 2
        );
    }
    ctx.globalAlpha = 1;
}

function drawBarrelWithTexture(ctx, obs) {
    const texture = obs.texture;
    
    // Barrel body
    ctx.fillStyle = obs.type.color;
    ctx.beginPath();
    ctx.ellipse(0, 0, obs.width/2, obs.height/2, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Wood grain
    ctx.strokeStyle = texture.patterns[0].color;
    ctx.lineWidth = texture.patterns[0].width;
    for (let i = -1; i <= 1; i++) {
        ctx.beginPath();
        ctx.ellipse(0, i * obs.height/3, obs.width/2 + 2, 4, 0, 0, Math.PI * 2);
        ctx.stroke();
    }
    
    // Glowing effect for barrels
    if (texture.effects.glowing.enabled) {
        const glowIntensity = 0.3 + Math.sin(Date.now() * 0.003) * 0.2;
        ctx.shadowBlur = 15;
        ctx.shadowColor = texture.effects.glowing.color;
        ctx.fillStyle = texture.effects.glowing.color;
        ctx.globalAlpha = glowIntensity;
        ctx.beginPath();
        ctx.ellipse(0, 0, obs.width/2 + 5, obs.height/2 + 5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }
    
    // Health bar for damaged barrels
    if (obs.health < obs.maxHealth) {
        drawHealthBar(ctx, obs);
    }
}

function drawCrateWithTexture(ctx, obs) {
    const texture = obs.texture;
    
    // Crate base
    ctx.fillStyle = obs.type.color;
    ctx.fillRect(-obs.width/2, -obs.height/2, obs.width, obs.height);
    
    // Wood planks
    ctx.strokeStyle = texture.patterns[0].color;
    ctx.lineWidth = texture.patterns[0].width;
    
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
    
    // Nails
    ctx.fillStyle = texture.patterns[1].color;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            ctx.beginPath();
            ctx.arc(i * obs.width/3, j * obs.height/3, 2, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // Health bar
    if (obs.health < obs.maxHealth) {
        drawHealthBar(ctx, obs);
    }
}

function drawPillarWithTexture(ctx, obs) {
    const texture = obs.texture;
    
    // Pillar base
    ctx.fillStyle = obs.type.color;
    ctx.beginPath();
    ctx.ellipse(0, 0, obs.width/2, obs.height/2, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Decorative cracks
    ctx.strokeStyle = texture.patterns[0].color;
    ctx.lineWidth = texture.patterns[0].width;
    for (let i = 0; i < 8; i++) {
        ctx.beginPath();
        ctx.moveTo(-obs.width/4 + Math.random() * obs.width/2, -obs.height/3);
        ctx.lineTo(-obs.width/4 + Math.random() * obs.width/2, obs.height/3);
        ctx.stroke();
    }
    
    // Top and bottom caps
    ctx.fillStyle = texture.highlight;
    ctx.beginPath();
    ctx.ellipse(0, -obs.height/2 + 5, obs.width/2 - 5, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(0, obs.height/2 - 5, obs.width/2 - 5, 5, 0, 0, Math.PI * 2);
    ctx.fill();
}

function drawSpikesWithEffect(ctx, obs) {
    const texture = obs.texture;
    const time = Date.now();
    const pulse = Math.sin(time * 0.005) * 0.3 + 0.7;
    
    const spikeCount = 5;
    const spikeWidth = obs.width / spikeCount;
    
    // Draw spikes
    for (let i = 0; i < spikeCount; i++) {
        const spikeX = -obs.width/2 + i * spikeWidth + spikeWidth/2;
        
        // Gradient for spikes
        const gradient = ctx.createLinearGradient(spikeX, -obs.height/2, spikeX, obs.height/2);
        gradient.addColorStop(0, '#E0E0E0');
        gradient.addColorStop(1, '#A0A0A0');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(spikeX - spikeWidth/2, -obs.height/2);
        ctx.lineTo(spikeX, obs.height/2);
        ctx.lineTo(spikeX + spikeWidth/2, -obs.height/2);
        ctx.closePath();
        ctx.fill();
    }
    
    // Pulsing danger effect
    ctx.shadowBlur = 20;
    ctx.shadowColor = `rgba(255, 0, 0, ${pulse * 0.8})`;
    ctx.strokeStyle = `rgba(255, 0, 0, ${pulse * 0.6})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.rect(-obs.width/2 - 2, -obs.height/2 - 2, obs.width + 4, obs.height + 4);
    ctx.stroke();
    
    // Blood stains
    ctx.fillStyle = texture.patterns[0].color;
    ctx.globalAlpha = 0.4;
    for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.ellipse(
            -obs.width/2 + Math.random() * obs.width,
            -obs.height/2 + Math.random() * obs.height,
            3, 2, 0, 0, Math.PI * 2
        );
        ctx.fill();
    }
    ctx.globalAlpha = 1;
}

function drawHealthBar(ctx, obs) {
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#000000';
    ctx.fillRect(-20, -obs.height/2 - 10, 40, 5);
    
    const healthPercent = obs.health / obs.maxHealth;
    ctx.fillStyle = healthPercent > 0.5 ? '#00FF00' : '#FF0000';
    ctx.fillRect(-20, -obs.height/2 - 10, 40 * healthPercent, 5);
}

// ============================================
// MAP UTILITIES
// ============================================

function getAvailableMaps() {
    return Object.keys(MAP_PRESETS).map(key => ({
        id: key,
        name: MAP_PRESETS[key].name,
        description: MAP_PRESETS[key].description
    }));
}

function changeMap(mapId) {
    if (loadMap(mapId)) {
        // Reset pathfinding
        buildPathfindingGrid();
        
        // Show map change notification
        if (typeof showNotification === 'function') {
            showNotification(`Map changed to: ${MAP_PRESETS[mapId].name}`, 'info');
        }
        
        return true;
    }
    return false;
}

function updateMapTime() {
    mapTime = (mapTime + 1) % 1000;
    requestAnimationFrame(() => updateMapTime());
}

// Start map time updates
updateMapTime();

// ============================================
// EXPORTS
// ============================================

window.MAP_PRESETS = MAP_PRESETS;
window.TEXTURE_PRESETS = TEXTURE_PRESETS;
window.OBSTACLE_TYPES = OBSTACLE_TYPES;
window.obstacles = obstacles;
window.currentMap = currentMap;
window.loadMap = loadMap;
window.changeMap = changeMap;
window.getAvailableMaps = getAvailableMaps;
window.generateObstaclesForWave = generateObstaclesForWave;
window.buildPathfindingGrid = buildPathfindingGrid;
window.findPath = findPath;
window.moveMonsterWithPathfinding = moveMonsterWithPathfinding;
window.updateObstacles = updateObstacles;
window.drawObstacles = drawObstacles;
window.checkProjectileObstacleCollision = checkProjectileObstacleCollision;
window.drawGroundTexture = drawGroundTexture;
