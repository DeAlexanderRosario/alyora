'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  Bath,
  BedDouble,
  Building2,
  CheckCircle2,
  FileText,
  Heart,
  Home,
  Lock,
  Mail,
  Map,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  Ruler,
  Search,
  ShieldCheck,
  TrendingUp,
  Users,
  X,
} from 'lucide-react';
import { Brand } from '@/components/Brand';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { api, type Property, type Location } from '@/lib/api';
import { COMPANY_CONFIG } from '@/lib/env';
import heroImage from '../../assets/images/hero.png';

const HERO_IMAGE = heroImage.src;
const STORY_IMAGE = 'https://images.pexels.com/photos/27869349/pexels-photo-27869349.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';

const categories = [
  { icon: Home, title: 'Residential', sub: 'Homes' },
  { icon: Building2, title: 'Commercial', sub: 'Spaces' },
  { icon: Map, title: 'Plots & Land', sub: '' },
  { icon: TrendingUp, title: 'Investment', sub: 'Opportunities' },
  { icon: Users, title: 'Sell / List', sub: 'Your Property' },
  { icon: FileText, title: 'Property', sub: 'Documentation' },
  { icon: ShieldCheck, title: 'Expert', sub: 'Support' },
];

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);

  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactStatus, setContactStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [contactModalOpen, setContactModalOpen] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [p, l] = await Promise.all([api.getProperties(), api.getLocations()]);
        setProperties(p);
        setLocations(l);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function handleContact(e: React.FormEvent) {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) {
      setContactStatus('error');
      return;
    }
    setContactStatus('sending');
    try {
      await api.submitInquiry({
        name: contactName,
        email: contactEmail,
        phone: contactPhone,
        message: contactMessage,
      });
      setContactStatus('sent');
      setContactName('');
      setContactEmail('');
      setContactPhone('');
      setContactMessage('');
    } catch {
      setContactStatus('error');
    }
  }

  const navLinks = ['Home', 'Properties', 'Sell / List', 'Services', 'About', 'Contact'];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      <Header transparent />

      {/* Hero Section */}
      <div
        className="hero-section"
        style={{
          backgroundImage: `url(${HERO_IMAGE})`,
        }}
      >
        <div className="hero-overlay" />

        {/* Mobile Nav Menu Drawer */}
        {menuOpen && (
          <div
            style={{
              position: 'absolute',
              top: 80,
              right: 20,
              backgroundColor: '#ffffff',
              borderRadius: 12,
              padding: 20,
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
              zIndex: 100,
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
              minWidth: 180,
            }}
          >
            {navLinks.map((item) => (
              <span key={item} style={{ color: '#173646', fontSize: 14, cursor: 'pointer' }}>
                {item}
              </span>
            ))}
            <Link
              href="/admin/login"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                paddingTop: 10,
                borderTop: '1px solid #e8edee',
                color: '#173646',
                fontSize: 14,
              }}
            >
              <Lock size={14} />
              <span>Admin Login</span>
            </Link>
          </div>
        )}

        {/* Hero Content */}
        <div className="hero-content" style={{ marginTop: 60, marginBottom: 120 }}>
          <h1 className="serif" style={{ color: '#ffffff', fontSize: '3.2rem', lineHeight: 1.1, fontWeight: 400, maxWidth: 550 }}>
            More Than Properties.<br className="hidden sm:inline" /> A Better Tomorrow.
          </h1>
          <p style={{ color: '#ffffff', fontSize: 16, marginTop: 16, lineHeight: 1.5, opacity: 0.9 }}>
            Homes. Investments. Opportunities.<br />
            All in one trusted place.
          </p>
        </div>

        {/* Search Panel */}
        <div className="search-panel">
          <div className="search-tabs">
            {['Buy', 'Rent', 'Land', 'Commercial', 'Projects'].map((tab, idx) => (
              <button key={tab} className={`search-tab ${idx === 0 ? 'active' : ''}`}>
                {tab}
              </button>
            ))}
          </div>
          <div className="search-fields">
            <div className="field-box">
              <MapPin size={16} color="#122d3a" />
              <input placeholder="Enter location (e.g. Kochi, Kottayam...)" />
            </div>
            <div className="field-box">
              <select defaultValue="">
                <option value="" disabled>
                  Property Type
                </option>
                <option value="apartment">Apartment</option>
                <option value="villa">Villa</option>
                <option value="plot">Plot / Land</option>
              </select>
            </div>
            <div className="field-box">
              <select defaultValue="">
                <option value="" disabled>
                  Budget
                </option>
                <option value="50l">Under ₹ 50 Lakhs</option>
                <option value="1cr">₹ 50 L - ₹ 1.5 Cr</option>
                <option value="2cr">Above ₹ 1.5 Cr</option>
              </select>
            </div>
            <button className="btn-search">
              <Search size={16} />
              <span>Search</span>
            </button>
          </div>
        </div>
      </div>

      {/* Category Strip */}
      <div className="category-strip">
        <div className="category-content">
          {categories.map(({ icon: Icon, title, sub }) => (
            <div key={title} className="category-item">
              <Icon size={28} color="#143344" strokeWidth={1.5} />
              <span className="category-title">{title}</span>
              {sub && <span className="category-sub">{sub}</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Featured Properties */}
      <section className="section-wrap">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginBottom: 32 }}>
          <div>
            <span style={{ color: '#66777a', fontSize: 11, fontWeight: 700, letterSpacing: 2 }}>FEATURED PROPERTIES</span>
            <h2 className="serif" style={{ color: '#153545', fontSize: 32, marginTop: 4 }}>
              Handpicked for a Better Life
            </h2>
            <p style={{ color: '#657176', fontSize: 14, marginTop: 8 }}>
              Explore premium properties across Kerala. From serene homes to high-potential investments.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="cards-grid">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="property-card" style={{ height: 320, backgroundColor: '#f0f4f5', borderRadius: 16, animation: 'pulse 1.5s infinite' }} />
            ))}
          </div>
        ) : (
          <div className="cards-grid">
            {properties.map((p) => {
              const displayImg = p.image?.secure_url || p.image_url;
              const propertyId = p._id || p.id;
              const formattedName = (p.name || 'Property').replace(/\b\w/g, (c) => c.toUpperCase());
              const formattedLoc = (p.location || 'Kerala').replace(/\b\w/g, (c) => c.toUpperCase());
              const rawPrice = p.price || '';
              let formattedPrice = rawPrice.trim().replace(/lack/i, 'Lakh').replace(/lac/i, 'Lakh');
              if (formattedPrice && !formattedPrice.startsWith('₹') && !formattedPrice.toLowerCase().includes('lakh') && !formattedPrice.toLowerCase().includes('crore')) {
                formattedPrice = `₹ ${formattedPrice}`;
              } else if (formattedPrice && !formattedPrice.startsWith('₹')) {
                formattedPrice = `₹ ${formattedPrice}`;
              }

              return (
                <Link key={propertyId} href={`/properties/${propertyId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className="property-card">
                    <div className="property-img-wrap">
                      <img src={displayImg} alt={formattedName} className="property-img" />
                      {p.tag && (
                        <span className="property-tag" style={{ backgroundColor: p.tag_color || '#153545' }}>
                          {p.tag}
                        </span>
                      )}
                      <div style={{ position: 'absolute', top: 8, right: 8 }}>
                        <Heart size={16} color="#fff" />
                      </div>
                    </div>
                    <div className="property-body">
                      <div className="property-name">{formattedName}</div>
                      <div className="property-location">📍 {formattedLoc}</div>
                      <div className="property-price">{formattedPrice}</div>

                      {((p.beds && p.beds !== '-') || (p.baths && p.baths !== '-') || (p.area && p.area !== '-')) && (
                        <div className="spec-row">
                          {p.beds && p.beds !== '-' && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                              <BedDouble size={12} /> {p.beds}
                            </span>
                          )}
                          {p.baths && p.baths !== '-' && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                              <Bath size={12} /> {p.baths}
                            </span>
                          )}
                          {p.area && p.area !== '-' && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                              <Ruler size={12} /> {p.area}
                            </span>
                          )}
                        </div>
                      )}

                      {p.documents && p.documents.length > 0 && (
                        <div style={{ marginTop: 8, paddingTop: 6, borderTop: '1px solid #f0f4f5', display: 'flex', alignItems: 'center', gap: 4, color: '#2E7D32', fontSize: 10, fontWeight: 600 }}>
                          <FileText size={11} /> {p.documents.length} Verified Doc(s)
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* Story Section */}
      <section
        style={{
          position: 'relative',
          backgroundImage: `url(${STORY_IMAGE})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: '80px 5%',
          color: '#ffffff',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(6, 35, 40, 0.65)' }} />
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 1200, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 60, alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: 300 }}>
            <span style={{ color: '#d5ded7', fontSize: 11, fontWeight: 700, letterSpacing: 2 }}>WHY ALYORA</span>
            <h2 className="serif" style={{ fontSize: 36, marginTop: 8, lineHeight: 1.2 }}>
              Rooted in Kerala.<br />Focused on Your Future.
            </h2>
            <p style={{ color: '#edf2ef', fontSize: 14, lineHeight: 1.6, marginTop: 16 }}>
              We believe a property is more than just land or a building — it's a place where life happens. At Alyora, we bring trust, transparency and expertise to help you find the right property in the right place.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {[
              ['Local Expertise', 'Deep knowledge of Kerala'],
              ['Verified Listings', 'Genuine & trusted properties'],
              ['End-to-End Support', 'From search to registration'],
              ['People First', 'Your goals, our priority'],
            ].map(([title, sub]) => (
              <div key={title} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 38, height: 38, borderRadius: '50%', border: '1px solid #e3e9dd', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckCircle2 size={18} color="#fff" />
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{title}</div>
                  <div style={{ color: '#d1ddda', fontSize: 12 }}>{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Locations Explorer */}
      <section style={{ backgroundColor: '#f7f9f9', padding: '60px 5%' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 }}>
            <div>
              <span style={{ color: '#66777a', fontSize: 11, fontWeight: 700, letterSpacing: 2 }}>EXPLORE BY LOCATION</span>
              <h2 className="serif" style={{ color: '#153545', fontSize: 28, marginTop: 4 }}>
                Find Your Place in Kerala
              </h2>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
            {locations.map((loc) => {
              const displayImg = loc.image?.secure_url || loc.image_url;
              return (
                <div key={loc._id || loc.id} style={{ backgroundColor: '#fff', borderRadius: 8, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                  <img src={displayImg} alt={loc.name} style={{ width: '100%', height: 110, objectFit: 'cover' }} />
                  <div style={{ padding: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ color: '#173646', fontWeight: 700, fontSize: 14 }}>{loc.name}</div>
                      <div style={{ color: '#68767b', fontSize: 11 }}>{loc.sub}</div>
                    </div>
                    <ArrowUpRight size={16} color="#153545" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section-wrap" id="contact" style={{ display: 'flex', flexWrap: 'wrap', gap: 60 }}>
        <div style={{ flex: 1, minWidth: 300 }}>
          <span style={{ color: '#66777a', fontSize: 11, fontWeight: 700, letterSpacing: 2 }}>GET IN TOUCH</span>
          <h2 className="serif" style={{ color: '#153545', fontSize: 32, marginTop: 6, lineHeight: 1.2 }}>
            Let's Find Your<br />Perfect Property
          </h2>
          <p style={{ color: '#657176', fontSize: 14, lineHeight: 1.6, marginTop: 14 }}>
            Have a question or want to schedule a visit? Send us a message and our team will get back to you within 24 hours.
          </p>
          <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#153545' }}>
              <Phone size={18} /> <span>{COMPANY_CONFIG.phone}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#153545' }}>
              <Mail size={18} /> <span>{COMPANY_CONFIG.email}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#153545' }}>
              <MapPin size={18} /> <span>{COMPANY_CONFIG.address}</span>
            </div>
          </div>
        </div>

        <div className="sm:hidden mt-4" style={{ flex: 1, minWidth: 300 }}>
          <button
            onClick={() => setContactModalOpen(true)}
            style={{
              width: '100%',
              backgroundColor: '#153545',
              color: '#ffffff',
              border: 'none',
              padding: '14px 20px',
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              boxShadow: '0 4px 12px rgba(21,53,69,0.15)',
              cursor: 'pointer',
            }}
          >
            <Mail size={16} />
            <span>Send Message</span>
          </button>
        </div>

        {/* DESKTOP INLINE FORM */}
        <form onSubmit={handleContact} className="hidden sm:flex" style={{ flex: 1, minWidth: 300, flexDirection: 'column', gap: 14 }}>
          <input
            style={{ width: '100%', padding: '12px 16px', borderRadius: 8, border: '1px solid #dde4e5', fontSize: 14, outline: 'none' }}
            placeholder="Your Name"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
          />
          <input
            type="email"
            style={{ width: '100%', padding: '12px 16px', borderRadius: 8, border: '1px solid #dde4e5', fontSize: 14, outline: 'none' }}
            placeholder="Email Address"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
          />
          <input
            style={{ width: '100%', padding: '12px 16px', borderRadius: 8, border: '1px solid #dde4e5', fontSize: 14, outline: 'none' }}
            placeholder="Phone Number (optional)"
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
          />
          <textarea
            rows={4}
            style={{ width: '100%', padding: '12px 16px', borderRadius: 8, border: '1px solid #dde4e5', fontSize: 14, outline: 'none', resize: 'vertical' }}
            placeholder="Your Message"
            value={contactMessage}
            onChange={(e) => setContactMessage(e.target.value)}
          />

          {contactStatus === 'sent' && <div style={{ color: '#2e7d32', fontSize: 13 }}>Thank you! We'll get back to you soon.</div>}
          {contactStatus === 'error' && <div style={{ color: '#c0392b', fontSize: 13 }}>Please fill in your name, email, and message.</div>}

          <button
            type="submit"
            disabled={contactStatus === 'sending'}
            style={{
              backgroundColor: '#103143',
              color: '#ffffff',
              border: 'none',
              padding: '14px 32px',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              alignSelf: 'flex-start',
              cursor: 'pointer',
              opacity: contactStatus === 'sending' ? 0.7 : 1,
            }}
          >
            {contactStatus === 'sending' ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </section >

      {/* POPUP MODAL FOR MOBILE CONTACT FORM */}
      {
        contactModalOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 100, backgroundColor: 'rgba(0, 0, 0, 0.65)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
            <div style={{ backgroundColor: '#ffffff', borderRadius: 20, width: '100%', maxWidth: 440, padding: 24, boxShadow: '0 20px 40px rgba(0,0,0,0.3)', position: 'relative' }}>
              <button
                onClick={() => setContactModalOpen(false)}
                style={{ position: 'absolute', top: 16, right: 16, background: '#f0f4f5', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <X size={18} color="#153545" />
              </button>

              <div style={{ marginBottom: 16 }}>
                <span style={{ color: '#cbbf9d', fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase' }}>GET IN TOUCH</span>
                <h3 className="serif" style={{ color: '#153545', fontSize: 22, fontWeight: 700, marginTop: 2 }}>Send Us a Message</h3>
                <p style={{ color: '#657176', fontSize: 12, marginTop: 4 }}>We will get back to you within 24 hours.</p>
              </div>

              <form onSubmit={handleContact} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <input
                  style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid #dde4e5', fontSize: 13, outline: 'none' }}
                  placeholder="Your Name"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                />
                <input
                  type="email"
                  style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid #dde4e5', fontSize: 13, outline: 'none' }}
                  placeholder="Email Address"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                />
                <input
                  style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid #dde4e5', fontSize: 13, outline: 'none' }}
                  placeholder="Phone Number (optional)"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                />
                <textarea
                  rows={3}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid #dde4e5', fontSize: 13, outline: 'none', resize: 'none' }}
                  placeholder="Your Message"
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                />

                {contactStatus === 'sent' && (
                  <div style={{ color: '#2e7d32', fontSize: 12, fontWeight: 600, backgroundColor: '#E8F5E9', padding: '8px 12px', borderRadius: 8 }}>
                    Thank you! Message sent successfully.
                  </div>
                )}
                {contactStatus === 'error' && (
                  <div style={{ color: '#c0392b', fontSize: 12, fontWeight: 600, backgroundColor: '#FFEBEE', padding: '8px 12px', borderRadius: 8 }}>
                    Please fill in your name, email, and message.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={contactStatus === 'sending'}
                  style={{
                    backgroundColor: '#153545',
                    color: '#ffffff',
                    border: 'none',
                    padding: '12px 20px',
                    borderRadius: 10,
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: 'pointer',
                    marginTop: 4,
                    opacity: contactStatus === 'sending' ? 0.7 : 1,
                  }}
                >
                  {contactStatus === 'sending' ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        )
      }

      {/* FAQ & Real Estate Knowledge Section (SEO Article) */}
      <section style={{ backgroundColor: '#f0f4f5', padding: '60px 5%', borderTop: '1px solid #e8edee' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 40 }}>
          {/* SEO Rich Text Overview */}
          <article style={{ backgroundColor: '#ffffff', borderRadius: 16, padding: '32px 40px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
            <span style={{ color: '#66777a', fontSize: 11, fontWeight: 700, letterSpacing: 2 }}>REAL ESTATE IN KERALA</span>
            <h2 className="serif" style={{ color: '#153545', fontSize: 28, marginTop: 8, marginBottom: 16 }}>
              Your Trusted Partner for Homes, Investments, and Land Verification
            </h2>
            <div style={{ color: '#526268', fontSize: 14, lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: 16 }}>
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
          <div style={{ backgroundColor: '#ffffff', borderRadius: 16, padding: '32px 40px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
            <span style={{ color: '#66777a', fontSize: 11, fontWeight: 700, letterSpacing: 2 }}>FREQUENTLY ASKED QUESTIONS</span>
            <h2 className="serif" style={{ color: '#153545', fontSize: 28, marginTop: 8, marginBottom: 24 }}>
              Everything You Need to Know About Buying Property with ALYORA
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
              <div style={{ backgroundColor: '#f7f9f9', padding: 20, borderRadius: 12, border: '1px solid #e8edee' }}>
                <h3 style={{ color: '#153545', fontSize: 16, fontWeight: 600, marginBottom: 8 }}>
                  How does ALYORA verify property listings?
                </h3>
                <p style={{ color: '#657176', fontSize: 13, lineHeight: 1.6 }}>
                  Every listing on ALYORA is audited by legal experts. We verify title deeds, encumbrance certificates (EC), land tax receipts, and municipal approval plans to protect buyers against encumbrances or title disputes.
                </p>
              </div>

              <div style={{ backgroundColor: '#f7f9f9', padding: 20, borderRadius: 12, border: '1px solid #e8edee' }}>
                <h3 style={{ color: '#153545', fontSize: 16, fontWeight: 600, marginBottom: 8 }}>
                  Can NRIs buy property in Kerala through ALYORA?
                </h3>
                <p style={{ color: '#657176', fontSize: 13, lineHeight: 1.6 }}>
                  Yes, NRIs can legally acquire residential and commercial properties in Kerala. ALYORA offers specialized NRI assistance including legal documentation, Power of Attorney guidance, and remote site video inspections.
                </p>
              </div>

              <div style={{ backgroundColor: '#f7f9f9', padding: 20, borderRadius: 12, border: '1px solid #e8edee' }}>
                <h3 style={{ color: '#153545', fontSize: 16, fontWeight: 600, marginBottom: 8 }}>
                  Which locations in Kerala have the highest property ROI?
                </h3>
                <p style={{ color: '#657176', fontSize: 13, lineHeight: 1.6 }}>
                  Kochi (Edappally, Kakkanad, Marine Drive), Trivandrum (Technopark corridor), and growing hubs like Kottayam and Thrissur offer high capital appreciation and rental yield for residential villas and commercial plots.
                </p>
              </div>

              <div style={{ backgroundColor: '#f7f9f9', padding: 20, borderRadius: 12, border: '1px solid #e8edee' }}>
                <h3 style={{ color: '#153545', fontSize: 16, fontWeight: 600, marginBottom: 8 }}>
                  What documents are required to buy a house or plot in Kerala?
                </h3>
                <p style={{ color: '#657176', fontSize: 13, lineHeight: 1.6 }}>
                  Essential documents include the Title Deed (Sale Deed), Possession Certificate, Encumbrance Certificate (minimum 15-30 years), Land Revenue Tax Receipt, and Building Location Sketch.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div >
  );
}
