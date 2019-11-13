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

    // Draw editor
    this.draw();
  }

  draw() {
    // Start by generating/updating the gradient
    this.generateGradient();

    // Add a test rect
    this.editorGroup
      .append('rect')
      .attr('width', this.innerWidth)
      .attr(
        'height',
        this.innerHeight - this.previewHeight - this.previewTopPadding
      )
      .attr('fill', 'red');

    // Add a test rect
    this.previewGroup
      .append('rect')
      .attr('width', this.innerWidth)
      .attr('height', this.previewHeight)
      .attr('fill', 'url(#previewGradient)');

    // Draw editor 'background'
    // this.svg
    //   .append('rect')
    //   .attr('width', this.width)
    //   .attr('height', this.height)
    //   .attr('fill', 'black')
    //   .lower();
  }

  generateGradient() {
    // Get all nodes
    const nodes = this.nodeManager.getNodes();

    this.previewGradient
      .selectAll('stop')
      .data(nodes)
      .join(enter => {
        enter
          .append('stop')
          .attr('stop-color', node => node.getCSSColor())
          .attr('offset', node => node.getOffsetPercentage(this.innerWidth));
      });
  }
}
