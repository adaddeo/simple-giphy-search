import configureMockStore from 'redux-mock-store'
import {
  close,
  CLOSE,
  getEmptyState,
  OPEN_GIF,
  openGif,
  reducer
} from './viewer'

const mockStore = configureMockStore()

describe('viewer duck', () => {
  describe('action creators' , () => {
    describe(CLOSE, () => {
      it('creates a close action', () => {
        const expectedAction = {
          type: CLOSE
        }
        expect(close()).toEqual(expectedAction)
      })
    })

    describe(OPEN_GIF, () => {
      it('creates an open gif action', () => {
        const gifIndex = 0
        const expectedAction = {
          type: OPEN_GIF,
          payload: {
            gifIndex
          }
        }
        expect(openGif(gifIndex)).toEqual(expectedAction)
      })
    })
  })

  describe('reducer', () => {
    it('should return the initial state', () => {
      expect(reducer(undefined, {})).toEqual(getEmptyState())
    })

    describe(CLOSE, () => {
      it('should clear index', () => {
        const state = { index: 0 }
        const action = close()
        const expectedState = getEmptyState()

        expect(reducer(state, action)).toEqual(expectedState)
      })
    })

    describe(OPEN_GIF, () => {
      it('should set index', () => {
        const gifIndex = 0
        const state = getEmptyState()
        const action = openGif(gifIndex)
        const expectedState = { gifIndex }

        expect(reducer(state, action)).toEqual(expectedState)
      })
    })
  })
})
