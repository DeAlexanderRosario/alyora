import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import { ShareLink } from '@/models/ShareLink';
import { Property } from '@/models/Property';
import { AuditLog } from '@/models/AuditLog';
import { filterSharedProperty } from '@/lib/propertyVisibility';

export async function GET(req: NextRequest, { params }: { params: { token: string } }) {
  try {
    await dbConnect();
    const token = params.token;

    const shareLink = await ShareLink.findOne({ token });
    if (!shareLink) {
      return NextResponse.json({ error: 'Share link not found or invalid' }, { status: 404 });
    }

    // Check revocation
    if (shareLink.isRevoked) {
      return NextResponse.json(
        { error: 'This customer link has been revoked by ALYORA Real Estate management.' },
        { status: 403 }
      );
    }

    // Check expiration
    if (shareLink.expiresAt && new Date() > new Date(shareLink.expiresAt)) {
      return NextResponse.json(
        { error: 'This customer link has expired.' },
        { status: 410 }
      );
    }

    // Check passcode protection
    const url = new URL(req.url);
    const providedPasscode = url.searchParams.get('passcode') || '';

    if (shareLink.passcode && shareLink.passcode.trim() !== '') {
      if (!providedPasscode || providedPasscode.trim() !== shareLink.passcode.trim()) {
        return NextResponse.json(
          { requiresPasscode: true, message: 'Passcode required to view property' },
          { status: 401 }
        );
      }
    }

    const property = await Property.findById(shareLink.propertyId);
    if (!property) {
      return NextResponse.json({ error: 'Associated property not found' }, { status: 404 });
    }

    // Increment view count
    shareLink.viewsCount += 1;
    await shareLink.save();

    // Log Audit Event
    const userAgent = req.headers.get('user-agent') || 'Unknown Browser';
    const ipAddress = req.headers.get('x-forwarded-for') || '127.0.0.1';

    await AuditLog.create({
      shareLinkId: shareLink._id,
      propertyId: property._id,
      action: 'LINK_VIEWED',
      performedBy: shareLink.leadName ? `CUSTOMER (${shareLink.leadName})` : 'CUSTOMER',
      userAgent,
      ipAddress,
      notes: `Share link viewed (Total views: ${shareLink.viewsCount})`,
    });

    // Filter Property Data based on shareLink permissions
    console.log('[SharedAPI] ShareLink permissions:', JSON.stringify(shareLink.permissions, null, 2));
    console.log('[SharedAPI] Raw property media count:', property.media?.length ?? 0);
    console.log('[SharedAPI] Raw property docs count:', property.documents?.length ?? 0);

    // Serialize to plain object so strict:false fields (showOwnerDetails etc.) are all included
    const shareLinkObj = shareLink.toObject ? shareLink.toObject({ virtuals: false }) : shareLink;

    const filteredProperty = filterSharedProperty(property, shareLinkObj as any);

    console.log('[SharedAPI] Filtered property name:', filteredProperty.name);
    console.log('[SharedAPI] Filtered media count:', filteredProperty.media?.length ?? 0);
    console.log('[SharedAPI] Filtered price:', filteredProperty.price);
    console.log('[SharedAPI] showOwnerDetails permission:', shareLinkObj.permissions?.showOwnerDetails);

    return NextResponse.json({
      success: true,
      property: filteredProperty,
      leadName: shareLink.leadName,
      leadPhone: shareLink.leadPhone,
      leadEmail: shareLink.leadEmail,
      salespersonId: shareLink.salespersonId,
      expiresAt: shareLink.expiresAt,
      permissions: shareLinkObj.permissions,  // plain object, all fields included
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to retrieve shared property';
    console.error('Shared property GET error:', errorMsg);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: { token: string } }) {
  try {
    await dbConnect();
    const token = params.token;
    const body = await req.json().catch(() => ({}));
    const passcode = body.passcode || '';

    const shareLink = await ShareLink.findOne({ token });
    if (!shareLink) {
      return NextResponse.json({ error: 'Share link not found or invalid' }, { status: 404 });
    }

    if (shareLink.isRevoked) {
      return NextResponse.json(
        { error: 'This customer link has been revoked by ALYORA Real Estate management.' },
        { status: 403 }
      );
    }

    if (shareLink.expiresAt && new Date() > new Date(shareLink.expiresAt)) {
      return NextResponse.json(
        { error: 'This customer link has expired.' },
        { status: 410 }
      );
    }

    if (shareLink.passcode && shareLink.passcode.trim() !== '') {
      if (passcode.trim() !== shareLink.passcode.trim()) {
        return NextResponse.json({ error: 'Incorrect passcode' }, { status: 401 });
      }
    }

    const property = await Property.findById(shareLink.propertyId);
    if (!property) {
      return NextResponse.json({ error: 'Associated property not found' }, { status: 404 });
    }

    shareLink.viewsCount += 1;
    await shareLink.save();

    const userAgent = req.headers.get('user-agent') || 'Unknown Browser';
    const ipAddress = req.headers.get('x-forwarded-for') || '127.0.0.1';

    await AuditLog.create({
      shareLinkId: shareLink._id,
      propertyId: property._id,
      action: 'LINK_VIEWED',
      performedBy: shareLink.leadName ? `CUSTOMER (${shareLink.leadName})` : 'CUSTOMER',
      userAgent,
      ipAddress,
      notes: `Share link unlocked with passcode and viewed (Total views: ${shareLink.viewsCount})`,
    });

    const filteredProperty = filterSharedProperty(property, shareLink);

    return NextResponse.json({
      success: true,
      property: filteredProperty,
      leadName: shareLink.leadName,
      leadPhone: shareLink.leadPhone,
      leadEmail: shareLink.leadEmail,
      salespersonId: shareLink.salespersonId,
      expiresAt: shareLink.expiresAt,
      permissions: shareLink.permissions,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to process share link';
    console.error('Shared property POST error:', errorMsg);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
