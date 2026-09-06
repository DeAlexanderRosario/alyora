'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, MapPin, Filter, BedDouble, Bath, Ruler, FileText, Heart, Sparkles } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { api, type Property } from '@/lib/api';

const PROPERTY_TYPES = ['All', 'Villa', 'Apartment', 'Land', 'House', 'Commercial', 'Plot', 'Penthouse', 'Farmhouse'];

export default function PropertiesListingPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedTag, setSelectedTag] = useState('All');

  useEffect(() => {
    (async () => {
      try {
        const data = await api.getProperties();
        setProperties(data);
      } catch (err) {
        console.error('Failed to load properties:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      // Keyword search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.name?.toLowerCase().includes(q);
        const matchesLoc = p.location?.toLowerCase().includes(q);
        const matchesDesc = p.description?.toLowerCase().includes(q);
        if (!matchesName && !matchesLoc && !matchesDesc) return false;
      }
      // Type filter
      if (selectedType !== 'All' && p.propertyType !== selectedType) {
        return false;
      }
      // Tag filter
      if (selectedTag !== 'All' && p.tag !== selectedTag) {
        return false;
      }
      return true;
    });
  }, [properties, searchQuery, selectedType, selectedTag]);

  return (
    <div className="min-h-screen bg-[#f7f9f9] text-[#153545] flex flex-col">
      <Header />

      {/* CATALOG HERO BANNER */}
      <div className="bg-[#103143] text-white py-12 px-5 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#cbbf9d]/20 border border-[#cbbf9d]/40 text-[#cbbf9d] text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            ALYORA Portfolio
          </div>
          <h1 className="serif text-3xl sm:text-5xl font-normal leading-tight">
            Property Catalog
          </h1>
          <p className="text-sm sm:text-base text-white/75 max-w-2xl leading-relaxed">
            Discover verified luxury villas, residential plots, apartments, and commercial spaces across Kerala.
          </p>

          {/* SEARCH & FILTERS BAR */}
          <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-4xl">
            <div className="relative">
              <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search location or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white text-[#153545] placeholder-gray-400 pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none shadow"
              />
            </div>

            <div>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full bg-white text-[#153545] px-4 py-2.5 rounded-xl text-sm outline-none shadow"
              >
                {PROPERTY_TYPES.map((t) => (
                  <option key={t} value={t}>
                    Type: {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="w-full bg-white text-[#153545] px-4 py-2.5 rounded-xl text-sm outline-none shadow"
              >
                <option value="All">Status: All Tags</option>
                <option value="For Sale">For Sale</option>
                <option value="Featured">Featured</option>
                <option value="Land">Land</option>
                <option value="Rent">Rent</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* PROPERTIES LISTING CONTENT */}
      <main className="flex-1 max-w-7xl mx-auto px-5 lg:px-8 py-10 w-full">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#e8edee]">
          <div className="text-sm font-medium text-[#657176]">
            Showing <strong className="text-[#153545]">{filteredProperties.length}</strong> of {properties.length} properties
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center text-[#657176] space-y-3">
            <div className="w-8 h-8 border-2 border-[#153545]/20 border-t-[#153545] rounded-full animate-spin mx-auto" />
            <p className="text-xs uppercase tracking-widest">Loading properties...</p>
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-2xl border border-[#e8edee] p-8 space-y-3 shadow-sm">
            <Filter className="w-10 h-10 text-[#cbbf9d] mx-auto" />
            <h3 className="serif text-2xl text-[#153545]">No matching properties</h3>
            <p className="text-sm text-[#657176]">Try adjusting your search query or filter selections.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedType('All');
                setSelectedTag('All');
              }}
              className="mt-4 px-5 py-2.5 rounded-full bg-[#153545] text-white text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((p) => {
              const displayImg = p.image?.secure_url || p.image_url || '/placeholder.jpg';
              const propertyId = p._id || p.id;
              return (
                <Link
                  key={propertyId}
                  href={`/properties/${propertyId}`}
                  className="group bg-white rounded-2xl overflow-hidden border border-[#e8edee] shadow-[0_4px_20px_rgba(21,53,69,0.05)] hover:shadow-xl transition-all duration-300 flex flex-col"
                >
                  {/* CARD COVER IMAGE */}
                  <div className="relative height-[220px] h-52 overflow-hidden bg-[#103143]">
                    <img
                      src={displayImg}
                      alt={p.name}
                      className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition" />

                    <span
                      className="absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white shadow-sm"
                      style={{ backgroundColor: p.tag_color || '#3c70b8' }}
                    >
                      {p.tag}
                    </span>

                    {p.featured && (
                      <span className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-[#cbbf9d] text-[#153545] text-[10px] font-bold uppercase tracking-wider shadow">
                        Featured
                      </span>
                    )}

                    <div className="absolute bottom-3 left-4 right-4 text-white">
                      <div className="text-xl font-bold">{p.price}</div>
                    </div>
                  </div>

                  {/* CARD BODY */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="serif text-xl font-medium text-[#153545] group-hover:text-[#3c70b8] transition line-clamp-1">
                        {p.name}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs text-[#657176] mt-1.5 truncate">
                        <MapPin className="w-3.5 h-3.5 text-[#cbbf9d] shrink-0" />
                        <span className="truncate">{p.location}</span>
                      </div>
                    </div>

                    {/* SPECS GRID */}
                    <div className="pt-3 border-t border-[#f0f4f5] flex items-center justify-between text-xs text-[#657176]">
                      {p.beds && (
                        <div className="flex items-center gap-1.5">
                          <BedDouble className="w-4 h-4 text-[#9a8a68]" />
                          <span>{p.beds}</span>
                        </div>
                      )}
                      {p.baths && (
                        <div className="flex items-center gap-1.5">
                          <Bath className="w-4 h-4 text-[#9a8a68]" />
                          <span>{p.baths}</span>
                        </div>
                      )}
                      {p.area && (
                        <div className="flex items-center gap-1.5">
                          <Ruler className="w-4 h-4 text-[#9a8a68]" />
                          <span>{p.area}</span>
                        </div>
                      )}
                    </div>

                    {p.documents && p.documents.length > 0 && (
                      <div className="pt-2 flex items-center gap-1.5 text-[11px] text-[#4e9a53] font-medium">
                        <FileText className="w-3.5 h-3.5" />
                        <span>{p.documents.length} PDF Document(s) Attached</span>
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
