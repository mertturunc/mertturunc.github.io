// Audio ambience controller (optimized)
// ----------------------------------------------------------------------------
// Responsibilities:
// 1. Manage welcome popup dismissal.
// 2. Initialize a set of hidden (audio–only) YouTube players.
// 3. Provide per‑sound play/pause + volume controls.
// 4. Handle autoplay (muted) + single unified unmute after first interaction.

const videos = [
  { id: '8plwv25NYRo', label: 'Rain', autoplay: false },
  { id: 'nDq6TstdEi8', label: 'Thunder', autoplay: false },
  { id: 'eyU3bRy2x44', label: 'Fireplace', autoplay: false },
  { id: 'OdIJ2x3nxzQ', label: 'Forest', autoplay: false }, // only low-volume ambience (will enforce low volume on iOS)
  { id: '7BrIJrjxVxA', label: 'Snow', autoplay: false },
  { id: '2VIHVqEj0so', label: 'Wind', autoplay: false },  // only low-volume ambience (will enforce low volume on iOS)
  { id: 'AtZHaFz97k0', label: 'Theme', autoplay: true, hidden: true } // theme not auto now
];

// Keep references for quick access
const players = [];

// ---------------------------------------------------------------------------
// Centralized Audio State & Helpers (optimization / robustness layer)
// ---------------------------------------------------------------------------
// Maintain desired volumes & play states decoupled from actual player readiness.
// Advantages: reduced duplication, allows persistence, unified logic, easier future features.

const THEME_INDEX = videos.length - 1; // hidden theme track index
let desiredVolumes = [];    // index -> 0..100
let desiredPlaying = [];    // index -> boolean

const AUDIO_STATE_KEY = 'otgwAudioStateV1';
function loadPersistedAudioState() {
  try {
    const raw = localStorage.getItem(AUDIO_STATE_KEY);
    if (!raw) return;
    const obj = JSON.parse(raw);
    if (Array.isArray(obj.volumes)) desiredVolumes = obj.volumes;
    if (Array.isArray(obj.playing)) desiredPlaying = obj.playing;
  } catch(_) {}
}
let persistTimer = null;
function persistAudioState() {
  if (persistTimer) clearTimeout(persistTimer);
  persistTimer = setTimeout(() => {
    try { localStorage.setItem(AUDIO_STATE_KEY, JSON.stringify({ volumes: desiredVolumes, playing: desiredPlaying })); } catch(_) {}
  }, 350);
}
loadPersistedAudioState();

function clampVolume(v) { v = Number(v); if (isNaN(v)) return 0; return Math.min(100, Math.max(0, v)); }
function getPlayer(i) { return players[i]; }
function isPlayerPlaying(i) {
  const p = getPlayer(i); if (!p || typeof YT === 'undefined' || !YT.PlayerState) return false;
  try { return p.getPlayerState() === YT.PlayerState.PLAYING; } catch(_) { return false; }
}
function safePlay(i) {
  const p = getPlayer(i); if (!p) return;
  ensureUnmuted();
  try { if (!isPlayerPlaying(i)) p.playVideo(); } catch(_) {}
  desiredPlaying[i] = true; persistAudioState();
}
function safePause(i) {
  const p = getPlayer(i); if (!p) return;
  try { if (isPlayerPlaying(i)) p.pauseVideo(); } catch(_) {}
  desiredPlaying[i] = false; persistAudioState();
}
function setPlayState(i, shouldPlay) { shouldPlay ? safePlay(i) : safePause(i); }
function setVolume(i, vol, playIfAudible = true) {
  vol = clampVolume(vol);
  desiredVolumes[i] = vol; persistAudioState();
  const p = getPlayer(i); if (p) enforcePlayerVolume(p, vol);
  if (vol === 0) {
    safePause(i);
  } else if (playIfAudible) {
    safePlay(i);
  }
  updateChipVisual(i, vol);
}
function updateChipVisual(i, vol) {
  const chip = document.querySelector('.sound-chip[data-index="' + i + '"]');
  if (!chip) return;
  vol = clampVolume(vol);
  const lvl = vol === 0 ? 0 : (vol < 25 ? 1 : (vol < 55 ? 2 : 3));
  chip.dataset.level = '' + lvl;
  chip.classList.toggle('active', vol > 0);
  chip.style.setProperty('--chip-level', '' + lvl);
  chip.setAttribute('aria-label', (videos[i].label || 'Sound') + (vol>0 ? ' volume ' + vol : ' off'));
}
function applyDesiredStateToReadyPlayer(i) {
  if (typeof desiredVolumes[i] === 'number') setVolume(i, desiredVolumes[i], false);
  if (typeof desiredPlaying[i] === 'boolean') setPlayState(i, desiredPlaying[i]);
}
function refreshToggleButton(i) { try { updateToggleButton(i, isPlayerPlaying(i) ? YT.PlayerState.PLAYING : YT.PlayerState.PAUSED); } catch(_) {} }

