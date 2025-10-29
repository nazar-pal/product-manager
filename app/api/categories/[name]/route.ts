import { db } from '@/db'
import { categories } from '@/db/schema'
import {
  ensureJsonRequest,
  parseJsonBody,
  sqliteToHttpError,
  validateNameParam
} from '@/lib/http'
import { tryCatch } from '@/lib/try-catch'
import { eq } from 'drizzle-orm'
import { createUpdateSchema } from 'drizzle-zod'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

type ReqContext = RouteContext<'/api/categories/[name]'>

export async function GET(_req: NextRequest, ctx: ReqContext) {
  const params = await ctx.params
  const name = params.name.trim()
  const nameError = validateNameParam(name, 'category')
  if (nameError) return nameError

  const [dbError, row] = tryCatch(() =>
    db.select().from(categories).where(eq(categories.name, name)).get()
  )

  if (dbError) return sqliteToHttpError(dbError, 'Failed to fetch category')

  if (!row)
    return NextResponse.json({ error: 'Category not found' }, { status: 404 })

  return NextResponse.json(row)
}

export async function PATCH(req: NextRequest, ctx: ReqContext) {
  const params = await ctx.params
  const name = params.name.trim()
  const nameError = validateNameParam(name, 'category')
  if (nameError) return nameError

  const contentTypeError = ensureJsonRequest(req)
  if (contentTypeError) return contentTypeError

  const [jsonErr, body] = await parseJsonBody(req)
  if (jsonErr) return jsonErr

  const { success, data, error } = createUpdateSchema(categories, {
    name: z.string().trim().min(1)
  }).safeParse(body)

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
      .update(categories)
      .set(data)
      .where(eq(categories.name, name))
      .returning()
      .get()
  )

  if (dbError) {
    const message = (dbError as unknown as { message?: string })?.message || ''
    if (
      message.includes('UNIQUE constraint failed') ||
      message.includes('PRIMARY KEY constraint failed')
    )
      return NextResponse.json(
        { error: 'Category already exists' },
        { status: 409 }
      )

    if (message.includes('FOREIGN KEY constraint failed'))
      return NextResponse.json(
        { error: 'Cannot rename category while products reference it' },
        { status: 409 }
      )

    if (message.includes('CHECK constraint failed'))
      return NextResponse.json(
        { error: 'Validation failed for category update' },
        { status: 422 }
      )

    return sqliteToHttpError(dbError, 'Failed to update category')
  }

  if (!updated)
    return NextResponse.json({ error: 'Category not found' }, { status: 404 })

  return NextResponse.json(updated)
}

export async function DELETE(_req: NextRequest, ctx: ReqContext) {
  const params = await ctx.params
  const name = params.name.trim()
  const nameError = validateNameParam(name, 'category')
  if (nameError) return nameError

  const [dbError, runResult] = tryCatch(() =>
    db.delete(categories).where(eq(categories.name, name)).run()
  )

  if (dbError) return sqliteToHttpError(dbError, 'Failed to delete category')

  if (runResult.changes === 0)
    return NextResponse.json({ error: 'Category not found' }, { status: 404 })

  return new NextResponse(null, { status: 204 })
}
