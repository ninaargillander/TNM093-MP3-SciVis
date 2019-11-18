let colorSelection = d3.select('#colorSelection');

const bindNode = node => {
  colorSelection
    .attr('value', node.getHexColor())
    .attr('disabled', null)
    .on('change', (d, i, n) => {
      let value = d3.rgb(n[i].value);
      node.setRGB(value.r, value.g, value.b);
      editor.draw();
    });
};

const clearBoundNode = () => {
  colorSelection.attr('value', '#000000').attr('disabled', 'disabled');
};
