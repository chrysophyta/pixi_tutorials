function Far(texture, width, height) {
  PIXI.extras.TilingSprite.call(this, texture, width, height);
}

Far.prototype = Object.create(PIXI.extras.TilingSprite.prototype);
