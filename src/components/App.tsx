import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Gif } from '../lib/giphy-api'
import { search } from '../state/ducks/search'
import { trending } from '../state/ducks/trending'
import { RootState } from '../state/reducer'
import './App.css'
import GifComponent from './Gif'

interface Props {
  query: string
  gifs: Gif[],
  search: (q: string) => void
  trending: () => void
}

function App(props: Props) {
  // eslint-disable-next-line
  useEffect(() => { props.trending() }, [])

  const [query, setQuery] = useState('')

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setQuery(event.target.value)
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    props.search(query)
    event.preventDefault()
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" value={query} onChange={handleInputChange} />
      </form>
      <div className="gif-container">
        { props.gifs.map(gif => <div key={gif.id} className="gif"><GifComponent gif={gif} /></div> )}
      </div>
    </div>
  )
}

const mapStateToProps = (state: RootState) => {
  return {
    query:  state.search.query,
    gifs: state.search.query ? state.search.gifs : state.trending.gifs
  }
}

const mapDispatchToProps = { search, trending }

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
