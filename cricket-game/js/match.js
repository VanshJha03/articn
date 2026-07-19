// Match Engine - Handles ball physics, shot mechanics, and gameplay

import { CONFIG, GAME_STATE, MATCH_RESULT } from './config.js';

class MatchEngine {
    constructor() {
        this.currentBall = null;
        this.selectedShot = null;
        this.ballPosition = { x: 0, y: 0 };
        this.isSlowMo = false;
        this.slowMoTimer = null;
        this.onBallComplete = null;
    }

    // Initialize a new delivery
    startDelivery(ballType, callback) {
        this.currentBall = {
            type: ballType,
            startX: window.innerWidth / 2,
            startY: window.innerHeight * 0.3,
            endX: window.innerWidth / 2,
            endY: window.innerHeight * 0.8,
            progress: 0,
            speed: ballType.speed || 1.0,
            difficulty: ballType.difficulty || 0.5
        };
        
        this.onBallComplete = callback;
        this.startBowlingAnimation();
    }

    // Animate bowler runup and delivery
    startBowlingAnimation() {
        const bowlerEl = document.querySelector('.bowler');
        if (bowlerEl) {
            bowlerEl.classList.add('bowling-runup');
            
            setTimeout(() => {
                bowlerEl.classList.remove('bowling-runup');
                bowlerEl.classList.add('bowling-delivery');
                
                setTimeout(() => {
                    bowlerEl.classList.remove('bowling-delivery');
                    this.startSlowMotion();
                }, 500);
            }, 1000);
        } else {
            this.startSlowMotion();
        }
    }

    // Start slow motion sequence
    startSlowMotion() {
        this.isSlowMo = true;
        
        // Apply grayscale filter
        document.getElementById('game-container').classList.add('slow-mo-active');
        
        // Show shot selector
        this.showShotSelector();
        
        // Start slow motion timer
        let elapsed = 0;
        const interval = 50;
        
        this.slowMoTimer = setInterval(() => {
            elapsed += interval;
            
            // Update ball position during slow mo (70% of distance)
            const slowMoProgress = (elapsed / CONFIG.SLOW_MO_DURATION) * CONFIG.SLOW_MO_BALL_DISTANCE;
            this.updateBallPosition(slowMoProgress);
            
            if (elapsed >= CONFIG.SLOW_MO_DURATION) {
                this.endSlowMotion();
            }
        }, interval);
    }

    // End slow motion and return to normal speed
    endSlowMotion() {
        clearInterval(this.slowMoTimer);
        this.isSlowMo = false;
        
        // Remove grayscale filter
        document.getElementById('game-container').classList.remove('slow-mo-active');
        
        // Hide shot selector
        this.hideShotSelector();
        
        // Continue ball at normal speed
        this.continueBallFlight();
    }

    // Show shot selection buttons
    showShotSelector() {
        const selector = document.getElementById('shot-selector');
        if (selector) {
            selector.style.display = 'flex';
            
            // Enable all buttons
            const buttons = selector.querySelectorAll('.shot-btn');
            buttons.forEach(btn => {
                btn.disabled = false;
            });
        }
    }

    // Hide shot selection buttons
    hideShotSelector() {
        const selector = document.getElementById('shot-selector');
        if (selector) {
            selector.style.display = 'none';
            
            // Disable all buttons
            const buttons = selector.querySelectorAll('.shot-btn');
            buttons.forEach(btn => {
                btn.disabled = true;
            });
        }
    }

    // Select a shot
    selectShot(shotId) {
        if (!this.isSlowMo) return;
        
        this.selectedShot = CONFIG.SHOTS.find(s => s.id === shotId);
        
        // Hide selector immediately after selection
        this.hideShotSelector();
        
        // End slow motion early if shot selected
        this.endSlowMotion();
    }

    // Continue ball flight after slow motion
    continueBallFlight() {
        let progress = CONFIG.SLOW_MO_BALL_DISTANCE;
        const speedMultiplier = this.currentBall.speed * 2; // Faster after slow mo
        
        const animate = () => {
            progress += 0.02 * speedMultiplier;
            this.updateBallPosition(progress);
            
            if (progress >= 1.0) {
                this.completeDelivery();
            } else {
                requestAnimationFrame(animate);
            }
        };
        
        animate();
    }

