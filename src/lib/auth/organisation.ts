import { createClient } from '@/lib/supabase/server';
import { requireUser } from '@/lib/auth/session';

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

export async function getMemberships() {
  const user = await requireUser();
  const supabase = await createClient();

  const { data } = await supabase
    .from('organisation_members')
    .select('organisation_id, role, organisations(id, name, slug)')
    .eq('user_id', user.id);

  return data ?? [];
}

export async function ensureDefaultOrganisation() {
  const user = await requireUser();
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from('organisation_members')
    .select('organisation_id')
    .eq('user_id', user.id)
    .limit(1)
    .maybeSingle();

  if (existing?.organisation_id) return existing.organisation_id;

  const name = user.user_metadata?.full_name ? `${user.user_metadata.full_name}'s Organisation` : 'My Organisation';
  const slug = `${slugify(name)}-${user.id.slice(0, 8)}`;

  const { data: org, error: orgError } = await supabase
    .from('organisations')
    .insert({ name, slug })
    .select('id')
    .single();

  if (orgError || !org) throw new Error('Failed to create organisation');

  const { error: memberError } = await supabase
    .from('organisation_members')
    .insert({ organisation_id: org.id, user_id: user.id, role: 'owner' });

  if (memberError) throw new Error('Failed to create organisation membership');

  return org.id;
}

export async function getActiveOrganisationId() {
  const supabase = await createClient();
  const user = await requireUser();
  await ensureDefaultOrganisation();

  const { data: profile } = await supabase
    .from('profiles')
    .select('active_organisation_id')
    .eq('id', user.id)
    .maybeSingle();

  if (profile?.active_organisation_id) return profile.active_organisation_id as string;

  const { data: firstMembership } = await supabase
    .from('organisation_members')
    .select('organisation_id')
    .eq('user_id', user.id)
    .limit(1)
    .single();

  return firstMembership.organisation_id as string;
}
