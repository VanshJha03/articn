// Tournament Manager - Handles match scheduling, progression, and results

import { CONFIG, TOURNAMENT_STAGE, MATCH_RESULT } from './config.js';

class TournamentManager {
    constructor() {
        this.selectedCountry = null;
        this.currentMatchIndex = 0;
        this.wins = 0;
        this.losses = 0;
        this.matches = [];
        this.isTournamentComplete = false;
    }

    // Initialize tournament with selected country
    initialize(countryId) {
        this.selectedCountry = countryId;
        this.currentMatchIndex = 0;
        this.wins = 0;
        this.losses = 0;
        this.isTournamentComplete = false;
        this.generateMatches();
    }

    // Generate all matches for the tournament
    generateMatches() {
        this.matches = [];
        
        // League stage (matches 1-5)
        for (let i = 0; i < CONFIG.LEAGUE_MATCHES; i++) {
            const opponent = CONFIG.OPPONENTS_ORDER[i % CONFIG.OPPONENTS_ORDER.length];
            const matchData = this.generateMatchData(TOURNAMENT_STAGE.LEAGUE, i + 1);
            
            this.matches.push({
                index: i,
                stage: TOURNAMENT_STAGE.LEAGUE,
                matchNumber: i + 1,
                opponent: opponent,
                target: matchData.target,
                balls: matchData.balls,
                result: null,
                isPlayed: false
            });
        }
        
        // Semi-finals (matches 6-7) - only if qualified
        this.matches.push({
            index: 5,
            stage: TOURNAMENT_STAGE.SEMI_FINAL,
            matchNumber: 6,
            opponent: this.getSemifinalOpponent(1),
            target: null,
            balls: null,
            result: null,
            isPlayed: false,
            isConditional: true
        });
        
        this.matches.push({
            index: 6,
            stage: TOURNAMENT_STAGE.SEMI_FINAL,
            matchNumber: 7,
            opponent: this.getSemifinalOpponent(2),
            target: null,
            balls: null,
            result: null,
            isPlayed: false,
            isConditional: true
        });
        
        // Final (match 8)
        this.matches.push({
            index: 7,
            stage: TOURNAMENT_STAGE.FINAL,
            matchNumber: 8,
            opponent: 'TBD',
            target: null,
            balls: null,
            result: null,
            isPlayed: false,
            isConditional: true
        });
    }

    // Generate realistic target for a match
    generateMatchData(stage, matchNumber) {
        let maxRunRate;
        let minBalls;
        let maxBalls;
        
        if (stage === TOURNAMENT_STAGE.LEAGUE) {
            maxRunRate = CONFIG.LEAGUE_MAX_RUN_RATE;
            minBalls = CONFIG.MIN_BALLS;
            maxBalls = CONFIG.MAX_BALLS;
        } else {
            maxRunRate = CONFIG.KNOCKOUT_MAX_RUN_RATE;
            minBalls = CONFIG.MIN_BALLS;
            maxBalls = CONFIG.MAX_BALLS;
        }
        
        // Generate random balls within range
        const balls = Math.floor(Math.random() * (maxBalls - minBalls + 1)) + minBalls;
        
        // Calculate target based on run rate
        // Add some variance for tense situations
        const baseTarget = Math.floor(balls * maxRunRate * (0.7 + Math.random() * 0.3));
        
        // Occasionally create tense situations (high target, fewer balls)
        let target = baseTarget;
        if (Math.random() < 0.15 && stage !== TOURNAMENT_STAGE.LEAGUE) {
            // Tense situation: higher required run rate
            const tenseMultiplier = 1.2 + Math.random() * 0.3;
            target = Math.floor(balls * maxRunRate * tenseMultiplier);
        }
        
        // Ensure target is reasonable (at least 1 run per ball minimum scenario)
        target = Math.max(target, Math.floor(balls * 0.8));
        
        return { target, balls };
    }

