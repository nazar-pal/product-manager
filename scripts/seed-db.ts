import { db } from '@/db'
import * as schema from '@/db/schema'

type CategoryInsert = typeof schema.categories.$inferInsert
type ProductInsert = typeof schema.products.$inferInsert

const defaultCategories: CategoryInsert[] = [
  { name: 'Електроніка' },
  { name: 'Книги' },
  { name: 'Меблі' },
  { name: 'Одяг' },
  { name: 'Продукти' }
]

const defaultProducts: ProductInsert[] = [
  {
    id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    name: 'Смартфон',
    price: 699,
    categoryName: 'Електроніка'
  },
  {
    id: '7b7f4b21-8c7a-4d8a-8c7c-2b7c8b7a8c7a',
    name: 'Ноутбук',
    price: 1299,
    categoryName: 'Електроніка'
  },
  {
    id: '9b8a7c6d-5e4f-3a2b-1c0d-9e8f7a6b5c4d',
    name: 'Офісне крісло',
    price: 149,
    categoryName: 'Меблі'
  },
  {
    id: '2f1e0d9c-8b7a-6c5d-4e3f-2a1b0c9d8e7f',
    name: 'Футболка',
    price: 25,
    categoryName: 'Одяг'
  },
  {
    id: '0a1b2c3d-4e5f-6789-abcd-ef0123456789',
    name: 'Роман',
    price: 19,
    categoryName: 'Книги'
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Яблука (1 кг)',
    price: 4,
    categoryName: 'Продукти'
  }
]

async function main() {
  console.log('Seeding database...')

  db.transaction(tx => {
    tx.insert(schema.categories)
      .values(defaultCategories)
      .onConflictDoNothing()
      .run()
    tx.insert(schema.products)
      .values(defaultProducts)
      .onConflictDoNothing()
      .run()
  })
  console.log('Seeding complete.')
}

main().catch(err => {
  console.error('Seeding failed:', err)
  process.exit(1)
})
