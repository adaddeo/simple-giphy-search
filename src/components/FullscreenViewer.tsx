import { IGif } from '@giphy/js-types'
import { Gif } from '@giphy/react-components'
import React, { MouseEvent, SyntheticEvent, useEffect } from 'react'
import { connect } from 'react-redux'
import { RootState } from '../state'
import { close as closeAction } from '../state/ducks/viewer'
import { viewGifSelector } from '../state/selectors'
import './FullscreenViewer.css'
import { useClientRect } from './hooks'

interface Props {
  gif: IGif | null
  close: () => void
}

export function FullscreenViewer({ gif, close }: Props) {

  // We will use the client rectangle of our viewer to determine maximum gif width
  const [rect, ref] = useClientRect()

  // Prevent scrolling when viewer is open
  useEffect(() => {
    document.documentElement.style.overflow = gif !== null ? 'hidden' : null
    document.body.style.overflowY = gif !== null ? 'scroll' : null

    return () => {
      document.documentElement.style.overflow = null
      document.body.style.overflowY = null
    }
  }, [gif])

  // Add hotkey for closing with esc
  useEffect(() => {
    function handler(e: any) {
      if (e.key === 'Escape') {
        close()
      }
    }

    window.addEventListener('keydown', handler)

    return () => {
      window.removeEventListener('keydown', handler)
    }
  }, [close])

  const handleClose = (event: MouseEvent | SyntheticEvent) => {
    close()
    event.stopPropagation()
    event.preventDefault()
  }

  if (gif === null) {
    return null
  }

  let width = 600

  // Fit using a "contain" model, maximizing the size while keep both the height and
  // width in bounds.
  if (rect !== null) {
    const { original } = gif.images
    // Don't warp the gif more than 2x
    const maxWidth = Math.min(original.width * 2, rect.width)

    if (original.height / original.width * maxWidth > rect.height) {
      width = rect.height * original.width / original.height
    } else {
      width = maxWidth
    }
  }

  return (
    <div className="fullscreen-viewer" onClick={handleClose}>
      <div ref={ref} className="fullscreen-viewer-content">
        <Gif
          gif={gif}
          width={width}
          backgroundColor="black"
          onGifClick={(g, e) => handleClose(e) }
        />
      </div>
    </div>
  )
}

const mapStateToProps = (state: RootState) => {
  return {
    gif: viewGifSelector(state)
  }
}

const mapDispatchToProps = {
  close: closeAction
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FullscreenViewer)
