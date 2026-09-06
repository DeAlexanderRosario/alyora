import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import { Property } from '@/models/Property';
import { Location } from '@/models/Location';
import { Inquiry } from '@/models/Inquiry';
import { verifyAdminToken } from '@/lib/auth-server';

export async function GET(req: NextRequest) {
  try {
    const admin = verifyAdminToken(req);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const [properties, locations, inquiries, featured, recentInquiries] = await Promise.all([
      Property.countDocuments(),
      Location.countDocuments(),
      Inquiry.countDocuments(),
      Property.countDocuments({ featured: true }),
      Inquiry.find().sort({ createdAt: -1 }).limit(5),
    ]);

    return NextResponse.json({ properties, locations, inquiries, featured, recentInquiries });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to fetch stats';
    console.error('Stats GET error:', errorMsg);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
