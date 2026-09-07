import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import { Inquiry } from '@/models/Inquiry';
import { verifyAdminToken } from '@/lib/auth-server';

export const dynamic = 'force-dynamic';

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

    const name = (body.name || body.leadName || '').trim() || 'Interested Visitor';
    const email = (body.email || body.leadEmail || '').trim();
    const phone = (body.phone || body.leadPhone || '').trim();
    const message = (body.message || '').trim() || 'Inquiry regarding property presentation';
    const property_name = (body.property_name || body.propertyName || body.title || '').trim() || 'General Inquiry';

    if (!name || (!email && !phone)) {
      return NextResponse.json(
        { error: 'Please provide your name and either phone or email.' },
        { status: 400 }
      );
    }

    const inquiry = await Inquiry.create({
      name,
      email: email || (phone ? `${phone}@inquiry.alyora.in` : 'visitor@alyora.in'),
      phone,
      message,
      property_name,
    });

    return NextResponse.json(inquiry, { status: 201 });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to submit inquiry';
    console.error('Inquiry POST error:', errorMsg);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
