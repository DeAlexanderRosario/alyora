import './globals.css';
import type { Metadata, Viewport } from 'next';
import { AuthProvider } from '@/lib/auth';

export const viewport: Viewport = {
  themeColor: '#103143',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://homes.alyora.in'),
  title: {
    default: 'ALYORA | Premium Real Estate Platform in Kerala',
    template: '%s | ALYORA Real Estate',
  },
  description:
    'Homes. Investments. Opportunities. Discover verified luxury villas, plots, apartments, and commercial spaces across Kerala with ALYORA.',
  keywords: [
    'Real Estate Kerala',
    'Properties in Kerala',
    'Buy House Kochi',
    'Villas Kottayam',
    'Plots for Sale Kerala',
    'Commercial Space Kerala',
    'ALYORA Homes',
  ],
  authors: [{ name: 'ALYORA Real Estate' }],
  creator: 'ALYORA',
  publisher: 'ALYORA Real Estate',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://homes.alyora.in',
    languages: {
      'en-IN': 'https://homes.alyora.in',
      'en': 'https://homes.alyora.in',
    },
  },
  openGraph: {
    title: 'ALYORA | Premium Real Estate Platform in Kerala',
    description:
      'Homes. Investments. Opportunities. Discover verified luxury villas, plots, apartments, and commercial spaces across Kerala with ALYORA.',
    url: 'https://homes.alyora.in',
    siteName: 'ALYORA Real Estate',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1200',
        width: 1200,
        height: 630,
        alt: 'ALYORA Real Estate Kerala - Premium Properties',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ALYORA | Premium Real Estate Platform in Kerala',
    description:
      'Homes. Investments. Opportunities. Premium real estate platform in Kerala.',
    images: [
      'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
  },
  icons: {
    icon: '/favicon.png?v=2',
    apple: '/favicon.png?v=2',
  },
  verification: {
    google: 'google6fef9ad0c9d3fd19',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: 'ALYORA Real Estate',
    url: 'https://homes.alyora.in',
    description:
      'Homes. Investments. Opportunities. Premium real estate platform in Kerala.',
    telephone: '+919947616989',
    address: {
      '@type': 'PostalAddress',
      addressRegion: 'Kerala',
      addressCountry: 'IN',
    },
    sameAs: ['https://wa.me/919947616989'],
    areaServed: {
      '@type': 'AdministrativeArea',
      name: 'Kerala, India',
    },
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'ALYORA',
    url: 'https://homes.alyora.in',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://homes.alyora.in/properties?search={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://images.pexels.com" />
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

