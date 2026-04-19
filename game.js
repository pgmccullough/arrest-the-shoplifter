// localStorage for gold tracking and upgrades
let totalGold = localStorage.getItem('totalGold') ? parseInt(localStorage.getItem('totalGold')) : 0;
let speedLevel = localStorage.getItem('speedLevel') ? parseInt(localStorage.getItem('speedLevel')) : 1;
let catchLevel = localStorage.getItem('catchLevel') ? parseInt(localStorage.getItem('catchLevel')) : 1;
let incomeLevel = localStorage.getItem('incomeLevel') ? parseInt(localStorage.getItem('incomeLevel')) : 1;
let mapLevel = localStorage.getItem('mapLevel') ? parseInt(localStorage.getItem('mapLevel')) : 1;

const BASE_SPEED_UPGRADE_COST = 50;
const BASE_CATCH_UPGRADE_COST = 50;
const BASE_INCOME_UPGRADE_COST = 100;
const BASE_MAP_LEVEL_COST = 100;
const COST_MULTIPLIER = 1.5; // Each upgrade multiplies cost by this
const MAP_LEVEL_COST_MULTIPLIER = 10; // Map level cost multiplies by 10 each time
const INCOME_COST_MULTIPLIER = 2; // Income upgrade cost doubles each time
const SPEED_MULTIPLIER = 1.4; // Each level multiplies speed by this
const CATCH_RANGE_INCREMENT = 0.5; // Each level adds this much to catch range
const INCOME_MULTIPLIER = 2; // Each income level multiplies gold earned by this

function getSpeedUpgradeCost() {
    return Math.floor(BASE_SPEED_UPGRADE_COST * Math.pow(COST_MULTIPLIER, speedLevel - 1));
}

function getCatchUpgradeCost() {
    return Math.floor(BASE_CATCH_UPGRADE_COST * Math.pow(COST_MULTIPLIER, catchLevel - 1));
}

function getMapLevelUpgradeCost() {
    return Math.floor(BASE_MAP_LEVEL_COST * Math.pow(MAP_LEVEL_COST_MULTIPLIER, mapLevel - 1));
}

function getMapScale() {
    return Math.pow(2, mapLevel - 1);
}

function saveGold() {
    localStorage.setItem('totalGold', totalGold.toString());
}

function saveUpgrades() {
    localStorage.setItem('speedLevel', speedLevel.toString());
    localStorage.setItem('catchLevel', catchLevel.toString());
    localStorage.setItem('incomeLevel', incomeLevel.toString());
    localStorage.setItem('mapLevel', mapLevel.toString());
}

function applyUpgrades() {
    playerController.moveSpeed = 0.15 * Math.pow(SPEED_MULTIPLIER, speedLevel - 1);
    game.catchRadius = 1.5 + (CATCH_RANGE_INCREMENT * (catchLevel - 1));
}

function updateGoldDisplay() {
    document.getElementById('titleGold').textContent = totalGold;
    const upgradesGoldEl = document.getElementById('upgradesGold');
    if (upgradesGoldEl) {
        upgradesGoldEl.textContent = totalGold;
    }
}

