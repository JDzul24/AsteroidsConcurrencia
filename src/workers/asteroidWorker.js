importScripts('../utils/MathUtilsWorker.js');
importScripts('../models/GameObjectWorker.js');

class Asteroid extends GameObject {
    constructor(x, y, size) {
        super(x, y, size * 10);
        this.size = size;
        this.speed = {
            x: MathUtils.randomFloat(-1, 1),
            y: MathUtils.randomFloat(-1, 1)
        };
    }
}

let asteroids = [];

self.onmessage = function(e) {
    switch(e.data.type) {
        case 'CREATE':
            const { x, y, size } = e.data;
            const asteroid = new Asteroid(x, y, size);
            asteroids.push(asteroid);
            self.postMessage({
                type: 'ASTEROID_CREATED',
                asteroid: {
                    x: asteroid.x,
                    y: asteroid.y,
                    radius: asteroid.radius,
                    size: asteroid.size,
                    speed: asteroid.speed
                }
            });
            break;

        case 'UPDATE':
            const canvas = e.data.canvas;
            asteroids.forEach(asteroid => {
                asteroid.updatePosition(canvas);
            });
            
            self.postMessage({
                type: 'POSITIONS_UPDATED',
                asteroids: asteroids.map(asteroid => ({
                    x: asteroid.x,
                    y: asteroid.y,
                    radius: asteroid.radius,
                    size: asteroid.size
                }))
            });
            break;

        case 'REMOVE':
            const index = e.data.index;
            if (index >= 0 && index < asteroids.length) {
                asteroids.splice(index, 1);
                self.postMessage({
                    type: 'ASTEROID_REMOVED',
                    index: index
                });
            }
            break;
    }
};