function updateToggleButton(index, state) {
  const btn = document.getElementById('toggle' + index);
  if (!btn || typeof YT === 'undefined' || !YT.PlayerState) return;
  const isPlaying = state === YT.PlayerState.PLAYING;
  btn.textContent = isPlaying ? '⏸' : '▶';
  btn.setAttribute('aria-label', isPlaying ? 'Pause' : 'Play');
  btn.setAttribute('aria-pressed', isPlaying ? 'true' : 'false');
}

// Unified first‑interaction unmute handler (added only if needed) + mobile support
let pendingAutoplayPlayers = [];
let unmuteArmed = false;
function ensureUnmuted() {
  if (!pendingAutoplayPlayers.length) return;
  pendingAutoplayPlayers.forEach(p => { try { p.unMute(); } catch(_) {} });
  pendingAutoplayPlayers = [];
}
function attachGlobalUnmuteOnce() {
  if (unmuteArmed || !pendingAutoplayPlayers.length) return;
  unmuteArmed = true;
  const handler = () => { ensureUnmuted(); };
  // Capture a broad set of user gestures (mobile friendly)
  ['click','keydown','touchstart','pointerdown'].forEach(ev => {
    window.addEventListener(ev, handler, { once: true, passive: true });
  });
}
// iOS Safari cannot programmatically change iframe volume; show a one-time hint.
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
let iosHintShown = false;
function showIOSVolumeHint() {
  if (!isIOS || iosHintShown) return;
  iosHintShown = true;
  try {
    const hint = document.createElement('div');
    hint.textContent = 'On iOS, adjust device volume (app volume sliders are limited).';
    hint.style.cssText = 'position:fixed;left:50%;bottom:8px;transform:translateX(-50%);background:rgba(0,0,0,0.75);color:#ffe9b3;padding:6px 12px;border:1px solid rgba(255,233,179,0.25);border-radius:8px;font-size:0.65rem;z-index:999;max-width:280px;text-align:center;font-family:inherit;';
    document.body.appendChild(hint);
    setTimeout(()=>{ hint.style.transition='opacity .5s'; hint.style.opacity='0'; setTimeout(()=>hint.remove(), 1200); }, 4500);
  } catch(_) {}
}

// Enforce volume repeatedly on iOS (YouTube sometimes ignores first setVolume)
function enforcePlayerVolume(player, vol, attempts = 4, gap = 160) {
  try { player.setVolume(vol); } catch(_) {}
  if (attempts > 1) setTimeout(() => enforcePlayerVolume(player, vol, attempts - 1, gap), gap);
}

