import { GAME_CONSTANTS, ASSET_PATHS } from '/src/utils/Constants.js';
import { CollisionController } from './CollisionController.js';
import { InputController } from './InputController.js';
import { AudioService } from '../services/AudioService.js';
import { ScoreService } from '../services/ScoreService.js';
import { GameView } from '../views/GameView.js';
import { UIView } from '../views/UIView.js';
import { Ship } from '../models/Ship.js';

export class GameController {
    constructor(canvas) {
        this.canvas = canvas;
        this.initializeControllers();
        this.initializeServices();
        this.initializeViews();
        this.initializeWorkers();
        this.setupGameState();
    }

    initializeControllers() {
        this.collisionController = new CollisionController(this);
        this.inputController = new InputController(this);
    }

    initializeServices() {
        this.audioService = new AudioService({
            shoot: ASSET_PATHS.SOUNDS.SHOOT,
            explosion: ASSET_PATHS.SOUNDS.EXPLOSION,
            background: ASSET_PATHS.SOUNDS.BACKGROUND
        });
        this.scoreService = new ScoreService();
    }

    initializeViews() {
        this.gameView = new GameView(this.canvas);
        this.uiView = new UIView();
    }

    initializeWorkers() {
        // Inicializar Workers
        this.shipWorker = new Worker('src/workers/shipWorker.js');
        this.asteroidWorker = new Worker('src/workers/asteroidWorker.js');
        this.bulletWorker = new Worker('src/workers/bulletWorker.js');

        this.setupWorkerListeners();
    }

    setupGameState() {
        this.gameObjects = {
            ship: null,
            asteroids: [],
            bullets: []
        };
        this.isRunning = false;
        this.isPaused = false;
        this.animationFrameId = null;
    }

    setupWorkerListeners() {
        // Ship Worker Listener
        this.shipWorker.onmessage = (e) => {
            switch (e.data.type) {
                case 'SHIP_UPDATED':
                    this.gameObjects.ship = e.data.ship;
                    break;
            }
        };

        // Asteroid Worker Listener
        this.asteroidWorker.onmessage = (e) => {
            switch (e.data.type) {
                case 'ASTEROID_CREATED':
                    this.gameObjects.asteroids.push(e.data.asteroid);
                    break;
                case 'POSITIONS_UPDATED':
                    this.gameObjects.asteroids = e.data.asteroids;
                    break;
                case 'ASTEROID_REMOVED':
                    this.gameObjects.asteroids.splice(e.data.index, 1);
                    break;
            }
        };

        // Bullet Worker Listener
        this.bulletWorker.onmessage = (e) => {
            switch (e.data.type) {
                case 'BULLET_CREATED':
                    this.gameObjects.bullets.push(e.data.bullet);
                    break;
                case 'BULLETS_UPDATED':
                    this.gameObjects.bullets = e.data.bullets;
                    break;
                case 'BULLET_REMOVED':
                    this.gameObjects.bullets.splice(e.data.index, 1);
                    break;
            }
        };
    }

    start() {
        this.setupGameState();
        this.spawnInitialAsteroids();
        this.createShip(); // Asegúrate de que este método inicialice la nave correctamente
        this.isRunning = true;
        this.gameLoop();
    }
    
    createShip() {
        const { width, height } = this.canvas;
        this.shipWorker.postMessage({
            type: 'INIT',
            x: width / 2,
            y: height / 2
        });
    }

    spawnInitialAsteroids() {
        for (let i = 0; i < GAME_CONSTANTS.ASTEROID.INITIAL_COUNT; i++) {
            this.createAsteroid(
                Math.random() * this.canvas.width,
                Math.random() * this.canvas.height,
                Math.floor(Math.random() * 
                    (GAME_CONSTANTS.ASTEROID.MAX_SIZE - GAME_CONSTANTS.ASTEROID.MIN_SIZE + 1)) + 
                    GAME_CONSTANTS.ASTEROID.MIN_SIZE
            );
        }
    }

    gameLoop() {
        if (!this.isRunning || this.isPaused) return;
    
        const controls = this.inputController.getControls();
    
        // Actualizar nave
        this.shipWorker.postMessage({
            type: 'UPDATE',
            controls: controls,
            canvas: {
                width: this.canvas.width,
                height: this.canvas.height
            }
        });
    
        // Actualizar asteroides
        this.asteroidWorker.postMessage({
            type: 'UPDATE',
            canvas: {
                width: this.canvas.width,
                height: this.canvas.height
            }
        });
    
        // Actualizar disparos
        this.bulletWorker.postMessage({
            type: 'UPDATE',
            canvas: {
                width: this.canvas.width,
                height: this.canvas.height
            }
        });
    
        // Verificar colisiones y renderizar
        this.collisionController.checkCollisions(this.gameObjects);
        this.gameView.drawGame(this.gameObjects);
    
        this.animationFrameId = requestAnimationFrame(() => this.gameLoop());
    }

