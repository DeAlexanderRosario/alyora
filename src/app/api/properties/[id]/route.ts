import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import { Property } from '@/models/Property';
import { propertySchema } from '@/schemas/property.schema';
import { verifyAdminToken } from '@/lib/auth-server';
import { filterPublicProperty } from '@/lib/propertyVisibility';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const isAdmin = !!verifyAdminToken(req);
    const property = await Property.findById(params.id).lean();
    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    if (!isAdmin) {
      if ((property as any).status !== 'PUBLISHED') {
        return NextResponse.json({ error: 'Property not found' }, { status: 404 });
      }
      return NextResponse.json(filterPublicProperty(property));
    }

    return NextResponse.json(property);
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to fetch property';
    console.error('Property GET error:', errorMsg);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const admin = verifyAdminToken(req);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();
    const parseResult = propertySchema.partial().safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parseResult.error.flatten() },
        { status: 400 }
      );
    }

    const data = parseResult.data;
    // Merge extra fields like amenities/specifications that Zod passes through
    const updatePayload: Record<string, unknown> = {
      ...data,
      // Ensure amenities and specifications from parsed data are included
      ...(data.amenities !== undefined ? { amenities: data.amenities } : {}),
      ...(data.specifications !== undefined ? { specifications: data.specifications } : {}),
    };

    if (data.image_url || data.image) {
      const imageUrl = data.image_url || data.image?.secure_url || '';
      updatePayload.image_url = imageUrl;
      updatePayload.image = data.image || { secure_url: imageUrl, public_id: 'manual' };
    }

    const property = await Property.findByIdAndUpdate(params.id, { $set: updatePayload }, { new: true, strict: false });
    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    return NextResponse.json(property);
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to update property';
    console.error('Property PUT error:', errorMsg);
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
    const property = await Property.findByIdAndDelete(params.id);
    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to delete property';
    console.error('Property DELETE error:', errorMsg);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
