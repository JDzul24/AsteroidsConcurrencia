importScripts('../utils/MathUtilsWorker.js');

// Estado del juego
let gameState = {
    score: 0,
    lives: 3,
    isGameOver: false,
    isPaused: false,
    level: 1
};

// Configuración del juego
const GAME_CONFIG = {
    initialAsteroids: 5,
    pointsPerAsteroid: 100,
    maxLives: 3,
    levelUpThreshold: 1000
};

// Gestor de colisiones
function checkCollisions(gameObjects) {
    const { ship, asteroids, bullets } = gameObjects;
    let collisionResults = {
        shipHit: false,
        destroyedAsteroids: [],
        destroyedBullets: [],
        score: 0
    };

    // Colisiones nave-asteroide
    if (ship) {
        for (let i = 0; i < asteroids.length; i++) {
            if (MathUtils.distanceBetween(
                ship.x, ship.y,
                asteroids[i].x, asteroids[i].y
            ) < ship.radius + asteroids[i].radius) {
                collisionResults.shipHit = true;
                break;
            }
        }
    }

    // Colisiones bala-asteroide
    bullets.forEach((bullet, bulletIndex) => {
        asteroids.forEach((asteroid, asteroidIndex) => {
            if (MathUtils.distanceBetween(
                bullet.x, bullet.y,
                asteroid.x, asteroid.y
            ) < bullet.radius + asteroid.radius) {
                if (!collisionResults.destroyedAsteroids.includes(asteroidIndex)) {
                    collisionResults.destroyedAsteroids.push(asteroidIndex);
                }
                if (!collisionResults.destroyedBullets.includes(bulletIndex)) {
                    collisionResults.destroyedBullets.push(bulletIndex);
                }
                collisionResults.score += GAME_CONFIG.pointsPerAsteroid;
            }
        });
    });

    return collisionResults;
}

// Gestor de nivel
function handleLevelProgression(currentScore) {
    const newLevel = Math.floor(currentScore / GAME_CONFIG.levelUpThreshold) + 1;
    if (newLevel > gameState.level) {
        gameState.level = newLevel;
        return true;
    }
    return false;
}

self.onmessage = function(e) {
    switch(e.data.type) {
        case 'INIT_GAME':
            gameState = {
                score: 0,
                lives: GAME_CONFIG.maxLives,
                isGameOver: false,
                isPaused: false,
                level: 1
            };
            self.postMessage({
                type: 'GAME_INITIALIZED',
                gameState: gameState
            });
            break;

        case 'CHECK_COLLISIONS':
            const collisionResults = checkCollisions(e.data.gameObjects);
            
            if (collisionResults.shipHit) {
                gameState.lives--;
                if (gameState.lives <= 0) {
                    gameState.isGameOver = true;
                }
            }

            gameState.score += collisionResults.score;
            
            // Verificar progresión de nivel
            const leveledUp = handleLevelProgression(gameState.score);

            self.postMessage({
                type: 'COLLISION_RESULTS',
                results: collisionResults,
                gameState: gameState,
                leveledUp: leveledUp
            });
            break;

        case 'UPDATE_GAME_STATE':
            Object.assign(gameState, e.data.updates);
            self.postMessage({
                type: 'GAME_STATE_UPDATED',
                gameState: gameState
            });
            break;

        case 'PAUSE_GAME':
            gameState.isPaused = e.data.isPaused;
            self.postMessage({
                type: 'GAME_PAUSE_UPDATED',
                isPaused: gameState.isPaused
            });
            break;

        case 'RESET_GAME':
            gameState = {
                score: 0,
                lives: GAME_CONFIG.maxLives,
                isGameOver: false,
                isPaused: false,
                level: 1
            };
            self.postMessage({
                type: 'GAME_RESET',
                gameState: gameState
            });
            break;
    }
};