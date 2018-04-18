function Walls() {
  PIXI.Container.call(this);
  this.pool = new WallSpritesPool();
}

Walls.prototype = Object.create(PIXI.Container.prototype);
