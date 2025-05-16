class Particle {
    constructor(x, y, size, color, vx, vy) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.vx = vx;
        this.vy = vy;
        this.life = 1;
        this.trail = [];
        this.maxTrailLength = 10;
        this.useTrail = false;
        this.glowIntensity = 0.5;
        this.lifeDecay = 0.01;
    }

    update() {
        if (this.useTrail) {
            this.trail.unshift({ x: this.x, y: this.y });
            if (this.trail.length > this.maxTrailLength) {
                this.trail.pop();
            }
        }

        this.x += this.vx;
        this.y += this.vy;
        this.life -= this.lifeDecay;
        return this.life > 0;
    }

    draw(ctx) {
        // Draw trail if enabled
        if (this.useTrail && this.trail.length > 0) {
            ctx.beginPath();
            ctx.moveTo(this.trail[0].x, this.trail[0].y);
            for (let i = 1; i < this.trail.length; i++) {
                ctx.lineTo(this.trail[i].x, this.trail[i].y);
            }
            ctx.strokeStyle = this.color;
            ctx.lineWidth = this.size;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.stroke();
        }

        // Draw glow effect
        if (this.glowIntensity > 0) {
            const gradient = ctx.createRadialGradient(
                this.x, this.y, 0,
                this.x, this.y, this.size * 2
            );
            gradient.addColorStop(0, this.color);
            gradient.addColorStop(1, 'rgba(0,0,0,0)');
            
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.globalAlpha = this.life * this.glowIntensity;
            ctx.fill();
            ctx.globalAlpha = this.life;
        }

        // Draw main particle
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

export { Particle };
