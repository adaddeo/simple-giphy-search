import configureMockStore from 'redux-mock-store'
import promise from 'redux-promise-middleware'
import {
  reducer,
  search,
  SEARCH_REQUEST_FUFILLED,
  SEARCH_REQUEST_PENDING
} from './search'

jest.mock('node-fetch')
import fetch from 'node-fetch'
const { Response } = jest.requireActual('node-fetch')

const middleware = [promise]
const mockStore = configureMockStore(middleware)
const mockGiphyResponse = {
  data: [{ id: 0 }, { id: 1 }],
  pagination: {
    offset: 0,
    total_count: 1234,
    count: 25
  }
}

describe('search duck', () => {
  describe('action creators' , () => {
    describe('search', () => {
      it(`creates ${SEARCH_REQUEST_PENDING} and ${SEARCH_REQUEST_FUFILLED} actions`, () => {
        fetch.mockReturnValue(Promise.resolve(new Response(JSON.stringify(mockGiphyResponse))))

        const expectedActions = [
          { type: SEARCH_REQUEST_PENDING, payload: { query: 'new' } },
          { type: SEARCH_REQUEST_FUFILLED, payload: { response: mockGiphyResponse, query: 'new' } }
        ]

        const store = mockStore({ query: 'old', gifs: [], isLoading: false })

        return store.dispatch(search('new')).then(() => {
          expect(store.getActions()).toEqual(expectedActions)
        })
      })
    })
  })

  describe('reducer', () => {
    it('should return the initial state', () => {
      expect(reducer(undefined, {})).toEqual({
        query: '',
        gifs: [],
        isLoading: false
      })
    })

    describe(SEARCH_REQUEST_PENDING, () => {
      it('should update query and isLoading', () => {
        expect(
          reducer({ query: 'old', gifs: [], isLoading: false }, {
            type: SEARCH_REQUEST_PENDING,
            payload: {
              query: 'new'
            }
          })
        ).toMatchObject({
          query: 'new',
          isLoading: true
        })
      })
    })

    describe(SEARCH_REQUEST_FUFILLED, () => {
      it('should update gifs, totalCount, offset and isLoading', () => {
        expect(
          reducer({ query: 'hello', gifs: [], isLoading: true }, {
            type: SEARCH_REQUEST_FUFILLED,
            payload: {
              response: mockGiphyResponse,
              query: 'hello'
            }
          })
        ).toEqual({
          query: 'hello',
          isLoading: false,
          gifs: mockGiphyResponse.data,
          totalCount: mockGiphyResponse.pagination.total_count,
          offset: mockGiphyResponse.pagination.offset
        })
      })

      it('should do nothing if query has changed', () => {
        expect(
          reducer({ query: 'hi', gifs: [], isLoading: false }, {
            type: SEARCH_REQUEST_FUFILLED,
            payload: {
              response: mockGiphyResponse,
              query: 'hello'
            }
          })
        ).toEqual({
          query: 'hi',
          isLoading: false,
          gifs: []
        })
      })
    })
  })
})
