// controllers/shipController.js
class ShipController {
  constructor(canvas, shipModel) {
    this.canvas = canvas;
    this.ship = shipModel;
    this.keysPressed = {};

    window.addEventListener('keydown', (event) => {
      this.keysPressed[event.key] = true;
    });

    window.addEventListener('keyup', (event) => {
      delete this.keysPressed[event.key];
    });
  }

  update() {
    if (this.keysPressed['ArrowLeft']) {
      this.ship.rotate(-1); // Rotar a la izquierda
    }
    if (this.keysPressed['ArrowRight']) {
      this.ship.rotate(1); // Rotar a la derecha
    }
    if (this.keysPressed['ArrowUp']) {
        this.ship.accelerate(); // Acelerar
    }

    this.ship.update();
  }
}