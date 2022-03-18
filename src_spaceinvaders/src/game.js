import kaboom from "../../node_modules/kaboom";
import { playableMap } from "./PlayableMap";
const MOVE_SPEED = 200;

const INVADER_SPEED = 200;
let CURRENT_SPEED = INVADER_SPEED;
const LEVEL_DOWN = 30;
const BULLET_SPEED = 400;
const TIME_LEFT = 30;
const k = kaboom({
  global: true,
  // enable full screen
  fullscreen: true,

  scale: 1,
  background: [0.1, 0, 0, 0],
  // for debug mode

  debug: true,
});

window.addEventListener("resize", resize, false);
function resize() {
  // https://stackoverflow.com/questions/49716741/how-do-i-scale-the-scene-to-fullscreen
  var canvas = document.querySelector("canvas");
  var windowWidth = window.innerWidth;
  var windowHeight = window.innerHeight;
  var windowRatio = windowWidth / windowHeight;
  var gameRatio = k.width / k.height;
  if (windowRatio < gameRatio) {
    canvas.style.width = windowWidth + "px";
    canvas.style.height = windowWidth / gameRatio + "px";
  } else {
    canvas.style.width = windowHeight * gameRatio + "px";
    canvas.style.height = windowHeight + "px";
  }
}

loadRoot("https://i.imgur.com/");
loadSprite("space_invader", "m2A06Eg.png"); // https://imgur.com/m2A06Eg
loadSprite("wall", "gqVoI2b.png");
loadSprite("space_ship", "Wb1qfhK.png");

scene("game", ({ level, score }) => {
  //create layers
  //An array
  // background layer, object layer as default, UI layer
  // initialise with obj as default
  layers(["bg", "obj", "ui"], "obj");

  //level configuration
  const levelCfg = {
    //every sprite has a width and height
    width: 20,
    height: 20,
    // parameters 1: name of the sprite, 2: solid , 3: tag

    // load in some sprites
    "^": () => [sprite("space_invader"), scale(0.7), "space_invader", area()],
    "!": () => [sprite("wall"), "left_wall", area()],
    "&": () => [sprite("wall"), "right_wall", area()],
  };

  const gameLevel = addLevel(playableMap[level], levelCfg);
  // add some text to display score and position on UI layer
  // default layer is 'obj '
  // so change layer to 'ui' for adding score
  //define this as a method so that it can be passed to other levels
  add([text("Score:"), scale(0.3), pos(20, 6), fixed()]);
  const scoreLabel = add([
    //text(score),
    text(parseInt(score)),
    pos(115, 6),
    scale(0.3),
    ,
    fixed(),
    layer("ui"),
    {
      value: score,
    },
  ]);

  // add a text to define which level we currently are in
  // parameters for add are text, position
  add([
    text("Level: " + parseInt(level + 1)),
    pos(20, 22),
    scale(0.3),
    fixed(),
  ]);

  const timer = add([
    text("0"),
    pos(240, 38),
    scale(0.3),
    layer("ui"),
    fixed(),
    { time: TIME_LEFT },
  ]);

  add([text("Time Remaining: "), pos(20, 38), scale(0.3), fixed()]);
  onUpdate(() => {
    (timer.time -= dt()), (timer.text = timer.time.toFixed(2));

    if (timer.time <= 0) {
      go("lose", { score: scoreLabel.value });
    }
  });

  const player = add([
    sprite("space_ship"),
    pos(width() / 2 - 500, height() / 2),
    origin("center"),
    area(),
    solid(),
  ]);

  keyDown("left", () => {
    player.move(-MOVE_SPEED, 0);
  });

  keyDown("right", () => {
    player.move(MOVE_SPEED, 0);
  });

  function spawnBullet(p) {
    add([
      rect(2, 10),
      pos(p),
      origin("center"),
      color(0.5, 0.5, 1),
      "bullet",
      area(),
    ]);
  }
  keyPress("b", () => {
    spawnBullet(player.pos.add(0, -25));
  });

  onUpdate("bullet", (b) => {
    b.move(0, -BULLET_SPEED);
    if (b.pos.y < 0) {
      destroy(b);
    }
  });

  collides("bullet", "space_invader", (b, s) => {
    shake(4);
    destroy(b);
    destroy(s);
    scoreLabel.value++;

    // then display the score
    scoreLabel.text = scoreLabel.value;
  });
  //Let us make the space_invader moving
  onUpdate("space_invader", (s) => {
    s.move(CURRENT_SPEED, 0);
  });

  //On Collision with right wall
  // Space-invader has to turn around and move down on each collision
  collides("space_invader", "right_wall", () => {
    CURRENT_SPEED = -INVADER_SPEED;

    every("space_invader", (s) => {
      s.move(0, LEVEL_DOWN);
    });
  });

  collides("space_invader", "left_wall", () => {
    CURRENT_SPEED = INVADER_SPEED;
    every("space_invader", (s) => {
      s.move(0, LEVEL_DOWN);
    });
  });

  player.on("space_invader", () => {
    go("lose", { score: scoreLabel.value });
  });

  onUpdate("space_invader", (s) => {
    if (s.pos.y >= height() / 2) {
      go("lose", { score: scoreLabel.value });
    }
  });
});

scene("lose", ({ score }) => {
  add([text(score, 32), origin("center"), pos(width() / 2, height() / 2)]);
  add([
    text('Hit "Space bar" to Play again'),
    scale(0.5),
    pos(width() / 2 - 240, height() / 2 + 30),
  ]);
  onKeyPress("space", () => {
    go("game", { level: 0, score: 0 });
  });
});

go("game", { level: 0, score: 0 });
