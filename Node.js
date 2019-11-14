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

  getCSSColor(alpha) {
    if (alpha !== null) return d3.rgb(this.r, this.g, this.b, alpha);
    else return d3.rgb(this.r, this.g, this.b);
  }

  getOffsetPercentage(width) {
    return `${(100 * this.x) / width}%`;
  }
}
