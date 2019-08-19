import fetch from 'jest-fetch-mock'
import { getEmptyState, mockGiphyResponse, mockStore } from '../test-helpers'
import { FETCH_PENDING } from './gifs'
import {
  getEmptyState as getEmptySearchState,
  reducer,
  search,
  UPDATE_QUERY
} from './search'

describe('search duck', () => {
  describe('action creators' , () => {
    describe(UPDATE_QUERY, () => {
      beforeEach(() => {
        fetch.resetMocks()
      })

      it(`dispatches ${UPDATE_QUERY} and ${FETCH_PENDING} actions`, () => {
        fetch.mockResponseOnce(JSON.stringify(mockGiphyResponse))

        const query = 'new search query'

        const expectedActions = [
          { type: UPDATE_QUERY, payload: { query } },
          { type: FETCH_PENDING }
        ]

        const store = mockStore(getEmptyState())

        store.dispatch(search(query))
        expect(store.getActions()).toEqual(expectedActions)
      })
    })
  })

  describe('reducer', () => {
    it('should return the initial state', () => {
      expect(reducer(undefined, {})).toEqual(getEmptySearchState())
    })

    describe(UPDATE_QUERY, () => {
      it('should update query', () => {
        const query = 'new query'
        const state = { query: 'old query' }
        const action = {
          type: UPDATE_QUERY,
          payload: {
            query
          }
        }
        const expectedState = {
          query
        }

        expect(reducer(state, action)).toEqual(expectedState)
      })
    })
  })
})
