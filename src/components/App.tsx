import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Gif } from '../lib/giphy-api'
import { initialize, RootState, search } from '../store/root'
import './App.css'

interface Props {
  query: string
  gifs: Gif[],
  search: (q: string) => void,
  initialize: () => void
}

function App(props: Props) {
  useEffect(() => { props.initialize() }, [])

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    props.search(event.target.value)
  }

  return (
    <div>
      <input type="text" value={props.query} onChange={handleInputChange} />
      { props.gifs.map(gif =>
          <div key={gif.id}>
            <video
              height={gif.images.fixed_height.height}
              width={gif.images.fixed_height.width}
              src={gif.images.fixed_height.mp4}
              autoPlay
              loop
            />
          </div>
      )}
    </div>
  )
}

const mapStateToProps = (state: RootState) => {
  return {
    query:  state.query,
    gifs: state.query ? state.search.gifs : state.trending.gifs
  }
}

const mapDispatchToProps = { initialize, search }

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
