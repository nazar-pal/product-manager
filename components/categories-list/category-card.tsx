import type { Category } from '@/db/schema'
import { Button } from '@/components/ui/button'
import { DialogFormCategory } from '@/components/dialog-form-category'
import { DialogDeleteCategory } from '@/components/dialog-delete-category'
import { Pencil, Trash2 } from 'lucide-react'

export function CategoryCard({ category }: { category: Category }) {
  return (
    <div className="group relative flex min-w-[200px] shrink-0 items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 py-3 shadow-sm transition-all hover:border-primary/50 hover:shadow-md">
      <span className="font-medium text-foreground">{category.name}</span>
      <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <DialogFormCategory category={category}>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <Pencil className="h-3.5 w-3.5" />
          </Button>
        </DialogFormCategory>
        <DialogDeleteCategory category={category}>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </DialogDeleteCategory>
      </div>
    </div>
  )
}
