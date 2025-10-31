'use client'
'use no memo'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel
} from '@/components/ui/field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  useBulkUpdateProductsCategoryMutation,
  useCategoriesQuery
} from '@/lib/hooks'
import { ReactNode, useState } from 'react'
import { toast } from 'sonner'

export function DialogBulkUpdateCategory({
  children,
  productIds,
  open: openProp,
  onOpenChange,
  onSuccess
}: {
  children?: ReactNode
  productIds: string[]
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onSuccess?: () => void
}) {
  const { data: categories, isLoading, error } = useCategoriesQuery()
  const categoryNames = (categories ?? []).map(c => c.name)
  const { mutate: bulkUpdate, isPending } =
    useBulkUpdateProductsCategoryMutation()
  const [internalOpen, setInternalOpen] = useState(false)
  const isControlled = typeof openProp === 'boolean'
  const open = isControlled ? (openProp as boolean) : internalOpen
  const setOpen = (next: boolean) => {
    if (isControlled) onOpenChange?.(next)
    else setInternalOpen(next)
  }
  const [categoryName, setCategoryName] = useState('')

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!categoryName) return
    bulkUpdate(
      { ids: productIds, categoryName },
      {
        onSuccess: data => {
          const updated = data?.updated ?? productIds.length
          toast.success(
            `Категорію успішно змінено для ${updated} ${updated === 1 ? 'товару' : updated < 5 ? 'товарів' : 'товарів'}`
          )
          setCategoryName('')
          setOpen(false)
          onSuccess?.()
        },
        onError: err => toast.error(err.message)
      }
    )
  }

  return (
    <Dialog
      open={open}
      onOpenChange={nextOpen => {
        setOpen(nextOpen)
        if (nextOpen) setCategoryName('')
      }}
    >
      {children ? <DialogTrigger asChild>{children}</DialogTrigger> : null}
      <DialogContent
        className="sm:max-w-[425px]"
        aria-busy={isPending}
        showCloseButton={!isPending}
      >
        <DialogHeader>
          <DialogTitle>Змінити категорію</DialogTitle>
          <DialogDescription>
            Виберіть нову категорію для вибраних товарів.
          </DialogDescription>
        </DialogHeader>
        <form id="form-bulk-category" onSubmit={onSubmit}>
          <FieldGroup>
            <Field orientation="responsive">
              <FieldContent>
                <FieldLabel htmlFor="bulk-category">Категорія</FieldLabel>
                <FieldDescription>
                  Нову категорію буде застосовано до всіх вибраних товарів.
                </FieldDescription>
              </FieldContent>
              <Select
                value={categoryName}
                onValueChange={setCategoryName}
                name="categoryName"
              >
                <SelectTrigger
                  id="bulk-category"
                  className="min-w-[160px]"
                  disabled={isLoading || !!error || isPending}
                >
                  <SelectValue
                    placeholder={
                      isLoading
                        ? 'Завантаження…'
                        : error
                          ? 'Недоступно'
                          : 'Виберіть категорію'
                    }
                  />
                </SelectTrigger>
                <SelectContent position="item-aligned">
                  {categoryNames.map(name => (
                    <SelectItem key={name} value={name}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>
        </form>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isPending}
          >
            Скасувати
          </Button>
          <Button
            type="submit"
            form="form-bulk-category"
            disabled={isPending || isLoading || !!error || !categoryName}
          >
            {isPending ? 'Збереження…' : 'Зберегти'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
