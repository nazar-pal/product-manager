import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createCategory,
  createProduct,
  deleteCategory,
  deleteProduct,
  deleteProducts,
  fetchCategories,
  fetchProducts,
  getCategory,
  getProduct,
  updateCategory,
  updateProduct,
  updateProductsCategory
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
    onSuccess: () =>
      qc.invalidateQueries({
        queryKey: QUERY_KEYS.categories,
        exact: true
      })
  })
}

export const useUpdateCategoryMutation = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (params: { name: string; newName?: string }) =>
      updateCategory(params),
    onSuccess: async (_updated, variables) => {
      const invalidations = [
        qc.invalidateQueries({
          queryKey: QUERY_KEYS.categories,
          exact: true
        }),
        qc.invalidateQueries({
          queryKey: QUERY_KEYS.products,
          exact: true
        }),
        qc.invalidateQueries({
          queryKey: QUERY_KEYS.category(variables.name),
          exact: true
        })
      ]
      if (variables?.newName) {
        invalidations.push(
          qc.invalidateQueries({
            queryKey: QUERY_KEYS.category(variables.newName),
            exact: true
          })
        )
      }
      // Category rename cascades to products; ensure product details become stale
      invalidations.push(
        qc.invalidateQueries({
          predicate: q =>
            Array.isArray(q.queryKey) &&
            q.queryKey.length === 2 &&
            q.queryKey[0] === QUERY_KEYS.products[0]
        })
      )
      await Promise.all(invalidations)
    }
  })
}

export const useDeleteCategoryMutation = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (name: string) => deleteCategory(name),
    onSuccess: async (_data, name) => {
      await Promise.all([
        qc.invalidateQueries({
          queryKey: QUERY_KEYS.categories,
          exact: true
        }),
        qc.invalidateQueries({
          queryKey: QUERY_KEYS.products,
          exact: true
        }),
        qc.invalidateQueries({
          queryKey: QUERY_KEYS.category(name),
          exact: true
        }),
        // Deleting a category cascades to products; invalidate product details
        qc.invalidateQueries({
          predicate: q =>
            Array.isArray(q.queryKey) &&
            q.queryKey.length === 2 &&
            q.queryKey[0] === QUERY_KEYS.products[0]
        })
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
    onSuccess: () =>
      qc.invalidateQueries({
        queryKey: QUERY_KEYS.products,
        exact: true
      })
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
    onSuccess: async (_updated, variables) => {
      await Promise.all([
        qc.invalidateQueries({
          queryKey: QUERY_KEYS.products,
          exact: true
        }),
        qc.invalidateQueries({
          queryKey: QUERY_KEYS.product(variables.id),
          exact: true
        })
      ])
    }
  })
}

export const useDeleteProductMutation = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: async (_data, id) => {
      await Promise.all([
        qc.invalidateQueries({
          queryKey: QUERY_KEYS.products,
          exact: true
        }),
        qc.invalidateQueries({
          queryKey: QUERY_KEYS.product(id),
          exact: true
        })
      ])
    }
  })
}

export const useBulkDeleteProductsMutation = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (ids: string[]) => deleteProducts(ids),
    onSuccess: async (_data, ids) => {
      const invalidations = [
        qc.invalidateQueries({
          queryKey: QUERY_KEYS.products,
          exact: true
        }),
        ...ids.map(id =>
          qc.invalidateQueries({
            queryKey: QUERY_KEYS.product(id),
            exact: true
          })
        )
      ]
      await Promise.all(invalidations)
    }
  })
}

export const useBulkUpdateProductsCategoryMutation = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (params: { ids: string[]; categoryName: string }) =>
      updateProductsCategory(params),
    onSuccess: async (_data, { ids }) => {
      const invalidations = [
        qc.invalidateQueries({
          queryKey: QUERY_KEYS.products,
          exact: true
        }),
        ...ids.map(id =>
          qc.invalidateQueries({
            queryKey: QUERY_KEYS.product(id),
            exact: true
          })
        )
      ]
      await Promise.all(invalidations)
    }
  })
}
