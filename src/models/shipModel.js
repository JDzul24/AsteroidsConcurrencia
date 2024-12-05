class Ship {
  constructor(x, y, radius, angle) {
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.angle = angle;
      this.velocity = { x: 0, y: 0 };
      this.rotationSpeed = 0.1;
      this.thrust = 0.1;
      this.friction = 0.99; // Añadimos fricción para mejor control
  }

  draw(ctx) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);

      // Dibujar la nave (triángulo)
      ctx.beginPath();
      ctx.moveTo(this.radius, 0);
      ctx.lineTo(-this.radius, -this.radius/2);
      ctx.lineTo(-this.radius, this.radius/2);
      ctx.closePath();
      
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Dibujar el fuego del propulsor cuando acelera
      if (this.isAccelerating) {
          ctx.beginPath();
          ctx.moveTo(-this.radius, 0);
          ctx.lineTo(-this.radius - 10, 0);
          ctx.strokeStyle = 'orange';
          ctx.stroke();
      }

      ctx.restore();
  }

  update(canvasWidth, canvasHeight) {
      // Actualizar posición
      this.x += this.velocity.x;
      this.y += this.velocity.y;

      // Aplicar fricción
      this.velocity.x *= this.friction;
      this.velocity.y *= this.friction;

      // Mantener la nave dentro del canvas
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

      // Limitar la velocidad máxima
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

// Exportar la clase Ship para el worker
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Ship;
} else if (typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope) {
  self.Ship = Ship;
}