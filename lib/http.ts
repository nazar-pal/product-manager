import { NextResponse, type NextRequest } from 'next/server'

export function isUuidV4(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  )
}

export function validateUuidParam(
  id: string,
  resourceLabel: string
): NextResponse | null {
  const trimmed = id.trim()
  if (trimmed.length === 0)
    return NextResponse.json(
      { error: `Invalid ${resourceLabel} id` },
      { status: 400 }
    )

  if (!isUuidV4(trimmed))
    return NextResponse.json(
      { error: `Invalid ${resourceLabel} id format` },
      { status: 400 }
    )

  return null
}

export function validateNameParam(
  name: string,
  resourceLabel: string
): NextResponse | null {
  const trimmed = name.trim()
  if (trimmed.length === 0)
    return NextResponse.json(
      { error: `Invalid ${resourceLabel} name` },
      { status: 400 }
    )
  return null
}

export function ensureJsonRequest(
  req: Request | NextRequest
): NextResponse | null {
  const contentType = req.headers.get('content-type') || ''
  if (!contentType.toLowerCase().includes('application/json'))
    return NextResponse.json(
      { error: 'Content-Type must be application/json' },
      { status: 415 }
    )
  return null
}

export async function parseJsonBody<T = unknown>(
  req: Request | NextRequest
): Promise<[NextResponse | null, T | null]> {
  try {
    const body = (await req.json()) as T
    return [null, body]
  } catch {
    return [
      NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 }),
      null
    ]
  }
}

export function sqliteToHttpError(
  err: unknown,
  fallbackMessage: string
): NextResponse {
  const anyErr = err as
    | { code?: string; message?: string; errno?: number }
    | undefined
  const code = anyErr?.code
  const messageRaw = anyErr?.message || ''
  const message = messageRaw.toLowerCase()

  // Concurrency / lock
  if (
    code === 'SQLITE_BUSY' ||
    message.includes('database is locked') ||
    message.includes('busy')
  ) {
    return NextResponse.json(
      { error: 'Database is busy, please retry' },
      { status: 503, headers: { 'Retry-After': '1' } }
    )
  }

  // Disk full / quota
  if (code === 'SQLITE_FULL' || message.includes('database or disk is full')) {
    return NextResponse.json({ error: 'Database is full' }, { status: 507 })
  }

  // Read-only DB
  if (code === 'SQLITE_READONLY' || message.includes('read-only')) {
    return NextResponse.json(
      { error: 'Database is read-only' },
      { status: 503 }
    )
  }

  // Constraint violations (unique, fk, check, not null)
  const isConstraint =
    (code?.startsWith('SQLITE_CONSTRAINT') ?? false) ||
    message.includes('constraint failed')
  if (isConstraint) {
    if (message.includes('unique') || message.includes('primary key')) {
      return NextResponse.json({ error: 'Resource conflict' }, { status: 409 })
    }
    if (message.includes('foreign key')) {
      return NextResponse.json(
        { error: 'Referential integrity conflict' },
        { status: 409 }
      )
    }
    if (message.includes('check') || message.includes('not null')) {
      return NextResponse.json({ error: 'Validation failed' }, { status: 422 })
    }
    return NextResponse.json({ error: 'Constraint violation' }, { status: 422 })
  }

  // Invalid inputs / binding / data size
  if (
    code === 'SQLITE_RANGE' ||
    message.includes('bind or column index out of range')
  ) {
    return NextResponse.json(
      { error: 'Invalid query parameters' },
      { status: 400 }
    )
  }
  if (code === 'SQLITE_MISMATCH' || message.includes('datatype mismatch')) {
    return NextResponse.json({ error: 'Invalid data type' }, { status: 400 })
  }
  if (code === 'SQLITE_TOOBIG' || message.includes('string or blob too big')) {
    return NextResponse.json({ error: 'Payload too large' }, { status: 413 })
  }

  // Permissions / auth / cannot open
  if (
    code === 'SQLITE_PERM' ||
    code === 'SQLITE_AUTH' ||
    code === 'SQLITE_CANTOPEN'
  ) {
    return NextResponse.json({ error: 'Database unavailable' }, { status: 503 })
  }

  return NextResponse.json({ error: fallbackMessage }, { status: 500 })
}
