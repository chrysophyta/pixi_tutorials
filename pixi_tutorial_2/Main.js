function Main() {
  this.stage = new PIXI.Container();
  this.renderer = PIXI.autoDetectRenderer(512, 384, {
    view: document.getElementById('game-canvas')
  });
  this.loadSpriteSheet();
}
Main.SCROLL_SPEED = 5;

Main.prototype.update = function() {
  this.scroller.moveViewportXBy(Main.SCROLL_SPEED);
  this.renderer.render(this.stage);
  requestAnimationFrame(this.update.bind(this));
};
Main.prototype.loadSpriteSheet = function() {
  var loader = PIXI.loader;
  loader.add('wall', 'resources/wall.json');
  loader.add('bg-mid', 'resources/bg-mid.png');
  loader.add('bg-far', 'resources/bg-far.png');
  loader.once('complete', this.spriteSheetLoaded.bind(this));
  loader.load();
};

Main.prototype.spriteSheetLoaded = function() {
  this.scroller = new Scroller(this.stage);
  requestAnimationFrame(this.update.bind(this));
  this.pool = new WallSpritesPool();
  this.wallSlices = [];
};

Main.prototype.borrowWallSprites = function(num) {
  for (var i = 0; i < num; i++) {
    if (i % 2 == 0) {
      var sprite = this.pool.borrowWindow();
    } else {
      var sprite = this.pool.borrowDecoration();
    }
    sprite.position.x = -32 + i * 64;
    sprite.position.y = 128;

    this.wallSlices.push(sprite);

    this.stage.addChild(sprite);
  }
};

Main.prototype.returnWallSprites = function() {
  for (var i = 0; i < this.wallSlices.length; i++) {
    var sprite = this.wallSlices[i];
    this.stage.removeChild(sprite);
    if (i % 2 == 0) {
      this.pool.returnWindow(sprite);
    } else {
      this.pool.returnDecoration(sprite);
    }
  }

  this.wallSlices = [];
};

Main.prototype.generateTestWallSpan = function() {
  var lookupTable = [
    this.pool.borrowFrontEdge, // 1st slice
    this.pool.borrowWindow, // 2nd slice
    this.pool.borrowDecoration, // 3rd slice
    this.pool.borrowWindow, // 4th slice
    this.pool.borrowDecoration, // 5th slice
    this.pool.borrowWindow, // 6th slice
    this.pool.borrowBackEdge // 7th slice
  ];
  for (var i = 0; i < lookupTable.length; i++) {
    var func = lookupTable[i];

    var sprite = func.call(this.pool);
    sprite.position.x = 32 + i * 64;
    sprite.position.y = 128;

    this.wallSlices.push(sprite);

    this.stage.addChild(sprite);
  }
};

Main.prototype.clearTestWallSpan = function() {
  var lookupTable = [
    this.pool.returnFrontEdge, // 1st slice
    this.pool.returnWindow, // 2nd slice
    this.pool.returnDecoration, // 3rd slice
    this.pool.returnWindow, // 4th slice
    this.pool.returnDecoration, // 5th slice
    this.pool.returnWindow, // 6th slice
    this.pool.returnBackEdge // 7th slice
  ];

  for (var i = 0; i < lookupTable.length; i++) {
    var func = lookupTable[i];
    var sprite = this.wallSlices[i];

    this.stage.removeChild(sprite);
    func.call(this.pool, sprite);
  }

  this.wallSlices = [];
};
