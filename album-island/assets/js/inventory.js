(function () {
  const searchInput = document.getElementById("album-search");
  const list = document.getElementById("album-list");
  const emptySearch = document.getElementById("empty-search");
  const searchStatus = document.getElementById("search-status");

  if (!list) return;

  const rows = Array.from(list.querySelectorAll(".album-row"));
  const toggles = rows
    .map(function (row) {
      return row.querySelector(".album-row__toggle");
    })
    .filter(Boolean);

  function setToggleHint(toggle, isExpanded) {
    const hint = toggle.querySelector("[data-toggle-hint]");
    if (!hint) return;
    hint.textContent = isExpanded ? ", hide track ratings" : ", show track ratings";
  }

  function collapseRow(row) {
    const toggle = row.querySelector(".album-row__toggle");
    const panel = row.querySelector(".album-row__panel");
    if (!toggle || !panel) return;

    row.classList.remove("is-expanded");
    toggle.setAttribute("aria-expanded", "false");
    panel.hidden = true;
    setToggleHint(toggle, false);
  }

  function expandRow(row) {
    const toggle = row.querySelector(".album-row__toggle");
    const panel = row.querySelector(".album-row__panel");
    if (!toggle || !panel) return;

    rows.forEach(function (other) {
      if (other !== row) collapseRow(other);
    });

    row.classList.add("is-expanded");
    toggle.setAttribute("aria-expanded", "true");
    panel.hidden = false;
    setToggleHint(toggle, true);

    document.dispatchEvent(
      new CustomEvent("album-island:album-open", {
        bubbles: true,
        detail: { row: row },
      })
    );

    const focusTarget = panel.querySelector(".track-list__heading") || panel;
    if (focusTarget) {
      focusTarget.setAttribute("tabindex", "-1");
      focusTarget.focus({ preventScroll: true });
    }
  }

  function visibleToggles() {
    return toggles.filter(function (toggle) {
      const row = toggle.closest(".album-row");
      return row && !row.classList.contains("is-hidden");
    });
  }

  rows.forEach(function (row) {
    const toggle = row.querySelector(".album-row__toggle");
    if (!toggle) return;

    toggle.addEventListener("click", function () {
      const isExpanded = row.classList.contains("is-expanded");
      if (isExpanded) {
        collapseRow(row);
      } else {
        expandRow(row);
      }
    });
  });

  toggles.forEach(function (toggle) {
    toggle.addEventListener("keydown", function (event) {
      const visible = visibleToggles();
      const index = visible.indexOf(toggle);
      if (index < 0) return;

      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        const delta = event.key === "ArrowDown" ? 1 : -1;
        const next = visible[index + delta];
        if (next) next.focus();
        return;
      }

      if (event.key === "Home") {
        event.preventDefault();
        if (visible[0]) visible[0].focus();
        return;
      }

      if (event.key === "End") {
        event.preventDefault();
        if (visible.length) visible[visible.length - 1].focus();
      }
    });
  });

  document.addEventListener("keydown", function (event) {
    if (event.key !== "Escape") return;
    const expanded = rows.find(function (row) {
      return row.classList.contains("is-expanded");
    });
    if (!expanded) return;
    const toggle = expanded.querySelector(".album-row__toggle");
    collapseRow(expanded);
    if (toggle) toggle.focus({ preventScroll: true });
  });

  document.querySelectorAll("[data-cover-fallback]").forEach(function (img) {
    img.addEventListener("error", function () {
      const cover = img.closest(".album-row__cover");
      if (cover) cover.classList.add("is-fallback");
    });
  });

  if (!searchInput) return;

  function updateSearchStatus(visibleCount, isSearching, total) {
    if (!searchStatus) return;

    if (!isSearching) {
      searchStatus.textContent = "";
      return;
    }

    if (visibleCount === 0) {
      searchStatus.textContent = "";
      return;
    }

    searchStatus.textContent =
      visibleCount === 1
        ? "1 album found."
        : visibleCount + " of " + total + " albums shown.";
  }

  function filterInventory() {
    const query = searchInput.value.trim().toLowerCase();
    const isSearching = query.length > 0;
    let visibleCount = 0;

    rows.forEach(function (row) {
      const haystack = (row.dataset.artist || "") + " " + (row.dataset.title || "");
      const matches = !isSearching || haystack.includes(query);

      if (!matches) collapseRow(row);

      row.classList.toggle("is-hidden", !matches);
      if (matches) visibleCount += 1;
    });

    if (emptySearch) {
      emptySearch.hidden = visibleCount > 0 || !isSearching;
    }

    updateSearchStatus(visibleCount, isSearching, rows.length);
  }

  searchInput.addEventListener("input", filterInventory);
  searchInput.addEventListener("search", filterInventory);
})();
