import { z } from 'zod';

export const propertySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  address_line_1: z.string().optional(),
  address_line_2: z.string().optional(),
  suburb: z.string().optional(),
  city: z.string().optional(),
  postcode: z.string().optional(),
  country: z.string().default('New Zealand'),
  notes: z.string().optional(),
  active: z.boolean().default(true),
});

export type PropertyInput = z.infer<typeof propertySchema>;
