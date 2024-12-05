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

    update(controls, canvas) {
        // Actualizar rotación
        if (controls.rotating !== 0) {
            this.angle += controls.rotating * (Math.PI / 32);
        }

        // Actualizar aceleración
        if (controls.accelerating) {
            this.speed.x += Math.cos(this.angle) * this.acceleration;
            this.speed.y += Math.sin(this.angle) * this.acceleration;
        }

        // Aplicar fricción
        this.speed.x *= (1 - this.friction);
        this.speed.y *= (1 - this.friction);

        // Actualizar posición y mantener dentro del canvas
        this.updatePosition(canvas);
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
                
                const { controls, canvas } = e.data;
                ship.update(controls, canvas);
                
                self.postMessage({
                    type: 'SHIP_UPDATED',
                    ship: {
                        x: ship.x,
                        y: ship.y,
                        angle: ship.angle,
                        speed: ship.speed,
                        radius: ship.radius
                    }
                });
                break;

        
    }
};