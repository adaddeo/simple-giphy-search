import { getEmptyState, mockGiphyResponse, mockStore } from '../test-helpers'
import {
  FETCH_FUFILLED,
  FETCH_PENDING,
  FETCH_REJECTED,
  fetchGifs,
  getEmptyState as getEmptyGifsState,
  reducer
} from './gifs'

describe('gifs duck', () => {
  describe('action creators' , () => {
    describe('fetchGifs', () => {
      it('handles a failed request gracefully', () => {
        fetch.mockRejectOnce(new Error('failed request'))
        fetch.mockResponseOnce(JSON.stringify(mockGiphyResponse))

        const expectedActions = [
          { type: FETCH_PENDING },
          { type: FETCH_REJECTED },
          { type: FETCH_PENDING },
          { type: FETCH_FUFILLED, payload: { id: 0, response: mockGiphyResponse } }
        ]

        const store = mockStore(getEmptyState())

        return store.dispatch(fetchGifs()).then(() => {
          expect(store.getActions()).toMatchObject(expectedActions)
        })
      })

      it(`creates ${FETCH_PENDING} and ${FETCH_FUFILLED} actions`, () => {
        fetch.mockResponseOnce(JSON.stringify(mockGiphyResponse))

        const expectedActions = [
          { type: FETCH_PENDING },
          { type: FETCH_FUFILLED, payload: { id: 0, response: mockGiphyResponse } }
        ]

        const store = mockStore(getEmptyState())

        return store.dispatch(fetchGifs()).then(() => {
          expect(store.getActions()).toMatchObject(expectedActions)
        })
      })
    })
  })

  describe('reducer', () => {
    it('should return the initial state', () => {
      expect(reducer(undefined, {})).toEqual(getEmptyGifsState())
    })

    describe(FETCH_PENDING, () => {
      it('should increment pendingRequests', () => {
        const state = {
          gifs: [],
          pendingRequests: 0
        }
        const action = {
          type: FETCH_PENDING
        }
        const expectedState = {
          pendingRequests: state.pendingRequests + 1
        }

        expect(reducer(state, action)).toMatchObject(expectedState)
      })
    })

    describe(FETCH_FUFILLED, () => {
      it('should update gifs, totalCount, offset and decrement pendingRequests', () => {
        const id = 0
        const state = {
          ...getEmptyGifsState(),
          id,
          pendingRequests: 1
        }
        const action = {
          type: FETCH_FUFILLED,
          payload: {
            id,
            response: mockGiphyResponse
          }
        }
        const expectedState = {
          id,
          pendingRequests: 0,
          gifs: mockGiphyResponse.data,
          totalCount: mockGiphyResponse.pagination.total_count,
          offset: mockGiphyResponse.pagination.offset + mockGiphyResponse.pagination.count
        }

        expect(reducer(state, action)).toEqual(expectedState)
      })

      it('ignores actions with a different id', () => {
        const state = {
          ...getEmptyGifsState(1),
          pendingRequests: 1
        }
        const action = {
          type: FETCH_FUFILLED,
          payload: {
            id: 0,
            response: mockGiphyResponse
          }
        }
        const expectedState = state

        expect(reducer(state, action)).toEqual(expectedState)
      })

      it('does not add already loaded gifs', () => {
        const state = {
          ...getEmptyGifsState(0),
          gifs: mockGiphyResponse.data,
          pendingRequests: 1
        }

        const action = {
          type: FETCH_FUFILLED,
          payload: {
            id: 0,
            response: mockGiphyResponse
          }
        }

        expect(reducer(state, action).gifs).toEqual(mockGiphyResponse.data)
      })

      it('handles 200 "error" giphy result (example: search ~!@#$%^&())', () => {
        const state = {
          ...getEmptyGifsState(),
          pendingRequests: 1
        }
        const action = {
          type: FETCH_FUFILLED,
          payload: {
            id: 0,
            response: {
              data: [],
              meta: {
                msg: 'User Not Found',
                status: 200
              }
            }
          }
        }
        const expectedState = state

        expect(reducer(state, action)).toEqual(expectedState)
      })
    })
  })
})
