class Game {
    constructor(canvas, keysPressed) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
    
        // Inicialización de estado del juego
        this.ship = null;
        this.asteroids = [];
        this.bullets = [];
        this.score = 0;
        this.lives = 3;
        this.gameOver = false;
        this.keysPressed = keysPressed;

        // Inicialización de sonidos
        this.sounds = {
            shoot: new Audio('/assets/sounds/disparo.wav'),
            explosion: new Audio('/assets/sounds/explosion.wav'),
            background: new Audio('/assets/sounds/S3K_FinalBoos_Theme.mp3')
        };
        this.sounds.background.loop = true;

        // Crear los workers con las rutas correctas
        this.shipWorker = new Worker('./workers/naveWorker.js');
        this.asteroidsWorker = new Worker('./workers/asteroidesWorker.js');
        this.bulletsWorker = new Worker('./workers/disparosWorker.js');
        this.utilsWorker = new Worker('./workers/utilsWorker.js');

        this.initWorkers();
        this.setupListeners();
    }

    initWorkers() {
        // Enviar datos iniciales a los workers
        const initData = {
            type: 'INIT',
            canvasDimensions: {
                width: this.width,
                height: this.height
            }
        };

        this.shipWorker.postMessage(initData);
        this.asteroidsWorker.postMessage(initData);
        this.bulletsWorker.postMessage(initData);
        this.utilsWorker.postMessage(initData);
    }

    setupListeners() {
        // Configurar listeners para los workers
        this.shipWorker.onmessage = (e) => {
            if (e.data.type === 'SHIP_UPDATE') {
                this.ship = e.data.ship;
            }
        };

        this.asteroidsWorker.onmessage = (e) => {
            if (e.data.type === 'ASTEROIDS_UPDATE') {
                this.asteroids = e.data.asteroids;
            }
        };

        this.bulletsWorker.onmessage = (e) => {
            if (e.data.type === 'BULLETS_UPDATE') {
                this.bullets = e.data.bullets;
            }
        };

        this.utilsWorker.onmessage = (e) => {
            switch(e.data.type) {
                case 'COLLISION_ASTEROID':
                    this.handleCollisionAsteroid();
                    break;
                case 'COLLISION_BULLET':
                    this.handleCollisionBullet(e.data);
                    break;
            }
        };
    }

    update() {
        if (this.gameOver) return;

        // Actualizar nave
        this.shipWorker.postMessage({
            type: 'UPDATE',
            shipData: this.ship,
            keysPressed: this.keysPressed,
            canvasDimensions: {
                width: this.width,
                height: this.height
            }
        });

        // Actualizar asteroides
        this.asteroidsWorker.postMessage({
            type: 'UPDATE',
            asteroids: this.asteroids,
            canvasDimensions: {
                width: this.width,
                height: this.height
            }
        });

        // Actualizar balas
        this.bulletsWorker.postMessage({
            type: 'UPDATE',
            bullets: this.bullets,
            canvasDimensions: {
                width: this.width,
                height: this.height
            }
        });

        // Verificar colisiones
        if (this.ship) {
            this.utilsWorker.postMessage({
                type: 'CHECK_COLLISIONS',
                ship: this.ship,
                asteroids: this.asteroids,
                bullets: this.bullets
            });
        }
    }

    update() {
        if (this.gameOver) return;

        if (this.keysPressed['w']) this.shipWorker.postMessage({ type: 'ACCELERATE' });
        if (this.keysPressed['q']) this.shipWorker.postMessage({ type: 'ROTATE', direction: -1 });
        if (this.keysPressed['e']) this.shipWorker.postMessage({ type: 'ROTATE', direction: 1 });
        if (this.keysPressed[' ']) this.shipWorker.postMessage({ type: 'SHOOT' });

        this.shipWorker.postMessage({ type: 'UPDATE' });
        this.asteroidsWorker.postMessage({ type: 'UPDATE', asteroidsData: this.asteroids, canvasDimensions: { width: this.width, height: this.height } });
        this.bulletsWorker.postMessage({ type: 'UPDATE', disparosData: this.bullets, canvasDimensions: { width: this.width, height: this.height } });

        if (this.ship !== null) {
            this.bullets.forEach(bullet => this.utilsWorker.postMessage({ type: 'BULLET_UPDATE', bullet: bullet, asteroids: this.asteroids }));
            this.utilsWorker.postMessage({ type: 'SHIP_UPDATE', ship: this.ship, asteroids: this.asteroids });

            this.bullets = this.bullets.filter(bullet => bullet.x >= 0 && bullet.x <= this.width && bullet.y >= 0 && bullet.y <= this.height);
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        if (this.ship) {
            this.ship.draw(this.ctx);
        }

        this.asteroids.forEach(asteroid => asteroid.draw(this.ctx));
        this.bullets.forEach(bullet => bullet.draw(this.ctx));
    }

    loop() {
        if (!this.gameOver) {
            this.update();
            this.draw();
            requestAnimationFrame(() => this.loop());
        }
    }

    endGame() {
        this.gameOver = true;
        this.sounds.background.pause();
        document.getElementById('game-over').classList.remove('hidden');
        document.getElementById('finalScore').textContent = this.score;
        cancelAnimationFrame(this.animationFrameId);

        this.shipWorker.terminate();
        this.asteroidsWorker.terminate();
        this.bulletsWorker.terminate();
        this.utilsWorker.terminate();
    }

    restart() {
        cancelAnimationFrame(this.animationFrameId);

        this.gameOver = false;
        this.score = 0;
        this.lives = 3;
        this.asteroids = [];
        this.bullets = [];

        this.shipWorker.terminate();
        this.asteroidsWorker.terminate();
        this.bulletsWorker.terminate();
        this.utilsWorker.terminate();

        this.shipWorker = new Worker('/src/workers/naveWorker.js');
        this.asteroidsWorker = new Worker('/src/workers/asteroidesWorker.js');
        this.bulletsWorker = new Worker('/src/workers/disparosWorker.js');
        this.utilsWorker = new Worker('/src/workers/utilsWorker.js');

        this.initWorkers();
        this.setupListeners();

        document.getElementById('scoreValue').textContent = this.score;
        document.getElementById('livesValue').textContent = this.lives;
        document.getElementById('game-over').classList.add('hidden');
        this.sounds.background.currentTime = 0;

        this.start();
    }
}