// Mobile helper: create cycle volume button that mirrors a hidden range input
function createCycleVolumeButton(i, slider) {
  const cycleVals = [0, 15, 40, 70]; // Off / Low / Med / High
  const btn = document.createElement('button');
  btn.className = 'vol-cycle';
  btn.type = 'button';
  btn.dataset.level = (function findIdx() {
    const cur = parseInt(slider.value, 10) || 0; let idx = 0;
    for (let k = 0; k < cycleVals.length; k++) if (cur >= cycleVals[k]) idx = k; return idx;
  })();
  function label(idx) {
    if (idx === 0) return slider.getAttribute('aria-label') ? slider.getAttribute('aria-label') + ' Off' : 'Off';
    return 'Lvl ' + idx;
  }
  function render() {
    const idx = parseInt(btn.dataset.level, 10);
    const vol = cycleVals[idx];
    slider.value = vol;
  const symbol = ['○','◔','◑','◕'][idx] || '◑';
  const shortLabel = (videos[i].label || '?').charAt(0);
  btn.textContent = shortLabel + symbol; // e.g. R○, F◑
    btn.setAttribute('aria-label', (videos[i].label || 'Sound') + ' ' + label(idx));
  setVolume(i, vol, true);
  }
  btn.addEventListener('click', () => {
    let idx = parseInt(btn.dataset.level, 10);
    idx = (idx + 1) % cycleVals.length;
    btn.dataset.level = idx;
    render();
    showIOSVolumeHint();
  });
  render();
  slider.insertAdjacentElement('afterend', btn);
  return btn;
}

// --- Fresh Mobile Layout ---------------------------------------------------
// Replaces the original controls with a bottom dock of compact chips
let mobileDockBuilt = false;
let playersReadyCount = 0;
function maybeBuildMobileDock() {
  if (mobileDockBuilt) return;
  const mq = window.matchMedia('(max-width: 600px)');
  if (!mq.matches) return; // only mobile
  // Ensure all non-hidden players ready (or at least created)
  const needed = videos.filter(v=>!v.hidden).length;
  if (playersReadyCount < needed) return;
  const existing = document.getElementById('controls');
  if (existing) existing.style.display = 'none';
  if (document.getElementById('mobile-sound-dock')) { mobileDockBuilt = true; return; }
  const dock = document.createElement('div');
  dock.id = 'mobile-sound-dock';
  dock.setAttribute('role','toolbar');
  dock.setAttribute('aria-label','Ambient sounds');
  document.body.appendChild(dock);
  document.body.classList.add('has-mobile-dock');
  // Hide standalone presets toggle if present
  const legacyPresetToggle = document.getElementById('mobile-presets-toggle');
  if (legacyPresetToggle) legacyPresetToggle.style.display = 'none';
  const cycleVals = [0,15,40,70];
  videos.forEach((v,i) => {
    if (v.hidden) return;
    const chip = document.createElement('button');
    chip.className = 'sound-chip';
    chip.type = 'button';
    chip.dataset.index = i;
    chip.dataset.level = '0';
    chip.textContent = (v.label||'?').charAt(0);
    chip.setAttribute('aria-label', v.label + ' off');
    dock.appendChild(chip);
    function applyLevel(lvl) {
      chip.dataset.level = ''+lvl;
      const vol = cycleVals[lvl];
  setVolume(i, vol, true);
    }
    chip.addEventListener('click', () => {
      let lvl = parseInt(chip.dataset.level,10); lvl = (lvl+1)%cycleVals.length; applyLevel(lvl); showIOSVolumeHint();
    });
    // Long press for popover slider
    let pressTimer = null; let longPress = false;
    chip.addEventListener('touchstart', e => { longPress=false; pressTimer = setTimeout(()=>{ longPress=true; openPopover(i, chip);}, 520); }, {passive:true});
    chip.addEventListener('touchend', ()=> { clearTimeout(pressTimer); });
    chip.addEventListener('mousedown', e => { if (e.button!==0) return; pressTimer = setTimeout(()=>{ openPopover(i, chip);}, 520); });
    chip.addEventListener('mouseup', ()=> clearTimeout(pressTimer));
    applyLevel(0);
  });
  // Presets chip
  const presetsChip = document.createElement('button');
  presetsChip.className = 'sound-chip presets-chip';
  presetsChip.type = 'button';
  presetsChip.textContent = 'PR';
  presetsChip.setAttribute('aria-label','Show presets');
  dock.appendChild(presetsChip);
  const presetsPanel = document.getElementById('audio-templates');
  if (presetsPanel) {
    presetsPanel.classList.add('dock-mode');
    presetsChip.addEventListener('click', () => {
      const open = presetsPanel.classList.toggle('open');
      presetsChip.classList.toggle('active', open);
      presetsChip.setAttribute('aria-label', open ? 'Hide presets' : 'Show presets');
    });
  }
  function openPopover(index, anchor) {
    closePopover();
    const pop = document.createElement('div');
    pop.className = 'sound-popover';
    const curVol = (typeof desiredVolumes[index] === 'number') ? desiredVolumes[index] : (players[index]?.getVolume?.()||0);
    pop.innerHTML = '<div class="pop-label">'+(videos[index].label||'Sound')+'</div>'+
      '<input type="range" min="0" max="100" value="'+curVol+'" class="pop-range">'+
      '<div class="pop-actions"><button type="button" class="pop-play">Play</button><button type="button" class="pop-close">Close</button></div>';
    document.body.appendChild(pop);
    positionPopover(pop, anchor);
    const range = pop.querySelector('.pop-range');
    const btnPlay = pop.querySelector('.pop-play');
    const btnClose = pop.querySelector('.pop-close');
    function syncPlayLabel() {
      btnPlay.textContent = isPlayerPlaying(index) ? 'Pause' : 'Play';
    }
    range.addEventListener('input', () => { const v = parseInt(range.value,10); setVolume(index, v, true); showIOSVolumeHint(); });
    btnPlay.addEventListener('click', ()=> { if (isPlayerPlaying(index)) safePause(index); else safePlay(index); syncPlayLabel(); });
    btnClose.addEventListener('click', closePopover);
    document.addEventListener('keydown', escClose, { once: true });
    syncPlayLabel();
  }
  function escClose(e){ if (e.key==='Escape') closePopover(); }
  function closePopover(){ const ex=document.querySelector('.sound-popover'); if (ex) ex.remove(); document.removeEventListener('keydown', escClose); }
  function positionPopover(pop, anchor) {
    const rect = anchor.getBoundingClientRect();
    pop.style.left = Math.min(window.innerWidth-180, Math.max(4, rect.left + rect.width/2 - 90))+'px';
    pop.style.top = (rect.top - 140 < 4 ? rect.bottom + 8 : rect.top - 140)+'px';
  }
  mobileDockBuilt = true;
}


