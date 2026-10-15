import { puzzles } from "./puzzles.js";
import "./styles.css";

const content = document.getElementById("content");
const guess = document.getElementById("guess-input");
const guessButton = document.getElementById("guess-button");
const clues = document.getElementById("clues");
const previousGuesses = document.getElementById("previous-guesses");
const rules = document.getElementById("rules");
const explain = document.getElementById("explain");
const closeButton = document.getElementById("close-rules");
const navDate = document.getElementById("date");
const darkMode = document.getElementById("dark-mode");
const nav = document.querySelector("nav");

const today = Temporal.Now.plainDateISO();
const formatter = new Intl.DateTimeFormat('en-US', { 
  month: 'long', 
  day: 'numeric' 
});
const formattedDate = formatter.format(today);
navDate.textContent = formattedDate;

let guesses = 0;
let playing = true;
let gameWon = false;
let guessList = [];
let darkModeView = false;

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

darkMode.addEventListener("click", () => {
    if (!darkModeView) {
        darkModeView = true;
        document.body.style.backgroundColor = "black";
        document.body.style.color = "green";
        nav.style.backgroundColor = "black";
        nav.style.color = "green";
        nav.style.borderBottom = "1px solid green";
    } else {
        darkModeView = false;
        document.body.style.backgroundColor = "white";
        document.body.style.color = "black";
        nav.style.backgroundColor = "black";
        nav.style.color = "white";
        nav.style.borderBottom = "0";
    }
});

rules.addEventListener("click", () => {
    explain.showModal();
});

closeButton.addEventListener("click", () => {
    explain.close();
});

window.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        guessButton.click();
    }
})

guessButton.addEventListener("click", () => {
    if (!playing || !guess.value) return;
    guesses++;
    if(sanitizeGuess(guess.value) === dailyPuzzle.answer) {
        playing = false;

        guess.remove();
        guessButton.remove();

        previousGuesses.textContent += `${sanitizeGuess(guess.value)}`

        const winner = document.createElement("p");
        winner.classList.add("winner");
        winner.textContent = `${dailyPuzzle.answer} was the secret word!`
        winner.textContent += "\nYou win!";
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