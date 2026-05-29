import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { supabaseAdmin } from '@/lib/supabase-server';

// Server-side authorization: every request must carry x-admin-secret matching
// ADMIN_SECRET env. Without it, no CMS content is exposed (read or write).
function isAuthorized(request: Request): boolean {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  const provided = request.headers.get('x-admin-secret');
  return provided === secret;
}

// GET - return all content rows (auth required)
export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
  }

  const { data, error } = await supabaseAdmin
    .from('site_content')
    .select('*')
    .order('section')
    .order('field_order');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// PUT - batch upsert per section (auth required)
export async function PUT(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { section, fields } = body as {
      section: string;
      fields: Record<string, string>;
    };

    if (!section || !fields) {
      return NextResponse.json({ error: 'Missing section or fields' }, { status: 400 });
    }

    // Build upsert rows
    const rows = Object.entries(fields).map(([key, value]) => ({
      section,
      field_key: key,
      field_value: value,
    }));

    const { error } = await supabaseAdmin
      .from('site_content')
      .upsert(rows, { onConflict: 'section,field_key' });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Revalidate homepage so changes are visible immediately
    revalidatePath('/');

    return NextResponse.json({ ok: true, updated: rows.length });
  } catch (err) {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
}
