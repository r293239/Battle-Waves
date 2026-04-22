<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no, viewport-fit=cover">
    <title>Monster Survival - Arena Shooter</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            user-select: none;
            -webkit-tap-highlight-color: transparent;
        }

        body {
            background: linear-gradient(135deg, #0a0a1a, #1a1a2e);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            font-family: 'Arial', 'Segoe UI', sans-serif;
            touch-action: none;
        }

        .game-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 10px;
        }

        .canvas-container {
            position: relative;
            box-shadow: 0 0 30px rgba(0, 0, 0, 0.5);
            border-radius: 10px;
            overflow: hidden;
        }

        canvas {
            display: block;
            background: #1a1a2e;
            cursor: none;
            width: 100%;
            height: auto;
        }

        .ui-panel {
            margin-top: 10px;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(10px);
            border-radius: 10px;
            padding: 10px 15px;
            display: flex;
            gap: 20px;
            flex-wrap: wrap;
            justify-content: center;
            border: 1px solid rgba(255, 215, 0, 0.3);
        }

        .stat {
            display: flex;
            align-items: center;
            gap: 8px;
            color: white;
            font-size: 1rem;
            font-weight: bold;
            text-shadow: 1px 1px 0 rgba(0,0,0,0.5);
        }

        .stat span:first-child {
            font-size: 1.2rem;
        }

        .health-bar-container {
            width: 150px;
            height: 12px;
            background: rgba(0, 0, 0, 0.5);
            border-radius: 6px;
            overflow: hidden;
        }

        .health-bar {
            height: 100%;
            width: 100%;
            background: linear-gradient(90deg, #11998e, #38ef7d);
            border-radius: 6px;
            transition: width 0.2s;
        }

        .weapons-panel {
            margin-top: 10px;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(10px);
            border-radius: 10px;
            padding: 10px;
            border: 1px solid rgba(255, 215, 0, 0.3);
        }

        .weapons-grid {
            display: grid;
            grid-template-columns: repeat(6, 1fr);
            gap: 8px;
        }

        .weapon-slot {
            aspect-ratio: 1;
            background: rgba(30, 30, 60, 0.8);
            border: 2px solid #4ecdc4;
            border-radius: 8px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            position: relative;
            cursor: pointer;
            transition: all 0.2s;
            font-size: 1.5rem;
        }

        .weapon-slot.occupied {
            background: rgba(50, 50, 100, 0.8);
        }

        .weapon-slot.selected {
            border-color: #ffd700;
            box-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
            transform: scale(1.02);
        }

        .weapon-slot .tier-badge {
            position: absolute;
            top: 2px;
            left: 2px;
            background: #ffd700;
            color: #000;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.7rem;
            font-weight: bold;
        }

        .weapon-slot .weapon-level {
            position: absolute;
            bottom: 2px;
            left: 2px;
            font-size: 0.7rem;
            background: rgba(0,0,0,0.5);
            border-radius: 3px;
            padding: 1px 3px;
        }

        .weapon-slot .melee-type {
            position: absolute;
            bottom: 2px;
            right: 2px;
            font-size: 0.6rem;
            background: rgba(0,0,0,0.5);
            border-radius: 3px;
            padding: 1px 3px;
            color: #aaaaff;
        }

        .weapon-slot .weapon-info {
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0,0,0,0.9);
            color: white;
            font-size: 0.7rem;
            padding: 4px 8px;
            border-radius: 5px;
            white-space: nowrap;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.2s;
            z-index: 10;
        }

        .weapon-slot:hover .weapon-info {
            opacity: 1;
        }

        .weapon-slot .ammo-display {
            position: absolute;
            top: 2px;
            right: 2px;
            font-size: 0.65rem;
            background: rgba(0,0,0,0.7);
            padding: 1px 4px;
            border-radius: 4px;
            color: #ffaa00;
        }

        .weapon-slot .cooldown-bar {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: rgba(255,255,255,0.2);
            border-radius: 0 0 6px 6px;
            overflow: hidden;
        }

        .weapon-slot .cooldown-fill {
            height: 100%;
            width: 100%;
            background: #4ecdc4;
            transition: width 0.05s linear;
        }

        .empty-slot {
            color: rgba(255,255,255,0.3);
            font-size: 1.5rem;
        }

        .shop-panel {
            margin-top: 10px;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(10px);
            border-radius: 10px;
            padding: 10px;
            border: 1px solid rgba(255, 215, 0, 0.3);
        }

        .shop-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
            color: #ffd700;
        }

        .shop-items {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
        }

        .shop-item {
            background: rgba(30, 30, 60, 0.8);
            border: 1px solid #4ecdc4;
            border-radius: 8px;
            padding: 8px;
            cursor: pointer;
            transition: all 0.2s;
        }

        .shop-item:hover {
            transform: translateY(-2px);
            border-color: #ffd700;
            box-shadow: 0 5px 15px rgba(255, 215, 0, 0.3);
        }

        .shop-item.empty {
            opacity: 0.5;
            cursor: default;
        }

        .shop-item.empty:hover {
            transform: none;
        }

        .item-info {
            text-align: center;
        }

        .item-name {
            font-weight: bold;
            color: #ffd700;
            font-size: 0.9rem;
        }

        .item-effect {
            font-size: 0.7rem;
            color: #aaaaff;
            margin: 4px 0;
        }

        .item-cost {
            font-size: 0.8rem;
            color: #4ecdc4;
            font-weight: bold;
            text-align: center;
        }

        .item-tag {
            display: inline-block;
            font-size: 0.6rem;
            padding: 2px 4px;
            border-radius: 3px;
            margin-left: 5px;
        }

        .single-tag { background: #ff6b6b; color: white; }
        .aoe-tag { background: #ffa500; color: white; }
        .pierce-tag { background: #4ecdc4; color: white; }
        .dual-tag { background: #ff69b4; color: white; }
        .ranged-tag { background: #4CAF50; color: white; }
        .shotgun-tag { background: #ff6b6b; color: white; }
        .energy-tag { background: #00ffff; color: #000; }
        .boomerang-tag { background: #8B4513; color: white; }
        .throwing-tag { background: #C0C0C0; color: #000; }
        .sniper-tag { background: #FF4500; color: white; }
        .crossbow-tag { background: #8B4513; color: white; }
        .tower-tag { background: #4CAF50; color: white; }

        .item-tag.tier-2 { background: #2ecc71; }
        .item-tag.tier-3 { background: #3498db; }
        .item-tag.tier-4 { background: #9b59b6; }
        .item-tag.tier-5 { background: #e74c3c; }

        .shop-controls {
            margin-top: 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .refresh-btn {
            background: linear-gradient(45deg, #4ecdc4, #44a3a3);
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 5px;
            cursor: pointer;
            font-weight: bold;
            transition: transform 0.2s;
        }

        .refresh-btn:active {
            transform: scale(0.95);
        }

        .action-buttons {
            display: flex;
            gap: 10px;
            margin-top: 10px;
        }

        .action-btn {
            background: linear-gradient(45deg, #ffd700, #ffaa00);
            color: #000;
            border: none;
            padding: 8px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-weight: bold;
            transition: transform 0.2s;
        }

        .action-btn:active {
            transform: scale(0.95);
        }

        .start-screen, .wave-complete-overlay, .game-over-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.85);
            backdrop-filter: blur(10px);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        }

        .start-content, .wave-content, .game-over-content {
            background: linear-gradient(135deg, #1a1a2e, #16213e);
            padding: 30px;
            border-radius: 20px;
            text-align: center;
            border: 2px solid #ffd700;
            box-shadow: 0 0 50px rgba(255, 215, 0, 0.3);
            max-width: 400px;
            margin: 20px;
        }

        .start-content h1 {
            color: #ffd700;
            margin-bottom: 20px;
            font-size: 2rem;
        }

        .start-content p {
            color: #aaaaff;
            margin: 10px 0;
        }

        .start-btn {
            background: linear-gradient(45deg, #ffd700, #ffaa00);
            color: #000;
            border: none;
            padding: 12px 30px;
            font-size: 1.2rem;
            border-radius: 25px;
            cursor: pointer;
            margin-top: 20px;
            font-weight: bold;
            transition: transform 0.2s;
        }

        .start-btn:active {
            transform: scale(0.95);
        }

        .wave-content h2, .game-over-content h2 {
            color: #ffd700;
            margin-bottom: 15px;
        }

        .wave-content .stat-buffs {
            display: flex;
            flex-direction: column;
            gap: 10px;
            margin: 20px 0;
        }

        .stat-buff {
            background: rgba(255, 255, 255, 0.1);
            padding: 10px;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s;
            border: 1px solid #4ecdc4;
        }

        .stat-buff:hover {
            background: rgba(255, 215, 0, 0.2);
            border-color: #ffd700;
            transform: scale(1.02);
        }

        .buff-name {
            font-weight: bold;
            color: #ffd700;
        }

        .buff-description {
            font-size: 0.8rem;
            color: #aaaaff;
        }

        .damage-indicator, .gold-popup, .health-popup {
            position: absolute;
            pointer-events: none;
            font-weight: bold;
            text-shadow: 1px 1px 0 black;
            animation: fadeOut 1s ease-out forwards;
            z-index: 100;
        }

        .damage-indicator {
            color: #ff4444;
            font-size: 1.2rem;
        }

        .gold-popup {
            color: #ffd700;
            font-size: 1rem;
        }

        .health-popup {
            color: #00ff00;
            font-size: 1rem;
        }

        #reloadIndicator {
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: rgba(0, 0, 0, 0.8);
            color: #ffaa00;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 0.9rem;
            font-weight: bold;
            border: 1px solid #ffaa00;
            z-index: 200;
            display: none;
        }

        @media (max-width: 768px) {
            .weapon-slot { font-size: 1.2rem; }
            .stat { font-size: 0.8rem; }
            .health-bar-container { width: 100px; }
            .shop-items { gap: 5px; }
            .item-name { font-size: 0.7rem; }
            .item-effect { font-size: 0.6rem; }
        }
    </style>
</head>
<body>
    <div class="game-container">
        <div class="canvas-container">
            <canvas id="gameCanvas" width="800" height="600"></canvas>
        </div>
        <div class="ui-panel">
            <div class="stat">
                <span>❤️</span>
                <div class="health-bar-container">
                    <div class="health-bar" id="healthFill"></div>
                </div>
                <span id="healthValue">20/20</span>
            </div>
            <div class="stat"><span>⚔️</span><span id="damageValue">100%</span></div>
            <div class="stat"><span>👟</span><span id="speedValue">100%</span></div>
            <div class="stat"><span>💰</span><span id="goldValue">50</span></div>
            <div class="stat"><span>🌊</span><span id="waveValue">1</span></div>
            <div class="stat"><span>👾</span><span id="killsValue">0</span></div>
            <div class="stat"><span>🐉</span><span id="monsterCount">Monsters: 0</span></div>
        </div>
        <div class="weapons-panel">
            <div class="weapons-grid" id="weaponsGrid"></div>
        </div>
        <div class="shop-panel" id="shopPanel">
            <div class="shop-header">
                <span>🛒 SHOP</span>
                <span>Refreshes: <span id="refreshCounter">0</span></span>
            </div>
            <div class="shop-items" id="shopItems"></div>
            <div class="shop-controls">
                <button class="refresh-btn" id="refreshShopBtn">🔄 Refresh (<span id="refreshCost">5</span>g)</button>
                <div class="action-buttons">
                    <button class="action-btn" id="scrapWeaponBtn" style="display:none">🗑️ Scrap</button>
                    <button class="action-btn" id="mergeWeaponBtn" style="display:none">🔄 Merge</button>
                </div>
            </div>
            <div id="mergeInfo" style="color:#ffd700; font-size:0.8rem; margin-top:5px; text-align:center; display:none"></div>
        </div>
        <div class="consumables-container" style="margin-top:10px">
            <h4>🎒 CONSUMABLES</h4>
            <div class="consumables-grid" id="consumablesGrid"></div>
        </div>
    </div>

    <div id="startScreen" class="start-screen">
        <div class="start-content">
            <h1>🐉 MONSTER SURVIVAL</h1>
            <p>⚔️ Survive waves of monsters</p>
            <p>🔫 Buy weapons and upgrades</p>
            <p>🛡️ Defeat bosses every 10 waves</p>
            <p>📊 Check stats with the button</p>
            <p>🎮 Joystick + WASD to move</p>
            <p>🖱️ Click/Tap to aim</p>
            <button class="start-btn" id="startGameBtn">START GAME</button>
        </div>
    </div>

    <div id="waveCompleteOverlay" class="wave-complete-overlay" style="display:none">
        <div class="wave-content">
            <h2>🏆 WAVE COMPLETE! 🏆</h2>
            <p>Choose a stat upgrade:</p>
            <div class="stat-buffs" id="statBuffs"></div>
        </div>
    </div>

    <div id="gameOverOverlay" class="game-over-overlay" style="display:none">
        <div class="game-over-content">
            <h2>💀 GAME OVER 💀</h2>
            <p id="gameOverText">You survived X waves</p>
            <button class="start-btn" id="restartBtn">PLAY AGAIN</button>
        </div>
    </div>

    <div id="reloadIndicator">RELOADING...</div>

    <script src="game-data.js"></script>
    <script src="combat-system.js"></script>
    <script src="game-logic.js"></script>
</body>
</html>
