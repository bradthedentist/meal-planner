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
// serves = the SOURCE yield (used only for scaling). The app always defaults to 4 servings (HOUSEHOLD in app.js).
const RECIPES = {
  mon: [],
  tue: [
    R("spc1", "Sheet Pan Crunchwrap", "One giant crunchwrap with spiced black beans, baked and cut into squares. Vegan. Source makes 8 (6–8 depending on how you cut it); shown for 4.", "40 min", [
      "8||large tortilla~large tortillas|ba", "2|clove|garlic|st", "1|can|black beans (large, 540 ml / 19 oz)|pa", "1|packet|taco seasoning|sp",
      "2||Roma tomato~Roma tomatoes|pr", "1||red onion~red onions|pr", "1.5|cup|tortilla chips|pa", "1|head|romaine lettuce (optional)|pr",
      "1|handful|vegan shredded cheese|da", "1|cup|vegan sour cream or coconut yogurt|da", "1|cup|vegan queso (optional)|da",
      "0|-|guacamole (for serving)|pr", "0|-|jalapeños (for serving)|pr", "0|-|salsa (for serving)|co",
    ], [
      "Preheat your oven to 400°F (200°C) and line a large sheet pan with parchment paper.",
      "In a pan over medium heat, sauté the minced garlic for 1 to 2 minutes until fragrant.",
      "Add the drained and rinsed black beans (or a Beyond Meat packet) and the taco seasoning along with ½ cup of water. Cook 5 to 7 minutes, stirring often, until soft and flavorful. Lightly mash with the back of a spoon for a chunky texture.",
      "Lay 6 of the tortillas slightly overlapping across the sheet pan so they cover the base and hang over the sides. Place 1 tortilla in the center to fully cover the bottom, reserving the last one to close the top.",
      "Spoon the bean mixture evenly over the tortillas. Top with vegan cheese or vegan queso and the crushed tortilla chips. Add the diced tomatoes, onion and lettuce now, or save them for topping at the end.",
      "Fold the overhanging edges toward the center to seal, with the last tortilla in the middle. Place another sheet pan on top to keep it flat and compact.",
      "Bake 15 to 20 minutes, removing the top sheet pan halfway through if you'd like it extra crisp.",
      "Let cool slightly, then slice into squares. Serve with your fresh toppings, extra sour cream, salsa or guacamole.",
      "Tip from the recipe notes: swap the beans for chickpeas, lentils, shredded tofu or vegan ground crumbles. In a rush, use a can of refried beans and skip cooking the beans.",
    ], { by: "PlantYou", src: "https://plantyou.com/sheet-pan-crunchwrap/", serves: 8 }),
  ],
  wed: [
    R("wjc1", "One Pot Pasta", "Linguine cooked right in the broth with cherry tomatoes, garlic and Parmesan.", "20 min", [
      "2|tbsp|olive oil (extra virgin)|st", "1||large yellow onion~large yellow onions|st", "2|clove|garlic|st", "12|oz|cherry tomatoes|pr",
      "1|tbsp|Italian seasoning|sp", "0.25|tsp|red pepper flakes|sp", "12|oz|linguine or spaghetti|pa",
      "4.5|cup|chicken or vegetable broth (low sodium)|pa", "1|cup|grated Parmesan|da", "6|leaf|fresh basil|pr", SP, PP,
    ], [
      "In a large saucepan or Dutch oven, heat the olive oil over medium-high heat. Add the chopped onion and cook until translucent, about 3 minutes. Add the minced garlic and cook another 30 seconds until aromatic.",
      "Add the halved tomatoes and cook 1 to 2 minutes until they just start to soften. Season with salt, pepper, Italian seasoning and red pepper flakes.",
      "Add the linguine and broth and bring to a boil over high heat, stirring occasionally. Cook about 10 minutes, until the pasta is fully cooked. Keep stirring so the pasta doesn't stick.",
      "Serve garnished with freshly grated Parmesan, chopped fresh basil and a drizzle of extra-virgin olive oil.",
    ], { by: "Jo Cooks", src: "https://www.jocooks.com/recipes/one-pot-pasta/", serves: 4 }),
  ],
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
  leaf: "leaves",
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
