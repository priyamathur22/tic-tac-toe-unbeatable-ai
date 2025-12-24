const historyList=document.getElementById("historyList");

function saveGameToHistory(player,result,treeText){
let history=JSON.parse(localStorage.getItem("ttt-history"))||[];

history.unshift({
player:player,
result:result,
tree:treeText,
time:new Date().toLocaleString()
});

localStorage.setItem("ttt-history",JSON.stringify(history));
renderHistory();
}

function renderHistory(){
let history=JSON.parse(localStorage.getItem("ttt-history"))||[];
historyList.innerHTML="";

history.slice(0,5).forEach((item,index)=>{
let li=document.createElement("li");
li.textContent=`${item.player} — ${item.result} (${item.time})`;
li.style.cursor="pointer";
li.onclick=()=>alert(item.tree);
historyList.appendChild(li);
});
}

renderHistory();
