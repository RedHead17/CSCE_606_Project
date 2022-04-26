import kaboom from "../../node_modules/kaboom";
import { playableMap } from "./PlayableMap";
import { info } from "./info";
const AGRO_RANGE_X = 300;
const AGRO_RANGE_Y = 75;
const MOVE_SPEED = 150;
const JUMP_FORCE = 560;
const BIG_JUMP_FORCE = 750;
let CURRENT_JUMP_FORCE = JUMP_FORCE;
let BUTTON_YPOS = window.innerHeight;
let BUTTON_FAR_XPOS = window.innerWidth - 750;
const ENEMY_SPEED = 20;
let isJumping = true;
const FALL_DEATH = 700;
const TIME_LEFT = 200;
const BULLET_TIME_LEFT = 4;
let isBig = false;
let buttonsVisible = true;
let loadingLevel = true;
let BASE_SCALE = 1;

let hasBulletAbility = false;
let enemyVelocity = 3 * ENEMY_SPEED;
let enemyMove = 0;
let CONTROL_OPACITY = 0;

const k = kaboom({
  global: true,
  // enable full screen
  fullscreen: true,

  scale: 2,
  background: [0, 0, 1],
  clearColor: [255, 255, 255],
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

    pos(window.innerWidth / 2 - 20, window.innerHeight / 2 - 80),
    color(10, 10, 155),

    origin("center"),
    "button",
    {
      clickAction: () => {
        go("vaccineInfoScene", { level: 0, score: 0 });
      },
      touchAction: () => {
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
  // To add a different colour when the mouse is hovered
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
// Win Screen to display the score and option to play again
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

// Responsive resizing
window.addEventListener("resize", resize, false);

window.mobileAndTabletCheck = function () {
  let check = false;
  (function (a) {
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
        a
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        a.substr(0, 4)
      )
    )
      check = true;
  })(navigator.userAgent || navigator.vendor || window.opera);
  console.log("Check is " + check);
  if (check) {
    return 3;
  }
  return 1;
};

// Calls resize based on window size
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
  BUTTON_YPOS = window.innerHeight;
  BUTTON_FAR_XPOS = window.innerWidth - 750;
}

//add scenes
//coins
loadRoot("https://i.imgur.com/");
loadSprite("coin", "O0rwU31.png"); //https://imgur.com/O0rwU31

//enenmies

loadSprite("evil-shroom", "KPO3fR9.png");
loadSprite("covid", "m2A06Eg.png"); // https://imgur.com/m2A06Eg

loadSprite("brick", "pogC9x5.png");
//blocks

//bricks
// New brick:
//https://i.imgur.com/X3a5liL.png

// Old brick : "M6rwarW.png"
loadSprite("block", "M6rwarW.png");

//mario

// New Doctor Sprite : Rp0NvTW;

// Old Mario : Wb1qfhK
loadSprite("mario", "LON98VQ.png"); //https://imgur.com/LON98VQ

loadSprite("mushroom", "wm9BL0V.png");

//BiggerMushroom
loadSprite("BigVaccineMushroom", "wm9BL0V.jpg"); // https://imgur.com/wm9BL0V

//Mushroom for bullets
loadSprite("BulletVaccineMushroom", "ertkPgG.jpg"); // https://imgur.com/ertkPgG

// Sprite for surprise
loadSprite("surprise", "gesQ1KP.png");

// Sprite to be displayed when surprise is hit
loadSprite("unboxed", "bdrLpi6.png");

// Used for pipes at the end for going to next Level
loadSprite("pipe-top-left", "ReTPiWY.png");

loadSprite("pipe-top-right", "hj2GK4n.png");

loadSprite("pipe-bottom-left", "c1cYSbt.png");

loadSprite("pipe-bottom-right", "nqQ79eI.png");

// Some different blocks --- coloured
loadSprite("blue-block", "fVscIbn.png");

loadSprite("blue-brick", "3e5YRQd.png");

loadSprite("blue-steel", "gqVoI2b.png");

//https://imgur.com/wDkFVQt
loadSprite("blue-evil-shroom", "wDkFVQt.png");

loadSprite("blue-surprise", "RMqCc1G.png");

// Buttons for mobile
loadSprite("a", "A34cvsW.png"); //https://imgur.com/A34cvsW

loadSprite("d", "Ne911cW.png"); //https://imgur.com/Ne911cW

loadSprite("highjump", "mFC6zMN.png"); //https://imgur.com/mFC6zMN

loadSprite("shoot", "W5W3CDL.png"); //https://imgur.com/W5W3CDL

// Background Sprite
loadSprite("background", "WCSitcB.jpeg"); //https://imgur.com/WCSitcB

// Game Scene begins
// Major functionality goes here
// Passed from Menu--->Vaccine Info Scene---->Menu--->Winner
scene("game", ({ level, score }) => {
  //create layers
  //An array

  if (window.mobileAndTabletCheck()) {
    BASE_SCALE = 1;
  }
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

    // load in some sprites
    // Assign some characters to be used in maps
    // parameters 1: name of the sprite, 2: solid , 3: properties(solid(), body(), scale()) 4: tags(easily used for call backs)

    "=": () => [sprite("block"), solid(), area(), "brick"],
    _: () => [sprite("block"), solid(), area(), "block"],
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
    "(": () => [
      sprite("pipe-bottom-left"),
      solid(),
      scale(0.5),
      "pipe",
      area(),
    ],

    ")": () => [
      sprite("pipe-bottom-right"),
      solid(),
      scale(0.5),
      "pipe",
      area(),
    ],

    "-": () => [sprite("pipe-top-left"), solid(), scale(0.5), "pipe", area()],

    "+": () => [sprite("pipe-top-right"), solid(), scale(0.5), "pipe", area()],

    "^": () => [
      sprite("covid"),
      solid(),
      scale(1),
      body(),
      "dangerous1",
      area(),
    ],

    "#": () => [
      sprite("mushroom"),
      solid(),
      scale(1),
      "mushroom",
      body(),
      area(),
    ],

    o: () => [
      sprite("BigVaccineMushroom"),
      solid(),
      "BigVaccineMushroom",
      body(),
      scale(1),
      area(),

      scale(0.1, 0.1),
    ],
    p: () => [
      sprite("BulletVaccineMushroom"),
      solid(),
      "BulletVaccineMushroom",
      body(),
      scale(1),
      area(),
      scale(0.1, 0.1),
    ],

    "!": () => [sprite("blue-block"), solid(), scale(0.5), area()],
    "£": () => [sprite("blue-brick"), solid(), scale(0.5), area(), "brick"],

    z: () => [
      sprite("blue-evil-shroom"),
      // solid(),
      scale(1),
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
    x: () => [sprite("blue-steel"), solid(), area(), scale(1)],
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

  // Function to control the size of mario
  // Big and Small
  // Resizing
  // Bullet Functionality enabling
  function big() {
    let timer = 0;
    // let isBig = false;
    return {
      update() {
        if (isBig) {
          // change the jump force
          CURRENT_JUMP_FORCE = BIG_JUMP_FORCE;

          //delta time is a JS method ""time since last frame"
          // timer -= dt();
          // if (timer <= 0) {
          //   //if time <0 then we have to make mario small
          //   this.smallify();
          // }
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

      biggify() {
        this.scale = vec2(2);

        // timer = time;
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
    scale(1),
    origin("bot"),
  ]);

  if (isBig) player.scale = vec2(2);
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
    player.biggify();
  });

  player.onCollide("BigVaccineMushroom", (m) => {
    // pick a Big Vaccine mushroom and destroy the object
    destroy(m);
    //Now biggify for 6 seconds
    player.biggify();
  });

  player.onCollide("BulletVaccineMushroom", (m) => {
    // pick a Big Vaccine mushroom and destroy the object
    destroy(m);
    //Now biggify for 6 seconds
    player.biggify();
  });

  player.onCollide("coin", (c) => {
    destroy(c);
    // increase the value of the score

    scoreLabel.value++;

    // then display the score
    scoreLabel.text = scoreLabel.value;
  });

  // Let us make evils move

  onUpdate("dangerous1", (d) => {
    enemyMove += 1;
    if (enemyMove > 200) {
      enemyVelocity *= -1;
      enemyMove = 0;
    }
    // d.onCollide("block", (d1) => {
    //     console.log(d1.pos.x)
    //     enemyVelocity *= -1;
    //     let i = 1000000
    //     while (i > -1) {
    //         i--;
    //     }
    // });
    // d.onCollide("pipe", (d1) => {
    //     console.log(d1.pos.x)
    //     enemyVelocity *= -1;
    //     let i = 100000
    //     while (i > -1) {
    //         i--;
    //     }
    // });

    d.move(enemyVelocity, 0);
  });

  // Make enemies moving
  // They move only when the player is in range
  // So that they are bound and do not move indefinitely towards Player
  onUpdate("dangerous", (d) => {
    let x_dist = d.pos.x - player.pos.x;
    let y_dist = d.pos.y - (player.pos.y - 20);

    // Check how far away the guy is and if it's already moving.
    // Bias x distance over y distance
    d.moving = d.moving
      ? true
      : Math.abs(x_dist) < AGRO_RANGE_X && Math.abs(y_dist) < AGRO_RANGE_Y;
    if (!d.moving) return;

    let level_scaling = Math.min(level + 1, 4);
    let movement = 3 * ENEMY_SPEED * level_scaling;
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
    // console.log((d.pos.y) + " " + player.pos.y)
    if (player.pos.y == d.pos.y || isJumping) {
      // console.log("detect")
      destroy(d);
    } else if (isBig) {
      // When enemy and player collides Big Player becomes Small
      // Small Player dies
      player.smallify();
      destroy(d);
    } else {
      // go to a lose scene and display the final score
      go("lose", { score: scoreLabel.value });
    }
  });
  player.onCollide("dangerous1", (d) => {
    // console.log((d.pos.y) + " " + player.pos.y)
    if (player.pos.y == d.pos.y || isJumping) {
      // console.log("detect")
      destroy(d);
    } else if (isBig) {
      // When enemy and player collides Big Player becomes Small
      // Small Player dies
      player.smallify();
      destroy(d);
    } else {
      // go to a lose scene and display the final score
      go("lose", { score: scoreLabel.value });
    }
  });

  // //camPos(player.pos);
  onUpdate(() => {
    // Make camera Position same as player position

    camPos(player.pos);
    //toScreen(player.pos);

    // So whenever the y coordinate of the player is greater than death value then go to lose scene
    if (player.pos.y >= FALL_DEATH) {
      // Ideally it is the case when the player falls into holes
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
    //level = level + 1;
    console.log("map count: " + playableMap.length);
    if (playableMap.length > level + 1) {
      go("vaccineInfoScene", { level: level + 1, score: scoreLabel.value });
    } else {
      level = 0;
      go("winner", { score: scoreLabel.value });
    }
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

  // Bullet Timer
  // Bullet when spawned disappears after a set time
  const bulletTimer = add([
    {
      time: BULLET_TIME_LEFT,
    },
  ]);

  // Text on UI screen to display time
  add([text("Time Remaining: "), pos(20, 38), scale(0.3), fixed()]);
  onUpdate(() => {
    (timer.time -= dt()), (timer.text = timer.time.toFixed(2));

    if (timer.time <= 0) {
      go("lose", { score: scoreLabel.value });
    }
  });

  // Controls to assist players
  add([text("C - Controls"), pos(20, 54), scale(0.3), fixed()]);

  const left_control = add([
    text("Left - A or Left Arrow Key"),
    pos(20, 70),
    scale(0.3),
    fixed(),
    opacity(CONTROL_OPACITY),
  ]);
  const right_control = add([
    text("Right - D or Right Arrow Key"),
    pos(20, 86),
    scale(0.3),
    fixed(),
    opacity(CONTROL_OPACITY),
  ]);
  const jump_control = add([
    text("Jump - Space"),
    pos(20, 102),
    scale(0.3),
    fixed(),
    opacity(CONTROL_OPACITY),
  ]);
  const jumpinfo_control = add([
    text("   *Jump on enemies to kill them"),
    pos(20, 118),
    scale(0.3),
    fixed(),
    opacity(CONTROL_OPACITY),
  ]);
  const shoot_control = add([
    text("Shoot - B"),
    pos(20, 136),
    scale(0.3),
    fixed(),
    opacity(CONTROL_OPACITY),
  ]);

  const controlsInfo = () => {
    CONTROL_OPACITY = (CONTROL_OPACITY - 1) ** 2;
    left_control.opacity = CONTROL_OPACITY;
    right_control.opacity = CONTROL_OPACITY;
    jump_control.opacity = CONTROL_OPACITY;
    jumpinfo_control.opacity = CONTROL_OPACITY;
    shoot_control.opacity = CONTROL_OPACITY;
  };

  onKeyPress("c", controlsInfo);

  // Bullet functionality
  // positon of player as parameter
  function spawnBullet(p) {
    if (isBig) {
      add([
        rect(10, 1),
        pos(p),
        origin("center"),
        color(255, 0.5, 1),
        scale(1),
        "bullet",
        area(),
      ]);
    }
  }

  // Releasing bullet functionality
  onKeyDown("b", () => {
    //if (isBig)
    // set the bullet time
    bulletTimer.time = BULLET_TIME_LEFT;
    if (isBig) spawnBullet(player.pos.add(25, -10));
  });

  //move the bullets
  onUpdate("bullet", (b) => {
    //destroy(b);

    b.move(ENEMY_SPEED * 9, 0);
    // whenever a bullet is released decrement the time given to it.
    bulletTimer.time -= dt();
    if (bulletTimer.time <= 0) {
      destroy(b);
    }
  });
  onCollide("dangerous", "bullet", (d, b) => {
    //shake(40);
    destroy(b);
    destroy(d);
  });
  onCollide("dangerous1", "bullet", (d, b) => {
    //shake(40);
    destroy(b);
    destroy(d);
  });

  // The mobile version begins
  //The following is for the mobile support
  //##############MOBILE##################
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

    const moveLeft = () => {
      player.move(-MOVE_SPEED, 0);
    };

    const moveRight = () => {
      player.move(MOVE_SPEED, 0);
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
      pos(80, height() - 25),
      opacity(0.5),
      origin("botleft"),
      scale(BASE_SCALE),
      fixed(),
      area(),
    ]);

    const actionButton = add([
      sprite("highjump"),
      pos(width() - 30, height() - 25),
      opacity(0.5),
      origin("botright"),
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
    //Separate starts allow for mulitple button presses
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

// Lose scene
scene("lose", ({ score }) => {
  add([text(score, 32), origin("center"), pos(width() / 2, height() / 2)]);
  add([
    text("Game Over."),
    color(200, 50, 10),
    scale(0.5),
    origin("center"),
    pos(width() / 2, height() / 2 - 120),
  ]);
  add([
    text("Going Back to Main Menu"),
    color(200, 50, 10),
    scale(0.5),
    origin("center"),
    pos(width() / 2, height() / 2 - 80),
  ]);

  // start the game
  wait(2, () => {
    window.location = "./mario_menu.html";
  });
});

// Vaccine Info Scene
// To display awareness information relateed to vaccination
// At the end of each level, info is displayed
// Uses array of info from info.js

scene("vaccineInfoScene", ({ level, score }) => {
  layers(["ui", "bg"], "bg");
  const infoColor = add([
    rect(window.innerWidth, window.innerHeight),
    color(10, 0, 10),
    layer("bg", "ui"),
    fixed(),
  ]);
  add([
    text(info[level % info.length], {
      size: 35, // 48 pixels tall
      width: window.innerWidth,
      font: "apl386o",

      // it'll wrap to next line when width exceeds this value
    }),

    scale(0.5),
    color(200, 144, 255),
    pos(20, 70),

    //area(),
  ]),
    add([
      text("Loading next Level... Please Wait..."),
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
//go("game", { level: 0, score: 0 });
go("vaccineInfoScene", { level: 0, score: 0 });
