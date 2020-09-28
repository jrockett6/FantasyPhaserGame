import { CST } from "../CST.js";
import { Torrentacle } from "./spellSprites/Torrentacle.js";
import { ElectricBall } from "./spellSprites/ElectricBall.js";
import { Fireball } from "../spells/Fireball.js";
import { Blink } from "../spells/Blink.js"

export class Player extends Phaser.GameObjects.Container {
    /**
     * 
     */
    constructor(scene, x, y) {
        // Create container
        super(scene, x, y)
        scene.sys.displayList.add(this);
        
        // Create Sprites
        this.playerSpriteBot = new Phaser.GameObjects.Sprite(scene, 0, 0, CST.SPRITES.ELF1, 9);
        this.playerSpriteTop = new Phaser.GameObjects.Sprite(scene, 0, 0, CST.SPRITES.ELF1, 0);
        this.add(this.playerSpriteBot);
        this.add(this.playerSpriteTop);
        
        // Add to display/update list
        // scene.sys.displayList.add(this.playerSpriteTop);
        // scene.sys.displayList.add(this.playerSpriteBot);
        scene.sys.updateList.add(this.playerSpriteTop);
        scene.sys.updateList.add(this.playerSpriteBot);
        
        // Set sprite properties, add to container, add physics
        this.playerSpriteTop.setScale(.95, .95);
        this.playerSpriteBot.setScale(.95, .95);
        // iceShield = new SpellSprite(this, 5, 5, "ice_shield", 0);
        
        // Enable Physics
        scene.physics.world.enableBody(this);
        this.body.setSize(12, 5).setOffset(-5, 23);
            
        // Create player sprite/body
        // let playerArea = new Phaser.Geom.Rectangle(0, 0, 0, 0);
        // this.setInteractive(playerArea, Phaser.Geom.Rectangle.Contains);
        
        // Create healthbar
        this.barWidth = 60;
        this.castBarWidth = 100;
        this.healthBack = new Phaser.GameObjects.Rectangle(scene, 0, 40, this.barWidth, 7, 0x686868, .8);
        this.healthFront = new Phaser.GameObjects.Rectangle(scene, 0, 40, this.barWidth, 7, 0x32CD32, .8);
        this.manaBack = new Phaser.GameObjects.Rectangle(scene, 0, 47, this.barWidth, 4, 0x686868, .8);
        this.manaFront = new Phaser.GameObjects.Rectangle(scene, 0, 47, this.barWidth, 4, 0x0276FD, .8);
        this.castBack = new Phaser.GameObjects.Rectangle(scene, 0, 180, this.castBarWidth, 10, 0x686868, .8).setVisible(false);
        this.castFront = new Phaser.GameObjects.Rectangle(scene, -(this.castBarWidth/2), 180, 1, 10, 0xffff00, .8).setVisible(false);
        this.castText = new Phaser.GameObjects.Text(scene, -(this.castBarWidth/4)+5, 170, "Casting", {fontFamily: "Comic Sans MS", strokeThickness: 1, stroke: "#000000", color: "#ffffff", fontSize: 11}).setVisible(false);
   
        this.add(this.healthBack);
        this.add(this.healthFront);
        this.add(this.manaBack);
        this.add(this.manaFront);
        this.add(this.castBack);
        this.add(this.castFront);
        this.add(this.castText);
        
        // Set properties
        this.spellMap = new Map([[CST.SPELLS.FIREBALL1, new Fireball(this.scene, this)],
                                [CST.SPELLS.BLINK1, new Blink(this.scene, this)]])
        this.maxHealth = 20;
        this.curHealth = 20;
        this.maxMana = 20;
        this.curMana = 20;
        this.target = undefined;
        this.isLongCasting = false;
        this.isCasting = false;
        this.direction = "up";

        this.createSpellCallbacks();
        this.createAnimations();
        this.createInterruptCallback();
    }
    
    cast(spell) {
        
        //Start castbar tween
        this.castBack.setVisible(true);
        this.castFront.setVisible(true);
        this.castText.setVisible(true);
        this.scene.tweens.add({targets: this.castFront, delay: 0, duration: spell.castTime, displayWidth: {from:0, to: this.castBarWidth}, x: {from: -(this.castBarWidth/2), to: 0}, callbackScope: this, onComplete: ()=>{
            spell.endCast();
            this.castBack.setVisible(false);
            this.castFront.setVisible(false);    
            this.castText.setVisible(false);
        },
        onUpdate: (tw)=> {
            if (!this.isLongCasting) {
                tw.callbacks.onComplete.func = ()=>{};
                this.castBack.setVisible(false);
                this.castFront.setVisible(false);  
                this.castText.setVisible(false);
            }
        }
        });
    }

    canMove() {
        if (this.isLongCasting || this.isRooted) return false;
        else return true;
    }

    spendMana(manaCost) {
        if (this.curMana - manaCost >= 0) {
            this.curMana -= manaCost;
            this.manaFront.width = this.curMana/this.maxMana * this.barWidth;
            return true;
        } else {
            this.notEnoughManaAlert();
            return false;
        }
    }

    updateMana() {
        this.curMana = Math.min(this.curMana + 0.01, this.maxMana)
        this.manaFront.width = this.curMana/this.maxMana * this.barWidth;
    }

    remTarget(target) {
        if (this.target === target) {
            if (this.isLongCasting) {
                this.targetDiedAlert()
                this.isLongCasting = false;
            }
            this.target = undefined;
        }
    }

    setTarget(target) {
        if (this.target) this.target.remTargeted();
        this.target = target;
        if (this.target) this.target.setTargeted();
    }

