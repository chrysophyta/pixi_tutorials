function Walls() {
  PIXI.Container.call(this);
  this.pool = new WallSpritesPool();
  this.createLookupTables();
}

Walls.prototype = Object.create(PIXI.Container.prototype);
Walls.prototype.createLookupTables = function() {
  this.borrowWallSpriteLookup = [];
  this.borrowWallSpriteLookup[SliceType.FRONT] = this.pool.borrowFrontEdge;
  this.borrowWallSpriteLookup[SliceType.BACK] = this.pool.borrowBackEdge;
  this.borrowWallSpriteLookup[SliceType.STEP] = this.pool.borrowStep;
  this.borrowWallSpriteLookup[
    SliceType.DECORATION
  ] = this.pool.borrowDecoration;
  this.borrowWallSpriteLookup[SliceType.WINDOW] = this.pool.borrowWindow;

  this.returnWallSpriteLookup = [];
  this.returnWallSpriteLookup[SliceType.FRONT] = this.pool.returnFrontEdge;
  this.returnWallSpriteLookup[SliceType.BACK] = this.pool.returnBackEdge;
  this.returnWallSpriteLookup[SliceType.STEP] = this.pool.returnStep;
  this.returnWallSpriteLookup[
    SliceType.DECORATION
  ] = this.pool.returnDecoration;
  this.returnWallSpriteLookup[SliceType.WINDOW] = this.pool.returnWindow;
};
