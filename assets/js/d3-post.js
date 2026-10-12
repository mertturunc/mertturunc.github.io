(function (global) {
  'use strict';

  var TOKEN_KEYS = {
    paper: '--primary-bg',
    ink: '--primary-text',
    muted: '--muted-text',
    accent: '--accent-color',
    border: '--border-color',
    codeBg: '--code-bg',
    ok: '--status-ok',
    bad: '--status-bad',
    wip: '--status-wip'
  };

  function readToken(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  function colorsFallback() {
    var out = {};
    Object.keys(TOKEN_KEYS).forEach(function (key) {
      out[key] = readToken(TOKEN_KEYS[key]);
    });
    return out;
  }

  function onThemeFallback(fn) {
    if (typeof fn !== 'function') return function () {};
    function run() {
      fn({ theme: global.document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light', colors: colorsFallback() });
    }
    run();
    window.addEventListener('themechange', run);
    return function () { window.removeEventListener('themechange', run); };
  }

  var core = global.postViz || {};
  var colors = core.colors || colorsFallback;
  var onTheme = core.onTheme || onThemeFallback;
  var width = core.width || function (el) { return el ? el.clientWidth : 0; };
  var debounce = core.debounce || function (fn, ms) {
    var timer;
    return function () {
      clearTimeout(timer);
      timer = setTimeout(fn.bind.apply(fn, [null].concat(Array.prototype.slice.call(arguments))), ms || 120);
    };
  };
  var resolveMount = core.resolveMount || function (mount) {
    if (!mount) return null;
    if (typeof mount === 'string') return document.querySelector(mount);
    return mount.nodeType === 1 ? mount : null;
  };

  var ROW_SLOT = 32;
  var BAR_THICKNESS = 2;

  function parseStart(s) {
    if (!s || s === 'undated') return null;
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return new Date(s + 'T12:00:00');
    if (/^\d{4}-\d{2}$/.test(s)) return new Date(s + '-01T12:00:00');
    if (/^\d{4}$/.test(s)) return new Date(s + '-01-01T12:00:00');
    return new Date(s);
  }

  function parseEnd(s, now) {
    if (!s || s === 'Present') return now;
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return new Date(s + 'T12:00:00');
    if (/^\d{4}-\d{2}$/.test(s)) return new Date(s + '-01T12:00:00');
    if (/^\d{4}$/.test(s)) return new Date(s + '-12-31T12:00:00');
    return new Date(s);
  }

  function parseEventDate(s) {
    if (!s) return null;
    s = String(s).trim();
    var qmatch = /^(\d{4})-Q([1-4])$/i.exec(s);
    if (qmatch) {
      var qMonth = { 1: '02', 2: '05', 3: '08', 4: '11' };
      return new Date(qmatch[1] + '-' + qMonth[qmatch[2]] + '-15T12:00:00');
    }
    if (/^\d{4}-\d{2}\/\d{2}$/.test(s)) {
      return new Date(s.split('/')[0] + '-15T12:00:00');
    }
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return new Date(s + 'T12:00:00');
    if (/^\d{4}-\d{2}$/.test(s)) return new Date(s + '-15T12:00:00');
    if (/^\d{4}$/.test(s)) return new Date(s + '-07-01T12:00:00');
    var d = new Date(s);
    return isNaN(d.getTime()) ? null : d;
  }

  function laneKey(status) {
    if (/distressed|inactive/i.test(status)) return 'ended';
    if (/thin|pivot/i.test(status)) return 'uncertain';
    return 'running';
  }

  function barPaint(lane, palette) {
    if (lane === 'ended') {
      return {
        fill: palette.bad,
        fillOpacity: 0.42,
        stroke: 'none',
        dash: null,
        cap: palette.bad
      };
    }
    if (lane === 'uncertain') {
      return {
        fill: palette.wip,
        fillOpacity: 0.38,
        stroke: palette.wip,
        strokeOpacity: 0.9,
        dash: '3 2',
        cap: palette.wip
      };
    }
    return {
      fill: palette.accent,
      fillOpacity: 0.48,
      stroke: 'none',
      dash: null,
      cap: palette.accent
    };
  }

  function clipNote(s, max) {
    if (!s) return '';
    return s.length > max ? s.slice(0, max - 1) + '\u2026' : s;
  }

  function labelText(name, maxLen) {
    return name.length > maxLen ? name.slice(0, maxLen - 1) + '\u2026' : name;
  }

  function formatSpan(row) {
    var end = row.end_date === 'Present' ? 'present' : row.end_date;
    return row.founded_start + ' \u2192 ' + end;
  }

  function labelWidthFor(chartW, override) {
    if (override) return override;
    if (chartW < 400) return 104;
    if (chartW < 560) return 148;
    return 200;
  }

  function labelMaxFor(chartW) {
    if (chartW < 400) return 14;
    if (chartW < 560) return 20;
    return 28;
  }

  function buildYearTicks(startY, endY, step) {
    var first = Math.ceil(startY / step) * step;
    var ticks = [];
    for (var y = first; y <= endY; y += step) {
      ticks.push(new Date(y, 0, 1, 12, 0, 0));
    }
    return ticks;
  }

  /** Finest year step that keeps ≥40px between labels (max tick count that still fits). */
  function ganttYearTickValues(innerW, domainStart, domainEnd) {
    var minLabelPx = 40;
    var startY = domainStart.getFullYear();
    var endY = domainEnd.getFullYear();
    var steps = [1, 2, 3, 5, 10, 15, 20, 25];
    var best = null;
    var bestLen = 0;
    for (var i = 0; i < steps.length; i++) {
      var step = steps[i];
      var ticks = buildYearTicks(startY, endY, step);
      if (ticks.length < 2) continue;
      var gapPx = innerW / (ticks.length - 1);
      if (gapPx < minLabelPx) continue;
      if (ticks.length >= bestLen) {
        best = ticks;
        bestLen = ticks.length;
      }
    }
    if (!best) {
      best = [
        new Date(startY, 0, 1, 12, 0, 0),
        new Date(endY, 0, 1, 12, 0, 0)
      ];
    }
    return best;
  }

  function styleYearAxis(sel, palette, lineOpacity) {
    var opacity = lineOpacity == null ? 0.45 : lineOpacity;
    sel.selectAll('text')
      .attr('fill', palette.muted)
      .style('font-size', '12px')
      .style('font-style', 'italic')
      .style('font-family', 'mono, "IBM Plex Mono", monospace');
    sel.selectAll('.tick line')
      .attr('stroke', palette.border)
      .attr('stroke-opacity', opacity);
    sel.select('path.domain')
      .attr('stroke', palette.border)
      .attr('stroke-opacity', opacity + 0.05);
    sel.selectAll('.tick text')
      .attr('text-anchor', function (_d, i, nodes) {
        if (i === 0) return 'start';
        if (i === nodes.length - 1) return 'end';
        return 'middle';
      })
      .attr('dx', function (_d, i, nodes) {
        if (i === 0) return 2;
        if (i === nodes.length - 1) return -2;
        return 0;
      });
  }

  function fillTip(tip, d) {
    tip.replaceChildren();
    var title = document.createElement('p');
    title.className = 'd3-gantt-tip__title';
    title.textContent = d.entity;
    tip.appendChild(title);

    var span = document.createElement('p');
    span.className = 'd3-gantt-tip__span';
    span.textContent = formatSpan(d);
    tip.appendChild(span);

    var status = document.createElement('p');
    status.className = 'd3-gantt-tip__status';
    status.textContent = d.status;
    tip.appendChild(status);

    if (d.model_notes) {
      var body = document.createElement('p');
      body.className = 'd3-gantt-tip__body';
      body.textContent = clipNote(d.model_notes, 160);
      tip.appendChild(body);
    }
  }

  function chartWrap(root) {
    return root.closest('.post-gantt');
  }

  function isGanttChart(root, opts) {
    return !!(opts && opts.gantt) || !!root.closest('.post-gantt');
  }

  /** Horizontal interval (Gantt) chart for blog posts. */
  function renderGantt(mount, rows, options) {
    var root = resolveMount(mount);
    if (!root || !global.d3 || !rows || !rows.length) return function () {};

    var opts = options || {};
    var now = opts.now ? new Date(opts.now) : new Date();
    var wrapEl = chartWrap(root);
    var rowSlot = (wrapEl && parseInt(wrapEl.getAttribute('data-row-slot'), 10)) || opts.rowSlot || ROW_SLOT;
    var gantt = isGanttChart(root, opts);
    var barThickness = opts.barThickness || BAR_THICKNESS;

    var data = rows
      .filter(function (d) { return d.founded_start !== 'undated'; })
      .slice();
    if (!opts.preserveOrder) {
      data.sort(function (a, b) {
        var as = parseStart(a.founded_start);
        var bs = parseStart(b.founded_start);
        return as - bs || String(a.entity).localeCompare(b.entity);
      });
    }

    if (!data.length) return function () {};

    var paper = !!opts.paper || gantt;

    function useExternalLabels() {
      if (typeof opts.externalLabels === 'function') return !!opts.externalLabels();
      if (typeof opts.externalLabels === 'boolean') return opts.externalLabels;
      return gantt;
    }
    if (gantt) root.classList.add('d3-figure__mount--gantt');
    if (paper) root.classList.add('post-gantt__plot--active');
    root.setAttribute('role', 'group');
    root.removeAttribute('aria-label');

    var figure = root.closest('figure.d3-figure');
    var cap = figure && figure.querySelector('figcaption[id]');
    var notesId = (root.id || 'd3-gantt') + '-notes';
    var notesEl = document.getElementById(notesId);
    var describedBy = [];
    if (cap) {
      root.setAttribute('aria-labelledby', cap.id);
    }
    if (notesEl) {
      describedBy.push(notesId);
    }
    if (figure && gantt) {
      var keyEl = figure.querySelector('.post-gantt__key[id]');
      if (!keyEl) keyEl = document.getElementById('ck-gantt-key');
      if (keyEl) describedBy.push(keyEl.id);
    }
    if (describedBy.length) {
      root.setAttribute('aria-describedby', describedBy.join(' '));
    }

    var tip = document.createElement('div');
    tip.className = 'd3-gantt-tip' + (paper ? ' d3-gantt-tip--paper' : '');
    tip.setAttribute('id', (root.id || 'd3-gantt') + '-tip');
    tip.hidden = true;

    var activeEntity = null;

    function showTipPointer(event, d) {
      fillTip(tip, d);
      tip.hidden = false;
      tip.setAttribute('role', 'tooltip');
      moveTipPointer(event);
    }

    function showTipAnchored(d, anchorEl) {
      fillTip(tip, d);
      tip.hidden = false;
      tip.setAttribute('role', 'tooltip');
      if (!anchorEl) return;
      var rootRect = root.getBoundingClientRect();
      var anchorRect = anchorEl.getBoundingClientRect();
      var x = anchorRect.left - rootRect.left + 8;
      var y = anchorRect.bottom - rootRect.top + 6;
      placeTip(x, y, { width: root.clientWidth, height: root.clientHeight });
    }

    function moveTipPointer(event) {
      var rect = root.getBoundingClientRect();
      var x = event.clientX - rect.left + 12;
      var y = event.clientY - rect.top + 12;
      placeTip(x, y, rect);
    }

    function placeTip(x, y, rect) {
      var maxX = rect.width - tip.offsetWidth - 8;
      var maxY = rect.height - tip.offsetHeight - 8;
      tip.style.left = Math.max(8, Math.min(x, maxX)) + 'px';
      tip.style.top = Math.max(8, Math.min(y, maxY)) + 'px';
    }

    function nameRows() {
      var wrap = chartWrap(root);
      if (!wrap) return [];
      return wrap.querySelectorAll('.post-gantt__label-row');
    }

    function hideTip() {
      tip.hidden = true;
      tip.removeAttribute('role');
      activeEntity = null;
      root.querySelectorAll('.d3-gantt-row.is-active').forEach(function (node) {
        node.classList.remove('is-active');
      });
      nameRows().forEach(function (node) {
        node.classList.remove('is-active');
        node.removeAttribute('aria-describedby');
      });
    }

    function setActive(entity) {
      activeEntity = entity;
      root.querySelectorAll('.d3-gantt-row').forEach(function (node) {
        var on = node.getAttribute('data-entity') === entity;
        node.classList.toggle('is-active', on);
        var bar = node.querySelector('.d3-gantt-bar');
        if (bar) bar.classList.toggle('is-active', on);
      });
      root.querySelectorAll('.d3-gantt-label').forEach(function (node) {
        node.classList.toggle('is-active', node.getAttribute('data-entity') === entity);
      });
      nameRows().forEach(function (node) {
        var on = node.getAttribute('data-entity') === entity;
        node.classList.toggle('is-active', on);
        if (on && tip.id) {
          node.setAttribute('aria-describedby', tip.id);
        } else {
          node.removeAttribute('aria-describedby');
        }
      });
    }

    var nameRowsBound = false;

    function bindNameRowEvents() {
      var hasLabels = nameRows().length > 0;
      if (nameRowsBound || !hasLabels || (!gantt && !useExternalLabels())) return;
      nameRowsBound = true;
      var byEntity = {};
      data.forEach(function (d) { byEntity[d.entity] = d; });
      var rowsList = Array.prototype.slice.call(nameRows());

      function rowIndex(row) {
        return rowsList.indexOf(row);
      }

      function activateFromRow(row, event) {
        var entity = row.getAttribute('data-entity');
        var d = byEntity[entity];
        if (!d) return;
        setActive(entity);
        if (event && event.clientX) {
          showTipPointer(event, d);
        } else {
          showTipAnchored(d, row);
        }
      }

      rowsList.forEach(function (row) {
        var entity = row.getAttribute('data-entity');
        var d = byEntity[entity];
        if (!d) return;
        row.addEventListener('mouseenter', function (event) {
          activateFromRow(row, event);
        });
        row.addEventListener('mousemove', moveTipPointer);
        row.addEventListener('mouseleave', function () {
          if (row.contains(document.activeElement)) return;
          hideTip();
        });
        row.addEventListener('focus', function () {
          activateFromRow(row, null);
        });
        row.addEventListener('blur', function (event) {
          if (event.relatedTarget && tip.contains(event.relatedTarget)) return;
          hideTip();
        });
        row.addEventListener('keydown', function (event) {
          var idx = rowIndex(row);
          if (event.key === 'Escape') {
            hideTip();
            row.blur();
            return;
          }
          if (event.key === 'ArrowDown' && idx < rowsList.length - 1) {
            event.preventDefault();
            rowsList[idx + 1].focus();
            return;
          }
          if (event.key === 'ArrowUp' && idx > 0) {
            event.preventDefault();
            rowsList[idx - 1].focus();
            return;
          }
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            activateFromRow(row, null);
          }
        });
      });

    }

    function draw() {
      var palette = colors();
      var chartW = width(root) || 640;
      var externalLabels = useExternalLabels();
      var labelW = externalLabels ? 0 : labelWidthFor(chartW, opts.labelWidth);
      var labelMax = externalLabels ? 0 : labelMaxFor(chartW);
      var fixedRows = externalLabels || paper;
      var margin = {
        top: fixedRows ? 0 : 12,
        right: paper ? 4 : 16,
        bottom: gantt ? 20 : (paper ? 22 : 30),
        left: externalLabels ? 0 : labelW
      };
      var innerW = Math.max(chartW - margin.left - margin.right, 120);
      var innerH = data.length * rowSlot;
      var height = margin.top + innerH + margin.bottom;

      var domainStart = global.d3.min(data, function (d) {
        return parseStart(d.founded_start);
      });
      var domainEnd = global.d3.max(data, function (d) {
        return parseEnd(d.end_date, now);
      });
      domainStart = global.d3.timeYear.offset(global.d3.timeYear.floor(domainStart), gantt ? -1 : (paper ? -1 : -2));
      domainEnd = global.d3.timeYear.offset(global.d3.timeYear.ceil(domainEnd), gantt ? 1 : (paper ? 1 : 2));

      root.replaceChildren();
      root.appendChild(tip);

      var svg = global.d3.select(root)
        .append('svg')
        .attr('class', 'd3-gantt-chart')
        .attr('viewBox', '0 0 ' + chartW + ' ' + height)
        .attr('role', 'presentation');

      var g = svg.append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

      var x = global.d3.scaleTime()
        .domain([domainStart, domainEnd])
        .range([0, innerW]);

      function rowCenter(index) {
        return index * rowSlot + rowSlot / 2;
      }

      var barH = barThickness;
      var tickCount = chartW < 480 ? 4 : 6;
      var yearTicks = gantt ? ganttYearTickValues(innerW, domainStart, domainEnd) : null;

      if (gantt) {
        g.append('line')
          .attr('class', 'd3-gantt-now')
          .attr('pointer-events', 'none')
          .attr('x1', x(now))
          .attr('x2', x(now))
          .attr('y1', 0)
          .attr('y2', innerH)
          .attr('stroke', palette.accent)
          .attr('stroke-opacity', 0.35)
          .attr('stroke-width', 1)
          .attr('stroke-dasharray', '3 4');
      }

      if (!paper) {
        g.append('g')
          .attr('class', 'd3-gantt-grid')
          .selectAll('line')
          .data(x.ticks(tickCount))
          .join('line')
          .attr('x1', function (d) { return x(d); })
          .attr('x2', function (d) { return x(d); })
          .attr('y1', innerH - 8)
          .attr('y2', innerH)
          .attr('stroke', palette.border)
          .attr('stroke-opacity', 0.55);
      }

      var xAxis = global.d3.axisBottom(x)
        .tickFormat(global.d3.timeFormat('%Y'))
        .tickSize(gantt ? 4 : 0)
        .tickSizeOuter(0);
      if (gantt) xAxis.tickValues(yearTicks);
      else xAxis.ticks(tickCount);

      g.append('g')
        .attr('class', 'd3-gantt-axis')
        .attr('transform', 'translate(0,' + innerH + ')')
        .call(xAxis)
        .call(function (sel) {
          if (gantt) styleYearAxis(sel, palette, 0.45);
          else {
            sel.selectAll('text')
              .attr('fill', palette.muted)
              .style('font-size', '12px')
              .style('font-style', 'italic')
              .style('font-family', 'mono, "IBM Plex Mono", monospace');
            sel.selectAll('line').attr('stroke', palette.border).attr('stroke-opacity', paper ? 0.35 : 0.4);
            sel.select('path').attr('stroke', paper ? palette.border : 'none').attr('stroke-opacity', 0.35);
          }
        });

      g.selectAll('.d3-gantt-row')
        .data(data)
        .join('g')
        .attr('class', 'd3-gantt-row')
        .attr('data-entity', function (d) { return d.entity; })
        .attr('transform', function (d, i) {
          return 'translate(0,' + rowCenter(i) + ')';
        })
        .each(function (d) {
          var el = global.d3.select(this);
          var x0 = x(parseStart(d.founded_start));
          var x1 = x(parseEnd(d.end_date, now));
          var paint = barPaint(laneKey(d.status), palette);
          var stillRunning = d.end_date === 'Present';
          var barW = Math.max(x1 - x0, gantt ? 2 : 4);
          var hitPad = (rowSlot - barH) / 2;
          var strokeW = gantt ? 2 : barH;

          if (gantt) {
            el.append('line')
              .attr('class', 'd3-gantt-start')
              .attr('pointer-events', 'none')
              .attr('x1', x0)
              .attr('x2', x0)
              .attr('y1', -4)
              .attr('y2', 4)
              .attr('stroke', paint.cap)
              .attr('stroke-opacity', 0.85)
              .attr('stroke-width', 1);

            el.append('line')
              .attr('class', 'd3-gantt-bar')
              .attr('x1', x0)
              .attr('x2', x1)
              .attr('y1', 0)
              .attr('y2', 0)
              .attr('stroke', paint.fill)
              .attr('stroke-opacity', paint.fillOpacity + (laneKey(d.status) === 'running' ? 0.35 : 0.15))
              .attr('stroke-width', strokeW)
              .attr('stroke-linecap', 'round')
              .attr('stroke-dasharray', paint.dash || null);

            if (stillRunning) {
              el.append('circle')
                .attr('class', 'd3-gantt-end')
                .attr('cx', x1)
                .attr('cy', 0)
                .attr('r', 2.25)
                .attr('fill', palette.paper)
                .attr('stroke', paint.cap)
                .attr('stroke-width', 1.25);
            } else {
              el.append('line')
                .attr('class', 'd3-gantt-end')
                .attr('pointer-events', 'none')
                .attr('x1', x1)
                .attr('x2', x1)
                .attr('y1', -4)
                .attr('y2', 4)
                .attr('stroke', paint.cap)
                .attr('stroke-opacity', 0.85)
                .attr('stroke-width', 1);
            }
          } else {
            var bar = el.append('rect')
              .attr('class', 'd3-gantt-bar')
              .attr('x', x0)
              .attr('y', -barH / 2)
              .attr('width', barW)
              .attr('height', barH)
              .attr('rx', 2)
              .attr('fill', paint.fill)
              .attr('fill-opacity', paint.fillOpacity);

            if (paint.stroke && paint.stroke !== 'none') {
              bar
                .attr('stroke', paint.stroke)
                .attr('stroke-opacity', paint.strokeOpacity || 1)
                .attr('stroke-width', 1)
                .attr('stroke-dasharray', paint.dash || null);
            }

            if (stillRunning) {
              el.append('circle')
                .attr('class', 'd3-gantt-end')
                .attr('cx', x1)
                .attr('cy', 0)
                .attr('r', 2.5)
                .attr('fill', paper ? palette.paper : palette.codeBg)
                .attr('stroke', paint.cap)
                .attr('stroke-width', paper ? 1.25 : 1.5);
            }
          }

          var minHitW = window.matchMedia('(pointer: coarse)').matches ? 22 : 16;
          var hitW = Math.max(barW, minHitW);
          var hitX = barW < hitW ? x0 - (hitW - barW) / 2 : x0;
          var hit = el.append('rect')
            .attr('class', 'd3-gantt-hit')
            .attr('x', hitX)
            .attr('y', -hitPad - 2)
            .attr('width', hitW)
            .attr('height', rowSlot)
            .attr('fill', 'transparent')
            .on('mouseenter', function (event) {
              setActive(d.entity);
              showTipPointer(event, d);
            })
            .on('mousemove', moveTipPointer)
            .on('mouseleave', hideTip);

          if (gantt && !externalLabels) {
            hit
              .attr('tabindex', 0)
              .on('focus', function () {
                setActive(d.entity);
                showTipAnchored(d, hit.node());
              })
              .on('blur', hideTip);
          }
        });

      if (labelW > 0 && labelMax > 0) {
        svg.append('g')
          .attr('class', 'd3-gantt-labels')
          .attr('aria-hidden', 'true')
          .selectAll('text')
          .data(data)
          .join('text')
          .attr('class', 'd3-gantt-label')
          .attr('data-entity', function (d) { return d.entity; })
          .attr('x', margin.left - 8)
          .attr('y', function (d, i) { return margin.top + rowCenter(i); })
          .attr('dy', '0.32em')
          .attr('text-anchor', 'end')
          .attr('fill', palette.muted)
          .style('font-size', '12px')
          .text(function (d) { return labelText(d.entity, labelMax); });
      }

      if (activeEntity) {
        setActive(activeEntity);
      }
      bindNameRowEvents();
    }

    var offTheme = onTheme(draw);
    var onResize = debounce(draw, 120);
    window.addEventListener('resize', onResize);

    return function destroy() {
      offTheme();
      window.removeEventListener('resize', onResize);
      nameRowsBound = false;
      root.classList.remove('d3-figure__mount--gantt', 'post-gantt__plot--active');
      root.removeAttribute('aria-labelledby');
      root.removeAttribute('aria-describedby');
      root.replaceChildren();
    };
  }

  function classifyEventKind(row) {
    if (row.event_kind) return row.event_kind;
    var fm = (row.facility_model || '').trim();
    if (fm === 'A' || fm === 'B' || fm === 'A*' || fm === 'HOLD') return 'kitchen';
    var head = ((row.event || '') + ' ' + (row.entity || '')).toLowerCase();
    var blob = head + ' ' + (row.notes || '').toLowerCase();
    var launchish = /\blaunch|go-live|go live|site launch|mobile app|app store|pilot launch|service launch|first release|instant grocery|market launch|delivery launch|founded|early online restaurant ordering\b/;
    var milestoneish = /\bacquir|dissolves|exit|protest|funding|\$250m|upheld|wind-down|distress signal|rebrand|rename|css →|chick-fil-a\b/;
    if (milestoneish.test(head) || (milestoneish.test(blob) && !launchish.test(head))) return 'milestone';
    if (launchish.test(head)) return 'app';
    if (launchish.test(blob)) return 'app';
    return 'milestone';
  }

  function eventKindLabel(kind) {
    if (kind === 'app') return 'app / platform go-live';
    if (kind === 'kitchen') return 'cloud kitchen / facility';
    return 'milestone';
  }

  function fillEventTip(tip, row) {
    tip.replaceChildren();
    var title = document.createElement('div');
    title.className = 'd3-gantt-tip__title';
    title.textContent = row.event;
    tip.appendChild(title);
    var meta = document.createElement('div');
    meta.className = 'd3-gantt-tip__span';
    var kind = classifyEventKind(row);
    meta.textContent = row.date + ' · ' + row.region + ' · ' + eventKindLabel(kind) + (row.facility_model ? ' · model ' + row.facility_model : '');
    tip.appendChild(meta);
    if (row.entity) {
      var ent = document.createElement('div');
      ent.className = 'd3-gantt-tip__status';
      ent.textContent = row.entity;
      tip.appendChild(ent);
    }
    if (row.notes) {
      var body = document.createElement('div');
      body.className = 'd3-gantt-tip__body';
      body.textContent = clipNote(row.notes, 220);
      tip.appendChild(body);
    }
    if (row.source_url) {
      var link = document.createElement('a');
      link.className = 'd3-gantt-tip__note';
      link.href = row.source_url;
      link.rel = 'noopener noreferrer';
      link.target = '_blank';
      link.textContent = 'source';
      tip.appendChild(link);
    }
  }

  /** Four swimlanes: TR/US × app launches vs cloud-kitchen / milestones. */
  function renderEventLanes(mount, rows, options) {
    var root = resolveMount(mount);
    if (!root || !global.d3 || !rows || !rows.length) return function () {};

    var opts = options || {};
    var now = opts.now ? new Date(opts.now) : new Date();
    var laneOrder = ['TR-app', 'TR-ops', 'US-app', 'US-ops'];
    var laneSlot = 34;

    var data = rows
      .map(function (d) {
        var when = parseEventDate(d.date);
        if (!when) return null;
        var kind = classifyEventKind(d);
        return Object.assign({}, d, { when: when, kind: kind });
      })
      .filter(Boolean);
    if (!data.length) return function () {};

    root.classList.add('d3-figure__mount--event-lanes', 'post-event-lanes__plot--active');
    root.setAttribute('role', 'group');

    var figure = root.closest('figure');
    var cap = figure && figure.querySelector('figcaption[id]');
    var keyEl = figure && figure.querySelector('.post-event-lanes__key[id]');
    if (cap) root.setAttribute('aria-labelledby', cap.id);
    if (keyEl) root.setAttribute('aria-describedby', keyEl.id);

    var tip = document.createElement('div');
    tip.className = 'd3-gantt-tip d3-gantt-tip--paper';
    tip.hidden = true;

    function laneIndexFor(d) {
      var region = String(d.region || '').toUpperCase();
      var lane = region === 'TR' ? 'TR' : 'US';
      return laneOrder.indexOf(lane + (d.kind === 'app' ? '-app' : '-ops'));
    }

    function regionInk(region, palette) {
      return String(region).toUpperCase() === 'TR' ? palette.accent : palette.wip;
    }

    function draw() {
      var palette = colors();
      var chartW = width(root) || 640;
      var margin = { top: 4, right: 10, bottom: 24, left: 2 };
      var innerW = Math.max(chartW - margin.left - margin.right, 120);
      var innerH = laneOrder.length * laneSlot;
      var height = margin.top + innerH + margin.bottom;

      var domainStart = global.d3.min(data, function (d) { return d.when; });
      var domainEnd = global.d3.max(data, function (d) { return d.when; });
      domainStart = global.d3.timeYear.offset(global.d3.timeYear.floor(domainStart), -1);
      domainEnd = global.d3.max([global.d3.timeYear.offset(global.d3.timeYear.ceil(domainEnd), 1), now]);

      var jitterKey = {};
      data.forEach(function (d) {
        var k = d.date + '|' + d.region + '|' + laneIndexFor(d);
        jitterKey[k] = (jitterKey[k] || 0) + 1;
        d._jitter = jitterKey[k] - 1;
      });

      root.replaceChildren();
      root.appendChild(tip);

      var svg = global.d3.select(root)
        .append('svg')
        .attr('class', 'd3-event-lanes-chart')
        .attr('viewBox', '0 0 ' + chartW + ' ' + height)
        .attr('role', 'presentation');

      var g = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

      var x = global.d3.scaleTime().domain([domainStart, domainEnd]).range([0, innerW]);

      function laneCenter(idx) {
        return idx * laneSlot + laneSlot / 2;
      }

      function eventX(d) {
        return x(d.when) + (d._jitter ? d._jitter * 7 : 0);
      }

      var coarsePointer = window.matchMedia('(pointer: coarse)').matches;
      var eventHitR = coarsePointer ? 18 : 13;

      function bindEventHit(sel) {
        sel
          .attr('class', 'd3-event-lane-hit')
          .attr('tabindex', 0)
          .attr('role', 'button')
          .attr('aria-label', function (d) {
            return d.date + ', ' + d.region + ', ' + eventKindLabel(d.kind) + ', ' + d.event;
          })
          .on('focus', function (event, d) {
            fillEventTip(tip, d);
            tip.hidden = false;
            var rect = event.target.getBoundingClientRect();
            var rootRect = root.getBoundingClientRect();
            placeEventTip(rect.left - rootRect.left + 8, rect.bottom - rootRect.top + 6, root);
          })
          .on('blur', function () { tip.hidden = true; })
          .on('mouseenter', function (event, d) {
            fillEventTip(tip, d);
            tip.hidden = false;
            moveEventTip(event);
          })
          .on('mousemove', moveEventTip)
          .on('mouseleave', function () { tip.hidden = true; });
      }

      function drawEventGlyph(parent, d, cx, cy, palette) {
        parent.selectAll('.d3-event-lane-glyph').remove();
        var glyph = parent.append('g').attr('class', 'd3-event-lane-glyph').attr('pointer-events', 'none');
        if (d.kind === 'app') {
          glyph.append('circle')
            .attr('cx', cx)
            .attr('cy', cy)
            .attr('r', 5.5)
            .attr('fill', regionInk(d.region, palette))
            .attr('fill-opacity', 0.82)
            .attr('stroke', palette.paper)
            .attr('stroke-width', 1.25);
        } else if (d.kind === 'kitchen') {
          glyph.append('line')
            .attr('x1', cx)
            .attr('x2', cx)
            .attr('y1', cy - 7)
            .attr('y2', cy + 7)
            .attr('stroke', regionInk(d.region, palette))
            .attr('stroke-opacity', 0.9)
            .attr('stroke-width', 2.5)
            .attr('stroke-linecap', 'round');
        } else {
          var r = 5;
          glyph.append('path')
            .attr('d', 'M' + cx + ',' + (cy - r) + ' L' + (cx + r) + ',' + cy + ' L' + cx + ',' + (cy + r) + ' L' + (cx - r) + ',' + cy + 'Z')
            .attr('fill', 'none')
            .attr('stroke', palette.muted)
            .attr('stroke-opacity', 0.85)
            .attr('stroke-width', 1.5);
        }
      }

      g.append('line')
        .attr('class', 'd3-gantt-now')
        .attr('pointer-events', 'none')
        .attr('x1', x(now))
        .attr('x2', x(now))
        .attr('y1', 0)
        .attr('y2', innerH)
        .attr('stroke', palette.accent)
        .attr('stroke-opacity', 0.35)
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '3 4');

      laneOrder.forEach(function (_lane, idx) {
        g.append('line')
          .attr('pointer-events', 'none')
          .attr('x1', 0)
          .attr('x2', innerW)
          .attr('y1', laneCenter(idx))
          .attr('y2', laneCenter(idx))
          .attr('stroke', palette.border)
          .attr('stroke-opacity', idx % 2 === 0 ? 0.28 : 0.42);
      });

      var yearTicks = ganttYearTickValues(innerW, domainStart, domainEnd);
      var xAxis = global.d3.axisBottom(x)
        .tickFormat(global.d3.timeFormat('%Y'))
        .tickSize(4)
        .tickSizeOuter(0)
        .tickValues(yearTicks);

      g.append('g')
        .attr('class', 'd3-gantt-axis')
        .attr('transform', 'translate(0,' + innerH + ')')
        .call(xAxis)
        .call(function (sel) { styleYearAxis(sel, palette, 0.45); });

      g.selectAll('.d3-event-lane-item')
        .data(data, function (d) {
          return d.date + '|' + d.region + '|' + d.event;
        })
        .join('g')
        .attr('class', function (d) {
          return 'd3-event-lane-item d3-event-lane-item--' + d.kind;
        })
        .each(function (d) {
          var item = global.d3.select(this);
          var cx = eventX(d);
          var cy = laneCenter(laneIndexFor(d));
          item.selectAll('*').remove();
          drawEventGlyph(item, d, cx, cy, palette);
          bindEventHit(
            item.append('circle')
              .attr('cx', cx)
              .attr('cy', cy)
              .attr('r', eventHitR)
              .attr('fill', 'transparent')
          );
        });

      function moveEventTip(event) {
        var rect = root.getBoundingClientRect();
        placeEventTip(event.clientX - rect.left + 12, event.clientY - rect.top + 12, root);
      }

      function placeEventTip(xPos, yPos, el) {
        var maxX = el.clientWidth - tip.offsetWidth - 8;
        var maxY = el.clientHeight - tip.offsetHeight - 8;
        tip.style.left = Math.max(8, Math.min(xPos, maxX)) + 'px';
        tip.style.top = Math.max(8, Math.min(yPos, maxY)) + 'px';
      }
    }

    var offTheme = onTheme(draw);
    var onResize = debounce(draw, 120);
    window.addEventListener('resize', onResize);

    return function destroy() {
      offTheme();
      window.removeEventListener('resize', onResize);
      root.classList.remove('d3-figure__mount--event-lanes', 'post-event-lanes__plot--active');
      root.replaceChildren();
    };
  }

  function eventLanes(mount, rows, options) {
    return renderEventLanes(mount, rows, options || {});
  }

  function gantt(mount, rows, options) {
    var opts = Object.assign({ gantt: true, paper: true }, options || {});
    if (opts.preserveOrder === undefined) opts.preserveOrder = true;
    if (opts.externalLabels === undefined) {
      opts.externalLabels = function () {
        var el = resolveMount(mount);
        var wrap = el && chartWrap(el);
        return !!(wrap && wrap.querySelector('.post-gantt__label-row'));
      };
    }
    return renderGantt(mount, rows, opts);
  }

  global.postD3 = {
    colors: colors,
    onTheme: onTheme,
    width: width,
    theme: core.theme || function () { return 'light'; },
    gantt: gantt,
    eventLanes: eventLanes
  };

  global.postViz = global.postViz || {};
  global.postViz.gantt = gantt;
  global.postViz.eventLanes = eventLanes;
  global.postViz.colors = colors;
  global.postViz.onTheme = onTheme;
  global.postViz.width = width;
})(window);
