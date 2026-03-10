'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { propertySchema, type PropertyInput } from '@/lib/validation/property';

type Props = {
  mode: 'create' | 'edit';
  propertyId?: string;
  defaultValues?: PropertyInput;
};

export function PropertyForm({ mode, propertyId, defaultValues }: Props) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PropertyInput>({
    resolver: zodResolver(propertySchema),
    defaultValues: defaultValues ?? { country: 'New Zealand', active: true, name: '' },
  });

  const onSubmit = async (values: PropertyInput) => {
    setServerError(null);
    const endpoint = mode === 'create' ? '/api/properties' : `/api/properties/${propertyId}`;
    const method = mode === 'create' ? 'POST' : 'PUT';

    const response = await fetch(endpoint, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      setServerError('Failed to save property.');
      return;
    }

    router.push('/properties');
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" {...register('name')} />
        {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="address_line_1">Address line 1</Label>
          <Input id="address_line_1" {...register('address_line_1')} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="address_line_2">Address line 2</Label>
          <Input id="address_line_2" {...register('address_line_2')} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="suburb">Suburb</Label>
          <Input id="suburb" {...register('suburb')} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input id="city" {...register('city')} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="postcode">Postcode</Label>
          <Input id="postcode" {...register('postcode')} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Input id="country" {...register('country')} />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" {...register('notes')} />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" {...register('active')} />
        Active property
      </label>
      {serverError && <p className="text-sm text-red-600">{serverError}</p>}
      <Button disabled={isSubmitting} type="submit">{mode === 'create' ? 'Create property' : 'Save changes'}</Button>
    </form>
  );
}