// YouTube API ready callback (must be global)
function onYouTubeIframeAPIReady() { // eslint-disable-line no-unused-vars
  const playersContainer = document.getElementById('players');
  if (!playersContainer) return;

  videos.forEach((video, i) => {
    const host = document.createElement('div');
    host.id = 'player' + i;
    host.className = 'yt-player';
    // Hide all players visually (audio‑only); last one extra hidden off‑screen if flagged.
    host.style.width = '0';
    host.style.height = '0';
    host.style.overflow = 'hidden';
    if (video.hidden) {
      host.style.position = 'absolute';
      host.style.left = '-9999px';
    }
    playersContainer.appendChild(host);

  players[i] = new YT.Player(host.id, {
      height: '0',
      width: '0',
      videoId: video.id,
      playerVars: {
        autoplay: video.autoplay ? 1 : 0,
        controls: 0,
        disablekb: 1,
        fs: 0,
        loop: video.hidden ? 0 : 1, // loop audible ambience, not necessarily hidden theme
        playlist: video.id,
        modestbranding: 1,
        playsinline: 1
      },
      events: {
        onReady: ev => {
          const player = ev.target;
            // Initial volume: slider value if control exists, else 50.
          const slider = document.getElementById('vol' + i);
          const initialVolume = slider ? parseInt(slider.value, 10) : 50;
          // Lower default for autoplay ambience on mobile to avoid loud blast
          const targetVol = (isIOS && video.autoplay) ? Math.min(initialVolume, 15) : initialVolume;
          const persisted = typeof desiredVolumes[i] === 'number';
          enforcePlayerVolume(player, persisted ? desiredVolumes[i] : targetVol);
          if (video.autoplay) {
            player.mute();
            player.playVideo();
            pendingAutoplayPlayers.push(player);
            attachGlobalUnmuteOnce();
          } else {
            updateToggleButton(i, YT.PlayerState.PAUSED);
          }
          // Apply persisted preferences (volume already applied if persisted; but play state may differ)
          applyDesiredStateToReadyPlayer(i);
          refreshToggleButton(i);
          if (!video.hidden) { playersReadyCount++; maybeBuildMobileDock(); }
        },
        onStateChange: e => {
          if (!video.hidden) updateToggleButton(i, e.data);
        }
      }
    });

    // Wire UI controls (skip if hidden track)
    if (!video.hidden) {
      const toggle = document.getElementById('toggle' + i);
      const vol = document.getElementById('vol' + i);
      if (toggle) {
        toggle.addEventListener('click', () => {
          if (isPlayerPlaying(i)) safePause(i); else safePlay(i);
          showIOSVolumeHint();
        });
      }
      if (vol) {
        // If in mobile view, replace slider with cycle button (keep slider hidden for logic/presets)
        const mq = window.matchMedia('(max-width: 600px)');
        function applyMobileMode(e) {
          if (mq.matches && !vol.dataset.cycleAttached) {
            vol.dataset.cycleAttached = '1';
            vol.classList.add('hidden-range');
            createCycleVolumeButton(i, vol);
          } else if (!mq.matches && vol.dataset.cycleAttached) {
            // Desktop again: show slider; remove cycle button
            const next = vol.nextElementSibling;
            if (next && next.classList.contains('vol-cycle')) next.remove();
            vol.classList.remove('hidden-range');
            delete vol.dataset.cycleAttached;
          }
        }
        mq.addEventListener('change', applyMobileMode);
        applyMobileMode();
        vol.addEventListener('input', e => {
          const newVol = parseInt(e.target.value, 10);
          setVolume(i, newVol, true);
          showIOSVolumeHint();
        });
        // Some mobile browsers only fire change at end; also listen to change.
        vol.addEventListener('change', () => { ensureUnmuted(); showIOSVolumeHint(); });
      }
    }
  });
}