    // Get semifinal opponent based on tournament logic
    getSemifinalOpponent(slot) {
        const availableOpponents = CONFIG.COUNTRIES
            .filter(c => c.id !== this.selectedCountry)
            .filter(c => !CONFIG.OPPONENTS_ORDER.slice(0, 5).includes(c.id) || Math.random() > 0.5);
        
        if (availableOpponents.length === 0) {
            return CONFIG.OPPONENTS_ORDER[slot % CONFIG.OPPONENTS_ORDER.length];
        }
        
        return availableOpponents[slot % availableOpponents.length].id;
    }

    // Get current match
    getCurrentMatch() {
        if (this.currentMatchIndex >= this.matches.length) {
            return null;
        }
        return this.matches[this.currentMatchIndex];
    }

    // Check if player qualified for semifinals
    checkQualification() {
        if (this.currentMatchIndex < CONFIG.LEAGUE_MATCHES) {
            return true; // Still in league stage
        }
        
        // After league stage, check if won enough matches
        return this.wins >= CONFIG.WINS_NEEDED_LEAGUE;
    }

    // Record match result
    recordResult(result, runsScored, wicketsLost) {
        const currentMatch = this.getCurrentMatch();
        if (!currentMatch) return false;
        
        currentMatch.result = result;
        currentMatch.isPlayed = true;
        currentMatch.runsScored = runsScored;
        currentMatch.wicketsLost = wicketsLost;
        
        if (result === MATCH_RESULT.WON) {
            this.wins++;
        } else if (result === MATCH_RESULT.LOST) {
            this.losses++;
        }
        
        // Move to next match if qualified
        this.currentMatchIndex++;
        
        // Update conditional matches
        this.updateConditionalMatches();
        
        return true;
    }

    // Update conditional matches based on tournament progression
    updateConditionalMatches() {
        // Check qualification for semifinals
        if (this.currentMatchIndex === CONFIG.LEAGUE_MATCHES) {
            if (!this.checkQualification()) {
                // Did not qualify - tournament over
                this.isTournamentComplete = true;
                return;
            }
            
            // Generate semifinal targets
            const semi1Data = this.generateMatchData(TOURNAMENT_STAGE.SEMI_FINAL, 6);
            const semi2Data = this.generateMatchData(TOURNAMENT_STAGE.SEMI_FINAL, 7);
            
            this.matches[5].target = semi1Data.target;
            this.matches[5].balls = semi1Data.balls;
            
            this.matches[6].target = semi2Data.target;
            this.matches[6].balls = semi2Data.balls;
        }
        
        // Check if reached final
        if (this.currentMatchIndex === 7) {
            const finalData = this.generateMatchData(TOURNAMENT_STAGE.FINAL, 8);
            this.matches[7].target = finalData.target;
            this.matches[7].balls = finalData.balls;
            
            // Set final opponent
            const remainingOpponents = CONFIG.COUNTRIES
                .filter(c => c.id !== this.selectedCountry);
            this.matches[7].opponent = 
                remainingOpponents[Math.floor(Math.random() * remainingOpponents.length)].id;
        }
        
        // Check if tournament complete
        if (this.currentMatchIndex >= this.matches.length) {
            this.isTournamentComplete = true;
        }
    }

    // Get tournament summary
    getSummary() {
        return {
            selectedCountry: this.selectedCountry,
            totalWins: this.wins,
            totalLosses: this.losses,
            currentMatchIndex: this.currentMatchIndex,
            isComplete: this.isTournamentComplete,
            matches: this.matches.filter(m => m.isPlayed)
        };
    }

    // Check if tournament is won
    isTournamentWon() {
        if (!this.isTournamentComplete) return false;
        
        // Must win final to win tournament
        const finalMatch = this.matches.find(m => m.stage === TOURNAMENT_STAGE.FINAL);
        return finalMatch && finalMatch.result === MATCH_RESULT.WON;
    }
}

export { TournamentManager };
