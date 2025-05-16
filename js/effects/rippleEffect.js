import { Particle } from '../particle.js';

class RippleEffect {
    constructor() {
        this.particles = [];
    }

    createParticles(x, y, color, size, speed) {
        const particleCount = 30;
        const baseHue = this.getHue(color);
        
        for (let i = 0; i < particleCount; i++) {
            const angle = (i / particleCount) * Math.PI * 2;
            const velocity = (Math.random() * 1 + 2) * (speed / 5);
            
            // Create ripple colors with transparency
            const particleHue = (baseHue + Math.random() * 30 - 15) % 360;
            const particleColor = `hsla(${particleHue}, 100%, 70%, 0.5)`;
            
            const particle = new Particle(
                x,
                y,
                size * (Math.random() * 0.2 + 0.8),
                particleColor,
                Math.cos(angle) * velocity,
                Math.sin(angle) * velocity
            );
            
            // Add custom properties for ripple effect
            particle.initialSize = particle.size;
            particle.expansionRate = 1.05;
            
            this.particles.push(particle);
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
                // Expand the particle size over time
                particle.size = particle.initialSize * Math.pow(particle.expansionRate, (1 - particle.life) * 20);
                
                // Decrease velocity as the ripple expands
                particle.vx *= 0.99;
                particle.vy *= 0.99;
                
                // Draw ripple circle
                ctx.globalAlpha = particle.life * 0.5;
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.strokeStyle = particle.color;
                ctx.lineWidth = 2;
                ctx.stroke();
                
                // Draw center point
                ctx.globalAlpha = particle.life;
                particle.draw(ctx);
                ctx.globalAlpha = 1;
            }
            return isAlive;
        });
    }
}

export { RippleEffect };
