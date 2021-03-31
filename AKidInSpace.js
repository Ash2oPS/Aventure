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
            gravity: {y: 700},
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

var textVictoire;

var debugText;

var introScreen;
var introScreenCount
var beginPlay

var background;
var bgSun;
var bgStars1;
var bgStars2;
var maya;
var mayaInvincible;
var mayaInvincibleTimer;
var mayaCanon;
var mayaWeightlessness

var mayaJumpTimer
var mayaJumpTimerBuffer
var mayaJumpVector
var mayaOrientation
var mayaHp
var mayaMaxHp
var mayaCanJump
var mayaHasJumped
var mayaStomping 
var mayaHasStomped

var mouseCursor;
var mouseCursorTrueXY;
var cursors;
var click;
var mayaBullet;
var mayaBulletGroup;
var mayaShootTypeUnlocked
var mayaShootType
var mayaShootRate
var mayaShootRateCount
var mayaShootSpeed
var mayaCanShoot

var powerUp;

//UI

var lifeGauge;
var lifeGaugeText;
var heartbeat;
var heartbeatRate

//ENNEMIS

var spaceBee1;
var spaceBee1Alive;
var spaceBee1hp;
var spaceBee1Power;
var spaceBee1Rate;
var spaceBee1Count;
var spaceBee1X;
var spaceBee1Y;
var spaceBee1frequency;
var spaceBee1amplitude;
var spaceBee1timer;

var spaceBee2;
var spaceBee2Alive;
var spaceBee2hp;
var spaceBee2Power;
var spaceBee2Rate;
var spaceBee2Count;
var spaceBee2X;
var spaceBee2Y;
var spaceBee2frequency;
var spaceBee2amplitude;
var spaceBee2timer;

var spaceBee3;
var spaceBee3Alive;
var spaceBee3hp;
var spaceBee3Power;
var spaceBee3Rate;
var spaceBee3Count;
var spaceBee3X;
var spaceBee3Y;
var spaceBee3frequency;
var spaceBee3amplitude;
var spaceBee3timer;


var spaceBeeInvincible;
var spaceBeeframes;



////////// PRELOAD //////////

function preload(){

    // TILED

    this.load.image('tiles', 'assets/Tiled/TILED1.png');
    this.load.tilemapTiledJSON('map', 'assets/Tiled/map.json');

    // Backgrounds

    this.load.image('background', 'assets/spr_Background.png');
    this.load.image('bgSun', 'assets/spr_Soleil.png');
    this.load.image('bgStars1', 'assets/spr_Etoiles1.png');
    this.load.image('bgStars2', 'assets/spr_Etoiles2.png');
    // Acteurs actifs

    this.load.spritesheet('maya', 'assets/Maya/sprsht_MayaIdle.png', {frameWidth : 256, frameHeight : 256});
    //this.load.spritesheet('mayaBullet', 'assets/Maya/spr_MayaBullet.png', { frameWidth: 44, frameHeight: 44 });
    this.load.image('mayaCanon', 'assets/Maya/canon.png');
    this.load.spritesheet('mayaBullet', 'assets/Maya/spr_MayaBullet.png', {frameWidth : 44, frameHeight : 44});

    this.load.spritesheet('powerUp', 'assets/Maya/sprsht_powerup1.png', {frameWidth : 340, frameHeight : 256});

    //Platforms 

    this.load.image('ground', 'assets/spr_Platform1.png');

    // Divers

    this.load.image('mouseCursor', 'assets/spr_Cursor.png');

    // UI

    this.load.image('lifeGauge', 'assets/UI/spr_LifeGauge.png');
    this.load.spritesheet('heartbeat', 'assets/UI/sprsht_Heartbeat.png', {frameWidth : 84, frameHeight : 84});

    // Intro.

    this.load.image('intro', 'assets/introScrn.png');

    //Ennemis

    this.load.spritesheet('spaceBee', 'assets/Ennemy/sprsht_Ennemy.png', { frameWidth : 256, frameHeight : 256});
    this.load.spritesheet('spaceBee2', 'assets/Ennemy/sprsht_Ennemy2.png', { frameWidth : 256, frameHeight : 256});
    this.load.spritesheet('spaceBee3', 'assets/Ennemy/sprsht_Ennemy3.png', { frameWidth : 512, frameHeight : 512});
    

}

