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
      .attr('transform', `translate(${margins.left}, ${margins.top})`);

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

  draw() {
    // Get all nodes
    let nodes = this.nodeManager.getNodes();

    // Start by generating/updating the gradient
    this.generateGradient(nodes);

    // Update gradient fill for preview element
    this.previewElement.attr('fill', 'url(#previewGradient)');

    // Draw node graph
    const yScale = yValue => -yValue;
    const path = node =>
      d3
        .line()
        .x(node => node.x)
        .y(node => yScale(node.y))(nodes);

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
          .attr('cy', d => yScale(d.y))
          .attr('fill', d => d.getCSSColor())
          .attr('r', 5)
          .call(
            d3
              .drag()
              .subject(d => ({ x: d.x, y: yScale(d.y) }))
              .on('drag', (d, i, n) => {
                let { x, y } = d3.event;

                // Clamp values within range
                x = Math.min(Math.max(0, x), this.innerWidth);
                y = -Math.min(Math.max(0, yScale(y)), this.editorHeight);

                d3.select(n[i])
                  .attr('cx', (d.x = x))
                  .attr('cy', (d.y = y));

                // TODO:  Find a way to let NodeManager sort this
                //        without breaking the indexing for the circles
                nodes[i].x = x;
                nodes[i].y = yScale(y);

                lines.attr('d', path);

                // TODO: Y value does not seem to affect alpha
                this.generateGradient(nodes);
              })
          );
      });
  }

  generateGradient(nodes) {
    this.previewGradient
      .selectAll('stop')
      .data(nodes)
      .join('stop')
      // TODO: Alpha set to max when Y value is at min
      .attr('stop-color', node => node.getCSSColor(node.y / this.editorHeight))
      .attr('offset', node => node.getOffsetPercentage(this.innerWidth));
  }
}
