import { IGif } from '@giphy/js-types'
import { Gif } from '@giphy/react-components'
import React, { useRef } from 'react'
import { connect } from 'react-redux'
import { trending } from '../state/ducks/trending'
import { RootState } from '../state/reducer'
import './Gifs.css'
import useBricks from './hooks/useBricks'
import useClientRect from './hooks/useClientRect'
import useObserver from './hooks/useObserver'
import Loader from './Loader'

interface Props {
  gifs: IGif[]
  isLoading: boolean
  moreGifs: boolean
  trending: () => void
}

function Gifs({ isLoading, gifs, moreGifs }: Props) {
  const container = useRef<HTMLDivElement>(null)

  const { gutter, columns } = useBricks(container, {
    packed: 'packed',
    sizes: [
      { columns: 2, gutter: 8 },
      { mq: '768px', columns: 3, gutter: 12 },
      { mq: '1024px', columns: 4, gutter: 16 },
      { mq: '1260px', columns: 4, gutter: 16 }
    ]
  }, [gifs])

  // Figure out the width of each gif based on the width of the container and the number
  // of columns and gutter width at the current size
  let gifWidth = 200
  const [rect, ref] = useClientRect()

  if (rect !== null) {
    gifWidth = Math.floor((rect.width - gutter * (columns - 1)) / columns)
  }

  // Setup observed div at the end of gifs to detect when we should attempt to load
  // the next page
  const loader = useRef<HTMLDivElement>(null)

  useObserver({
    element: loader.current,
    onVisiblilityChange: () => console.log('firing')
  })

  return (
    <div ref={ref}>
      <div ref={container}>
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
        <div ref={loader} className="loader-container">
          { isLoading && <Loader /> }
        </div>
      }
    </div>
  )
}

const mapStateToProps = (state: RootState) => {
  const gifState = state.search.query ? state.search : state.trending
  return {
    gifs:  gifState.gifs,
    isLoading: gifState.isLoading,
    moreGifs: (gifState.offset || -1) < (gifState.totalCount || 1) - 1
  }
}

export default connect(
  mapStateToProps,
  { trending }
)(Gifs)
