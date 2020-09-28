import { CST } from "../CST.js"

export class MenuScene extends Phaser.Scene{
    constructor(){
        super({
            key: CST.SCENES.MENU
        })
    }

    init(data){
    }
    
    create(){
        this.add.image(0, 0, CST.IMAGES.TITLE_BG).setOrigin(0, 0);
        this.add.image(this.plugins.game.renderer.width /2, this.plugins.game.renderer.height * 0.2, CST.IMAGES.LOGO).setDepth(1);
        let playButton = this.add.image(this.plugins.game.renderer.width /2, this.plugins.game.renderer.height * 0.5, CST.IMAGES.PLAYBUTT).setDepth(1);
        let options_button = this.add.image(this.plugins.game.renderer.width /2, this.plugins.game.renderer.height * 0.4, CST.IMAGES.OPTBUTT).setDepth(1);

        this.input.setGlobalTopOnly(false);

        //Configure buttons
        playButton.setInteractive();

        playButton.on("pointerover", ()=>{
            console.log("heyo");
        })

        playButton.on("pointerdown", ()=>{
            this.scene.start(CST.SCENES.PLAY);
        })

        //sound!
        // this.sound.play("title_music", {
        //     loop: true
        // })

    }
}