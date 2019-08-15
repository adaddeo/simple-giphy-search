import { IGif } from '@giphy/js-types'
import { Gif } from '@giphy/react-components'
import React from 'react'
import { connect } from 'react-redux'
import { RootState } from '../state/reducer'

interface Props {
  gifs: IGif[]
}

function Gifs(props: Props) {
  const { gifs } = props

  return (
    <div className="gifs">
      { gifs.map(gif => <Gif key={gif.id} gif={gif} width={200} /> )}
    </div>
  )
}

const mapStateToProps = (state: RootState) => {
  return {
    gifs: state.search.query ? state.search.gifs : state.trending.gifs
  }
}

export default connect(
  mapStateToProps,
  null
)(Gifs)
