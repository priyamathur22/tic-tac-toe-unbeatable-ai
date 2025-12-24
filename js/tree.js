function generateDecisionTree(board) {
  const tree = [];

  for (let i = 0; i < 9; i++) {
    if (board[i] === "") {
      board[i] = AI;
      const score = minimax(board, false, 1, -Infinity, Infinity);
      board[i] = "";

      tree.push({
        move: i + 1,
        score: score
      });
    }
  }
  return tree;
}

function showDecisionTree(board) {
  const tree = generateDecisionTree([...board]);

  let output = "Decision Tree (AI Move Evaluation)\n\n";
  tree.forEach(node => {
    output += `Move ${node.move} → Score: ${node.score}\n`;
  });

  alert(output);
}
