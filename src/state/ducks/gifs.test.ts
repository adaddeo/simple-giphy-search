import * as fetch from 'jest-fetch-mock'
import configureMockStore from 'redux-mock-store'
import promise from 'redux-promise-middleware'
import thunk from 'redux-thunk'
import {
  FETCH_FUFILLED,
  FETCH_PENDING,
  fetchGifs,
  getEmptyState,
  reducer
} from './gifs'

const middleware = [thunk, promise]
const mockStore = configureMockStore(middleware)
const mockGiphyResponse = {
  meta: { response_id: 'response_id' },
  data: [{ id: '0' }, { id: '1' }],
  pagination: {
    offset: 0,
    total_count: 1234,
    count: 25
  }
}

describe('gifs duck', () => {
  describe('action creators' , () => {
    describe('fetchGifs', () => {
      it(`creates ${FETCH_PENDING} and ${FETCH_FUFILLED} actions`, () => {
        fetch.mockResponseOnce(JSON.stringify(mockGiphyResponse))

        const expectedActions = [
          { type: FETCH_PENDING },
          { type: FETCH_FUFILLED, payload: { id: 0, response: mockGiphyResponse } }
        ]

        const store = mockStore({
          gifs: getEmptyState(),
          search: {
            query: ''
          }
        })

        return store.dispatch(fetchGifs()).then(() => {
          expect(store.getActions()).toMatchObject(expectedActions)
        })
      })
    })
  })

  describe('reducer', () => {
    it('should return the initial state', () => {
      expect(reducer(undefined, {})).toEqual(getEmptyState())
    })

    describe(FETCH_PENDING, () => {
      it('should increment pendingRequests', () => {
        expect(
          reducer({ gifs: [], pendingRequests: 0 }, {
            type: FETCH_PENDING
          })
        ).toMatchObject({ pendingRequests: 1 })
      })
    })

    describe(FETCH_FUFILLED, () => {
      it('should update gifs, totalCount, offset and decrement pendingRequests', () => {
        const state = {
          ...getEmptyState(),
          pendingRequests: 1
        }

        expect(
          reducer(state, {
            type: FETCH_FUFILLED,
            payload: {
              id: 0,
              response: mockGiphyResponse
            }
          })
        ).toEqual({
          id: 0,
          pendingRequests: 0,
          gifs: mockGiphyResponse.data,
          totalCount: mockGiphyResponse.pagination.total_count,
          offset: mockGiphyResponse.pagination.offset + mockGiphyResponse.pagination.count
        })
      })
    })

    describe(FETCH_FUFILLED, () => {
      it('ignores actions with a different id', () => {
        const state = {
          ...getEmptyState(1),
          pendingRequests: 1
        }

        expect(
          reducer(state, {
            type: FETCH_FUFILLED,
            payload: {
              id: 0,
              response: mockGiphyResponse
            }
          })
        ).toEqual(state)
      })
    })
  })
})
