// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"src_mario/src/game.js":[function(require,module,exports) {
//import kaboom from "../../node_modules/kaboom/dist/kaboom.mjs";
var AGRO_RANGE_X = 300;
var AGRO_RANGE_Y = 75;
var MOVE_SPEED = 150;
var JUMP_FORCE = 560;
var BIG_JUMP_FORCE = 750;
var CURRENT_JUMP_FORCE = JUMP_FORCE;
var BUTTON_YPOS = window.innerHeight;
var BUTTON_FAR_XPOS = window.innerWidth - 750;
var ENEMY_SPEED = 20;
var isJumping = true;
var FALL_DEATH = 700;
var TIME_LEFT = 200;
var BULLET_TIME_LEFT = 4;
var _isBig = false;
var buttonsVisible = true;
var loadingLevel = true;
var BASE_SCALE = 1;
var hasBulletAbility = false;
var enemyVelocity = 3 * ENEMY_SPEED;
var enemyMove = 0;
var CONTROL_OPACITY = 0;
var k = kaboom({
  global: true,
  // enable full screen
  fullscreen: true,
  scale: 2,
  background: [0, 0, 1],
  clearColor: [255, 255, 255],
  // for debug mode
  debug: true
}); //This is for Menu

scene("menu", function () {
  var x = 10,
      y = 10,
      z = 155;
  color(240, 100, 24);
  add([text("Mario game"), pos(window.innerWidth / 2 - 240, window.innerHeight / 2 - 200),, scale(1), color(10, 10, 155), area(), "title"], origin("center")); // Play game button

  add([//rect(260, 20),
  text("Play game"), pos(window.innerWidth / 2 - 20, window.innerHeight / 2 - 80), color(10, 10, 155), origin("center"), "button", {
    clickAction: function clickAction() {
      go("vaccineInfoScene", {
        level: 0,
        score: 0
      });
    },
    touchAction: function touchAction() {
      go("vaccineInfoScene", {
        level: 0,
        score: 0
      });
    }
  }, scale(0.7), area(),,]);
  add([//rect(260, 20),
  text("Back to Main Menu"), color(10, 10, 155), pos(window.innerWidth / 2 - 20, window.innerHeight / 2), "button", {
    clickAction: function clickAction() {
      return window.location = "../../index.html";
    }
  }, scale(0.7), area(), origin("center")]); // To add a different colour when the mouse is hovered

  action("button", function (b) {
    onHover("button", function (b) {
      b.use(color(240, 100, 155));
    });
    b.use(color(10, 10, 155));
  });
  onClick("button", function (b) {
    b.clickAction();
  });
}); // Win Screen to display the score and option to play again

scene("winner", function (_ref) {
  var score = _ref.score;
  var x = 10,
      y = 10,
      z = 155;
  color(240, 100, 24);
  add([text("Congratulations!"), pos(window.innerWidth / 2 - 350, window.innerHeight / 2 - 200),, scale(1), color(10, 10, 155), area(), "title"], origin("center"));
  add([text("Score: " + score, 32), origin("center"), pos(width() / 2 - 40, window.innerHeight / 2 - 100)]); // Play game button

  add([//rect(260, 20),
  text("Play Again"), pos(window.innerWidth / 2 - 20, window.innerHeight / 2 - 40), color(10, 10, 155), origin("center"), "button", {
    clickAction: function clickAction() {
      go("vaccineInfoScene", {
        level: 0,
        score: 0
      }); //go("game", { level: 0, score: 0 });
    }
  }, scale(0.7), area(),,]);
  add([//rect(260, 20),
  text("Back to Main Menu"), color(10, 10, 155), pos(window.innerWidth / 2 - 20, window.innerHeight / 2 + 40), "button", {
    clickAction: function clickAction() {
      return window.location = "../../index.html";
    }
  }, scale(0.7), area(), origin("center")]);
  action("button", function (b) {
    onHover("button", function (b) {
      b.use(color(240, 100, 155));
    });
    b.use(color(10, 10, 155));
  });
  onClick("button", function (b) {
    b.clickAction();
  });
}); // Responsive resizing

window.addEventListener("resize", resize, false);

window.mobileAndTabletCheck = function () {
  var check = false;

  (function (a) {
    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
  })(navigator.userAgent || navigator.vendor || window.opera);

  console.log("Check is " + check);

  if (check) {
    return 3;
  }

  return 1;
}; // Calls resize based on window size


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
} //add scenes
//coins


loadRoot("https://i.imgur.com/");
loadSprite("coin", "O0rwU31.png"); //https://imgur.com/O0rwU31
//enenmies

loadSprite("evil-shroom", "KPO3fR9.png");
loadSprite("covid", "m2A06Eg.png"); // https://imgur.com/m2A06Eg

loadSprite("brick", "pogC9x5.png"); //blocks
//bricks
// New brick:
//https://i.imgur.com/X3a5liL.png
// Old brick : "M6rwarW.png"

loadSprite("block", "M6rwarW.png"); //mario
// New Doctor Sprite : Rp0NvTW;
// Old Mario : Wb1qfhK

loadSprite("mario", "LON98VQ.png"); //https://imgur.com/LON98VQ

loadSprite("mushroom", "wm9BL0V.png"); //BiggerMushroom

loadSprite("BigVaccineMushroom", "wm9BL0V.jpg"); // https://imgur.com/wm9BL0V
//Mushroom for bullets

loadSprite("BulletVaccineMushroom", "ertkPgG.jpg"); // https://imgur.com/ertkPgG
// Sprite for surprise

loadSprite("surprise", "gesQ1KP.png"); // Sprite to be displayed when surprise is hit

loadSprite("unboxed", "bdrLpi6.png"); // Used for pipes at the end for going to next Level

loadSprite("pipe-top-left", "ReTPiWY.png");
loadSprite("pipe-top-right", "hj2GK4n.png");
loadSprite("pipe-bottom-left", "c1cYSbt.png");
loadSprite("pipe-bottom-right", "nqQ79eI.png"); // Some different blocks --- coloured

loadSprite("blue-block", "fVscIbn.png");
loadSprite("blue-brick", "3e5YRQd.png");
loadSprite("blue-steel", "gqVoI2b.png"); //https://imgur.com/wDkFVQt

loadSprite("blue-evil-shroom", "wDkFVQt.png");
loadSprite("blue-surprise", "RMqCc1G.png"); // Buttons for mobile

