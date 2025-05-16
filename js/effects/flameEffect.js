import { Particle } from '../particle.js';

class FlameEffect {
    constructor() {
        this.particles = [];
    }

    createParticles(x, y, color, size, speed) {
        const particleCount = 12;
        const baseHue = this.getHue(color);
        
        for (let i = 0; i < particleCount; i++) {
            // Flames tend to go upward, so we'll use a narrower angle range
            const angle = (Math.random() * Math.PI * 0.5) - Math.PI * 0.75;
            const velocity = (Math.random() * 2 + 3) * (speed / 5);
            
            // Create gradient from yellow to red
            const particleHue = baseHue - Math.random() * 20;
            const particleColor = `hsl(${particleHue}, 100%, ${50 + Math.random() * 20}%)`;
            
            this.particles.push(new Particle(
                x + (Math.random() * 10 - 5),
                y + (Math.random() * 10 - 5),
                size * (Math.random() * 0.8 + 0.2),
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
                
                // Add upward acceleration for flame effect
                particle.vy -= 0.05;
            }
            return isAlive;
        });
    }
}

export { FlameEffect };
