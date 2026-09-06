import type { MetadataRoute } from 'next';
import { getPublicProperties, getPublicLocations } from '@/lib/serverData';
import { generatePropertyImageAlt } from '@/lib/imageSeo';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://homes.alyora.in';

    const [properties, locations] = await Promise.all([
        getPublicProperties(),
        getPublicLocations(),
    ]);

    const propertyUrls: MetadataRoute.Sitemap = properties.map((p) => {
        const id = p._id || p.id;
        const publicImages: string[] = [];

        // Collect public cover image
        const mainImg = p.image?.secure_url || p.image_url;
        if (mainImg) {
            publicImages.push(mainImg);
        }

        // Collect public gallery images (already filtered to PUBLIC by filterPublicProperty)
        if (Array.isArray(p.media)) {
            p.media.forEach((m: any) => {
                if (m.secure_url && !publicImages.includes(m.secure_url)) {
                    publicImages.push(m.secure_url);
                }
            });
        }

        return {
            url: `${baseUrl}/properties/${id}`,
            lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.8,
            images: publicImages,
        };
    });

    const locationUrls: MetadataRoute.Sitemap = locations.map((loc) => ({
        url: `${baseUrl}/properties?location=${encodeURIComponent(loc.name)}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }));

    const categoryTypes = ['Villa', 'House', 'Apartment', 'Land', 'Commercial'];
    const categoryUrls: MetadataRoute.Sitemap = categoryTypes.map((cat) => ({
        url: `${baseUrl}/properties?type=${cat}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }));

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1.0,
        },
        {
            url: `${baseUrl}/properties`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        ...categoryUrls,
        ...locationUrls,
        ...propertyUrls,
    ];
}
