// Main Game Controller - Orchestrates all game systems

import { CONFIG, GAME_STATE, MATCH_RESULT, TOURNAMENT_STAGE } from './config.js';
import { TournamentManager } from './tournament.js';
import { MatchEngine } from './match.js';
import { UIManager } from './ui.js';

class CricketGame {
    constructor() {
        this.tournament = new TournamentManager();
        this.matchEngine = new MatchEngine();
        this.ui = new UIManager();
        
        this.currentMatch = null;
        this.playerRuns = 0;
        this.playerWickets = 0;
        this.ballsBowled = 0;
        this.isMatchActive = false;
    }

    // Initialize the game
    initialize() {
        this.ui.initialize();
        this.setupCallbacks();
        this.ui.showCountryScreen();
    }

    // Set up all event callbacks
    setupCallbacks() {
        this.ui.setCountrySelectCallback((countryId) => this.onCountrySelected(countryId));
        this.ui.setMatchStartCallback(() => this.onMatchStarted());
        this.ui.setShotSelectCallback((shotId) => this.onShotSelected(shotId));
        this.ui.setNextBallCallback(() => this.onNextBall());
        this.ui.setNextMatchCallback(() => this.onNextMatch());
    }

    // Handle country selection
    onCountrySelected(countryId) {
        console.log('Country selected:', countryId);
        this.tournament.initialize(countryId);
        this.loadCurrentMatch();
    }

    // Load current match data
    loadCurrentMatch() {
        this.currentMatch = this.tournament.getCurrentMatch();
        
        if (!this.currentMatch) {
            console.log('No more matches');
            return;
        }
        
        const opponentCountry = this.currentMatch.opponent;
        this.ui.showMatchInfo(this.currentMatch, this.tournament.selectedCountry, opponentCountry);
        this.ui.updateTournamentProgress(this.tournament.matches);
    }

    // Handle match start
    onMatchStarted() {
        this.isMatchActive = true;
        this.playerRuns = 0;
        this.playerWickets = 0;
        this.ballsBowled = 0;
        
        this.ui.showGameHUD();
        this.ui.updateScore(0, 0, 0, this.currentMatch.target);
        
        // Create stadium elements
        this.createStadiumElements();
        
        // Start first delivery after a short delay
        setTimeout(() => this.startDelivery(), 1000);
    }

    // Create visual stadium elements
    createStadiumElements() {
        const container = document.getElementById('game-container');
        
        // Clear previous elements
        const existingElements = container.querySelectorAll('.stadium-element, .batsman, .bowler, .umpire, .fielder, .cricket-ball');
        existingElements.forEach(el => el.remove());
        
        // Create stadium background
        const stadium = document.createElement('div');
        stadium.id = 'stadium';
        stadium.className = 'stadium-element';
        
        const roof = document.createElement('div');
        roof.className = 'stadium-roof stadium-element';
        
        for (let i = 0; i < 5; i++) {
            const support = document.createElement('div');
            support.className = 'roof-support stadium-element';
            roof.appendChild(support);
        }
        
        stadium.appendChild(roof);
        
        // Floodlights
        for (let i = 0; i < 2; i++) {
            const floodlight = document.createElement('div');
            floodlight.className = 'floodlight stadium-element';
            stadium.appendChild(floodlight);
        }
        
        // Stands
        const stands = document.createElement('div');
        stands.className = 'stands stadium-element';
        
        const standLeft = document.createElement('div');
        standLeft.className = 'stand-section left';
        stands.appendChild(standLeft);
        
        const standCenter = document.createElement('div');
        standCenter.className = 'stand-section center';
        stands.appendChild(standCenter);
        
        const standRight = document.createElement('div');
        standRight.className = 'stand-section right';
        stands.appendChild(standRight);
        
        stadium.appendChild(stands);
        
        // Grass layer
        const grass = document.createElement('div');
        grass.id = 'grass-layer';
        grass.className = 'stadium-element';
        
        const pitch = document.createElement('div');
        pitch.id = 'pitch';
        
        const creaseTop = document.createElement('div');
        creaseTop.className = 'pitch-markings crease top';
        pitch.appendChild(creaseTop);
        
        const creaseBottom = document.createElement('div');
        creaseBottom.className = 'pitch-markings crease bottom';
        pitch.appendChild(creaseBottom);
        
        grass.appendChild(pitch);
        
        const boundary = document.createElement('div');
        boundary.id = 'boundary';
        
        const post1 = document.createElement('div');
        post1.className = 'boundary-post';
        boundary.appendChild(post1);
        
        const post2 = document.createElement('div');
        post2.className = 'boundary-post';
        boundary.appendChild(post2);
        
        grass.appendChild(boundary);
        
        // Create players
        this.createBatsman();
        this.createBowler();
        this.createUmpire();
        this.createFielders();
        
        // Add all to container
        container.insertBefore(stadium, container.firstChild);
        container.appendChild(grass);
    }

    // Create batsman element
    createBatsman() {
        const country = CONFIG.COUNTRIES.find(c => c.id === this.tournament.selectedCountry);
        
        const batsman = document.createElement('div');
        batsman.className = 'batsman player';
        
        const body = document.createElement('div');
        body.className = 'batsman-body';
        if (country) {
            body.classList.add(country.jerseyClass);
        }
        
        const head = document.createElement('div');
        head.className = 'batsman-head';
        
        const helmet = document.createElement('div');
        helmet.className = 'batsman-helmet';
        
        const bat = document.createElement('div');
        bat.className = 'batsman-bat';
        
        body.appendChild(head);
        body.appendChild(helmet);
        body.appendChild(bat);
        batsman.appendChild(body);
        
        document.getElementById('game-container').appendChild(batsman);
    }