function updateUpgradeUI() {
    // Speed upgrade
    const speedLevelEl = document.getElementById('speedLevel');
    const speedValueEl = document.getElementById('speedValue');
    if (speedLevelEl) {
        const speedValue = (0.15 * Math.pow(SPEED_MULTIPLIER, speedLevel - 1) / 0.15).toFixed(1);
        speedLevelEl.textContent = `Lv. ${speedLevel}`;
        if (speedValueEl) speedValueEl.textContent = `${speedValue}x`;
    }
    
    const speedBtn = document.getElementById('speedBtn');
    if (speedBtn) {
        const speedCost = getSpeedUpgradeCost();
        const canBuySpeed = totalGold >= speedCost;
        speedBtn.disabled = !canBuySpeed;
        if (canBuySpeed) {
            speedBtn.textContent = `Upgrade - ${speedCost} Gold`;
        } else {
            const needed = speedCost - totalGold;
            speedBtn.textContent = `Need ${needed} more Gold`;
        }
    }
    
    // Catch range upgrade
    const catchLevelEl = document.getElementById('catchLevel');
    const catchValueEl = document.getElementById('catchValue');
    if (catchLevelEl) {
        const catchValue = (1.5 + (CATCH_RANGE_INCREMENT * (catchLevel - 1))).toFixed(1);
        catchLevelEl.textContent = `Lv. ${catchLevel}`;
        if (catchValueEl) catchValueEl.textContent = `${catchValue} units`;
    }
    
    const catchBtn = document.getElementById('catchBtn');
    if (catchBtn) {
        const catchCost = getCatchUpgradeCost();
        const canBuyCatch = totalGold >= catchCost;
        catchBtn.disabled = !canBuyCatch;
        if (canBuyCatch) {
            catchBtn.textContent = `Upgrade - ${catchCost} Gold`;
        } else {
            const needed = catchCost - totalGold;
            catchBtn.textContent = `Need ${needed} more Gold`;
        }
    }
    
    // Income upgrade
    const incomeLevelEl = document.getElementById('incomeLevel');
    const incomeValueEl = document.getElementById('incomeValue');
    if (incomeLevelEl) {
        const incomeValue = getGoldMultiplier().toFixed(1);
        incomeLevelEl.textContent = `Lv. ${mapLevel}`;
        if (incomeValueEl) incomeValueEl.textContent = `${incomeValue}x`;
    }
    
    const incomeBtn = document.getElementById('incomeBtn');
    if (incomeBtn) {
        const incomeCost = getIncomeUpgradeCost();
        const canBuyIncome = totalGold >= incomeCost;
        incomeBtn.disabled = !canBuyIncome;
        if (canBuyIncome) {
            incomeBtn.textContent = `Upgrade - ${incomeCost} Gold`;
        } else {
            const needed = incomeCost - totalGold;
            incomeBtn.textContent = `Need ${needed} more Gold`;
        }
    }
    
    // Map level upgrade
    const mapLevelBtn = document.getElementById('mapLevelBtn');
    if (mapLevelBtn) {
        const mapCost = getMapLevelUpgradeCost();
        const canBuyMapLevel = totalGold >= mapCost;
        mapLevelBtn.disabled = !canBuyMapLevel;
        const nextLevel = mapLevel + 1;
        if (canBuyMapLevel) {
            mapLevelBtn.textContent = `Upgrade to Level ${nextLevel} - ${mapCost} Gold`;
        } else {
            const needed = mapCost - totalGold;
            mapLevelBtn.textContent = `Need ${needed} more Gold`;
        }
    }
    
    // Update New Game button to show level
    const newGameBtn = document.getElementById('newGameBtn');
    if (newGameBtn) {
        newGameBtn.textContent = `New Game (Level ${mapLevel})`;
    }
}

function goToTitleScreen() {
    game.isRunning = false;
    location.reload();
}

// Function to setup event listeners
function setupEventListeners() {
    console.log('setupEventListeners() called');
    console.log('newGameBtn:', document.getElementById('newGameBtn'));
    updateGoldDisplay();
    updateUpgradeUI();
    
    const newGameBtn = document.getElementById('newGameBtn');
    if (newGameBtn) {
        newGameBtn.addEventListener('click', (e) => {
            console.log('New Game button clicked');
            try {
                startNewGame();
            } catch (err) {
                console.error('Error in startNewGame:', err);
            }
        });
    }
    
    const upgradesBtn = document.getElementById('upgradesBtn');
    if (upgradesBtn) {
        upgradesBtn.addEventListener('click', showUpgrades);
    }
    
    const backFromUpgradesBtn = document.getElementById('backFromUpgradesBtn');
    if (backFromUpgradesBtn) {
        backFromUpgradesBtn.addEventListener('click', hideUpgrades);
    }
    
    const helpBtn = document.getElementById('helpBtn');
    if (helpBtn) {
        helpBtn.addEventListener('click', showHelp);
    }
    
    const backBtn = document.getElementById('backBtn');
    if (backBtn) {
        backBtn.addEventListener('click', hideHelp);
    }
    
    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetUpgrades);
    }
    
    // ESC key to pause/resume - listen for pointer lock exit
    document.addEventListener('pointerlockchange', () => {
        if (!document.pointerLockElement && game.isRunning && !game.gameOver && !game.isPaused) {
            pauseGame();
        }
    });
    
    document.addEventListener('mozpointerlockchange', () => {
        if (!document.mozPointerLockElement && game.isRunning && !game.gameOver && !game.isPaused) {
            pauseGame();
        }
    });
    
    const speedBtn = document.getElementById('speedBtn');
    if (speedBtn) {
        speedBtn.addEventListener('click', () => {
            const speedCost = getSpeedUpgradeCost();
            if (totalGold >= speedCost) {
                totalGold -= speedCost;
                speedLevel++;
                saveGold();
                saveUpgrades();
                updateGoldDisplay();
                updateUpgradeUI();
            }
        });
    }
    
    const catchBtn = document.getElementById('catchBtn');
    if (catchBtn) {
        catchBtn.addEventListener('click', () => {
            const catchCost = getCatchUpgradeCost();
            if (totalGold >= catchCost) {
                totalGold -= catchCost;
                catchLevel++;
                saveGold();
                saveUpgrades();
                updateGoldDisplay();
                updateUpgradeUI();
            }
        });
    }
    
    const incomeBtn = document.getElementById('incomeBtn');
    if (incomeBtn) {
        incomeBtn.addEventListener('click', () => {
            const incomeCost = getIncomeUpgradeCost();
            if (totalGold >= incomeCost) {
                totalGold -= incomeCost;
                incomeLevel++;
                saveGold();
                saveUpgrades();
                updateGoldDisplay();
                updateUpgradeUI();
            }
        });
    }
    
    const mapLevelBtn = document.getElementById('mapLevelBtn');
    if (mapLevelBtn) {
        mapLevelBtn.addEventListener('click', () => {
            const mapCost = getMapLevelUpgradeCost();
            if (totalGold >= mapCost) {
                totalGold -= mapCost;
                mapLevel++;
                saveGold();
                saveUpgrades();
                updateGoldDisplay();
                updateUpgradeUI();
            }
        });
    }
}