////////// CREATE //////////

function create(){

    introScreenCount = 0;
    beginPlay = false;

    mayaWeightlessness = false;

    mayaJumpTimer = 0;
    mayaJumpTimerBuffer = -1;
    mayaJumpVector = 0;
    mayaOrientation = 1;
    mayaInvincible = false;
    mayaInvincibleTimer = 0;
    mayaHp = 255;
    mayaMaxHp = 255;
    mayaCanJump = false;
    mayaHasJumped = false;
    mayaStomping = false;
    mayaHasStomped = false;

    mayaShootTypeUnlocked = false;
    mayaShootType = 0;
    mayaShootRate = 40;
    mayaShootRateCount = 0;
    mayaShootSpeed = 2000;
    mayaCanShoot = true;

    heartbeatRate = 4;

    // DEBUG TEXT
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
    
    // Inputs
    
    cursors = this.input.keyboard.addKeys(
        {up:Phaser.Input.Keyboard.KeyCodes.SPACE,
        down:Phaser.Input.Keyboard.KeyCodes.S,
        left:Phaser.Input.Keyboard.KeyCodes.Q,
        right:Phaser.Input.Keyboard.KeyCodes.D});
    click = this.input.activePointer.isDown;

    // Backgrounds

    background = this.add.image(0, 0, 'background')
    .setScrollFactor(0)
    .setOrigin(0, 0);

    bgSun = this.add.image(1400, 320, 'bgSun')
    .setScrollFactor(0.15);

    bgStars1 = this.add.image(0, 0, 'bgStars1')
    .setScrollFactor(0.03)
    .setOrigin(0,0);

    bgStars2 = this.add.image(0, 0, 'bgStars2')
    .setScrollFactor(0.07)
    .setOrigin(0,0);

    // TILED

    const map = this.make.tilemap({key: 'map'});
    const tileset = map.addTilesetImage('TILED1', 'tiles');

    var spaceBG0_Layer = map.createLayer('SpaceBG0', tileset);
    var spaceBG1_Layer = map.createLayer('SpaceBG1', tileset);
    var spaceBG2_Layer = map.createLayer('SpaceBG2', tileset);
    var mursBg_Layer = map.createLayer('MursBg', tileset);
    var details_Layer = map.createLayer('Details', tileset);
    var degrades_Layer = map.createLayer('Degrades', tileset);
    var pics_Layer = map.createLayer('Pics', tileset);
    var platforms_Layer = map.createLayer('Platforms', tileset);
    var picsDegrades_Layer = map.createLayer('PicsDegrades', tileset);
    var mursExternes_Layer = map.createLayer('MursExternes', tileset);

    platforms_Layer.setCollisionByExclusion(-1,true);
    pics_Layer.setCollisionByExclusion(-1,true);
    mursExternes_Layer.setCollisionByExclusion(-1, true);

    /*spaceBG0_Layer.setScrollFactor(0.3);
    spaceBG1_Layer.setScrollFactor(0.25);*/



    // Maya

    maya = this.physics.add.sprite(4096, 3000, 'maya').setDepth(1);
    maya.body.collideWorldBounds = false;
    mayaCanon = this.physics.add.sprite(maya.x - 20, maya.y - 51, 'mayaCanon').setDepth(0.9);
    mayaCanon.body.setAllowGravity(false);

    this.anims.create({
        key :'maya_Idle1',
        frames : this.anims.generateFrameNumbers('maya', {start :0, end: 5}),
        frameRate : 5,
        repeat : -1
    });

    // Maya Bullet


    this.anims.create({
        key :'mayaBulletShot1',
        frames : this.anims.generateFrameNumbers('mayaBullet', {start :0, end: 2}),
        frameRate : 7,
        repeat : -1
    });
    this.anims.create({
        key :'mayaBulletShot2',
        frames : this.anims.generateFrameNumbers('mayaBullet', {start :3, end: 5}),
        frameRate : 7,
        repeat : -1
    });
    this.anims.create({
        key :'mayaBulletShot3',
        frames : this.anims.generateFrameNumbers('mayaBullet', {start :6, end: 8}),
        frameRate : 7,
        repeat : -1
    });
    this.anims.create({
        key :'mayaBulletShot4',
        frames : this.anims.generateFrameNumbers('mayaBullet', {start :9, end: 11}),
        frameRate : 7,
        repeat : -1
    });
    this.anims.create({
        key :'mayaBulletShot5',
        frames : this.anims.generateFrameNumbers('mayaBullet', {start :12, end: 14}),
        frameRate : 7,
        repeat : -1
    });
    this.anims.create({
        key :'mayaBulletShot6',
        frames : this.anims.generateFrameNumbers('mayaBullet', {start :15, end: 17}),
        frameRate : 7,
        repeat : -1
    });

    powerUp = this.physics.add.sprite(15744, 4484, 'powerUp');
    powerUp.body.setAllowGravity(false);

    this.anims.create({
        key :'powerUpAnim',
        frames : this.anims.generateFrameNumbers('powerUp', {start :0, end: 5}),
        frameRate : 7,
        repeat : -1
    });

    powerUp.play('powerUpAnim');


    // Divers

    mouseCursor = this.add.image(game.input.mousePointer.x, game.input.mousePointer.y, 'mouseCursor')
    .setScrollFactor(1);

    //mouseCursorTrueXY = this.add.image(game.input.mousePointer.x, game.input.mousePointer.y, 'mouseCursor')
    //.alpha = 0;

    //UI

    lifeGauge = this.add.image(64, 64, 'lifeGauge')
    .setScrollFactor(0)
    .setDepth(1)
    .setOrigin(0, 0);

    heartbeat = this.add.sprite(144, 42, 'heartbeat')
    .setScrollFactor(0)
    .setDepth(1)
    .setOrigin(0,0);

    this.anims.create({
        key :'heartbeatAnim',
        frames : this.anims.generateFrameNumbers('heartbeat', {start :0, end: 6}),
        frameRate : heartbeatRate,
        repeat : -1
    });
    this.anims.create({
        key :'heartbeatAnim2',
        frames : this.anims.generateFrameNumbers('heartbeat', {start :0, end: 6}),
        frameRate : heartbeatRate,
        repeat : -1
    });
    this.anims.create({
        key :'heartbeatAnim3',
        frames : this.anims.generateFrameNumbers('heartbeat', {start :0, end: 6}),
        frameRate : heartbeatRate,
        repeat : -1
    });
    this.anims.create({
        key :'heartbeatAnim4',
        frames : this.anims.generateFrameNumbers('heartbeat', {start :0, end: 6}),
        frameRate : heartbeatRate,
        repeat : -1
    });
    this.anims.create({
        key :'heartbeatAnim5',
        frames : this.anims.generateFrameNumbers('heartbeat', {start :0, end: 6}),
        frameRate : heartbeatRate,
        repeat : -1
    });

    lifeGaugeText = this.add.text(100, 75, mayaHp, {
        padding: { x: 10, y: 5 },
        fill: '#000000'
    });

    lifeGaugeText.setScrollFactor(0)
    .setOrigin(0, 0)
    .setDepth(1);


    // Intro

    if(!beginPlay){
    introScreen = this.add.image(0, 0, 'intro')
    .setScrollFactor(0)
    .setOrigin(0, 0)
    .setDepth(1.5);
    }

    // Camera

    this.cameras.main.startFollow(maya);
    this.cameras.main.setBounds(0, 0, maya.widthInPixels, maya.heightInPixels);

    // Ennemis

    spaceBee1X = 6400;
    spaceBee1Y = 2900;
    spaceBee1Alive = true;
    spaceBee1hp = 200;
    spaceBee1Power = 30;
    spaceBee1Rate = 120;
    spaceBee1Count = 0
    spaceBee1frequency = 0.1;
    spaceBee1amplitude = 120;
    spaceBee1timer = 0;

    spaceBee2Alive = true;
    spaceBee2hp = 800;
    spaceBee2Power = 50;
    spaceBee2Rate = 100;
    spaceBee2Count = 0;
    spaceBee2X = 18816;
    spaceBee2Y = 4088;
    spaceBee2frequency = 0.1;
    spaceBee2amplitude = 120;
    spaceBee2timer = 0;

    spaceBee3Alive = true;
    spaceBee3hp = 4000;
    spaceBee3Power = 70;
    spaceBee3Rate = 400;
    spaceBee3Count = 0;
    spaceBee3X = 30984;
    spaceBee3Y = 4864;
    spaceBee3frequency = 0.02;
    spaceBee3amplitude = 200;
    spaceBee3timer = 0;

    spaceBeeframes = 0;
    spaceBeeInvincible = false;
    
    spaceBee1 = this.physics.add.sprite(spaceBee1X, spaceBee1Y, 'spaceBee');
    spaceBee1.body.setAllowGravity(false);

    spaceBee2 = this.physics.add.sprite(spaceBee2X, spaceBee2Y, 'spaceBee2');
    spaceBee2.body.setAllowGravity(false);

    spaceBee3 = this.physics.add.sprite(spaceBee3X, spaceBee3Y, 'spaceBee3');
    spaceBee3.body.setAllowGravity(false);

    this.anims.create({
        key :'spaceBeeAnim',
        frames : this.anims.generateFrameNumbers('spaceBee', {start :0, end: 3}),
        frameRate : 12,
        repeat : -1
    });

    this.anims.create({
        key :'spaceBeeAnim2',
        frames : this.anims.generateFrameNumbers('spaceBee2', {start :0, end: 3}),
        frameRate : 12,
        repeat : -1
    });

    this.anims.create({
        key :'spaceBeeAnim3',
        frames : this.anims.generateFrameNumbers('spaceBee3', {start :0, end: 3}),
        frameRate : 10,
        repeat : -1
    });

    //COLLIDERS

    this.physics.add.collider(maya, platforms_Layer);
    this.physics.add.collider(maya, pics_Layer, function(){mayaHp = 0});
    this.physics.add.collider(maya, mursExternes_Layer);

    this.physics.add.collider(maya, spaceBee1, mayaHurtSB1);
    this.physics.add.collider(spaceBee1, maya, mayaHurtSB1);

    this.physics.add.collider(maya, spaceBee2, mayaHurtSB2);
    this.physics.add.collider(spaceBee2, maya, mayaHurtSB2);

    this.physics.add.collider(maya, spaceBee3, mayaHurtSB3);
    this.physics.add.collider(spaceBee3, maya, mayaHurtSB3);
    //this.physics.add.collider(spaceBee1, mayaBullet,function(){console.log('aie')} /*spaceBee1CaFaitMal*/);
    
    this.physics.add.collider(maya, powerUp, powerUpDest);

    /*this.physics.world.addCollider(player, enemies, hitplayer, null, this);
    this.physics.add.collider(enemies, wallsLayer);
    this.physics.add.overlap(enemies, shoots,hitenemies, null, this);
    this.physics.add.collider(shoots, wallsLayer,hitwalls, null, this);
    this.physics.add.collider(lazers, wallsLayer,hitwalls, null, this);
    this.physics.add.overlap(player,lazers, deathplayer, null, this);
    this.physics.add.overlap(player, bullet1,addmun, null, this);
    this.physics.add.overlap(player, bullet2,addmun, null, this);
    this.physics.add.overlap(player, bullet3,addmun, null, this);
    this.physics.add.overlap(player, Moon,EndGame, null, this);*/


}

