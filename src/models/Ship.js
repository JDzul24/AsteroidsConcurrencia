import { GAME_CONSTANTS, ASSET_PATHS } from '../utils/Constants.js';
import { GameObject } from './GameObject.js';

export class Ship extends GameObject {
    constructor(x, y) {
        super(x, y, GAME_CONSTANTS.SHIP.RADIUS);
        this.angle = -Math.PI / 2; // Apunta hacia arriba inicialmente
        this.speed = { x: 0, y: 0 };
        this.acceleration = GAME_CONSTANTS.SHIP.ACCELERATION;
        this.maxSpeed = GAME_CONSTANTS.SHIP.MAX_SPEED;
        this.friction = GAME_CONSTANTS.SHIP.FRICTION;
    }

    update(controls) {
        if (controls.rotating !== 0) {
            this.angle += controls.rotating * GAME_CONSTANTS.SHIP.ROTATION_SPEED;
        }

        if (controls.accelerating) {
            this.speed.x += Math.cos(this.angle) * this.acceleration;
            this.speed.y += Math.sin(this.angle) * this.acceleration;
        }

        this.speed.x *= (1 - this.friction);
        this.speed.y *= (1 - this.friction);

        const currentSpeed = Math.sqrt(this.speed.x ** 2 + this.speed.y ** 2);
        if (currentSpeed > this.maxSpeed) {
            const ratio = this.maxSpeed / currentSpeed;
            this.speed.x *= ratio;
            this.speed.y *= ratio;
        }

        this.x += this.speed.x;
        this.y += this.speed.y;
    }


    update(canvas) {
        this.angle += this.rotation;
        super.update(canvas);

        // Aplicar fricción
        this.speed.x *= this.friction;
        this.speed.y *= this.friction;
    }

    serialize() {
        return {
            x: this.x,
            y: this.y,
            radius: this.radius,
            angle: this.angle,
            speed: this.speed
        };
    }

    static deserialize(data) {
        const ship = new Ship(data.x, data.y);
        ship.angle = data.angle;
        ship.speed = data.speed;
        return ship;
    }

    toWorkerData() {
        return this.serialize();
    }

    static fromWorkerData(data) {
        return this.deserialize(data);
    }

    draw(ctx) {
        if (!this.spriteLoaded) {
            // Dibujar un triángulo como fallback si el sprite no está cargado
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle);
            ctx.beginPath();
            ctx.moveTo(0, -this.radius);
            ctx.lineTo(this.radius, this.radius);
            ctx.lineTo(-this.radius, this.radius);
            ctx.closePath();
            ctx.strokeStyle = 'white';
            ctx.stroke();
            ctx.restore();
            return;
        }

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle + Math.PI / 2); // Ajustar rotación para el sprite

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