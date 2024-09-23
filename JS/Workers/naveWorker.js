class NaveWorker {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 20;
        this.angle = 0;
        this.rotation = 0;
        this.speed = { x: 0, y: 0 };
        this.acceleration = 1;
        this.maxSpeed = 2;
        this.friction = .3;
        this.image = new Image();
        this.image.src = 'assets/images/nave.gif';
    }

    rotate(dir) {
        this.rotation = dir * 2 * Math.PI / 180;
    }

    accelerateX(dir) {
    
    }

    accelerateY(dir) {
        this.speed.x += Math.cos(this.angle) * this.acceleration * dir; // Acelerar en X según el ángulo
        this.speed.y += Math.sin(this.angle) * this.acceleration * dir; // Acelerar en Y según el ángulo

        // Limitar la velocidad total (opcional, pero recomendado)
        const currentSpeed = Math.sqrt(this.speed.x ** 2 + this.speed.y ** 2);
        if (currentSpeed > this.maxSpeed) {
            const ratio = this.maxSpeed / currentSpeed;
            this.speed.x *= ratio;
            this.speed.y *= ratio;
        }
    }

    update(canvas) {
        this.angle += this.rotation;
        this.x += this.speed.x;
        this.y += this.speed.y;

        this.speed.x *= this.friction;
        this.speed.y *= this.friction;

        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        // Rotar la imagen 90 grados a la derecha:
        ctx.rotate(Math.PI / 2); 
        ctx.drawImage(this.image, -this.radius, -this.radius, this.radius * 2, this.radius * 2);
        ctx.restore();
    }
}