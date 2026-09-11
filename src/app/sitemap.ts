import type { MetadataRoute } from 'next';

import { getPublicProperties } from '@/lib/serverData';
import { generatePropertySlug } from '@/lib/slug';

export const revalidate = 3600;

const SITEMAP_LIMIT = 50_000;
const DEFAULT_SITE_URL = 'https://homes.alyora.in';

function getSiteUrl(): URL {
    const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL;

    try {
        const siteUrl = new URL(configuredUrl);

        if (siteUrl.protocol !== 'https:' || siteUrl.pathname !== '/' || siteUrl.username || siteUrl.password || siteUrl.search || siteUrl.hash) {
            throw new Error('NEXT_PUBLIC_SITE_URL must be an HTTPS origin without a path, credentials, query parameters, or fragments.');
        }

        siteUrl.pathname = siteUrl.pathname.replace(/\/+$/, '');
        return siteUrl;
    } catch (error) {
        throw new Error(`Invalid NEXT_PUBLIC_SITE_URL: ${error instanceof Error ? error.message : 'invalid URL'}`);
    }
}

function toCanonicalUrl(siteUrl: URL, pathname: string): string {
    const url = new URL(pathname, siteUrl);

    if (url.origin !== siteUrl.origin || url.search || url.hash || !url.pathname.startsWith('/')) {
        throw new Error(`Invalid sitemap URL: ${url.toString()}`);
    }

    return url.toString();
}

function parseLastModified(value: unknown): Date | undefined {
    if (!value) return undefined;

    const date = value instanceof Date ? value : new Date(String(value));
    return Number.isNaN(date.getTime()) ? undefined : date;
}

function getPublicImageUrls(property: any): string[] {
    const imageUrls = [property.image?.secure_url, property.image_url];

    if (Array.isArray(property.media)) {
        imageUrls.push(
            ...property.media
                .filter((media: any) => media?.visibility === 'PUBLIC' || media?.visibility === undefined)
                .map((media: any) => media.secure_url || media.url),
        );
    }

    return [...new Set(imageUrls.filter((imageUrl): imageUrl is string => {
        if (typeof imageUrl !== 'string') return false;

        try {
            const url = new URL(imageUrl);
            return url.protocol === 'https:' && !url.username && !url.password;
        } catch {
            return false;
        }
    }))];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const siteUrl = getSiteUrl();
    const properties = await getPublicProperties();
    const entries: MetadataRoute.Sitemap = [
        { url: toCanonicalUrl(siteUrl, '/') },
        { url: toCanonicalUrl(siteUrl, '/properties') },
    ];

    for (const property of properties) {
        const id = (property._id || property.id || '').toString();
        const name = typeof property.name === 'string' ? property.name.trim() : '';
        const location = typeof property.location === 'string' ? property.location.trim() : '';

        if (!id || !name || !location) continue;

        const slug = generatePropertySlug(name, location, id);
        if (!slug || slug === `-${id.slice(-6)}`) continue;

        const lastModified = parseLastModified(property.updatedAt);
        const imageUrls = getPublicImageUrls(property);
        entries.push({
            url: toCanonicalUrl(siteUrl, `/properties/${encodeURIComponent(slug)}`),
            ...(lastModified ? { lastModified } : {}),
            ...(imageUrls.length ? { images: imageUrls } : {}),
        });
    }

    const uniqueEntries = [...new Map(entries.map((entry) => [entry.url, entry])).values()];

    if (uniqueEntries.length > SITEMAP_LIMIT) {
        throw new Error(`Sitemap contains more than ${SITEMAP_LIMIT} URLs; configure sitemap splitting before publishing more properties.`);
    }

    return uniqueEntries;
}