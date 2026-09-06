import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import { Admin } from '@/models/Admin';
import { verifyAdminToken } from '@/lib/auth-server';

export async function GET(req: NextRequest) {
  try {
    const adminAuth = verifyAdminToken(req);
    if (!adminAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const admin = await Admin.findById(adminAuth.id).select('-password');
    if (!admin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    }

    return NextResponse.json({ user: { id: admin._id.toString(), email: admin.email } });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Internal server error';
    console.error('Auth verification error:', errorMsg);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
