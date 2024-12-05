importScripts('../models/GameObjectWorker.js');

class Ship extends GameObject {
    constructor(x, y) {
        super(x, y, 20);
        this.angle = 0;
        this.rotation = 0;
        this.acceleration = 1;
        this.maxSpeed = 2;
        this.friction = 0.3;
    }

    rotate(dir) {
        this.rotation = dir * 2 * Math.PI / 180;
    }

    accelerate(dir) {
        this.speed.x += Math.cos(this.angle) * this.acceleration * dir;
        this.speed.y += Math.sin(this.angle) * this.acceleration * dir;

        const currentSpeed = Math.sqrt(this.speed.x ** 2 + this.speed.y ** 2);
        if (currentSpeed > this.maxSpeed) {
            const ratio = this.maxSpeed / currentSpeed;
            this.speed.x *= ratio;
            this.speed.y *= ratio;
        }
    }

    update(canvas) {
        this.angle += this.rotation;
        super.updatePosition(canvas);
        
        // Aplicar fricción
        this.speed.x *= this.friction;
        this.speed.y *= this.friction;
    }
}

let ship = null;

self.onmessage = function(e) {
    switch(e.data.type) {
        case 'INIT':
            const { x, y } = e.data;
            ship = new Ship(x, y);
            break;

        case 'UPDATE':
            if (!ship) return;
            
            const { canvas, controls } = e.data;
            
            if (controls.accelerating) {
                ship.accelerate(1);
            }
            if (controls.rotating !== 0) {
                ship.rotate(controls.rotating);
            }
            
            ship.update(canvas);
            
            self.postMessage({
                type: 'SHIP_UPDATED',
                ship: {
                    x: ship.x,
                    y: ship.y,
                    angle: ship.angle,
                    speed: ship.speed
                }
            });
            break;

        case 'RESET':
            if (!ship) return;
            const { canvasWidth, canvasHeight } = e.data;
            ship.x = canvasWidth / 2;
            ship.y = canvasHeight / 2;
            ship.speed = { x: 0, y: 0 };
            ship.angle = 0;
            break;
    }
};