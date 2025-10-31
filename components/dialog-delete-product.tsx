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
import type { Product } from '@/db/schema'
import { useDeleteProductMutation } from '@/lib/hooks'
import { ReactNode, useState } from 'react'
import { toast } from 'sonner'

export function DialogDeleteProduct({
  children,
  product
}: {
  children: ReactNode
  product: Product
}) {
  const { mutate: deleteProduct, isPending } = useDeleteProductMutation()
  const [open, setOpen] = useState(false)

  function onConfirm(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    deleteProduct(product.id, {
      onSuccess: () => {
        toast.success('Товар успішно видалено')
        setOpen(false)
      },
      onError: err => toast.error(err.message)
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent aria-busy={isPending}>
        <AlertDialogHeader>
          <AlertDialogTitle>Ви впевнені?</AlertDialogTitle>
          <AlertDialogDescription>
            Цю дію не можна скасувати. Товар &quot;{product.name}&quot; буде
            остаточно видалено з бази даних.
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
