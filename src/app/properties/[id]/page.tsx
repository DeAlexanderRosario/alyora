'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight, Bath, BedDouble, CheckCircle, ChevronLeft, ChevronRight,
  ExternalLink, Eye, FileText, Gem, Home, Leaf, Lock, MapPin, Maximize2,
  Phone, Ruler, ShieldCheck, Sofa, Sparkles, Trees, Video
} from 'lucide-react';

import { api, type Property, type MediaAsset, type PropertyDocument } from '@/lib/api';
import { COMPANY_CONFIG } from '@/lib/env';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const WHATSAPP_PHONE = COMPANY_CONFIG.whatsappNumber;
const GOOGLE_MAPS_API_KEY = "AIzaSyCJKnngOF26s7pR-MQpGX4OeNjKVEAjLXI";

const HIGHLIGHTS = [
  { icon: MapPin, label: "Prime Location" },
  { icon: Gem, label: "Premium Quality" },
  { icon: Sofa, label: "Spacious Design" },
  { icon: Leaf, label: "Green Surroundings" },
  { icon: CheckCircle, label: "Verified Listing" },
];

export default function PropertyPage() {
  const params = useParams();
  const id = params?.id as string;
  const [property, setProperty] = useState<Property | null>(null);
  const [suggestions, setSuggestions] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [activeMediaTab, setActiveMediaTab] = useState<'photos' | 'videos' | 'floorplans'>('photos');

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const data = await api.getProperty(id);
        setProperty(data);

        // Fetch suggestions / similar properties
        try {
          const allProps = await api.getProperties();
          const otherProps = allProps.filter((p) => (p._id || p.id) !== id);
          setSuggestions(otherProps.slice(0, 3));
        } catch {
          setSuggestions([]);
        }
      } catch (err: any) {
        setError(err.message || 'Property not found');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const photos = useMemo(() => {
    if (!property) return [];
    const list: MediaAsset[] = [];
    if (property.image?.secure_url || property.image_url) {
      list.push({
        secure_url: property.image?.secure_url || property.image_url,
        public_id: property.image?.public_id || 'cover',
        caption: 'Cover Image',
        type: 'photo'
      });
    }
    if (Array.isArray(property.media)) {
      property.media.forEach((m) => {
        if (!m.type || m.type === 'photo') {
          if (!list.some(p => p.secure_url === m.secure_url)) {
            list.push(m);
          }
        }
      });
    }
    return list;
  }, [property]);

  const videos = useMemo(() => {
    if (!property || !Array.isArray(property.media)) return [];
    return property.media.filter(m => m.type === 'video');
  }, [property]);

  const floorplans = useMemo(() => {
    if (!property || !Array.isArray(property.media)) return [];
    return property.media.filter(m => m.type === 'floorplan');
  }, [property]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafb] flex flex-col font-sans">
        <Header />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-pulse">
          <div className="h-4 w-48 bg-slate-200 rounded-full" />
          <div className="w-full h-[40vh] sm:h-[48vh] bg-slate-200 rounded-3xl" />
          <div className="flex overflow-x-auto gap-3 sm:grid sm:grid-cols-5">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex-none w-32 sm:w-auto h-20 bg-slate-200 rounded-xl" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-40 bg-slate-200 rounded-2xl" />
              <div className="h-40 bg-slate-200 rounded-2xl" />
            </div>
            <div className="h-64 bg-slate-200 rounded-3xl" />
          </div>
        </main>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-[#f8fafb] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="serif text-3xl font-bold text-[#153545] mb-3">Property Unavailable</h2>
        <p className="text-sm text-[#657176] mb-6 max-w-md">The property details could not be loaded or the link is invalid.</p>
        <Link href="/properties" className="bg-[#153545] text-white px-6 py-2.5 rounded-full text-xs font-semibold hover:bg-[#1e4559] transition">
          Browse All Properties
        </Link>
      </div>
    );
  }

  const formatTitle = (name?: string) => {
    if (!name) return 'Property Details';
    return name.replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const formatLocationName = (loc?: string) => {
    if (!loc) return 'Kerala';
    return loc.replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const formatPriceVal = (p?: string) => {
    if (!p) return '';
    let res = p.trim().replace(/lack/i, 'Lakh').replace(/lac/i, 'Lakh');
    if (!res.startsWith('₹') && !res.toLowerCase().includes('lakh') && !res.toLowerCase().includes('crore')) {
      return `₹ ${res}`;
    }
    if (!res.startsWith('₹')) return `₹ ${res}`;
    return res;
  };

  const title = formatTitle(property.name);
  const locality = formatLocationName(property.location);
  const status = property.tag || 'For Sale';
  const price = formatPriceVal(property.price);
  const bedrooms = property.beds && property.beds !== '-' ? property.beds : null;
  const bathrooms = property.baths && property.baths !== '-' ? property.baths : null;
  const builtUp = property.area && property.area !== '-' ? property.area : null;
  const plot = property.plot && property.plot !== '-' ? property.plot : null;
  const type = property.propertyType || property.tag || 'Property';
  const about = property.description || `Explore ${title}, located in ${locality}. Complete title documentation and verified details available.`;

  const mapsQuery = property.gpsCoordinates?.lat && property.gpsCoordinates?.lng
    ? `${property.gpsCoordinates.lat},${property.gpsCoordinates.lng}`
    : (property.exactAddress || property.location);

  const googleMapEmbedUrl = `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(mapsQuery)}`;

  const whatsappHref = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(`Hello ALYORA, I am interested in property "${title}". Please provide more details.`)}`;

  // Construct clean facts list (hiding empty '-' items for shops/land)
  const facts = [];
  if (bedrooms) facts.push({ icon: BedDouble, value: String(bedrooms), label: "Bedrooms" });
  if (bathrooms) facts.push({ icon: Bath, value: String(bathrooms), label: "Bathrooms" });
  if (builtUp) facts.push({ icon: Ruler, value: String(builtUp), label: "Built-up Area" });
  if (plot) facts.push({ icon: Trees, value: String(plot), label: "Plot Area" });
  facts.push({ icon: Home, value: String(type), label: "Property Type" });
  facts.push({ icon: CheckCircle, value: "Verified", label: "Title Document" });
  facts.push({ icon: MapPin, value: "Prime", label: "Location" });

  // Only public or non-private documents
  const displayDocuments = (property.documents || []).filter((doc: PropertyDocument) =>
    !doc.visibility || doc.visibility === 'PUBLIC' || doc.visibility === 'CUSTOMER_SHARED'
  );

  const coverUrl = photos[0]?.secure_url || property.image_url || '/placeholder.jpg';

  const propertySchema = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: title,
    description: about,
    url: `https://homes.alyora.in/properties/${id}`,
    image: coverUrl,
    offeredBy: {
      '@type': 'RealEstateAgent',
      name: 'ALYORA Real Estate',
      url: 'https://homes.alyora.in',
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: locality,
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

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 pb-20 lg:pb-6 space-y-8">

        {/* BREADCRUMB & TOP NAV */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[#657176]">
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

        {/* HERO SECTION WITH COVER IMAGE & DETAILS */}
        <section className="relative w-full h-[40vh] sm:h-[48vh] min-h-[280px] max-h-[480px] rounded-3xl overflow-hidden shadow-xl border border-[#e8edee] group">
          <img
            src={coverUrl}
            alt={`${title} - ${type} for sale in ${locality}, Kerala`}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#153545]/90 via-[#153545]/30 to-transparent" />

          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-[11px] uppercase tracking-wider font-bold text-[#153545] shadow-md">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {status}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/50 backdrop-blur-md text-white text-[11px] font-medium border border-white/20">
              <Eye className="w-3.5 h-3.5 text-[#cbbf9d]" />
              {photos.length} Photos
            </span>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex items-center gap-1.5 text-white/90 text-xs font-medium tracking-wide">
                <MapPin className="w-3.5 h-3.5 text-[#cbbf9d]" />
                <span>{locality}</span>
              </div>
              <h1 className="serif text-3xl sm:text-5xl font-bold tracking-tight text-white capitalize leading-tight">
                {title}
              </h1>
            </div>

            {price && (
              <div className="text-left sm:text-right shrink-0 bg-white/15 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/25 shadow-lg">
                <div className="text-[10px] uppercase tracking-wider text-white/80 font-semibold">Total Price</div>
                <div className="serif text-2xl sm:text-3xl font-bold text-white">{price}</div>
              </div>
            )}
          </div>
        </section>

        {/* FACTS HORIZONTAL SWIPE BAR FOR PHONE & GRID FOR DESKTOP */}
        <section className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none sm:grid sm:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 bg-[#f8fafb] p-3 sm:p-4 rounded-2xl border border-[#e8edee] text-nowrap">
          {facts.map(({ icon: Icon, value, label }) => (
            <div
              key={label}
              className="flex-none snap-start w-36 sm:w-auto bg-white p-3.5 rounded-xl border border-[#e8edee] text-center shadow-2xs flex flex-col items-center justify-center transition-all hover:border-[#153545]/30 hover:shadow-xs"
            >
              <Icon className="w-5 h-5 text-[#153545] mb-1 stroke-[1.5]" />
              <div className="font-bold text-sm text-[#153545] truncate w-full">{value}</div>
              <div className="text-[10px] uppercase tracking-wider text-[#657176] font-semibold truncate w-full">{label}</div>
            </div>
          ))}
        </section>

        {/* 2-COLUMN LAYOUT: MAIN CONTENT VS SIDEBAR */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT 2 COLUMNS: ABOUT, AMENITIES, SPECS, MEDIA, DOCS */}
          <div className="lg:col-span-2 space-y-8">

            {/* ABOUT / DESCRIPTION */}
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#e8edee] space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-[#e8edee] pb-3.5">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#cbbf9d]" />
                  <h2 className="serif text-xl font-bold text-[#153545]">About Property</h2>
                </div>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#f8fafb] border border-[#e8edee] text-[10px] font-bold text-[#2E7D32]">
                  <CheckCircle className="w-3 h-3" /> ALYORA Verified
                </span>
              </div>
              <p className="text-sm text-[#35434a] leading-relaxed whitespace-pre-line font-normal">
                {about}
              </p>

              <div className="pt-2 flex flex-wrap gap-2 text-xs">
                <span className="px-3 py-1.5 rounded-xl bg-[#f8fafb] border border-[#e8edee] text-[#153545] font-medium inline-flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#cbbf9d]" /> Clear Title & Deeds
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-[#f8fafb] border border-[#e8edee] text-[#153545] font-medium inline-flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#cbbf9d]" /> Prime Road Access
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-[#f8fafb] border border-[#e8edee] text-[#153545] font-medium inline-flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-[#cbbf9d]" /> Direct Consultation
                </span>
              </div>
            </div>

            {/* AMENITIES & SPECIFICATIONS */}
            {((property.amenities && property.amenities.length > 0) ||
              (property.specifications && property.specifications.length > 0)) && (
                <div className="bg-[#f8fafb] p-6 rounded-2xl border border-[#e8edee] space-y-6">

                  {property.amenities && property.amenities.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-xs uppercase tracking-wider font-bold text-[#657176]">Amenities & Features</h3>
                      <div className="flex flex-wrap gap-2.5">
                        {property.amenities.map((amenity, i) => (
                          <span key={i} className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-[#e8edee] text-xs font-semibold text-[#153545] shadow-2xs">
                            <CheckCircle className="w-3.5 h-3.5 text-[#2E7D32]" />
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {property.specifications && property.specifications.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-xs uppercase tracking-wider font-bold text-[#657176]">Specifications & Details</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {property.specifications.map((spec, i) => (
                          <div key={i} className="bg-white p-3 rounded-xl border border-[#e8edee] flex justify-between items-center text-xs">
                            <span className="text-[#657176] font-medium">{spec.key}</span>
                            <span className="font-semibold text-[#153545]">{spec.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              )}

            {/* MEDIA GALLERY: PHOTOS / VIDEOS / FLOORPLANS */}
            {photos.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="serif text-xl font-bold text-[#153545]">Media Gallery</h3>
                  <div className="flex items-center gap-1 bg-[#f8fafb] border border-[#e8edee] rounded-full p-1 text-xs">
                    <button
                      onClick={() => setActiveMediaTab('photos')}
                      className={`px-3 py-1 rounded-full font-medium transition ${activeMediaTab === 'photos' ? 'bg-[#153545] text-white' : 'text-[#657176]'}`}
                    >
                      Photos ({photos.length})
                    </button>
                    {videos.length > 0 && (
                      <button
                        onClick={() => setActiveMediaTab('videos')}
                        className={`px-3 py-1 rounded-full font-medium transition ${activeMediaTab === 'videos' ? 'bg-[#153545] text-white' : 'text-[#657176]'}`}
                      >
                        Videos ({videos.length})
                      </button>
                    )}
                    {floorplans.length > 0 && (
                      <button
                        onClick={() => setActiveMediaTab('floorplans')}
                        className={`px-3 py-1 rounded-full font-medium transition ${activeMediaTab === 'floorplans' ? 'bg-[#153545] text-white' : 'text-[#657176]'}`}
                      >
                        Floorplans ({floorplans.length})
                      </button>
                    )}
                  </div>
                </div>

                {activeMediaTab === 'photos' && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {photos.map((p, idx) => (
                      <div
                        key={idx}
                        onClick={() => setSelectedPhoto(p.secure_url)}
                        className="relative h-28 sm:h-36 rounded-2xl overflow-hidden border border-[#e8edee] cursor-pointer group shadow-2xs"
                      >
                        <img src={p.secure_url} alt={p.caption || title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition" />
                      </div>
                    ))}
                  </div>
                )}

                {activeMediaTab === 'videos' && videos.length > 0 && (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {videos.map((v, idx) => (
                      <div key={idx} className="bg-black rounded-2xl overflow-hidden">
                        <video src={v.secure_url} controls className="w-full h-48 object-cover" />
                      </div>
                    ))}
                  </div>
                )}

                {activeMediaTab === 'floorplans' && floorplans.length > 0 && (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {floorplans.map((fp, idx) => (
                      <div key={idx} className="bg-[#f8fafb] border border-[#e8edee] p-3 rounded-2xl text-center">
                        <img src={fp.secure_url} alt="Floorplan" className="w-full h-48 object-contain" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* REAL GOOGLE MAP EMBED */}
            <div className="bg-white p-6 rounded-2xl border border-[#e8edee] space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#cbbf9d]" />
                  <h3 className="serif text-xl font-bold text-[#153545]">Location Map</h3>
                </div>
                <span className="text-xs text-[#657176]">{locality}</span>
              </div>

              <div className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden border border-[#e8edee] bg-slate-100">
                <iframe
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={googleMapEmbedUrl}
                />
              </div>

              <div className="flex justify-end pt-1">
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(mapsQuery)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 bg-[#153545] text-white px-4 py-2 rounded-full text-xs font-semibold shadow hover:bg-[#1e4559] transition"
                >
                  Open in Google Maps App <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* PUBLIC DOCUMENTS */}
            {displayDocuments.length > 0 && (
              <div className="bg-[#f8fafb] p-6 rounded-2xl border border-[#e8edee] space-y-3">
                <h3 className="text-xs uppercase tracking-wider font-bold text-[#657176]">Property Verification Documents</h3>
                <div className="space-y-2">
                  {displayDocuments.map((doc: PropertyDocument, idx: number) => (
                    <div key={idx} className="bg-white p-3.5 rounded-xl border border-[#e8edee] flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3 min-w-0">
                        <FileText className="w-4 h-4 text-[#153545] shrink-0" />
                        <span className="font-semibold text-[#153545] truncate">{doc.name}</span>
                      </div>
                      {doc.url && (
                        <a href={doc.url} target="_blank" rel="noreferrer" className="px-3 py-1.5 rounded-lg bg-[#153545] text-white text-[11px] font-semibold inline-flex items-center gap-1">
                          <Eye className="w-3 h-3" /> View
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* RIGHT SIDE: CONTACT CARD */}
          <div className="lg:col-span-1">
            {/* MOBILE COMPACT MINIMAL FLOATING CARD */}
            <div className="lg:hidden bg-[#153545] text-white p-3.5 rounded-2xl flex items-center justify-between gap-3 shadow-md border border-[#153545]">
              <div className="space-y-0.5">
                <span className="text-[9px] uppercase tracking-widest text-[#cbbf9d] font-bold">ALYORA Direct</span>
                <h4 className="text-xs font-bold text-white">Inquire on WhatsApp</h4>
                <p className="text-[10px] text-white/70">Verified details & site visit</p>
              </div>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center gap-1.5 shadow shrink-0"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Chat</span>
              </a>
            </div>

            {/* DESKTOP FULL STICKY CARD */}
            <div className="hidden lg:block sticky top-24 bg-[#153545] text-white p-6 rounded-3xl shadow-xl space-y-6 border border-[#153545]">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#cbbf9d] font-bold">ALYORA Official</span>
                <h3 className="serif text-2xl font-bold text-white mt-1">Inquire About This Property</h3>
                <p className="text-xs text-white/70 mt-2 leading-relaxed">
                  Connect with an ALYORA property executive on WhatsApp for private site visit scheduling and full documentation.
                </p>
              </div>

              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-3.5 px-4 rounded-2xl transition shadow-lg flex items-center justify-center gap-2 text-sm"
              >
                <Phone className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>

              <div className="border-t border-white/10 pt-4 space-y-2 text-xs text-white/70">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#cbbf9d]" />
                  <span>Direct response from ALYORA team</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#cbbf9d]" />
                  <span>Verified property documentation</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </main>

      {/* SUGGESTED / SIMILAR PROPERTIES (Only rendered if available) */}
      {suggestions.length > 0 && (
        <section className="bg-[#f8fafb] border-t border-[#e8edee] py-10 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-bold text-[#cbbf9d]">Discover More</span>
                <h2 className="serif text-2xl font-bold text-[#153545]">Suggested Properties</h2>
              </div>
              <Link href="/properties" className="text-xs font-semibold text-[#153545] hover:underline flex items-center gap-1">
                View All Listings <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {suggestions.map((item) => {
                const itemImg = item.image?.secure_url || item.image_url || '/placeholder.jpg';
                const itemLoc = item.location || 'Kerala';
                return (
                  <Link key={item._id || item.id} href={`/properties/${item._id || item.id}`} className="group bg-white rounded-2xl overflow-hidden border border-[#e8edee] shadow-sm hover:shadow-md transition">
                    <div className="relative h-44 w-full overflow-hidden">
                      <img src={itemImg} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                      {item.tag && (
                        <span className="absolute top-3 left-3 bg-[#153545]/90 text-white text-[10px] uppercase font-bold px-2.5 py-1 rounded-full">
                          {item.tag}
                        </span>
                      )}
                    </div>
                    <div className="p-4 space-y-1.5">
                      <div className="text-[11px] text-[#657176] flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#cbbf9d]" /> {itemLoc}
                      </div>
                      <h3 className="serif text-base font-bold text-[#153545] group-hover:text-[#cbbf9d] transition line-clamp-1">
                        {item.name}
                      </h3>
                      {item.price && <div className="serif text-lg font-bold text-[#153545] pt-1">{item.price}</div>}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* LIGHTBOX MODAL FOR ENLARGING PHOTOS */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4" onClick={() => setSelectedPhoto(null)}>
          <img src={selectedPhoto} alt="Enlarged" className="max-h-[85vh] max-w-full rounded-xl object-contain shadow-2xl" />
        </div>
      )}

      {/* MOBILE FLOATING STICKY INQUIRY BAR (Always Floating & Visible on Phones) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#153545]/95 backdrop-blur-xl border-t border-[#153545] p-3 px-4 flex items-center justify-between gap-3 shadow-[0_-8px_25px_rgba(0,0,0,0.25)]">
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse" />
            <span className="text-[10px] uppercase tracking-wider text-[#cbbf9d] font-bold">ALYORA Official</span>
          </div>
          <div className="text-xs font-semibold text-white truncate">Inquire & Verified Docs</div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </a>
          <a
            href={`tel:${WHATSAPP_PHONE}`}
            className="bg-white/10 hover:bg-white/20 text-white font-bold p-2.5 rounded-xl text-center text-xs flex items-center justify-center shadow border border-white/20 active:scale-95 transition"
            aria-label="Call Executive"
          >
            <Phone className="w-3.5 h-3.5 text-[#cbbf9d]" />
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
}
