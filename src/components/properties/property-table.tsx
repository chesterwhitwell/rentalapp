'use client';

import Link from 'next/link';
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Property } from '@/lib/db/types';

const columns: ColumnDef<Property>[] = [
  { accessorKey: 'name', header: 'Name' },
  {
    accessorKey: 'city',
    header: 'Address',
    cell: ({ row }) => {
      const p = row.original;
      return [p.address_line_1, p.suburb, p.city].filter(Boolean).join(', ') || '—';
    },
  },
  {
    accessorKey: 'active',
    header: 'Status',
    cell: ({ getValue }) => (getValue<boolean>() ? 'Active' : 'Archived'),
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => (
      <Button asChild size="sm" variant="outline">
        <Link href={`/properties/${row.original.id}/edit`}>Edit</Link>
      </Button>
    ),
  },
];

export function PropertyTable({ data }: { data: Property[] }) {
  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() });

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id}>
                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.map((row) => (
          <TableRow key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