////////// UPDATE //////////

function update(){

    // DEBUG TEXT
    if (config.physics.arcade.debug){
        debugText.setText('maya blocked Down : ' + maya.body.blocked.down + '    maya weightlessness : ' + mayaWeightlessness + 
        '\nmaya can Jump : ' + mayaCanJump + '    maya has Jumped : ' + mayaHasJumped + 
        '\nmaya Jump Timer : ' + mayaJumpTimer + '    maya Jump Timer Buffer : ' + mayaJumpTimerBuffer +
        '\n spacebee2 hp:' + spaceBee2hp + 'spacebee3 hp' + spaceBee3hp
        );
    }

    //

    if(spaceBee3Alive){

        if(!beginPlay)
            intro();
        else{

            if (spaceBeeInvincible){
                spaceBeeframes ++;
                if (spaceBeeframes >= 6){
                    spaceBeeframes = 0
                    spaceBeeInvincible = false;
                    spaceBee1.setTint(0xffffff);
                    spaceBee2.setTint(0xffffff);
                    spaceBee3.setTint(0xffffff);
                }
                
            }

            if (mayaHp <= 0)  mayaDeath(this)

            mayaInviManagement();

            spaceBee1_behav();
            spaceBee2_behav();
            spaceBee3_behav();

            uiAnims(this);  

            if (introScreenCount >= 240 && introScreenCount < 340)
                introScreen.alpha -= 0.01;

            // Backgrounds

            bgSun.rotation += .0005;

            // Maya


            if ((maya.x > 7800 && maya.x <13440) || maya.x > 21640){
                mayaWeightlessness = true;
            } else  mayaWeightlessness = false;

            if (!mayaWeightlessness){
                if (maya.body.blocked.down){              // L'animation a un soucis. Je dois inverser la condition de touching down
                    if (!maya.anims.isPlaying) {
                        maya.play('maya_Idle1');               // sinon elle se joue dans les airs. De plsu, elle ne fonctionne
                    }else if(maya.anims.CurrentKey != 'maya_Idle1'){
                        maya.play('maya_Idle1');
                    }
                }                                           // qu'après avoir sauté une première fois
                mayaPlatformerControl(this);
            } else{
                mayaWeightlessnessControl(this)
            }

            // Curseur et tir

            cursorPosition()

            if (this.input.activePointer.isDown)
            {
                mayaFire(this);
                
            }

            if (!mayaCanShoot){
                if (mayaShootRateCount < mayaShootRate){
                    mayaShootRateCount ++;
                } else {
                    mayaCanShoot = true;
                    mayaShootRateCount = 0;
                }
            }

            mayaCanon.x = maya.x - 20 * mayaOrientation;    // le canon suit Maya avec une frame de retard 
            mayaCanon.y = maya.y - 51;                      // Dans l'idéal, il faudrait dire que Canon est enfant de Maya ?
            mayaCanon.rotation = Phaser.Math.Angle.BetweenPoints(mayaCanon, mouseCursor);


        }

    }else {
        textVictoire = this.add.text(200, 200,"Vous avez gagné ! Appuyez sur Espace pour recommencer !", {
            fontSize: '32px',
            padding: { x: 10, y: 5 },
            backgroundColor: '#000000',
            fill: '#ffffff'
        });
        textVictoire.setScrollFactor(0);

        if (cursors.up.isDown){
            this.scene.restart();
        }
    }

}