function startNewGame() {
    // Reset game state for new game
    game.caught = 0;
    game.gameOver = false;
    game.won = false;
    game.goldAwarded = false;
    game.isRunning = true;
    game.isPaused = false;
    game.npcs = [];
    
    // Reset player position and velocity
    playerController.position.set(0, 1.6, 5);
    playerController.velocity.set(0, 0, 0);
    playerController.pitch = 0;
    playerController.yaw = 0;
    camera.position.set(0, 1.6, 5);
    
    // Initialize game
    initGame();
    
    // Apply upgrades
    applyUpgrades();
    
    // Apply map scale
    applyMapScale();
    
    // Show game UI
    document.getElementById('titleScreen').style.display = 'none';
    document.getElementById('helpScreen').style.display = 'none';
    document.getElementById('hud').style.display = 'flex';
    document.getElementById('gameContainer').style.display = 'block';
    document.getElementById('gameContainer').classList.add('active');
    document.getElementById('gameOver').style.display = 'none';
    
    gameLoop();
}

function continueGame() {
    // Resume from pause
    if (game.isPaused) {
        game.isRunning = true;
        game.isPaused = false;
        document.getElementById('titleScreen').style.display = 'none';
        document.getElementById('hud').style.display = 'flex';
        document.getElementById('gameContainer').style.display = 'block';
        document.getElementById('gameContainer').classList.add('active');
        gameLoop();
    } else {
        // Start new game if not paused
        startNewGame();
    }
}

function pauseGame() {
    game.isRunning = false;
    game.isPaused = true;
    document.getElementById('hud').style.display = 'none';
    document.getElementById('gameContainer').style.display = 'block';
    document.getElementById('gameContainer').classList.remove('active');
    document.getElementById('titleScreen').style.display = 'flex';
}

function showUpgrades() {
    game.isRunning = false;
    document.getElementById('titleScreen').style.display = 'none';
    document.getElementById('upgradesScreen').style.display = 'flex';
    updateUpgradeUI();
}

function hideUpgrades() {
    document.getElementById('upgradesScreen').style.display = 'none';
    document.getElementById('titleScreen').style.display = 'flex';
}

function showHelp() {
    game.isRunning = false;
    document.getElementById('titleScreen').style.display = 'none';
    document.getElementById('helpScreen').style.display = 'flex';
}

function hideHelp() {
    document.getElementById('helpScreen').style.display = 'none';
    document.getElementById('titleScreen').style.display = 'flex';
}

// Setup event listeners immediately - before Three.js init which may fail
setupEventListeners();

// Three.js Setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87CEEB);
scene.fog = new THREE.Fog(0x87CEEB, 20, 80);

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.set(0, 1.6, 5);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.getElementById('gameContainer').appendChild(renderer.domElement);

// Mouse look - only lock when game is running
document.addEventListener('click', () => {
    if (game.isRunning) {
        document.body.requestPointerLock = document.body.requestPointerLock || document.body.mozRequestPointerLock;
        document.body.requestPointerLock();
    }
});

document.addEventListener('mousemove', (e) => {
    if (document.pointerLockElement === document.body) {
        playerController.yaw -= e.movementX * 0.002;
        playerController.pitch -= e.movementY * 0.002;
        
        // Clamp vertical rotation to prevent flipping
        playerController.pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, playerController.pitch));
    }
});

document.addEventListener('pointerlockchange', () => {
    // Pointer lock changed
});

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(50, 50, 30);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
scene.add(directionalLight);

// Floor
const floorGeometry = new THREE.PlaneGeometry(30, 30);
const floorMaterial = new THREE.MeshLambertMaterial({ color: 0xD2B48C });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

// Store shelves
const collisionObjects = [];

function createShelf(x, z) {
    // Create left half of shelf
    const leftShelfGeometry = new THREE.BoxGeometry(6, 3, 2);
    const shelfMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
    const leftShelf = new THREE.Mesh(leftShelfGeometry, shelfMaterial);
    leftShelf.position.set(x - 6, 1.5, z);
    leftShelf.castShadow = true;
    leftShelf.receiveShadow = true;
    scene.add(leftShelf);
    
    collisionObjects.push({
        object: leftShelf,
        box: new THREE.Box3().setFromObject(leftShelf),
        type: 'shelf'
    });
    
    // Create right half of shelf
    const rightShelfGeometry = new THREE.BoxGeometry(6, 3, 2);
    const rightShelf = new THREE.Mesh(rightShelfGeometry, shelfMaterial);
    rightShelf.position.set(x + 6, 1.5, z);
    rightShelf.castShadow = true;
    rightShelf.receiveShadow = true;
    scene.add(rightShelf);
    
    collisionObjects.push({
        object: rightShelf,
        box: new THREE.Box3().setFromObject(rightShelf),
        type: 'shelf'
    });
}

