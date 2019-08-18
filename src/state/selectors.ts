import { createSelector } from 'reselect'
import { RootState } from './index'

export const isLoadingSelector = createSelector<RootState, number, boolean>(
  state => state.gifs.pendingRequests,
  pendingRequests => pendingRequests > 0
)

export const moreGifsSelector = createSelector<RootState, number, number | undefined, boolean>(
  state => state.gifs.offset,
  state => state.gifs.totalCount,
  (offset, totalCount) => totalCount === undefined || offset < totalCount
)
