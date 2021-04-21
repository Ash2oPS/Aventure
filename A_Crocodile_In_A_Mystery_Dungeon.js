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

var colChecker;
var colCheckerReturns;

// -- Player --

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
var playerHp;

var uiTextStair;
var uiTextKey;
var uiTextMoney;
var uiTextLightning;
var uiTextFire;

// -- Items --

var keyItem;
var moneyItem;
var fireItem;
var lightningItem;
var stairItem;

// -- Tiled --

var map;
var tileset;
var ground_Layer;
var wall_Layer;
var locks_Layer;



////////// PRELOAD //////////

function preload() {

    // -- Tiled --

    preloadTiled(this);

    // -- Acteurs Vivants --

    preloadCharacters(this);

    // -- Items --

    preloadItems(this);
    
    // -- UI --

    preloadUI(this);

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

    // -- Player --

    initPlayer(this);

    // -- Items --

    initItems(this);

    // -- Camera --

    initCamera(this);

}


////////// UPDATE //////////

function update() {

    // DEBUG TEXT

    debugDisplay(config);

    //

    upgradeUI();                // Le HUD se met à jour
    deplacementsPlayer();       // Le player se déplace (ZQSD/LStick)
    playerMoves();              // Le joueur bouge
    lockOpener();               // Vérifie si on ouvre les verrous


}


////////// FUNCTIONS //////////

function preloadTiled(context){
    context.load.image('colChecker', 'ColChecker.png')
    context.load.image('tiles', 'assets/Tiled/Tileset.png');
    context.load.tilemapTiledJSON('map', 'assets/Tiled/map0A.json');
}


function preloadCharacters(context){
    context.load.spritesheet('player', 'assets/player/gator.png', {
        frameWidth : 100,
        frameHeight: 100
    });
    context.load.image('shadow', 'assets/player/shadow.png');
}


function preloadItems(context){
    context.load.image('key', 'assets/items/key.png');
    context.load.image('money', 'assets/items/money.png');
    context.load.image('fire', 'assets/items/fire.png');
    context.load.image('lightning', 'assets/items/lightning.png');
    context.load.image('stair', 'assets/items/stair.png');
}


function preloadUI(context){
    context.load.image('keyIcon', 'assets/UI/KeyIcon.png');
    context.load.image('moneyIcon', 'assets/UI/MoneyIcon.png');
    context.load.image('fireIcon', 'assets/UI/FireIcon.png');
    context.load.image('lightningIcon', 'assets/UI/LightningIcon.png');
    context.load.image('stairIcon', 'assets/UI/StairIcon.png');
}


