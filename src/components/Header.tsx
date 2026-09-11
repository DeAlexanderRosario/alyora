'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, Phone, Lock, ShieldCheck, Home } from 'lucide-react';
import { COMPANY_CONFIG } from '@/lib/env';

export function Header({ transparent = false }: { transparent?: boolean }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Properties', href: '/properties' },
    { label: 'Featured', href: '/properties?filter=featured' },
    { label: 'Contact', href: '/#contact' },
  ];

  const whatsappUrl = `https://wa.me/${COMPANY_CONFIG.whatsappNumber}?text=${encodeURIComponent('Hello ALYORA, I would like to inquire about properties.')}`;

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:p-4 focus:bg-[#153545] focus:text-white focus:outline-none focus:ring-2 focus:ring-[#cbbf9d]"
      >
        Skip to main content
      </a>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${transparent
          ? 'bg-[#103143]/90 text-white backdrop-blur-md border-b border-white/10'
          : 'bg-white/95 text-[#153545] backdrop-blur-md border-b border-[#e8edee] shadow-sm'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[74px] flex items-center justify-between">
          {/* LOGO BRAND */}
          <Link href="/" aria-label="ALYORA Real Estate Homepage" className="flex items-center gap-3 group">
                        <Image src="/favicon.png?v=2" alt="ALYORA" width={42} height={42} className="w-10 h-10 object-contain transition-transform duration-300 group-hover:scale-105" />

            <div className="flex flex-col">
              <span className="serif text-xl tracking-[0.2em] font-normal leading-tight">
                ALYORA
              </span>
              <span className={`text-[8px] uppercase tracking-[0.2em] ${transparent ? 'text-white/70' : 'text-[#657176]'}`}>
                Real Estate
              </span>
            </div>
          </Link>

          {/* DESKTOP NAV LINKS */}
          <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`text-sm font-medium transition-colors duration-200 ${isActive
                    ? 'text-[#cbbf9d] font-semibold'
                    : transparent
                      ? 'text-white/85 hover:text-white'
                      : 'text-[#657176] hover:text-[#153545]'
                    }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* DESKTOP ACTION BUTTONS */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white px-4 py-2 rounded-full text-xs font-semibold shadow transition-all hover:scale-[1.02]"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>

            <Link
              href="/admin/login"
              className="inline-flex items-center gap-1.5 bg-[#153545] hover:bg-[#1e4559] text-white px-3.5 py-2 rounded-full text-xs font-semibold transition-all border border-[#cbbf9d]/30 shadow-sm"
            >
              <Lock className="w-3.5 h-3.5 text-[#cbbf9d]" />
              <span>Admin</span>
            </Link>
          </div>

          {/* MOBILE MENU TOGGLE */}
          <div className="md:hidden flex items-center gap-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow"
              aria-label="WhatsApp"
            >
              <Phone className="w-4 h-4" />
            </a>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-lg ${transparent ? 'text-white hover:bg-white/10' : 'text-[#153545] hover:bg-gray-100'}`}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* MOBILE DRAWER */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#e8edee] bg-white text-[#153545] px-6 py-5 shadow-xl space-y-4 animate-in slide-in-from-top duration-200">
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-medium py-2 border-b border-gray-100 text-[#153545] hover:text-[#3c70b8]"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="pt-2 flex flex-col gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] text-white py-3 rounded-xl text-center text-sm font-semibold flex items-center justify-center gap-2 shadow"
              >
                <Phone className="w-4 h-4" /> Connect on WhatsApp
              </a>

              <Link
                href="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full bg-[#153545] text-white py-3 rounded-xl text-center text-sm font-semibold flex items-center justify-center gap-2 shadow"
              >
                <Lock className="w-4 h-4 text-[#cbbf9d]" /> Admin Portal
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