////////// FONCTIONS //////////


function cursorPosition(){
    mouseCursor.x = game.input.mousePointer.x + maya.x - (screenWidth/2);
    mouseCursor.y = game.input.mousePointer.y + maya.y - (screenHeight/2);

    //mouseCursorTrueXY.x = game.input.mousePointer.x
    //mouseCursorTrueXY.y = game.input.mousePointer.y
}

function mayaFire(context){
    if (mayaCanShoot){
        if (!mayaShootTypeUnlocked){
            maya.setVelocityX(350 * Math.cos(Phaser.Math.Angle.BetweenPoints(mayaCanon, mouseCursor) + Math.PI));
            maya.setVelocityY(350 * Math.sin(Phaser.Math.Angle.BetweenPoints(mayaCanon, mouseCursor) + Math.PI));
        }else{
            maya.setVelocityX(650 * Math.cos(Phaser.Math.Angle.BetweenPoints(mayaCanon, mouseCursor) + Math.PI));
            maya.setVelocityY(650 * Math.sin(Phaser.Math.Angle.BetweenPoints(mayaCanon, mouseCursor) + Math.PI));
        }
        mayaCanShoot = false;

        if (!mayaShootTypeUnlocked){
            mayaShootType = 0;    
        }


        /*for (const mayaBullet of mayaBulletGroup.children.entries) {
            if (enemie.body.blocked.right) {
                enemie.direction = 'LEFT';
            }
    
            if (enemie.body.blocked.left) {
                enemie.direction = 'RIGHT';
            }
    
            if (enemie.direction === 'RIGHT') {
                enemie.setVelocityX(100);
                enemie.setFlipX(false);
                enemie.anims.play("enemierun", true);
            } else {
                enemie.setVelocityX(-100);
                enemie.setFlipX(true);
                enemie.anims.play("enemierun", true);
            }
           
        }*/

        mayaBullet = context.physics.add.sprite(maya.x - 20 * mayaOrientation, maya.y - 51, 'mayaBullet');
        mayaBullet.rotation = Phaser.Math.Angle.BetweenPoints(mayaBullet, mouseCursor);
        mayaBullet.body.setAllowGravity(false);
        mayaBullet.checkWorldBounds = true;
        context.physics.add.overlap(spaceBee1, mayaBullet, spaceBee1CaFaitMal);
        context.physics.add.overlap(spaceBee2, mayaBullet, spaceBee2CaFaitMal);
        context.physics.add.overlap(spaceBee3, mayaBullet, spaceBee3CaFaitMal);
        context.physics.angleTo;
        context.physics.moveTo(mayaBullet, mouseCursor.x, mouseCursor.y, mayaShootSpeed);


        if (mayaShootType == 0){
            mayaBullet.play('mayaBulletShot1');
        } else if (mayaShootType == 1){
            mayaBullet.play('mayaBulletShot2');
        } else if (mayaShootType == 2){
            mayaBullet.play('mayaBulletShot3');
        } else if (mayaShootType == 3){
            mayaBullet.play('mayaBulletShot4');
        } else if (mayaShootType == 4){
            mayaBullet.play('mayaBulletShot5');
        } else if (mayaShootType == 5){
            mayaBullet.play('mayaBulletShot6');
        }

        if (mayaShootTypeUnlocked){
            mayaShootRate = 1;
            mayaShootType ++;
            if (mayaShootType >= 6)
                mayaShootType = 0;  
        } else {
            mayaShootRate = 40;
        }
    }
}

