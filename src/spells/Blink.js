import { CST } from "../CST.js";
import { BlinkSprite } from "../sprites/spellSprites/BlinkSprite.js";

export class Blink {
    constructor(scene, player) {
        // Main objects
        this.scene = scene;
        this.player = player;

        // Properties
        this.iconLoc = 6;
        this.iconTex = CST.ICONS.BLINK_1;
        this.keyDisplay = "E";
        this.key = "E";
        this.manaCost = 3;

        //Create animation
        this.scene.anims.create({
            key: CST.SPELLS.BLINK1,
            frameRate: 30,
            frames: this.scene.anims.generateFrameNames(CST.SPELLS.BLINK1, {start: 0, end: 23}),
        });
        this.scene.anims.anims.get(CST.SPELLS.BLINK1).on("complete", (misc1, misc2, obj)=>{
            obj.destroy();
        });
    }

    cast() {
        new BlinkSprite(this.scene, this.player.x, this.player.y);
        this.player.x = this.scene.input.mousePointer.worldX;
        this.player.y = this.scene.input.mousePointer.worldY - 30;
        new BlinkSprite(this.scene, this.player.x, this.player.y);

    }
}
