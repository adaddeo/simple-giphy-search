import React from 'react'
import { connect } from 'react-redux'
import { Gif } from '../lib/giphy-api'
import { RootState, search } from '../store/root'
import './App.css'

interface AppProps {
  query: string
  gifs: Gif[],
  search: typeof search
}

function App(props: AppProps) {
  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    props.search(event.target.value)
  }

  return (
    <div>
      <input type="text" value={props.query} onChange={handleInputChange} />
      <ul>
        { props.gifs.map(gif =>
            <li key={gif.id}>
              <video
                height={gif.images.fixed_height.height}
                width={gif.images.fixed_height.width}
                src={gif.images.fixed_height.mp4}
                autoPlay
              />
            </li>
        )}
      </ul>
    </div>
  )
}

const mapStateToProps = (state: RootState) => {
  console.log(state)
  return {
    query:  state.query,
    gifs: state.search.gifs
  }
}

const mapDispatchToProps = { search }

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
