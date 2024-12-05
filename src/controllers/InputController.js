import { GAME_CONSTANTS } from '../utils/Constants.js';

export class InputController {
    constructor(gameController) {
        this.gameController = gameController;
        this.keysPressed = {};
        this.controls = {
            accelerating: false,
            rotating: 0, // -1 izquierda, 0 ninguno, 1 derecha
            shooting: false
        };
        
        // Mapeo de teclas usando las constantes
        this.keyMap = GAME_CONSTANTS.CONTROLS.KEY_MAP;

        // Configuración de disparo desde constantes
        this.shootCooldown = GAME_CONSTANTS.CONTROLS.SHOOT_COOLDOWN;
        this.rotationSpeed = GAME_CONSTANTS.SHIP.ROTATION_SPEED;
        this.lastShootTime = 0;

        this.setupEventListeners();
    }

    setupEventListeners() {
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.handleBlur = this.handleBlur.bind(this);

        document.addEventListener('keydown', this.handleKeyDown);
        document.addEventListener('keyup', this.handleKeyUp);
        window.addEventListener('blur', this.handleBlur);
    }

    handleKeyDown(event) {
        const key = event.key.toLowerCase();
        
        if (Object.keys(this.keyMap).includes(key)) {
            event.preventDefault();
        }

        this.keysPressed[key] = true;

        // Usar las constantes para el mapeo de teclas
        switch (key) {
            case GAME_CONSTANTS.CONTROLS.KEYS.ACCELERATE:
                this.controls.accelerating = true;
                break;
            case GAME_CONSTANTS.CONTROLS.KEYS.ROTATE_LEFT:
                this.controls.rotating = -this.rotationSpeed;
                break;
            case GAME_CONSTANTS.CONTROLS.KEYS.ROTATE_RIGHT:
                this.controls.rotating = this.rotationSpeed;
                break;
            case GAME_CONSTANTS.CONTROLS.KEYS.SHOOT:
                this.handleShoot();
                break;
            case GAME_CONSTANTS.CONTROLS.KEYS.PAUSE:
                this.handlePause();
                break;
        }
    }

    handleKeyUp(event) {
        const key = event.key.toLowerCase();
        this.keysPressed[key] = false;

        switch (key) {
            case GAME_CONSTANTS.CONTROLS.KEYS.ACCELERATE:
                this.controls.accelerating = false;
                break;
            case GAME_CONSTANTS.CONTROLS.KEYS.ROTATE_LEFT:
                if (this.controls.rotating === -this.rotationSpeed) {
                    this.controls.rotating = 0;
                }
                break;
            case GAME_CONSTANTS.CONTROLS.KEYS.ROTATE_RIGHT:
                if (this.controls.rotating === this.rotationSpeed) {
                    this.controls.rotating = 0;
                }
                break;
            case GAME_CONSTANTS.CONTROLS.KEYS.SHOOT:
                this.controls.shooting = false;
                break;
        }
    }

    handleBlur() {
        this.keysPressed = {};
        this.controls = {
            accelerating: false,
            rotating: 0,
            shooting: false
        };
    }

    handleShoot() {
        const currentTime = Date.now();
        if (currentTime - this.lastShootTime >= this.shootCooldown) {
            this.controls.shooting = true;
            this.gameController.shoot();
            this.lastShootTime = currentTime;
        }
    }

    handlePause() {
        if (this.gameController.isRunning) {
            if (this.gameController.isPaused) {
                this.gameController.resume();
            } else {
                this.gameController.pause();
            }
        }
    }

    getControls() {
        return { ...this.controls };
    }

    isKeyPressed(key) {
        return this.keysPressed[key] || false;
    }

    destroy() {
        document.removeEventListener('keydown', this.handleKeyDown);
        document.removeEventListener('keyup', this.handleKeyUp);
        window.removeEventListener('blur', this.handleBlur);
    }

    setEnabled(enabled) {
        if (!enabled) {
            this.handleBlur();
        }
    }

    reset() {
        this.handleBlur();
        this.lastShootTime = 0;
    }
}