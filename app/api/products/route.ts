import { db } from '@/db'
import { products } from '@/db/schema'
import { ensureJsonRequest, parseJsonBody, sqliteToHttpError } from '@/lib/http'
import { tryCatch } from '@/lib/try-catch'
import { createInsertSchema } from 'drizzle-zod'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

export async function GET() {
  const [dbError, rows] = tryCatch(() => db.select().from(products).all())

  if (dbError) return sqliteToHttpError(dbError, 'Failed to fetch products')

  return NextResponse.json(rows)
}

export async function POST(req: NextRequest) {
  const contentTypeError = ensureJsonRequest(req)
  if (contentTypeError) return contentTypeError

  const [jsonErr, body] = await parseJsonBody(req)
  if (jsonErr) return jsonErr

  const { success, data, error } = createInsertSchema(products, {
    name: z.string().trim().min(1),
    price: z.number().int().min(0),
    categoryName: z.string().trim().min(1)
  })
    .omit({ id: true })
    .safeParse(body)

  if (!success)
    return NextResponse.json({ error: error.message }, { status: 422 })

  const id = crypto.randomUUID()

  const [insertErr, inserted] = tryCatch(() =>
    db
      .insert(products)
      .values({ id, ...data })
      .returning()
      .get()
  )

  if (insertErr) {
    const message =
      (insertErr as unknown as { message?: string })?.message || ''

    if (message.includes('CHECK constraint failed'))
      return NextResponse.json(
        { error: 'Validation failed for product creation' },
        { status: 422 }
      )

    if (message.includes('FOREIGN KEY constraint failed'))
      return NextResponse.json(
        { error: 'categoryName does not exist' },
        { status: 422 }
      )

    return sqliteToHttpError(insertErr, 'Failed to create product')
  }

  return NextResponse.json(inserted, {
    status: 201,
    headers: {
      Location: `/api/products/${encodeURIComponent(inserted.id)}`
    }
  })
}
