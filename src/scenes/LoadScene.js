import { CST } from "../CST.js"

export class LoadScene extends Phaser.Scene{
    constructor(){
        super({
            key: CST.SCENES.LOAD
        })
    }
    init() {
    }

    loadImages() {
        this.load.setPath("../../assets/load");
        for (const proc in CST.IMAGES) {
            this.load.image(CST.IMAGES[proc], CST.IMAGES[proc]);
        }
    }

    preload() {
        //load assets
        this.loadImages();
        this.load.audio("title_music", ["../../assets/audio/shuinvy-childhood.ogg",
                        "../../assets/audio/shuinvy-childhood.m4a",
                        "../../assets/audio/shuinvy-childhood.mp3"]);

        //create loading bar
        let loadingBar = this.make.graphics({
            fillStyle: {
                color: 0xffffff, //white
            }
        }, true)

        //simulate heavy loading
        for(let i = 0; i < 10; i++){
            this.load.spritesheet("sprits" + i, "../../assets/sprites/maleorcfullsheet.png", {
                frameHeight: 32,
                frameWidth: 32
            });
        }

        this.load.on("progress", (percent)=>{
            loadingBar.fillRect(0, this.plugins.game.renderer.height/2 - 10, this.plugins.game.renderer.width*percent, 40);
        });

        this.load.on("complete", ()=>{
            this.scene.start(CST.SCENES.MENU, "hello from load scene");
        });
    }
}