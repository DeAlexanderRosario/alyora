import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import { Admin } from '@/models/Admin';
import { loginSchema } from '@/schemas/auth.schema';
import { env } from '@/lib/env';
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const parseResult = loginSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parseResult.error.flatten() },
        { status: 400 }
      );
    }

    const { email, password } = parseResult.data;
    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (!admin) {
      return NextResponse.json({ error: 'Invalid login credentials' }, { status: 401 });
    }

    const valid = await admin.comparePassword(password);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid login credentials' }, { status: 401 });
    }

    const token = jwt.sign({ id: admin._id.toString(), email: admin.email }, env.JWT_SECRET, { expiresIn: '7d' });
    return NextResponse.json({ token, user: { id: admin._id.toString(), email: admin.email } });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Internal server error';
    console.error('Login error:', errorMsg);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
