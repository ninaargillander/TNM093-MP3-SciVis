class TransferFunctionGenerator {
	
	constructor(resolution, width) {
		this.resolution = resolution;
		this.x = d3.scaleLinear().domain([0, resolution-1]).range([0, width]);

		// Test data
		this.nodes = [];
	}

	// Adds a new node to the internal array
	// Makes sure everything is nice and sorted
	addNode(x, y, r, g, b) {
		this.nodes.push(new Node(x, y, r, g, b));
		this.nodes = this.nodes.sort((a, b) => a.x - b.x);
	}

	getTransferFunction() {
		// Sample and interpolate between the nodes
		// Store values in 'result'
		let result = new Array(this.resolution*4);
		let resultIndex = 0;

		for(let i = 0; i < this.resolution; i++)
		{
			// Get the pair of points to interpolate between
			let p1, p2;
			// Loop through the nodes and check if the x position of the
			// next node is less than the current x position
			for(let j = 0; j < this.nodes.length-1; j++) {
				if (this.x(i) <= this.nodes[j+1].x) {
					p1 = this.nodes[j];
					p2 = this.nodes[j+1];
					break;
				}
			}			

			// Determine interpolator
			const t = (this.x(i)-p1.x) / (p2.x-p1.x);
			// Interpolate values
			result[resultIndex++] = p1.r + t*(p2.r-p1.r);
			result[resultIndex++] = p1.g + t*(p2.g-p1.g);
			result[resultIndex++] = p1.b + t*(p2.b-p1.b);
			result[resultIndex++] = p1.y + t*(p2.y-p1.y);
		}

		return result;
	}
}