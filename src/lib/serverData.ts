import dbConnect from './dbConnect';
import { Property, IProperty } from '@/models/Property';
import { Location, ILocation } from '@/models/Location';
import { filterPublicProperty } from './propertyVisibility';
import { extractIdFromSlug } from './slug';

/**
 * Force dynamic rendering for data freshness (no static cache).
 * Pages importing these functions will always show the latest data.
 */
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function getPublicProperties(): Promise<any[]> {
    try {
        await dbConnect();
        const docs = await Property.find({ status: 'PUBLISHED' })
            .sort({ createdAt: -1 })
            .lean();
        return docs.map((doc) => filterPublicProperty(doc));
    } catch (error) {
        console.error('Error fetching public properties:', error);
        return [];
    }
}

/**
 * Fetch a single PUBLISHED property by slug or raw MongoDB _id.
 *
 * Slug format: "property-name-in-location-<6-char-id-suffix>"
 * We extract the last 6 hex chars and find the matching document.
 */
export async function getPublicPropertyBySlug(slugOrId: string): Promise<any | null> {
    try {
        await dbConnect();

        // 1. If it looks like a full MongoDB ObjectId, look up directly
        if (/^[0-9a-fA-F]{24}$/.test(slugOrId)) {
            const doc = await Property.findOne({ _id: slugOrId, status: 'PUBLISHED' }).lean();
            return doc ? filterPublicProperty(doc) : null;
        }

        // 2. Extract short ID suffix from slug (last segment after final hyphen)
        const shortId = extractIdFromSlug(slugOrId);

        if (shortId && /^[0-9a-fA-F]{4,6}$/.test(shortId)) {
            // Find documents whose _id ends with this suffix
            const docs = await Property.find({
                status: 'PUBLISHED',
            }).lean();

            const match = docs.find((doc: any) => {
                const docId = doc._id.toString();
                return docId.endsWith(shortId);
            });

            if (match) return filterPublicProperty(match);
        }

        // 3. Fallback: try searching by name formatted as slug
        const nameGuess = slugOrId
            .replace(/-[0-9a-fA-F]{4,6}$/, '') // remove the id suffix
            .replace(/-in-.*$/, '')             // remove "in-location" part
            .replace(/-/g, ' ');

        if (nameGuess) {
            const doc = await Property.findOne({
                status: 'PUBLISHED',
                name: new RegExp('^' + nameGuess.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'),
            }).lean();

            if (doc) return filterPublicProperty(doc);
        }

        return null;
    } catch (error) {
        console.error(`Error fetching property by slug (${slugOrId}):`, error);
        return null;
    }
}

/**
 * @deprecated Use getPublicPropertyBySlug instead
 */
export async function getPublicPropertyById(idOrSlug: string): Promise<any | null> {
    return getPublicPropertyBySlug(idOrSlug);
}

export async function getPublicLocations(): Promise<any[]> {
    try {
        await dbConnect();
        const docs = await Location.find({ active: true }).sort({ sortOrder: 1, name: 1 }).lean();
        return docs.map((doc: any) => ({
            id: doc._id.toString(),
            name: doc.name,
            district: doc.district || '',
            featured: doc.featured || false,
        }));
    } catch (error) {
        console.error('Error fetching public locations:', error);
        return [];
    }
}

export async function getPropertiesByFilter({
    type,
    location,
    tag,
    search,
}: {
    type?: string;
    location?: string;
    tag?: string;
    search?: string;
}): Promise<any[]> {
    try {
        await dbConnect();
        const query: any = { status: 'PUBLISHED' };

        if (type && type !== 'All') {
            query.propertyType = new RegExp('^' + type, 'i');
        }

        if (tag && tag !== 'All') {
            if (tag.toLowerCase() === 'featured') {
                query.featured = true;
            } else {
                query.tag = new RegExp('^' + tag, 'i');
            }
        }

        if (location && location !== 'All') {
            query.location = new RegExp(location.replace(/-/g, ' '), 'i');
        }

        if (search) {
            const searchRegex = new RegExp(search, 'i');
            query.$or = [
                { name: searchRegex },
                { location: searchRegex },
                { description: searchRegex },
                { propertyType: searchRegex },
            ];
        }

        const docs = await Property.find(query).sort({ createdAt: -1 }).lean();
        return docs.map((doc) => filterPublicProperty(doc));
    } catch (error) {
        console.error('Error filtering properties:', error);
        return [];
    }
}
