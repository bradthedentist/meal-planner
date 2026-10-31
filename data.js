const DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
const DAY_SHORT = { mon: "Mon", tue: "Tue", wed: "Wed", thu: "Thu", fri: "Fri", sat: "Sat", sun: "Sun" };
const DAY_FULL = {
  mon: "Monday",
  tue: "Tuesday",
  wed: "Wednesday",
  thu: "Thursday",
  fri: "Friday",
  sat: "Saturday",
  sun: "Sunday"
};
const DEFAULT_THEMES = {
  mon: "Leftovers",
  tue: "Sheet Pan",
  wed: "One Pot",
  thu: "Stir-Fry",
  fri: "Brotzeit",
  sat: "Crockpot",
  sun: "Pizza Sunday"
};
const OLD_DEFAULT_THEMES = ["Leftover Day", "Taco Tuesday", "One Pot Wednesday", "Stir-Fry Thursday", "Pizza Friday", "Grill Saturday", "Comfort Sunday"];
const CAT_ORDER = ["st", "sp", "pr", "me", "da", "ba", "fr", "pa", "co", "ot"];
const CAT_LABEL = {
  st: "Staples",
  sp: "Spices",
  pr: "Produce",
  me: "Meat, Deli & Seafood",
  da: "Dairy & Eggs",
  ba: "Bakery & Bread",
  fr: "Frozen",
  pa: "Pantry & Canned",
  co: "Condiments & Sauces",
  ot: "Other",
  lf: "From the fridge"
};
function parseIng(s) {
  const [q, u, n, c] = s.split("|");
  const [sing, plur] = n.split("~");
  return { q: parseFloat(q) || 0, u, sing, plur: plur ?? sing, c };
}
function R(id, name, desc, time, ings, steps, meta) {
  const m = meta || {};
  return { id, name, desc, time, ing: ings.map(parseIng), steps, by: m.by || "", src: m.src || "", serves: m.serves || 4 };
}
const SP = "0||salt|st";
const PP = "0||black pepper|st";
// Recipes are added as Romy tests them. Older recipes live in git history.
const RECIPES = {
  mon: [],
  tue: [],
  wed: [],
  thu: [],
  fri: [],
  sat: [],
  sun: []
};
const BY_ID = {};
for (const d of DAYS) for (const r of RECIPES[d]) BY_ID[r.id] = r;
const VOL = { tsp: 1, tbsp: 3, cup: 48 };
const WT = { oz: 1, lb: 16 };
const PLURAL = {
  clove: "cloves",
  packet: "packets",
  handful: "handfuls",
  loaf: "loaves",
  can: "cans",
  jar: "jars",
  bunch: "bunches",
  head: "heads",
  pack: "packs",
  box: "boxes",
  block: "blocks",
  slice: "slices",
  bag: "bags",
  stalk: "stalks",
  ear: "ears",
  cup: "cups"
};
const FR = [[0, ""], [0.125, "\u215B"], [0.25, "\xBC"], [1 / 3, "\u2153"], [0.5, "\xBD"], [2 / 3, "\u2154"], [0.75, "\xBE"], [1, ""]];
function fmtNum(n) {
  if (n <= 0) return "";
  let w = Math.floor(n);
  const f = n - w;
  let best = FR[0];
  for (const c of FR) if (Math.abs(c[0] - f) < Math.abs(best[0] - f)) best = c;
  if (best[0] === 1) return String(w + 1);
  if (w === 0 && best[1] === "") return "\u215B";
  return `${w > 0 ? w : ""}${best[1]}`;
}
function unitLabel(u, q) {
  if (!u) return "";
  if (u === "in") return "in.";
  if (q > 1 && PLURAL[u]) return PLURAL[u];
  return u;
}
function ingText(i, f) {
  if (i.u === "-") return i.sing;
  if (i.q <= 0) return `${i.sing}, to taste`;
  const q = i.q * f;
  const name = !i.u && q > 1 ? i.plur : i.sing;
  return [fmtNum(q), unitLabel(i.u, q), name].filter((x) => x).join(" ");
}
function famOf(u) {
  if (VOL[u]) return "vol";
  if (WT[u]) return "wt";
  return "u:" + u;
}
function gQty(g) {
  if (g.amt <= 0) return "";
  if (g.fam === "vol") {
    const t = g.amt;
    if (t >= 12) {
      const v = t / 48;
      return `${fmtNum(v)} ${v > 1 ? "cups" : "cup"}`;
    }
    if (t >= 3) return `${fmtNum(t / 3)} tbsp`;
    return `${fmtNum(t)} tsp`;
  }
  if (g.fam === "wt") {
    if (g.amt >= 16) return `${fmtNum(g.amt / 16)} lb`;
    return `${fmtNum(g.amt)} oz`;
  }
  return [fmtNum(g.amt), unitLabel(g.unit, g.amt)].filter((x) => x).join(" ");
}
function gName(g) {
  return !g.unit && g.amt > 1 ? g.plur : g.sing;
}
function gLine(g) {
  return [gQty(g), gName(g)].filter((x) => x).join(" ");
}
