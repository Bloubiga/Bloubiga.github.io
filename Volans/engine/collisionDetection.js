function collisionDetection() {

    //First, collide monsters with projectiles
    //could be sped up by sorting arrays and passing by positive x
    for (let proji = 0; proji < projectileArray.length; proji++) {
        for (let monsteri = 0; monsteri < monsterArray.length; monsteri++) {
            CheckCollision(projectileArray[proji], monsterArray[monsteri]);
        }
    }


    for (let aoei = 0; aoei < aoeArray.length; aoei++) {
        for (let monsteri = 0; monsteri < monsterArray.length; monsteri++) {
            CheckAoECollision(aoeArray[aoei], monsterArray[monsteri]);
        }
    }

    //Remove unused projectiles
    let i = projectileArray.length;
    while (i--) {
        if (projectileArray[i].toDelete) {
            projectileArray.splice(i, 1);
        }
    }

    for (let shardI = 0; shardI < xpArray.length; shardI++) {

        let xpShard = xpArray[shardI];

        if ((xpShard.position[0] - currPlayer.position[0]) ** 2 + (xpShard.position[1] - currPlayer.position[1]) ** 2 < (2 / 2) ** 2) {
            currPlayer.currentXp += xpShard.xpValue;
            const projI = xpArray.indexOf(xpShard);
            if (projI > -1) {
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
    for (let monsteri = 0; monsteri < monsterArray.length; monsteri++)
    {
        CheckPlayerCollision(currPlayer , monsterArray[monsteri]);
    }
}



function CheckCollision(proj, monster) {
    if ((proj.position[0] - monster.position[0]) ** 2 + (proj.position[1] - monster.position[1]) ** 2 < (0.5 / 2) ** 2) {
        proj.weapon.resolveCollision(monster);
        const projI = projectileArray.indexOf(proj);
        if (projI > -1) {
            projectileArray[projI].toDelete = true;
        }
    }
}

function CheckAoECollision(aoe, monster) {
    if ((aoe.position[0] - monster.position[0]) ** 2 +
     (aoe.position[1] - monster.position[1]) ** 2 <
      (aoe.zone) ** 2) {
        aoe.resolveCollision(monster);
    }
}

function CheckPlayerCollision(player, monster) {
    if ((player.position[0] - monster.position[0]) ** 2 + (monster.position[1] - player.position[1]) ** 2 < (0.5 / 2) ** 2) {
        player.resolveCollision(monster);
    }
}

