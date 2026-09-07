import { NextRequest, NextResponse } from 'next/server';
import { uploadBufferToCloudinary } from '@/lib/cloudinary';
import { verifyAdminToken } from '@/lib/auth-server';

export async function POST(req: NextRequest) {
  try {
    const admin = verifyAdminToken(req);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = (formData.get('file') || formData.get('image')) as File | null;
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Auto detect resource type for PDFs and images
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    const resourceType = isPdf ? 'auto' : 'image';

    const asset = await uploadBufferToCloudinary(buffer, 'alyora', resourceType);
    return NextResponse.json(asset, { status: 201 });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Image upload failed';
    console.error('Upload POST error:', errorMsg);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
