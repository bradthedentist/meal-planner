# Meal Plan (Home Screen web app)

Static files, no build step. Serve this folder over HTTPS (GitHub Pages, Netlify, etc.).
On iPhone: open the URL in Safari → Share → Add to Home Screen.

Data: picks, servings, checkmarks and inventory (Pantry, Fridge, Freezer), restock items and cooked marks are saved on the device in localStorage,
with an IndexedDB backup. Backup tab lets you copy/restore a plan to another device.

Grocery list "I have it" moves an item into inventory (Frozen → Freezer; Produce, Meat, Dairy → Fridge; else Pantry).
Week "Cooked" previews and subtracts the recipe's amounts from inventory (compatible units convert); cooked meals
drop off the grocery list, and anything used up returns to the list (as Restock if no other planned meal needs it).
