// GAME SETTINGS
var MAX_GUESSES = 10;
var HANDLE_REPEAT_GUESSES = false;
var WORD_LIST = [
    'watermelon',
    'pineapple',
    'orange',
    'banana',
    'apple',
    'pear'
];

// Store the game logic inside its own object
var game = {

    // Set up variables we'll be using to keep track of game data
    currentState: '',
    currentWord: '',
    uniqueLetters: 0,
    wins: 0,
    losses: 0,
    guesses: 0,
    keysRevealed: [],
    keysIncorrect: [],

    // Create a method to handle setting up a new game
    setupNewGame: function() {
        this.currentWord = '';
        this.uniqueLetters = 0;
        this.wins = 0;
        this.losses = 0;
        this.guesses = 0;
        this.keysRevealed = [];
        this.keysIncorrect = [];
    },

    // Create a method for applying guessing logic to a given key character
    makeGuess: function(keyGuessed) {
        // If our key has been guessed before, we waste a guess (if enabled)
        if (this.keysIncorrect.indexOf(keyGuessed) !== -1 || this.keysRevealed.indexOf(keyGuessed) !== -1) {
            if (HANDLE_REPEAT_GUESSES) {
                this.handleRepeatGuess(keyGuessed);
            }
        }
        // If our key doesn't exist in the current word, we waste a guess
        else if (this.currentWord.indexOf(keyGuessed) === -1) {
            this.handleIncorrectGuess(keyGuessed);
        }
        // Otherwise, we are a newly-guessed key and should reveal the relevant letters
        else {
            this.handleCorrectGuess(keyGuessed);
        }
    },

    // Create a method for handling a repeat key guess
    handleRepeatGuess(keyGuess) {
        this.guesses++;

        // If we've reached maximum guesses, we lost the game
        if (this.guesses === MAX_GUESSES) {
            this.switchState('game-lose');
        }
        // Otherwise, continue on as usual and just update the screen
        else {
            this.updateScreen();
        }
    },
    
    // Create a method for handling an incorrect key guess
    handleIncorrectGuess(keyGuessed) {
        this.guesses++;

        this.keysIncorrect.push(keyGuessed);

        // If we've reached maximum guesses, we lost the game
        if (this.guesses === MAX_GUESSES) {
            this.switchState('game-lose');
        }
        // Otherwise, continue on as usual and just update the screen
        else {
            this.updateScreen();
        }
    },
    
    // Create a method for handling a correct key guess
    handleCorrectGuess(keyGuessed) {
        this.guesses++;

        this.keysRevealed.push(keyGuessed);

        // If we guessed all the characters correctly, we won the game.
        // NOTE: We do this check before determining if max guesses have been reached because we want the player to be able to win on their last guess.
        if (this.uniqueLetters === this.keysRevealed.length) {
            this.switchState('game-win');
        }
        // If we've reached maximum guesses, we lost the game
        else if (this.guesses === MAX_GUESSES) {
            this.switchState('game-lose');
        }
        // Otherwise, continue on as usual and just update the screen
        else {
            this.updateScreen();
        }
    },

    // Create a method for updating the screen
    updateScreen() {

    },

    // We'll use a state machine to keep track of our different game states' logic
    stateObjects: {
        'start-screen': {
            unloadState: function() {
                // Make sure our key event handler is removed
                document.onkeyup = undefined;

                console.log("unloading: start-screen");
            },
            loadState: function() {
                // If any key is pressed, we should start the game
                document.onkeyup = function(event) {
                    // Set up a new game
                    game.setupNewGame();

                    // Since 'this' isn't referencing the game object here, we'll just reference it through the global 'game' variable
                    game.switchState('wait-for-game-input');
                };

                console.log("loading: start-screen");
            }
        },
        'wait-for-game-input': {
            unloadState: function() {

                console.log("unloading: waiting for game input");
            },
            loadState: function() {

                console.log("loading: waiting for game input");
            }
        },
        'respond-to-game-input': {
            unloadState: function() {
                
                console.log("unloading: respond-to-game-input");
            },
            loadState: function() {
                
                console.log("loading: respond-to-game-input");
            }
        },
        'game-lose': {
            unloadState: function() {
                
                console.log("unloading: game-lose");
            },
            loadState: function() {
                
                console.log("loading: game-lose");
            }
        },
        'game-win': {
            unloadState: function() {
                
                console.log("unloading: game-win");
            },
            loadState: function() {
                
                console.log("loading: game-win");
            }
        },
    },
    
    // Create a method for switching states
    switchState(newState) {
        // If we have a state loaded already, unload it first
        if (this.currentState !== '') {
            this.stateObjects[this.currentState].unloadState(); // If the currentState isn't empty, the state object must exist; so no error checking necessary
        }

        this.currentState = newState;

        // Now load the new state as long as it exists
        if (this.stateObjects.hasOwnProperty(this.currentState)) {
            this.stateObjects[this.currentState].loadState();
        }
        else {
            throw `The state '${this.currentState}' does not exist!`;
        }
    }
};

// Load the game
game.switchState('start-screen');