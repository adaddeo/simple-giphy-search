import React from 'react'
import { connect } from 'react-redux'
import { Gif } from '../lib/giphy-api'
import { search, SearchState, updateQuery } from '../state/ducks/search'
import './App.css'

interface AppProps {
  query: string
  gifs: Gif[],
  updateQuery: (q: string) => void
  search: (q: string) => void
}

function App(props: AppProps) {
  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    props.updateQuery(event.target.value)
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    props.search(props.query)
    event.preventDefault()
  }

  return (
    <form onSubmit={handleSubmit}>
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
    </form>
  )
}

const mapStateToProps = (state: SearchState) => {
  return {
    query:  state.query,
    gifs: state.gifs
  }
}

const mapDispatchToProps = { search, updateQuery }

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
