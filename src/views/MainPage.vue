<script setup lang="ts">
import { onMounted } from "vue";
import gsap from "gsap";
import Container from "../components/Container.vue";
import Sprite from "../models/Sprite";
import Monster from "../models/Monster";
import Boundary from "../models/Boundary";
import attacks from "../data/attacks";
import audio from "../data/audio";
import battleZonesData from "../data/battleZones";
import collisions from "../data/collisions";
import monsters from "../data/monsters";

const battleBackgroundImage = new Image();
battleBackgroundImage.src = "/images/battle_background.png";
const image = new Image();
image.src = "/images/pallet_town.png";
const foregroundImage = new Image();
foregroundImage.src = "/images/foreground_objects.png";
const playerDownImage = new Image();
playerDownImage.src = "/images/player_down.png";
const playerUpImage = new Image();
playerUpImage.src = "/images/player_up.png";
const playerLeftImage = new Image();
playerLeftImage.src = "/images/player_left.png";
const playerRightImage = new Image();
playerRightImage.src = "/images/player_right.png";

const collisionsMap: Array<any> = [];
const battleZones: Array<any> = [];
const battleZonesMap: Array<any> = [];
const boundaries: Array<any> = [];
const offset = {
  x: -735,
  y: -650,
};
const battle = {
  initiated: false,
};

const battleBackground = new Sprite({
  position: {
    x: 320,
    y: 60,
  },
  image: battleBackgroundImage,
});
const background = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  image: image,
});
const foreground = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  image: foregroundImage,
});
const keys = {
  w: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
};
const clickEvent = new MouseEvent("click", {
  view: window,
  bubbles: true,
  cancelable: false,
});

let canvas;
let c;
let draggle;
let emby;
let renderedSprites;
let battleAnimationId;
let queue;
let lastKey = "";
let audioPlayed = false;
let player;
let movables;

onMounted(() => {
  canvas = document.querySelector("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  c = canvas.getContext("2d");

  player = new Sprite({
    position: {
      x: canvas.width / 2 - 192 / 4 / 2,
      y: canvas.height / 2 - 68 / 2,
    },
    image: playerDownImage,
    frames: {
      max: 4,
      hold: 10,
    },
    sprites: {
      up: playerUpImage,
      left: playerLeftImage,
      right: playerRightImage,
      down: playerDownImage,
    },
  });

  for (let i = 0; i < collisions.length; i += 70) {
    collisionsMap.push(collisions.slice(i, 70 + i));
  }

  for (let i = 0; i < battleZonesData.length; i += 70) {
    battleZonesMap.push(battleZonesData.slice(i, 70 + i));
  }

  collisionsMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
      if (symbol === 1025)
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width + offset.x,
              y: i * Boundary.height + offset.y,
            },
          })
        );
    });
  });

  battleZonesMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
      if (symbol === 1025)
        battleZones.push(
          new Boundary({
            position: {
              x: j * Boundary.width + offset.x,
              y: i * Boundary.height + offset.y,
            },
          })
        );
    });
  });

  window.addEventListener("keydown", (e) => {
    switch (e.key) {
      case "w":
      case "ArrowUp":
        playMapAudio();
        keys.w.pressed = true;
        lastKey = "w";
        break;
      case "a":
      case "ArrowLeft":
        playMapAudio();
        keys.a.pressed = true;
        lastKey = "a";
        break;
      case "s":
      case "ArrowDown":
        playMapAudio();
        keys.s.pressed = true;
        lastKey = "s";
        break;
      case "d":
      case "ArrowRight":
        playMapAudio();
        keys.d.pressed = true;
        lastKey = "d";
        break;
    }
  });

  window.addEventListener("keyup", (e) => {
    switch (e.key) {
      case "w":
      case "ArrowUp":
        keys.w.pressed = false;
        break;
      case "a":
      case "ArrowLeft":
        keys.a.pressed = false;
        break;
      case "s":
      case "ArrowDown":
        keys.s.pressed = false;
        break;
      case "d":
      case "ArrowRight":
        keys.d.pressed = false;
        break;
    }
  });

  (document.querySelector("#dialogueBox") as HTMLElement).addEventListener(
    "click",
    (e: any) => {
      if (queue.length > 0) {
        queue[0]();
        queue.shift();
      } else e.currentTarget.style.display = "none";
    }
  );

  movables = [background, ...boundaries, foreground, ...battleZones];

  animate();
});

function playMapAudio() {
  if (audioPlayed) return;
  audioPlayed = true;
  audio.map.play();
}

