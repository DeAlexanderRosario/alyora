import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import { Inquiry } from '@/models/Inquiry';
import { inquirySchema } from '@/schemas/inquiry.schema';
import { verifyAdminToken } from '@/lib/auth-server';

export async function GET(req: NextRequest) {
  try {
    const admin = verifyAdminToken(req);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    return NextResponse.json(inquiries);
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to fetch inquiries';
    console.error('Inquiries GET error:', errorMsg);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const parseResult = inquirySchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parseResult.error.flatten() },
        { status: 400 }
      );
    }

    const inquiry = await Inquiry.create(parseResult.data);
    return NextResponse.json(inquiry, { status: 201 });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to submit inquiry';
    console.error('Inquiry POST error:', errorMsg);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
