import gsap from "gsap";
import Sprite from "./Sprite";

export class MonsterData {
  position: any;

  frames: { max: number; hold: number } = { max: 1, hold: 10 };

  image: any;

  sprites: any;

  animate: boolean = false;

  rotation: number = 0;

  opacity: number = 1;

  health: number = 100;

  isEnemy: boolean = false;

  name: string = "";

  attacks: any;
}

export default class Monster extends Sprite {
  health: number;
  isEnemy: boolean = false;
  name: string = "";
  attacks: any;

  constructor(data: Partial<MonsterData>) {
    super(data);
    this.health = data.health ?? 100;
    this.isEnemy = data.isEnemy ?? false;
    this.name = data.name ?? '';
    this.attacks = data.attacks;
  }

  faint(document, audio) {
    document.querySelector("#dialogueBox").innerHTML = this.name + " fainted!";
    gsap.to(this.position, {
      y: this.position.y + 20,
    });
    gsap.to(this, {
      opacity: 0,
    });
    audio.battle.stop();
    audio.victory.play();
  }

  attack(document, audio, { attack, recipient, renderedSprites }) {
    document.querySelector("#dialogueBox").style.display = "block";
    document.querySelector("#dialogueBox").innerHTML =
      this.name + " used " + attack.name;
    let healthBar = "#enemyHealthBar";
    if (this.isEnemy) healthBar = "#playerHealthBar";
    let rotation = 1;
    if (this.isEnemy) rotation = -2.2;
    recipient.health -= attack.damage;
    switch (attack.name) {
      case "Fireball":
        audio.initFireball.play();
        const fireballImage = new Image();
        fireballImage.src = "/images/fireball.png";
        const fireball = new Sprite({
          position: {
            x: this.position.x,
            y: this.position.y,
          },
          image: fireballImage,
          frames: {
            max: 4,
            hold: 10,
          },
          animate: true,
          rotation,
        });
        renderedSprites.splice(1, 0, fireball);
        gsap.to(fireball.position, {
          x: recipient.position.x,
          y: recipient.position.y,
          onComplete: () => {
            // Enemy actually gets hit
            audio.fireballHit.play();
            gsap.to(healthBar, {
              width: recipient.health + "%",
            });
            gsap.to(recipient.position, {
              x: recipient.position.x + 10,
              yoyo: true,
              repeat: 5,
              duration: 0.08,
            });
            gsap.to(recipient, {
              opacity: 0,
              repeat: 5,
              yoyo: true,
              duration: 0.08,
            });
            renderedSprites.splice(1, 1);
          },
        });
        break;

      case "Tackle":
        const tl = gsap.timeline();
        let movementDistance = 20;
        if (this.isEnemy) movementDistance = -20;
        tl.to(this.position, {
          x: this.position.x - movementDistance,
        })
          .to(this.position, {
            x: this.position.x + movementDistance * 2,
            duration: 0.1,
            onComplete: () => {
              // Enemy actually gets hit
              audio.tackleHit.play();
              gsap.to(healthBar, {
                width: recipient.health + "%",
              });
              gsap.to(recipient.position, {
                x: recipient.position.x + 10,
                yoyo: true,
                repeat: 5,
                duration: 0.08,
              });
              gsap.to(recipient, {
                opacity: 0,
                repeat: 5,
                yoyo: true,
                duration: 0.08,
              });
            },
          })
          .to(this.position, {
            x: this.position.x,
          });
        break;
    }
  }
}
