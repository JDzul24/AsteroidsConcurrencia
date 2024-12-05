// models/asteroidModel.js
class Asteroid {
  constructor(x, y, radius, vertices, ctx) {
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.vertices = vertices;
      this.ctx = ctx;
      this.angle = Math.random() * Math.PI * 2;
      this.velocity = {
          x: (Math.random() - 0.5) * 2, // Velocidad aleatoria en x
          y: (Math.random() - 0.5) * 2  // Velocidad aleatoria en y
      };
      this.rotationSpeed = (Math.random() - 0.5) * 0.05; // Velocidad de rotación
  }

  draw() {
      this.ctx.save();
      this.ctx.translate(this.x, this.y);
      this.ctx.rotate(this.angle);

      this.ctx.beginPath();
      for (let i = 0; i < this.vertices; i++) {
          const angle = (Math.PI * 2 / this.vertices) * i;
          const x = this.radius * Math.cos(angle);
          const y = this.radius * Math.sin(angle);
          if (i === 0) {
              this.ctx.moveTo(x, y);
          } else {
              this.ctx.lineTo(x, y);
          }
      }
      this.ctx.closePath();

      this.ctx.strokeStyle = "white";
      this.ctx.lineWidth = 2;
      this.ctx.stroke();

      this.ctx.restore();
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