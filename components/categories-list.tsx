'use client'

import { Button } from '@/components/ui/button'
import { useCategoriesQuery } from '@/lib/hooks'
import { ChevronLeft, ChevronRight, Pencil, Plus, Trash2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { DialogDeleteCategory } from './dialog-delete-category'
import { DialogFormCategory } from './dialog-form-category'

export function CategoriesList() {
  const { data: categories } = useCategoriesQuery()

  const [showLeftButton, setShowLeftButton] = useState(false)
  const [showRightButton, setShowRightButton] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const checkScroll = () => {
    if (!scrollContainerRef.current) return
    const { scrollWidth, clientWidth, scrollLeft } = scrollContainerRef.current
    setShowLeftButton(scrollLeft > 0)
    setShowRightButton(scrollWidth > clientWidth)
  }

  useEffect(() => {
    checkScroll()
    const handleResize = () => checkScroll()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [categories])

  const handleScroll = () => {
    if (!scrollContainerRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
    setShowLeftButton(scrollLeft > 0)
    setShowRightButton(scrollLeft < scrollWidth - clientWidth - 10)
  }

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return
    const scrollAmount = 300
    scrollContainerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Категорії</h3>

        <DialogFormCategory>
          <Button className="ml-auto">
            <Plus className="size-4" />
            Додати категорію
          </Button>
        </DialogFormCategory>
      </div>

      <div className="relative group/scroll">
        {showLeftButton && (
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-background to-transparent" />
        )}

        {showRightButton && (
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-background to-transparent" />
        )}

        {showLeftButton && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 top-1/2 z-20 h-8 w-8 -translate-y-1/2 rounded-full bg-background/80 shadow-lg backdrop-blur-sm transition-opacity hover:bg-background/90 opacity-0 group-hover/scroll:opacity-100"
            onClick={() => scroll('left')}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}

        {showRightButton && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 z-20 h-8 w-8 -translate-y-1/2 rounded-full bg-background/80 shadow-lg backdrop-blur-sm transition-opacity hover:bg-background/90 opacity-0 group-hover/scroll:opacity-100"
            onClick={() => scroll('right')}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}

        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex gap-3 overflow-x-auto scrollbar-none pb-2"
        >
          {!categories || categories.length === 0 ? (
            <div className="w-full rounded-lg border border-dashed border-border bg-card/50 p-8 text-center">
              <p className="text-sm text-muted-foreground">
                Категорій не знайдено
              </p>
            </div>
          ) : (
            categories.map(category => (
              <div
                key={category.name}
                className="group relative flex min-w-[200px] flex-shrink-0 items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 py-3 shadow-sm transition-all hover:border-primary/50 hover:shadow-md"
              >
                <span className="font-medium text-foreground">
                  {category.name}
                </span>
                <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <DialogFormCategory category={category}>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                  </DialogFormCategory>
                  <DialogDeleteCategory category={category}>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </DialogDeleteCategory>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
