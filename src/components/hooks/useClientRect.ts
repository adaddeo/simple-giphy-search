import { useCallback, useEffect, useRef, useState } from 'react'

export default (): [ClientRect | null, (node: HTMLElement | null) => void] => {
  const target = useRef<HTMLElement | null>(null)
  const [rect, setRect] = useState<ClientRect | null>(null)

  const handleResize = useCallback(() => {
    if (target.current !== null) {
      setRect(target.current.getBoundingClientRect())
    }
  }, [target])

  const ref = useCallback(node => {
    if (node !== null) {
      target.current = node
      handleResize()
    }
  }, [handleResize])

  useEffect(() => {
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  })

  return [rect, ref]
}
