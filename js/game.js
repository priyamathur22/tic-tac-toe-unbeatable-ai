const boardElement=document.getElementById("board");
const startBtn=document.getElementById("startGame");
const playerInput=document.getElementById("playerName");
const gameSection=document.getElementById("game-section");
const newGameBtn=document.getElementById("newGame");
const showTreeBtn=document.getElementById("showTree");

let board=Array(9).fill("");
let playerName="Player";
let gameActive=false;
let fullDecisionTree="";

startBtn.addEventListener("click",()=>{
playerName=playerInput.value.trim()||"Player";
gameActive=true;
gameSection.style.display="block";
resetBoard();
});

newGameBtn.addEventListener("click",resetBoard);

showTreeBtn.addEventListener("click",()=>{
alert(fullDecisionTree||"No decision tree generated yet.");
});

function resetBoard(){
board=Array(9).fill("");
boardElement.innerHTML="";
fullDecisionTree="";
createBoard();
gameActive=true;
}

function createBoard(){
for(let i=0;i<9;i++){
const cell=document.createElement("div");
cell.classList.add("cell");
cell.dataset.index=i;
cell.addEventListener("click",handlePlayerMove);
boardElement.appendChild(cell);
}
}

function handlePlayerMove(e){
if(!gameActive)return;

const index=e.target.dataset.index;
if(board[index]!=="")return;

board[index]=HUMAN;
e.target.textContent=HUMAN;

if(checkWinner(board)||isDraw(board)){
endGame();
return;
}

aiMove();
}

function aiMove(){
const tree=minimaxTree([...board],true,0,-Infinity,Infinity);
fullDecisionTree+=`\n=== AI TURN DECISION TREE ===\n`;
fullDecisionTree+=formatTree(tree);

const move=findBestMove(board);
if(move===-1)return;

board[move]=AI;
boardElement.children[move].textContent=AI;

if(checkWinner(board)||isDraw(board)){
endGame();
}
}

function endGame(){
gameActive=false;

const winner=checkWinner(board);
let resultText="Draw";

if(winner===HUMAN){
resultText="Player Win";
}
else if(winner===AI){
resultText="AI Win";
}

saveGameToHistory(playerName,resultText,fullDecisionTree);
}
