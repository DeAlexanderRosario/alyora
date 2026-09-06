import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import { Property } from '@/models/Property';
import { propertySchema } from '@/schemas/property.schema';
import { verifyAdminToken } from '@/lib/auth-server';
import { filterPublicProperty } from '@/lib/propertyVisibility';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const isAdmin = !!verifyAdminToken(req);

    let query: Record<string, unknown> = {};
    if (!isAdmin) {
      query.status = 'PUBLISHED';
    }

    const properties = await Property.find(query).sort({ createdAt: -1 }).lean();

    if (isAdmin) {
      return NextResponse.json(properties);
    }

    // Apply strict server-side filtering for public users
    const filteredProperties = properties.map((p) => filterPublicProperty(p));
    return NextResponse.json(filteredProperties, {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=120',
      },
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to fetch properties';
    console.error('Properties GET error:', errorMsg);
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
    const parseResult = propertySchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parseResult.error.flatten() },
        { status: 400 }
      );
    }

    const data = parseResult.data;
    const imageUrl = data.image_url || data.image?.secure_url || '';
    const imageDoc = data.image || { secure_url: imageUrl, public_id: 'manual' };

    const property = await Property.create({
      ...data,
      image_url: imageUrl,
      image: imageDoc,
    });

    return NextResponse.json(property, { status: 201 });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to create property';
    console.error('Property POST error:', errorMsg);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
