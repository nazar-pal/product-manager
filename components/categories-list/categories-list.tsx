'use client'

import { CategoriesHeader } from '@/components/categories-list/categories-header'
import { CategoriesScrollArea } from '@/components/categories-list/categories-scroll-area'
import { CategoryCard } from '@/components/categories-list/category-card'
import { useCategoriesQuery } from '@/lib/hooks'

export function CategoriesList() {
  const { data: categories, isLoading } = useCategoriesQuery()

  return (
    <div className="space-y-4">
      <CategoriesHeader />

      {isLoading ? (
        <div className="w-full rounded-lg border border-dashed border-border bg-card/50 p-8 text-center">
          <p className="text-sm text-muted-foreground">
            Завантаження категорій...
          </p>
        </div>
      ) : !categories || categories.length === 0 ? (
        <div className="w-full rounded-lg border border-dashed border-border bg-card/50 p-8 text-center">
          <p className="text-sm text-muted-foreground">Категорій не знайдено</p>
        </div>
      ) : (
        <CategoriesScrollArea categories={categories}>
          {categories.map(category => (
            <CategoryCard key={category.name} category={category} />
          ))}
        </CategoriesScrollArea>
      )}
    </div>
  )
}
