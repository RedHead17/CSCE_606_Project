import kaboom from "../../node_modules/kaboom";
import { playableMap } from "./PlayableMap";
import { info } from "./info";
//Created a new clone //
const MOVE_SPEED = 200;
const TIME_LEFT = 50;
const INVADER_SPEED = 100;
let INVADER_DIRECTION = 1;
let CURRENT_SPEED = INVADER_SPEED;
let INVADER_MOVE_COUNT = 0;
// const LEVEL_DOWN = 200;
const BULLET_SPEED = 400;
const LIVES_REMAINING = 4;
let BUTTON_YPOS = window.innerHeight - 125;
let BASE_SCALE = 2;
let BUTTON_FAR_XPOS = window.innerWidth - 25;
let CONTROL_OPACITY = 0;

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

// Resize functionality
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

loadSprite("space_ship", "GFFd15o.png"); // https://imgur.com/GFFd15o  https://imgur.com/GFFd15o
loadSprite("background", "WCSitcB.jpeg"); //https://imgur.com/WCSitcB

loadSprite("a", "A34cvsW.png"); //https://imgur.com/A34cvsW

loadSprite("d", "Ne911cW.png"); //https://imgur.com/Ne911cW

loadSprite("shoot", "W5W3CDL.png"); //https://imgur.com/W5W3CDL

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

