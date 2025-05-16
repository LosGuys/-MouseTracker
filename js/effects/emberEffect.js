import { Particle } from '../particle.js';

class EmberEffect {
    constructor() {
        this.particles = [];
    }

    createParticles(x, y, color, size, speed) {
        const particleCount = 5;
        for (let i = 0; i < particleCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const velocity = (Math.random() * 2 + 2) * (speed / 5);
            
            this.particles.push(new Particle(
                x,
                y,
                size,
                color,
                Math.cos(angle) * velocity,
                Math.sin(angle) * velocity
            ));
        }
    }

    update(ctx) {
        this.particles = this.particles.filter(particle => {
            const isAlive = particle.update();
            if (isAlive) {
                particle.draw(ctx);
            }
            return isAlive;
        });
    }
}

export { EmberEffect };
