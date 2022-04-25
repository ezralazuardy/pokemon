export class Position {
  position: { x: number; y: number } = { x: 0, y: 0 };
}

export default class Boundary {
  position: any;
  width: number = 48;
  height: number = 48;
  static width: number = 48;
  static height: number = 48;

  constructor(data: Partial<Position>) {
    this.position = data.position;
  }

  draw(c) {
    c.fillStyle = "rgba(255, 0, 0, 0)";
    c.fillRect(
      this.position.x,
      this.position.y,
      Boundary.width,
      Boundary.height
    );
  }
}
