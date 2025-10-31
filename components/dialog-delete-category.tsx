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
import type { Category } from '@/db/schema'
import { useDeleteCategoryMutation, useProductsQuery } from '@/lib/hooks'
import { ReactNode, useState } from 'react'
import { toast } from 'sonner'

export function DialogDeleteCategory({
  children,
  category
}: {
  children: ReactNode
  category: Category
}) {
  const { mutate: deleteCategory, isPending } = useDeleteCategoryMutation()
  const [open, setOpen] = useState(false)
  const { data: products } = useProductsQuery()
  const affectedCount =
    products?.filter(p => p.categoryName === category.name).length ?? 0

  function onConfirm(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    deleteCategory(category.name, {
      onSuccess: () => {
        toast.success('Категорію успішно видалено')
        setOpen(false)
      },
      onError: err => toast.error(err.message)
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Ви впевнені?</AlertDialogTitle>
          <AlertDialogDescription>
            Цю дію не можна скасувати. Категорію &quot;{category.name}&quot;
            буде остаточно видалено з бази даних. Усі повʼязані товари також
            буде видалено (усього: {affectedCount}).
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Скасувати</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={isPending}>
            {isPending ? 'Видалення…' : 'Продовжити'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
