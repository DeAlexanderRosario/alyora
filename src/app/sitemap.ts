import type { MetadataRoute } from 'next';
import { getPublicProperties, getPublicLocations } from '@/lib/serverData';

export const revalidate = 3600; // Revalidate sitemap every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://homes.alyora.in';

    const staticRoutes: MetadataRoute.Sitemap = [
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
        {
            url: `${baseUrl}/properties?type=Villa`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/properties?type=House`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/properties?type=Apartment`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/properties?type=Land`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/properties?type=Commercial`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
    ];

    try {
        const [properties, locations] = await Promise.all([
            getPublicProperties().catch(() => []),
            getPublicLocations().catch(() => []),
        ]);

        const propertyUrls: MetadataRoute.Sitemap = (properties || []).map((p) => {
            const id = p._id || p.id;
            const publicImages: string[] = [];

            const mainImg = p.image?.secure_url || p.image_url;
            if (mainImg && typeof mainImg === 'string' && mainImg.startsWith('http')) {
                publicImages.push(mainImg);
            }

            if (Array.isArray(p.media)) {
                p.media.forEach((m: any) => {
                    if (m.secure_url && typeof m.secure_url === 'string' && m.secure_url.startsWith('http') && !publicImages.includes(m.secure_url)) {
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

        const locationUrls: MetadataRoute.Sitemap = (locations || []).map((loc) => ({
            url: `${baseUrl}/properties?location=${encodeURIComponent(loc.name)}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.7,
        }));

        return [...staticRoutes, ...locationUrls, ...propertyUrls];
    } catch (error) {
        console.error('Error generating sitemap:', error);
        return staticRoutes;
    }
}
