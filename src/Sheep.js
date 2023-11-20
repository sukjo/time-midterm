class Sheep {
  constructor() {
    this.sheepX;
    this.sheepY;
  }

  draw(x, y) {
    textSize(32);
    text("🐑", x, y);
    this.sheepX = x;
    this.sheepY = y;
  }
}
