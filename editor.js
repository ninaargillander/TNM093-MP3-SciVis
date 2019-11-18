class Editor {
  constructor(
    width,
    height,
    margins,
    previewHeight,
    previewTopPadding,
    nodeManager
  ) {
    this.width = width;
    this.height = height;
    this.margins = margins;
    this.previewHeight = previewHeight;
    this.previewTopPadding = previewTopPadding;
    this.nodeManager = nodeManager;

    this.selectedNode = '';
    this.yScale = yValue => -yValue;

    // Width and height of editor and preview combined
    this.innerWidth = width - margins.left - margins.right;
    this.innerHeight = height - margins.top - margins.bottom;

    // Height of the editor area
    this.editorHeight =
      this.innerHeight - this.previewHeight - this.previewTopPadding;

    // Document selections
    this.div = d3.select('#transferFunctionEditor');
    this.svg = this.div.append('svg');
    this.defs = this.svg.append('defs');
    this.previewGradient = this.defs
      .append('linearGradient')
      .attr('id', 'previewGradient');

    // Set up the svg groups for the editor and preview
    this.svg.attr('width', width).attr('height', height);

    // Selection handle for editor rectangle group
    this.editorGroup = this.svg
      .append('g')
      .attr('transform', `translate(${margins.left}, ${margins.top})`)
      .append('rect')
      .attr('width', this.innerWidth)
      .attr('height', this.editorHeight)
      .attr('fill', '#ccc')
      .on('click', (d, i, n) => {
        const [x, y] = d3.mouse(n[i]);
        console.log(x, y);
        this.nodeManager.addNode(x, this.editorHeight - y, 0, 0, 0);
        this.draw();
      });

    // Selection handle for preview rectangle group
    this.previewGroup = this.svg
      .append('g')
      .attr(
        'transform',
        `translate(${margins.left}, ${margins.top +
          this.innerHeight -
          this.previewHeight})`
      );

    // Initialize editor elements
    this.graphOrigin = this.svg
      .append('g')
      .attr(
        'transform',
        `translate(${margins.left}, ${margins.top +
          this.innerHeight -
          this.previewHeight -
          this.previewTopPadding})`
      );

    // Background for preview element
    this.previewGroup
      .append('rect')
      .attr('width', this.innerWidth)
      .attr('height', this.previewHeight)
      .attr('fill', 'black');

    this.previewElement = this.previewGroup
      .append('rect')
      .attr('width', this.innerWidth)
      .attr('height', this.previewHeight)
      .attr('fill', 'black');

    // Draw editor
    this.draw();
  }

  clear() {
    this.graphOrigin.selectAll('*').remove();
  }

  draw() {
    this.clear();

    // Get all nodes
    let nodes = this.nodeManager.getNodes();

    // Start by generating/updating the gradient
    this.generateGradient(nodes);

    // Update gradient fill for preview element
    this.previewElement.attr('fill', 'url(#previewGradient)');

    // Draw node graph
    const path = node =>
      d3
        .line()
        .x(node => node.x)
        .y(node => this.yScale(node.y))(nodes);

    // Lines
    let lines = this.graphOrigin
      .append('path')
      .attr('fill', 'none')
      .attr('stroke', 'black')
      .attr('stroke-width', 2)
      .attr('d', path);
    // Dots
    this.graphOrigin
      .selectAll('circle')
      .data(nodes)
      .join(enter => {
        enter
          .append('circle')
          .attr('cx', d => d.x)
          .attr('cy', d => this.yScale(d.y))
          .attr('fill', d => d.getCSSColor())
          .attr('r', 5)
          .attr('stroke', 'black')
          .attr('stroke-width', (d, i) => (this.selectedNode === i ? 2 : 0))
          .on('click', (d, i, n) => {
            //
            // Select node to change color
            //
            const clicked = d3.select(n[i]);

            if (i === this.selectedNode) {
              // Deselect current node
              this.selectedNode = '';
              clicked.attr('stroke-width', 0);
              clearBoundNode();
            } else {
              // Select the clicked node
              this.selectedNode = i;
              d3.selectAll('circle').attr('stroke-width', 0);
              clicked.attr('stroke-width', 2);
              bindNode(nodes[i]);
            }
          })
          .call(
            d3
              .drag()
              .subject(d => ({ x: d.x, y: this.yScale(d.y) }))
              .on('drag', (d, i, n) => {
                //
                // Drag behaviour starts here
                //
                let { x, y } = d3.event;

                // Clamp values within range
                y = -Math.min(Math.max(0, this.yScale(y)), this.editorHeight);
                // Check if first or last node
                if (i === 0 || i === nodes.length - 1) {
                  x = nodes[i].x;
                } else {
                  x = Math.min(Math.max(nodes[i - 1].x, x), nodes[i + 1].x);
                }

                d3.select(n[i])
                  .attr('cx', (d.x = x))
                  .attr('cy', (d.y = y));

                // TODO:  Find a way to let NodeManager sort this
                //        without breaking the indexing for the circles
                nodes[i].setXY(x, this.yScale(y));

                lines.attr('d', path);

                this.generateGradient(nodes);

                //
                // Drag behaviour ends here
                //
              })
              .on('end', (d, i, n) => {
                // Delete nodes that are dragged outside of the editor
                let { x, y } = d3.event;
                // Check if first or last node
                if (i === 0 || i === nodes.length - 1) {
                  return;
                } else if (
                  // TODO: Find proper bounds
                  x > this.width ||
                  x < this.margins.left ||
                  this.yScale(y) > this.height ||
                  this.yScale(y) < this.margins.top
                ) {
                  this.nodeManager.removeNode(i);
                  this.draw();
                }
              })
          );
      });
  }

  generateGradient(nodes) {
    this.previewGradient
      .selectAll('stop')
      .data(nodes)
      .join('stop')
      .attr('stop-color', node => node.getCSSColor(node.y / this.editorHeight))
      .attr('offset', node => node.getOffsetPercentage(this.innerWidth));
  }
}
