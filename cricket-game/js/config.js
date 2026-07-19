// Cricket Game Configuration and Constants

const CONFIG = {
    // Tournament Settings
    TOTAL_MATCHES: 8,
    LEAGUE_MATCHES: 5,
    WINS_NEEDED_LEAGUE: 3,
    
    // Match Settings
    MIN_BALLS: 18,
    MAX_BALLS: 60,
    
    // Run Rate Constraints
    LEAGUE_MAX_RUN_RATE: 2.5,  // runs per ball max in league stage
    KNOCKOUT_MAX_RUN_RATE: 3.0, // runs per ball max in knockout
    
    // Slow Motion Settings
    SLOW_MO_DURATION: 3500, // ms
    SLOW_MO_BALL_DISTANCE: 0.7, // 70% of delivery distance
    
    // Shot Types
    SHOTS: [
        { id: 'flick', name: 'Flick', power: 1.2, risk: 0.3 },
        { id: 'cover_drive', name: 'Cover Drive', power: 1.4, risk: 0.4 },
        { id: 'pull_shot', name: 'Pull Shot', power: 1.5, risk: 0.5 },
        { id: 'straight_shot', name: 'Straight Shot', power: 1.3, risk: 0.3 },
        { id: 'scoop', name: 'Scoop', power: 1.8, risk: 0.7 },
        { id: 'over_covers', name: 'Over Covers', power: 1.6, risk: 0.6 },
        { id: 'defend', name: 'Defend', power: 0.2, risk: 0.1 }
    ],
    
    // Ball Types
    BALL_TYPES: [
        { id: 'yorker', name: 'Yorker', speed: 0.9, difficulty: 0.8 },
        { id: 'wide_yorker', name: 'Wide Yorker', speed: 0.85, difficulty: 0.7 },
        { id: 'googly', name: 'Googly', speed: 0.7, difficulty: 0.9 },
        { id: 'pace', name: 'Pace', speed: 1.0, difficulty: 0.5 },
        { id: 'bouncer', name: 'Bouncer', speed: 0.95, difficulty: 0.7 },
        { id: 'off_spin', name: 'Off Spin', speed: 0.6, difficulty: 0.6 },
        { id: 'leg_spin', name: 'Leg Spin', speed: 0.65, difficulty: 0.65 },
        { id: 'carrom', name: 'Carrom Ball', speed: 0.75, difficulty: 0.85 }
    ],
    
    // Countries
    COUNTRIES: [
        { 
            id: 'india', 
            name: 'India', 
            jerseyClass: 'jersey-india',
            primaryColor: '#1e90ff',
            secondaryColor: '#ff9933'
        },
        { 
            id: 'pakistan', 
            name: 'Pakistan', 
            jerseyClass: 'jersey-pakistan',
            primaryColor: '#00a651',
            secondaryColor: '#ffffff'
        },
        { 
            id: 'bangladesh', 
            name: 'Bangladesh', 
            jerseyClass: 'jersey-bangladesh',
            primaryColor: '#006a4e',
            secondaryColor: '#f42a41'
        },
        { 
            id: 'australia', 
            name: 'Australia', 
            jerseyClass: 'jersey-australia',
            primaryColor: '#ffd700',
            secondaryColor: '#008751'
        },
        { 
            id: 'newzealand', 
            name: 'New Zealand', 
            jerseyClass: 'jersey-newzealand',
            primaryColor: '#1a1a1a',
            secondaryColor: '#c41230'
        },
        { 
            id: 'england', 
            name: 'England', 
            jerseyClass: 'jersey-england',
            primaryColor: '#ffffff',
            secondaryColor: '#cf142b'
        }
    ],
    
    // Opponent rotation for tournament
    OPPONENTS_ORDER: ['newzealand', 'england', 'australia', 'pakistan', 'bangladesh']
};

// Game States
const GAME_STATE = {
    MENU: 'menu',
    COUNTRY_SELECT: 'country_select',
    MATCH_INFO: 'match_info',
    BOWLING_RUNUP: 'bowling_runup',
    SLOW_MO: 'slow_mo',
    SHOT_SELECTION: 'shot_selection',
    BALL_IN_PLAY: 'ball_in_play',
    RESULT_DISPLAY: 'result_display',
    MATCH_END: 'match_end',
    TOURNAMENT_END: 'tournament_end'
};

// Match Results
const MATCH_RESULT = {
    WON: 'won',
    LOST: 'lost',
    TIED: 'tied'
};

// Tournament Stages
const TOURNAMENT_STAGE = {
    LEAGUE: 'league',
    SEMI_FINAL: 'semi_final',
    FINAL: 'final'
};

export { CONFIG, GAME_STATE, MATCH_RESULT, TOURNAMENT_STAGE };
