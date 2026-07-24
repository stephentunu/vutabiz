// Full site taxonomy for browse-by-category dropdowns.
// Sourced from Soko_Nyumbani_Business_categories_2.docx

export type CategoryLeaf = { name: string; items: string[] };
export type CategoryGroup = { slug: string; name: string; children: CategoryLeaf[] };

export const CATEGORY_TREE: CategoryGroup[] = [
  {
    slug: "home-living",
    name: "Home & Living",
    children: [
      {
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
        name: "General Appliances",
        items: [
          "Air Conditioners", "Ceiling Fans", "Lawn Mowers", "Vacuum Cleaners",
          "Humidifiers", "Space Heaters", "Desk Lamps", "Evaporative Coolers",
          "Electric Fans", "Lamps", "Hairdryers", "Treadmills", "Assorted Items",
        ],
      },
      {
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
        name: "Kitchen Essentials",
        items: [
          "Cooking Pots & Sufurias", "Utensils", "Knives & Cutting Tools",
          "Containers & Storage Items", "Cloths & Materials", "Plastics",
          "Basins & Pales", "Assorted Items",
        ],
      },
      {
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
        name: "Bedroom Set",
        items: ["Beds", "Nightstands", "Dressers", "Shoe Racks", "Cribs", "Mirrors", "Wardrobes", "Assorted Items"],
      },
      {
        name: "Dining Room Set",
        items: ["Dining Tables", "Dining Chairs", "Buffet / Sideboards", "Assorted Items"],
      },
      {
        name: "Living Room Set",
        items: [
          "Coffee Tables", "Sofas", "Side Tables", "Chairs", "Shelves & Cabinets",
          "Ottomans", "Desks", "Storage Units", "TV Stands", "Work Stations",
          "Bookshelves", "Benches", "Plastic Chairs", "Assorted Items",
        ],
      },
      {
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
        name: "Farm Tools",
        items: [
          "Jembes", "Spades", "Wheelbarrows", "Sprayers", "Rakes",
          "Watering Cans", "Water Pumps", "Sprinklers", "Hand Tools",
          "Assorted Items",
        ],
      },
      {
        name: "Spare Parts",
        items: ["Cars", "Tractors", "Generators", "Lorries", "Buses", "Scrap Metals", "Assorted Items"],
      },
      {
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
        name: "Domesticated Animal Produce",
        items: ["Milk", "Eggs", "Urine", "Skins & Hides", "Assorted"],
      },
      {
        name: "Live Domesticated Animals",
        items: [
          "Chickens (Kienyeji)", "Improved Kienyeji", "Commercial Layers",
          "Commercial Broilers", "Ducks", "Turkeys", "Geese", "Quails",
          "Guinea Fowls", "Goats", "Sheep", "Cattle", "Fish", "Camels",
          "Pigs", "Donkeys", "Rabbits", "Cats", "Dogs", "Assorted",
        ],
      },
      {
        name: "Farm Produce",
        items: [
          "Fruits", "Sugarcane", "Nappier Grasses", "Seeds", "Cereals",
          "Vegetables", "Tubers", "Potatoes", "Trees", "Firewood", "Assorted",
        ],
      },
    ],
  },
];
