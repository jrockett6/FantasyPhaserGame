export class Torrentacle extends Phaser.GameObjects.Sprite {
    /**
     * 
     */
    constructor(scene, target) {
        // Constructor
        super(scene, target.x+5, target.y, "torrentacle", 0);
        scene.sys.updateList.add(this);
        scene.sys.displayList.add(this);
        
        // Set Properties
        target.isRooted = true;
        target.applyDmg(3);
        this.setDepth(target.depth + 5);
        this.setVisible = false;
        this.manaCost = 3;
        this.anims.play("torrentacle", true);

        // On complete
        this.on("animationcomplete", ()=>{
            target.isRooted = false;
            this.destroy(true);
        });
    }
}