    updateGameState() {
        // Actualizar nave
        const controls = this.inputController.getControls();

    // Enviar controles al worker de la nave
        this.shipWorker.postMessage({
        type: 'UPDATE',
        controls: controls,
        canvas: {
            width: this.canvas.width,
            height: this.canvas.height
        }
    });

        // Actualizar asteroides
        this.asteroidWorker.postMessage({
            type: 'UPDATE',
            canvas: {
                width: this.canvas.width,
                height: this.canvas.height
            }
        });

        // Actualizar balas
        this.bulletWorker.postMessage({
            type: 'UPDATE',
            canvas: {
                width: this.canvas.width,
                height: this.canvas.height
            }
        });
    }

    render() {
        this.gameView.clear();
        this.gameView.drawGame(this.gameObjects);
        this.uiView.updateScore(this.scoreService.getScore());
        this.uiView.updateLives(this.scoreService.getLives());
    }

    shoot() {
        if (!this.gameObjects.ship || !this.isRunning || this.isPaused) return;
    
        const ship = this.gameObjects.ship;
        const bulletX = ship.x + Math.cos(ship.angle) * ship.radius;
        const bulletY = ship.y + Math.sin(ship.angle) * ship.radius;
    
        this.bulletWorker.postMessage({
            type: 'CREATE',
            x: bulletX,
            y: bulletY,
            angle: ship.angle
        });
    
        this.audioService.playShoot();
    }

    createAsteroid(x, y, size, speed = null) {
        this.asteroidWorker.postMessage({
            type: 'CREATE',
            x, y, size, speed
        });
    }

    handleShipCollision() {
        this.audioService.playExplosion();
        this.scoreService.decrementLives();
        
        if (this.scoreService.getLives() <= 0) {
            this.endGame();
        } else {
            this.resetShipPosition();
        }
    }

    resetShipPosition() {
        this.shipWorker.postMessage({
            type: 'RESET',
            canvasWidth: this.canvas.width,
            canvasHeight: this.canvas.height
        });
    }

    updateScore(points) {
        this.scoreService.addPoints(points);
        this.uiView.updateScore(this.scoreService.getScore());
    }

    checkAsteroidCount() {
        if (this.gameObjects.asteroids.length < GAME_CONSTANTS.ASTEROID.INITIAL_COUNT) {
            this.spawnInitialAsteroids();
        }
    }

    togglePause() {
    this.isPaused = !this.isPaused;
    if (!this.isPaused) {
        this.gameLoop();
    }
}

    resume() {
        this.isPaused = false;
        this.audioService.resumeBackground();
        this.gameLoop();
    }

    endGame() {
        this.isRunning = false;
        this.audioService.stopBackground();
        this.uiView.showGameOver(this.scoreService.getScore());
        cancelAnimationFrame(this.animationFrameId);
    }

    restart() {
        // Detener y limpiar el estado actual
        cancelAnimationFrame(this.animationFrameId);
        
        // Reiniciar workers
        this.shipWorker.postMessage({ type: 'RESET' });
        this.asteroidWorker.postMessage({ type: 'CLEAR' });
        this.bulletWorker.postMessage({ type: 'CLEAR' });
        
        // Reiniciar estado del juego
        this.setupGameState();
        
        // Ocultar pantalla de game over
        this.uiView.hideGameOver();
        
        // Crear nueva nave y asteroides
        this.createShip();
        this.spawnInitialAsteroids();
        
        // Reiniciar servicios
        this.scoreService.reset();
        
        // Reiniciar el juego
        this.isRunning = true;
        this.isPaused = false;
        this.gameLoop();
    }
    
    setupGameState() {
        this.gameObjects = {
            ship: null,
            asteroids: [],
            bullets: []
        };
    }
    // Métodos de acceso para otros controladores
    getAsteroidByIndex(index) {
        return this.gameObjects.asteroids[index];
    }

    removeAsteroid(index) {
        this.asteroidWorker.postMessage({
            type: 'REMOVE',
            index: index
        });
    }

    removeBullet(index) {
        this.bulletWorker.postMessage({
            type: 'REMOVE',
            index: index
        });
    }

    destroy() {
        this.isRunning = false;
        cancelAnimationFrame(this.animationFrameId);
        this.audioService.destroy();
        this.collisionController.destroy();
        this.shipWorker.terminate();
        this.asteroidWorker.terminate();
        this.bulletWorker.terminate();
    }
}