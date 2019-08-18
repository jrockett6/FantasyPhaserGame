/** @type {import("../typings/phaser")} */

// console.log('helloo');

import { LoadScene } from "./scenes/LoadScene.js";
import { MenuScene } from "./scenes/MenuScene.js";
import { PlayScene } from "./scenes/PlayScene.js";

let game = new Phaser.Game({
    // type: Phaser.CANVAS,
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    audio: {
        disableWebAudio: true
    },
    scene: [
        LoadScene, MenuScene, PlayScene
    ],
    render: {
        pixelArt: true
    },
    physics: {
        default: "arcade",
        arcade: {
            debug: true
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
});