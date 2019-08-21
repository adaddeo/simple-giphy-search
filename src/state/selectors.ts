import { IGif } from '@giphy/js-types'
import { createSelector } from 'reselect'
import { RootState } from './'

export const moreGifsSelector = createSelector<RootState, number, number | undefined, boolean>(
  state => state.gifs.offset,
  state => state.gifs.totalCount,
  (offset, totalCount) => totalCount === undefined || offset < totalCount
)

export const viewGifSelector = createSelector <RootState, number | null, IGif[], IGif | null>(
  state => state.viewer.gifIndex,
  state => state.gifs.gifs,
  (index, gifs) => index !== null ? gifs[index] : null
)
