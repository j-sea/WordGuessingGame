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
var VALID_LETTER_LIST = [
    'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'
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
        console.log('setting up new game');

        // Get a new word while ensuring it isn't the same word as the last one played by the user
        var newWord = WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)].toLowerCase();
        while (newWord === this.currentWord) {
            newWord = WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)].toLowerCase();
        }
        this.currentWord = newWord;

        // Determine the amount of unique characters utilizing a unique-set data structure to our advantage
        this.uniqueLetters = (new Set(newWord)).size;

        // Reset the game state
        this.guesses = 0;
        this.keysRevealed = [];
        this.keysIncorrect = [];

        console.log(`New word: ${newWord} with ${this.uniqueLetters} unique letters`);
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
    handleRepeatGuess(keyGuessed) {
        console.log(`repeating guess for '${keyGuessed}'`);

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
        console.log(`incorrectly guessing '${keyGuessed}'`);

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
        console.log(`correctly guessing '${keyGuessed}'`);

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
        console.log("screen updating");
    },

    // We'll use a state machine to keep track of our different game states' logic
    stateObjects: {
        'start-screen': {
            unloadState: function() {
                console.log("unloading: start-screen");

                // Make sure our key event handler is removed
                document.onkeyup = undefined;
            },
            loadState: function() {
                console.log("loading: start-screen");

                document.onkeyup = function(event) {

                    // If any key is pressed, we should start the game
                    // NOTE: Since 'this' isn't referencing the game object in here, we'll just reference it through the global 'game' variable
                    
                    // Set up a new game
                    game.setupNewGame();
                    
                    // Start waiting for letter guessing by the player
                    game.switchState('wait-for-game-input');
                };
            }
        },
        'wait-for-game-input': {
            unloadState: function() {
                console.log("unloading: waiting for game input");

                // Make sure our key event handler is removed
                document.onkeyup = undefined;
            },
            loadState: function() {
                console.log("loading: waiting for game input");

                document.onkeyup = function(event) {

                    // NOTE: Since 'this' isn't referencing the game object in here, we'll just reference it through the global 'game' variable

                    // If an acceptable letter key is pressed, get it handled
                    if (VALID_LETTER_LIST.indexOf(event.key.toLowerCase()) !== -1) {

                        // Make the guess with the user's key
                        game.makeGuess(event.key.toLowerCase());
                    }
                    // If we don't want to play this word anymore, we can hit the 'escape' key to return to the start screen
                    else if (event.key.toLowerCase() === 'escape') {
                        
                        // Take the player back to the start screen
                        game.switchState('start-screen');
                    }
                };
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

                // Make sure our key event handler is removed
                document.onkeyup = undefined;
            },
            loadState: function() {
                console.log("loading: game-lose");
                
                // NOTE: Since 'this' isn't referencing the game object in here, we'll just reference it through the global 'game' variable

                game.losses++;

                game.updateScreen();

                document.onkeyup = function(event) {
                    
                    // If the 'enter' key is pressed, we'll restart the game with a new word
                    game.setupNewGame();

                    // Go straight back into the game skipping the start screen
                    game.switchState('wait-for-game-input');
                }
            }
        },
        'game-win': {
            unloadState: function() {
                console.log("unloading: game-win");
                
                // Make sure our key event handler is removed
                document.onkeyup = undefined;
            },
            loadState: function() {
                console.log("loading: game-win");

                // NOTE: Since 'this' isn't referencing the game object in here, we'll just reference it through the global 'game' variable

                game.wins++;

                game.updateScreen();

                document.onkeyup = function(event) {
                    
                    // If the 'enter' key is pressed, we'll restart the game with a new word
                    game.setupNewGame();

                    // Go straight back into the game skipping the start screen
                    game.switchState('wait-for-game-input');
                }
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