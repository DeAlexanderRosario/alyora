import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import { AuditLog } from '@/models/AuditLog';
import { verifyAdminToken } from '@/lib/auth-server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const admin = verifyAdminToken(req);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const logs = await AuditLog.find()
      .populate('propertyId', 'name location')
      .populate('shareLinkId', 'token leadName')
      .sort({ createdAt: -1 })
      .limit(200);

    return NextResponse.json(logs);
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to fetch audit logs';
    console.error('Audit log GET error:', errorMsg);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
