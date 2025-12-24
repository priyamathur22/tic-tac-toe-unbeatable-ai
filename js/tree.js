function minimaxTree(board,isMax,depth,alpha,beta){
let winner=checkWinner(board);
if(winner===AI)return{score:10-depth,children:[]};
if(winner===HUMAN)return{score:depth-10,children:[]};
if(isDraw(board))return{score:0,children:[]};

let node={
type:isMax?"MAX":"MIN",
depth:depth,
children:[]
};

if(isMax){
let best=-Infinity;
for(let i=0;i<9;i++){
if(board[i]===""){
board[i]=AI;
let child=minimaxTree(board,false,depth+1,alpha,beta);
board[i]="";
child.move=i+1;
node.children.push(child);
best=Math.max(best,child.score);
alpha=Math.max(alpha,best);
if(beta<=alpha)break;
}
}
node.score=best;
}
else{
let best=Infinity;
for(let i=0;i<9;i++){
if(board[i]===""){
board[i]=HUMAN;
let child=minimaxTree(board,true,depth+1,alpha,beta);
board[i]="";
child.move=i+1;
node.children.push(child);
best=Math.min(best,child.score);
beta=Math.min(beta,best);
if(beta<=alpha)break;
}
}
node.score=best;
}
return node;
}

function formatTree(node,indent=""){
let output=`${indent}${node.type||"LEAF"} | Depth:${node.depth||0} | Score:${node.score}\n`;
if(node.children){
node.children.forEach(child=>{
output+=`${indent}  └─ Move ${child.move}\n`;
output+=formatTree(child,indent+"    ");
});
}
return output;
}

function showDecisionTree(board){
let tree=minimaxTree([...board],true,0,-Infinity,Infinity);
alert(formatTree(tree));
}
