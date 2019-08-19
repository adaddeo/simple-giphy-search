import { RootAction } from '../'

// State

export interface ViewerState {
  gifIndex: number | null
}

// Actions

export const CLOSE    = 'viewer/CLOSE'
export const OPEN_GIF = 'viewer/OPEN_GIF'

export interface CloseAction {
  type: typeof CLOSE
}

export interface OpenGifAction {
  type: typeof OPEN_GIF
  payload: {
    gifIndex: number
  }
}

export type ViewerAction =
  | CloseAction
  | OpenGifAction

// Action Creators

export const close = (): CloseAction => {
  return {
    type: CLOSE
  }
}

export const openGif = (gifIndex: number): OpenGifAction => {
  return {
    type: OPEN_GIF,
    payload: {
      gifIndex
    }
  }
}

// Reducer

export const getEmptyState = (): ViewerState => ({
  gifIndex: null
})

export const reducer = (
  state: ViewerState = getEmptyState(),
  action: RootAction
): ViewerState => {
  if (action.type === CLOSE) {
    return getEmptyState()
  }

  if (action.type === OPEN_GIF) {
    const { gifIndex } = action.payload

    return {
      gifIndex
    }
  }

  return state
}
