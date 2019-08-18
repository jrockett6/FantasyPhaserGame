export class CharacterSprite extends Phaser.GameObjects.Sprite {
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

// export class CharacterSprite extends Phaser.Physics.Arcade.Sprite {
//     /**
//      * 
//      */
//     constructor(scene, x, y, texture, frame) {
//         frame = frame || 0;
//         super(scene, x, y, texture, frame)
//         scene.sys.updateList.add(this);
//         scene.sys.displayList.add(this);
//         // this.setOrigin(0, 0);
//         scene.physics.world.enableBody(this);
//         // this.setImmovable(true);
//     }
// }