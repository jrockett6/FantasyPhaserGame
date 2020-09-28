/** @type {import("../typings/phaser")} */

import { CST } from "../CST.js";
import { Player } from "../sprites/Player.js";
import { EnemyBat } from "../sprites/enemySprites/EnemyBat.js";
import { SpellIcon } from "../sprites/uiSprites/SpellIcon.js";

export class PlayScene extends Phaser.Scene{
    constructor(){
        super({
            key: CST.SCENES.PLAY
        })
    }

    preload(){
        this.load.spritesheet(CST.SPRITES.ELF1, "../../assets/sprites/"+CST.SPRITES.ELF1, {frameWidth: 64, frameHeight: 64});
        this.load.spritesheet(CST.SPRITES.ELF2, "../../assets/sprites/"+CST.SPRITES.ELF2, {frameWidth: 64, frameHeight: 64});
        this.load.spritesheet("bat", "../../assets/sprites/bat_sheet.png", {frameWidth: 32, frameHeight: 32});

        this.load.spritesheet("ice_shield", "../../assets/sprites/spells/iceshield.png", {frameWidth: 128, frameHeight: 128});
        this.load.spritesheet("torrentacle", "../../assets/sprites/spells/torrentacle.png", {frameWidth: 128, frameHeight: 128});
        this.load.spritesheet("electric_ball", "../../assets/sprites/spells/electric_ball.png", {frameWidth: 128, frameHeight: 128});

        this.load.spritesheet(CST.SPELLS.FIREBALL1, "../../assets/sprites/spells/"+CST.SPELLS.FIREBALL1, {frameWidth: 100, frameHeight: 100});
        this.load.spritesheet(CST.SPELLS.BLINK1, "../../assets/sprites/spells/"+CST.SPELLS.BLINK1, {frameWidth: 128, frameHeight: 128});

        this.load.spritesheet("tstSprite", "../../assets/sprites/tstSprite.png", {frameWidth: 64, frameHeight: 64});

        this.load.spritesheet("plants", "../../assets/world/plant_repack.png", {frameWidth: 32, frameHeight: 32});
        this.load.image("terrain", "../../assets/world/terrain_extruded.png");
        this.load.tilemapTiledJSON("map1", "../../assets/maps/first_map.json");
    }
    
    create(){
        // Initialize empty maps for AI
        this.moveToMap = new Map();
        this.accToMap = new Map();
        this.collisionMap = new Map();

        
        // Create keys/player/run UI
        this.keyboard = this.input.keyboard.addKeys("W,A,S,D");
        this.player = new Player(this, 250, 200);
        this.scene.run(CST.SCENES.UI, this.player.spellMap);
        
        // Create tilemap and tile layer
        this.map = this.add.tilemap("map1");
        let terrain = this.map.addTilesetImage("terrain", "terrain");
        let bot_layer = this.map.createStaticLayer("bot", terrain, 0, 0).setDepth(-1);
        
        // Pointer Events
        this.input.on("pointerdown", (pointer, gameObject)=>{
            this.player.setTarget(gameObject.length > 0 ? gameObject[0] : undefined);
        });
        
        this.input.keyboard.on("keydown-NINE", ()=>{
            new EnemyBat(this, 400, 400);
        });

        // Create methods
        this.createAnims();
        this.createStaticObjects();

        // Animation Complete Callbacks
        this.anims.anims.get("elf_top_slash_up").on("complete", ()=> {
            this.player.playerSpriteTop.setFrame(0);
        });
        this.anims.anims.get("elf_top_slash_down").on("complete", ()=> {
            this.player.playerSpriteTop.setFrame(62);
        });
        this.anims.anims.get("elf_top_slash_right").on("complete", ()=> {
            this.player.playerSpriteTop.setFrame(44);
        });
        this.anims.anims.get("elf_top_slash_left").on("complete", ()=> {
            this.player.playerSpriteTop.setFrame(26);
        });
                
        // Camera
        this.cameras.main.startFollow(this.player, false);

        // Set world bounds
        this.player.body.setCollideWorldBounds(true);
        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    }
    

