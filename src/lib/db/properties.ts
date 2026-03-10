import { createClient } from '@/lib/supabase/server';
import { getActiveOrganisationId } from '@/lib/auth/organisation';
import { propertySchema, type PropertyInput } from '@/lib/validation/property';

export async function listProperties() {
  const organisationId = await getActiveOrganisationId();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('organisation_id', organisationId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getProperty(propertyId: string) {
  const organisationId = await getActiveOrganisationId();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('organisation_id', organisationId)
    .eq('id', propertyId)
    .single();

  if (error) throw error;
  return data;
}

export async function createProperty(input: PropertyInput, userId: string) {
  const parsed = propertySchema.parse(input);
  const organisationId = await getActiveOrganisationId();
  const supabase = await createClient();

  const { error } = await supabase.from('properties').insert({
    ...parsed,
    organisation_id: organisationId,
    created_by: userId,
    updated_by: userId,
  });

  if (error) throw error;
}

export async function updateProperty(propertyId: string, input: PropertyInput, userId: string) {
  const parsed = propertySchema.parse(input);
  const organisationId = await getActiveOrganisationId();
  const supabase = await createClient();

  const { error } = await supabase
    .from('properties')
    .update({ ...parsed, updated_by: userId })
    .eq('organisation_id', organisationId)
    .eq('id', propertyId);

  if (error) throw error;
}
