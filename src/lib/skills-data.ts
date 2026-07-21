// Service / Skill taxonomy for Vutabiz (Soko Nyumbani Business Hub)
// Two-level: Category → Specialty. Advertisers offering a service pick a
// category then a specific specialty; specialty auto-fills the Job/Skill title.

export type SkillCategory = { slug: string; name: string; specialties: string[] };

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    slug: "agricultural-workers",
    name: "Agricultural Workers",
    specialties: ["Farmhand", "Herdsman", "Ploughing", "Dog Training", "Other Agricultural"],
  },
  {
    slug: "domestic-workers",
    name: "Domestic Workers",
    specialties: ["Guard / Security", "House Servant", "Cook / Catering", "Nanny", "Cleaner", "Other Domestic"],
  },
  {
    slug: "construction-helpers",
    name: "Construction Helpers",
    specialties: ["Basic Site Works", "Off-loader", "Waste Removal", "Fumigation", "Other Helper"],
  },
  {
    slug: "construction-specialist-1",
    name: "Construction Specialist – Site & Structure",
    specialties: [
      "Site Excavation",
      "Borehole / Pit Digging",
      "Mason",
      "Plumber",
      "Carpenter",
      "Electrician (Solar/Generator)",
    ],
  },
  {
    slug: "construction-specialist-2",
    name: "Construction Specialist – Finishing",
    specialties: [
      "Tiles",
      "Terrazzo",
      "Cabro",
      "Mazeras",
      "Gypsum",
      "Painter",
      "Glass & Aluminium",
      "Doors / Windows (Welder)",
      "Interior (Curtains/Cabinets)",
    ],
  },
  {
    slug: "construction-specialist-3",
    name: "Construction Specialist – Security & Utilities",
    specialties: [
      "Shades / Tents",
      "Water Pumps / Tanks",
      "Fencing (Razor/Electric)",
      "Alarms",
      "CCTV / Wi-Fi",
    ],
  },
  {
    slug: "construction-specialist-4",
    name: "Construction Specialist – Advanced Systems",
    specialties: [
      "Biodigesters",
      "Biogas",
      "Irrigation",
      "Fish Pond",
      "Swimming Pools",
      "Landscaping",
    ],
  },
  {
    slug: "transport-logistics",
    name: "Transport & Logistics",
    specialties: ["Taxi", "Lorry", "Boda Boda", "Tuk Tuk", "Pickup", "Other Transport"],
  },
  {
    slug: "car-repair",
    name: "Car Repair",
    specialties: ["Tyres", "Body Works", "Upholstery", "Auto Electric", "Mechanic"],
  },
  {
    slug: "home-electronics-repair",
    name: "Home Electronics Repair",
    specialties: [
      "TV",
      "Radio",
      "Cookers",
      "Fridges",
      "Microwaves",
      "Kitchen Appliances",
      "Laundry Appliances",
    ],
  },
];
