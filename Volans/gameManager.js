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

class Projectile extends Entity{
	constructor(x,y, initialSpeed, speed, dmg){
		super(x,y);
		this.speed = speed;
		this.dmg = dmg;
		this.initialSpeed = initialSpeed;
		this.toDelete = false;
		this.size = 0.1;
	}
	draw(){
		ctx.beginPath();
		let startPos = positionToScreen(this.position[0]-(this.size*this.initialSpeed[0]/2),
		this.position[1]-(this.size*this.initialSpeed[1]/2));
		
		ctx.moveTo(startPos[0], startPos[1]);

		startPos = positionToScreen(this.position[0]+(this.size*this.initialSpeed[0]/2),
		 this.position[1]+(this.size*this.initialSpeed[1]/2));

		ctx.lineTo(startPos[0], startPos[1]);
		ctx.stroke();
		ctx.closePath();
	}
	timeStep(){
		this.position[2] -= this.initialSpeed[0] * this.speed;
		this.position[3] -= this.initialSpeed[1] * this.speed;
		super.timeStep();
	}
}

class XPNugget extends Entity
{
	constructor(x,y, xpValue){
		super(x,y);
		this.xpValue = xpValue;
		this.toDelete = false;
	}
	draw(){
		ctx.beginPath();
		let screenPos = positionToScreen(this.position[0], this.position[1])
		ctx.arc(screenPos[0], screenPos[1], 2, 0, 2 * Math.PI);
		ctx.fillStyle = "#ff0000";
		ctx.fill();
		ctx.closePath(); 
	  }
}

function GetCloserEnnemy(){
	let closerDistance = Infinity;
	let closerIdx = -1;
	for(let i = 0; i < monsterArray.length; i++){

		let enemy = monsterArray[i];

		let gapVectX = currPlayer.position[0] - enemy.position[0];
		let gapVectY = currPlayer.position[1] - enemy.position[1];

		let dist = Math.sqrt(gapVectX**2 + gapVectY**2);

		if(dist < closerDistance){
			closerDistance = dist;
			closerIdx = i;
		}

	}
	if(closerIdx == -1){
		return null;
	}
	else{
		return monsterArray[closerIdx];
	}
}

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

class Player extends Entity{
  constructor(x,y) {
    super(x,y);
	this.speed = 1;
    this.maxHealth = initHealth;
	this.currHealth = this.maxHealth;
	this.weaponArray = [new Weapon(50,3,10)];
	this.level = 0;
	this.currentXp = 0;
  }
  draw(){
	ctx.beginPath();
	let screenPos = positionToScreen(this.position[0], this.position[1])
	ctx.rect(screenPos[0]-5, screenPos[1]-5, 10, 10);
	ctx.fillStyle = "#0095DD";
	ctx.fill();
	ctx.closePath(); 
  }
  weaponStep(){
	  for(let weaponIdx = 0; weaponIdx < this.weaponArray.length; weaponIdx++){
		this.weaponArray[weaponIdx].fire();
	  }
  }
}

class Target extends Entity{
	constructor(x,y) {
		super(x,y);
		this.speed = 0.8;
		this.maxHealth = 10;
		this.currHealth = this.maxHealth;
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

		this.position[2] -= gapVectX * this.speed;
		this.position[3] -= gapVectY * this.speed;
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

function drawProjectiles(){
	for(let i = 0; i < projectileArray.length; i++){
		projectileArray[i].draw();
	}
}

function drawXPShard(){
	for(let i = 0; i < xpArray.length; i++){
		xpArray[i].draw();
	}
}

function drawXPBar(){
	ctx.beginPath();
	let screenPosMin = positionToScreen(xMin, yMin);
	let screenPosMax = positionToScreen(xMax, yMax);
	
	ctx.fillStyle = "#0e7d20";
	ctx.fillRect(screenPosMin[0], screenPosMin[1], (screenPosMax[0] - screenPosMin[0]) * (currPlayer.currentXp - (currPlayer.level*20 + 10)), 10);
	ctx.strokeRect(screenPosMin[0], screenPosMin[1], screenPosMax[0] - screenPosMin[0], 10);

	ctx.closePath(); 
}

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	currPlayer.draw();
	drawTarget();
	drawProjectiles();
	drawXPShard();
	drawXPBar();
	let xAcc = currPlayer.position[2];
	let yAcc = currPlayer.position[3];
	
	ctx.strokeText(String(Number(xAcc).toFixed(2)), 10, 50);
	ctx.strokeText(String(Number(yAcc).toFixed(2)), 10, 60); 	
	
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
	currPlayer.weaponStep();
	playTargets();
	playProjectiles();
	collisionDetection();
	currentTime++;
	
	if(currentTime%10 == 0){
		spawnMonster();
	}
	
	draw();
}

function CheckCollision(proj, monster){
	if((proj.position[0] - monster.position[0])**2 + (proj.position[1] - monster.position[1])**2 < (0.5/2)**2){
		monster.currHealth -= proj.dmg;
		const projI = projectileArray.indexOf(proj);
		if(projI>-1){
			projectileArray[projI].toDelete = true;
		}
	} 
}

function collisionDetection(){
	for(let proji = 0; proji < projectileArray.length; proji++){
		for(let monsteri = 0; monsteri < monsterArray.length; monsteri++){
			CheckCollision(projectileArray[proji], monsterArray[monsteri])
		}
	}

	let i = projectileArray.length;
	while (i--) {
		if (projectileArray[i].toDelete) { 
			projectileArray.splice(i, 1);
		} 
	}

	for(let shardI = 0; shardI < xpArray.length; shardI++){

		let xpShard = xpArray[shardI];

		if((xpShard.position[0] - currPlayer.position[0])**2 + (xpShard.position[1] - currPlayer.position[1])**2 < (2/2)**2){
			currPlayer.currentXp += xpShard.xpValue;
			const projI = xpArray.indexOf(xpShard);
			if(projI>-1){
				xpShard.toDelete = true;
			}
		} 
	}

	i = xpArray.length;
	while (i--) {
		if (xpArray[i].toDelete) { 
			xpArray.splice(i, 1);
		} 
	}

	
}


var currPlayer = new Player(10,10);

var currentTime = 0;

var monsterArray = [];

var interval = setInterval(frameManager, 10);