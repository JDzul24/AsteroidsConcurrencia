import { GAME_CONSTANTS } from '../utils/Constants.js';
import { GameObject } from './GameObject.js';
import { MathUtils } from '../utils/MathUtils.js';

export class Bullet extends GameObject {
    constructor(x, y, angle) {
        super(x, y, GAME_CONSTANTS.BULLET.RADIUS);
        this.angle = angle;
        this.speed = {
            x: Math.cos(angle) * GAME_CONSTANTS.BULLET.SPEED,
            y: Math.sin(angle) * GAME_CONSTANTS.BULLET.SPEED
        };
        this.lifespan = GAME_CONSTANTS.BULLET.LIFESPAN;
        this.currentLife = 0;
    }

    update(canvas) {
        super.update(canvas);
        this.currentLife++;
        return this.currentLife < this.lifespan;
    }

    isOffscreen(canvas) {
        return this.x < 0 || this.x > canvas.width || 
               this.y < 0 || this.y > canvas.height;
    }

    serialize() {
        return {
            x: this.x,
            y: this.y,
            radius: this.radius,
            angle: this.angle,
            speed: this.speed,
            currentLife: this.currentLife
        };
    }

    static deserialize(data) {
        const bullet = new Bullet(data.x, data.y, data.angle);
        bullet.speed = data.speed;
        bullet.currentLife = data.currentLife;
        return bullet;
    }

    toWorkerData() {
        return this.serialize();
    }

    static fromWorkerData(data) {
        return this.deserialize(data);
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        
        // Crear un gradiente para el efecto de la bala
        let gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.radius);
        gradient.addColorStop(0, 'white');
        gradient.addColorStop(1, 'rgba(255, 255, 0, 0)');
        
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        
        ctx.restore();
    }
}