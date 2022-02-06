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