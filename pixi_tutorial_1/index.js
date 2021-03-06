let type = 'WebGL';
if (!PIXI.utils.isWebGLSupported()) {
  type = 'canvas';
}

PIXI.utils.sayHello(type);

// some helper functions
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function setSize(stuff, w, h) {
  stuff.width = w;
  stuff.height = h;
}

function setOneSize(arr, size) {
  arr.map(item => {
    setSize(item, size, size);
  });
}
function setVelocity(obj, vx, vy) {
  obj.vx = vx;
  obj.vy = vy;
}

function addFeeder() {
  let feeder = new PIXI.Sprite.fromImage('img/feeder.png');
  setSize(feeder, 10, 10);
  feeder.x = randomInt(0, width);
  feeder.y = randomInt(-height, 0);
  feeders.addChild(feeder);
  return feeder;
}

// allow the fish to come back into screen when they move out it visible area
function restrainMoving(thing, width, height) {
  //check x axis
  if (thing.x > width) {
    thing.x = 0;
  } else if (thing.x < 0) {
    thing.x = width;
  }
  //check y axis
  if (thing.y > height) {
    thing.y = 0;
  } else if (thing.y < 0) {
    thing.y = height;
  }
}

// Keyboard Function
function keyboard(keyCode) {
  let key = {};
  key.code = keyCode;
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;
  //The `downHandler`
  key.downHandler = event => {
    if (event.keyCode === key.code) {
      if (key.isUp && key.press) key.press();
      key.isDown = true;
      key.isUp = false;
    }
    event.preventDefault();
  };

  //The `upHandler`
  key.upHandler = event => {
    if (event.keyCode === key.code) {
      if (key.isDown && key.release) key.release();
      key.isDown = false;
      key.isUp = true;
    }
    event.preventDefault();
  };

  //Attach event listeners
  window.addEventListener('keydown', key.downHandler.bind(key), false);
  window.addEventListener('keyup', key.upHandler.bind(key), false);
  return key;
}

//  hitTestRectangle function

function hitTestRectangle(r1, r2) {
  //Define the variables we'll need to calculate
  let hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

  //hit will determine whether there's a collision
  hit = false;

  //Find the center points of each sprite
  r1.centerX = r1.x + r1.width / 2;
  r1.centerY = r1.y + r1.height / 2;
  r2.centerX = r2.x + r2.width / 2;
  r2.centerY = r2.y + r2.height / 2;

  //Find the half-widths and half-heights of each sprite
  r1.halfWidth = r1.width / 2;
  r1.halfHeight = r1.height / 2;
  r2.halfWidth = r2.width / 2;
  r2.halfHeight = r2.height / 2;

  //Calculate the distance vector between the sprites
  vx = r1.centerX - r2.centerX;
  vy = r1.centerY - r2.centerY;

  //Figure out the combined half-widths and half-heights
  combinedHalfWidths = r1.halfWidth + r2.halfWidth;
  combinedHalfHeights = r1.halfHeight + r2.halfHeight;

  //Check for a collision on the x axis
  if (Math.abs(vx) < combinedHalfWidths) {
    //A collision might be occuring. Check for a collision on the y axis
    if (Math.abs(vy) < combinedHalfHeights) {
      //There's definitely a collision happening
      hit = true;
    } else {
      //There's no collision on the y axis
      hit = false;
    }
  } else {
    //There's no collision on the x axis
    hit = false;
  }

  //`hit` will be either `true` or `false`
  return hit;
}

//Create a Pixi Application
//argument is a single object called the options
let app = new PIXI.Application({
  width: 256, // default: 800
  height: 256, // default: 600
  antialias: true, // default: false
  transparent: false, // default: false
  resolution: 1 // default: 1
});
console.log(app);

//Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);

app.renderer.backgroundColor = 0x061639;
app.renderer.view.style.position = 'absolute';
app.renderer.view.style.display = 'block';
app.renderer.autoResize = true;
app.renderer.resize(window.innerWidth / 2, window.innerHeight / 2);

