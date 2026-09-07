import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { PropertyCard } from '@/components/PropertyCard';
import { PropertyFilterBar } from '@/components/PropertyFilterBar';
import { getPropertiesByFilter, getPublicProperties } from '@/lib/serverData';

// Force dynamic rendering: always fetch latest data from DB
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Property Catalog | Premium Real Estate in Kerala',
  description:
    'Explore verified luxury villas, houses, waterfront plots, and commercial properties across Kochi, Kottayam, Trivandrum, and Thrissur. Complete with transparent title document verification.',
  alternates: {
    canonical: 'https://homes.alyora.in/properties',
  },
  openGraph: {
    title: 'Property Catalog | ALYORA Real Estate Kerala',
    description:
      'Explore verified luxury villas, houses, waterfront plots, and commercial properties across Kerala.',
    url: 'https://homes.alyora.in/properties',
    siteName: 'ALYORA Real Estate',
  },
};

interface PropertiesPageProps {
  searchParams: Promise<{
    type?: string;
    location?: string;
    tag?: string;
    search?: string;
    filter?: string;
  }>;
}

export default async function PropertiesListingPage({ searchParams }: PropertiesPageProps) {
  const resolvedParams = await searchParams;
  const type = resolvedParams.type || 'All';
  const location = resolvedParams.location || 'All';
  const tag = resolvedParams.tag || resolvedParams.filter || 'All';
  const search = resolvedParams.search || '';

  const [filteredProperties, allProperties] = await Promise.all([
    getPropertiesByFilter({ type, location, tag, search }),
    getPublicProperties(),
  ]);

  return (
    <div className="min-h-screen bg-white text-[#153545] flex flex-col font-sans selection:bg-[#cbbf9d]">
      <Header />

      {/* PAGE HEADER */}
      <div className="bg-[#103143] text-white py-12 px-5 lg:px-8 border-b border-[#cbbf9d]/20">
        <div className="max-w-7xl mx-auto space-y-4">
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#cbbf9d] font-bold">
            Curated Listings
          </span>
          <h1 className="serif text-3xl sm:text-4xl font-normal text-white">
            Find Your Dream Property in Kerala
          </h1>
          <p className="text-white/80 text-sm max-w-xl">
            Browse our verified collection of residential houses, luxury villas, land plots, and commercial investments.
          </p>

          <PropertyFilterBar />
        </div>
      </div>

      {/* PROPERTIES LISTING CONTENT */}
      <main id="main-content" className="flex-1 max-w-7xl mx-auto px-5 lg:px-8 py-10 w-full">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#e8edee]">
          <div className="text-sm font-medium text-[#3d4d53]">
            Showing <strong className="text-[#153545]">{filteredProperties.length}</strong> of {allProperties.length} properties
          </div>
          {(type !== 'All' || tag !== 'All' || location !== 'All' || search) && (
            <Link
              href="/properties"
              className="text-xs font-semibold text-[#153545] hover:underline bg-[#f7f9f9] px-3 py-1.5 rounded-lg border border-[#e8edee]"
            >
              Clear All Filters
            </Link>
          )}
        </div>

        {filteredProperties.length === 0 ? (
          <div className="text-center py-16 bg-[#f7f9f9] rounded-3xl border border-[#e8edee] max-w-2xl mx-auto space-y-4">
            <h3 className="serif text-2xl text-[#153545]">No properties found</h3>
            <p className="text-sm text-[#3d4d53]">
              We couldn't find any properties matching your current filter criteria.
            </p>
            <Link
              href="/properties"
              className="inline-block bg-[#153545] text-white px-6 py-2.5 rounded-xl text-xs font-semibold shadow hover:bg-[#1e4559] transition"
            >
              View All Available Listings
            </Link>
          </div>
        ) : (
          <div className="cards-grid">
            {filteredProperties.map((p, idx) => (
              <PropertyCard key={p._id || p.id || idx} property={p} priority={idx < 3} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
