/** @type {import("../typings/phaser")} */

import { CST } from "../CST.js";
import { CharacterSprite } from "../sprites/CharacterSprite.js";
import { SpellSprite } from "../sprites/SpellSprite.js";
import { EnemySprite } from "../sprites/EnemySprite.js";

export class PlayScene extends Phaser.Scene{
    constructor(){
        super({
            key: CST.SCENES.PLAY
        })
    }

    init(data){
        this.game_state = {}
        console.log("hi");
        console.log(data);
    }

    preload(){
        this.load.spritesheet("elf","../../assets/sprites/elflpc.png", {frameWidth: 64, frameHeight: 64});
        this.load.spritesheet("mage","../../assets/sprites/mage.png", {frameWidth: 64, frameHeight: 64});
        this.load.spritesheet("bat", "../../assets/sprites/bat_sheet.png", {frameWidth: 32, frameHeight: 32});
        this.load.spritesheet("sabre", "../../assets/sprites/sabre_sheet.png", {frameWidth: 128, frameHeight: 128});
        this.load.spritesheet("ice_shield", "../../assets/sprites/iceshield.png", {frameWidth: 128, frameHeight: 128});
        this.load.spritesheet("plants", "../../assets/world/plant_repack.png", {frameWidth: 32, frameHeight: 32});
        this.load.image("terrain", "../../assets/world/terrain_extruded.png");
        // this.load.image("plants", "../../assets/world/plant_repack.png");
        this.load.tilemapTiledJSON("map1", "../../assets/maps/first_map.json");
    }
    
