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
        
        if (this.guesses === MAX_GUESSES) {
            this.switchState('game-lose');
        }
        else {
            this.updateScreen();
        }
    },
    
    // Create a method for handling an incorrect key guess
    handleIncorrectGuess(keyGuessed) {
        this.guesses++;

        this.keysIncorrect.push(keyGuessed);

        if (this.guesses === MAX_GUESSES) {
            this.switchState('game-lose');
        }
        else {
            this.updateScreen();
        }
    },
    
    // Create a method for handling a correct key guess
    handleCorrectGuess(keyGuessed) {
        this.guesses++;

        this.keysRevealed.push(keyGuessed);

        // Unique letters in the current word matching the keys correctly revealed infers we guessed all the characters.
        // We do this check before determining if max guesses have been reached because we want the player to be able to win on their last guess.
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

            },
            loadState: function() {

            }
        },
        'wait-for-game-input': {
            unloadState: function() {

            },
            loadState: function() {

            }
        },
        'respond-to-game-input': {
            unloadState: function() {

            },
            loadState: function() {

            }
        },
        'game-lose': {
            unloadState: function() {

            },
            loadState: function() {

            }
        },
        'game-win': {
            unloadState: function() {

            },
            loadState: function() {

            }
        },
    },
    
    // Create a method for switching states
    switchState(newState) {
        if (this.currentState !== '') {
            this.stateObjects[this.currentState].unloadState(); // If the currentState isn't empty, the state object must exist; so no error checking necessary
        }

        this.currentState = newState;

        if (this.stateObjects.hasOwnProperty(this.currentState)) {
            this.stateObjects[this.currentState].loadState();
        }
        else {
            throw `The state '${this.currentState}' does not exist!`;
        }
    }
};