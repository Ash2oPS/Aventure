


// SI HAUT/BAS SONT APPUYéS ALORS QU'UN DEPLACEMENT VERS GAUCHE/DROITE N'EST PAS FINI, LE JOUEUR SERA BLOQUé

// LES COLLISIONS CONTRE LES MURS NE FONCTIONNENT PAS
// Le jeu étant un jeu a déplacement case par case, je ne souhaitais pas utiliser un système de collisions classique
// C'est pourquoi j'utilise un objet que j'ai appelé CollisionChecker, un petit sprite visible si debug == true, qui
// se tp sur la case vers laquelle l'acteur s'apprête à se déplacer. Renvoyant ainsi une information permettant à l'
// acteur de savoir si qui se trouve sur la case en question. 
// L'idée des collisions aurait été de mettre un collider overlap entre le collision checker et le layer Wall de la map
// afin de vérifier si le joueur/ennemi peut se déplacer vers la direction souhaitée.
// Pour une raison inconnue je n'ai jamais réussi à coder cet overlap

// Malgré que l'on a eu sur ces sujets, je n'ai pas été en mesure d'ajouter des inputs à la manette ainsi qu'un système
// de scènes



////////// CONFIG //////////

const screenWidth = 1920;
const screenHeight = 1080;

const config = {
    width: screenWidth,
    height: screenHeight,
    type: Phaser.AUTO,
    physics: {
        default: 'arcade',
        arcade: {
            //gravity: {},
            debug: false
        }
    },
    input: {
        gamepad: true
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    scale: {
        zoom: 1,
    }
}

////////// VARIABLES //////////

// -- Config --

var game = new Phaser.Game(config);

var debugText;

var cursors;
var fireInput;
var lightningInput;
var sprintInput;

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
var uiHp0;
var uiHp1;
var uiHp2;

var indications;

var fireAttackSprite;
var playerIsFireAttacking;
var lightningAttackSprite;
var playerIsLightningAttacking;
var normalAttack;
var playerIsAttacking;

var attackCount;

// -- Enemy --

var enemy;

var enemyDirection;

var enemyCurrentX;
var enemyNextX;
var enemyCurrentY;
var enemyNextY;

var enemyHp;
var enemyInvincible;
var enemyInvincibleCount;

var enemyLoot;
var enemyLootType;
var enemyMort;

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

    // -- Attacks --

    preloadAttacks(this);

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

    // -- Inputs --

    initInputs(this);

    // -- Player --

    initPlayer(this);

    // -- Items --

    initItems(this);

    // -- Camera --

    initCamera(this);

    // -- Tiled --

    initTiled(this);

}


////////// UPDATE //////////

function update() {

    // DEBUG TEXT

    debugDisplay(config);

    //

    upgradeUI(); // Le HUD se met à jour
    deplacementsPlayer(); // Le player se déplace (ZQSD/LStick)
    playerMoves(); // Le joueur bouge
    enemyMoves(); // L'ennemi bouge
    lifeManagement();
    lockOpener(); // Vérifie si on ouvre les verrous
    fireAttack(this);
    LightningAttack(this);
    enemyInvincibleManagement();
    enemyDeath(this);


}


////////// FUNCTIONS //////////

function preloadTiled(context) {
    context.load.image('colChecker', 'ColChecker.png')
    context.load.image('tiles', 'assets/Tiled/Tileset.png');
    context.load.tilemapTiledJSON('map', 'assets/Tiled/map0A.json');
}


function preloadCharacters(context) {
    context.load.spritesheet('player', 'assets/player/gator.png', {
        frameWidth: 100,
        frameHeight: 100
    });
    context.load.image('shadow', 'assets/player/shadow.png');

    context.load.spritesheet('enemy', 'assets/player/gatorRouge.png', {
        frameWidth: 100,
        frameHeight: 100
    });
}


function preloadItems(context) {
    context.load.image('key', 'assets/items/key.png');
    context.load.image('money', 'assets/items/money.png');
    context.load.image('fire', 'assets/items/fire.png');
    context.load.image('lightning', 'assets/items/lightning.png');
    context.load.image('stair', 'assets/items/stair.png');
}


function preloadUI(context) {
    context.load.image('keyIcon', 'assets/UI/KeyIcon.png');
    context.load.image('moneyIcon', 'assets/UI/MoneyIcon.png');
    context.load.image('fireIcon', 'assets/UI/FireIcon.png');
    context.load.image('lightningIcon', 'assets/UI/LightningIcon.png');
    context.load.image('stairIcon', 'assets/UI/StairIcon.png');
    context.load.image('lifeIcon', 'assets/UI/LifeIcon.png');
}

