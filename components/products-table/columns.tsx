'use client'
'use no memo'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { ColumnDef } from '@tanstack/react-table'
import { EllipsisVertical, Pencil, Trash } from 'lucide-react'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { DataTableColumnHeader } from './data-table-column-header'

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Product = {
  id: string
  name: string
  price: number
  categoryName: string
}

export const columns: ColumnDef<Product>[] = [
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
          <Dialog>
            <form>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Pencil className="size-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Редагувати товар</DialogTitle>
                  <DialogDescription>Змініть дані товару.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4">
                  <div className="grid gap-3">
                    <Label htmlFor="name-1">Назва</Label>
                    <Input
                      id="name-1"
                      name="name"
                      defaultValue={product.name}
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="username-1">Ціна</Label>
                    <Input
                      id="username-1"
                      name="price"
                      defaultValue={product.price}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Скасувати</Button>
                  </DialogClose>
                  <Button type="submit">Зберегти зміни</Button>
                </DialogFooter>
              </DialogContent>
            </form>
          </Dialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Trash className="size-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Ви впевнені?</AlertDialogTitle>
                <AlertDialogDescription>
                  Цю дію не можна скасувати. Товар буде остаточно видалено з
                  бази даних.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Скасувати</AlertDialogCancel>
                <AlertDialogAction>Продовжити</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )
    }
  }
]
