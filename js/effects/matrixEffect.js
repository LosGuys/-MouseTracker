import { Particle } from '../particle.js';

class MatrixEffect {
    constructor() {
        this.particles = [];
    }

    createParticles(x, y, color, size, speed) {
        const particleCount = 10;
        const characters = "日月火水木金土";
        
        for (let i = 0; i < particleCount; i++) {
            const character = characters[Math.floor(Math.random() * characters.length)];
            const velocity = (Math.random() * 2 + 3) * (speed / 5);
            
            // Create matrix-style green colors with varying brightness
            const brightness = 40 + Math.random() * 60;
            const particleColor = `hsl(120, 100%, ${brightness}%)`;
            
            const particle = new Particle(
                x + (Math.random() * 40 - 20),
                y,
                size,
                particleColor,
                0,  // x velocity
                velocity  // y velocity - falling down
            );
            
            // Add custom properties for matrix effect
            particle.character = character;
            particle.glowIntensity = Math.random();
            
            this.particles.push(particle);
        }
    }

    update(ctx) {
        ctx.font = '14px monospace';
        
        this.particles = this.particles.filter(particle => {
            const isAlive = particle.update();
            if (isAlive) {
                // Create glowing effect
                const glow = 0.3 + particle.glowIntensity * 0.7;
                ctx.globalAlpha = particle.life * glow;
                
                // Draw character instead of circle
                ctx.fillStyle = particle.color;
                ctx.fillText(particle.character, particle.x, particle.y);
                
                // Add trail effect
                ctx.globalAlpha = particle.life * 0.3;
                ctx.fillText(particle.character, particle.x, particle.y - 10);
                
                ctx.globalAlpha = 1;
                
                // Randomly change character
                if (Math.random() < 0.1) {
                    const characters = "日月火水木金土";
                    particle.character = characters[Math.floor(Math.random() * characters.length)];
                }
            }
            return isAlive;
        });
    }
}

export { MatrixEffect };
