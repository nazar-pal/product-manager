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
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import type { Product } from '@/db/schema'
import {
  useCategoriesQuery,
  useCreateProductMutation,
  useUpdateProductMutation
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
    .min(5, 'Назва товару повинна містити щонайменше 5 символів.')
    .max(32, 'Назва товару повинна містити не більше 32 символів.'),
  price: z
    .number({
      message: 'Ціна повинна бути числом.'
    })
    .min(0, 'Ціна повинна бути не менше 0.')
    .int('Ціна повинна бути цілим числом.'),
  categoryName: z.string().trim().min(1, 'Будь ласка, виберіть категорію.')
})

export function DialogFormProduct({
  children,
  product
}: {
  children: ReactNode
  product?: Product
}) {
  const {
    data: categories,
    isLoading: areCategoriesLoading,
    error: categoriesError
  } = useCategoriesQuery()
  const { mutate: createProduct, isPending: isCreating } =
    useCreateProductMutation()
  const { mutate: updateProduct, isPending: isUpdating } =
    useUpdateProductMutation()
  const [open, setOpen] = useState(false)
  const isEdit = Boolean(product)
  const isSubmitting = isCreating || isUpdating

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: product?.name ?? '',
      price: product?.price ?? 0,
      categoryName: product?.categoryName ?? ''
    }
  })

  function onSubmit(data: z.infer<typeof formSchema>) {
    if (product) {
      updateProduct(
        { id: product.id, ...data },
        {
          onSuccess: () => {
            form.reset()
            toast.success('Товар успішно оновлено')
            setOpen(false)
          },
          onError: err => toast.error(err.message)
        }
      )
    } else {
      createProduct(data, {
        onSuccess: () => {
          form.reset()
          toast.success('Товар успішно додано')
          setOpen(false)
        },
        onError: err => toast.error(err.message)
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className="sm:max-w-[425px]"
        aria-busy={isSubmitting}
        showCloseButton={!isSubmitting}
      >
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Оновити товар' : 'Додати товар'}</DialogTitle>
          <DialogDescription>
            Введіть назву товару, ціну та виберіть категорію та натисніть кнопку
            &quot;{isEdit ? 'Оновити' : 'Додати'}&quot;.
          </DialogDescription>
        </DialogHeader>

        <div>
          <form id="form-product" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-product-name">
                      Назва товару
                    </FieldLabel>
                    <Input
                      {...field}
                      id="form-product-name"
                      aria-invalid={fieldState.invalid}
                      placeholder="Введіть назву товару"
                      autoComplete="off"
                      disabled={isSubmitting}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="price"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-product-price">Ціна</FieldLabel>
                    <Input
                      {...field}
                      id="form-product-price"
                      type="number"
                      min="0"
                      step="1"
                      aria-invalid={fieldState.invalid}
                      placeholder="0"
                      autoComplete="off"
                      disabled={isSubmitting}
                      value={
                        field.value === undefined || field.value === null
                          ? ''
                          : field.value
                      }
                      onChange={e => {
                        const value = e.target.value
                        field.onChange(value === '' ? 0 : Number(value))
                      }}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="categoryName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    orientation="responsive"
                    data-invalid={fieldState.invalid}
                  >
                    <FieldContent>
                      <FieldLabel htmlFor="form-product-category">
                        Категорія
                      </FieldLabel>
                      <FieldDescription>
                        Виберіть категорію для цього товару.
                      </FieldDescription>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                      {categoriesError && (
                        <FieldError
                          errors={[{ message: categoriesError.message }]}
                        />
                      )}
                    </FieldContent>
                    <Select
                      name={field.name}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger
                        id="form-product-category"
                        aria-invalid={fieldState.invalid}
                        className="min-w-[120px]"
                        disabled={
                          areCategoriesLoading ||
                          !!categoriesError ||
                          isSubmitting
                        }
                      >
                        <SelectValue
                          placeholder={
                            areCategoriesLoading
                              ? 'Завантаження…'
                              : categoriesError
                                ? 'Недоступно'
                                : 'Виберіть категорію'
                          }
                        />
                      </SelectTrigger>
                      <SelectContent position="item-aligned">
                        {categories?.map(category => (
                          <SelectItem key={category.name} value={category.name}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                form.reset()
                if (isEdit) setOpen(false)
              }}
              disabled={isSubmitting}
            >
              {isEdit ? 'Скасувати' : 'Скинути'}
            </Button>
            <Button
              type="submit"
              form="form-product"
              disabled={
                isSubmitting || areCategoriesLoading || Boolean(categoriesError)
              }
            >
              {isSubmitting ? 'Збереження…' : isEdit ? 'Оновити' : 'Додати'}
            </Button>
          </Field>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
