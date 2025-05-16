import { Particle } from '../particle.js';

class SparkleEffect {
    constructor() {
        this.particles = [];
    }

    createParticles(x, y, color, size, speed) {
        const particleCount = 15;
        const baseHue = this.getHue(color);
        
        for (let i = 0; i < particleCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const velocity = (Math.random() * 1 + 0.5) * (speed / 5);
            
            // Create sparkly colors
            const particleHue = (baseHue + Math.random() * 60 - 30) % 360;
            const particleColor = `hsl(${particleHue}, 100%, 75%)`;
            
            this.particles.push(new Particle(
                x + (Math.random() * 20 - 10),
                y + (Math.random() * 20 - 10),
                size * (Math.random() * 0.5 + 0.5),
                particleColor,
                Math.cos(angle) * velocity,
                Math.sin(angle) * velocity
            ));
        }
    }

    getHue(color) {
        const r = parseInt(color.substr(1,2), 16);
        const g = parseInt(color.substr(3,2), 16);
        const b = parseInt(color.substr(5,2), 16);
        
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h;

        if (max === min) {
            h = 0;
        } else if (max === r) {
            h = 60 * ((g - b) / (max - min));
        } else if (max === g) {
            h = 60 * (2 + (b - r) / (max - min));
        } else {
            h = 60 * (4 + (r - g) / (max - min));
        }

        if (h < 0) h += 360;
        return h;
    }

    update(ctx) {
        this.particles = this.particles.filter(particle => {
            const isAlive = particle.update();
            if (isAlive) {
                // Create twinkling effect
                const twinkle = 0.5 + Math.sin(Date.now() * 0.01 + particle.x + particle.y) * 0.5;
                ctx.globalAlpha = particle.life * twinkle;
                
                // Draw glow effect
                const glow = particle.size * (1 + twinkle);
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, glow, 0, Math.PI * 2);
                ctx.fillStyle = particle.color.replace('75%)', '85%)');
                ctx.fill();
                
                particle.draw(ctx);
                ctx.globalAlpha = 1;
            }
            return isAlive;
        });
    }
}

export { SparkleEffect };
