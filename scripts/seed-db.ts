import { db } from '@/db'
import * as schema from '@/db/schema'

type CategoryInsert = typeof schema.categories.$inferInsert
type ProductInsert = typeof schema.products.$inferInsert

const defaultCategories: CategoryInsert[] = [
  { name: 'Електроніка' },
  { name: 'Книги' },
  { name: 'Меблі' },
  { name: 'Одяг' },
  { name: 'Продукти' },
  { name: 'Спорт' },
  { name: 'Косметика' },
  { name: 'Іграшки' },
  { name: 'Автомобілі' },
  { name: 'Музика' },
  { name: 'Домашні тварини' },
  { name: 'Садовий інвентар' },
  { name: 'Інструменти' },
  { name: 'Освітлення' },
  { name: 'Кухонне приладдя' }
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
  },
  {
    id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    name: 'Планшет',
    price: 499,
    categoryName: 'Електроніка'
  },
  {
    id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    name: 'Навушники',
    price: 89,
    categoryName: 'Електроніка'
  },
  {
    id: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
    name: 'Мишка бездротова',
    price: 45,
    categoryName: 'Електроніка'
  },
  {
    id: 'd4e5f6a7-b8c9-0123-def0-234567890123',
    name: 'Клавіатура',
    price: 79,
    categoryName: 'Електроніка'
  },
  {
    id: 'e5f6a7b8-c9d0-1234-ef01-345678901234',
    name: 'Монітор',
    price: 299,
    categoryName: 'Електроніка'
  },
  {
    id: 'f6a7b8c9-d0e1-2345-f012-456789012345',
    name: 'Дитяча книга',
    price: 15,
    categoryName: 'Книги'
  },
  {
    id: 'a7b8c9d0-e1f2-3456-0123-567890123456',
    name: 'Підручник',
    price: 35,
    categoryName: 'Книги'
  },
  {
    id: 'b8c9d0e1-f2a3-4567-1234-678901234567',
    name: 'Комікс',
    price: 12,
    categoryName: 'Книги'
  },
  {
    id: 'c9d0e1f2-a3b4-5678-2345-789012345678',
    name: 'Словник',
    price: 28,
    categoryName: 'Книги'
  },
  {
    id: 'd0e1f2a3-b4c5-6789-3456-890123456789',
    name: 'Детектив',
    price: 22,
    categoryName: 'Книги'
  },
  {
    id: 'e1f2a3b4-c5d6-7890-4567-901234567890',
    name: 'Диван',
    price: 599,
    categoryName: 'Меблі'
  },
  {
    id: 'f2a3b4c5-d6e7-8901-5678-012345678901',
    name: 'Стільці',
    price: 89,
    categoryName: 'Меблі'
  },
  {
    id: 'a3b4c5d6-e7f8-9012-6789-123456789012',
    name: 'Стіл письмовий',
    price: 199,
    categoryName: 'Меблі'
  },
  {
    id: 'b4c5d6e7-f8a9-0123-7890-234567890123',
    name: 'Шафа',
    price: 399,
    categoryName: 'Меблі'
  },
  {
    id: 'c5d6e7f8-a9b0-1234-8901-345678901234',
    name: 'Ліжко',
    price: 449,
    categoryName: 'Меблі'
  },
  {
    id: 'd6e7f8a9-b0c1-2345-9012-456789012345',
    name: 'Джинси',
    price: 59,
    categoryName: 'Одяг'
  },
  {
    id: 'e7f8a9b0-c1d2-3456-0123-567890123456',
    name: 'Светр',
    price: 45,
    categoryName: 'Одяг'
  },
  {
    id: 'f8a9b0c1-d2e3-4567-1234-678901234567',
    name: 'Кросівки',
    price: 89,
    categoryName: 'Одяг'
  },
  {
    id: 'a9b0c1d2-e3f4-5678-2345-789012345678',
    name: 'Куртка',
    price: 129,
    categoryName: 'Одяг'
  },
  {
    id: 'b0c1d2e3-f4a5-6789-3456-890123456789',
    name: 'Шапка',
    price: 19,
    categoryName: 'Одяг'
  },
  {
    id: 'c1d2e3f4-a5b6-7890-4567-901234567890',
    name: 'Хліб',
    price: 2,
    categoryName: 'Продукти'
  },
  {
    id: 'd2e3f4a5-b6c7-8901-5678-012345678901',
    name: 'Молоко (1 л)',
    price: 3,
    categoryName: 'Продукти'
  },
  {
    id: 'e3f4a5b6-c7d8-9012-6789-123456789012',
    name: 'Яйця (10 шт)',
    price: 5,
    categoryName: 'Продукти'
  },
  {
    id: 'f4a5b6c7-d8e9-0123-7890-234567890123',
    name: "М'ясо (1 кг)",
    price: 89,
    categoryName: 'Продукти'
  },
  {
    id: 'a5b6c7d8-e9f0-1234-8901-345678901234',
    name: 'Риба (1 кг)',
    price: 45,
    categoryName: 'Продукти'
  },
  {
    id: 'b6c7d8e9-f0a1-2345-9012-456789012345',
    name: "Футбольний м'яч",
    price: 35,
    categoryName: 'Спорт'
  },
  {
    id: 'c7d8e9f0-a1b2-3456-0123-567890123456',
    name: 'Гантелі',
    price: 79,
    categoryName: 'Спорт'
  },
  {
    id: 'd8e9f0a1-b2c3-4567-1234-678901234567',
    name: 'Велосипед',
    price: 299,
    categoryName: 'Спорт'
  },
  {
    id: 'e9f0a1b2-c3d4-5678-2345-789012345678',
    name: 'Крем для обличчя',
    price: 45,
    categoryName: 'Косметика'
  },
  {
    id: 'f0a1b2c3-d4e5-6789-3456-890123456789',
    name: 'Шампунь',
    price: 12,
    categoryName: 'Косметика'
  },
  {
    id: 'a1b2c3d4-e5f6-7890-4567-901234567890',
    name: 'Конструктор LEGO',
    price: 79,
    categoryName: 'Іграшки'
  },
  {
    id: 'b2c3d4e5-f6a7-8901-5678-012345678901',
    name: 'Лялька',
    price: 29,
    categoryName: 'Іграшки'
  },
  {
    id: 'c3d4e5f6-a7b8-9012-6789-123456789012',
    name: 'Автомобільна шина',
    price: 89,
    categoryName: 'Автомобілі'
  },
  {
    id: 'd4e5f6a7-b8c9-0123-7890-234567890123',
    name: 'Моторна олія',
    price: 25,
    categoryName: 'Автомобілі'
  },
  {
    id: 'e5f6a7b8-c9d0-1234-8901-345678901234',
    name: 'Гітара',
    price: 199,
    categoryName: 'Музика'
  },
  {
    id: 'f6a7b8c9-d0e1-2345-9012-456789012345',
    name: 'Корм для собак',
    price: 35,
    categoryName: 'Домашні тварини'
  },
  {
    id: 'a7b8c9d0-e1f2-3456-0123-567890123456',
    name: 'Лопата',
    price: 19,
    categoryName: 'Садовий інвентар'
  },
  {
    id: 'b8c9d0e1-f2a3-4567-1234-678901234567',
    name: 'Дриль',
    price: 149,
    categoryName: 'Інструменти'
  },
  {
    id: 'c9d0e1f2-a3b4-5678-2345-789012345678',
    name: 'Люстра',
    price: 199,
    categoryName: 'Освітлення'
  },
  {
    id: 'd0e1f2a3-b4c5-6789-3456-890123456789',
    name: 'Каструля',
    price: 45,
    categoryName: 'Кухонне приладдя'
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
