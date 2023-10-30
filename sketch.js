let theCanvas;
let darkolivegreen;
let darkerolivegreen;
let sheepX, sheepY;

function setFlora(str, it, sz) {
  for (let i = 0; i < it; i++) {
    let x = random(windowWidth);
    let y = random(windowHeight);
    let d = dist(x, y, windowWidth / 2, windowHeight / 2);

    textSize(sz);

    if (
      checkpoint(
        windowWidth / 2,
        windowHeight / 2,
        x,
        y,
        fenceW / 2,
        fenceH / 2
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

function setSheep(x, y) {
  textSize(32);
  text("🐑", x, y);
  sheepX = x;
  sheepY = y;
}

function checkpoint(h, k, x, y, a, b) {
  var p =
    Math.pow(x - h, 2) / Math.pow(a, 2) + Math.pow(y - k, 2) / Math.pow(b, 2);

  return p;
}

function setEnclosure(w, h) {
  push();
  rectMode(CENTER);
  fill(darkerolivegreen);
  noStroke();
  ellipse(windowWidth / 2, windowHeight / 2, w, h);
  pop();
}

function setup() {
  theCanvas = createCanvas(windowWidth, windowHeight);
  theCanvas.id("canvas");

  darkolivegreen = color(85, 107, 47);
  darkerolivegreen = color(56, 71, 31);

  background(darkolivegreen);

  // setEnclosure(fenceW, fenceH);
  // setSheep(fenceW / 2, fenceH / 2);
}

function draw() {
  //   const s = second();
  //   if (s % 2 == 0) {
  //     translate(0, -2);
  //   } else {
  //     translate(0, 2);
  //   }
}
