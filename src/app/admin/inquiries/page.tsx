'use client';

import React, { useEffect, useState } from 'react';

export const dynamic = 'force-dynamic';
import { Trash2, X, Mail, Phone, MapPin, MessageSquare } from 'lucide-react';
import { AdminShell } from '@/components/AdminShell';
import { api, type Inquiry } from '@/lib/api';

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Inquiry | null>(null);

  useEffect(() => {
    loadInquiries();
  }, []);

  async function loadInquiries() {
    setLoading(true);
    try {
      const data = await api.getInquiries();
      setInquiries(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(i: Inquiry) {
    if (!confirm(`Delete inquiry from "${i.name}"?`)) return;
    await api.deleteInquiry(i._id || i.id);
    loadInquiries();
  }

  return (
    <AdminShell title="Inquiries">
      <div style={{ color: '#6b7d83', fontSize: 14, marginBottom: 20 }}>{inquiries.length} inquiries</div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#103143' }}>Loading inquiries...</div>
      ) : inquiries.length === 0 ? (
        <div style={{ color: '#9ab4be', fontSize: 14 }}>No inquiries yet. Visitor contact form submissions will appear here.</div>
      ) : (
        <div style={{ border: '1px solid #e8edee', borderRadius: 8, overflow: 'hidden', backgroundColor: '#ffffff' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ backgroundColor: '#f0f4f5', textAlign: 'left', color: '#6b7d83' }}>
                <th style={{ padding: '12px 14px' }}>Name</th>
                <th style={{ padding: '12px 14px' }}>Email</th>
                <th style={{ padding: '12px 14px' }}>Property</th>
                <th style={{ padding: '12px 14px' }}>Date</th>
                <th style={{ padding: '12px 14px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map((inq, i) => (
                <tr key={inq._id || inq.id} style={{ borderBottom: '1px solid #e8edee', backgroundColor: i % 2 === 0 ? '#f8fbfc' : '#ffffff' }}>
                  <td style={{ padding: '12px 14px', color: '#153545', fontWeight: 600 }}>{inq.name}</td>
                  <td style={{ padding: '12px 14px', color: '#6b7d83' }}>{inq.email}</td>
                  <td style={{ padding: '12px 14px', color: '#6b7d83' }}>{inq.property_name || '—'}</td>
                  <td style={{ padding: '12px 14px', color: '#9ab4be' }}>{new Date(inq.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                      <button
                        onClick={() => setSelected(inq)}
                        style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid #dde4e5', background: 'none', color: '#3c70b8', fontSize: 12, cursor: 'pointer' }}
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDelete(inq)}
                        style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid #f0d0d0', background: 'none', color: '#c0392b', cursor: 'pointer' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 className="serif" style={{ fontSize: 20, color: '#153545' }}>Inquiry Details</h3>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} color="#6b7d83" />
              </button>
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#153545', marginBottom: 16 }}>{selected.name}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#6b7d83', marginBottom: 8, fontSize: 14 }}>
              <Mail size={16} /> <span>{selected.email}</span>
            </div>
            {selected.phone && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#6b7d83', marginBottom: 8, fontSize: 14 }}>
                <Phone size={16} /> <span>{selected.phone}</span>
              </div>
            )}
            {selected.property_name && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#6b7d83', marginBottom: 8, fontSize: 14 }}>
                <MapPin size={16} /> <span>{selected.property_name}</span>
              </div>
            )}
            <div style={{ marginTop: 16, padding: 16, backgroundColor: '#f0f4f5', borderRadius: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#6b7d83', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
                <MessageSquare size={16} /> <span>Message</span>
              </div>
              <p style={{ color: '#153545', fontSize: 14, lineHeight: 1.6 }}>{selected.message || 'No message provided.'}</p>
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              {selected.email && (
                <a
                  href={`mailto:${selected.email}?subject=${encodeURIComponent(`Regarding inquiry for ${selected.property_name || 'ALYORA Property'}`)}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    backgroundColor: '#103143',
                    color: '#ffffff',
                    padding: '8px 14px',
                    borderRadius: 6,
                    fontSize: 12,
                    textDecoration: 'none',
                    fontWeight: 600,
                  }}
                >
                  <Mail size={14} /> Email Reply
                </a>
              )}
              {selected.phone && (
                <a
                  href={`https://wa.me/${selected.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi ${selected.name}, regarding your inquiry with ALYORA...`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    backgroundColor: '#25D366',
                    color: '#ffffff',
                    padding: '8px 14px',
                    borderRadius: 6,
                    fontSize: 12,
                    textDecoration: 'none',
                    fontWeight: 600,
                  }}
                >
                  <Phone size={14} /> WhatsApp Reply
                </a>
              )}
            </div>

            <div style={{ color: '#9ab4be', fontSize: 12, marginTop: 16 }}>
              Received: {new Date(selected.createdAt).toLocaleString()}
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
