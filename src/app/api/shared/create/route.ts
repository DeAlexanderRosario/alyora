import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { dbConnect } from '@/lib/dbConnect';
import { ShareLink } from '@/models/ShareLink';
import { AuditLog } from '@/models/AuditLog';
import { Property } from '@/models/Property';
import { createShareLinkSchema } from '@/schemas/shareLink.schema';
import { verifyAdminToken } from '@/lib/auth-server';

export async function POST(req: NextRequest) {
  try {
    const admin = verifyAdminToken(req);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();

    const parseResult = createShareLinkSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parseResult.error.flatten() },
        { status: 400 }
      );
    }

    const data = parseResult.data;

    // Verify property exists
    const property = await Property.findById(data.propertyId);
    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    // Generate unique token
    const token = 'aly_' + crypto.randomBytes(12).toString('hex');

    // Calculate expiration if provided
    let expiresAt: Date | undefined = undefined;
    if (data.expiresInDays && data.expiresInDays > 0) {
      expiresAt = new Date(Date.now() + data.expiresInDays * 24 * 60 * 60 * 1000);
    }

    // Create ShareLink
    const shareLink = await ShareLink.create({
      token,
      propertyId: data.propertyId,
      createdBy: admin.email || data.createdBy || 'admin',
      leadName: data.leadName,
      leadPhone: data.leadPhone,
      leadEmail: data.leadEmail,
      salespersonId: data.salespersonId,
      expiresAt,
      passcode: data.passcode,
      permissions: data.permissions,
      allowedDocumentIds: data.allowedDocumentIds,
      allowedMediaIds: data.allowedMediaIds,
    });

    // Create Audit Log
    await AuditLog.create({
      shareLinkId: shareLink._id,
      propertyId: property._id,
      action: 'LINK_CREATED',
      performedBy: admin.email || 'ADMIN',
      notes: `Share link generated for lead "${data.leadName || 'General Customer'}"`,
    });

    const host = req.headers.get('host') || 'localhost:3000';
    const protocol = req.headers.get('x-forwarded-proto') || 'http';
    const shareUrl = `${protocol}://${host}/shared/property/${token}`;

    return NextResponse.json(
      {
        success: true,
        token,
        shareUrl,
        shareLink,
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to create share link';
    console.error('Share link POST error:', errorMsg);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