function preloadAttacks(context) {
    context.load.image('fireAttack', 'assets/fireAttack.png');
    context.load.image('lightningAttackUp', 'assets/lightningAttackUp.png');
    context.load.image('lightningAttackRight', 'assets/lightningAttackRight.png');
    context.load.image('lightningAttackDown', 'assets/lightningAttackDown.png');
    context.load.image('lightningAttackLeft', 'assets/lightningAttackLeft.png');
    context.load.image('gatorAttack', 'assets/gatorAttack.png');
    context.load.image('redGatorAttack', 'assets/redGatorAttack.png');
}


function initDebug(context) {
    colChecker = context.physics.add.sprite(caseXToCoord(0), caseYToCoord(0), 'colChecker')
        .setOrigin(.5, 1)
        .setDepth(12);
    colChecker.alpha = 0;
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

        //printCases(context, 31, 8, 94, 55); // Affiche les coordonnées des cases entre [departX;departY] et [arriveeX;arriveeY]

        printCases(context, 53, 38, 61, 44);
        printCases(context, 48, 10, 58, 16);


        colChecker.alpha = 1;
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

    uiHp0 = context.add.image(1910, 1070, 'lifeIcon')
        .setDepth(10)
        .setOrigin(1, 1)
        .setScrollFactor(0);
    uiHp0 = context.add.image(1820, 1070, 'lifeIcon')
        .setDepth(10)
        .setOrigin(1, 1)
        .setScrollFactor(0);
    uiHp0 = context.add.image(1730, 1070, 'lifeIcon')
        .setDepth(10)
        .setOrigin(1, 1)
        .setScrollFactor(0);

    indications = context.add.text(caseXToCoord(49) - 40, caseYToCoord(36), 'Move: ZQSD\nFire Attack : A\nLightning Attack: E AND a direction\nGo to the stairs\nPlay in fullscreen(F11)', {
            fontSize: '32px'
        })
        .setOrigin(0, 0)
        .setDepth(2);
} //Ce qui se trouve dans la fonction Create et qui concerne l'UI


function initInputs(context) {
    cursors = context.input.keyboard.addKeys({
        up: Phaser.Input.Keyboard.KeyCodes.Z,
        down: Phaser.Input.Keyboard.KeyCodes.S,
        left: Phaser.Input.Keyboard.KeyCodes.Q,
        right: Phaser.Input.Keyboard.KeyCodes.D
    });
    fireInput = context.input.keyboard.addKey('A');
    lightningInput = context.input.keyboard.addKey('E');
    sprintInput = context.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
}


function initPlayer(context) {
    shadow = context.add.image(caseXToCoord(57), caseYToCoord(41) + 15, 'shadow')
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
    playerMoney = 0;
    playerKey = 0;
    playerLightning = 0;
    playerFire = 0;
    currentFloor = 1;
    playerHp = 3;

    attackCount = 0;

    if (config.physics.arcade.debug) {
        playerFire = 90;
        playerLightning = 90;
    }

    //enemy

    enemy = context.physics.add.sprite(caseXToCoord(53), caseYToCoord(39), 'enemy')
        .setOrigin(.5, 1)
        .setDepth(1);

    enemyCurrentX = 0;
    enemyNextX = 0;
    enemyCurrentY = 0;
    enemyNextY = 0;

    enemyHp = 3;

    enemyInvincible = false;
    enemyInvincibleCount = 0;
    enemyMort = false;
}


function initItems(context) {
    keyItem = context.physics.add.sprite(caseXToCoord(59), caseYToCoord(38), 'key')
        .setOrigin(.5, 1)
        .setDepth(2);
    moneyItem = context.physics.add.sprite(caseXToCoord(60), caseYToCoord(42), 'money')
        .setOrigin(.5, 1)
        .setDepth(2);
    fireItem = context.physics.add.sprite(caseXToCoord(53), caseYToCoord(42), 'fire')
        .setOrigin(.5, 1)
        .setDepth(2);
    lightningItem = context.physics.add.sprite(caseXToCoord(55), caseYToCoord(38), 'lightning')
        .setOrigin(.5, 1)
        .setDepth(2);
    stairItem = context.physics.add.sprite(caseXToCoord(58), caseYToCoord(16) + 25, 'stair')
        .setOrigin(.5, 1)
        .setDepth(2);
}


function initCamera(context) {
    context.cameras.main.startFollow(player);
    context.cameras.main.setBounds(0, 0, player.widthInPixels, player.heightInPixels);
}


