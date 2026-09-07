(function () {
  "use strict";

  const STORAGE_KEY = "diyTurkeyGameState";
  const ISTANBUL_EXCEPTIONS = [
    ["Beykoz", "Sarıyer"],
    ["Beşiktaş", "Üsküdar"],
    ["Beyoğlu", "Üsküdar"],
    ["Fatih", "Üsküdar"],
    ["Fatih", "Kadıköy"],
  ];
  const CITY_COLORS = [
    "#fb4934",
    "#fe8019",
    "#fabd2f",
    "#b8bb26",
    "#8ec07c",
    "#83a598",
    "#d3869b",
    "#d65d0e",
    "#b57614",
    "#cc241d",
    "#689d6a",
    "#458588",
    "#b16286",
    "#79740e",
    "#9d0006",
  ];

  const state = {
    map: null,
    districts: [],
    selectedDistricts: new Set(),
    focusedDistrict: null,
    cities: [],
    districtById: {},
    cityMarkers: {},
    nextCityId: 1,
    exportBounds: null,
    realCitiesData: null,
    districtToRealCity: {},
    lastFocus: null,
    confirmAction: null,
    labelTimer: null,
    previewUrl: null,
  };

  const els = {};

  function $(id) {
    return document.getElementById(id);
  }

  function cssVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  function showMapStatus(message, retry) {
    const box = els.mapStatus;
    box.hidden = false;
    box.replaceChildren();
    const p = document.createElement("p");
    p.textContent = message;
    box.appendChild(p);
    if (retry) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn btn-primary";
      btn.textContent = "try again";
      btn.addEventListener("click", retry);
      box.appendChild(btn);
    }
  }

  function hideMapStatus() {
    els.mapStatus.hidden = true;
    els.mapStatus.replaceChildren();
  }

  function openDialog(dialog, focusEl) {
    state.lastFocus = document.activeElement;
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
    if (focusEl) focusEl.focus();
  }

  function closeDialog(dialog) {
    if (dialog.open) dialog.close();
    else dialog.removeAttribute("open");
    const prev = state.lastFocus;
    if (prev && typeof prev.focus === "function") prev.focus();
  }

  function bindDialogDismiss(dialog) {
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) closeDialog(dialog);
    });
    dialog.addEventListener("cancel", () => {
      const prev = state.lastFocus;
      if (prev && typeof prev.focus === "function") {
        requestAnimationFrame(() => prev.focus());
      }
    });
  }

  function showMessage(text) {
    els.messageText.textContent = text;
    openDialog(els.messageDialog, els.messageClose);
  }

  function showConfirm(text, actionLabel, onConfirm) {
    els.confirmTitle.textContent = actionLabel;
    els.confirmMessage.textContent = text;
    els.confirmYes.textContent = actionLabel;
    state.confirmAction = onConfirm;
    openDialog(els.confirmDialog, els.confirmNo);
  }

  function foldName(value) {
    return value
      .replace(/İ/g, "i")
      .replace(/I/g, "i")
      .toLowerCase()
      .replace(/ı/g, "i")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function districtName(id) {
    return state.districtById[id]?.properties.districtName || "unknown";
  }

  function areDistrictsExcepted(a, b) {
    const na = districtName(a);
    const nb = districtName(b);
    return ISTANBUL_EXCEPTIONS.some(
      ([x, y]) => (na === x && nb === y) || (na === y && nb === x)
    );
  }

  function neighborsOf(id) {
    return state.districtById[id]?.properties.neighbors || [];
  }

  function areDistrictsContiguous(ids) {
    if (ids.length <= 1) return true;
    const set = new Set(ids);
    const seen = new Set([ids[0]]);
    const queue = [ids[0]];
    while (queue.length) {
      const current = queue.shift();
      const next = neighborsOf(current).slice();
      ids.forEach((other) => {
        if (other !== current && areDistrictsExcepted(current, other)) {
          next.push(other);
        }
      });
      next.forEach((n) => {
        if (set.has(n) && !seen.has(n)) {
          seen.add(n);
          queue.push(n);
        }
      });
    }
    return seen.size === ids.length;
  }

  function applyMapTheme() {
    if (!state.map || !state.map.getLayer("districts-fill")) return;
    const bg = cssVar("--primary-bg");
    const idle = cssVar("--border-color");
    const selected = cssVar("--accent-color");
    const border = cssVar("--code-bg");
    const focus = cssVar("--primary-text");
    state.map.setPaintProperty("background", "background-color", bg);
    state.map.setPaintProperty("districts-fill", "fill-color", [
      "case",
      ["boolean", ["feature-state", "selected"], false],
      selected,
      ["has", "cityColor"],
      ["get", "cityColor"],
      idle,
    ]);
    state.map.setPaintProperty("districts-border", "line-color", [
      "case",
      ["boolean", ["feature-state", "selected"], false],
      selected,
      ["boolean", ["feature-state", "focused"], false],
      focus,
      border,
    ]);
    state.map.setPaintProperty("districts-border", "line-width", [
      "case",
      ["boolean", ["feature-state", "selected"], false],
      2,
      ["boolean", ["feature-state", "focused"], false],
      2,
      1,
    ]);
  }

  function setFocusedDistrict(id) {
    if (state.focusedDistrict && state.map) {
      state.map.setFeatureState(
        { source: "districts", id: state.focusedDistrict },
        { focused: false }
      );
    }
    state.focusedDistrict = id;
    if (id && state.map) {
      state.map.setFeatureState({ source: "districts", id }, { focused: true });
    }
  }

  function handleDistrictClick(id) {
    const owner = state.cities.find((city) => city.districts.includes(id));
    if (owner) {
      showMessage(
        `"${owner.name}" already includes this district. delete that city to reassign it.`
      );
      return;
    }
    if (state.selectedDistricts.has(id)) {
      state.selectedDistricts.delete(id);
      state.map.setFeatureState({ source: "districts", id }, { selected: false });
    } else {
      state.selectedDistricts.add(id);
      state.map.setFeatureState({ source: "districts", id }, { selected: true });
    }
    setFocusedDistrict(id);
    updateUI();
  }

  function updateDistrictForCity(id, color) {
    const feature = state.districtById[id];
    if (feature) feature.properties.cityColor = color;
  }

  function refreshMapData() {
    const source = state.map && state.map.getSource("districts");
    if (source) {
      source.setData({ type: "FeatureCollection", features: state.districts });
    }
  }

  function saveGameState() {
    try {
      const payload = {
        cities: state.cities,
        nextCityId: state.nextCityId,
        districtColors: {},
      };
      state.districts.forEach((feature) => {
        if (feature.properties.cityColor) {
          payload.districtColors[feature.id] = feature.properties.cityColor;
        }
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (err) {
      console.error("could not save map:", err);
    }
  }

  function clearGameState() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.error("could not clear saved map:", err);
    }
  }

  function loadGameState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw);
      state.cities = saved.cities || [];
      state.nextCityId = saved.nextCityId || 1;
      if (saved.districtColors) {
        Object.entries(saved.districtColors).forEach(([id, color]) => {
          updateDistrictForCity(id, color);
        });
        refreshMapData();
      }
      state.cities.forEach(addCityLabel);
      updateUI();
      scheduleLabelPlacement();
    } catch (err) {
      console.error("could not restore saved map:", err);
    }
  }

  function updateUI() {
    els.selectedCount.textContent = String(state.selectedDistricts.size);
    els.citiesCount.textContent = String(state.cities.length);
    const used = new Set();
    state.cities.forEach((city) => city.districts.forEach((id) => used.add(id)));
    els.districtsLeft.textContent = String(state.districts.length - used.size);
    els.createCityBtn.disabled = state.selectedDistricts.size === 0;
    els.clearSelectionBtn.disabled = state.selectedDistricts.size === 0;
    els.exportBtn.disabled = state.cities.length === 0;
    els.checkAccuracyBtn.disabled = state.cities.length === 0;
    els.resetAllBtn.disabled =
      state.cities.length === 0 && state.selectedDistricts.size === 0;
    renderCitiesList();
  }

  function renderCitiesList() {
    const root = els.citiesList;
    root.replaceChildren();
    if (state.cities.length === 0) {
      const empty = document.createElement("p");
      empty.className = "empty-message";
      empty.textContent = "no cities yet. select neighboring districts, then create a city.";
      root.appendChild(empty);
      return;
    }

    state.cities.forEach((city) => {
      const item = document.createElement("div");
      item.className = "city-item";
      item.dataset.cityId = String(city.id);

      const header = document.createElement("div");
      header.className = "city-header";

      const swatch = document.createElement("span");
      swatch.className = "city-swatch";
      swatch.style.background = city.color;
      swatch.title = "city color";

      const name = document.createElement("div");
      name.className = "city-name";
      name.textContent = city.name;

      const actions = document.createElement("div");
      actions.className = "city-actions";
      const rename = document.createElement("button");
      rename.type = "button";
      rename.className = "city-rename";
      rename.textContent = "rename";
      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "city-delete";
      remove.textContent = "delete";
      actions.append(rename, remove);
      header.append(swatch, name, actions);

      const info = document.createElement("div");
      info.className = "city-info";
      info.textContent =
        city.districts.length +
        (city.districts.length === 1 ? " district" : " districts");

      const central = document.createElement("div");
      central.className = "city-central";
      const label = document.createElement("label");
      const selectId = "central-" + city.id;
      label.setAttribute("for", selectId);
      label.textContent = "label center";
      const select = document.createElement("select");
      select.id = selectId;
      select.className = "central-select";
      city.districts.forEach((id) => {
        const option = document.createElement("option");
        option.value = id;
        option.textContent = districtName(id);
        if (id === city.centralDistrict) option.selected = true;
        select.appendChild(option);
      });
      central.append(label, select);

      const districts = document.createElement("div");
      districts.className = "city-districts";
      const strong = document.createElement("strong");
      strong.textContent = "districts: ";
      districts.appendChild(strong);
      districts.appendChild(
        document.createTextNode(
          city.districts.map((id) => districtName(id)).join(", ")
        )
      );

      item.append(header, info, central, districts);
      root.appendChild(item);
    });
  }

  function createCity() {
    if (state.selectedDistricts.size === 0) return;
    const ids = Array.from(state.selectedDistricts);
    if (!areDistrictsContiguous(ids)) {
      showMessage("those districts do not all touch. select a neighboring group.");
      return;
    }
    const n = ids.length;
    els.districtCountText.textContent =
      n === 1
        ? "you've selected 1 district."
        : "you've selected " + n + " districts.";
    els.cityNameInput.value = "";
    openDialog(els.nameModal, els.cityNameInput);
  }

  function confirmCityCreation() {
    const name = els.cityNameInput.value.trim();
    if (!name) {
      showMessage("enter a city name.");
      return;
    }
    if (state.cities.some((city) => city.name.toLowerCase() === name.toLowerCase())) {
      showMessage("a city with that name already exists.");
      return;
    }
    const districts = Array.from(state.selectedDistricts);
    const city = {
      id: state.nextCityId++,
      name,
      districts,
      centralDistrict: districts[Math.floor(Math.random() * districts.length)],
      color: CITY_COLORS[state.cities.length % CITY_COLORS.length],
      createdAt: new Date().toISOString(),
    };
    state.cities.push(city);
    city.districts.forEach((id) => {
      updateDistrictForCity(id, city.color);
      state.map.setFeatureState({ source: "districts", id }, { selected: false });
    });
    refreshMapData();
    addCityLabel(city);
    state.selectedDistricts.clear();
    closeDialog(els.nameModal);
    updateUI();
    saveGameState();
    scheduleLabelPlacement();
  }

  function getDistrictCentroid(feature) {
    if (!feature || !feature.geometry) return null;
    const ring =
      feature.geometry.type === "Polygon"
        ? feature.geometry.coordinates[0]
        : feature.geometry.coordinates[0][0];
    let lng = 0;
    let lat = 0;
    ring.forEach((pt) => {
      lng += pt[0];
      lat += pt[1];
    });
    return ring.length ? { lng: lng / ring.length, lat: lat / ring.length } : null;
  }

  function addCityLabel(city) {
    const center = getDistrictCentroid(state.districtById[city.centralDistrict]);
    if (!center) return;
    const markerEl = document.createElement("div");
    markerEl.className = "city-label-marker";
    const box = document.createElement("div");
    box.className = "city-label-box";
    const text = document.createElement("div");
    text.className = "city-label-text";
    text.textContent = city.name;
    box.appendChild(text);
    markerEl.appendChild(box);
    markerEl.addEventListener("click", (event) => {
      event.stopPropagation();
      showCityPopup(city, center);
    });
    const marker = new maplibregl.Marker({
      element: markerEl,
      anchor: "center",
    })
      .setLngLat([center.lng, center.lat])
      .addTo(state.map);
    state.cityMarkers[city.id] = {
      label: marker,
      anchor: { lng: center.lng, lat: center.lat },
      offset: { x: 0, y: 0 },
      velocity: { x: 0, y: 0 },
    };
    scheduleLabelPlacement();
  }

  function showCityPopup(city, center) {
    const names = city.districts.map(districtName).sort();
    const root = document.createElement("div");
    root.className = "city-popup";
    const title = document.createElement("div");
    title.className = "city-popup-title";
    title.textContent = city.name;
    const info = document.createElement("div");
    info.className = "city-popup-info";
    info.textContent = city.districts.length + " districts";
    const list = document.createElement("div");
    list.className = "city-popup-districts";
    list.textContent = names.join(", ");
    root.append(title, info, list);
    new maplibregl.Popup({
      closeButton: true,
      closeOnClick: true,
      className: "city-info-popup",
      maxWidth: "250px",
    })
      .setLngLat([center.lng, center.lat])
      .setDOMContent(root)
      .addTo(state.map);
  }

  function scheduleLabelPlacement() {
    clearTimeout(state.labelTimer);
    state.labelTimer = setTimeout(optimizeLabelPlacement, 200);
  }

  function optimizeLabelPlacement() {
    const markers = Object.values(state.cityMarkers);
    if (markers.length <= 1 || !state.map) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const iterations = reduced ? 1 : 8;
    for (let n = 0; n < iterations; n++) {
      const positions = markers.map((marker) => {
        if (!marker.label) return null;
        return {
          marker,
          pos: state.map.project(marker.label.getLngLat()),
          anchor: state.map.project(marker.anchor),
        };
      });
      positions.forEach((entry, i) => {
        if (!entry) return;
        let fx = 0;
        let fy = 0;
        positions.forEach((other, j) => {
          if (!other || i === j) return;
          const dx = entry.pos.x - other.pos.x;
          const dy = entry.pos.y - other.pos.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 40 && dist > 0) {
            const push = (0.5 * (40 - dist)) / dist;
            fx += dx * push;
            fy += dy * push;
          }
        });
        fx += 0.3 * (entry.anchor.x - entry.pos.x);
        fy += 0.3 * (entry.anchor.y - entry.pos.y);
        entry.marker.velocity.x = 0.7 * entry.marker.velocity.x + fx;
        entry.marker.velocity.y = 0.7 * entry.marker.velocity.y + fy;
        entry.marker.offset.x += entry.marker.velocity.x;
        entry.marker.offset.y += entry.marker.velocity.y;
      });
    }
    markers.forEach((marker) => {
      if (!marker.label) return;
      const anchor = state.map.project(marker.anchor);
      const next = state.map.unproject({
        x: anchor.x + marker.offset.x,
        y: anchor.y + marker.offset.y,
      });
      marker.label.setLngLat(next);
    });
  }

  function confirmRename() {
    const name = els.renameInput.value.trim();
    const cityId = parseInt(els.renameModal.dataset.cityId, 10);
    if (!name) {
      showMessage("enter a city name.");
      return;
    }
    const city = state.cities.find((item) => item.id === cityId);
    if (!city) return;
    if (
      state.cities.some(
        (item) => item.id !== cityId && item.name.toLowerCase() === name.toLowerCase()
      )
    ) {
      showMessage("a city with that name already exists.");
      return;
    }
    city.name = name;
    const marker = state.cityMarkers[cityId];
    if (marker && marker.label) {
      const text = marker.label.getElement().querySelector(".city-label-text");
      if (text) text.textContent = name;
    }
    closeDialog(els.renameModal);
    updateUI();
    saveGameState();
  }

  function renameCity(cityId) {
    const city = state.cities.find((item) => item.id === cityId);
    if (!city) return;
    els.currentCityName.textContent = city.name;
    els.renameInput.value = city.name;
    els.renameModal.dataset.cityId = String(cityId);
    openDialog(els.renameModal, els.renameInput);
    els.renameInput.select();
  }

  function deleteCityConfirmed(city) {
    if (state.cityMarkers[city.id]) {
      if (state.cityMarkers[city.id].label) state.cityMarkers[city.id].label.remove();
      delete state.cityMarkers[city.id];
    }
    city.districts.forEach((id) => {
      const feature = state.districtById[id];
      if (feature) delete feature.properties.cityColor;
    });
    state.cities = state.cities.filter((item) => item.id !== city.id);
    refreshMapData();
    updateUI();
    saveGameState();
  }

  function clearSelection() {
    state.selectedDistricts.forEach((id) => {
      state.map.setFeatureState({ source: "districts", id }, { selected: false });
    });
    state.selectedDistricts.clear();
    updateUI();
  }

  function resetAllConfirmed() {
    Object.values(state.cityMarkers).forEach((marker) => {
      if (marker.label) marker.label.remove();
    });
    state.cityMarkers = {};
    state.selectedDistricts.forEach((id) => {
      state.map.setFeatureState({ source: "districts", id }, { selected: false });
    });
    state.cities.forEach((city) => {
      city.districts.forEach((id) => {
        const feature = state.districtById[id];
        if (feature) delete feature.properties.cityColor;
      });
    });
    state.cities = [];
    state.selectedDistricts.clear();
    state.nextCityId = 1;
    refreshMapData();
    updateUI();
    clearGameState();
  }

  function changeCentralDistrict(cityId, districtId) {
    const city = state.cities.find((item) => item.id === cityId);
    if (!city) return;
    city.centralDistrict = districtId;
    if (state.cityMarkers[cityId]) {
      if (state.cityMarkers[cityId].label) state.cityMarkers[cityId].label.remove();
      delete state.cityMarkers[cityId];
    }
    addCityLabel(city);
    saveGameState();
    scheduleLabelPlacement();
  }

  function loadRealCitiesData(provinces) {
    state.realCitiesData = {};
    provinces.forEach((province) => {
      state.realCitiesData[province.id] = { name: province.name, districts: [] };
    });
    state.districts.forEach((feature) => {
      const cityId = feature.properties.cityId;
      if (cityId && state.realCitiesData[cityId]) {
        state.realCitiesData[cityId].districts.push(feature.id);
        state.districtToRealCity[feature.id] = cityId;
      }
    });
  }

  function calculateAccuracy() {
    const cityMatches = [];
    let perfect = 0;
    const attempted = new Set();
    state.cities.forEach((city) => {
      const counts = {};
      city.districts.forEach((id) => {
        const realId = state.districtToRealCity[id];
        if (realId) counts[realId] = (counts[realId] || 0) + 1;
      });
      let dominant = null;
      let matched = 0;
      Object.entries(counts).forEach(([id, n]) => {
        if (n > matched) {
          matched = n;
          dominant = id;
        }
      });
      const row = {
        name: city.name,
        color: city.color,
        userDistrictsCount: city.districts.length,
        matchedDistricts: matched,
        realDistrictsCount: 0,
        completeness: 0,
        precision: 0,
        dominantRealCity: null,
        isPerfect: false,
      };
      if (dominant && state.realCitiesData[dominant]) {
        const real = state.realCitiesData[dominant];
        row.dominantRealCity = real.name;
        row.realDistrictsCount = real.districts.length;
        attempted.add(dominant);
        row.precision = (matched / city.districts.length) * 100;
        row.completeness = (matched / real.districts.length) * 100;
        const userSet = new Set(city.districts);
        const realSet = new Set(real.districts);
        row.isPerfect =
          real.districts.every((id) => userSet.has(id)) &&
          city.districts.every((id) => realSet.has(id));
        if (row.isPerfect) perfect += 1;
      }
      cityMatches.push(row);
    });
    const totalReal = Object.keys(state.realCitiesData).length;
    return {
      provinceCompleteness: ((perfect / totalReal) * 100).toFixed(1),
      perfectProvinces: perfect,
      totalRealProvinces: totalReal,
      matchedProvinces: attempted.size,
      cityMatches,
      totalUserCities: state.cities.length,
    };
  }

  function metricClass(value) {
    if (value >= 80) return "metric-high";
    if (value >= 50) return "metric-mid";
    return "metric-low";
  }

  function showAccuracyResults(report) {
    const root = els.accuracyResults;
    root.replaceChildren();

    const summary = document.createElement("div");
    summary.className = "accuracy-summary";
    const heading = document.createElement("h3");
    heading.textContent = "overall progress: " + report.provinceCompleteness + "%";
    const perfect = document.createElement("p");
    perfect.textContent =
      report.perfectProvinces +
      " of " +
      report.totalRealProvinces +
      " provinces perfectly completed";
    const attempted = document.createElement("p");
    attempted.textContent =
      report.matchedProvinces +
      (report.matchedProvinces === 1 ? " province attempted · " : " provinces attempted · ") +
      report.totalUserCities +
      (report.totalUserCities === 1 ? " city created" : " cities created");
    const barWrap = document.createElement("div");
    barWrap.className = "progress-bar-container";
    const bar = document.createElement("div");
    bar.className = "progress-bar";
    bar.style.transform = "scaleX(" + Number(report.provinceCompleteness) / 100 + ")";
    barWrap.appendChild(bar);
    summary.append(heading, perfect, attempted, barWrap);

    const details = document.createElement("div");
    details.className = "accuracy-details";
    const detailTitle = document.createElement("h3");
    detailTitle.textContent = "city by city";
    details.appendChild(detailTitle);

    report.cityMatches.forEach((row) => {
      const item = document.createElement("div");
      item.className = "accuracy-city-item";
      const name = document.createElement("div");
      name.className = "accuracy-city-name";
      name.textContent = row.name + " ";
      if (row.isPerfect) {
        const badge = document.createElement("span");
        badge.className = "perfect-badge";
        badge.textContent = "perfect";
        name.appendChild(badge);
      }
      item.appendChild(name);
      if (row.dominantRealCity) {
        const match = document.createElement("div");
        match.className = "accuracy-match";
        match.appendChild(document.createTextNode("best match: "));
        const strong = document.createElement("strong");
        strong.textContent = row.dominantRealCity;
        match.appendChild(strong);
        const stats = document.createElement("div");
        stats.className = "accuracy-city-stats";
        const metric = document.createElement("div");
        metric.className = "accuracy-metric";
        const label = document.createElement("span");
        label.className = "metric-label";
        label.textContent = "province completeness";
        const pct = document.createElement("span");
        pct.className = "accuracy-percentage";
        const swatch = document.createElement("span");
        swatch.className = "metric-swatch " + metricClass(row.completeness);
        swatch.setAttribute("aria-hidden", "true");
        pct.append(swatch, document.createTextNode(row.completeness.toFixed(1) + "%"));
        metric.append(label, pct);
        const detail = document.createElement("span");
        detail.className = "metric-detail";
        detail.textContent =
          row.matchedDistricts +
          "/" +
          row.realDistrictsCount +
          " districts from the real province";
        stats.append(metric, detail);
        item.append(match, stats);
        if (row.precision < 100) {
          const warn = document.createElement("div");
          warn.className = "accuracy-warning";
          warn.textContent =
            "includes " +
            (row.userDistrictsCount - row.matchedDistricts) +
            " district(s) from other provinces";
          item.appendChild(warn);
        } else if (row.completeness < 100) {
          const note = document.createElement("div");
          note.className = "accuracy-note";
          note.textContent =
            "missing " +
            (row.realDistrictsCount - row.matchedDistricts) +
            " district(s) to finish this province";
          item.appendChild(note);
        }
      } else {
        const warn = document.createElement("div");
        warn.className = "accuracy-warning";
        warn.textContent = "no matching real province found";
        item.appendChild(warn);
      }
      details.appendChild(item);
    });

    root.append(summary, details);
    openDialog(els.accuracyModal, els.closeAccuracyBtn);
  }

  function checkAccuracy() {
    if (state.cities.length === 0) {
      showMessage("create a city before checking accuracy.");
      return;
    }
    if (!state.realCitiesData) {
      showMessage("province data is still loading. wait a moment, then try again.");
      return;
    }
    showAccuracyResults(calculateAccuracy());
  }

  function drawMarkersOnCanvas(ctx, width, height, scale) {
    const fill = cssVar("--code-bg");
    const ink = cssVar("--primary-text");
    const line = cssVar("--border-color");
    state.cities.forEach((city) => {
      const marker = state.cityMarkers[city.id];
      if (!marker || !marker.label) return;
      const point = state.map.project(marker.label.getLngLat());
      const x = point.x * scale;
      const y = point.y * scale;
      const size = 12 * scale;
      ctx.save();
      ctx.font = size + 'px body, "IBM Plex Sans", sans-serif';
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const pad = 4 * scale;
      const textW = ctx.measureText(city.name).width + pad * 2;
      const textH = size + pad;
      const left = x - textW / 2;
      const top = y - textH / 2;
      ctx.fillStyle = fill;
      ctx.fillRect(left, top, textW, textH);
      ctx.strokeStyle = line;
      ctx.lineWidth = scale;
      ctx.strokeRect(left, top, textW, textH);
      ctx.fillStyle = ink;
      ctx.fillText(city.name, x, y);
      ctx.restore();
    });
  }

  function drawMapTitle(ctx, width, scale) {
    const x = 10 * scale;
    const y = 10 * scale;
    const w = 200 * scale;
    const h = 30 * scale;
    ctx.save();
    ctx.fillStyle = cssVar("--code-bg");
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = cssVar("--border-color");
    ctx.lineWidth = 2 * scale;
    ctx.strokeRect(x, y, w, h);
    ctx.font = 14 * scale + 'px body, "IBM Plex Sans", sans-serif';
    ctx.fillStyle = cssVar("--primary-text");
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText("diy turkey map", x + 10 * scale, y + h / 2);
    ctx.font = 12 * scale + 'px body, "IBM Plex Sans", sans-serif';
    ctx.fillText(state.cities.length + " cities", x + 120 * scale, y + h / 2);
    ctx.restore();
  }

  function closePreviewModal() {
    if (state.previewUrl) {
      URL.revokeObjectURL(state.previewUrl);
      state.previewUrl = null;
    }
    els.previewImageWrap.replaceChildren();
    closeDialog(els.previewModal);
  }

  function showImagePreview(canvas) {
    canvas.toBlob((blob) => {
      if (!blob) {
        showMessage("could not build the image. try export again.");
        return;
      }
      if (state.previewUrl) URL.revokeObjectURL(state.previewUrl);
      state.previewUrl = URL.createObjectURL(blob);
      const img = document.createElement("img");
      img.alt = "exported diy turkey map";
      img.src = state.previewUrl;
      els.previewImageWrap.replaceChildren(img);
      const assigned = state.cities.reduce((n, city) => n + city.districts.length, 0);
      els.previewCityCount.textContent = String(state.cities.length);
      els.previewDistrictCount.textContent = String(assigned);
      els.previewSize.textContent = canvas.width + "×" + canvas.height;
      els.downloadImageBtn.onclick = () => {
        const link = document.createElement("a");
        const stamp = new Date().toISOString().slice(0, 19).replace(/:/g, "-");
        link.download = "diy-turkey-" + stamp + ".png";
        link.href = state.previewUrl;
        link.click();
        closePreviewModal();
      };
      openDialog(els.previewModal, els.downloadImageBtn);
    }, "image/png");
  }

  function exportCities() {
    if (state.cities.length === 0) return;
    const previous = els.exportBtn.textContent;
    els.exportBtn.textContent = "generating…";
    els.exportBtn.disabled = true;
    const center = state.map.getCenter();
    const zoom = state.map.getZoom();
    const dpr = window.devicePixelRatio || 1;
    state.map.fitBounds(state.exportBounds, { padding: 0, duration: 0 });
    state.map.once("idle", () => {
      try {
        const mapCanvas = state.map.getCanvas();
        const out = document.createElement("canvas");
        out.width = mapCanvas.width;
        out.height = mapCanvas.height;
        const ctx = out.getContext("2d");
        ctx.drawImage(mapCanvas, 0, 0);
        const scale = mapCanvas.width / els.map.offsetWidth;
        drawMarkersOnCanvas(ctx, els.map.offsetWidth, els.map.offsetHeight, scale || dpr);
        drawMapTitle(ctx, els.map.offsetWidth, scale || dpr);
        showImagePreview(out);
      } catch (err) {
        console.error("export failed:", err);
        showMessage("export failed. try again.");
      } finally {
        state.map.jumpTo({ center, zoom });
        els.exportBtn.textContent = previous;
        els.exportBtn.disabled = false;
      }
    });
  }

  function closeDistrictResults() {
    const list = els.districtResults;
    list.hidden = true;
    list.replaceChildren();
    els.districtSearch.setAttribute("aria-expanded", "false");
    els.districtSearch.removeAttribute("aria-activedescendant");
  }

  function placeDistrictResults() {
    const list = els.districtResults;
    const input = els.districtSearch;
    if (list.hidden) return;
    const box = input.getBoundingClientRect();
    const gap = 4;
    const maxH = 220;
    const spaceBelow = window.innerHeight - box.bottom - 8;
    const spaceAbove = box.top - 8;
    const openUp = spaceBelow < 96 && spaceAbove > spaceBelow;
    const height = Math.min(maxH, Math.max(72, openUp ? spaceAbove : spaceBelow));
    list.style.left = box.left + "px";
    list.style.width = box.width + "px";
    list.style.maxHeight = height + "px";
    if (openUp) {
      list.style.top = "auto";
      list.style.bottom = window.innerHeight - box.top + gap + "px";
    } else {
      list.style.bottom = "auto";
      list.style.top = box.bottom + gap + "px";
    }
  }

  function setActiveOption(option) {
    els.districtResults.querySelectorAll('[role="option"]').forEach((node) => {
      node.setAttribute("aria-selected", node === option ? "true" : "false");
    });
    if (option) {
      els.districtSearch.setAttribute("aria-activedescendant", option.id);
      option.scrollIntoView({ block: "nearest" });
    } else {
      els.districtSearch.removeAttribute("aria-activedescendant");
    }
  }

  function renderDistrictResults(query) {
    const list = els.districtResults;
    list.replaceChildren();
    const q = foldName(query.trim());
    if (q.length < 1) {
      closeDistrictResults();
      return;
    }
    const matches = state.districts
      .filter((feature) => foldName(feature.properties.districtName).includes(q))
      .slice(0, 8);
    if (matches.length === 0) {
      const empty = document.createElement("li");
      empty.className = "finder-empty";
      empty.textContent = "no districts match that name";
      list.appendChild(empty);
      list.hidden = false;
      els.districtSearch.setAttribute("aria-expanded", "true");
      els.districtSearch.removeAttribute("aria-activedescendant");
      placeDistrictResults();
      return;
    }
    matches.forEach((feature, index) => {
      const item = document.createElement("li");
      item.id = "district-opt-" + feature.id;
      item.setAttribute("role", "option");
      item.setAttribute("aria-selected", index === 0 ? "true" : "false");
      item.dataset.districtId = feature.id;
      item.textContent = feature.properties.districtName;
      list.appendChild(item);
    });
    list.hidden = false;
    els.districtSearch.setAttribute("aria-expanded", "true");
    setActiveOption(list.querySelector('[role="option"]'));
    placeDistrictResults();
  }

  function activeResultOption() {
    return els.districtResults.querySelector('[role="option"][aria-selected="true"]');
  }

  function moveResult(delta) {
    const options = Array.from(els.districtResults.querySelectorAll('[role="option"]'));
    if (!options.length) return;
    const current = activeResultOption();
    let index = options.indexOf(current);
    index = (index + delta + options.length) % options.length;
    setActiveOption(options[index]);
  }

  function setupMap(collection) {
    const bounds = new maplibregl.LngLatBounds();
    collection.features.forEach((feature) => {
      if (feature.geometry.type === "Polygon") {
        feature.geometry.coordinates[0].forEach((pt) => bounds.extend(pt));
      } else if (feature.geometry.type === "MultiPolygon") {
        feature.geometry.coordinates.forEach((poly) => {
          poly[0].forEach((pt) => bounds.extend(pt));
        });
      }
    });
    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();
    const padLng = 0.5 * (ne.lng - sw.lng);
    const padLat = 0.5 * (ne.lat - sw.lat);
    const viewBounds = new maplibregl.LngLatBounds(
      [sw.lng - padLng, sw.lat - padLat],
      [ne.lng + padLng, ne.lat + padLat]
    );
    const exportPadLng = -(ne.lng - sw.lng);
    const exportPadLat = -0.5 * (ne.lat - sw.lat);
    state.exportBounds = new maplibregl.LngLatBounds(
      [sw.lng - exportPadLng, sw.lat - exportPadLat],
      [ne.lng + exportPadLng, sw.lat + exportPadLat]
    );

    state.map = new maplibregl.Map({
      container: "map",
      style: {
        version: 8,
        sources: {},
        layers: [
          {
            id: "background",
            type: "background",
            paint: { "background-color": cssVar("--primary-bg") },
          },
        ],
      },
      bounds: viewBounds,
      maxBounds: viewBounds.toArray(),
      attributionControl: false,
    });

    state.map.on("load", () => {
      state.map.addSource("districts", {
        type: "geojson",
        data: { type: "FeatureCollection", features: state.districts },
        promoteId: "districtId",
      });
      state.map.addLayer({
        id: "districts-fill",
        type: "fill",
        source: "districts",
        paint: { "fill-color": cssVar("--border-color"), "fill-opacity": 1 },
      });
      state.map.addLayer({
        id: "districts-border",
        type: "line",
        source: "districts",
        paint: { "line-color": cssVar("--code-bg"), "line-width": 1 },
      });
      applyMapTheme();

      const hover = new maplibregl.Popup({
        closeButton: false,
        closeOnClick: false,
        className: "district-popup",
      });
      state.map.on("mousemove", "districts-fill", (event) => {
        if (!event.features.length) return;
        state.map.getCanvas().style.cursor = "pointer";
        hover.setLngLat(event.lngLat).setText(event.features[0].properties.districtName).addTo(state.map);
      });
      state.map.on("mouseleave", "districts-fill", () => {
        state.map.getCanvas().style.cursor = "";
        hover.remove();
      });
      state.map.on("click", "districts-fill", (event) => {
        if (event.features.length) handleDistrictClick(event.features[0].properties.districtId);
      });
      state.map.on("moveend", scheduleLabelPlacement);
      hideMapStatus();
      loadGameState();
    });
  }

  async function fetchJson(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error("could not load " + url);
    return res.json();
  }

  async function init() {
    if (!window.maplibregl) {
      showMapStatus("the map library failed to load.", () => location.reload());
      return;
    }
    showMapStatus("loading districts…");
    try {
      const [districts, provinces] = await Promise.all([
        fetchJson("data/tr-districts.geojson"),
        fetchJson("data/tr-provinces.json"),
      ]);
      state.districts = districts.features.map((feature, index) => {
        const id = "district_" + (index + 1);
        return {
          type: "Feature",
          id,
          properties: {
            ...feature.properties,
            districtId: id,
            districtName: feature.properties.name,
          },
          geometry: feature.geometry,
        };
      });
      state.districts.forEach((feature) => {
        state.districtById[feature.id] = feature;
      });
      loadRealCitiesData(provinces);
      setupMap({ type: "FeatureCollection", features: state.districts });
      updateUI();
    } catch (err) {
      console.error(err);
      showMapStatus("district data did not load.", init);
    }
  }

  function setupThemeToggle() {
    const toggle = $("theme-toggle");
    const icon = $("theme-icon");
    if (!toggle || !icon) return;
    const html = document.documentElement;
    const current = localStorage.getItem("theme") || "dark";
    function updateIcon(theme) {
      icon.textContent = theme === "dark" ? "☀️" : "🌙";
    }
    updateIcon(current);
    toggle.setAttribute("aria-pressed", html.hasAttribute("data-theme") ? "true" : "false");
    toggle.addEventListener("click", () => {
      const next = html.hasAttribute("data-theme") ? "light" : "dark";
      if (next === "dark") html.setAttribute("data-theme", "dark");
      else html.removeAttribute("data-theme");
      updateIcon(next);
      toggle.setAttribute("aria-pressed", next === "dark" ? "true" : "false");
      localStorage.setItem("theme", next);
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute("content", next === "dark" ? "#282828" : "#fbf1c7");
      applyMapTheme();
    });
  }

  function cacheEls() {
    els.map = $("map");
    els.mapStatus = $("mapStatus");
    els.selectedCount = $("selectedCount");
    els.citiesCount = $("citiesCount");
    els.districtsLeft = $("districtsLeft");
    els.createCityBtn = $("createCityBtn");
    els.clearSelectionBtn = $("clearSelectionBtn");
    els.checkAccuracyBtn = $("checkAccuracyBtn");
    els.resetAllBtn = $("resetAllBtn");
    els.exportBtn = $("exportBtn");
    els.citiesList = $("citiesList");
    els.districtSearch = $("districtSearch");
    els.districtResults = $("districtResults");
    els.nameModal = $("nameModal");
    els.cityNameInput = $("cityNameInput");
    els.districtCountText = $("districtCountText");
    els.confirmNameBtn = $("confirmNameBtn");
    els.cancelNameBtn = $("cancelNameBtn");
    els.renameModal = $("renameModal");
    els.currentCityName = $("currentCityName");
    els.renameInput = $("renameInput");
    els.confirmRenameBtn = $("confirmRenameBtn");
    els.cancelRenameBtn = $("cancelRenameBtn");
    els.messageDialog = $("messageDialog");
    els.messageText = $("messageText");
    els.messageClose = $("messageClose");
    els.confirmDialog = $("confirmDialog");
    els.confirmTitle = $("confirmTitle");
    els.confirmMessage = $("confirmMessage");
    els.confirmYes = $("confirmYes");
    els.confirmNo = $("confirmNo");
    els.previewModal = $("previewModal");
    els.previewImageWrap = $("previewImageWrap");
    els.previewCityCount = $("previewCityCount");
    els.previewDistrictCount = $("previewDistrictCount");
    els.previewSize = $("previewSize");
    els.downloadImageBtn = $("downloadImageBtn");
    els.cancelPreviewBtn = $("cancelPreviewBtn");
    els.accuracyModal = $("accuracyModal");
    els.accuracyResults = $("accuracyResults");
    els.closeAccuracyBtn = $("closeAccuracyBtn");
    els.sheetToggle = $("sheetToggle");
    els.sidebar = $("controls");
  }

  function bindUi() {
    setupThemeToggle();
    [
      els.nameModal,
      els.renameModal,
      els.messageDialog,
      els.confirmDialog,
      els.previewModal,
      els.accuracyModal,
    ].forEach(bindDialogDismiss);

    els.createCityBtn.addEventListener("click", createCity);
    els.clearSelectionBtn.addEventListener("click", clearSelection);
    els.checkAccuracyBtn.addEventListener("click", checkAccuracy);
    els.resetAllBtn.addEventListener("click", () => {
      showConfirm(
        "reset everything? all cities on this map will be deleted.",
        "reset all",
        resetAllConfirmed
      );
    });
    els.exportBtn.addEventListener("click", exportCities);
    els.confirmNameBtn.addEventListener("click", confirmCityCreation);
    els.cancelNameBtn.addEventListener("click", () => closeDialog(els.nameModal));
    els.confirmRenameBtn.addEventListener("click", confirmRename);
    els.cancelRenameBtn.addEventListener("click", () => closeDialog(els.renameModal));
    els.messageClose.addEventListener("click", () => closeDialog(els.messageDialog));
    els.confirmYes.addEventListener("click", () => {
      const action = state.confirmAction;
      state.confirmAction = null;
      closeDialog(els.confirmDialog);
      if (action) action();
    });
    els.confirmNo.addEventListener("click", () => {
      state.confirmAction = null;
      closeDialog(els.confirmDialog);
    });
    els.cancelPreviewBtn.addEventListener("click", closePreviewModal);
    els.closeAccuracyBtn.addEventListener("click", () => closeDialog(els.accuracyModal));
    $("zoomIn").addEventListener("click", () => state.map && state.map.zoomIn());
    $("zoomOut").addEventListener("click", () => state.map && state.map.zoomOut());

    els.cityNameInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") confirmCityCreation();
    });
    els.renameInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") confirmRename();
    });

    els.citiesList.addEventListener("click", (event) => {
      const item = event.target.closest(".city-item");
      if (!item) return;
      const cityId = parseInt(item.dataset.cityId, 10);
      if (event.target.closest(".city-rename")) renameCity(cityId);
      if (event.target.closest(".city-delete")) {
        const city = state.cities.find((entry) => entry.id === cityId);
        if (!city) return;
        showConfirm(
          "delete \"" + city.name + "\"? its districts become unassigned.",
          "delete city",
          () => deleteCityConfirmed(city)
        );
      }
    });
    els.citiesList.addEventListener("change", (event) => {
      const select = event.target.closest(".central-select");
      if (!select) return;
      const item = event.target.closest(".city-item");
      changeCentralDistrict(parseInt(item.dataset.cityId, 10), select.value);
    });

    document.body.appendChild(els.districtResults);
    els.districtSearch.addEventListener("input", () => {
      renderDistrictResults(els.districtSearch.value);
    });
    els.districtSearch.addEventListener("keydown", (event) => {
      const open = els.districtSearch.getAttribute("aria-expanded") === "true";
      if (event.key === "ArrowDown") {
        event.preventDefault();
        if (!open) renderDistrictResults(els.districtSearch.value);
        else moveResult(1);
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        if (open) moveResult(-1);
      } else if (event.key === "Home" && open) {
        event.preventDefault();
        const first = els.districtResults.querySelector('[role="option"]');
        if (first) setActiveOption(first);
      } else if (event.key === "End" && open) {
        event.preventDefault();
        const options = els.districtResults.querySelectorAll('[role="option"]');
        if (options.length) setActiveOption(options[options.length - 1]);
      } else if (event.key === "Enter") {
        const current = activeResultOption();
        if (current) {
          event.preventDefault();
          handleDistrictClick(current.dataset.districtId);
          renderDistrictResults(els.districtSearch.value);
        }
      } else if (event.key === "Escape") {
        closeDistrictResults();
      }
    });
    els.districtResults.addEventListener("mousedown", (event) => {
      event.preventDefault();
    });
    els.districtResults.addEventListener("click", (event) => {
      const option = event.target.closest('[role="option"]');
      if (!option) return;
      handleDistrictClick(option.dataset.districtId);
      renderDistrictResults(els.districtSearch.value);
      els.districtSearch.focus();
    });
    document.addEventListener("click", (event) => {
      if (event.target.closest(".finder") || event.target.closest("#districtResults")) return;
      closeDistrictResults();
    });
    window.addEventListener("resize", placeDistrictResults);
    els.sidebar.addEventListener("scroll", placeDistrictResults);
    $("controlsBody").addEventListener("scroll", placeDistrictResults);

    els.sheetToggle.addEventListener("click", () => {
      const open = !els.sidebar.classList.contains("is-open");
      els.sidebar.classList.toggle("is-open", open);
      els.sheetToggle.setAttribute("aria-expanded", String(open));
      els.sheetToggle.textContent = open ? "close controls" : "controls";
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    cacheEls();
    bindUi();
    init();
  });
})();