// Expose globally for the IFrame API
window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;

// DOMContentLoaded tasks (popup dismissal & defensive load check)
window.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('welcome-btn');
  if (btn) {
    // Defer showing until full load (images etc.)
    window.addEventListener('load', () => {
      const spinner = document.getElementById('loading-spinner');
      if (spinner) spinner.style.display = 'none';
    const etaEl = document.getElementById('eta');
    if (etaEl) etaEl.style.display = 'none';
      btn.style.display = 'inline-block';
      btn.focus();
    });
    btn.addEventListener('click', () => {
      const popup = document.getElementById('welcome-popup');
      if (popup) popup.style.display = 'none';
      // Master play: start any ambience tracks that are paused but have volume > 0
      players.forEach((p, i) => {
  if (!p || i >= videos.length - 1) return; // skip hidden theme
  const vol = typeof desiredVolumes[i] === 'number' ? desiredVolumes[i] : 0;
  if (vol > 0 && !isPlayerPlaying(i)) safePlay(i);
      });
    });
  }
  // Avoid double-loading: index.html already includes the API script; only add if missing.
  if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(tag);
  }

  // Pomodoro Timer Initialization
  initPomodoro();
  initAudioTemplates();
  initETAEstimation();
  initMobileUX();
  // In case players already ready quickly
  setTimeout(maybeBuildMobileDock, 1500);
});

