export class SpellIcon extends Phaser.GameObjects.Image {
    /**
     * 
     */
    constructor(scene, x, y, dim, texture) {
        super(scene, x, y, texture, 0);
        scene.sys.displayList.add(this);

        // Properties
        this.name = texture;
        this.setDisplaySize(dim, dim);
        this.setInteractive();

        // Callback
        this.on("pointerover", ()=>{
            console.log(this.name);
        })
    }
}