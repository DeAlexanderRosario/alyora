import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Building2,
  FileText,
  Home,
  Map,
  ShieldCheck,
  TrendingUp,
  Users,
  CheckCircle2,
} from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SearchPanel } from '@/components/SearchPanel';
import { ContactSection } from '@/components/ContactSection';
import { PropertyCard } from '@/components/PropertyCard';
import { getPublicProperties, getPublicLocations } from '@/lib/serverData';
import heroImage from '../../assets/images/hero.png';

export const metadata: Metadata = {
  title: 'ALYORA | Premium Real Estate Platform in Kerala',
  description:
    'Homes. Investments. Opportunities. Discover verified luxury villas, residential plots, and commercial properties across Kochi, Kottayam, Trivandrum, and Thrissur.',
  metadataBase: new URL('https://homes.alyora.in'),
  alternates: {
    canonical: 'https://homes.alyora.in',
  },
  openGraph: {
    title: 'ALYORA | Premium Real Estate Platform in Kerala',
    description:
      'Homes. Investments. Opportunities. Premium real estate platform in Kerala connecting buyers, sellers, and NRIs.',
    url: 'https://homes.alyora.in',
    siteName: 'ALYORA Real Estate',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: 'https://res.cloudinary.com/dyo0ewt0n/image/upload/v1788635144/alyora/iqpx9j4j4yw0rbr8mdnz.jpg',
        width: 1200,
        height: 630,
        alt: 'ALYORA Real Estate Kerala',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ALYORA | Where Life Finds Its Place',
    description: 'Premium real estate platform in Kerala.',
    images: [
      'https://res.cloudinary.com/dyo0ewt0n/image/upload/v1788635144/alyora/iqpx9j4j4yw0rbr8mdnz.jpg',
    ],
  },
};

const categories = [
  { icon: Home, title: 'Residential', sub: 'Homes', href: '/properties?type=House' },
  { icon: Building2, title: 'Commercial', sub: 'Spaces', href: '/properties?type=Commercial' },
  { icon: Map, title: 'Plots & Land', sub: 'Land', href: '/properties?type=Land' },
  { icon: TrendingUp, title: 'Investment', sub: 'Opportunities', href: '/properties?filter=featured' },
  { icon: Users, title: 'Sell / List', sub: 'Your Property', href: '/#contact' },
  { icon: FileText, title: 'Property', sub: 'Documentation', href: '/#contact' },
  { icon: ShieldCheck, title: 'Expert', sub: 'Support', href: '/#contact' },
];

