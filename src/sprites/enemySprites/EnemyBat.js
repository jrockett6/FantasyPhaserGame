export class EnemyBat extends Phaser.GameObjects.Container {
    /**
     * 
     */
    constructor(scene, x, y) {
        // Create bat sprite and add to scene
        let batSprite = new Phaser.Physics.Arcade.Sprite(scene, 0, 0, "bat", 3);
        scene.sys.displayList.add(batSprite);
        scene.sys.updateList.add(batSprite);
        
        // Create Container, add to disp list
        super(scene, x, y, batSprite)
        scene.sys.displayList.add(this);
        scene.physics.world.enableBody(this);

        // Create clickbox
        let batClickBox = new Phaser.Geom.Circle(0, 0, 30);
        this.setInteractive(batClickBox, Phaser.Geom.Circle.Contains);
        this.body.setSize(20, 20).setOffset(-9, -10);
        // this.body.setCircle(30).setOffset(-30, -30);

        // Create healthbar
        this.healthBarWidth = 25;
        this.healthBack = new Phaser.GameObjects.Rectangle(scene, 0, -20, this.healthBarWidth, 3, 0xff0000, .8);
        this.healthFront = new Phaser.GameObjects.Rectangle(scene, 0, -20, this.healthBarWidth, 3, 0x00ff00, .8);
        this.add(this.healthBack);
        this.add(this.healthFront);

        // Create target indicator
        this.targetIndicator = new Phaser.GameObjects.Ellipse(scene, 0, 20, 30, 12, 0xff0000, .7).setVisible(false);
        this.targetIndicator.setStrokeStyle(1, 0xff0000, 1);
        this.add(this.targetIndicator);
        this.scene.add.tween({
            targets: this.targetIndicator,
            duration: 1000,
            repeat: -1,
            alpha: {from: 0.7, to: 0.4},
            yoyo: true
        })
        
        // Create ID
        EnemyBat.id = EnemyBat.id || 0;
        this.id = EnemyBat.id;
        ++EnemyBat.id;
        
        // Add to custom scene maps, play anim
        scene.moveToMap.set("enemyBat" + this.id, [this, scene.player]);
        scene.collisionMap.set("enemyBat" + this.id, this);
        this.list[0].anims.play("bat_move");
        
        // Set bat properties
        this.speed = 32;
        this.isRooted = false;
        this.maxHealth = 20;
        this.curHealth = 20;
        this.depthModifier = 18;
    }

    applyDmg(damage) {
        this.curHealth = Math.max(this.curHealth-damage, 0);
        this.healthFront.width = this.curHealth/this.maxHealth * this.healthBarWidth;

        // Create damage Text and tween
        let damageText = new Phaser.GameObjects.Text(this.scene, -5, -20, `${damage}`, {
            fontFamily: "Comic Sans MS",
            strokeThickness: 2,
            stroke: "#000000",
            color: "#ff0000",
            fontSize: 15
        });
        this.add(damageText);
        let yTween = -40 + Math.random() * 10 * (Math.floor(Math.random()*2) === 1 ? 1 : -1);
        let xTween = -5 + Math.random() * 5 * (Math.floor(Math.random()*2) == 1 ? 1 : -1);
        this.scene.tweens.add({
            targets: damageText,
            delay: 0,
            duration: 2000,
            alpha: .2,
            y: yTween,
            x: xTween,
            onComplete: ()=> {
                this.remove(damageText);
                damageText.destroy();
            }
        });

        //If dead, destroy
        if (this.curHealth === 0) {
            this.scene.moveToMap.delete("enemyBat"+this.id);
            this.scene.player.remTarget(this);
            this.destroy();
        }
    }

    setTargeted() {
        this.targetIndicator.setVisible(true);
    }

    remTargeted() {
        this.targetIndicator.setVisible(false);
    }
}