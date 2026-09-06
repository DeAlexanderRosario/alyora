import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import { ShareLink } from '@/models/ShareLink';
import { AuditLog } from '@/models/AuditLog';
import { verifyAdminToken } from '@/lib/auth-server';

export async function POST(req: NextRequest, { params }: { params: { token: string } }) {
  try {
    const admin = verifyAdminToken(req);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const token = params.token;

    const shareLink = await ShareLink.findOne({ token });
    if (!shareLink) {
      return NextResponse.json({ error: 'Share link not found' }, { status: 404 });
    }

    const body = await req.json().catch(() => ({}));
    const shouldRevoke = body.action === 'restore' ? false : !shareLink.isRevoked;
    shareLink.isRevoked = shouldRevoke;
    await shareLink.save();

    await AuditLog.create({
      shareLinkId: shareLink._id,
      propertyId: shareLink.propertyId,
      action: shouldRevoke ? 'LINK_REVOKED' : 'LINK_RESTORED',
      performedBy: admin.email || 'ADMIN',
      notes: `Share link (${token}) ${shouldRevoke ? 'revoked' : 'restored'} by admin.`,
    });

    return NextResponse.json({
      success: true,
      isRevoked: shouldRevoke,
      message: `Share link successfully ${shouldRevoke ? 'revoked' : 'restored'}.`,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to revoke share link';
    console.error('Revoke share link error:', errorMsg);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
