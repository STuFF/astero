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
    game.load.spritesheet('bulletexplode', 'assets/sprites/bulletexplode.png', 16, 16);
}

function spawnRocks(stonesGroup, x, y, amount, size) {
    for (var i = 0; i < amount; i += 1) {
        var stone = stonesGroup.getFirstExists(false);
        if (stone) {
            stone.resetStone(x, y, size);
        }
    }
}

function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    stonesGroup = game.add.group();

    for (var i = 0; i < 100; i += 1) {
        var stone = new Stone1(game, 0, 0, 0);
        stone.explodeEvent.add(function (explodedStone) {
            if (explodedStone.stonesize < 2) {
                spawnRocks(stonesGroup, explodedStone.x, explodedStone.y, 3, explodedStone.stonesize += 1);
            }
        });

        stonesGroup.add(stone);
    }

    spawnRocks(stonesGroup, 250, 250, 3, 0);

    mainShip = new MainShip(game, 40, 40);
}


function update() {
    game.physics.arcade.overlap(mainShip, stonesGroup, function () {
         mainShip.explode();
    }, null, this);

    game.physics.arcade.overlap(mainShip.bulletsGroup, stonesGroup, function (bullet, stone) {
        bullet.explodeComponent.explode();
        stone.hit();
    }, null, this);
}

function render () {
    //useful for debug

    //game.debug.body(mainShip);
    //stonesGroup.forEach(function (stone) {
    //    game.debug.body(stone);
    //})
}
