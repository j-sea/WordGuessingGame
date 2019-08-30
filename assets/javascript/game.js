// START: Hide all of this code from the actual global scope
(() => {

// Game settings
var MAX_GUESSES = 10;
var HANDLE_REPEAT_GUESSES = false;
var WORD_LIST = [
    {w:'Steven Universe', h:'<h3>T.V. Show (Animated)</h3><p>This show sets itself apart with incredibly heavy-hitting morals as it progresses. If you haven\'t seen this show, I highly <em>highly</em> recommend it for all ages. It\'s a show full of love without stipulations.</p>',r:'<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/MIREK5ZL1jA" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'},
    {w:'Adventure Time', h:'<h3>T.V. Show (Animated)</h3><p>Amusing and energetic, this show sets itself apart with its wildly weird world based on Irish and Celtic mythology and its deep exploration of friendship and overcoming life\'s hardships.</p>',r:'<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/gfijG7pmMqk" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'},
    {w:'Galavant', h:'<h3>T.V. Show (Musical)</h3><p>Hilariously tongue-in-cheek, this show is a great way to relax and enjoy your leisure time. Follow our protagonist as they journey to save their beloved. And yes, they all really do sing. It\'s amazing.</p>',r:'<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/QWnDwM0RSX4" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'},
    {w:'Dead Cells', h:'<h3>Roguelike Video Game</h3><p>One of the best aesthetics in a roguelike in recent years, this game continues to challenge you more and more even after you manage to beat it\'s increasingly-harder modes. While a solid roguelike, it is also a top-quality metroidvania game.</p>',r:'<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/RvGaSPTcTxc" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'},
    {w:'Aggretsuko', h:'<h3>T.V. Show (Animated)</h3><p>One of the most frustratingly-relatable and loveable shows, navigating feelings plays a key role in its protagonist\'s daily life just trying to survive, and we get to share in the ups and downs that come along with them.</p>',r:'<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/z9jGaJJlNyo" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'},
    {w:'Metric', h:'<h3>Music Band (Indie Rock)</h3><p>The female vocal lead of this quartet carries a diverse array of songs across over six albums varying greatly in genre and feel. Great to sing and dance along with.</p>',r:'<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/uly3S2KjUf4" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'},
    {w:'Muse', h:'<h3>Music Band (Rock)</h3><p>This band never shies away from culturally-relevant lyrics. The male vocal lead carries several albums across multiple different genres. You can try to sing along with him, but it will be difficult without a wide vocal range.</p>',r:'<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/X8f5RgwY8CI" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'},
    {w:'Linkin Park', h:'<h3>Music Band (Rock)</h3><p>This band arrived in the 90s with a powerful dynamic, self-written lyrics, and an outlet for all the frustrations of life. Love them or hate them, they were always working on expanding their musical range and accomplished multiple unique albums with an artistic theme behind each one. You\'ll run out of breath singing along.</p>',r:'<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/AsNvb56CTa4" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'},
    {w:'K.Flay', h:'<h3>Music Artist (Rock)</h3><p>This artist came onto the scene in the 2000s while double-majoring at Stanford but really only hit it big in 2017 with an album that is a reflection of life\'s many intense ups and downs.</p>',r:'<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/3SHFLj-pTQE" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'},
];
var VALID_LETTER_LIST = [
    'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'
];
var UNGUESSED_LETTER = '_';

// Store the game logic inside its own object
var game = {

    // Set up variables we'll be using to keep track of game data
    currentState: '',
    nextState: '',
    currentWordIndex: -1,
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
        var newWordIndex = Math.floor(Math.random() * WORD_LIST.length);
        while (newWordIndex === this.currentWordIndex) {
            newWordIndex = Math.floor(Math.random() * WORD_LIST.length);
        }
        this.currentWordIndex = newWordIndex;

        // Determine the amount of unique characters utilizing a unique-set data structure to our advantage
        var newWord = WORD_LIST[newWordIndex].w.toLocaleLowerCase();
        var targetNonAlphabeticCharsRegEx = /[^a-z]/g;
        var newWordAlphabeticCharsOnly = newWord.replace(targetNonAlphabeticCharsRegEx, '');
        this.uniqueLetters = (new Set(newWordAlphabeticCharsOnly)).size;

        // Reset the game state
        this.guesses = 0;
        this.keysRevealed = [];
        this.keysIncorrect = [];

        document.getElementById('hint').innerHTML = WORD_LIST[newWordIndex].h;

        console.log(`New word: ${newWord} with ${this.uniqueLetters} unique letters`);
    },

    // Create a method for applying guessing logic to a given key character
    makeGuess: function(keyGuessed) {
        keyGuessed = keyGuessed.toLocaleLowerCase();

        // If our key has been guessed before, we waste a guess (if enabled)
        if (this.keysIncorrect.indexOf(keyGuessed) !== -1 || this.keysRevealed.indexOf(keyGuessed) !== -1) {
            if (HANDLE_REPEAT_GUESSES) {
                this.handleRepeatGuess(keyGuessed);
            }
        }
        // If our key doesn't exist in the current word, we waste a guess
        else if (WORD_LIST[this.currentWordIndex].w.toLocaleLowerCase().indexOf(keyGuessed) === -1) {
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

        this.keysRevealed.push(keyGuessed);

        // If we guessed all the characters correctly, we won the game.
        if (this.uniqueLetters === this.keysRevealed.length) {
            this.switchState('game-win');
        }
        // Otherwise, continue on as usual and just update the screen
        else {
            this.updateScreen();
        }
    },

    // Create a method for updating the screen
    updateScreen() {
        console.log("screen updating");

        var numberOfWinsElements = document.getElementsByClassName('number-of-wins');
        for (var i = 0; i < numberOfWinsElements.length; i++) {
            numberOfWinsElements[i].textContent = this.wins;
        }

        var numberOfLossesElements = document.getElementsByClassName('number-of-losses');
        for (var i = 0; i < numberOfLossesElements.length; i++) {
            numberOfLossesElements[i].textContent = this.losses;
        }

        var numberOfGuessesLeftElements = document.getElementsByClassName('number-of-guesses-left');
        for (var i = 0; i < numberOfGuessesLeftElements.length; i++) {
            numberOfGuessesLeftElements[i].textContent = MAX_GUESSES - this.guesses;
        }

        var numberOfLettersElements = document.getElementsByClassName('number-of-letters');
        var targetNonAlphabeticCharsRegEx = /[^a-z]/g;
        var currentWordAlphabeticCharsOnly = WORD_LIST[this.currentWordIndex].w.toLocaleLowerCase();
        for (var i = 0; i < numberOfLettersElements.length; i++) {
            numberOfLettersElements[i].textContent = currentWordAlphabeticCharsOnly.replace(targetNonAlphabeticCharsRegEx, '').length;
        }

        var currentWordElements = document.getElementsByClassName('current-word');
        for (var i = 0; i < currentWordElements.length; i++) {
            currentWordElements[i].textContent = WORD_LIST[this.currentWordIndex].w;
        }

        var winsPluralizerElements = document.getElementsByClassName('wins-pluralizer');
        for (var i = 0; i < winsPluralizerElements.length; i++) {
            if (this.wins !== 1) {
                winsPluralizerElements[i].setAttribute("class", "wins-pluralizer");
            }
            else {
                winsPluralizerElements[i].setAttribute("class", "wins-pluralizer display-none");
            }
        }

        var lossesPluralizerElements = document.getElementsByClassName('losses-pluralizer');
        for (var i = 0; i < lossesPluralizerElements.length; i++) {
            if (this.losses !== 1) {
                lossesPluralizerElements[i].setAttribute("class", "losses-pluralizer");
            }
            else {
                lossesPluralizerElements[i].setAttribute("class", "losses-pluralizer display-none");
            }
        }

        var correctLettersGuessed = document.getElementById('correct-letters-guessed');
        var revealedLettersString = '';
        for (var i = 0; i < WORD_LIST[this.currentWordIndex].w.length; i++) {

            if (this.keysRevealed.indexOf(WORD_LIST[this.currentWordIndex].w[i].toLocaleLowerCase()) !== -1) {

                revealedLettersString += WORD_LIST[this.currentWordIndex].w[i];
            }
            else if (VALID_LETTER_LIST.indexOf(WORD_LIST[this.currentWordIndex].w[i].toLocaleLowerCase()) === -1) {

                revealedLettersString += WORD_LIST[this.currentWordIndex].w[i];
            }
            else {

                revealedLettersString += UNGUESSED_LETTER;
            }
        }
        correctLettersGuessed.textContent = revealedLettersString;

        var incorrectLettersGuessed = document.getElementById('incorrect-letters-guessed');
        var incorrectLettersString = this.keysIncorrect.join(", ");
        if (incorrectLettersString === '') {
            incorrectLettersString = '(none)';
        }
        incorrectLettersGuessed.textContent = incorrectLettersString;
    },

    // We'll use a state machine to keep track of our different game states' logic
    stateObjects: {
        'start-screen': {
            unloadState: function() {
                console.log("unloading: start-screen");

                // Make sure our key event handler is removed
                document.onkeyup = undefined;

                // Hide the start screen
                document.getElementById('start-screen').setAttribute('class', 'display-none');
            },
            loadState: function() {
                console.log("loading: start-screen");

                // NOTE: Since 'this' isn't referencing the game object in here, we'll just reference it through the global 'game' variable

                // Set up a new game
                game.setupNewGame();

                // Update the new game state's screen
                game.updateScreen();

                document.onkeyup = function(event) {

                    // If any key is pressed, we should start the game

                    // Start waiting for letter guessing by the player
                    game.switchState('wait-for-game-input');
                };

                // Show the start screen
                document.getElementById('start-screen').setAttribute('class', 'display-block');
            }
        },
        'wait-for-game-input': {
            unloadState: function() {
                console.log("unloading: waiting for game input");

                // Make sure our key event handler is removed
                document.onkeyup = undefined;

                // Hide the game screen if we're going back to the start screen
                if (game.nextState === 'start-screen') {
                    document.getElementById('game-screen').setAttribute('class', 'display-none');
                }
            },
            loadState: function() {
                console.log("loading: waiting for game input");

                // NOTE: Since 'this' isn't referencing the game object in here, we'll just reference it through the global 'game' variable

                // Update the new game state's screen
                game.updateScreen();

                document.onkeyup = function(event) {

                    // If an acceptable letter key is pressed, get it handled
                    if (VALID_LETTER_LIST.indexOf(event.key.toLocaleLowerCase()) !== -1) {

                        // Make the guess with the user's key
                        game.makeGuess(event.key.toLocaleLowerCase());
                    }
                    // If we don't want to play this word anymore, we can hit the 'escape' key to return to the start screen
                    else if (event.key.toLocaleLowerCase() === 'escape') {

                        game.losses++;
                        
                        // Take the player back to the start screen
                        game.switchState('start-screen');
                    }
                };

                // Show the game screen
                document.getElementById('game-screen').setAttribute('class', 'display-block');
            }
        },
        'game-lose': {
            unloadState: function() {
                console.log("unloading: game-lose");

                // Make sure our key event handler is removed
                document.onkeyup = undefined;

                // Hide the lose pop-up
                document.getElementById('game-lose-popup').setAttribute('class', 'display-none');

                // Hide the pop-up overlay
                document.getElementById('game-popup-overlay').setAttribute('class', 'display-none');

                // Hide the game screen if we're going back to the start screen
                if (game.nextState === 'start-screen') {
                    document.getElementById('game-screen').setAttribute('class', 'display-none');
                }
            },
            loadState: function() {
                console.log("loading: game-lose");
                
                // NOTE: Since 'this' isn't referencing the game object in here, we'll just reference it through the global 'game' variable

                // Update the game state
                game.losses++;

                // Update the new game state's screen
                game.updateScreen();

                document.onkeyup = function(event) {

                    // If the 'enter' key is pressed
                    if (event.key.toLocaleLowerCase() === 'enter' || event.key.toLocaleLowerCase() === 'return') {

                        // We'll restart the game with a new word
                        game.setupNewGame();

                        // Go straight back into the game skipping the start screen
                        game.switchState('wait-for-game-input');
                    }
                }

                // Show the pop-up overlay
                document.getElementById('game-popup-overlay').setAttribute('class', 'display-block');

                // Show the lose pop-up
                document.getElementById('game-lose-popup').setAttribute('class', 'display-block');
            }
        },
        'game-win': {
            unloadState: function() {
                console.log("unloading: game-win");
                
                // Make sure our key event handler is removed
                document.onkeyup = undefined;

                // Clear the reward box
                document.getElementById('reward').innerHTML = '';

                // Hide the win pop-up
                document.getElementById('game-win-popup').setAttribute('class', 'display-none');

                // Hide the pop-up overlay
                document.getElementById('game-popup-overlay').setAttribute('class', 'display-none');

                // Hide the game screen if we're going back to the start screen
                if (game.nextState === 'start-screen') {
                    document.getElementById('game-screen').setAttribute('class', 'display-none');
                }
            },
            loadState: function() {
                console.log("loading: game-win");

                // NOTE: Since 'this' isn't referencing the game object in here, we'll just reference it through the global 'game' variable

                // Update the game state
                game.wins++;

                // Update the new game state's screen
                game.updateScreen();

                document.onkeyup = function(event) {

                    // If the 'enter' key is pressed
                    if (event.key.toLocaleLowerCase() === 'enter' || event.key.toLocaleLowerCase() === 'return') {

                        // We'll restart the game with a new word
                        game.setupNewGame();
    
                        // Go straight back into the game skipping the start screen
                        game.switchState('wait-for-game-input');
                    }
                }

                // Fill the reward box with the provided reward HTML
                document.getElementById('reward').innerHTML = WORD_LIST[game.currentWordIndex].r;

                // Show the pop-up overlay
                document.getElementById('game-popup-overlay').setAttribute('class', 'display-block');

                // Show the win pop-up
                document.getElementById('game-win-popup').setAttribute('class', 'display-block');
            }
        },
    },
    
    // Create a method for switching states
    switchState(newState) {

        // Set the next state so individual states can plan accordingly
        this.nextState = newState;

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

        // Clear the next state since there isn't one anymore
        this.nextState = '';
    }
};

// Load the game
game.switchState('start-screen');

// END: Hide all of this code from the actual global scope
})();