    // Update ball visual position
    updateBallPosition(progress) {
        const ball = this.currentBall;
        if (!ball) return;
        
        const currentX = ball.startX + (ball.endX - ball.startX) * progress;
        const currentY = ball.startY + (ball.endY - ball.startY) * progress;
        
        this.ballPosition = { x: currentX, y: currentY };
        
        // Update ball element
        const ballEl = document.querySelector('.cricket-ball');
        if (ballEl) {
            ballEl.style.left = `${currentX}px`;
            ballEl.style.top = `${currentY}px`;
            
            // Add rotation effect
            ballEl.style.transform = `rotate(${progress * 720}deg)`;
        }
    }

    // Complete the delivery and calculate result
    completeDelivery() {
        const result = this.calculateShotResult();
        
        // Remove ball element
        const ballEl = document.querySelector('.cricket-ball');
        if (ballEl) {
            ballEl.remove();
        }
        
        // Callback with result
        if (this.onBallComplete) {
            this.onBallComplete(result);
        }
        
        // Reset state
        this.currentBall = null;
        this.selectedShot = null;
    }

    // Calculate shot result based on shot type, timing, and risk
    calculateShotResult() {
        if (!this.selectedShot) {
            // No shot selected - likely a dot ball or wicket
            return this.calculateMissedShotResult();
        }
        
        const shot = this.selectedShot;
        const ball = this.currentBall;
        
        // Base calculation factors
        const timingBonus = Math.random(); // Simulates timing quality
        const riskFactor = Math.random();
        
        // Calculate runs
        let runs = 0;
        let isWicket = false;
        let isBoundary = false;
        let shotDescription = '';
        
        // Risk check - higher risk shots more likely to fail
        if (riskFactor < shot.risk * 0.5) {
            // High risk failed
            if (Math.random() < 0.3) {
                isWicket = true;
                shotDescription = 'Edge taken! Caught!';
            } else {
                runs = 0;
                shotDescription = 'Mistimed! No run.';
            }
        } else {
            // Successful shot
            const baseRuns = Math.floor(shot.power * 4 * timingBonus);
            
            if (baseRuns >= 6) {
                runs = 6;
                isBoundary = true;
                shotDescription = 'MASSIVE SIX! Out of the stadium!';
            } else if (baseRuns >= 4) {
                runs = 4;
                isBoundary = true;
                shotDescription = 'Beautiful shot! Four runs!';
            } else if (baseRuns >= 2) {
                runs = 2;
                shotDescription = 'Good running! Two runs.';
            } else if (baseRuns >= 1) {
                runs = 1;
                shotDescription = 'Quick single!';
            } else {
                runs = 0;
                shotDescription = 'Defended well. No run.';
            }
        }
        
        return {
            runs,
            isWicket,
            isBoundary,
            description: shotDescription,
            shotType: shot.name,
            ballType: ball.type.name
        };
    }

    // Calculate result when no shot is selected
    calculateMissedShotResult() {
        const rand = Math.random();
        
        if (rand < 0.1) {
            return {
                runs: 0,
                isWicket: true,
                isBoundary: false,
                description: 'Bowled him! Clean strike!',
                shotType: 'None',
                ballType: this.currentBall?.type.name || 'Unknown'
            };
        } else if (rand < 0.3) {
            return {
                runs: 0,
                isWicket: false,
                isBoundary: false,
                description: 'Beaten! Good delivery.',
                shotType: 'None',
                ballType: this.currentBall?.type.name || 'Unknown'
            };
        } else {
            return {
                runs: 0,
                isWicket: false,
                isBoundary: false,
                description: 'No shot played. Dot ball.',
                shotType: 'None',
                ballType: this.currentBall?.type.name || 'Unknown'
            };
        }
    }

    // Create ball element
    createBallElement() {
        const ballEl = document.createElement('div');
        ballEl.className = 'cricket-ball';
        
        const seam = document.createElement('div');
        seam.className = 'ball-seam';
        ballEl.appendChild(seam);
        
        ballEl.style.left = `${this.currentBall.startX}px`;
        ballEl.style.top = `${this.currentBall.startY}px`;
        
        document.getElementById('game-container').appendChild(ballEl);
        
        return ballEl;
    }

    // Get random ball type for delivery
    getRandomBallType() {
        const index = Math.floor(Math.random() * CONFIG.BALL_TYPES.length);
        return CONFIG.BALL_TYPES[index];
    }
}

export { MatchEngine };
