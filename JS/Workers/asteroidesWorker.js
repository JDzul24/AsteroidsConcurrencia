class AsteroidesWorker {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.radius = size * 10;
        this.speed = {
            x: Utils.randomFloat(-1, 1),
            y: Utils.randomFloat(-1, 1)
        };
        this.image = new Image();
        this.image.src = 'assets/images/asteroide.png';
    }

    update(canvas) {
        this.x += this.speed.x;
        this.y += this.speed.y;

        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
    }
}