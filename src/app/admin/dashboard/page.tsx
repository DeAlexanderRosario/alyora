'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Home, MapPin, Mail, TrendingUp } from 'lucide-react';
import { AdminShell } from '@/components/AdminShell';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';

type Stats = { properties: number; locations: number; inquiries: number; featured: number };

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentInquiries, setRecentInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await api.getStats();
        setStats({
          properties: data.properties,
          locations: data.locations,
          inquiries: data.inquiries,
          featured: data.featured,
        });
        setRecentInquiries(data.recentInquiries ?? []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <AdminShell title="Dashboard">
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#103143' }}>Loading stats...</div>
      </AdminShell>
    );
  }

  const cards = [
    { label: 'Total Properties', value: stats?.properties ?? 0, icon: Home, color: '#3c70b8' },
    { label: 'Locations', value: stats?.locations ?? 0, icon: MapPin, color: '#4e9a53' },
    { label: 'Inquiries', value: stats?.inquiries ?? 0, icon: Mail, color: '#c0792b' },
    { label: 'Featured', value: stats?.featured ?? 0, icon: TrendingUp, color: '#9c7749' },
  ];

  return (
    <AdminShell title="Dashboard">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div style={{ color: '#6b7d83', fontSize: 14 }}>
          Welcome back{user?.email ? `, ${user.email}` : ''}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link
            href="/admin/properties"
            style={{
              backgroundColor: '#103143',
              color: '#ffffff',
              padding: '8px 16px',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            + Manage Properties
          </Link>
          <Link
            href="/admin/inquiries"
            style={{
              backgroundColor: '#3c70b8',
              color: '#ffffff',
              padding: '8px 16px',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            View Inquiries
          </Link>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20, marginBottom: 36 }}>
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: 12,
                padding: 24,
                boxShadow: '0 4px 16px rgba(21, 53, 69, 0.06)',
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  backgroundColor: card.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 14,
                }}
              >
                <Icon size={22} color="#ffffff" />
              </div>
              <div style={{ color: '#153545', fontSize: 32, fontWeight: 700 }}>{card.value}</div>
              <div style={{ color: '#6b7d83', fontSize: 13, marginTop: 4 }}>{card.label}</div>
            </div>
          );
        })}
      </div>

      <div style={{ backgroundColor: '#ffffff', borderRadius: 12, padding: 24, boxShadow: '0 4px 16px rgba(21, 53, 69, 0.04)' }}>
        <h3 style={{ color: '#153545', fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Recent Inquiries</h3>
        {recentInquiries.length === 0 ? (
          <div style={{ color: '#9ab4be', fontSize: 14 }}>No inquiries yet.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e8edee', textAlign: 'left', color: '#6b7d83' }}>
                <th style={{ padding: '12px 14px' }}>Name</th>
                <th style={{ padding: '12px 14px' }}>Email</th>
                <th style={{ padding: '12px 14px' }}>Property</th>
                <th style={{ padding: '12px 14px' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentInquiries.map((inq, i) => (
                <tr key={inq._id || inq.id} style={{ borderBottom: '1px solid #e8edee', backgroundColor: i % 2 === 0 ? '#f8fbfc' : '#ffffff' }}>
                  <td style={{ padding: '12px 14px', color: '#153545', fontWeight: 600 }}>{inq.name}</td>
                  <td style={{ padding: '12px 14px', color: '#6b7d83' }}>{inq.email}</td>
                  <td style={{ padding: '12px 14px', color: '#6b7d83' }}>{inq.property_name || '—'}</td>
                  <td style={{ padding: '12px 14px', color: '#9ab4be' }}>{new Date(inq.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminShell>
  );
}