    update(){ 
        // Set depth of player
        let playerBounds = {}
        this.player.body.getBounds(playerBounds);
        this.player.depth = playerBounds.y;

        // console.log(this.player.depth);

        this.player.updateMana();

        // console.log(this.input.mousePointer.worldX);
        // console.log(this.input.mousePointer.worldY);

        // if (this.player.target) console.log(Phaser.Math.Angle.Between(this.player.x, this.player.y, this.player.target.x, this.player.target.y));

        // Iterate through spells/enemies that move
        this.accToMap.forEach( (objArr)=>{
            objArr[0].setDepth(objArr[0].y+25);
            this.physics.accelerateToObject(objArr[0], objArr[1]);
        });
        
        this.moveToMap.forEach( (objArr)=>{
            // objArr[0].setDepth(objArr[0].y+objArr[0].depthModifier);
            objArr[0].depthModifier? objArr[0].setDepth(objArr[0].y+objArr[0].depthModifier) : objArr[0].setDepth(objArr[0].y);
            if (objArr[0].isRooted) {
                objArr[0].body.setVelocity(0, 0);
                // objArr[0].setVelocity(0, 0);
            } else this.physics.moveToObject(objArr[0], objArr[1], objArr[0].speed);
        });
        
        if (this.player.canMove()) {
            this.updateVelocity();
            this.updateAnims();
        } 
    }

    updateVelocity() {
        let playerVelocity = 2;
        let xSet = false;

        // Y Movement
        if (this.keyboard.W.isDown) {
            if (this.keyboard.A.isDown ? this.keyboard.D.isUp : this.keyboard.D.isDown) {
                if (this.keyboard.S.isDown) {
                    if (this.keyboard.A.isDown) {
                        this.player.body.position.x -= playerVelocity;
                        if (this.physics.overlap(this.player, this.collisionArr)) this.player.body.position.x += playerVelocity;
                        this.lastKey = "A";
                        xSet = true;
                    } else {
                        this.player.body.position.x += playerVelocity;
                        if (this.physics.overlap(this.player, this.collisionArr)) this.player.body.position.x -= playerVelocity;
                        this.lastKey = "D";
                        xSet = true;
                    }
                } else {
                    this.player.body.position.y -= playerVelocity;
                    if (this.physics.overlap(this.player, this.collisionArr)) this.player.body.position.y += playerVelocity;
                    if (this.keyboard.A.isDown) {
                        this.player.body.position.x -= playerVelocity;
                        if (this.physics.overlap(this.player, this.collisionArr)) this.player.body.position.x += playerVelocity;
                        this.lastKey = "A";
                        xSet = true;
                    } else {
                        this.player.body.position.x += playerVelocity;
                        if (this.physics.overlap(this.player, this.collisionArr)) this.player.body.position.x -= playerVelocity;
                        this.lastKey = "D";
                        xSet = true;
                    }
                }
            } else if (this.keyboard.S.isUp) {
                this.player.body.position.y -= 1.4*playerVelocity;
                if (this.physics.overlap(this.player, this.collisionArr)) this.player.body.position.y += 1.4*playerVelocity;
                this.lastKey = "W";
            }
        } else if (this.keyboard.S.isDown) {
            if (this.keyboard.A.isDown ? this.keyboard.D.isUp : this.keyboard.D.isDown) {
                this.player.body.position.y += playerVelocity;
                if (this.physics.overlap(this.player, this.collisionArr)) this.player.body.position.y -= playerVelocity;
                if (this.keyboard.A.isDown) {
                    this.player.body.position.x -= playerVelocity;
                    if (this.physics.overlap(this.player, this.collisionArr)) this.player.body.position.x += playerVelocity;
                    this.lastKey = "A";
                    xSet = true;
                } else {
                    this.player.body.position.x += playerVelocity;
                    if (this.physics.overlap(this.player, this.collisionArr)) this.player.body.position.x -= playerVelocity;
                    this.lastKey = "D";
                    xSet = true;
                }
            } else if (this.keyboard.W.isUp) {
                this.player.body.position.y += 1.4*playerVelocity;
                if (this.physics.overlap(this.player, this.collisionArr)) this.player.body.position.y -= 1.4*playerVelocity;
                this.lastKey = "S";
            }
        }
        // X Movement
        if (xSet === false) {
            if (this.keyboard.A.isDown && this.keyboard.D.isUp) {
                this.player.body.position.x -= 1.4*playerVelocity;
                if (this.physics.overlap(this.player, this.collisionArr)) this.player.body.position.x += 1.4*playerVelocity;
                this.lastKey = "A";
            } else if (this.keyboard.D.isDown && this.keyboard.A.isUp) {
                this.player.body.position.x += 1.4*playerVelocity;
                if (this.physics.overlap(this.player, this.collisionArr)) this.player.body.position.x -= 1.4*playerVelocity;
                this.lastKey = "D";
            }
        }
    }

