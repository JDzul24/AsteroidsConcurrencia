import { GAME_CONSTANTS } from '../utils/Constants.js';
import { MathUtils } from '../utils/MathUtils.js';

export class CollisionController {
    constructor(gameController) {
        this.gameController = gameController;
        this.collisionWorker = new Worker('src/workers/gameWorker.js');
        this.setupWorkerListeners();
    }

    setupWorkerListeners() {
        this.collisionWorker.onmessage = (e) => {
            switch (e.data.type) {
                case GAME_CONSTANTS.WORKER_MESSAGES.COLLISION.RESULT:
                    this.handleCollisionResults(e.data.results);
                    break;
            }
        };
    }

    checkCollisions(gameObjects) {
        this.collisionWorker.postMessage({
            type: GAME_CONSTANTS.WORKER_MESSAGES.COLLISION.CHECK,
            gameObjects: {
                ship: {
                    x: gameObjects.ship.x,
                    y: gameObjects.ship.y,
                    radius: gameObjects.ship.radius
                },
                asteroids: gameObjects.asteroids.map(asteroid => ({
                    x: asteroid.x,
                    y: asteroid.y,
                    radius: asteroid.radius,
                    size: asteroid.size
                })),
                bullets: gameObjects.bullets.map(bullet => ({
                    x: bullet.x,
                    y: bullet.y,
                    radius: bullet.radius
                }))
            }
        });
    }

    handleCollisionResults(results) {
        const { shipHit, destroyedAsteroids, destroyedBullets, score } = results;

        // Manejar colisión de la nave
        if (shipHit) {
            this.gameController.handleShipCollision();
        }

        // Manejar destrucción de asteroides
        if (destroyedAsteroids.length > 0) {
            this.handleAsteroidDestruction(destroyedAsteroids);
        }

        // Manejar eliminación de balas
        if (destroyedBullets.length > 0) {
            this.handleBulletRemoval(destroyedBullets);
        }

        // Actualizar puntuación
        if (score > 0) {
            this.gameController.updateScore(score);
        }
    }

    handleAsteroidDestruction(destroyedIndices) {
        // Ordenar índices en orden descendente para eliminar sin afectar otros índices
        destroyedIndices.sort((a, b) => b - a);
        
        destroyedIndices.forEach(index => {
            const asteroid = this.gameController.getAsteroidByIndex(index);
            if (asteroid) {
                // Crear asteroides más pequeños si el tamaño lo permite
                if (asteroid.size > 1) {
                    this.createSmallerAsteroids(asteroid);
                }
                
                // Reproducir efecto de sonido
                this.gameController.playExplosionSound();
                
                // Eliminar el asteroide
                this.gameController.removeAsteroid(index);
            }
        });

        // Verificar si se necesitan más asteroides
        this.gameController.checkAsteroidCount();
    }

    createSmallerAsteroids(parentAsteroid) {
        const numNewAsteroids = 2;
        for (let i = 0; i < numNewAsteroids; i++) {
            const newSize = parentAsteroid.size - 1;
            const angleOffset = (Math.PI * 2 * i) / numNewAsteroids;
            
            const speed = {
                x: Math.cos(angleOffset) * MathUtils.randomFloat(0.5, 1.5),
                y: Math.sin(angleOffset) * MathUtils.randomFloat(0.5, 1.5)
            };

            this.gameController.createAsteroid(
                parentAsteroid.x,
                parentAsteroid.y,
                newSize,
                speed
            );
        }
    }

    handleBulletRemoval(destroyedIndices) {
        // Ordenar índices en orden descendente para eliminar sin afectar otros índices
        destroyedIndices.sort((a, b) => b - a);
        
        destroyedIndices.forEach(index => {
            this.gameController.removeBullet(index);
        });
    }

    // Métodos auxiliares para cálculos de colisión local si es necesario
    isPointInCircle(point, circle) {
        return MathUtils.distanceBetween(
            point.x, point.y,
            circle.x, circle.y
        ) <= circle.radius;
    }

    checkCircleCollision(circle1, circle2) {
        return MathUtils.distanceBetween(
            circle1.x, circle1.y,
            circle2.x, circle2.y
        ) <= (circle1.radius + circle2.radius);
    }

    destroy() {
        if (this.collisionWorker) {
            this.collisionWorker.terminate();
        }
    }
}