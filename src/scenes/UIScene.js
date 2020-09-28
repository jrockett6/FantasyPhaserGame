import { CST } from "../CST.js";
import { SpellIcon } from "../sprites/uiSprites/SpellIcon.js"

export class UIScene extends Phaser.Scene{
    constructor(){
        super({
            key: CST.SCENES.UI,
        })
    }

    init(playerSpellMap) {
        this.playerSpellMap = playerSpellMap;
    }

    preload() {
        this.load.setPath("../../assets/sprites/icons");
        for (const key in CST.ICONS) {
            this.load.image(CST.ICONS[key], CST.ICONS[key]);
            // if (CST.ICONS[key] !== CST.ICONS.FRAME_1_GREY) this.iconList.push(CST.ICONS[key]);
        }
    }
    
    create() {
        this.createAbilityUI();
    }

    update() { }

    createAbilityUI() {
        let iconDim = 40;
        let iconLocs = [];
        for (let i = 0; i < CST.MISC.MAX_SPELLS; i++) {
            iconLocs[i] = {x: 275+iconDim*i, y: 570};
            this.add.image(275+iconDim*i, 570, CST.ICONS.FRAME_1_GREY).setDisplaySize(iconDim, iconDim).setDepth(1);
        }
        this.playerSpellMap.forEach((value)=>{
            this.add.image(iconLocs[value.iconLoc].x, iconLocs[value.iconLoc].y, value.iconTex).setDisplaySize(iconDim, iconDim);
            this.add.text(iconLocs[value.iconLoc].x+7, iconLocs[value.iconLoc].y-22, value.keyDisplay, {color: "#ffffff", fontSize: "13px", stroke: "#000000", strokeThickness: 1});
        });
    }


    
    
}
