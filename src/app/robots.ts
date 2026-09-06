import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin/', '/api/', '/shared/'],
        },
        sitemap: 'https://homes.alyora.in/sitemap.xml',
    };
}
