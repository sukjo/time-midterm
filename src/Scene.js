// import { checkpoint } from "./utils";

// export default
class Scene {
  constructor(ww, wh) {
    this.fenceW;
    this.fenceH;
    this.sheepX;
    this.sheepY;
    this.windowWidth = ww;
    this.windowHeight = wh;
  }

  drawFlora(str, it, sz) {
    for (let i = 0; i < it; i++) {
      let x = random(this.windowWidth);
      let y = random(this.windowHeight);
      // let d = dist(x, y, this.windowWidth / 2, this.windowHeight / 2);

      textSize(sz);

      if (
        checkpoint(
          this.windowWidth / 2,
          this.windowHeight / 2,
          x,
          y,
          this.fenceW / 2,
          this.fenceH / 2
        ) < 1
      ) {
        fill(darkolivegreen);
        text(str, x, y);
      } else {
        fill(darkerolivegreen);
        text(str, x, y);
      }
    }
  }

  drawSheep(x, y) {
    textSize(32);
    text("🐑", x, y);
    this.sheepX = x;
    this.sheepY = y;
  }

  drawEnclosure() {
    push();
    rectMode(CENTER);
    fill(darkerolivegreen);
    noStroke();
    ellipse(
      this.windowWidth / 2,
      this.windowHeight / 2,
      this.fenceW * 2,
      this.fenceH * 2
    );
    pop();
  }

  drawFence() {
    let angle = 0;
    let it = 360;
    let rx = this.fenceW / 2;
    let ry = this.fenceH / 2;

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

  setFenceSize(totalFreeTime, ww, wh) {
    const spaceRatio = totalFreeTime / 10080; // spacious minutes in a week

    // const windowWidth = $(window).width();
    // const windowHeight = $(window).height();
    const aspectRatio = this.windowWidth / this.windowHeight;

    if (aspectRatio >= 1) {
      // landscape view
      this.fenceW = Math.floor(
        Math.sqrt(
          spaceRatio * aspectRatio * this.windowWidth * this.windowHeight
        )
      );
      this.fenceH = Math.floor(this.fenceW / aspectRatio);
    } else {
      // portrait view
      this.fenceH = Math.floor(
        Math.sqrt(
          (spaceRatio / aspectRatio) * this.windowWidth * this.windowHeight
        )
      );
      this.fenceW = Math.floor(this.fenceH * aspectRatio);
    }

    console.log("fence size set to " + this.fenceW + " by " + this.fenceH);
  }

  drawScene() {
    this.drawEnclosure(this.fenceW, this.fenceH);
    this.drawFlora("\\|/", 500, 12);
    this.drawFlora("⚚", 20, 18);
    this.drawFlora("⚘", 20, 16);
    this.drawFlora("✿", 20, 16);
    this.drawFence();
    this.drawSheep(this.fenceW / 2, this.fenceH / 2);
  }
}

// module.exports = Scene;
