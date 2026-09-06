import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import { Admin } from '@/models/Admin';
import { signupSchema } from '@/schemas/auth.schema';
import { env } from '@/lib/env';
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const parseResult = signupSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parseResult.error.flatten() },
        { status: 400 }
      );
    }

    const { email, password } = parseResult.data;
    const existing = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 400 });
    }

    const admin = await Admin.create({ email, password });
    const token = jwt.sign({ id: admin._id.toString(), email: admin.email }, env.JWT_SECRET, { expiresIn: '7d' });
    return NextResponse.json({ token, user: { id: admin._id.toString(), email: admin.email } }, { status: 201 });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Internal server error';
    console.error('Signup error:', errorMsg);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
