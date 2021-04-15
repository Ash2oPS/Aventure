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

var debugText;

var cursors;

// -- player --

var player;
var shadow;
var playerWalkspeed;
var playerIsMoving;
var currentX;
var nextX;
var currentY;
var nextY;


////////// PRELOAD //////////

function preload(){

    // -- Tiled --

    this.load.image('tiles', 'assets/Tiled/Tileset.png');
    this.load.tilemapTiledJSON('map', 'assets/Tiled/map0A.json');

    // -- Acteurs Vivants --

    this.load.spritesheet('player', 'assets/player/gator.png', {frameWidth : 100, frameHeight : 100});
    this.load.image('shadow', 'assets/player/shadow.png');

}





////////// CREATE //////////

function create(){

    // -- Debugtext --
    if (config.physics.arcade.debug){
        debugText = this.add.text(100, 100,"debug", {
            fontSize: '24px',
            padding: { x: 10, y: 5 },
            backgroundColor: '#000000',
            fill: '#ffffff'
        });
        debugText.setScrollFactor(0)
        .setOrigin(0, 0)
        .setDepth(2);
    }

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


    // -- player --

    shadow = this.add.image(750, 490, 'shadow')
    .setOrigin(.5, 1);
    player = this.physics.add.sprite(750, 475, 'player')
    .setOrigin(.5, 1);
    playerWalkspeed = 5;
    playerIsMoving = false;
    currentX = 0;
    nextX = 0;
    currentY = 0;
    nextY = 0;    


    // -- Camera --

    this.cameras.main.startFollow(player);
    this.cameras.main.setBounds(0, 0, player.widthInPixels, player.heightInPixels);


}





////////// UPDATE //////////

function update(){

    // DEBUG TEXT
    if (config.physics.arcade.debug){
        debugText.setText('gator is moving : ' + playerIsMoving + ' currentX : ' + currentX + ' nextX : ' + nextX
        );
    }

    //

    deplacementsPlayer();                                   //Le player se déplace (ZQSD/LStick)
    playerMoves();


}


////////// FUNCTIONS //////////

function deplacementsPlayer(){

    if (cursors.right.isDown && !cursors.left.isDown && !cursors.down.isDown && !cursors.up.isDown){
        if (!playerIsMoving){
            currentX = player.x;
            nextX = player.x + 100;
            playerIsMoving = true;
        }
    }

    else if (cursors.left.isDown && !cursors.right.isDown && !cursors.down.isDown && !cursors.up.isDown){
        if (!playerIsMoving){
            currentX = player.x;
            nextX = player.x - 100;
            playerIsMoving = true;
        }
    }

    else if (cursors.down.isDown && !cursors.left.isDown && !cursors.up.isDown && !cursors.right.isDown){
        if (!playerIsMoving){
            currentY = player.y;
            nextY = player.y + 100;
            playerIsMoving = true;
        }
    }

    else if (cursors.up.isDown && !cursors.left.isDown && !cursors.down.isDown && !cursors.right.isDown){
        if (!playerIsMoving){
            currentY = player.y;
            nextY = player.y - 100;
            playerIsMoving = true;
        }
    }
    

}

function playerMoves(){
    if (playerIsMoving){

        if (currentX <= nextX && currentX != 0){

            if (player.x < nextX){
                player.x += playerWalkspeed; 
                shadow.x += playerWalkspeed;
            }
            else{
                playerIsMoving = false;

            }

        } else if (currentX >= nextX && currentX != 0){

            if (player.x > nextX){
                player.x -= playerWalkspeed; 
                shadow.x -= playerWalkspeed;
            }
            else{
                playerIsMoving = false;

            }

        } else if (currentY <= nextY && currentY != 0){

            if (player.y < nextY){  
                player.y += playerWalkspeed; 
                shadow.y += playerWalkspeed;
            }
            else{
                playerIsMoving = false;

            }

        } else if (currentY >= nextY && currentY != 0){

            if (player.y > nextY){  
                player.y -= playerWalkspeed; 
                shadow.y -= playerWalkspeed;
            }
            else{
                playerIsMoving = false;

            }

        }

    } else{
        currentX = 0;
        nextX = 0;
        currentY = 0;
        nextY = 0;
    }
}