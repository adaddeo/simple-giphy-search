import Bricks, { BricksInstance, BricksOptions, SizeDetail } from 'bricks.js'
import { RefObject, useEffect, useRef } from 'react'

export default (
  bricksOptions: Omit<BricksOptions, 'container'>,
  key: string = '',
  dependencies: any[] = []
): {
  ref: RefObject<HTMLDivElement>,
  currentSize: SizeDetail
} => {
  const container = useRef<HTMLDivElement | null>(null)
  const instance = useRef<BricksInstance | null>(null)
  const keyRef = useRef<string>(key)

  useEffect(
    () => {

      // A new Bricks.js will be instantiated when one doesn't exist or the key changes.
      if (container.current !== null && (instance.current === null || keyRef.current !== key)) {
        instance.current = Bricks({
          ...bricksOptions,
          container: container.current,
        })

        instance.current
          .resize(true)
          .pack()

        keyRef.current = key
      }

      if (instance.current !== null) {
        // At this point we are calling the more efficient update with the assumption that
        // already packed gifs haven't been removed or modified
        instance.current.update()
      }
    },

    // Disable linting to support additional dependencies. Note: brickOptions aren't
    // included and thus can't be dynamically set.
    // eslint-disable-next-line
    [container, ...dependencies]
  )

  return { ref: container, currentSize: getCurrentSize(bricksOptions.sizes) }
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
