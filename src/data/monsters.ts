import attacks from "./attacks";

export default {
  emby: {
    position: {
      x: 600,
      y: 390,
    },
    image: {
      src: "/images/emby_sprite.png",
    },
    frames: {
      max: 4,
      hold: 30,
    },
    animate: true,
    name: "Emby",
    attacks: [attacks.tackle, attacks.fireball],
  },
  draggle: {
    position: {
      x: 1115,
      y: 160,
    },
    image: {
      src: "/images/draggle_sprite.png",
    },
    frames: {
      max: 4,
      hold: 30,
    },
    animate: true,
    isEnemy: true,
    name: "Draggle",
    attacks: [attacks.tackle, attacks.fireball],
  },
};