export default async function HomePage() {
  const [properties, locations] = await Promise.all([
    getPublicProperties(),
    getPublicLocations(),
  ]);

  const featuredProperties = properties.slice(0, 6);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      <Header transparent />

      <main id="main-content">
        {/* HERO SECTION WITH OPTIMIZED LCP IMAGE */}
        <section className="hero-section relative min-h-[640px] flex flex-col justify-between px-[6%]">
          <Image
            src={heroImage}
            alt="ALYORA Premium Real Estate Homes in Kerala"
            fill
            priority
            quality={85}
            sizes="100vw"
            className="object-cover object-center z-0"
          />
          <div className="hero-overlay" />

          {/* Hero Content Header */}
          <div className="hero-content pt-20 sm:pt-28 pb-32 max-w-2xl">
            <span
              style={{
                color: '#ffffff',
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 2,
                opacity: 0.95,
              }}
            >
              WHERE LIFE FINDS ITS PLACE
            </span>
            <h1
              className="serif"
              style={{
                color: '#ffffff',
                fontSize: '3.2rem',
                lineHeight: 1.1,
                fontWeight: 400,
                marginTop: 10,
              }}
            >
              More Than Properties. <br className="hidden sm:inline" /> A Better Tomorrow.
            </h1>
            <p
              style={{
                color: '#ffffff',
                fontSize: 16,
                marginTop: 16,
                lineHeight: 1.5,
                opacity: 0.95,
              }}
            >
              Homes. Investments. Opportunities.
              <br />
              All in one trusted place.
            </p>
          </div>

          {/* Search Panel Component */}
          <SearchPanel />
        </section>

        {/* CATEGORY STRIP */}
        <section className="category-strip" aria-label="Property Categories">
          <div className="category-content">
            {categories.map((cat, idx) => {
              const IconComp = cat.icon;
              return (
                <Link
                  key={idx}
                  href={cat.href}
                  className="category-item group text-decoration-none"
                >
                  <IconComp size={22} color="#153545" aria-hidden="true" />
                  <span className="category-title group-hover:text-[#3c70b8] transition-colors">
                    {cat.title}
                  </span>
                  {cat.sub && <span className="category-sub">{cat.sub}</span>}
                </Link>
              );
            })}
          </div>
        </section>

        {/* FEATURED PROPERTIES SECTION */}
        <section className="section-wrap">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginBottom: 32,
            }}
          >
            <div>
              <span
                style={{
                  color: '#3d4d53',
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: 2,
                }}
              >
                FEATURED PROPERTIES
              </span>
              <h2
                className="serif"
                style={{ color: '#153545', fontSize: 32, marginTop: 4 }}
              >
                Handpicked for a Better Life
              </h2>
              <p style={{ color: '#3d4d53', fontSize: 14, marginTop: 8 }}>
                Explore premium properties across Kerala. From serene homes to high-potential investments.
              </p>
            </div>
            <Link
              href="/properties"
              className="hidden sm:flex items-center gap-2 text-sm font-semibold text-[#153545] hover:text-[#3c70b8] transition"
            >
              <span>View All Properties</span>
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>

          {featuredProperties.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '60px 20px',
                backgroundColor: '#f7f9f9',
                borderRadius: 16,
                color: '#3d4d53',
              }}
            >
              No properties found matching your criteria.
            </div>
          ) : (
            <div className="cards-grid">
              {featuredProperties.map((p, idx) => (
                <PropertyCard key={p._id || p.id || idx} property={p} priority={idx < 2} />
              ))}
            </div>
          )}

          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#153545] text-white text-sm font-semibold shadow"
            >
              <span>View All Properties</span>
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </section>

        {/* POPULAR LOCATIONS PROGRAMMATIC SEO SECTION */}
        {locations.length > 0 && (
          <section
            style={{
              backgroundColor: '#f7f9f9',
              padding: '50px 5%',
              borderTop: '1px solid #e8edee',
              borderBottom: '1px solid #e8edee',
            }}
          >
            <div style={{ maxWidth: 1200, margin: '0 auto' }}>
              <span
                style={{
                  color: '#3d4d53',
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: 2,
                }}
              >
                EXPLORE BY LOCATION
              </span>
              <h2
                className="serif"
                style={{ color: '#153545', fontSize: 28, marginTop: 4, marginBottom: 20 }}
              >
                Find Your Place in Kerala
              </h2>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                  gap: 14,
                }}
              >
                {locations.map((loc: any) => (
                  <Link
                    key={loc.id || loc.name}
                    href={`/properties?location=${encodeURIComponent(loc.name)}`}
                    className="flex items-center justify-between p-3.5 bg-white rounded-xl border border-[#e8edee] hover:border-[#153545] hover:shadow-md transition text-[#153545] text-sm font-semibold"
                  >
                    <span>{loc.name}</span>
                    <span className="text-xs font-normal text-[#3d4d53]">{loc.district}</span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* WHY ALYORA / BRAND STORY SECTION */}
        <section
          style={{
            position: 'relative',
            backgroundImage:
              'url(https://images.pexels.com/photos/27869349/pexels-photo-27869349.jpeg?auto=compress&cs=tinysrgb&h=650&w=940)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            padding: '80px 5%',
            color: '#ffffff',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(6, 35, 40, 0.88)',
            }}
          />
          <div
            style={{
              position: 'relative',
              zIndex: 2,
              maxWidth: 1200,
              margin: '0 auto',
              display: 'flex',
              flexWrap: 'wrap',
              gap: 40,
              alignItems: 'center',
            }}
          >
            <div style={{ flex: 1, minWidth: 300 }}>
              <span
                style={{
                  color: '#eef4f0',
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: 2,
                }}
              >
                WHY ALYORA
              </span>
              <h2
                className="serif"
                style={{ fontSize: 36, marginTop: 8, lineHeight: 1.2 }}
              >
                Rooted in Kerala.
                <br />
                Focused on Your Future.
              </h2>
              <p
                style={{
                  color: '#ffffff',
                  fontSize: 14,
                  lineHeight: 1.6,
                  marginTop: 16,
                  opacity: 0.95,
                }}
              >
                We believe a property is more than just land or a building — it's a place where life happens. At Alyora, we bring trust, transparency and expertise to help you find the right property in the right place.
              </p>
              <div
                style={{
                  marginTop: 24,
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 16,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    color: '#e2ebe8',
                    fontSize: 13,
                  }}
                >
                  <CheckCircle2 size={16} color="#cbbf9d" aria-hidden="true" />
                  <span>Genuine &amp; trusted properties</span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    color: '#e2ebe8',
                    fontSize: 13,
                  }}
                >
                  <CheckCircle2 size={16} color="#cbbf9d" aria-hidden="true" />
                  <span>Deep knowledge of Kerala</span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    color: '#e2ebe8',
                    fontSize: 13,
                  }}
                >
                  <CheckCircle2 size={16} color="#cbbf9d" aria-hidden="true" />
                  <span>From search to registration</span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    color: '#e2ebe8',
                    fontSize: 13,
                  }}
                >
                  <CheckCircle2 size={16} color="#cbbf9d" aria-hidden="true" />
                  <span>Your goals, our priority</span>
                </div>
              </div>
            </div>

            <div
              style={{
                flex: 1,
                minWidth: 300,
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 16,
              }}
            >
              {[
                { title: 'Local Expertise', desc: 'Deep roots in Kerala real estate market.' },
                { title: 'Verified Listings', desc: 'Every document thoroughly checked.' },
                { title: 'End-to-End Support', desc: 'From site visits to legal paperwork.' },
                { title: 'People First', desc: 'Honest guidance with no high-pressure sales.' },
              ].map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    backdropFilter: 'blur(8px)',
                    padding: 24,
                    borderRadius: 16,
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: 15, color: '#ffffff' }}>
                    {item.title}
                  </div>
                  <div
                    style={{
                      color: '#e2ebe8',
                      fontSize: 12,
                      marginTop: 6,
                      lineHeight: 1.5,
                    }}
                  >
                    {item.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ & REAL ESTATE KNOWLEDGE EDITORIAL */}
        <section
          style={{
            backgroundColor: '#f0f4f5',
            padding: '60px 5%',
            borderTop: '1px solid #e8edee',
          }}
        >
          <div
            style={{
              maxWidth: 1200,
              margin: '0 auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 40,
            }}
          >
            {/* SEO Rich Text Overview */}
            <article
              style={{
                backgroundColor: '#ffffff',
                borderRadius: 16,
                padding: '32px 40px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
              }}
            >
              <span
                style={{
                  color: '#3d4d53',
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: 2,
                }}
              >
                REAL ESTATE IN KERALA
              </span>
              <h2
                className="serif"
                style={{ color: '#153545', fontSize: 28, marginTop: 8, marginBottom: 16 }}
              >
                Your Trusted Partner for Homes, Investments, and Land Verification
              </h2>
              <div
                style={{
                  color: '#2c393e',
                  fontSize: 14,
                  lineHeight: 1.8,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16,
                }}
              >
                <p>
                  ALYORA is Kerala&apos;s leading real estate platform, dedicated to connecting buyers, sellers, and investors with premium properties across prime locations including Kochi, Kottayam, Trivandrum, Thrissur, and Kozhikode. Whether you are searching for modern luxury villas, waterfront residential plots, high-yield commercial spaces, or serene countryside homes, ALYORA provides verified listings backed by transparent property documentation.
                </p>
                <p>
                  Navigating property transactions in Kerala requires absolute clarity on land titles, encumbrance certificates, building permits, and zoning regulations. Our team of local real estate specialists ensures every property listed on ALYORA undergoes rigorous legal document verification before reaching our catalog. We provide end-to-end support—from initial search and virtual tours to price negotiations, legal consultation, and final registration.
                </p>
                <p>
                  For NRIs (Non-Resident Indians) looking to invest back home in Kerala, ALYORA delivers seamless property management, remote site inspection updates, and trusted advisory services. Explore our curated portfolio today to find a property where your life finds its true place.
                </p>
              </div>
            </article>

            {/* Frequently Asked Questions */}
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: 16,
                padding: '32px 40px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
              }}
            >
              <span
                style={{
                  color: '#3d4d53',
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: 2,
                }}
              >
                FREQUENTLY ASKED QUESTIONS
              </span>
              <h2
                className="serif"
                style={{ color: '#153545', fontSize: 28, marginTop: 8, marginBottom: 24 }}
              >
                Everything You Need to Know About Buying Property with ALYORA
              </h2>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: 24,
                }}
              >
                <div
                  style={{
                    backgroundColor: '#f7f9f9',
                    padding: 20,
                    borderRadius: 12,
                    border: '1px solid #e8edee',
                  }}
                >
                  <h3
                    style={{
                      color: '#153545',
                      fontSize: 16,
                      fontWeight: 600,
                      marginBottom: 8,
                    }}
                  >
                    How does ALYORA verify property listings?
                  </h3>
                  <p style={{ color: '#3d4d53', fontSize: 13, lineHeight: 1.6 }}>
                    Every listing on ALYORA is audited by legal experts. We verify title deeds, encumbrance certificates (EC), land tax receipts, and municipal approval plans to protect buyers against encumbrances or title disputes.
                  </p>
                </div>

                <div
                  style={{
                    backgroundColor: '#f7f9f9',
                    padding: 20,
                    borderRadius: 12,
                    border: '1px solid #e8edee',
                  }}
                >
                  <h3
                    style={{
                      color: '#153545',
                      fontSize: 16,
                      fontWeight: 600,
                      marginBottom: 8,
                    }}
                  >
                    Can NRIs buy property in Kerala through ALYORA?
                  </h3>
                  <p style={{ color: '#3d4d53', fontSize: 13, lineHeight: 1.6 }}>
                    Yes, NRIs can legally acquire residential and commercial properties in Kerala. ALYORA offers specialized NRI assistance including legal documentation, Power of Attorney guidance, and remote site video inspections.
                  </p>
                </div>

                <div
                  style={{
                    backgroundColor: '#f7f9f9',
                    padding: 20,
                    borderRadius: 12,
                    border: '1px solid #e8edee',
                  }}
                >
                  <h3
                    style={{
                      color: '#153545',
                      fontSize: 16,
                      fontWeight: 600,
                      marginBottom: 8,
                    }}
                  >
                    Which locations in Kerala have the highest property ROI?
                  </h3>
                  <p style={{ color: '#3d4d53', fontSize: 13, lineHeight: 1.6 }}>
                    Kochi (Edappally, Kakkanad, Marine Drive), Trivandrum (Technopark corridor), and growing hubs like Kottayam and Thrissur offer high capital appreciation and rental yield for residential villas and commercial plots.
                  </p>
                </div>

                <div
                  style={{
                    backgroundColor: '#f7f9f9',
                    padding: 20,
                    borderRadius: 12,
                    border: '1px solid #e8edee',
                  }}
                >
                  <h3
                    style={{
                      color: '#153545',
                      fontSize: 16,
                      fontWeight: 600,
                      marginBottom: 8,
                    }}
                  >
                    What documents are required to buy a house or plot in Kerala?
                  </h3>
                  <p style={{ color: '#3d4d53', fontSize: 13, lineHeight: 1.6 }}>
                    Essential documents include the Title Deed (Sale Deed), Possession Certificate, Encumbrance Certificate (minimum 15-30 years), Land Revenue Tax Receipt, and Building Location Sketch.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form Component */}
        <ContactSection />
      </main>

      <Footer />
    </div>
  );
}
