import { NextResponse } from 'next/server';
import { getPublicProperties, getPublicLocations } from '@/lib/serverData';
import { generatePropertyImageAlt } from '@/lib/imageSeo';
import { generatePropertySlug } from '@/lib/slug';

export const revalidate = 3600; // Cache for 1 hour

function escapeXml(unsafe: string): string {
    if (!unsafe) return '';
    return unsafe
        .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '') // Strip XML invalid control chars
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
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

    // 1. Static Core Canonical Pages
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

    // 2. Property Detail Pages & Image Sitemaps
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
                const mediaUrl = m.secure_url || m.url;
                if (mediaUrl && typeof mediaUrl === 'string' && mediaUrl.startsWith('http')) {
                    if (!publicImages.some((img) => img.url === mediaUrl)) {
                        publicImages.push({
                            url: mediaUrl,
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
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
            'Access-Control-Allow-Origin': '*',
        },
    });
}
