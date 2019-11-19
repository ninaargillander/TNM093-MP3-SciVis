class Node {
  constructor(x, y, r, g, b) {
    this.setXY(x, y);
    this.setRGB(r, g, b);
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

  getAlpha(height) {
    return (255 * this.y) / height;
  }

  getCSSColor(alpha) {
    if (alpha !== null) return d3.rgb(this.r, this.g, this.b, alpha);
    else return d3.rgb(this.r, this.g, this.b);
  }

  getHexColor() {
    return d3.color(`rgb(${this.r},${this.g},${this.b})`).formatHex();
  }

  getOffsetPercentage(width) {
    return `${(100 * this.x) / width}%`;
  }
}
