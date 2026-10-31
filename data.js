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
const RECIPES = {
  mon: [
    R("m1", "Clean-Out Fried Rice", "Day-old rice plus any leftover meat and veg.", "20 min", [
      "3|cup|cooked rice (leftover)|lf",
      "1.5|cup|leftover cooked meat|lf",
      "3||egg~eggs|da",
      "1.5|cup|frozen peas & carrots|fr",
      "3||green onion~green onions|pr",
      "2|clove|garlic|st",
      "3|tbsp|soy sauce|co",
      "1|tsp|sesame oil|co",
      "2|tbsp|vegetable oil|st"
    ], [
      "Heat 1 tbsp oil in a large skillet or wok over high heat. Scramble the eggs, then move to a plate.",
      "Add the rest of the oil, minced garlic, the white parts of the green onions and the peas & carrots. Cook 2 minutes.",
      "Add the rice, break up clumps, and cook 3\u20134 minutes until hot and a little crisp.",
      "Stir in the leftover meat, soy sauce and sesame oil; fold the eggs back in.",
      "Top with sliced green onion tops and serve."
    ]),
    R("m2", "Leftover Frittata", "Eggs baked around whatever veg and meat are left.", "30 min", [
      "8||egg~eggs|da",
      "0.5|cup|milk|da",
      "1.5|cup|leftover cooked veggies|lf",
      "1|cup|leftover meat (ham, sausage, chicken)|lf",
      "1|cup|shredded cheddar|da",
      "1|tbsp|butter|st",
      SP,
      PP
    ], [
      "Heat the oven to 400\xB0F.",
      "Whisk the eggs, milk, a big pinch of salt and some pepper.",
      "Melt butter in a 10-inch oven-safe skillet over medium heat. Warm the leftovers 2\u20133 minutes.",
      "Pour in the eggs, sprinkle the cheese, and cook untouched 3 minutes until the edges set.",
      "Bake 12\u201315 minutes until the center is set. Rest 5 minutes and slice."
    ]),
    R("m3", "Clean-Out Quesadillas", "Crispy tortillas, melty cheese, leftover filling.", "15 min", [
      "8||flour tortilla (8-inch)~flour tortillas (8-inch)|ba",
      "2|cup|shredded Mexican cheese blend|da",
      "2|cup|leftover meat, beans or veg|lf",
      "1|tbsp|butter|st",
      "0.5|cup|salsa|co",
      "0.5|cup|sour cream|da"
    ], [
      "Chop the leftover filling into small pieces and warm it briefly in the microwave.",
      "Lay out 4 tortillas. Top each with cheese, filling, more cheese, and a second tortilla.",
      "Melt a little butter in a skillet over medium heat. Cook each quesadilla 2\u20133 minutes per side until golden and melted.",
      "Cut into wedges and serve with salsa and sour cream."
    ]),
    R("m4", "Leftover Grain Bowls", "Rice or grains, protein, greens and a lemon dressing.", "20 min", [
      "4|cup|leftover rice or grains|lf",
      "2|cup|leftover protein|lf",
      "1|can|chickpeas|pa",
      "4|cup|baby spinach|pr",
      "1||cucumber~cucumbers|pr",
      "1|cup|cherry tomatoes|pr",
      "0.5|cup|crumbled feta|da",
      "3|tbsp|olive oil|st",
      "1||lemon~lemons|pr",
      "1|tsp|Dijon mustard|co",
      SP,
      PP
    ], [
      "Whisk the olive oil, juice of the lemon, Dijon, salt and pepper.",
      "Rinse and drain the chickpeas. Chop the cucumber and halve the tomatoes.",
      "Warm the grains and protein.",
      "Build bowls: spinach, grains, protein, chickpeas, cucumber and tomatoes.",
      "Top with feta and drizzle with dressing."
    ]),
    R("m5", "Leftover Pasta Bake", "Leftover pasta and meat under bubbling cheese.", "35 min", [
      "4|cup|leftover cooked pasta|lf",
      "1.5|cup|leftover meat or roasted veg|lf",
      "1|jar|marinara sauce (24 oz)|co",
      "1.5|cup|shredded mozzarella|da",
      "0.25|cup|grated Parmesan|da",
      "1|tsp|Italian seasoning|sp"
    ], [
      "Heat the oven to 375\xB0F.",
      "Toss the pasta, leftovers, marinara and Italian seasoning in a 9\xD713 dish.",
      "Top with mozzarella and Parmesan.",
      "Bake 20\u201325 minutes until bubbling and golden."
    ]),
    R("m6", "Loaded Baked Potatoes", "Baked potatoes topped with leftover chili, meat or broccoli.", "60 min", [
      "2|lb|russet potatoes|pr",
      "2|cup|leftover chili, pulled meat or broccoli|lf",
      "1|cup|shredded cheddar|da",
      "0.5|cup|sour cream|da",
      "2||green onion~green onions|pr",
      "1|tbsp|olive oil|st",
      SP
    ], [
      "Heat the oven to 425\xB0F. Scrub the potatoes, poke with a fork, rub with oil and salt.",
      "Bake directly on the rack 45\u201355 minutes until tender.",
      "Warm the leftover topping.",
      "Split the potatoes, fluff the insides, and top with the leftovers and cheese.",
      "Finish with sour cream and sliced green onion."
    ]),
    R("m7", "Breakfast-for-Dinner Hash", "Crispy leftover potatoes and meat with fried eggs.", "30 min", [
      "4|cup|leftover roasted potatoes or veg|lf",
      "1.5|cup|leftover meat|lf",
      "1||yellow onion~yellow onions|st",
      "1||red bell pepper~red bell peppers|pr",
      "4||egg~eggs|da",
      "2|tbsp|butter|st",
      "1|tsp|paprika|sp",
      SP,
      PP
    ], [
      "Dice the onion, pepper, potatoes and meat.",
      "Melt butter in a large skillet over medium-high. Cook onion and pepper 5 minutes.",
      "Add potatoes, meat and paprika. Press flat and cook 8\u201310 minutes, flipping once, until crisp.",
      "Make 4 wells, crack in the eggs, cover and cook 4\u20135 minutes until whites set.",
      "Season with salt and pepper and serve."
    ])
  ],
  tue: [
    R("sp1", "Sheetpan Chicken Fajitas", "Chicken, peppers and onions baked on one pan. The source gives no amounts, so use what looks right for 4.", "30 min", [
      "0|-|boneless chicken breasts|me", "0|-|bell peppers|pr", "0|-|yellow onions|st", "0|-|vinegar|co", "0|-|fajita spices|sp",
      "0|-|limes (for juice)|pr", "0|-|cilantro|pr", "0|-|flour or corn tortillas|ba", "0|-|white rice (to serve)|st", "0|-|beans (to serve)|pa",
    ], [
      "Slice your chicken breasts into long strips.",
      "Toss it together with some bell peppers, onions, a little vinegar, and all the spices.",
      "Transfer it to a large sheet pan and spread it out in an even layer.",
      "Bake it for 20 minutes. (The source doesn't give an oven temperature.)",
      "Top it with some lime juice and cilantro.",
      "Serve it in warm flour or corn tortillas for tacos or with some rice and beans.",
    ], { by: "@isabeleatsrecipes", src: "https://recime.app/p/251484e4-e41a-41e3-b7b4-7398f28dd839", serves: 4 }),
    R("sp2", "Kielbasa, Potatoes & Green Beans", "Smoky sausage and crispy potatoes, one pan.", "40 min", [
      "14|oz|smoked kielbasa|me", "1.5|lb|baby gold potatoes|pr", "1|lb|green beans|pr", "3|tbsp|olive oil|st",
      "1|tsp|Italian seasoning|sp", "0.5|tsp|garlic powder|sp", "0.25|cup|grated Parmesan|da", SP, PP,
    ], [
      "Heat the oven to 425°F. Halve the potatoes and trim the green beans. Slice kielbasa into coins.",
      "Toss potatoes with 2 tbsp oil, Italian seasoning, garlic powder, salt and pepper. Roast 15 minutes.",
      "Add green beans and kielbasa tossed with the remaining oil. Roast 15–18 minutes more.",
      "Sprinkle with Parmesan and serve.",
    ]),
    R("sp3", "Lemon-Garlic Salmon & Broccoli", "Light, fast and only one pan to wash.", "25 min", [
      "1.5|lb|salmon fillets|me", "1.5|lb|broccoli crowns|pr", "3|tbsp|olive oil|st", "1||lemon~lemons|pr", "3|clove|garlic|st",
      "1|tsp|dried dill|sp", "2|tbsp|butter|st", SP, PP,
    ], [
      "Heat the oven to 425°F. Cut broccoli into florets and toss with 2 tbsp oil, salt and pepper. Roast 8 minutes.",
      "Melt butter with minced garlic, the lemon zest and dill.",
      "Push broccoli to the sides; add salmon, season, and spoon the garlic butter over it.",
      "Roast 10–12 minutes until salmon flakes. Squeeze lemon over everything.",
    ]),
    R("sp4", "Honey-Garlic Chicken Thighs & Veg", "Sticky, crispy thighs with potatoes and carrots.", "50 min", [
      "2|lb|bone-in chicken thighs|me", "6||carrot~carrots|pr", "1|lb|baby gold potatoes|pr", "3|tbsp|honey|co", "2|tbsp|soy sauce|co",
      "3|clove|garlic|st", "2|tbsp|olive oil|st", "1|tsp|dried thyme|sp", SP, PP,
    ], [
      "Heat the oven to 425°F. Cut carrots into sticks and halve the potatoes; toss with oil, thyme, salt and pepper.",
      "Nestle chicken skin-side up among the veg. Season with salt and pepper.",
      "Roast 25 minutes. Meanwhile whisk honey, soy sauce and minced garlic.",
      "Brush the glaze over the chicken and roast 10–15 minutes more, until 175°F and sticky.",
    ]),
    R("sp5", "Sheet-Pan Gnocchi with Sausage & Peppers", "Crispy gnocchi, no boiling needed.", "35 min", [
      "1|lb|potato gnocchi (shelf-stable)|pa", "1|lb|Italian sausage|me", "1||red bell pepper~red bell peppers|pr", "1||red onion~red onions|pr",
      "1|cup|cherry tomatoes|pr", "2|tbsp|olive oil|st", "1|tsp|Italian seasoning|sp", "0.25|cup|grated Parmesan|da",
      "1|bunch|basil|pr", SP, PP,
    ], [
      "Heat the oven to 450°F.",
      "Toss gnocchi, chopped pepper and onion, and tomatoes with oil, Italian seasoning, salt and pepper.",
      "Pinch sausage into small pieces over the pan.",
      "Roast 20–25 minutes, stirring once, until gnocchi are golden and sausage is cooked.",
      "Top with Parmesan and torn basil.",
    ]),
    R("sp6", "Sheet-Pan Shrimp Boil", "Shrimp, sausage, corn and potatoes in garlic butter.", "40 min", [
      "1.5|lb|large shrimp, peeled|me", "12|oz|andouille sausage|me", "1.5|lb|baby gold potatoes|pr", "4|ear|corn on the cob|pr",
      "4|tbsp|butter|st", "3|clove|garlic|st", "1|tbsp|Old Bay seasoning|sp", "1||lemon~lemons|pr", "1|bunch|flat-leaf parsley|pr",
    ], [
      "Heat the oven to 425°F. Halve potatoes; cut corn into thirds; slice sausage.",
      "Melt butter with minced garlic and Old Bay.",
      "Toss potatoes and corn with half the butter. Roast 20 minutes.",
      "Add sausage and shrimp, drizzle with remaining butter, and roast 8–10 minutes until shrimp are pink.",
      "Squeeze lemon over and scatter chopped parsley.",
    ]),
    R("sp7", "Vegetarian Sheet Pan Gnocchi", "Crispy gnocchi, chickpeas, peppers and burst tomatoes. Vegan.", "35 min", [
      "16|oz|potato gnocchi (shelf-stable)|pa", "1||yellow bell pepper~yellow bell peppers|pr", "2|cup|cherry tomatoes|pr",
      "1||red onion~red onions|pr", "1|can|chickpeas|pa", "2|tbsp|olive oil|st", "2|tbsp|nutritional yeast|pa",
      "1|tsp|garlic powder|sp", "0.5|tsp|dried oregano|sp", "1|bunch|basil|pr", "0|-|balsamic glaze|co", "0|-|vegan parmesan (optional)|da", SP,
    ], [
      "Preheat the oven to 400°F.",
      "Add the gnocchi, chopped bell pepper, cherry tomatoes (1 pint), chopped red onion and drained chickpeas to the sheet pan. Drizzle with olive oil and coat with nutritional yeast, garlic powder, ½ tsp salt and oregano. Toss until evenly mixed.",
      "Bake for 25 minutes, until the tomatoes are burst and the gnocchi has a slight crisp. In the last few minutes, you can broil to brown the gnocchi and tomatoes a bit, if desired.",
      "Serve immediately with fresh basil, balsamic glaze and vegan parmesan.",
    ], { by: "@PlantYou", src: "https://recime.app/p/abf42996-aaa0-42db-a749-27bd2c50f5f7", serves: 4 }),
    R("sp8", "Sheet Pan Crunchwrap", "One giant crunchwrap with spiced black beans, baked and cut into squares. Vegan.", "40 min", [
      "8||large tortilla~large tortillas|ba", "2|clove|garlic|st", "1|can|black beans (large, 19 oz / 540 ml)|pa", "1|packet|taco seasoning|sp",
      "2||Roma tomato~Roma tomatoes|pr", "1||red onion~red onions|pr", "1.5|cup|tortilla chips (crushed)|pa", "1|head|romaine lettuce (optional)|pr",
      "1|handful|vegan shredded cheese|da", "1|cup|vegan sour cream or coconut yogurt|da", "1|cup|vegan queso (optional)|da",
      "0|-|guacamole|pr", "0|-|pickled jalapeños|co", "0|-|salsa|co",
    ], [
      "Preheat your oven to 400°F (200°C) and line a large sheet pan with parchment paper.",
      "In a pan over medium heat, sauté the minced garlic for 1 to 2 minutes until fragrant.",
      "Add the drained black beans (or Beyond Meat) and taco seasoning along with ½ cup of water. Cook for 5 to 7 minutes, stirring frequently, until soft and flavorful. Lightly mash with the back of a spoon for a chunky texture.",
      "Lay 6 of the tortillas slightly overlapping across the sheet pan so they cover the base and hang over the sides. Place 1 tortilla in the center to fully cover the bottom, reserving the last one to close the top.",
      "Spoon the bean mixture evenly over the tortillas. Top with vegan cheese or queso and crushed tortilla chips. Add diced tomato, onion and lettuce now, or save them for topping at the end.",
      "Fold the overhanging edges toward the center and set the last tortilla in the middle to seal it. Place another sheet pan on top to keep it flat.",
      "Bake for 15 to 20 minutes, removing the top sheet pan halfway through if you'd like it extra crisp.",
      "Let cool slightly before slicing into squares. Serve with sour cream, salsa, guacamole or jalapeños.",
    ], { by: "@PlantYou", src: "https://recime.app/p/5e8baeef-ac72-4bcc-817c-b6f0baa950c4", serves: 8 }),
    R("sp9", "Cabbage Burgers / Cabbage Steaks", "Cabbage slices topped with seasoned ground meat and cheese. The saved recipe is missing its first steps; see the source.", "35 min", [
      "1|head|green cabbage|pr", "12|oz|ground beef, chicken or turkey (300–400 g)|me", "1||yellow onion~yellow onions|st", "2|clove|garlic|st",
      "0||paprika (optional)|sp", "0||dried herbs (optional)|sp", "0|-|grated cheese (optional)|da", SP, PP,
    ], [
      "Only the last step was saved in the source recipe. Open the source link for the full method.",
      "Oil. Bake at 375–390°F (190–200°C) for 25–30 minutes until golden and cooked through. In the last 5 minutes, sprinkle grated cheese on top and bake until melted.",
    ], { by: "unknown creator (via ReciMe)", src: "https://recime.app/p/2d913c7f-c181-4eae-8046-dc0c3d85e9de", serves: 4 }),
    R("sp10", "Scarpaccia", "Crispy Tuscan zucchini and onion flatbread.", "1 hr 10 min", [
      "1.65|lb|zucchini (750 g / 26.5 oz)|pr", "1|cup|all-purpose flour|st", "0.33|cup|cornstarch|pa", "1||red onion~red onions|pr",
      "0||extra-virgin olive oil|st", "0|-|plain breadcrumbs (optional)|pa", SP,
    ], [
      "Thinly slice the zucchini and red onion (using a mandoline if you have one).",
      "Place the vegetables in a colander over a bowl to collect the liquid. Add 1 tsp salt and mix well.",
      "Place a plate on top of the vegetables and add a weight. Leave to drain for 20–30 minutes.",
      "Measure the collected liquid (about ¾ cup / 200 ml). If you have less, add a little water to reach ¾ cup.",
      "Whisk the flour (130 g, Italian Type 1 or all-purpose) and cornstarch (40 g) into the liquid until smooth. Add a drizzle of olive oil.",
      "Add the zucchini and onion to the batter and mix well.",
      "Generously oil a non-stick baking tray of about 12 × 12 inches (30 × 30 cm). Spread the mixture evenly.",
      "Drizzle with more olive oil and sprinkle with breadcrumbs if you like extra crispiness.",
      "Bake in a preheated oven at 425°F (220°C) for 30–35 minutes, until golden and crispy.",
    ], { by: "@thatoneitalianchef", src: "https://recime.app/p/9ef79f67-525e-4a51-8e41-7339d838423c", serves: 4 }),
    R("sp11", "Fluffige Protein-Ofenpfannkuchen mit Apfel", "Fluffy high-protein oven pancake with apple and cinnamon (translated from German).", "25 min", [
      "1.25|cup|spelt flour (Dinkelmehl, 150 g)|pa", "1.25|cup|milk or coconut milk drink (300 ml)|da", "4||egg~eggs|da",
      "7|oz|skyr (200 g)|da", "2||apple~apples|pr", "0||ground cinnamon|sp", "0||erythritol sweetener (e.g. No More Sugar)|pa",
      "0|-|extra sweetener (optional)|pa",
    ], [
      "Stir the spelt flour, liquid (e.g. ⅔ cup coconut milk drink + ⅔ cup low-fat milk), eggs and skyr into a smooth batter.",
      "Spread the batter evenly on a sheet pan lined with parchment paper.",
      "Thinly slice the apples and spread them over the batter.",
      "Sprinkle with cinnamon and a little sweetener.",
      "Bake at 350°F (180°C) for about 15 minutes until golden.",
      "Let cool briefly, then top with more cinnamon and sweetener if you like.",
    ], { by: "@jasmin_alessia", src: "https://recime.app/p/7afbcc5e-7dad-44eb-9e53-11e14b415e50", serves: 4 }),
    R("sp12", "Sheet Pan Veggies", "Simple roasted vegetables: a side or a light dinner.", "35 min", [
      "1|lb|broccoli crowns|pr", "4||carrot~carrots|pr", "1||red bell pepper~red bell peppers|pr", "1||zucchini~zucchini|pr",
      "1||red onion~red onions|pr", "3|tbsp|olive oil|st", "1|tsp|garlic powder|sp", "1|tsp|Italian seasoning|sp", "1||lemon~lemons|pr", SP, PP,
    ], [
      "Heat the oven to 425°F and line a large sheet pan.",
      "Cut broccoli into florets, carrots into ½-inch coins, and the pepper, zucchini and onion into 1-inch pieces.",
      "Toss with olive oil, garlic powder, Italian seasoning, 1 tsp salt and pepper. Spread in one layer (use two pans if crowded).",
      "Roast 25–30 minutes, tossing halfway, until tender and browned at the edges.",
      "Squeeze lemon over before serving.",
    ]),
  ],
  wed: [
    R("w1", "One-Pot Chicken & Rice", "Golden chicken thighs baked over seasoned rice.", "50 min", [
      "2|lb|bone-in chicken thighs|me",
      "1.5|cup|white rice|st",
      "1||yellow onion~yellow onions|st",
      "3|clove|garlic|st",
      "1||red bell pepper~red bell peppers|pr",
      "1|tsp|paprika|sp",
      "1|tsp|ground cumin|sp",
      "0.5|tsp|ground turmeric|sp",
      "3|cup|chicken broth|pa",
      "1|cup|frozen peas|fr",
      "1|tbsp|olive oil|st",
      "1||lemon~lemons|pr",
      SP,
      PP
    ], [
      "Heat the oven to 375\xB0F. Season chicken with paprika, salt and pepper.",
      "Brown chicken skin-side down in oil in a Dutch oven, 6 minutes. Remove.",
      "Cook diced onion and pepper 4 minutes; add garlic, cumin, turmeric and rice and stir 1 minute.",
      "Add the broth, bring to a simmer, and nestle the chicken on top skin-side up.",
      "Cover and bake 30 minutes. Stir in the peas, rest 5 minutes covered, and finish with lemon."
    ]),
    R("w2", "One-Pot Beef Chili", "Hearty, freezer-friendly chili.", "60 min", [
      "1.5|lb|ground beef|me",
      "1||yellow onion~yellow onions|st",
      "3|clove|garlic|st",
      "1||green bell pepper~green bell peppers|pr",
      "2|tbsp|chili powder|sp",
      "2|tsp|ground cumin|sp",
      "1|tsp|dried oregano|sp",
      "1|can|kidney beans|pa",
      "1|can|black beans|pa",
      "1|can|crushed tomatoes (28 oz)|pa",
      "1|can|tomato sauce (8 oz)|pa",
      "1|tbsp|olive oil|st",
      "1|cup|shredded cheddar|da",
      "0.5|cup|sour cream|da",
      SP,
      PP
    ], [
      "Brown the beef in oil in a large pot; drain most of the fat.",
      "Add diced onion and pepper; cook 5 minutes. Add garlic, chili powder, cumin and oregano; cook 1 minute.",
      "Stir in the rinsed beans, crushed tomatoes and tomato sauce.",
      "Simmer uncovered 30\u201340 minutes, stirring now and then. Season with salt and pepper.",
      "Serve with cheddar and sour cream."
    ]),
    R("w3", "Sausage, White Bean & Kale Soup", "Cozy Italian-style soup in one pot.", "40 min", [
      "1|lb|Italian sausage|me",
      "1||yellow onion~yellow onions|st",
      "3|clove|garlic|st",
      "2||carrot~carrots|pr",
      "2|can|cannellini beans|pa",
      "4|cup|chicken broth|pa",
      "1|can|diced tomatoes (14.5 oz)|pa",
      "1|bunch|kale|pr",
      "1|tsp|Italian seasoning|sp",
      "0.25|tsp|red pepper flakes|sp",
      "0.25|cup|grated Parmesan|da",
      "1|tbsp|olive oil|st",
      SP,
      PP
    ], [
      "Brown the sausage in oil in a pot, breaking it up, 6 minutes.",
      "Add diced onion and carrots; cook 5 minutes. Add garlic, Italian seasoning and pepper flakes for 1 minute.",
      "Add broth, tomatoes and rinsed beans. Simmer 15 minutes.",
      "Stir in chopped kale and cook 5 minutes until tender.",
      "Season and serve topped with Parmesan."
    ]),
    R("w4", "Lemon Chicken Orzo", "Creamy, lemony and ready in one pan.", "35 min", [
      "1.5|lb|boneless chicken thighs|me",
      "1.5|cup|orzo|pa",
      "4|cup|chicken broth|pa",
      "1||lemon~lemons|pr",
      "3|clove|garlic|st",
      "1||yellow onion~yellow onions|st",
      "4|cup|baby spinach|pr",
      "0.5|cup|grated Parmesan|da",
      "2|tbsp|butter|st",
      "1|tsp|dried oregano|sp",
      SP,
      PP
    ], [
      "Season chicken with oregano, salt and pepper. Brown in butter in a deep skillet, 5 minutes per side. Remove and slice.",
      "Cook diced onion 3 minutes; add garlic and orzo and toast 1 minute.",
      "Add broth and the zest of the lemon. Simmer 10\u201312 minutes, stirring often, until orzo is tender.",
      "Stir in spinach, Parmesan and lemon juice.",
      "Return the chicken to the pan and warm through."
    ]),
    R("w5", "One-Pot Chili Mac", "Kid-friendly chili and macaroni with cheese.", "30 min", [
      "1|lb|ground beef|me",
      "1||yellow onion~yellow onions|st",
      "2|clove|garlic|st",
      "1|tbsp|chili powder|sp",
      "1|tsp|ground cumin|sp",
      "1|can|diced tomatoes (14.5 oz)|pa",
      "1|can|tomato sauce (8 oz)|pa",
      "2|cup|beef broth|pa",
      "8|oz|elbow macaroni|pa",
      "1.5|cup|shredded cheddar|da",
      SP
    ], [
      "Brown the beef and diced onion in a large pot; drain fat.",
      "Add garlic, chili powder and cumin for 1 minute.",
      "Add tomatoes, tomato sauce, broth and macaroni. Bring to a boil.",
      "Cover and simmer 10\u201312 minutes, stirring often, until pasta is tender.",
      "Stir in half the cheese, top with the rest, and cover until melted."
    ]),
    R("w6", "Chicken & Sausage Jambalaya", "Cajun rice with andouille and chicken.", "50 min", [
      "12|oz|andouille sausage|me",
      "1|lb|boneless chicken thighs|me",
      "1||yellow onion~yellow onions|st",
      "1||green bell pepper~green bell peppers|pr",
      "2|stalk|celery|pr",
      "3|clove|garlic|st",
      "1.5|cup|white rice|st",
      "1|can|diced tomatoes (14.5 oz)|pa",
      "3|cup|chicken broth|pa",
      "2|tsp|Cajun seasoning|sp",
      "1|tsp|dried thyme|sp",
      "2||bay leaf~bay leaves|sp",
      "1|tbsp|olive oil|st",
      "3||green onion~green onions|pr"
    ], [
      "Brown sliced sausage in oil in a Dutch oven; remove. Brown bite-size chicken with half the Cajun seasoning; remove.",
      "Cook diced onion, pepper and celery 5 minutes; add garlic for 1 minute.",
      "Stir in rice, remaining Cajun seasoning, thyme, bay leaves, tomatoes and broth.",
      "Return meat, bring to a boil, cover and simmer on low 20\u201325 minutes until rice is tender.",
      "Remove bay leaves and top with green onions."
    ])
  ],
  thu: [
    R("h1", "Beef & Broccoli", "Better than takeout, glossy garlic-ginger sauce.", "25 min", [
      "1.5|lb|flank steak|me",
      "1.5|lb|broccoli crowns|pr",
      "3|clove|garlic|st",
      "1|in|fresh ginger|pr",
      "0.33|cup|soy sauce|co",
      "2|tbsp|oyster sauce|co",
      "1|tbsp|brown sugar|st",
      "1|tbsp|cornstarch|pa",
      "2|tbsp|vegetable oil|st",
      "1|tsp|sesame oil|co",
      "2|cup|white rice|st"
    ], [
      "Start the rice. Slice steak thinly against the grain; toss with 1 tsp cornstarch.",
      "Whisk soy sauce, oyster sauce, brown sugar, remaining cornstarch, sesame oil and \xBD cup water.",
      "Sear beef in 1 tbsp oil over high heat in batches, 1\u20132 minutes. Remove.",
      "Add remaining oil and broccoli plus 2 tbsp water; cover and steam 3 minutes. Add garlic and ginger for 30 seconds.",
      "Add sauce and beef; toss until glossy and thick. Serve over rice."
    ]),
    R("h2", "Kung Pao Chicken", "Spicy, saucy and crunchy with peanuts.", "30 min", [
      "1.5|lb|boneless chicken thighs|me",
      "0.5|cup|unsalted peanuts|pa",
      "0.5|tsp|red pepper flakes|sp",
      "1||red bell pepper~red bell peppers|pr",
      "3||green onion~green onions|pr",
      "3|clove|garlic|st",
      "1|in|fresh ginger|pr",
      "3|tbsp|soy sauce|co",
      "1|tbsp|rice vinegar|co",
      "1|tbsp|hoisin sauce|co",
      "1|tbsp|sugar|st",
      "1|tbsp|cornstarch|pa",
      "2|tbsp|vegetable oil|st",
      "2|cup|white rice|st"
    ], [
      "Start the rice. Cut chicken into bite-size pieces; toss with 1 tbsp soy sauce and 1 tsp cornstarch.",
      "Whisk the rest of the soy sauce, vinegar, hoisin, sugar, cornstarch and \xBC cup water.",
      "Stir-fry chicken in oil over high heat 5\u20136 minutes until cooked.",
      "Add diced pepper, pepper flakes, garlic, ginger and green onion; cook 2 minutes.",
      "Add sauce and peanuts; toss until thick. Serve over rice."
    ]),
    R("h3", "Teriyaki Chicken & Veggies", "Easiest stir-fry night: bottled sauce, frozen veg.", "25 min", [
      "1.5|lb|boneless chicken thighs|me",
      "0.5|cup|teriyaki sauce|co",
      "1|bag|frozen stir-fry vegetables (16 oz)|fr",
      "2|clove|garlic|st",
      "1|tbsp|vegetable oil|st",
      "1|tsp|sesame seeds|sp",
      "2|cup|white rice|st",
      "2||green onion~green onions|pr"
    ], [
      "Start the rice. Cut chicken into bite-size pieces.",
      "Stir-fry chicken in oil over high heat 5\u20136 minutes until browned.",
      "Add frozen vegetables and garlic; cook 4\u20135 minutes until hot.",
      "Pour in teriyaki sauce and simmer 1\u20132 minutes until glossy.",
      "Serve over rice with sesame seeds and green onions."
    ]),
    R("h4", "Shrimp Lo Mein", "Saucy noodles loaded with veg.", "25 min", [
      "1|lb|large shrimp, peeled|me",
      "8|oz|lo mein noodles or spaghetti|pa",
      "2||carrot~carrots|pr",
      "1||red bell pepper~red bell peppers|pr",
      "6|oz|snow peas|pr",
      "3|clove|garlic|st",
      "1|in|fresh ginger|pr",
      "3|tbsp|soy sauce|co",
      "2|tbsp|oyster sauce|co",
      "1|tsp|sesame oil|co",
      "1|tsp|sugar|st",
      "2|tbsp|vegetable oil|st",
      "3||green onion~green onions|pr"
    ], [
      "Cook noodles per package; drain and toss with sesame oil.",
      "Whisk soy sauce, oyster sauce and sugar.",
      "Stir-fry shrimp in 1 tbsp oil over high heat 2\u20133 minutes; remove.",
      "Add remaining oil, julienned carrots, sliced pepper and snow peas; cook 3 minutes. Add garlic and ginger 30 seconds.",
      "Add noodles, shrimp, sauce and green onions; toss 1\u20132 minutes."
    ]),
    R("h5", "Crispy Tofu & Veggie Stir-Fry", "Golden tofu in a sweet-savory sauce.", "35 min", [
      "1|block|extra-firm tofu (14 oz)|pr",
      "2|tbsp|cornstarch|pa",
      "1|lb|broccoli crowns|pr",
      "1||red bell pepper~red bell peppers|pr",
      "6|oz|snow peas|pr",
      "3|clove|garlic|st",
      "1|in|fresh ginger|pr",
      "3|tbsp|soy sauce|co",
      "2|tbsp|hoisin sauce|co",
      "1|tbsp|rice vinegar|co",
      "1|tbsp|honey|co",
      "3|tbsp|vegetable oil|st",
      "2|cup|white rice|st"
    ], [
      "Start the rice. Press tofu 10 minutes, cube, and toss with cornstarch.",
      "Fry tofu in 2 tbsp oil over medium-high 8\u201310 minutes, turning, until crisp. Remove.",
      "Whisk soy sauce, hoisin, vinegar, honey and 2 tbsp water.",
      "Stir-fry broccoli, pepper and snow peas in remaining oil 4 minutes; add garlic and ginger 30 seconds.",
      "Add tofu and sauce; toss to coat. Serve over rice."
    ]),
    R("h6", "Ginger Pork & Green Beans", "Blistered beans with savory ground pork.", "25 min", [
      "1|lb|ground pork|me",
      "1|lb|green beans|pr",
      "4|clove|garlic|st",
      "2|in|fresh ginger|pr",
      "3|tbsp|soy sauce|co",
      "1|tbsp|hoisin sauce|co",
      "0.5|tsp|red pepper flakes|sp",
      "1|tbsp|vegetable oil|st",
      "1|tsp|sesame oil|co",
      "2|cup|white rice|st",
      "2||green onion~green onions|pr"
    ], [
      "Start the rice. Trim the green beans.",
      "Cook beans in oil over high heat 6\u20138 minutes until blistered. Remove.",
      "Brown the pork 5 minutes, breaking it up. Add garlic, ginger and pepper flakes for 1 minute.",
      "Stir in soy sauce, hoisin and beans; toss 1\u20132 minutes.",
      "Finish with sesame oil and green onions. Serve over rice."
    ])
  ],
  fri: [
    R("bz1", "Classic Brotzeit Board", "Rye bread, ham, salami, Leberwurst, cheese, radishes and pickles.", "15 min", [
      "1|loaf|dark rye bread|ba", "4||soft pretzel~soft pretzels|ba", "8|oz|Black Forest ham|me", "6|oz|sliced salami|me",
      "8|oz|Leberwurst (liverwurst)|me", "8|oz|Emmentaler|da", "4|tbsp|butter|st", "1|bunch|radishes|pr",
      "1|jar|gherkins (Gewürzgurken)|co", "0||German mustard|co", "1|bunch|chives|pr",
    ], [
      "Take butter, cheese and Leberwurst out 20 minutes ahead so they spread easily.",
      "Slice the bread; warm the pretzels in a 350°F oven for 5 minutes.",
      "Trim radishes (slice some thin and salt them). Snip chives.",
      "Arrange ham, salami, Leberwurst, sliced cheese, radishes and gherkins on a board.",
      "Serve with butter, mustard and chives so everyone builds their own.",
    ]),
    R("bz2", "Obatzda & Pretzels", "Bavarian beer-garden cheese spread with warm pretzels.", "20 min", [
      "8|oz|ripe Camembert|da", "4|oz|cream cheese|da", "2|tbsp|butter|st", "0.5||red onion~red onions|pr", "1|tsp|sweet paprika|sp",
      "0.5|tsp|caraway seeds|sp", "2|tbsp|beer (optional)|ot", "4||soft pretzel~soft pretzels|ba", "1|bunch|radishes|pr",
      "1|bunch|chives|pr", SP, PP,
    ], [
      "Let Camembert, cream cheese and butter soften 30 minutes.",
      "Chop the Camembert (rind and all) and mash with cream cheese and butter until mostly smooth.",
      "Stir in finely diced red onion, paprika, caraway, beer, salt and pepper.",
      "Chill 15 minutes. Dust with paprika and top with chives and onion rings.",
      "Serve with warm pretzels and sliced radishes.",
    ]),
    R("bz3", "Wurstsalat", "Tangy sausage salad with cheese, pickles and onion.", "20 min", [
      "1|lb|Fleischwurst or bologna (thick-sliced)|me", "6|oz|Emmentaler|da", "1||red onion~red onions|pr",
      "1|jar|gherkins (Gewürzgurken)|co", "3|tbsp|white wine vinegar|co", "3|tbsp|vegetable oil|st", "1|tsp|sugar|st",
      "1|bunch|chives|pr", "1|loaf|dark rye bread|ba", "4|tbsp|butter|st", SP, PP,
    ], [
      "Cut the sausage and cheese into thin strips; slice the onion into thin rings; slice 4–5 gherkins.",
      "Whisk vinegar, 3 tbsp pickle brine, oil, sugar, salt and pepper.",
      "Toss everything with the dressing and let it sit 10 minutes.",
      "Top with chives. Serve with buttered rye bread.",
    ]),
    R("bz4", "Abendbrot with Leberwurst & Eggs", "Buttered rye, liverwurst, eggs and crunchy veg.", "20 min", [
      "1|loaf|dark rye bread|ba", "8|oz|Leberwurst (liverwurst)|me", "6||egg~eggs|da", "4|tbsp|butter|st", "1||cucumber~cucumbers|pr",
      "2||Roma tomato~Roma tomatoes|pr", "1|bunch|radishes|pr", "1|bunch|chives|pr", "1|jar|gherkins (Gewürzgurken)|co", SP, PP,
    ], [
      "Hard-boil the eggs: 10 minutes in simmering water, then into ice water. Peel and halve.",
      "Slice bread, cucumber, tomatoes and radishes.",
      "Spread bread with butter and Leberwurst; top with chives.",
      "Serve with eggs, veg and gherkins, seasoned with salt and pepper.",
    ]),
    R("bz5", "Ham & Cheese Platter with Kräuterquark", "Black Forest ham, mild cheese and a fresh herb dip.", "20 min", [
      "8|oz|Black Forest ham|me", "6|oz|Butterkäse or mild Gouda|da", "1|cup|quark or plain Greek yogurt|da", "1|bunch|chives|pr",
      "1|bunch|flat-leaf parsley|pr", "1|clove|garlic|st", "1|loaf|dark rye bread|ba", "4||pretzel roll~pretzel rolls|ba",
      "1|bunch|radishes|pr", "1||cucumber~cucumbers|pr", SP, PP,
    ], [
      "Kräuterquark: stir quark with finely chopped chives and parsley, grated garlic, salt and pepper.",
      "Slice the bread and rolls; cut cucumber and radishes into sticks.",
      "Arrange ham and cheese on a board with the veg.",
      "Serve the herb dip for bread and veg.",
    ]),
    R("bz6", "Strammer Max", "Open-face ham on buttered bread with a fried egg.", "15 min", [
      "1|loaf|rustic farmhouse bread|ba", "8|oz|Black Forest ham|me", "4||egg~eggs|da", "3|tbsp|butter|st",
      "1|jar|gherkins (Gewürzgurken)|co", "1|bunch|chives|pr", SP, PP,
    ], [
      "Toast 4 thick slices of bread in 1 tbsp butter until golden.",
      "Top each with ham.",
      "Fry the eggs sunny-side up in the remaining butter.",
      "Set an egg on each slice; season and scatter chives. Serve with gherkins.",
    ]),
  ],
  sat: [
    R("cp1", "Slow Cooker Pulled Pork", "Tender BBQ pork on buns with slaw.", "8 hr low", [
      "3|lb|boneless pork shoulder|me", "1||yellow onion~yellow onions|st", "1|cup|BBQ sauce|co", "2|tbsp|brown sugar|st",
      "1|tsp|smoked paprika|sp", "1|tsp|garlic powder|sp", "1|tsp|ground cumin|sp", "0.5|cup|chicken broth|pa",
      "2|tbsp|apple cider vinegar|co", "8||hamburger bun~hamburger buns|ba", "1|bag|coleslaw mix (14 oz)|pr", SP, PP,
    ], [
      "Rub pork with brown sugar, smoked paprika, garlic powder, cumin, 2 tsp salt and pepper.",
      "Put sliced onion in the slow cooker, pork on top, and pour in broth and vinegar.",
      "Cook on low 8–10 hours (or high 5–6) until it shreds easily.",
      "Shred, discard most of the liquid, and stir in BBQ sauce.",
      "Serve on buns with coleslaw. Leftovers are great for Monday.",
    ]),
    R("cp2", "Crockpot Beef Stew", "Classic stew with potatoes, carrots and peas.", "8 hr low", [
      "2|lb|beef stew meat|me", "1.5|lb|baby gold potatoes|pr", "4||carrot~carrots|pr", "2|stalk|celery|pr",
      "1||yellow onion~yellow onions|st", "3|clove|garlic|st", "3|cup|beef broth|pa", "1|can|tomato paste (6 oz)|pa",
      "1|tbsp|Worcestershire sauce|co", "3|tbsp|all-purpose flour|st", "1|tsp|dried thyme|sp", "2||bay leaf~bay leaves|sp",
      "1|cup|frozen peas|fr", SP, PP,
    ], [
      "Toss beef with flour, 1 tsp salt and pepper.",
      "Add beef, halved potatoes, chunked carrots and celery, chopped onion and garlic to the slow cooker.",
      "Whisk broth with 2 tbsp tomato paste and Worcestershire; pour over. Add thyme and bay leaves.",
      "Cook on low 8 hours (or high 5) until beef is tender.",
      "Stir in peas for the last 10 minutes. Remove bay leaves and season.",
    ]),
    R("cp3", "Slow Cooker Chicken Tortilla Soup", "Dump-and-go soup with all the toppings.", "6 hr low", [
      "1.5|lb|boneless chicken breasts|me", "1|can|black beans|pa", "1|can|fire-roasted diced tomatoes (14.5 oz)|pa",
      "1|can|diced green chiles (4 oz)|pa", "1|cup|frozen corn|fr", "1||yellow onion~yellow onions|st", "3|clove|garlic|st",
      "4|cup|chicken broth|pa", "2|tsp|chili powder|sp", "1|tsp|ground cumin|sp", "1||lime~limes|pr", "1||avocado~avocados|pr",
      "1|cup|shredded Mexican cheese blend|da", "1|bag|tortilla chips|pa", "1|bunch|cilantro|pr", SP,
    ], [
      "Add chicken, rinsed beans, tomatoes, chiles, corn, diced onion, garlic, broth, chili powder, cumin and 1 tsp salt to the slow cooker.",
      "Cook on low 6 hours (or high 3–4).",
      "Shred the chicken in the pot with two forks.",
      "Stir in lime juice and season.",
      "Top bowls with avocado, cheese, crushed chips and cilantro.",
    ]),
    R("cp4", "Crockpot Pot Roast", "Fall-apart beef with potatoes and carrots.", "8 hr low", [
      "3|lb|beef chuck roast|me", "1.5|lb|baby gold potatoes|pr", "4||carrot~carrots|pr", "2|stalk|celery|pr",
      "1||yellow onion~yellow onions|st", "4|clove|garlic|st", "2|cup|beef broth|pa", "1|tbsp|Worcestershire sauce|co",
      "2|tbsp|vegetable oil|st", "1|tsp|dried thyme|sp", "2||bay leaf~bay leaves|sp", "2|tbsp|cornstarch|pa", SP, PP,
    ], [
      "Season roast well with salt and pepper and sear in oil in a skillet, 4 minutes per side (optional, but tastier).",
      "Put potatoes, carrots, celery, onion and garlic in the slow cooker; set the roast on top.",
      "Add broth, Worcestershire, thyme and bay leaves.",
      "Cook on low 8–9 hours until fork-tender.",
      "For gravy, simmer 2 cups of the liquid with cornstarch mixed in 2 tbsp water until thick.",
    ]),
    R("cp5", "Slow Cooker Butter Chicken", "Creamy, mildly spiced curry over rice.", "6 hr low", [
      "2|lb|boneless chicken thighs|me", "1||yellow onion~yellow onions|st", "4|clove|garlic|st", "2|in|fresh ginger|pr",
      "1|can|tomato sauce (15 oz)|pa", "2|tbsp|garam masala|sp", "1|tsp|ground turmeric|sp", "1|tsp|ground cumin|sp",
      "4|tbsp|butter|st", "1|cup|heavy cream|da", "2|cup|white rice|st", "4||naan flatbread~naan flatbreads|ba",
      "1|bunch|cilantro|pr", SP,
    ], [
      "Add chicken, diced onion, grated garlic and ginger, tomato sauce, spices, butter and 1½ tsp salt to the slow cooker.",
      "Cook on low 6 hours (or high 3–4).",
      "Stir in the cream and cook 15 minutes more. Break chicken into pieces.",
      "Meanwhile cook the rice and warm the naan.",
      "Serve over rice with cilantro.",
    ]),
    R("cp6", "Crockpot Swedish Meatballs", "Creamy gravy over egg noodles.", "4 hr low", [
      "2|lb|frozen meatballs|fr", "2|cup|beef broth|pa", "1|can|cream of mushroom soup (10.5 oz)|pa", "1|tbsp|Worcestershire sauce|co",
      "0.5|tsp|garlic powder|sp", "1|cup|sour cream|da", "12|oz|wide egg noodles|pa", "1|bunch|flat-leaf parsley|pr", SP, PP,
    ], [
      "Add frozen meatballs to the slow cooker.",
      "Whisk broth, mushroom soup, Worcestershire, garlic powder and pepper; pour over.",
      "Cook on low 4 hours (or high 2–3).",
      "Stir in sour cream and cook 15 minutes more.",
      "Serve over cooked egg noodles with chopped parsley.",
    ]),
  ],
  sun: [
    R("p1", "Margherita Pizza", "Tomato, fresh mozzarella and basil. Makes two 12-inch pies.", "30 min", [
      "2|lb|pizza dough|ba",
      "1|jar|pizza sauce (14 oz)|co",
      "8|oz|fresh mozzarella|da",
      "1|bunch|basil|pr",
      "2|tbsp|olive oil|st",
      "0.25|cup|all-purpose flour|st",
      SP
    ], [
      "Heat the oven (with a pizza stone or sheet pan inside) to 500\xB0F. Let dough sit out 30 minutes.",
      "On a floured surface, stretch each dough ball to 12 inches.",
      "Spread a thin layer of sauce, add torn mozzarella, a drizzle of oil and a pinch of salt.",
      "Bake 10\u201312 minutes until the crust is golden and cheese bubbles.",
      "Top with fresh basil and slice."
    ]),
    R("p2", "Pepperoni Pizza", "The family favorite. Two 12-inch pies.", "30 min", [
      "2|lb|pizza dough|ba",
      "1|jar|pizza sauce (14 oz)|co",
      "3|cup|shredded mozzarella|da",
      "6|oz|sliced pepperoni|me",
      "1|tsp|Italian seasoning|sp",
      "0.25|cup|grated Parmesan|da",
      "2|tbsp|olive oil|st",
      "0.25|cup|all-purpose flour|st"
    ], [
      "Heat the oven with a stone or sheet pan to 500\xB0F.",
      "Stretch the dough on a floured surface into two 12-inch rounds; brush edges with oil.",
      "Add sauce, mozzarella, pepperoni, Parmesan and Italian seasoning.",
      "Bake 10\u201312 minutes until golden and the pepperoni curls."
    ]),
    R("p3", "BBQ Chicken Pizza", "Rotisserie chicken, BBQ sauce, red onion, cilantro.", "30 min", [
      "2|lb|pizza dough|ba",
      "0.5|cup|BBQ sauce|co",
      "1||rotisserie chicken~rotisserie chickens|me",
      "2|cup|shredded mozzarella|da",
      "1|cup|shredded Gouda|da",
      "1||red onion~red onions|pr",
      "1|bunch|cilantro|pr",
      "2|tbsp|olive oil|st",
      "0.25|cup|all-purpose flour|st"
    ], [
      "Heat the oven with a stone or sheet pan to 500\xB0F.",
      "Shred about 2 cups of the chicken and toss with 2 tbsp BBQ sauce. Thinly slice the onion.",
      "Stretch dough into two rounds. Spread with remaining BBQ sauce.",
      "Top with mozzarella, Gouda, chicken and onion.",
      "Bake 10\u201312 minutes. Finish with cilantro."
    ]),
    R("p4", "Veggie Supreme Pizza", "Mushrooms, peppers, onion and olives.", "35 min", [
      "2|lb|pizza dough|ba",
      "1|jar|pizza sauce (14 oz)|co",
      "3|cup|shredded mozzarella|da",
      "8|oz|mushrooms|pr",
      "1||green bell pepper~green bell peppers|pr",
      "1||red onion~red onions|pr",
      "1|can|sliced black olives (2.25 oz)|pa",
      "1|tsp|Italian seasoning|sp",
      "2|tbsp|olive oil|st",
      "0.25|cup|all-purpose flour|st"
    ], [
      "Heat the oven with a stone or sheet pan to 500\xB0F.",
      "Slice mushrooms, pepper and onion. Saut\xE9 in 1 tbsp oil 4 minutes to dry them out.",
      "Stretch dough into two rounds; add sauce and mozzarella.",
      "Top with veggies, olives and Italian seasoning.",
      "Bake 12\u201314 minutes until golden."
    ]),
    R("p6", "Naan Pizzas", "15-minute personal pizzas on naan.", "15 min", [
      "4||naan flatbread~naan flatbreads|ba",
      "1|jar|pizza sauce (14 oz)|co",
      "2|cup|shredded mozzarella|da",
      "4|oz|sliced pepperoni|me",
      "1|cup|cherry tomatoes|pr",
      "1|bunch|basil|pr",
      "1|tbsp|olive oil|st"
    ], [
      "Heat the oven to 425\xB0F. Put naan on a sheet pan and brush with oil.",
      "Spread each with sauce; top with mozzarella, pepperoni and halved tomatoes.",
      "Bake 8\u201310 minutes until bubbly.",
      "Top with basil and serve."
    ]),
    R("p7", "White Pizza with Spinach", "Garlicky ricotta, mozzarella and spinach, no red sauce.", "30 min", [
      "2|lb|pizza dough|ba",
      "1|cup|ricotta|da",
      "2|cup|shredded mozzarella|da",
      "0.25|cup|grated Parmesan|da",
      "4|clove|garlic|st",
      "4|cup|baby spinach|pr",
      "3|tbsp|olive oil|st",
      "0.25|tsp|red pepper flakes|sp",
      "0.25|cup|all-purpose flour|st",
      SP,
      PP
    ], [
      "Heat the oven with a stone or sheet pan to 500\xB0F.",
      "Stir ricotta with Parmesan, half the minced garlic, salt and pepper.",
      "Wilt spinach with the rest of the garlic in 1 tbsp oil, 2 minutes.",
      "Stretch dough into two rounds; brush with oil. Dollop ricotta, add mozzarella and spinach.",
      "Bake 10\u201312 minutes. Finish with pepper flakes."
    ])
  ]
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
