// import { Scene } from "./Scene.js";

let theCanvas;
let darkolivegreen;
let darkerolivegreen;
// let sheepX, sheepY;
// let scene;

// function setFlora(str, it, sz) {
//   for (let i = 0; i < it; i++) {
//     let x = random(windowWidth);
//     let y = random(windowHeight);
//     let d = dist(x, y, windowWidth / 2, windowHeight / 2);

//     textSize(sz);

//     if (
//       checkpoint(
//         windowWidth / 2,
//         windowHeight / 2,
//         x,
//         y,
//         fenceW / 2,
//         fenceH / 2
//       ) < 1
//     ) {
//       fill(darkolivegreen);
//       text(str, x, y);
//     } else {
//       fill(darkerolivegreen);
//       text(str, x, y);
//     }
//   }
// }

// function checkpoint(h, k, x, y, a, b) {
//   var p =
//     Math.pow(x - h, 2) / Math.pow(a, 2) + Math.pow(y - k, 2) / Math.pow(b, 2);

//   return p;
// }

// function setEnclosure(w, h) {
//   push();
//   rectMode(CENTER);
//   fill(darkerolivegreen);
//   noStroke();
//   ellipse(windowWidth / 2, windowHeight / 2, w, h);
//   pop();
// }

// function setFence() {
//   let angle = 0;
//   let it = 360;
//   let rx = fenceW / 2;
//   let ry = fenceH / 2;

//   push();

//   translate(windowWidth / 2, windowHeight / 2);

//   for (let i = 0; i < it; i++) {
//     angle *= angle !== 360;
//     let t = Math.tan((angle += 2 / 360) * Math.PI);
//     let px = (rx * (1 - t ** 2)) / (1 + t ** 2);
//     let py = (ry * 2 * t) / (1 + t ** 2);

//     noStroke();
//     fill(220);
//     textSize(24);
//     text("⊯", px, py);
//   }
//   pop();
// }

// function setSheep(x, y) {
//   textSize(32);
//   text("🐑", x, y);
//   sheepX = x;
//   sheepY = y;
// }

function setup() {
  theCanvas = createCanvas(windowWidth, windowHeight);
  theCanvas.id("canvas");

  darkolivegreen = color(85, 107, 47);
  darkerolivegreen = color(56, 71, 31);

  // scene = new Scene(fenceW, fenceH);
  background(darkolivegreen);
}

function draw() {}
