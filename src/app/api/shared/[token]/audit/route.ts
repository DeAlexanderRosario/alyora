import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import { ShareLink } from '@/models/ShareLink';
import { AuditLog } from '@/models/AuditLog';

export async function POST(req: NextRequest, { params }: { params: { token: string } }) {
  try {
    await dbConnect();
    const token = params.token;
    const body = await req.json().catch(() => ({}));

    const shareLink = await ShareLink.findOne({ token });
    if (!shareLink) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 404 });
    }

    const action = body.action || 'DOCUMENT_VIEWED';
    const documentName = body.documentName || 'Document';
    const userAgent = req.headers.get('user-agent') || 'Unknown Browser';
    const ipAddress = req.headers.get('x-forwarded-for') || '127.0.0.1';

    await AuditLog.create({
      shareLinkId: shareLink._id,
      propertyId: shareLink.propertyId,
      action: action as any,
      performedBy: shareLink.leadName ? `CUSTOMER (${shareLink.leadName})` : 'CUSTOMER',
      documentName,
      userAgent,
      ipAddress,
      notes: `Customer ${action === 'DOCUMENT_DOWNLOADED' ? 'downloaded' : 'viewed'} document "${documentName}"`,
    });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error('Audit log record error:', err);
    return NextResponse.json({ error: 'Audit log failed' }, { status: 500 });
  }
}
