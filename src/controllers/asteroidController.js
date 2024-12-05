// controllers/asteroidController.js
class AsteroidController {
  constructor(canvas, ctx, maxAsteroids) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.asteroids = [];
    this.maxAsteroids = maxAsteroids;

    for(let i=0; i< this.maxAsteroids; i++){
        this.generateAsteroid()
    }
  }

  generateAsteroid() {
    const radius = Math.random() * 30 + 10; // Tamaño aleatorio
    const x = Math.random() * this.canvas.width;
    const y = Math.random() * this.canvas.height;
    const vertices = 6; // Hexágono
    const asteroid = new Asteroid(x, y, radius, vertices, this.ctx);

    this.asteroids.push(asteroid);
  }

  update() {
    this.asteroids.forEach(asteroid => {
      asteroid.update(this.canvas.width, this.canvas.height);
    });
  }

  draw() {
    this.asteroids.forEach(asteroid => asteroid.draw());
  }

  destroyAsteroid(index){
      this.asteroids.splice(index, 1);
  }

  resetAsteroids(){
      this.asteroids = [];
      for (let i = 0; i < this.maxAsteroids; i++) {
          this.generateAsteroid();
      }
  }

  getAsteroids(){
      return this.asteroids;
  }
}