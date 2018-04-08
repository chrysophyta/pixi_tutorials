let type = 'WebGL';
if (!PIXI.utils.isWebGLSupported()) {
  type = 'canvas';
}

PIXI.utils.sayHello(type);

// some helper functions
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
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

//Define any variables that are used in more than one function
let redfish, bluefish, yellowfish, state;

//Get screen height and width
let height = app.renderer.screen.height;
let width = app.renderer.screen.width;

//Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);

app.renderer.backgroundColor = 0x061639;
app.renderer.view.style.position = 'absolute';
app.renderer.view.style.display = 'block';
app.renderer.autoResize = true;
app.renderer.resize(window.innerWidth / 2, window.innerHeight / 2);

//- Loading images into the texture cache
//    A WebGL-ready image is called a texture
//    Pixi uses a texture cache to store and reference all the textures your sprites will need
//    That means if you have a texture that was loaded from "images/cat.png",
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
  redfish.width = 25;
  redfish.height = 25;

  bluefish.width = 25;
  bluefish.height = 25;

  yellowfish.width = 25;
  yellowfish.height = 25;

  //Change the sprite's position
  //Center the redfish
  // screen height

  redfish.x = width / 2 - redfish.width / 2;
  redfish.y = height / 2 - redfish.height / 2;

  redfish.vx = 0;
  redfish.vy = 0;

  //given a random y position

  let bluefishX = randomInt(0, width);
  let yellowfishX = randomInt(0, width);

  bluefish.position.set(bluefishX, 30);
  yellowfish.position.set(yellowfishX, 50);

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
  //Move the cat 1 pixel to the right each frame
  redfish.vx = 1;
  redfish.x += redfish.vx;

  let disappearTime = 100;
  if (redfish.x > width + disappearTime) {
    redfish.x = 0;
  }
  redfish.x += redfish.vx / 10;
}
