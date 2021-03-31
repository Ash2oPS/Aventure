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
var maya2



////////// PRELOAD //////////

function preload(){

    // -- Acteurs Vivants --

    this.load.spritesheet('maya', 'assets/maya/MayaBase1.png', {frameWidth : 64, frameHeight : 64});
    this.load.spritesheet('maya2', 'assets/maya/MayaBase2.png', {frameWidth : 128, frameHeight : 128});

}

////////// CREATE //////////

function create(){

    // -- Acteurs Vivants --

    maya = this.physics.add.sprite(400, 400, 'maya');
    maya2 = this.physics.add.sprite(600, 600, 'maya2');


}

////////// UPDATE //////////

function update(){



}
