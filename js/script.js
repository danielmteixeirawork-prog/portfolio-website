(function () {
  var root = document.documentElement;
  var toggle = document.getElementById('themeToggle');
  var stored = null;
  try { stored = localStorage.getItem('theme'); } catch (e) {}

  function apply(theme) {
    if (theme === 'light' || theme === 'dark') {
      root.setAttribute('data-theme', theme);
    } else {
      root.removeAttribute('data-theme');
    }
    if (toggle) toggle.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
  }

  function systemPrefersDark() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  apply(stored);

  if (toggle) {
    toggle.addEventListener('click', function () {
      var current = root.getAttribute('data-theme') || (systemPrefersDark() ? 'dark' : 'light');
      var next = current === 'dark' ? 'light' : 'dark';
      apply(next);
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
  }

  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();

/* ---------- toast ---------- */
function showToast(message) {
  var toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(function () {
    toast.classList.remove('is-visible');
  }, 1800);
}

function copyText(text, successMessage) {
  function done(ok) {
    showToast(ok ? successMessage : 'Could not copy — copy it manually');
  }
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(false); });
  } else {
    done(false);
  }
}

/* ---------- scroll reveal ---------- */
(function () {
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion || !('IntersectionObserver' in window)) return;

  var targets = document.querySelectorAll(
    '.about-text, .about-card, .skills-group, .marquee-block, .project-card, .contact-text, .terminal-block'
  );
  if (!targets.length) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(function (el) {
    el.classList.add('reveal');
    observer.observe(el);
  });
})();

/* ---------- copy buttons ---------- */
(function () {
  var buttons = document.querySelectorAll('.copy-btn[data-copy]');
  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      copyText(btn.getAttribute('data-copy'), 'Copied to clipboard');
    });
  });
})();

/* ---------- command palette ---------- */
(function () {
  var backdrop = document.getElementById('paletteBackdrop');
  var input = document.getElementById('paletteInput');
  var list = document.getElementById('paletteList');
  var trigger = document.getElementById('paletteTrigger');
  var kbd = document.getElementById('paletteKbd');
  if (!backdrop || !input || !list || !trigger) return;

  var isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform || navigator.userAgent || '');
  if (kbd) kbd.textContent = isMac ? '⌘K' : 'Ctrl K';

  function scrollToId(id) {
    var el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function toggleTheme() {
    var themeBtn = document.getElementById('themeToggle');
    if (themeBtn) themeBtn.click();
  }

  var commands = [
    { label: 'Go to About', hint: '#about', run: function () { scrollToId('about'); } },
    { label: 'Go to Skills', hint: '#skills', run: function () { scrollToId('skills'); } },
    { label: 'Go to Projects', hint: '#projects', run: function () { scrollToId('projects'); } },
    { label: 'Go to Contact', hint: '#contact', run: function () { scrollToId('contact'); } },
    {
      label: 'Copy email', hint: 'danielteixeira00@outlook.pt',
      run: function () { copyText('danielteixeira00@outlook.pt', 'Copied email to clipboard'); }
    },
    {
      label: 'Open GitHub', hint: 'github.com/danielmteixeirawork-prog',
      run: function () { window.open('https://github.com/danielmteixeirawork-prog', '_blank', 'noopener'); }
    },
    {
      label: 'Open LinkedIn', hint: 'linkedin.com/in/daniel-teixeira',
      run: function () { window.open('https://www.linkedin.com/in/daniel-teixeira-806b9b137', '_blank', 'noopener'); }
    },
    { label: 'Toggle theme', hint: 'light / dark', run: toggleTheme }
  ];

  var filtered = commands.slice();
  var activeIndex = 0;
  var lastFocused = null;

  function render() {
    list.innerHTML = '';
    if (!filtered.length) {
      var empty = document.createElement('li');
      empty.className = 'palette-empty';
      empty.textContent = 'No matching command';
      list.appendChild(empty);
      return;
    }
    filtered.forEach(function (cmd, i) {
      var li = document.createElement('li');
      li.className = 'palette-item' + (i === activeIndex ? ' is-active' : '');
      li.setAttribute('role', 'option');
      li.setAttribute('aria-selected', i === activeIndex ? 'true' : 'false');

      var prompt = document.createElement('span');
      prompt.className = 'prompt';
      prompt.textContent = '$';

      var label = document.createElement('span');
      label.className = 'palette-label';
      label.textContent = cmd.label;

      var hint = document.createElement('span');
      hint.className = 'palette-hint';
      hint.textContent = cmd.hint;

      li.appendChild(prompt);
      li.appendChild(label);
      li.appendChild(hint);

      li.addEventListener('mousedown', function (e) {
        e.preventDefault();
        run(i);
      });
      li.addEventListener('mouseenter', function () {
        activeIndex = i;
        render();
      });

      list.appendChild(li);
    });
  }

  function filterCommands() {
    var q = input.value.trim().toLowerCase();
    filtered = q
      ? commands.filter(function (cmd) { return cmd.label.toLowerCase().indexOf(q) !== -1; })
      : commands.slice();
    activeIndex = 0;
    render();
  }

  function run(i) {
    var cmd = filtered[i];
    if (!cmd) return;
    close();
    cmd.run();
  }

  function open() {
    lastFocused = document.activeElement;
    backdrop.hidden = false;
    input.value = '';
    filterCommands();
    input.focus();
    document.addEventListener('keydown', onKeydown);
  }

  function close() {
    backdrop.hidden = true;
    document.removeEventListener('keydown', onKeydown);
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
  }

  function onKeydown(e) {
    if (e.key === 'Escape') { e.preventDefault(); close(); return; }
    if (e.key === 'ArrowDown') { e.preventDefault(); activeIndex = Math.min(activeIndex + 1, filtered.length - 1); render(); return; }
    if (e.key === 'ArrowUp') { e.preventDefault(); activeIndex = Math.max(activeIndex - 1, 0); render(); return; }
    if (e.key === 'Enter') { e.preventDefault(); run(activeIndex); return; }
  }

  input.addEventListener('input', filterCommands);

  backdrop.addEventListener('mousedown', function (e) {
    if (e.target === backdrop) close();
  });

  trigger.addEventListener('click', function () {
    if (backdrop.hidden) open(); else close();
  });

  document.addEventListener('keydown', function (e) {
    var isK = e.key === 'k' || e.key === 'K';
    if (isK && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      if (backdrop.hidden) open(); else close();
    }
  });
})();
