var canvas = document.getElementById("myCanvas")
var ctx = canvas.getContext("2d");

var xMin = 0.;
var xMax = 20.;
var yMin = 0.;
var yMax = 20.;

var initHealth = 50.;
var dt = 0.010;

var xRatio = canvas.width / (xMax - xMin)
var yRatio = canvas.height / (yMax - yMin)

function screenToPosition(x, y){
	let translatedX  = x / xRatio + xMin;
	let translatedY  = y / yRatio + yMin;
	return translatedX, translatedY;
}

function positionToScreen(posX, posY){
	let screenx = (posX - xMin) * xRatio;
	let screeny = (posY - yMin) * yRatio;
	return [screenx, screeny];
}

class Entity{
  constructor(x,y) {
    this.position = [x,y,0,0];
	this.speed = 0;
  }
  timeStep(){
	this.position[2] *= 0.8;
	this.position[3] *= 0.8;
    this.position[0] += dt * this.position [2];
	this.position[1] += dt * this.position [3];
	return;
  }
  draw(){
	return; 
  }
}	

class Player extends Entity{
  constructor(x,y) {
    super(x,y);
	this.speed = 1;
    this.maxHealth = initHealth;
	this.currHealth = this.maxHealth;
  }
  draw(){
	ctx.beginPath();
	let screenPos = positionToScreen(this.position[0], this.position[1])
	ctx.rect(screenPos[0], screenPos[1], 10, 10);
	ctx.fillStyle = "#0095DD";
	ctx.fill();
	ctx.closePath(); 
  }
}

class Target extends Entity{
	constructor(x,y) {
		super(x,y);
	}
		draw(){
		ctx.beginPath();
		let screenPos = positionToScreen(this.position[0], this.position[1])
		ctx.arc(screenPos[0], screenPos[1], 5, 0, 2 * Math.PI);
		ctx.fillStyle = "#000000";
		ctx.fill();
		ctx.closePath(); 
	}
	timeStep(){
		let gapVectX = this.position[0] - currPlayer.position[0];
		let gapVectY = this.position[1] - currPlayer.position[1];

		let gapVectNorm = Math.sqrt(gapVectX**2 + gapVectY**2);
		gapVectX /= gapVectNorm;
		gapVectY /= gapVectNorm;

		this.position[2] -= gapVectX;
		this.position[3] -= gapVectY;
		super.timeStep();
	}
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

var rightPressed = false;
var leftPressed = false;
var topPressed = false;
var downPressed = false;


function keyDownHandler(e) {
	if (e.key == "Right" || e.key == "ArrowRight") {
		rightPressed = true;
	}
	else if (e.key == "Left" || e.key == "ArrowLeft") {
		leftPressed = true;
	}
	else if (e.key == "Up" || e.key == "ArrowUp") {
		topPressed = true;
	}
	else if (e.key == "Down" || e.key == "ArrowDown") {
		downPressed = true;
	}
}

function keyUpHandler(e) {
	if (e.key == "Right" || e.key == "ArrowRight") {
		rightPressed = false;
	}
	else if (e.key == "Left" || e.key == "ArrowLeft") {
		leftPressed = false;
	}
	else if (e.key == "Up" || e.key == "ArrowUp") {
		topPressed = false;
	}
	else if (e.key == "Down" || e.key == "ArrowDown") {
		downPressed = false;
	}
}

function drawTarget()
{
	for(let i = 0; i < monsterArray.length; i++){
		monsterArray[i].draw();
	}
}

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	currPlayer.draw();
	drawTarget();

	let xAcc = currPlayer.position[2];
	let yAcc = currPlayer.position[3];
	
	ctx.strokeText(String(Number(xAcc).toFixed(2)), 10, 50);
	ctx.strokeText(String(Number(yAcc).toFixed(2)), 10, 60); 	
	
}
 
function spawnMonster(){

	let angle = Math.random() * 2*Math.PI;
	let x = (Math.cos(angle) + 1) * (xMax - xMin);
	let y = (Math.sin(angle) + 1) * (yMax - yMin); 
	let currMonster = new Target(x,y);
	monsterArray.push(currMonster);
}

function playTargets(){

	for(let i = 0; i < monsterArray.length; i++){
		monsterArray[i].timeStep();
	}
}

function frameManager() {
	
	if(rightPressed){
		currPlayer.position[2] += currPlayer.speed;
	}
	if(leftPressed){
		currPlayer.position[2] -= currPlayer.speed;
	}
	if(downPressed){
		currPlayer.position[3] += currPlayer.speed;
	}
	if(topPressed){
		currPlayer.position[3] -= currPlayer.speed;
	}
	
	currPlayer.timeStep();
	playTargets();
	currentTime++;
	
	if(currentTime%10 == 0){
		spawnMonster();
	}
	
	draw();
}




var currPlayer = new Player(10,10);

var currentTime = 0;

var monsterArray = [];

var interval = setInterval(frameManager, 10);