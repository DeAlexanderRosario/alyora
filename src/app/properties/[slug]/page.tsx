import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound, redirect } from 'next/navigation';
import {
    Bath, BedDouble, CheckCircle, ChevronLeft, ChevronRight,
    Gem, Leaf, MapPin, Phone, Ruler, ShieldCheck, Sofa, Sparkles, MessageCircle
} from 'lucide-react';

import { COMPANY_CONFIG } from '@/lib/env';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { PropertyCard } from '@/components/PropertyCard';
import { GalleryViewer } from '@/components/GalleryViewer';
import { getPublicPropertyBySlug, getPublicProperties } from '@/lib/serverData';
import { generatePropertySlug } from '@/lib/slug';

interface PropertyPageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PropertyPageProps): Promise<Metadata> {
    const resolvedParams = await params;
    const property = await getPublicPropertyBySlug(resolvedParams.slug);

    if (!property) {
        return {
            title: 'Property Not Found | ALYORA',
            description: 'The requested property listing could not be found.',
        };
    }

    const slug = generatePropertySlug(property.name, property.location, (property._id || property.id).toString());
    const title = property.name || 'Property for Sale';
    const location = property.location || 'Kerala';
    const type = property.propertyType || 'Property';
    const price = property.price || '';
    const metaTitle = `${title} - ${type} for Sale in ${location} | ALYORA`;
    const metaDescription = `${property.beds ? property.beds + ' Bed ' : ''}${type} for sale in ${location}, Kerala. Price: ${price}. ${property.description ? property.description.slice(0, 140) : 'Verified listing with complete title documentation by ALYORA.'
        }...`;
    const coverUrl = property.image?.secure_url || property.image_url || 'https://res.cloudinary.com/dyo0ewt0n/image/upload/v1788635144/alyora/iqpx9j4j4yw0rbr8mdnz.jpg';

