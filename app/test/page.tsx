'use client'

import {
  useCategoriesQuery,
  useCategoryQuery,
  useCreateCategoryMutation,
  useCreateProductMutation,
  useDeleteCategoryMutation,
  useDeleteProductMutation,
  useProductQuery,
  useProductsQuery,
  useUpdateCategoryMutation,
  useUpdateProductMutation
} from '@/lib/hooks'
import { useState } from 'react'

export default function Home() {
  // Detail testers state
  const [categoryDetailName, setCategoryDetailName] = useState('')
  const [productDetailId, setProductDetailId] = useState('')

  // Category forms state
  const [newCategoryName, setNewCategoryName] = useState('')
  const [updateCategoryName, setUpdateCategoryName] = useState('')
  const [updateCategoryNewName, setUpdateCategoryNewName] = useState('')
  const [deleteCategoryName, setDeleteCategoryName] = useState('')

  // Product forms state
  const [newProductName, setNewProductName] = useState('')
  const [newProductPrice, setNewProductPrice] = useState('')
  const [newProductCategory, setNewProductCategory] = useState('')

  const [updateProductId, setUpdateProductId] = useState('')
  const [updateProductName, setUpdateProductName] = useState('')
  const [updateProductPrice, setUpdateProductPrice] = useState('')
  const [updateProductCategory, setUpdateProductCategory] = useState('')

  const [deleteProductId, setDeleteProductId] = useState('')

  // Queries
  const categoriesQ = useCategoriesQuery()
  const productsQ = useProductsQuery()
  const categoryDetailQ = useCategoryQuery(
    categoryDetailName,
    Boolean(categoryDetailName)
  )
  const productDetailQ = useProductQuery(
    productDetailId,
    Boolean(productDetailId)
  )

  // Mutations
  const createCategoryM = useCreateCategoryMutation()
  const updateCategoryM = useUpdateCategoryMutation()
  const deleteCategoryM = useDeleteCategoryMutation()
  const createProductM = useCreateProductMutation()
  const updateProductM = useUpdateProductMutation()
  const deleteProductM = useDeleteProductMutation()

  return (
    <div className="flex min-h-screen items-start justify-center bg-zinc-50 font-sans p-6 dark:bg-black">
      <main className="flex w-full max-w-5xl flex-col gap-8 py-6">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Консоль тестування API та хуків
        </h1>

        {/* Categories Panel */}
        <section className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-3 text-xl font-medium text-zinc-900 dark:text-zinc-50">
            Категорії
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* List */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-medium text-zinc-800 dark:text-zinc-100">
                  Усі категорії
                </h3>
                <button
                  className="rounded bg-zinc-800 px-3 py-1 text-sm text-white dark:bg-zinc-700"
                  onClick={() => categoriesQ.refetch()}
                >
                  Оновити
                </button>
              </div>
              {categoriesQ.isLoading ? (
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Завантаження…
                </p>
              ) : categoriesQ.isError ? (
                <p className="text-sm text-red-600">
                  {(categoriesQ.error as Error).message}
                </p>
              ) : (
                <ul className="space-y-1">
                  {(categoriesQ.data ?? []).map(c => (
                    <li
                      key={c.name}
                      className="rounded border border-zinc-200 p-2 text-sm dark:border-zinc-800"
                    >
                      {c.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Create / Update / Delete */}
            <div className="space-y-4">
              <form
                className="flex items-center gap-2"
                onSubmit={e => {
                  e.preventDefault()
                  if (!newCategoryName.trim()) return
                  createCategoryM.mutate(newCategoryName, {
                    onSuccess: () => setNewCategoryName('')
                  })
                }}
              >
                <input
                  className="w-full rounded border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                  placeholder="Нова назва категорії"
                  value={newCategoryName}
                  onChange={e => setNewCategoryName(e.target.value)}
                />
                <button
                  className="rounded bg-blue-600 px-3 py-2 text-sm text-white disabled:opacity-50"
                  disabled={createCategoryM.isPending}
                >
                  Створити
                </button>
              </form>
              {createCategoryM.isError && (
                <p className="text-sm text-red-600">
                  {(createCategoryM.error as Error).message}
                </p>
              )}

              <form
                className="grid grid-cols-2 gap-2"
                onSubmit={e => {
                  e.preventDefault()
                  if (!updateCategoryName.trim()) return
                  const payload: { name: string; newName?: string } = {
                    name: updateCategoryName.trim()
                  }
                  if (updateCategoryNewName.trim())
                    payload.newName = updateCategoryNewName.trim()
                  updateCategoryM.mutate(payload, {
                    onSuccess: () => setUpdateCategoryNewName('')
                  })
                }}
              >
                <input
                  className="rounded border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                  placeholder="Поточна назва"
                  value={updateCategoryName}
                  onChange={e => setUpdateCategoryName(e.target.value)}
                />
                <input
                  className="rounded border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                  placeholder="Нова назва (необов'язково)"
                  value={updateCategoryNewName}
                  onChange={e => setUpdateCategoryNewName(e.target.value)}
                />
                <button
                  className="col-span-2 rounded bg-amber-600 px-3 py-2 text-sm text-white disabled:opacity-50"
                  disabled={updateCategoryM.isPending}
                >
                  Оновити
                </button>
              </form>
              {updateCategoryM.isError && (
                <p className="text-sm text-red-600">
                  {(updateCategoryM.error as Error).message}
                </p>
              )}

              <form
                className="flex items-center gap-2"
                onSubmit={e => {
                  e.preventDefault()
                  if (!deleteCategoryName.trim()) return
                  deleteCategoryM.mutate(deleteCategoryName.trim(), {
                    onSuccess: () => setDeleteCategoryName('')
                  })
                }}
              >
                <input
                  className="w-full rounded border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                  placeholder="Назва категорії для видалення"
                  value={deleteCategoryName}
                  onChange={e => setDeleteCategoryName(e.target.value)}
                />
                <button
                  className="rounded bg-red-600 px-3 py-2 text-sm text-white disabled:opacity-50"
                  disabled={deleteCategoryM.isPending}
                >
                  Видалити
                </button>
              </form>
              {deleteCategoryM.isError && (
                <p className="text-sm text-red-600">
                  {(deleteCategoryM.error as Error).message}
                </p>
              )}
            </div>
          </div>

          {/* Category Detail Tester */}
          <div className="mt-6 border-t border-zinc-200 pt-4 dark:border-zinc-800">
            <h3 className="mb-2 font-medium text-zinc-800 dark:text-zinc-100">
              Деталі категорії
            </h3>
            <div className="flex items-center gap-2">
              <input
                className="w-64 rounded border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                placeholder="Назва категорії"
                value={categoryDetailName}
                onChange={e => setCategoryDetailName(e.target.value)}
              />
              <button
                className="rounded bg-zinc-800 px-3 py-2 text-sm text-white disabled:opacity-50 dark:bg-zinc-700"
                onClick={() => categoryDetailQ.refetch()}
                disabled={!categoryDetailName.trim()}
              >
                Отримати
              </button>
            </div>
            <div className="mt-2 text-sm">
              {categoryDetailQ.isFetching && (
                <p className="text-zinc-600 dark:text-zinc-400">
                  Завантаження…
                </p>
              )}
              {categoryDetailQ.isError && (
                <p className="text-red-600">
                  {(categoryDetailQ.error as Error).message}
                </p>
              )}
              {categoryDetailQ.data && (
                <pre className="rounded bg-zinc-100 p-2 dark:bg-zinc-800 dark:text-zinc-100">
                  {JSON.stringify(categoryDetailQ.data, null, 2)}
                </pre>
              )}
            </div>
          </div>
        </section>

        {/* Products Panel */}
        <section className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-3 text-xl font-medium text-zinc-900 dark:text-zinc-50">
            Товари
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* List */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-medium text-zinc-800 dark:text-zinc-100">
                  Усі товари
                </h3>
                <button
                  className="rounded bg-zinc-800 px-3 py-1 text-sm text-white dark:bg-zinc-700"
                  onClick={() => productsQ.refetch()}
                >
                  Оновити
                </button>
              </div>
              {productsQ.isLoading ? (
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Завантаження…
                </p>
              ) : productsQ.isError ? (
                <p className="text-sm text-red-600">
                  {(productsQ.error as Error).message}
                </p>
              ) : (
                <ul className="space-y-1">
                  {(productsQ.data ?? []).map(p => (
                    <li
                      key={p.id}
                      className="rounded border border-zinc-200 p-2 text-sm dark:border-zinc-800"
                    >
                      <div className="font-medium">{p.name}</div>
                      <div className="text-zinc-600 dark:text-zinc-400">
                        ідентифікатор: {p.id}
                      </div>
                      <div className="text-zinc-600 dark:text-zinc-400">
                        ціна: {p.price}
                      </div>
                      <div className="text-zinc-600 dark:text-zinc-400">
                        категорія: {p.categoryName}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Create / Update / Delete */}
            <div className="space-y-4">
              <form
                className="grid grid-cols-3 gap-2"
                onSubmit={e => {
                  e.preventDefault()
                  if (!newProductName.trim() || !newProductCategory.trim())
                    return
                  const priceNumber = newProductPrice.trim()
                    ? Number.parseInt(newProductPrice.trim(), 10)
                    : 0
                  createProductM.mutate(
                    {
                      name: newProductName.trim(),
                      price: priceNumber,
                      categoryName: newProductCategory.trim()
                    },
                    {
                      onSuccess: () => {
                        setNewProductName('')
                        setNewProductPrice('')
                        setNewProductCategory('')
                      }
                    }
                  )
                }}
              >
                <input
                  className="rounded border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                  placeholder="Назва товару"
                  value={newProductName}
                  onChange={e => setNewProductName(e.target.value)}
                />
                <input
                  className="rounded border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                  placeholder="Ціна (ціле число)"
                  value={newProductPrice}
                  onChange={e => setNewProductPrice(e.target.value)}
                />
                <input
                  className="rounded border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                  placeholder="Назва категорії"
                  value={newProductCategory}
                  onChange={e => setNewProductCategory(e.target.value)}
                />
                <button
                  className="col-span-3 rounded bg-blue-600 px-3 py-2 text-sm text-white disabled:opacity-50"
                  disabled={createProductM.isPending}
                >
                  Створити
                </button>
              </form>
              {createProductM.isError && (
                <p className="text-sm text-red-600">
                  {(createProductM.error as Error).message}
                </p>
              )}

              <form
                className="grid grid-cols-4 gap-2"
                onSubmit={e => {
                  e.preventDefault()
                  if (!updateProductId.trim()) return
                  const payload: {
                    id: string
                    name?: string
                    price?: number
                    categoryName?: string
                  } = { id: updateProductId.trim() }
                  if (updateProductName.trim())
                    payload.name = updateProductName.trim()
                  if (updateProductPrice.trim()) {
                    const v = Number.parseInt(updateProductPrice.trim(), 10)
                    if (!Number.isNaN(v)) payload.price = v
                  }
                  if (updateProductCategory.trim())
                    payload.categoryName = updateProductCategory.trim()
                  updateProductM.mutate(payload, {
                    onSuccess: () => {
                      setUpdateProductName('')
                      setUpdateProductPrice('')
                      setUpdateProductCategory('')
                    }
                  })
                }}
              >
                <input
                  className="rounded border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                  placeholder="ID товару"
                  value={updateProductId}
                  onChange={e => setUpdateProductId(e.target.value)}
                />
                <input
                  className="rounded border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                  placeholder="Нова назва (необов'язково)"
                  value={updateProductName}
                  onChange={e => setUpdateProductName(e.target.value)}
                />
                <input
                  className="rounded border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                  placeholder="Нова ціна (необов'язково)"
                  value={updateProductPrice}
                  onChange={e => setUpdateProductPrice(e.target.value)}
                />
                <input
                  className="rounded border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                  placeholder="Нова категорія (необов'язково)"
                  value={updateProductCategory}
                  onChange={e => setUpdateProductCategory(e.target.value)}
                />
                <button
                  className="col-span-4 rounded bg-amber-600 px-3 py-2 text-sm text-white disabled:opacity-50"
                  disabled={updateProductM.isPending}
                >
                  Оновити
                </button>
              </form>
              {updateProductM.isError && (
                <p className="text-sm text-red-600">
                  {(updateProductM.error as Error).message}
                </p>
              )}

              <form
                className="flex items-center gap-2"
                onSubmit={e => {
                  e.preventDefault()
                  if (!deleteProductId.trim()) return
                  deleteProductM.mutate(deleteProductId.trim(), {
                    onSuccess: () => setDeleteProductId('')
                  })
                }}
              >
                <input
                  className="w-full rounded border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                  placeholder="ID товару для видалення"
                  value={deleteProductId}
                  onChange={e => setDeleteProductId(e.target.value)}
                />
                <button
                  className="rounded bg-red-600 px-3 py-2 text-sm text-white disabled:opacity-50"
                  disabled={deleteProductM.isPending}
                >
                  Видалити
                </button>
              </form>
              {deleteProductM.isError && (
                <p className="text-sm text-red-600">
                  {(deleteProductM.error as Error).message}
                </p>
              )}
            </div>
          </div>

          {/* Product Detail Tester */}
          <div className="mt-6 border-t border-zinc-200 pt-4 dark:border-zinc-800">
            <h3 className="mb-2 font-medium text-zinc-800 dark:text-zinc-100">
              Деталі товару
            </h3>
            <div className="flex items-center gap-2">
              <input
                className="w-64 rounded border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                placeholder="ID товару"
                value={productDetailId}
                onChange={e => setProductDetailId(e.target.value)}
              />
              <button
                className="rounded bg-zinc-800 px-3 py-2 text-sm text-white disabled:opacity-50 dark:bg-zinc-700"
                onClick={() => productDetailQ.refetch()}
                disabled={!productDetailId.trim()}
              >
                Отримати
              </button>
            </div>
            <div className="mt-2 text-sm">
              {productDetailQ.isFetching && (
                <p className="text-zinc-600 dark:text-zinc-400">
                  Завантаження…
                </p>
              )}
              {productDetailQ.isError && (
                <p className="text-red-600">
                  {(productDetailQ.error as Error).message}
                </p>
              )}
              {productDetailQ.data && (
                <pre className="rounded bg-zinc-100 p-2 dark:bg-zinc-800 dark:text-zinc-100">
                  {JSON.stringify(productDetailQ.data, null, 2)}
                </pre>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
