import { NextResponse } from 'next/server';

// Server-side password verification.
// Compares submitted password against ADMIN_SECRET env (never exposed to client).
export async function POST(request: Request) {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) {
    return NextResponse.json({ error: 'Admin not configured' }, { status: 500 });
  }

  let password = '';
  try {
    const body = await request.json();
    password = typeof body?.password === 'string' ? body.password : '';
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  if (!password || password !== secret) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  // On success, return the secret so the client can attach it to subsequent
  // /api/admin/content requests via the x-admin-secret header. The secret is
  // only handed out after a correct password is provided.
  return NextResponse.json({ ok: true, token: secret });
}
