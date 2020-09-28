import { CST } from "../CST.js";
import { FireballSprite } from "../sprites/spellSprites/FireballSprite.js";

export class Fireball {
    /**
     * Basic fireball class. Contains properties and methods for use by the Player() class. Creates the Fireball sprite for rendering.
     */
    constructor(scene, player) {
        // Main objects
        this.scene = scene;
        this.player = player;

        // Properties
        this.damage = 6;
        this.iconLoc = 3;
        this.iconTex = CST.ICONS.FIREBALL_RED_1;
        this.keyDisplay = "R";
        this.key = "R";
        this.castTime = 2*1000;
        this.manaCost = 3;
        this.damage = 6;

        // Create animation
        this.scene.anims.create({
            key: CST.SPELLS.FIREBALL1,
            frameRate: 600,
            frames: this.scene.anims.generateFrameNames(CST.SPELLS.FIREBALL1, {start: 0, end: 60}),
            repeat: -1
        });
    }

    cast(target) {
        this.target = target;
        if (target && !this.player.isLongCasting && !this.player.isCasting && this.player.spendMana(this.manaCost)) {
            let angle = Phaser.Math.Angle.Between(target.x, target.y, this.player.x, this.player.y);
            if (angle <= Math.PI/4 && angle >= -Math.PI/4) {
                this.player.playerSpriteTop.play(CST.ANIMS.LONGCASTSTART1_LEFT);
                this.player.playerSpriteBot.play(CST.ANIMS.LONGCASTSTART1_LEFT);
                this.curDirection = "left";
            }
            else if (angle >= Math.PI/4 && angle <= 3*Math.PI/4) {
                this.player.playerSpriteTop.play(CST.ANIMS.LONGCASTSTART1_UP);
                this.player.playerSpriteBot.play(CST.ANIMS.LONGCASTSTART1_UP);
                this.curDirection = "up";
            }
            else if (angle <= -Math.PI/4 && angle >= -3*Math.PI/4) {
                this.player.playerSpriteTop.play(CST.ANIMS.LONGCASTSTART1_DOWN);
                this.player.playerSpriteBot.play(CST.ANIMS.LONGCASTSTART1_DOWN);
                this.curDirection = "down";
            }
            else {
                this.player.playerSpriteTop.play(CST.ANIMS.LONGCASTSTART1_RIGHT);
                this.player.playerSpriteBot.play(CST.ANIMS.LONGCASTSTART1_RIGHT);
                this.curDirection = "right";

            }
            console.log(this.curDirection);
            this.player.cast(this);
            this.player.isLongCasting = true;
        }
    }

    endCast() {
        new FireballSprite(this.scene, this.player, this.damage, this.curDirection, this.target);
        switch(this.curDirection) {
            case "up": this.player.playerSpriteTop.play(CST.ANIMS.LONGCASTEND1_UP); this.player.playerSpriteBot.play(CST.ANIMS.LONGCASTEND1_UP); break;
            case "down": this.player.playerSpriteTop.play(CST.ANIMS.LONGCASTEND1_DOWN); this.player.playerSpriteBot.play(CST.ANIMS.LONGCASTEND1_DOWN); break;
            case "left": this.player.playerSpriteTop.play(CST.ANIMS.LONGCASTEND1_LEFT); this.player.playerSpriteBot.play(CST.ANIMS.LONGCASTEND1_LEFT); break;
            case "right": this.player.playerSpriteTop.play(CST.ANIMS.LONGCASTEND1_RIGHT); this.player.playerSpriteBot.play(CST.ANIMS.LONGCASTEND1_RIGHT); break;
        }
    }
}