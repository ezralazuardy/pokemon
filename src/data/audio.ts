import { Howl } from "howler";

export default {
  map: new Howl({
    src: "/audio/map.mp3",
    html5: true,
    volume: 0.4,
  }),
  initBattle: new Howl({
    src: "/audio/init_battle.wav",
    html5: true,
    volume: 0.4,
  }),
  battle: new Howl({
    src: "/audio/battle.mp3",
    html5: true,
    volume: 0.4,
  }),
  tackleHit: new Howl({
    src: "/audio/tackle_hit.wav",
    html5: true,
    volume: 0.4,
  }),
  fireballHit: new Howl({
    src: "/audio/fireball_hit.wav",
    html5: true,
    volume: 0.4,
  }),
  initFireball: new Howl({
    src: "/audio/init_fireball.wav",
    html5: true,
    volume: 0.4,
  }),
  victory: new Howl({
    src: "/audio/victory.wav",
    html5: true,
    volume: 0.4,
  }),
};
