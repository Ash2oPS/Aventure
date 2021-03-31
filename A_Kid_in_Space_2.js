////////// CONFIG //////////

const screenWidth = 1920;
const screenHeight = 1080;

const config = {
    width: screenWidth,
    height: screenHeight,
    type: Phaser.AUTO,
    physics:{
        default: 'arcade',
        arcade:{
            //gravity: {},
            debug: false
        }
    },
    input : {gamepad:true},
    scene: {
        preload: preload,
        create: create,
        update: update},
        scale: {
        zoom:1,
    }
}

////////// VARIABLES //////////

var game = new Phaser.Game(config);

// -- Acteurs Vivants --

var maya



////////// PRELOAD //////////

function preload(){

    // -- Acteurs Vivants --

    this.load.spritesheet('maya', 'assets/maya/MayaBase1.png', {frameWidth : 128, frameHeight:128});

}

////////// CREATE //////////

function create(){

    // -- Acteurs Vivants --

    maya = this.physics.create(400, 400, 'maya');


}

////////// UPDATE //////////

function update(){



}
