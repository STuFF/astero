var cache = {};

var FlashComponent = function (from, animation) {
    this.anim = animation;
    this.spriteSheetName = this.anim.name + '_flash';
    this.from = from;

    var game = from.game,
        anim = from.animations.currentAnim;

    if (!cache[anim.name]) {
        var bmd = this._createSpriteBitmap();
        this._fillSpriteBitmap(bmd);

        var img = new Image();
        img.src = bmd.canvas.toDataURL();
        game.cache.addSpriteSheet(this.spriteSheetName, null, img, this.from.width, this.from.height, this.anim.frameTotal, 0, 0);

        cache[anim.name] = bmd;
    }

    this.sprite = this._createSprite();

};

FlashComponent.prototype._createSprite = function () {
    var flash = new Phaser.Sprite(this.from.game, 200, 200, this.spriteSheetName, 0),
        animName = this.spriteSheetName + '_anim';

    flash.animations.add(animName, this.anim._frames, (1000 / this.anim.delay), true);
    flash.animations.play(animName);
    flash.anchor.setTo(0.5);
    //flash.scale.copyFrom(this.from.scale);

    this.from.game.add.existing(flash);
    flash.kill();

    flash.update = function () {
        flash.x = this.from.x;
        flash.y = this.from.y;
    }.bind(this);

    return flash;
};

FlashComponent.prototype._createSpriteBitmap = function () {
    var bmd,
        game = this.from.game,
        savedAnchor = this.from.anchor.clone(),
        col = Math.floor(256 / this.from.width),
        row = Math.ceil(this.anim.frameTotal / col);

    this.from.anchor.setTo(0, 0);
    bmd = game.make.bitmapData(256, row * this.from.height);

    for (var i = 0, l = this.anim.frameTotal; i < l; i += 1) {
        this.from.frame = i;
        bmd.draw(this.from, (i % col) * this.from.width, Math.floor(i / col) * this.from.height);
    }

    bmd.update();

    this.from.anchor.copyFrom(savedAnchor);

    return bmd;
};

FlashComponent.prototype._fillSpriteBitmap = function (bmd) {
    bmd.processPixelRGB(function (pixel) {
        if (pixel.a !== 0) {
            pixel.r = 255;
            pixel.g = 255;
            pixel.b = 255;
        }
        return pixel;
    }, this);
};

FlashComponent.prototype.flash = function () {
    if (this.flashTween) {
        this.flashTween.stop();
    }

    this.sprite.reset(this.from.x, this.from.y);
    this.sprite.alpha = 1;
    this.flashTween = this.from.game.add.tween(this.sprite).to({ alpha: 0 }, 500, Phaser.Easing.Exponential.Out, true);
};


module.exports = {
    create: function (from, animation) {
        return new FlashComponent(from, animation);
    }
};
