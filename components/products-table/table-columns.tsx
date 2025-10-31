'use client'
'use no memo'

import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Product } from '@/db/schema'
import { ColumnDef } from '@tanstack/react-table'
import { EllipsisVertical, Pencil, Trash } from 'lucide-react'
import { DialogDeleteProduct } from '../dialog-delete-product'
import { DialogFormProduct } from '../dialog-form-product'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { DataTableColumnHeader } from './data-table-column-header'

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
    enableHiding: false
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Товар" />
    ),
    sortingFn: 'text'
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
    sortingFn: 'alphanumeric'
  },
  {
    accessorKey: 'categoryName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Категорія" />
    ),
    filterFn: (row, id, value) =>
      (value as string[]).includes(row.getValue(id)),
    sortingFn: 'text'
  },
  {
    id: 'actions',
    header: ({ table }) => {
      const selectedRows = table.getFilteredSelectedRowModel().rows.length
      return (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                disabled={!selectedRows}
              >
                <EllipsisVertical
                  className={
                    'size-4 rotate-90' + (selectedRows ? '' : ' opacity-50')
                  }
                />
                {Boolean(selectedRows) && (
                  <Badge className="absolute top-0 right-0 p-0 m-0 size-4">
                    {selectedRows}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Змінити категорію</DropdownMenuItem>
              <DropdownMenuItem>Видалити товар</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
    }
  }
]
