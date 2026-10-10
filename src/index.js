import { puzzles } from "./puzzles.js";

const content = document.getElementById("content");
const guess = document.getElementById("guess");
const guessButton = document.getElementById("guess-button");
const clues = document.getElementById("clues");
const previousGuesses = document.getElementById("previous-guesses");

let guesses = 0;
let playing = true;
let gameWon = false;
let guessList = [];

const dailyPuzzle = getPuzzle();
clues.append(addClue(guesses, dailyPuzzle.clues));

function saveData() {
    const data = {
        "guesses": guesses,
        "playing": playing,
        "gameWon": gameWon,
        "guessList": guessList
    }

    localStorage.setItem("data", data);
}

guessButton.addEventListener("click", () => {
    if (!playing || !guess.value) return;
    guesses++;
    if(sanitizeGuess(guess.value) === dailyPuzzle.answer) {
        playing = false;

        guess.remove();
        guessButton.remove();

        const winner = document.createElement("p");
        winner.classList.add("winner");
        winner.textContent = "You win!";
        gameWon = true;
        content.append(winner);
    } else {
        if (!guessList.includes(sanitizeGuess(guess.value))) {
            guessList.push(sanitizeGuess(guess.value));
            if (guesses < 5) previousGuesses.textContent += `${sanitizeGuess(guess.value)}, `;
            else previousGuesses.textContent += `${sanitizeGuess(guess.value)}`
            if (guesses < 5) clues.append(addClue(guesses, dailyPuzzle.clues));
        } else guesses--;
    }

    if (guesses >= 5 && !gameWon) {
        playing = false;

        guess.remove();
        guessButton.remove();
        
        const loser = document.createElement("p");
        loser.classList.add("loser");
        loser.textContent = "Better luck next time!";
        content.append(loser);
    }

    guess.value = "";
    saveData();
});

function getPuzzle() {
    const today = Temporal.Now.plainDateISO();
    const dailyPuzzle = puzzles[today.dayOfYear];
    return dailyPuzzle;
}
function addClue(guess, clues) {
    const clue = document.createElement("span");

    if (guess == 0) clue.textContent = `${clues[guess]}`;
    else clue.textContent = `, ${clues[guess]}`;

    return clue;
}

function sanitizeGuess(str) {
    if (!str) return str;
    return (str.charAt(0).toUpperCase() + str.toLowerCase().slice(1));
}