import kaboom from "../../node_modules/kaboom";
import { playableMap } from "./PlayableMap";
import { info } from "./info";
const AGRO_RANGE_X = 300;
const AGRO_RANGE_Y = 75;
const MOVE_SPEED = 150;
const JUMP_FORCE = 560;
const BIG_JUMP_FORCE = 750;
let CURRENT_JUMP_FORCE = JUMP_FORCE;
const ENEMY_SPEED = 20;
let isJumping = true;
const FALL_DEATH = 700;
const TIME_LEFT = 50;
const BULLET_TIME_LEFT = 4;
let isBig = false;
let buttonsVisible = true;

let hasBulletAbility = false;

const k = kaboom({
  global: true,
  // enable full screen
  fullscreen: true,

  scale: 1,
  background: [0, 0, 1],
  clearColor: [51, 151, 255],
  // for debug mode

  debug: true,
});

//This is for Menu

scene("menu", () => {
  var x = 10,
    y = 10,
    z = 155;
  color(240, 100, 24);
  add(
    [
      text("Mario game"),
      pos(window.innerWidth / 2 - 240, window.innerHeight / 2 - 200),
      ,
      scale(1),
      color(10, 10, 155),
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
//add scenes
//coins
loadRoot("https://i.imgur.com/");
loadSprite("coin", "O0rwU31.png"); //https://imgur.com/O0rwU31

//enenmies

loadSprite("evil-shroom", "KPO3fR9.png");
loadSprite("covid", "m2A06Eg.png"); // https://imgur.com/m2A06Eg
//bricks
loadSprite("brick", "pogC9x5.png");
//blocks
loadSprite("block", "M6rwarW.png");

//mario
// Old mario: "Wb1qfhK.png"
// Newly replaced sprite
// https://i.imgur.com/dMbsCBb.png
loadSprite("mario", "Wb1qfhK.png");

loadSprite("mushroom", "0wMd92p.png");

//BiggerMarioShor
loadSprite("BigVaccineMushroom", "CCdLQNO.jpg");

//Mushroom for bullets
loadSprite("BulletVaccineMushroom", "ertkPgG.jpg");

loadSprite("surprise", "gesQ1KP.png");

loadSprite("unboxed", "bdrLpi6.png");

loadSprite("pipe-top-left", "ReTPiWY.png");

loadSprite("pipe-top-right", "hj2GK4n.png");

loadSprite("pipe-bottom-left", "c1cYSbt.png");

loadSprite("pipe-bottom-right", "nqQ79eI.png");

loadSprite("blue-block", "fVscIbn.png");

loadSprite("blue-brick", "3e5YRQd.png");

loadSprite("blue-steel", "gqVoI2b.png");

loadSprite("blue-evil-shroom", "SvV4ueD.png");

loadSprite("blue-surprise", "RMqCc1G.png");

loadSprite("a", "agdsuPW.png");

loadSprite("d", "7SNgoAe.png");

loadSprite("highjump", "xfWsMOV.png");

loadSprite("shoot", "mPlhKAi.png");

//Vaccine Info Scene begins
//loadRoot("C:UserskaushDesktopCSCE_606_Projectsrc_mariosrc/");

//Vaccine Info scene ends
// game scene

scene("game", ({ level, score }) => {
  //create layers
  //An array
  // background layer, object layer as default, UI layer
  // initialise with obj as default
  layers(["bg", "obj", "ui"], "obj");
  const bgColor = add([
    rect(100000000000000, 1000000000000000),
    color(0, 10, 24),
    layer("bg", "ui"),
    fixed(),
  ]);

  //level configuration
  const levelCfg = {
    //every sprite has a width and height
    width: 20,
    height: 20,
    // parameters 1: name of the sprite, 2: solid , 3: tag

    // load in some sprites
    "=": () => [sprite("block"), solid(), area(), "brick"],
    $: () => [sprite("coin"), "coin", area()],
    "%": () => [sprite("surprise"), solid(), "coin-surprise", area()],
    "*": () => [sprite("surprise"), solid(), "mushroom-surprise", area()],
    //Newly added sprites begin here

    u: () => [
      sprite("surprise"),
      solid(),
      "BigVaccineMushroomSurprise",
      area(),
    ],

    v: () => [
      sprite("surprise"),
      solid(),
      "BulletVaccineMushroomSurprise",
      area(),
    ],

    //Newly added Sprites end here

    "}": () => [sprite("unboxed"), solid(), area()],
    "(": () => [sprite("pipe-bottom-left"), solid(), scale(0.5), area()],

    ")": () => [sprite("pipe-bottom-right"), solid(), scale(0.5), area()],

    "-": () => [sprite("pipe-top-left"), solid(), scale(0.5), "pipe", area()],

    "+": () => [sprite("pipe-top-right"), solid(), scale(0.5), "pipe", area()],

    "^": () => [sprite("covid"), "dangerous", area()],

    "#": () => [sprite("mushroom"), solid(), "mushroom", body(), area()],

    o: () => [
      sprite("BigVaccineMushroom"),
      solid(),
      "BigVaccineMushroom",
      body(),
      area(),

      scale(0.1, 0.1),
    ],
    p: () => [
      sprite("BulletVaccineMushroom"),
      solid(),
      "BulletVaccineMushroom",
      body(),
      area(),
      scale(0.1, 0.1),
    ],

    "!": () => [sprite("blue-block"), solid(), scale(0.5), area()],
    "£": () => [sprite("blue-brick"), solid(), scale(0.5), area(), "brick"],

    z: () => [
      sprite("blue-evil-shroom"),
      // solid(),
      scale(0.5),
      // body(),
      area(),
      "dangerous",
    ],
    "@": () => [
      sprite("blue-surprise"),
      solid(),
      area(),
      scale(0.5),
      "coin-surprise",
    ],
    x: () => [sprite("blue-steel"), solid(), area(), scale(0.5)],
  };
  // now just create a  gamelevel(JS method) and pass the map and levelCfg
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

  function big() {
    let timer = 0;
    // let isBig = false;
    return {
      update() {
        if (isBig) {
          // change the jump force
          CURRENT_JUMP_FORCE = BIG_JUMP_FORCE;

          //delta time is a JS method ""time since last frame"
          timer -= dt();
          if (timer <= 0) {
            //if time <0 then we have to make mario small
            this.smallify();
          }
        }
      },
      isBig() {
        return isBig;
      },
      smallify() {
        this.scale = vec2(1, 1);

        CURRENT_JUMP_FORCE = JUMP_FORCE;
        timer = 0;
        isBig = false;
      },

      biggify(time) {
        this.scale = vec2(2);

        timer = time;
        isBig = true;
      },
    };
  }
  // create mario
  const player = add([
    sprite("mario"),
    solid(),
    pos(0, 0),
    body(),
    big(),
    area(),
    origin("bot"),
  ]);

  //Now make the mushroom move
  // Whenever you grab anything with a tag of mushroom,
  onUpdate("mushroom", (m) => {
    // speed= 20
    m.move(20, 0);

    // but here the mushrrom wont fall'
    // So we need to add gravity
  });

  player.on("headbutt", (obj) => {
    // we will check if he bumped an object and if the name of the object happens to be a coin surprise
    // return a coin
    if (obj.is("coin-surprise")) {
      // Now spawn the coin and place the coin just above the grid 1 pos above along Y axis
      gameLevel.spawn("$", obj.gridPos.sub(0, 1));
      // Now destroy the old one
      destroy(obj);
      // after destroying replace with an unboxed so that he cam jump onto it and collect the coin
      gameLevel.spawn("}", obj.gridPos.sub(0, 0));
    }

    if (obj.is("mushroom-surprise")) {
      // Now spawn the mushroom and place the mushroom just above the grid 1 pos above along Y axis
      gameLevel.spawn("#", obj.gridPos.sub(0, 1));
      // Now destroy the old one
      destroy(obj);
      // after destroying replace with an unboxed so that he cam jump onto it and collect the mushroom
      gameLevel.spawn("}", obj.gridPos.sub(0, 0));
    }

    if (obj.is("brick")) {
      destroy(obj);
    }

    if (obj.is("BigVaccineMushroomSurprise")) {
      // Now spawn the mushroom and place the mushroom just above the grid 1 pos above along Y axis
      gameLevel.spawn("o", obj.gridPos.sub(0, 1));
      // Now destroy the old one
      destroy(obj);
      // after destroying replace with an unboxed so that he cam jump onto it and collect the mushroom
      gameLevel.spawn("}", obj.gridPos.sub(0, 0));
    }

    if (obj.is("BulletVaccineMushroomSurprise")) {
      // Now spawn the mushroom and place the mushroom just above the grid 1 pos above along Y axis
      gameLevel.spawn("p", obj.gridPos.sub(0, 1));
      // Now destroy the old one
      destroy(obj);
      // after destroying replace with an unboxed so that he cam jump onto it and collect the mushroom
      gameLevel.spawn("}", obj.gridPos.sub(0, 0));
    }
  });

  player.onCollide("mushroom", (m) => {
    // pick a mushroom and destroy the object
    destroy(m);
    //Now biggify for 6 seconds
    player.biggify(6);
  });

  player.onCollide("BigVaccineMushroom", (m) => {
    // pick a Big Vaccine mushroom and destroy the object
    destroy(m);
    //Now biggify for 6 seconds
    player.biggify(6);
  });

  player.onCollide("BulletVaccineMushroom", (m) => {
    // pick a Big Vaccine mushroom and destroy the object
    destroy(m);
    //Now biggify for 6 seconds
    player.biggify(6);
  });

  player.onCollide("coin", (c) => {
    destroy(c);
    // increase the value of the score

    scoreLabel.value++;

    // then display the score
    scoreLabel.text = scoreLabel.value;
  });

  // Let us make evils move
  onUpdate("dangerous", (d) => {
    let x_dist = d.pos.x - player.pos.x;
    let y_dist = d.pos.y - (player.pos.y - 20);
    console.log("X dist: " + x_dist + ", Y dist: " + y_dist);

    // Check how far away the guy is and if it's already moving.
    // Bias x distance over y distance
    d.moving = d.moving
      ? true
      : Math.abs(x_dist) < AGRO_RANGE_X && Math.abs(y_dist) < AGRO_RANGE_Y;
    if (!d.moving) return;

    let movement = 3 * ENEMY_SPEED * (level + 1);
    let x_move = movement;
    let y_move = movement;

    // Set movement to negative if needed.
    if (x_dist > 0) x_move = -1 * x_move;
    if (y_dist > 0) y_move = -1 * y_move;

    d.move(x_move, y_move);
  });

  // if player onCollide with anythig with dangerous
  // big mario becomes small
  // small mario dies
  player.onCollide("dangerous", (d) => {
    console.log(d.pos.y + " " + player.pos.y);
    if (player.pos.y == d.pos.y || isJumping) {
      console.log("detect");
      destroy(d);
    } else {
      // go to a lose scene and display the final score
      go("lose", { score: scoreLabel.value });
    }
  });

  onUpdate(() => {
    // Make camera Position same as player position

    camPos(player.pos);

    // So whenever the y coordinate of the player is greater than death value then go to lose scene
    if (player.pos.y >= FALL_DEATH) {
      go("lose", { score: scoreLabel.value });
    }
  });

  // keyDown is a method that takes inpiut from keyboard,
  // So  if we press left key , the arrow function will be executed

  onKeyDown("left", () => {
    // left we need to have minus direction
    player.move(-MOVE_SPEED, 0);
  });

  onKeyDown("a", () => {
    player.move(-MOVE_SPEED, 0);
  });

  onKeyDown("right", () => {
    // right we need to have plus direction
    player.move(MOVE_SPEED, 0);
  });

  onKeyDown("d", () => {
    player.move(MOVE_SPEED, 0);
  });
  // So during any action if the player is grounded
  // then make isJumping to false
  onUpdate(() => {
    if (player.grounded()) {
      isJumping = false;
    }
  });
  // if the player onCollide with any tag name pipe and presses KeyDown (for that case anykey you wish)
  //then he has to go to Next Level
  // or create a house and then use the key desired
  player.onCollide("pipe", () => {
    onKeyPress("down", () => {
      /* Scene to display vaccine informations*/

      go("vaccineInfoScene", { level: level + 1, score: score });
    });
    onKeyPress("s", () => {
      go("game", { level: level + 1, score: scoreLabel.value });
    });
  });

  // we will define a function jump so that it can be reused both by touch and keyboard

  const jumping = () => {
    if (player.grounded()) {
      // Make is Jumping to true when a space is pressed
      isJumping = true;
      // jump with current jump force big or small mario force
      player.jump(CURRENT_JUMP_FORCE);
    }
  };
  // similarly we can add for bullet

  //keyPress is a JS method especially used here to make use of space key to jump
  onKeyPress("space", jumping);
  //onKeyPress("w", jumping);
  //onKeyPress("up", jumping);

  // timer functionality in game scene

  const timer = add([
    text("0"),
    pos(240, 38),
    scale(0.3),
    layer("ui"),
    fixed(),
    { time: TIME_LEFT },
  ]);

  const bulletTimer = add([
    {
      time: BULLET_TIME_LEFT,
    },
  ]);
  add([text("Time Remaining: "), pos(20, 38), scale(0.3), fixed()]);
  onUpdate(() => {
    (timer.time -= dt()), (timer.text = timer.time.toFixed(2));

    if (timer.time <= 0) {
      go("lose", { score: scoreLabel.value });
    }
  });

  add([text("C - Controls"), pos(20, 54), scale(0.3), fixed()]);

  const controlsInfo = () => {
    add([text("Left - A or Left Arrow Key"), pos(20, 70), scale(0.3), fixed()]);
    add([
      text("Right - D or Right Arrow Key"),
      pos(20, 86),
      scale(0.3),
      fixed(),
    ]);
    add([text("Jump - Space"), pos(20, 102), scale(0.3), fixed()]);
    add([text("Shoot - B"), pos(20, 118), scale(0.3), fixed()]);
    add([
      text("Use Pipe - S or Down Arrow"),
      pos(20, 134),
      scale(0.3),
      fixed(),
    ]);
  };

  onKeyPress("c", controlsInfo);

  // Bullet functionality
  // positon of player as parameter
  function spawnBullet(position) {
    // define a rectangular area around the player position
    // give bullet as a tag
    add([
      //rect(10, 1),
      sprite("BulletVaccineMushroom"),
      pos(position),
      origin("center"),
      color(1, 500, 10),
      scale(0.1),
      "bullet",
      area(),
    ]);
  }

  // Releasing bullet functionality
  onKeyDown("b", () => {
    //if (isBig)
    // set the bullet time
    bulletTimer.time = BULLET_TIME_LEFT;
    spawnBullet(player.pos.add(25, -10));
  });

  //move the bullets
  onUpdate("bullet", (b) => {
    //destroy(b);

    b.move(ENEMY_SPEED * 3, 0);
    // whenever a bullet is released decrement the time given to it.
    bulletTimer.time -= dt();
    if (bulletTimer.time <= 0) {
      destroy(b);
    }
  });
  onCollide("dangerous", "bullet", (d, b) => {
    //shake(40);
    destroy(d);
    destroy(b);
  });

  // The mobile version begins
  //The following is for the mobile support
  //##############MOBILE##################
  if (isTouch()) {
    //console.log(isTouch);

    //because left and right buttons will be pressed
    //we need to keep track of them
    const keyDownOnMobile = {
      left: false,
      right: false,
      // we will set them to true when these buttons are tocuhed
    };

    const moveLeft = () => {
      player.move(-MOVE_SPEED, 0);
    };

    const moveRight = () => {
      player.move(MOVE_SPEED, 0);
    };

    //Mobile Buttons
    const leftButton = add([
      sprite("a"),
      pos(50, 450),
      opacity(0.5),
      fixed(),
      area(),
    ]);

    const rightButton = add([
      sprite("d"),
      pos(125, 450),
      opacity(0.5),
      fixed(),
      area(),
    ]);

    const actionButton = add([
      sprite("highjump"),
      pos(750, 450),
      opacity(0.5),
      fixed(),
      area(),
    ]);

    const shootButton = add([
      sprite("shoot"),
      pos(650, 450),
      opacity(0.5),
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

    onTouchStart((jumpPress, pos) => {
      if (actionButton.hasPoint(pos)) {
        jumping();
        actionButton.opacity = 1;
      }
    });

    onTouchStart((shootPress, pos) => {
      if (shootButton.hasPoint(pos)) {
        spawnBullet(player.pos.add(25, -10));
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
      keyDownOnMobile.left = false;
      leftButton.opacity = 0.5;
    });

    onTouchEnd((rightPress, pos) => {
      keyDownOnMobile.right = false;
      rightButton.opacity = 0.5;
    });

    onTouchEnd((actionPress, pos) => {
      actionButton.opacity = 0.5;
    });

    onTouchEnd((shootPress, pos) => {
      shootButton.opacity = 0.5;
    });

    onUpdate(() => {
      if (keyDownOnMobile.left) {
        moveLeft();
      } else if (keyDownOnMobile.right) {
        moveRight();
      }
    });
  }

  //The mobile version ends
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
//go("game", { level: 0, score: 0 });
