// Crear una instancia de Ship directamente en el worker
class Ship {
    constructor(x, y, radius, angle) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.angle = angle;
        this.velocity = { x: 0, y: 0 };
        this.rotationSpeed = 0.1;
        this.thrust = 0.1;
        this.friction = 0.99;
        this.isAccelerating = false;
    }

    update(canvasWidth, canvasHeight) {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.velocity.x *= this.friction;
        this.velocity.y *= this.friction;
        this.wrapAround(canvasWidth, canvasHeight);
    }

    rotate(direction) {
        this.angle += direction * this.rotationSpeed;
    }

    accelerate() {
        this.isAccelerating = true;
        const acceleration = {
            x: Math.cos(this.angle) * this.thrust,
            y: Math.sin(this.angle) * this.thrust
        };
        
        this.velocity.x += acceleration.x;
        this.velocity.y += acceleration.y;

        const maxSpeed = 5;
        const currentSpeed = Math.sqrt(this.velocity.x ** 2 + this.velocity.y ** 2);
        if (currentSpeed > maxSpeed) {
            const ratio = maxSpeed / currentSpeed;
            this.velocity.x *= ratio;
            this.velocity.y *= ratio;
        }
    }

    stopAccelerating() {
        this.isAccelerating = false;
    }

    wrapAround(canvasWidth, canvasHeight) {
        if (this.x < 0) this.x = canvasWidth;
        if (this.x > canvasWidth) this.x = 0;
        if (this.y < 0) this.y = canvasHeight;
        if (this.y > canvasHeight) this.y = 0;
    }

    getShipData() {
        return {
            x: this.x,
            y: this.y,
            radius: this.radius,
            angle: this.angle,
            velocity: this.velocity,
            isAccelerating: this.isAccelerating
        };
    }
}

let ship = null;
let canvasDimensions = null;

self.onmessage = function(event) {
    const { type, data } = event.data;

    switch(type) {
        case 'INIT':
            canvasDimensions = data.canvasDimensions;
            ship = new Ship(
                canvasDimensions.width / 2,
                canvasDimensions.height / 2,
                20,
                0
            );
            self.postMessage({
                type: 'SHIP_READY',
                ship: ship.getShipData()
            });
            break;

        case 'UPDATE':
            if (!ship) return;

            // Procesar controles
            if (data.keysPressed['ArrowLeft']) ship.rotate(-1);
            if (data.keysPressed['ArrowRight']) ship.rotate(1);
            if (data.keysPressed['ArrowUp']) {
                ship.accelerate();
            } else {
                ship.stopAccelerating();
            }

            // Actualizar posición
            ship.update(canvasDimensions.width, canvasDimensions.height);

            // Enviar datos actualizados
            self.postMessage({
                type: 'SHIP_UPDATE',
                ship: ship.getShipData()
            });
            break;
    }
};