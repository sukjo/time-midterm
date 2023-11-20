class Enclosure {
  constructor(ww, wh) {
    this.windowWidth = ww;
    this.windowHeight = wh;
  }

  draw(fw, fh) {
    push();
    rectMode(CENTER);
    fill(darkerolivegreen);
    noStroke();
    ellipse(this.windowWidth / 2, this.windowHeight / 2, fw * 2, fh * 2);
    pop();
  }
}
