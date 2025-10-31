import { DialogFormCategory } from '@/components/dialog-form-category'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export function CategoriesHeader() {
  return (
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-semibold text-foreground">Категорії</h3>

      <DialogFormCategory>
        <Button className="ml-auto">
          <Plus className="size-4" />
          Додати категорію
        </Button>
      </DialogFormCategory>
    </div>
  )
}
