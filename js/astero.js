var MainShip = require('./prefabs/MainShip');
var Stone1 = require('./prefabs/Stone1');

var game = new Phaser.Game(500, 500, Phaser.AUTO, 'ASTERO', { preload: preload, create: create, update: update, render: render });
var ship;
var stonesGroup;
var mainShip;

function preload() {
    game.load.spritesheet('ship', 'assets/sprites/ship.png', 32, 36);
    game.load.spritesheet('bullet', 'assets/sprites/bullet.png', 16, 16);
    game.load.spritesheet('stone1', 'assets/sprites/stone1.png', 72, 72);
    game.load.spritesheet('shipexplode', 'assets/sprites/shipexplode.png', 32, 32);
}

function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    stonesGroup = game.add.group();

    stonesGroup.add(new Stone1(game));
    stonesGroup.add(new Stone1(game));
    stonesGroup.add(new Stone1(game));

    //ship = game.add.sprite(200, 200, 'ship');
    //ship.anchor.setTo(0.5);
    //game.physics.enable(ship, Phaser.Physics.ARCADE);
    //
    //ship.body.drag.set(100);
    //ship.body.maxVelocity.set(300);


    mainShip = new MainShip(game, 40, 40);

    //  Game input
    //cursors = game.input.keyboard.createCursorKeys();
    //game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);
}


function update() {
    game.physics.arcade.overlap(mainShip, stonesGroup, function (a, b) {
        console.log('ok');
        mainShip.explode();
    }, null, this);




    //if (cursors.up.isDown)
    //{
    //    game.physics.arcade.accelerationFromRotation((ship.rotation - Phaser.Math.degToRad(90)), 200, ship.body.acceleration);
    //}
    //else
    //{
    //    ship.body.acceleration.set(0);
    //}
    //
    //if (cursors.left.isDown)
    //{
    //    ship.body.angularVelocity = -300;
    //}
    //else if (cursors.right.isDown)
    //{
    //    ship.body.angularVelocity = 300;
    //}
    //else
    //{
    //    ship.body.angularVelocity = 0;
    //}
    //
    //utils.screenWrap(game, ship);

}

function render () {
    //game.debug.body(mainShip);
    //stonesGroup.forEach(function (stone) {
    //    game.debug.body(stone);
    //})
}
