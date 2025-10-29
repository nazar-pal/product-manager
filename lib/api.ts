import type { Category, Product } from '@/db/schema'

type RequestOpts = { signal?: AbortSignal }

async function parseJsonOrThrow<T>(res: Response): Promise<T> {
  if (res.ok) return res.json() as Promise<T>
  let message = `HTTP ${res.status} ${res.statusText}`
  try {
    const data = (await res.json()) as unknown
    if (
      data !== null &&
      typeof data === 'object' &&
      'error' in data &&
      typeof (data as Record<string, unknown>).error === 'string'
    ) {
      message = (data as { error: string }).error
    }
  } catch {
    try {
      const text = await res.text()
      if (text) message = text
    } catch {}
  }
  throw new Error(message)
}

async function throwIfNotOk(res: Response): Promise<void> {
  if (res.ok) return
  // Reuse the same error shaping logic
  await parseJsonOrThrow<unknown>(res)
}

export const fetchCategories = async (
  options?: RequestOpts
): Promise<Category[]> => {
  const res = await fetch('/api/categories', {
    headers: { Accept: 'application/json' },
    signal: options?.signal
  })
  return parseJsonOrThrow<Category[]>(res)
}

export const fetchProducts = async (
  options?: RequestOpts
): Promise<Product[]> => {
  const res = await fetch('/api/products', {
    headers: { Accept: 'application/json' },
    signal: options?.signal
  })
  return parseJsonOrThrow<Product[]>(res)
}

export const createCategory = async (
  name: string,
  options?: RequestOpts
): Promise<Category> => {
  const res = await fetch('/api/categories', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({ name }),
    signal: options?.signal
  })
  return parseJsonOrThrow<Category>(res)
}

export const deleteCategory = async (
  name: string,
  options?: RequestOpts
): Promise<void> => {
  const res = await fetch(`/api/categories/${encodeURIComponent(name)}`, {
    method: 'DELETE',
    headers: { Accept: 'application/json' },
    signal: options?.signal
  })
  await throwIfNotOk(res)
}

export const updateCategory = async (
  params: { name: string; newName?: string },
  options?: RequestOpts
): Promise<Category> => {
  const { name, newName } = params
  const updates: Partial<Category> = {}
  if (typeof newName === 'string') updates.name = newName
  const res = await fetch(`/api/categories/${encodeURIComponent(name)}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify(updates),
    signal: options?.signal
  })
  return parseJsonOrThrow<Category>(res)
}

export const getCategory = async (
  name: string,
  options?: RequestOpts
): Promise<Category> => {
  const res = await fetch(`/api/categories/${encodeURIComponent(name)}`, {
    headers: { Accept: 'application/json' },
    signal: options?.signal
  })
  return parseJsonOrThrow<Category>(res)
}

export const createProduct = async (
  product: { name: string; price: number; categoryName: string },
  options?: RequestOpts
): Promise<Product> => {
  const res = await fetch('/api/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify(product),
    signal: options?.signal
  })
  return parseJsonOrThrow<Product>(res)
}

export const deleteProduct = async (
  id: string,
  options?: RequestOpts
): Promise<void> => {
  const res = await fetch(`/api/products/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: { Accept: 'application/json' },
    signal: options?.signal
  })
  await throwIfNotOk(res)
}

export const updateProduct = async (
  params: { id: string; name?: string; price?: number; categoryName?: string },
  options?: RequestOpts
): Promise<Product> => {
  const { id, ...updates } = params
  const res = await fetch(`/api/products/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify(updates),
    signal: options?.signal
  })
  return parseJsonOrThrow<Product>(res)
}

export const getProduct = async (
  id: string,
  options?: RequestOpts
): Promise<Product> => {
  const res = await fetch(`/api/products/${encodeURIComponent(id)}`, {
    headers: { Accept: 'application/json' },
    signal: options?.signal
  })
  return parseJsonOrThrow<Product>(res)
}
