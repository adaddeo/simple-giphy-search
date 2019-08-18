import React, { useState } from 'react'
import { connect } from 'react-redux'
import { search as searchAction } from '../state/ducks/search'
import './App.css'
import Gifs from './Gifs'

interface Props {
  search: (q: string) => void
}

export function App({ search }: Props) {
  const [query, setQuery] = useState('')

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setQuery(event.target.value)
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    search(query)
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

const mapDispatchToProps = { search: searchAction }

export default connect(
  null,
  mapDispatchToProps
)(App)
