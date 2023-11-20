class Fence {
  constructor(ww, wh) {
    this.windowWidth = ww;
    this.windowHeight = wh;
  }

  draw(fw, fh) {
    let angle = 0;
    let it = 360;
    let rx = fw / 2;
    let ry = fh / 2;

    push();

    translate(this.windowWidth / 2, this.windowHeight / 2);

    for (let i = 0; i < it; i++) {
      angle *= angle !== 360;
      let t = Math.tan((angle += 2 / 360) * Math.PI);
      let px = (rx * (1 - t ** 2)) / (1 + t ** 2);
      let py = (ry * 2 * t) / (1 + t ** 2);

      noStroke();
      fill(220);
      textSize(24);
      text("⊯", px, py);
    }
    pop();
  }
}
