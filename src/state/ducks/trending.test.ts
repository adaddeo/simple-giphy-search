import configureMockStore from 'redux-mock-store'
import promise from 'redux-promise-middleware'
import {
  reducer,
  trending,
  TRENDING_REQUEST_FUFILLED,
  TRENDING_REQUEST_PENDING
} from './trending'

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

describe('trending duck', () => {
  describe('action creators' , () => {
    describe('trending', () => {
      it(`creates ${TRENDING_REQUEST_PENDING} and ${TRENDING_REQUEST_FUFILLED} actions`, () => {
        fetch.mockReturnValue(Promise.resolve(new Response(JSON.stringify(mockGiphyResponse))))

        const expectedActions = [
          { type: TRENDING_REQUEST_PENDING},
          { type: TRENDING_REQUEST_FUFILLED, payload: mockGiphyResponse }
        ]

        const store = mockStore({ gifs: [], isLoading: false })

        return store.dispatch(trending()).then(() => {
          expect(store.getActions()).toEqual(expectedActions)
        })
      })
    })
  })

  describe('reducer', () => {
    it('should return the initial state', () => {
      expect(reducer(undefined, {})).toEqual({
        gifs: [],
        isLoading: false
      })
    })

    describe(TRENDING_REQUEST_PENDING, () => {
      it('should update isLoading', () => {
        expect(
          reducer({ gifs: [], isLoading: false }, {
            type: TRENDING_REQUEST_PENDING
          })
        ).toMatchObject({ isLoading: true })
      })
    })

    describe(TRENDING_REQUEST_FUFILLED, () => {
      it('should update gifs, totalCount, offset and isLoading', () => {
        expect(
          reducer({ gifs: [], isLoading: true }, {
            type: TRENDING_REQUEST_FUFILLED,
            payload: mockGiphyResponse
          })
        ).toEqual({
          isLoading: false,
          gifs: mockGiphyResponse.data,
          totalCount: mockGiphyResponse.pagination.total_count,
          offset: mockGiphyResponse.pagination.offset
        })
      })
    })
  })

})
