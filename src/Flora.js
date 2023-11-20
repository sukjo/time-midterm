// import { checkpoint } from "./utils";

// export default
class Flora {
  constructor(ww, wh) {
    this.windowWidth = ww;
    this.windowHeight = wh;
  }

  draw(str, it, sz, fw, fh) {
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
          fw / 2,
          fh / 2
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
}

// module.exports = Scene;
