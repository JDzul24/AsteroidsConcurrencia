// Importar la clase Asteroid
importScripts('/src/models/asteroidModel.js');

let asteroids = [];
const MAX_ASTEROIDS = 6;

self.addEventListener('message', (event) => {
    const { type, asteroids: asteroidsData, canvasDimensions } = event.data;

    switch(type) {
        case 'INIT':
            // Inicializar asteroides
            asteroids = [];
            for (let i = 0; i < MAX_ASTEROIDS; i++) {
                asteroids.push(new Asteroid(
                    Math.random() * canvasDimensions.width,
                    Math.random() * canvasDimensions.height,
                    Math.random() * 30 + 10,
                    6
                ));
            }
            break;

        case 'UPDATE':
            if (!Array.isArray(asteroids)) {
                console.error('asteroids no es un array:', asteroids);
                return;
            }

            // Actualizar cada asteroide
            asteroids.forEach(asteroid => {
                asteroid.update(canvasDimensions.width, canvasDimensions.height);
            });

            // Enviar datos actualizados
            self.postMessage({
                type: 'ASTEROIDS_UPDATE',
                asteroids: asteroids.map(asteroid => asteroid.getAsteroidData())
            });
            break;
    }
});

class Asteroid {
    constructor(x, y, radius, vertices, angle, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.vertices = vertices;
        this.angle = angle;
        this.velocity = velocity;
        this.rotationSpeed = (Math.random() - 0.5) * 0.05;
    }

    update(canvasWidth, canvasHeight) {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.angle += this.rotationSpeed;
        this.wrapAround(canvasWidth, canvasHeight);
    }

    wrapAround(canvasWidth, canvasHeight) {
        if (this.x < -this.radius) this.x = canvasWidth + this.radius;
        if (this.x > canvasWidth + this.radius) this.x = -this.radius;
        if (this.y < -this.radius) this.y = canvasHeight + this.radius;
        if (this.y > canvasHeight + this.radius) this.y = -this.radius;
    }

    getAsteroidData() {
        return {
            x: this.x,
            y: this.y,
            radius: this.radius,
            angle: this.angle,
            vertices: this.vertices,
            velocity: this.velocity
        };
    }
}