class Scene {
  constructor(ww, wh) {
    this.windowWidth = ww;
    this.windowHeight = wh;
    this.fenceW;
    this.fenceH;
    this.enclosure = new Enclosure(this.windowWidth, this.windowHeight);
    this.fence = new Fence(this.windowWidth, this.windowHeight);
    this.sheep = new Sheep();
    this.flora = new Flora(this.windowWidth, this.windowHeight);
  }

  setFenceSize(totalFreeTime) {
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
    this.enclosure.draw(this.fenceW, this.fenceH);
    this.flora.draw("\\|/", 500, 12, this.fenceW, this.fenceH);
    this.flora.draw("⚚", 20, 18, this.fenceW, this.fenceH);
    this.flora.draw("⚘", 20, 16, this.fenceW, this.fenceH);
    this.flora.draw("✿", 20, 16, this.fenceW, this.fenceH);
    this.fence.draw(this.fenceW, this.fenceH);
    this.sheep.draw(this.fenceW / 2, this.fenceH / 2);
  }
}
