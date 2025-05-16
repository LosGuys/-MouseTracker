import { EmberEffect } from './effects/emberEffect.js';
import { BloomEffect } from './effects/bloomEffect.js';
import { FlameEffect } from './effects/flameEffect.js';
import { GalaxyEffect } from './effects/galaxyEffect.js';
import { SparkleEffect } from './effects/sparkleEffect.js';
import { MatrixEffect } from './effects/matrixEffect.js';
import { RippleEffect } from './effects/rippleEffect.js';

class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('visualizer');
        this.ctx = this.canvas.getContext('2d');
        this.isDrawing = false;
        this.lastX = 0;
        this.lastY = 0;
        
        // Initialize effect settings
        this.useTrail = false;
        this.trailLength = 5;
        this.particleLifetime = 0.01;
        this.glowIntensity = 0.5;
        
        this.effects = {
            embers: new EmberEffect(),
            bloom: new BloomEffect(),
            flame: new FlameEffect(),
            galaxy: new GalaxyEffect(),
            sparkle: new SparkleEffect(),
            matrix: new MatrixEffect(),
            ripple: new RippleEffect()
        };
        
        this.currentEffect = this.effects.embers;
        this.setupControls();
        this.resize();
        this.setupEventListeners();
        this.animate();
    }    setupControls() {
        document.getElementById('effectType').addEventListener('change', (e) => {
            this.currentEffect = this.effects[e.target.value];
        });

        // Trail effect toggle
        document.getElementById('trailEffect').addEventListener('change', (e) => {
            this.useTrail = e.target.checked;
        });

        // Trail length control
        document.getElementById('trailLength').addEventListener('input', (e) => {
            this.trailLength = parseInt(e.target.value);
        });

        // Particle lifetime control
        document.getElementById('particleLife').addEventListener('input', (e) => {
            this.particleLifetime = 1 / parseInt(e.target.value);
        });

        // Glow intensity control
        document.getElementById('glowIntensity').addEventListener('input', (e) => {
            this.glowIntensity = parseInt(e.target.value) / 10;
        });
    }

    createParticlesWithEffects(x, y) {
        const color = document.getElementById('particleColor').value;
        const size = parseInt(document.getElementById('particleSize').value);
        const speed = parseInt(document.getElementById('particleSpeed').value);
        
        this.currentEffect.createParticles(x, y, color, size, speed);
        
        // Apply effect settings to new particles
        this.currentEffect.particles.forEach(particle => {
            particle.useTrail = this.useTrail;
            particle.maxTrailLength = this.trailLength;
            particle.lifeDecay = this.particleLifetime;
            particle.glowIntensity = this.glowIntensity;
        });
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    setupEventListeners() {
        window.addEventListener('resize', () => this.resize());
        
        this.canvas.addEventListener('mousedown', (e) => {
            this.isDrawing = true;
            [this.lastX, this.lastY] = [e.clientX, e.clientY];
        });
        
        this.canvas.addEventListener('mousemove', (e) => {
            if (!this.isDrawing) return;
            this.currentEffect.createParticles(
                e.clientX, 
                e.clientY,
                document.getElementById('particleColor').value,
                parseInt(document.getElementById('particleSize').value),
                parseInt(document.getElementById('particleSpeed').value)
            );
            [this.lastX, this.lastY] = [e.clientX, e.clientY];
        });

        this.canvas.addEventListener('mouseup', () => this.isDrawing = false);
        this.canvas.addEventListener('mouseout', () => this.isDrawing = false);
    }

    animate() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.currentEffect.update(this.ctx);
        requestAnimationFrame(() => this.animate());
    }
}

new ParticleSystem();
