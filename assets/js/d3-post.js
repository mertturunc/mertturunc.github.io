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

  function colors() {
    var out = {};
    Object.keys(TOKEN_KEYS).forEach(function (key) {
      out[key] = readToken(TOKEN_KEYS[key]);
    });
    return out;
  }

  function themeName() {
    return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  }

  function onTheme(fn) {
    if (typeof fn !== 'function') return function () {};
    function run() {
      fn({ theme: themeName(), colors: colors() });
    }
    run();
    window.addEventListener('themechange', run);
    return function () {
      window.removeEventListener('themechange', run);
    };
  }

  function width(el) {
    return el ? el.clientWidth : 0;
  }

  global.postD3 = {
    colors: colors,
    onTheme: onTheme,
    width: width,
    theme: themeName
  };
})(window);