for (let i = -1; i <= 1; i++) {
    createShelf(i * 10, 0);
    createShelf(i * 10, 10);
    createShelf(i * 10, -10);
}

// Create aisle dividers (thin walls between shelf rows) - split with gap
function createAisleDivider(x, z1, z2) {
    const dividerLength = Math.abs(z2 - z1);
    const dividerHeight = 3;
    const dividerThickness = 2;
    const wallSegmentLength = dividerLength / 6; // Make walls only 1/6th of the length
    
    // Top half - positioned at the start
    const topDividerGeometry = new THREE.BoxGeometry(dividerThickness, dividerHeight, wallSegmentLength);
    const dividerMaterial = new THREE.MeshLambertMaterial({ color: 0x999999 });
    const topDivider = new THREE.Mesh(topDividerGeometry, dividerMaterial);
    topDivider.position.set(x, 1.5, z1 + wallSegmentLength / 2);
    topDivider.castShadow = true;
    topDivider.receiveShadow = true;
    scene.add(topDivider);
    
    collisionObjects.push({
        object: topDivider,
        box: new THREE.Box3().setFromObject(topDivider),
        type: 'divider'
    });
    
    // Bottom half - positioned at the end
    const bottomDividerGeometry = new THREE.BoxGeometry(dividerThickness, dividerHeight, wallSegmentLength);
    const bottomDivider = new THREE.Mesh(bottomDividerGeometry, dividerMaterial);
    bottomDivider.position.set(x, 1.5, z2 - wallSegmentLength / 2);
    bottomDivider.castShadow = true;
    bottomDivider.receiveShadow = true;
    scene.add(bottomDivider);
    
    collisionObjects.push({
        object: bottomDivider,
        box: new THREE.Box3().setFromObject(bottomDivider),
        type: 'divider'
    });
}

// Add dividers between shelf rows - REMOVED
// for (let i = -3; i <= 3; i++) {
//     createAisleDivider(i * 15, -15, 0);
//     createAisleDivider(i * 15, 0, 15);
// }

// Walls
const wallMaterial = new THREE.MeshLambertMaterial({ color: 0xF5DEB3 });

// Back wall - full length
const backWall = new THREE.Mesh(
    new THREE.BoxGeometry(20, 10, 1),
    wallMaterial
);
backWall.position.set(0, 5, -10);
backWall.receiveShadow = true;
scene.add(backWall);
collisionObjects.push({
    object: backWall,
    box: new THREE.Box3().setFromObject(backWall),
    type: 'wall'
});

// Front wall - full length
const frontWall = new THREE.Mesh(
    new THREE.BoxGeometry(20, 10, 1),
    wallMaterial
);
frontWall.position.set(0, 5, 10);
frontWall.receiveShadow = true;
scene.add(frontWall);
collisionObjects.push({
    object: frontWall,
    box: new THREE.Box3().setFromObject(frontWall),
    type: 'wall'
});

const leftWall = new THREE.Mesh(
    new THREE.BoxGeometry(1, 10, 20),
    wallMaterial
);
leftWall.position.set(-10, 5, 0);
leftWall.receiveShadow = true;
scene.add(leftWall);
collisionObjects.push({
    object: leftWall,
    box: new THREE.Box3().setFromObject(leftWall),
    type: 'wall'
});

const rightWall = new THREE.Mesh(
    new THREE.BoxGeometry(1, 10, 20),
    wallMaterial
);
rightWall.position.set(10, 5, 0);
rightWall.receiveShadow = true;
scene.add(rightWall);
collisionObjects.push({
    object: rightWall,
    box: new THREE.Box3().setFromObject(rightWall),
    type: 'wall'
});

// Apply map scaling based on mapLevel
function applyMapScale() {
    const scale = getMapScale();
    floor.scale.set(scale, 1, scale);
    backWall.scale.set(scale, 1, 1);
    backWall.position.z = -10 * scale;
    frontWall.scale.set(scale, 1, 1);
    frontWall.position.z = 10 * scale;
    leftWall.scale.set(1, 1, scale);
    leftWall.position.x = -10 * scale;
    rightWall.scale.set(1, 1, scale);
    rightWall.position.x = 10 * scale;
    
    // Scale shelves
    for (let collObj of collisionObjects) {
        if (collObj.type === 'shelf') {
            collObj.object.scale.set(scale, 1, scale);
            // Scale position on X and Z axes only
            collObj.object.position.x *= scale;
            collObj.object.position.z *= scale;
        }
    }
}

