'use client';

import React from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, MessageCircle, Instagram, Facebook, Youtube, Linkedin, ArrowUpRight } from 'lucide-react';
import { COMPANY_CONFIG } from '@/lib/env';

export function Footer() {
  const whatsappUrl = `https://wa.me/${COMPANY_CONFIG.whatsappNumber}?text=${encodeURIComponent('Hello ALYORA, I would like to learn more about your properties.')}`;

  return (
    <footer className="bg-[#102f3f] text-[#d7e0df] pt-8 md:pt-14 pb-6 md:pb-8 text-sm">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-10 pb-6 md:pb-12 border-b border-white/10">
          {/* BRAND COLUMN */}
          <div className="md:col-span-1 flex flex-col items-center md:items-start text-center md:text-left space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-[#cbbf9d] bg-[#153545] flex items-center justify-center">
                <span className="serif text-xl font-bold text-[#cbbf9d]">A</span>
              </div>
              <div className="flex flex-col text-left">
                <span className="serif text-xl tracking-[0.2em] font-normal text-white">ALYORA</span>
                <span className="text-[8px] uppercase tracking-[0.2em] text-[#b8ced6]">Where Life Finds Its Place.</span>
              </div>
            </Link>

            <p className="text-xs text-[#b8ced6] leading-relaxed hidden md:block">
              {COMPANY_CONFIG.name} is your trusted real-estate partner in Kerala, connecting people with better homes, smarter investments, and transparent documentation.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a href={whatsappUrl} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[#25D366] transition">
                <MessageCircle className="w-4 h-4" />
              </a>
              <a href="#" aria-label="Instagram" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[#cbbf9d] hover:text-[#102f3f] transition">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" aria-label="Facebook" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[#cbbf9d] hover:text-[#102f3f] transition">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" aria-label="LinkedIn" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[#cbbf9d] hover:text-[#102f3f] transition">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* QUICK LINKS */}
          <div className="hidden md:block">
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 border-b border-white/10 pb-2">Navigation</h4>
            <nav aria-label="Footer Navigation">
              <ul className="space-y-2.5 text-xs text-[#b8ced6]">
                <li><Link href="/" className="hover:text-white transition">Home</Link></li>
                <li><Link href="/properties" className="hover:text-white transition">Property Catalog</Link></li>
                <li><Link href="/properties?filter=featured" className="hover:text-white transition">Featured Listing</Link></li>
                <li><Link href="/#contact" className="hover:text-white transition">Contact Us</Link></li>
                <li><Link href="/admin/login" className="hover:text-[#cbbf9d] transition">Admin Portal</Link></li>
              </ul>
            </nav>
          </div>

          {/* FEATURED PROPERTY */}
          <div className="hidden md:block">
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 border-b border-white/10 pb-2">Featured Property</h4>
            <Link href="/properties" className="group block">
              <div className="relative overflow-hidden rounded bg-white/5 mb-2.5">
                <img
                  src="https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=300"
                  alt="Serene Lakeview Villa in Kochi Kerala - ALYORA Featured Real Estate Property"
                  width={300}
                  height={80}
                  loading="lazy"
                  className="w-full h-20 object-cover transition duration-500 group-hover:scale-110"
                />
                <div className="absolute top-1.5 right-1.5 bg-[#cbbf9d] text-[#102f3f] text-[9px] font-bold px-1.5 py-0.5 rounded-sm">FOR SALE</div>
              </div>
              <p className="text-[13px] text-white font-medium group-hover:text-[#cbbf9d] transition-colors line-clamp-1">Serene Lakeview Villa</p>
              <div className="flex items-center gap-1.5 mt-1 text-[11px] text-[#b8ced6]">
                <span>Kochi, Kerala</span>
                <span className="w-1 h-1 rounded-full bg-white/20"></span>
                <span className="font-semibold text-white">₹ 1.5 Cr</span>
              </div>
            </Link>
          </div>

          {/* CONTACT INFO */}
          <div className="hidden md:block">
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 border-b border-white/10 pb-2">Get in Touch</h4>
            <div className="space-y-3 text-xs text-[#b8ced6]">
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#cbbf9d] shrink-0 mt-0.5" />
                <span>{COMPANY_CONFIG.phone}</span>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#cbbf9d] shrink-0 mt-0.5" />
                <span>{COMPANY_CONFIG.email}</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#cbbf9d] shrink-0 mt-0.5" />
                <span>{COMPANY_CONFIG.address}</span>
              </div>
            </div>
          </div>
        </div>

        {/* COPYRIGHT */}
        <div className="pt-6 md:pt-8 text-center text-xs text-[#a5c1cd] flex flex-col sm:flex-row items-center justify-between gap-2 md:gap-3">
          <div>© {new Date().getFullYear()} {COMPANY_CONFIG.name}. All rights reserved.</div>
          <div className="text-[10px] md:text-[11px] text-[#b8ced6]">Where Life Finds Its Place.</div>
        </div>
      </div>
    </footer>
  );
}
