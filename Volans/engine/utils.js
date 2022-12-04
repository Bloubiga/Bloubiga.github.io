function screenToPosition(x, y) {
    let translatedX = x / xRatio + xMin;
    let translatedY = y / yRatio + yMin;
    return translatedX, translatedY;
}

function positionToScreen(posX, posY) {
    let screenx = (posX - xMin) * xRatio;
    let screeny = (posY - yMin) * yRatio;
    return [screenx, screeny];
}

function GetCloserEnnemy() {
    let closerDistance = Infinity;
    let closerIdx = -1;
    for (let i = 0; i < monsterArray.length; i++) {

        let enemy = monsterArray[i];

        let gapVectX = currPlayer.position[0] - enemy.position[0];
        let gapVectY = currPlayer.position[1] - enemy.position[1];

        let dist = Math.sqrt(gapVectX ** 2 + gapVectY ** 2);

        if (dist < closerDistance) {
            closerDistance = dist;
            closerIdx = i;
        }

    }
    if (closerIdx == -1) {
        return null;
    }
    else {
        return monsterArray[closerIdx];
    }
}

function levelUp() {
    chooseOptions();
    pause = true;
    
}

function chooseOptions()
{
    levelUpChoiceArray = [];
    let choiceNb = 3;
    for (let i = 0; i < choiceNb; i++) {
        //Choice iteration
        let randIt = Math.random()

        let currOption;

        if(randIt < 0.1) //new weapon, low chance
        {
            let wp = pickRandomWeapon();
            currOption = new newWeaponOption(wp);
        }
        else{
            let wpRef = pickCurrentPlayerWeaponRd();
            currOption = wpRef.getUpgradeOption();
        }

        levelUpChoiceArray.push(currOption);

    }
}

function pickCurrentPlayerWeaponRd()
{
    let idx = Math.min(Math.random() * currPlayer.weaponArray.length, currPlayer.weaponArray.length - 1);
    return currPlayer.weaponArray[Math.floor(idx)];
}
