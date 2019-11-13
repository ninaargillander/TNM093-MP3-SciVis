class Node {
  constructor(x, y, r, g, b) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.g = g;
    this.b = b;
  }

  setXY(x, y) {
    this.x = x;
    this.y = y;
  }

  setRGB(r, g, b) {
    this.r = r;
    this.g = g;
    this.b = b;
  }

  getCSSColor() {
    return d3.rgb(this.r, this.g, this.b, this.y);
  }

  getOffsetPercentage(width) {
    return `${(100 * this.x) / width}%`;
  }
}
