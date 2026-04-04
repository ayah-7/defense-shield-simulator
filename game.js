const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const resetButton = document.getElementById("resetButton");
const gameModeText = document.getElementById("gameMode");

const params = new URLSearchParams(window.location.search);
const mode = params.get("mode") || "easy";

gameModeText.textContent = mode === "hard" ? "Mode: Hard Bot" : "Mode: Easy Bot";

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameRunning = true;

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

cells.forEach(cell => {
    cell.addEventListener("click", handleCellClick);
});

resetButton.addEventListener("click", resetGame);

function handleCellClick() {
    const index = this.getAttribute("data-index");

    if (board[index] !== "" || !gameRunning || currentPlayer !== "X") {
        return;
    }

    board[index] = "X";
    this.textContent = "X";

    checkWinner();

    if (!gameRunning) return;

    currentPlayer = "O";
    statusText.textContent = "Bot's turn";

    setTimeout(() => {
        if (mode === "easy") {
            easyBotMove();
        } else {
            hardBotMove();
        }
    }, 400);
}

function easyBotMove() {
    const emptyCells = [];

    for (let i = 0; i < board.length; i++) {
        if (board[i] === "") {
            emptyCells.push(i);
        }
    }

    if (emptyCells.length === 0) return;

    const move = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    makeBotMove(move);
}

function hardBotMove() {
    let move = findWinningMove("O");

    if (move === -1) {
        move = findWinningMove("X");
    }

    if (move === -1 && board[4] === "") {
        move = 4;
    }

    if (move === -1) {
        const corners = [0, 2, 6, 8];
        const emptyCorners = corners.filter(index => board[index] === "");

        if (emptyCorners.length > 0) {
            move = emptyCorners[Math.floor(Math.random() * emptyCorners.length)];
        }
    }

    if (move === -1) {
        const emptyCells = [];

        for (let i = 0; i < board.length; i++) {
            if (board[i] === "") {
                emptyCells.push(i);
            }
        }

        if (emptyCells.length > 0) {
            move = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        }
    }

    if (move !== -1) {
        makeBotMove(move);
    }
}

function findWinningMove(player) {
    for (let i = 0; i < winningCombinations.length; i++) {
        const [a, b, c] = winningCombinations[i];
        const values = [board[a], board[b], board[c]];

        const playerCount = values.filter(value => value === player).length;
        const emptyCount = values.filter(value => value === "").length;

        if (playerCount === 2 && emptyCount === 1) {
            if (board[a] === "") return a;
            if (board[b] === "") return b;
            if (board[c] === "") return c;
        }
    }

    return -1;
}

function makeBotMove(index) {
    board[index] = "O";
    cells[index].textContent = "O";

    checkWinner();

    if (!gameRunning) return;

    currentPlayer = "X";
    statusText.textContent = "Player X's turn";
}

function checkWinner() {
    let roundWon = false;

    for (let i = 0; i < winningCombinations.length; i++) {
        const [a, b, c] = winningCombinations[i];

        if (board[a] === "" || board[b] === "" || board[c] === "") {
            continue;
        }

        if (board[a] === board[b] && board[b] === board[c]) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        if (currentPlayer === "X") {
            statusText.textContent = "Player X wins!";
        } else {
            statusText.textContent = "Bot wins!";
        }
        gameRunning = false;
        return;
    }

    if (!board.includes("")) {
        statusText.textContent = "It's a draw!";
        gameRunning = false;
    }
}

function resetGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    gameRunning = true;
    statusText.textContent = "Player X's turn";

    cells.forEach(cell => {
        cell.textContent = "";
    });
}
