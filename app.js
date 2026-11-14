/* Meal Plan — static PWA. Data and quantity helpers come from data.js. */
(function () {
  "use strict";
  var KEY = "romy-meal-plan-app-v1";
  var MAXSERV = 48;
  var $app = document.getElementById("app");
  var $tabs = document.getElementById("tabs");
  var $bar = document.getElementById("bar");
  var $sub = document.getElementById("sub");
  var $toast = document.getElementById("toast");

  function fresh() {
    return { v: 1, ts: 0, picks: {}, servings: {}, alternatives: {}, checked: {}, active: false, weekOf: "", extras: [], inventory: [], needAnyway: {}, restock: [], cooked: {} };
  }
  function dayOf(id) {
    for (var i = 0; i < DAYS.length; i++) if (RECIPES[DAYS[i]].some(function (r) { return r.id === id; })) return DAYS[i];
    return null;
  }
  function normalize(p) {
    var s = fresh();
    if (!p || typeof p !== "object") return s;
    s.ts = p.ts || 0;
    s.picks = {};
    var moved = {};
    DAYS.forEach(function (d) {
      var id = p.picks && p.picks[d];
      var sv = p.servings && p.servings[d];
      if (!(sv > 0 && sv <= MAXSERV)) sv = 0;
      if (id === "skip") s.picks[d] = id;
      else if (id && BY_ID[id]) {
        var home = dayOf(id);
        if (home === d) { s.picks[d] = id; if (sv) s.servings[d] = sv; }
        else if (home) moved[home] = { id: id, sv: sv }; // e.g. pizza moved from Friday to Sunday
      } // picks for recipes that no longer exist are dropped
    });
    Object.keys(moved).forEach(function (d) {
      if (!s.picks[d]) { s.picks[d] = moved[d].id; if (moved[d].sv) s.servings[d] = moved[d].sv; }
    });
    s.extras = Array.isArray(p.extras) ? p.extras.filter(function (id, n, a) { return BY_ID[id] && a.indexOf(id) === n; }) : [];
    Object.keys(p.servings || {}).forEach(function (k) {
      var v = p.servings[k];
      if (k.indexOf("x:") === 0 && BY_ID[k.slice(2)] && v > 0 && v <= MAXSERV) s.servings[k] = v;
    });
    Object.keys(p.alternatives || {}).forEach(function (id) {
      var r = BY_ID[id], choice = p.alternatives[id];
      if (r && r.alternatives && r.alternatives.options[choice]) s.alternatives[id] = choice;
    });
    s.checked = p.checked && typeof p.checked === "object" ? p.checked : {};
    s.inventory = normInventory(p.inventory);
    s.needAnyway = {};
    if (p.needAnyway && typeof p.needAnyway === "object") Object.keys(p.needAnyway).forEach(function (k) { if (p.needAnyway[k]) s.needAnyway[k] = true; });
    s.restock = normRestock(p.restock);
    s.cooked = {};
    if (p.cooked && typeof p.cooked === "object") Object.keys(p.cooked).forEach(function (slot) {
      var c = p.cooked[slot];
      var valid = DAYS.indexOf(slot) >= 0 ? !!s.picks[slot] && s.picks[slot] !== "skip" : String(slot).indexOf("x:") === 0 && s.extras.indexOf(slot.slice(2)) >= 0;
      if (!valid || !c || typeof c !== "object") return;
      var ops = (Array.isArray(c.ops) ? c.ops : []).map(function (op) {
        if (!op) return null;
        if (op.t === "upd") { var b = normInventory([op.before])[0], a = normInventory([op.after])[0]; return b && a ? { t: "upd", before: b, after: a } : null; }
        if (op.t === "del") { var it = normInventory([op.item])[0]; return it ? { t: "del", item: it, idx: op.idx >= 0 ? op.idx : 0 } : null; }
        return null;
      }).filter(Boolean);
      s.cooked[slot] = { ts: +c.ts || 0, ops: ops, restock: Array.isArray(c.restock) ? c.restock.filter(function (x) { return typeof x === "string"; }) : [] };
    });
    s.active = !!p.active && (DAYS.some(function (d) { return s.picks[d] && s.picks[d] !== "skip"; }) || s.extras.length > 0);
    s.weekOf = s.active ? p.weekOf || "" : "";
    return s;
  }

  // ---------- inventory (what's already on hand) ----------
  var LOCS = [["pantry", "Pantry"], ["fridge", "Fridge"], ["freezer", "Freezer"]];
  function locOk(l) { return LOCS.some(function (x) { return x[0] === l; }); }
  function normInventory(list) {
    if (!Array.isArray(list)) return [];
    var seen = {};
    return list.filter(function (it) { return it && typeof it.name === "string" && it.name.trim(); }).map(function (it, n) {
      var id = typeof it.id === "string" && it.id && !seen[it.id] ? it.id : "i" + Date.now().toString(36) + n;
      seen[id] = true;
      return { id: id, name: it.name.trim().slice(0, 120), amt: typeof it.amt === "string" ? it.amt.trim().slice(0, 60) : "",
        date: typeof it.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(it.date) ? it.date : "", loc: locOk(it.loc) ? it.loc : "pantry",
        qty: qtyOk(it.qty) ? { n: it.qty.n, fam: it.qty.fam, unit: typeof it.qty.unit === "string" ? it.qty.unit : "" } : parseQty(typeof it.amt === "string" ? it.amt : ""),
        cat: CAT_ORDER.indexOf(it.cat) >= 0 ? it.cat : "" };
    });
  }
  function normRestock(list) {
    if (!Array.isArray(list)) return [];
    var seen = {};
    return list.filter(function (r) { return r && typeof r.name === "string" && r.name.trim(); }).map(function (r, n) {
      var id = typeof r.id === "string" && r.id && !seen[r.id] ? r.id : "r" + Date.now().toString(36) + n;
      seen[id] = true;
      return { id: id, name: r.name.trim().slice(0, 120), cat: CAT_ORDER.indexOf(r.cat) >= 0 ? r.cat : "ot" };
    });
  }
  // ---------- quantities: exact amounts in base units (tsp for volume, oz for weight, count for everything else) ----------
  function qtyOk(q) { return q && typeof q === "object" && typeof q.n === "number" && isFinite(q.n) && q.n > 0 && typeof q.fam === "string"; }
  var UF = { "\u00BC": .25, "\u00BD": .5, "\u00BE": .75, "\u2153": 1 / 3, "\u2154": 2 / 3, "\u215B": .125, "\u215C": .375, "\u215D": .625, "\u215E": .875 };
  var UFR = "[\u00BC\u00BD\u00BE\u2153\u2154\u215B\u215C\u215D\u215E]";
  var UNIT_ALIAS = { tsp: "tsp", teaspoon: "tsp", teaspoons: "tsp", tbsp: "tbsp", tbs: "tbsp", tbl: "tbsp", tablespoon: "tbsp", tablespoons: "tbsp",
    cup: "cup", cups: "cup", ml: "ml", milliliter: "ml", milliliters: "ml", millilitre: "ml", l: "l", liter: "l", liters: "l", litre: "l", litres: "l",
    oz: "oz", ounce: "oz", ounces: "oz", lb: "lb", lbs: "lb", pound: "lb", pounds: "lb", g: "g", gram: "g", grams: "g", kg: "kg", kilogram: "kg", kilograms: "kg" };
  var EXTRA_VOL = { "fl oz": 6, "fluid ounce": 6, "fluid ounces": 6, pint: 96, pints: 96, pt: 96, quart: 192, quarts: 192, qt: 192, gallon: 768, gallons: 768, gal: 768 };
  function parseNum(t) {
    t = t.trim(); var v = null, m;
    if ((m = t.match(/^(\d+)\s+(\d+)\/(\d+)/))) v = +m[1] + m[2] / m[3];
    else if ((m = t.match(/^(\d+)\/(\d+)/))) v = m[1] / m[2];
    else if ((m = t.match(new RegExp("^(\\d+(?:[.,]\\d+)?)\\s*(" + UFR + ")?")))) v = parseFloat(m[1].replace(",", ".")) + (m[2] ? UF[m[2]] : 0);
    else if ((m = t.match(new RegExp("^(" + UFR + ")")))) v = UF[m[1]];
    if (v === null || !isFinite(v)) return null;
    return [v, t.slice(m[0].length).trim()];
  }
  function countUnit(w) {
    if (PLURAL[w]) return w;
    for (var k in PLURAL) if (PLURAL[k] === w) return k;
    return singular(w);
  }
  function parseQty(text) {
    if (!text || typeof text !== "string") return null;
    var parts = text.split("+"), total = 0, fam = null, unit = "";
    for (var i = 0; i < parts.length; i++) {
      var pn = parseNum(parts[i]); if (!pn) return null;
      var rest = pn[1].toLowerCase().replace(/\./g, "").replace(/\s+/g, " ").trim(), f, u, mult;
      if (!rest) { f = "u:"; u = ""; mult = 1; }
      else if (EXTRA_VOL[rest]) { f = "vol"; u = "cup"; mult = EXTRA_VOL[rest]; }
      else {
        var w = rest.split(" ")[0], al = UNIT_ALIAS[rest] || UNIT_ALIAS[w];
        if (al) { f = VOL[al] ? "vol" : "wt"; u = al; mult = VOL[al] || WT[al]; }
        else { u = countUnit(w); f = "u:" + u; mult = 1; }
      }
      if (fam && fam !== f) return null;
      fam = f; if (!unit) unit = u; total += pn[0] * mult;
    }
    return total > 0 ? { n: total, fam: fam, unit: unit } : null;
  }
  function formatQty(q) {
    if (!qtyOk(q)) return "";
    if (q.fam === "vol" || q.fam === "wt") return gQty({ amt: q.n, fam: q.fam });
    var n = fmtNum(q.n);
    return [n, unitLabel(q.unit, oneOrLess(n) ? 1 : 2)].filter(Boolean).join(" ");
  }
  // Amount a recipe ingredient uses at the chosen servings, in the same base units.
  function needOf(i, f) {
    if (!(i.q > 0) || i.u === "-") return null;
    var fam = famOf(i.u);
    return { n: i.q * f * (fam === "vol" ? VOL[i.u] : fam === "wt" ? WT[i.u] : 1), fam: fam, unit: i.u };
  }
  function locForCat(c) { return c === "fr" ? "freezer" : c === "pr" || c === "me" || c === "da" ? "fridge" : "pantry"; }
  function newId(p) { return p + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }

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
  try { if (localStorage.getItem(KEY)) localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {}
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
  // A "slot" is a weekday key ("mon") or an extra recipe added from a section ("x:<recipe id>").
  function isExtra(slot) { return String(slot).indexOf("x:") === 0; }
  function selectedRecipe(r) {
    if (!r || !r.alternatives) return r;
    var a = r.alternatives, choice = S.alternatives[r.id] || a.default, opt = a.options[choice];
    if (!opt.ing) return r;
    return Object.assign({}, r, {
      ing: r.ing.slice(0, a.ingredientStart).concat(opt.ing),
      steps: r.steps.slice(0, a.stepStart).concat(opt.steps),
      alternativeNote: opt.note, alternativeCredit: opt, desc: opt.desc || r.desc, time: opt.time || r.time
    });
  }
  function recipeFor(d) {
    if (isExtra(d)) { var xid = d.slice(2); return S.extras.indexOf(xid) >= 0 ? selectedRecipe(BY_ID[xid]) : null; }
    var id = S.picks[d]; return id && id !== "skip" ? selectedRecipe(BY_ID[id]) : null;
  }
  var HOUSEHOLD = 4; // meals default to 4 servings, scaled from the source yield
  function defServ(r) { return r && r.keep ? r.serves : HOUSEHOLD; } // baked goods keep the source yield
  function servingsFor(d) {
    if (S.servings[d]) return S.servings[d];
    return defServ(isExtra(d) ? BY_ID[d.slice(2)] : recipeFor(d));
  }
  function slots() { return DAYS.concat(S.extras.map(function (id) { return "x:" + id; })); }
  function slotOrder(a, b) { var ia = DAYS.indexOf(a), ib = DAYS.indexOf(b); return (ia < 0 ? 7 : ia) - (ib < 0 ? 7 : ib); }
  function slotShort(d) { return isExtra(d) ? "Extra" : DAY_SHORT[d]; }
  function secOf(id) { for (var i = 0; i < SECTIONS.length; i++) if (SECTIONS[i].recipes.some(function (r) { return r.id === id; })) return SECTIONS[i].id; return SECTIONS[0].id; }
  function servLabel(r) { return r.yieldUnit ? "Makes" : "Servings"; }
  // Grocery list: round packaged/count items up to whole units you can buy, noting the amount used.
  function shopLine(g) {
    var frac = g.amt > 0 && Math.abs(g.amt - Math.round(g.amt)) > 0.01;
    if (!frac || g.fam === "vol" || g.fam === "wt" || g.unit === "handful") return gLine(g);
    var whole = Math.ceil(g.amt - 0.01);
    var buy = Object.assign({}, g, { amt: whole });
    return gLine(buy) + " (use " + fmtNum(g.amt) + ")";
  }
  function srcNote(r) { return !r.keep && r.serves !== HOUSEHOLD ? "Source makes " + r.serves + ", scaled to your servings" : ""; }
  function pickedCount() { return DAYS.filter(function (d) { return S.picks[d] && S.picks[d] !== "skip"; }).length; }
  function snapshot() { return JSON.stringify({ inventory: S.inventory, needAnyway: S.needAnyway, restock: S.restock, cooked: S.cooked }); }
  function toastUndo(msg, snap) {
    $toast.innerHTML = '<span>' + esc(msg) + '</span><button class="tundo" data-act="undo">Undo</button>';
    $toast.classList.add("show", "act"); V.undoSnap = snap;
    clearTimeout(toast._t); toast._t = setTimeout(function () { $toast.classList.remove("show", "act"); V.undoSnap = null; }, 7000);
  }
  function toast(msg) {
    $toast.classList.remove("act"); V.undoSnap = null;
    $toast.textContent = msg; $toast.classList.add("show");
    clearTimeout(toast._t); toast._t = setTimeout(function () { $toast.classList.remove("show"); }, 2200);
  }
  function grocery() {
    var map = {};
    slots().forEach(function (d) {
      var r = recipeFor(d); if (!r || S.cooked[d]) return; // cooked meals no longer need shopping
      var f = servingsFor(d) / r.serves;
      r.ing.forEach(function (i, idx) {
        if (i.c === "lf") return;
        var fam = famOf(i.u), key = i.sing.toLowerCase() + "|" + fam;
        var base = i.q * f * (fam === "vol" ? VOL[i.u] : fam === "wt" ? WT[i.u] : 1);
        if (!map[key]) map[key] = { key: key, sing: i.sing, plur: i.plur, cat: i.c, fam: fam, unit: i.u, amt: 0, practical: false, days: [], uses: [] };
        map[key].amt += base;
        map[key].practical = map[key].practical || !!i.practical;
        map[key].uses.push({ d: d, idx: idx });
        if (map[key].days.indexOf(d) < 0) map[key].days.push(d);
      });
    });
    var withQty = {};
    Object.keys(map).forEach(function (k) { if (map[k].amt > 0) withQty[map[k].sing.toLowerCase()] = true; });
    var seenZero = {}, orphan = {};
    Object.keys(map).forEach(function (k) {
      var g = map[k], n = g.sing.toLowerCase();
      if (g.amt > 0) return;
      if (withQty[n] || seenZero[n]) { seenZero[n] = true; orphan[n] = (orphan[n] || []).concat(g.uses); delete map[k]; return; }
      seenZero[n] = true;
    });
    // "to taste" duplicates were merged into the item with the same name: keep their recipe links.
    Object.keys(orphan).forEach(function (n) {
      var k = Object.keys(map).filter(function (x) { return map[x].sing.toLowerCase() === n; })[0];
      if (!k) return;
      orphan[n].forEach(function (u) { map[k].uses.push(u); if (map[k].days.indexOf(u.d) < 0) map[k].days.push(u.d); });
      map[k].days.sort(slotOrder);
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
    var lines = ["Groceries" + (S.weekOf ? " — week of " + S.weekOf : "")], keys = invKeys();
    listGroups(keys).forEach(function (g) {
      var items = g.items.filter(function (i) { return !S.checked[i.key] && !onHand(i, keys); });
      if (!items.length) return;
      lines.push("", CAT_LABEL[g.cat].toUpperCase());
      items.forEach(function (i) { lines.push("- " + shopLine(i) + (i.restock ? " (restock)" : "")); });
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
  var V = { cook: "", cookChoice: {}, undoSnap: null, tab: S.active ? "week" : "plan", day: today, planDay: firstOpen(), open: "", hideDone: false, showText: false, showBackup: false, focus: null, back: null, chooser: "", sec: SECTIONS[0].id, xopen: "" };
  function firstOpen() { for (var i = 0; i < DAYS.length; i++) if (!S.picks[DAYS[i]]) return DAYS[i]; return "mon"; }

  // ---------- render ----------
  function dayStrip(sel, withDots) {
    return '<div class="days">' + DAYS.map(function (d) {
      var id = S.picks[d];
      var sub = id === "skip" ? "Night off" : id && BY_ID[id] ? BY_ID[id].name : "";
      return '<button class="day' + (d === sel ? " on" : "") + '" data-act="day" data-d="' + d + '">' +
        '<div class="d">' + DAY_SHORT[d] + (d === today ? '<span class="t">today</span>' : "") +
        (withDots && id ? '<span class="dot"></span>' : "") + "</div>" +
        '<div class="s">' + esc(sub) + "</div></button>";
    }).join("") + "</div>";
  }
  function ingList(r, f, fx) {
    var a = r.alternatives;
    return (a ? '<p class="cap">Soup base + ' + esc(a.options[S.alternatives[r.id] || a.default].label) + ' only</p>' : '') + '<ul class="ing">' + r.ing.map(function (i, idx) {
      var hl = fx && fx.idx.indexOf(idx) >= 0;
      var used = "";
      if (hl && fx.idx[0] === idx) {
        used = '<div class="used">' + (fx.steps.length
          ? "Used in " + (fx.steps.length > 1 ? "steps " : "step ") + fx.steps.map(function (n) {
              return '<button class="link" data-act="tostep" data-n="' + n + '">' + (n + 1) + "</button>";
            }).join(", ") + " ↓"
          : "Not named in the steps") + "</div>";
      }
      return (r.ingredientGroups && r.ingredientGroups[idx] ? '<li class="alternative-heading">' + esc(r.ingredientGroups[idx]) + '</li>' : '') + (a && idx === a.ingredientStart ? '<li class="alternative-heading">' + esc(a.options[S.alternatives[r.id] || a.default].label) + ' ingredients</li>' : '') + '<li data-i="' + idx + '"' + (hl ? ' class="hl"' : "") + '><div class="ln"><span>' + esc(ingText(i, f)) + "</span>" +
        (i.c === "lf" ? '<span class="tag">leftover</span>' : "") + "</div>" + used + "</li>";
    }).join("") + "</ul>";
  }
  function alternativePicker(r) {
    if (!r.alternatives) return "";
    var a = r.alternatives, chosen = S.alternatives[r.id] || a.default;
    return '<fieldset class="alternatives"><legend>' + esc(a.label) + ' — choose one</legend><div class="row">' + Object.keys(a.options).map(function (key) {
      return '<button class="btn' + (key === chosen ? ' primary' : '') + '" data-act="alternative" data-id="' + r.id + '" data-choice="' + key + '" aria-pressed="' + (key === chosen) + '">' + esc(a.options[key].label) + '</button>';
    }).join('') + '</div><p class="cap">Only your selected option goes on the grocery list. Choice saves on this device.</p></fieldset>';
  }
  function credit(r) {
    if (!r.src && !r.by) return "";
    return '<p class="src">' + (r.by ? "Recipe by " + esc(r.by) : "") + (r.src ? (r.by ? " · " : "") + '<a href="' + esc(r.src) + '" target="_blank" rel="noopener">Source</a>' : "") + "</p>" + (r.alternativeCredit ? '<p class="src">Homemade dumplings by ' + esc(r.alternativeCredit.by) + ' · <a href="' + esc(r.alternativeCredit.src) + '" target="_blank" rel="noopener">Dumpling source</a></p>' : '');
  }
  function nameHtml(r) { return esc(r.name) + (r.incomplete ? ' <span class="inc">Incomplete source</span>' : ""); }
  function steps(r, fx) {
    var note = r.note ? '<p class="cap note-src">' + esc(r.note) + "</p>" : "";
    if (r.alternativeNote) note += '<p class="cap note-src">' + esc(r.alternativeNote) + "</p>";
    if (!r.steps.length) return note;
    return note + '<ol class="steps">' + r.steps.map(function (s, n) {
      var hl = fx && fx.steps.indexOf(n) >= 0;
      return '<li data-n="' + n + '"' + (hl ? ' class="hl"' : "") + ">" + (r.alternatives && n === r.alternatives.stepStart ? "<b>" + esc(r.alternatives.options[S.alternatives[r.id] || r.alternatives.default].label) + " option: </b>" : "") + (hl ? markTerms(esc(s), fx.res) : esc(s)) + "</li>";
    }).join("") + "</ol>";
  }

  // ---------- "used in": find the steps that mention an ingredient ----------
  var STOP = ("a an the of and or for to with optional serving servings large small medium big extra virgin fresh freshly low sodium " +
    "reduced-sodium reduced room temp temperature plain light shelled cooked grated shredded chopped minced diced sliced " +
    "unsalted salted vegan boneless skinless condensed refrigerated crushed mixed ground whole").split(" ");
  var GENERIC = "sauce oil cream juice seasoning powder paste soup seed seeds sheet sheets flakes vinegar leaf leaves cheese mix".split(" ");
  function words(t) {
    return t.toLowerCase().replace(/[^a-z\u00c0-\u024f\s-]/g, " ").split(/\s+/).filter(function (w) { return w && STOP.indexOf(w) < 0; });
  }
  function singular(w) {
    if (/ies$/.test(w)) return w.slice(0, -3) + "y";
    if (/(oes|ches|shes|xes|sses)$/.test(w)) return w.slice(0, -2);
    if (/(leaves|loaves|halves)$/.test(w)) return w.slice(0, -3) + "f";
    if (/[^s]s$/.test(w)) return w.slice(0, -1);
    return w;
  }
  function wordRe(w) {
    var b = singular(w), e = function (x) { return x.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); };
    if (/y$/.test(b)) return e(b.slice(0, -1)) + "(?:y|ies)";
    if (/f$/.test(b)) return e(b.slice(0, -1)) + "(?:f|ves|fs)";
    return e(b) + "(?:e?s)?";
  }
  function phraseRe(ws) { return new RegExp("(^|[^a-z\u00c0-\u024f])(" + ws.map(wordRe).join("[\\s-]+") + ")(?![a-z\u00c0-\u024f])", "gi"); }
  // Alternatives in a name: "chicken or vegetable broth" -> broth; "salmon or tuna" -> salmon, tuna; "(or tamari)" -> tamari.
  function alts(name) {
    var out = [], m, paren = /\(([^)]*)\)/g;
    while ((m = paren.exec(name))) {
      var p = m[1];
      if (!/\d|for |optional|temp|sodium|stir|virgin|choose one|amount not specified/i.test(p)) out = out.concat(p.replace(/^\s*or\s+/i, "").split(/\s+or\s+|\s+and\s+|,/));
    }
    var main = name.replace(/\([^)]*\)/g, " ").split(/\s+or\s+|,/);
    if (main.length > 1 && main[0].trim().split(/\s+/).length === 1 && words(main[main.length - 1]).length > 1) main = main.slice(1); // "chicken or vegetable broth"
    return main.concat(out).map(words).filter(function (ws) { return ws.length; });
  }
  function usesIn(r, ingName) {
    var res = [];
    alts(ingName).forEach(function (ws) {
      var head = ws[ws.length - 1];
      if (GENERIC.indexOf(singular(head)) < 0 && GENERIC.indexOf(head) < 0) { res.push(phraseRe([head])); return; }
      var levels = ws.length > 1 ? [[phraseRe(ws.slice(-2))], [phraseRe([ws[ws.length - 2]]), phraseRe([head])]] : [[phraseRe([head])]];
      for (var L = 0; L < levels.length; L++) {
        if (r.steps.some(function (s) { return levels[L].some(function (re) { re.lastIndex = 0; return re.test(s); }); })) { res = res.concat(levels[L]); return; }
      }
    });
    var hits = [];
    r.steps.forEach(function (s, n) { if (res.some(function (re) { re.lastIndex = 0; return re.test(s); })) hits.push(n); });
    return { steps: hits, res: res };
  }
  function markTerms(html, res) {
    res.forEach(function (re) { re.lastIndex = 0; html = html.replace(re, function (all, pre, w) { return pre + "<mark>" + w + "</mark>"; }); });
    return html;
  }
  // Inventory matching: same words after dropping sizes/descriptors and singularizing ("Onions" = "large onion").
  var MATCH_STOP = "frozen canned dried organic ripe raw uncooked can cans jar jars bag bags package packages pack box bunch".split(" ");
  function matchKey(ws) {
    return ws.map(singular).filter(function (w) { return MATCH_STOP.indexOf(w) < 0; }).sort().join(" ");
  }
  function invKeys() {
    var out = {};
    S.inventory.forEach(function (it) { var k = matchKey(words(it.name.replace(/\([^)]*\)/g, " "))); if (k) out[k] = it; });
    return out;
  }
  function onHandFor(item, keys) {
    keys = keys || invKeys();
    var names = [words(item.sing.replace(/\([^)]*\)/g, " "))].concat(alts(item.sing));
    for (var n = 0; n < names.length; n++) { var k = matchKey(names[n]); if (k && keys[k]) return keys[k]; }
    return null;
  }
  function keyOfName(name) { return matchKey(words(String(name).replace(/\([^)]*\)/g, " "))); }
  function pruneRestock(inv, rs) {
    var keys = {}; inv.forEach(function (it) { keys[keyOfName(it.name)] = true; });
    return rs.filter(function (r) { return !keys[keyOfName(r.name)]; });
  }
  function restockItems(keys) {
    keys = keys || invKeys();
    return S.restock.filter(function (r) { return !keys[keyOfName(r.name)]; }).map(function (r) {
      return { key: "restock:" + r.id, id: r.id, sing: r.name, plur: r.name, cat: r.cat, fam: "u:", unit: "", amt: 0, days: [], uses: [], restock: true };
    });
  }
  function listGroups(keys) {
    var groups = grocery();
    restockItems(keys).forEach(function (r) {
      var g = groups.filter(function (x) { return x.cat === r.cat; })[0];
      if (!g) { g = { cat: r.cat, items: [] }; groups.push(g); }
      g.items.push(r);
    });
    groups.sort(function (a, b) { return CAT_ORDER.indexOf(a.cat) - CAT_ORDER.indexOf(b.cat); });
    return groups;
  }
  function onHand(item, keys) { return !S.needAnyway[item.key] && !!onHandFor(item, keys); }
  function findItem(key) {
    var out = null;
    grocery().forEach(function (g) { g.items.forEach(function (i) { if (i.key === key) out = i; }); });
    return out;
  }
  function goToUse(item, d) {
    var r = recipeFor(d); if (!r) return;
    var idx = item.uses.filter(function (u) { return u.d === d; }).map(function (u) { return u.idx; });
    var u = usesIn(r, r.ing[idx[0]].sing);
    if (!V.back) V.back = { y: window.scrollY || 0 };
    if (isExtra(d)) { V.tab = "recipes"; V.sec = secOf(d.slice(2)); V.xopen = d.slice(2); }
    else { V.tab = "week"; V.day = d; }
    V.chooser = "";
    V.focus = { d: d, idx: idx, steps: u.steps, res: u.res };
    render();
    var li = $app.querySelector('.ing li[data-i="' + idx[0] + '"]');
    if (li) {
      scrollToEl(li);
      li.classList.add("flash");
      setTimeout(function () { li.classList.remove("flash"); }, 1600);
    }
  }
  function scrollToEl(el) {
    try { el.scrollIntoView({ behavior: "smooth", block: "center" }); } catch (e) { el.scrollIntoView(); }
  }

  function stepper(r, slot) {
    return '<div class="stepper"><span class="cap" style="margin:0">' + servLabel(r) + '</span><button data-act="serv" data-slot="' + slot + '" data-n="-1" aria-label="Fewer">−</button><b>' +
      servingsFor(slot) + '</b><button data-act="serv" data-slot="' + slot + '" data-n="1" aria-label="More">+</button>' +
      (r.yieldUnit ? '<span class="cap" style="margin:0">' + esc(r.yieldUnit) + "</span>" : "") + "</div>";
  }
  function recipeBody(r, slot, fx) {
    return stepper(r, slot) + alternativePicker(r) + (srcNote(r) ? '<p class="cap" style="margin:-4px 0 8px">' + esc(srcNote(r)) + "</p>" : "") +
      "<h3>Ingredients</h3>" + ingList(r, servingsFor(slot) / r.serves, fx) + "<h3>Steps</h3>" + steps(r, fx) + credit(r);
  }
  function cookBtn(slot) {
    var done = !!S.cooked[slot];
    return '<button class="btn cook' + (done ? " done" : "") + '" data-act="cook" data-slot="' + esc(slot) + '" aria-pressed="' + done + '">' + (done ? "✓ Cooked" : "Cooked") + "</button>";
  }
  function renderWeek() {
    var d = V.day, id = S.picks[d], r = id && id !== "skip" ? selectedRecipe(BY_ID[id]) : null;
    var fx = V.focus && V.focus.d === d ? V.focus : null;
    var h = dayStrip(d, false);
    h += "<h2>" + esc(DAY_FULL[d]) + "</h2>";
    if (r) {
      h += '<div class="card"><div class="opt"><div class="info"><div class="name" style="font-size:19px">' + nameHtml(r) + '</div>' +
        '<div class="desc">' + esc(r.desc) + '</div><div class="meta">' + esc(r.time) + "</div></div>" + cookBtn(d) + "</div>" +
        recipeBody(r, d, fx) + "</div>";
    } else {
      h += '<p class="cap">' + (id === "skip" ? "Night off. No cooking planned." : "No recipe picked for this day.") + "</p>" +
        '<div class="row"><button class="btn" data-act="pickfor" data-d="' + d + '">Pick for ' + DAY_SHORT[d] + "</button></div>";
    }
    if (S.extras.length) {
      h += "<h3>Extras this week</h3>" + S.extras.map(function (xid) {
        var xr = BY_ID[xid];
        return '<div class="xline"><button class="xrow" data-act="openx" data-id="' + xid + '"><span>' + esc(xr.name) + '</span><span class="m">' +
          esc(secName(secOf(xid))) + ' ›</span></button>' + cookBtn("x:" + xid) + "</div>";
      }).join("");
    }
    h += '<div class="row" style="margin-top:22px"><button class="btn" data-act="newweek">Plan a new week</button></div>';
    return h;
  }
  function renderPlan() {
    var d = V.planDay, cur = S.picks[d];
    var decided = DAYS.filter(function (x) { return !!S.picks[x]; }).length;
    var h = dayStrip(d, true);
    h += "<h2>" + esc(DAY_FULL[d]) + "</h2><p class=\"cap\">" + decided + " of 7 days decided</p>";
    if (!RECIPES[d].length) {
      h += '<div class="empty"><div class="empty-t">No recipes yet</div><div class="cap" style="margin:4px 0 0">Send recipes to Meal Planner to add them.</div></div>';
    }
    h += RECIPES[d].map(function (r) {
      r = selectedRecipe(r);
      var on = cur === r.id, open = V.open === r.id;
      return '<div class="card' + (on ? " on" : "") + '"><div class="opt"><div class="info" data-act="toggle" data-id="' + r.id + '">' +
        '<div class="name">' + nameHtml(r) + '</div><div class="desc">' + esc(r.desc) + "</div>" +
        '<div class="meta">' + esc(r.time) + ' · ' + (r.keep ? "makes " + r.serves + (r.yieldUnit ? " " + esc(r.yieldUnit) : "") : "serves " + HOUSEHOLD + (r.serves !== HOUSEHOLD ? " (source makes " + r.serves + ")" : "")) + ' · <button class="link" data-act="toggle" data-id="' + r.id + '">' + (open ? "Hide" : "See recipe") + "</button></div></div>" +
        '<button class="btn pick' + (on ? " primary" : "") + '" data-act="pick" data-id="' + r.id + '">' + (on ? "Picked" : "Pick") + "</button></div>" +
        (open ? alternativePicker(r) + "<h3>Ingredients</h3>" + ingList(r, defServ(r) / r.serves) + "<h3>Steps</h3>" + steps(r) + credit(r) : "") + "</div>";
    }).join("");
    var btns = "";
    if (RECIPES[d].length || cur === "skip") btns += '<button class="btn" data-act="pick" data-id="skip">' + (cur === "skip" ? "Skipped (undo)" : "Skip this day") + "</button>";
    if (decided) btns += '<button class="btn" data-act="clear">Clear all picks</button>';
    if (btns) h += '<div class="row">' + btns + "</div>";
    return h;
  }
  function renderList() {
    var keys = invKeys(), groups = listGroups(keys), total = 0, done = 0, have = [];
    groups.forEach(function (g) { g.items.forEach(function (i) {
      if (onHand(i, keys)) { have.push(i); return; }
      total++; if (S.checked[i.key]) done++;
    }); });
    if (!total && !have.length) return '<p class="cap">Pick some recipes first, then your list shows up here.</p>';
    // (restock items count toward total above)
    var h = '<p class="cap">' + done + " of " + total + " checked · Tap the box to check off, the name to see the recipe</p>" +
      '<div class="row"><button class="btn primary" data-act="copylist">Copy list</button>' +
      '<button class="btn" data-act="showtext">' + (V.showText ? "Hide text" : "Show as text") + "</button>" +
      '<button class="btn" data-act="hidedone">' + (V.hideDone ? "Show checked" : "Hide checked") + "</button>" +
      '<button class="btn" data-act="uncheck">Uncheck all</button></div>';
    if (have.length) h += '<p class="cap onhand-cap">' + have.length + (have.length === 1 ? " item is" : " items are") + " in your inventory and left off the copied list.</p>";
    if (V.showText) h += '<textarea readonly>' + esc(listText()) + "</textarea>";
    function daysOf(i) { return i.days.map(slotShort).filter(function (x, n, a) { return a.indexOf(x) === n; }).join(" · "); }
    groups.forEach(function (g) {
      var items = g.items.filter(function (i) { return !onHand(i, keys) && !(V.hideDone && S.checked[i.key]); });
      if (!items.length) return;
      h += "<h3>" + esc(CAT_LABEL[g.cat]) + "</h3>";
      h += items.map(function (i) {
        var on = !!S.checked[i.key], forced = S.needAnyway[i.key] && onHandFor(i, keys);
        return '<div class="check' + (on ? " on" : "") + '" data-row="' + esc(i.key) + '">' +
          '<button class="hit" role="checkbox" aria-checked="' + on + '" aria-label="Check off ' + esc(i.sing) + '" data-act="check" data-key="' + esc(i.key) + '">' +
          '<span class="box">' + (on ? "✓" : "") + "</span></button>" +
          (i.restock
            ? '<div class="go static"><span class="lbl">' + esc(i.sing) + ' <span class="badge">Restock</span></span></div>' +
              '<button class="btn ihave" data-act="ihave" data-restock="' + esc(i.id) + '" aria-label="I have ' + esc(i.sing) + '">I have it</button>' +
              '<button class="x" data-act="restockremove" data-id="' + esc(i.id) + '" aria-label="Remove ' + esc(i.sing) + ' from list">✕</button>'
            : '<button class="go" data-act="usedin" data-key="' + esc(i.key) + '" aria-label="Show where ' + esc(i.sing) + ' is used">' +
              '<span class="lbl">' + esc(shopLine(i)) + (forced ? ' <span class="badge">Need anyway</span>' : "") + '</span><span class="m">' +
              daysOf(i) + '</span><span class="chev">›</span></button>' +
              (forced ? '<button class="undo" data-act="needanyway" data-key="' + esc(i.key) + '" aria-label="Back to on hand">Undo</button>' : "") +
              '<button class="btn ihave" data-act="ihave" data-key="' + esc(i.key) + '" aria-label="I have ' + esc(i.sing) + '">I have it</button>') + "</div>";
      }).join("");
    });
    if (have.length) {
      h += '<details class="onhand"' + (V.onHandOpen ? " open" : "") + '><summary><span>On hand</span><span class="cnt">' + have.length + '</span><span class="m">Not on the copied list</span></summary>';
      h += have.map(function (i) {
        var inv = onHandFor(i, keys);
        return '<div class="check have" data-row="' + esc(i.key) + '">' +
          '<button class="go" data-act="usedin" data-key="' + esc(i.key) + '" aria-label="Show where ' + esc(i.sing) + ' is used">' +
          '<span class="lbl">' + esc(shopLine(i)) + ' <span class="badge">On hand</span>' +
          '<span class="m sub">' + esc(locName(inv.loc)) + ": " + esc(inv.name) + (inv.amt ? " · " + esc(inv.amt) : "") + "</span></span>" +
          '<span class="m">' + daysOf(i) + '</span></button>' +
          '<button class="btn need" data-act="needanyway" data-key="' + esc(i.key) + '">Need anyway</button></div>';
      }).join("") + "</details>";
    }
    return h;
  }
  function locName(l) { for (var i = 0; i < LOCS.length; i++) if (LOCS[i][0] === l) return LOCS[i][1]; return "Pantry"; }
  function fmtDate(d) {
    var p = d.split("-"), dt = new Date(+p[0], +p[1] - 1, +p[2]);
    return dt.toLocaleDateString(undefined, { month: "short", day: "numeric", year: dt.getFullYear() === new Date().getFullYear() ? undefined : "numeric" });
  }
  function isoToday() { var t = new Date(); return t.getFullYear() + "-" + String(t.getMonth() + 1).padStart(2, "0") + "-" + String(t.getDate()).padStart(2, "0"); }
  function invForm(it, mode) {
    var loc = it ? it.loc : V.invLoc || "pantry";
    return '<form class="invform" data-form="' + mode + '"' + (it ? ' data-id="' + esc(it.id) + '"' : "") + ">" +
      '<label class="field"><span>Item</span><input name="name" required maxlength="120" autocomplete="off" placeholder="e.g. Black beans" value="' + esc(it ? it.name : "") + '"></label>' +
      '<div class="invgrid"><label class="field"><span>Amount (optional)</span><input name="amt" maxlength="60" autocomplete="off" placeholder="e.g. 2 cans" value="' + esc(it ? it.amt : "") + '"></label>' +
      '<label class="field"><span>' + (loc === "freezer" ? "Frozen on" : "Best by") + ' (optional)</span><input name="date" type="date" value="' + esc(it ? it.date : "") + '"></label></div>' +
      '<div class="seg" role="radiogroup" aria-label="Where">' + LOCS.map(function (x) {
        return '<label class="segopt"><input type="radio" name="loc" value="' + x[0] + '"' + (x[0] === loc ? " checked" : "") + "><span>" + x[1] + "</span></label>";
      }).join("") + "</div>" +
      '<div class="row"><button class="btn primary" type="submit">' + (mode === "invadd" ? "Add item" : "Save") + "</button>" +
      (mode === "invedit" ? '<button class="btn" type="button" data-act="invcancel">Cancel</button><button class="btn danger" type="button" data-act="invremove" data-id="' + esc(it.id) + '">Remove</button>' : "") +
      "</div></form>";
  }
  function renderInventory() {
    var h = '<h2>Inventory</h2><p class="cap">What you already have. Matching grocery items are marked On hand and left off the copied list.</p>';
    h += '<input class="search" type="search" data-inv-search placeholder="Search inventory" aria-label="Search inventory" value="' + esc(V.invQ || "") + '">';
    h += V.invAdding ? '<div class="card">' + invForm(null, "invadd") + "</div>" :
      '<div class="row"><button class="btn primary" data-act="invnew">+ Add item</button></div>';
    var today0 = isoToday();
    LOCS.forEach(function (x) {
      var items = S.inventory.filter(function (it) { return it.loc === x[0]; }).sort(function (a, b) { return a.name.localeCompare(b.name); });
      h += '<section class="invsec" data-loc="' + x[0] + '"><h3>' + x[1] + ' <span class="cnt">' + items.length + "</span></h3>";
      if (!items.length) h += '<p class="cap invnone">Nothing here yet.</p>';
      h += items.map(function (it) {
        if (V.invEdit === it.id) return '<div class="card invrow-edit" data-inv="' + esc(it.id) + '" data-name="' + esc(it.name.toLowerCase()) + '">' + invForm(it, "invedit") + "</div>";
        var past = it.date && x[0] !== "freezer" && it.date < today0;
        var meta = [it.amt ? esc(it.amt) : "", it.date ? (x[0] === "freezer" ? "Frozen " : "Best by ") + esc(fmtDate(it.date)) : ""].filter(Boolean).join(" · ");
        return '<div class="invrow" data-inv="' + esc(it.id) + '" data-name="' + esc((it.name + " " + it.amt).toLowerCase()) + '">' +
          '<button class="go" data-act="invedit" data-id="' + esc(it.id) + '" aria-label="Edit ' + esc(it.name) + '"><span class="lbl">' + esc(it.name) +
          (meta ? '<span class="m sub">' + meta + "</span>" : "") + "</span>" + (past ? '<span class="badge warn">Past date</span>' : "") + '<span class="chev">›</span></button>' +
          '<button class="x" data-act="invremove" data-id="' + esc(it.id) + '" aria-label="Remove ' + esc(it.name) + '">✕</button></div>';
      }).join("");
      h += '<p class="cap invnomatch" hidden>No matches.</p></section>';
    });
    return h;
  }
  function applyInvSearch() {
    var q = (V.invQ || "").trim().toLowerCase();
    Array.prototype.forEach.call($app.querySelectorAll(".invsec"), function (sec) {
      var rows = sec.querySelectorAll("[data-inv]"), shown = 0;
      Array.prototype.forEach.call(rows, function (r) {
        var hit = !q || r.getAttribute("data-name").indexOf(q) >= 0 || r.classList.contains("invrow-edit");
        r.hidden = !hit; if (hit) shown++;
      });
      var nm = sec.querySelector(".invnomatch"); if (nm) nm.hidden = !(q && rows.length && !shown);
    });
  }
  function secName(id) { for (var i = 0; i < SECTIONS.length; i++) if (SECTIONS[i].id === id) return SECTIONS[i].name; return ""; }
  function renderRecipes() {
    var sec = SECTIONS.filter(function (x) { return x.id === V.sec; })[0] || SECTIONS[0];
    var h = '<div class="chips">' + SECTIONS.map(function (x) {
      var n = x.recipes.filter(function (r) { return S.extras.indexOf(r.id) >= 0; }).length;
      return '<button class="chip' + (x.id === sec.id ? " on" : "") + '" data-act="sec" data-sec="' + x.id + '">' + esc(x.name) +
        (n ? ' <span class="cnt">' + n + "</span>" : "") + "</button>";
    }).join("") + "</div>";
    h += "<h2>" + esc(sec.name) + '</h2><p class="cap">Add a recipe to this week and its ingredients join your grocery list.</p>';
    if (!sec.recipes.length) h += '<div class="empty"><div class="empty-t">No recipes yet</div></div>';
    h += sec.recipes.map(function (r) {
      var on = S.extras.indexOf(r.id) >= 0, open = V.xopen === r.id, slot = "x:" + r.id;
      var fx = open && V.focus && V.focus.d === slot ? V.focus : null;
      return '<div class="card' + (on ? " on" : "") + '"><div class="opt"><div class="info" data-act="xtoggle" data-id="' + r.id + '">' +
        '<div class="name">' + nameHtml(r) + '</div><div class="desc">' + esc(r.desc) + "</div>" +
        '<div class="meta">' + esc(r.time) + ' · <button class="link" data-act="xtoggle" data-id="' + r.id + '">' + (open ? "Hide" : "See recipe") + "</button></div></div>" +
        '<button class="btn pick' + (on ? " primary" : "") + '" data-act="extra" data-id="' + r.id + '">' + (on ? "Added ✓" : "Add to week") + "</button></div>" +
        (open ? recipeBody(r, slot, fx) : "") + "</div>";
    }).join("");
    return h;
  }
  function renderBackup() {
    var h = "<h2>Backup</h2><p class=\"cap\">Your plan saves on this phone automatically. A backup lets you move it to another device.</p>" +
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
    if (pickedCount() || S.extras.length || S.restock.length) tabs.push(["list", "List"]);
    tabs.push(["recipes", "Other recipes"]);
    tabs.push(["inventory", "Inventory"]);
    tabs.push(["backup", "Backup"]);
    if (!tabs.some(function (t) { return t[0] === V.tab; }) && !(V.tab === "week" && V.back)) V.tab = "plan";
    $tabs.innerHTML = tabs.map(function (t) {
      return '<button role="tab" data-act="tab" data-tab="' + t[0] + '" class="' + (V.tab === t[0] ? "on" : "") + '">' + t[1] + "</button>";
    }).join("");
    $sub.textContent = S.active && S.weekOf ? "Week of " + S.weekOf + " · " + pickedCount() + " dinners" : "Pick a dinner for each night";
    $app.innerHTML = V.tab === "week" ? renderWeek() : V.tab === "plan" ? renderPlan() : V.tab === "list" ? renderList() : V.tab === "recipes" ? renderRecipes() : V.tab === "inventory" ? renderInventory() : renderBackup();
    if (V.tab === "inventory") applyInvSearch();
    var n = pickedCount();
    var anyRecipes = DAYS.some(function (x) { return RECIPES[x].length > 0; });
    if (V.tab === "plan" && (anyRecipes || n)) {
      $bar.className = "show";
      $bar.innerHTML = '<button class="btn primary" data-act="start"' + (n ? "" : " disabled") + ">" +
        (n ? (S.active ? "Save week (" + n + ")" : "Start week (" + n + ")") : "Pick a recipe to start") + "</button>";
    } else if ((V.tab === "week" || V.tab === "recipes") && V.back) {
      $bar.className = "show";
      $bar.innerHTML = '<button class="btn primary" data-act="backlist">‹ Back to grocery list</button>';
    } else { $bar.className = ""; $bar.innerHTML = ""; }
    renderSheet();
  }
  // What "Cooked" takes out of inventory: matching items, summed per inventory item, scaled to chosen servings.
  function cookPlan(slot) {
    var r = recipeFor(slot); if (!r) return [];
    var f = servingsFor(slot) / r.serves, keys = invKeys(), by = {}, order = [];
    r.ing.forEach(function (i) {
      if (i.c === "lf") return;
      var inv = onHandFor({ sing: i.sing, key: "" }, keys); if (!inv) return;
      var e = by[inv.id];
      if (!e) { e = by[inv.id] = { inv: inv, need: 0, ok: qtyOk(inv.qty), cat: i.c }; order.push(inv.id); }
      var nd = needOf(i, f);
      if (nd && e.ok && nd.fam === inv.qty.fam) e.need += nd.n; else e.ok = false;
    });
    return order.map(function (id) {
      var e = by[id];
      if (e.ok) { e.left = e.inv.qty.n - e.need; e.zero = e.left <= Math.max(1e-9, e.inv.qty.n * 1e-6); }
      return e;
    });
  }
  function renderCookSheet($s) {
    var slot = V.cook, r = recipeFor(slot);
    if (!r) { V.cook = ""; $s.className = ""; $s.innerHTML = ""; return; }
    var plan = cookPlan(slot), rows = "";
    plan.forEach(function (e) {
      var it = e.inv, nm = '<b>' + esc(it.name) + '</b> <span class="m">' + esc(locName(it.loc)) + "</span>";
      if (e.ok) {
        rows += '<div class="cookrow" data-inv="' + esc(it.id) + '"><div>' + nm + '</div><div class="cq">' + esc(it.amt) + " → " +
          (e.zero ? '<span class="zero">used up · back on grocery list</span>' : esc(formatQty({ n: e.left, fam: it.qty.fam, unit: it.qty.unit })) + " left") + "</div></div>";
      } else {
        var ch = V.cookChoice[it.id] || "some";
        rows += '<div class="cookrow ask" data-inv="' + esc(it.id) + '"><div>' + nm + '</div><div class="cq">' + (it.amt ? esc(it.amt) : "No amount") +
          ' · amounts can’t be compared</div><div class="seg">' +
          [["some", "Still have some"], ["used", "Used up"]].map(function (o) {
            return '<label class="segopt"><input type="radio" name="cook-' + esc(it.id) + '" data-cookid="' + esc(it.id) + '" value="' + o[0] + '"' + (ch === o[0] ? " checked" : "") + "><span>" + o[1] + "</span></label>";
          }).join("") + "</div></div>";
      }
    });
    $s.className = "show";
    $s.innerHTML = '<div class="scrim" data-act="closesheet"></div><div class="panel" role="dialog" aria-label="Cooked">' +
      '<div class="pt">Cooked: ' + esc(r.name) + "</div>" +
      '<p class="cap">' + servingsFor(slot) + " " + (r.yieldUnit ? esc(r.yieldUnit) : "servings") + ". " +
      (plan.length ? "This comes out of your inventory:" : "Nothing in this recipe is in your inventory.") + "</p>" + rows +
      '<div class="row"><button class="btn primary" data-act="cookconfirm" style="flex:1">Confirm cooked</button>' +
      '<button class="btn" data-act="closesheet">Cancel</button></div></div>';
  }
  function applyCook(slot) {
    var plan = cookPlan(slot), snap = snapshot(), inv = S.inventory.slice(), ops = [], zeros = [];
    plan.forEach(function (e) {
      var k = -1; inv.forEach(function (x, n) { if (x.id === e.inv.id) k = n; }); if (k < 0) return;
      var cur = inv[k];
      if (e.ok && !e.zero) {
        var nq = { n: e.left, fam: cur.qty.fam, unit: cur.qty.unit }, after = Object.assign({}, cur, { qty: nq, amt: formatQty(nq) });
        ops.push({ t: "upd", before: cur, after: after }); inv[k] = after;
      } else if ((e.ok && e.zero) || (!e.ok && V.cookChoice[cur.id] === "used")) {
        ops.push({ t: "del", item: cur, idx: k }); inv.splice(k, 1); zeros.push({ item: cur, cat: cur.cat || e.cat });
      }
    });
    // Ran out: if this week's recipes still need it, it simply leaves "On hand"; otherwise it goes on the list as Restock.
    var cooked = Object.assign({}, S.cooked); cooked[slot] = { ts: Date.now(), ops: ops, restock: [] };
    var prevCooked = S.cooked; S.cooked = cooked; var groups = grocery(); S.cooked = prevCooked;
    var rs = S.restock.slice(), added = [];
    zeros.forEach(function (z) {
      var k1 = {}; k1[keyOfName(z.item.name)] = z.item;
      var needed = groups.some(function (g) { return g.items.some(function (i) { return !!onHandFor(i, k1); }); });
      var dup = rs.some(function (r) { return keyOfName(r.name) === keyOfName(z.item.name); });
      if (!needed && !dup) { var rid = newId("r"); rs.push({ id: rid, name: z.item.name, cat: z.cat || "ot" }); added.push(rid); }
    });
    cooked[slot].restock = added;
    V.cook = ""; V.cookChoice = {};
    set({ inventory: inv, restock: rs, cooked: cooked });
    toastUndo("Marked cooked" + (zeros.length ? " · " + zeros.length + " back on your list" : ""), snap);
  }
  function undoCooked(slot) {
    var c = S.cooked[slot]; if (!c) return;
    var inv = S.inventory.slice(), rs = S.restock.filter(function (r) { return c.restock.indexOf(r.id) < 0; });
    c.ops.slice().reverse().forEach(function (op) {
      if (op.t === "upd") {
        var k = -1; inv.forEach(function (x, n) { if (x.id === op.before.id) k = n; });
        if (k >= 0) inv[k] = op.before; else inv.push(op.before);
      } else if (!inv.some(function (x) { return x.id === op.item.id; })) inv.splice(Math.min(op.idx, inv.length), 0, op.item);
    });
    var cooked = Object.assign({}, S.cooked); delete cooked[slot];
    set({ inventory: inv, restock: rs, cooked: cooked }); toast("Cooked undone · inventory restored");
  }
  function renderSheet() {
    var $s = document.getElementById("sheet");
    if (V.cook && V.tab === "week") { renderCookSheet($s); return; }
    var it = V.chooser && V.tab === "list" ? findItem(V.chooser) : null;
    if (!it) { $s.className = ""; $s.innerHTML = ""; return; }
    var seen = {}, rows = "";
    it.uses.slice().sort(function (a, b) { return slotOrder(a.d, b.d); }).forEach(function (u) {
      if (seen[u.d]) return; seen[u.d] = true;
      var r = recipeFor(u.d); if (!r) return;
      var f = servingsFor(u.d) / r.serves;
      var amt = it.uses.filter(function (x) { return x.d === u.d; }).map(function (x) { return ingText(r.ing[x.idx], f); }).join(" + ");
      rows += '<button class="pickuse" data-act="gouse" data-d="' + u.d + '"><span class="pu-d">' + slotShort(u.d) + '</span><span class="pu-r"><b>' +
        esc(r.name) + '</b><span>' + esc(amt) + '</span></span><span class="chev">›</span></button>';
    });
    $s.className = "show";
    $s.innerHTML = '<div class="scrim" data-act="closesheet"></div><div class="panel" role="dialog" aria-label="Used in">' +
      '<div class="pt">' + esc(it.sing) + ' is used in</div>' + rows +
      '<button class="btn" data-act="closesheet" style="width:100%;margin-top:10px">Cancel</button></div>';
  }
  function toTop() { try { window.scrollTo({ top: 0, behavior: "smooth" }); } catch (e) { window.scrollTo(0, 0); } }

  // ---------- events ----------
  function onClick(e) {
    var el = e.target.closest("[data-act]");
    if (!el) return;
    var act = el.getAttribute("data-act");
    if (act === "tab") { V.invEdit = ""; V.invAdding = false; V.back = null; V.focus = null; V.chooser = ""; V.tab = el.getAttribute("data-tab"); if (V.tab === "week") V.day = today; render(); toTop(); return; }
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
      if (S.picks[pd] !== picks[pd] && S.servings[pd]) { S.servings = Object.assign({}, S.servings); delete S.servings[pd]; }
      S.picks = picks; save();
      if (picks[pd]) {
        var idx = DAYS.indexOf(pd);
        var nxt = DAYS.slice(idx + 1).filter(function (x) { return !picks[x]; })[0];
        if (nxt) { V.planDay = nxt; V.open = ""; render(); toTop(); return; }
      }
      render(); return;
    }
    if (act === "undo") {
      if (!V.undoSnap) return;
      var o = JSON.parse(V.undoSnap); V.undoSnap = null; $toast.classList.remove("show", "act");
      set({ inventory: normInventory(o.inventory), needAnyway: o.needAnyway || {}, restock: normRestock(o.restock), cooked: o.cooked || {} }); toast("Undone"); return;
    }
    if (act === "ihave") {
      var snap0 = snapshot(), inv0 = S.inventory.slice(), rs0 = S.restock.slice(), na0 = Object.assign({}, S.needAnyway), where;
      var rsid = el.getAttribute("data-restock");
      if (rsid) {
        var rr = S.restock.filter(function (x) { return x.id === rsid; })[0]; if (!rr) return;
        where = locForCat(rr.cat);
        inv0.push({ id: newId("i"), name: rr.name, amt: "", qty: null, date: "", loc: where, cat: rr.cat });
      } else {
        var g0 = findItem(el.getAttribute("data-key")); if (!g0) return;
        var n0 = g0.amt, cnt = g0.fam !== "vol" && g0.fam !== "wt" && g0.unit !== "handful";
        if (cnt && n0 > 0) n0 = Math.abs(n0 - Math.round(n0)) <= 0.01 ? Math.round(n0) : Math.ceil(n0 - 0.01);
        var q0 = n0 > 0 ? { n: n0, fam: g0.fam, unit: g0.unit } : null;
        var m0 = onHandFor(g0, invKeys());
        if (m0) {
          where = m0.loc;
          if (q0 && qtyOk(m0.qty) && m0.qty.fam === q0.fam) {
            var nq0 = { n: m0.qty.n + q0.n, fam: q0.fam, unit: m0.qty.unit || q0.unit };
            inv0 = inv0.map(function (x) { return x.id === m0.id ? Object.assign({}, x, { qty: nq0, amt: formatQty(nq0) }) : x; });
          }
        } else {
          where = locForCat(g0.cat);
          inv0.push({ id: newId("i"), name: g0.sing.replace(/\s*\([^)]*\)/g, "").trim() || g0.sing, amt: formatQty(q0), qty: q0, date: "", loc: where, cat: g0.cat });
        }
        delete na0[g0.key];
      }
      set({ inventory: inv0, restock: pruneRestock(inv0, rs0), needAnyway: na0 });
      toastUndo("Added to " + locName(where), snap0); return;
    }
    if (act === "restockremove") {
      var snap1 = snapshot(), rid1 = el.getAttribute("data-id");
      set({ restock: S.restock.filter(function (x) { return x.id !== rid1; }) }); toastUndo("Removed from list", snap1); return;
    }
    if (act === "cook") {
      var cs = el.getAttribute("data-slot");
      if (S.cooked[cs]) { if (confirm("Undo Cooked? This puts back what it took from your inventory.")) undoCooked(cs); return; }
      V.cook = cs; V.cookChoice = {}; renderSheet(); return;
    }
    if (act === "cookconfirm") { if (V.cook) applyCook(V.cook); return; }
    if (act === "needanyway") {
      var nk = el.getAttribute("data-key"), na = Object.assign({}, S.needAnyway);
      if (na[nk]) { delete na[nk]; toast("Marked on hand"); } else { na[nk] = true; toast("Added back to your list"); }
      set({ needAnyway: na }); return;
    }
    if (act === "invnew") { V.invAdding = true; V.invEdit = ""; render(); var f0 = $app.querySelector('[data-form=invadd] input[name=name]'); if (f0) f0.focus(); return; }
    if (act === "invedit") { V.invEdit = el.getAttribute("data-id"); V.invAdding = false; render(); return; }
    if (act === "invcancel") { V.invEdit = ""; render(); return; }
    if (act === "invremove") {
      var rid0 = el.getAttribute("data-id"), rit = S.inventory.filter(function (x) { return x.id === rid0; })[0];
      if (!rit || !confirm("Remove " + rit.name + " from your inventory?")) return;
      V.invEdit = ""; set({ inventory: S.inventory.filter(function (x) { return x.id !== rid0; }) }); toast("Removed " + rit.name); return;
    }
    if (act === "clear") {
      if (!confirm("Clear all picks and checkmarks?")) return;
      V.planDay = "mon"; set({ picks: {}, servings: {}, checked: {}, active: false, weekOf: "", extras: [], needAnyway: {}, cooked: {}, restock: S.restock.filter(function (r) { return !S.checked["restock:" + r.id]; }) }); return;
    }
    if (act === "newweek") {
      if (!confirm("Start planning a new week? This clears this week's picks and checkmarks.")) return;
      V.tab = "plan"; V.planDay = "mon"; set({ picks: {}, servings: {}, checked: {}, active: false, weekOf: "", extras: [], needAnyway: {}, cooked: {}, restock: S.restock.filter(function (r) { return !S.checked["restock:" + r.id]; }) }); toTop(); return;
    }
    if (act === "start") {
      V.tab = "week"; V.day = today; set({ active: true, weekOf: nextMonday(), checked: {} }); toTop(); toast("Week saved"); return;
    }
    if (act === "pickfor") { V.planDay = el.getAttribute("data-d"); V.tab = "plan"; render(); toTop(); return; }
    if (act === "alternative") {
      var rid = el.getAttribute("data-id"), choice = el.getAttribute("data-choice"), recipe = BY_ID[rid];
      if (!recipe || !recipe.alternatives || !recipe.alternatives.options[choice]) return;
      var alternatives = Object.assign({}, S.alternatives); alternatives[rid] = choice;
      V.focus = null; V.chooser = ""; set({ alternatives: alternatives }); return;
    }
    if (act === "serv") {
      var slot = el.getAttribute("data-slot") || V.day;
      var sv = Math.min(MAXSERV, Math.max(1, servingsFor(slot) + parseInt(el.getAttribute("data-n"), 10)));
      var servings = Object.assign({}, S.servings); servings[slot] = sv; set({ servings: servings }); return;
    }
    if (act === "sec") { V.sec = el.getAttribute("data-sec"); V.xopen = ""; V.focus = null; render(); return; }
    if (act === "xtoggle") { e.stopPropagation(); var xid = el.getAttribute("data-id"); V.xopen = V.xopen === xid ? "" : xid; V.focus = null; render(); return; }
    if (act === "extra") {
      var eid = el.getAttribute("data-id"), ex = S.extras.slice(), at = ex.indexOf(eid);
      if (at >= 0) ex.splice(at, 1); else ex.push(eid);
      set({ extras: ex }); toast(at >= 0 ? "Removed from this week" : "Added to this week · on your list"); return;
    }
    if (act === "openx") { var oid = el.getAttribute("data-id"); V.tab = "recipes"; V.sec = secOf(oid); V.xopen = oid; V.focus = null; render(); toTop(); return; }
    if (act === "usedin") {
      var it = findItem(el.getAttribute("data-key")); if (!it) return;
      var ds = it.uses.map(function (u) { return u.d; }).filter(function (d, n, a) { return a.indexOf(d) === n && recipeFor(d); });
      if (ds.length === 1) { goToUse(it, ds[0]); return; }
      V.chooser = it.key; renderSheet(); return;
    }
    if (act === "gouse") { var it2 = findItem(V.chooser); if (it2) goToUse(it2, el.getAttribute("data-d")); return; }
    if (act === "closesheet") { V.cook = ""; V.chooser = ""; renderSheet(); return; }
    if (act === "tostep") {
      var st = $app.querySelector('ol.steps li[data-n="' + el.getAttribute("data-n") + '"]');
      if (st) { scrollToEl(st); st.classList.add("flash"); setTimeout(function () { st.classList.remove("flash"); }, 1600); }
      return;
    }
    if (act === "backlist") {
      var y = V.back ? V.back.y : 0;
      V.back = null; V.focus = null; V.tab = "list"; render();
      window.scrollTo(0, y); return;
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
        var raw = JSON.parse(body), p = normalize(raw);
        if (!raw || !Array.isArray(raw.inventory)) p.inventory = S.inventory.slice();
        if (!raw || !Array.isArray(raw.restock)) p.restock = S.restock.slice();
        S = p; save(); V.tab = S.active ? "week" : "plan"; V.day = today; V.showBackup = false; render(); toast("Plan restored");
      } catch (err) { toast("That backup didn't work"); }
      return;
    }
  }
  document.addEventListener("click", onClick);
  document.addEventListener("submit", function (e) {
    var f = e.target, mode = f && f.getAttribute && f.getAttribute("data-form");
    if (mode !== "invadd" && mode !== "invedit") return;
    e.preventDefault();
    var name = (f.elements.name.value || "").trim(); if (!name) { f.elements.name.focus(); return; }
    var locEl = f.querySelector("input[name=loc]:checked");
    var data = { name: name.slice(0, 120), amt: (f.elements.amt.value || "").trim().slice(0, 60),
      date: /^\d{4}-\d{2}-\d{2}$/.test(f.elements.date.value) ? f.elements.date.value : "", loc: locEl && locOk(locEl.value) ? locEl.value : "pantry" };
    var inv = S.inventory.slice();
    if (mode === "invadd") {
      data.id = newId("i"); data.qty = parseQty(data.amt); data.cat = "";
      inv.push(data); V.invLoc = data.loc; V.invAdding = false; set({ inventory: inv, restock: pruneRestock(inv, S.restock) }); toast("Added to " + locName(data.loc));
    } else {
      var eid0 = f.getAttribute("data-id");
      inv = inv.map(function (x) {
        if (x.id !== eid0) return x;
        return Object.assign({ id: eid0 }, data, { qty: data.amt === x.amt ? x.qty : parseQty(data.amt), cat: x.cat || "" });
      });
      V.invEdit = ""; set({ inventory: inv, restock: pruneRestock(inv, S.restock) }); toast("Saved");
    }
  });
  document.addEventListener("input", function (e) {
    if (e.target && e.target.hasAttribute && e.target.hasAttribute("data-inv-search")) { V.invQ = e.target.value; applyInvSearch(); }
  });
  document.addEventListener("change", function (e) {
    var cid = e.target && e.target.getAttribute && e.target.getAttribute("data-cookid");
    if (cid) { V.cookChoice[cid] = e.target.value; return; }
    // Date label follows the chosen place: freezer = "Frozen on", otherwise "Best by".
    if (e.target && e.target.name === "loc" && e.target.form) {
      var lab = e.target.form.querySelector("input[name=date]"); if (lab && lab.previousElementSibling) lab.previousElementSibling.textContent = (e.target.value === "freezer" ? "Frozen on" : "Best by") + " (optional)";
    }
  });
  document.addEventListener("toggle", function (e) { if (e.target && e.target.classList && e.target.classList.contains("onhand")) V.onHandOpen = e.target.open; }, true);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && (V.chooser || V.cook)) { V.chooser = ""; V.cook = ""; renderSheet(); } });
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
