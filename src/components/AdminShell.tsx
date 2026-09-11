'use client';

import React, { ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Home, MapPin, Mail, LogOut, ExternalLink, ShieldCheck, Link2 } from 'lucide-react';
import { api } from '@/lib/api';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, route: '/admin/dashboard' },
  { label: 'Properties', icon: Home, route: '/admin/properties' },
  { label: 'Share Links', icon: Link2, route: '/admin/share-links' },
  { label: 'Locations', icon: MapPin, route: '/admin/locations' },
  { label: 'Inquiries', icon: Mail, route: '/admin/inquiries' },
  { label: 'Audit Logs', icon: ShieldCheck, route: '/admin/audit-logs' },
];

export function AdminShell({ children, title }: { children: ReactNode; title: string }) {
  const pathname = usePathname();
  const router = useRouter();

  function handleLogout() {
    api.logout();
    router.push('/admin/login');
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f0f4f5' }}>
      {/* Sidebar */}
      <aside
        style={{
          width: 240,
          backgroundColor: '#0e2d3d',
          padding: 24,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <Image src="/favicon.png?v=2" alt="ALYORA" width={52} height={52} style={{ objectFit: 'contain' }} />
          <div style={{ color: '#ffffff', fontSize: 22, letterSpacing: 3, fontWeight: 300 }}>ALYORA</div>
          <div style={{ color: '#5a7a88', fontSize: 11, marginTop: 2 }}>Admin Panel</div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 36 }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.route;
              return (
                <Link
                  key={item.label}
                  href={item.route}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '10px 14px',
                    borderRadius: 8,
                    backgroundColor: active ? '#173f54' : 'transparent',
                    color: active ? '#ffffff' : '#9ab4be',
                    fontSize: 14,
                    fontWeight: active ? 600 : 400,
                  }}
                >
                  <Icon size={18} color={active ? '#ffffff' : '#9ab4be'} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 'auto' }}>
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '10px 14px',
              borderRadius: 8,
              color: '#9ab4be',
              fontSize: 14,
            }}
          >
            <ExternalLink size={18} color="#9ab4be" />
            <span>View Site</span>
          </Link>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '10px 14px',
              borderRadius: 8,
              color: '#e07070',
              backgroundColor: 'transparent',
              border: 'none',
              fontSize: 14,
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <LogOut size={18} color="#e07070" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <header
          style={{
            height: 64,
            backgroundColor: '#ffffff',
            borderBottom: '1px solid #e8edee',
            display: 'flex',
            alignItems: 'center',
            padding: '0 32px',
          }}
        >
          <h1 className="serif" style={{ color: '#153545', fontSize: 22, fontWeight: 600 }}>
            {title}
          </h1>
        </header>
        <div style={{ flex: 1, padding: 32 }}>{children}</div>
      </main>
    </div>
  );
}