//Define any variables that are used in more than one function
let redfish,
  bluefish,
  yellowfish,
  jellyfish,
  starfish,
  coral_1,
  coral_2,
  coral_3,
  feeders;

let state;
let score = 0;
let displayScore;

//Get screen height and width
let height = app.renderer.screen.height;
let width = app.renderer.screen.width;

let isFlipped = false;
let isPaused = false;

//- Loading images into the texture cache
//    A WebGL-ready image is called a texture
//    Pixi uses a texture cache to store and reference all the textures your sprites will need
//    That means if you have a texture that was loaded from "images/redfish.png",
//    you could find it in the texture cache like this: PIXI.utils.TextureCache["img/redfish.png"];
//    and later use Pixi’s Sprite class to make a new sprite using the texture

//    Converting img files into texture: use loader like follows
//    after loading run function called setup
PIXI.loader
  .add([
    'img/redfish.png',
    'img/yellowfish.png',
    'img/bluefish.png',
    'img/coral.png',
    'img/starfish.png',
    'img/jellyfish.png',
    'img/feeder.png',
    'img/whale.png'
  ])
  // use on("progress",function) to monitor loading progress
  .on('progress', loadProgressHandler)
  .load(setup);

function loadProgressHandler(loader, resource) {
  //Display the file `url` currently being loaded
  console.log('loading: ' + resource.url);

  //Display the percentage of files currently loaded
  console.log('progress: ' + loader.progress + '%');

  //If you gave your files names as the first argument
  //of the `add` method, you can access them like this
  //console.log("loading: " + resource.name);
}

