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
        this.maxTrailLength = 15; // Increased from 10
        this.useTrail = false;
        this.glowIntensity = 0.5;
        this.lifeDecay = 0.01;
        this.trailOpacity = 0.8; // New property for trail opacity
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
            // Enhanced trail rendering with gradient
            const gradient = ctx.createLinearGradient(
                this.trail[0].x, this.trail[0].y,
                this.trail[this.trail.length - 1].x, this.trail[this.trail.length - 1].y
            );
            
            // Create color with opacity for trail
            const baseColor = this.color.startsWith('hsl') ? 
                this.color.replace(')', `, ${this.trailOpacity})`) :
                this.color;
            
            gradient.addColorStop(0, baseColor);
            gradient.addColorStop(1, 'rgba(0,0,0,0)');

            // Draw main trail
            ctx.beginPath();
            ctx.moveTo(this.trail[0].x, this.trail[0].y);
            for (let i = 1; i < this.trail.length; i++) {
                const t = i / (this.trail.length - 1);
                ctx.lineTo(this.trail[i].x, this.trail[i].y);
            }
            ctx.strokeStyle = gradient;
            ctx.lineWidth = this.size * 2; // Thicker trail
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.stroke();
            
            // Draw glowing outer trail
            ctx.beginPath();
            ctx.moveTo(this.trail[0].x, this.trail[0].y);
            for (let i = 1; i < this.trail.length; i++) {
                ctx.lineTo(this.trail[i].x, this.trail[i].y);
            }
            ctx.strokeStyle = gradient;
            ctx.lineWidth = this.size * 3; // Even thicker outer glow
            ctx.globalAlpha = this.life * 0.3;
            ctx.stroke();
            ctx.globalAlpha = this.life;
        }

        // Enhanced glow effect with larger radius and stronger intensity
        if (this.glowIntensity > 0) {
            // Inner glow
            const innerGradient = ctx.createRadialGradient(
                this.x, this.y, 0,
                this.x, this.y, this.size * 3
            );
            innerGradient.addColorStop(0, this.color);
            innerGradient.addColorStop(1, 'rgba(0,0,0,0)');
            
            // Outer glow
            const outerGradient = ctx.createRadialGradient(
                this.x, this.y, this.size,
                this.x, this.y, this.size * 4
            );
            outerGradient.addColorStop(0, this.color);
            outerGradient.addColorStop(1, 'rgba(0,0,0,0)');
            
            // Draw outer glow
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 4, 0, Math.PI * 2);
            ctx.fillStyle = outerGradient;
            ctx.globalAlpha = this.life * this.glowIntensity * 0.5;
            ctx.fill();
            
            // Draw inner glow
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
            ctx.fillStyle = innerGradient;
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
