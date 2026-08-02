// Deterministic slug helpers shared by the category/skill pickers (sell.tsx)
// and the browse filters (browse.tsx). The exact same algorithm is mirrored
// in supabase/migrations/20260801_category_leaf_taxonomy.sql when generating
// the matching database rows — if you change this function, the leaf slugs
// stored in the database will no longer match what the app computes, so the
// migration must be regenerated too.

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Slug for a specific item nested under a Category → Sub-category (e.g. "Radios" under "electronics-related"). */
export function itemSlug(subCategorySlug: string, itemName: string): string {
  return `${subCategorySlug}-${slugify(itemName)}`;
}

/** Slug for a specific specialty nested under a Skill Category (e.g. "Off-loader" under "construction-helpers"). */
export function specialtySlug(skillCategorySlug: string, specialty: string): string {
  return `${skillCategorySlug}-${slugify(specialty)}`;
}