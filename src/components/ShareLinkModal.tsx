'use client';

import React, { useState } from 'react';
import {
  X,
  Share2,
  Lock,
  Check,
  Copy,
  Calendar,
  ShieldCheck,
  FileText,
  User,
  Phone,
  Mail,
  ExternalLink,
} from 'lucide-react';
import { IPropertyDocument, IMediaAsset } from '@/models/Property';
import { api } from '@/lib/api';

interface ShareLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId: string;
  propertyName: string;
  documents?: any[];
  media?: any[];
}

export function ShareLinkModal({
  isOpen,
  onClose,
  propertyId,
  propertyName,
  documents = [],
  media = [],
}: ShareLinkModalProps) {
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [salespersonId, setSalespersonId] = useState('');
  const [passcode, setPasscode] = useState('');
  const [expiresInDays, setExpiresInDays] = useState<number | undefined>(7);

  // Granular permissions - all true by default, showExactLocation false for privacy
  const [permissions, setPermissions] = useState({
    showBasicDetails: true,
    showFullDescription: true,
    showAdditionalPhotos: true,
    showVideos: true,
    showFloorPlans: true,
    showPublicDocuments: true,
    showPrice: true,
    showExactLocation: false,
    showAmenities: true,
    showSpecifications: true,
    showOwnerDetails: true,   // Owner phone, name, broker info
  });

  // Allowed document & media selection
  const [selectedDocIds, setSelectedDocIds] = useState<string[]>([]);
  const [selectedMediaIds, setSelectedMediaIds] = useState<string[]>([]);

  // Generated Link Result
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const togglePermission = (key: keyof typeof permissions) => {
    setPermissions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Permission config — label, description, key, sensitive flag
  const PERMISSION_ROWS: { key: keyof typeof permissions; label: string; desc: string; sensitive?: boolean }[] = [
    { key: 'showPrice', label: 'Asking Price', desc: 'Show the listed price' },
    { key: 'showFullDescription', label: 'Full Description', desc: 'Show the property description' },
    { key: 'showBasicDetails', label: 'Basic Details', desc: 'Beds, baths, area, property type' },
    { key: 'showAmenities', label: 'Amenities', desc: 'Pool, parking, gym, etc.' },
    { key: 'showSpecifications', label: 'Specifications', desc: 'Technical specs list' },
    { key: 'showAdditionalPhotos', label: 'Gallery Photos', desc: 'All uploaded photo gallery' },
    { key: 'showVideos', label: 'Videos', desc: 'Video walkthroughs' },
    { key: 'showFloorPlans', label: 'Floor Plans', desc: 'Floor plan images' },
    { key: 'showPublicDocuments', label: 'Documents', desc: 'Attached PDFs & files' },
    { key: 'showExactLocation', label: 'Exact Address / GPS', desc: 'Street address & map pin', sensitive: true },
    { key: 'showOwnerDetails', label: 'Owner & Broker Info', desc: 'Owner phone, name & broker contact', sensitive: true },
  ];

  const toggleDocSelection = (docId: string) => {
    setSelectedDocIds((prev) =>
      prev.includes(docId) ? prev.filter((id) => id !== docId) : [...prev, docId]
    );
  };

  const toggleMediaSelection = (mediaId: string) => {
    setSelectedMediaIds((prev) =>
      prev.includes(mediaId) ? prev.filter((id) => id !== mediaId) : [...prev, mediaId]
    );
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setGeneratedUrl(null);

    try {
      const token = api.getToken();
      const res = await fetch('/api/shared/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          propertyId,
          leadName,
          leadPhone,
          leadEmail,
          salespersonId,
          passcode,
          expiresInDays,
          permissions,
          allowedDocumentIds: selectedDocIds,
          allowedMediaIds: selectedMediaIds,
        }),
      });

      const data = await res.json();
      if (res.ok && data.shareUrl) {
        setGeneratedUrl(data.shareUrl);
      } else {
        alert(data.error || 'Failed to generate share link');
      }
    } catch (err) {
      console.error('Error creating share link:', err);
      alert('Error creating share link');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (generatedUrl) {
      navigator.clipboard.writeText(generatedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-4">
      <div className="w-full max-w-lg bg-[#0F1523] border border-gray-800/60 rounded-t-3xl sm:rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh] sm:max-h-[85vh] animate-in slide-in-from-bottom-8 sm:slide-in-from-bottom-2 duration-300">
        {/* MODAL HEADER */}
        <div className="bg-[#151D2E] px-5 py-4 border-b border-gray-800/80 flex items-center justify-between sticky top-0 z-10 w-full pt-6 sm:pt-4">
          <div className="flex flex-col">
            <h3 className="font-bold text-white text-[15px] flex items-center gap-2">
              <Share2 className="w-4 h-4 text-[#cbbf9d]" /> Share presentation
            </h3>
            <p className="text-[11px] text-gray-400 truncate max-w-[200px] mt-0.5">{propertyName}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800/50 text-gray-400 hover:text-white transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-5 flex-grow text-gray-200 hide-scrollbar pb-24 sm:pb-5">
          {generatedUrl ? (
            /* SUCCESS STATE */
            <div className="space-y-5">
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 text-center space-y-2">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto text-emerald-400 mb-3">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-white">Link Generated</h4>
                <p className="text-xs text-gray-300">
                  Ready to share with <strong className="text-[#cbbf9d]">{leadName || 'customer'}</strong>.
                </p>
              </div>

              <div className="space-y-2 text-center">
                <div className="flex items-center gap-2 bg-[#1B263B] border border-gray-800 p-1.5 rounded-xl">
                  <input type="text" readOnly value={generatedUrl} className="bg-transparent text-xs text-gray-300 w-full px-3 focus:outline-none font-mono" />
                  <button onClick={handleCopy} className="bg-[#3c70b8] hover:bg-[#325ea0] text-white px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition">
                    {copied ? <><Check className="w-3.5 h-3.5" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2.5 pt-2">
                <a href={`https://wa.me/?text=${encodeURIComponent(`Hello ${leadName || ''}, here is the private presentation for property "${propertyName}" prepared for you: ${generatedUrl}`)}`} target="_blank" rel="noopener noreferrer" className="w-full bg-[#25D366] text-white font-semibold py-3.5 rounded-xl text-center text-sm flex items-center justify-center gap-2 shadow-lg">
                  <Phone className="w-4 h-4" /> Send via WhatsApp
                </a>
                <a href={generatedUrl} target="_blank" rel="noopener noreferrer" className="w-full bg-[#1B263B] hover:bg-gray-800 border border-gray-700/50 text-white font-semibold py-3.5 rounded-xl text-center text-sm flex items-center justify-center gap-2">
                  <ExternalLink className="w-4 h-4 text-[#cbbf9d]" /> Preview Link
                </a>
                <button onClick={() => setGeneratedUrl(null)} className="w-full text-xs text-gray-500 hover:text-gray-300 py-3 mt-2">
                  Create another link
                </button>
              </div>
            </div>
          ) : (
            /* COMPACT CONFIG FORM */
            <form onSubmit={handleGenerate} className="space-y-6">

              {/* Lead Info - List Style */}
              <div>
                <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 pl-2">Lead Information</h4>
                <div className="bg-[#1B263B] border border-gray-800 rounded-2xl overflow-hidden divide-y divide-gray-800">
                  <div className="px-4 py-3 relative">
                    <label className="block text-[9px] text-gray-400 font-bold uppercase mb-1">Lead Name</label>
                    <input type="text" placeholder="e.g. Rahul Sharma" value={leadName} onChange={(e) => setLeadName(e.target.value)} className="w-full bg-transparent text-[13px] text-white focus:outline-none placeholder:text-gray-600" />
                  </div>
                  <div className="px-4 py-3 relative">
                    <label className="block text-[9px] text-gray-400 font-bold uppercase mb-1">Phone (Optional)</label>
                    <input type="tel" placeholder="+91 98765 43210" value={leadPhone} onChange={(e) => setLeadPhone(e.target.value)} className="w-full bg-transparent text-[13px] text-white focus:outline-none placeholder:text-gray-600" />
                  </div>
                  <div className="px-4 py-3 flex items-center justify-between">
                    <div className="flex flex-col">
                      <label className="text-[9px] text-gray-400 font-bold uppercase mb-1">Passcode (Optional)</label>
                      <input type="text" placeholder="Any 4 digit" value={passcode} onChange={(e) => setPasscode(e.target.value)} className="w-24 bg-transparent text-[13px] text-white focus:outline-none placeholder:text-gray-600" />
                    </div>
                    <div className="flex flex-col items-end border-l border-gray-800 pl-4 w-1/2">
                      <label className="text-[9px] text-gray-400 font-bold uppercase mb-1">Expires In</label>
                      <select value={expiresInDays === undefined ? '0' : expiresInDays} onChange={(e) => setExpiresInDays(parseInt(e.target.value) || undefined)} className="bg-transparent text-[13px] text-[#cbbf9d] focus:outline-none text-right appearance-none w-full cursor-pointer">
                        <option value="7">7 Days</option>
                        <option value="14">14 Days</option>
                        <option value="30">30 Days</option>
                        <option value="0">Never</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Permissions - Descriptive List */}
              <div>
                <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 pl-2">What to show</h4>
                <div className="bg-[#1B263B] border border-gray-800 rounded-2xl overflow-hidden divide-y divide-gray-800">
                  {PERMISSION_ROWS.map(({ key, label, desc, sensitive }) => {
                    const value = permissions[key];
                    return (
                      <label key={key} className={`flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-white/[0.02] transition gap-3 ${sensitive ? 'border-l-2 border-amber-500/40' : ''}`}
                        onClick={() => togglePermission(key)}>
                        <div className="flex flex-col min-w-0">
                          <span className={`text-[13px] font-medium ${sensitive ? 'text-amber-300' : 'text-gray-300'}`}>{label}</span>
                          <span className="text-[10px] text-gray-500 mt-0.5">{desc}</span>
                        </div>
                        <div className={`w-10 h-5 rounded-full relative transition-colors duration-300 shrink-0 ${value ? (sensitive ? 'bg-amber-500' : 'bg-[#3c70b8]') : 'bg-gray-700'}`}>
                          <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-300" style={{ transform: value ? 'translateX(18px)' : 'translateX(0)' }} />
                        </div>
                      </label>
                    );
                  })}
                </div>
                <p className="text-[9px] text-amber-600/70 pl-2 mt-1.5">⚠ Amber rows expose sensitive data — only share with trusted parties.</p>
              </div>

              {/* Specific Media / Docs - List Style */}
              {(documents.length > 0 || media.length > 0) && (
                <div>
                  <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 pl-2">Specific Files Selection</h4>
                  <div className="bg-[#1B263B] border border-gray-800 rounded-2xl overflow-hidden divide-y divide-gray-800">
                    {media.map((item, idx) => {
                      const mediaId = (item as any)._id?.toString() || item.id || item.secure_url;
                      const isChecked = selectedMediaIds.includes(mediaId);
                      return (
                        <label key={`media-${idx}`} className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-white/[0.02] transition">
                          <input type="checkbox" checked={isChecked} onChange={() => toggleMediaSelection(mediaId)} className="w-4 h-4 rounded-sm border-gray-600 text-[#3c70b8] focus:ring-0 bg-transparent" />
                          <img src={item.secure_url} alt="" className="w-9 h-9 rounded-lg object-cover shrink-0 border border-gray-800" />
                          <div className="flex flex-col min-w-0 flex-1">
                            <span className="text-[12px] text-white font-medium truncate">{item.caption || `${item.type || 'Media'} ${idx + 1}`}</span>
                            <span className="text-[10px] text-gray-500 uppercase">{item.visibility || 'Public'}</span>
                          </div>
                        </label>
                      );
                    })}
                    {documents.map((doc, idx) => {
                      const docId = (doc as any)._id?.toString() || doc.id || doc.name;
                      const isChecked = selectedDocIds.includes(docId);
                      return (
                        <label key={`doc-${idx}`} className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-white/[0.02] transition">
                          <input type="checkbox" checked={isChecked} onChange={() => toggleDocSelection(docId)} className="w-4 h-4 rounded-sm border-gray-600 text-[#3c70b8] focus:ring-0 bg-transparent" />
                          <div className="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 shrink-0">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div className="flex flex-col min-w-0 flex-1">
                            <span className="text-[12px] text-white font-medium truncate">{doc.name}</span>
                            <span className="text-[10px] text-gray-500 uppercase">Document • {doc.visibility}</span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Floating Action Button area for Mobile */}
              <div className="fixed bottom-0 left-0 right-0 sm:relative sm:pt-4 bg-gradient-to-t from-[#0F1523] via-[#0F1523] to-transparent p-4 sm:p-0 flex items-center gap-3 z-30">
                <button type="submit" disabled={loading} className="w-full bg-[#3c70b8] hover:bg-[#325ea0] text-white font-semibold py-3.5 rounded-xl transition text-[14px] flex items-center justify-center gap-2 shadow-lg">
                  {loading ? 'Generating...' : 'Generate Sharing Link'}
                </button>
              </div>
              {/* Spacer for floating action bar */}
              <div className="sm:hidden h-10"></div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
