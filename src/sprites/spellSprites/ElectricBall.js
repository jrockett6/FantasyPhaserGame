export class ElectricBall extends Phaser.Physics.Arcade.Sprite {
    /**
     * 
     */
    constructor(scene, player, playerDirection) {
        // Call super, play slash animation
        switch (playerDirection) {
            case "up":
                super(scene, player.x, player.y-10, "electric_ball", 0);
                this.setDepth(player.depth-5);
                scene.playerSpriteTop.anims.play("elf_top_slash_up", true);
                break;
            case "down": 
                super(scene, player.x, player.y+10, "electric_ball", 0);
                this.setDepth(player.depth+25);
                scene.playerSpriteTop.anims.play("elf_top_slash_down", true);
                break;
            case "left": 
                super(scene, player.x-10, player.y, "electric_ball", 0);
                this.setDepth(player.depth+25);
                scene.playerSpriteTop.anims.play("elf_top_slash_left", true);
                break;
            case "right": 
                super(scene, player.x+10, player.y, "electric_ball", 0);
                this.setDepth(player.depth+25);
                scene.playerSpriteTop.anims.play("elf_top_slash_right", true);
                break;
        }

        // Create ID for map
        ElectricBall.id = ElectricBall.id || 0;
        this.id = ElectricBall.id;
        ++ElectricBall.id;
        
        // Add scene properties
        scene.sys.updateList.add(this);
        scene.sys.displayList.add(this);
        scene.physics.world.enableBody(this);
        scene.accToMap.set("electricBall" + this.id, [this, scene.player.target]);

        // Set dimensions
        this.body.setCircle(17, 50, 48);
        this.anims.play("electric_ball");
        this.setScale(.95, .95);

        // Add properties
        this.damage = 6;

        scene.physics.add.collider(this, scene.player.target, (misc, target)=>{
            target.applyDmg(this.damage);
            scene.accToMap.delete("electricBall" + this.id);
            this.destroy(true);
        });
    }
}