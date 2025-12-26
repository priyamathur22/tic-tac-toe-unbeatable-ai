let board = Array(9).fill(null);
let gameActive = false;
let scores = { X: 0, O: 0 };
let gameHistoryData = []; 

document.addEventListener('DOMContentLoaded', () => {
    // 1. Start Session
    document.getElementById('startGame').onclick = () => {
        const name = document.getElementById('playerName').value;
        if (!name) return alert("Please enter your name!");

        scores = { X: 0, O: 0 };
        gameHistoryData = [];
        document.getElementById('pScore').innerText = '0';
        document.getElementById('aScore').innerText = '0';
        document.getElementById('historyList').innerHTML = '';
        document.getElementById('treeContainer').innerHTML = "AI is waiting...";

        initGame();
    };

    // 2. Cell Clicks
    document.querySelectorAll('.cell').forEach(cell => {
        cell.onclick = (e) => {
            let idx = parseInt(e.target.dataset.index);
            if (gameActive && board[idx] === null) {
                userMove(idx);
            }
        };
    });

    // 3. Reset Button
    document.getElementById('resetGame').onclick = initGame;

    // 4. Clear History
    document.getElementById('clearHistory').onclick = () => {
        document.getElementById('historyList').innerHTML = '';
        gameHistoryData = [];
        initGame();
    };

    // --- Modal Button Listeners ---

    // CROSS BUTTON (X): Modal band + Board RESET
    document.getElementById('modalCrossClose').onclick = () => {
        document.getElementById('resultModal').style.display = 'none';
        initGame(); // Board reset ho jayega
    };

    // PLAY AGAIN: Modal band + Board RESET
    document.getElementById('modalPlayAgain').onclick = () => {
        document.getElementById('resultModal').style.display = 'none';
        initGame();
    };

    // VIEW BOARD: Modal band + Board WAISA HI RAHEGA
    document.getElementById('modalViewBoard').onclick = () => {
        document.getElementById('resultModal').style.display = 'none';
        gameActive = false; // Board lock rahega
        document.getElementById('gameStatus').innerText = "Viewing result. Click Reset to play again.";
    };

    // EXIT SESSION: Reload Page
    document.getElementById('modalExit').onclick = () => {
        location.reload(); 
    };
});

function initGame() {
    const name = document.getElementById('playerName').value || "Player";
    board = Array(9).fill(null);
    gameActive = true;
    
    document.getElementById('gameStatus').innerText = `${name}'s Turn (X)`;
    
    document.querySelectorAll('.cell').forEach(c => {
        c.classList.remove('winning-cell', 'x-move', 'o-move');
        c.innerText = '';
    });
    document.getElementById('resultModal').style.display = 'none';
}

function userMove(idx) {
    board[idx] = 'X';
    updateUI();
    if (!checkGameOver()) {
        gameActive = false; 
        document.getElementById('gameStatus').innerText = "AI Mastermind is thinking...";
        setTimeout(aiMove, 600);
    }
}

function aiMove() {
    let move = findBestMove(board); 
    if (move !== -1) {
        const name = document.getElementById('playerName').value || "Player";
        board[move] = 'O';
        updateUI();
        renderLogs(currentDecisionTree);
        if (!checkGameOver()) {
            gameActive = true;
            document.getElementById('gameStatus').innerText = `${name}'s Turn (X)`;
        }
    }
}

function updateUI(targetBoard = board) {
    const cells = document.querySelectorAll('.cell');
    targetBoard.forEach((val, i) => {
        cells[i].innerText = val || '';
        cells[i].classList.remove('x-move', 'o-move');
        if (val === 'X') cells[i].classList.add('x-move');
        if (val === 'O') cells[i].classList.add('o-move');
    });
}

function checkGameOver() {
    const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    let winner = null;

    for (let c of wins) {
        if (board[c[0]] && board[c[0]] === board[c[1]] && board[c[0]] === board[c[2]]) {
            winner = board[c[0]];
            c.forEach(idx => document.querySelectorAll('.cell')[idx].classList.add('winning-cell'));
            break;
        }
    }

    if (winner || !board.includes(null)) {
        gameActive = false;
        let msg = winner === 'O' ? "AI Mastermind Wins!" : (winner === 'X' ? "You Won!" : "Strategic Draw!");
        
        if (winner === 'O') scores.O++;
        if (winner === 'X') scores.X++;
        document.getElementById('aScore').innerText = scores.O;
        document.getElementById('pScore').innerText = scores.X;

        const matchRecord = {
            id: Date.now(),
            board: [...board],
            logs: [...currentDecisionTree],
            result: msg
        };
        gameHistoryData.push(matchRecord);
        saveToHistoryUI(matchRecord);

        document.getElementById('gameStatus').innerText = msg;
        setTimeout(() => {
            document.getElementById('modalWinner').innerText = msg;
            const subText = document.getElementById('modalSubText');
            if(subText) subText.innerText = ""; 
            document.getElementById('resultModal').style.display = 'flex';
        }, 500);
        return true;
    }
    return false;
}

function saveToHistoryUI(match) {
    const history = document.getElementById('historyList');
    const item = document.createElement('div');
    item.className = 'history-item';
    item.innerHTML = `<strong>Match:</strong> ${match.result}<br><small>Click to Replay</small>`;
    item.onclick = () => {
        updateUI(match.board);
        renderLogs(match.logs);
        document.getElementById('gameStatus').innerText = "REPLAY: " + match.result;
    };
    history.prepend(item);
}

function renderLogs(treeData) {
    let container = document.getElementById('treeContainer');
    container.innerHTML = '<strong>Analysis:</strong><br>';
    treeData.forEach(l => {
        container.innerHTML += `<div style="font-size:0.85rem; border-bottom:1px solid #334155; padding:2px 0;">Spot ${l.index}: Score ${l.score}</div>`;
    });
}