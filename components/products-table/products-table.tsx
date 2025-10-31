'use client'

import { useProductsQuery } from '@/lib/hooks'
import { DataTable } from './data-table'
import { tableColumns } from './table-columns'

export function ProductsTable() {
  const { data: products, isLoading } = useProductsQuery()

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold text-foreground">Товари</h3>
      {isLoading ? (
        <div className="mt-4 rounded-lg border border-dashed border-border bg-card/50 p-8 text-center">
          <p className="text-sm text-muted-foreground">
            Завантаження товарів...
          </p>
        </div>
      ) : (
        <DataTable columns={tableColumns} data={products ?? []} />
      )}
    </div>
  )
}