function mayaPlatformerControl(context){

    maya.body.setAllowGravity(true);

    if (maya.body.blocked.down && !cursors.right.isDown  && !cursors.left.isDown){
        maya.setVelocityX(0)
    }

    // Jump
    if (maya.body.blocked.down && !mayaHasJumped && !cursors.down.isDown){                     // Si maya touche le sol et n'a pas sauté
        mayaCanJump = true;                                           // Maya peut sauter                                            // Maya peut sauter 
    }else{
        mayaCanJump = false;                           // Maya ne peut pas sauter
    }

    if(cursors.up.isDown && mayaCanJump){                                  
        maya.setVelocityY(-700);
        mayaHasJumped = true;
    }


    if(!cursors.up.isDown && maya.body.blocked.down){                                             // Si on appuie pas sur Haut
        mayaHasJumped = false;                                       // Maya n'a pas sauté
    }


    // Left and Right
    if(cursors.left.isDown){
        maya.setVelocityX(-450);
        if (mayaOrientation == 1)
            mayaOrientation = -1;
            maya.flipX = true;
    }

    if(cursors.right.isDown){
        maya.setVelocityX(450);
        if (mayaOrientation == -1)
            mayaOrientation = 1;
            maya.flipX = false;
    }

    // Stomp
    
    if(cursors.down.isDown && !maya.body.blocked.down && !mayaStomping){  // Si Bas est appuyé, si Maya ne touche pas le sol et qu'elle n'esrt pas déjà en train de stomper
        mayaStomping = true;                                             // Maya est en train de stomper (ça veut pas dire grand-chose mais tant pis, je trouve pas la traduction FR, mais bon, d'un autre côté, tout le monde comprend, enfin je crois, sinon, bah tant pis)
        mayaCanJump = false;                                             // Maya ne peut pas sauter
    }
    
    if (mayaStomping){                                                  // Si Maya est en train de stomper                                             
        maya.setVelocity(0, 800);                                       // Maya charge le sol en annulant les autres directions
        if (maya.body.blocked.down){                                   // Si Maya entre en contact avec le sol                              
            mayaStomping = false;
        }
    } else {
        mayaHasStomped = false;
    }
}

