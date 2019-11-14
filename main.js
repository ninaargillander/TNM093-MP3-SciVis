// Parameters
const width = 400;
const height = 600;
const margins = {
  top: 10,
  bottom: 10,
  left: 10,
  right: 10
};
const previewHeight = 50;
const previewTopPadding = 10;

const nodeManager = new NodeManager();
const TFG = new TransferFunctionGenerator(256, width, nodeManager);
const editor = new Editor(
  width,
  height,
  margins,
  previewHeight,
  previewTopPadding,
  nodeManager
);

// Test nodes
nodeManager.addNode(67, 12, 19, 110, 140);
nodeManager.addNode(17, 32, 29, 12, 240);
nodeManager.addNode(37, 62, 109, 3, 80);
nodeManager.addNode(167, 19, 69, 10, 10);
nodeManager.addNode(width - margins.left - margins.right, 28, 4, 155, 26);
nodeManager.addNode(0, 0, 4, 155, 26);

// Redraw editor after adding nodes
editor.draw();
