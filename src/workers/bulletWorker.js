importScripts('../models/GameObjectWorker.js');
importScripts('../utils/MathUtilsWorker.js');

class Bullet extends GameObject {
    constructor(x, y, angle) {
        super(x, y, 10); // radio de 10 como en el original
        this.angle = angle;
        this.speed = {
            x: Math.cos(angle) * 5, // velocidad 5 como en el original
            y: Math.sin(angle) * 5
        };
        this.lifespan = 60; // frames de vida para la bala
        this.currentLife = 0;
    }

    update(canvas) {
        super.updatePosition(canvas);
        this.currentLife++;
        return this.currentLife < this.lifespan;
    }

    isOffscreen(canvas) {
        return this.x < 0 || this.x > canvas.width || 
               this.y < 0 || this.y > canvas.height;
    }
}

let bullets = [];

self.onmessage = function(e) {
    switch(e.data.type) {
        case 'CREATE':
            const { x, y, angle } = e.data;
            const bullet = new Bullet(x, y, angle);
            bullets.push(bullet);
            self.postMessage({
                type: 'BULLET_CREATED',
                bullet: {
                    x: bullet.x,
                    y: bullet.y,
                    radius: bullet.radius,
                    angle: bullet.angle
                }
            });
            break;

        case 'UPDATE':
            const canvas = e.data.canvas;
            bullets = bullets.filter((bullet, index) => {
                const isAlive = bullet.update(canvas);
                const isOnscreen = !bullet.isOffscreen(canvas);
                
                if (!isAlive || !isOnscreen) {
                    self.postMessage({
                        type: 'BULLET_REMOVED',
                        index: index
                    });
                    return false;
                }
                return true;
            });

            self.postMessage({
                type: 'BULLETS_UPDATED',
                bullets: bullets.map(bullet => ({
                    x: bullet.x,
                    y: bullet.y,
                    radius: bullet.radius,
                    angle: bullet.angle
                }))
            });
            break;

        case 'REMOVE':
            const bulletIndex = e.data.index;
            if (bulletIndex >= 0 && bulletIndex < bullets.length) {
                bullets.splice(bulletIndex, 1);
                self.postMessage({
                    type: 'BULLET_REMOVED',
                    index: bulletIndex
                });
            }
            break;

        case 'CLEAR':
            bullets = [];
            self.postMessage({
                type: 'BULLETS_CLEARED'
            });
            break;
    }
};