function intro(){
    introScreenCount ++;
    if (introScreenCount == 239){
        beginPlay = true;
        introScreenCount ++;
    }
}

function uiAnims(context){
    if (!heartbeat.anims.isPlaying) {
        heartbeat.play('heartbeatAnim');
    }

    if (mayaHp >= 200)  heartbeatRate = 4;
    else if (mayaHp >= 150)  heartbeatRate = 6;
    else if (mayaHp >= 100)  heartbeatRate = 8;
    else if (mayaHp >= 50)  heartbeatRate = 10;
    else if (mayaHp >= 1)  heartbeatRate = 16;
    else if (mayaHp == 1)  heartbeatRate = 0;

    lifeGaugeText.setText(mayaHp);
}

function mayaWeightlessnessControl(context){
    maya.body.setAllowGravity(false);
}

function mayaDeath(context){
    context.scene.restart();
}

function mayaInviManagement(){
    if(mayaInvincible){
        if (mayaInvincibleTimer < 60){
            if (mayaInvincibleTimer < 10)   maya.alpha = 0.2;
            else if (mayaInvincibleTimer < 15)   maya.alpha = 0.5;
            else if (mayaInvincibleTimer < 20)   maya.alpha = 0.2;
            else if (mayaInvincibleTimer < 25)   maya.alpha = 0.5;
            else if (mayaInvincibleTimer < 30)   maya.alpha = 0.2;
            else if (mayaInvincibleTimer < 35)   maya.alpha = 0.5;
            else if (mayaInvincibleTimer < 40)   maya.alpha = 0.2;
            else if (mayaInvincibleTimer < 45)   maya.alpha = 0.5;
            else if (mayaInvincibleTimer < 50)   maya.alpha = 0.2;
            else if (mayaInvincibleTimer < 55)   maya.alpha = 0.5;
        }else{
            maya.alpha = 1;
            mayaInvincibleTimer = 0
            mayaInvincible = false;
        }
        mayaInvincibleTimer ++;
    }

}

