import { EmberEffect } from './effects/emberEffect.js';
import { BloomEffect } from './effects/bloomEffect.js';
import { FlameEffect } from './effects/flameEffect.js';

class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('visualizer');
        this.ctx = this.canvas.getContext('2d');
        this.isDrawing = false;
        this.lastX = 0;
        this.lastY = 0;
        
        this.effects = {
            embers: new EmberEffect(),
            bloom: new BloomEffect(),
            flame: new FlameEffect()
        };
        
        this.currentEffect = this.effects.embers;
        this.setupControls();
        this.resize();
        this.setupEventListeners();
        this.animate();
    }

    setupControls() {
        document.getElementById('effectType').addEventListener('change', (e) => {
            this.currentEffect = this.effects[e.target.value];
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
