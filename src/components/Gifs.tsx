import { IGif } from '@giphy/js-types'
import { Gif } from '@giphy/react-components'
import React, { SyntheticEvent, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import { RootState } from '../state'
import { fetchGifs as fetchGifsAction } from '../state/ducks/gifs'
import { openGif as openGifAction } from '../state/ducks/viewer'
import { isLoadingSelector, moreGifsSelector } from '../state/selectors'
import './Gifs.css'
import { useBricks, useClientRect, useIntersectionObserver } from './hooks'
import Loader from './Loader'

interface Props {
  query: string
  gifs: IGif[]
  isLoading: boolean
  moreGifs: boolean
  fetchGifs: () => void
  openGif: (idx: number) => void
}

export function Gifs(props: Props) {
  const { query, gifs, isLoading, moreGifs, fetchGifs, openGif } = props

  // Initial load of trending gifs
  useEffect(fetchGifs, [fetchGifs])

  const handleGifClick = (idx: number, event: SyntheticEvent<HTMLElement, Event>) => {
    openGif(idx)
    event.stopPropagation()
    event.preventDefault()
  }

  // This ref will hold the DOM node of the gif container for use by Bricks.js
  const { ref: bricksContainer, currentSize: { gutter, columns } } = useBricks(
    {
      packed: 'packed',
      sizes: [
        { columns: 2, gutter: 8 },
        { mq: '768px', columns: 3, gutter: 12 },
        { mq: '1024px', columns: 4, gutter: 16 },
        { mq: '1260px', columns: 4, gutter: 16 }
      ]
    },
    query,
    [gifs]
  )

  // Calculate the width each gif should be based on the width of the container and the
  // number of columns and gutter width at the current viewport size
  let gifWidth = 200
  const [rect, contentContainer] = useClientRect()

  if (rect !== null) {
    gifWidth = Math.floor((rect.width - gutter * (columns - 1)) / columns)
  }

  // Setup observed div at the end of gifs to detect when we should attempt to load
  // the next page
  const loaderContainer = useRef<HTMLDivElement>(null)

  const handleVisibilityChange = (visible: boolean) => {
    if (visible && !isLoading && moreGifs) {
      fetchGifs()
    }
  }

  useIntersectionObserver({
    element: loaderContainer.current,
    onVisiblilityChange: handleVisibilityChange,
    rootMargin: '200px'
  })

  return (
    <div ref={contentContainer}>
      <div ref={bricksContainer} key={query} className="gifs-container">
        { gifs.map(
            (gif, idx) =>
              <Gif
                key={gif.id}
                gif={gif}
                width={gifWidth}
                backgroundColor="#e8f4fd"
                onGifClick={(g, e) => handleGifClick(idx, e)}
              />
        )}
      </div>

      { !isLoading && gifs.length === 0 &&
        <div className="info">
          No gifs found for <b>{query}</b>
        </div>
      }

      { moreGifs &&
        <div ref={loaderContainer} className="loader-container">
          { isLoading && <Loader /> }
        </div>
      }
      { !moreGifs && gifs.length > 0 &&
        <div className="info">
          No more gifs.
        </div>
      }
    </div>
  )
}

const mapStateToProps = (state: RootState) => {
  return {
    query: state.search.query,
    gifs: state.gifs.gifs,
    isLoading: isLoadingSelector(state),
    moreGifs: moreGifsSelector(state)
  }
}

const mapDispatchToProps = {
  fetchGifs: fetchGifsAction,
  openGif: openGifAction
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Gifs)
