export class ObjectSprite extends Phaser.GameObjects.Image {
    /**
     * 
     */
    constructor(scene, map, layer_name, id, key, frame) {
        let sprite = map.createFromObjects(layer_name, id, {key: "__DEFAULT"});
        super(scene, sprite[0].x, sprite[0].y, key, frame);
        scene.sys.updateList.add(this);
        scene.sys.displayList.add(this);
        scene.physics.world.enableBody(this);
        this.setOrigin(0, 0);
        this.setImmovable(true);
    }
}