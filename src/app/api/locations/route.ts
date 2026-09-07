import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import { Location } from '@/models/Location';
import { locationSchema } from '@/schemas/location.schema';
import { verifyAdminToken } from '@/lib/auth-server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();
    const locations = await Location.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(locations, {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=120',
      },
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to fetch locations';
    console.error('Locations GET error:', errorMsg);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = verifyAdminToken(req);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();
    const parseResult = locationSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parseResult.error.flatten() },
        { status: 400 }
      );
    }

    const data = parseResult.data;
    const imageUrl = data.image_url || data.image?.secure_url || '';
    const imageDoc = data.image || { secure_url: imageUrl, public_id: 'manual' };

    const location = await Location.create({
      ...data,
      image_url: imageUrl,
      image: imageDoc,
    });

    return NextResponse.json(location, { status: 201 });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to create location';
    console.error('Location POST error:', errorMsg);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
