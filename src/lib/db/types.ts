export type AppRole = 'owner' | 'manager' | 'viewer';

export type Property = {
  id: string;
  organisation_id: string;
  name: string;
  address_line_1: string | null;
  address_line_2: string | null;
  suburb: string | null;
  city: string | null;
  postcode: string | null;
  country: string;
  notes: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
};
