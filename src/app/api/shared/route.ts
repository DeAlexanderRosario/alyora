import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import { ShareLink } from '@/models/ShareLink';
import { Property } from '@/models/Property';
import { verifyAdminToken } from '@/lib/auth-server';

export async function GET(req: NextRequest) {
    try {
        const admin = verifyAdminToken(req);
        if (!admin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        // Fetch all share links and populate property information
        const links = await ShareLink.find()
            .populate({ path: 'propertyId', select: 'name location price image_url' })
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json(links);
    } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to fetch share links';
        console.error('ShareLinks GET error:', errorMsg);
        return NextResponse.json({ error: errorMsg }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const admin = verifyAdminToken(req);
        if (!admin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        if (!id) {
            return NextResponse.json({ error: 'Link ID is required' }, { status: 400 });
        }

        await dbConnect();
        await ShareLink.findByIdAndDelete(id);
        return NextResponse.json({ success: true });
    } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to delete share link';
        console.error('ShareLink DELETE error:', errorMsg);
        return NextResponse.json({ error: errorMsg }, { status: 500 });
    }
}
