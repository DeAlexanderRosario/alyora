/**
 * Slug utilities for human-readable property URLs.
 *
 * Format: "property-name-in-location-<short_id>"
 * Example: "luxury-4bhk-villa-in-kochi-6a9d82"
 *
 * The last segment (6 hex chars from the MongoDB _id) guarantees uniqueness
 * even if two properties share the same name+location.
 */

/**
 * Convert a property name + location + MongoDB _id into a URL-safe slug.
 */
export function generatePropertySlug(
    name: string,
    location: string,
    mongoId: string
): string {
    const shortId = mongoId.slice(-6); // last 6 hex chars of the _id

    const raw = `${name} in ${location}`
        .toLowerCase()
        .replace(/['']/g, '')               // remove apostrophes
        .replace(/&/g, 'and')               // & → and
        .replace(/[^a-z0-9\s-]/g, '')       // remove special chars
        .replace(/\s+/g, '-')              // spaces → hyphens
        .replace(/-+/g, '-')              // collapse multiple hyphens
        .replace(/^-|-$/g, '');            // trim leading/trailing hyphens

    return `${raw}-${shortId}`;
}

/**
 * Extract the 6-char short ID suffix from a slug.
 */
export function extractIdFromSlug(slug: string): string {
    const parts = slug.split('-');
    return parts[parts.length - 1] || slug;
}
