'use client'

import { Button } from '@/components/ui/button'
import { Category } from '@/db/schema'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

export function CategoriesScrollArea({
  children,
  categories
}: {
  children: React.ReactNode
  categories: Category[]
}) {
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
    <div className="relative group/scroll">
      {showLeftButton && (
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-linear-to-r from-background to-transparent" />
      )}

      {showRightButton && (
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-linear-to-l from-background to-transparent" />
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
        {children}
      </div>
    </div>
  )
}
