class SnakeFang extends Weapon {
    constructor(refreshRate, speed, dmg) {
        super(refreshRate, speed, dmg);
        this.name = "Snake Fangs";
    }
    resolveSpecialCollision(currEntity) {
        if (!currEntity.state.includes(State.POISON)) {
            currEntity.state.push(State.POISON);
        }
    }
}

class PhoenixFeather extends Weapon {
    constructor(refreshRate, speed, dmg) {
        super(refreshRate, speed, dmg);
        this.name = "PhoenixFeather";
    }
    resolveSpecialCollision(currEntity) {
        if (!currEntity.state.includes(State.BURN)) {
            currEntity.state.push(State.BURN);
        }
    }
}

class SpiderSting extends Weapon {
    constructor(refreshRate, speed, dmg) {
        super(refreshRate, speed, dmg);
        this.name = "SpiderSting";
    }
    resolveSpecialCollision(currEntity) {
        if (!currEntity.state.includes(State.INFEST)) {
            currEntity.state.push(State.INFEST);
        }
    }
}

