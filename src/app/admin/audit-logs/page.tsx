'use client';

import React, { useEffect, useState } from 'react';
import { ShieldCheck, Eye, Download, Lock, CheckCircle, AlertTriangle, FileText } from 'lucide-react';
import { AdminShell } from '@/components/AdminShell';
import { api } from '@/lib/api';

interface AuditLogItem {
  _id: string;
  action: 'LINK_CREATED' | 'LINK_VIEWED' | 'DOCUMENT_VIEWED' | 'DOCUMENT_DOWNLOADED' | 'LINK_REVOKED' | 'INQUIRY_SUBMITTED';
  propertyId?: { _id: string; name: string; location: string };
  shareLinkId?: { _id: string; token: string; leadName?: string };
  performedBy?: string;
  documentName?: string;
  ipAddress?: string;
  userAgent?: string;
  notes?: string;
  createdAt: string;
}

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLogs();
  }, []);

  async function loadLogs() {
    setLoading(true);
    try {
      const data = await api.getAuditLogs();
      setLogs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function getActionBadge(action: string) {
    switch (action) {
      case 'LINK_CREATED':
        return <span style={{ backgroundColor: '#e3f2fd', color: '#1976d2', padding: '3px 8px', borderRadius: 4, fontSize: 11, fontWeight: 700 }}>LINK CREATED</span>;
      case 'LINK_VIEWED':
        return <span style={{ backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '3px 8px', borderRadius: 4, fontSize: 11, fontWeight: 700 }}>LINK VIEWED</span>;
      case 'DOCUMENT_VIEWED':
        return <span style={{ backgroundColor: '#fff8e1', color: '#f57f17', padding: '3px 8px', borderRadius: 4, fontSize: 11, fontWeight: 700 }}>DOC PREVIEWED</span>;
      case 'DOCUMENT_DOWNLOADED':
        return <span style={{ backgroundColor: '#ede7f6', color: '#512da8', padding: '3px 8px', borderRadius: 4, fontSize: 11, fontWeight: 700 }}>DOC DOWNLOADED</span>;
      case 'LINK_REVOKED':
        return <span style={{ backgroundColor: '#ffebee', color: '#c62828', padding: '3px 8px', borderRadius: 4, fontSize: 11, fontWeight: 700 }}>LINK REVOKED</span>;
      default:
        return <span style={{ backgroundColor: '#eceff1', color: '#455a64', padding: '3px 8px', borderRadius: 4, fontSize: 11, fontWeight: 700 }}>{action}</span>;
    }
  }

  return (
    <AdminShell title="Security Audit & Client Event Logs">
      <div style={{ marginBottom: 20 }}>
        <p style={{ color: '#6b7d83', fontSize: 14 }}>
          Real-time tracking of all customer share link creations, document views, downloads, and access revocations.
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#103143' }}>Loading audit events...</div>
      ) : logs.length === 0 ? (
        <div style={{ backgroundColor: '#ffffff', borderRadius: 8, padding: 32, textAlign: 'center', color: '#9ab4be' }}>
          No audit logs recorded yet. Events will appear here when links are created or viewed.
        </div>
      ) : (
        <div style={{ backgroundColor: '#ffffff', borderRadius: 10, overflow: 'hidden', boxShadow: '0 4px 16px rgba(21, 53, 69, 0.06)', border: '1px solid #e8edee' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fbfc', borderBottom: '1px solid #e8edee', color: '#153545', fontWeight: 700 }}>
                <th style={{ padding: '12px 16px' }}>Timestamp</th>
                <th style={{ padding: '12px 16px' }}>Event Action</th>
                <th style={{ padding: '12px 16px' }}>Property</th>
                <th style={{ padding: '12px 16px' }}>Client / Performed By</th>
                <th style={{ padding: '12px 16px' }}>Document / Details</th>
                <th style={{ padding: '12px 16px' }}>IP / Device</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log._id} style={{ borderBottom: '1px solid #f0f4f5' }}>
                  <td style={{ padding: '12px 16px', color: '#6b7d83', whiteSpace: 'nowrap' }}>
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td style={{ padding: '12px 16px' }}>{getActionBadge(log.action)}</td>
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: '#153545' }}>
                    {log.propertyId?.name || 'Property'}
                  </td>
                  <td style={{ padding: '12px 16px', color: '#103143', fontWeight: 500 }}>
                    {log.performedBy || log.shareLinkId?.leadName || 'Customer'}
                  </td>
                  <td style={{ padding: '12px 16px', color: '#455a64' }}>
                    {log.documentName ? <strong>{log.documentName}</strong> : log.notes || '-'}
                  </td>
                  <td style={{ padding: '12px 16px', color: '#9ab4be', fontSize: 11, fontFamily: 'monospace' }}>
                    {log.ipAddress || '127.0.0.1'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  );
}
