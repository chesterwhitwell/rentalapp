import { NextResponse } from 'next/server';

import { requireUser } from '@/lib/auth/session';
import { createProperty, listProperties } from '@/lib/db/properties';
import { propertySchema } from '@/lib/validation/property';

export async function GET() {
  await requireUser();
  const data = await listProperties();
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const user = await requireUser();
  const body = await request.json();
  const parsed = propertySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  await createProperty(parsed.data, user.id);
  return NextResponse.json({ ok: true });
}