    create(){
        // Create player container, enable physics, set collision zone
        let playerArea = new Phaser.Geom.Rectangle(0, 0, 0, 0);
        this.playerSpriteTop = new CharacterSprite(this, 0, 0, "elf", 0);
        this.playerSpriteBot = new CharacterSprite(this, 0, 0, "elf", 9);
        // this.playerSprite = new CharacterSprite(this, 0, 0, "elf", 8);
        this.iceShield = new SpellSprite(this, 5, 5, "ice_shield", 0).setVisible(false).setScale(.95, .95);
        this.player = this.add.container(250, 200, [this.playerSpriteTop, this.playerSpriteBot, this.iceShield]);
        this.player.setInteractive(playerArea, Phaser.Geom.Rectangle.Contains);
        this.physics.world.enableBody(this.player);
        this.player.body.setSize(12, 5).setOffset(-5, 23);
        this.playerSpriteTop.setScale(.95, .95);
        this.playerSpriteBot.setScale(.95, .95);
        
        // Create enemy sprite
        this.enemyBat = new EnemySprite(this, 400, 200, "bat", 3);
        this.enemyBat.body.setSize(12, 12).setOffset(10, 10);
        this.physics.add.collider(this.player, this.enemyBat);
        
        // Create keys for input
        this.keyboard = this.input.keyboard.addKeys("W,A,S,D,F");
        
        // Create tilemap
        this.map = this.add.tilemap("map1");
        
        // Add a tileset image to the map
        let terrain = this.map.addTilesetImage("terrain", "terrain");
        
        // Create a layer to render
        let bot_layer = this.map.createStaticLayer("bot", terrain, 0, 0).setDepth(-1);
        
        //Keyboard events
        this.input.keyboard.on("keydown", (event)=>{
            switch (event.code) {
                case "KeyE":
                    this.iceShield.anims.play("ice_shield_deploy", true);
                    break;
                case "KeyR":
                    this.iceShield.anims.play("ice_shield_expire", true);
                    break;
                case "KeyT":
                    this.playerSpriteTop.anims.play("elf_top_slash_up", true);
                    break;
                // case "KeyW":
                //     this.playerSpriteTop.anims.play("elf_top_walk_up", true);
                //     break;
            }
        });
                
        // Create methods
        this.createAnims();
        this.createStaticObjects();
                
        // Camera
        this.cameras.main.startFollow(this.player);

        // Set world bounds
        this.player.body.setCollideWorldBounds(true);
        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

        // this.playerSpriteTop.anims.play("elf_bot_walk_up", true);
        // this.playerSpriteBot.anims.play("elf_top_walk_up", true);

        // Set world bounds
        // this.player.body.onWorldBounds = true;
        // this.physics.world.setBoundsCollision();
        // this.physics.world.on("worldbounds", ()=>{
            // console.log("world collide!");
        // })

        //Set animation and input callbacks
        // debugger;
        
        // this.input.keyboard.on("keydown", (event)=>{
        //     switch (event.code) {
        //         case "KeyW":
        //             this.goblin.anims.play("up", true);
        //             this.goblin.setVelocityY(-64);
        //             this.lastKey = event.code;
        //             break;
        //         case "KeyS":
        //             this.goblin.anims.play("down", true);
        //             this.goblin.setVelocityY(64);
        //             this.lastKey = event.code;
        //             break;
        //         case "KeyD":
        //             this.goblin.anims.play("right", true);
        //             this.goblin.setVelocityX(64);
        //             this.lastKey = event.code;
        //             break;
        //         case "KeyA":
        //             this.goblin.anims.play("left", true);
        //             this.goblin.setVelocityX(-64);
        //             this.lastKey = event.code;
        //             break;        
        //         }
        // }, this);

        // this.input.keyboard.on("keyup", (event)=>{
        //     switch (this.lastKey) {
        //         case "KeyW":
        //             this.goblin.setFrame(8*13);
        //             this.goblin.setVelocityY(0);
        //             break;
        //         case "KeyS":
        //             this.goblin.setFrame(10*13);
        //             this.goblin.setVelocityY(0);
        //             break;
        //         case "KeyD":
        //             this.goblin.setFrame(11*13);
        //             this.goblin.setVelocityX(0);
        //             break;
        //         case "KeyA":
        //             this.goblin.setFrame(9*13);
        //             this.goblin.setVelocityX(0);
        //             break;
        //     }
        // }, this);


        // this.keyboard.W.onUp(()=>{
        //     this.goblin.anims.pause();
        // })
        // this.keyboard.D.onDown(()=> {
        //     console.log('hi');
        // })
        
        // this.input.keyboard.on("keydown_D", ()=>{
        //     this.goblin.anims.play("right", true);
        // });
        // this.input.keyboard.on("keydown_W", ()=>{
        //     this.goblin.anims.play("up", true);
        // });


        // this.input.keyboard.on("keydown_D", ()=>{
        //     this.goblin.play("right", true);
        // });
        // debugger;
        // this.input.keyboard.on("keyup_D", ()=>{
        //     // console.log("hello from D!");
        //     this.goblin.anims.pause(this.goblin.anims.currentAnim.frames[0]);
        // });


        //
        

        // this.keyboard.D.onUp(()=>{
        //     this.goblin.anims.pause(this.goblin.anims.currentAnim.frames[0]);
        // })


        // let plant1 = new ObjectSprite(this, map1, "obj_layer", 7, "plants", 13*4+2);
        // let plant2 = new ObjectSprite(this, map1, "obj_layer", 8, "plants", 13*5+2);
        // let plant1 = this.physics.add.existing(map1.createFromObjects("obj_layer", 7, {key: "plants", frame: 13*4+2}));
        // let plant2 = this.physics.add.existing(map1.createFromObjects("obj_layer", 8, {key: "plants", frame: 13*5+2}));
        // debugger;

        // let ellipse1 = new CollisionSprite(this, this.map, "obj_layer", 31);
        // ellipse1.body.setCircle(7, -7, 4);
        // plant1.setDepth(ellipse1.body.center.y + ellipse1.body.halfHeight);
        // plant2.setDepth(ellipse1.body.center.y + ellipse1.body.halfHeight);
        // console.log(ellipse1);

        // let top_layer = map1.createStaticLayer("obj_layer", plants, 0, 0);
        
        // //map collisions
        // top_layer.setCollisionByProperty( {collides:true})
        // this.physics.add.collider(this.goblin, top_layer, ()=> {
        //     console.log("plant collision");
        // });

        // console.log(this.goblin);
        // console.log(top_layer.depth);
        
        // // this.impact.world.setCollisionMapFromTilemapLayer(top_layer);
        // top_layer.setCollisionFromCollisionGroup();
        // let collision_group = terrain.getTileCollisionGroup()
        // this.physics.add.collider(this.goblin, top_layer, ()=>{
        //     console.log("tree collision");
        // });




        // Debug
        // bot_layer.renderDebug(this.add.graphics());
        // console.log(top_layer);
        // console.log(this.physics);
        // let shape_graphics = this.add.graphics();
        // drawCollisionShapes(shape_graphics, top_layer);
        // top_layer.setCollision([1083, 1084, 1085, 1096, 1097, 1098]);
        // top_layer.setCollisionByProperty({types:collides});
        // top_layer.setCollisionByProperty({collides: true});
        // console.log(top_layer);
    }
    
