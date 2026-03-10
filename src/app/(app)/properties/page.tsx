import Link from 'next/link';

import { PropertyTable } from '@/components/properties/property-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { listProperties } from '@/lib/db/properties';

export default async function PropertiesPage() {
  const properties = await listProperties();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Properties</CardTitle>
          <CardDescription>Manage your organisation's rental properties.</CardDescription>
        </div>
        <Button asChild>
          <Link href="/properties/new">Add property</Link>
        </Button>
      </CardHeader>
      <CardContent>
        {properties.length === 0 ? (
          <div className="rounded-md border border-dashed p-8 text-center">
            <p className="font-medium">No properties yet</p>
            <p className="mt-1 text-sm text-muted-foreground">Create your first property to start tracking finances.</p>
          </div>
        ) : (
          <PropertyTable data={properties} />
        )}
      </CardContent>
    </Card>
  );
}
