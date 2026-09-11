import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'ALYORA | Real Estate Platform in Kerala',
        short_name: 'ALYORA',
        description: 'Homes. Investments. Opportunities. Premium real estate platform in Kerala.',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#153545',
        icons: [
            {
                src: '/favicon.png?v=2',
                sizes: '1024x1024',
                type: 'image/png',
            },
        ],
    };
}
