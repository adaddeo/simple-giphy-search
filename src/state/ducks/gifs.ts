import { GifsResult as GiphyResult } from '@giphy/js-fetch-api'
import { IGif } from '@giphy/js-types'
import { ofType } from 'redux-observable'
import { from, of } from 'rxjs'
import {
  catchError,
  map,
  retry,
  switchMap,
  withLatestFrom
} from 'rxjs/operators'
import giphy from '../../giphy'
import { Epic, RootAction, RootState } from '../index'
import { UPDATE_QUERY } from './search'

// State

export interface GifsState {
  gifs: IGif[]
  isLoading: boolean
  offset: number
  totalCount?: number
}

// Actions

export const FETCH_PENDING = 'gifs/FETCH_PENDING'
export const FETCH_FUFILLED = 'gifs/FETCH_FULFILLED'
export const FETCH_REJECTED = 'gifs/FETCH_REJECTED'
export const FETCH_CANCEL = 'gifs/FETCH_CANCEL'

export interface FetchPendingAction {
  type: typeof FETCH_PENDING
}

export interface FetchFulfilledAction {
  type: typeof FETCH_FUFILLED
  payload: GiphyResult
}

export interface FetchRejectedAction {
  type: typeof FETCH_REJECTED
  payload: any
}

export interface FetchCancelAction {
  type: typeof FETCH_CANCEL
}

export type GifsAction =
  | FetchPendingAction
  | FetchFulfilledAction
  | FetchRejectedAction
  | FetchCancelAction

// Action Creators

export const fetchGifs = () => ({
  type: FETCH_PENDING
})

export const fetchGifsFufilled = (payload: GiphyResult) => ({
  type: FETCH_FUFILLED,
  payload
})

export const fetchGifsRejected = (error: any) => ({
  type: FETCH_REJECTED,
  payload: error.xhr.response
})

export const fetchGifsCancel = () => ({
  type: FETCH_CANCEL
})

// Epics

const gifsRequest = (state: RootState) => {
  const { search: { query }, gifs: { offset } } = state

  return state.search.query === '' ?
    giphy.trending({ offset }) :
    giphy.search(query, { offset })
}

export const epic: Epic = (action$, state$) => action$.
  pipe(
    ofType(FETCH_PENDING),
    withLatestFrom(state$),
    switchMap(([, state]) =>
      from(gifsRequest(state)).pipe(
        map(fetchGifsFufilled),
        retry(3),
        catchError(error => of(fetchGifsRejected(error.xhr.response)))
      )
    )
  )

// Reducer

export const getEmptyState = (): GifsState => ({
  gifs: [],
  isLoading: false,
  offset: 0
})

export const reducer = (
  state: GifsState = getEmptyState(),
  action: RootAction
): GifsState => {
  if (action.type === FETCH_PENDING) {
    return {
      ...state,
      isLoading: true
    }
  }

  if (action.type === FETCH_FUFILLED) {
    const { data, pagination } = action.payload

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
    const gifs = [...state.gifs, ...data.filter((g: IGif) => gifIds[g.id] === undefined)]

    // Account for the possibility that requests come back out-of-order
    const offset = Math.max(state.offset, pagination.offset + pagination.count)

    return {
      ...state,
      gifs,
      offset,
      totalCount: pagination.total_count,
      isLoading: false
    }
  }

  if (action.type === UPDATE_QUERY) {
    return getEmptyState()
  }

  return state
}
