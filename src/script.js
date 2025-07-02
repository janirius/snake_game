const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gridSize = 20;
let snake = [
    { x: 10, y: 10 }
];
let food = {};
let direction = 'right';
let score = 0;
let gameOver = false;
let gameInterval;

function generateFood() {
    food = {
        x: Math.floor(Math.random() * (canvas.width / gridSize)),
        y: Math.floor(Math.random() * (canvas.height / gridSize))
    };
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    ctx.fillStyle = '#4CAF50';
    snake.forEach(segment => {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
    });

    // Draw food
    ctx.fillStyle = '#FFC107';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);

    // Update score
    document.getElementById('score').textContent = score;

    if (gameOver) {
        ctx.fillStyle = 'white';
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2);
        ctx.font = '20px Arial';
        ctx.fillText('Press any key to restart', canvas.width / 2, canvas.height / 2 + 30);
    }
}

function update() {
    if (gameOver) return;

    const head = { x: snake[0].x, y: snake[0].y };

    switch (direction) {
        case 'up':
            head.y--;
            break;
        case 'down':
            head.y++;
            break;
        case 'left':
            head.x--;
            break;
        case 'right':
            head.x++;
            break;
    }

    // Check for collision with walls
    if (head.x < 0 || head.x >= canvas.width / gridSize ||
        head.y < 0 || head.y >= canvas.height / gridSize) {
        gameOver = true;
        return;
    }

    // Check for collision with self
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver = true;
            return;
        }
    }

    snake.unshift(head);

    // Check if food is eaten
    if (head.x === food.x && head.y === food.y) {
        score++;
        generateFood();
    } else {
        snake.pop();
    }

    draw();
}

document.addEventListener('keydown', e => {
    if (gameOver) {
        if (e.key) {
            resetGame();
        }
        return;
    }
    switch (e.key) {
        case 'ArrowUp':
            if (direction !== 'down') direction = 'up';
            break;
        case 'ArrowDown':
            if (direction !== 'up') direction = 'down';
            break;
        case 'ArrowLeft':
            if (direction !== 'right') direction = 'left';
            break;
        case 'ArrowRight':
            if (direction !== 'left') direction = 'right';
            break;
    }
});

// Mobile touch controls
function setDirectionMobile(newDir) {
    if (gameOver) return;
    if (newDir === 'up' && direction !== 'down') direction = 'up';
    if (newDir === 'down' && direction !== 'up') direction = 'down';
    if (newDir === 'left' && direction !== 'right') direction = 'left';
    if (newDir === 'right' && direction !== 'left') direction = 'right';
}

['up','down','left','right'].forEach(dir => {
    const btn = document.getElementById('btn-' + dir);
    if (btn) {
        btn.addEventListener('touchstart', e => {
            e.preventDefault();
            setDirectionMobile(dir);
        });
        btn.addEventListener('click', e => {
            setDirectionMobile(dir);
        });
    }
});

// Mobile restart button
const btnRestart = document.getElementById('btn-restart');
if (btnRestart) {
    btnRestart.addEventListener('touchstart', e => {
        e.preventDefault();
        resetGame();
    });
    btnRestart.addEventListener('click', e => {
        resetGame();
    });
}

// Swipe gesture support
let touchStartX = 0, touchStartY = 0;
canvas.addEventListener('touchstart', function(e) {
    if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }
});
canvas.addEventListener('touchend', function(e) {
    if (e.changedTouches.length === 1) {
        const dx = e.changedTouches[0].clientX - touchStartX;
        const dy = e.changedTouches[0].clientY - touchStartY;
        if (Math.abs(dx) > Math.abs(dy)) {
            if (dx > 30) setDirectionMobile('right');
            else if (dx < -30) setDirectionMobile('left');
        } else {
            if (dy > 30) setDirectionMobile('down');
            else if (dy < -30) setDirectionMobile('up');
        }
    }
});

function resetGame() {
    snake = [
        { x: 10, y: 10 }
    ];
    direction = 'right';
    score = 0;
    gameOver = false;
    generateFood();
    clearInterval(gameInterval);
    gameInterval = setInterval(update, 100);
    draw();
}

generateFood();
gameInterval = setInterval(update, 100);
draw();