function initTiled(context) {
    map = context.make.tilemap({
        key: 'map'
    });
    tileset = map.addTilesetImage('Tileset', 'tiles');

    ground_Layer = map.createLayer('Ground', tileset);
    wall_Layer = map.createLayer('Wall', tileset);
    locks_Layer = map.createLayer('Locks', tileset);

    map.setCollisionByExclusion(-1, true, true, 'Wall');
    map.setCollisionByExclusion(-1, true, true, 'Ground');
    //locks_Layer.setCollisionByExclusion(-1,true);
    //this.physics.add.collider
    context.physics.add.collider(colChecker, wall_Layer, colCheckerWall);
    context.physics.add.overlap(colChecker, ground_Layer, colCheckerGround);

    context.physics.add.collider(colChecker, keyItem, pickupKey);
    context.physics.add.collider(colChecker, moneyItem, pickupMoney);
    context.physics.add.collider(colChecker, fireItem, pickupFire);
    context.physics.add.collider(colChecker, lightningItem, pickupLightning);
    context.physics.add.collider(colChecker, stairItem, pickupStair);

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
        debugText.setText('player is moving : ' + playerIsMoving + ' currentX : ' + currentX + ' nextX : ' + nextX + '; currentY : ' + currentY + ' nextY : ' + nextY +
            '\nplayer current Case : [' + getCaseX(player.x) + ';' + getCaseY(player.y) + ']' +
            '\n colChecker current Case : [' + getCaseX(colChecker.x) + ';' + getCaseY(colChecker.y) + '] + returns : ' + colCheckerReturns +
            '\nAttackCount : ' + attackCount +
            '\nenemyDirection : ' + enemyDirection + ' enemyCurrentX ' + enemyCurrentX + ' enemyNextX : ' + enemyNextX +
            '\nenemyCurrentY : ' + enemyCurrentY + ' enemyNextY : ' + enemyNextY +
            '\nenemyHp : ' + enemyHp + ' enemyInvincible : ' + enemyInvincible + ' enemyInvincibleCount ' + enemyInvincibleCount + enemy);
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

    if (!playerIsMoving && !lightningInput.isDown) {
        if (cursors.right.isDown) {
            colCheckerMoves(caseXToCoord(getCaseX(player.x) + 1), caseYToCoord(getCaseY(player.y)) - 10);
            currentX = player.x;
            nextX = player.x + 100;
            playerIsMoving = true;
            if (enemyHp > 0) {
                enemyDirection = Phaser.Math.Between(1, 4);
                enemyCurrentX = enemy.x;
                enemyCurrentY = enemy.y;
            }
        } else if (cursors.left.isDown) {
            colCheckerMoves(caseXToCoord(getCaseX(player.x) - 1), caseYToCoord(getCaseY(player.y)) - 10);
            currentX = player.x;
            nextX = player.x - 100;
            playerIsMoving = true;
            if (enemyHp > 0) {
                enemyDirection = Phaser.Math.Between(1, 4);
                enemyCurrentX = enemy.x;
                enemyCurrentY = enemy.y;
            }
        } else if (cursors.down.isDown) {
            colCheckerMoves(caseXToCoord(getCaseX(player.x)), caseYToCoord(getCaseY(player.y) + 1) - 10);
            currentY = player.y;
            nextY = player.y + 100;
            playerIsMoving = true;
            if (enemyHp > 0) {
                enemyDirection = Phaser.Math.Between(1, 4);
                enemyCurrentX = enemy.x;
                enemyCurrentY = enemy.y;
            }
        } else if (cursors.up.isDown) {
            colCheckerMoves(caseXToCoord(getCaseX(player.x)), caseYToCoord(getCaseY(player.y) - 1) - 10);
            currentY = player.y;
            nextY = player.y - 100;
            playerIsMoving = true;
            if (enemyHp > 0) {
                enemyDirection = Phaser.Math.Between(1, 4);
                enemyCurrentX = enemy.x;
                enemyCurrentY = enemy.y;
            }
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
                //colCheckerMovesBack();
            }

        } else if (currentX >= nextX && currentX != 0) {

            if (player.x > nextX) {
                player.x -= playerWalkspeed;
                shadow.x -= playerWalkspeed;
            } else {
                playerIsMoving = false;
                //colCheckerMovesBack();
            }

        } else if (currentY <= nextY && currentY != 0) {

            if (player.y < nextY) {
                player.y += playerWalkspeed;
                shadow.y += playerWalkspeed;
            } else {
                playerIsMoving = false;
                //colCheckerMovesBack();
            }

        } else if (currentY >= nextY && currentY != 0) {

            if (player.y > nextY) {
                player.y -= playerWalkspeed;
                shadow.y -= playerWalkspeed;
            } else {
                playerIsMoving = false;
                //colCheckerMovesBack();
            }

        }

    } else {
        currentX = 0;
        nextX = 0;
        currentY = 0;
        nextY = 0;
    }

}