// ----------------------------------------------------------------------------
// Pomodoro Timer Implementation
// Config: 25m work, 5m short break, 15m long break after 4 work sessions.
// ----------------------------------------------------------------------------
function initPomodoro() {
  const elTime = document.getElementById('pomo-time');
  if (!elTime) return; // Markup missing
  const elPhase = document.getElementById('pomo-phase');
  const elStart = document.getElementById('pomo-start');
  const elPause = document.getElementById('pomo-pause');
  const elReset = document.getElementById('pomo-reset');
  const elCycles = document.getElementById('pomo-cycles');
  const elSettings = document.getElementById('pomo-settings');
  const elSettingsToggle = document.getElementById('pomo-settings-toggle');
  const elApply = document.getElementById('pomo-apply');
  const inputWork = document.getElementById('pomo-work');
  const inputShort = document.getElementById('pomo-short');
  const inputLong = document.getElementById('pomo-long');
  const inputCycles = document.getElementById('pomo-cycles-input');

  // State (seconds)
  let cfg = {
    work: 25 * 60,
    short: 5 * 60,
    long: 15 * 60,
    longInterval: 4 // after N work sessions -> long break
  };
  let phase = 'work';
  let remaining = cfg.work;
  let workSessionsCompleted = 0;
  let timerId = null;
  let running = false;

  const fmt = s => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;

  function updateUI() {
    elTime.textContent = fmt(remaining);
    elPhase.textContent = phase === 'work' ? 'Work' : phase === 'short' ? 'Break' : 'Long Break';
    elCycles.textContent = `${workSessionsCompleted % (cfg.longInterval + 1)}/${cfg.longInterval}`;
    elStart.disabled = running;
    elPause.disabled = !running;
    elReset.disabled = running && remaining > 0 ? false : (!running && remaining !== cfg.work);
  }
  function switchPhase(next) {
    phase = next;
    if (phase === 'work') remaining = cfg.work;
    else if (phase === 'short') remaining = cfg.short;
    else remaining = cfg.long;
    updateUI();
  }
  function tick() {
    if (!running) return;
    remaining -= 1;
    if (remaining <= 0) {
      if (phase === 'work') {
        workSessionsCompleted += 1;
        if (workSessionsCompleted % cfg.longInterval === 0) switchPhase('long'); else switchPhase('short');
      } else {
        switchPhase('work');
      }
      try { beep(); } catch(_) {}
    }
    updateUI();
  }
  function start() { if (running) return; running = true; updateUI(); timerId = setInterval(tick, 1000); }
  function pause() { if (!running) return; running = false; clearInterval(timerId); updateUI(); }
  function reset() { pause(); phase = 'work'; remaining = cfg.work; workSessionsCompleted = 0; updateUI(); }

  function applySettings() {
    const w = clampInt(inputWork.value, 1, 180);
    const s = clampInt(inputShort.value, 1, 60);
    const l = clampInt(inputLong.value, 1, 180);
    const c = clampInt(inputCycles.value, 1, 12);
    cfg = { work: w*60, short: s*60, long: l*60, longInterval: c };
    inputWork.value = w; inputShort.value = s; inputLong.value = l; inputCycles.value = c;
    // Rebase timer only if not running or if current phase length exceeds new length to avoid overshoot.
    const currentMax = phase === 'work' ? cfg.work : phase === 'short' ? cfg.short : cfg.long;
    if (!running || remaining > currentMax) remaining = currentMax;
    updateUI();
  }
  function clampInt(val, min, max) {
    const n = parseInt(val, 10); if (isNaN(n)) return min; return Math.min(max, Math.max(min, n));
  }

  // Settings toggle
  if (elSettingsToggle && elSettings) {
    elSettingsToggle.addEventListener('click', () => {
      const open = elSettings.classList.toggle('hidden');
      elSettingsToggle.setAttribute('aria-expanded', (!open).toString());
    });
  }
  if (elApply) elApply.addEventListener('click', applySettings);

  // Accessibility: close settings with Escape when focused inside
  elSettings?.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      elSettings.classList.add('hidden');
      elSettingsToggle?.setAttribute('aria-expanded', 'false');
      elSettingsToggle?.focus();
    }
  });

  // Minimal beep
  function beep() {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 880;
    osc.connect(gain); gain.connect(ctx.destination);
    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
    osc.start(); osc.stop(ctx.currentTime + 0.45);
  }

  elStart.addEventListener('click', start);
  elPause.addEventListener('click', pause);
  elReset.addEventListener('click', reset);
  updateUI();
}

