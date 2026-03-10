import { notFound } from 'next/navigation';
import { PropertyForm } from '@/components/properties/property-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getProperty } from '@/lib/db/properties';

export default async function EditPropertyPage({ params }: { params: { propertyId: string } }) {
  const property = await getProperty(params.propertyId).catch(() => null);
  if (!property) notFound();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit property</CardTitle>
      </CardHeader>
      <CardContent>
        <PropertyForm
          mode="edit"
          propertyId={property.id}
          defaultValues={{
            name: property.name,
            address_line_1: property.address_line_1 ?? undefined,
            address_line_2: property.address_line_2 ?? undefined,
            suburb: property.suburb ?? undefined,
            city: property.city ?? undefined,
            postcode: property.postcode ?? undefined,
            country: property.country,
            notes: property.notes ?? undefined,
            active: property.active,
          }}
        />
      </CardContent>
    </Card>
  );
}