function enemyMoves() {
    if (enemyHp > 0) {
        if (playerIsMoving) {

            if (enemyDirection == 1) {
                enemyNextY = enemyCurrentY - 100;
                if (enemyCurrentY >= enemyNextY) {
                    enemy.y -= playerWalkspeed;
                }
            } else if (enemyDirection == 2) {
                enemyNextX = enemyCurrentX + 100;
                if (enemyCurrentX <= enemyNextX) {
                    enemy.x += playerWalkspeed;
                }
            } else if (enemyDirection == 3) {
                enemyNextY = enemyCurrentY + 100;
                if (enemyCurrentY <= enemyNextY) {
                    enemy.y += playerWalkspeed;
                }
            } else {
                enemyNextX = enemyCurrentX - 100;
                if (enemyCurrentX >= enemyNextX) {
                    enemy.x -= playerWalkspeed;
                }
            }

        } else {
            enemyCurrentX = 0;
            enemyNextX = 0;
            enemyCurrentY = 0;
            enemyNextY = 0;
        }
    }
}


function colCheckerMoves(caseX, caseY) {
    colChecker.x = caseX;
    colChecker.y = caseY;
}


function colCheckerMovesBack() {
    colCheckerReturns = false;
}


function lockOpener() {
    if (getCaseX(player.x) == 46 && getCaseY(player.y) == 13 && playerKey > 0) {
        playerKey--;
        locks_Layer.destroy();
    } else if (getCaseX(player.x) == 60 && getCaseY(player.y) == 12 && playerKey > 0) {
        playerKey--;
        locks_Layer.destroy();
    }
}


function pickupKey() {
    playerKey++;
    keyItem.destroy();
}


function pickupMoney() {
    var value = Phaser.Math.Between(100, 300)
    playerMoney += value;
    moneyItem.destroy();
}


function pickupFire() {
    playerFire += 3;
    fireItem.destroy();
}


function pickupLightning() {
    playerLightning++;
    lightningItem.destroy();
}


function pickupLootMoney() {
    var value = Phaser.Math.Between(100, 300)
    playerMoney += value;
    enemyLoot.destroy();
}


function pickupLootFire() {
    playerFire += 3;
    enemyLoot.destroy();
}


function pickupLootLightning() {
    playerLightning++;
    enemyLoot.destroy();
}


function pickupStair() {}

function sprint() {
    if (sprintInput.isDown) playerWalkspeed = 10;
    else playerWalkspeed = 5;
}

function fireAttack(context) {
    if (playerFire > 0) {
        if (fireInput.isDown && attackCount == 0) {
            playerIsFireAttacking = true;
            fireAttackSprite = context.physics.add.sprite(caseXToCoord(getCaseX(player.x) - 1) - 50, caseYToCoord(getCaseY(player.y) - 1) - 75, 'fireAttack')
                .setOrigin(0, 0)
                .setDepth(5);
            context.physics.add.collider(fireAttackSprite, enemy, enemyHurtFire);
            attackCount++;
            playerFire--;
        }
    }
    if (playerIsFireAttacking) attackCount++;
    if (attackCount >= 45) {
        attackCount = 0;
        playerIsFireAttacking = false;
        fireAttackSprite.destroy();
    }
}


