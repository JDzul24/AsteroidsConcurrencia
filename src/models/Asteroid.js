import { GAME_CONSTANTS } from '../utils/Constants.js';
import { GameObject } from './GameObject.js';
import { MathUtils } from '../utils/MathUtils.js';

export class Asteroid extends GameObject {
    constructor(x, y, size, speed = null) {
        // El radio se calcula basado en el tamaño
        const radius = size * GAME_CONSTANTS.ASTEROID.BASE_RADIUS;
        super(x, y, radius);

        this.size = size;
        this.rotation = 0;
        this.rotationSpeed = MathUtils.randomFloat(
            GAME_CONSTANTS.ASTEROID.ROTATION.MIN_SPEED,
            GAME_CONSTANTS.ASTEROID.ROTATION.MAX_SPEED
        );

        // Si no se proporciona velocidad, generar una aleatoria
        if (!speed) {
            this.speed = {
                x: MathUtils.randomFloat(
                    GAME_CONSTANTS.ASTEROID.MIN_SPEED,
                    GAME_CONSTANTS.ASTEROID.MAX_SPEED
                ),
                y: MathUtils.randomFloat(
                    GAME_CONSTANTS.ASTEROID.MIN_SPEED,
                    GAME_CONSTANTS.ASTEROID.MAX_SPEED
                )
            };
        } else {
            this.speed = speed;
        }

        // Inicializar sprite
        this.sprite = new Image();
        this.sprite.src = ASSET_PATHS.IMAGES.ASTEROID;
        this.spriteLoaded = false;
        this.sprite.onload = () => {
            this.spriteLoaded = true;
        };
    }

    update(canvas) {
        // Actualizar posición
        super.update(canvas);
        
        // Actualizar rotación
        this.rotation += this.rotationSpeed;
        
        // Normalizar rotación
        if (this.rotation >= Math.PI * 2) {
            this.rotation -= Math.PI * 2;
        }
    }

    split() {
        if (this.size <= 1) return null;

        const newAsteroids = [];
        const newSize = this.size - 1;

        for (let i = 0; i < GAME_CONSTANTS.ASTEROID.SPLIT_COUNT; i++) {
            const angleOffset = (Math.PI * 2 * i) / GAME_CONSTANTS.ASTEROID.SPLIT_COUNT;
            
            const newSpeed = {
                x: Math.cos(angleOffset) * MathUtils.randomFloat(
                    GAME_CONSTANTS.ASTEROID.SPLIT_SPEED_MIN,
                    GAME_CONSTANTS.ASTEROID.SPLIT_SPEED_MAX
                ),
                y: Math.sin(angleOffset) * MathUtils.randomFloat(
                    GAME_CONSTANTS.ASTEROID.SPLIT_SPEED_MIN,
                    GAME_CONSTANTS.ASTEROID.SPLIT_SPEED_MAX
                )
            };

            newAsteroids.push(new Asteroid(this.x, this.y, newSize, newSpeed));
        }

        return newAsteroids;
    }

    serialize() {
        return {
            x: this.x,
            y: this.y,
            radius: this.radius,
            size: this.size,
            speed: this.speed,
            rotation: this.rotation
        };
    }

    static deserialize(data) {
        const asteroid = new Asteroid(data.x, data.y, data.size);
        asteroid.speed = data.speed;
        asteroid.rotation = data.rotation;
        return asteroid;
    }

    // Métodos para el worker
    toWorkerData() {
        return {
            x: this.x,
            y: this.y,
            radius: this.radius,
            size: this.size,
            speed: this.speed,
            rotation: this.rotation
        };
    }

    static fromWorkerData(data) {
        return this.deserialize(data);
    }

    // Método para dibujar el asteroide
    draw(ctx) {
        if (!this.spriteLoaded) {
            // Dibujar un círculo como fallback si el sprite no está cargado
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.beginPath();
            ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
            ctx.strokeStyle = 'white';
            ctx.stroke();
            ctx.restore();
            return;
        }

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        // Dibujar el sprite
        ctx.drawImage(
            this.sprite,
            -this.radius,
            -this.radius,
            this.radius * 2,
            this.radius * 2
        );
        
        ctx.restore();
    }
}