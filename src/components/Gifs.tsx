import { IGif } from '@giphy/js-types'
import { Gif } from '@giphy/react-components'
import React, { useRef } from 'react'
import { connect } from 'react-redux'
import { RootState } from '../state'
import { fetchGifs as fetchGifsAction } from '../state/ducks/gifs'
import { isLoadingSelector, moreGifsSelector } from '../state/selectors'
import './Gifs.css'
import useBricks from './hooks/useBricks'
import useClientRect from './hooks/useClientRect'
import useIntersectionObserver from './hooks/useIntersectionObserver'
import Loader from './Loader'

interface Props {
  query: string
  gifs: IGif[]
  isLoading: boolean
  moreGifs: boolean
  fetchGifs: () => void
}

function Gifs(props: Props) {
  const { query, gifs, isLoading, moreGifs, fetchGifs } = props

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

  // useEffect(() => {
  //   console.log('effect ran')
  // }, [bricksOptions.current])

  // Calculate the width each gif should be based on the width of the container and the
  // number of columns and gutter width at the current viewport size
  let gifWidth = 200
  const [rect, ref] = useClientRect()

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
    <div ref={ref}>
      <div ref={bricksContainer} key={query}>
        { gifs.map(
            gif =>
              <Gif
                key={gif.id}
                gif={gif}
                width={gifWidth}
                backgroundColor="#e8f4fd"
              />
        )}
      </div>

      { moreGifs &&
        <div ref={loaderContainer} className="loader-container">
          { isLoading && <Loader /> }
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

export default connect(
  mapStateToProps,
  { fetchGifs: fetchGifsAction }
)(Gifs)