// ----------------------------------------------------------------------------
// Audio Templates (Presets) - apply volumes & play states quickly
// Template schema: { name: { volumes: [rain, thunder, fireplace, forest, snow, wind], playing: [bool...] } }
// Hidden theme track is unaffected.
// ----------------------------------------------------------------------------
function initAudioTemplates() {
  const panel = document.getElementById('audio-templates');
  if (!panel) return;

  const templates = {
    calmRain: {
      volumes: [70, 0, 15, 10, 0, 5],
      playing: [true, false, true, true, false, true]
    },
    storm: {
      volumes: [90, 85, 0, 15, 0, 25],
      playing: [true, true, false, true, false, true]
    },
    cozyFire: {
      volumes: [0, 0, 75, 5, 0, 8],
      playing: [false, false, true, true, false, true]
    },
    winter: {
      volumes: [10, 0, 25, 15, 65, 12],
      playing: [true, false, true, true, true, true]
    },
    forestBreeze: {
      volumes: [0, 0, 10, 55, 0, 40],
      playing: [false, false, true, true, false, true]
    }
  };

  panel.addEventListener('click', e => {
    const btn = e.target.closest('.tpl-btn');
    if (!btn) return;
    const key = btn.getAttribute('data-template');
    if (!key || !templates[key]) return;
    applyTemplate(templates[key]);
  });

  function applyTemplate(tpl) {
    // Only for visible ambience tracks (exclude hidden theme at end)
    for (let i = 0; i < videos.length - 1; i++) {
      const vol = clamp(tpl.volumes[i] ?? 0, 0, 100);
      const slider = document.getElementById('vol' + i); if (slider) slider.value = vol;
      setVolume(i, vol, false);
    }
    for (let i = 0; i < videos.length - 1; i++) {
      setPlayState(i, !!tpl.playing[i]);
      refreshToggleButton(i);
    }
  }

  function clamp(v, min, max) { return Math.min(max, Math.max(min, v)); }
}

// ----------------------------------------------------------------------------
// Controls collapse
// ----------------------------------------------------------------------------
// Collapse logic removed

// ----------------------------------------------------------------------------
// ETA Estimation (heuristic). If we can estimate (>1 sample) show remaining ms.
// ----------------------------------------------------------------------------
function initETAEstimation() {
  const etaEl = document.getElementById('eta');
  if (!etaEl) return;
  const start = performance.now();
  let samples = [];
  const interval = setInterval(() => {
    if (document.readyState === 'complete') { clearInterval(interval); return; }
    const resources = performance.getEntriesByType('resource');
    if (resources.length) {
      const last = resources[resources.length - 1];
      samples.push(last.responseEnd || last.duration || 0);
      if (samples.length > 4) samples = samples.slice(-4);
      if (samples.length >= 2) {
        const avg = samples.reduce((a,b)=>a+b,0)/samples.length;
        const elapsed = performance.now() - start;
        const estTotal = avg * 6;
        const remaining = estTotal - elapsed;
        if (remaining > 800) {
          etaEl.style.display = 'block';
          etaEl.textContent = 'Estimated time left: ' + formatETA(remaining);
        }
      }
    }
  }, 300);
  window.addEventListener('load', () => clearInterval(interval));
  function formatETA(ms) { const s = Math.ceil(ms/1000); if (s < 60) return s + 's'; return Math.floor(s/60)+'m '+(s%60)+'s'; }
}

// ----------------------------------------------------------------------------
// Mobile UX: toggle presets panel
// ----------------------------------------------------------------------------
function initMobileUX() {
  const toggle = document.getElementById('mobile-presets-toggle');
  const presets = document.getElementById('audio-templates');
  if (!toggle || !presets) return;
  const mq = window.matchMedia('(max-width: 600px)');
  function applyState() {
    if (mq.matches) {
      // hide presets by default on mobile
      if (toggle.getAttribute('aria-expanded') !== 'true') presets.style.display = 'none';
      toggle.style.display = 'flex';
    } else {
      presets.style.display = 'flex';
      toggle.style.display = 'none';
      toggle.setAttribute('aria-expanded','false');
    }
  }
  mq.addEventListener('change', applyState);
  applyState();
  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    const next = !expanded;
    toggle.setAttribute('aria-expanded', next.toString());
    presets.style.display = next ? 'flex' : 'none';
    toggle.textContent = next ? 'Close' : 'Presets';
  });
}