loadSprite("a", "A34cvsW.png"); //https://imgur.com/A34cvsW

loadSprite("d", "Ne911cW.png"); //https://imgur.com/Ne911cW

loadSprite("highjump", "mFC6zMN.png"); //https://imgur.com/mFC6zMN

loadSprite("shoot", "W5W3CDL.png"); //https://imgur.com/W5W3CDL
// Background Sprite

loadSprite("background", "WCSitcB.jpeg"); //https://imgur.com/WCSitcB
// Game Scene begins
// Major functionality goes here
// Passed from Menu--->Vaccine Info Scene---->Menu--->Winner

scene("game", function (_ref2) {
  var level = _ref2.level,
      score = _ref2.score;

  //create layers
  //An array
  if (window.mobileAndTabletCheck()) {
    BASE_SCALE = 1;
  } // background layer, object layer as default, UI layer
  // initialise with obj as default


  layers(["bg", "obj", "ui"], "obj");
  add([sprite("background"), // Make the background centered on the screen
  pos(width() / 2, height() / 2), origin("center"), // Allow the background to be scaled
  scale(5), // Keep the background position fixed even when the camera moves
  fixed()]); //level configuration

  var levelCfg = {
    //every sprite has a width and height
    width: 20,
    height: 20,
    // load in some sprites
    // Assign some characters to be used in maps
    // parameters 1: name of the sprite, 2: solid , 3: properties(solid(), body(), scale()) 4: tags(easily used for call backs)
    "=": function _() {
      return [sprite("block"), solid(), area(), "brick"];
    },
    _: function _() {
      return [sprite("block"), solid(), area(), "block"];
    },
    $: function $() {
      return [sprite("coin"), "coin", area()];
    },
    "%": function _() {
      return [sprite("surprise"), solid(), "coin-surprise", area()];
    },
    "*": function _() {
      return [sprite("surprise"), solid(), "mushroom-surprise", area()];
    },
    //Newly added sprites begin here
    u: function u() {
      return [sprite("surprise"), solid(), "BigVaccineMushroomSurprise", area()];
    },
    v: function v() {
      return [sprite("surprise"), solid(), "BulletVaccineMushroomSurprise", area()];
    },
    //Newly added Sprites end here
    "}": function _() {
      return [sprite("unboxed"), solid(), area()];
    },
    "(": function _() {
      return [sprite("pipe-bottom-left"), solid(), scale(0.5), "pipe", area()];
    },
    ")": function _() {
      return [sprite("pipe-bottom-right"), solid(), scale(0.5), "pipe", area()];
    },
    "-": function _() {
      return [sprite("pipe-top-left"), solid(), scale(0.5), "pipe", area()];
    },
    "+": function _() {
      return [sprite("pipe-top-right"), solid(), scale(0.5), "pipe", area()];
    },
    "^": function _() {
      return [sprite("covid"), solid(), scale(1), body(), "dangerous1", area()];
    },
    "#": function _() {
      return [sprite("mushroom"), solid(), scale(1), "mushroom", body(), area()];
    },
    o: function o() {
      return [sprite("BigVaccineMushroom"), solid(), "BigVaccineMushroom", body(), scale(1), area(), scale(0.1, 0.1)];
    },
    p: function p() {
      return [sprite("BulletVaccineMushroom"), solid(), "BulletVaccineMushroom", body(), scale(1), area(), scale(0.1, 0.1)];
    },
    "!": function _() {
      return [sprite("blue-block"), solid(), scale(0.5), area()];
    },
    "£": function _() {
      return [sprite("blue-brick"), solid(), scale(0.5), area(), "brick"];
    },
    z: function z() {
      return [sprite("blue-evil-shroom"), // solid(),
      scale(1), // body(),
      area(), "dangerous"];
    },
    "@": function _() {
      return [sprite("blue-surprise"), solid(), area(), scale(0.5), "coin-surprise"];
    },
    x: function x() {
      return [sprite("blue-steel"), solid(), area(), scale(1)];
    }
  }; // now just create a  gamelevel(JS method) and pass the map and levelCfg

  var gameLevel = addLevel(playableMap[level], levelCfg); // add some text to display score and position on UI layer
  // default layer is 'obj '
  // so change layer to 'ui' for adding score
  //define this as a method so that it can be passed to other levels

  add([text("Score:"), scale(0.3), pos(20, 6), fixed()]);
  var scoreLabel = add([//text(score),
  text(parseInt(score)), pos(115, 6), scale(0.3), fixed(), layer("ui"), {
    value: score
  }]); // add a text to define which level we currently are in
  // parameters for add are text, position

  add([text("Level: " + parseInt(level + 1)), pos(20, 22), scale(0.3), fixed()]); // Function to control the size of mario
  // Big and Small
  // Resizing
  // Bullet Functionality enabling

  function big() {
    var timer = 0; // let isBig = false;

    return {
      update: function update() {
        if (_isBig) {
          // change the jump force
          CURRENT_JUMP_FORCE = BIG_JUMP_FORCE; //delta time is a JS method ""time since last frame"
          // timer -= dt();
          // if (timer <= 0) {
          //   //if time <0 then we have to make mario small
          //   this.smallify();
          // }
        }
      },
      isBig: function isBig() {
        return _isBig;
      },
      smallify: function smallify() {
        this.scale = vec2(1, 1);
        CURRENT_JUMP_FORCE = JUMP_FORCE;
        timer = 0;
        _isBig = false;
      },
      biggify: function biggify() {
        this.scale = vec2(2); // timer = time;

        _isBig = true;
      }
    };
  } // create mario


  var player = add([sprite("mario"), solid(), pos(0, 0), body(), big(), area(), scale(1), origin("bot")]);
  if (_isBig) player.scale = vec2(2); //Now make the mushroom move
  // Whenever you grab anything with a tag of mushroom,

  onUpdate("mushroom", function (m) {
    // speed= 20
    m.move(20, 0); // but here the mushrrom wont fall'
    // So we need to add gravity
  });
  player.on("headbutt", function (obj) {
    // we will check if he bumped an object and if the name of the object happens to be a coin surprise
    // return a coin
    if (obj.is("coin-surprise")) {
      // Now spawn the coin and place the coin just above the grid 1 pos above along Y axis
      gameLevel.spawn("$", obj.gridPos.sub(0, 1)); // Now destroy the old one

      destroy(obj); // after destroying replace with an unboxed so that he cam jump onto it and collect the coin

      gameLevel.spawn("}", obj.gridPos.sub(0, 0));
    }

    if (obj.is("mushroom-surprise")) {
      // Now spawn the mushroom and place the mushroom just above the grid 1 pos above along Y axis
      gameLevel.spawn("#", obj.gridPos.sub(0, 1)); // Now destroy the old one

      destroy(obj); // after destroying replace with an unboxed so that he cam jump onto it and collect the mushroom

      gameLevel.spawn("}", obj.gridPos.sub(0, 0));
    }

    if (obj.is("brick")) {
      destroy(obj);
    }

    if (obj.is("BigVaccineMushroomSurprise")) {
      // Now spawn the mushroom and place the mushroom just above the grid 1 pos above along Y axis
      gameLevel.spawn("o", obj.gridPos.sub(0, 1)); // Now destroy the old one

      destroy(obj); // after destroying replace with an unboxed so that he cam jump onto it and collect the mushroom

      gameLevel.spawn("}", obj.gridPos.sub(0, 0));
    }

    if (obj.is("BulletVaccineMushroomSurprise")) {
      // Now spawn the mushroom and place the mushroom just above the grid 1 pos above along Y axis
      gameLevel.spawn("p", obj.gridPos.sub(0, 1)); // Now destroy the old one

      destroy(obj); // after destroying replace with an unboxed so that he cam jump onto it and collect the mushroom

      gameLevel.spawn("}", obj.gridPos.sub(0, 0));
    }
  });
  player.onCollide("mushroom", function (m) {
    // pick a mushroom and destroy the object
    destroy(m); //Now biggify for 6 seconds

    player.biggify();
  });
  player.onCollide("BigVaccineMushroom", function (m) {
    // pick a Big Vaccine mushroom and destroy the object
    destroy(m); //Now biggify for 6 seconds

    player.biggify();
  });
  player.onCollide("BulletVaccineMushroom", function (m) {
    // pick a Big Vaccine mushroom and destroy the object
    destroy(m); //Now biggify for 6 seconds

    player.biggify();
  });
  player.onCollide("coin", function (c) {
    destroy(c); // increase the value of the score

    scoreLabel.value++; // then display the score

    scoreLabel.text = scoreLabel.value;
  }); // Let us make evils move

  onUpdate("dangerous1", function (d) {
    enemyMove += 1;

    if (enemyMove > 200) {
      enemyVelocity *= -1;
      enemyMove = 0;
    } // d.onCollide("block", (d1) => {
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
  }); // Make enemies moving
  // They move only when the player is in range
  // So that they are bound and do not move indefinitely towards Player

  onUpdate("dangerous", function (d) {
    var x_dist = d.pos.x - player.pos.x;
    var y_dist = d.pos.y - (player.pos.y - 20); // Check how far away the guy is and if it's already moving.
    // Bias x distance over y distance

    d.moving = d.moving ? true : Math.abs(x_dist) < AGRO_RANGE_X && Math.abs(y_dist) < AGRO_RANGE_Y;
    if (!d.moving) return;
    var level_scaling = Math.min(level + 1, 4);
    var movement = 3 * ENEMY_SPEED * level_scaling;
    var x_move = movement;
    var y_move = movement; // Set movement to negative if needed.

    if (x_dist > 0) x_move = -1 * x_move;
    if (y_dist > 0) y_move = -1 * y_move;
    d.move(x_move, y_move);
  }); // if player onCollide with anythig with dangerous
  // big mario becomes small
  // small mario dies

  player.onCollide("dangerous", function (d) {
    // console.log((d.pos.y) + " " + player.pos.y)
    if (player.pos.y == d.pos.y || isJumping) {
      // console.log("detect")
      destroy(d);
    } else if (_isBig) {
      // When enemy and player collides Big Player becomes Small
      // Small Player dies
      player.smallify();
      destroy(d);
    } else {
      // go to a lose scene and display the final score
      go("lose", {
        score: scoreLabel.value
      });
    }
  });
  player.onCollide("dangerous1", function (d) {
    // console.log((d.pos.y) + " " + player.pos.y)
    if (player.pos.y == d.pos.y || isJumping) {
      // console.log("detect")
      destroy(d);
    } else if (_isBig) {
      // When enemy and player collides Big Player becomes Small
      // Small Player dies
      player.smallify();
      destroy(d);
    } else {
      // go to a lose scene and display the final score
      go("lose", {
        score: scoreLabel.value
      });
    }
  }); // //camPos(player.pos);

  onUpdate(function () {
    // Make camera Position same as player position
    camPos(player.pos); //toScreen(player.pos);
    // So whenever the y coordinate of the player is greater than death value then go to lose scene

    if (player.pos.y >= FALL_DEATH) {
      // Ideally it is the case when the player falls into holes
      go("lose", {
        score: scoreLabel.value
      });
    }
  }); // keyDown is a method that takes inpiut from keyboard,
  // So  if we press left key , the arrow function will be executed

  onKeyDown("left", function () {
    // left we need to have minus direction
    player.move(-MOVE_SPEED, 0);
  });
  onKeyDown("a", function () {
    player.move(-MOVE_SPEED, 0);
  });
  onKeyDown("right", function () {
    // right we need to have plus direction
    player.move(MOVE_SPEED, 0);
  });
  onKeyDown("d", function () {
    player.move(MOVE_SPEED, 0);
  }); // So during any action if the player is grounded
  // then make isJumping to false

  onUpdate(function () {
    if (player.grounded()) {
      isJumping = false;
    }
  }); // if the player onCollide with any tag name pipe and presses KeyDown (for that case anykey you wish)
  //then he has to go to Next Level
  // or create a house and then use the key desired

  player.onCollide("pipe", function () {
    //level = level + 1;
    console.log("map count: " + playableMap.length);

    if (playableMap.length > level + 1) {
      go("vaccineInfoScene", {
        level: level + 1,
        score: scoreLabel.value
      });
    } else {
      level = 0;
      go("winner", {
        score: scoreLabel.value
      });
    }
  }); // we will define a function jump so that it can be reused both by touch and keyboard

  var jumping = function jumping() {
    if (player.grounded()) {
      // Make is Jumping to true when a space is pressed
      isJumping = true; // jump with current jump force big or small mario force

      player.jump(CURRENT_JUMP_FORCE);
    }
  }; // similarly we can add for bullet
  //keyPress is a JS method especially used here to make use of space key to jump


  onKeyPress("space", jumping); //onKeyPress("w", jumping);
  //onKeyPress("up", jumping);
  // timer functionality in game scene

  var timer = add([text("0"), pos(240, 38), scale(0.3), layer("ui"), fixed(), {
    time: TIME_LEFT
  }]); // Bullet Timer
  // Bullet when spawned disappears after a set time

  var bulletTimer = add([{
    time: BULLET_TIME_LEFT
  }]); // Text on UI screen to display time

  add([text("Time Remaining: "), pos(20, 38), scale(0.3), fixed()]);
  onUpdate(function () {
    timer.time -= dt(), timer.text = timer.time.toFixed(2);

    if (timer.time <= 0) {
      go("lose", {
        score: scoreLabel.value
      });
    }
  }); // Controls to assist players

  add([text("C - Controls"), pos(20, 54), scale(0.3), fixed()]);
  var left_control = add([text("Left - A or Left Arrow Key"), pos(20, 70), scale(0.3), fixed(), opacity(CONTROL_OPACITY)]);
  var right_control = add([text("Right - D or Right Arrow Key"), pos(20, 86), scale(0.3), fixed(), opacity(CONTROL_OPACITY)]);
  var jump_control = add([text("Jump - Space"), pos(20, 102), scale(0.3), fixed(), opacity(CONTROL_OPACITY)]);
  var jumpinfo_control = add([text("   *Jump on enemies to kill them"), pos(20, 118), scale(0.3), fixed(), opacity(CONTROL_OPACITY)]);
  var shoot_control = add([text("Shoot - B"), pos(20, 136), scale(0.3), fixed(), opacity(CONTROL_OPACITY)]);

  var controlsInfo = function controlsInfo() {
    CONTROL_OPACITY = Math.pow(CONTROL_OPACITY - 1, 2);
    left_control.opacity = CONTROL_OPACITY;
    right_control.opacity = CONTROL_OPACITY;
    jump_control.opacity = CONTROL_OPACITY;
    jumpinfo_control.opacity = CONTROL_OPACITY;
    shoot_control.opacity = CONTROL_OPACITY;
  };

  onKeyPress("c", controlsInfo); // Bullet functionality
  // positon of player as parameter

  function spawnBullet(p) {
    if (_isBig) {
      add([rect(10, 1), pos(p), origin("center"), color(255, 0.5, 1), scale(1), "bullet", area()]);
    }
  } // Releasing bullet functionality


  onKeyDown("b", function () {
    //if (isBig)
    // set the bullet time
    bulletTimer.time = BULLET_TIME_LEFT;
    if (_isBig) spawnBullet(player.pos.add(25, -10));
  }); //move the bullets

  onUpdate("bullet", function (b) {
    //destroy(b);
    b.move(ENEMY_SPEED * 9, 0); // whenever a bullet is released decrement the time given to it.

    bulletTimer.time -= dt();

    if (bulletTimer.time <= 0) {
      destroy(b);
    }
  });
  onCollide("dangerous", "bullet", function (d, b) {
    destroy(b);
    destroy(d);
  });
  onCollide("dangerous1", "bullet", function (d, b) {
    destroy(b);
    destroy(d);
  });
  onCollide("brick", "bullet", function (d, b) {
    destroy(b);
  }); // The mobile version begins
  //The following is for the mobile support
  //##############MOBILE##################

  if (isTouch()) {
    // && buttonsVisible) {
    //console.log(isTouch);
    //because left and right buttons will be pressed
    //we need to keep track of them
    var keyDownOnMobile = {
      left: false,
      right: false // we will set them to true when these buttons are tocuhed

    };

    var moveLeft = function moveLeft() {
      player.move(-MOVE_SPEED, 0);
    };

    var moveRight = function moveRight() {
      player.move(MOVE_SPEED, 0);
    }; //Mobile Buttons


    var leftButton = add([sprite("a"), pos(20, height() - 25), opacity(0.5), origin("botleft"), scale(BASE_SCALE), fixed(), area()]);
    var rightButton = add([sprite("d"), pos(80, height() - 25), opacity(0.5), origin("botleft"), scale(BASE_SCALE), fixed(), area()]);
    var actionButton = add([sprite("highjump"), pos(width() - 30, height() - 25), opacity(0.5), origin("botright"), scale(BASE_SCALE), fixed(), area()]);
    var shootButton = add([sprite("shoot"), pos(width() - 30, height() - 25), opacity(0.5), origin("botright"), scale(BASE_SCALE), fixed(), area()]); //TouchStart acts similar to a key press
    //Separate starts allow for mulitple button presses

    onTouchStart(function (leftPress, pos) {
      if (leftButton.hasPoint(pos)) {
        keyDownOnMobile.left = true;
        leftButton.opacity = 1;
      }
    });
    onTouchStart(function (rightPress, pos) {
      if (rightButton.hasPoint(pos)) {
        keyDownOnMobile.right = true;
        rightButton.opacity = 1;
      }
    });
    onTouchStart(function (jumpPress, pos) {
      if (actionButton.hasPoint(pos)) {
        jumping();
        actionButton.opacity = 1;
      }
    });
    onTouchStart(function (shootPress, pos) {
      if (shootButton.hasPoint(pos)) {
        spawnBullet(player.pos.add(25, -10));
        shootButton.opacity = 1;
      }
    }); //Keeps movement even if screen is touched, or other button is touched

    onTouchMove(function (id, pos) {
      if (leftButton.hasPoint(pos)) {
        keyDownOnMobile.left = true;
        leftButton.opacity = 1;
      }

      if (rightButton.hasPoint(pos)) {
        keyDownOnMobile.right = true;
        rightButton.opacity = 1;
      }
    }); //Ends individual presses

    onTouchEnd(function (leftPress, pos) {
      if (leftButton.hasPoint(pos)) {
        keyDownOnMobile.left = false;
        leftButton.opacity = 0.5;
        console.log("unpressed left");
      }
    });
    onTouchEnd(function (rightPress, pos) {
      if (rightButton.hasPoint(pos)) {
        keyDownOnMobile.right = false;
        rightButton.opacity = 0.5;
        console.log("unpressed right");
      }
    });
    onTouchEnd(function (actionPress, pos) {
      actionButton.opacity = 0.5;
    });
    onTouchEnd(function (shootPress, pos) {
      shootButton.opacity = 0.5;
    });
    onUpdate(function () {
      if (keyDownOnMobile.left) {
        moveLeft();
      } else if (keyDownOnMobile.right) {
        moveRight();
      }
    });
  } //The mobile version ends

}); // Lose scene