    createSpellCallbacks() {
        this.spellMap.forEach((value, spell)=>{
            this.scene.input.keyboard.on("keydown-"+value.key, ()=>{
                this.spellMap.get(spell).cast(this.target);
            });
        });
    }

    createInterruptCallback() {
        this.scene.input.keyboard.on("keydown-SPACE", ()=> {
            console.log('here')
            this.isLongCasting = false;
        });
    }

    targetDiedAlert() {
        let targetDiedAlert = new Phaser.GameObjects.Text(this.scene, -55, 60, "Target is dead", {fontFamily: "Comic Sans MS", strokeThickness: 2, stroke: "#000000", color: "#ff0000", fontSize: 15});
        this.add(targetDiedAlert);
        this.scene.tweens.add({targets: targetDiedAlert, delay: 0, duration: 1500, alpha: 0, y: 80});
    }

    noTargetAlert() {
        let noTargetAlert = new Phaser.GameObjects.Text(this.scene, -35, 60, "No target", {fontFamily: "Comic Sans MS", strokeThickness: 2, stroke: "#000000", color: "#ff0000", fontSize: 15});
        this.add(noTargetAlert);
        this.scene.tweens.add({targets: noTargetAlert, delay: 0, duration: 1500, alpha: 0, y: 80});
    }

    notEnoughManaAlert() {
        let notEnoughManaAlert = new Phaser.GameObjects.Text(this.scene, -60, 60, "Not enough mana", {fontFamily: "Comic Sans MS", strokeThickness: 2, stroke: "#000000", color: "#ff0000", fontSize: 15}); 
        this.add(notEnoughManaAlert);
        this.scene.tweens.add({ targets: notEnoughManaAlert, delay: 0, duration: 1500, alpha: 0, y: 80});
    }

    createAnimations() {
        let castFramerate = 10;
        this.scene.anims.create({
            key: CST.ANIMS.LONGCASTSTART1_UP,
            framerate: castFramerate,
            frames: this.scene.anims.generateFrameNames(CST.SPRITES.ELF2, {start: 0, end: 2})
        });
        this.scene.anims.create({
            key: CST.ANIMS.LONGCASTSTART1_DOWN,
            framerate: castFramerate,
            frames: this.scene.anims.generateFrameNames(CST.SPRITES.ELF2, {start: 14, end: 16})
        });
        this.scene.anims.create({
            key: CST.ANIMS.LONGCASTSTART1_LEFT,
            framerate: castFramerate,
            frames: this.scene.anims.generateFrameNames(CST.SPRITES.ELF2, {start: 7, end: 9})
        });
        this.scene.anims.create({
            key: CST.ANIMS.LONGCASTSTART1_RIGHT,
            framerate: castFramerate,
            frames: this.scene.anims.generateFrameNames(CST.SPRITES.ELF2, {start: 21, end: 23})
        });
        this.scene.anims.create({
            key: CST.ANIMS.LONGCASTEND1_UP,
            framerate: castFramerate,
            frames: this.scene.anims.generateFrameNames(CST.SPRITES.ELF2, {start: 3, end: 6})
        });
        this.scene.anims.create({
            key: CST.ANIMS.LONGCASTEND1_DOWN,
            framerate: castFramerate,
            frames: this.scene.anims.generateFrameNames(CST.SPRITES.ELF2, {start: 17, end: 20})
        });
        this.scene.anims.create({
            key: CST.ANIMS.LONGCASTEND1_LEFT,
            framerate: castFramerate,
            frames: this.scene.anims.generateFrameNames(CST.SPRITES.ELF2, {start: 10, end: 13})
        });
        this.scene.anims.create({
            key: CST.ANIMS.LONGCASTEND1_RIGHT,
            framerate: castFramerate,
            frames: this.scene.anims.generateFrameNames(CST.SPRITES.ELF2, {start: 24, end: 27}),
        });

        // Animation Callbacks
        this.scene.anims.anims.get(CST.ANIMS.LONGCASTEND1_UP).on("complete", ()=> {
            this.playerSpriteTop.setTexture(CST.SPRITES.ELF1);
            this.playerSpriteBot.setTexture(CST.SPRITES.ELF1);
            this.playerSpriteTop.setFrame(0);
            this.playerSpriteBot.setFrame(9);
            this.isLongCasting = false;
        });
        this.scene.anims.anims.get(CST.ANIMS.LONGCASTEND1_DOWN).on("complete", ()=> {
            this.playerSpriteTop.setTexture(CST.SPRITES.ELF1);
            this.playerSpriteBot.setTexture(CST.SPRITES.ELF1);
            this.playerSpriteTop.setFrame(62);
            this.playerSpriteBot.setFrame(54);
            this.isLongCasting = false;
        });
        this.scene.anims.anims.get(CST.ANIMS.LONGCASTEND1_LEFT).on("complete", ()=> {
            this.playerSpriteTop.setTexture(CST.SPRITES.ELF1);
            this.playerSpriteBot.setTexture(CST.SPRITES.ELF1);
            this.playerSpriteTop.setFrame(26);
            this.playerSpriteBot.setFrame(17);
            this.isLongCasting = false;
        });
        this.scene.anims.anims.get(CST.ANIMS.LONGCASTEND1_RIGHT).on("complete", ()=> {
            this.playerSpriteTop.setTexture(CST.SPRITES.ELF1);
            this.playerSpriteBot.setTexture(CST.SPRITES.ELF1);
            this.playerSpriteTop.setFrame(44);
            this.playerSpriteBot.setFrame(35);
            this.isLongCasting = false;
        });
    }
}