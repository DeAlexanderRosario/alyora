import { NextResponse } from 'next/server';
import { getPublicProperties, getPublicLocations } from '@/lib/serverData';
import { generatePropertyImageAlt } from '@/lib/imageSeo';
import { generatePropertySlug } from '@/lib/slug';

export const revalidate = 3600; // Cache for 1 hour

function escapeXml(unsafe: string): string {
    return unsafe.replace(/[<>&'"]/g, (c) => {
        switch (c) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case '\'': return '&apos;';
            case '"': return '&quot;';
            default: return c;
        }
    });
}

export async function GET() {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://homes.alyora.in';

    let properties: any[] = [];
    let locations: any[] = [];

    try {
        [properties, locations] = await Promise.all([
            getPublicProperties().catch(() => []),
            getPublicLocations().catch(() => []),
        ]);
    } catch (err) {
        console.error('Error fetching sitemap data:', err);
    }

    const now = new Date().toISOString();

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n`;
    xml += `        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n`;

    // Static core pages
    const staticPages = [
        { url: `${baseUrl}`, priority: '1.0', changefreq: 'daily' },
        { url: `${baseUrl}/properties`, priority: '0.9', changefreq: 'daily' },
    ];

    staticPages.forEach((page) => {
        xml += `  <url>\n`;
        xml += `    <loc>${escapeXml(page.url)}</loc>\n`;
        xml += `    <lastmod>${now}</lastmod>\n`;
        xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
        xml += `    <priority>${page.priority}</priority>\n`;
        xml += `  </url>\n`;
    });

    // Property categories
    const categories = ['Villa', 'House', 'Apartment', 'Land', 'Commercial'];
    categories.forEach((cat) => {
        const catUrl = `${baseUrl}/properties?type=${encodeURIComponent(cat)}`;
        xml += `  <url>\n`;
        xml += `    <loc>${escapeXml(catUrl)}</loc>\n`;
        xml += `    <lastmod>${now}</lastmod>\n`;
        xml += `    <changefreq>weekly</changefreq>\n`;
        xml += `    <priority>0.8</priority>\n`;
        xml += `  </url>\n`;
    });

    // Locations
    (locations || []).forEach((loc) => {
        const locUrl = `${baseUrl}/properties?location=${encodeURIComponent(loc.name)}`;
        xml += `  <url>\n`;
        xml += `    <loc>${escapeXml(locUrl)}</loc>\n`;
        xml += `    <lastmod>${now}</lastmod>\n`;
        xml += `    <changefreq>weekly</changefreq>\n`;
        xml += `    <priority>0.7</priority>\n`;
        xml += `  </url>\n`;
    });

    // Property Detail Pages & Google Images
    (properties || []).forEach((p) => {
        const id = (p._id || p.id || '').toString();
        const slug = generatePropertySlug(p.name || 'property', p.location || 'kerala', id);
        const propUrl = `${baseUrl}/properties/${slug}`;
        const lastMod = p.updatedAt ? new Date(p.updatedAt).toISOString() : now;

        xml += `  <url>\n`;
        xml += `    <loc>${escapeXml(propUrl)}</loc>\n`;
        xml += `    <lastmod>${lastMod}</lastmod>\n`;
        xml += `    <changefreq>weekly</changefreq>\n`;
        xml += `    <priority>0.8</priority>\n`;

        const publicImages: Array<{ url: string; title: string }> = [];

        const mainImg = p.image?.secure_url || p.image_url;
        if (mainImg && typeof mainImg === 'string' && mainImg.startsWith('http')) {
            publicImages.push({
                url: mainImg,
                title: generatePropertyImageAlt(p, undefined, 0),
            });
        }

        if (Array.isArray(p.media)) {
            p.media.forEach((m: any, idx: number) => {
                if (m.secure_url && typeof m.secure_url === 'string' && m.secure_url.startsWith('http')) {
                    if (!publicImages.some((img) => img.url === m.secure_url)) {
                        publicImages.push({
                            url: m.secure_url,
                            title: generatePropertyImageAlt(p, m.caption, idx + 1),
                        });
                    }
                }
            });
        }

        publicImages.forEach((img) => {
            xml += `    <image:image>\n`;
            xml += `      <image:loc>${escapeXml(img.url)}</image:loc>\n`;
            xml += `      <image:title>${escapeXml(img.title)}</image:title>\n`;
            xml += `    </image:image>\n`;
        });

        xml += `  </url>\n`;
    });

    xml += `</urlset>`;

    return new NextResponse(xml, {
        status: 200,
        headers: {
            'Content-Type': 'text/xml; charset=utf-8',
            'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
        },
    });
}
