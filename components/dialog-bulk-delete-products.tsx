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
import { useBulkDeleteProductsMutation } from '@/lib/hooks'
import { ReactNode, useState } from 'react'
import { toast } from 'sonner'

export function DialogBulkDeleteProducts({
  children,
  productIds,
  count,
  open: openProp,
  onOpenChange,
  onSuccess
}: {
  children?: ReactNode
  productIds: string[]
  count: number
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onSuccess?: () => void
}) {
  const { mutate: bulkDelete, isPending } = useBulkDeleteProductsMutation()
  const [internalOpen, setInternalOpen] = useState(false)
  const isControlled = typeof openProp === 'boolean'
  const open = isControlled ? (openProp as boolean) : internalOpen
  const setOpen = (next: boolean) => {
    if (isControlled) onOpenChange?.(next)
    else setInternalOpen(next)
  }

  function onConfirm(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    bulkDelete(productIds, {
      onSuccess: () => {
        toast.success(
          `Успішно видалено ${count} ${count === 1 ? 'товар' : count < 5 ? 'товари' : 'товарів'}`
        )
        setOpen(false)
        onSuccess?.()
      },
      onError: err => toast.error(err.message)
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      {children ? (
        <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      ) : null}
      <AlertDialogContent aria-busy={isPending}>
        <AlertDialogHeader>
          <AlertDialogTitle>Ви впевнені?</AlertDialogTitle>
          <AlertDialogDescription>
            Цю дію не можна скасувати. Буде остаточно видалено {count}{' '}
            {count === 1 ? 'товар' : 'товари'}.
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
