import configureMockStore from 'redux-mock-store'
import promise from 'redux-promise-middleware'
import thunk from 'redux-thunk'
import { FETCH_PENDING } from './gifs'
import {
  reducer,
  search,
  UPDATE_QUERY
} from './search'

jest.mock('@giphy/js-fetch-api')
import giphy from 'node-fetch'

const middleware = [thunk, promise]
const mockStore = configureMockStore(middleware)

describe('search duck', () => {
  describe('action creators' , () => {
    describe('updateQuery', () => {
      it(`dispatches ${UPDATE_QUERY} and ${FETCH_PENDING} actions`, () => {

        const expectedActions = [
          { type: UPDATE_QUERY, payload: { query: 'new' } },
          { type: FETCH_PENDING }
        ]

        const store = mockStore({ search: { query: 'old' }, gifs: { gifs: [], offset: 0, id: 0 } })

        store.dispatch(search('new'))
        expect(store.getActions()).toEqual(expectedActions)
      })
    })
  })

  describe('reducer', () => {
    it('should return the initial state', () => {
      expect(reducer(undefined, {})).toEqual({
        query: ''
      })
    })

    describe(UPDATE_QUERY, () => {
      it('should update query', () => {
        expect(
          reducer({ query: 'old' }, {
            type: UPDATE_QUERY,
            payload: {
              query: 'new'
            }
          })
        ).toMatchObject({
          query: 'new'
        })
      })
    })
  })
})
