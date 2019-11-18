class NodeManager {
  constructor() {
    this.nodes = [];
  }

  // Adds a new node to the internal array
  // Makes sure everything is nice and sorted
  addNode(x, y, r, g, b) {
    this.nodes.push(new Node(x, y, r, g, b));
    this.sortNodes();
  }

  // Returns array of nodes
  getNodes() {
    return this.nodes;
  }

  removeNode(index) {
    this.nodes.splice(index, 1);
  }

  sortNodes() {
    this.nodes = this.nodes.sort((a, b) => a.x - b.x);
  }
}
