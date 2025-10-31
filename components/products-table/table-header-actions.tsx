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
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'

export function TableHeaderActions({ table }: { table: Table<Product> }) {
  const selectedRows = table.getFilteredSelectedRowModel().rows.length
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
        <DropdownMenuItem>Змінити категорію</DropdownMenuItem>
        <DropdownMenuItem>Видалити товар</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
