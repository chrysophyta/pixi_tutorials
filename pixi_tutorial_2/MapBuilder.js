function MapBuilder(walls) {
  this.walls = walls;
  this.createMap();
}

MapBuilder.WALL_HEIGHTS = [
  256, // Lowest slice
  224,
  192,
  160,
  128 // Highest slice
];

MapBuilder.prototype.createMap = function() {};