// Game state
const game = {
    caught: 0,
    gameOver: false,
    won: false,
    goldAwarded: false,
    isRunning: false,
    isPaused: false,
    npcs: [],
    catchRadius: 1.5,
    TARGET_CATCHES: 10
};

// Player object for first-person camera
const playerController = {
    position: new THREE.Vector3(5, 1.6, -35),
    velocity: new THREE.Vector3(0, 0, 0),
    moveSpeed: 0.15,
    keys: {},
    radius: 0.3, // Collision radius
    euler: new THREE.Euler(0, 0, 0, 'YXZ'),
    pitch: 0,
    yaw: 0
};

// Check collision
function checkCollision(newPosition) {
    const playerBox = new THREE.Box3(
        new THREE.Vector3(newPosition.x - playerController.radius, newPosition.y - 0.8, newPosition.z - playerController.radius),
        new THREE.Vector3(newPosition.x + playerController.radius, newPosition.y + 0.8, newPosition.z + playerController.radius)
    );
    
    for (let collObj of collisionObjects) {
        collObj.box.setFromObject(collObj.object);
        if (playerBox.intersectsBox(collObj.box)) {
            return true;
        }
    }
    return false;
}

// Create player uniform (visible when catching)
function createPlayerUniform() {
    const group = new THREE.Group();
    
    // Body - black uniform
    const bodyGeometry = new THREE.BoxGeometry(0.6, 1.4, 0.3);
    const uniformMaterial = new THREE.MeshLambertMaterial({ color: 0x000000 });
    const body = new THREE.Mesh(bodyGeometry, uniformMaterial);
    body.position.y = 0.7;
    body.castShadow = true;
    group.add(body);
    
    // ICE text on front
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.font = 'bold 80px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('ICE', 128, 128);
    
    const texture = new THREE.CanvasTexture(canvas);
    const textMaterial = new THREE.MeshLambertMaterial({ map: texture });
    const textGeometry = new THREE.BoxGeometry(0.65, 0.6, 0.02);
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    textMesh.position.set(0, 0.7, 0.16);
    group.add(textMesh);
    
    group.position.copy(playerController.position);
    return group;
}

let playerUniform = createPlayerUniform();
scene.add(playerUniform);

// NPC class - with black ski mask and run-away behavior
class Shoplifter {
    constructor() {
        this.group = new THREE.Group();
        
        // Body - random color
        const colors = [0xFF6B6B, 0x4ECDC4, 0x45B7D1, 0xFFA07A, 0x98D8C8, 0xF7DC6F];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        
        const bodyGeometry = new THREE.BoxGeometry(0.5, 0.7, 0.3);
        const bodyMaterial = new THREE.MeshLambertMaterial({ color: this.color });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 1.05;
        body.castShadow = true;
        this.group.add(body);
        
        // Head
        const headGeometry = new THREE.SphereGeometry(0.25, 16, 16);
        const headMaterial = new THREE.MeshLambertMaterial({ color: 0xFDBCB4 });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 1.5;
        head.castShadow = true;
        this.group.add(head);
        
        // Black ski mask (circular with texture)
        const maskGeometry = new THREE.SphereGeometry(0.30, 32, 32);
        
        // Create fabric texture for ski mask
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');
        
        // Black base
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, 128, 128);
        
        // Add fabric knit pattern
        ctx.strokeStyle = '#222222';
        ctx.lineWidth = 0.5;
        for (let i = 0; i < 128; i += 4) {
            for (let j = 0; j < 128; j += 4) {
                ctx.strokeRect(i, j, 4, 4);
            }
        }
        
        // Add some texture variation
        ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
        for (let i = 0; i < 200; i++) {
            const x = Math.random() * 128;
            const y = Math.random() * 128;
            ctx.fillRect(x, y, 2, 2);
        }
        
        const texture = new THREE.CanvasTexture(canvas);
        texture.magFilter = THREE.NearestFilter;
        const maskMaterial = new THREE.MeshPhongMaterial({ map: texture, color: 0x000000 });
        const mask = new THREE.Mesh(maskGeometry, maskMaterial);
        mask.position.set(0, 1.5, 0);
        mask.castShadow = true;
        this.group.add(mask);
        
        // Eyes (visible above mask)
        const eyeGeometry = new THREE.SphereGeometry(0.08, 8, 8);
        const eyeMaterial = new THREE.MeshLambertMaterial({ color: 0xFFFFFF });
        
        const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        leftEye.position.set(-0.1, 1.6, 0.25);
        this.group.add(leftEye);
        
        const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        rightEye.position.set(0.1, 1.6, 0.25);
        this.group.add(rightEye);
        
