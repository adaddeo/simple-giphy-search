import configureMockStore from 'redux-mock-store'
import promise from 'redux-promise-middleware'
import thunk from 'redux-thunk'
import { getEmptyState as getEmptyGifsState } from './ducks/gifs'
import { getEmptyState as getEmptySearchState } from './ducks/search'
import { getEmptyState as getEmptyViewerState } from './ducks/viewer'

const middleware = [thunk, promise]

export const mockStore = configureMockStore(middleware)

export const mockGiphyResponse = {
  meta: { response_id: 'response_id' },
  data: [{ id: '0' }, { id: '1' }],
  pagination: {
    offset: 0,
    total_count: 1234,
    count: 25
  }
}

export const getEmptyState = () => ({
  gifs: getEmptyGifsState(),
  search: getEmptySearchState(),
  viewer: getEmptyViewerState()
})
