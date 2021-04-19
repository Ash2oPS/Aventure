////////// CONFIG //////////

const screenWidth    = 1920;
const screenHeight   = 1080;

const config         = {
    width            : screenWidth,
    height           : screenHeight,
    type             : Phaser.AUTO,
    physics          : {
        default      : 'arcade',
        arcade       : {
            //gravity: {},
            debug    : true
        }
    },
    input            : {
        gamepad      : true
    },
    scene            : {
        preload      : preload,
        create       : create,
        update       : update
    },
    scale            : {
        zoom         : 1,
    }
}

////////// VARIABLES //////////

// -- Config --

var game = new Phaser.Game(config);

var debugText;

var cursors;

var uiText;

// -- player --

var player;             //gameObjects
var shadow;

var playerWalkspeed;    //mechanical stats
var playerIsMoving;
var currentX;
var nextX;
var currentY;
var nextY;

var playerMoney;        //explicit stats
var playerKey;
var playerLightning;
var playerFire;
var currentFloor;


////////// PRELOAD //////////

function preload() {

    // -- Tiled --

    this.load.image('tiles', 'assets/Tiled/Tileset.png');
    this.load.tilemapTiledJSON('map', 'assets/Tiled/map0A.json');

    // -- Acteurs Vivants --

    this.load.spritesheet('player', 'assets/player/gator.png', {
        frameWidth: 100,
        frameHeight: 100
    });
    this.load.image('shadow', 'assets/player/shadow.png');

}


////////// CREATE //////////

function create() {

    // -- Debugtext --
    if (config.physics.arcade.debug) {
        debugText          = this.add.text(1920, 0, "bonjour, ça va ? super", {
            fontSize       : '24px',
            padding        : {
                x          : 10,
                y          : 5
            },
            backgroundColor: '#000000',
            fill           : '#ffffff'
        });
        debugText.setScrollFactor(0)
            .setOrigin(1, 0)
            .setDepth(11);

        printCases(this, 2, 1, 12, 7);              // Affiche les coordonnées des cases entre [departX;departY] et [arriveeX;arriveeY]
    }

    // -- UI --

    uiText = this.add.text(0,0, 'Current Floor: ' + currentFloor + 
    '\nMoney: ' + playerMoney + 
    '\nKeys: ' + playerKey + 
    '\nLightnings: ' + playerLightning + 
    '\nFires: ' + playerFire, {
        fontSize : '24px',
        padding : {
            x : 10,
            y : 10
        }
    })
    .setScrollFactor(0)
    .setOrigin(0,0)
    .setDepth(10);

    // -- Tiled --

    const map = this.make.tilemap({
        key: 'map'
    });
    const tileset = map.addTilesetImage('Tileset', 'tiles');

    var ground_Layer = map.createLayer('Ground', tileset);
    var wall_Layer = map.createLayer('Wall', tileset);


    // -- Inputs --

    cursors  = this.input.keyboard.addKeys({
        up   : Phaser.Input.Keyboard.KeyCodes.Z,
        down : Phaser.Input.Keyboard.KeyCodes.S,
        left : Phaser.Input.Keyboard.KeyCodes.Q,
        right: Phaser.Input.Keyboard.KeyCodes.D
    });


    // -- player --

    shadow          = this.add.image(750, 490, 'shadow')
        .setOrigin(.5, 1)
        .setDepth(1);
    player          = this.physics.add.sprite(750, 475, 'player')
        .setOrigin(.5, 1)
        .setDepth(1);
    playerWalkspeed = 5;
    playerIsMoving  = false;
    currentX        = 0;
    nextX           = 0;
    currentY        = 0;
    nextY           = 0;
    playerMoney     = 0
    playerKey       = 0;
    playerLightning = 0;
    playerFire      = 0;
    currentFloor    = 0;


    // -- Camera --

    this.cameras.main.startFollow(player);
    this.cameras.main.setBounds(0, 0, player.widthInPixels, player.heightInPixels);


}


////////// UPDATE //////////

function update() {

    // DEBUG TEXT
    if (config.physics.arcade.debug) {
        debugText.setText('gator is moving : ' + playerIsMoving + ' currentX : ' + currentX + ' nextX : ' + nextX + 
        '\ngator current Case : [' + getCaseX(player.x) + ';' + getCaseY(player.y) + ']');
    }

    //

    deplacementsPlayer(); //Le player se déplace (ZQSD/LStick)
    playerMoves();


}


////////// FUNCTIONS //////////

function printCases(context, departX, departY, arriveeX, arriveeY){
    for (i = departX; i < arriveeX + 1; i++){
        for (j = departY; j < arriveeY + 1; j++){
            context.add.text(i * 100 + 50, j * 100 + 50, '[' + i + ';' + j + ']',{
                fontSize       : '12px',
                padding        : {
                    x          : 10,
                    y          : 5
                },
                fill           : '#ffffff'
            })
            .setOrigin(.5, .5)
            .setDepth(.1);
        }
    }
}


function deplacementsPlayer() {

    if (!playerIsMoving){
        if (cursors.right.isDown && !cursors.left.isDown && !cursors.down.isDown && !cursors.up.isDown) {
            currentX       = player.x;
            nextX          = player.x + 100;
            playerIsMoving = true;
        } else if (cursors.left.isDown && !cursors.right.isDown && !cursors.down.isDown && !cursors.up.isDown) {
            currentX       = player.x;
            nextX          = player.x - 100;
            playerIsMoving = true;
        } else if (cursors.down.isDown && !cursors.left.isDown && !cursors.up.isDown && !cursors.right.isDown) {
            currentY       = player.y;
            nextY          = player.y + 100;
            playerIsMoving = true;
        } else if (cursors.up.isDown && !cursors.left.isDown && !cursors.down.isDown && !cursors.right.isDown) {
            currentY       = player.y;
            nextY          = player.y - 100;
            playerIsMoving = true;
        }
    }


}


function playerMoves() {
    if (playerIsMoving) {

        if (currentX <= nextX && currentX != 0) {

            if (player.x < nextX) {
                player.x += playerWalkspeed;
                shadow.x += playerWalkspeed;
            } else {
                playerIsMoving = false;

            }

        } else if (currentX >= nextX && currentX != 0) {

            if (player.x > nextX) {
                player.x -= playerWalkspeed;
                shadow.x -= playerWalkspeed;
            } else {
                playerIsMoving = false;

            }

        } else if (currentY <= nextY && currentY != 0) {

            if (player.y < nextY) {
                player.y += playerWalkspeed;
                shadow.y += playerWalkspeed;
            } else {
                playerIsMoving = false;

            }

        } else if (currentY >= nextY && currentY != 0) {

            if (player.y > nextY) {
                player.y -= playerWalkspeed;
                shadow.y -= playerWalkspeed;
            } else {
                playerIsMoving = false;

            }

        }

    } else {
        currentX = 0;
        nextX = 0;
        currentY = 0;
        nextY = 0;
    }
}


function getCaseX(value){
    return (value-50)/100;
}


function getCaseY(value){
    return (value-75)/100;
}

function caseXToCoord(value){
    return value * 100 + 50;
}

function caseYToCoord(value){
    return value * 100 + 75;
}