function powerUpDest(){
    mayaShootTypeUnlocked = true;
    powerUp.destroy(); 
}

function spaceBee1_behav(){

    if(spaceBee1Alive){
    if(!spaceBee1.anims.isPlaying)
        spaceBee1.play('spaceBeeAnim')
        
    spaceBee1.y = spaceBee1Y + Math.sin(spaceBee1timer*spaceBee1frequency)*spaceBee1amplitude;
    spaceBee1timer ++;

    if(maya.x > spaceBee1.x - 600){

        if(spaceBee1Count >= spaceBee1Rate)
        spaceBee1.setVelocityX(400 * Math.cos(Phaser.Math.Angle.BetweenPoints(spaceBee1, maya)));
        spaceBee1.setVelocityY(400 * Math.sin(Phaser.Math.Angle.BetweenPoints(spaceBee1, maya)));
    }
        if((spaceBee1Count >= spaceBee1Rate + 150)){
            spaceBee1Count = 0
            spaceBee1.setVelocity(0, 0);
        }

        spaceBee1Count++;
    
}

}

function spaceBee1CaFaitMal(){

    if (!spaceBeeInvincible){
        spaceBee1hp -=20;

        if (spaceBee1hp <=0){
            spaceBee1.destroy(); 
            spaceBee1Alive = false;
        }


        spaceBeeInvincible = true;

        spaceBee1.setTint(0xff0000);
    }

    
}

