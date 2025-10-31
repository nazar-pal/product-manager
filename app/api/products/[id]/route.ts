import { db } from '@/db'
import { products } from '@/db/schema'
import {
  ensureJsonRequest,
  parseJsonBody,
  sqliteToHttpError,
  validateIdParam
} from '@/lib/http'
import { tryCatch } from '@/lib/try-catch'
import { eq } from 'drizzle-orm'
import { createUpdateSchema } from 'drizzle-zod'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

type ReqContext = RouteContext<'/api/products/[id]'>

export async function GET(_req: NextRequest, ctx: ReqContext) {
  const params = await ctx.params

  const idError = validateIdParam(params.id, 'product')
  if (idError) return idError

  const [dbError, row] = tryCatch(() =>
    db.select().from(products).where(eq(products.id, params.id)).get()
  )

  if (dbError) return sqliteToHttpError(dbError, 'Failed to fetch product')

  if (!row)
    return NextResponse.json({ error: 'Product not found' }, { status: 404 })

  return NextResponse.json(row)
}

export async function PATCH(req: NextRequest, ctx: ReqContext) {
  const params = await ctx.params

  const idError = validateIdParam(params.id, 'product')
  if (idError) return idError

  const contentTypeError = ensureJsonRequest(req)
  if (contentTypeError) return contentTypeError

  const [jsonErr, body] = await parseJsonBody(req)
  if (jsonErr) return jsonErr

  const { success, data, error } = createUpdateSchema(products, {
    name: z.string().trim().min(1),
    price: z.number().int().min(0),
    categoryName: z.string().trim().min(1)
  })
    .omit({ id: true })
    .safeParse(body)

  if (!success)
    return NextResponse.json({ error: error.message }, { status: 422 })

  const keys = Object.keys(data)
  if (keys.length === 0)
    return NextResponse.json(
      { error: 'No valid fields to update' },
      { status: 422 }
    )

  const [dbError, updated] = tryCatch(() =>
    db
      .update(products)
      .set(data)
      .where(eq(products.id, params.id))
      .returning()
      .get()
  )

  if (dbError) {
    const message = (dbError as unknown as { message?: string })?.message || ''
    if (message.includes('CHECK constraint failed'))
      return NextResponse.json(
        { error: 'Validation failed for product update' },
        { status: 422 }
      )

    if (message.includes('FOREIGN KEY constraint failed'))
      return NextResponse.json(
        { error: 'categoryName does not exist' },
        { status: 422 }
      )

    return sqliteToHttpError(dbError, 'Failed to update product')
  }

  if (!updated)
    return NextResponse.json({ error: 'Product not found' }, { status: 404 })

  return NextResponse.json(updated)
}

export async function DELETE(_req: NextRequest, ctx: ReqContext) {
  const params = await ctx.params

  const idError = validateIdParam(params.id, 'product')
  if (idError) return idError

  const [dbError, runResult] = tryCatch(() =>
    db.delete(products).where(eq(products.id, params.id)).run()
  )

  if (dbError) return sqliteToHttpError(dbError, 'Failed to delete product')

  if (runResult.changes === 0)
    return NextResponse.json({ error: 'Product not found' }, { status: 404 })

  return new NextResponse(null, { status: 204 })
}
