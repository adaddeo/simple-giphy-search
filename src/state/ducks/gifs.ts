import { GifsResult as GiphyResult } from '@giphy/js-fetch-api'
import { IGif } from '@giphy/js-types'
import giphy from '../../giphy'
import { ThunkDispatch, ThunkGetState, ThunkResult } from '../index'
import { RootAction } from '../index'
import { UPDATE_QUERY } from './search'

// State

export interface GifsState {
  id: number
  gifs: IGif[]
  pendingRequests: number
  offset: number
  totalCount?: number
}

export const updateStateFromGiphyResult =
  (state: GifsState, result: GiphyResult) => {
    const { data, pagination } = result

    return {
      ...state,
      gifs: [...state.gifs, ...data],
      offset: pagination.offset + pagination.count,
      totalCount: pagination.total_count,
      pendingRequests: state.pendingRequests - 1
    }
  }

// Actions

export const FETCH = 'gifs/FETCH'
export const FETCH_PENDING = 'gifs/FETCH_PENDING'
export const FETCH_FUFILLED = 'gifs/FETCH_FULFILLED'

interface FetchResult {
  id: number
  response: GiphyResult
}

export interface FetchAction {
  type: typeof FETCH
  payload: Promise<FetchResult>
}

export interface FetchPendingAction {
  type: typeof FETCH_PENDING
}

export interface FetchFulfilledAction {
  type: typeof FETCH_FUFILLED
  payload: FetchResult
}

export type GifsAction =
  | FetchAction
  | FetchPendingAction
  | FetchFulfilledAction

// Action Creators

export const fetchGifs = (): ThunkResult<FetchAction> => {
  return (dispatch: ThunkDispatch, getState: ThunkGetState) => {
    const state = getState()
    const { query } = state.search
    const { id, offset } = state.gifs

    const payload = new Promise<FetchResult>(async (resolve) => {
      const request = query === '' ? giphy.trending({ offset }) : giphy.search(query, { offset })
      const response = await request

      resolve({ id, response })
    })

    return dispatch({
      type: FETCH,
      payload
    })
  }
}

// Reducer

export const getEmptyState = (id: number = 0) => ({
  id,
  gifs: [],
  pendingRequests: 0,
  offset: 0
})

export const reducer = (
  state: GifsState = getEmptyState(),
  action: RootAction
): GifsState => {
  if (action.type === FETCH_PENDING) {
    return {
      ...state,
      pendingRequests: state.pendingRequests + 1
    }
  }

  if (action.type === FETCH_FUFILLED) {
    const { id, response } = action.payload

    // Ignore the request if it's from a previous search
    if (state.id !== id) {
      return state
    }

    const { data, pagination } = response

    const gifs = [...state.gifs, ...data]
    // Account for the possibility that requests come back out-of-order
    const offset = Math.max(state.offset, pagination.offset + pagination.count)

    return {
      ...state,
      gifs,
      offset,
      totalCount: pagination.total_count,
      pendingRequests: state.pendingRequests - 1
    }
  }

  if (action.type === UPDATE_QUERY) {
    return getEmptyState(state.id + 1)
  }

  return state
}