scene("lose", function (_ref3) {
  var score = _ref3.score;
  add([text(score, 32), origin("center"), pos(width() / 2, height() / 2)]);
  add([text("Game Over."), color(200, 50, 10), scale(0.5), origin("center"), pos(width() / 2, height() / 2 - 120)]);
  add([text("Going Back to Main Menu"), color(200, 50, 10), scale(0.5), origin("center"), pos(width() / 2, height() / 2 - 80)]); // start the game

  wait(2, function () {
    window.location = "./mario_menu.html";
  });
}); // Vaccine Info Scene
// To display awareness information relateed to vaccination
// At the end of each level, info is displayed
// Uses array of info from info.js

scene("vaccineInfoScene", function (_ref4) {
  var level = _ref4.level,
      score = _ref4.score;
  layers(["ui", "bg"], "bg");
  var infoColor = add([rect(window.innerWidth, window.innerHeight), color(10, 0, 10), layer("bg", "ui"), fixed()]);
  add([text(info[level % info.length], {
    size: 35,
    // 48 pixels tall
    width: window.innerWidth,
    font: "apl386o" // it'll wrap to next line when width exceeds this value

  }), scale(0.4), color(200, 144, 255), pos(20, 20) //area(),
  ]), add([text("Loading next Level... Please Wait...", {
    size: 35,
    // 48 pixels tall
    width: window.innerWidth,
    font: "apl386o" // it'll wrap to next line when width exceeds this value

  }), scale(0.4), color(200, 3, 10), pos(100, window.innerHeight - 400)]);
  wait(3, function () {
    go("game", {
      level: level,
      score: score
    });
  });
}); //init();
//go("menu");
//go("game", { level: 0, score: 0 });

