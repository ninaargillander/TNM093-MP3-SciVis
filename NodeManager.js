class NodeManager {
  constructor() {
    this.nodes = [];
  }

  // Adds a new node to the internal array
  // Makes sure everything is nice and sorted
  addNode(x, y, r, g, b) {
    this.nodes.push(new Node(x, y, r, g, b));
    this.nodes = this.nodes.sort((a, b) => a.x - b.x);
  }

  // Returns array of nodes
  getNodes() {
    return this.nodes;
  }
}
