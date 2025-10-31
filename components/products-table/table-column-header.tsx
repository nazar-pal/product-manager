'use no memo'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Column } from '@tanstack/react-table'
import { ArrowDownIcon, ArrowUpIcon, ChevronsUpDownIcon } from 'lucide-react'

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>
  title: string
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>
  }

  return (
    <Button
      variant="ghost"
      type="button"
      onClick={() => column.toggleSorting()}
      size="sm"
      className="data-[state=open]:bg-accent -ml-3 h-8 "
    >
      <span>{title}</span>
      {column.getIsSorted() === 'desc' ? (
        <ArrowDownIcon className="ml-2 size-4" />
      ) : column.getIsSorted() === 'asc' ? (
        <ArrowUpIcon className="ml-2 size-4" />
      ) : (
        <ChevronsUpDownIcon className="ml-2 size-4" />
      )}
    </Button>
  )
}
