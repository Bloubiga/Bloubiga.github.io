class Entity {
    constructor(x, y) {
        this.position = [x, y, 0, 0];
        this.speed = 0;
    }
    timeStep() {
        this.position[2] *= 0.8;
        this.position[3] *= 0.8;
        this.position[0] += dt * this.position[2];
        this.position[1] += dt * this.position[3];
        return;
    }
    draw() {
        return;
    }
}

class Projectile extends Entity {
    constructor(x, y, initialSpeed, weapon) {
        super(x, y);
        this.initialSpeed = initialSpeed;
        this.toDelete = false;
        this.size = 0.1;
        this.weapon = weapon
    }
    draw() {
        ctx.beginPath();
        let startPos = positionToScreen(this.position[0] - (this.size * this.initialSpeed[0] / 2),
            this.position[1] - (this.size * this.initialSpeed[1] / 2));

        ctx.moveTo(startPos[0], startPos[1]);

        startPos = positionToScreen(this.position[0] + (this.size * this.initialSpeed[0] / 2),
            this.position[1] + (this.size * this.initialSpeed[1] / 2));
        ctx.strokeStyle = "#000000";
        ctx.lineTo(startPos[0], startPos[1]);
        ctx.stroke();
        ctx.closePath();
    }
    timeStep() {
        this.position[2] -= this.initialSpeed[0] * this.weapon.speed;
        this.position[3] -= this.initialSpeed[1] * this.weapon.speed;
        super.timeStep();
    }
}

class XPNugget extends Entity {
    constructor(x, y, xpValue) {
        super(x, y);
        this.xpValue = xpValue;
        this.toDelete = false;
    }
    draw() {
        ctx.beginPath();
        let screenPos = positionToScreen(this.position[0], this.position[1])
        ctx.arc(screenPos[0], screenPos[1], 2, 0, 2 * Math.PI);
        ctx.fillStyle = "#ff0000";
        ctx.fill();
        ctx.closePath();
    }
}

class Player extends Entity {
    constructor(x, y) {
        super(x, y);
        this.speed = 1;
        this.maxHealth = initHealth;
        this.currHealth = this.maxHealth;
        this.weaponArray = [new Weapon(50, 3, 10)];
        this.level = 0;
        this.currentXp = 0;
        this.invulDelay = 0;
    }
    draw() {
        ctx.beginPath();
        let screenPos = positionToScreen(this.position[0], this.position[1])
        ctx.rect(screenPos[0] - 5, screenPos[1] - 5, 10, 10);
        ctx.fillStyle = "#0095DD";
        if((this.invulDelay % 20) - 5 > 0)
        {
            ctx.fillStyle = "#0095DD87";
        }
        ctx.fill();
        ctx.closePath();
    }
    weaponStep() {
        for (let weaponIdx = 0; weaponIdx < this.weaponArray.length; weaponIdx++) {
            this.weaponArray[weaponIdx].fire();
        }
    }
    timeStep() {
        if (this.currentXp >= currPlayer.level * 20.0 + 10.0) {
            this.level++;
            //this.weaponArray.push(new Weapon(Math.ceil(50 / this.level), 3 + this.level, 10 + 2 * this.level));
            this.currentXp -= currPlayer.level * 20.0 + 10.0;
            levelUp();
        }
        if(this.invulDelay > 0)
        {
            this.invulDelay--;
        }
        super.timeStep()
        this.weaponStep()
    }
    resolveCollision(monster)
    {
        if(this.invulDelay<=0)
        {
            this.currHealth--;
            this.invulDelay += 100;
        }
    }
}

class Target extends Entity {
    constructor(x, y) {
        super(x, y);
        this.speed = 0.8;
        this.maxHealth = 10;
        this.currHealth = this.maxHealth;
        this.state = [];
    }
    draw() {
        ctx.beginPath();
        let screenPos = positionToScreen(this.position[0], this.position[1])
        ctx.arc(screenPos[0], screenPos[1], 5, 0, 2 * Math.PI);
        ctx.fillStyle = "#000000";
        ctx.fill();
        ctx.closePath();
    }
    timeStep() {
        let gapVectX = this.position[0] - currPlayer.position[0];
        let gapVectY = this.position[1] - currPlayer.position[1];

        let gapVectNorm = Math.sqrt(gapVectX ** 2 + gapVectY ** 2);
        gapVectX /= gapVectNorm;
        gapVectY /= gapVectNorm;

        this.position[2] -= gapVectX * this.speed;
        this.position[3] -= gapVectY * this.speed;
        super.timeStep();
    }
    deathTrigger() {
        let i = this.state.length;
        while (i--) {
            switch (this.state[i]) {
                case State.INFEST:
                    aoeArray.push(new Swamp(this.position[0], this.position[1], 10, 10, 2, 50));
            }
        }
    }
}

class Swamp extends Entity {
    constructor(x, y, damage, delay, zone, lifetime) {
        super(x, y);
        this.offset = currentTime;
        this.damage = damage;
        this.delay = delay;
        this.zone = zone;
        this.lifetime = lifetime;
    }
    draw() {
        ctx.beginPath();
        let screenPos = positionToScreen(this.position[0], this.position[1])
        ctx.arc(screenPos[0], screenPos[1], this.zone * xRatio, 0, 2 * Math.PI);

        let weight = ((currentTime - this.offset)%this.delay)/this.delay;
        let color = blendColors("#3cff00", "#000000", weight);

        ctx.fillStyle = color;

        ctx.fill();
        ctx.closePath();
    }
    resolveCollision(monster){
        if(((currentTime - this.offset)%this.delay) == 0)
        {
            monster.currHealth -= this.damage;
        }
        
    }
}
