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
	let nextLvlXp = currPlayer.level*20.0 + 10.0;
	let xpRatio = currPlayer.currentXp/nextLvlXp;
	ctx.fillRect(screenPosMin[0], screenPosMin[1], (screenPosMax[0] - screenPosMin[0]) * xpRatio, 10);
	ctx.strokeRect(screenPosMin[0], screenPosMin[1], screenPosMax[0] - screenPosMin[0], 10);

	ctx.closePath(); 
}

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	if(!pause){
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
	else{
		drawChoice();
	}
	
}

function drawChoice(){
	let basechoice = 3;
	let choiceNb = basechoice; //+ Math.round(Math.random());

	let width = canvas.width;
	let height = canvas.height;

	let margin  = 50;

	let separation = 20;

	let choiceWidth = width - margin;
	let choiceHeight = (height - margin)/choiceNb;


	for(let choiceIdx = 0; choiceIdx<choiceNb; choiceIdx++)
	{
		ctx.beginPath();
		if(pickArray[choiceIdx]){
			ctx.strokeStyle = "#0e7d20";
			ctx.lineWidth = 3;
		}
		else{
			ctx.strokeStyle = "#c93b14";
			ctx.lineWidth = 1;
		}
		ctx.strokeRect(margin/2, margin/2 + choiceIdx*choiceHeight + separation/2, choiceWidth, choiceHeight - separation/2);
		ctx.closePath(); 
	}
}