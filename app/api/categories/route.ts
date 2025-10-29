import { db } from '@/db'
import { categories } from '@/db/schema'
import { ensureJsonRequest, parseJsonBody, sqliteToHttpError } from '@/lib/http'
import { tryCatch } from '@/lib/try-catch'
import { createInsertSchema } from 'drizzle-zod'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

export async function GET() {
  const [dbError, rows] = tryCatch(() => db.select().from(categories).all())

  if (dbError) return sqliteToHttpError(dbError, 'Failed to fetch categories')

  return NextResponse.json(rows)
}

export async function POST(req: NextRequest) {
  const contentTypeError = ensureJsonRequest(req)
  if (contentTypeError) return contentTypeError

  const [jsonErr, body] = await parseJsonBody(req)
  if (jsonErr) return jsonErr

  const { success, data, error } = createInsertSchema(categories, {
    name: z.string().trim().min(1)
  }).safeParse(body)
  if (!success)
    return NextResponse.json({ error: error.message }, { status: 422 })

  const [dbError, inserted] = tryCatch(() =>
    db.insert(categories).values(data).onConflictDoNothing().returning().get()
  )

  if (dbError) return sqliteToHttpError(dbError, 'Failed to create category')

  if (!inserted)
    return NextResponse.json(
      { error: 'Category already exists' },
      { status: 409 }
    )

  return NextResponse.json(inserted, {
    status: 201,
    headers: {
      Location: `/api/categories/${encodeURIComponent(inserted.name)}`
    }
  })
}
