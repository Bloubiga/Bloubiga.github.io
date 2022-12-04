const PlayerStatChoice = {
    HEALTH: 0,
    REGEN: 1,
    SPEED: 2,
 };

 const WeaponStatChoice = {
    DMG: 0,
    SPEED: 1,
    RATE: 2,
 };

 class Option {
    constructor(text) {
        this.text = text;
    }

    getText()
    {
        return this.text
    }

    resolve()
    {

    }
}

class newWeaponOption extends Option
{
    constructor(weapon)
    {
        super("Pick " + weapon.name);
        this.weapon = weapon;
    }
    resolve()
    {
        currPlayer.weaponArray.push(this.weapon);
    }
}

class upgradeWeaponOption extends Option
{
    constructor(weapon, attribute)
    {
        let toStringattribute = "";

        switch(attribute)
        {
            case WeaponStatChoice.DMG:
                toStringattribute = " DMG";
                break;
            case WeaponStatChoice.RATE:
                toStringattribute = " RATE";
                break;
            case WeaponStatChoice.SPEED:
                toStringattribute = " SPEED";
                break;

        }

        super("Upgrade " + weapon.name + toStringattribute);
        this.weapon = weapon;
        this.attribute = attribute;
    }
    resolve()
    {
        switch(this.attribute)
        {
            case WeaponStatChoice.DMG:
                this.weapon.dmg++;

            case WeaponStatChoice.RATE:
                this.weapon.refreshRate = Math.max(1,Math.floor(this.weapon.refreshRate/2));

            case WeaponStatChoice.SPEED:
                this.weapon.speed++;

        }
    }
}

