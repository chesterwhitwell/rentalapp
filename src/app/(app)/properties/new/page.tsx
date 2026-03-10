import { PropertyForm } from '@/components/properties/property-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function NewPropertyPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Add property</CardTitle>
      </CardHeader>
      <CardContent>
        <PropertyForm mode="create" />
      </CardContent>
    </Card>
  );
}
