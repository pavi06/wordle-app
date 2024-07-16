var totalNoOfGuesses = 6;
var lengthOfWord = 5;
var currentGuess = 0;
var currentLetterOfGuess = 0;
var gameOver = false;
var word = "apple"

//generate input board dynamically
function generateGameBoard() {
    const gameBoard = document.getElementById('gameBoard');
    gameBoard.innerHTML = '';
    for (let i = 0; i < totalNoOfGuesses; i++) {
        const rowDiv = document.createElement('div');
        rowDiv.classList.add('letter-row');

        for (let j = 0; j < lengthOfWord; j++) {
            const letterBox = document.createElement('div');
            letterBox.classList.add('letter-title');
            letterBox.id = `${i}${j}`;
            rowDiv.appendChild(letterBox);
        }
        gameBoard.appendChild(rowDiv);
    }
}

//generate keyboard dynamically
function generateKeyboard() {
    const keyboardContainer = document.getElementById('keyboard');
    const keyboardLayout = [
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
        ['Enter', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '<i class="fa-solid fa-delete-left"></i>']
    ];

    keyboardLayout.forEach((rowKeys) => {
        const rowDiv = document.createElement('div');
        rowDiv.classList.add('keyboard-row');

        rowKeys.forEach((key) => {
            const button = document.createElement('button');
            button.classList.add('keyboard-button');
            if(key === "Enter"){
                button.id = `Enter`;
                button.innerHTML = key.toUpperCase();
            }
            else if(key === '<i class="fa-solid fa-delete-left"></i>'){
                button.id = `Backspace`;
                button.innerHTML = key;
            }
            else{
                button.id = `Key${key.toUpperCase()}`;
                button.innerHTML = key.toUpperCase();
            }
            button.onclick = function() {
                keyPressed(this.id);
            };
            rowDiv.appendChild(button);
        });

        keyboardContainer.appendChild(rowDiv);
    });
}

document.addEventListener("DOMContentLoaded" , function(){
    generateGameBoard();
    generateKeyboard();
    document.addEventListener("keyup", (e) => {
        keyPressed(e);
    });
})

function keyPressed(key) {
    if (gameOver) return; 
    if ("KeyA" <= key && key <= "KeyZ") {
        //adding letters to tile
        if (currentLetterOfGuess < lengthOfWord) {
            let currTile = document.getElementById(currentGuess.toString() + currentLetterOfGuess.toString());
            if (currTile.innerText == "") {
                currTile.innerText = key[3];
                currentLetterOfGuess += 1;
            }
        }
    }
    else if (key == "Backspace") {
        //checking for backspace
        if (0 < currentLetterOfGuess && currentLetterOfGuess <= lengthOfWord) {
            currentLetterOfGuess -=1;
        }
        let currTile = document.getElementById(currentGuess.toString() + currentLetterOfGuess.toString());
        currTile.innerText = "";
    }
    else if (key == "Enter") {
        if(currentLetterOfGuess<lengthOfWord){
            alert("Not enough letters");
            return;
        }
        updateGameBoard();
    }
    //check the turns are over
    if (!gameOver && currentGuess === totalNoOfGuesses) {
        gameOver = true;
        setTimeout(function(){
            alert("The secret word is "+word);
        },500)
    }
}

function updateGameBoard() {
    let guess = "";
    for (let charIndex = 0; charIndex < lengthOfWord; charIndex++) {
        let currTile = document.getElementById(currentGuess.toString() + charIndex.toString());
        let letter = currTile.innerText;
        guess += letter.toLowerCase();
    }    

    var correct = 0;
    var letterCount = {};//secret word frequency
    for (let i = 0; i < word.length; i++) {
        let letter = word[i];

        if (letterCount[letter]) {
           letterCount[letter] += 1;
        } 
        else {
           letterCount[letter] = 1;
        }
    }

    //checking the correct position
    for (let charIndex = 0; charIndex < lengthOfWord; charIndex++) {
        let currTile = document.getElementById(currentGuess.toString() + charIndex.toString());
        let letter = currTile.innerText.toLowerCase();
        if (word[charIndex] == letter) {
            currTile.classList.add("correct");

            let keyTile = document.getElementById("Key" + letter.toUpperCase());
            keyTile.classList.remove('present','notPresent')
            keyTile.classList.add("correct");
            correct += 1;
            letterCount[letter] -= 1;
        }
        if (correct == lengthOfWord) {
            gameOver = true;
            setTimeout(function(){
                alert("You guessed the correct word!")
            },500)
        }
    }

    for (let charIndex = 0; charIndex < lengthOfWord; charIndex++) {
        let currTile = document.getElementById(currentGuess.toString() + charIndex.toString());
        let letter = currTile.innerText.toLowerCase();
        if (!currTile.classList.contains("correct")) {
            if (word.includes(letter) && letterCount[letter] > 0) {
                currTile.classList.add("present");                
                let keyTile = document.getElementById("Key" + letter.toUpperCase());
                if (!keyTile.classList.contains("correct")) {
                    keyTile.classList.add("present");
                }
                letterCount[letter] -= 1;
            } 
            else {
                currTile.classList.add("notPresent");
                let keyTile = document.getElementById("Key" + letter.toUpperCase());
                if(!keyTile.classList.contains('correct')){
                    keyTile.classList.add("notPresent")
                }
            }
        }
    }
    currentGuess += 1;
    currentLetterOfGuess = 0;
}