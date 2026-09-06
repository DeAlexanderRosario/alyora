'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Plus, Pencil, Trash2, X, Star, Upload, FileText, Share2, Shield, Lock, Eye, ImagePlus } from 'lucide-react';
import { AdminShell } from '@/components/AdminShell';
import { api, type Property, type MediaAsset, type PropertyDocument } from '@/lib/api';
import { ShareLinkModal } from '@/components/ShareLinkModal';

const TAG_COLORS: Record<string, string> = {
  Featured: '#4e9a53',
  'For Sale': '#3c70b8',
  Land: '#9c7749',
  Rent: '#c0792b',
};

const VISIBILITY_OPTIONS = [
  { value: 'ADMIN_ONLY', label: 'Admin Only (Default)', color: '#c0392b' },
  { value: 'CUSTOMER_SHARED', label: 'Customer Link Only', color: '#c0792b' },
  { value: 'ALYORA_TEAM', label: 'ALYORA Team', color: '#9c7749' },
  { value: 'PUBLIC', label: 'Public Website', color: '#4e9a53' },
];

const PROPERTY_TYPES = ['Villa', 'Apartment', 'Land', 'House', 'Commercial', 'Plot', 'Penthouse', 'Farmhouse', 'Office', 'Shop'];

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Property | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Share link modal state
  const [shareModalProperty, setShareModalProperty] = useState<Property | null>(null);

  useEffect(() => {
    loadProperties();
  }, []);

  async function loadProperties() {
    setLoading(true);
    try {
      const data = await api.getProperties();
      setProperties(data);
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

  function openEdit(p: Property) {
    setEditing(p);
    setShowForm(true);
  }

  async function handleDelete(p: Property) {
    if (!confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
    await api.deleteProperty(p._id || p.id);
    loadProperties();
  }

  return (
    <AdminShell title="Properties">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div style={{ color: '#6b7d83', fontSize: 14 }}>{properties.length} properties portfolio</div>
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
          <span>Add Property</span>
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#103143' }}>Loading properties...</div>
      ) : properties.length === 0 ? (
        <div style={{ color: '#9ab4be', fontSize: 14 }}>No properties yet. Click "Add Property" to create one.</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
          {properties.map((p) => {
            const displayImg = p.image?.secure_url || p.image_url;
            return (
              <div
                key={p._id || p.id}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: 10,
                  overflow: 'hidden',
                  boxShadow: '0 4px 16px rgba(21, 53, 69, 0.06)',
                  border: '1px solid #e8edee',
                }}
              >
                <div style={{ position: 'relative', height: 160 }}>
                  <img src={displayImg} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <span
                    style={{
                      position: 'absolute',
                      top: 10,
                      left: 10,
                      backgroundColor: p.tag_color || '#3c70b8',
                      color: '#fff',
                      padding: '3px 8px',
                      borderRadius: 6,
                      fontSize: 11,
                    }}
                  >
                    {p.tag}
                  </span>
                  {p.featured && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        backgroundColor: '#c0a030',
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Star size={13} color="#fff" fill="#fff" />
                    </div>
                  )}
                  {/* Media count badge */}
                  {p.media && p.media.length > 0 && (
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 10,
                        right: 10,
                        backgroundColor: 'rgba(0,0,0,0.7)',
                        color: '#fff',
                        padding: '2px 8px',
                        borderRadius: 4,
                        fontSize: 11,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      <ImagePlus size={12} /> {p.media.length + 1} photos
                    </div>
                  )}
                </div>
                <div style={{ padding: 16 }}>
                  <div style={{ color: '#153545', fontSize: 15, fontWeight: 700 }}>{p.name}</div>
                  <div style={{ color: '#6b7d83', fontSize: 12, marginTop: 2 }}>{p.location}</div>
                  <div style={{ color: '#173646', fontSize: 16, fontWeight: 700, marginTop: 8 }}>{p.price}</div>
                  <div style={{ color: '#9ab4be', fontSize: 11, marginTop: 4 }}>
                    {[p.beds && `${p.beds} Beds`, p.baths && `${p.baths} Baths`, p.area].filter(Boolean).join(' · ')}
                    {p.propertyType && <span style={{ marginLeft: 6, color: '#3c70b8' }}>• {p.propertyType}</span>}
                  </div>

                  {p.documents && p.documents.length > 0 && (
                    <div style={{ marginTop: 8, fontSize: 11, color: '#103143', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <FileText size={12} /> {p.documents.length} document(s) attached
                    </div>
                  )}

                  {/* ACTION BUTTONS */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
                    <button
                      onClick={() => setShareModalProperty(p)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '6px 12px',
                        borderRadius: 6,
                        border: '1px solid #c0a030',
                        background: '#fffdf5',
                        color: '#a08020',
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: 'pointer',
                        flex: 1,
                        justifyContent: 'center',
                      }}
                    >
                      <Share2 size={13} /> Share Link
                    </button>

                    <button
                      onClick={() => openEdit(p)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '6px 12px',
                        borderRadius: 6,
                        border: '1px solid #dde4e5',
                        background: 'none',
                        color: '#3c70b8',
                        fontSize: 12,
                        cursor: 'pointer',
                      }}
                    >
                      <Pencil size={13} /> Edit
                    </button>

                    <button
                      onClick={() => handleDelete(p)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '6px 12px',
                        borderRadius: 6,
                        border: '1px solid #f0d0d0',
                        background: 'none',
                        color: '#c0392b',
                        fontSize: 12,
                        cursor: 'pointer',
                      }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showForm && (
        <PropertyFormModal
          property={editing}
          onClose={() => setShowForm(false)}
          onSaved={() => {
            setShowForm(false);
            loadProperties();
          }}
        />
      )}

      {shareModalProperty && (
        <ShareLinkModal
          isOpen={!!shareModalProperty}
          onClose={() => setShareModalProperty(null)}
          propertyId={shareModalProperty._id || shareModalProperty.id}
          propertyName={shareModalProperty.name}
          documents={shareModalProperty.documents}
          media={shareModalProperty.media}
        />
      )}
    </AdminShell>
  );
}

function PropertyFormModal({
  property,
  onClose,
  onSaved,
}: {
  property: Property | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({
    name: property?.name || '',
    location: property?.location || '',
    price: property?.price || '',
    negotiationPrice: property?.negotiationPrice || '',
    image_url: property?.image_url || '',
    image: property?.image || (null as MediaAsset | null),
    media: property?.media || ([] as MediaAsset[]),
    documents: property?.documents || ([] as PropertyDocument[]),
    tag: property?.tag || 'For Sale',
    tag_color: property?.tag_color || '#3c70b8',
    beds: property?.beds || '',
    baths: property?.baths || '',
    area: property?.area || '',
    plot: property?.plot || '',
    propertyType: property?.propertyType || '',
    description: property?.description || '',
    featured: property?.featured || false,
    status: property?.status || 'PUBLISHED',

    // Confidential Owner & Broker Info
    ownerName: property?.ownerDetails?.name || '',
    ownerPhone: property?.ownerDetails?.phone || '',
    ownerEmail: property?.ownerDetails?.email || '',
    ownerNotes: property?.ownerDetails?.notes || '',

    brokerName: property?.brokerDetails?.name || '',
    brokerPhone: property?.brokerDetails?.phone || '',
    brokerEmail: property?.brokerDetails?.email || '',
    brokerAgency: property?.brokerDetails?.agency || '',

    internalNotes: property?.internalNotes || '',
    commission: property?.commission || '',
    exactAddress: property?.exactAddress || '',
    gpsLat: property?.gpsCoordinates?.lat != null ? String(property.gpsCoordinates.lat) : '',
    gpsLng: property?.gpsCoordinates?.lng != null ? String(property.gpsCoordinates.lng) : '',

    amenities: property?.amenities?.join(', ') || '',
    specifications: property?.specifications || [],
  });

  const [docName, setDocName] = useState('');
  const [docUrl, setDocUrl] = useState('');
  const [docVisibility, setDocVisibility] = useState<string>('ADMIN_ONLY');

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);
  const mediaInputRef = useRef<HTMLInputElement>(null);

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

  async function handleMediaUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploadingMedia(true);
    try {
      const newMedia: MediaAsset[] = [];
      for (let i = 0; i < files.length; i++) {
        const asset = await api.uploadImage(files[i]);
        newMedia.push({
          ...asset,
          visibility: 'PUBLIC',
          type: 'photo',
          caption: '',
        });
      }
      setForm({ ...form, media: [...form.media, ...newMedia] });
    } catch (err: any) {
      setError(err.message || 'Media upload failed');
    } finally {
      setUploadingMedia(false);
    }
  }

  function handleRemoveMedia(index: number) {
    const updated = form.media.filter((_, i) => i !== index);
    setForm({ ...form, media: updated });
  }

  function handleUpdateMediaCaption(index: number, caption: string) {
    const updated = [...form.media];
    updated[index] = { ...updated[index], caption };
    setForm({ ...form, media: updated });
  }

  function handleUpdateMediaVisibility(index: number, visibility: string) {
    const updated = [...form.media];
    updated[index] = { ...updated[index], visibility: visibility as any };
    setForm({ ...form, media: updated });
  }

  function handleUpdateMediaType(index: number, type: string) {
    const updated = [...form.media];
    updated[index] = { ...updated[index], type: type as any };
    setForm({ ...form, media: updated });
  }

  async function handleDocumentUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingDoc(true);
    try {
      const asset = await api.uploadImage(file);
      const newDoc: PropertyDocument = {
        name: docName || file.name,
        url: asset.secure_url,
        public_id: asset.public_id,
        file_type: file.name.endsWith('.pdf') ? 'pdf' : 'doc',
        visibility: docVisibility as any,
      };
      setForm({ ...form, documents: [...form.documents, newDoc] });
      setDocName('');
      setDocUrl('');
    } catch (err: any) {
      setError(err.message || 'Document upload failed');
    } finally {
      setUploadingDoc(false);
    }
  }

  function handleAddManualDoc() {
    if (!docName || !docUrl) return;
    const newDoc: PropertyDocument = {
      name: docName,
      url: docUrl,
      public_id: 'manual',
      file_type: docUrl.endsWith('.pdf') ? 'pdf' : 'doc',
      visibility: docVisibility as any,
    };
    setForm({ ...form, documents: [...form.documents, newDoc] });
    setDocName('');
    setDocUrl('');
  }

  function handleUpdateDocVisibility(index: number, visibility: string) {
    const updated = [...form.documents];
    updated[index] = { ...updated[index], visibility: visibility as any };
    setForm({ ...form, documents: updated });
  }

  function handleRemoveDoc(index: number) {
    const updated = form.documents.filter((_, i) => i !== index);
    setForm({ ...form, documents: updated });
  }

  function handleAddSpec() {
    setForm({ ...form, specifications: [...form.specifications, { key: '', value: '' }] });
  }

  function handleUpdateSpec(index: number, field: 'key' | 'value', val: string) {
    const updated = [...form.specifications];
    updated[index] = { ...updated[index], [field]: val };
    setForm({ ...form, specifications: updated });
  }

  function handleRemoveSpec(index: number) {
    const updated = form.specifications.filter((_, i) => i !== index);
    setForm({ ...form, specifications: updated });
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const imgUrl = form.image?.secure_url || form.image_url;
    if (!form.name || !form.location || !form.price || !imgUrl) {
      setError('Name, location, price, and image are required.');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        location: form.location,
        price: form.price,
        negotiationPrice: form.negotiationPrice,
        image_url: imgUrl,
        image: form.image || { secure_url: imgUrl, public_id: 'manual' },
        media: form.media,
        documents: form.documents,
        tag: form.tag,
        tag_color: form.tag_color,
        beds: form.beds,
        baths: form.baths,
        area: form.area,
        plot: form.plot,
        propertyType: form.propertyType,
        description: form.description,
        featured: form.featured,
        status: form.status,
        ownerDetails: {
          name: form.ownerName,
          phone: form.ownerPhone,
          email: form.ownerEmail,
          notes: form.ownerNotes,
        },
        brokerDetails: {
          name: form.brokerName,
          phone: form.brokerPhone,
          email: form.brokerEmail,
          agency: form.brokerAgency,
        },
        internalNotes: form.internalNotes,
        commission: form.commission,
        exactAddress: form.exactAddress,
        gpsCoordinates: (form.gpsLat.trim() !== '' || form.gpsLng.trim() !== '') ? {
          lat: form.gpsLat ? parseFloat(form.gpsLat) : undefined,
          lng: form.gpsLng ? parseFloat(form.gpsLng) : undefined,
        } : undefined,
        amenities: form.amenities.split(',').map(s => s.trim()).filter(Boolean),
        specifications: form.specifications.filter(s => s.key.trim() !== ''),
      };

      if (property) {
        await api.updateProperty(property._id || property.id, payload);
      } else {
        await api.createProperty(payload);
      }
      onSaved();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  const inputStyle = { width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #dde4e5', fontSize: 14 };
  const labelStyle = { fontSize: 12, fontWeight: 600, color: '#6b7d83', display: 'block', marginBottom: 4 } as const;
  const smallLabelStyle = { fontSize: 11, color: '#6b7d83', display: 'block', marginBottom: 2 } as const;

  return (
    <div className="modal-backdrop">
      <div className="modal-box" style={{ maxWidth: 760, maxHeight: '90vh', overflowY: 'auto' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
            paddingBottom: 12,
            borderBottom: '1px solid #e8edee',
          }}
        >
          <h3 className="serif" style={{ fontSize: 20, color: '#153545' }}>
            {property ? 'Edit Property File' : 'Add New Property File'}
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={20} color="#6b7d83" />
          </button>
        </div>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Status Bar */}
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Publishing Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                style={inputStyle}
              >
                <option value="PUBLISHED">PUBLISHED (Live on Website)</option>
                <option value="DRAFT">DRAFT (Admin Only)</option>
                <option value="REVIEW">REVIEW (Internal Check)</option>
                <option value="SOLD">SOLD</option>
                <option value="ARCHIVED">ARCHIVED</option>
              </select>
            </div>

            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Negotiation Price (Confidential)</label>
              <input
                style={inputStyle}
                placeholder="Lowest price (Admin only)"
                value={form.negotiationPrice}
                onChange={(e) => setForm({ ...form, negotiationPrice: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Name</label>
            <input
              style={inputStyle}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          {/* Description / About (Public) */}
          <div>
            <label style={labelStyle}>Property Description (Shown on public page)</label>
            <textarea
              style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }}
              placeholder="A beautiful luxury villa with spacious interiors, green surroundings..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label style={labelStyle}>General Location</label>
              <input
                style={inputStyle}
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
            </div>
            <div>
              <label style={labelStyle}>Asking Price</label>
              <input
                style={inputStyle}
                placeholder="₹ 1.75 Cr"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Featured Main Image</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                style={{
                  backgroundColor: '#2a6b8a',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  padding: '8px 14px',
                  fontSize: 12,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  cursor: 'pointer',
                }}
              >
                <Upload size={14} /> {uploading ? 'Uploading...' : 'Upload Image'}
              </button>
              {(form.image?.secure_url || form.image_url) && <span style={{ color: '#4e9a53', fontSize: 12 }}>✓ Image set</span>}
              <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
            </div>
            <input
              style={inputStyle}
              placeholder="Or paste Image URL (https://...)"
              value={form.image_url}
              onChange={(e) => setForm({ ...form, image_url: e.target.value })}
            />
          </div>

          {/* ====== PHOTO GALLERY / MEDIA SECTION ====== */}
          <div style={{ border: '1px solid #d0e8f0', borderRadius: 8, padding: 14, backgroundColor: '#f0f8ff' }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: '#153545', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
              <ImagePlus size={16} /> Photo Gallery ({form.media.length} photos)
            </label>
            <p style={{ fontSize: 11, color: '#6b7d83', marginBottom: 10 }}>
              These photos appear in the property detail page gallery alongside the main cover image.
            </p>

            {form.media.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10, marginBottom: 12 }}>
                {form.media.map((m, idx) => (
                  <div key={idx} style={{ position: 'relative', borderRadius: 8, overflow: 'hidden', border: '1px solid #dde4e5', backgroundColor: '#fff', display: 'flex', flexDirection: 'column' }}>
                    <img src={m.secure_url} alt={m.caption || `Photo ${idx + 1}`} style={{ width: '100%', height: 90, objectFit: 'cover' }} />
                    <div style={{ padding: '6px 8px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <input
                        style={{ width: '100%', border: '1px solid #e8edee', borderRadius: 4, padding: '3px 6px', fontSize: 10, color: '#153545' }}
                        placeholder="Caption..."
                        value={m.caption || ''}
                        onChange={(e) => handleUpdateMediaCaption(idx, e.target.value)}
                      />
                      <div style={{ display: 'flex', gap: 4 }}>
                        <select
                          value={m.type || 'photo'}
                          onChange={(e) => handleUpdateMediaType(idx, e.target.value)}
                          style={{ flex: 1, fontSize: 10, padding: '2px 4px', borderRadius: 4, border: '1px solid #dde4e5' }}
                        >
                          <option value="photo">Photo</option>
                          <option value="video">Video</option>
                          <option value="floorplan">Floorplan</option>
                        </select>
                        <select
                          value={m.visibility || 'PUBLIC'}
                          onChange={(e) => handleUpdateMediaVisibility(idx, e.target.value)}
                          style={{ flex: 1, fontSize: 10, padding: '2px 4px', borderRadius: 4, border: '1px solid #dde4e5' }}
                        >
                          {VISIBILITY_OPTIONS.map((v) => (
                            <option key={v.value} value={v.value}>
                              {v.label.split(' ')[0]}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveMedia(idx)}
                      style={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        backgroundColor: 'rgba(192,57,43,0.85)',
                        color: '#fff',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 12,
                      }}
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => mediaInputRef.current?.click()}
                style={{
                  backgroundColor: '#103143',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  padding: '8px 14px',
                  fontSize: 12,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  cursor: 'pointer',
                }}
              >
                <Upload size={14} /> {uploadingMedia ? 'Uploading Photos...' : 'Upload Gallery Media'}
              </button>
              <span style={{ fontSize: 11, color: '#9ab4be' }}>You can select multiple files</span>
              <input ref={mediaInputRef} type="file" accept="image/*,video/*" multiple style={{ display: 'none' }} onChange={handleMediaUpload} />
            </div>
          </div>

          {/* CONFIDENTIAL & PRIVATE FIELDS SECTION */}
          <div style={{ border: '1px solid #f0d0d0', borderRadius: 8, padding: 14, backgroundColor: '#fffdfd' }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: '#c0392b', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
              <Lock size={14} /> Confidential & Private Owner / Broker Details (NEVER Public)
            </label>

            {/* Owner Section */}
            <div style={{ fontWeight: 600, fontSize: 12, color: '#153545', marginBottom: 6 }}>Owner Information</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 10 }}>
              <div>
                <label style={smallLabelStyle}>Owner Name</label>
                <input
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #dde4e5', fontSize: 13 }}
                  placeholder="Full Name"
                  value={form.ownerName}
                  onChange={(e) => setForm({ ...form, ownerName: e.target.value })}
                />
              </div>
              <div>
                <label style={smallLabelStyle}>Owner Phone</label>
                <input
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #dde4e5', fontSize: 13 }}
                  placeholder="+91..."
                  value={form.ownerPhone}
                  onChange={(e) => setForm({ ...form, ownerPhone: e.target.value })}
                />
              </div>
              <div>
                <label style={smallLabelStyle}>Owner Email</label>
                <input
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #dde4e5', fontSize: 13 }}
                  placeholder="owner@example.com"
                  value={form.ownerEmail}
                  onChange={(e) => setForm({ ...form, ownerEmail: e.target.value })}
                />
              </div>
            </div>

            <div style={{ marginBottom: 10 }}>
              <label style={smallLabelStyle}>Owner Private Notes</label>
              <input
                style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #dde4e5', fontSize: 13 }}
                placeholder="Key handover, meeting preferences..."
                value={form.ownerNotes}
                onChange={(e) => setForm({ ...form, ownerNotes: e.target.value })}
              />
            </div>

            {/* Broker Section */}
            <div style={{ fontWeight: 600, fontSize: 12, color: '#153545', marginBottom: 6, marginTop: 12, paddingTop: 10, borderTop: '1px dashed #f0d0d0' }}>
              Broker / Agency Details
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 10, marginBottom: 10 }}>
              <div>
                <label style={smallLabelStyle}>Broker Name</label>
                <input
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #dde4e5', fontSize: 13 }}
                  placeholder="Broker Name"
                  value={form.brokerName}
                  onChange={(e) => setForm({ ...form, brokerName: e.target.value })}
                />
              </div>
              <div>
                <label style={smallLabelStyle}>Broker Phone</label>
                <input
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #dde4e5', fontSize: 13 }}
                  placeholder="Phone"
                  value={form.brokerPhone}
                  onChange={(e) => setForm({ ...form, brokerPhone: e.target.value })}
                />
              </div>
              <div>
                <label style={smallLabelStyle}>Broker Email</label>
                <input
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #dde4e5', fontSize: 13 }}
                  placeholder="Email"
                  value={form.brokerEmail}
                  onChange={(e) => setForm({ ...form, brokerEmail: e.target.value })}
                />
              </div>
              <div>
                <label style={smallLabelStyle}>Agency</label>
                <input
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #dde4e5', fontSize: 13 }}
                  placeholder="Agency Name"
                  value={form.brokerAgency}
                  onChange={(e) => setForm({ ...form, brokerAgency: e.target.value })}
                />
              </div>
            </div>

            {/* Financial & Location Section */}
            <div style={{ fontWeight: 600, fontSize: 12, color: '#153545', marginBottom: 6, marginTop: 12, paddingTop: 10, borderTop: '1px dashed #f0d0d0' }}>
              Commission & Exact Location
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 10, marginBottom: 10 }}>
              <div>
                <label style={smallLabelStyle}>Commission Fee %</label>
                <input
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #dde4e5', fontSize: 13 }}
                  placeholder="e.g. 2%"
                  value={form.commission}
                  onChange={(e) => setForm({ ...form, commission: e.target.value })}
                />
              </div>
              <div>
                <label style={smallLabelStyle}>Exact Street Address / Survey No</label>
                <input
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #dde4e5', fontSize: 13 }}
                  placeholder="Door No, Plot No, Street Name..."
                  value={form.exactAddress}
                  onChange={(e) => setForm({ ...form, exactAddress: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', gap: 10 }}>
              <div>
                <label style={smallLabelStyle}>GPS Latitude</label>
                <input
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #dde4e5', fontSize: 13 }}
                  placeholder="e.g. 9.9312"
                  value={form.gpsLat}
                  onChange={(e) => setForm({ ...form, gpsLat: e.target.value })}
                />
              </div>
              <div>
                <label style={smallLabelStyle}>GPS Longitude</label>
                <input
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #dde4e5', fontSize: 13 }}
                  placeholder="e.g. 76.2673"
                  value={form.gpsLng}
                  onChange={(e) => setForm({ ...form, gpsLng: e.target.value })}
                />
              </div>
              <div>
                <label style={smallLabelStyle}>Internal Admin Notes</label>
                <input
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #dde4e5', fontSize: 13 }}
                  placeholder="Private deal notes, internal comments..."
                  value={form.internalNotes}
                  onChange={(e) => setForm({ ...form, internalNotes: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* PDF Documents & File Visibility Section */}
          <div style={{ border: '1px solid #e8edee', borderRadius: 8, padding: 14, backgroundColor: '#f8fbfc' }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: '#153545', display: 'block', marginBottom: 6 }}>
              Attached PDF & Documents ({form.documents.length})
            </label>

            {form.documents.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
                {form.documents.map((doc, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: '#ffffff',
                      padding: '8px 12px',
                      borderRadius: 6,
                      border: '1px solid #dde4e5',
                      gap: 8,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, flex: 1, overflow: 'hidden' }}>
                      <FileText size={16} color="#103143" />
                      <span style={{ fontWeight: 600, color: '#153545', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {doc.name}
                      </span>
                    </div>

                    <select
                      value={doc.visibility || 'ADMIN_ONLY'}
                      onChange={(e) => handleUpdateDocVisibility(idx, e.target.value)}
                      style={{ fontSize: 11, padding: '4px 8px', borderRadius: 4, border: '1px solid #dde4e5' }}
                    >
                      {VISIBILITY_OPTIONS.map((v) => (
                        <option key={v.value} value={v.value}>
                          {v.label}
                        </option>
                      ))}
                    </select>

                    <button type="button" onClick={() => handleRemoveDoc(idx)} style={{ border: 'none', background: 'none', color: '#c0392b', cursor: 'pointer' }}>
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <input
                style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #dde4e5', fontSize: 13 }}
                placeholder="Document Title (e.g. Title Deed PDF, Building Permit)"
                value={docName}
                onChange={(e) => setDocName(e.target.value)}
              />

              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <select
                  value={docVisibility}
                  onChange={(e) => setDocVisibility(e.target.value)}
                  style={{ padding: '8px 10px', borderRadius: 6, border: '1px solid #dde4e5', fontSize: 12 }}
                >
                  {VISIBILITY_OPTIONS.map((v) => (
                    <option key={v.value} value={v.value}>
                      {v.label}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => docInputRef.current?.click()}
                  style={{
                    backgroundColor: '#103143',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 6,
                    padding: '8px 14px',
                    fontSize: 12,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    cursor: 'pointer',
                  }}
                >
                  <Upload size={14} /> {uploadingDoc ? 'Uploading...' : 'Upload PDF'}
                </button>
                <input ref={docInputRef} type="file" accept=".pdf,.doc,.docx,image/*" style={{ display: 'none' }} onChange={handleDocumentUpload} />

                <input
                  style={{ flex: 1, padding: '8px 12px', borderRadius: 6, border: '1px solid #dde4e5', fontSize: 13 }}
                  placeholder="Or File URL"
                  value={docUrl}
                  onChange={(e) => setDocUrl(e.target.value)}
                />
                <button type="button" onClick={handleAddManualDoc} style={{ backgroundColor: '#3c70b8', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 14px', fontSize: 12, cursor: 'pointer' }}>
                  Add Doc
                </button>
              </div>
            </div>
          </div>

          {/* Property Details Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            <div>
              <label style={labelStyle}>Beds</label>
              <input style={inputStyle} placeholder="4 Beds" value={form.beds} onChange={(e) => setForm({ ...form, beds: e.target.value })} />
            </div>
            <div>
              <label style={labelStyle}>Baths</label>
              <input style={inputStyle} placeholder="4 Baths" value={form.baths} onChange={(e) => setForm({ ...form, baths: e.target.value })} />
            </div>
            <div>
              <label style={labelStyle}>Built-up Area</label>
              <input style={inputStyle} placeholder="3,200 Sq.Ft" value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label style={labelStyle}>Plot Area</label>
              <input style={inputStyle} placeholder="7.5 Cents / 10 Cents" value={form.plot} onChange={(e) => setForm({ ...form, plot: e.target.value })} />
            </div>
            <div>
              <label style={labelStyle}>Property Type</label>
              <select
                style={inputStyle}
                value={form.propertyType}
                onChange={(e) => setForm({ ...form, propertyType: e.target.value })}
              >
                <option value="">Select Type</option>
                {PROPERTY_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          {/* AMENITIES & SPECIFICATIONS */}
          <div style={{ border: '1px solid #d0e8f0', borderRadius: 8, padding: 14, backgroundColor: '#f0f8ff' }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: '#153545', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
              Amenities & Specifications
            </label>
            <div style={{ marginBottom: 12 }}>
              <label style={smallLabelStyle}>Amenities (Comma Separated)</label>
              <input
                style={inputStyle}
                placeholder="Pool, Gym, Elevator, Parking..."
                value={form.amenities}
                onChange={(e) => setForm({ ...form, amenities: e.target.value })}
              />
            </div>

            <div>
              <label style={smallLabelStyle}>Technical Specifications</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 8 }}>
                {form.specifications.map((spec, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: 6 }}>
                    <input
                      style={{ ...inputStyle, flex: 1, padding: '6px 10px' }}
                      placeholder="e.g. Flooring"
                      value={spec.key}
                      onChange={(e) => handleUpdateSpec(idx, 'key', e.target.value)}
                    />
                    <input
                      style={{ ...inputStyle, flex: 1, padding: '6px 10px' }}
                      placeholder="e.g. Vitrified Tiles"
                      value={spec.value}
                      onChange={(e) => handleUpdateSpec(idx, 'value', e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveSpec(idx)}
                      style={{ background: 'none', border: '1px solid #f0d0d0', borderRadius: 6, color: '#c0392b', padding: '0 10px', cursor: 'pointer' }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={handleAddSpec}
                style={{
                  backgroundColor: '#3c70b8',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  padding: '6px 12px',
                  fontSize: 11,
                  cursor: 'pointer',
                }}
              >
                + Add Specification Variable
              </button>
            </div>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', marginTop: 4 }}>
            <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
            <span style={{ fontSize: 14, color: '#153545' }}>Featured property</span>
          </label>

          {error && <div style={{ color: '#c0392b', fontSize: 13 }}>{error}</div>}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
            <button type="button" onClick={onClose} style={{ padding: '10px 18px', borderRadius: 8, border: '1px solid #dde4e5', background: 'none', color: '#6b7d83', cursor: 'pointer' }}>
              Cancel
            </button>
            <button type="submit" disabled={saving} style={{ backgroundColor: '#103143', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 22px', fontWeight: 600, cursor: 'pointer' }}>
              {saving ? 'Saving Property...' : 'Save Property'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
