import dbConnect from './dbConnect';
import { Property, IProperty } from '@/models/Property';
import { Location, ILocation } from '@/models/Location';
import { filterPublicProperty } from './propertyVisibility';
import { unstable_cache } from 'next/cache';

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

export async function getPublicPropertyById(idOrSlug: string): Promise<any | null> {
    try {
        await dbConnect();
        // Support MongoDB _id or custom slug matching
        let doc = null;
        if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
            doc = await Property.findOne({ _id: idOrSlug, status: 'PUBLISHED' }).lean();
        }

        if (!doc) {
            // Try searching by name formatted as slug or regex
            doc = await Property.findOne({
                status: 'PUBLISHED',
                $or: [
                    { name: new RegExp('^' + idOrSlug.replace(/-/g, ' '), 'i') },
                    { location: new RegExp('^' + idOrSlug.replace(/-/g, ' '), 'i') },
                ],
            }).lean();
        }

        if (!doc) return null;
        return filterPublicProperty(doc);
    } catch (error) {
        console.error(`Error fetching property by id (${idOrSlug}):`, error);
        return null;
    }
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
