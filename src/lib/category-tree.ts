// Full site taxonomy for browse-by-category dropdowns AND the "Post an Ad"
// cascading category picker (Category -> Sub-category -> Item), Jiji-style.
// Sourced from Soko_Nyumbani_Business_categories_2.docx
//
// IMPORTANT: `slug` on each group and each sub-category (CategoryLeaf) must
// stay in sync with the rows seeded by
// supabase/migrations/20260731090000_unified_category_taxonomy.sql — the app
// uses these slugs to look up the matching database category id so that ads
// posted via /sell are filed under the exact same category the /browse page
// filters and displays by. The individual `items` (the 3rd, most specific
// tier) are matched to their own database rows via the deterministic
// `itemSlug()` helper in src/lib/slug.ts, seeded by
// supabase/migrations/20260801090000_category_leaf_taxonomy.sql. If you
// add/rename a group, sub-category, or item here, mirror the change in
// those migrations (or re-run the generator that produced them).

export type CategoryLeaf = { slug: string; name: string; items: string[] };
export type CategoryGroup = { slug: string; name: string; children: CategoryLeaf[] };

export const CATEGORY_TREE: CategoryGroup[] = [
  {
    slug: "home-living",
    name: "Home & Living",
    children: [
      {
        slug: "electronics-related",
        name: "Electronics & Related",
        items: [
          "Radios", "Earphones", "TV Sets", "Desktop Computers", "Laptops & Notepads",
          "Phones", "Cameras", "Printers / Copiers", "Modems", "Binding Machines",
          "Play Stations", "Pianos", "Guitars", "Scanners", "Projectors", "Watches",
          "Disk Storage", "Speakers", "Drones", "Tripods", "Networking Materials",
          "Remotes", "Decoders", "Assorted Items",
        ],
      },
      {
        slug: "general-appliances",
        name: "General Appliances",
        items: [
          "Air Conditioners", "Ceiling Fans", "Lawn Mowers", "Vacuum Cleaners",
          "Humidifiers", "Space Heaters", "Desk Lamps", "Evaporative Coolers",
          "Electric Fans", "Lamps", "Hairdryers", "Treadmills", "Assorted Items",
        ],
      },
      {
        slug: "kitchen-laundry-appliances",
        name: "Kitchen & Laundry Appliances",
        items: [
          "Stoves / Burners", "Food Processors", "Refrigerators", "Freezers",
          "Washing Machines", "Microwaves", "Blenders", "Clothes Dryers",
          "Sewing Machines", "Ice Cream Makers", "Dishwashers", "Rice Cookers",
          "Shaving Machines", "Water Heaters", "Electric Kettles", "Iron Boxes",
          "Toasters", "Coffee Makers", "Corn Poppers", "Electric Blankets",
          "Assorted Items",
        ],
      },
      {
        slug: "kitchen-essentials",
        name: "Kitchen Essentials",
        items: [
          "Cooking Pots & Sufurias", "Utensils", "Knives & Cutting Tools",
          "Containers & Storage Items", "Cloths & Materials", "Plastics",
          "Basins & Pales", "Assorted Items",
        ],
      },
      {
        slug: "art-decorations-stationery",
        name: "Art, Decorations & Stationery",
        items: [
          "Jewellery", "Flowers", "Markers & Papers / Newspapers",
          "Wall Arts & Paintings", "Vases", "Books", "Souvenirs", "Artefacts",
          "Assorted Items",
        ],
      },
    ],
  },
  {
    slug: "furniture-clothing",
    name: "Furniture & Clothing",
    children: [
      {
        slug: "bedroom-set",
        name: "Bedroom Set",
        items: ["Beds", "Nightstands", "Dressers", "Shoe Racks", "Cribs", "Mirrors", "Wardrobes", "Assorted Items"],
      },
      {
        slug: "dining-room-set",
        name: "Dining Room Set",
        items: ["Dining Tables", "Dining Chairs", "Buffet / Sideboards", "Assorted Items"],
      },
      {
        slug: "living-room-set",
        name: "Living Room Set",
        items: [
          "Coffee Tables", "Sofas", "Side Tables", "Chairs", "Shelves & Cabinets",
          "Ottomans", "Desks", "Storage Units", "TV Stands", "Work Stations",
          "Bookshelves", "Benches", "Plastic Chairs", "Assorted Items",
        ],
      },
      {
        slug: "clothing-fashion",
        name: "Clothing & Fashion",
        items: [
          "Bedsheets & Blankets", "Mattresses", "Carpets", "Curtains", "Blinds",
          "Footwear", "Kids Clothes", "Cushions", "Dresses", "Hoodies", "Suits",
          "Jackets", "Shirts", "Jeans", "Sweaters", "Long / Short Trousers",
          "Coats", "Purses", "Skirts", "Assorted Items",
        ],
      },
    ],
  },
  {
    slug: "machinery-tools",
    name: "Machinery & Tools",
    children: [
      {
        slug: "farm-tools",
        name: "Farm Tools",
        items: [
          "Jembes", "Spades", "Wheelbarrows", "Sprayers", "Rakes",
          "Watering Cans", "Water Pumps", "Sprinklers", "Hand Tools",
          "Assorted Items",
        ],
      },
      {
        slug: "spare-parts",
        name: "Spare Parts",
        items: ["Cars", "Tractors", "Generators", "Lorries", "Buses", "Scrap Metals", "Assorted Items"],
      },
      {
        slug: "construction-materials",
        name: "Construction",
        items: [
          "Cement", "Iron Sheets", "Nails", "Paints", "Glues", "Binding Wires",
          "Wall Passes", "Metallic Rods", "Timber", "Sand", "Stones / Bricks",
          "Ballast", "Electrical Materials", "Plumbing Materials", "Assorted Items",
        ],
      },
    ],
  },
  {
    slug: "animal-farm",
    name: "Animal & Farm Produce",
    children: [
      {
        slug: "domesticated-animal-produce",
        name: "Domesticated Animal Produce",
        items: ["Milk", "Eggs", "Urine", "Skins & Hides", "Assorted"],
      },
      {
        slug: "live-domesticated-animals",
        name: "Live Domesticated Animals",
        items: [
          "Chickens (Kienyeji)", "Improved Kienyeji", "Commercial Layers",
          "Commercial Broilers", "Ducks", "Turkeys", "Geese", "Quails",
          "Guinea Fowls", "Goats", "Sheep", "Cattle", "Fish", "Camels",
          "Pigs", "Donkeys", "Rabbits", "Cats", "Dogs", "Assorted",
        ],
      },
      {
        slug: "farm-produce",
        name: "Farm Produce",
        items: [
          "Fruits", "Sugarcane", "Nappier Grasses", "Seeds", "Cereals",
          "Vegetables", "Tubers", "Potatoes", "Trees", "Firewood", "Assorted",
        ],
      },
    ],
  },
];