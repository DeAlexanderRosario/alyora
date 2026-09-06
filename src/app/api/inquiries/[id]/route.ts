import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import { Inquiry } from '@/models/Inquiry';
import { verifyAdminToken } from '@/lib/auth-server';

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const admin = verifyAdminToken(req);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const inquiry = await Inquiry.findByIdAndDelete(params.id);
    if (!inquiry) {
      return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to delete inquiry';
    console.error('Inquiry DELETE error:', errorMsg);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
