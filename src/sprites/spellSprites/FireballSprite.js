import { CST } from "../../CST.js";

export class FireballSprite extends Phaser.Physics.Arcade.Sprite {
    /**
     * 
     */
    constructor(scene, player, damage, direction, target) {
        switch (direction) {
            case "up":
                super(scene, player.x, player.y-10, CST.SPELLS.FIREBALL1, 0);
                break;
            case "down": 
                super(scene, player.x, player.y+20, CST.SPELLS.FIREBALL1, 0);
                break;
            case "left": 
                super(scene, player.x-10, player.y+10, CST.SPELLS.FIREBALL1, 0);
                break;
            case "right": 
                super(scene, player.x+10, player.y+10, CST.SPELLS.FIREBALL1, 0);
                break;
        }

        // Create ID for map
        FireballSprite.id = FireballSprite.id || 0;
        this.id = FireballSprite.id;
        ++FireballSprite.id;
        
        // Add scene properties
        scene.moveToMap.set(CST.SPELLS.FIREBALL1 + this.id, [this, target]);
        scene.sys.updateList.add(this);
        scene.sys.displayList.add(this);
        scene.physics.world.enableBody(this);
        this.setRotation(Phaser.Math.Angle.Between(player.x, player.y, target.x, target.y) - Math.PI/2);
        this.setScale(.95, .95);
        this.depthModifier = 15;
        this.body.setCircle(17, 50, 48);
        this.anims.play(CST.SPELLS.FIREBALL1);
        this.speed = 100;

        // Add collider
        scene.physics.add.collider(this, target, (misc, targ)=>{
            targ.applyDmg(damage);
            scene.moveToMap.delete(CST.SPELLS.FIREBALL1 + this.id);
            this.destroy(true);
        });
    }
}