    update(){ 
        // Set depth of player
        let playerBounds = {}
        this.player.body.getBounds(playerBounds);
        this.player.depth = playerBounds.y;
        // debugger;
        // this.physics.moveTo(this.enemyBat, this.player.x, this.player.y, 64);
        // if (this.enemyBat.body.touching.none) {
            // console.log("setting moveto");
        // }
        // else {
            // console.log("setting vel");
            // this.enemyBat.body.velocity.setTo(0, 0);
        // }

        // this.enemyBat.body.velocity.setTo(0);

        // Previous vel: 64
        // Y Movement
        if (this.keyboard.W.isDown) {
            if (this.keyboard.S.isDown) this.player.body.setVelocityY(0);
            else {
                this.player.body.setVelocityY(-200);
                this.lastKey = "W";
            }
        }
        else if (this.keyboard.S.isDown) {
            this.player.body.setVelocityY(200);
            this.lastKey = "S";
        }
        else if (this.keyboard.W.isUp && this.keyboard.S.isUp) {
            this.player.body.setVelocityY(0);
        }

        // X Movement
        if (this.keyboard.A.isDown) {
            if (this.keyboard.D.isDown) this.player.body.setVelocityX(0);
            else {
                this.player.body.setVelocityX(-200);
                this.lastKey = "A";
            }
        } else if (this.keyboard.D.isDown) {
            this.player.body.setVelocityX(200);
            this.lastKey = "D";
        } else if (this.keyboard.A.isUp && this.keyboard.D.isUp) this.player.body.setVelocityX(0);
        
        // Animations
        if (this.keyboard.D.isDown) {
            if (this.keyboard.A.isDown) {
                switch (this.lastKey) {
                    case "A": this.playerSpriteTop.setFrame(9*13); break;
                    case "D": this.playerSpriteTop.setFrame(11*13); break;
                }
            } else this.playerSpriteTop.play('right', true);
        }
        else if (this.keyboard.A.isDown) {
            this.playerSpriteTop.play('left', true);
        }
        else if (this.keyboard.S.isDown) {
            if (this.keyboard.W.isDown) {
                switch (this.lastKey) {
                    case "W": this.playerSpriteTop.setFrame(8*13); break;
                    case "S": this.playerSpriteTop.setFrame(10*13); break;
                }
            }
            this.playerSpriteTop.play('left'w, true);
        }
        else if (this.keyboard.W.isDown) {
            if (!this.playerSpriteTop.anims.isPlaying) this.playerSpriteTop.play("elf_top_walk_up", true);
            this.playerSpriteBot.play("elf_bot_walk_up", true);
        }
        else {
            switch (this.lastKey) {
                // case "W": this.playerSpriteTop.setFrame(8*13); break;
                case "S": this.playerSpriteTop.setFrame(10*13); break;
                case "A": this.playerSpriteTop.setFrame(9*13); break;
                case "D": this.playerSpriteTop.setFrame(11*13); break;
            }
        }
    }