        // Arms
        const armGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.6, 16);
        const armMaterial = new THREE.MeshLambertMaterial({ color: this.color });
        
        this.leftArm = new THREE.Mesh(armGeometry, armMaterial);
        this.leftArm.position.set(-0.35, 1.0, 0);
        this.leftArm.castShadow = true;
        this.group.add(this.leftArm);
        
        this.rightArm = new THREE.Mesh(armGeometry, armMaterial);
        this.rightArm.position.set(0.35, 1.0, 0);
        this.rightArm.castShadow = true;
        this.group.add(this.rightArm);
        
        // Hands
        const handGeometry = new THREE.SphereGeometry(0.1, 8, 8);
        const handMaterial = new THREE.MeshLambertMaterial({ color: 0xFDBCB4 });
        
        this.leftHand = new THREE.Mesh(handGeometry, handMaterial);
        this.leftHand.position.set(0, -0.35, 0);
        this.leftHand.castShadow = true;
        this.leftArm.add(this.leftHand);
        
        this.rightHand = new THREE.Mesh(handGeometry, handMaterial);
        this.rightHand.position.set(0, -0.35, 0);
        this.rightHand.castShadow = true;
        this.rightArm.add(this.rightHand);
        
        // Legs
        const legGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.7, 16);
        const legMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
        
        this.leftLeg = new THREE.Mesh(legGeometry, legMaterial);
        this.leftLeg.position.set(-0.2, 0.35, 0);
        this.leftLeg.castShadow = true;
        this.group.add(this.leftLeg);
        
        this.rightLeg = new THREE.Mesh(legGeometry, legMaterial);
        this.rightLeg.position.set(0.2, 0.35, 0);
        this.rightLeg.castShadow = true;
        this.group.add(this.rightLeg);
        
        // Feet
        const footGeometry = new THREE.BoxGeometry(0.15, 0.15, 0.3);
        const footMaterial = new THREE.MeshLambertMaterial({ color: 0x1A1A1A });
        
        this.leftFoot = new THREE.Mesh(footGeometry, footMaterial);
        this.leftFoot.position.set(0, -0.4, 0.05);
        this.leftFoot.castShadow = true;
        this.leftLeg.add(this.leftFoot);
        
        this.rightFoot = new THREE.Mesh(footGeometry, footMaterial);
        this.rightFoot.position.set(0, -0.4, 0.05);
        this.rightFoot.castShadow = true;
        this.rightLeg.add(this.rightFoot);
        
        // Random starting position - check for collisions
        let validPosition = false;
        const spawnRange = 7.5 * getMapScale();
        while (!validPosition) {
            const testX = Math.random() * spawnRange * 2 - spawnRange;
            const testZ = Math.random() * spawnRange * 2 - spawnRange;
            const npcBox = new THREE.Box3(
                new THREE.Vector3(testX - 0.25, -0.7, testZ - 0.15),
                new THREE.Vector3(testX + 0.25, 0.7, testZ + 0.15)
            );
            
            let collision = false;
            for (let collObj of collisionObjects) {
                collObj.box.setFromObject(collObj.object);
                if (npcBox.intersectsBox(collObj.box)) {
                    collision = true;
                    break;
                }
            }
            
            if (!collision) {
                this.group.position.set(testX, 0, testZ);
                validPosition = true;
            }
        }
        
        // Velocity and behavior
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.runSpeed = 0.2;
        this.scared = false;
        this.scareTimer = 0;
        this.animationTimer = 0;
        this.isMoving = false;
        
        this.group.castShadow = true;
        scene.add(this.group);
    }
    
    update(playerPos) {
        // Vector from shoplifter to player
        const dx = this.group.position.x - playerPos.x;
        const dz = this.group.position.z - playerPos.z;
        const distance = Math.sqrt(dx * dx + dz * dz);
        
        // If player is close, run away
        if (distance < 15) {
            this.scared = true;
            this.scareTimer = 30;
            
            const angle = Math.atan2(dz, dx);
            this.velocity.x = Math.cos(angle) * this.runSpeed;
            this.velocity.z = Math.sin(angle) * this.runSpeed;
        } else {
            this.scareTimer--;
            if (this.scareTimer <= 0) {
                this.scared = false;
                // Random wandering when not scared
                if (Math.random() < 0.02) {
                    this.velocity.x = (Math.random() - 0.5) * 0.1;
                    this.velocity.z = (Math.random() - 0.5) * 0.1;
                }
            }
        }
        
        // Test new position with independent axis checking
        const currentPos = this.group.position;
        
        // Helper function to check if a position collides
        const checkCollision = (x, z) => {
            const npcBox = new THREE.Box3(
                new THREE.Vector3(x - 0.25, currentPos.y - 0.7, z - 0.15),
                new THREE.Vector3(x + 0.25, currentPos.y + 0.7, z + 0.15)
            );
            
            for (let collObj of collisionObjects) {
                collObj.box.setFromObject(collObj.object);
                if (npcBox.intersectsBox(collObj.box)) {
                    return true;
                }
            }
            return false;
        };
        
        // Check boundaries
        const checkBoundaries = (x, z) => {
            const boundary = 9.5 * getMapScale();
            return x < -boundary || x > boundary || z < -boundary || z > boundary;
        };
        
        // Try to move in both X and Z independently
        let newX = currentPos.x;
        let newZ = currentPos.z;
        
        const testXPos = currentPos.x + this.velocity.x;
        const testZPos = currentPos.z + this.velocity.z;
        
        // Check X movement
        if (!checkCollision(testXPos, currentPos.z) && !checkBoundaries(testXPos, currentPos.z)) {
            newX = testXPos;
        }
        
        // Check Z movement
        if (!checkCollision(currentPos.x, testZPos) && !checkBoundaries(currentPos.x, testZPos)) {
            newZ = testZPos;
        }
        
        // If both axes are blocked, try to find escape direction
        if (newX === currentPos.x && newZ === currentPos.z && (Math.abs(this.velocity.x) > 0.01 || Math.abs(this.velocity.z) > 0.01)) {
            // Try different angles to find escape route
            const escapeAngles = [0, Math.PI/4, Math.PI/2, 3*Math.PI/4, Math.PI, -Math.PI/4, -Math.PI/2, -3*Math.PI/4];
            let foundEscape = false;
            
            for (let angle of escapeAngles) {
                const escapeSpeed = 0.15;
                const escapeX = currentPos.x + Math.cos(angle) * escapeSpeed;
                const escapeZ = currentPos.z + Math.sin(angle) * escapeSpeed;
                
                if (!checkCollision(escapeX, escapeZ) && !checkBoundaries(escapeX, escapeZ)) {
                    // Also make sure we're not moving toward the player
                    const dx = escapeX - playerController.position.x;
                    const dz = escapeZ - playerController.position.z;
                    const distance = Math.sqrt(dx * dx + dz * dz);
                    const currentDistance = Math.sqrt(
                        (currentPos.x - playerController.position.x) ** 2 + 
                        (currentPos.z - playerController.position.z) ** 2
                    );
                    
                    if (distance >= currentDistance) {
                        newX = escapeX;
                        newZ = escapeZ;
                        this.velocity.x = Math.cos(angle) * escapeSpeed;
                        this.velocity.z = Math.sin(angle) * escapeSpeed;
                        foundEscape = true;
                        break;
                    }
                }
            }
            
            if (!foundEscape) {
                // If no escape moving away from player, just try any direction
                for (let angle of escapeAngles) {
                    const escapeSpeed = 0.15;
                    const escapeX = currentPos.x + Math.cos(angle) * escapeSpeed;
                    const escapeZ = currentPos.z + Math.sin(angle) * escapeSpeed;
                    
                    if (!checkCollision(escapeX, escapeZ) && !checkBoundaries(escapeX, escapeZ)) {
                        newX = escapeX;
                        newZ = escapeZ;
                        this.velocity.x = Math.cos(angle) * escapeSpeed;
                        this.velocity.z = Math.sin(angle) * escapeSpeed;
                        break;
                    }
                }
            }
        }
        
        this.group.position.x = newX;
        this.group.position.z = newZ;
        
        // Face direction of movement
        if (Math.abs(this.velocity.x) > 0.01 || Math.abs(this.velocity.z) > 0.01) {
            this.group.rotation.y = Math.atan2(this.velocity.x, this.velocity.z);
            this.isMoving = true;
        } else {
            this.isMoving = false;
        }
        
        // Walking animation
        if (this.isMoving) {
            this.animationTimer += 0.1;
            const swingAmount = Math.sin(this.animationTimer) * 0.5; // Swing angle in radians
            
            // Arms swing opposite to legs (forward and backward)
            this.leftArm.rotation.x = swingAmount;
            this.rightArm.rotation.x = -swingAmount;
            
            // Legs swing with realistic walking motion (forward and backward)
            this.leftLeg.rotation.x = -swingAmount * 0.7;
            this.rightLeg.rotation.x = swingAmount * 0.7;
        } else {
            // Return to neutral position when not moving
            this.animationTimer = 0;
            this.leftArm.rotation.x = 0;
            this.rightArm.rotation.x = 0;
            this.leftLeg.rotation.x = 0;
            this.rightLeg.rotation.x = 0;
        }
    }
}

