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
export const FETCH_REJECTED = 'gifs/FETCH_REJECTED'

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

export const fetchGifs = (retry: boolean = true): ThunkResult<FetchAction> => {
  return (dispatch: ThunkDispatch, getState: ThunkGetState) => {
    const state = getState()
    const { query } = state.search
    const { id, offset } = state.gifs

    const payload = new Promise<FetchResult>(async (resolve, reject) => {
      const request = query === '' ? giphy.trending({ offset }) : giphy.search(query, { offset })
      try {
        const response = await request

        resolve({ id, response })
      } catch (e) {
        reject(e)
      }
    })

    return dispatch({
      type: FETCH,
      payload
    }).catch(() => {
      // Retry once
      if (retry) {
        console.log('retrying')
        return dispatch(fetchGifs(false))
      } else {
        return Promise.resolve()
        console.log('NOT RETRYING')
      }
    })
  }
}

// Reducer

export const getEmptyState = (id: number = 0): GifsState => ({
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

    // Ignore if we have no data (example searching ~!@#$%^&() seems to break the Giphy
    // api and return a strange 200 but with an error message and no data)
    if (data.length === 0 && pagination === undefined) {
      return state
    }

    // This de-dupe method could be made more efficient by storing ids in a Map in state
    const gifIds = state.gifs.reduce(
      (acc: any, g) => {
        acc[g.id] = true
        return acc;
      },
    {})

    // Only add gifs that aren't already in state
    const gifs = [...state.gifs, ...data.filter(g => gifIds[g.id] === undefined)]

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
