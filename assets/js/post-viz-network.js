(function (global) {
  'use strict';

  var core = global.postViz;
  if (!core) return;

  function normalizeGraph(spec) {
    if (spec.nodes && spec.edges) {
      return { nodes: spec.nodes.slice(), edges: spec.edges.slice() };
    }
    if (spec.elements) {
      var nodes = [];
      var edges = [];
      spec.elements.forEach(function (el) {
        if (el.data && el.data.source != null) edges.push(el);
        else nodes.push(el);
      });
      return { nodes: nodes, edges: edges, elements: spec.elements };
    }
    return { nodes: [], edges: [] };
  }

  function themedVisOptions(palette, extra) {
    var base = {
      nodes: {
        font: { color: palette.ink, face: 'IBM Plex Sans, sans-serif', size: 13 },
        color: {
          background: palette.codeBg,
          border: palette.accent,
          highlight: { background: palette.codeBg, border: palette.accent }
        }
      },
      edges: {
        color: { color: palette.border, highlight: palette.accent },
        font: { color: palette.muted, size: 11 }
      }
    };
    if (!extra) return base;
    return Object.assign({}, base, extra);
  }

  function renderD3(mount, spec, palette) {
    if (!global.d3) return function () {};
    var graph = normalizeGraph(spec);
    var width = core.width(mount) || 480;
    var height = spec.height || mount.clientHeight || 320;
    var nodes = graph.nodes.map(function (n, i) {
      var copy = Object.assign({}, n);
      if (!copy.id) copy.id = copy.label || String(i);
      return copy;
    });
    var links = graph.edges.map(function (e) {
      return {
        source: e.source || (e.data && e.data.source),
        target: e.target || (e.data && e.data.target),
        label: e.label || (e.data && e.data.label)
      };
    });

    var simulation;
    function draw() {
      width = core.width(mount) || width;
      mount.replaceChildren();
      var svg = global.d3.select(mount)
        .append('svg')
        .attr('viewBox', '0 0 ' + width + ' ' + height)
        .attr('role', 'presentation');

      var g = svg.append('g');

      simulation = global.d3.forceSimulation(nodes)
        .force('link', global.d3.forceLink(links).id(function (d) { return d.id; }).distance(72))
        .force('charge', global.d3.forceManyBody().strength(-220))
        .force('center', global.d3.forceCenter(width / 2, height / 2))
        .force('collide', global.d3.forceCollide(22));

      var link = g.append('g')
        .attr('stroke', palette.border)
        .selectAll('line')
        .data(links)
        .join('line')
        .attr('stroke-width', 1.2);

      var node = g.append('g')
        .selectAll('circle')
        .data(nodes)
        .join('circle')
        .attr('r', 8)
        .attr('fill', palette.codeBg)
        .attr('stroke', palette.accent)
        .attr('stroke-width', 1.5)
        .call(global.d3.drag()
          .on('start', function (event, d) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on('drag', function (event, d) {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on('end', function (event, d) {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          }));

      var label = g.append('g')
        .selectAll('text')
        .data(nodes)
        .join('text')
        .text(function (d) { return d.label || d.id; })
        .attr('font-size', 11)
        .attr('fill', palette.muted)
        .attr('text-anchor', 'middle')
        .attr('dy', 22);

      simulation.on('tick', function () {
        link
          .attr('x1', function (d) { return d.source.x; })
          .attr('y1', function (d) { return d.source.y; })
          .attr('x2', function (d) { return d.target.x; })
          .attr('y2', function (d) { return d.target.y; });
        node
          .attr('cx', function (d) { return d.x; })
          .attr('cy', function (d) { return d.y; });
        label
          .attr('x', function (d) { return d.x; })
          .attr('y', function (d) { return d.y; });
      });
    }

    var off = core.onTheme(function (ctx) { draw(ctx.colors); });
    var onResize = core.debounce(draw, 120);
    window.addEventListener('resize', onResize);
    draw(core.colors());

    return function destroy() {
      off();
      window.removeEventListener('resize', onResize);
      if (simulation) simulation.stop();
      mount.replaceChildren();
    };
  }

  function renderGraphviz(mount, spec, palette) {
    if (!global.Viz) return function () {};
    var dot = spec.dot;
    if (!dot) return function () {};

    var viz;
    function draw() {
      mount.replaceChildren();
      var p = core.colors();
      var attrs = [
        'bgcolor=transparent',
        'fontname="IBM Plex Sans"',
        'fontsize=11',
        'fontcolor="' + p.ink + '"',
        'color="' + p.border + '"'
      ].join(',');
      var wrapped = dot.replace(/^(digraph|graph)\s*\{/i, function (m) {
        return m + ' graph [' + attrs + ']; node [color="' + p.accent + '", fontcolor="' + p.muted + '"]; edge [color="' + p.border + '"];';
      });

      if (!viz) viz = new global.Viz();
      viz.renderSVGElement(wrapped).then(function (svg) {
        svg.setAttribute('width', '100%');
        svg.style.maxWidth = '100%';
        mount.appendChild(svg);
      }).catch(function (err) {
        mount.textContent = 'graphviz render failed';
        console.error(err);
      });
    }

    var off = core.onTheme(draw);
    return function destroy() {
      off();
      mount.replaceChildren();
    };
  }

  function renderCytoscape(mount, spec, palette) {
    if (!global.cytoscape) return function () {};
    var cy;
    function draw() {
      var p = core.colors();
      var elements = spec.elements;
      if (!elements) {
        var graph = normalizeGraph(spec);
        elements = [];
        graph.nodes.forEach(function (n) {
          elements.push({ data: Object.assign({ id: n.id, label: n.label || n.id }, n) });
        });
        graph.edges.forEach(function (e, i) {
          elements.push({
            data: {
              id: e.id || 'e' + i,
              source: e.source,
              target: e.target,
              label: e.label
            }
          });
        });
      }
      if (cy) cy.destroy();
      cy = global.cytoscape({
        container: mount,
        elements: elements,
        style: [
          {
            selector: 'node',
            style: {
              label: 'data(label)',
              'text-valign': 'bottom',
              'text-margin-y': 4,
              'font-size': 11,
              color: p.muted,
              'background-color': p.codeBg,
              'border-width': 1.5,
              'border-color': p.accent,
              width: 18,
              height: 18
            }
          },
          {
            selector: 'edge',
            style: {
              width: 1.2,
              'line-color': p.border,
              'target-arrow-color': p.border,
              'target-arrow-shape': 'triangle',
              'curve-style': 'bezier',
              label: 'data(label)',
              'font-size': 10,
              color: p.muted
            }
          }
        ],
        layout: Object.assign({ name: 'cose', animate: false }, spec.layout || {})
      });
    }

    var off = core.onTheme(draw);
    return function destroy() {
      off();
      if (cy) cy.destroy();
    };
  }

  function renderVis(mount, spec, palette) {
    if (!global.vis) return function () {};
    var network;
    function draw() {
      var p = core.colors();
      var graph = normalizeGraph(spec);
      var nodes = new global.vis.DataSet(graph.nodes.map(function (n) {
        return Object.assign({ id: n.id, label: n.label || n.id }, n);
      }));
      var edges = new global.vis.DataSet(graph.edges.map(function (e, i) {
        return Object.assign({ id: e.id || i, from: e.source || e.from, to: e.target || e.to }, e);
      }));
      mount.replaceChildren();
      network = new global.vis.Network(
        mount,
        { nodes: nodes, edges: edges },
        themedVisOptions(p, spec.options)
      );
    }

    var off = core.onTheme(draw);
    return function destroy() {
      off();
      if (network) network.destroy();
      mount.replaceChildren();
    };
  }

  /**
   * @param {HTMLElement|string} mount
   * @param {object} spec - { engine: 'd3'|'graphviz'|'cytoscape'|'vis', nodes, edges, dot?, options? }
   */
  function network(mount, spec) {
    var root = core.resolveMount(mount);
    if (!root || !spec) return function () {};
    var engine = (spec.engine || 'd3').toLowerCase();
    root.classList.add('viz-figure__mount--network');

    var destroy;
    function start(palette) {
      if (destroy) destroy();
      if (engine === 'graphviz' || engine === 'viz.js') {
        destroy = renderGraphviz(root, spec, palette);
      } else if (engine === 'cytoscape') {
        destroy = renderCytoscape(root, spec, palette);
      } else if (engine === 'vis' || engine === 'vis.js') {
        destroy = renderVis(root, spec, palette);
      } else {
        destroy = renderD3(root, spec, palette);
      }
    }

    var off = core.onTheme(function (ctx) { start(ctx.colors); });
    return function () {
      off();
      if (destroy) destroy();
      root.classList.remove('viz-figure__mount--network');
    };
  }

  global.postViz.network = network;
  global.postViz.engines = ['d3', 'graphviz', 'cytoscape', 'vis'];
})(window);