// Initialize shoplifters
function resetUpgrades() {
    if (confirm('Are you sure you want to reset all upgrades and gold? This cannot be undone.')) {
        totalGold = 0;
        speedLevel = 1;
        catchLevel = 1;
        incomeLevel = 1;
        mapLevel = 1;
        saveGold();
        saveUpgrades();
        updateGoldDisplay();
        updateUpgradeUI();
        alert('Upgrades and gold have been reset!');
    }
}

function initGame() {
    // Clear existing NPCs from scene
    for (let npc of game.npcs) {
        scene.remove(npc.group);
    }
    game.npcs = [];
    for (let i = 0; i < 5; i++) {
        game.npcs.push(new Shoplifter());
    }
}

// Input handling
window.addEventListener('keydown', (e) => {
    playerController.keys[e.key.toLowerCase()] = true;
});

window.addEventListener('keyup', (e) => {
    playerController.keys[e.key.toLowerCase()] = false;
});

// Catch nearby shoplifters
function catchNearby() {
    for (let i = game.npcs.length - 1; i >= 0; i--) {
        const npc = game.npcs[i];
        const dx = playerController.position.x - npc.group.position.x;
        const dz = playerController.position.z - npc.group.position.z;
        const distance = Math.sqrt(dx * dx + dz * dz);
        
        if (distance < game.catchRadius) {
            scene.remove(npc.group);
            game.npcs.splice(i, 1);
            game.caught++;
            
            if (game.caught >= game.TARGET_CATCHES) {
                game.gameOver = true;
                game.won = true;
            }
            
            // Spawn new shoplifter
            if (!game.won) {
                game.npcs.push(new Shoplifter());
            }
        }
    }
}