    updateAnims() {
        // Player Animations
        if (this.keyboard.D.isDown) {
            if (this.keyboard.A.isDown) {
                if (this.keyboard.W.isDown) {
                    this.playAnimationUp();
                } else if (this.keyboard.S.isDown) {
                    this.playAnimationDown();
                } else {
                    switch (this.lastKey) {
                        case "A": 
                            if (this.player.playerSpriteTop.anims.getCurrentKey() === "elf_top_walk_left") {
                                this.player.playerSpriteTop.setFrame(26);
                                this.player.playerSpriteBot.setFrame(17);
                            }
                            break;
                        case "D":
                            if (this.player.playerSpriteTop.anims.getCurrentKey() === "elf_top_walk_right") {
                                this.player.playerSpriteTop.setFrame(44);
                                this.player.playerSpriteBot.setFrame(35);
                            }
                            break;
                    }
                }
            } else {
                this.playAnimationRight();
            }
        } else if (this.keyboard.A.isDown) {
            this.playAnimationLeft();
        } else if (this.keyboard.S.isDown) {
            if (this.keyboard.W.isDown) {
                switch (this.lastKey) {
                    case "W": 
                        if (this.player.playerSpriteTop.anims.getCurrentKey() === "elf_top_walk_up") {
                            this.player.playerSpriteTop.setFrame(0);
                            this.player.playerSpriteBot.setFrame(9);
                        }
                        break;
                    case "S": 
                        if (this.player.playerSpriteTop.anims.getCurrentKey() === "elf_top_walk_down") {
                            this.player.playerSpriteTop.setFrame(62);
                            this.player.playerSpriteBot.setFrame(54);
                        }
                        break;
                }
            } else {
                this.playAnimationDown();
            }
        } else if (this.keyboard.W.isDown) {
            this.playAnimationUp();
        } else {
            switch (this.lastKey) {
                case "W": 
                    if (this.player.playerSpriteTop.anims.getCurrentKey() === "elf_top_walk_up") {
                        this.player.playerSpriteTop.setFrame(0);
                        this.player.playerSpriteBot.setFrame(9);
                    } else if (this.player.playerSpriteTop.anims.getCurrentKey() === "elf_top_slash_up") this.playerSpriteBot.setFrame(9);
                    break;
                case "S": 
                    if (this.player.playerSpriteTop.anims.getCurrentKey() === "elf_top_walk_down") {
                        this.player.playerSpriteTop.setFrame(62);
                        this.player.playerSpriteBot.setFrame(54);
                    } else if (this.player.playerSpriteTop.anims.getCurrentKey() === "elf_top_slash_down") this.playerSpriteBot.setFrame(54);
                    break;
                case "A": 
                    if (this.player.playerSpriteTop.anims.getCurrentKey() === "elf_top_walk_left") {
                        this.player.playerSpriteTop.setFrame(26);
                        this.player.playerSpriteBot.setFrame(17);
                    } else if (this.player.playerSpriteTop.anims.getCurrentKey() === "elf_top_slash_left") this.playerSpriteBot.setFrame(17);
                    break;
                case "D": 
                    if (this.player.playerSpriteTop.anims.getCurrentKey() === "elf_top_walk_right") {
                        this.player.playerSpriteTop.setFrame(44);
                        this.player.playerSpriteBot.setFrame(35);
                    } else if (this.player.playerSpriteTop.anims.getCurrentKey() === "elf_top_slash_right") this.playerSpriteBot.setFrame(35);
                    break;
            }
        }
    }

    playAnimationUp() {
        if (!this.player.playerSpriteTop.anims.isPlaying ||
            this.player.playerSpriteTop.anims.getCurrentKey() === "elf_top_walk_down" ||
            this.player.playerSpriteTop.anims.getCurrentKey() === "elf_top_walk_right" ||
            this.player.playerSpriteTop.anims.getCurrentKey() === "elf_top_walk_left") {
                this.anims.anims.get("elf_bot_walk_up").resume();
                this.player.playerSpriteTop.play("elf_top_walk_up", true);
                this.player.playerSpriteBot.play("elf_bot_walk_up", false);
                this.player.direction = "up"
            } else if (this.player.playerSpriteTop.anims.getCurrentKey() === "elf_top_slash_up") this.playerSpriteBot.play("elf_bot_walk_up", true);
    }

    playAnimationDown() {
        if (!this.player.playerSpriteTop.anims.isPlaying || 
            this.player.playerSpriteTop.anims.getCurrentKey() === "elf_top_walk_up" ||
            this.player.playerSpriteTop.anims.getCurrentKey() === "elf_top_walk_right" ||
            this.player.playerSpriteTop.anims.getCurrentKey() === "elf_top_walk_left") {
                this.player.playerSpriteTop.play("elf_top_walk_down", true);
                this.player.playerSpriteBot.play("elf_bot_walk_down", false);
                this.player.direction = "down"
            } else if (this.player.playerSpriteTop.anims.getCurrentKey() === "elf_top_slash_down") this.playerSpriteBot.play("elf_bot_walk_down", true);
    }
    
