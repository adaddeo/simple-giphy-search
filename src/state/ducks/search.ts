import { ofType } from 'redux-observable'
import { mapTo } from 'rxjs/operators'
import { Epic, RootAction } from '../index'
import { fetchGifs } from './gifs'

// State

export interface SearchState {
  query: string
}

// Actions

export const UPDATE_QUERY = 'search/UPDATE_QUERY'

export interface UpdateQueryAction {
  type: typeof UPDATE_QUERY
  payload: {
    query: string
  }
}

export type SearchAction = UpdateQueryAction

// Action Creators

export const search = (query: string): UpdateQueryAction => {
  return {
    type: UPDATE_QUERY,
    payload: {
      query
    }
  }
}

// Epic

export const epic: Epic =
  action$ => action$.pipe(
    ofType(UPDATE_QUERY),
    mapTo(fetchGifs())
  )

// Reducer

export const getEmptyState = (): SearchState => ({
  query: ''
})

export const reducer = (
  state: SearchState = getEmptyState(),
  action: RootAction
): SearchState => {
  if (action.type === UPDATE_QUERY) {
    const { query } = action.payload

    return { query }
  }

  return state
}
