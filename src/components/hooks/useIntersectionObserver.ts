import { useEffect } from 'react'

export interface UseObserverOptions {
  element: HTMLDivElement | null
  onVisiblilityChange: (isVisible: boolean) => void,
  threshold?: number,
  rootMargin?: string
}

export default ({
  element,
  onVisiblilityChange,
  threshold = 0,
  rootMargin = '0px'
}: UseObserverOptions) => {
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]: IntersectionObserverEntry[]) => {
      onVisiblilityChange(entry.isIntersecting)
    }, { threshold, rootMargin })

    if (element !== null) {
      observer.observe(element)
    }

    return () => {
      if (element !== null) {
        observer.disconnect()
      }
    }
  })
}
