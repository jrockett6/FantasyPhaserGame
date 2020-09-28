import { CST } from "../../CST.js";

export class BlinkSprite extends Phaser.GameObjects.Sprite {
    /**
     * 
     */
    constructor(scene, x, y) {
        super(scene, x-3, y-10, CST.SPELLS.BLINK1, 0)
        scene.sys.displayList.add(this);
        scene.sys.updateList.add(this);

        this.setDepth(y + 30);
        
        this.anims.play(CST.SPELLS.BLINK1);
        // this.depth = y+200;
    }
}