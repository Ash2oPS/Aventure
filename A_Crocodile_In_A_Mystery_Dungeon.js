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

// -- player --

var player; //gameObjects
var shadow;

var playerWalkspeed; //mechanical stats
var playerIsMoving;
var currentX;
var nextX;
var currentY;
var nextY;

var playerMoney; //explicit stats
var playerKey;
var playerLightning;
var playerFire;
var currentFloor;

var uiTextStair;
var uiTextKey;
var uiTextMoney;
var uiTextLightning;
var uiTextFire;



////////// PRELOAD //////////

function preload() {

    // -- Tiled --

    this.load.image('tiles', 'assets/Tiled/Tileset.png');
    this.load.tilemapTiledJSON('map', 'assets/Tiled/map0A.json');

    // -- Acteurs Vivants --

    this.load.spritesheet('player', 'assets/player/gator.png', {
        frameWidth : 100,
        frameHeight: 100
    });
    this.load.image('shadow', 'assets/player/shadow.png');

    // -- UI --

    this.load.image('keyIcon', 'assets/UI/KeyIcon.png');
    this.load.image('moneyIcon', 'assets/UI/MoneyIcon.png');
    this.load.image('fireIcon', 'assets/UI/FireIcon.png');
    this.load.image('lightningIcon', 'assets/UI/LightningIcon.png');
    this.load.image('stairIcon', 'assets/UI/StairIcon.png');

}


////////// CREATE //////////

function create() {

    // -- Debugtext --

    initDebug(this);

    // -- UI --

    initUi(this);

    // -- Tiled --

    initTiled(this);

    // -- Inputs --

    initInputs(this);

    // -- player --

    initPlayer(this);

    // -- Camera --

    initCamera(this);


}


////////// UPDATE //////////

function update() {

    // DEBUG TEXT

    debugDisplay(config);

    //

    upgradeUI();
    deplacementsPlayer(); //Le player se déplace (ZQSD/LStick)
    playerMoves();


}


////////// FUNCTIONS //////////

function initDebug(context) {
    if (config.physics.arcade.debug) {
        debugText = context.add.text(0, 1080, "bonjour, ça va ? super", {
            fontSize: '24px',
            padding: {
                x: 10,
                y: 5
            },
            backgroundColor: '#000000',
            fill: '#ffffff'
        });
        debugText.setScrollFactor(0)
            .setOrigin(0, 1)
            .setDepth(11);

        printCases(context, 2, 1, 12, 7); // Affiche les coordonnées des cases entre [departX;departY] et [arriveeX;arriveeY]
    }
} //What's in the Create Event and that's about the custom debugger


function initUi(context) {
    uiTextKey = context.add.text(106, 106, playerKey, {
            fontSize: '24px',
            padding: {
                x: 10,
                y: 10
            },
        })
        .setScrollFactor(0)
        .setOrigin(1, 1)
        .setDepth(11);

    uiTextMoney = context.add.text(106, 202, playerMoney, {
            fontSize: '24px',
            padding: {
                x: 10,
                y: 10
            }
        })
        .setScrollFactor(0)
        .setOrigin(1, 1)
        .setDepth(11);

    uiTextFire = context.add.text(106, 318, playerFire, {
            fontSize: '24px',
            padding: {
                x: 10,
                y: 10
            }
        })
        .setScrollFactor(0)
        .setOrigin(1, 1)
        .setDepth(11);

    uiTextLightning = context.add.text(106, 414, playerLightning, {
            fontSize: '24px',
            padding: {
                x: 10,
                y: 10
            }
        })
        .setScrollFactor(0)
        .setOrigin(1, 1)
        .setDepth(11);

    uiTextStair = context.add.text(1910, 114, playerLightning, {
            fontSize: '26px',
            fill: '#F5AEB2'
        })
        .setScrollFactor(0)
        .setOrigin(1, 1)
        .setDepth(11);



    context.add.image(10, 10, 'keyIcon')
        .setDepth(10)
        .setScrollFactor(0)
        .setOrigin(0, 0);

    context.add.image(10, 106, 'moneyIcon')
        .setDepth(10)
        .setScrollFactor(0)
        .setOrigin(0, 0);

    context.add.image(10, 222, 'fireIcon')
        .setDepth(10)
        .setScrollFactor(0)
        .setOrigin(0, 0);

    context.add.image(10, 318, 'lightningIcon')
        .setDepth(10)
        .setScrollFactor(0)
        .setOrigin(0, 0);

    context.add.image(1910, 10, 'stairIcon')
        .setDepth(10)
        .setScrollFactor(0)
        .setOrigin(1, 0);
} //What's in the Create Event and that's about UI


