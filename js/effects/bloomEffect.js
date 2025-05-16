import { Particle } from '../particle.js';

class BloomEffect {
    constructor() {
        this.particles = [];
    }

    createParticles(x, y, color, size, speed) {
        const particleCount = 8;
        const baseHue = this.getHue(color);
        
        for (let i = 0; i < particleCount; i++) {
            const angle = (i / particleCount) * Math.PI * 2;
            const velocity = (Math.random() * 1.5 + 1) * (speed / 5);
            const particleHue = (baseHue + Math.random() * 30 - 15) % 360;
            const particleColor = `hsl(${particleHue}, 100%, 50%)`;
            
            this.particles.push(new Particle(
                x,
                y,
                size * (Math.random() * 0.5 + 0.5),
                particleColor,
                Math.cos(angle) * velocity,
                Math.sin(angle) * velocity
            ));
        }
    }

    getHue(color) {
        // Convert hex to RGB
        const r = parseInt(color.substr(1,2), 16);
        const g = parseInt(color.substr(3,2), 16);
        const b = parseInt(color.substr(5,2), 16);
        
        // Convert RGB to HSL
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
                ctx.globalAlpha = particle.life;
                particle.draw(ctx);
                ctx.globalAlpha = 1;
            }
            return isAlive;
        });
    }
}

export { BloomEffect };
