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
let redfish, bluefish, yellowfish, state;

//Get screen height and width
let height = app.renderer.screen.height;
let width = app.renderer.screen.width;

//- Loading images into the texture cache
//    A WebGL-ready image is called a texture
//    Pixi uses a texture cache to store and reference all the textures your sprites will need
//    That means if you have a texture that was loaded from "images/redfish.png",
//    you could find it in the texture cache like this: PIXI.utils.TextureCache["img/redfish.png"];
//    and later use Pixi’s Sprite class to make a new sprite using the texture

//    Converting img files into texture: use loader like follows
//    after loading run function called setup
PIXI.loader
  .add(['img/redfish.png', 'img/yellowfish.png', 'img/bluefish.png'])
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

  //Setting size
  setSize(redfish, 25, 25);
  setSize(bluefish, 25, 25);
  setSize(yellowfish, 25, 25);

  //Change the sprite's position
  //Center the redfish
  // screen height

  redfish.x = width / 2 - redfish.width / 2;
  redfish.y = height / 2 - redfish.height / 2;

  redfish.vx = 0;
  redfish.vy = 0;

  //given a random y position

  let bluefishX = randomInt(0, width);
  bluefish.position.set(bluefishX, 30);
  bluefish.vx = 0;
  bluefish.vy = 0;

  let yellowfishX = randomInt(0, width);
  yellowfish.position.set(yellowfishX, 150);
  yellowfish.vx = 0;
  yellowfish.vy = 0;

  //---------^^^^^^above is basic position setting ^^^^^^---------
  //---------vvvvvv below is keyboard function setting vvvv-------

  //Capture the keyboard arrow keys
  let left = keyboard(37),
    up = keyboard(38),
    right = keyboard(39),
    down = keyboard(40);

  //Left arrow key `press` method
  left.press = () => {
    //Change the redfish's velocity when the key is pressed
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
    redfish.vx = 5;
    redfish.vy = 0;
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

  // add the sprites to the stage
  app.stage.addChild(redfish, yellowfish, bluefish);

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
  //Move the redfish 1 pixel to the right each frame
  // redfish.vx = 1;
  // redfish.x += redfish.vx;

  // let disappearTime = 100;
  // if (redfish.x > width + disappearTime) {
  //   redfish.x = 0;
  // }
  // redfish.x += redfish.vx / 10;

  redfish.x += redfish.vx;
  redfish.y += redfish.vy;

  // allow the fish to come back into screen when they move out it visible area
  if (redfish.x > width) {
    redfish.x = 0;
  } else if (redfish.x < 0) {
    redfish.x = width;
  }

  if (redfish.y > height) {
    redfish.y = 0;
  } else if (redfish.y < 0) {
    redfish.y = height;
  }

  bluefish.x += 1;
  bluefish.y += 0.1;
  restrainMoving(bluefish, width, height);

  yellowfish.x += 1.5;
  yellowfish.x += 0.3;
  restrainMoving(yellowfish, width, height);
}

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
