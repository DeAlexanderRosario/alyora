import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { env } from './env';

export interface AdminPayload {
  id: string;
  email: string;
}

export function verifyAdminToken(req: NextRequest): AdminPayload | null {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as AdminPayload;
    return decoded;
  } catch {
    return null;
  }
}
