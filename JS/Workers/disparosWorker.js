class DisparosWorker {
    constructor(x, y, angle) {
        this.x = x;
        this.y = y;
        this.speed = 5;
        this.radius = 10;
        this.angle = angle;
    }

    update() {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
    }

    draw(ctx) {
        let gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
        gradient.addColorStop(0, 'white');
        gradient.addColorStop(1, 'rgba(255, 255, 0, 0)');
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
    }
}