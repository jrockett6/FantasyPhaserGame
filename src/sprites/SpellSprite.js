export class SpellSprite extends Phaser.GameObjects.Sprite {
    /**
     * 
     */
    constructor(scene, x, y, texture, frame) {
        frame = frame || 0;
        super(scene, x, y, texture, frame);
        scene.sys.updateList.add(this);
        scene.sys.displayList.add(this);
    }
}