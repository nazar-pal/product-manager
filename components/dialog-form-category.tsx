'use client'

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
  FieldError,
  FieldGroup,
  FieldLabel
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import type { Category } from '@/db/schema'
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation
} from '@/lib/hooks'
import { zodResolver } from '@hookform/resolvers/zod'
import { ReactNode, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

const formSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Назва категорії повинна містити щонайменше 1 символ.')
    .max(32, 'Назва категорії повинна містити не більше 32 символів.')
})

export function DialogFormCategory({
  children,
  category
}: {
  children: ReactNode
  category?: Category
}) {
  const { mutate: createCategory, isPending: isCreating } =
    useCreateCategoryMutation()
  const { mutate: updateCategory, isPending: isUpdating } =
    useUpdateCategoryMutation()
  const [open, setOpen] = useState(false)
  const isEdit = Boolean(category)
  const isSubmitting = isCreating || isUpdating

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: category?.name ?? '' }
  })

  function onSubmit(data: z.infer<typeof formSchema>) {
    if (category) {
      updateCategory(
        { name: category.name, newName: data.name },
        {
          onSuccess: () => {
            toast.success('Категорію успішно оновлено')
            setOpen(false)
          },
          onError: err => toast.error(err.message)
        }
      )
    } else {
      createCategory(data.name, {
        onSuccess: () => {
          form.reset()
          toast.success('Категорію успішно додано')
          setOpen(false)
        },
        onError: err => toast.error(err.message)
      })
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={nextOpen => {
        setOpen(nextOpen)
        if (nextOpen) form.reset({ name: category?.name ?? '' })
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className="sm:max-w-[425px]"
        aria-busy={isSubmitting}
        showCloseButton={!isSubmitting}
      >
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Оновити категорію' : 'Додати категорію'}
          </DialogTitle>
          <DialogDescription>
            Введіть назву категорії та натисніть кнопку &quot;
            {isEdit ? 'Оновити' : 'Додати'}&quot;.
          </DialogDescription>
        </DialogHeader>

        <div>
          <form id="form-category" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-category-name">
                      Назва категорії
                    </FieldLabel>
                    <Input
                      {...field}
                      id="form-category-name"
                      aria-invalid={fieldState.invalid}
                      placeholder="Введіть назву категорії"
                      autoComplete="off"
                      disabled={isSubmitting}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </form>
        </div>

        <DialogFooter>
          <Field orientation="horizontal">
            <Button
              type="button"
              variant={isEdit ? 'outline' : 'secondary'}
              onClick={() => {
                if (isEdit) setOpen(false)
                else form.reset()
              }}
              disabled={isSubmitting}
            >
              {isEdit ? 'Скасувати' : 'Скинути'}
            </Button>
            <Button type="submit" form="form-category" disabled={isSubmitting}>
              {isSubmitting ? 'Збереження…' : isEdit ? 'Оновити' : 'Додати'}
            </Button>
          </Field>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
