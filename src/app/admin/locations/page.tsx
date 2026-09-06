'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Plus, Pencil, Trash2, X, Upload } from 'lucide-react';
import { AdminShell } from '@/components/AdminShell';
import { api, type Location, type MediaAsset } from '@/lib/api';

export default function AdminLocationsPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Location | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadLocations();
  }, []);

  async function loadLocations() {
    setLoading(true);
    try {
      const data = await api.getLocations();
      setLocations(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function openNew() {
    setEditing(null);
    setShowForm(true);
  }

  function openEdit(l: Location) {
    setEditing(l);
    setShowForm(true);
  }

  async function handleDelete(l: Location) {
    if (!confirm(`Delete location "${l.name}"?`)) return;
    await api.deleteLocation(l._id || l.id);
    loadLocations();
  }

  return (
    <AdminShell title="Locations">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div style={{ color: '#6b7d83', fontSize: 14 }}>{locations.length} locations</div>
        <button
          onClick={openNew}
          style={{
            backgroundColor: '#103143',
            color: '#ffffff',
            border: 'none',
            borderRadius: 8,
            padding: '10px 18px',
            fontSize: 14,
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            cursor: 'pointer',
          }}
        >
          <Plus size={16} />
          <span>Add Location</span>
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#103143' }}>Loading locations...</div>
      ) : locations.length === 0 ? (
        <div style={{ color: '#9ab4be', fontSize: 14 }}>No locations yet.</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 20 }}>
          {locations.map((l) => {
            const displayImg = l.image?.secure_url || l.image_url;
            return (
              <div key={l._id || l.id} style={{ backgroundColor: '#ffffff', borderRadius: 10, overflow: 'hidden', boxShadow: '0 4px 16px rgba(21, 53, 69, 0.06)' }}>
                <div style={{ height: 110 }}>
                  <img src={displayImg} alt={l.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ padding: 14 }}>
                  <div style={{ color: '#153545', fontSize: 15, fontWeight: 700 }}>{l.name}</div>
                  <div style={{ color: '#6b7d83', fontSize: 12, marginTop: 2 }}>{l.sub}</div>
                  <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                    <button
                      onClick={() => openEdit(l)}
                      style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 10px', borderRadius: 6, border: '1px solid #dde4e5', background: 'none', color: '#3c70b8', fontSize: 12, cursor: 'pointer' }}
                    >
                      <Pencil size={14} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(l)}
                      style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 10px', borderRadius: 6, border: '1px solid #f0d0d0', background: 'none', color: '#c0392b', fontSize: 12, cursor: 'pointer' }}
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showForm && (
        <LocationFormModal
          location={editing}
          onClose={() => setShowForm(false)}
          onSaved={() => {
            setShowForm(false);
            loadLocations();
          }}
        />
      )}
    </AdminShell>
  );
}

function LocationFormModal({ location, onClose, onSaved }: { location: Location | null; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({
    name: location?.name || '',
    sub: location?.sub || '',
    image_url: location?.image_url || '',
    image: location?.image || (null as MediaAsset | null),
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const asset = await api.uploadImage(file);
      setForm({ ...form, image: asset, image_url: asset.secure_url });
    } catch (err: any) {
      setError(err.message || 'Image upload failed');
    } finally {
      setUploading(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const imgUrl = form.image?.secure_url || form.image_url;
    if (!form.name || !imgUrl) {
      setError('Name and image are required.');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        image_url: imgUrl,
        image: form.image || { secure_url: imgUrl, public_id: 'manual' },
      };
      if (location) {
        await api.updateLocation(location._id || location.id, payload);
      } else {
        await api.createLocation(payload);
      }
      onSaved();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-backdrop">
      <div className="modal-box">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingBottom: 12, borderBottom: '1px solid #e8edee' }}>
          <h3 className="serif" style={{ fontSize: 20, color: '#153545' }}>
            {location ? 'Edit Location' : 'Add Location'}
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={20} color="#6b7d83" />
          </button>
        </div>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#6b7d83', display: 'block', marginBottom: 4 }}>Name</label>
            <input style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #dde4e5', fontSize: 14 }} placeholder="Kochi" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#6b7d83', display: 'block', marginBottom: 4 }}>Subtitle</label>
            <input style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #dde4e5', fontSize: 14 }} placeholder="Modern Living" value={form.sub} onChange={(e) => setForm({ ...form, sub: e.target.value })} />
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#6b7d83', display: 'block', marginBottom: 4 }}>Image</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                style={{ backgroundColor: '#2a6b8a', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 14px', fontSize: 12, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}
              >
                <Upload size={14} /> {uploading ? 'Uploading...' : 'Upload Image'}
              </button>
              {(form.image?.secure_url || form.image_url) && <span style={{ color: '#4e9a53', fontSize: 12 }}>✓ Image set</span>}
              <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
            </div>
            <input style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #dde4e5', fontSize: 14 }} placeholder="Or paste Image URL (https://...)" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
          </div>

          {error && <div style={{ color: '#c0392b', fontSize: 13 }}>{error}</div>}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
            <button type="button" onClick={onClose} style={{ padding: '10px 18px', borderRadius: 8, border: '1px solid #dde4e5', background: 'none', color: '#6b7d83', cursor: 'pointer' }}>
              Cancel
            </button>
            <button type="submit" disabled={saving} style={{ backgroundColor: '#103143', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 22px', fontWeight: 600, cursor: 'pointer' }}>
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