    playAnimationLeft() {
        if (!this.player.playerSpriteTop.anims.isPlaying || 
            this.player.playerSpriteTop.anims.getCurrentKey() === "elf_top_walk_right" ||
            this.player.playerSpriteTop.anims.getCurrentKey() === "elf_top_walk_up" ||
            this.player.playerSpriteTop.anims.getCurrentKey() === "elf_top_walk_down") {
                this.player.playerSpriteTop.play("elf_top_walk_left", true);
                this.player.playerSpriteBot.play("elf_bot_walk_left", false);
                this.player.direction = "left"
            } else if (this.player.playerSpriteTop.anims.getCurrentKey() === "elf_top_slash_left") this.playerSpriteBot.play("elf_bot_walk_left", true);
    }

    playAnimationRight() {
        if (!this.player.playerSpriteTop.anims.isPlaying || 
            this.player.playerSpriteTop.anims.getCurrentKey() === "elf_top_walk_left" ||
            this.player.playerSpriteTop.anims.getCurrentKey() === "elf_top_walk_up" ||
            this.player.playerSpriteTop.anims.getCurrentKey() === "elf_top_walk_down") {
                this.player.playerSpriteTop.play("elf_top_walk_right", true);
                this.player.playerSpriteBot.play("elf_bot_walk_right", false);
                this.player.direction = "right"
            } else if (this.player.playerSpriteTop.anims.getCurrentKey() === "elf_top_slash_right") this.playerSpriteBot.play("elf_bot_walk_right", true);
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
        let walkFramerate = 30;
        // Cast Animations
        this.anims.create({
            key: "elf_top_slash_up",
            frameRate: walkFramerate,
            frames: this.anims.generateFrameNames(CST.SPRITES.ELF1, {start: 94, end: 98}),
        });
        this.anims.create({
            key: "elf_top_slash_down",
            frameRate: walkFramerate,
            frames: this.anims.generateFrameNames(CST.SPRITES.ELF1, {start: 99, end: 103}),
        });
        this.anims.create({
            key: "elf_top_slash_left",
            frameRate: walkFramerate,
            frames: this.anims.generateFrameNames(CST.SPRITES.ELF1, {start: 104, end: 108}),
        });
        this.anims.create({
            key: "elf_top_slash_right",
            frameRate: walkFramerate,
            frames: this.anims.generateFrameNames(CST.SPRITES.ELF1, {start: 109, end: 113}),
        });
        

        // Walk Animations
        this.anims.create({
            key: "elf_top_walk_up",
            frameRate: walkFramerate,
            frames: this.anims.generateFrameNames(CST.SPRITES.ELF1, {start: 0, end: 7}),
        });
        this.anims.create({
            key: "elf_bot_walk_up",
            frameRate: walkFramerate,
            frames: this.anims.generateFrameNames(CST.SPRITES.ELF1, {start: 9, end: 16}),
        });

        this.anims.create({
            key: "elf_top_walk_down",
            frameRate: walkFramerate,
            frames: this.anims.generateFrameNames(CST.SPRITES.ELF1, {start: 62, end: 69}),
        });
        this.anims.create({
            key: "elf_bot_walk_down",
            frameRate: walkFramerate,
            frames: this.anims.generateFrameNames(CST.SPRITES.ELF1, {start: 53, end: 60}),
        });

        this.anims.create({
            key: "elf_top_walk_left",
            frameRate: walkFramerate,
            frames: this.anims.generateFrameNames(CST.SPRITES.ELF1, {start: 27, end: 34}),
        });
        this.anims.create({
            key: "elf_bot_walk_left",
            frameRate: walkFramerate,
            frames: this.anims.generateFrameNames(CST.SPRITES.ELF1, {start: 18, end: 25}),
        });

        this.anims.create({
            key: "elf_top_walk_right",
            frameRate: walkFramerate,
            frames: this.anims.generateFrameNames(CST.SPRITES.ELF1, {start: 45, end: 52})
        });
        this.anims.create({
            key: "elf_bot_walk_right",
            frameRate:walkFramerate,
            frames: this.anims.generateFrameNames(CST.SPRITES.ELF1, {start: 36, end: 43}),
        });

        // Misc
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
        });
        this.anims.create({
            key: "torrentacle",
            frameRate: 15,
            frames: this.anims.generateFrameNames("torrentacle", {start: 0, end: 15}),
            showOnStart: true,
            hideOnComplete: true 
        });
        this.anims.create({
            key: "electric_ball",
            frameRate: 15,
            frames: this.anims.generateFrameNames("electric_ball", {start: 0, end: 15}),
            showOnStart: true,
            repeat: -1
        });

        // Enemies
        this.anims.create({
            key: "bat_move",
            frameRate: 10,
            frames: this.anims.generateFrameNames("bat", {start: 1, end: 3}),
            yoyo: true,
            repeat: -1
        })

    }
}
