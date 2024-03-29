class TransferFunctionGenerator {
  constructor(resolution, editorWidth, editorHeight, nodeManager) {
    this.resolution = resolution;
    this.x = d3
      .scaleLinear()
      .domain([0, resolution - 1])
      .range([0, editorWidth]);
    this.editorHeight = editorHeight;
    this.nodeManager = nodeManager;
  }

  getNodes() {
    return this.nodeManager.getNodes();
  }

  getTransferFunction() {
    // Sample and interpolate between the nodes
    // Store values in 'result'
    let result = new Uint8Array(this.resolution * 4);
    let resultIndex = 0;

    // Get all nodes from NodeManager
    const nodes = this.nodeManager.getNodes();

    for (let i = 0; i < this.resolution; i++) {
      // Get the pair of points to interpolate between
      let p1, p2;
      // Loop through the nodes and check if the x position of the
      // next node is less than the current x position
      for (let j = 0; j < nodes.length - 1; j++) {
        if (this.x(i) <= nodes[j + 1].x) {
          p1 = nodes[j];
          p2 = nodes[j + 1];
          break;
        }
      }

      // Determine interpolator
      const t = (this.x(i) - p1.x) / (p2.x - p1.x);
      // Get node alpha values
      const p1a = p1.getAlpha(this.editorHeight);
      const p2a = p2.getAlpha(this.editorHeight);
      // Interpolate values
      result[resultIndex++] = p1.r + t * (p2.r - p1.r);
      result[resultIndex++] = p1.g + t * (p2.g - p1.g);
      result[resultIndex++] = p1.b + t * (p2.b - p1.b);
      result[resultIndex++] = p1a + t * (p2a - p1a);
    }

    return result;
  }
}
