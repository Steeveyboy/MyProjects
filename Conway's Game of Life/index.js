var oldMap;
//let newMap;
let writing = false;
let running = false;
// const size = 16;
let mapHeight = 16;
let mapWidth = 16;
let population = 0;
let generation;
let tempo = 100;

//For the Chart
let label = [0];
let datem = [
  { y: 0 }
];
let myChart;


getInitialSize();
start(mapHeight, mapWidth);

function getInitialSize(){
  mapHeight = Math.floor((document.documentElement.clientHeight / 45) /1.5);
  mapWidth = Math.floor(document.documentElement.clientWidth / 45);
  document.getElementById("gridHeight").value = mapHeight;
  document.getElementById("gridWidth").value = mapWidth;
  console.log(mapHeight, mapWidth);
}

function timer(){
  return new Promise(res => setTimeout(res, tempo));
}

function changeSize() {
  console.log(document.getElementById("gridHeight").value);
  console.log(document.getElementById("gridWidth").value);
  mapHeight = document.getElementById("gridHeight").value;
  mapWidth = document.getElementById("gridWidth").value;

  start(mapHeight, mapWidth);
  //nextGen();
  // makeNewMap(document.getElementById("gridHeight").value, document.getElementById("gridWidth").value)
}

function speedUp() {
  if(tempo==20){
    return
  }
  tempo -= 20
  document.getElementById("tempoDisplay").innerHTML = tempo + "ms"
}

function slowDown(){
  tempo += 20
  document.getElementById("tempoDisplay").innerHTML = tempo + "ms"
}



async function go(){
  running = !running;
  if(running){document.getElementById("startButton").innerHTML = "pause"}
  else{document.getElementById("startButton").innerHTML = "start"}

  while(running){
    await nextGen();
    await timer();
  }
}

function getCords(cords){
  var st = cords.split(",");
  let cordsObj = {x: Number(st[0]), y: Number(st[1])}
  return(cordsObj)
}

function start(h, w){
  generation = 1;
  document.getElementById("generations").innerHTML = generation;
  let oldMap = new Array();
  var newMap = new Array();

  for(var i=0; i<h; i++){
    var row = new Array();

    for(var j =0; j<w; j++){
      var point = document.createElement("div");
      point.setAttribute("type", "button");
      point.classList.add("node");
      point.setAttribute("id", (j + "," + i));
      point.addEventListener("click", changeStatus);
      row.push(point);
    }
    newMap.push(row);
  }

  display(newMap);
}


function changeStatus(){
  //console.log(getCords(this.id));
  if(this.classList.contains("alive")){
      population -= 1;
      document.getElementById("population").innerHTML = population;
      $(this).removeClass("alive");
  }
  else{
    population += 1;
    document.getElementById("population").innerHTML = population;
    $(this).addClass("alive");
  }
}



function display(newMap){
  //console.log("HERE");
  let board = document.getElementsByClassName("main")[0];
  board.innerHTML = "";
  for(var i=0; i<newMap.length; i++){
    var row = document.createElement("div");
    for(var j=0; j<newMap[i].length; j++){
      row.appendChild(newMap[i][j]);
    }
    board.appendChild(row);
  }
  oldMap = newMap;
}

function reset(){
  let main = document.getElementsByClassName("main")[0];
  main.innerHTML = "";
  start(mapHeight, mapWidth);
}

function countLive(node){
  var cords = getCords(node.id);
  let sum = 0;
  for(var i = -1; i<2; i++){
    for(var j = -1; j<2; j++){
      if(i ==0 && j==0){
        continue;
      }

      if(cords.x + i < 0 || cords.y + j < 0 || cords.x + i > oldMap[0].length-1 || cords.y + j > oldMap.length-1){
        continue;
      }
      //console.log(oldMap);
      //console.log(cords);
      // console.log(oldMap[cords.y + j][cords.x + i]);
      if(oldMap[cords.y + j][cords.x + i].classList.contains("alive")){
        sum+=1;
      }
    }
  }
  return sum;
}

function makeNewMap(h, w){
  var newMap = new Array();

  for(var i=0; i<h; i++){
    var row = new Array();
    for(var j =0; j<w; j++){
      var point = document.createElement("div");
      point.setAttribute("type", "button");
      point.classList.add("node");
      point.setAttribute("id", (j + "," + i));
      point.addEventListener("click", changeStatus);
      row.push(point);
    }
    //console.log(row);
    newMap.push(row);
  }

  //console.log("newMap! " + newMap);
  return(newMap);
}


function nextGen(){
  generation += 1;
  population = 0;
  document.getElementById("generations").innerHTML = generation;
  var newMap = makeNewMap(mapHeight, mapWidth);
  for(var i=0; i<oldMap.length; i++){
    for(var j=0; j<oldMap[i].length; j++){
      if(countLive(oldMap[i][j])>3){
        continue;
      }

      if(countLive(oldMap[i][j])>2){
        population += 1;
        newMap[i][j].classList.add("alive")
      }
      if(countLive(oldMap[i][j])==2 && oldMap[i][j].classList.contains("alive")){
        population +=1;
        newMap[i][j].classList.add("alive")
      }


    }
  }
  console.log(population);
  document.getElementById("population").innerHTML = population;
  display(newMap);
  addToChart(population);
}

function addToChart(x){
  chart.options.data[0].dataPoints.push({y: x});
  chart.render();
}


window.onload=function(){

chart = new CanvasJS.Chart("chartContainer", {
	animationEnabled: true,
	theme: "light2",
	title:{
		text: "Simple Line Chart"
	},
	data: [{
		type: "line",
      	indexLabelFontSize: 16,
		dataPoints: datem
	}]
});
chart.render();
}
