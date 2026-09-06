'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import {
    Link2, Search, Copy, Check, ExternalLink, Trash2, Ban, RefreshCw, Eye, ShieldAlert, ShieldCheck, User, Calendar
} from 'lucide-react';
import { AdminShell } from '@/components/AdminShell';
import { api } from '@/lib/api';

interface ShareLinkItem {
    _id: string;
    token: string;
    propertyId: {
        _id?: string;
        name?: string;
        location?: string;
        price?: string;
        image_url?: string;
    } | null;
    createdBy?: string;
    leadName?: string;
    leadPhone?: string;
    leadEmail?: string;
    expiresAt?: string;
    isRevoked: boolean;
    permissions?: Record<string, boolean>;
    viewsCount?: number;
    createdAt: string;
}

export default function ShareLinksPage() {
    const [links, setLinks] = useState<ShareLinkItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'revoked' | 'expired'>('all');
    const [copiedToken, setCopiedToken] = useState<string | null>(null);

    useEffect(() => {
        fetchLinks();
    }, []);

    async function fetchLinks() {
        setLoading(true);
        try {
            const data = await api.getShareLinks();
            setLinks(data || []);
        } catch (err) {
            console.error('Failed to load share links:', err);
        } finally {
            setLoading(false);
        }
    }

    async function handleToggleRevoke(token: string, currentRevoked: boolean) {
        try {
            await api.toggleRevokeShareLink(token, currentRevoked ? 'restore' : 'revoke');
            setLinks((prev) =>
                prev.map((item) => (item.token === token ? { ...item, isRevoked: !currentRevoked } : item))
            );
        } catch (err) {
            alert('Failed to update link status');
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Are you sure you want to delete this share link record?')) return;
        try {
            await api.deleteShareLink(id);
            setLinks((prev) => prev.filter((item) => item._id !== id));
        } catch (err) {
            alert('Failed to delete share link');
        }
    }

    function handleCopy(token: string) {
        const url = `${window.location.origin}/shared/property/${token}`;
        navigator.clipboard.writeText(url);
        setCopiedToken(token);
        setTimeout(() => setCopiedToken(null), 2000);
    }

    const isExpired = (expiresAt?: string) => {
        if (!expiresAt) return false;
        return new Date(expiresAt).getTime() < Date.now();
    };

    const filteredLinks = useMemo(() => {
        return links.filter((item) => {
            const propName = item.propertyId?.name || '';
            const lead = item.leadName || '';
            const token = item.token || '';
            const query = searchTerm.toLowerCase();

            const matchesSearch =
                propName.toLowerCase().includes(query) ||
                lead.toLowerCase().includes(query) ||
                token.toLowerCase().includes(query);

            if (!matchesSearch) return false;

            const expired = isExpired(item.expiresAt);

            if (filterStatus === 'active') return !item.isRevoked && !expired;
            if (filterStatus === 'revoked') return item.isRevoked;
            if (filterStatus === 'expired') return expired && !item.isRevoked;

            return true;
        });
    }, [links, searchTerm, filterStatus]);

    const stats = useMemo(() => {
        const total = links.length;
        const active = links.filter((l) => !l.isRevoked && !isExpired(l.expiresAt)).length;
        const revoked = links.filter((l) => l.isRevoked).length;
        const views = links.reduce((sum, l) => sum + (l.viewsCount || 0), 0);
        return { total, active, revoked, views };
    }, [links]);

    return (
        <AdminShell title="Share Links Management">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

                {/* STATS OVERVIEW */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
                    <div style={{ backgroundColor: '#ffffff', padding: 20, borderRadius: 12, border: '1px solid #e8edee' }}>
                        <div style={{ color: '#657176', fontSize: 12, textTransform: 'uppercase', fontWeight: 600 }}>Total Generated Links</div>
                        <div style={{ color: '#153545', fontSize: 28, fontWeight: 700, marginTop: 4 }}>{stats.total}</div>
                    </div>
                    <div style={{ backgroundColor: '#ffffff', padding: 20, borderRadius: 12, border: '1px solid #e8edee' }}>
                        <div style={{ color: '#2E7D32', fontSize: 12, textTransform: 'uppercase', fontWeight: 600 }}>Active Links</div>
                        <div style={{ color: '#2E7D32', fontSize: 28, fontWeight: 700, marginTop: 4 }}>{stats.active}</div>
                    </div>
                    <div style={{ backgroundColor: '#ffffff', padding: 20, borderRadius: 12, border: '1px solid #e8edee' }}>
                        <div style={{ color: '#C62828', fontSize: 12, textTransform: 'uppercase', fontWeight: 600 }}>Revoked Links</div>
                        <div style={{ color: '#C62828', fontSize: 28, fontWeight: 700, marginTop: 4 }}>{stats.revoked}</div>
                    </div>
                    <div style={{ backgroundColor: '#ffffff', padding: 20, borderRadius: 12, border: '1px solid #e8edee' }}>
                        <div style={{ color: '#153545', fontSize: 12, textTransform: 'uppercase', fontWeight: 600 }}>Total Link Views</div>
                        <div style={{ color: '#153545', fontSize: 28, fontWeight: 700, marginTop: 4 }}>{stats.views}</div>
                    </div>
                </div>

                {/* SEARCH & FILTERS BAR */}
                <div style={{ backgroundColor: '#ffffff', padding: 16, borderRadius: 12, border: '1px solid #e8edee', display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, backgroundColor: '#f8fafb', padding: '8px 14px', borderRadius: 8, border: '1px solid #e8edee', flex: 1, minWidth: 260 }}>
                        <Search size={16} color="#657176" />
                        <input
                            type="text"
                            placeholder="Search by customer, property, or token..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: 13, color: '#153545' }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {(['all', 'active', 'revoked', 'expired'] as const).map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                style={{
                                    padding: '6px 14px',
                                    borderRadius: 20,
                                    fontSize: 12,
                                    fontWeight: 600,
                                    textTransform: 'capitalize',
                                    border: '1px solid',
                                    borderColor: filterStatus === status ? '#153545' : '#e8edee',
                                    backgroundColor: filterStatus === status ? '#153545' : '#ffffff',
                                    color: filterStatus === status ? '#ffffff' : '#657176',
                                    cursor: 'pointer',
                                }}
                            >
                                {status}
                            </button>
                        ))}
                    </div>

                </div>

                {/* CONTENT LIST / TABLE */}
                {loading ? (
                    <div style={{ backgroundColor: '#ffffff', padding: 40, textAlign: 'center', borderRadius: 12, color: '#657176' }}>
                        Loading Share Links...
                    </div>
                ) : filteredLinks.length === 0 ? (
                    <div style={{ backgroundColor: '#ffffff', padding: 40, textAlign: 'center', borderRadius: 12, color: '#657176' }}>
                        No share links found matching your query.
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {filteredLinks.map((item) => {
                            const expired = isExpired(item.expiresAt);
                            const active = !item.isRevoked && !expired;
                            const propName = item.propertyId?.name || 'Deleted Property';
                            const propLoc = item.propertyId?.location || '';

                            return (
                                <div
                                    key={item._id}
                                    style={{
                                        backgroundColor: '#ffffff',
                                        borderRadius: 12,
                                        border: '1px solid #e8edee',
                                        padding: 20,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 16,
                                    }}
                                >
                                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>

                                        {/* LEFT: PROPERTY & LEAD INFO */}
                                        <div style={{ display: 'flex', gap: 14 }}>
                                            <div style={{ width: 56, height: 56, borderRadius: 8, overflow: 'hidden', backgroundColor: '#f0f4f5', flexShrink: 0 }}>
                                                {item.propertyId?.image_url ? (
                                                    <img src={item.propertyId.image_url} alt={propName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                ) : (
                                                    <Link2 size={24} color="#657176" style={{ margin: 16 }} />
                                                )}
                                            </div>

                                            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                                <div style={{ fontSize: 16, fontWeight: 700, color: '#153545' }}>{propName}</div>
                                                {propLoc && <div style={{ fontSize: 12, color: '#657176' }}>📍 {propLoc}</div>}

                                                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4, fontSize: 12, color: '#4a575d' }}>
                                                    <span style={{ fontWeight: 600, color: '#153545' }}>
                                                        👤 Lead: {item.leadName || 'General Customer'}
                                                    </span>
                                                    {item.leadPhone && <span>📞 {item.leadPhone}</span>}
                                                </div>
                                            </div>
                                        </div>

                                        {/* RIGHT: STATUS & VIEWS */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <div style={{ fontSize: 12, fontWeight: 600, backgroundColor: '#f0f4f5', padding: '4px 10px', borderRadius: 20, color: '#153545' }}>
                                                👁 {item.viewsCount || 0} Views
                                            </div>

                                            {item.isRevoked ? (
                                                <span style={{ backgroundColor: '#FFEBEE', color: '#C62828', fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                                    <Ban size={12} /> REVOKED
                                                </span>
                                            ) : expired ? (
                                                <span style={{ backgroundColor: '#FFF3E0', color: '#E65100', fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                                    <Calendar size={12} /> EXPIRED
                                                </span>
                                            ) : (
                                                <span style={{ backgroundColor: '#E8F5E9', color: '#2E7D32', fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                                    <ShieldCheck size={12} /> ACTIVE
                                                </span>
                                            )}
                                        </div>

                                    </div>

                                    {/* BOTTOM ROW: TOKEN LINK & ACTIONS */}
                                    <div style={{ borderTop: '1px solid #f0f4f5', paddingTop: 12, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#657176' }}>
                                            <span style={{ fontFamily: 'monospace', backgroundColor: '#f8fafb', padding: '4px 8px', borderRadius: 6, border: '1px solid #e8edee', color: '#153545' }}>
                                                {item.token}
                                            </span>
                                            <span>Created {new Date(item.createdAt).toLocaleDateString()}</span>
                                            {item.expiresAt && (
                                                <span>• Expires {new Date(item.expiresAt).toLocaleDateString()}</span>
                                            )}
                                        </div>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>

                                            <button
                                                onClick={() => handleCopy(item.token)}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 4,
                                                    padding: '6px 12px',
                                                    borderRadius: 6,
                                                    backgroundColor: copiedToken === item.token ? '#E8F5E9' : '#f0f4f5',
                                                    color: copiedToken === item.token ? '#2E7D32' : '#153545',
                                                    border: 'none',
                                                    fontSize: 12,
                                                    fontWeight: 600,
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                {copiedToken === item.token ? <Check size={14} /> : <Copy size={14} />}
                                                <span>{copiedToken === item.token ? 'Copied' : 'Copy Link'}</span>
                                            </button>

                                            <a
                                                href={`/shared/property/${item.token}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 4,
                                                    padding: '6px 12px',
                                                    borderRadius: 6,
                                                    backgroundColor: '#153545',
                                                    color: '#ffffff',
                                                    textDecoration: 'none',
                                                    fontSize: 12,
                                                    fontWeight: 600,
                                                }}
                                            >
                                                <ExternalLink size={14} />
                                                <span>Open Link</span>
                                            </a>

                                            <button
                                                onClick={() => handleToggleRevoke(item.token, item.isRevoked)}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 4,
                                                    padding: '6px 12px',
                                                    borderRadius: 6,
                                                    backgroundColor: item.isRevoked ? '#E8F5E9' : '#FFEBEE',
                                                    color: item.isRevoked ? '#2E7D32' : '#C62828',
                                                    border: 'none',
                                                    fontSize: 12,
                                                    fontWeight: 600,
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                {item.isRevoked ? <RefreshCw size={14} /> : <Ban size={14} />}
                                                <span>{item.isRevoked ? 'Restore' : 'Revoke'}</span>
                                            </button>

                                            <button
                                                onClick={() => handleDelete(item._id)}
                                                style={{
                                                    padding: '6px 10px',
                                                    borderRadius: 6,
                                                    backgroundColor: '#f8fafb',
                                                    color: '#657176',
                                                    border: '1px solid #e8edee',
                                                    cursor: 'pointer',
                                                }}
                                                title="Delete Record"
                                            >
                                                <Trash2 size={14} />
                                            </button>

                                        </div>

                                    </div>

                                </div>
                            );
                        })}
                    </div>
                )}

            </div>
        </AdminShell>
    );
}