    createStaticObjects() {
        /**
         * Loop through json objects to create static objects.
         * This method loops through objects once to find collision 
         * objects, and create a map of all gid's to make. Then it 
         * loops through the gid map to create the objects and set 
         * the depth according to their collision object.
         * 
         * TODO: 
         * Create array of collideable objects, and add a single collider to the array
         */
        let depthArr = []; //Map collision object id's to their y value
        let gidMap = new Map(); //Map gid's to object id arrays
        let firstGid = this.map.tilesets[1].firstgid;

        // Loop through all objects, create collsion objects and save gid map
        this.map.objects[0].objects.forEach(item=>{
            if (item.properties && item.rectangle) { // Collision object
                let tmpSprite = this.physics.add.sprite(item.x, item.y, "__DEFAULT");
                tmpSprite.setImmovable(true)
                tmpSprite.setSize(13, 7).setOffset(10, 14); //Size/Offset for tree collider
                this.physics.add.collider(this.player, tmpSprite);
                // this.physics.add.collider(this.enemyBat, tmpSprite, ()=>{
                    // // console.log(this.enemyBat.body.velocity);
                    // if (this.enemyBat.body.touching.down) {
                    //     console.log(this.enemyBat.body.velocity.y);
                    //     if (this.enemyBat.body.velocity.x < 0) this.enemyBat.setVelocityX(-10);
                    //     else this.enemyBat.setVelocityX(10);
                    //     // this.enemyBat.setVelocityX(0);
                    // }
                    // // var angle = Math.atan2(y - gameObject.y, x - gameObject.x)
                    // // } else if (this.enemyBat.body.touching.up) {
                    // //     if (this.enemyBat.body.velocity.x < 0) this.enemyBat.body.position.x -= 2;
                    // //     else this.enemyBat.body.position.x += 2;
                    // //     this.enemyBat.setVelocityX(0);
                    // // }
                    // // if (this.enemyBat.body.touching.left) {
                    // //     this.enemyBat.body.position.y += 2;
                    // //     this.enemyBat.setVelocityY(0);
                    // // }


                    //     // if (this.enemyBat.body.velocity.x < 0) this.enemyBat.body.position.x -= 1;

                    //     // if (this.enemyBat.body.velocity.x >= 0) this.enemyBat.body.position.x += 1;
                    // if (this.enemyBat.body.touching.right) console.log("right")
                    // if (this.enemyBat.body.touching.none) console.log("none")
                    // if (this.enemyBat.body.touching.down) console.log("down")
                    // if (this.enemyBat.body.touching.left) console.log("left")
                    // if (this.enemyBat.body.touching.up) console.log("up")
                    // this.enemyBat.body.position.x += 2;
                    // this.enemyBat.body.position.y += 2;
                // });
                depthArr[item.properties[0].value] = item.y;
            } else if (item.properties && item.gid) { // Static object for gid map
                if (gidMap.get(item.gid)) gidMap.get(item.gid).push(item.properties[0].value);
                else gidMap.set(item.gid, [item.properties[0].value]);
            }
        });
        
        // Loop through gid map, create the static objects, then set the depth for each one in the object array
        gidMap.forEach((value, key)=>{
            let spriteArr = this.map.createFromObjects("obj_layer", key, {key: "plants", frame: key - firstGid});
            spriteArr.forEach((item, index)=>{
                item.setDepth(depthArr[value[index]]);
            });
        });
    }

    createAnims() {
        /**
         * Create animations for scene
         */
        this.anims.create({
            key: "elf_top_slash_up",
            frameRate: 15,
            frames: this.anims.generateFrameNames("elf", {start: 7*9+5, end: 8*9})
        });
        this.anims.create({
            key: "elf_top_walk_up",
            frameRate: 15,
            frames: this.anims.generateFrameNames("elf", {start: 0, end: 7}),
        });
        this.anims.create({
            key: "elf_bot_walk_up",
            frameRate: 15,
            frames: this.anims.generateFrameNames("elf", {start: 9, end: 16}),
            showOnStart: true,
            hideOnComplete: true
        });
        this.anims.create({
            key: "left",
            frameRate: 30,
            frames: this.anims.generateFrameNames("mage", {start: 9*13+1, end: 9*13+8})
        });
        this.anims.create({
            key: "right",
            frameRate: 30,
            frames: this.anims.generateFrameNames("mage", {start: 11*13+1, end: 11*13+8})
        });
        this.anims.create({
            key: "up",
            frameRate: 30,
            frames: this.anims.generateFrameNames("mage", {start: 8*13, end: 8*13+8})
        });
        this.anims.create({
            key: "down",
            frameRate: 30,
            frames: this.anims.generateFrameNames("mage", {start: 10*13, end: 10*13+8})
        });
        this.anims.create({
            key: "sabre_left",
            frameRate: 5,
            frames: this.anims.generateFrameNames("sabre", {start: 6, end: 11}),
            showOnStart: true,
            hideOnComplete: true
        });
        this.anims.create({
            key: "player_attack_left",
            frameRate: 5,
            frames: this.anims.generateFrameNames("mage", {start: 13*13, end: 13*13+6})
        });
        this.anims.create({
            key: "ice_shield_deploy",
            frameRate: 15,
            frames: this.anims.generateFrameNames("ice_shield", {start: 0, end: 11}),
            showOnStart: true
        });
        this.anims.create({
            key: "ice_shield_expire",
            frameRate: 15,
            frames: this.anims.generateFrameNames("ice_shield", {start: 12, end: 15}),
            showOnStart: true,
            hideOnComplete: true
        })
    }
}