go("vaccineInfoScene", {
  level: 0,
  score: 0
});
var playableMap = [["                                                                                                                                             ", "                                                                                                                                             ", "                                                                                                                                             ", "                                                                                                                                             ", "                                                                                                                                             ", "                                                                                                                  ====                       ", "                                                                                               %  $ $  %         =====                       ", "                            $ $ $                                                                               ======                       ", "                          $       $                                                                            =======                       ", "                                                                                             ============     ========                       ", "                                                                   *                   ==                     ========                       ", "           % $           ==========                                                   ==                      ========                       ", "             ^          ==        ==                                                 ==                       ========                       ", "                       ==          ==            *  $       ==     ==               ==      ^   ^   ^   ^     ========  $ $ $ $              ", "             ===      ==                    ^              ==       ==      ^      ==                         ========  $ $ $ $      -+      ", "            =====    ==  $ $ $ $ $                        ==         ==           ==                          ========               ()      ", "============================================================         ========================================================================", "============================================================         ========================================================================", "============================================================         ========================================================================"], ["                                                                                        $                                                                                          ", "                                                                                                                                                                                   ", "                                                                                             $                                                                                     ", "                                                                                        *       $         $      $                                                                 ", "                                                                                                                                                                                   ", "                                                                  $    $                        =     ===============                                                              ", "                                                                                               ==                  ==                                                              ", "                                                              $            $          ===========                  ==                $ $ $ $ $ $ $ $ $ $                           ", "                                                                    ^                                              ==                                                              ", "                      *                    =======    ===========================                                  ==                $ $ $ $ $ $ $ $ $ $                           ", "                                          ========                                                                 ==              ========================                   -+   ", "                 $        $              =========                                                                 ==                                                         ()   ", "                                        ==========                                                                 ==                                                    ==========", "       $   $     =        =            ===========                                                                 ==                $ $  $ $                          ============", "     $          ==        ==          ============                                                                 ==                                                ==============", "               ===    ^   ===        =============                                                                 ==                ^          ^        ^         ================", "==================================================                                                                 ================================================================", "==================================================                                                                 ================================================================", "==================================================                                                                 ================================================================"], ["£                                                                                                  $$$$$                                                                         £", "£                                                                            ^^^            $$$$$          ^ $$$$$     ^                                                         £", "£     ! ! ! ! ! ! ! ! ! ! ! !                                            ££££££££££££££££££££££££££££££££££££££££££££££££££££                                                    £", "£              $$$$$$                                                 £££££££££££££££££££££££££        ££££££££££££££££££££££££££                                                £", "£             $$$$$$$$               $$$$$          $$$$$$          ££££££££££££££££££££££££££                 ££££££££££££££££££££££££££       $$$$                             £", "£           $$$$$$$$$$$$                                          ££££££££££££££££££££££££££                      ££££££££££££££££££££££££££                                   -+£", "£                                      $$$$$$     $$$$$$       ££££££££££££££££££££££££££                            ££££££££££££££££££££££££££              $$$               ()£", "£     %    @@@@@@@@@@@@                                       £££££££££££££££££££££££££                                 ££££££££££££££££££££££££££ ^                        ££££££", "£                                             $$$$$          ££££££££££££££££££££££££££                                     ££££££££££££££££££££££££££                 £££££££££££", "£                   z   z                ^           ^     ££££££££££££££££££££££££££                                          £££££££££££££££££££££££££££££££££££££££££££££££££££", "£££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££                                                                                            £"], ["£                                                                   $                                                                                                            £", "£                                                                                      ^                                                                                         £", "£                                                                $       £££££££££££££££££££££££££££££££                                                                         £", "£                                                                     £££££££££££££££££££££££££                                                                                  £", "£                                                            $      ££££££££££££££££££££££££££                                                                                   £", "£                                                                 ££££££££££££££££££££££££££                                                                                     £", "£                                                         $    ££££££££££££££££££££££££££                                                                                        £", "£             @£@£@£@£@                                       £££££££££££££££££££££££££                                                                                          £", "£                                                            ££££££££££££££££££££££££££                                                                                          £", "£               ^                          z               ££££££££££££££££££££££££££                                                                                            £", "£££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££                                                                                            £", "£££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££                                                                                            £", "£££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££                                                                                            £", "£££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££                                                                                            £", "£££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££                                                                           ^                £", "£££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££                                                                !!!!!!!!!!!!!!!!!!!!!!      £", "£££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££                                                            !!!!!                !!!  $   £", "£££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££             @£@£@£@£@                                   !!!!!!                !!!  $   £", "£££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££                                                      !!!!!!!        -+           $   £", "£££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££                                     z             !!!!!!!!        ()               £", "££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££££"], ["                                                                                                                                                                                   ", "                                                                                                                                                                                   ", "                                                                                                                                                                                   ", "                                                                                                                                                                                   ", "                                                                                                                                                                                   ", "                                                                                                                                                                                   ", "                                                                                                                                          %===%===%===%        $ $ $ $ $           ", "                                                                                                                                                                              -+   ", "                                                                                                                                                ^       ^        ^            ()   ", "                                                                                                                %%%            ====================================================", "                                                                                                                              =====                                                ", "                                                                                                            ===========      ======                                                ", "                                                                                                                            =======                                                ", "                                                                                                                   ^       ========                                                ", "                                                                                                      =============================                                                ", "                                                                                                     ========                                                                      ", "                                                                                  $          $      =========                                                                      ", "                                                                                                   ==========                                                                      ", "                                                                                        ^         ===========                                                                      ", "                                                                            =================================                                                                      ", "                                                                           ======                                                                                                  ", "                                                                          =======                                                                                                  ", "                                                   $  $  $  $  $  $      ========                                                                                                  ", "                                                                        =========                                                                                                  ", "                                                           ^           ==========                                                                                                  ", "                                           ======================================                                                                                                  ", "                                          ========                                                                                                                                 ", "                                         =========                                                                                                                                 ", "                                        ==========                                                                                                                                 ", "         %%%%%                         ===========                                                                                                                                 ", "                                      ============                                                                                                                                 ", "                      ^              =============                                                                                                                                 ", "==================================================                                                                                                                                 ", "==================================================                                                                                                                                 ", "==================================================                                                                                                                                 "], ["                                                                                                        =============                                                              ", "                                                                                                                   ==                                                              ", "                                                                                                                   ==                                                              ", "                                                                                                          $      $ ==                                                              ", "                                                                                                                   ==                                                              ", "                                                                  $    $                        =       =============                                                              ", "                                                                                               ==                  ==                                                              ", "                                                              $            $          ===========                  ==                        $ $ $ $ $ $                           ", "                                                                    ^                                              ==                -+                                            ", "                                           =======    ___________________________                                  ==                ()                                            ", "                                          ========                                                                 ==              ================================                ", "                                         =========                                                                 ==                                                              ", "                                        ==========                                  _____________                                                                        ==========", "                 _        _            ===========                                                                                   $ $  $ $                          ============", "                __        __          ============                                                                                                                   ==============", "               ___    ^   ___        =============                                                   _______                         ^          ^        ^         ================", "==================================================                                                              ===================================================================", "==================================================                                                              ===================================================================", "==================================================                                                              ==================================================================="], ["                                                                                                                                                                                   ", "                                                                                                                                                                                   ", "                      ^                                                                                                                                                            ", "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!         ^                                                                                                                             ", "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!                                                                                                                  ", "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!                                                                                                        ", "                                                                        !!!                                                                                                        ", "                                                                        !!!    ££££££££                                             £££££££££                        $$$$$$$$$$$   ", "                                                                        !!!                     £££££££££££££££                                                      $$$$$$$$$$$   ", "                                                                        !!!      $   $   $                                                                           $$$$$$$$$$$   ", "                                                                        !!!                                                  ^           ^           ^                             ", "                                                                        !!! !!!!!!!!!!!!!!!!!!!                 !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", "                                                                                            !!!                 !!!                                                                ", "                                                                                            !!! $ $ $ $ $ $ $ $ !!!                        $$$$$$                                  ", "                                                                                            !!!                 !!!                                                                ", "                                                                                            !!! $ $ $ $ $ $ $ $ !!!            $          ££££££££        $$$$                     ", "                                                                                            !!!                 !!!                                                                ", "                                                                                            !!! $ $ $ $ $ $ $ $ !!!                                     ££££££££                   ", "                                                                                            !!!                 !!!         ££££££££                                  $$$$         ", "                                                                                            !!! $ $ $ $ $ $ $ $                                                                    ", "                                                                                            !!!                          ££                                         ££££££££       ", "                                                                                            !!! $ $ $ $ $ $ $ $                                                                    ", "                                                                                            !!!                                                                                    ", "                                                                                            !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!      z                                             ", "                                                                                                                          !!!!!!!!!!!!!!!!!!!!!      z                       -+    ", "                                                                                                                                        !!!!!!!!!!!!!!!!!!!!!                ()    ", "                                                                                                                                                     !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"], ["                                                                                                                                                                                                                            ", "                                                                                                                                                                                                                          -+", "                                                                                                                                                                                                                ==========()", "========================                                                                                                                                                                                  ^               ()", "                     ===                                                                                                                                                                              ========            ()", "                     ===                                                                                                                                                                                                  ()", "                     ====      ^                                                                                                                                                                 ^                        ()", "                     =======================                                                                                                                                                  ======                      ()", "                                         ===                                                                                                                                                                              ()", "                                         ===                                                                                                                                           ^                                  ()", "                                         ===                                                                                                                                        =======                               ()", "                                         ===                                                                                                                                                                              ()", "                                         ===                                                                                                                                 ^                                            ()", "                                         ===                                                                                                                              =======                                         ()", "                                         ===                                                                                                                                                                              ()", "                                         ===                                                                                                                      ^                                                       ()", "                                         ===                                                                                                                 ==========                                                   ()", "                                         ===                                                                                                                                                                              ()", "                                         ===                                                                                                      z                                                                       ()", "                                         ===                                                                                              ================                                                                ()", "                                         ===                                                                                                                                                                              ()", "                                         ===                                                                                  z                                                                                           ()", "                                         ===                                                                           ================                                                                                   ()", "                                         ===                                                                                                                                                                              ()", "                                         ===                                                               ^   z                                                                                                          ()", "                                         ===                                                       =================                                                                                                      ()", "                                         ===                                                                                                                                                                              ()", "                                         ===                                     z     ^                                                                                                                                  ()", "                                         ===                                  ==================                                                                                                                          ()", "                                         ===                                                                                                                                                                              ()", "                                         ===                      z                                            $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$    ()", "                                         ===              =================                                                                                                                                               ()", "                                         ===                                                                                                                                                       z                      ()", "                                         ====                                                z                ^      z      ^    z      ^           ^         ^    z     ^         ^          ^         ^           ^     ()", "                                         ===================================================================================================================================================================================", "                                         ==================================================================================================================================================================================="], ["                                                                                                                                                                                                                                                                                                                          ", "                                                                                                                                                                                                                                                                                                                          ", "                                                                                                                                                                                                                                                                                                                          ", "                                                                                                                                                                                                                                                                                                                          ", "                                                                                                                                                                                                                                                                                                                          ", "                                                                                                                                                                                                                                                                                                                          ", "                                                                                                                                                                                                                                                                                                                          ", "                                                                                                                                                                                                                                                                                                                          ", "                                                                                                                                                                                   $ $ $ $ $ $           u                                                                                                                ", "                                                                                                    $    z  $                                                                                                                                                                                                              ", "                                                                                                   $     =    $                                                                 ==       z        $  $    z      $   z                                                                                                       ", "                                                                                                  $    z        $                                                                   ==   ==   ==   ==   ====      ===                                                                                                                    ", "                                                                                                 $     =     ^   $                                                   u      =                                                                                                                                               ", "                                                                                                $    z       =    $                                                                                                   ==   $ $ $                                                                                             ", "                                                                                               $     =                                                                                                                     ^^^^^^                                                                                                ", "                                                                                       $      $                                                                   =   =                                                   ==                                                                                                   ", "                                                                                      $  $  z     =              =                                          ^                                                               =                                                                                                ", "                                                                                     $    $                           $                      $$$$    u       =                                                              =                                                                                                  ", "                                                                                    $    ======                         $                                                                                                   =                                                                                                           ", "                                                             $^                    ^                                =    $     u                       ^                                                                    =                                                                                                  ", "                                                             =====                 =====                                                       ==    ====                                                                   =                                                         -+                                                          ", "                                                         $               u   ^ $   $                                     ^                                                                                                  =                                                         ()                                         ", "                                 ^                     ^                     ====                                       = =    =      =     =                                                                               =                                                       ====                                                 ", "         ^$                     ====  $$   $$    $$    =====              ^  $                                                                                                                                               =                                                                                                              ", "         ==       ^$    $$  ^                                            ===                                                                                                                                                =                                                    =                                                  ", "       z$        ===        ====                 ^                   ^                                                                                                                                                      =                                                                                                         ", "u      ==            $$$                       ====                  ==                                                                                                                                                     =             u                                    =                                                        ", "  $          ==                          ^                       ^                                                                                                                                                          =     ^   $     $          ^                                                                         ", "                    ====                ====                     =                                                                                                                                                          =                                       z        =                                                        ", "= =                                                                                                                                                                                                                         ===     =============       ===================                                                                                              "], ["                                                                                                                                                                                                                                                                                                                                                                                                                                    ", "                                                                                                                                                                                                                                                                                                                                                                                                                                    ", "                                                                                                                                                                                                                                                                                                                                                                                                                                    ", "                                                                                                                                                                                                                                                                                                                                                                                                                                    ", "======                                                                                                                                                                                                                                                                                                                                                                                                                              ", "                                                                                                                                                                                                                                                                                                                                                                                                                                    ", "   $                                                                                                                                                                                                                                                                                                                                                                                                                                 ", "    ===                                                                                                                                                                                                                                                                                                                                                                                                                                ", "                                                                                                                                                                                                                                                                                                                                                                                                                                    ", "     $$$$                                                                                                                                                                                                                                                                                                                                                                                                                             ", "                                                                                                                                                                                                                                                                                                                                                                                                                                    ", "     ===                                                                                                                                                                                                                                                                                                                                                                                                                               ", "       $                                                                                                                                                                                                                                                                                                                                                                                                                             ", "                                                                                                                                                                                                                                                                                                                                                                                                                                    ", "      ==                                                                                                                                                                                                                                                                                                                                                                                                                              ", "                                                                                                                                                                                                                                                                                                                                                                                                                                    ", "      ^^                                                                                                                                                                                                                                                                                                                                                                                                                           ", "       =                                                                                                                                                                                                                                                                                                                                                                                                                                        ", "                                                                      u                                                                =          =          =                                                                                                                                                                                                                                                                                        ", "         ^^                                                                                                          ===              =        =         =                                                                                                                                                                                                                                                                                            ", "      =                              ^^                            z                                      =                         =        ^               =       ^^                                                                                                                                      u                                                                                                                                         ", "             ^^                                             ^^   =========    ^^                      =       ^                  =                              =                                                                                                                        ^^ ^^                                                                                                                                                                ", "                       zzzz                               z                                                         ==        =           ^     ^                  =    ^^  %                                                                                                            ^^ ^^                                                                                                                                                       ", "     ==           ==========                             ======           =========        ^^       =     ^                =         ^                                =                                                                                                                  ^^ ^^               ==                                                                                                                                                                             ", "              =             =         u        z                                                               ^   =         =                ^                          =  ^^                                                                                                           ^^ ^^      ==                                                                                                                                                       ", "      =                      =                =========                              ==============         u                 =                                             =     ^^                                                                   u                                 ^^ ^^  =                     -+                                                                                                                                                                          ", "        =    =                   =                                                                     =  ^                       =       u ^                                    =      ^^           %        ^                                                                    ======^^=====                      ()                                                                                                                                                          ", "                                      =                                                                   =       =                 =                                                 =       ^^                     u                                      ^^     ^^            ^^      ^^ ^^=                       ==                                                                                                                                                                   ", "                                                                                                            =                         =                                                    =       ========   ^             ^                          =    =   ==   ===     ===================                      ==                                                                                                                                                                                                                                                            ", "                                                                                                               =                          =                                                    =                                                                                               =                        ==                                                                                                                                                                       ", "                                                                                                                                             =                                                                ^      =                           =   ^                                         =                           ==                                                                                                                          ", "                                                                                                                                                                                                                                                ^                                              =                                                                                                                                      ", "                                                                                                                                                                                                                   =      =                 ^ =                                                =                                                                                                                                            ", "                                                                                                                                                                                                                           ^      ^     ^ =          ^                                                                                                                                                                               ", "                                                                                                                                                                                                                 =            =       =                                                                                                                                                                                               ", "                                                                                                                                                                                                                                                     =                                                                                                                                                                              ", "                                                                                                                                                                                                              =                   =                                                                                                                                                                                                   "], [" u                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       ", "  $                                                                                                                     u                                                                                                                                                                                                                                                                                                                                                                                                                                                                ", "                                                                                                                      $ z$                                              u                                                                                                                                                                                                                                                                                                                                                                                                                ", "====                                                                                                                 $    $                                                                                                                                                                                                                                                                                                                                                                                                                                                                 ", "                                                                                                                                                                                                                                                                                                     %                                                                                                                                                                                                                                                                                  ", "                                                                                                                        ==                                                                                                                                                                                                                                                                           $ $     ^    z                                                                                                                                                                       ", "                                                                                                                   ==         $                      $                 ==                                                                                                                                                                                                                           $   $          =                                                                                                                                                                         ", "                                                                        $ u %                             z                   $                     $              z                                                                                                                         %  ^            %                                                                                u                                                                                                                                                                                           ", "                                       u                                  z                                     ==            $                    $                  ==                                                                                                                              =                                                                                                      =            =  ^                                                                                                                                                                  ", "                                                                                                                              $                                                                                                                                                                                                                                                                       =                                                                                                                                                                                  ", "                                                                        =====                              ==                 $             $     $$$    z         ==                                       z                                                                                 =              =  ^                                                                                                             =    z                                                                                                                                                                 ", "                                       ==                                                          $                          $$ $ $ $     $   $                ==                                                                                                                     ^                              $                                                               ^        =                                                        u                                                                                                                                     ", "                                                                                                       ==                             $   $$$$$$$     $                                         z        z  $ z                                                                          =                       =                                                                                                                 =                ^                                                                                         =                                               ", "                                  z ==                                z$                       z                                       $ $z      $   $     ==                                  z  z                                                                                                                                                                                       =                                               =      $ $  z             z                                                                                                                         ", "                               $                                      ==                           ==                                   $         $ $                                        z$   $z   z         z    u                                                               =                               =   ^                                       % ^ z                                                                                                                                                                    =  u     =                                            ", "                                  ==                                                                                         z                       ===                             $       z$   $z                              ^                                          ^                                                $                    ^                              =====                                                         ========      =    =    ^                                                                                                                                ", "                                                                                               ==                                               ==                            u              z$   $z                                  ^                ^                          =                                        =                                                ====                                                                                           =                                                            =              =                                               ", "            z                  ==             $               $  z  ==                                                                    ==                              z                  ===    ====    ==   =   ==        ^          ^                  u        ^%                                                                                         ======                                                                                                                      z  ^   z^           ^   z   ^             ===============                                                                            ", "                    $  z                                          ==                        ==                                       ==                                              ===                                                    ^   $             %             =                                                 =    ^     ==================                                                                                                                     =                              ^   z   ^                                    =                                                          ", "      u $$ z                ==                 z         u       ==           %     $u                                                                                                                                        ===                                                                                                                                                                                                                                                         ==================           ==============                                                                             ", "                    =======              z                    ==                         ==                                =========                                    ========                                                     ===        ===    ==    ==        =                                                             =                                                                                                                                                  ====================      ================                                =                                                                                                                  ", "        z                                                 z ==                    z                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      -+                 ", "     ==========                           ========      ====                  =========                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  ()                                             ", "                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        ====  ==              "], ["   }}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}    ", "                                                                                                                                                                                                                                                                                                                                                                                                                                  ", " u                                                                                                                                                                                                                                                                                                                                                                                                                                 ", "                                                                                                                                                                                                                                                                                                                                                                                                                                   ", "       $$                 ^   $$^^$$^^$$^^$$^^$$^^$$^^$$^^$$^^ $$^^$$^^$$^^ $$^ $$^$$ ^^$$^^$$^^$$^^$$^^$$^^$$^^$$zz   ^^   zz    ^^   zz$$ ^^ zz ^^   zz$$ ^^   zz   ^^$$zz   ^$$ zz  ^ ^   zz   ^^ zz   ^^   zz   ^^    zz   ^^ zz ^  ^ ^   ^     zz   zz   ^^  zzzz         $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$^^zzz$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$zzzz$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$                  () ", "===============================================================================================================================================================================================================================================================================================================================================================================================================================-+ "]];
var info = [["Get Vaccinated.. Encourage Others"], ["Kill that hestitation regarding vaccines or that hesitation will kill you"], ["Don't succumb to viruses.. Make viruses succumb when they attack you.\nHappens only when you are fully immune. Believe in what great researchers \nare saying"], ["Live, attenuated vaccines fight viruses and bacteria. These vaccines contain \na version of the living virus or bacteria that has been weakened so that it \ndoes not cause serious disease in people with healthy immune systems. Because\nlive, attenuated vaccines are the closest thing to a natural infection, they \nare good teachers for the immune system. Examples of live, attenuated vaccines \ninclude measles, mumps, and rubella vaccine (MMR) and varicella (chickenpox) \nvaccine. Even though they are very effective, not everyone can receive these \nvaccines. Children with weakened immune systems—for example, those who are \nundergoing chemotherapy—cannot get live vaccines."], ["It is always better to prevent a disease than to treat it after it occurs."], ["Vaccination is a highly effective, safe and easy way to help keep your family healthy."], ["Your child is exposed to thousands of germs every day in his environment. This\nhappens through the food he eats, air he breathes, and things he puts in his mouth."], ["Babies are born with immune systems that can fight most germs, but there are some \ndeadly diseases they can’t handle. That’s why they need vaccines to strengthen their immune system."], ["Vaccines use very small amounts of antigens to help your child’s immune system \nrecognize and learn to fight serious diseases. Antigens are parts of germs that cause the \nbody’s immune system to go to work."], ["Thirty years ago, vaccines used 3,000 antigens to protect against 8 diseases by \nage two. Today, vaccines use 305 antigens to protect against 14 diseases by age two."], ["For some vaccines (primarily inactivated vaccines), the first dose does not provide\nas much immunity as possible. So, more than one dose is needed to build more complete \nimmunity. The vaccine that protects against the bacteria Hib, which causes meningitis, \nis a good example."]];
},{}],"C:/Users/maryj/AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "54703" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["C:/Users/maryj/AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","src_mario/src/game.js"], null)
//# sourceMappingURL=/game.f6827abd.js.map