// Update HUD
function updateHUD() {
    document.getElementById('caught').textContent = game.caught;
    const statusEl = document.getElementById('status');
    if (game.caught < game.TARGET_CATCHES) {
        statusEl.textContent = `${game.TARGET_CATCHES - game.caught} more to catch!`;
    }
}

// Game loop
function gameLoop() {
    requestAnimationFrame(gameLoop);
    
    if (!game.gameOver) {
        // Apply camera rotation
        camera.rotation.order = 'YXZ';
        camera.rotation.y = playerController.yaw;
        camera.rotation.x = playerController.pitch;
        
        // Player movement
        const moveDirection = new THREE.Vector3(0, 0, 0);
        
        // Get forward and right vectors from camera
        const forward = new THREE.Vector3();
        const right = new THREE.Vector3();
        
        camera.getWorldDirection(forward);
        forward.y = 0;
        forward.normalize();
        
        right.crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();
        
        if (playerController.keys['w'] || playerController.keys['arrowup']) {
            moveDirection.addScaledVector(forward, playerController.moveSpeed);
        }
        if (playerController.keys['s'] || playerController.keys['arrowdown']) {
            moveDirection.addScaledVector(forward, -playerController.moveSpeed);
        }
        if (playerController.keys['a'] || playerController.keys['arrowleft']) {
            moveDirection.addScaledVector(right, -playerController.moveSpeed);
        }
        if (playerController.keys['d'] || playerController.keys['arrowright']) {
            moveDirection.addScaledVector(right, playerController.moveSpeed);
        }
        
        const newPosition = playerController.position.clone().add(moveDirection);
        
        // Check collision independently for X and Z axes
        let finalPosition = playerController.position.clone();
        
        // Test X movement
        const testXPos = playerController.position.clone();
        testXPos.x += moveDirection.x;
        if (!checkCollision(testXPos)) {
            finalPosition.x = testXPos.x;
        }
        
        // Test Z movement
        const testZPos = playerController.position.clone();
        testZPos.z += moveDirection.z;
        if (!checkCollision(testZPos)) {
            finalPosition.z = testZPos.z;
        }
        
        playerController.position.copy(finalPosition);
        
        // Boundary collision (independent axes)
        const boundary = 9.5 * getMapScale();
        playerController.position.x = Math.max(-boundary, Math.min(boundary, playerController.position.x));
        playerController.position.z = Math.max(-boundary, Math.min(boundary, playerController.position.z));
        
        // Update camera position
        camera.position.copy(playerController.position);
        
        // Update player uniform visual
        playerUniform.position.copy(playerController.position);
        playerUniform.rotation.copy(camera.rotation);
        
        // Update shoplifters
        for (let npc of game.npcs) {
            npc.update(playerController.position);
        }
        
        // Check for catching shoplifters by proximity
        catchNearby();
        
        updateHUD();
    }
    
    renderer.render(scene, camera);
    
    if (game.gameOver) {
        const gameOverEl = document.getElementById('gameOver');
        gameOverEl.style.display = 'flex';
        document.getElementById('result').textContent = game.won ? 'YOU WIN!' : 'GAME OVER';
        const scoreElement = document.getElementById('finalScore');
        scoreElement.textContent = game.caught;
        
        if (game.won && !game.goldAwarded) {
            game.goldAwarded = true;
            const goldEarned = Math.floor(game.caught * getGoldMultiplier());
            totalGold += goldEarned;
            saveGold();
            document.getElementById('goldEarned').style.display = 'block';
            document.getElementById('goldAmount').textContent = goldEarned;
        }
        
        if (game.won) {
            scoreElement.style.color = '#FFD700';
            scoreElement.style.fontWeight = 'bold';
            scoreElement.style.fontSize = '32px';
        }
    }
}

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Initialize and start - will be called when user clicks "New Game"
// initGame();
// gameLoop();

// Event listeners were set up earlier, before Three.js initialization
