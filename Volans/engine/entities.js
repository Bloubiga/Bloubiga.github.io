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
    timeStep(){
        if(this.currentXp >= currPlayer.level*20.0 + 10.0)
        {
            this.level++;
            this.weaponArray.push(new Weapon(Math.ceil(50/this.level),3+this.level,10+2*this.level));
            this.currentXp -= currPlayer.level*20.0 + 10.0;
            pause = true;
        }
        super.timeStep()
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
