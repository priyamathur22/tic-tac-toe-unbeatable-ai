const HUMAN = "X";
const AI = "O";
const EMPTY = "";

function checkWinner(board) {
  const wins = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  for (let w of wins) {
    if (board[w[0]] &&
        board[w[0]] === board[w[1]] &&
        board[w[1]] === board[w[2]]) {
      return board[w[0]];
    }
  }
  return null;
}

function isDraw(board) {
  return board.every(cell => cell !== "") && !checkWinner(board);
}

function evaluate(board, depth) {
  const winner = checkWinner(board);
  if (winner === AI) return 10 - depth;
  if (winner === HUMAN) return depth - 10;
  return 0;
}

function minimax(board, isMax, depth, alpha, beta) {
  const score = evaluate(board, depth);
  if (score !== 0 || isDraw(board)) return score;

  if (isMax) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === EMPTY) {
        board[i] = AI;
        best = Math.max(best, minimax(board, false, depth + 1, alpha, beta));
        board[i] = EMPTY;
        alpha = Math.max(alpha, best);
        if (beta <= alpha) break;
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === EMPTY) {
        board[i] = HUMAN;
        best = Math.min(best, minimax(board, true, depth + 1, alpha, beta));
        board[i] = EMPTY;
        beta = Math.min(beta, best);
        if (beta <= alpha) break;
      }
    }
    return best;
  }
}

function findBestMove(board) {
  let bestVal = -Infinity;
  let bestMove = -1;

  for (let i = 0; i < 9; i++) {
    if (board[i] === EMPTY) {
      board[i] = AI;
      const moveVal = minimax(board, false, 0, -Infinity, Infinity);
      board[i] = EMPTY;

      if (moveVal > bestVal) {
        bestVal = moveVal;
        bestMove = i;
      }
    }
  }
  return bestMove;
}
