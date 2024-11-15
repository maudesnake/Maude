
const boardSize = 20; 
const gameBoard = document.getElementById('game-board');
const scoreElement = document.getElementById('score');
let snake = [{ x: 10, y: 10 }];
let direction = { x: 0, y: 0 };
let food = { x: 15, y: 15 };
let score = 0;
let gameInterval;

// Function to initialize and start the game
function initiateGame() {
    const username = document.getElementById('username').value;
    const difficulty = document.getElementById('difficulty').value;
    if (!username) return alert("Please enter a username!");
    document.getElementById('game-board').style.display = 'grid';
    document.getElementById('score-container').style.display = 'block';
    document.getElementById('username').style.display = 'none';
    document.getElementById('difficulty').style.display = 'none';
    document.querySelector('button').style.display = 'none';
    startGame(difficulty);
}

// Start Game Logic with adjustable speed
function startGame(speed) {
    direction = { x: 1, y: 0 };
    gameInterval = setInterval(gameLoop, speed);
    document.addEventListener('keydown', changeDirection);
}

// Game Loop Logic
function gameLoop() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    if (isCollision(head)) return gameOver();
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.textContent = score;
        placeFood();
    } else {
        snake.pop();
    }
    updateBoard();
}

// Collision Detection
function isCollision(head) {
    return (
        head.x < 0 || head.x >= boardSize ||
        head.y < 0 || head.y >= boardSize ||
        snake.some(segment => segment.x === head.x && segment.y === head.y)
    );
}

// Direction Control
function changeDirection(event) {
    const { key } = event;
    if (key === 'ArrowUp' && direction.y === 0) direction = { x: 0, y: -1 };
    else if (key === 'ArrowDown' && direction.y === 0) direction = { x: 0, y: 1 };
    else if (key === 'ArrowLeft' && direction.x === 0) direction = { x: -1, y: 0 };
    else if (key === 'ArrowRight' && direction.x === 0) direction = { x: 1, y: 0 };
}

// Place Food
function placeFood() {
    food = {
        x: Math.floor(Math.random() * boardSize),
        y: Math.floor(Math.random() * boardSize),
    };
}

// Game Over Function and Leaderboard Save
function gameOver() {
    clearInterval(gameInterval);
    saveScore(score);
    alert(`Game Over! Final Score: ${score}`);
    location.reload();
}

// Board Update for Snake and Food
function updateBoard() {
    gameBoard.innerHTML = '';
    snake.forEach((segment, index) => {
        const snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = segment.y + 1;
        snakeElement.style.gridColumnStart = segment.x + 1;
        snakeElement.classList.add('snake');
        if (index === 0) snakeElement.classList.add('snake-head');
        gameBoard.appendChild(snakeElement);
    });
    const foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y + 1;
    foodElement.style.gridColumnStart = food.x + 1;
    foodElement.classList.add('food');
    gameBoard.appendChild(foodElement);
}

// Save Score to Local Leaderboard
function saveScore(score) {
    const username = document.getElementById('username').value;
    let scores = JSON.parse(localStorage.getItem('leaderboard')) || [];
    scores.push({ name: username, score: score });
    scores.sort((a, b) => b.score - a.score);
    scores = scores.slice(0, 10); 
    localStorage.setItem('leaderboard', JSON.stringify(scores));
    displayLeaderboard();
}

// Display Leaderboard on Load
function displayLeaderboard() {
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    const leaderboardList = document.getElementById('leaderboard-list');
    leaderboardList.innerHTML = leaderboard.map(entry => `<li>${entry.name}: ${entry.score}</li>`).join('');
}

// Call displayLeaderboard on load
displayLeaderboard();
