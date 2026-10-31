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
  mon: "Leftover Day",
  tue: "Taco Tuesday",
  wed: "One Pot Wednesday",
  thu: "Stir-Fry Thursday",
  fri: "Pizza Friday",
  sat: "Grill Saturday",
  sun: "Comfort Sunday"
};
const CAT_ORDER = ["st", "sp", "pr", "me", "da", "ba", "fr", "pa", "co", "ot"];
const CAT_LABEL = {
  st: "Staples",
  sp: "Spices",
  pr: "Produce",
  me: "Meat & Seafood",
  da: "Dairy & Eggs",
  ba: "Bakery & Tortillas",
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
function R(id, name, desc, time, ings, steps) {
  return { id, name, desc, time, ing: ings.map(parseIng), steps };
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
    R("t1", "Ground Beef Tacos", "The classic weeknight taco.", "25 min", [
      "1.5|lb|ground beef|me",
      "1||yellow onion~yellow onions|st",
      "2|clove|garlic|st",
      "1|tbsp|chili powder|sp",
      "1|tsp|ground cumin|sp",
      "1|tsp|paprika|sp",
      "0.5|tsp|dried oregano|sp",
      "1|can|tomato sauce (8 oz)|pa",
      "12||corn tortilla~corn tortillas|ba",
      "1|head|iceberg lettuce|pr",
      "2||Roma tomato~Roma tomatoes|pr",
      "1|cup|shredded cheddar|da",
      "0.5|cup|sour cream|da",
      SP
    ], [
      "Brown the beef with diced onion in a skillet over medium-high, 6\u20138 minutes. Drain fat.",
      "Stir in minced garlic, chili powder, cumin, paprika, oregano and 1 tsp salt; cook 1 minute.",
      "Add tomato sauce and \xBC cup water. Simmer 5 minutes until thick.",
      "Warm tortillas in a dry skillet. Shred the lettuce and dice the tomatoes.",
      "Fill tortillas with beef, lettuce, tomato, cheese and sour cream."
    ]),
    R("t2", "Chicken Tinga Tacos", "Smoky chipotle-tomato shredded chicken.", "35 min", [
      "1.5|lb|boneless chicken thighs|me",
      "1||yellow onion~yellow onions|st",
      "3|clove|garlic|st",
      "1|can|fire-roasted diced tomatoes (14.5 oz)|pa",
      "1|can|chipotles in adobo (7 oz)|pa",
      "1|tsp|dried oregano|sp",
      "1|tsp|ground cumin|sp",
      "1|tbsp|vegetable oil|st",
      "12||corn tortilla~corn tortillas|ba",
      "2||avocado~avocados|pr",
      "0.5|cup|crumbled cotija|da",
      "1||lime~limes|pr",
      "1|bunch|cilantro|pr",
      SP
    ], [
      "Simmer the chicken in salted water 15\u201318 minutes until cooked. Shred with two forks.",
      "Meanwhile, cook sliced onion in oil over medium 5 minutes; add garlic for 1 minute.",
      "Blend the tomatoes, 2 chipotles plus 1 tbsp adobo, oregano and cumin. Pour into the pan and simmer 5 minutes.",
      "Stir in the chicken and simmer 5 more minutes. Season with salt.",
      "Serve in warm tortillas with avocado, cotija, cilantro and lime."
    ]),
    R("t3", "Baja Fish Tacos", "Spiced white fish with a creamy lime slaw.", "30 min", [
      "1.5|lb|cod or tilapia fillets|me",
      "1|tsp|chili powder|sp",
      "1|tsp|ground cumin|sp",
      "0.5|tsp|garlic powder|sp",
      "2|tbsp|vegetable oil|st",
      "1|bag|coleslaw mix (14 oz)|pr",
      "0.33|cup|mayonnaise|co",
      "2||lime~limes|pr",
      "1|tsp|sriracha|co",
      "12||corn tortilla~corn tortillas|ba",
      "1||avocado~avocados|pr",
      "1|bunch|cilantro|pr",
      SP
    ], [
      "Stir the mayo, juice of 1 lime and sriracha. Toss half with the coleslaw mix.",
      "Pat the fish dry and season with chili powder, cumin, garlic powder and salt.",
      "Heat oil in a skillet over medium-high. Cook fish 3\u20134 minutes per side until flaky.",
      "Warm tortillas. Flake the fish into them.",
      "Top with slaw, avocado, cilantro, the rest of the sauce, and lime wedges."
    ]),
    R("t4", "Sweet Potato & Black Bean Tacos", "Roasted, smoky and meat-free.", "35 min", [
      "2||sweet potato~sweet potatoes|pr",
      "1|can|black beans|pa",
      "2|tbsp|olive oil|st",
      "2|tsp|chili powder|sp",
      "1|tsp|ground cumin|sp",
      "0.5|tsp|smoked paprika|sp",
      "12||corn tortilla~corn tortillas|ba",
      "1||avocado~avocados|pr",
      "0.5|cup|crumbled cotija|da",
      "1||lime~limes|pr",
      "1||red onion~red onions|pr",
      SP
    ], [
      "Heat the oven to 425\xB0F. Dice the sweet potatoes into \xBD-inch cubes.",
      "Toss with oil, chili powder, cumin, smoked paprika and salt. Roast 20\u201325 minutes, tossing once.",
      "Warm the rinsed black beans with a pinch of salt.",
      "Thinly slice the red onion and squeeze some lime over it.",
      "Fill tortillas with sweet potato, beans, avocado, onion and cotija."
    ]),
    R("t5", "Garlic-Lime Shrimp Tacos", "Fast, bright and weeknight easy.", "20 min", [
      "1.5|lb|large shrimp, peeled|me",
      "2|tbsp|olive oil|st",
      "2|clove|garlic|st",
      "1|tsp|chili powder|sp",
      "0.5|tsp|ground cumin|sp",
      "0.5|tsp|smoked paprika|sp",
      "2||lime~limes|pr",
      "12||corn tortilla~corn tortillas|ba",
      "1|bag|coleslaw mix (14 oz)|pr",
      "0.33|cup|mayonnaise|co",
      "1|tsp|sriracha|co",
      "1|bunch|cilantro|pr",
      SP
    ], [
      "Toss shrimp with chili powder, cumin, smoked paprika and salt.",
      "Heat oil in a large skillet over medium-high. Cook shrimp 1\u20132 minutes per side; add minced garlic for the last 30 seconds.",
      "Squeeze 1 lime over the shrimp.",
      "Mix mayo, sriracha and a squeeze of lime; toss with the slaw.",
      "Serve shrimp in warm tortillas with slaw and cilantro."
    ]),
    R("t6", "Pork Carnitas Tacos", "Slow-cooked, then crisped. Great for leftovers Monday.", "3 hr", [
      "3|lb|boneless pork shoulder|me",
      "1||yellow onion~yellow onions|st",
      "4|clove|garlic|st",
      "1||orange~oranges|pr",
      "1||lime~limes|pr",
      "2|tsp|ground cumin|sp",
      "1|tsp|dried oregano|sp",
      "2|tbsp|vegetable oil|st",
      "12||corn tortilla~corn tortillas|ba",
      "0.5|cup|salsa verde|co",
      "1|bunch|cilantro|pr",
      "1||red onion~red onions|pr",
      SP
    ], [
      "Heat the oven to 300\xB0F. Cut pork into 2-inch chunks; season with 2 tsp salt, cumin and oregano.",
      "Put pork, quartered onion, smashed garlic, the juice of the orange and lime (plus the spent halves) in a Dutch oven. Add water to come halfway up.",
      "Cover and bake 2\xBD\u20133 hours until fork-tender.",
      "Shred the pork. Heat oil in a skillet over high and crisp the pork in batches, splashing in a little cooking liquid.",
      "Serve in tortillas with salsa verde, diced red onion and cilantro."
    ])
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
    R("p2", "Pepperoni Pizza", "The Friday-night favorite. Two 12-inch pies.", "30 min", [
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
    R("p5", "Sausage & Pepper Sheet-Pan Pizza", "One big thick-crust pizza, no stretching skills needed.", "40 min", [
      "2|lb|pizza dough|ba",
      "1|jar|pizza sauce (14 oz)|co",
      "1|lb|Italian sausage|me",
      "3|cup|shredded mozzarella|da",
      "1||red bell pepper~red bell peppers|pr",
      "1||yellow onion~yellow onions|st",
      "3|tbsp|olive oil|st",
      "0.5|tsp|red pepper flakes|sp"
    ], [
      "Heat the oven to 450\xB0F. Oil a rimmed sheet pan with 2 tbsp oil.",
      "Press the dough into the pan; let it rest 10 minutes and press again to the edges.",
      "Brown the sausage with sliced pepper and onion in the remaining oil, 8 minutes.",
      "Spread sauce, then cheese, then sausage and peppers over the dough.",
      "Bake 18\u201322 minutes until the bottom is crisp. Sprinkle with pepper flakes."
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
  ],
  sat: [
    R("s1", "Classic Cheeseburgers", "Juicy grilled burgers with all the fixings.", "25 min", [
      "1.5|lb|ground beef|me",
      "4|slice|cheddar|da",
      "4||hamburger bun~hamburger buns|ba",
      "1|head|iceberg lettuce|pr",
      "2||Roma tomato~Roma tomatoes|pr",
      "1||red onion~red onions|pr",
      "1|tsp|garlic powder|sp",
      "0||ketchup|co",
      "0||mustard|co",
      SP,
      PP
    ], [
      "Heat the grill to medium-high (about 450\xB0F).",
      "Gently form beef into 4 patties slightly wider than the buns; press a dimple in the center. Season with garlic powder, salt and pepper.",
      "Grill 4 minutes, flip, add cheese, and grill 3\u20134 minutes more for medium.",
      "Toast the buns on the grill for 1 minute.",
      "Build burgers with lettuce, tomato, onion, ketchup and mustard."
    ]),
    R("s2", "Lemon-Garlic Chicken Kebabs", "Marinated chicken and veggie skewers.", "45 min", [
      "2|lb|boneless chicken breasts|me",
      "4|tbsp|olive oil|st",
      "2||lemon~lemons|pr",
      "4|clove|garlic|st",
      "1|tsp|dried oregano|sp",
      "1|tsp|paprika|sp",
      "0.5|tsp|ground cumin|sp",
      "1||red bell pepper~red bell peppers|pr",
      "1||green bell pepper~green bell peppers|pr",
      "1||red onion~red onions|pr",
      "1||zucchini~zucchini|pr",
      "8||wooden skewer~wooden skewers|ot",
      SP,
      PP
    ], [
      "Soak skewers 20 minutes. Cut chicken and veggies into 1\xBD-inch pieces.",
      "Whisk oil, lemon juice, minced garlic, oregano, paprika, cumin, salt and pepper. Marinate chicken at least 20 minutes.",
      "Thread chicken and vegetables onto skewers.",
      "Grill over medium-high 10\u201312 minutes, turning, until chicken reaches 165\xB0F.",
      "Squeeze extra lemon over the top."
    ]),
    R("s3", "Grilled Steak with Chimichurri", "Charred sirloin and a bright herb sauce.", "30 min", [
      "2|lb|sirloin steak|me",
      "1|bunch|flat-leaf parsley|pr",
      "3|clove|garlic|st",
      "0.5|cup|olive oil|st",
      "2|tbsp|red wine vinegar|co",
      "0.5|tsp|red pepper flakes|sp",
      "1|tsp|dried oregano|sp",
      SP,
      PP
    ], [
      "Take steak out 30 minutes early; season generously with salt and pepper.",
      "Chimichurri: finely chop parsley and garlic; stir with oil, vinegar, oregano, pepper flakes and a pinch of salt.",
      "Grill over high heat 4\u20135 minutes per side for medium-rare (130\xB0F).",
      "Rest 5\u201310 minutes, then slice against the grain.",
      "Spoon chimichurri over the top."
    ]),
    R("s4", "Honey-BBQ Chicken & Corn", "Sticky grilled thighs with buttered corn.", "45 min", [
      "2.5|lb|bone-in chicken thighs|me",
      "1|cup|BBQ sauce|co",
      "2|tbsp|honey|co",
      "1|tsp|smoked paprika|sp",
      "1|tsp|garlic powder|sp",
      "1|tbsp|vegetable oil|st",
      "4|ear|corn on the cob|pr",
      "2|tbsp|butter|st",
      SP,
      PP
    ], [
      "Heat the grill with one hot side and one cooler side.",
      "Rub chicken with oil, smoked paprika, garlic powder, salt and pepper. Stir BBQ sauce with honey.",
      "Grill chicken skin-side down on the hot side 5 minutes, then move to the cooler side, cover, and cook 25\u201330 minutes to 175\xB0F.",
      "Grill corn alongside 10\u201312 minutes, turning.",
      "Brush chicken with sauce for the last 5 minutes. Butter and salt the corn."
    ]),
    R("s5", "Grilled Salmon & Asparagus", "Light, quick and lemony.", "25 min", [
      "1.5|lb|salmon fillets|me",
      "1|lb|asparagus|pr",
      "3|tbsp|olive oil|st",
      "2|clove|garlic|st",
      "1||lemon~lemons|pr",
      "1|tsp|dried dill|sp",
      SP,
      PP
    ], [
      "Heat the grill to medium-high and oil the grates well.",
      "Mix oil, minced garlic, lemon zest and dill. Brush over the salmon and asparagus; season with salt and pepper.",
      "Grill salmon skin-side down 6\u20138 minutes, covered, until it flakes.",
      "Grill asparagus crosswise 4\u20135 minutes, turning.",
      "Squeeze lemon over everything."
    ]),
    R("s6", "Brats with Peppers & Onions", "Beer-simmered brats, grilled and piled high.", "40 min", [
      "1|pack|bratwurst (5 ct)|me",
      "1|pack|brat buns|ba",
      "2||yellow onion~yellow onions|st",
      "1||red bell pepper~red bell peppers|pr",
      "1||green bell pepper~green bell peppers|pr",
      "1|tbsp|vegetable oil|st",
      "1|can|beer (optional)|ot",
      "0||mustard|co"
    ], [
      "Slice onions and peppers. Put them in a foil pan with oil and beer (or broth).",
      "Grill brats over medium heat 12\u201315 minutes, turning, until 160\xB0F.",
      "Meanwhile set the pan on the grill to simmer the veggies until soft.",
      "Move brats into the pan to keep warm. Toast buns.",
      "Serve brats with peppers, onions and mustard."
    ])
  ],
  sun: [
    R("c1", "Sunday Pot Roast", "Fall-apart beef with potatoes and carrots.", "4 hr", [
      "3|lb|beef chuck roast|me",
      "1.5|lb|baby gold potatoes|pr",
      "4||carrot~carrots|pr",
      "2|stalk|celery|pr",
      "1||yellow onion~yellow onions|st",
      "4|clove|garlic|st",
      "1|can|tomato paste (6 oz)|pa",
      "2|cup|beef broth|pa",
      "2|tbsp|all-purpose flour|st",
      "2|tbsp|vegetable oil|st",
      "1|tbsp|Worcestershire sauce|co",
      "1|tsp|dried thyme|sp",
      "2||bay leaf~bay leaves|sp",
      SP,
      PP
    ], [
      "Heat the oven to 300\xB0F. Season roast well with salt and pepper.",
      "Sear in oil in a Dutch oven over medium-high, 4 minutes per side. Remove.",
      "Cook chopped onion 3 minutes; add garlic, 2 tbsp tomato paste and flour for 1 minute. Whisk in broth and Worcestershire.",
      "Return roast with thyme and bay leaves. Cover and bake 2\xBD hours.",
      "Add potatoes, carrots and celery; bake 1 hour more until tender. Spoon gravy over to serve."
    ]),
    R("c2", "Chicken Pot Pie", "Creamy filling under a flaky crust.", "60 min", [
      "1||rotisserie chicken~rotisserie chickens|me",
      "1|box|refrigerated pie crusts (2 ct)|da",
      "1.5|cup|frozen peas & carrots|fr",
      "1||yellow onion~yellow onions|st",
      "2|stalk|celery|pr",
      "6|tbsp|butter|st",
      "0.33|cup|all-purpose flour|st",
      "1.5|cup|chicken broth|pa",
      "0.75|cup|milk|da",
      "1|tsp|dried thyme|sp",
      SP,
      PP
    ], [
      "Heat the oven to 400\xB0F. Shred about 3 cups of chicken.",
      "Melt butter; cook diced onion and celery 5 minutes. Stir in flour 1 minute.",
      "Whisk in broth and milk; simmer until thick. Add thyme, chicken, peas & carrots, salt and pepper.",
      "Fit one crust into a 9-inch pie plate, add filling, top with the second crust, crimp and cut vents.",
      "Bake 30\u201335 minutes until golden. Rest 10 minutes."
    ]),
    R("c3", "Baked Mac & Cheese", "Creamy cheddar sauce, crunchy top.", "50 min", [
      "16|oz|elbow macaroni|pa",
      "4|tbsp|butter|st",
      "0.25|cup|all-purpose flour|st",
      "3|cup|milk|da",
      "3|cup|shredded cheddar|da",
      "1|cup|shredded Gruy\xE8re|da",
      "0.5|tsp|dry mustard|sp",
      "0.5|tsp|garlic powder|sp",
      "0.5|cup|panko breadcrumbs|pa",
      SP,
      PP
    ], [
      "Heat the oven to 375\xB0F. Boil macaroni 2 minutes less than the package says; drain.",
      "Melt 3 tbsp butter, whisk in flour 1 minute, then slowly whisk in milk. Simmer until thick.",
      "Off heat, stir in cheddar, Gruy\xE8re, mustard, garlic powder, salt and pepper.",
      "Fold in pasta and pour into a 9\xD713 dish.",
      "Top with panko tossed in the last tbsp of melted butter. Bake 20\u201325 minutes."
    ]),
    R("c4", "Meatloaf & Mashed Potatoes", "Tangy glazed meatloaf with buttery mash.", "75 min", [
      "2|lb|ground beef|me",
      "1||yellow onion~yellow onions|st",
      "2|clove|garlic|st",
      "2||egg~eggs|da",
      "0.75|cup|plain breadcrumbs|pa",
      "1|cup|milk|da",
      "1|tbsp|Worcestershire sauce|co",
      "1|tsp|dried thyme|sp",
      "0.5|cup|ketchup|co",
      "2|tbsp|brown sugar|st",
      "1|tbsp|apple cider vinegar|co",
      "2|lb|russet potatoes|pr",
      "4|tbsp|butter|st",
      SP,
      PP
    ], [
      "Heat the oven to 375\xB0F. Mix breadcrumbs with \xBD cup milk.",
      "Add beef, finely diced onion, garlic, eggs, Worcestershire, thyme, 1\xBD tsp salt and pepper. Mix gently and shape into a loaf on a lined pan.",
      "Stir ketchup, brown sugar and vinegar; spread half on top. Bake 45 minutes, add the rest, bake 15 more (160\xB0F).",
      "Meanwhile boil peeled, cubed potatoes 15 minutes until tender. Drain.",
      "Mash with butter, the remaining \xBD cup warm milk, salt and pepper. Rest meatloaf 10 minutes and slice."
    ]),
    R("c5", "Chicken Noodle Soup", "The classic, from scratch in under an hour.", "45 min", [
      "1.5|lb|boneless chicken thighs|me",
      "3||carrot~carrots|pr",
      "3|stalk|celery|pr",
      "1||yellow onion~yellow onions|st",
      "3|clove|garlic|st",
      "8|cup|chicken broth|pa",
      "8|oz|wide egg noodles|pa",
      "1|tsp|dried thyme|sp",
      "2||bay leaf~bay leaves|sp",
      "2|tbsp|butter|st",
      "1|bunch|flat-leaf parsley|pr",
      SP,
      PP
    ], [
      "Melt butter in a large pot; cook diced onion, carrots and celery 6 minutes. Add garlic 1 minute.",
      "Add broth, whole chicken thighs, thyme and bay leaves. Simmer 20 minutes.",
      "Remove chicken, shred, and return to the pot.",
      "Add noodles and simmer 6\u20138 minutes until tender.",
      "Remove bay leaves, season, and stir in chopped parsley."
    ]),
    R("c6", "Easy Lasagna", "No-boil noodles, meaty sauce, three cheeses.", "90 min", [
      "1|lb|ground beef|me",
      "1||yellow onion~yellow onions|st",
      "3|clove|garlic|st",
      "2|jar|marinara sauce (24 oz)|co",
      "1|box|oven-ready lasagna noodles (9 oz)|pa",
      "2|cup|ricotta|da",
      "1||egg~eggs|da",
      "3|cup|shredded mozzarella|da",
      "0.5|cup|grated Parmesan|da",
      "1|tsp|Italian seasoning|sp",
      SP,
      PP
    ], [
      "Heat the oven to 375\xB0F. Brown beef with diced onion; add garlic, Italian seasoning and marinara. Simmer 5 minutes.",
      "Stir ricotta with egg, half the Parmesan, salt and pepper.",
      "In a 9\xD713 dish layer: sauce, noodles, ricotta, mozzarella, sauce. Repeat twice, ending with sauce and mozzarella.",
      "Top with remaining Parmesan. Cover with foil and bake 40 minutes.",
      "Uncover and bake 15 minutes more. Rest 15 minutes before slicing."
    ])
  ]
};
const BY_ID = {};
for (const d of DAYS) for (const r of RECIPES[d]) BY_ID[r.id] = r;
const VOL = { tsp: 1, tbsp: 3, cup: 48 };
const WT = { oz: 1, lb: 16 };
const PLURAL = {
  clove: "cloves",
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
