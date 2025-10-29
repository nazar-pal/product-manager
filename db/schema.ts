import { relations, sql } from 'drizzle-orm'
import { check, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const categories = sqliteTable(
  'categories',
  {
    name: text('name').primaryKey()
  },
  table => [
    check('categories_name_not_empty', sql`length(trim(${table.name})) >= 1`)
  ]
)

export const products = sqliteTable(
  'products',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    price: integer('price').notNull(),
    categoryName: text('category_name')
      .notNull()
      .references(() => categories.name, { onDelete: 'cascade' })
  },
  table => [
    check('products_id_not_empty', sql`length(trim(${table.id})) >= 1`),
    check('products_name_not_empty', sql`length(trim(${table.name})) >= 1`),
    check(
      'products_category_name_not_empty',
      sql`length(trim(${table.categoryName})) >= 1`
    ),
    check('products_price_non_negative', sql`${table.price} >= 0`)
  ]
)

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products)
}))

export const productsRelations = relations(products, ({ one }) => ({
  category: one(categories, {
    fields: [products.categoryName],
    references: [categories.name]
  })
}))

export type Product = typeof products.$inferSelect
export type Category = typeof categories.$inferSelect

// export const selectProductSchema = createSelectSchema(products)
// export type SelectProduct = z.infer<typeof selectProductSchema>
// export const selectCategorySchema = createSelectSchema(categories)
// export type SelectCategory = z.infer<typeof selectCategorySchema>

// export const createProductSchema = createInsertSchema(products, {
//   id: z.string().trim().min(1),
//   name: z.string().trim().min(1),
//   price: z.number().int().min(0),
//   categoryName: z.string().trim().min(1)
// })
// export type CreateProduct = z.infer<typeof createProductSchema>
// export const createCategorySchema = createInsertSchema(categories, {
//   name: z.string().trim().min(1)
// })
// export type CreateCategory = z.infer<typeof createCategorySchema>

// export const updateProductSchema = createUpdateSchema(products, {
//   name: z.string().trim().min(1),
//   price: z.number().int().min(0),
//   categoryName: z.string().trim().min(1)
// })
// export type UpdateProduct = z.infer<typeof updateProductSchema>
// export const updateCategorySchema = createUpdateSchema(categories, {
//   name: z.string().trim().min(1)
// })
// export type UpdateCategory = z.infer<typeof updateCategorySchema>
