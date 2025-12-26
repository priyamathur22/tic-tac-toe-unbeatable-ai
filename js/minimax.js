let currentDecisionTree = [];

function findBestMove(board) {
    let bestScore = -Infinity;
    let move = -1;
    currentDecisionTree = [];

    for (let i = 0; i < 9; i++) {
        if (board[i] === null) {
            board[i] = 'O';
            let score = minimax(board, 0, false);
            board[i] = null;
            currentDecisionTree.push({ index: i, score: score });
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
}

function minimax(board, depth, isMaximizing) {
    let result = checkWinnerLogic(board);
    if (result === 'O') return 10 - depth;
    if (result === 'X') return depth - 10;
    if (!board.includes(null)) return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === null) {
                board[i] = 'O';
                bestScore = Math.max(bestScore, minimax(board, depth + 1, false));
                board[i] = null;
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === null) {
                board[i] = 'X';
                bestScore = Math.min(bestScore, minimax(board, depth + 1, true));
                board[i] = null;
            }
        }
        return bestScore;
    }
}

function checkWinnerLogic(b) {
    const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    for (let c of wins) {
        if (b[c[0]] && b[c[0]] === b[c[1]] && b[c[0]] === b[c[2]]) return b[c[0]];
    }
    return null;
}