    // Create bowler element
    createBowler() {
        const opponentCountry = CONFIG.COUNTRIES.find(c => c.id === this.currentMatch.opponent);
        
        const bowler = document.createElement('div');
        bowler.className = 'bowler player';
        
        const body = document.createElement('div');
        body.className = 'bowler-body';
        if (opponentCountry) {
            body.classList.add(opponentCountry.jerseyClass);
        }
        
        const head = document.createElement('div');
        head.className = 'bowler-head';
        
        const cap = document.createElement('div');
        cap.className = 'bowler-cap';
        
        const arm = document.createElement('div');
        arm.className = 'bowler-arm';
        
        body.appendChild(head);
        body.appendChild(cap);
        body.appendChild(arm);
        bowler.appendChild(body);
        
        document.getElementById('game-container').appendChild(bowler);
    }

    // Create umpire
    createUmpire() {
        const umpire = document.createElement('div');
        umpire.className = 'umpire';
        
        const body = document.createElement('div');
        body.className = 'umpire-body';
        
        const head = document.createElement('div');
        head.className = 'umpire-head';
        
        const hat = document.createElement('div');
        hat.className = 'umpire-hat';
        
        body.appendChild(head);
        body.appendChild(hat);
        umpire.appendChild(body);
        
        document.getElementById('game-container').appendChild(umpire);
    }

    // Create fielders
    createFielders() {
        const positions = [
            { left: '20%', bottom: '40%' },
            { left: '80%', bottom: '40%' },
            { left: '30%', bottom: '50%' },
            { left: '70%', bottom: '50%' },
            { left: '15%', bottom: '35%' },
            { left: '85%', bottom: '35%' }
        ];
        
        const opponentCountry = CONFIG.COUNTRIES.find(c => c.id === this.currentMatch.opponent);
        
        positions.forEach((pos, index) => {
            const fielder = document.createElement('div');
            fielder.className = 'fielder';
            fielder.style.left = pos.left;
            fielder.style.bottom = pos.bottom;
            
            const body = document.createElement('div');
            body.className = 'fielder-body';
            if (opponentCountry) {
                body.classList.add(opponentCountry.jerseyClass);
            }
            
            const head = document.createElement('div');
            head.className = 'fielder-head';
            
            body.appendChild(head);
            fielder.appendChild(body);
            
            document.getElementById('game-container').appendChild(fielder);
        });
    }

    // Start a delivery
    startDelivery() {
        if (!this.isMatchActive) return;
        
        // Check if match is over
        if (this.checkMatchEnd()) {
            return;
        }
        
        const ballType = this.matchEngine.getRandomBallType();
        this.matchEngine.startDelivery(ballType, (result) => this.onBallComplete(result));
        this.matchEngine.createBallElement();
    }

    // Handle shot selection
    onShotSelected(shotId) {
        this.matchEngine.selectShot(shotId);
    }

    // Handle ball completion
    onBallComplete(result) {
        console.log('Ball result:', result);
        
        // Update score
        this.playerRuns += result.runs;
        if (result.isWicket) {
            this.playerWickets++;
        }
        this.ballsBowled++;
        
        // Update UI
        this.ui.updateScore(
            this.playerRuns, 
            this.playerWickets, 
            this.ballsBowled, 
            this.currentMatch.target
        );
        
        // Show result popup
        this.ui.showResult(result);
    }

    // Handle next ball
    onNextBall() {
        this.startDelivery();
    }

    // Check if match has ended
    checkMatchEnd() {
        const target = this.currentMatch.target;
        const maxBalls = this.currentMatch.balls;
        
        // Won
        if (this.playerRuns >= target) {
            this.endMatch(true);
            return true;
        }
        
        // Lost (all out or balls finished)
        if (this.playerWickets >= 10 || this.ballsBowled >= maxBalls) {
            this.endMatch(false);
            return true;
        }
        
        return false;
    }

    // End current match
    endMatch(isWon) {
        this.isMatchActive = false;
        
        const result = isWon ? MATCH_RESULT.WON : MATCH_RESULT.LOST;
        this.tournament.recordResult(result, this.playerRuns, this.playerWickets);
        
        this.ui.showMatchEndResult(isWon, this.playerRuns, this.playerWickets);
    }

    // Handle next match
    onNextMatch() {
        this.ui.hideResultPopup();
        
        if (this.tournament.isTournamentComplete) {
            this.showTournamentEnd();
        } else {
            this.loadCurrentMatch();
        }
    }

    // Show tournament end screen
    showTournamentEnd() {
        const isWon = this.tournament.isTournamentWon();
        
        const popup = document.getElementById('result-popup');
        const title = document.getElementById('result-title');
        const description = document.getElementById('result-description');
        
        title.textContent = isWon ? '🏆 TOURNAMENT CHAMPIONS! 🏆' : 'TOURNAMENT COMPLETE';
        title.style.color = isWon ? '#f39c12' : '#95a5a6';
        
        const summary = this.tournament.getSummary();
        description.innerHTML = `
            Wins: ${summary.totalWins}<br>
            Losses: ${summary.totalLosses}<br>
            ${isWon ? 'You won the World Cup!' : 'Better luck next time!'}
        `;
        
        popup.style.display = 'block';
        
        // Remove next match button
        const nextMatchBtn = document.getElementById('next-match-btn');
        nextMatchBtn.style.display = 'none';
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const game = new CricketGame();
    game.initialize();
    
    // Make game accessible globally for debugging
    window.cricketGame = game;
});