    return {
        title: metaTitle,
        description: metaDescription,
        alternates: {
            canonical: `https://homes.alyora.in/properties/${slug}`,
        },
        openGraph: {
            title: metaTitle,
            description: metaDescription,
            url: `https://homes.alyora.in/properties/${slug}`,
            siteName: 'ALYORA Real Estate',
            images: [
                {
                    url: coverUrl,
                    width: 1200,
                    height: 630,
                    alt: `${title} in ${location}`,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: metaTitle,
            description: metaDescription,
            images: [coverUrl],
        },
    };
}

const HIGHLIGHTS = [
    { icon: MapPin, label: 'Prime Location' },
    { icon: Gem, label: 'Premium Quality' },
    { icon: Sofa, label: 'Spacious Design' },
    { icon: Leaf, label: 'Green Surroundings' },
    { icon: CheckCircle, label: 'Verified Listing' },
];

export default async function PropertyDetailPage({ params }: PropertyPageProps) {
    const resolvedParams = await params;
    const slugParam = resolvedParams.slug;

    // If someone visits with a raw MongoDB ObjectId, redirect to the slug URL
    if (/^[0-9a-fA-F]{24}$/.test(slugParam)) {
        const property = await getPublicPropertyBySlug(slugParam);
        if (property) {
            const id = (property._id || property.id).toString();
            const correctSlug = generatePropertySlug(property.name, property.location, id);
            redirect(`/properties/${correctSlug}`);
        }
        notFound();
    }

    const property = await getPublicPropertyBySlug(slugParam);

    if (!property) {
        notFound();
    }

    const propertyId = (property._id || property.id).toString();
    const correctSlug = generatePropertySlug(property.name, property.location, propertyId);

    // If the slug in the URL doesn't match the canonical slug, redirect (e.g. after name change)
    if (slugParam !== correctSlug) {
        redirect(`/properties/${correctSlug}`);
    }

    const allProperties = await getPublicProperties();
    const suggestions = allProperties
        .filter((p) => (p._id || p.id).toString() !== propertyId)
        .slice(0, 3);

    const title = property.name || 'Untitled Property';
    const location = property.location || 'Location Not Specified';
    const price = property.price || 'Price on Request';
    const coverUrl = property.image?.secure_url || property.image_url || '/placeholder.jpg';
    const type = property.propertyType || 'Property';
    const tagColor = property.tag_color || '#3c70b8';

    const whatsappMessage = encodeURIComponent(
        `Hello ALYORA, I am interested in viewing details for property: ${title} (${location}) listed at ${price}. Could you please share more information?`
    );
    const whatsappUrl = `https://wa.me/${COMPANY_CONFIG.whatsappNumber}?text=${whatsappMessage}`;

    // JSON-LD Structured Data
    const propertySchema = {
        '@context': 'https://schema.org',
        '@type': 'RealEstateListing',
        name: title,
        description: property.description || `${type} for sale in ${location}`,
        url: `https://homes.alyora.in/properties/${correctSlug}`,
        image: coverUrl,
        offers: {
            '@type': 'Offer',
            priceCurrency: 'INR',
            price: price.replace(/[^0-9.]/g, '') || undefined,
            availability: 'https://schema.org/InStock',
        },
        address: {
            '@type': 'PostalAddress',
            addressLocality: location,
            addressRegion: 'Kerala',
            addressCountry: 'IN',
        },
    };

    return (
        <div className="min-h-screen bg-white text-[#153545] flex flex-col font-sans selection:bg-[#cbbf9d]">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(propertySchema) }}
            />

            <Header />

            <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 pb-20 lg:pb-6 space-y-8">
                {/* BREADCRUMB & TOP NAV */}
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[#3d4d53]">
                    <nav aria-label="Breadcrumb" className="flex items-center gap-2">
                        <Link href="/" className="hover:text-[#153545]">Home</Link>
                        <ChevronRight className="h-3 w-3" />
                        <Link href="/properties" className="hover:text-[#153545]">Properties</Link>
                        <ChevronRight className="h-3 w-3" />
                        <span className="text-[#153545] font-semibold">{title}</span>
                    </nav>
                    <Link href="/properties" className="inline-flex items-center gap-1 font-semibold text-[#153545] hover:underline">
                        <ChevronLeft className="h-4 w-4" /> Back to Catalog
                    </Link>
                </div>

                {/* HERO SECTION WITH LCP IMAGE */}
                <section className="relative w-full h-[40vh] sm:h-[48vh] min-h-[280px] max-h-[480px] rounded-3xl overflow-hidden shadow-xl border border-[#e8edee] group">
                    <Image
                        src={coverUrl}
                        alt={`${title} - ${type} for sale in ${location}, Kerala`}
                        fill
                        priority
                        sizes="(max-width: 1280px) 100vw, 1280px"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#153545]/90 via-[#153545]/30 to-transparent" />

                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                        <span
                            className="px-3.5 py-1.5 rounded-full text-white text-xs font-bold uppercase tracking-wider shadow-lg"
                            style={{ backgroundColor: tagColor }}
                        >
                            {property.tag || 'For Sale'}
                        </span>
                        {property.featured && (
                            <span className="px-3.5 py-1.5 rounded-full bg-[#cbbf9d] text-[#153545] text-xs font-bold uppercase tracking-wider shadow-lg flex items-center gap-1">
                                <Sparkles size={14} aria-hidden="true" /> Featured
                            </span>
                        )}
                    </div>

                    <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                        <span className="text-xs uppercase tracking-[0.2em] text-[#cbbf9d] font-bold">
                            {type} in {location}
                        </span>
                        <h1 className="serif text-2xl sm:text-4xl font-normal drop-shadow-md text-white">
                            {title}
                        </h1>
                        <div className="flex items-center gap-2 text-sm text-white/90">
                            <MapPin size={16} className="text-[#cbbf9d]" aria-hidden="true" />
                            <span>{location}, Kerala</span>
                        </div>
                    </div>
                </section>

                {/* MAIN DETAILS GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* LEFT CONTENT COLUMN */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* PRICE & KEY SPECS STRIP */}
                        <div className="bg-[#f7f9f9] p-6 rounded-3xl border border-[#e8edee] flex flex-wrap items-center justify-between gap-4">
                            <div>
                                <span className="text-xs uppercase tracking-wider text-[#3d4d53] font-semibold">Asking Price</span>
                                <div className="text-3xl font-bold text-[#153545] mt-1">{price}</div>
                            </div>

                            <div className="flex items-center gap-4 sm:gap-6 text-xs text-[#153545]">
                                {property.beds && (
                                    <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-2xl border border-[#e8edee]">
                                        <BedDouble size={18} className="text-[#3c70b8]" aria-hidden="true" />
                                        <div>
                                            <div className="font-bold">{property.beds}</div>
                                            <div className="text-[10px] text-[#3d4d53]">Bedrooms</div>
                                        </div>
                                    </div>
                                )}
                                {property.baths && (
                                    <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-2xl border border-[#e8edee]">
                                        <Bath size={18} className="text-[#3c70b8]" aria-hidden="true" />
                                        <div>
                                            <div className="font-bold">{property.baths}</div>
                                            <div className="text-[10px] text-[#3d4d53]">Bathrooms</div>
                                        </div>
                                    </div>
                                )}
                                {property.area && (
                                    <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-2xl border border-[#e8edee]">
                                        <Ruler size={18} className="text-[#3c70b8]" aria-hidden="true" />
                                        <div>
                                            <div className="font-bold">{property.area}</div>
                                            <div className="text-[10px] text-[#3d4d53]">Area</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* DESCRIPTION */}
                        {property.description && (
                            <div className="space-y-3">
                                <h2 className="serif text-2xl font-bold text-[#153545]">About Property</h2>
                                <div className="text-sm text-[#3d4d53] leading-relaxed whitespace-pre-line border-l-2 border-[#cbbf9d] pl-4">
                                    {property.description}
                                </div>
                            </div>
                        )}

                        {/* AMENITIES */}
                        {property.amenities && property.amenities.length > 0 && (
                            <div className="space-y-4">
                                <h3 className="serif text-xl font-bold text-[#153545]">Key Amenities</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {property.amenities.map((item: string, idx: number) => (
                                        <div key={idx} className="flex items-center gap-2 p-3 bg-[#f7f9f9] rounded-xl text-xs font-semibold text-[#153545] border border-[#e8edee]">
                                            <ShieldCheck size={16} className="text-[#9aba34]" aria-hidden="true" />
                                            <span>{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* GALLERY VIEWER */}
                        {property.media && property.media.length > 0 && (
                            <GalleryViewer media={property.media} title={title} />
                        )}
                    </div>

                    {/* RIGHT SIDEBAR CTA & ADVISOR CARD */}
                    <div className="space-y-6">
                        <div className="bg-[#103143] text-white p-6 rounded-3xl space-y-5 border border-[#cbbf9d]/30 shadow-xl">
                            <span className="text-[10px] uppercase tracking-[0.2em] text-[#cbbf9d] font-bold">Inquire About Listing</span>
                            <h3 className="serif text-xl font-normal text-white">Interested in this property?</h3>
                            <p className="text-xs text-white/80 leading-relaxed">
                                Connect directly with ALYORA real estate advisors for site visit booking, title document verification, or negotiation.
                            </p>

                            <div className="space-y-3 pt-2">
                                <a
                                    href={whatsappUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-full py-3.5 px-4 bg-[#25D366] text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#20bd5a] transition shadow"
                                >
                                    <MessageCircle size={18} aria-hidden="true" />
                                    <span>Chat on WhatsApp</span>
                                </a>

                                <a
                                    href={`tel:${COMPANY_CONFIG.phone}`}
                                    className="w-full py-3.5 px-4 bg-white/10 text-white rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 hover:bg-white/20 transition border border-white/20"
                                >
                                    <Phone size={16} aria-hidden="true" />
                                    <span>Call {COMPANY_CONFIG.phone}</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* SUGGESTED SIMILAR PROPERTIES */}
                {suggestions.length > 0 && (
                    <div className="pt-12 border-t border-[#e8edee] space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="serif text-2xl font-bold text-[#153545]">Similar Properties in Kerala</h2>
                            <Link href="/properties" className="text-xs font-semibold text-[#153545] hover:underline">
                                View Catalog
                            </Link>
                        </div>
                        <div className="cards-grid">
                            {suggestions.map((p, idx) => (
                                <PropertyCard key={p._id || p.id || idx} property={p} />
                            ))}
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
