import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import { Location } from '@/models/Location';
import { locationSchema } from '@/schemas/location.schema';
import { verifyAdminToken } from '@/lib/auth-server';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const admin = verifyAdminToken(req);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();
    const parseResult = locationSchema.partial().safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parseResult.error.flatten() },
        { status: 400 }
      );
    }

    const data = parseResult.data;
    const updatePayload: Record<string, unknown> = { ...data };

    if (data.image_url || data.image) {
      const imageUrl = data.image_url || data.image?.secure_url || '';
      updatePayload.image_url = imageUrl;
      updatePayload.image = data.image || { secure_url: imageUrl, public_id: 'manual' };
    }

    const location = await Location.findByIdAndUpdate(params.id, updatePayload, { new: true });
    if (!location) {
      return NextResponse.json({ error: 'Location not found' }, { status: 404 });
    }

    return NextResponse.json(location);
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to update location';
    console.error('Location PUT error:', errorMsg);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const admin = verifyAdminToken(req);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const location = await Location.findByIdAndDelete(params.id);
    if (!location) {
      return NextResponse.json({ error: 'Location not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to delete location';
    console.error('Location DELETE error:', errorMsg);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
