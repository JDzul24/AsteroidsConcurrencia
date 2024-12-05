export class GameObject {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speed = { x: 0, y: 0 };
    }

    updatePosition(canvas) {
        this.x += this.speed.x;
        this.y += this.speed.y;

        // Wraparound
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
    }
}

// Para usar en Workers
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameObject;
}