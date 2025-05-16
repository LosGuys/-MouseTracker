import { Particle } from '../particle.js';

class GalaxyEffect {
    constructor() {
        this.particles = [];
    }

    createParticles(x, y, color, size, speed) {
        const particleCount = 20;
        const baseHue = this.getHue(color);
        const spiralTightness = 0.2;
        
        for (let i = 0; i < particleCount; i++) {
            // Create spiral pattern
            const angle = i * (Math.PI * 2 / particleCount);
            const spiralRadius = i * spiralTightness;
            const velocity = (Math.random() * 2 + 2) * (speed / 5);
            
            // Color variation based on position in spiral
            const particleHue = (baseHue + (i * 360 / particleCount)) % 360;
            const particleColor = `hsl(${particleHue}, 100%, 70%)`;
            
            this.particles.push(new Particle(
                x + Math.cos(angle) * spiralRadius,
                y + Math.sin(angle) * spiralRadius,
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
                // Add rotation to create spiral movement
                const angle = Math.atan2(particle.vy, particle.vx);
                const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
                particle.vx = Math.cos(angle + 0.1) * speed;
                particle.vy = Math.sin(angle + 0.1) * speed;

                ctx.globalAlpha = particle.life;
                particle.draw(ctx);
                ctx.globalAlpha = 1;
            }
            return isAlive;
        });
    }
}

export { GalaxyEffect };
