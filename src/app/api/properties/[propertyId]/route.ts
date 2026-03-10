import { NextResponse } from 'next/server';

import { requireUser } from '@/lib/auth/session';
import { getProperty, updateProperty } from '@/lib/db/properties';
import { propertySchema } from '@/lib/validation/property';

export async function GET(_request: Request, { params }: { params: { propertyId: string } }) {
  await requireUser();
  const property = await getProperty(params.propertyId);
  return NextResponse.json(property);
}

export async function PUT(request: Request, { params }: { params: { propertyId: string } }) {
  const user = await requireUser();
  const body = await request.json();
  const parsed = propertySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  await updateProperty(params.propertyId, parsed.data, user.id);
  return NextResponse.json({ ok: true });
}
