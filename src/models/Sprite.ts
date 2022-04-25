export class SpriteData {
  position: any;

  frames: { max: number; hold: number } = { max: 1, hold: 10 };

  image: any;

  sprites: any;

  animate: boolean = false;

  rotation: number = 0;

  opacity: number = 1;

  width: number = 0;

  height: number = 0;
}

export default class Sprite {
  position: any;
  frames: any = { max: 1, hold: 10 };
  image: any;
  sprites: any;
  animate: boolean;
  rotation: number;
  opacity: number;
  width: number;
  height: number;

  constructor(data: Partial<SpriteData>) {
    this.position = data.position;
    this.frames = { ...this.frames, val: 0, elapsed: 0 };
    this.frames.max = data.frames?.max ?? this.frames.max;
    this.frames.hold = data.frames?.hold ?? this.frames.hold;
    this.image = new Image();
    this.image.onload = () => {
      this.width = this.image.width / this.frames.max;
      this.height = this.image.height;
    };
    this.image.src = data.image.src;
    this.sprites = data.sprites;
    this.animate = data.animate ?? false;
    this.rotation = data.rotation ?? 0;
    this.opacity = data.opacity ?? 1;
    this.width = data.width ?? 0;
    this.height = data.height ?? 0;
  }

  draw(c: CanvasRenderingContext2D) {
    c.save();
    c.translate(
      this.position.x + this.width / 2,
      this.position.y + this.height / 2
    );
    c.rotate(this.rotation ?? 0);
    c.translate(
      -this.position.x - this.width / 2,
      -this.position.y - this.height / 2
    );
    c.globalAlpha = this.opacity;
    c.drawImage(
      this.image,
      this.frames.val * this.width,
      0,
      this.image.width / this.frames.max,
      this.image.height,
      this.position.x,
      this.position.y,
      this.image.width / this.frames.max,
      this.image.height
    );
    c.restore();
    if (!this.animate) return;
    if (this.frames.max > 1) {
      this.frames.elapsed++;
    }
    if (this.frames.elapsed % this.frames.hold === 0) {
      if (this.frames.val < this.frames.max - 1) this.frames.val++;
      else this.frames.val = 0;
    }
  }

  hide(canvas: any, c: CanvasRenderingContext2D) {
    c.fillStyle = "#939393";
    c.fillRect(0, 0, canvas.width, canvas.height);
  }
}
