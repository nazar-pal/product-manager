'use client'
'use no memo'

import { Checkbox } from '@/components/ui/checkbox'
import { Product } from '@/db/schema'
import { ColumnDef } from '@tanstack/react-table'
import { Pencil, Trash } from 'lucide-react'
import { DialogDeleteProduct } from '../dialog-delete-product'
import { DialogFormProduct } from '../dialog-form-product'
import { Button } from '../ui/button'
import { DataTableColumnHeader } from './table-column-header'
import { TableHeaderActions } from './table-header-actions'

export const tableColumns: ColumnDef<Product>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Вибрати все"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={value => row.toggleSelected(!!value)}
        aria-label="Вибрати рядок"
      />
    ),
    enableSorting: false,
    enableHiding: false,
    size: 50
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Товар" />
    ),
    sortingFn: 'text',
    size: 250
  },
  {
    accessorKey: 'price',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ціна" />
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('price'))
      const formatted = new Intl.NumberFormat('uk-UA', {
        style: 'currency',
        currency: 'UAH'
      }).format(amount)

      return <div className="font-medium">{formatted}</div>
    },
    sortingFn: 'alphanumeric',
    size: 150
  },
  {
    accessorKey: 'categoryName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Категорія" />
    ),
    filterFn: (row, id, value) =>
      (value as string[]).includes(row.getValue(id)),
    sortingFn: 'text',
    size: 150
  },
  {
    id: 'actions',
    header: ({ table }) => {
      return (
        <div className="text-right">
          <TableHeaderActions table={table} />
        </div>
      )
    },
    cell: ({ row }) => {
      const product = row.original

      return (
        <div className="flex items-center gap-2 justify-end">
          <DialogFormProduct product={product}>
            <Button variant="ghost" size="icon">
              <Pencil className="size-4" />
            </Button>
          </DialogFormProduct>

          <DialogDeleteProduct product={product}>
            <Button variant="ghost" size="icon">
              <Trash className="size-4" />
            </Button>
          </DialogDeleteProduct>
        </div>
      )
    },
    size: 80
  }
]
