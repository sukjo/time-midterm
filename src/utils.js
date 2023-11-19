// export
function checkpoint(h, k, x, y, a, b) {
  var p =
    Math.pow(x - h, 2) / Math.pow(a, 2) + Math.pow(y - k, 2) / Math.pow(b, 2);

  return p;
}
