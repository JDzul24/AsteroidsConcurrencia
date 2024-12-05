import { GAME_CONSTANTS } from '../utils/Constants.js';
import { Ship } from '../models/Ship.js';
import { Asteroid } from '../models/Asteroid.js';
import { Bullet } from '../models/Bullet.js';

export class GameView {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.canvas.width = GAME_CONSTANTS.CANVAS.WIDTH;
        this.canvas.height = GAME_CONSTANTS.CANVAS.HEIGHT;
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawGame(gameObjects) {
        this.clear();
        this.drawShip(gameObjects.ship);
        this.drawAsteroids(gameObjects.asteroids);
        this.drawBullets(gameObjects.bullets);
    }

    drawShip(shipData) {
        if (!shipData) return;
        const ship = Ship.fromWorkerData(shipData);
        ship.draw(this.ctx);
    }

    drawAsteroids(asteroidsData) {
        asteroidsData.forEach(asteroidData => {
            const asteroid = Asteroid.fromWorkerData(asteroidData);
            asteroid.draw(this.ctx);
        });
    }

    drawBullets(bulletsData) {
        bulletsData.forEach(bulletData => {
            const bullet = Bullet.fromWorkerData(bulletData);
            bullet.draw(this.ctx);
        });
    }
}