function initTiled(context){
    const map = context.make.tilemap({
        key: 'map'
    });
    const tileset = map.addTilesetImage('Tileset', 'tiles');

    var ground_Layer = map.createLayer('Ground', tileset);
    var wall_Layer = map.createLayer('Wall', tileset);
}


function initInputs(context){
    cursors = context.input.keyboard.addKeys({
        up: Phaser.Input.Keyboard.KeyCodes.Z,
        down: Phaser.Input.Keyboard.KeyCodes.S,
        left: Phaser.Input.Keyboard.KeyCodes.Q,
        right: Phaser.Input.Keyboard.KeyCodes.D
    });
}


function initPlayer(context){
    shadow = context.add.image(750, 490, 'shadow')
        .setOrigin(.5, 1)
        .setDepth(1);
    player = context.physics.add.sprite(750, 475, 'player')
        .setOrigin(.5, 1)
        .setDepth(1);
    playerWalkspeed = 5;
    playerIsMoving = false;
    currentX = 0;
    nextX = 0;
    currentY = 0;
    nextY = 0;
    playerMoney = 150;
    playerKey = 1;
    playerLightning = 1;
    playerFire = 1;
    currentFloor = 0;
}


function initCamera(context){
    context.cameras.main.startFollow(player);
    context.cameras.main.setBounds(0, 0, player.widthInPixels, player.heightInPixels);
}


function printCases(context, departX, departY, arriveeX, arriveeY) {
    for (i = departX; i < arriveeX + 1; i++) {
        for (j = departY; j < arriveeY + 1; j++) {
            context.add.text(i * 100 + 50, j * 100 + 50, '[' + i + ';' + j + ']', {
                    fontSize: '12px',
                    padding: {
                        x: 10,
                        y: 5
                    },
                    fill: '#ffffff'
                })
                .setOrigin(.5, .5)
                .setDepth(.1);
        }
    }
} //Prints Cases' IDs from [departX;departY] to [arriveeX;arriveeY] (Xs et Ys being in-game Case Coordinates, not X and Y Coordinates)


function debugDisplay(config) {
    if (config.physics.arcade.debug) {
        debugText.setText('gator is moving : ' + playerIsMoving + ' currentX : ' + currentX + ' nextX : ' + nextX +
            '\ngator current Case : [' + getCaseX(player.x) + ';' + getCaseY(player.y) + ']');
    }

} //What's in the Update Event and that's about the custom debugger


function upgradeUI() {
    uiTextKey.setText(playerKey);
    uiTextMoney.setText(playerMoney);
    uiTextFire.setText(playerFire);
    uiTextLightning.setText(playerLightning);

    if (currentFloor == 0) uiTextStair.setText('G.F.');
    else uiTextStair.setText(currentFloor + 'F.');
} //What's in the Update Event and that's about UI


function deplacementsPlayer() {

    if (!playerIsMoving) {
        if (cursors.right.isDown) {
            currentX = player.x;
            nextX = player.x + 100;
            playerIsMoving = true;
        } else if (cursors.left.isDown) {
            currentX = player.x;
            nextX = player.x - 100;
            playerIsMoving = true;
        } else if (cursors.down.isDown) {
            currentY = player.y;
            nextY = player.y + 100;
            playerIsMoving = true;
        } else if (cursors.up.isDown) {
            currentY = player.y;
            nextY = player.y - 100;
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


function getCaseX(value) {
    return (value - 50) / 100;
}


function getCaseY(value) {
    return (value - 75) / 100;
}


function caseXToCoord(value) {
    return value * 100 + 50;
}


function caseYToCoord(value) {
    return value * 100 + 75;
}