// Winner Scene
scene("winner", ({ score }) => {
  var x = 10,
    y = 10,
    z = 155;
  color(240, 100, 24);
  add(
    [
      text("Congratulations!"),
      pos(window.innerWidth / 2 - 350, window.innerHeight / 2 - 200),
      ,
      scale(1),
      color(10, 10, 155),
      area(),
      "title",
    ],
    origin("center")
  );
  add([
    text("Score: " + score, 32),
    origin("center"),
    pos(width() / 2 - 40, window.innerHeight / 2 - 100),
  ]);
  // Play game button
  add([
    //rect(260, 20),
    text("Play Again"),

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
    pos(window.innerWidth / 2 - 20, window.innerHeight / 2 + 40),
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

// Game Scene
// Contains Most of the functionality
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

  add([
    sprite("background"),
    // Make the background centered on the screen
    pos(width() / 2, height() / 2),
    origin("center"),
    // Allow the background to be scaled
    scale(5),
    // Keep the background position fixed even when the camera moves
    fixed(),
  ]);

  //level configuration
  const levelCfg = {
    //every sprite has a width and height
    width: 20,
    height: 20,
    // parameters 1: name of the sprite, 2: solid , 3: tag

    // load in some sprites
    "^": () => [
      sprite("space_invader"),
      scale(0.8 * BASE_SCALE),
      "space_invader",
      area(),
    ],
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

  // Timer for each level

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

  // Controls to assist players
  add([text("C - Controls"), pos(20, 68), scale(0.3), fixed()]);

  const left_control = add([
    text("Left - A or Left Arrow Key"),
    pos(20, 84),
    scale(0.3),
    fixed(),
    opacity(CONTROL_OPACITY),
  ]);
  const right_control = add([
    text("Right - D or Right Arrow Key"),
    pos(20, 100),
    scale(0.3),
    fixed(),
    opacity(CONTROL_OPACITY),
  ]);
  const shoot_control = add([
    text("Shoot - B"),
    pos(20, 116),
    scale(0.3),
    fixed(),
    opacity(CONTROL_OPACITY),
  ]);

  const controlsInfo = () => {
    CONTROL_OPACITY = (CONTROL_OPACITY - 1) ** 2;
    left_control.opacity = CONTROL_OPACITY;
    right_control.opacity = CONTROL_OPACITY;
    shoot_control.opacity = CONTROL_OPACITY;
  };

  onKeyPress("c", controlsInfo);

  const player = add([
    sprite("space_ship"),
    pos(width() / 2 - 500, height() / 2),
    origin("center"),
    area(),
    //solid(),
    scale(BASE_SCALE),
  ]);

  // Lives Remaining
  // Assigned 4 lives for each level
  const lives = add([
    text(parseInt(LIVES_REMAINING)),
    pos(115, 52),
    scale(0.3),
    layer("ui"),
    fixed(),
    color(255, 10, 40),
    { value: LIVES_REMAINING },
  ]);

  add([text("Lives : "), pos(20, 52), scale(0.3), fixed()]);
  keyDown("left", () => {
    player.move(-MOVE_SPEED, 0);
  });

  keyDown("right", () => {
    player.move(MOVE_SPEED, 0);
  });

  if (isTouch()) {
    // && buttonsVisible) {
    //console.log(isTouch);

    //because left and right buttons will be pressed
    //we need to keep track of them
    const keyDownOnMobile = {
      left: false,
      right: false,
      // we will set them to true when these buttons are tocuhed
    };

    //Mobile Buttons
    const leftButton = add([
      sprite("a"),
      pos(20, height() - 25),
      opacity(0.5),
      origin("botleft"),
      scale(BASE_SCALE),
      fixed(),
      area(),
    ]);

    const rightButton = add([
      sprite("d"),
      pos(120, height() - 25),
      opacity(0.5),
      origin("botleft"),
      scale(BASE_SCALE),
      fixed(),
      area(),
    ]);

    const shootButton = add([
      sprite("shoot"),
      pos(width() - 30, height() - 25),
      opacity(0.5),
      origin("botright"),
      scale(BASE_SCALE),
      fixed(),
      area(),
    ]);

    //TouchStart acts similar to a key press
    //Sperate starts allow for mulitple button presses
    onTouchStart((leftPress, pos) => {
      if (leftButton.hasPoint(pos)) {
        keyDownOnMobile.left = true;
        leftButton.opacity = 1;
      }
    });

    onTouchStart((rightPress, pos) => {
      if (rightButton.hasPoint(pos)) {
        keyDownOnMobile.right = true;
        rightButton.opacity = 1;
      }
    });

    onTouchStart((shootPress, pos) => {
      if (shootButton.hasPoint(pos)) {
        spawnBullet(player.pos.add(0, -25));
        shootButton.opacity = 1;
      }
    });

    //Keeps movement even if screen is touched, or other button is touched
    onTouchMove((id, pos) => {
      if (leftButton.hasPoint(pos)) {
        keyDownOnMobile.left = true;
        leftButton.opacity = 1;
      }
      if (rightButton.hasPoint(pos)) {
        keyDownOnMobile.right = true;
        rightButton.opacity = 1;
      }
    });

    //Ends individual presses
    onTouchEnd((leftPress, pos) => {
      if (leftButton.hasPoint(pos)) {
        keyDownOnMobile.left = false;
        leftButton.opacity = 0.5;
        console.log("unpressed left");
      }
    });

    onTouchEnd((rightPress, pos) => {
      if (rightButton.hasPoint(pos)) {
        keyDownOnMobile.right = false;
        rightButton.opacity = 0.5;
        console.log("unpressed right");
      }
    });

    onTouchEnd((shootPress, pos) => {
      if (shootButton.hasPoint(pos)) {
        shootButton.opacity = 0.5;
      }
    });

    onUpdate(() => {
      if (keyDownOnMobile.left) {
        moveLeft();
      } else if (keyDownOnMobile.right) {
        moveRight();
      }
    });

    const moveLeft = () => {
      player.move(-MOVE_SPEED, 0);
    };

    const moveRight = () => {
      player.move(MOVE_SPEED, 0);
    };
  }

  // Spawns bullet
  // This is for player
  function spawnBullet(p) {
    add([
      rect(2, 10),
      pos(p),
      origin("center"),
      color(0, 128, 0),

      "bullet",
      area(),
    ]);
  }

  // Spawns Enemy Bullet
  // This is for space invaders
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

  // key "b" to shoot
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
      //Invaders always move right at start of level
      INVADER_DIRECTION = 1;
      INVADER_MOVE_COUNT = 0;
      // level = level + 1;
      // console.log("map count: " + playableMap.length);
      if (playableMap.length > level + 1) {
        // Go to a new level if all the enemies are killed and if a new level exists
        go("vaccineInfoScene", { level: level + 1, score: scoreLabel.value });
      } else {
        // Else go to Win Screen
        level = 0;
        go("winner", { score: scoreLabel.value });
      }
    }
    scoreLabel.value++;

    // then display the score
    scoreLabel.text = scoreLabel.value;
  });
  function abs(x) {
    return x < 0 ? -x : x;
  }
  //Let us make the space_invader moving
  /*onUpdate("space_invader", (s) => {
    s.move(CURRENT_SPEED, 0);
    if (abs(s.pos.x - player.pos.x) <= 0.2 && s.pos.y < player.pos.y)
      wait(0.01, () => {
        spawnEnemyBullet(s.pos.add(0, 25));
      });
  });*/
  // This is used to make indefinite movement of Space invaders
  // Also they spawn bullets when the player is in the range specified
  // That is they shoot only when player is at their aimed position
  onUpdate(() => {
    every("space_invader", (s) => {
      s.move(INVADER_SPEED * INVADER_DIRECTION, 0);

      if (abs(s.pos.x - player.pos.x) <= 0.5 && s.pos.y < player.pos.y)
        wait(0.01, () => {
          spawnEnemyBullet(s.pos.add(18, 45));
        });
    });

    // Used to control the movement of Invaders
    // Reverse direction and Invaders Move down when the move count exceeds limit
    INVADER_MOVE_COUNT++;
    if (INVADER_MOVE_COUNT >= 200) {
      //INVADER_DIRECTION *= -1;
      INVADER_MOVE_COUNT = 0;
      every("space_invader", (invader) => {
        invader.move(0, LEVEL_DOWN);
      });
    }
  });

  const LEVEL_DOWN = 700;

  onUpdate("space_invader", (s) => {
    if (s.pos.x >= window.innerWidth) INVADER_DIRECTION = -1;
    else if (s.pos.x <= 0) {
      INVADER_DIRECTION = 1;
    }
  });

  onCollide("space_invader", "enemyBullet", (s, e) => {
    destroy(e);
  });

  onCollide("enemyBullet", "enemyBullet", (e, f) => {
    destroy(f);
  });

  player.onCollide("enemyBullet", () => {
    shake(10);
    // Decrement Lives upon hit by enemey bullet
    (lives.value -= 1), (lives.text = lives.value.toFixed(0));

    if (lives.value == 0) go("lose", { score: scoreLabel.value });
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

  // When invaders keep moving down and when they eventually reach the level of player
  // Player cannot shoot them and has to eventually lose because he cannot make any progress
  onUpdate("space_invader", (s) => {
    if (s.pos.y * BASE_SCALE >= player.pos.y * BASE_SCALE) {
      go("lose", { score: scoreLabel.value });
    }
  });
});

// Lose Scene
scene("lose", ({ score }) => {
  add([text(score, 32), origin("center"), pos(width() / 2, height() / 2)]);
  add([
    text("Game Over. Going Back to Main Menu in 2 seconds"),
    color(200, 50, 10),
    scale(0.5),
    pos(window.innerWidth / 3 - 300, window.innerHeight / 2 + 30),
  ]);

  wait(2, () => {
    window.location = "./mario_menu.html";
  });
});

// Vaccine Info Scene to display awareness related to vaccination at the end of each level
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
//go("menu");
go("vaccineInfoScene", { level: 0, score: 0 });
