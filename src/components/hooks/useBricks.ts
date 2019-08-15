import Bricks, { BricksInstance, BricksOptions, SizeDetail } from 'bricks.js'
import { RefObject, useEffect, useRef, useState } from 'react'

export default (
  container: RefObject<HTMLDivElement>,
  bricksOptions: Omit<BricksOptions, 'container'>,
  dependencies?: any[]
) => {
  const bricksInstance = useRef<BricksInstance | null>(null)
  const [size, setSize] = useState(3)

  useEffect(() => {
    const onResize = () => {
      setSize(size + 1)
    }

    if (bricksInstance.current === null) {
      bricksInstance.current = Bricks({
        ...bricksOptions,
        container: container.current!,
      })

      bricksInstance.current
        .resize(true)
        .pack()
        .on('resize', onResize)
    }

    // Improve performance by detecting if only changes to items are additions in which
    // case the more efficient update can be called.
    bricksInstance.current.pack()
  })

  return getCurrentSize(bricksOptions.sizes)
}

/*
 * Helper function to help us dynamically size our gifs based on the current window size
 * and number of columns and gutter widths currently being used. Currently relies on sizes
 * being ordered from smallest to largest media query, with default as the first element.
 */
function getCurrentSize(sizes: SizeDetail[]): { gutter: number, columns: number} {
  return sizes.reduce(
    (size, option) => {
      return window.matchMedia(`(min-width: ${option.mq})`).matches ? option : size
    }
  )
}
