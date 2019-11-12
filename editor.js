// Handles the transfer function editor

// Document selections
let div = d3.select('#transferFunctionEditor');
let svg = div.append('svg');
let defs = svg.append('defs');

// Editor parameters
const width = 250;
const height = 50;
const margins = {top: 10, bottom: 10, left: 10, right: 10};

// Transfer function preview window
const topPadding = 10;
const previewHeight = 50;

// Set up the svg groups for the editor and preview
// TODO

// Temporary initialization of global class instance
let TFGen = new TransferFunctionGenerator(256, width);

// Try adding a node
TFGen.addNode(67, 12, 19, 110, 140)
TFGen.addNode(17, 32, 29, 12, 240)
TFGen.addNode(69, 15, 99, 0, 42)
TFGen.addNode(37, 62, 109, 3, 80)
TFGen.addNode(167, 19, 69, 10, 10);
TFGen.addNode(width, 19, 69, 10, 10);


// Try asking for the transfer function
TFGen.getTransferFunction()