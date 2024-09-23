class Game {
    constructor(canvas, keysPressed) { 
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
        this.ship = new NaveWorker(this.width / 2, this.height / 2); 
        this.asteroids = [];
        this.bullets = [];
        this.score = 0;
        this.lives = 3;
        this.gameOver = false;
        this.keysPressed = keysPressed; 

        this.sounds = {
            shoot: new Audio('assets/sounds/disparo.wav'),
            explosion: new Audio('assets/sounds/explosion.wav'),
            background: new Audio('assets/sounds/S3K_FinalBoos_Theme.mp3')
        };

        this.sounds.background.loop = true;
    }

    start() {
        this.sounds.background.play();
        this.spawnAsteroids();
        this.loop();
    }

    spawnAsteroids() {
        for (let i = 0; i < 5; i++) {
            this.asteroids.push(new AsteroidesWorker( 
                Utils.randomInt(0, this.width),
                Utils.randomInt(0, this.height),
                Utils.randomInt(1, 3)
            ));
        }
    }

    update() {
        if (this.gameOver) return;

        // Verificar el estado de las teclas y aplicar la aceleración/rotación
        if (this.keysPressed['w']) this.ship.accelerateY(1); 
        if (this.keysPressed['q']) this.ship.rotate(-1);
        if (this.keysPressed['e']) this.ship.rotate(1);

        this.ship.update(this.canvas);
        this.asteroids.forEach(asteroid => asteroid.update(this.canvas));
        this.bullets.forEach(bullet => bullet.update());

        this.checkCollisions();
        this.removeOffscreenBullets();

        if (this.asteroids.length < 5) {
            this.spawnAsteroids();
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.ship.draw(this.ctx);
        this.asteroids.forEach(asteroid => asteroid.draw(this.ctx));
        this.bullets.forEach(bullet => bullet.draw(this.ctx));
    }

    loop() {
        this.update();
        this.draw();
        this.animationFrameId = requestAnimationFrame(() => this.loop()); 
    }

    checkCollisions() {

        for (let asteroid of this.asteroids) {
            if (Utils.distanceBetween(this.ship.x, this.ship.y, asteroid.x, asteroid.y) < this.ship.radius + asteroid.radius) {
                this.lives--;
                document.getElementById('livesValue').textContent = this.lives;
                this.sounds.explosion.play();
                this.resetShipPosition();
                
                if (this.lives <= 0) {
                    this.endGame();
                }

                break;
            }
        }

        for (let bullet of this.bullets) {
            for (let i = this.asteroids.length - 1; i >= 0; i--) {
                let asteroid = this.asteroids[i];
                if (Utils.distanceBetween(bullet.x, bullet.y, asteroid.x, asteroid.y) < bullet.radius + asteroid.radius) {
                    this.asteroids.splice(i, 1);
                    this.bullets.splice(this.bullets.indexOf(bullet), 1);
                    this.score += 100;
                    document.getElementById('scoreValue').textContent = this.score;
                    this.sounds.explosion.play();
                    break;
                }
            }
        }
    }

    removeOffscreenBullets() {
        this.bullets = this.bullets.filter(bullet => 
            bullet.x >= 0 && bullet.x <= this.width && 
            bullet.y >= 0 && bullet.y <= this.height
        );
    }

    resetShipPosition() {
        this.ship.x = this.width / 2;
        this.ship.y = this.height / 2;
        this.ship.speed = { x: 0, y: 0 };
    }

    shoot() {
        this.bullets.push(new DisparosWorker(this.ship.x, this.ship.y, this.ship.angle));
        this.sounds.shoot.play();
    }

    endGame() {
        this.gameOver = true;
        this.sounds.background.pause();
        document.getElementById('game-over').classList.remove('hidden');
        document.getElementById('finalScore').textContent = this.score;
        cancelAnimationFrame(this.animationFrameId); // Cancelar la animación cuando el juego termina
    }
    restart() {
        cancelAnimationFrame(this.animationFrameId); // Asegurarse de cancelar la animación antes de reiniciar
        this.start()
        this.ship = new NaveWorker(this.width / 2, this.height / 2);
        this.asteroids = [];
        this.bullets = [];
        this.score = 0;
        this.lives = 3;
        this.gameOver = false;
        document.getElementById('scoreValue').textContent = this.score;
        document.getElementById('livesValue').textContent = this.lives;
        document.getElementById('game-over').classList.add('hidden');
        this.sounds.background.currentTime = 0;
        this.start();
    }
}