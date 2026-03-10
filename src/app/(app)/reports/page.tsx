import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function PlaceholderPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Coming next</CardTitle>
        <CardDescription>This module is scaffolded and ready for implementation.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">This empty state is intentionally simple for MVP sequencing.</p>
      </CardContent>
    </Card>
  );
}
