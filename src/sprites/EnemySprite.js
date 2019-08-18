export class EnemySprite extends Phaser.Physics.Arcade.Sprite {
    /**
     * 
     */
    constructor(scene, x, y, texture, frame) {
        frame = frame || 0;
        super(scene, x, y, texture, frame)
        scene.sys.updateList.add(this);
        scene.sys.displayList.add(this);
        scene.physics.world.enableBody(this);
        this.angleToTarget = undefined;
        // this.setImmovable(true);
        // this.setOrigin(0, 0);
    }
}