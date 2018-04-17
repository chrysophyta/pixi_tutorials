function WallSpritesPool() {
  this.createWindows();
  this.createDecorations();
}

WallSpritesPool.prototype.borrowWindow = function() {
  return this.windows.shift();
};

WallSpritesPool.prototype.returnWindow = function(sprite) {
  this.windows.push(sprite);
};

WallSpritesPool.prototype.borrowDecoration = function() {
  return this.decorations.shift();
};

WallSpritesPool.prototype.returnDecoration = function(sprite) {
  this.decorations.push(sprite);
};

WallSpritesPool.prototype.createWindows = function() {
  this.windows = [];

  this.addWindowSprites(6, 'window_01');
  this.addWindowSprites(6, 'window_02');

  this.shuffle(this.windows);
};

WallSpritesPool.prototype.createDecorations = function() {
  this.decorations = [];

  this.addDecorationSprites(6, 'decoration_01');
  this.addDecorationSprites(6, 'decoration_02');
  this.addDecorationSprites(6, 'decoration_03');

  this.shuffle(this.decorations);
};

WallSpritesPool.prototype.addWindowSprites = function(amount, frameId) {
  for (var i = 0; i < amount; i++) {
    var sprite = PIXI.Sprite.fromFrame(frameId);
    this.windows.push(sprite);
  }
};

WallSpritesPool.prototype.addDecorationSprites = function(amount, frameId) {
  for (var i = 0; i < amount; i++) {
    var sprite = new PIXI.Sprite(PIXI.Texture.fromFrame(frameId));
    this.decorations.push(sprite);
  }
};

WallSpritesPool.prototype.shuffle = function(array) {
  var len = array.length;
  var shuffles = len * 3;
  for (var i = 0; i < shuffles; i++) {
    var wallSlice = array.pop();
    var pos = Math.floor(Math.random() * (len - 1));
    array.splice(pos, 0, wallSlice);
  }
};
