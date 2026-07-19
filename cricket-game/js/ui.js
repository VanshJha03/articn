// UI Manager - Handles all user interface interactions and displays

import { CONFIG, GAME_STATE, TOURNAMENT_STAGE, MATCH_RESULT } from './config.js';

class UIManager {
    constructor() {
        this.currentGameState = GAME_STATE.MENU;
        this.onCountrySelect = null;
        this.onMatchStart = null;
        this.onShotSelect = null;
        this.onNextMatch = null;
    }

    // Initialize UI elements
    initialize() {
        this.createCountryScreen();
        this.createMatchInfoScreen();
        this.createGameHUD();
        this.createResultPopup();
        this.createTournamentProgress();
        
        // Set up event listeners
        this.setupEventListeners();
    }

    // Create country selection screen
    createCountryScreen() {
        const screen = document.createElement('div');
        screen.id = 'country-screen';
        screen.className = 'fade-in';
        
        const title = document.createElement('h1');
        title.textContent = '🏏 CRICKET WORLD CUP 🏏';
        title.style.color = '#f39c12';
        
        const subtitle = document.createElement('p');
        subtitle.textContent = 'Select Your Team';
        subtitle.style.fontSize = '1.5rem';
        subtitle.style.marginBottom = '2rem';
        subtitle.style.color = '#bdc3c7';
        
        const grid = document.createElement('div');
        grid.className = 'country-grid';
        
        CONFIG.COUNTRIES.forEach(country => {
            const card = document.createElement('div');
            card.className = 'country-card fade-in';
            card.dataset.countryId = country.id;
            
            const flag = document.createElement('div');
            flag.className = 'country-flag';
            flag.style.background = `linear-gradient(135deg, ${country.primaryColor}, ${country.secondaryColor})`;
            
            const name = document.createElement('div');
            name.className = 'country-name';
            name.textContent = country.name;
            name.style.color = country.id === 'england' ? '#2c3e50' : 'white';
            
            card.appendChild(flag);
            card.appendChild(name);
            grid.appendChild(card);
        });
        
        screen.appendChild(title);
        screen.appendChild(subtitle);
        screen.appendChild(grid);
        
        document.getElementById('ui-layer').appendChild(screen);
    }

    // Create match info screen
    createMatchInfoScreen() {
        const screen = document.createElement('div');
        screen.id = 'match-info-screen';
        
        const details = document.createElement('div');
        details.className = 'match-details fade-in';
        
        const title = document.createElement('h2');
        title.id = 'match-title';
        title.textContent = 'Match 1';
        
        const teams = document.createElement('p');
        teams.id = 'match-teams';
        teams.style.fontSize = '1.5rem';
        teams.style.margin = '1rem 0';
        teams.textContent = 'India vs New Zealand';
        
        const target = document.createElement('div');
        target.className = 'target-display';
        target.id = 'match-target';
        target.textContent = 'Chase 189 in 60 balls';
        
        const stage = document.createElement('p');
        stage.id = 'match-stage';
        stage.style.color = '#95a5a6';
        stage.style.marginTop = '1rem';
        stage.textContent = 'League Stage';
        
        const startBtn = document.createElement('button');
        startBtn.className = 'start-btn';
        startBtn.textContent = 'START MATCH';
        startBtn.id = 'start-match-btn';
        
        details.appendChild(title);
        details.appendChild(teams);
        details.appendChild(target);
        details.appendChild(stage);
        details.appendChild(startBtn);
        
        screen.appendChild(details);
        document.getElementById('ui-layer').appendChild(screen);
    }

    // Create game HUD (Heads Up Display)
    createGameHUD() {
        const hud = document.createElement('div');
        hud.id = 'game-hud';
        
        // Score board
        const scoreBoard = document.createElement('div');
        scoreBoard.className = 'score-board';
        
        const scoreMain = document.createElement('div');
        scoreMain.className = 'score-main';
        scoreMain.id = 'score-display';
        scoreMain.textContent = '0/0';
        
        const scoreSub = document.createElement('div');
        scoreSub.className = 'score-sub';
        scoreSub.id = 'overs-display';
        scoreSub.textContent = 'Overs: 0.0 | Target: 189';
        
        scoreBoard.appendChild(scoreMain);
        scoreBoard.appendChild(scoreSub);
        
        // Required run rate
        const reqRate = document.createElement('div');
        reqRate.className = 'score-board';
        reqRate.style.textAlign = 'right';
        
        const reqMain = document.createElement('div');
        reqMain.className = 'score-main';
        reqMain.id = 'required-display';
        reqMain.style.fontSize = '1.5rem';
        reqMain.textContent = 'Need 189';
        
        const reqSub = document.createElement('div');
        reqSub.className = 'score-sub';
        reqSub.id = 'rr-display';
        reqSub.textContent = 'RR: 0.00 | RRR: 0.00';
        
        reqRate.appendChild(reqMain);
        reqRate.appendChild(reqSub);
        
        hud.appendChild(scoreBoard);
        hud.appendChild(reqRate);
        
        // Shot selector
        const shotSelector = document.createElement('div');
        shotSelector.className = 'shot-selector';
        shotSelector.id = 'shot-selector';
        
        CONFIG.SHOTS.forEach(shot => {
            const btn = document.createElement('button');
            btn.className = 'shot-btn';
            btn.textContent = shot.name;
            btn.dataset.shotId = shot.id;
            btn.disabled = true;
            shotSelector.appendChild(btn);
        });
        
        hud.appendChild(shotSelector);
        
        document.getElementById('ui-layer').appendChild(hud);
    }