function LightningAttack(context) {
    if (playerLightning > 0) {
        if (lightningInput.isDown && attackCount == 0) {
            if (cursors.left.isDown) {
                lightningAttackSprite = context.physics.add.sprite(caseXToCoord(getCaseX(player.x) - 1) + 50, caseYToCoord(getCaseY(player.y) - 1) - 75, 'lightningAttackLeft')
                    .setOrigin(1, 0)
                    .setDepth(5);
                context.physics.add.collider(lightningAttackSprite, enemy, enemyHurtLightning);
                playerLightning--;
                attackCount++;
                playerIsLightningAttacking = true;
            } else if (cursors.up.isDown) {
                lightningAttackSprite = context.physics.add.sprite(caseXToCoord(getCaseX(player.x) - 1) - 50, caseYToCoord(getCaseY(player.y)) - 75, 'lightningAttackUp')
                    .setOrigin(0, 1)
                    .setDepth(5);
                context.physics.add.collider(lightningAttackSprite, enemy, enemyHurtLightning);
                playerLightning--;
                attackCount++;
                playerIsLightningAttacking = true;
            } else if (cursors.right.isDown) {
                lightningAttackSprite = context.physics.add.sprite(caseXToCoord(getCaseX(player.x) + 1) - 50, caseYToCoord(getCaseY(player.y) - 1) - 75, 'lightningAttackRight')
                    .setOrigin(0, 0)
                    .setDepth(5);
                context.physics.add.collider(lightningAttackSprite, enemy, enemyHurtLightning);
                playerLightning--;
                attackCount++;
                playerIsLightningAttacking = true;
            } else if (cursors.down.isDown) {
                lightningAttackSprite = context.physics.add.sprite(caseXToCoord(getCaseX(player.x) + 2) - 50, caseYToCoord(getCaseY(player.y) + 1) - 75, 'lightningAttackDown')
                    .setOrigin(1, 0)
                    .setDepth(5);
                context.physics.add.collider(lightningAttackSprite, enemy, enemyHurtLightning);
                playerLightning--;
                attackCount++;
                playerIsLightningAttacking = true;
            }

        }
    }
    if (playerIsLightningAttacking) attackCount++;
    if (attackCount >= 45 && playerIsLightningAttacking) {
        attackCount = 0;
        playerIsLightningAttacking = false;
        lightningAttackSprite.destroy();
    }
}


function enemyHurtFire() {
    if (!enemyInvincible) {
        enemyHp--;
        if (enemyHp > 0) {
            enemyInvincible = true;
        }
    }
}


function enemyHurtLightning() {
    if (!enemyInvincible) {
        enemyHp--;
        if (enemyHp > 0) {
            enemyInvincible = true;
        } else {
            enemy.destroy();
        }
    }
}


function lifeManagement() {
    if (playerHp <= 2 && uiHp2 != null) uiHp2.destroy();
    if (playerHp <= 1 && uiHp1 != null) uiHp1.destroy();
    if (playerHp == 0 && uiHp0 != null) uiHp0.destroy();
}


function colCheckerWall() {
    colCheckerReturns = true;
}


function colCheckerGround() {
    colCheckerReturns = false;
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


function enemyInvincibleManagement() {
    if (enemyInvincible) {
        if (enemyInvincibleCount != 50) {
            if (enemyInvincibleCount < 5) enemy.alpha = 0.1;
            else if (enemyInvincibleCount < 10) enemy.alpha = 1;
            else if (enemyInvincibleCount < 15) enemy.alpha = 0.1;
            else if (enemyInvincibleCount < 20) enemy.alpha = 1;
            else if (enemyInvincibleCount < 25) enemy.alpha = 0.1;
            else if (enemyInvincibleCount < 30) enemy.alpha = 1;
            else if (enemyInvincibleCount < 35) enemy.alpha = 0.1;
            else if (enemyInvincibleCount < 40) enemy.alpha = 1;
            else if (enemyInvincibleCount < 45) enemy.alpha = 0.1;
            else enemy.alpha = 1;
            enemyInvincibleCount++;
        } else {
            enemyInvincible = false;
            enemyInvincibleCount = 0;
        }
    }
}

function enemyDeath(context) {
    if (enemyHp == 0 && !enemyMort) {
        enemyLootType = Phaser.Math.Between(1, 3);
        if (enemyLootType == 1) {
            enemyLoot = context.physics.add.sprite(caseXToCoord(getCaseX(enemy.x)), caseYToCoord(getCaseY(enemy.y)), 'money')
                .setOrigin(.5, 1)
                .setDepth(2);
            context.physics.add.collider(colChecker, enemyLoot, pickupLootMoney);
        } else if (enemyLootType == 2) {
            enemyLoot = context.physics.add.sprite(caseXToCoord(getCaseX(enemy.x)), caseYToCoord(getCaseY(enemy.y)), 'fire')
                .setOrigin(.5, 1)
                .setDepth(2);
            context.physics.add.collider(colChecker, enemyLoot, pickupLootFire);
        } else if (enemyLootType == 3) {
            enemyLoot = context.physics.add.sprite(caseXToCoord(getCaseX(enemy.x)), caseYToCoord(getCaseY(enemy.y)), 'lightning')
                .setOrigin(.5, 1)
                .setDepth(2);
            context.physics.add.collider(colChecker, enemyLoot, pickupLootLightning);
        }
        enemyMort = true;
        enemy.destroy();
    }
}