function initDebug(context) {
    colChecker = context.physics.add.sprite(caseXToCoord(0), caseYToCoord(0), 'colChecker')
    .setOrigin(.5, 1)
    .setDepth(12);
    colChecker.opacity = 0;
    if (config.physics.arcade.debug) {
        debugText = context.add.text(0, 935, "bonjour, ça va ? super", {
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

        colChecker.opacity = 1;

        //printCases(context, 31, 8, 94, 55); // Affiche les coordonnées des cases entre [departX;departY] et [arriveeX;arriveeY]
        printCases(context, 34,24,44,30);
        printCases(context, 33,49,43,55);
        printCases(context, 53,38,61,44);
        printCases(context, 48,10,58,16);
        printCases(context, 66,20,76,26);
        printCases(context, 78,31,86,37);
        printCases(context, 80,44,90,50);
    }
} //Ce qui se trouve dans la fonction Create et qui concerne le debugger custom


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
} //Ce qui se trouve dans la fonction Create et qui concerne l'UI


function initInputs(context){
    cursors = context.input.keyboard.addKeys({
        up: Phaser.Input.Keyboard.KeyCodes.Z,
        down: Phaser.Input.Keyboard.KeyCodes.S,
        left: Phaser.Input.Keyboard.KeyCodes.Q,
        right: Phaser.Input.Keyboard.KeyCodes.D
    });
}


function initPlayer(context){
    shadow = context.add.image(caseXToCoord(7), caseYToCoord(4) + 15, 'shadow')
        .setOrigin(.5, 1)
        .setDepth(1);
    player = context.physics.add.sprite(caseXToCoord(57), caseYToCoord(41), 'player')
        .setOrigin(.5, 1)
        .setDepth(1);
    playerWalkspeed = 5;
    playerIsMoving = false;
    currentX = 0;
    nextX = 0;
    currentY = 0;
    nextY = 0;
    playerMoney = 150;
    playerKey = 0;
    playerLightning = 1;
    playerFire = 1;
    currentFloor = 1;
}


function initItems(context){
    keyItem = context.add.image(caseXToCoord(89), caseYToCoord(47), 'key')
    .setOrigin(.5, 1);
    moneyItem = context.add.image(caseXToCoord(11), caseYToCoord(6), 'money')
    .setOrigin(.5, 1);
    fireItem = context.add.image(caseXToCoord(3), caseYToCoord(7), 'fire')
    .setOrigin(.5, 1);
    lightningItem = context.add.image(caseXToCoord(12), caseYToCoord(1), 'lightning')
    .setOrigin(.5, 1);
    stairItem = context.add.image(caseXToCoord(58), caseYToCoord(16), 'stair')
    .setOrigin(.5, 1);
}


function initCamera(context){
    context.cameras.main.startFollow(player);
    context.cameras.main.setBounds(0, 0, player.widthInPixels, player.heightInPixels);
}


function initTiled(context){
    map = context.make.tilemap({
        key: 'map'
    });
    tileset = map.addTilesetImage('Tileset', 'tiles');

    ground_Layer = map.createLayer('Ground', tileset);
    wall_Layer = map.createLayer('Wall', tileset);
    locks_Layer = map.createLayer('Locks', tileset)

    wall_Layer.setCollisionByExclusion(-1,true);
    locks_Layer.setCollisionByExclusion(-1,true);
    context.physics.add.overlap(colChecker, wall_Layer, function(){colCheckerReturns = true});
    context.physics.add.overlap(colChecker, keyItem, pickupKey);
} //Ce qui se trouve dans la fonction Create et qui concerne Tiled (et les collisions du jeu)


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
        debugText.setText('gator is moving : ' + playerIsMoving + ' currentX : ' + currentX + ' nextX : ' + nextX + '; currentY : ' + currentY + ' nextY : ' + nextY +
            '\nplayer current Case : [' + getCaseX(player.x) + ';' + getCaseY(player.y) + ']'+
            '\n colChecker current Case : [' + getCaseX(colChecker.x) + ';' + getCaseY(colChecker.y) + '] + returns : ' + colCheckerReturns);
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
            colCheckerMoves(caseXToCoord(getCaseX(player.x)+1), caseYToCoord(getCaseY(player.y)));
            currentX = player.x;
            nextX = player.x + 100;
            playerIsMoving = true;
        } else if (cursors.left.isDown) {
            colCheckerMoves(caseXToCoord(getCaseX(player.x)-1), caseYToCoord(getCaseY(player.y)));
            currentX = player.x;
            nextX = player.x - 100;
            playerIsMoving = true;
        } else if (cursors.down.isDown) {
            colCheckerMoves(caseXToCoord(getCaseX(player.x)), caseYToCoord(getCaseY(player.y)+1));
            currentY = player.y;
            nextY = player.y + 100;
            playerIsMoving = true;
        } else if (cursors.up.isDown) {
            colCheckerMoves(caseXToCoord(getCaseX(player.x)), caseYToCoord(getCaseY(player.y)-1));
            currentY = player.y;
            nextY = player.y - 100;
            playerIsMoving = true;
        }
        colCheckerMovesBack();
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


function colCheckerMoves(caseX, caseY){
    colChecker.x = player.x/*caseXToCoord(caseX)*/;
    colChecker.y = player.y/*caseYToCoord(caseY)*/;
}


function colCheckerMovesBack(){
    colChecker.x = caseXToCoord(0);
    colChecker.y = caseYToCoord(0);
    colCheckerReturns = false;
}


function lockOpener(){
    if (getCaseX(player.x) == 46 && getCaseY(player.y) == 13 && playerKey > 0){
        console.log(locks_Layer);
        playerKey --;
        locks_Layer.destroy();
        console.log(locks_Layer);
    }else if (getCaseX(player.x) == 60 && getCaseY(player.y) == 12 && playerKey > 0){
        playerKey --;
        locks_Layer.destroy();
    }
}


function pickupKey(){
    playerKey++;
    keyItem.destroy();
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