function setup() {
  redfish = new PIXI.Sprite(PIXI.loader.resources['img/redfish.png'].texture);
  yellowfish = new PIXI.Sprite(
    PIXI.loader.resources['img/yellowfish.png'].texture
  );
  bluefish = new PIXI.Sprite(PIXI.loader.resources['img/bluefish.png'].texture);
  starfish = new PIXI.Sprite(PIXI.loader.resources['img/starfish.png'].texture);
  jellyfish = new PIXI.Sprite(
    PIXI.loader.resources['img/jellyfish.png'].texture
  );
  coral_1 = new PIXI.Sprite(PIXI.loader.resources['img/coral.png'].texture);
  coral_2 = new PIXI.Sprite(PIXI.loader.resources['img/coral.png'].texture);
  coral_3 = new PIXI.Sprite(PIXI.loader.resources['img/coral.png'].texture);

  whale = new PIXI.Sprite(PIXI.loader.resources['img/whale.png'].texture);

  // Group sprites with containers
  let decorAnimal = new PIXI.Container();
  let corals = new PIXI.Container();
  feeders = new PIXI.Container();

  let f1 = addFeeder();
  let f2 = addFeeder();
  let f3 = addFeeder();

  corals.addChild(coral_1, coral_2, coral_3);
  decorAnimal.addChild(corals, jellyfish, starfish);

  // Setting Scoring System

  displayScore = new PIXI.Text('Score: 0', {
    fontFamily: 'Quicksand',
    fontSize: 12,
    fill: 0xffffff,
    align: 'center'
  });
  displayScore.position.set(10, 10);

  //Setting size
  setSize(redfish, 25, 25);
  setSize(bluefish, 25, 25);
  setSize(yellowfish, 25, 25);

  setOneSize([...corals.children, jellyfish, starfish], 25);

  setSize(whale, 250, 250);

  //Change the sprite's position
  //Center the redfish
  // screen height

  redfish.x = width / 2 - redfish.width / 2;
  redfish.y = height / 2 - redfish.height / 2;
  redfish.anchor.y = 0.5;
  redfish.anchor.x = 0.5;

  setVelocity(redfish, 0, 0);

  //given a random y position

  let bluefishX = randomInt(0, width);
  bluefish.position.set(bluefishX, 30);

  setVelocity(bluefish, 0, 0);

  let yellowfishX = randomInt(0, width);
  yellowfish.position.set(yellowfishX, 150);

  setVelocity(yellowfish, 0, 0);

  //to use global position: parentSprite.toGlobal(childSprite.position)

  corals.position.set(0, height - corals.height);
  coral_1.position.set(300, 0);
  coral_2.position.set(50, 0);
  coral_3.position.set(100, 0);

  jellyfish.position.set(width / 4, width / 4);
  starfish.position.set(width / 3 * 2, height - starfish.height);
  whale.anchor.x = 0.5;
  whale.anchor.y = 0.5;
  whale.position.set(width + whale.width, height / 2);
  whale.filters = [new PIXI.filters.BlurFilter()];
  whale.alpha = 0.3;

  //---------^^^^^^above is basic position setting ^^^^^^---------
  //---------vvvvvv below is keyboard function setting vvvv-------

  //Capture the keyboard arrow keys
  let left = keyboard(37),
    up = keyboard(38),
    right = keyboard(39),
    down = keyboard(40),
    space = keyboard(32);

  //Left arrow key `press` method
  left.press = () => {
    //Change the redfish's velocity when the key is pressed

    if (!isFlipped) {
      redfish.scale.x *= -1;
      isFlipped = true;
    }
    redfish.vx = -5;
    redfish.vy = 0;
  };

  //Left arrow key `release` method
  left.release = () => {
    //If the left arrow has been released, and the right arrow isn't down,
    //and the redfish isn't moving vertically:
    //Stop the redfish
    if (!right.isDown && redfish.vy === 0) {
      redfish.vx = 0;
    }
  };

  //Up
  up.press = () => {
    redfish.vy = -5;
    redfish.vx = 0;
  };
  up.release = () => {
    if (!down.isDown && redfish.vx === 0) {
      redfish.vy = 0;
    }
  };

  //Right
  right.press = () => {
    if (isFlipped) {
      redfish.scale.x *= -1;
    }

    redfish.vx = 5;
    redfish.vy = 0;
    isFlipped = false;
  };
  right.release = () => {
    if (!left.isDown && redfish.vy === 0) {
      redfish.vx = 0;
    }
  };

  //Down
  down.press = () => {
    redfish.vy = 5;
    redfish.vx = 0;
  };
  down.release = () => {
    if (!up.isDown && redfish.vx === 0) {
      redfish.vy = 0;
    }
  };

  space.press = () => {
    if (!isPaused) {
      state = pause;
      isPaused = true;
    } else if (isPaused) {
      state = play;
      app.ticker.start();
      isPaused = false;
    }
  };

  // add the sprites to the stage
  app.stage.addChild(
    whale,
    redfish,
    yellowfish,
    bluefish,
    decorAnimal,
    feeders,
    displayScore
  );

  //Set the game state
  state = play;

  app.ticker.add(delta => gameLoop(delta));
}

//Start the game loop by adding the `gameLoop` function to
//Pixi's `ticker` and providing it with a `delta` argument.
function gameLoop(delta) {
  state(delta);
}

function play(delta) {
  redfish.x += redfish.vx;
  redfish.y += redfish.vy;
  restrainMoving(redfish, width, height);

  bluefish.x += 1;
  bluefish.y += 0.1;
  restrainMoving(bluefish, width, height);

  yellowfish.x += 1.5;
  yellowfish.x += 0.3;
  restrainMoving(yellowfish, width, height);

  whale.x -= 0.3;
  restrainMoving(whale, width + whale.width * 2, height);

  feeders.children.forEach(feeder => {
    feeder.y += 1;
    if (feeder.y > height) {
      feeders.removeChild(feeder);
    }
    if (hitTestRectangle(feeder, redfish)) {
      console.log('Hit');
      score += 1;
      displayScore.text = 'Score: ' + score;

      feeders.removeChild(feeder);
    }
  });

  // console.log(feeders.children.length);

  if (feeders.children.length < 1) {
    let nextFeeder_1 = addFeeder();
    let nextFeeder_2 = addFeeder();
    let nextFeeder_3 = addFeeder();
  }
}

function pause() {
  app.ticker.stop();
}