function mayaHurtSB1(){
    if(!mayaInvincible){
    mayaInvincible = true;
    mayaHp -= spaceBee1Power;
    }
}

//-----------------------------------------------

function spaceBee2_behav(){

    if(spaceBee2Alive){
    if(!spaceBee2.anims.isPlaying)
        spaceBee2.play('spaceBeeAnim2')
        
    spaceBee2.y = spaceBee2Y + Math.sin(spaceBee2timer*spaceBee2frequency)*spaceBee2amplitude;
    spaceBee2timer ++;

    if(maya.x > spaceBee2.x - 600){

    
        if(spaceBee2Count >= spaceBee2Rate)
        spaceBee2.setVelocityX(400 * Math.cos(Phaser.Math.Angle.BetweenPoints(spaceBee2, maya)));
        spaceBee2.setVelocityY(400 * Math.sin(Phaser.Math.Angle.BetweenPoints(spaceBee2, maya)));
    }
        if((spaceBee2Count >= spaceBee2Rate + 150)){
            spaceBee2Count = 0
            spaceBee2.setVelocity(0, 0);
        }

            spaceBee2Count++;
        }
    

}

function spaceBee2CaFaitMal(){

    if (!spaceBeeInvincible){
        spaceBee2hp -=20;

        if (spaceBee2hp <=0){
            spaceBee2.destroy(); 
            spaceBee2Alive = false;
        }


        spaceBeeInvincible = true;

        spaceBee2.setTint(0xff0000);
    }

    
}

function mayaHurtSB2(){
    if(!mayaInvincible){
    mayaInvincible = true;
    mayaHp -= spaceBee2Power;
    }
}

//-----------------------------------------------

function spaceBee3_behav(){

    if(spaceBee3Alive){
    if(!spaceBee3.anims.isPlaying)
        spaceBee3.play('spaceBeeAnim3')
        
    spaceBee3.y = spaceBee3Y + Math.sin(spaceBee3timer*spaceBee3frequency)*spaceBee3amplitude;
    spaceBee3timer ++;

    if(maya.x > spaceBee1.x - 900){

    
        if(spaceBee3Count >= spaceBee3Rate)
        spaceBee3.setVelocityX(400 * Math.cos(Phaser.Math.Angle.BetweenPoints(spaceBee3, maya)));
        spaceBee3.setVelocityY(400 * Math.sin(Phaser.Math.Angle.BetweenPoints(spaceBee3, maya)));
    }
        if((spaceBee3Count >= spaceBee3Rate + 150)){
            spaceBee3Count = 0
            spaceBee3.setVelocity(0, 0);
        }

        spaceBee3Count++;
    

}

}

function spaceBee3CaFaitMal(){

    if (!spaceBeeInvincible){
        spaceBee3hp -=20;

        if (spaceBee3hp <=0){
            spaceBee3.destroy(); 
            spaceBee3Alive = false;
        }


        spaceBeeInvincible = true;

        spaceBee3.setTint(0xff0000);
    }

    
}

function mayaHurtSB3(){
    if(!mayaInvincible){
    mayaInvincible = true;
    mayaHp -= spaceBee3Power;
    }
}