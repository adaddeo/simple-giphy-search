import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { search } from '../state/ducks/search'
import { trending } from '../state/ducks/trending'
import './App.css'
import Gifs from './Gifs'

interface Props {
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
    <div className="app container">
      <nav className="header">
        <div className="header-content container">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Search for GIFs"
              value={query}
              onChange={handleInputChange}
            />
          </form>
        </div>
      </nav>
      <div className="main">
        <Gifs />
      </div>
    </div>
  )
}

const mapDispatchToProps = { search, trending }

export default connect(
  null,
  mapDispatchToProps
)(App)
