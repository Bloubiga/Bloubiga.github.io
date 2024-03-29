function drawTarget() {
    for (let i = 0; i < monsterArray.length; i++) {
        monsterArray[i].draw();
    }
}

function drawProjectiles() {
    for (let i = 0; i < projectileArray.length; i++) {
        projectileArray[i].draw();
    }
}

function drawXPShard() {
    for (let i = 0; i < xpArray.length; i++) {
        xpArray[i].draw();
    }
}

function drawAOE() {
    for (let i = 0; i < aoeArray.length; i++) {
        aoeArray[i].draw();
    }
}

function drawXPBar() {
    ctx.beginPath();
    let screenPosMin = positionToScreen(xMin, yMin);
    let screenPosMax = positionToScreen(xMax, yMax);
    ctx.strokeStyle = "#000000";
    ctx.fillStyle = "#0e7d20";
    let nextLvlXp = currPlayer.level * 20.0 + 10.0;
    let xpRatio = currPlayer.currentXp / nextLvlXp;
    ctx.fillRect(screenPosMin[0], screenPosMin[1], (screenPosMax[0] - screenPosMin[0]) * xpRatio, 10);
    ctx.strokeRect(screenPosMin[0], screenPosMin[1], screenPosMax[0] - screenPosMin[0], 10);

    ctx.closePath();
}

function drawPlayerUI() {
    ctx.beginPath();

    let margin = 2;
    let healthWidth = 2;

    let healthXPosLeft = xMin + margin;
    let healthXPosRight = xMin + margin + 3*healthWidth;

    let healthYPosLeft = yMin + margin;
    let healthYPosRight = yMin + margin + healthWidth;

    let screenPosMin = positionToScreen(healthXPosLeft, healthYPosLeft);
    let screenPosMax = positionToScreen(healthXPosRight, healthYPosRight);

    ctx.fillStyle = "#da0b0b";

    let hpRatio = currPlayer.currHealth / currPlayer.maxHealth;

    ctx.fillRect(screenPosMin[0], screenPosMin[1], (screenPosMax[0] - screenPosMin[0])*hpRatio, 10);
    ctx.strokeRect(screenPosMin[0], screenPosMin[1], screenPosMax[0] - screenPosMin[0], 10);
    ctx.closePath();
    

}


function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!pause) {
        drawAOE();
        currPlayer.draw();
        drawTarget();
        drawProjectiles();
        drawXPShard();
        drawXPBar();
        drawPlayerUI();
        let xAcc = currPlayer.position[2];
        let yAcc = currPlayer.position[3];

        ctx.fillStyle = "#000000";
        ctx.font = '10px serif';
        
        ctx.strokeText(String(Number(xAcc).toFixed(2)), 10, 50);
        ctx.strokeText(String(Number(yAcc).toFixed(2)), 10, 60);
    }
    else {
        drawChoice();
    }

}

function drawChoice() {
    let basechoice = 3;
    let choiceNb = basechoice; //+ Math.round(Math.random());

    let width = canvas.width;
    let height = canvas.height;

    let margin = 50;

    let separation = 20;

    let choiceWidth = width - margin;
    let choiceHeight = (height - margin) / choiceNb;


    for (let choiceIdx = 0; choiceIdx < choiceNb; choiceIdx++) {
        ctx.beginPath();
        if (pickArray[choiceIdx]) {
            ctx.strokeStyle = "#0e7d20";
            ctx.lineWidth = 3;
        }
        else {
            ctx.strokeStyle = "#c93b14";
            ctx.lineWidth = 1;
        }
        ctx.strokeRect(margin / 2, margin / 2 + choiceIdx * choiceHeight + separation / 2, choiceWidth, choiceHeight - separation / 2);

        ctx.fillStyle = "#000000";
        ctx.lineWidth = 1;

        ctx.font = '20px serif';
        ctx.fillText(levelUpChoiceArray[choiceIdx].text, margin / 2 + 10, margin / 2 + choiceIdx * choiceHeight + choiceHeight / 2)
        ctx.closePath();
    }
}

function blendColors(colorA, colorB, amount) {
    const [rA, gA, bA] = colorA.match(/\w\w/g).map((c) => parseInt(c, 16));
    const [rB, gB, bB] = colorB.match(/\w\w/g).map((c) => parseInt(c, 16));
    const r = Math.round(rA + (rB - rA) * amount).toString(16).padStart(2, '0');
    const g = Math.round(gA + (gB - gA) * amount).toString(16).padStart(2, '0');
    const b = Math.round(bA + (bB - bA) * amount).toString(16).padStart(2, '0');
    return '#' + r + g + b;
  }