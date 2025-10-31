import { CategoriesList } from '@/components/categories-list'
import { ProductsTable } from '@/components/products-table'
import { ThemeToggle } from '@/components/theme-toggle'
import { Sparkles } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-50 border-b border-border/40 bg-card/80 backdrop-blur-xl supports-backdrop-filter:bg-card/60">
        <div className="container mx-auto p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Sparkles className="size-5" />
            </div>
            <h1 className="bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-2xl font-bold text-transparent">
              Менеджер товарів
            </h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 py-8 container mx-auto px-4">
        <CategoriesList />
        <ProductsTable />
      </main>
    </div>
  )
}
