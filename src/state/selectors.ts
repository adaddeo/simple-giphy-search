import { IGif } from '@giphy/js-types'
import { createSelector } from 'reselect'
import { RootState } from './'

export const isLoadingSelector = createSelector<RootState, number, boolean>(
  state => state.gifs.pendingRequests,
  pendingRequests => pendingRequests > 0
)

export const moreGifsSelector = createSelector<RootState, number, number | undefined, boolean>(
  state => state.gifs.offset,
  state => state.gifs.totalCount,
  (offset, totalCount) => totalCount === undefined || offset < totalCount
)

export const viewerGif = createSelector <RootState, number | null, IGif[], IGif | null>(
  state => state.viewer.index,
  state => state.gifs.gifs,
  (index, gifs) => index !== null ? gifs[index] : null
)
