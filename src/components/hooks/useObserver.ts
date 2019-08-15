import { useEffect } from 'react'

export interface UseObserverOptions {
  element: HTMLDivElement | null
  onVisiblilityChange: (isVisible: boolean) => void
}

export default (options: UseObserverOptions) => {
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]: IntersectionObserverEntry[]) => {
      options.onVisiblilityChange(entry.isIntersecting)
    })

    if (options.element !== null) {
      observer.observe(options.element)
    }

    return () => {
      if (options.element !== null) {
        observer.disconnect()
      }
    }
  })
}
