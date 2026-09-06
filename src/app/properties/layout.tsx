import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Property Catalog | Premium Real Estate in Kerala',
    description:
        'Browse luxury villas, residential plots, modern apartments, and commercial real estate across Kerala. Verified listings with clear title documents.',
    alternates: {
        canonical: 'https://homes.alyora.in/properties',
    },
    openGraph: {
        title: 'Property Catalog | ALYORA Real Estate Kerala',
        description:
            'Browse luxury villas, residential plots, modern apartments, and commercial real estate across Kerala.',
        url: 'https://homes.alyora.in/properties',
        siteName: 'ALYORA Real Estate',
    },
};

export default function PropertiesLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
