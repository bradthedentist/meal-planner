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
  thu: "Random Thursday",
  fri: "Brotzeit",
  sat: "Crockpot",
  sun: "Pizza Sunday"
};
const OLD_DAY_DEFAULTS = { thu: ["Stir-Fry"] }; // earlier per-day defaults, replaced by the current default
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
  return { q: parseFloat(q) || 0, u, sing, plur: plur ?? sing, c: catRule(sing, c) };
}
// Category rules that override the recipe data (Romy's preferences):
// onions of any kind (yellow, red, white, green, sweet...) are veggies -> Produce, never Staples.
function catRule(name, c) {
  if (/\bonions?\b/i.test(name) && !/powder|flakes|soup|dip|rings/i.test(name)) return "pr";
  return c;
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
      "2|tbsp|olive oil (extra virgin)|st", "1||large yellow onion~large yellow onions|pr", "2|clove|garlic|st", "12|oz|cherry tomatoes|pr",
      "1|tbsp|Italian seasoning|sp", "0.25|tsp|red pepper flakes|sp", "12|oz|linguine or spaghetti|pa",
      "4.5|cup|chicken or vegetable broth (low sodium)|pa", "1|cup|grated Parmesan|da", "6|leaf|fresh basil|pr", SP, PP,
    ], [
      "In a large saucepan or Dutch oven, heat the olive oil over medium-high heat. Add the chopped onion and cook until translucent, about 3 minutes. Add the minced garlic and cook another 30 seconds until aromatic.",
      "Add the halved tomatoes and cook 1 to 2 minutes until they just start to soften. Season with salt, pepper, Italian seasoning and red pepper flakes.",
      "Add the linguine and broth and bring to a boil over high heat, stirring occasionally. Cook about 10 minutes, until the pasta is fully cooked. Keep stirring so the pasta doesn't stick.",
      "Serve garnished with freshly grated Parmesan, chopped fresh basil and a drizzle of extra-virgin olive oil.",
    ], { by: "Jo Cooks", src: "https://www.jocooks.com/recipes/one-pot-pasta/", serves: 4 }),
  ],
  thu: [
    R("thu1", "Sushi Bowls", "Rice bowls with sweet-spicy marinated cucumbers, spicy canned tuna or salmon, edamame, avocado and nori.", "15 min", [
      "1|tbsp|rice vinegar|co", "2|tbsp|chili crunch (2\u20133 tbsp; stir well)|co", "0.5|tbsp|honey|pa", "0.125|tsp|salt|st", "1||medium cucumber~medium cucumbers|pr",
      "2|can|cooked salmon or tuna (6 oz)|pa", "0.25|cup|light mayo or plain Greek yogurt|co", "2|tsp|sriracha (2\u20134 tsp)|co", "1|tsp|sesame oil|co",
      "2|tsp|soy sauce (or tamari)|co", "1|tsp|lime juice|pr", "1.5|cup|shelled edamame|fr", "2|cup|cooked rice|st",
      "2||large nori sheet~large nori sheets|pa", "1||medium avocado~medium avocados|pr", "0|-|sesame seeds|sp", "0|-|green onion|pr",
    ], [
      "Marinated cucumbers: thinly slice the cucumber. Whisk the rice vinegar, chili crunch (2\u20133 tbsp), honey and salt together, then add the cucumbers and toss to coat evenly. Cover and set aside.",
      "Meanwhile, make the spicy tuna: combine the salmon or tuna, mayo or yogurt, sriracha (2\u20134 tsp; more or less depending on how spicy you want it), sesame oil, soy sauce and lime juice.",
      "Warm the rice and the edamame, then divide into bowls.",
      "Cut the nori (2\u20133 sheets) into small pieces, cube the avocado and chop the green onions. Top the bowls with the marinated cucumbers, spicy tuna, nori, avocado, sesame seeds and green onions.",
      "Drizzle with any remaining marinade from the cucumbers and enjoy!",
    ], { by: "Jar of Lemons", src: "https://www.jaroflemons.com/sushi-bowls/", serves: 4 }),
  ],
  fri: [
    R("fri1", "Tomato Soup & Grilled Cheese", "Creamy fire-roasted tomato soup with cheddar grilled cheese \u201csoldiers\u201d for dipping. Bon App\u00e9tit, rated 4.3 (119 ratings).", "About 1 hr", [
      "4|tbsp|unsalted butter|st", "1||medium red onion~medium red onions|pr", "0||kosher salt|st", PP,
      "2|tbsp|tomato paste|pa", "2|can|crushed fire-roasted tomatoes (28 oz)|pa", "4|cup|vegetable broth|pa",
      "2|sprig|fresh thyme|pr", "1||bay leaf~bay leaves|sp", "2|tbsp|sugar|st", "0.5|cup|heavy cream|da",
      "8|tbsp|unsalted butter (room temp, for the bread)|st", "16|slice|Pullman loaf (white sandwich bread)|ba", "16|oz|cheddar cheese|da",
    ], [
      "Heat the first portion of butter in a Dutch oven or medium stockpot over medium heat. Add the chopped onion and cook, stirring often, until softened and lightly browned around the edges, 8\u201310 minutes. Season with salt and pepper.",
      "Add the tomato paste and cook, stirring to coat the onion, until slightly darkened in color, about 2 minutes.",
      "Add the crushed tomatoes, vegetable broth, thyme, bay leaf and sugar and bring to a simmer. Season with salt and pepper and cook until the flavors are melded, 35\u201340 minutes.",
      "Remove from heat and stir in the cream. Remove the thyme stems and bay leaf and let cool slightly. Working in batches, pur\u00e9e in a blender until smooth.",
      "Heat a dry skillet, preferably cast-iron, over medium heat. Spread the room-temperature butter over the bread slices, dividing evenly.",
      "Grate the cheddar. Top the unbuttered side of half the bread slices with cheddar, dividing evenly. Top with the remaining bread, buttered side up.",
      "Cook, turning once, until the bread is golden brown and the cheese is melted, about 3 minutes per side.",
      "Cut the sandwiches into soldiers and serve alongside the hot soup for dipping. (Tip from the source: try pouring the soup directly over the sliced sandwich for a cheesy bread soup.)",
    ], { by: "Bon App\u00e9tit", src: "https://www.bonappetit.com/recipe/tomato-grilled-cheese-soup", serves: 8 }),
  ],
  sat: [
    R("cpk1", "Crock Pot Chicken and Dumplings", "Chicken breasts slow-cooked in a creamy soup base, topped with biscuit-strip dumplings and veggies.", "5 hr 20 min", [
      "1||large onion~large onions|pr", "1|can|condensed cream of celery soup (10.5 oz)|pa", "1|can|condensed cream of chicken soup (10.5 oz)|pa",
      "1|tbsp|fresh parsley|pr", "1|tsp|poultry seasoning|sp", "0|-|black pepper|st",
      "4||boneless skinless chicken breast~boneless skinless chicken breasts|me", "2|cup|reduced-sodium chicken broth|pa",
      "2|cup|frozen mixed vegetables (or peas and carrots)|fr", "1|can|refrigerated biscuits (16.3 oz)|da",
    ], [
      "Dice the onion and add it to a 6-quart crock pot. Top with the chicken breasts.",
      "In a small bowl, combine the cream of celery soup, cream of chicken soup, chopped parsley, poultry seasoning and pepper. Spread over the chicken. Top with the chicken broth and cook on high for 5 hours.",
      "About 1 hour before serving (after 4 hours of cooking; allow 60–90 minutes), roll each biscuit thin and flat and cut into 4 strips. Thaw the vegetables, add them to the slow cooker and stir. Add the biscuit strips on top and replace the lid as quickly as possible.",
      "To serve: remove the chicken breasts and slightly shred them. Add back to the slow cooker and stir (this will break up the dumplings somewhat, which is ok). Cook an additional 10 minutes and serve.",
      "Note: Some slow cookers need extra time for the biscuits to cook through.",
    ], { by: "Spend With Pennies", src: "https://www.spendwithpennies.com/crock-pot-chicken-and-dumplings/", serves: 4 }),
  ],
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
  sprig: "sprigs",
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
