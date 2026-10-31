/* Meal Plan — static PWA. Data and quantity helpers come from data.js. */
(function () {
  "use strict";
  var KEY = "romy-meal-plan-app-v1";
  var $app = document.getElementById("app");
  var $tabs = document.getElementById("tabs");
  var $bar = document.getElementById("bar");
  var $sub = document.getElementById("sub");
  var $toast = document.getElementById("toast");

  function fresh() {
    return { v: 1, ts: 0, picks: {}, servings: {}, checked: {}, themes: Object.assign({}, DEFAULT_THEMES), active: false, weekOf: "" };
  }
  function normalize(p) {
    var s = fresh();
    if (!p || typeof p !== "object") return s;
    s.ts = p.ts || 0;
    s.picks = {};
    DAYS.forEach(function (d) {
      var id = p.picks && p.picks[d];
      if (id === "skip" || (id && BY_ID[id])) s.picks[d] = id;
      var sv = p.servings && p.servings[d];
      if (sv > 0 && sv <= 16) s.servings[d] = sv;
      if (p.themes && typeof p.themes[d] === "string" && p.themes[d].trim()) s.themes[d] = p.themes[d];
    });
    s.checked = p.checked && typeof p.checked === "object" ? p.checked : {};
    s.active = !!p.active;
    s.weekOf = p.weekOf || "";
    return s;
  }

  // ---------- storage: localStorage primary, IndexedDB backup ----------
  function readLocal() {
    try { var raw = localStorage.getItem(KEY); return raw ? normalize(JSON.parse(raw)) : null; } catch (e) { return null; }
  }
  function idbOpen() {
    return new Promise(function (res) {
      try {
        var r = indexedDB.open("romy-meal-plan", 1);
        r.onupgradeneeded = function () { r.result.createObjectStore("kv"); };
        r.onsuccess = function () { res(r.result); };
        r.onerror = function () { res(null); };
      } catch (e) { res(null); }
    });
  }
  function idbGet() {
    return idbOpen().then(function (db) {
      return new Promise(function (res) {
        if (!db) return res(null);
        try {
          var g = db.transaction("kv", "readonly").objectStore("kv").get(KEY);
          g.onsuccess = function () { res(g.result ? normalize(g.result) : null); };
          g.onerror = function () { res(null); };
        } catch (e) { res(null); }
      });
    });
  }
  function idbSet(val) {
    return idbOpen().then(function (db) {
      if (!db) return false;
      return new Promise(function (res) {
        try {
          var tx = db.transaction("kv", "readwrite");
          tx.objectStore("kv").put(val, KEY);
          tx.oncomplete = function () { res(true); };
          tx.onerror = function () { res(false); };
        } catch (e) { res(false); }
      });
    });
  }
  var S = readLocal() || fresh();
  function save() {
    S.ts = Date.now();
    var json = JSON.stringify(S);
    try { localStorage.setItem(KEY, json); } catch (e) {}
    idbSet(JSON.parse(json));
  }
  function set(patch) { Object.assign(S, patch); save(); render(); }

  // ---------- helpers ----------
  function esc(x) {
    return String(x).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; });
  }
  function todayKey() { return DAYS[(new Date().getDay() + 6) % 7]; }
  function nextMonday() {
    var d = new Date(), dow = d.getDay();
    d.setDate(d.getDate() + (dow === 1 ? 0 : (8 - dow) % 7));
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  }
  function servingsFor(d) { return S.servings[d] || 4; }
  function pickedCount() { return DAYS.filter(function (d) { return S.picks[d] && S.picks[d] !== "skip"; }).length; }
  function toast(msg) {
    $toast.textContent = msg; $toast.classList.add("show");
    clearTimeout(toast._t); toast._t = setTimeout(function () { $toast.classList.remove("show"); }, 2200);
  }
  function grocery() {
    var map = {};
    DAYS.forEach(function (d) {
      var id = S.picks[d]; if (!id || id === "skip") return;
      var r = BY_ID[id]; if (!r) return;
      var f = servingsFor(d) / 4;
      r.ing.forEach(function (i) {
        if (i.c === "lf") return;
        var fam = famOf(i.u), key = i.sing.toLowerCase() + "|" + fam;
        var base = i.q * f * (fam === "vol" ? VOL[i.u] : fam === "wt" ? WT[i.u] : 1);
        if (!map[key]) map[key] = { key: key, sing: i.sing, plur: i.plur, cat: i.c, fam: fam, unit: i.u, amt: 0, days: [] };
        map[key].amt += base;
        if (map[key].days.indexOf(d) < 0) map[key].days.push(d);
      });
    });
    var groups = [];
    CAT_ORDER.forEach(function (c) {
      var items = Object.keys(map).map(function (k) { return map[k]; })
        .filter(function (g) { return g.cat === c; })
        .sort(function (a, b) { return a.sing.localeCompare(b.sing); });
      if (items.length) groups.push({ cat: c, items: items });
    });
    return groups;
  }
  function listText() {
    var lines = ["Groceries" + (S.weekOf ? " — week of " + S.weekOf : "")];
    grocery().forEach(function (g) {
      var items = g.items.filter(function (i) { return !S.checked[i.key]; });
      if (!items.length) return;
      lines.push("", CAT_LABEL[g.cat].toUpperCase());
      items.forEach(function (i) { lines.push("- " + gLine(i)); });
    });
    return lines.join("\n");
  }
  function copy(text) {
    function fallback() {
      try {
        var ta = document.createElement("textarea");
        ta.value = text; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
        document.body.appendChild(ta); ta.select(); ta.setSelectionRange(0, text.length);
        var ok = document.execCommand("copy"); document.body.removeChild(ta); return ok;
      } catch (e) { return false; }
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).then(function () { return true; }, function () { return fallback(); });
    }
    return Promise.resolve(fallback());
  }

  // ---------- view state (not persisted) ----------
  var today = todayKey();
  var V = { tab: S.active ? "week" : "plan", day: today, planDay: firstOpen(), open: "", hideDone: false, showText: false, showBackup: false };
  function firstOpen() { for (var i = 0; i < DAYS.length; i++) if (!S.picks[DAYS[i]]) return DAYS[i]; return "mon"; }

  // ---------- render ----------
  function dayStrip(sel, withDots) {
    return '<div class="days">' + DAYS.map(function (d) {
      var id = S.picks[d];
      var sub = id === "skip" ? "Night off" : id && BY_ID[id] ? BY_ID[id].name : S.themes[d];
      return '<button class="day' + (d === sel ? " on" : "") + '" data-act="day" data-d="' + d + '">' +
        '<div class="d">' + DAY_SHORT[d] + (d === today ? '<span class="t">today</span>' : "") +
        (withDots && id ? '<span class="dot"></span>' : "") + "</div>" +
        '<div class="s">' + esc(sub) + "</div></button>";
    }).join("") + "</div>";
  }
  function ingList(r, f) {
    return '<ul class="ing">' + r.ing.map(function (i) {
      return "<li><span>" + esc(ingText(i, f)) + "</span>" + (i.c === "lf" ? '<span class="tag">leftover</span>' : "") + "</li>";
    }).join("") + "</ul>";
  }
  function steps(r) {
    return '<ol class="steps">' + r.steps.map(function (s) { return "<li>" + esc(s) + "</li>"; }).join("") + "</ol>";
  }

  function renderWeek() {
    var d = V.day, id = S.picks[d], r = id && id !== "skip" ? BY_ID[id] : null;
    var h = dayStrip(d, false);
    h += "<h2>" + esc(DAY_FULL[d]) + " · " + esc(S.themes[d]) + "</h2>";
    if (r) {
      h += '<div class="card"><div class="opt"><div class="info"><div class="name" style="font-size:19px">' + esc(r.name) + '</div>' +
        '<div class="desc">' + esc(r.desc) + '</div><div class="meta">' + esc(r.time) + "</div></div></div>" +
        '<div class="stepper"><span class="cap" style="margin:0">Servings</span><button data-act="serv" data-n="-1" aria-label="Fewer">−</button><b>' +
        servingsFor(d) + '</b><button data-act="serv" data-n="1" aria-label="More">+</button></div>' +
        "<h3>Ingredients</h3>" + ingList(r, servingsFor(d) / 4) + "<h3>Steps</h3>" + steps(r) + "</div>";
    } else {
      h += '<p class="cap">' + (id === "skip" ? "Night off. No cooking planned." : "No recipe picked for this day.") + "</p>" +
        '<div class="row"><button class="btn" data-act="pickfor" data-d="' + d + '">Pick for ' + DAY_SHORT[d] + "</button></div>";
    }
    h += '<div class="row" style="margin-top:22px"><button class="btn" data-act="newweek">Plan a new week</button></div>';
    return h;
  }
  function renderPlan() {
    var d = V.planDay, cur = S.picks[d];
    var decided = DAYS.filter(function (x) { return !!S.picks[x]; }).length;
    var h = dayStrip(d, true);
    h += "<h2>" + esc(DAY_FULL[d]) + " · " + esc(S.themes[d]) + "</h2><p class=\"cap\">" + decided + " of 7 days decided</p>";
    h += RECIPES[d].map(function (r) {
      var on = cur === r.id, open = V.open === r.id;
      return '<div class="card' + (on ? " on" : "") + '"><div class="opt"><div class="info" data-act="toggle" data-id="' + r.id + '">' +
        '<div class="name">' + esc(r.name) + '</div><div class="desc">' + esc(r.desc) + "</div>" +
        '<div class="meta">' + esc(r.time) + ' · serves 4 · <button class="link" data-act="toggle" data-id="' + r.id + '">' + (open ? "Hide" : "See recipe") + "</button></div></div>" +
        '<button class="btn pick' + (on ? " primary" : "") + '" data-act="pick" data-id="' + r.id + '">' + (on ? "Picked" : "Pick") + "</button></div>" +
        (open ? "<h3>Ingredients</h3>" + ingList(r, 1) + "<h3>Steps</h3>" + steps(r) : "") + "</div>";
    }).join("");
    h += '<div class="row"><button class="btn" data-act="pick" data-id="skip">' + (cur === "skip" ? "Skipped (undo)" : "Skip this day") + "</button>" +
      '<button class="btn" data-act="clear">Clear all picks</button></div>';
    return h;
  }
  function renderList() {
    var groups = grocery(), total = 0, done = 0;
    groups.forEach(function (g) { g.items.forEach(function (i) { total++; if (S.checked[i.key]) done++; }); });
    if (!total) return '<p class="cap">Pick some recipes first, then your list shows up here.</p>';
    var h = '<p class="cap">' + done + " of " + total + " checked · Copy exports what's unchecked</p>" +
      '<div class="row"><button class="btn primary" data-act="copylist">Copy list</button>' +
      '<button class="btn" data-act="showtext">' + (V.showText ? "Hide text" : "Show as text") + "</button>" +
      '<button class="btn" data-act="hidedone">' + (V.hideDone ? "Show checked" : "Hide checked") + "</button>" +
      '<button class="btn" data-act="uncheck">Uncheck all</button></div>';
    if (V.showText) h += '<textarea readonly>' + esc(listText()) + "</textarea>";
    groups.forEach(function (g) {
      var items = V.hideDone ? g.items.filter(function (i) { return !S.checked[i.key]; }) : g.items;
      if (!items.length) return;
      h += "<h3>" + esc(CAT_LABEL[g.cat]) + "</h3>";
      h += items.map(function (i) {
        var on = !!S.checked[i.key];
        return '<div class="check' + (on ? " on" : "") + '" role="checkbox" aria-checked="' + on + '" data-act="check" data-key="' + esc(i.key) + '">' +
          '<span class="box">' + (on ? "✓" : "") + '</span><span class="lbl">' + esc(gLine(i)) + '</span><span class="m">' +
          i.days.map(function (d) { return DAY_SHORT[d]; }).join(" · ") + "</span></div>";
      }).join("");
    });
    return h;
  }
  function renderThemes() {
    var h = "<h2>Day themes</h2><p class=\"cap\">Rename any day. Each day keeps its recipe options.</p>";
    h += DAYS.map(function (d) {
      return '<label class="field"><span>' + DAY_FULL[d] + '</span><input data-theme="' + d + '" value="' + esc(S.themes[d]) + '" autocomplete="off"></label>';
    }).join("");
    h += '<div class="row"><button class="btn" data-act="resetthemes">Reset themes</button></div>';
    h += '<h3>Backup</h3><p class="cap">Your plan saves on this phone automatically. A backup lets you move it to another device.</p>' +
      '<div class="row"><button class="btn" data-act="copybackup">Copy backup</button><button class="btn" data-act="showbackup">' +
      (V.showBackup ? "Hide restore" : "Restore a backup") + "</button></div>";
    if (V.showBackup) {
      h += '<textarea id="restore" placeholder="Paste a backup here"></textarea><div class="row"><button class="btn primary" data-act="restore">Restore</button></div>';
    }
    return h;
  }

  function render() {
    var tabs = [];
    if (S.active) tabs.push(["week", "Week"]);
    tabs.push(["plan", "Plan"]);
    if (pickedCount()) tabs.push(["list", "List"]);
    tabs.push(["themes", "Themes"]);
    if (!tabs.some(function (t) { return t[0] === V.tab; })) V.tab = "plan";
    $tabs.innerHTML = tabs.map(function (t) {
      return '<button role="tab" data-act="tab" data-tab="' + t[0] + '" class="' + (V.tab === t[0] ? "on" : "") + '">' + t[1] + "</button>";
    }).join("");
    $sub.textContent = S.active && S.weekOf ? "Week of " + S.weekOf + " · " + pickedCount() + " dinners" : "Pick a dinner for each night";
    $app.innerHTML = V.tab === "week" ? renderWeek() : V.tab === "plan" ? renderPlan() : V.tab === "list" ? renderList() : renderThemes();
    var n = pickedCount();
    if (V.tab === "plan") {
      $bar.className = "show";
      $bar.innerHTML = '<button class="btn primary" data-act="start"' + (n ? "" : " disabled") + ">" +
        (n ? (S.active ? "Save week (" + n + ")" : "Start week (" + n + ")") : "Pick a recipe to start") + "</button>";
    } else { $bar.className = ""; $bar.innerHTML = ""; }
  }
  function toTop() { try { window.scrollTo({ top: 0, behavior: "smooth" }); } catch (e) { window.scrollTo(0, 0); } }

  // ---------- events ----------
  function onClick(e) {
    var el = e.target.closest("[data-act]");
    if (!el) return;
    var act = el.getAttribute("data-act");
    if (act === "tab") { V.tab = el.getAttribute("data-tab"); if (V.tab === "week") V.day = today; render(); toTop(); return; }
    if (act === "day") {
      var d = el.getAttribute("data-d");
      if (V.tab === "week") V.day = d; else { V.planDay = d; V.open = ""; }
      render(); return;
    }
    if (act === "toggle") { e.stopPropagation(); var id0 = el.getAttribute("data-id"); V.open = V.open === id0 ? "" : id0; render(); return; }
    if (act === "pick") {
      var id = el.getAttribute("data-id"), pd = V.planDay;
      var picks = Object.assign({}, S.picks);
      if (picks[pd] === id) delete picks[pd]; else picks[pd] = id;
      S.picks = picks; save();
      if (picks[pd]) {
        var idx = DAYS.indexOf(pd);
        var nxt = DAYS.slice(idx + 1).filter(function (x) { return !picks[x]; })[0];
        if (nxt) { V.planDay = nxt; V.open = ""; render(); toTop(); return; }
      }
      render(); return;
    }
    if (act === "clear") {
      if (!confirm("Clear all picks and checkmarks?")) return;
      V.planDay = "mon"; set({ picks: {}, servings: {}, checked: {}, active: false, weekOf: "" }); return;
    }
    if (act === "newweek") {
      if (!confirm("Start planning a new week? This clears this week's picks and checkmarks.")) return;
      V.tab = "plan"; V.planDay = "mon"; set({ picks: {}, servings: {}, checked: {}, active: false, weekOf: "" }); toTop(); return;
    }
    if (act === "start") {
      V.tab = "week"; V.day = today; set({ active: true, weekOf: nextMonday(), checked: {} }); toTop(); toast("Week saved"); return;
    }
    if (act === "pickfor") { V.planDay = el.getAttribute("data-d"); V.tab = "plan"; render(); toTop(); return; }
    if (act === "serv") {
      var sv = Math.min(16, Math.max(1, servingsFor(V.day) + parseInt(el.getAttribute("data-n"), 10)));
      var servings = Object.assign({}, S.servings); servings[V.day] = sv; set({ servings: servings }); return;
    }
    if (act === "check") {
      var k = el.getAttribute("data-key"), ch = Object.assign({}, S.checked);
      if (ch[k]) delete ch[k]; else ch[k] = true;
      set({ checked: ch }); return;
    }
    if (act === "copylist") {
      copy(listText()).then(function (ok) {
        if (ok) toast("List copied"); else { V.showText = true; render(); toast("Select the text to copy"); }
      });
      return;
    }
    if (act === "showtext") { V.showText = !V.showText; render(); return; }
    if (act === "hidedone") { V.hideDone = !V.hideDone; render(); return; }
    if (act === "uncheck") { set({ checked: {} }); return; }
    if (act === "resetthemes") { set({ themes: Object.assign({}, DEFAULT_THEMES) }); return; }
    if (act === "copybackup") {
      var b = "MEALPLAN:" + btoa(unescape(encodeURIComponent(JSON.stringify(S))));
      copy(b).then(function (ok) { toast(ok ? "Backup copied" : "Copy blocked"); });
      return;
    }
    if (act === "showbackup") { V.showBackup = !V.showBackup; render(); return; }
    if (act === "restore") {
      var txt = (document.getElementById("restore").value || "").trim();
      try {
        var body = txt.indexOf("MEALPLAN:") === 0 ? decodeURIComponent(escape(atob(txt.slice(9)))) : txt;
        var p = normalize(JSON.parse(body));
        S = p; save(); V.tab = S.active ? "week" : "plan"; V.day = today; V.showBackup = false; render(); toast("Plan restored");
      } catch (err) { toast("That backup didn't work"); }
      return;
    }
  }
  document.addEventListener("click", onClick);
  document.addEventListener("input", function (e) {
    var d = e.target && e.target.getAttribute && e.target.getAttribute("data-theme");
    if (!d) return;
    S.themes[d] = e.target.value; save(); // no re-render while typing
  });
  document.addEventListener("change", function (e) {
    var d = e.target && e.target.getAttribute && e.target.getAttribute("data-theme");
    if (!d) return;
    if (!e.target.value.trim()) S.themes[d] = DEFAULT_THEMES[d];
    save(); render();
  });
  // Re-open on today's weekday when the app comes back after a day change.
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState !== "visible") return;
    var t = todayKey();
    if (t !== today) { today = t; if (V.tab === "week") V.day = t; render(); }
  });

  render();

  // If localStorage was wiped but the IndexedDB backup survived, restore it.
  idbGet().then(function (b) {
    if (b && b.ts > S.ts) {
      S = b;
      try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {}
      V.tab = S.active ? "week" : "plan"; V.day = today; V.planDay = firstOpen(); render();
    } else if (S.ts) { idbSet(JSON.parse(JSON.stringify(S))); }
  });
  if (navigator.storage && navigator.storage.persist) { try { navigator.storage.persist(); } catch (e) {} }
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () { navigator.serviceWorker.register("sw.js").catch(function () {}); });
  }
})();
