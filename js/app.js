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
        
        // Initialize effect settings with enhanced trails
        this.useTrail = false;
        this.trailLength = 15;  // Increased from 5
        this.particleLifetime = 0.01;
        this.glowIntensity = 0.7;  // Increased from 0.5
        
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
        // Setup radio button event listeners
        document.querySelectorAll('input[name="effectType"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.currentEffect = this.effects[e.target.value];
                }
            });
        });

        // Setup color wheel
        const colorWheel = document.getElementById('colorWheel');
        const colorInput = document.getElementById('particleColor');
        
        colorWheel.addEventListener('click', (e) => {
            const rect = colorWheel.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            // Convert position to hue and saturation
            const angle = Math.atan2(y, x);
            const hue = ((angle + Math.PI) / (2 * Math.PI)) * 360;
            const distance = Math.min(Math.sqrt(x * x + y * y) / (rect.width / 2), 1);
            
            // Convert HSV to RGB (assuming V=1)
            const rgb = this.HSVtoRGB(hue, distance, 1);
            const hex = '#' + (1 << 24 | rgb.r << 16 | rgb.g << 8 | rgb.b).toString(16).slice(1);
            
            colorInput.value = hex;
        });

        this.setupParticleControls();
    }

    setupParticleControls() {
        // Trail effect toggle
        document.getElementById('trailEffect').addEventListener('change', (e) => {
            this.useTrail = e.target.checked;
        });

        // Trail length control with enhanced length
        document.getElementById('trailLength').addEventListener('input', (e) => {
            this.trailLength = parseInt(e.target.value) * 3; // Tripled the trail length multiplier
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

    HSVtoRGB(h, s, v) {
        let r, g, b;
        const i = Math.floor(h * 6);
        const f = h * 6 - i;
        const p = v * (1 - s);
        const q = v * (1 - f * s);
        const t = v * (1 - (1 - f) * s);
        
        switch (i % 6) {
            case 0: r = v; g = t; b = p; break;
            case 1: r = q; g = v; b = p; break;
            case 2: r = p; g = v; b = t; break;
            case 3: r = p; g = q; b = v; break;
            case 4: r = t; g = p; b = v; break;
            case 5: r = v; g = p; b = q; break;
        }
        
        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255)
        };
    }
}

new ParticleSystem();
