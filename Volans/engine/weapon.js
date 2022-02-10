class Weapon {
    constructor(refreshRate, speed, dmg) {
        this.refreshRate = refreshRate;
        this.speed = speed;
        this.dmg = dmg;
        this.name = "placeholder";
    }
    fire() {
        if (currentTime % this.refreshRate == 0) {
            let enemy = GetCloserEnnemy();
            if (enemy != null) {
                let gapVectX = currPlayer.position[0] - enemy.position[0];
                let gapVectY = currPlayer.position[1] - enemy.position[1];

                let gapVectNorm = Math.sqrt(gapVectX ** 2 + gapVectY ** 2);
                gapVectX /= gapVectNorm;
                gapVectY /= gapVectNorm;

                let thisProj = new Projectile(currPlayer.position[0], currPlayer.position[1],
                    [gapVectX, gapVectY], this);

                projectileArray.push(thisProj);
            }
        }
    }
    resolveCollision(currEntity) {
        currEntity.currHealth -= this.dmg;
    }
}