import kaboom from "../../node_modules/kaboom";
import { playableMap } from "./PlayableMap";
import { info } from "./info";
//Created a new clone //
const MOVE_SPEED = 200;

const INVADER_SPEED = 100;
let CURRENT_SPEED = INVADER_SPEED;
const LEVEL_DOWN = 2;
const BULLET_SPEED = 400;
const TIME_LEFT = 30000;
const k = kaboom({
  global: true,
  // enable full screen
  fullscreen: true,

  scale: 1,
  background: [0, 0, 1],
  clearColor: [255, 255, 255],
  // for debug mode

  debug: true,
});

// Menu Scene

scene("menu", () => {
  var x = 10,
    y = 10,
    z = 155;
  color(240, 100, 24);
  add(
    [
      text("Space Invaders "),
      pos(window.innerWidth / 2 - 300, window.innerHeight / 2 - 200),
      ,
      scale(1),
      color(40, 210, 255),
      area(),
      "title",
    ],
    origin("center")
  );
  // Play game button
  add([
    //rect(260, 20),
    text("Play game"),

    pos(window.innerWidth / 2 - 20, window.innerHeight / 2 - 40),
    color(10, 10, 155),

    origin("center"),
    "button",
    {
      clickAction: () => {
        go("vaccineInfoScene", { level: 0, score: 0 });

        //go("game", { level: 0, score: 0 });
      },
    },
    scale(0.7),
    area(),

    ,
  ]);

  add([
    //rect(260, 20),
    text("Back to Main Menu"),
    color(10, 10, 155),
    pos(window.innerWidth / 2 - 20, window.innerHeight / 2),
    "button",
    {
      clickAction: () => (window.location = "../../index.html"),
    },
    scale(0.7),
    area(),

    origin("center"),
  ]);

  action("button", (b) => {
    onHover("button", (b) => {
      b.use(color(240, 100, 155));
    });
    b.use(color(10, 10, 155));
  });

  onClick("button", (b) => {
    b.clickAction();
  });
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

// loadRoot("sprites/");
// loadSprite("space", "space.jpg");
// loadSprite("rocket1", "rocket1.png");
// loadSprite("rocket2", "rocket2.png");
// loadSprite("rocket3", "rocket3.png");
// loadSprite("rocket4", "rocket4.png");
// loadSprite("ship", "ship.png");
// loadSprite("bullet", "bullet.png");
// loadSprite("asteroid", "asteroid.png");
// loadSprite("asteroid_small1", "asteroid_small1.png");
// loadSprite("asteroid_small2", "asteroid_small2.png");
// loadSprite("asteroid_small3", "asteroid_small3.png");
// loadSprite("asteroid_small4", "asteroid_small4.png");

// loadRoot("sounds/");
// loadSound("rocket_thrust", "rocket_thrust.wav");
// loadSound("laser", "laser.wav");
// loadSound("explosion", "explosion.mp3");
// loadSound("Steamtech-Mayhem_Looping", "Steamtech-Mayhem_Looping.mp3");

scene("game", ({ level, score }) => {
  // Used to decrease the enemy count on destruction
  let enemyCount = 0;
  for (let i = 0; i < playableMap[level].length; i++) {
    for (let j = 0; j < playableMap[level][i].length; j++) {
      if (playableMap[level][i][j] === "^") enemyCount++;
    }
  }
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
    "^": () => [sprite("space_invader"), scale(0.8), "space_invader", area()],
    "!": () => [sprite("wall"), "left_wall", area(), solid()],
    "&": () => [sprite("wall"), "right_wall", area(), solid()],
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
      color(255, 0.5, 1),

      "bullet",
      area(),
    ]);
  }

  function spawnEnemyBullet(p) {
    add([
      rect(2, 10),
      pos(p),
      origin("center"),
      color(200, 50, 30),

      "enemyBullet",
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

  onUpdate("enemyBullet", (e) => {
    e.move(0, BULLET_SPEED);
    //if (e.pos.y > player.pos.y) destroy(e);
  });

  collides("bullet", "space_invader", (b, s) => {
    shake(4);
    destroy(b);
    destroy(s);
    enemyCount--;
    if (enemyCount === 0) {
      go("vaccineInfoScene", { level: level + 1, score: score });
    }
    scoreLabel.value++;

    // then display the score
    scoreLabel.text = scoreLabel.value;
  });
  function abs(x) {
    return x < 0 ? -x : x;
  }
  //Let us make the space_invader moving
  onUpdate("space_invader", (s) => {
    s.move(CURRENT_SPEED, 0);
    if (abs(s.pos.x - player.pos.x) <= 0.2 && s.pos.y < player.pos.y)
      wait(0.01, () => {
        spawnEnemyBullet(s.pos.add(0, 25));
      });
  });

  onCollide("space_invader", "enemyBullet", (s, e) => {
    destroy(e);
  });

  onCollide("enemyBullet", "enemyBullet", (e, f) => {
    destroy(f);
  });

  player.onCollide("enemyBullet", () => {
    go("lose", { score: scoreLabel.value });
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
    text("Game Over. Going Back to Main Menu in 2 seconds"),
    color(200, 50, 10),
    scale(0.5),
    pos(window.innerWidth / 3 - 300, window.innerHeight / 2 + 30),
  ]);

  // start the game

  // onKeyPress("space", () => {
  //   go("game", { level: 0, score: 0 });
  // });

  wait(2, () => {
    go("menu");
  });
});

scene("vaccineInfoScene", ({ level, score }) => {
  layers(["ui", "bg"], "bg");
  const infoColor = add([
    rect(window.innerWidth, window.innerHeight),
    color(10, 0, 10),
    layer("bg", "ui"),
    fixed(),
  ]);
  add([
    text(info[level], {
      size: 35, // 48 pixels tall
      width: window.innerWidth,
      font: "apl386o",

      // it'll wrap to next line when width exceeds this value
    }),

    scale(1),
    color(200, 144, 255),
    pos(20, 70),

    //area(),
  ]),
    // add([
    //   text("Loading next Level..Please Wait..."),
    //   scale(0.5),
    //   color(200, 3, 10),

    //   pos(100, window.innerHeight - 100),
    // ]);

    add([
      text("Loading next Level..Please Wait..."),
      scale(0.5),
      color(200, 3, 10),

      pos(100, window.innerHeight - 100),
    ]);

  wait(3, () => {
    go("game", { level: level, score: score });
  });
});
//init();
go("menu");
