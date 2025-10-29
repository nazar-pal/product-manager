import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createCategory,
  createProduct,
  deleteCategory,
  deleteProduct,
  fetchCategories,
  fetchProducts,
  getCategory,
  getProduct,
  updateCategory,
  updateProduct
} from './api'

const QUERY_KEYS = {
  categories: ['categories'] as const,
  products: ['products'] as const,
  category: (name: string) => ['categories', name] as const,
  product: (id: string) => ['products', id] as const
}

// Queries
export const useCategoriesQuery = () =>
  useQuery({
    queryKey: QUERY_KEYS.categories,
    queryFn: ({ signal }) => fetchCategories({ signal })
  })

export const useProductsQuery = () =>
  useQuery({
    queryKey: QUERY_KEYS.products,
    queryFn: ({ signal }) => fetchProducts({ signal })
  })

export const useCategoryQuery = (
  name: string,
  enabled: boolean = Boolean(name)
) =>
  useQuery({
    queryKey: QUERY_KEYS.category(name),
    queryFn: ({ signal }) => getCategory(name, { signal }),
    enabled
  })

export const useProductQuery = (id: string, enabled: boolean = Boolean(id)) =>
  useQuery({
    queryKey: QUERY_KEYS.product(id),
    queryFn: ({ signal }) => getProduct(id, { signal }),
    enabled
  })

// Mutations
export const useCreateCategoryMutation = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (name: string) => createCategory(name),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEYS.categories })
  })
}

export const useUpdateCategoryMutation = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (params: { name: string; newName?: string }) =>
      updateCategory(params),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEYS.categories })
  })
}

export const useDeleteCategoryMutation = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (name: string) => deleteCategory(name),
    onSuccess: async () => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: QUERY_KEYS.categories }),
        qc.invalidateQueries({ queryKey: QUERY_KEYS.products })
      ])
    }
  })
}

export const useCreateProductMutation = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (product: {
      name: string
      price: number
      categoryName: string
    }) => createProduct(product),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEYS.products })
  })
}

export const useUpdateProductMutation = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (params: {
      id: string
      name?: string
      price?: number
      categoryName?: string
    }) => updateProduct(params),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEYS.products })
  })
}

export const useDeleteProductMutation = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.products })
    }
  })
}
