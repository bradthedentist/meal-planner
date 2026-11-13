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
  const [sing, plur] = n.split("~").map(brandRule);
  return { q: parseFloat(q) || 0, u, sing, plur: plur ?? sing, c: catRule(sing, c) };
}
// Romy's brand preference: condensed cream-of soups are Pacific Foods Organic (10.5 oz cans, same as the usual size).
function brandRule(name) {
  if (!name || /pacific/i.test(name)) return name;
  return name.replace(/^(?:canned\s+)?(?:condensed\s+)?cream of (\w+) soup/i, "Pacific Foods Organic condensed cream of $1 soup");
}
// Category rules that override the recipe data (Romy's preferences):
// onions of any kind (yellow, red, white, green, sweet...) are veggies -> Produce, never Staples.
const STAPLE_RE = new RegExp("\\b(" + [
  "pasta", "linguine", "spaghetti", "penne", "fusilli", "rigatoni", "macaroni", "farfalle", "fettuccine", "orzo", "rotini", "lasagna", "noodles?",
  "rice", "broth", "stock", "bouillon", "tomato paste", "vinegar", "mayo", "mayonnaise", "mustard", "ketchup",
  "hot sauce", "sriracha", "tabasco", "nori"
].join("|") + ")\\b", "i");
function catRule(name, c) {
  if (/\bonions?\b/i.test(name) && !/powder|flakes|soup|dip|rings/i.test(name)) return "pr";
  // Shelf-stable basics she keeps on hand -> Staples (so they stay off the weekly Safeway order).
  // Only for pantry/condiment items; weekly buys like chips, salsa, chili crunch, soy sauce, sesame oil, honey are untouched.
  if ((c === "pa" || c === "co") && STAPLE_RE.test(name) && !/fresh|refrigerated|frozen/i.test(name)) return "st";
  return c;
}
function R(id, name, desc, time, ings, steps, meta) {
  const m = meta || {};
  return { id, name, desc, time, ing: ings.map(parseIng), steps, by: m.by || "", src: m.src || "", serves: m.serves || 4, keep: !!m.keep, yieldUnit: m.yieldUnit || "", incomplete: !!m.incomplete, note: m.note || "" };
}
const SP = "0||salt|st";
const PP = "0||black pepper|st";
// Recipes are added as Romy tests them. Older recipes live in git history.
// serves = the SOURCE yield (used only for scaling). The app always defaults to 4 servings (HOUSEHOLD in app.js).
// Pizza dough is shared by Sunday and the Baking Savory section.
const PIZZATEIG = R("bsv1", "Der perfekte Pizzateig", "Neapolitan-style pizza dough with 00 flour and a tiny bit of fresh yeast; long cold rise. Makes 6 dough balls (about 10 oz / 280 g each). Toppings not included.", "15 min + 1–2 hr rest + 12–24 hr in the fridge", [
  "1.5|g|fresh yeast|da", "1|kg|pizza flour (Type 00)|pa", "25|g|fine sea salt|st", "620|ml|water|st",
], [
  "Weigh out all the ingredients and set them out.",
  "Put about 2⅔ cups (620 ml) of water in a mixing bowl and dissolve the yeast in it.",
  "Add half of the flour to the water and mix.",
  "Then add the salt and mix well.",
  "Add the rest of the flour to the dough and knead for 15 minutes, until the pizza dough is elastic and has a smooth surface.",
  "Cover the dough in the mixing bowl or in a pizza dough box and let it rest for 1–2 hours at room temperature.",
  "After this first rise, divide the dough into six pieces of about 10 oz (280 g) each and shape them into balls.",
  "Place the dough balls in the dough box with some space between them and cover.",
  "Put the box in the fridge for the second rise, 12–24 hours.",
], { src: "https://recime.app/p/50992ab0-d325-4a28-a7d0-951c176cc947", serves: 6, keep: true, yieldUnit: "dough balls" });
const RECIPES = {
  mon: [],
  tue: [
    R("spc1", "Sheet Pan Crunchwrap", "Romy's adaptation: one giant crunchwrap with ground beef, black beans, shredded cheese and fresh toppings. Shown for 4 with 6 tortillas.", "About 40 min", [
      "6||large tortilla~large tortillas|ba", "1|clove|garlic|st", "1|can|black beans (large, 540 ml / 19 oz)|pa", "0.5|packet|taco seasoning|sp",
      "1||Roma tomato~Roma tomatoes|pr", "0.5||red onion~red onions|pr", "0.75|cup|tortilla chips|pa", "0.5|head|romaine lettuce (optional)|pr",
      "1||small bag of shredded cheese~small bags of shredded cheese|da", "0|-|sour cream|da", "0|-|queso (optional)|da",
      "0|-|ground beef (amount not specified)|me", "0|-|guacamole (for serving)|pr", "0|-|jalapeños (for serving)|pr", "0|-|salsa (for serving)|co",
    ], [
      "Preheat your oven to 400°F (200°C) and line a large sheet pan with parchment paper.",
      "Cook the ground beef in a skillet, breaking it into crumbles, until cooked through and a food thermometer reads 160°F (71°C). The ground beef amount was not specified. Drain excess fat if needed. Add the minced garlic and cook until fragrant.",
      "Add the drained and rinsed black beans and taco seasoning with a little water as needed. Cook, stirring, until the beans are hot and the filling is well combined; lightly mash some of the beans if desired.",
      "Lay most of the tortillas slightly overlapping across the sheet pan, covering the base with edges hanging over the sides. Reserve enough tortilla to cover any gap when closing the top; use all 6 tortillas for the 4-serving batch.",
      "Spoon the beef and bean filling over the tortillas. Top with shredded cheese or queso and crushed tortilla chips. Add the diced tomatoes, onion and lettuce now, or save them for topping at the end.",
      "Fold the overhanging tortilla edges toward the center and cover any gap with the reserved tortilla. Place another sheet pan on top to keep it flat and compact.",
      "Bake 15 to 20 minutes, removing the top sheet pan halfway through if you would like it extra crisp.",
      "Let cool slightly, then slice into squares. Serve with the fresh toppings, sour cream, salsa, guacamole or jalapeños. Sour cream and queso amounts are up to you.",
    ], { by: "PlantYou", src: "https://plantyou.com/sheet-pan-crunchwrap/", serves: 4, note: "Romy's adaptation of the source recipe. Ground beef quantity was not specified; sour cream and queso are intentionally unmeasured. Ingredient amounts scale with servings except these unmeasured items." }),
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
    R("fri1", "Tomato Soup & Grilled Cheese", "Romy's adaptation: simple tomato soup with bread and ghost pepper or pepper jack grilled cheese. Choose fresh tomatoes or crushed fire-roasted tomatoes, not both.", "Cook until tomatoes are tender and sandwiches are toasted", [
      "2|tbsp|tomato paste|pa", "56|oz|fresh tomatoes or crushed fire-roasted tomatoes (choose one)|pr", "4|cup|vegetable broth (optional, only if needed)|pa", "1||bay leaf~bay leaves|sp",
      "16|slice|bread|ba", "16|oz|ghost pepper or pepper jack cheese (choose one)|da",
    ], [
      "Tomato soup: if using fresh tomatoes, chop them and keep their juices; otherwise use crushed fire-roasted tomatoes. Use one tomato option, not both. Put the tomatoes, tomato paste and bay leaf in a saucepan. Add vegetable broth only if needed to loosen the soup, using as much or as little of the listed amount as needed.",
      "Tomato soup: bring to a gentle simmer, then cook over low heat, stirring regularly, until the fresh tomatoes are tender or the canned tomatoes are heated through and the flavors have blended. Add a little more of the optional broth if the soup is too thick. Remove the bay leaf. Leave chunky or carefully blend until smooth.",
      "Grilled cheese: put ghost pepper or pepper jack cheese between slices of bread. Use one cheese option, not both.",
      "Grilled cheese: heat a dry nonstick skillet over medium-low heat. Cook the sandwiches, turning carefully, until the bread is toasted on both sides and the cheese is melted. Cut and serve with the hot tomato soup.",
    ], { by: "Bon Appétit", src: "https://www.bonappetit.com/recipe/tomato-grilled-cheese-soup", serves: 8, note: "Romy's adaptation; the source credit is retained. Source amounts are kept where applicable: at 4 servings use 1 tbsp tomato paste, 28 oz tomatoes (fresh OR crushed fire-roasted), up to 2 cups optional broth, ½ bay leaf, 8 slices bread and 8 oz cheese. Broth is only needed if the soup is too thick." }),
  ],
  sat: [
    R("cpk1", "Crock Pot Chicken and Dumplings", "Chicken breasts slow-cooked in a creamy soup base, topped with biscuit-strip dumplings and veggies.", "5 hr 20 min", [
      "1||large onion~large onions|pr", "1|can|Pacific Foods Organic condensed cream of celery soup (10.5 oz)|pa", "1|can|Pacific Foods Organic condensed cream of chicken soup (10.5 oz)|pa",
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
  sun: [PIZZATEIG]
};
RECIPES.fri[0].ingredientGroups = { 0: "Tomato soup", 4: "Grilled cheese" };
// Only the dumpling portion is adapted from Lauren Allen (source yield: 6).
// Store exact 2/3-scale amounts for our 4-serving soup; never round the underlying quantities.
const CHICKEN_DUMPLINGS = RECIPES.sat.find(r => r.id === "cpk1");
CHICKEN_DUMPLINGS.alternatives = {
  label: "Dumplings", default: "biscuits", ingredientStart: 9, stepStart: 2,
  options: {
    biscuits: { label: "Biscuit dough" },
    homemade: {
      label: "Homemade", desc: "Chicken breasts slow-cooked in the same creamy soup base, with homemade drop dumplings and veggies.", time: "About 6 hr (allow longer if dumplings need it)", by: "Lauren Allen · Tastes Better From Scratch",
      src: "https://tastesbetterfromscratch.com/chicken-and-dumplings/",
      note: "Homemade dumplings only: source serves 6, scaled to your servings. Slow-cooker method adapted to the existing soup; soup ingredients are unchanged. Allow about 45 minutes on HIGH after adding homemade dumplings, longer if needed.",
      ing: [
        "1.1111111111111112|cup|all-purpose flour|st", "2|tsp|baking powder|st",
        "0.3333333333333333|tsp|kosher salt|st", "0.5|cup|milk|da",
        "0.16666666666666666|cup|sour cream|da", "1.3333333333333333|tbsp|butter (melted)|st"
      ].map(s => Object.assign(parseIng(s), { practical: true })),
      steps: [
        "Once the base soup has cooked on HIGH for 5 hours, thaw the mixed vegetables and stir them into the hot soup. Keep the slow cooker on HIGH. Use homemade dumplings instead of the biscuit strips.",
        "Homemade dumplings: combine the flour, baking powder and kosher salt in a bowl. Make a well in the center, add the milk, sour cream and melted butter, and stir just until combined. Do not overmix.",
        "Drop teaspoon-sized portions of dough over the hot soup; they will double in size. Press them slightly under the liquid and cover promptly. Cook on HIGH for 45 minutes. Gently separate dumplings if needed and cut one open to check the center; if still doughy, cover and continue cooking until cooked through.",
        CHICKEN_DUMPLINGS.steps[3]
      ]
    }
  }
};
// Extra sections (not weekdays). Recipes here can be added to the week as extras so they join the grocery list.
// keep: true = baked goods keep the source yield instead of the 4-serving default; yieldUnit labels the stepper.
const SECTIONS = [
  { id: "soups", name: "Soups", recipes: [
    R("sou1", "Bayrische Hühnersuppe", "Bavarian chicken soup: a whole soup chicken simmered 3 hours with soup greens and root vegetables. Source makes 6; shown for 4.", "Cook time 3 hr", [
      "1||whole soup chicken (stewing hen), oven-ready~whole soup chickens (stewing hens), oven-ready|me", "0||salt|st", "1|tsp|black peppercorns|sp",
      "2||large onion~large onions|pr", "1|clove|garlic|st", "3|bunch|soup greens (Suppengrün)|pr", "3||bay leaf~bay leaves|sp",
      "4||carrot~carrots|pr", "2||leek~leeks|pr", "0.5||celery root (celeriac)~celery roots (celeriac)|pr", "2||parsnip~parsnips|pr",
      "1|bunch|fresh parsley|pr", "1|bunch|fresh chives|pr", PP,
    ], [
      "Remove the fat gland at the tail (the parson's nose).",
      "Put the chicken in 2–3 quarts (2–3 liters) of cold salted water.",
      "Use enough water that the chicken is completely covered.",
      "Add the halved onions with their skins on, the bay leaves, garlic and peppercorns, and bring everything to a boil.",
      "Regularly skim off the foam that forms on the surface.",
      "Wash and trim the vegetables and soup greens, peel the celery root, and cut everything into ½-inch (1 cm) pieces.",
      "Add everything to the boiling water and turn the heat down to low.",
      "Simmer the soup over low heat for 3 hours.",
      "Then carefully lift the chicken out with a ladle.",
      "Remove the skin, pull the meat off the bones and cut it into pieces.",
      "Strain the soup and remove the vegetables.",
      "Return the chopped chicken meat to the soup and warm it up again.",
      "Season to taste with salt and pepper.",
      "Add the finely chopped parsley and garden herbs (chives) just before serving.",
      "For a clear broth, use the meat for something else, such as chicken fricassee.",
    ], { src: "https://recime.app/p/ad2e1a4b-2551-4826-b4c0-1f6ef6cddb48", serves: 6 }),
    R("sou2", "Hackfleisch Käsesuppe", "Mama's ground beef and cheese soup with leeks, broth, Philadelphia, Maggi herb sauce and mushrooms. Added as given: the source is incomplete. Philadelphia is listed twice in the source (200 g each). Source makes 6; shown for 4.", "Time not given", [
      "1|kg|ground beef|me", "5||leek (5–6 in the source)~leeks (5–6 in the source)|pr", "2|l|bouillon-cube broth (Würfelbrühe)|pa",
      "200|g|Philadelphia cream cheese|da", "2||Kräuter (herbs not specified)~Kräuter (herbs not specified)|pr",
      "200|g|Philadelphia cream cheese (listed a second time in the source)|da", "1|packet|Maggi Kräutersauce (herb sauce mix)|pa",
      "1|can|mushrooms (Schwammerl; can size not given)|pa",
    ], [
      "Brown the ground beef well in the pan / in the pot.",
      "Pour the dissolved broth (2 L in the source, about 8½ cups) over it and add the peeled leeks. (This line is in the source's ingredient list.)",
      "Prepare the Maggi herb sauce and add it. (This line is a heading in the source's ingredient list.)",
      "After cooking for ½ hour, take it back out (the source doesn't say what — likely the leeks) before it overcooks. Add the Philadelphia and mushrooms and stir.",
      "Source note, unclear as written: \u201cEinpíesen möglich\u201d.",
    ], { by: "Mama", src: "https://recime.app/p/5ba10c5d-3af5-4bd6-abb7-29dd21441203", serves: 6, incomplete: true,
      note: "Step order is reconstructed from the source; amounts for herbs and the mushroom can aren't given." }),
    R("sou3", "Yayla Corbasi (Turkish Yogurt Soup)", "Chickpeas and basmati rice simmered, then thickened with a yogurt–egg yolk mix and finished with parsley–chili butter.", "About 1 hr 30 min", [
      "0.5|cup|dried garbanzo beans (chickpeas), rinsed|pa", "0.5|cup|basmati rice, uncooked, rinsed|pa", "1|cup|plain Greek yogurt|da",
      "1||large egg (yolk only)~large eggs (yolks only)|da", "1|tbsp|flour|st", "0||salt|st", PP, "2|tbsp|unsalted butter|st",
      "1|tbsp|dried parsley|sp", "1|tsp|red pepper flakes|sp",
    ], [
      "Add the chickpeas and 8 cups (1.9 L) of water to a Dutch oven or pot over medium-high heat and bring to a boil.",
      "Place a lid on the pot and reduce the heat to medium-low. Simmer the chickpeas over medium-low for 1 hour.",
      "After the chickpeas have been simmering for 1 hour, stir the rice into the pot with the chickpeas.",
      "Place the lid back on the pot and simmer for about 25 more minutes.",
      "In a small bowl, whisk together the yogurt, egg yolk, flour and 1 tsp salt.",
      "Whisk ¼ cup (60 ml) of the cooking water from the pot into the yogurt mixture until well combined, then whisk ¼ cup (60 ml) more cooking water into the yogurt mixture until well combined.",
      "Slowly stir the yogurt mixture into the pot.",
      "Continue to simmer the soup, uncovered, over medium-low heat about 1 more minute (as written in the source) or until the rice is very tender.",
      "In a small bowl, melt the butter and mix it with the parsley, red pepper flakes and ½ tsp salt.",
      "Stir the butter mixture into the soup, then taste and season with salt and pepper if needed.",
    ], { by: "YepRecipes", src: "https://www.yeprecipes.com/img-yayla-corbasi--turkish-yogurt-soup--2004.htm", serves: 4 }),
  ] },
  { id: "sweet", name: "Baking Sweet", recipes: [
    R("bsw1", "Banana Chocolate Chip Cookies", "Soft banana cookies loaded with chocolate chips. Makes 24 cookies.", "About 25 min", [
      "1|cup|butter|st", "1|cup|light brown sugar|st", "2||egg~eggs|da", "2||banana~bananas|pr", "2|tsp|vanilla extract|sp",
      "3|cup|flour|st", "1|tsp|baking powder|st", "1|tsp|baking soda|st", "1|tsp|salt|st", "2|cup|chocolate chips|pa",
    ], [
      "Preheat your oven to 350°F (175°C).",
      "Start by creaming the butter and sugar together on low for 2 minutes.",
      "Add the eggs, bananas and vanilla and combine on low speed for another 2 minutes.",
      "Add the flour, baking soda, baking powder and salt and fold to combine.",
      "Add the chocolate chips and fold until combined.",
      "Scoop onto a lined baking sheet and bake at 350°F (175°C) for 10–12 minutes.",
    ], { src: "https://recime.app/p/95d120d9-f10f-4ebb-8c42-2b997c95d22b", serves: 24, keep: true, yieldUnit: "cookies" }),
    R("bsw2", "Jungle Bar Hawaii", "Graham cracker crust layered with sweetened condensed milk, chocolate chips, coconut and toasted macadamia nuts. Makes 20 bars.", "About 35 min + cooling", [
      "1.5|cup|graham cracker crumbs|pa", "0.5|cup|butter|st", "1|can|sweetened condensed milk (14 oz)|pa",
      "1|cup|chocolate chips (semi-sweet or milk chocolate)|pa", "2|cup|flaked coconut (sweetened or unsweetened)|pa", "0.75|cup|macadamia nuts|pa",
    ], [
      "Preheat your oven to 350°F (175°C). Toast the macadamia nuts if they aren't already toasted.",
      "In a small bowl, mix the graham cracker crumbs with the melted butter.",
      "Press the crumb mixture into the bottom of a 13 x 9-inch (33 x 23 cm) baking pan so the whole pan is covered. You don't need to grease it since the mixture won't stick, but lining it with parchment paper makes the bars easier to remove.",
      "Pour half of the sweetened condensed milk over the crumb mixture, covering as much of it as you can.",
      "Sprinkle the chocolate chips, coconut and macadamia nuts all over the pan, layering them evenly. Press everything down with a fork.",
      "Pour the rest of the sweetened condensed milk over the top.",
      "Bake for 25 minutes or until golden brown.",
      "Let the bars cool completely. Chill them if you want to enjoy them sooner.",
      "Cut into the shape and size you like.",
    ], { src: "https://recime.app/p/68293de0-54ee-41db-a01f-2dae06dd8db0", serves: 20, keep: true, yieldUnit: "bars" }),
  ] },
  { id: "savory", name: "Baking Savory", recipes: [PIZZATEIG] },
  { id: "salads", name: "Salads", recipes: [
    R("sal1", "Crispy Pasta Salad", "Air-fried crispy rotini tossed with tomatoes, green pepper, provolone, salami and olives in a red wine vinaigrette. Source makes 8; shown for 4.", "1 hr", [
      "12|oz|rotini pasta|pa", "2|tbsp|olive oil (extra virgin)|st", "1|cup|cherry tomatoes, halved|pr", "0.667|cup|green bell pepper, diced|pr",
      "0.333|cup|red onion, diced|pr", "0.5|cup|provolone, cubed (¼ inch / 6 mm)|da", "1|cup|hard salami, cubed (¼ inch / 6 mm)|me",
      "0.5|cup|pitted black or Kalamata olives|pa", "0|-|grated Parmesan (for serving)|da",
      "0.333|cup|red wine vinegar|co", "2|tsp|lemon juice, freshly squeezed|pr", "2|tsp|dried oregano|sp", "1.5|tsp|minced garlic|st",
      "1|tsp|sugar|st", "0.5|cup|olive oil (extra virgin)|st", "1|tsp|kosher salt|st", "0.5|tsp|black pepper|st",
    ], [
      "Make the pasta salad: Bring a large pot of salted water to a boil. Add the pasta and cook until al dente, about 10 minutes.",
      "Drain the pasta and add it to a large bowl. Drizzle it with the olive oil, then sprinkle it with ½ tsp kosher salt and ¼ tsp black pepper and toss to combine.",
      "Preheat the air fryer to 400°F (200°C).",
      "Add the pasta to the air fryer and cook for 20 minutes, stopping and shaking the basket every 5 minutes. (The pasta doesn't have to be in a single layer, but stop and shake the basket so the pasta doesn't stick together.)",
      "Remove the pasta from the air fryer and set it aside to cool.",
      "In a large bowl, combine the cherry tomatoes, green pepper, red onion, provolone, salami and olives.",
      "Make the dressing: In a small bowl, whisk together the red wine vinegar, lemon juice, dried oregano, garlic and sugar with ½ tsp kosher salt and ¼ tsp black pepper.",
      "While whisking, stream in the olive oil until combined. Taste and season the dressing with more salt and pepper.",
      "Pour the dressing over the vegetables and toss to combine.",
      "Stir in the crispy pasta, then top with grated Parmesan and serve.",
    ], { by: "Just a Taste", src: "https://www.justataste.com/crispy-pasta-salad-recipe/", serves: 8 }),
    R("sal2", "Cowboy Caviar - Summer salad", "Black beans, chickpeas, cucumber, cherry tomatoes, mozzarella pearls, red onion and banana peppers with a simple oil–vinegar–Dijon dressing. Added as given: the source is incomplete.", "Time not given", [
      "1|can|black beans|pa", "2|can|chickpeas|pa", "0.5||cucumber (½–1 in the source)~cucumbers (½–1 in the source)|pr",
      "0|-|cherry tomatoes (\u201ca couple\u201d; amount not given)|pr", "1|ball|small mozzarella pearls|da", "0.5||red onion~red onions|pr",
      "0|-|banana peppers (amount not given)|co",
      "0|-|olive oil for the dressing (amount not given)|st", "0|-|vinegar or balsamic (amount not given)|co", "0|-|banana pepper juice (amount not given)|co",
      "0|-|Dijon mustard (amount not given)|co", SP, PP,
    ], [], { src: "https://recime.app/p/b2b91064-4ca7-4c11-add3-5c96de0b7c81", serves: 4, incomplete: true, note: "Source has no steps." }),
  ] },
];
const BY_ID = {};
for (const d of DAYS) for (const r of RECIPES[d]) BY_ID[r.id] = r;
for (const sec of SECTIONS) for (const r of sec.recipes) BY_ID[r.id] = r;
const VOL = { tsp: 1, tbsp: 3, cup: 48, ml: 1 / 4.92892, l: 202.884 };
const WT = { oz: 1, lb: 16, g: 1 / 28.3495, kg: 35.274 };
const METRIC = { g: 1, kg: 1, ml: 1, l: 1 };
// Metric source amounts: shown in US units first with the metric amount in parentheses.
function metricText(q, u) {
  const base = u === "kg" || u === "l" ? q * 1000 : q;
  const unit = u === "g" || u === "kg" ? "g" : "ml";
  if (base >= 1000) return `${Math.round(base / 10) / 100} ${unit === "g" ? "kg" : "L"}`;
  return `${base < 10 ? Math.round(base * 10) / 10 : Math.round(base)} ${unit}`;
}
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
  cup: "cups",
  ball: "balls"
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
// "1", "½", "⅔"... read as singular ("1 cup", "½ cup"); anything above 1 is plural.
function oneOrLess(n) { return n === "1" || /^[\u215B\xBC\u2153\xBD\u2154\xBE]$/.test(n); }
// Exact cup + tablespoon + teaspoon measures avoid awkward 1 1/9-cup flour.
function practicalVolume(t) {
  const cupAmount = t / 48;
  if (t >= 12 && FR.some(c => Math.abs(c[0] - (cupAmount - Math.floor(cupAmount))) < 1e-8)) return fmtNum(cupAmount) + (cupAmount <= 1 ? " cup" : " cups");
  const cups = Math.floor((t + 1e-9) / 48);
  t -= cups * 48;
  const tbsp = Math.floor((t + 1e-9) / 3);
  t -= tbsp * 3;
  const exact = FR.some(c => Math.abs(c[0] - (t - Math.floor(t))) < 1e-8);
  const remainder = exact ? fmtNum(t) : "≈ " + Math.round(t * 100) / 100;
  return [cups ? cups + (cups === 1 ? " cup" : " cups") : "", tbsp ? tbsp + " tbsp" : "", t > 1e-8 ? remainder + " tsp" : ""].filter(Boolean).join(" + ");
}
function ingText(i, f) {
  if (i.u === "-") return i.sing;
  if (i.q <= 0) return `${i.sing}, to taste`;
  const q = i.q * f;
  if (i.practical && VOL[i.u]) return `${practicalVolume(q * VOL[i.u])} ${i.sing}`;
  if ((i.u === "cup" && q < 0.25) || (i.u === "tbsp" && q < 1)) return `${gQty({ amt: q * VOL[i.u], fam: "vol" })} ${i.sing}`;
  if (METRIC[i.u]) return `${gQty({ amt: q * (WT[i.u] || VOL[i.u]), fam: WT[i.u] ? "wt" : "vol" })} (${metricText(q, i.u)}) ${i.sing}`;
  const n = fmtNum(q), many = !oneOrLess(n);
  return [n, unitLabel(i.u, many ? 2 : 1), !i.u && many ? i.plur : i.sing].filter((x) => x).join(" ");
}
function famOf(u) {
  if (VOL[u]) return "vol";
  if (WT[u]) return "wt";
  return "u:" + u;
}
function gQty(g) {
  if (g.amt <= 0) return "";
  if (g.practical && g.fam === "vol") return practicalVolume(g.amt);
  if (g.fam === "vol") {
    const t = g.amt;
    if (t >= 12) {
      const n = fmtNum(t / 48);
      return `${n} ${n === "1" || /^[\u215B\xBC\u2153\xBD\u2154\xBE]$/.test(n) ? "cup" : "cups"}`;
    }
    if (t >= 3) return `${fmtNum(t / 3)} tbsp`;
    return `${fmtNum(t)} tsp`;
  }
  if (g.fam === "wt") {
    if (g.amt < 0.25) return `${Math.round(g.amt * 100) / 100} oz`;
    if (g.amt >= 16) return `${fmtNum(g.amt / 16)} lb`;
    return `${fmtNum(g.amt)} oz`;
  }
  const n = fmtNum(g.amt);
  return [n, unitLabel(g.unit, oneOrLess(n) ? 1 : 2)].filter((x) => x).join(" ");
}
function gName(g) {
  return !g.unit && !oneOrLess(fmtNum(g.amt)) && g.amt > 1 ? g.plur : g.sing;
}
function gLine(g) {
  return [gQty(g), gName(g)].filter((x) => x).join(" ");
}
