import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import * as schema from './schema'

const sqlite = new Database('local.db')
sqlite.pragma('journal_mode = WAL')
sqlite.pragma('busy_timeout = 5000')
sqlite.pragma('foreign_keys = ON')

export const db = drizzle(sqlite, { schema })
