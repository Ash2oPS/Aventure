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

// -- Config --

var game = new Phaser.Game(config);

var cursors;

// -- Joueur --

var joueur;
var joueurWalkspeed;


////////// PRELOAD //////////

function preload(){

    // -- Tiled --

    this.load.image('tiles', 'assets/Tiled/Tileset.png');
    this.load.tilemapTiledJSON('map', 'assets/Tiled/map0A.json');

    // -- Acteurs Vivants --

    this.load.spritesheet('joueur', 'assets/maya/MayaBase2.png', {frameWidth : 128, frameHeight : 128});

}





////////// CREATE //////////

function create(){

    // -- Tiled --

    const map = this.make.tilemap({key: 'map'});
    const tileset = map.addTilesetImage('Tileset', 'tiles');

    var ground_Layer = map.createLayer('Ground', tileset);
    var wall_Layer = map.createLayer('Wall', tileset);


    // -- Inputs --

    cursors = this.input.keyboard.addKeys(
        {up:Phaser.Input.Keyboard.KeyCodes.Z,
        down:Phaser.Input.Keyboard.KeyCodes.S,
        left:Phaser.Input.Keyboard.KeyCodes.Q,
        right:Phaser.Input.Keyboard.KeyCodes.D});


    // -- Joueur --

    joueur = this.physics.add.sprite(100, 100, 'joueur');
    joueurWalkspeed = 3;


    // -- Camera --

    this.cameras.main.startFollow(joueur);
    this.cameras.main.setBounds(0, 0, joueur.widthInPixels, joueur.heightInPixels);


}





////////// UPDATE //////////

function update(){

    deplacementsJoueur();                                   //Le joueur se déplace (ZQSD/LStick)


}





////////// FUNCTIONS //////////

function deplacementsJoueur(){


    // -- Diagonales (anti straff acceleration (selon le théorème de Pythagore)) --


    if (cursors.right.isDown && cursors.up.isDown && !cursors.left.isDown && !cursors.down.isDown){
        joueur.x += joueurWalkspeed/Math.sqrt(2);           // Déplacements vers la diagonale haut doite                     
        joueur.y -= joueurWalkspeed/Math.sqrt(2); 
    }

    else if (cursors.left.isDown && cursors.up.isDown && !cursors.down.isDown && !cursors.right.isDown){
        joueur.x -= joueurWalkspeed/Math.sqrt(2);           // Déplacements vers la diagonale haut gauche                      
        joueur.y -= joueurWalkspeed/Math.sqrt(2);                       
    }

    else if (cursors.down.isDown && cursors.left.isDown && !cursors.up.isDown && !cursors.right.isDown){
        joueur.x -= joueurWalkspeed/Math.sqrt(2);           // Déplacements vers la diagonale bas gauche                      
        joueur.y += joueurWalkspeed/Math.sqrt(2);                       
    }

    else if (cursors.down.isDown && cursors.right.isDown && !cursors.left.isDown && !cursors.up.isDown){
        joueur.x += joueurWalkspeed/Math.sqrt(2);           // Déplacements vers la diagonale bas droite                      
        joueur.y += joueurWalkspeed/Math.sqrt(2);                         
    }

    // -- Déplacements Horizontaux Verticaux --


    else if (cursors.right.isDown && !cursors.left.isDown && !cursors.down.isDown && !cursors.up.isDown){
        joueur.x += joueurWalkspeed;                        // Déplacement vers la droite
    }

    else if (cursors.left.isDown && !cursors.right.isDown && !cursors.down.isDown && !cursors.up.isDown){
        joueur.x -= joueurWalkspeed;                        // Déplacement vers la gauche
    }

    else if (cursors.down.isDown && !cursors.left.isDown && !cursors.up.isDown && !cursors.right.isDown){
        joueur.y += joueurWalkspeed;                        // Déplacement vers le bas
    }

    else if (cursors.up.isDown && !cursors.left.isDown && !cursors.down.isDown && !cursors.right.isDown){
        joueur.y -= joueurWalkspeed;                        // Déplacement vers le haut
    }
    

}