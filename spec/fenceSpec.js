// ReferenceError: $ is not defined

// const { JSDOM } = require("jsdom");
// need to include JSDOM library if running test via Node

const { Scene } = require("../src/Scene.js");

console.log(Scene);

describe("Fence functions", function () {
  let window;
  let scene;

  beforeEach(() => {
    // const dom = new JSDOM("<!DOCTYPE html><html><body></body></html>");
    // window = dom.window;
    // global.window = window;
    // global.document = window.document;

    scene = new Scene(1920, 1080);
  });

  it("should set the fence size accurately", function () {
    // spyOn(window, "innerWidth").and.returnValue(1920);
    // spyOn(window, "innerHeight").and.returnValue(1080);

    // provide fake totalFreeTime
    scene.setFenceSize(6000);

    expect(scene.fenceW).toBe(960);
    expect(scene.fenceH).toBe(540);
  });
});
