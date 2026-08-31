(function () {
  const list = document.getElementById("album-list");
  if (!list || !window.GuybrushLines) return;

  const DEFAULT_SPRITE = {
    stand: { file: "guybrush-stand.png", frameWidth: 23, frameHeight: 47, frameCount: 1, fps: 1 },
    walk: { file: "guybrush-walk.png", frameWidth: 34, frameHeight: 49, frameCount: 6, fps: 3 },
  };

  const SPEAK_MS = 6500;
  const WANDER_MIN_MS = 7000;
  const WANDER_MAX_MS = 16000;
  const WALK_SPEED = 95;
  const DRAG_THRESHOLD = 6;
  const DROP_QUIP_MS = 2400;
  const WANDER_AFTER_DROP_MS = 5000;
  const SCALE_MOBILE = 1.15;
  const SCALE_DESKTOP = 1.4;
  const MOBILE_QUERY = "(max-width: 480px)";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const spriteBase = list.dataset.guybrushBase || "/assets/sprites/";
  const configUrl = list.dataset.guybrushConfig || spriteBase + "guybrush.json";

  let SPRITE = DEFAULT_SPRITE;

  const root = document.createElement("div");
  root.className = "guybrush";
  root.setAttribute("role", "presentation");
  root.innerHTML =
    '<button type="button" class="guybrush__hit" aria-grabbed="false" aria-label="Talk to Guybrush. Click for a quip. Drag with pointer to move him."></button>' +
    '<div class="guybrush__sprite" aria-hidden="true"></div>' +
    '<div class="guybrush__bubble" hidden aria-live="polite">' +
    '<p class="guybrush__line"></p>' +
    "</div>";
  document.body.appendChild(root);

  const hitEl = root.querySelector(".guybrush__hit");
  const spriteEl = root.querySelector(".guybrush__sprite");
  const bubbleEl = root.querySelector(".guybrush__bubble");
  const lineEl = root.querySelector(".guybrush__line");

  let scale = window.matchMedia(MOBILE_QUERY).matches ? SCALE_MOBILE : SCALE_DESKTOP;
  let x = 24;
  let y = 0;
  let targetX = 0;
  let targetY = 0;
  let facing = 1;
  let mode = "stand";
  let frameIndex = 0;
  let frameTimer = 0;
  let wanderTimer = 0;
  let speakTimer = 0;
  let running = false;
  let ticking = false;
  let rafId = 0;
  let lastTs = 0;
  let isMoving = false;
  let resizeTimer = 0;
  let configLoaded = false;
  let activeRow = null;
  let anchor = null;
  let intentRow = null;
  let scrollRaf = 0;
  let layoutRaf = 0;
  let rowObserver = null;
  let layoutObserver = null;

  let onArrive = null;
  let isDragging = false;
  let dragPending = false;
  let dragPointerId = null;
  let dragStartClientX = 0;
  let dragStartClientY = 0;
  let dragOffsetX = 0;
  let dragOffsetY = 0;
  let scrollBound = false;

  function spriteConfig(kind) {
    return SPRITE[kind || mode] || SPRITE.stand;
  }

  function pauseAutomation() {
    clearTimers();
    hideBubble();
    releaseAnchor();
    intentRow = null;
    onArrive = null;
    stopTicking();
    isMoving = false;
    root.classList.remove("is-busy");
    setMode("stand");
  }

  function setDragging(active) {
    isDragging = active;
    root.classList.toggle("is-dragging", active);
    hitEl.setAttribute("aria-grabbed", active ? "true" : "false");
  }

  function beginDrag(pointerEvent) {
    if (isDragging) return;

    pauseAutomation();
    setDragging(true);
    dragPointerId = pointerEvent.pointerId;
    dragOffsetX = pointerEvent.clientX - x;
    dragOffsetY = pointerEvent.clientY - y;

    try {
      hitEl.setPointerCapture(pointerEvent.pointerId);
    } catch (err) {
      /* ignore capture failures */
    }
  }

  function moveDrag(pointerEvent) {
    const point = clampPoint({
      x: pointerEvent.clientX - dragOffsetX,
      y: pointerEvent.clientY - dragOffsetY,
    });
    x = point.x;
    y = point.y;
    renderPosition();
  }

  function cancelDrag() {
    dragPending = false;
    setDragging(false);
    if (dragPointerId !== null) {
      try {
        hitEl.releasePointerCapture(dragPointerId);
      } catch (err) {
        /* ignore release failures */
      }
    }
    dragPointerId = null;
  }

  function finishDrag(didDrag) {
    if (!isDragging && !dragPending) return;

    dragPending = false;
    setDragging(false);

    if (dragPointerId !== null) {
      try {
        hitEl.releasePointerCapture(dragPointerId);
      } catch (err) {
        /* ignore release failures */
      }
    }
    dragPointerId = null;

    if (!running) return;

    if (didDrag) {
      showBubble(GuybrushLines.drag());
      speakTimer = window.setTimeout(function () {
        hideBubble();
        scheduleWander(randomBetween(WANDER_AFTER_DROP_MS, WANDER_AFTER_DROP_MS + 4000));
      }, DROP_QUIP_MS);
      return;
    }

    interactWithGuybrush();
  }

  function onHitPointerDown(event) {
    if (!running || event.button !== 0) return;

    event.stopPropagation();
    dragPending = true;
    dragStartClientX = event.clientX;
    dragStartClientY = event.clientY;
    dragPointerId = event.pointerId;

    try {
      hitEl.setPointerCapture(event.pointerId);
    } catch (err) {
      /* ignore capture failures */
    }
  }

  function onHitPointerMove(event) {
    if (!dragPending && !isDragging) return;
    if (dragPointerId !== null && event.pointerId !== dragPointerId) return;

    if (!isDragging) {
      const moved = Math.hypot(event.clientX - dragStartClientX, event.clientY - dragStartClientY);
      if (moved < DRAG_THRESHOLD) return;
      beginDrag(event);
    }

    event.preventDefault();
    moveDrag(event);
  }

  function onHitPointerUp(event) {
    if (dragPointerId !== null && event.pointerId !== dragPointerId) return;

    const didDrag = isDragging;
    finishDrag(didDrag);
  }

  function onHitPointerCancel(event) {
    if (dragPointerId !== null && event.pointerId !== dragPointerId) return;
    finishDrag(isDragging);
  }

  function bindDrag() {
    hitEl.addEventListener("pointerdown", onHitPointerDown);
    hitEl.addEventListener("pointermove", onHitPointerMove);
    hitEl.addEventListener("pointerup", onHitPointerUp);
    hitEl.addEventListener("pointercancel", onHitPointerCancel);
    hitEl.addEventListener("lostpointercapture", function () {
      if (isDragging || dragPending) finishDrag(isDragging);
    });
  }

  function spriteSize(kind) {
    const cfg = spriteConfig(kind);
    return { w: cfg.frameWidth * scale, h: cfg.frameHeight * scale };
  }

  function randomBetween(min, max) {
    return min + Math.random() * (max - min);
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function setFacing(next) {
    if (facing === next) return;
    facing = next;
    spriteEl.style.setProperty("--guy-face", String(facing));
  }

  function setMode(nextMode) {
    if (mode !== nextMode) {
      mode = nextMode;
      frameIndex = 0;
      frameTimer = 0;
    }
    isMoving = mode === "walk";
    root.classList.toggle("is-walking", mode === "walk");
    root.classList.toggle("is-standing", mode === "stand");
    root.classList.toggle("is-busy", isMoving);
    updateSpriteFrame();
    syncTicking();
  }

  function updateSpriteFrame() {
    if (mode === "stand") {
      spriteEl.style.backgroundPosition = "0 0";
      return;
    }
    const cfg = spriteConfig();
    spriteEl.style.backgroundPosition = -frameIndex * cfg.frameWidth + "px 0";
  }

  function startTicking() {
    if (ticking || !running) return;
    ticking = true;
    lastTs = 0;
    rafId = window.requestAnimationFrame(tick);
  }

  function stopTicking() {
    ticking = false;
    window.cancelAnimationFrame(rafId);
    rafId = 0;
    lastTs = 0;
  }

  function syncTicking() {
    if (isMoving) startTicking();
    else stopTicking();
  }

  function advanceFrame(dt) {
    if (mode !== "walk") return;
    const cfg = spriteConfig("walk");
    frameTimer += dt;
    const frameDuration = 1000 / cfg.fps;
    while (frameTimer >= frameDuration) {
      frameTimer -= frameDuration;
      frameIndex = (frameIndex + 1) % cfg.frameCount;
      updateSpriteFrame();
    }
  }

  function clearTimers() {
    window.clearTimeout(wanderTimer);
    window.clearTimeout(speakTimer);
    wanderTimer = 0;
    speakTimer = 0;
  }

  function setScale() {
    scale = window.matchMedia(MOBILE_QUERY).matches ? SCALE_MOBILE : SCALE_DESKTOP;
  }

  function visibleRows() {
    return Array.from(list.querySelectorAll(".album-row:not(.is-hidden)"));
  }

  function albumFromRow(row) {
    const rows = visibleRows();
    const idx = rows.indexOf(row);
    return {
      artist: row.dataset.labelArtist || row.dataset.artist || "",
      title: row.dataset.labelTitle || row.dataset.title || "",
      score: row.dataset.score || "",
      index: idx >= 0 ? idx + 1 : 1,
    };
  }

  function stageBounds() {
    const header = document.querySelector(".tavern-sign");
    const panel = document.querySelector(".dialog-panel");
    const size = spriteSize("stand");
    const top = (header ? header.getBoundingClientRect().bottom : 72) + 12;
    const bottom = window.innerHeight - size.h - 12;
    const panelRect = panel ? panel.getBoundingClientRect() : null;
    return { top, bottom, left: 12, right: window.innerWidth - size.w - 12, panelRect };
  }

  function clampPoint(point) {
    const b = stageBounds();
    return {
      x: clamp(point.x, b.left, b.right),
      y: clamp(point.y, b.top, b.bottom),
    };
  }

  function pickWanderTarget() {
    const b = stageBounds();
    const size = spriteSize("stand");
    const roll = Math.random();

    if (b.panelRect && roll < 0.45 && b.panelRect.left > size.w + 28) {
      return clampPoint({
        x: randomBetween(16, b.panelRect.left - size.w - 6),
        y: randomBetween(b.top, b.bottom),
      });
    }

    if (b.panelRect && roll < 0.75 && b.panelRect.right < window.innerWidth - size.w - 20) {
      return clampPoint({
        x: randomBetween(b.panelRect.right + 6, b.right),
        y: randomBetween(b.top, b.bottom),
      });
    }

    return clampPoint({
      x: randomBetween(b.left, b.right),
      y: randomBetween(b.top, b.bottom),
    });
  }

  function rowReference(row) {
    return row.querySelector(".album-row__toggle") || row;
  }

  function bindScrollTracking() {
    if (scrollBound) return;
    scrollBound = true;
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  function unbindScrollTracking() {
    if (!scrollBound) return;
    scrollBound = false;
    window.removeEventListener("scroll", onScroll);
  }

  function setAnchor(row) {
    anchor = row ? { type: "row", row: row } : { type: "free" };
    observeRow(row);
    if (row) bindScrollTracking();
    else unbindScrollTracking();
  }

  function releaseAnchor() {
    anchor = { type: "free" };
    observeRow(null);
    unbindScrollTracking();
  }

  function observeRow(row) {
    if (!rowObserver) return;
    rowObserver.disconnect();
    if (row) rowObserver.observe(row);
  }

  function anchorForRow(row) {
    const refRect = rowReference(row).getBoundingClientRect();
    const size = spriteSize("stand");
    const b = stageBounds();
    let ax = refRect.left - size.w - 10;

    if (ax < b.left) {
      ax = Math.min(refRect.right - size.w * 0.35, b.right);
    }

    const ay = refRect.top + refRect.height / 2 - size.h * 0.82;
    return clampPoint({ x: ax, y: ay });
  }

  function faceRow(row) {
    const refRect = rowReference(row).getBoundingClientRect();
    setFacing(refRect.left + refRect.width / 2 > x + spriteSize("stand").w / 2 ? 1 : -1);
  }

  function syncAnchorPosition() {
    if (!running || !anchor || anchor.type !== "row" || isDragging) return;

    const row = anchor.row;
    if (!row || !document.contains(row) || row.classList.contains("is-hidden")) {
      releaseAnchor();
      return;
    }

    const point = anchorForRow(row);

    if (isMoving) {
      targetX = point.x;
      targetY = point.y;
      return;
    }

    x = point.x;
    y = point.y;
    renderPosition();
    faceRow(row);
    if (!bubbleEl.hidden) layoutBubble();
  }

  function onLayoutChange() {
    if (!running || !anchor || anchor.type !== "row") return;
    if (layoutRaf) return;
    layoutRaf = window.requestAnimationFrame(function () {
      layoutRaf = 0;
      syncAnchorPosition();
    });
  }

  function onScroll() {
    if (!running || !anchor || anchor.type !== "row") return;
    if (scrollRaf) return;
    scrollRaf = window.requestAnimationFrame(function () {
      scrollRaf = 0;
      syncAnchorPosition();
    });
  }

  function renderPosition() {
    root.style.transform = "translate3d(" + x + "px," + y + "px,0) scale(" + scale + ")";
  }

  function layoutBubble() {
    bubbleEl.classList.remove("is-bubble-below");
    bubbleEl.style.transform = "";

    const margin = 12;
    let rect = bubbleEl.getBoundingClientRect();

    if (rect.top < margin) {
      bubbleEl.classList.add("is-bubble-below");
      rect = bubbleEl.getBoundingClientRect();
    }

    let shiftX = 0;
    if (rect.right > window.innerWidth - margin) {
      shiftX = window.innerWidth - margin - rect.right;
    }
    const shiftedLeft = rect.left + shiftX;
    if (shiftedLeft < margin) {
      shiftX += margin - shiftedLeft;
    }
    if (shiftX !== 0) {
      bubbleEl.style.transform = "translateX(" + shiftX + "px)";
    }
  }

  function showBubble(text) {
    lineEl.textContent = text;
    bubbleEl.hidden = false;
    root.classList.add("is-yapping");
    layoutBubble();
  }

  function hideBubble() {
    bubbleEl.hidden = true;
    bubbleEl.classList.remove("is-bubble-below");
    bubbleEl.style.transform = "";
    root.classList.remove("is-yapping");
  }

  function highlightRow(row, ms) {
    if (activeRow && activeRow !== row) activeRow.classList.remove("is-guybrush-here");
    activeRow = row;
    if (!row) return;
    row.classList.add("is-guybrush-here");
    window.setTimeout(function () {
      row.classList.remove("is-guybrush-here");
      if (activeRow === row) activeRow = null;
    }, ms);
  }

  function scheduleWander(delay) {
    window.clearTimeout(wanderTimer);
    wanderTimer = window.setTimeout(beginWander, delay);
  }

  function beginWander() {
    if (!running || bubbleEl.hidden === false || isDragging) return;

    const target = pickWanderTarget();
    onArrive = function () {
      setMode("stand");
      scheduleWander(randomBetween(WANDER_MIN_MS, WANDER_MAX_MS));
    };
    moveTo(target.x, target.y);
  }

  function moveTo(tx, ty) {
    const point = clampPoint({ x: tx, y: ty });
    targetX = point.x;
    targetY = point.y;
    setFacing(targetX >= x ? 1 : -1);

    if (prefersReducedMotion) {
      x = point.x;
      y = point.y;
      renderPosition();
      isMoving = false;
      root.classList.remove("is-busy");
      setMode("stand");
      const arrive = onArrive;
      onArrive = null;
      intentRow = null;
      if (arrive) arrive();
      return;
    }

    setMode("walk");
  }

  function finishMove() {
    x = targetX;
    y = targetY;
    renderPosition();
    isMoving = false;
    root.classList.remove("is-busy");
    setMode("stand");
    const arrive = onArrive;
    onArrive = null;
    intentRow = null;
    if (arrive) arrive();
  }

  function speakAtRow(row, line) {
    clearTimers();
    setAnchor(row);
    highlightRow(row, SPEAK_MS);
    setMode("stand");
    syncAnchorPosition();
    faceRow(row);
    showBubble(line);

    speakTimer = window.setTimeout(function () {
      hideBubble();
      releaseAnchor();
      scheduleWander(randomBetween(WANDER_MIN_MS, WANDER_MAX_MS));
    }, SPEAK_MS);
  }

  function reactToAlbum(row) {
    if (!row || row.classList.contains("is-hidden")) return;
    if (isDragging || dragPending) cancelDrag();

    clearTimers();
    hideBubble();
    releaseAnchor();
    intentRow = row;

    const album = albumFromRow(row);
    const line = GuybrushLines.expand(album);
    const point = anchorForRow(row);

    onArrive = function () {
      speakAtRow(row, line);
    };

    if (prefersReducedMotion) {
      x = point.x;
      y = point.y;
      renderPosition();
      onArrive();
      onArrive = null;
      intentRow = null;
      return;
    }

    moveTo(point.x, point.y);
  }

  function interactWithGuybrush() {
    if (isMoving) {
      clearTimers();
      isMoving = false;
      onArrive = null;
      intentRow = null;
      root.classList.remove("is-busy");
      stopTicking();
      setMode("stand");
      showBubble(GuybrushLines.click(null, true));
      speakTimer = window.setTimeout(function () {
        hideBubble();
        scheduleWander(randomBetween(WANDER_MIN_MS, WANDER_MAX_MS));
      }, 2200);
      return;
    }

    clearTimers();
    const rows = visibleRows();
    let nearest = null;
    let nearestDist = Infinity;
    const centerY = y + spriteSize("stand").h * 0.5;

    rows.forEach(function (row) {
      const rect = row.getBoundingClientRect();
      const dist = Math.abs(rect.top + rect.height / 2 - centerY);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearest = row;
      }
    });

    const album = nearest ? albumFromRow(nearest) : null;
    showBubble(GuybrushLines.click(album, false));
    setMode("stand");

    speakTimer = window.setTimeout(function () {
      hideBubble();
      scheduleWander(randomBetween(WANDER_MIN_MS, WANDER_MAX_MS));
    }, SPEAK_MS);
  }

  function tick(ts) {
    if (!ticking || !running) return;

    const dt = lastTs ? Math.min(32, ts - lastTs) : 0;
    lastTs = ts;
    advanceFrame(dt);

    if (intentRow && isMoving) {
      const point = anchorForRow(intentRow);
      targetX = point.x;
      targetY = point.y;
    }

    const dx = targetX - x;
    const dy = targetY - y;
    const dist = Math.hypot(dx, dy);

    if (dist < 1.5) {
      finishMove();
    } else {
      const step = (WALK_SPEED * dt) / 1000;
      const ratio = Math.min(1, step / dist);
      if (dx !== 0) setFacing(dx > 0 ? 1 : -1);
      x += dx * ratio;
      y += dy * ratio;
      renderPosition();
    }

    if (isMoving) rafId = window.requestAnimationFrame(tick);
    else stopTicking();
  }

  function preloadSprites() {
    const seen = new Set();
    Object.keys(SPRITE).forEach(function (key) {
      const file = SPRITE[key].file;
      if (seen.has(file)) return;
      seen.add(file);
      const img = new Image();
      img.decoding = "async";
      img.src = spriteBase + file;
    });
  }

  function boot() {
    if (running) return;
    running = true;
    setScale();
    setFacing(1);
    root.classList.add("is-active");
    root.classList.toggle("is-reduced-motion", prefersReducedMotion);

    const start = pickWanderTarget();
    x = start.x;
    y = start.y;
    renderPosition();
    setMode("stand");
    scheduleWander(randomBetween(2500, 5000));
  }

  function stop() {
    running = false;
    clearTimers();
    stopTicking();
    hideBubble();
    releaseAnchor();
    intentRow = null;
    onArrive = null;
    cancelDrag();
    root.classList.remove("is-active", "is-reduced-motion");
  }

  function onResize() {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(function () {
      setScale();
      if (anchor && anchor.type === "row") {
        syncAnchorPosition();
        return;
      }
      const point = clampPoint({ x: x, y: y });
      x = point.x;
      y = point.y;
      renderPosition();
      if (!bubbleEl.hidden) layoutBubble();
    }, 120);
  }

  function bindLayoutTracking() {
    if ("ResizeObserver" in window) {
      rowObserver = new ResizeObserver(onLayoutChange);
      layoutObserver = new ResizeObserver(onLayoutChange);
      layoutObserver.observe(list);
      const panel = document.querySelector(".dialog-panel__inner");
      if (panel) layoutObserver.observe(panel);
    }
  }

  function loadConfig(done) {
    if (configLoaded) {
      done();
      return;
    }
    fetch(configUrl, { credentials: "same-origin" })
      .then(function (res) {
        if (!res.ok) throw new Error("config");
        return res.json();
      })
      .then(function (json) {
        if (json && json.stand && json.walk) SPRITE = json;
      })
      .catch(function () {
        SPRITE = DEFAULT_SPRITE;
      })
      .finally(function () {
        configLoaded = true;
        done();
      });
  }

  bindDrag();

  document.addEventListener("album-island:album-open", function (event) {
    if (event.detail && event.detail.row) reactToAlbum(event.detail.row);
  });

  window.addEventListener("resize", onResize, { passive: true });
  window.addEventListener("beforeunload", stop);

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) stop();
    else if (!running) init();
  });

  const searchInput = document.getElementById("album-search");
  if (searchInput) {
    searchInput.addEventListener("input", function () {
      hideBubble();
      clearTimers();
      releaseAnchor();
      if (running) scheduleWander(3000);
    });
  }

  function init() {
    loadConfig(function () {
      preloadSprites();
      bindLayoutTracking();
      const startWhenIdle = window.requestIdleCallback || function (cb) {
        window.setTimeout(cb, 1);
      };
      startWhenIdle(boot, { timeout: 2000 });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
