'use client'

import { useProductsQuery } from '@/lib/hooks'
import { columns } from './columns'
import { DataTable } from './data-table'

export function ProductsTable() {
  const { data: products } = useProductsQuery()

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold text-foreground">Товари</h3>
      <DataTable columns={columns} data={products ?? []} />
    </div>
  )
}
