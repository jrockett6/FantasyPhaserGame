export class CollisionSprite extends Phaser.Physics.Arcade.Sprite {
    /**
     * 
     */
    constructor(scene, map, layer_name, id) {
        let sprite = map.createFromObjects(layer_name, id, {key: "__DEFAULT"});
        super(scene, sprite[0].x, sprite[0].y, sprite.texture, sprite.frame);
        scene.sys.updateList.add(this);
        scene.sys.displayList.add(this);
        scene.physics.world.enableBody(this);
        this.setOrigin(0, 0);
        this.setImmovable(true);
    }
}