    // Create result popup
    createResultPopup() {
        const popup = document.createElement('div');
        popup.id = 'result-popup';
        
        const title = document.createElement('h2');
        title.id = 'result-title';
        title.textContent = 'FOUR!';
        
        const description = document.createElement('p');
        description.id = 'result-description';
        description.textContent = 'Beautiful shot through covers!';
        
        const nextBtn = document.createElement('button');
        nextBtn.className = 'start-btn';
        nextBtn.id = 'next-ball-btn';
        nextBtn.textContent = 'Next Ball';
        nextBtn.style.display = 'none';
        
        const nextMatchBtn = document.createElement('button');
        nextMatchBtn.className = 'start-btn';
        nextMatchBtn.id = 'next-match-btn';
        nextMatchBtn.textContent = 'Next Match';
        nextMatchBtn.style.display = 'none';
        nextMatchBtn.style.background = 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)';
        
        popup.appendChild(title);
        popup.appendChild(description);
        popup.appendChild(nextBtn);
        popup.appendChild(nextMatchBtn);
        
        document.getElementById('ui-layer').appendChild(popup);
    }

    // Create tournament progress indicator
    createTournamentProgress() {
        const progress = document.createElement('div');
        progress.id = 'tournament-progress';
        
        for (let i = 0; i < CONFIG.TOTAL_MATCHES; i++) {
            const item = document.createElement('div');
            item.className = 'progress-item';
            
            const dot = document.createElement('div');
            dot.className = 'progress-dot';
            dot.id = `progress-dot-${i}`;
            
            const label = document.createElement('span');
            label.textContent = `Match ${i + 1}`;
            
            item.appendChild(dot);
            item.appendChild(label);
            progress.appendChild(item);
        }
        
        document.getElementById('ui-layer').appendChild(progress);
    }

    // Set up event listeners
    setupEventListeners() {
        // Country selection
        document.addEventListener('click', (e) => {
            if (e.target.closest('.country-card')) {
                const countryId = e.target.closest('.country-card').dataset.countryId;
                if (this.onCountrySelect) {
                    this.onCountrySelect(countryId);
                }
            }
            
            if (e.target.id === 'start-match-btn') {
                if (this.onMatchStart) {
                    this.onMatchStart();
                }
            }
            
            if (e.target.classList.contains('shot-btn')) {
                const shotId = e.target.dataset.shotId;
                if (this.onShotSelect) {
                    this.onShotSelect(shotId);
                }
            }
            
            if (e.target.id === 'next-ball-btn') {
                this.hideResultPopup();
                if (this.onNextBall) {
                    this.onNextBall();
                }
            }
            
            if (e.target.id === 'next-match-btn') {
                if (this.onNextMatch) {
                    this.onNextMatch();
                }
            }
        });
    }

    // Show/hide screens
    showCountryScreen() {
        document.getElementById('country-screen').style.display = 'flex';
        document.getElementById('match-info-screen').style.display = 'none';
        document.getElementById('game-hud').style.display = 'none';
        document.getElementById('tournament-progress').style.display = 'none';
        this.currentGameState = GAME_STATE.COUNTRY_SELECT;
    }

    showMatchInfo(matchData, playerCountry, opponentCountry) {
        document.getElementById('country-screen').style.display = 'none';
        document.getElementById('match-info-screen').style.display = 'flex';
        document.getElementById('game-hud').style.display = 'none';
        document.getElementById('tournament-progress').style.display = 'block';
        
        document.getElementById('match-title').textContent = 
            `Match ${matchData.matchNumber} - ${matchData.stage === TOURNAMENT_STAGE.LEAGUE ? 'League Stage' : matchData.stage === TOURNAMENT_STAGE.SEMI_FINAL ? 'Semi Final' : 'Final'}`;
        
        const playerName = CONFIG.COUNTRIES.find(c => c.id === playerCountry)?.name || playerCountry;
        const opponentName = CONFIG.COUNTRIES.find(c => c.id === opponentCountry)?.name || opponentCountry;
        document.getElementById('match-teams').textContent = `${playerName} vs ${opponentName}`;
        
        document.getElementById('match-target').textContent = 
            `Chase ${matchData.target} in ${matchData.balls} balls`;
        
        document.getElementById('match-stage').textContent = 
            matchData.stage === TOURNAMENT_STAGE.LEAGUE ? 'League Stage' : 
            matchData.stage === TOURNAMENT_STAGE.SEMI_FINAL ? 'Semi Final' : 'Final';
        
        this.currentGameState = GAME_STATE.MATCH_INFO;
    }

    showGameHUD() {
        document.getElementById('match-info-screen').style.display = 'none';
        document.getElementById('game-hud').style.display = 'flex';
        this.currentGameState = GAME_STATE.BOWLING_RUNUP;
    }

    updateScore(runs, wickets, ballsBowled, target) {
        document.getElementById('score-display').textContent = `${runs}/${wickets}`;
        
        const overs = Math.floor(ballsBowled / 6);
        const balls = ballsBowled % 6;
        document.getElementById('overs-display').textContent = 
            `Overs: ${overs}.${balls} | Target: ${target}`;
        
        const runsNeeded = target - runs;
        const ballsRemaining = (target > 0 ? 60 : 0) - ballsBowled; // Simplified
        
        document.getElementById('required-display').textContent = 
            runsNeeded > 0 ? `Need ${runsNeeded}` : 'Won!';
        
        const currentRR = ballsBowled > 0 ? (runs / ballsBowled).toFixed(2) : '0.00';
        const requiredRR = ballsRemaining > 0 && runsNeeded > 0 ? 
            (runsNeeded / ballsRemaining).toFixed(2) : '0.00';
        
        document.getElementById('rr-display').textContent = 
            `RR: ${currentRR} | RRR: ${requiredRR}`;
    }

    showResult(result) {
        const popup = document.getElementById('result-popup');
        const title = document.getElementById('result-title');
        const description = document.getElementById('result-description');
        const nextBtn = document.getElementById('next-ball-btn');
        
        if (result.isWicket) {
            title.textContent = 'OUT!';
            title.style.color = '#e74c3c';
        } else if (result.isBoundary) {
            title.textContent = result.runs === 6 ? 'SIX!' : 'FOUR!';
            title.style.color = '#f39c12';
        } else if (result.runs > 0) {
            title.textContent = `${result.runs} RUN${result.runs > 1 ? 'S' : ''}!`;
            title.style.color = '#2ecc71';
        } else {
            title.textContent = 'DOT BALL';
            title.style.color = '#95a5a6';
        }
        
        description.textContent = result.description;
        
        popup.style.display = 'block';
        nextBtn.style.display = 'inline-block';
        
        this.currentGameState = GAME_STATE.RESULT_DISPLAY;
    }

    showMatchEndResult(isWon, runs, wickets) {
        const popup = document.getElementById('result-popup');
        const title = document.getElementById('result-title');
        const description = document.getElementById('result-description');
        const nextMatchBtn = document.getElementById('next-match-btn');
        
        title.textContent = isWon ? 'MATCH WON! 🎉' : 'MATCH LOST 😞';
        title.style.color = isWon ? '#2ecc71' : '#e74c3c';
        
        description.textContent = `You scored ${runs}/${wickets}`;
        
        popup.style.display = 'block';
        nextMatchBtn.style.display = 'inline-block';
        
        this.currentGameState = GAME_STATE.MATCH_END;
    }

    hideResultPopup() {
        document.getElementById('result-popup').style.display = 'none';
    }

    updateTournamentProgress(matches) {
        matches.forEach((match, index) => {
            const dot = document.getElementById(`progress-dot-${index}`);
            if (dot) {
                dot.className = 'progress-dot';
                
                if (match.result === MATCH_RESULT.WON) {
                    dot.classList.add('won');
                } else if (match.result === MATCH_RESULT.LOST) {
                    dot.classList.add('lost');
                }
                
                if (index === matches.length) {
                    dot.classList.add('current');
                }
            }
        });
    }

    // Callback setters
    setCountrySelectCallback(callback) {
        this.onCountrySelect = callback;
    }

    setMatchStartCallback(callback) {
        this.onMatchStart = callback;
    }

    setShotSelectCallback(callback) {
        this.onShotSelect = callback;
    }

    setNextBallCallback(callback) {
        this.onNextBall = callback;
    }

    setNextMatchCallback(callback) {
        this.onNextMatch = callback;
    }
}

export { UIManager };
