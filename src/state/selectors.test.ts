import {
  isLoadingSelector,
  moreGifsSelector,
  viewGifSelector
} from './selectors'

describe('selectors', () => {
  test('isLoadingSelector', () => {
    let state = {
      gifs: {
        pendingRequests: 0
      }
    }

    expect(isLoadingSelector(state)).toBe(false)
    expect(isLoadingSelector(state)).toBe(false)
    expect(isLoadingSelector.recomputations()).toBe(1)

    state = {
      gifs: {
        pendingRequests: 1
      }
    }

    expect(isLoadingSelector(state)).toBe(true)
    expect(isLoadingSelector(state)).toBe(true)
    expect(isLoadingSelector.recomputations()).toBe(2)
  })

  test('moreGifsSelector', () => {
    let state = {
      gifs: {
        offset: 0,
        totalCount: undefined
      }
    }

    expect(moreGifsSelector(state)).toBe(true)
    expect(moreGifsSelector(state)).toBe(true)
    expect(moreGifsSelector.recomputations()).toBe(1)

    state = {
      gifs: {
        offset: 99,
        totalCount: 100
      }
    }

    expect(moreGifsSelector(state)).toBe(true)
    expect(moreGifsSelector(state)).toBe(true)
    expect(moreGifsSelector.recomputations()).toBe(2)
  })

  test('viewerGifSelector', () => {
    let state = {
      gifs: {
        gifs: [ { id: 0 }, { id: 1} ],
      },
      viewer: {
        gifIndex: null
      }
    }

    expect(viewGifSelector(state)).toBe(null)
    expect(viewGifSelector(state)).toBe(null)
    expect(viewGifSelector.recomputations()).toBe(1)

    state = {
      gifs: {
        gifs: [ { id: 0 }, { id: 1} ],
      },
      viewer: {
        gifIndex: 1
      }
    }

    expect(viewGifSelector(state)).toEqual(state.gifs.gifs[1])
    expect(viewGifSelector(state)).toEqual(state.gifs.gifs[1])
    expect(viewGifSelector.recomputations()).toBe(2)
  })
})