function animate() {
  const animationId = window.requestAnimationFrame(animate);
  background.draw(c);
  boundaries.forEach((boundary) => {
    boundary.draw(c);
  });
  battleZones.forEach((battleZone) => {
    battleZone.draw(c);
  });
  player.draw(c);
  foreground.draw(c);

  let moving = true;
  player.animate = false;

  if (battle.initiated) return;

  // activate battle
  if (keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed) {
    for (let i = 0; i < battleZones.length; i++) {
      const battleZone = battleZones[i];
      const overlappingArea =
        (Math.min(
          player.position.x + player.width,
          battleZone.position.x + battleZone.width
        ) -
          Math.max(player.position.x, battleZone.position.x)) *
        (Math.min(
          player.position.y + player.height,
          battleZone.position.y + battleZone.height
        ) -
          Math.max(player.position.y, battleZone.position.y));
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: battleZone,
        }) &&
        overlappingArea > (player.width * player.height) / 2 &&
        Math.random() < 0.02
      ) {
        // deactivate current animation loop
        window.cancelAnimationFrame(animationId);

        audio.map.stop();
        // audio.initBattle.play();
        audio.battle.play();

        battle.initiated = true;
        gsap.to("#overlappingDiv", {
          opacity: 1,
          repeat: 3,
          yoyo: true,
          duration: 0.4,
          onComplete() {
            gsap.to("#overlappingDiv", {
              opacity: 1,
              duration: 0.4,
              onComplete() {
                // activate a new animation loop
                initBattle();
                animateBattle();
                gsap.to("#overlappingDiv", {
                  opacity: 0,
                  duration: 0.4,
                });
              },
            });
          },
        });
        break;
      }
    }
  }

  if (keys.w.pressed && lastKey === "w") {
    player.animate = true;
    player.image = player.sprites.up;
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y + 3,
            },
          },
        })
      ) {
        moving = false;
        break;
      }
    }
    if (moving)
      movables.forEach((movable) => {
        movable.position.y += 3;
      });
  } else if (keys.a.pressed && lastKey === "a") {
    player.animate = true;
    player.image = player.sprites.left;
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x + 3,
              y: boundary.position.y,
            },
          },
        })
      ) {
        moving = false;
        break;
      }
    }
    if (moving)
      movables.forEach((movable) => {
        movable.position.x += 3;
      });
  } else if (keys.s.pressed && lastKey === "s") {
    player.animate = true;
    player.image = player.sprites.down;

    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y - 3,
            },
          },
        })
      ) {
        moving = false;
        break;
      }
    }
    if (moving)
      movables.forEach((movable) => {
        movable.position.y -= 3;
      });
  } else if (keys.d.pressed && lastKey === "d") {
    player.animate = true;
    player.image = player.sprites.right;
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x - 3,
              y: boundary.position.y,
            },
          },
        })
      ) {
        moving = false;
        break;
      }
    }
    if (moving)
      movables.forEach((movable) => {
        movable.position.x -= 3;
      });
  }
}

function animateBattle() {
  battleAnimationId = window.requestAnimationFrame(animateBattle);
  background.hide(canvas, c);
  battleBackground.draw(c);
  renderedSprites.forEach((sprite) => {
    sprite.draw(c);
  });
}

function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
    rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
    rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
    rectangle1.position.y + rectangle1.height >= rectangle2.position.y
  );
}

function initBattle() {
  (document.querySelector("#userInterface") as HTMLElement).style.display =
    "block";
  (document.querySelector("#dialogueBox") as HTMLElement).style.display =
    "none";
  (document.querySelector("#enemyHealthBar") as HTMLElement).style.width =
    "100%";
  (document.querySelector("#playerHealthBar") as HTMLElement).style.width =
    "100%";
  (document.querySelector("#attacksBox") as HTMLElement).replaceChildren();
  draggle = new Monster(monsters.draggle);
  emby = new Monster(monsters.emby);
  renderedSprites = [draggle, emby];
  queue = [];
  emby.attacks.forEach((attack) => {
    const button = document.createElement("button");
    button.innerHTML = attack.name;
    (document.querySelector("#attacksBox") as HTMLElement).append(button);
  });
  // our event listeners for our buttons (attack)
  document.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", (e: any) => {
      const selectedAttack = attacks[e.currentTarget.innerHTML.toLowerCase()];
      emby.attack(document, audio, {
        attack: selectedAttack,
        recipient: draggle,
        renderedSprites,
      });
      if (draggle.health <= 0) {
        queue.push(() => {
          draggle.faint(document, audio);
        });
        queue.push(() => {
          // fade back to black
          gsap.to("#overlappingDiv", {
            opacity: 1,
            onComplete: () => {
              cancelAnimationFrame(battleAnimationId);
              animate();
              (
                document.querySelector("#userInterface") as HTMLElement
              ).style.display = "none";
              gsap.to("#overlappingDiv", {
                opacity: 0,
              });
              battle.initiated = false;
              audio.map.play();
            },
          });
        });
      }
      // enemy attacks right here
      const randomAttack =
        draggle.attacks[Math.floor(Math.random() * draggle.attacks.length)];
      queue.push(() => {
        draggle.attack(document, audio, {
          attack: randomAttack,
          recipient: emby,
          renderedSprites,
        });
        if (emby.health <= 0) {
          queue.push(() => {
            emby.faint(document, audio);
          });
          queue.push(() => {
            // fade back to black
            gsap.to("#overlappingDiv", {
              opacity: 1,
              onComplete: () => {
                cancelAnimationFrame(battleAnimationId);
                animate();
                (
                  document.querySelector("#userInterface") as HTMLElement
                ).style.display = "none";
                gsap.to("#overlappingDiv", {
                  opacity: 0,
                });
                battle.initiated = false;
                audio.map.play();
              },
            });
          });
        }
      });
    });

    button.addEventListener("mouseenter", (e: any) => {
      const selectedAttack = attacks[e.currentTarget.innerHTML.toLowerCase()];
      (document.querySelector("#attackType") as HTMLElement).innerHTML =
        selectedAttack.type;
      (document.querySelector("#attackType") as HTMLElement).style.color =
        selectedAttack.color;
    });
  });
}
</script>

<template>
  <Container />
</template>
