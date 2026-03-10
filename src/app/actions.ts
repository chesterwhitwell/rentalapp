'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { createClient } from '@/lib/supabase/server';
import { authSchema } from '@/lib/validation/auth';
import { propertySchema } from '@/lib/validation/property';
import { createProperty, updateProperty } from '@/lib/db/properties';
import { requireUser } from '@/lib/auth/session';
import { ensureDefaultOrganisation } from '@/lib/auth/organisation';

export async function signInAction(formData: FormData) {
  const supabase = await createClient();
  const payload = authSchema.parse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  const { error } = await supabase.auth.signInWithPassword(payload);
  if (error) {
    return { error: error.message };
  }

  await ensureDefaultOrganisation();
  redirect('/dashboard');
}

export async function signUpAction(formData: FormData) {
  const supabase = await createClient();
  const payload = authSchema.parse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  const { error } = await supabase.auth.signUp(payload);
  if (error) {
    return { error: error.message };
  }

  redirect('/sign-in');
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/sign-in');
}

export async function createPropertyAction(formData: FormData) {
  const user = await requireUser();

  const payload = propertySchema.parse({
    name: formData.get('name'),
    address_line_1: formData.get('address_line_1') || undefined,
    address_line_2: formData.get('address_line_2') || undefined,
    suburb: formData.get('suburb') || undefined,
    city: formData.get('city') || undefined,
    postcode: formData.get('postcode') || undefined,
    country: formData.get('country') || 'New Zealand',
    notes: formData.get('notes') || undefined,
    active: formData.get('active') === 'on',
  });

  await createProperty(payload, user.id);
  revalidatePath('/properties');
  redirect('/properties');
}

export async function updatePropertyAction(propertyId: string, formData: FormData) {
  const user = await requireUser();
  const payload = propertySchema.parse({
    name: formData.get('name'),
    address_line_1: formData.get('address_line_1') || undefined,
    address_line_2: formData.get('address_line_2') || undefined,
    suburb: formData.get('suburb') || undefined,
    city: formData.get('city') || undefined,
    postcode: formData.get('postcode') || undefined,
    country: formData.get('country') || 'New Zealand',
    notes: formData.get('notes') || undefined,
    active: formData.get('active') === 'on',
  });

  await updateProperty(propertyId, payload, user.id);
  revalidatePath('/properties');
  redirect('/properties');
}
