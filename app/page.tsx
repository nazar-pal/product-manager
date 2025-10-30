import { CategoriesList } from '@/components/categories-list'
import { Header } from '@/components/header'
import { ProductsTable } from '@/components/products-table/products-table'

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="py-4 sticky top-0 z-50 border-b border-border/40 bg-card/80 backdrop-blur-xl supports-backdrop-filter:bg-card/60">
        <Container>
          <Header />
        </Container>
      </header>
      <main className="flex-1 py-8">
        <Container>
          <CategoriesList />
          <ProductsTable />
        </Container>
      </main>
    </div>
  )
}

function Container({ children }: { children: React.ReactNode }) {
  return <div className="container mx-auto px-4">{children}</div>
}
