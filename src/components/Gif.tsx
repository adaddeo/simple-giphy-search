import { IGif } from '@giphy/js-types'
import React, { useEffect, useState } from 'react'

interface Props {
  gif: IGif
}

function GifComponent({ gif }: Props) {
  const [isWebPSupported, setIsWebPSupported] = useState<boolean | null>(null)

  useEffect(() => {
    supportsWebP.then(setIsWebPSupported)
  }, [])

  if (isWebPSupported === null) {
    return null
  }

  const image = gif.images.fixed_width

  if (isWebPSupported) {
    return <img alt={gif.title} src={image.webp} height={image.height} width={image.width} />
  } else {
    return <video
        height={image.height}
        width={image.width}
        src={image.mp4}
        autoPlay
        loop
      />
  }
}

// Detect whether this browser supports WebP. Adapted from:
// https://developers.google.com/speed/webp/faq#in_your_own_javascript
const supportsWebP: Promise<boolean> = new Promise<boolean>((resolve, reject) => {
  const animationImageData = 'UklGRlIAAABXRUJQVlA4WAoAAAASAAAAAAAAAAAAQU5JTQYAAAD/////AABBTk1GJgAAAAAAAAAAAAAAAAAAAGQAAABWUDhMDQAAAC8AAAAQBxAREYiI/gcA'
  const img = new Image()

  img.onload = () => {
    const result = (img.width > 0) && (img.height > 0)
    resolve(result)
  }

  img.onerror = () => {
    resolve(false)
  }

  img.src = `data:image/webp;base64,${animationImageData}`
}).catch (() => false)

export default GifComponent
