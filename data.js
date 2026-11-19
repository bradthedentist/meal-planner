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
// Cream soups: Pacific Foods Organic cans (default) or a quick homemade swap that replaces BOTH cans.
// Homemade base: Berly's Kitchen 1:1 substitute (one batch = one 10.5 oz can), doubled for two cans.
CHICKEN_DUMPLINGS.swap = {
  key: "soup", label: "Cream soups", default: "pacific", ingAt: 1, ingCount: 2, stepAt: 1, stepCount: 1,
  options: {
    pacific: { label: "Pacific Foods cans" },
    homemade: {
      label: "Quick homemade", heading: "Quick homemade cream soup (replaces both cans)", creditLabel: "Homemade cream soup",
      by: "Kimberly Vargo · Berly's Kitchen", src: "https://www.berlyskitchen.com/cream-celery-soup-substitute/",
      note: "Quick homemade cream soup: Berly's Kitchen's 1:1 substitute for a 10.5 oz can of condensed cream of celery soup, doubled to replace both cans (the second batch stands in for the cream of chicken soup). About 15 minutes. Scales with your servings.",
      ing: [
        "1|cup|whole milk|da", "0.5|cup|all-purpose flour|st", "4|tbsp|unsalted butter|st", "1|cup|celery, finely chopped|pr",
        "0.5|tsp|onion powder|sp", "0.25|tsp|garlic powder|sp", "1.5|cup|reduced-sodium chicken broth|pa", "0||salt|st",
      ].map(parseIng),
      steps: [
        "Quick homemade cream soup: whisk the milk and flour together in a small bowl until smooth; set aside. Melt the butter in a small saucepan over low-medium heat. Add the celery, onion powder and garlic powder and cook 3 to 5 minutes, until the celery begins to soften. Whisk in the broth listed for the cream soup and bring to a simmer. Whisk in the milk-flour mixture and keep whisking over low heat 2 to 3 minutes, until thick. Season lightly with salt and pepper and let it cool slightly.",
        "In a small bowl, combine the homemade cream soup, chopped parsley, poultry seasoning and pepper. Spread over the chicken. Top with the remaining chicken broth (the amount in the main ingredient list) and cook on high for 5 hours.",
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
  { id: "savory", name: "Baking Savory", recipes: [PIZZATEIG,
    R("bsv2", "Scarpaccia", "Tuscan zucchini flatbread: thinly sliced zucchini and red onion in a light flour batter, baked until golden and crispy.", "About 30 min prep + 30–35 min baking", [
      "750|g|zucchini|pr", "130|g|Type 1 flour|st", "40|g|cornflour (as written in the source)|st", "1||red onion~red onions|pr",
      "1|tsp|salt|st", "0|-|extra virgin olive oil|st", "0|-|breadcrumbs (optional, for extra crispiness)|pa",
    ], [
      "Thinly slice the zucchini and red onion (using a mandoline if you have one).",
      "Place the vegetables in a colander over a bowl to collect the liquid. Add the salt and mix well.",
      "Place a plate on top of the vegetables and add a weight. Leave to drain for 20–30 minutes. The heavier the weight, the faster the vegetables will release their water.",
      "Measure the collected liquid (you should get about ¾ cup / 200 ml). If you have less, add a little water to reach ¾ cup (200 ml).",
      "Whisk the two flours into the liquid until you get a smooth batter. Add a drizzle of olive oil.",
      "Add the zucchini and onion to the batter and mix well.",
      "Generously oil a nonstick baking tray of about 12 × 12 inches (30 × 30 cm). Spread the mixture evenly over the tray.",
      "Drizzle with more olive oil and sprinkle with breadcrumbs if you like extra crispiness.",
      "Bake in a preheated oven at 425°F (220°C) for 30–35 minutes, until golden and crispy.",
    ], { by: "@thatoneitalianchef", src: "https://recime.app/p/9ef79f67-525e-4a51-8e41-7339d838423c", serves: 4, keep: true, yieldUnit: "servings" }),
    R("bsv3", "Lahmacun – leckere türkische Pizza", "Thin Turkish flatbreads with a spiced ground-meat topping, finished with lemon, salad, onions, tomatoes, peppers and cheese. Makes 10. Added as given: the source is incomplete.", "1 hr 15 min prep + about 6 min per Lahmacun", [
      "0|-|dry yeast (amount not given)|st", "0|-|flour (amount not given)|st", "0|-|yogurt (amount not given)|da", "0|-|olive oil (amount not given)|st",
      "0|-|ground meat (Hackfleisch; amount not given)|me", "0|-|onion (for the meat mix; amount not given)|pr", "0|-|bell pepper (Paprika; amount not given)|pr",
      "0|-|garlic (amount not given)|st", "0|-|spices for the meat mix (not specified)|sp", SP, PP,
      "200|g|Turkish white cheese (Hirtenkäse) or feta|da", "1|head|butter lettuce (Kopfsalat), roughly chopped|pr",
      "2||red onion, cut into thin strips~red onions, cut into thin strips|pr", "3||tomato, diced~tomatoes, diced|pr",
      "2||lemon~lemons|pr", "0|-|fresh parsley (leftovers from the bunch)|pr", "1|jar|pickled peperoni peppers|co",
    ], [
      "Dough: dissolve the dry yeast in warm water. It should be no hotter than 104°F (40°C), or the yeast can't work and the dough won't rise. Let the yeast water stand about 5 minutes.",
      "Weigh the flour into a stand-mixer bowl and add the yogurt, olive oil and salt. Pour in the yeast water and knead with the dough hook into a ball. Knead 8 minutes on medium-low speed (speed 3 in the source).",
      "Lift the dough ball out, spread a little olive oil on the bottom of the bowl, return the dough and rub it with a little olive oil. Cover with a damp towel and let rise 45 minutes in a warm place. At room temperature it takes a little longer for the dough to more than double.",
      "Meat mix: blend the onion, parsley, bell pepper and garlic very finely (the source uses a blender attachment). Add to the ground meat with the remaining ingredients, including the spices, and mix everything well.",
      "To finish: preheat the oven to 480°F (250°C), conventional (top and bottom heat). If you have a pizza stone, put it in and heat it 45 minutes or longer, depending on its thickness.",
      "Pull off 10 portions of about 3½ oz (100 g) of dough, shape them into even balls by pulling at the sides, and let them rest covered on a lightly floured baking sheet for 10–15 minutes.",
      "Roll a dough ball out thinly, place it on a floured pizza peel or similar and spread about 1 tbsp of the meat mix over it, thin but even. Slide it onto the pizza stone. Without a stone, top the flatbread on a baking sheet and put that in the oven. Bake about 6 minutes, until the Lahmacun takes on a little color.",
      "Take the Lahmacun out of the oven and drizzle it right away with some lemon juice. Then top as you like with parsley, lettuce, onions, tomatoes, peperoni and cheese.",
      "To roll the Lahmacun, place them under an upturned baking sheet as they come out of the oven, always two stacked filling to filling, so they turn soft and can be rolled.",
    ], { src: "https://recime.app/p/2ff191c0-f582-4427-8826-9c8e38a7645f", serves: 10, keep: true, yieldUnit: "Lahmacun", incomplete: true, note: "Added as given: the source's ingredient list only has salt, pepper and the toppings. The dough and meat-mix ingredients named in the steps have no amounts (not given)." }),
    R("bsv4", "Käsebrötchen Over Night", "Overnight cheese rolls: a no-knead dough with grated Gouda or Emmentaler rises 12–24 hours in the fridge, then is spooned onto the sheet and baked. Makes 8–10 rolls.", "10 min + 12–24 hr in the fridge + 25–30 min baking", [
      "300|g|wheat flour (Type 405)|st", "200|g|wheat flour (Type 1050)|st", "150|g|grated Gouda or Emmentaler|da", "370|ml|cold water|st",
      "4|g|fresh yeast (or 1.5 g dry yeast)|da", "2|tsp|salt|st", "1|tsp|sugar|st", "0|-|extra grated cheese for the top (optional)|da",
    ], [
      "Stir the water together with the yeast and honey (the source's step says honey; its ingredient list has 1 tsp sugar instead).",
      "Put all the remaining ingredients in a container with a lid, add the yeast mixture and mix briefly, just until no dry flour is visible. The dough can be soft and a little sticky.",
      "Close the lid and let it rise in the fridge for 12–24 hours.",
      "The next morning, preheat the oven to 410°F (210°C), conventional (top and bottom heat). Spoon portions of the dough straight onto the baking sheet and sprinkle with a little grated cheese if you like.",
      "Bake 25–30 minutes until golden brown.",
    ], { by: "@garden_and_g_made", src: "https://recime.app/p/6d74bf06-98fb-4f1c-9a7d-5aa28062509b", serves: 10, keep: true, yieldUnit: "rolls" }),
  ] },
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
  { id: "dinners", name: "Dinners", recipes: [
    R("din1", "Creamy Cabbage Pasta", "Roasted cabbage \u201cnoodles\u201d stirred with egg and egg whites, then made creamy with Greek yogurt (no actual pasta). Source makes 1; shown for 4.", "About 30 min", [
      "1||small head of cabbage (about 280 g), sliced~small heads of cabbage (about 280 g each), sliced|pr", "100|g|egg whites|da",
      "1||whole egg~whole eggs|da", "90|g|plain Greek yogurt, 0%|da", SP, PP, "0|-|Parmesan (optional, a light dusting for garnish)|da",
    ], [
      "Preheat your oven to 400°F (200°C).",
      "Add the sliced cabbage to a baking sheet lined with parchment paper, season with salt and pepper, and roast for 15–20 minutes.",
      "Meanwhile, whisk the whole egg and egg whites together in a bowl and season with salt and pepper.",
      "Add the roasted cabbage to a skillet over medium heat, pour in the egg mixture, and stir the eggs around with the cabbage until the eggs are cooked.",
      "Remove from the heat and stir in the Greek yogurt to make a rich, creamy sauce.",
      "Serve hot, seasoned to taste, with optional Parmesan.",
    ], { by: "@firsttakehadrian", src: "https://recime.app/p/78bc93a0-02f7-44ec-ac8a-1622a3e85c83", serves: 1 }),
    R("din2", "Nudel Kraut Schmorbraten", "Beef (Tafelspitz) braised 3½ hours with onions, garlic, carrot and tomato paste in beef broth, then pointed cabbage and pasta cook right in the sauce.", "About 4 hr (3½ hr braising)", [
      "800|g|Tafelspitz (beef rump cap), ideally with a little fat on it|me", "4||onion (4–5 in the source)~onions (4–5 in the source)|pr",
      "4|clove|garlic (4–5 in the source)|st", "1||carrot~carrots|pr", "2|tbsp|tomato paste (2–3 tbsp in the source)|pa", "1.5|l|beef broth|pa",
      "300|ml|water (as needed)|st", "1||Bratensaft (roast gravy; the source says just \u201c1\u201d)~Bratensaft (roast gravy; the source says just \u201c1\u201d)|pa",
      "0.5||Spitzkohl (pointed cabbage)~Spitzkohl (pointed cabbage)|pr", "400|g|pasta of your choice|pa", "0|-|oil for searing|st", SP,
    ], [
      "Peel the onions and garlic and chop the onions. Peel the carrot as well and cut it into rough pieces.",
      "Cut the Tafelspitz into four equal pieces and salt them on all sides.",
      "Heat a little oil in a pot and sear the meat well on all sides. Then take it back out of the pot.",
      "Add the prepared vegetables to the pot and sweat them briefly. Add the tomato paste and toast it briefly too.",
      "Return the meat to the pot and pour in the beef broth. Add the Bratensaft as well.",
      "Simmer everything over medium heat with the lid on for about 3½ hours, until the meat is nice and tender.",
      "After about 3 hours, chop the Spitzkohl and add it to the sauce.",
      "Depending on the consistency, add about 1¼ cups (300 ml) of water. Then add the pasta and simmer until it is al dente.",
      "Taste and season once more, and enjoy!",
    ], { by: "@joeskochwelt", src: "https://recime.app/p/4ac5ece6-483a-4c58-930b-1aecb1c0465e", serves: 4 }),
    R("din3", "Schmorbraten mit Klößchen", "Tender braised beef shoulder in a rich red wine sauce with carrots and small potato dumplings. Source makes 2; shown for 4.", "About 3 hr 30 min (3 hr braising)", [
      "500|g|beef shoulder roast (Rinderbraten)|me", "2||sweet onion (Gemüsezwiebel)~sweet onions (Gemüsezwiebeln)|pr", "1|tbsp|tomato paste (heaping)|pa",
      "200|ml|red wine (1 glass)|ot", "500|ml|beef broth|pa", "400|ml|water|st", "1|tbsp|mustard|co", "1|tbsp|Worcestershire sauce|co",
      "0|-|fresh thyme (a few sprigs)|pr", "4||carrot~carrots|pr", "12||small potato dumpling (Kartoffelklößchen)~small potato dumplings (Kartoffelklößchen)|pa",
      "0|-|clarified butter (Butterschmalz; amount not given)|st", SP, PP,
    ], [
      "Cut the beef into large pieces, salt it and sear it on all sides in clarified butter. Then take it out.",
      "Chop the onions and brown them in the same pot. Add the tomato paste and toast it briefly. Deglaze with the red wine and let it reduce a little.",
      "Add the beef broth, water, mustard, Worcestershire sauce and thyme. Return the meat to the pot, salt it, and braise covered over low heat for about 3 hours, until it is nice and tender.",
      "About 20 minutes before the end of the cooking time, add the peeled carrots to the sauce and cook them along.",
      "Dumplings: let the small potato dumplings cook in hot water for about 10 minutes, following the package directions.",
      "Take the meat out and pull it apart a little with two forks. Remove the thyme sprigs, season the sauce to taste and return the meat.",
      "Serve the Schmorbraten with the red wine sauce, carrots and dumplings.",
    ], { by: "@piaundhalloumi", src: "https://recime.app/p/80050f68-3736-4255-a64c-504af884f848", serves: 2 }),
    R("din4", "Vegetarian Sheet Pan Gnocchi", "Potato gnocchi roasted on one pan with bell pepper, cherry tomatoes, red onion and chickpeas, finished with basil and balsamic glaze.", "35 min", [
      "16|oz|potato gnocchi|pa", "1||yellow bell pepper, chopped~yellow bell peppers, chopped|pr", "1|pint|cherry or grape tomatoes|pr",
      "1||red onion, chopped~red onions, chopped|pr", "1|can|chickpeas, drained and rinsed|pa", "2|tbsp|olive oil|st", "2|tbsp|nutritional yeast|pa",
      "1|tsp|garlic powder|sp", "0.5|tsp|salt (or more to taste)|st", "0.5|tsp|dried oregano|sp",
      "0|-|fresh basil (for garnish)|pr", "0|-|balsamic glaze (for garnish)|co", "0|-|vegan parmesan (optional, for garnish)|da",
    ], [
      "Preheat the oven to 400°F (200°C).",
      "Add the gnocchi, bell pepper, cherry tomatoes, red onion and chickpeas to the sheet pan. Drizzle with olive oil and coat with nutritional yeast, garlic powder, salt and oregano. Toss until evenly mixed.",
      "Bake for 25 minutes, until the tomatoes are burst and the gnocchi has a slight crisp. In the last few minutes, you can broil to brown the gnocchi and tomatoes a bit, if desired.",
      "Serve immediately with fresh basil, balsamic glaze and vegan parmesan.",
    ], { by: "PlantYou", src: "https://recime.app/p/abf42996-aaa0-42db-a749-27bd2c50f5f7", serves: 4 }),
    R("din5", "Crockpot Cowboy Casserole", "Italian sausage, baby red potatoes, kidney beans, corn and fire-roasted tomatoes slow-cooked and topped with melted Colby Jack. Source makes 6; shown for 4.", "20 min + 2–6 hr in the slow cooker", [
      "1|tbsp|olive oil|st", "1|lb|ground Italian sausage (mild or hot)|me", "1||yellow onion (about 1 cup finely diced)~yellow onions (about 1 cup finely diced each)|pr",
      "1|tsp|salt|st", "0.5|tsp|black pepper|st", "1|lb|baby red potatoes (unpeeled)|pr", "1||green bell pepper~green bell peppers|pr",
      "14.5|oz|kidney beans (drained and rinsed)|pa", "1.5|cup|frozen corn|fr", "1|can|fire-roasted diced tomatoes (14.5 oz)|pa",
      "2|tsp|minced garlic|st", "0.5|tsp|chili powder|sp", "1|cup|shredded Colby Jack cheese|da",
      "0|-|fresh cilantro (optional)|pr", "0|-|sour cream (optional)|da",
    ], [
      "Heat the oil in a large pan over high heat. Once hot, add the sausage and onion. Brown and crumble the sausage and caramelize it for maximum flavor. Season with salt and pepper. Transfer the browned sausage and onion to the Crock-Pot.",
      "Thinly slice the potatoes, chop the pepper, then drain and rinse the beans. Add to the Crock-Pot along with the corn, undrained tomatoes, minced garlic and chili powder. Stir to combine and press into an even layer.",
      "Cover and cook on high for 2–4 hours or on low for 4–6 hours, until the potatoes are tender. Gently stir and adjust the seasoning with salt and pepper if needed.",
      "Sprinkle the cheese evenly on top, cover again, and let the cheese melt for 5–10 minutes.",
      "Serve hot with optional toppings like fresh cilantro and sour cream.",
    ], { by: "Chelsea Lords", src: "https://recime.app/p/91e4d09d-7a78-47e8-ae83-9ed20892d0fe", serves: 6 }),
    R("din6", "Cheesy Cabbage Pancake", "One big pan-fried pancake of cabbage, grated potato and cheese in a light tempura batter, golden on both sides.", "20 min", [
      "1|cup|tempura powder|pa", "1||large egg~large eggs|da", "0.5|cup|cold soda water|pa", "1||large potato, grated~large potatoes, grated|pr",
      "0.25|head|large cabbage, chopped (about 4 cups)|pr", "1|cup|shredded cheese (your favorite)|da", SP, PP, "0|-|oil for the pan (amount not given)|st",
    ], [
      "Mix the cabbage, shredded cheese, grated potato, tempura powder, soda water, egg, and salt and pepper in a bowl.",
      "Heat a nonstick pan over medium heat and add oil. Once the pan is hot, add the cabbage mixture.",
      "Spread it out evenly and pan-fry for 5–6 minutes on each side, until golden brown.",
    ], { by: "@tiffyycooks", src: "https://recime.app/p/966423e7-3794-4c83-bc3a-820d8cd04abb", serves: 4 }),
    R("din7", "Maggi Ofen-Hähnchen mit Gemüse und Kartoffeln", "Chicken breasts baked on one sheet with potatoes, tomatoes, yellow bell pepper and zucchini in a paprika-herb marinade. Maggi Fix pack or homemade mix.", "About 50 min (35 min baking)", [
      "4||chicken breast fillet (about 5 oz / 150 g each)~chicken breast fillets (about 5 oz / 150 g each)|me", "400|g|potatoes|pr", "200|g|tomatoes|pr",
      "1||yellow bell pepper~yellow bell peppers|pr", "1||zucchini (about 7 oz / 200 g)~zucchini (about 7 oz / 200 g each)|pr", "4|tbsp|oil|st",
      "1|pack|Maggi Fix Ofen-Hähnchen mit Gemüse und Kartoffeln (27 g)|pa",
    ], [
      "Preheat the oven to 400°F, or 350°F convection.",
      "Peel the potatoes and cut them into ¾-inch (2 cm) cubes. Cut the bell pepper into strips. Halve the zucchini lengthwise and slice it ¾ inch (2 cm) thick. Cut the tomatoes into wedges.",
      "In a large bowl, stir the Maggi Fix mix with 4 tbsp water and the oil.",
      "Place the chicken on a baking sheet and brush each fillet with 1 tsp of the marinade. Toss the vegetables in the rest of the marinade and spread them around the chicken.",
      "Bake about 35 minutes.",
    ], { by: "Maggi Fix pack instructions (Romy's photos)", serves: 4, note: "Pack makes 4 servings. Pack nutrition per serving (337 g): 306 kcal, 39.2 g protein." }),
    R("din8", "Maggi Paprika-Rahm Schnitzel", "Pork schnitzels baked under bell pepper strips in a creamy paprika sauce, served with rice. Maggi Fix pack or homemade mix. Pack makes 3; shown for 4.", "About 40 min (30 min baking)", [
      "3||pork schnitzel (about 5 oz / 150 g each; turkey or veal also work)~pork schnitzels (about 5 oz / 150 g each; turkey or veal also work)|me",
      "250|ml|cream, 15% fat (or heavy cream)|da", "1||bell pepper~bell peppers|pr",
      "1|pack|Maggi Fix Paprika-Rahm Schnitzel (35 g)|pa",
      "0|-|feta, diced (optional, pack tip)|da", "0|-|black olives (optional, pack tip)|pa", "0|-|rice (for serving)|pa",
    ], [
      "Preheat the oven to 400°F (top and bottom heat), or about 340°F convection.",
      "Lay the schnitzels side by side in a baking dish. Cut the bell pepper into strips and spread them over the meat. If you like, add diced feta and black olives now (pack tip).",
      "Stir the Maggi Fix mix into the cream and pour it over the schnitzels.",
      "Bake about 30 minutes. Serve with rice.",
    ], { by: "Maggi Fix pack instructions (Romy's photos)", serves: 3, note: "Pack makes 3 servings. Pack nutrition per serving (268 g): 358 kcal, 37.3 g protein." }),
    R("din9", "Maggi Nudel-Schinken Gratin", "Uncooked pasta and diced ham baked in a creamy sauce under grated cheese; the pasta cooks in the oven. Maggi Fix pack or homemade mix. Pack makes 2; shown for 4.", "About 35 min (30 min baking)", [
      "125|g|pasta (uncooked)|pa", "100|g|cooked ham|me", "400|ml|water|st", "100|ml|heavy cream|da", "50|g|grated cheese|da",
      "1|pack|Maggi Fix Nudel-Schinken Gratin (33 g)|pa",
    ], [
      "Preheat the oven to 400°F, or about 340°F convection.",
      "Put the uncooked pasta in a baking dish. Dice the ham and spread it on top.",
      "Warm the water with the cream, stir in the Maggi Fix mix and boil 1 minute.",
      "Pour the sauce over the pasta so it is fully covered, and top with the cheese.",
      "Bake about 30 minutes, or air-fry about 25 minutes at about 340°F.",
    ], { by: "Maggi Fix pack instructions (Romy's photos)", serves: 2, note: "Pack makes 2 servings. Pack nutrition per serving (354 g): 595 kcal, 29 g protein." }),
    R("din10", "Maggi Bauern-Topf mit Hackfleisch", "One-pot ground meat with potatoes and red bell pepper simmered in a paprika sauce. Maggi Fix pack or homemade mix. Pack makes 2; shown for 4.", "About 45 min (30 min simmering)", [
      "300|g|potatoes|pr", "250|g|mixed ground meat (or ground beef)|me", "1||red bell pepper~red bell peppers|pr", "1|tsp|oil|st", "250|ml|water|st",
      "1|pack|Maggi Fix Bauern-Topf mit Hackfleisch (39 g)|pa",
    ], [
      "Peel and dice the potatoes and the bell pepper.",
      "Heat the oil in a pot and brown the ground meat. Add the bell pepper and potatoes and fry them too.",
      "Add the water, stir in the Maggi Fix mix and bring to a boil.",
      "Cover and simmer on low about 30 minutes, until the potatoes are done, stirring now and then.",
    ], { by: "Maggi Fix pack instructions (Romy's photos)", serves: 2, note: "Pack makes 2 servings. Pack nutrition per serving (394 g): 516 kcal, 30.3 g protein." }),
    R("din11", "Maggi Ofen-Spirelli alla Mamma", "Spirelli baked in a tomato ground-meat sauce under crème fraîche and cheese; the pasta cooks in the oven. Back label: Fix für Nudel-Gratin mit Hackfleisch. Maggi Fix pack or homemade mix. Pack makes 3; shown for 4.", "About 45 min (30 min baking)", [
      "250|g|mixed ground meat (or ground beef)|me", "150|g|spirelli pasta (uncooked)|pa", "100|g|crème fraîche|da", "50|g|grated cheese|da", "1|tsp|oil|st", "500|ml|water|st",
      "1|pack|Maggi Fix Ofen-Spirelli alla Mamma (Fix für Nudel-Gratin mit Hackfleisch, 43 g)|pa",
    ], [
      "Preheat the oven to 400°F, or 350°F convection.",
      "Heat the oil and brown the ground meat.",
      "Add the water, stir in the Maggi Fix mix and bring to a boil while stirring.",
      "Put the uncooked pasta in a baking dish and pour the sauce over so the pasta is covered.",
      "Spread the crème fraîche on top, sprinkle with the cheese and bake about 30 minutes.",
    ], { by: "Maggi Fix pack instructions (Romy's photos)", serves: 3, note: "Pack makes 3 servings. Pack nutrition per serving (305 g): 585 kcal, 28.8 g protein." }),
    R("din12", "Maggi Kräuter-Rahm Schnitzel", "Pan-fried pork schnitzels in a creamy herb sauce, served with Spätzle and a salad. Maggi Fix pack or homemade mix. Pack makes 3; shown for 4.", "About 15 min", [
      "3||pork schnitzel (about 5 oz / 150 g each; turkey or veal also work)~pork schnitzels (about 5 oz / 150 g each; turkey or veal also work)|me",
      "50|ml|heavy cream|da", "1|tsp|oil|st", "250|ml|water|st",
      "1|pack|Maggi Fix Kräuter-Rahm Schnitzel (36 g)|pa",
      "0|-|Spätzle (for serving)|pa", "0|-|salad (for serving)|pr",
    ], [
      "Heat the oil and brown the schnitzels. Take them out of the pan and keep them warm.",
      "Pour the water and the cream into the pan, stir in the Maggi Fix mix and bring to a boil.",
      "Put the schnitzels back in and let them heat through. Serve with Spätzle and a salad.",
    ], { by: "Maggi Fix pack instructions (Romy's photos)", serves: 3, note: "Pack makes 3 servings. Pack nutrition per serving (240 g): 282 kcal (protein not given)." }),
    R("din13", "Maggi Ofen-Kartoffeln mit Hackfleisch", "Thinly sliced potatoes and browned ground beef baked in a creamy sauce under cheese. Back label: Fix für Kartoffelauflauf mit Hackfleisch. Maggi Fix pack or homemade mix. Pack makes 3; shown for 4.", "About 1 hr (45 min baking)", [
      "500|g|floury (starchy) potatoes|pr", "250|g|ground beef (or mixed ground meat)|me", "1|tsp|oil|st", "250|ml|water|st",
      "100|ml|cream, 15% fat (or heavy cream)|da", "50|g|grated cheese|da",
      "1|pack|Maggi Fix Ofen-Kartoffeln mit Hackfleisch (Fix für Kartoffelauflauf mit Hackfleisch, 34 g)|pa",
    ], [
      "Preheat the oven to 400°F, or about 340°F convection.",
      "Peel the potatoes and slice them thinly.",
      "Heat the oil in a pot and brown the meat.",
      "Add the water and the cream, stir in the Maggi Fix mix and bring to a boil.",
      "Mix in the potato slices, put everything in a baking dish and top with the cheese.",
      "Bake about 45 minutes, until the potatoes are done.",
    ], { by: "Maggi Fix pack instructions (Romy's photos)", serves: 3, note: "Pack makes 3 servings. Pack nutrition per serving (283 g): 437 kcal, 25.8 g protein." }),
  ] },
];
// Romy (Nov 19, 2026): Maggi recipes in the weekday choices. One pot / gratin on Wed, sheet pan on Tue,
// the rest on Fri. Ofen-Kartoffeln moved to Wed (Romy, Nov 19: "Move Ofen-Kartoffeln to Wednesday"). None on Mon ("We don't cook Mondays, that's left overs"), Thu, Sat or Sun.
const DINNERS = SECTIONS.find(sec => sec.id === "dinners");
const MAGGI_DAYS = { tue: ["din7"], wed: ["din10", "din9", "din11", "din13"], fri: ["din12", "din8"] };
const MAGGI_IDS = Object.values(MAGGI_DAYS).flat();
for (const d in MAGGI_DAYS) for (const id of MAGGI_DAYS[d]) RECIPES[d].push(DINNERS.recipes.find(r => r.id === id));
DINNERS.recipes = DINNERS.recipes.filter(r => !MAGGI_IDS.includes(r.id));
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
  ball: "balls",
  pint: "pints"
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
// Maggi Fix recipes: the pack (default) or a homemade mix built from the pack's own ingredient list.
// The homemade amounts are estimates; uncertain ones carry [CONFIRM] until Romy confirms them.
const MAGGI_NOTE = "Homemade mix: estimated from the pack's ingredient list. Amounts marked [CONFIRM] are best guesses; adjust to taste.";
function maggiSwap(id, ingAt, stepAt, stepCount, ing, steps, restHeading) {
  BY_ID[id].swap = {
    key: "mix", label: "Seasoning", default: "pack", ingAt: ingAt, ingCount: 1, stepAt: stepAt, stepCount: stepCount,
    options: {
      pack: { label: "Maggi Fix pack" },
      homemade: { label: "Homemade mix", heading: "Homemade mix (replaces the pack)", restHeading: restHeading, note: MAGGI_NOTE, ing: ing.map(parseIng), steps: steps }
    }
  };
}
maggiSwap("din7", 6, 2, 1, [
  "0.5|tsp|salt ([CONFIRM])|st", "2|tsp|sweet paprika|sp", "1|tsp|onion powder|sp", "0.5|tsp|garlic powder|sp", "0.25|tsp|ground turmeric|sp",
  "0.25|tsp|black pepper|st", "2|tsp|Italian seasoning (basil, oregano, thyme, rosemary)|sp", "0.5|tsp|dried parsley|sp",
  "1|tbsp|tomato paste ([CONFIRM])|pa", "0.5|tsp|sugar|st", "1|tsp|vegetable bouillon powder (for the pack's celery, leek and carrot; [CONFIRM])|pa",
], [
  "Homemade mix: in a large bowl, stir the salt, paprika, onion powder, garlic powder, turmeric, pepper, Italian seasoning, parsley, tomato paste, sugar and bouillon powder with 4 tbsp water and the oil until smooth.",
]);
maggiSwap("din8", 3, 2, 1, [
  "1|tbsp|cornstarch (thickener; [CONFIRM])|st", "2|tsp|sweet paprika|sp", "1|tsp|onion powder|sp", "0.5|tsp|garlic powder|sp",
  "0.125|tsp|cayenne pepper (for the pack's chili; [CONFIRM])|sp", "1|tbsp|tomato paste|pa", "0.5|tsp|salt ([CONFIRM])|st",
  "1|tsp|vegetable bouillon powder (for the pack's seasoning; [CONFIRM])|pa", "0.5|tsp|dried parsley|sp", "0.5|tsp|dried oregano|sp",
  "0.25|tsp|dried thyme|sp", "0.25|tsp|sugar|st", "1|tsp|lemon juice|pr", "0.5|tsp|smoked paprika (optional, for the pack's smoked bacon; [CONFIRM])|sp",
], [
  "Homemade mix: whisk the cornstarch, paprika, onion powder, garlic powder, cayenne, tomato paste, salt, bouillon powder, herbs, sugar and smoked paprika (if using) into the cold cream until smooth, then stir in the lemon juice. Pour it over the schnitzels.",
], "Optional and to serve");
maggiSwap("din9", 5, 2, 1, [
  "2|tbsp|cornstarch (thickener; [CONFIRM])|st", "1|tsp|onion powder|sp", "0.25|tsp|ground nutmeg|sp", "0.25|tsp|garlic powder|sp", "0.25|tsp|black pepper|st",
  "0.5|tsp|salt ([CONFIRM])|st", "1|tsp|vegetable bouillon powder (for the pack's seasoning and leek; [CONFIRM])|pa", "1|tsp|dried chives|sp",
  "0.25|tsp|smoked paprika (optional, for the pack's smoked bacon; [CONFIRM])|sp",
], [
  "Homemade mix: stir the cornstarch into 3 tbsp of the cold water to make a slurry. Warm the rest of the water with the cream, onion powder, nutmeg, garlic powder, pepper, salt, bouillon powder, chives and smoked paprika (if using). Whisk in the slurry and boil 1 minute, stirring, until slightly thickened.",
]);
maggiSwap("din10", 5, 2, 2, [
  "2|tsp|sweet paprika|sp", "1|tsp|onion powder|sp", "0.5|tsp|garlic powder|sp", "0.25|tsp|black pepper|st", "0.125|tsp|cayenne pepper (for the pack's chili; [CONFIRM])|sp",
  "0.5|tsp|dried parsley|sp", "0.25|tsp|dried thyme|sp", "0.5|tsp|dried marjoram|sp", "1||bay leaf~bay leaves|sp",
  "1|tsp|beef or vegetable bouillon powder (for the pack's seasoning; [CONFIRM])|pa", "0.25|tsp|salt ([CONFIRM])|st", "0.25|tsp|sugar|st",
  "0.5|tsp|smoked paprika (optional, for the pack's smoked bacon; [CONFIRM])|sp", "2|tsp|cornstarch (thickener; [CONFIRM])|st",
], [
  "Homemade mix: add the water with the paprika, onion powder, garlic powder, pepper, cayenne, parsley, thyme, marjoram, bay leaf, bouillon powder, salt, sugar and smoked paprika (if using). Stir and bring to a boil.",
  "Cover and simmer on low about 30 minutes, until the potatoes are done, stirring now and then. Stir the cornstarch with 2 tbsp cold water, stir it in and simmer 1–2 minutes until thickened. Remove the bay leaf.",
]);
maggiSwap("din11", 6, 2, 1, [
  "2|tbsp|tomato paste (for the pack's tomato; [CONFIRM])|pa", "1|tbsp|cornstarch (thickener; [CONFIRM])|st", "1|tsp|onion powder|sp", "0.5|tsp|garlic powder|sp",
  "1|tsp|sweet paprika|sp", "0.25|tsp|black pepper|st", "0.5|tsp|sugar|st", "1|tsp|vegetable bouillon powder (for the pack's seasoning; [CONFIRM])|pa",
  "0.5|tsp|salt ([CONFIRM])|st", "1|tsp|dried oregano|sp",
], [
  "Homemade mix: stir the cornstarch into 3 tbsp of the cold water to make a slurry. Add the rest of the water to the meat with the tomato paste, onion powder, garlic powder, paprika, pepper, sugar, bouillon powder, salt and oregano. Stir in the slurry and bring to a boil while stirring.",
]);
maggiSwap("din12", 4, 1, 1, [
  "1|tbsp|butter (for the pack's fat; [CONFIRM])|st", "1|tbsp|cornstarch (thickener; [CONFIRM])|st", "0.5|tsp|onion powder|sp", "0.25|tsp|garlic powder|sp",
  "0.25|tsp|black pepper|st", "0.125|tsp|ground turmeric|sp", "1|tsp|vegetable bouillon powder (for the pack's seasoning; [CONFIRM])|pa", "0.25|tsp|salt ([CONFIRM])|st",
  "0.25|tsp|sugar|st", "1|tsp|dried parsley|sp", "1|tsp|dried chives|sp", "1|tsp|lemon juice (for the pack's white wine extract and lemon; [CONFIRM])|pr",
], [
  "Homemade mix: stir the cornstarch into 3 tbsp of the cold water to make a slurry. Pour the rest of the water and the cream into the pan and add the butter, onion powder, garlic powder, pepper, turmeric, bouillon powder, salt, sugar, parsley and chives. Stir in the slurry and bring to a boil, stirring. Stir in the lemon juice.",
], "To serve");
maggiSwap("din13", 6, 3, 1, [
  "1|tbsp|cornstarch (thickener; [CONFIRM])|st", "1|tsp|onion powder|sp", "0.25|tsp|garlic powder|sp", "0.25|tsp|black pepper|st", "0.25|tsp|ground nutmeg|sp",
  "0.5|tsp|salt ([CONFIRM])|st", "1|tsp|vegetable bouillon powder (for the pack's seasoning; [CONFIRM])|pa", "1|tsp|dried chives|sp", "0.5|tsp|dried parsley|sp",
  "0.25|tsp|dried marjoram|sp", "0.25|tsp|dried thyme|sp", "0.25|tsp|smoked paprika (optional, for the pack's smoked bacon; [CONFIRM])|sp",
  "1|tsp|lemon juice|pr", "0.25|tsp|sugar|st",
], [
  "Homemade mix: stir the cornstarch into 3 tbsp of the cold water to make a slurry. Add the rest of the water and the cream to the pot with the onion powder, garlic powder, pepper, nutmeg, salt, bouillon powder, herbs, smoked paprika (if using), lemon juice and sugar. Stir in the slurry and bring to a boil.",
]);
