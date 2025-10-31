'use client'
'use no memo'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Product } from '@/db/schema'
import { Table } from '@tanstack/react-table'
import { EllipsisVertical } from 'lucide-react'
import { useState } from 'react'
import { DialogBulkDeleteProducts } from '../dialog-bulk-delete-products'
import { DialogBulkUpdateCategory } from '../dialog-bulk-update-category'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'

export function TableHeaderActions({ table }: { table: Table<Product> }) {
  const [openBulkDelete, setOpenBulkDelete] = useState(false)
  const [openBulkUpdate, setOpenBulkUpdate] = useState(false)
  const selectedRowModel = table.getFilteredSelectedRowModel()
  const selectedRows = selectedRowModel.rows.length
  const selectedIds = selectedRowModel.rows.map(r => r.original.id)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          disabled={!selectedRows}
        >
          <EllipsisVertical
            className={'size-4 rotate-90' + (selectedRows ? '' : ' opacity-50')}
          />
          {Boolean(selectedRows) && (
            <Badge className="absolute top-0 right-0 p-0 m-0 size-4">
              {selectedRows}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onSelect={() => {
            setOpenBulkUpdate(true)
          }}
        >
          Змінити категорію
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onSelect={() => {
            setOpenBulkDelete(true)
          }}
        >
          Видалити товар
        </DropdownMenuItem>
      </DropdownMenuContent>
      <DialogBulkUpdateCategory
        open={openBulkUpdate}
        onOpenChange={setOpenBulkUpdate}
        productIds={selectedIds}
        onSuccess={() => {
          table.setRowSelection({})
        }}
      />
      <DialogBulkDeleteProducts
        open={openBulkDelete}
        onOpenChange={setOpenBulkDelete}
        productIds={selectedIds}
        count={selectedRows}
        onSuccess={() => {
          table.setRowSelection({})
        }}
      />
    </DropdownMenu>
  )
}
