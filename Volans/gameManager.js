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

var projectileArray = [];
var xpArray = [];

class Weapon{
	constructor(refreshRate, speed, dmg){
		this.refreshRate = refreshRate;
		this.speed = speed;
		this.dmg = dmg;
	}
	fire(){
		if(currentTime % this.refreshRate == 0){
			let enemy = GetCloserEnnemy();
			if(enemy != null){
				let gapVectX = currPlayer.position[0] - enemy.position[0];
				let gapVectY = currPlayer.position[1] - enemy.position[1];

				let gapVectNorm = Math.sqrt(gapVectX**2 + gapVectY**2);
				gapVectX /= gapVectNorm;
				gapVectY /= gapVectNorm;

				let thisProj = new Projectile(currPlayer.position[0], currPlayer.position[1],
					[gapVectX, gapVectY], this.speed, this.dmg);
				
				projectileArray.push(thisProj);
			}
		}
	}
}



document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
canvas.addEventListener("click", clickHandler, false);
canvas.addEventListener("mousemove", moveHandler, false);

var rightPressed = false;
var leftPressed = false;
var topPressed = false;
var downPressed = false;

var pickArray = [0,0,0];

function pickRandomWeapon(){
	return 
}

function solveClick(x, y)
{
	if(pause)
	{
		let basechoice = 3;
		let choiceNb = basechoice;

		let width = canvas.width;
		let height = canvas.height;

		let margin  = 50;

		let separation = 20;

		let choiceWidth = width - margin;
		let choiceHeight = (height - margin)/choiceNb;


		for(let choiceIdx = 0; choiceIdx<choiceNb; choiceIdx++)
		{
			if(x > margin/2 && x < margin/2 + choiceWidth &&
				 y > margin/2 + choiceIdx*choiceHeight + separation/2 && y < margin/2 + choiceIdx*choiceHeight + choiceHeight)
			{
				pause = false;
			}
		}
	}
}

function solveMove(x, y)
{
	if(pause)
	{
		let basechoice = 3;
		let choiceNb = basechoice;

		let width = canvas.width;
		let height = canvas.height;

		let margin  = 50;

		let separation = 20;

		let choiceWidth = width - margin;
		let choiceHeight = (height - margin)/choiceNb;


		for(let choiceIdx = 0; choiceIdx<choiceNb; choiceIdx++)
		{
			let selectedBool = x > margin/2 && x < margin/2 + choiceWidth &&
			y > margin/2 + choiceIdx*choiceHeight + separation/2 && y < margin/2 + choiceIdx*choiceHeight + choiceHeight
			pickArray[choiceIdx] = selectedBool;
		}
	}
}

function moveHandler(e) {
	if (e.button == 0) {
		solveMove(e.clientX - canvas.getBoundingClientRect().left, e.clientY - canvas.getBoundingClientRect().top);
	}
}

function clickHandler(e) {
	if (e.button == 0) {
		solveClick(e.clientX - canvas.getBoundingClientRect().left, e.clientY - canvas.getBoundingClientRect().top);
	}
}

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
 
function spawnMonster(){

	let angle = Math.random() * 2*Math.PI;
	let x = (2*Math.cos(angle)) * (xMax - xMin);
	let y = (2*Math.sin(angle)) * (yMax - yMin); 
	let currMonster = new Target(x,y);
	monsterArray.push(currMonster);
}

function playTargets(){

	let i = monsterArray.length;
	while (i--) {
		monsterArray[i].timeStep();
		if (monsterArray[i].currHealth<=0) { 
			let monsterxPos = monsterArray[i].position[0];
			let monsteryPos = monsterArray[i].position[1];
			
			monsterArray.splice(i, 1);
			let newShard = new XPNugget(monsterxPos, monsteryPos, 1);
			xpArray.push(newShard);
		} 
	}
}

function playProjectiles(){

	for(let i = 0; i < projectileArray.length; i++){
		projectileArray[i].timeStep();
	}
	
	let i = projectileArray.length;
	while (i--) {
		if (projectileArray[i].position[0]<xMin || projectileArray[i].position[0]>xMax ||
			 projectileArray[i].position[1]<yMin || projectileArray[i].position[1]>yMax) { 
			projectileArray.splice(i, 1);
		} 
	}
}

function frameManager() {
	if(!pause)
	{
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
		currPlayer.weaponStep();
		playTargets();
		playProjectiles();
		collisionDetection();
		currentTime++;
		
		if(currentTime%10 == 0){
			spawnMonster();
		}

		
		
	}
	draw();
}

var pause = false;

var currPlayer = new Player(10,10);

var currentTime = 0;

var monsterArray = [];

var interval = setInterval(frameManager, 10);