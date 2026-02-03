// cclee.design theme (from src/index.css dark theme)
const THEME = {
    bg: '#1a1a1a',
    text: '#f0f0f0',
    textPrimary: '#ffffff',
    textMuted: '#a4a4a4',
    focus: '#f0f0f0',
    overlay: 'rgba(0, 0, 0, 0.7)',
    enemyRed: '#e74c3c',
    enemyRedDark: '#c0392b',
    enemyBlue: '#3498db',
    enemyPurple: '#9b59b6',
    starColors: ['#ffffff', '#f0f0f0', '#e8e8e8', '#a4a4a4', '#c0c0c0']
};

class GalagaGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 800;
        this.canvas.height = 600;
        
        // Game state
        this.gameState = 'menu'; // menu, playing, paused, gameOver
        this.score = 0;
        this.highScore = parseInt(localStorage.getItem('galagaHighScore'), 10) || 0;
        this.lives = 3;
        this.level = 1;
        this.frameCount = 0;
        this.invincibilityFrames = 0; // Frames of invincibility after respawn
        
        // Audio context for sound effects
        this.audioContext = null;
        this.initAudio();
        
        // Player
        this.player = {
            x: this.canvas.width / 2 - 11,
            y: this.canvas.height - 50,
            width: 22, // 11 pixels * 2 scale
            height: 24, // 12 pixels * 2 scale
            speed: 5,
            color: THEME.focus
        };
        
        // Game entities
        this.bullets = [];
        this.enemies = [];
        this.enemyBullets = [];
        this.particles = [];
        
        // Input handling
        this.keys = {};
        this.setupEventListeners();
        
        // Initialize enemies
        this.createEnemyFormation();
        
        // Start game loop
        this.gameLoop();
    }
    
    initAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Web Audio API not supported');
        }
    }
    
    // Pixel art sprite drawing function
    drawPixelSprite(x, y, sprite, scale = 2) {
        this.ctx.imageSmoothingEnabled = false;
        
        for (let row = 0; row < sprite.length; row++) {
            for (let col = 0; col < sprite[row].length; col++) {
                const pixel = sprite[row][col];
                if (pixel !== 0) { // 0 = transparent
                    this.ctx.fillStyle = this.getPixelColor(pixel);
                    this.ctx.fillRect(
                        x + col * scale, 
                        y + row * scale, 
                        scale, 
                        scale
                    );
                }
            }
        }
    }
    
    // Color mapping for sprite pixels (theme-aligned)
    getPixelColor(colorCode) {
        const colors = {
            1: THEME.textPrimary,
            2: THEME.enemyRed,
            3: THEME.textPrimary,
            4: THEME.focus,
            5: THEME.enemyBlue,
            6: THEME.enemyPurple,
            7: THEME.textMuted,
            8: THEME.textMuted,
            9: THEME.enemyPurple,
            10: THEME.textMuted,
            11: THEME.textMuted,
            12: THEME.textMuted,
            13: THEME.text,
            14: THEME.textMuted,
            15: THEME.focus
        };
        return colors[colorCode] || THEME.textPrimary;
    }
    
    // Sprite definitions (based on classic Galaga pixel art)
    getPlayerSprite() {
        return [
            [0,0,0,0,1,1,1,0,0,0,0],
            [0,0,0,1,1,1,1,1,0,0,0],
            [0,0,1,1,2,1,2,1,1,0,0],
            [0,1,1,2,2,1,2,2,1,1,0],
            [1,1,2,2,2,1,2,2,2,1,1],
            [1,2,2,2,2,1,2,2,2,2,1],
            [1,2,2,2,2,1,2,2,2,2,1],
            [1,1,2,2,2,1,2,2,2,1,1],
            [0,1,1,2,2,1,2,2,1,1,0],
            [0,0,1,1,2,1,2,1,1,0,0],
            [0,0,0,1,1,1,1,1,0,0,0],
            [0,0,0,0,1,1,1,0,0,0,0]
        ];
    }
    
    getBeeEnemySprite() {
        return [
            [0,0,0,3,3,3,3,0,0,0],
            [0,0,3,5,5,5,5,3,0,0],
            [0,3,5,2,5,5,2,5,3,0],
            [3,5,2,2,5,5,2,2,5,3],
            [3,5,5,5,3,3,5,5,5,3],
            [3,5,5,5,5,5,5,5,5,3],
            [3,3,5,5,5,5,5,5,3,3],
            [0,3,3,5,5,5,5,3,3,0],
            [0,0,3,3,3,3,3,3,0,0],
            [0,0,0,3,3,3,3,0,0,0]
        ];
    }
    
    getGalagaEnemySprite() {
        return [
            [0,0,2,2,2,2,2,2,0,0],
            [0,2,2,3,2,2,3,2,2,0],
            [2,2,3,3,2,2,3,3,2,2],
            [2,3,3,3,2,2,3,3,3,2],
            [2,3,3,3,3,3,3,3,3,2],
            [2,2,3,3,3,3,3,3,2,2],
            [0,2,2,3,3,3,3,2,2,0],
            [0,0,2,2,2,2,2,2,0,0],
            [0,0,0,2,0,0,2,0,0,0],
            [0,0,2,0,0,0,0,2,0,0]
        ];
    }
    
    getFlagshipEnemySprite() {
        return [
            [0,0,4,4,4,4,4,4,0,0],
            [0,4,4,9,4,4,9,4,4,0],
            [4,4,9,9,4,4,9,9,4,4],
            [4,9,9,9,4,4,9,9,9,4],
            [4,9,9,9,9,9,9,9,9,4],
            [4,4,9,9,9,9,9,9,4,4],
            [0,4,4,9,9,9,9,4,4,0],
            [0,0,4,4,4,4,4,4,0,0],
            [0,4,0,4,0,0,4,0,4,0],
            [4,0,0,0,4,4,0,0,0,4]
        ];
    }
    
    getBulletSprite() {
        return [
            [3],
            [3],
            [3],
            [3]
        ];
    }
    
    getEnemyBulletSprite() {
        return [
            [2],
            [2],
            [2]
        ];
    }
    
    playSound(frequency, duration, type = 'square', volume = 0.3) {
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = type;
        
        gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }
    
    playShootSound() {
        this.playSound(800, 0.1, 'square', 0.2);
    }
    
    playEnemyHitSound() {
        this.playSound(200, 0.3, 'sawtooth', 0.3);
    }
    
    playPlayerHitSound() {
        this.playSound(150, 0.5, 'triangle', 0.4);
    }
    
    playEnemyShootSound() {
        this.playSound(300, 0.2, 'triangle', 0.15);
    }
    
    setupEventListeners() {
        // Keyboard events
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            
            if (e.code === 'Space') {
                e.preventDefault();
                if (this.gameState === 'playing') {
                    this.shootBullet();
                }
            }
            
            if (e.code === 'Escape') {
                e.preventDefault();
                this.togglePause();
            }
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
        
        // Button events
        document.getElementById('startButton').addEventListener('click', () => {
            this.startGame();
        });
        
        document.getElementById('restartButton').addEventListener('click', () => {
            this.resetGame();
            this.startGame();
        });

        // Start game on any key when on start screen
        document.addEventListener('keydown', (e) => {
            if (this.gameState === 'menu') {
                e.preventDefault();
                this.startGame();
            }
        });
    }
    
    startGame() {
        this.gameState = 'playing';
        this.invincibilityFrames = 90; // Brief invincibility at game start
        document.getElementById('startScreen').style.display = 'none';
        document.getElementById('gameOverScreen').style.display = 'none';
        
        // Resume audio context if needed
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }
    
    togglePause() {
        if (this.gameState === 'playing') {
            this.gameState = 'paused';
        } else if (this.gameState === 'paused') {
            this.gameState = 'playing';
        }
    }
    
    resetGame() {
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.frameCount = 0;
        this.invincibilityFrames = 0;
        this.player.x = this.canvas.width / 2 - 11;
        this.player.y = this.canvas.height - 50;
        this.bullets = [];
        this.enemies = [];
        this.enemyBullets = [];
        this.particles = [];
        this.createEnemyFormation();
        this.updateUI();
    }
    
    createEnemyFormation() {
        this.enemies = [];
        
        // Classic Galaga formation pattern
        // Top row: 4 Boss Galaga enemies (flagship)
        for (let col = 0; col < 4; col++) {
            this.enemies.push({
                x: 300 + col * 50,
                y: 80,
                originalX: 300 + col * 50,
                originalY: 80,
                width: 20,
                height: 20,
                speed: 1,
                direction: 1,
                type: 'flagship',
                shootTimer: Math.random() * 300,
                formationTimer: Math.random() * 600,
                inFormation: true,
                alive: true
            });
        }
        
        // Second and third rows: Red Galaga enemies
        for (let row = 0; row < 2; row++) {
            for (let col = 0; col < 8; col++) {
                // Skip center positions for the formation
                if (row === 0 && (col === 2 || col === 3 || col === 4 || col === 5)) continue;
                
                this.enemies.push({
                    x: 200 + col * 50,
                    y: 130 + row * 40,
                    originalX: 200 + col * 50,
                    originalY: 130 + row * 40,
                    width: 20,
                    height: 20,
                    speed: 1,
                    direction: 1,
                    type: 'galaga',
                    shootTimer: Math.random() * 300,
                    formationTimer: Math.random() * 800,
                    inFormation: true,
                    alive: true
                });
            }
        }
        
        // Bottom two rows: Blue Bee enemies
        for (let row = 0; row < 2; row++) {
            for (let col = 0; col < 10; col++) {
                this.enemies.push({
                    x: 150 + col * 50,
                    y: 210 + row * 40,
                    originalX: 150 + col * 50,
                    originalY: 210 + row * 40,
                    width: 20,
                    height: 20,
                    speed: 1,
                    direction: 1,
                    type: 'bee',
                    shootTimer: Math.random() * 300,
                    formationTimer: Math.random() * 1000,
                    inFormation: true,
                    alive: true
                });
            }
        }
    }
    
    update() {
        if (this.gameState !== 'playing') return;
        
        this.frameCount++;
        this.handleInput();
        this.updateBullets();
        this.updateEnemies();
        this.updateEnemyBullets();
        this.updateParticles();
        this.checkCollisions();
        this.updateUI();
        
        // Check win condition
        if (this.enemies.filter(e => e.alive).length === 0) {
            this.nextLevel();
        }
        
        // Check lose condition
        if (this.lives <= 0) {
            this.gameOver();
        }
    }
    
    handleInput() {
        // Player movement
        if (this.keys['ArrowLeft'] && this.player.x > 0) {
            this.player.x -= this.player.speed;
        }
        if (this.keys['ArrowRight'] && this.player.x < this.canvas.width - this.player.width) {
            this.player.x += this.player.speed;
        }
    }
    
    shootBullet() {
        this.bullets.push({
            x: this.player.x + this.player.width / 2 - 1,
            y: this.player.y,
            width: 2, // 1 pixel * 2 scale
            height: 8, // 4 pixels * 2 scale
            speed: 8,
            color: THEME.textPrimary
        });
        this.playShootSound();
    }
    
    updateBullets() {
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            bullet.y -= bullet.speed;
            
            if (bullet.y < 0) {
                this.bullets.splice(i, 1);
            }
        }
    }
    
    updateEnemies() {
        let shouldMoveDown = false;
        
        // Check if any enemy in formation hits the edge
        for (const enemy of this.enemies) {
            if (!enemy.alive || !enemy.inFormation) continue;
            
            if ((enemy.x <= 0 && enemy.direction === -1) || 
                (enemy.x >= this.canvas.width - enemy.width && enemy.direction === 1)) {
                shouldMoveDown = true;
                break;
            }
        }
        
        // Move enemies - when formation moves down, update ALL enemies (including diving)
        if (shouldMoveDown) {
            for (const enemy of this.enemies) {
                if (!enemy.alive) continue;
                enemy.originalY += 20;
                if (enemy.inFormation) {
                    enemy.y += 20;
                    enemy.direction *= -1;
                }
            }
        }

        for (const enemy of this.enemies) {
            if (!enemy.alive) continue;
            
            // Formation flying behavior
            if (enemy.inFormation) {
                if (!shouldMoveDown) {
                    enemy.x += enemy.speed * enemy.direction;
                    enemy.originalX += enemy.speed * enemy.direction;
                }
                
                // Occasionally break from formation for attack
                enemy.formationTimer--;
                if (enemy.formationTimer <= 0 && Math.random() < 0.002) {
                    enemy.inFormation = false;
                    enemy.formationTimer = 300 + Math.random() * 300;
                }
            } else {
                // Attack pattern - dive toward player
                const playerCenterX = this.player.x + this.player.width / 2;
                const enemyCenterX = enemy.x + enemy.width / 2;
                
                if (enemyCenterX < playerCenterX) {
                    enemy.x += 2;
                } else if (enemyCenterX > playerCenterX) {
                    enemy.x -= 2;
                }
                
                enemy.y += 3;
                
                // Return to formation if off screen or timer expires
                enemy.formationTimer--;
                if (enemy.y > this.canvas.height || enemy.formationTimer <= 0) {
                    enemy.inFormation = true;
                    enemy.x = enemy.originalX;
                    enemy.y = enemy.originalY; // Use synced originalY from shouldMoveDown
                    enemy.formationTimer = 800 + Math.random() * 400;
                }
            }
            
            // Enemy shooting
            enemy.shootTimer--;
            if (enemy.shootTimer <= 0 && Math.random() < 0.001) {
                this.enemyShoot(enemy);
                enemy.shootTimer = 300 + Math.random() * 200;
            }
        }
    }
    
    enemyShoot(enemy) {
        this.enemyBullets.push({
            x: enemy.x + enemy.width / 2 - 1,
            y: enemy.y + enemy.height,
            width: 2, // 1 pixel * 2 scale
            height: 6, // 3 pixels * 2 scale
            speed: 3,
            color: THEME.enemyRedDark
        });
        this.playEnemyShootSound();
    }
    
    updateEnemyBullets() {
        for (let i = this.enemyBullets.length - 1; i >= 0; i--) {
            const bullet = this.enemyBullets[i];
            bullet.y += bullet.speed;
            
            if (bullet.y > this.canvas.height) {
                this.enemyBullets.splice(i, 1);
            }
        }
    }
    
    updateParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life--;
            
            if (particle.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }
    
    checkCollisions() {
        // Player bullets vs enemies
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            
            for (const enemy of this.enemies) {
                if (!enemy.alive) continue;
                
                if (this.isColliding(bullet, enemy)) {
                    // Create explosion particles (color by enemy type)
                    const explosionColor = enemy.type === 'flagship' ? THEME.enemyPurple : enemy.type === 'galaga' ? THEME.enemyRed : THEME.enemyBlue;
                    this.createExplosion(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, explosionColor);
                    
                    enemy.alive = false;
                    this.bullets.splice(i, 1);
                    
                    // Classic Galaga scoring
                    if (enemy.type === 'flagship') {
                        this.score += 150;
                    } else if (enemy.type === 'galaga') {
                        this.score += 80;
                    } else {
                        this.score += 50;
                    }
                    
                    // Update high score
                    if (this.score > this.highScore) {
                        this.highScore = this.score;
                        localStorage.setItem('galagaHighScore', this.highScore.toString());
                    }
                    
                    this.playEnemyHitSound();
                    break;
                }
            }
        }
        
        // Skip player collision checks during invincibility
        if (this.invincibilityFrames > 0) {
            this.invincibilityFrames--;
        } else {
            // Enemy bullets vs player
            for (let i = this.enemyBullets.length - 1; i >= 0; i--) {
                const bullet = this.enemyBullets[i];
                
                if (this.isColliding(bullet, this.player)) {
                    this.createExplosion(this.player.x + this.player.width / 2, this.player.y + this.player.height / 2, THEME.focus);
                    this.enemyBullets.splice(i, 1);
                    this.lives--;
                    this.playPlayerHitSound();
                    this.player.x = this.canvas.width / 2 - 11;
                    this.invincibilityFrames = 90; // ~1.5 sec at 60fps
                    break;
                }
            }
            
            // Enemies vs player (collision)
            for (const enemy of this.enemies) {
                if (!enemy.alive) continue;
                
                if (this.isColliding(enemy, this.player)) {
                    this.createExplosion(this.player.x + this.player.width / 2, this.player.y + this.player.height / 2, THEME.focus);
                    this.lives--;
                    this.playPlayerHitSound();
                    this.player.x = this.canvas.width / 2 - 11;
                    this.invincibilityFrames = 90;
                    break;
                }
            }
        }
    }
    
    isColliding(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }
    
    createExplosion(x, y, color) {
        for (let i = 0; i < 8; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 6,
                vy: (Math.random() - 0.5) * 6,
                color: color,
                life: 30
            });
        }
    }
    
    nextLevel() {
        this.level++;
        this.invincibilityFrames = 90; // Brief invincibility between levels
        this.createEnemyFormation();
        
        // Increase difficulty
        for (const enemy of this.enemies) {
            enemy.speed = Math.min(enemy.speed + 0.2, 3);
        }
    }
    
    gameOver() {
        this.gameState = 'gameOver';
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('gameOverScreen').style.display = 'block';
    }
    
    updateUI() {
        document.getElementById('score').textContent = this.score.toString().padStart(5, '0');
        document.getElementById('highScore').textContent = this.highScore.toString().padStart(5, '0');
        document.getElementById('lives').textContent = this.lives;
        document.getElementById('finalScore').textContent = this.score.toString().padStart(5, '0');
    }
    
    render() {
        // Clear canvas
        this.ctx.fillStyle = THEME.bg;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw stars background
        this.drawStars();
        
        if (this.gameState === 'playing') {
            this.drawPlayer();
            this.drawBullets();
            this.drawEnemies();
            this.drawEnemyBullets();
            this.drawParticles();
        } else if (this.gameState === 'paused') {
            this.drawPlayer();
            this.drawBullets();
            this.drawEnemies();
            this.drawEnemyBullets();
            this.drawParticles();
            
            // Draw pause overlay
            this.ctx.fillStyle = THEME.overlay;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = THEME.focus;
            this.ctx.font = '48px Silkscreen, Courier New, monospace';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('PAUSED', this.canvas.width / 2, this.canvas.height / 2);
            this.ctx.font = '16px Courier New, monospace';
            this.ctx.fillText('Press ESC to resume', this.canvas.width / 2, this.canvas.height / 2 + 40);
        }
    }
    
    drawStars() {
        const starColors = THEME.starColors;
        const seed = 12345;
        const seededRandom = (i) => ((Math.sin(seed + i * 12.9898) * 43758.5453) % 1 + 1) % 1;
        
        for (let i = 0; i < 120; i++) {
            const x = (seededRandom(i) * this.canvas.width) | 0;
            const y = ((seededRandom(i + 100) * this.canvas.height + this.frameCount * 0.4) % this.canvas.height) | 0;
            this.ctx.fillStyle = starColors[i % starColors.length];
            
            const size = seededRandom(i + 200);
            if (size > 0.92) {
                this.ctx.fillRect(x, y, 2, 2);
            } else if (size > 0.8) {
                this.ctx.fillRect(x, y, 1, 2);
                this.ctx.fillRect(x + 0.5, y - 0.5, 2, 1);
            } else {
                this.ctx.fillRect(x, y, 1, 1);
            }
        }
    }
    
    drawPlayer() {
        this.ctx.shadowBlur = 0;
        // Flash during invincibility
        if (this.invincibilityFrames > 0 && Math.floor(this.invincibilityFrames / 5) % 2 === 0) {
            this.ctx.globalAlpha = 0.5;
        }
        this.drawPixelSprite(this.player.x, this.player.y, this.getPlayerSprite(), 2);
        this.ctx.globalAlpha = 1;
    }
    
    drawBullets() {
        this.ctx.shadowBlur = 0;
        for (const bullet of this.bullets) {
            this.drawPixelSprite(bullet.x, bullet.y, this.getBulletSprite(), 2);
        }
    }
    
    drawEnemies() {
        this.ctx.shadowBlur = 0;
        for (const enemy of this.enemies) {
            if (!enemy.alive) continue;
            
            if (enemy.type === 'flagship') {
                this.drawPixelSprite(enemy.x, enemy.y, this.getFlagshipEnemySprite(), 2);
            } else if (enemy.type === 'galaga') {
                this.drawPixelSprite(enemy.x, enemy.y, this.getGalagaEnemySprite(), 2);
            } else {
                this.drawPixelSprite(enemy.x, enemy.y, this.getBeeEnemySprite(), 2);
            }
        }
    }
    
    drawEnemyBullets() {
        this.ctx.shadowBlur = 0;
        for (const bullet of this.enemyBullets) {
            this.drawPixelSprite(bullet.x, bullet.y, this.getEnemyBulletSprite(), 2);
        }
    }
    
    drawParticles() {
        for (const particle of this.particles) {
            this.ctx.fillStyle = particle.color;
            this.ctx.globalAlpha = particle.life / 30;
            this.ctx.fillRect(particle.x, particle.y, 2, 2);
        }
        this.ctx.globalAlpha = 1;
    }
    
    gameLoop() {
        this.update();
        this.render();
        requestAnimationFrame(() => this.gameLoop());
    }
}

// Start the game when the page loads
window.addEventListener('load', () => {
    new GalagaGame();
});