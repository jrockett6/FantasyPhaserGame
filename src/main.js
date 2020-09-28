/** @type {import("../typings/phaser")} */

// console.log('helloo');

import { LoadScene } from "./scenes/LoadScene.js";
import { MenuScene } from "./scenes/MenuScene.js";
import { PlayScene } from "./scenes/PlayScene.js";
import { UIScene } from "./scenes/UIScene.js";

let game = new Phaser.Game({
    // type: Phaser.CANVAS,
    // type: Phaser.WEBGL,
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    disableContextMenu: true,
    audio: {
        disableWebAudio: true
    },
    scene: [
        LoadScene, MenuScene, PlayScene, UIScene
    ],
    render: {
        // roundPixels: true,
        // antialias: true
        pixelArt: true
    },
    physics: {
        default: "arcade",
        arcade: {
            debug: false
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
});