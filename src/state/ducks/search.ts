import { ThunkDispatch, ThunkResult } from '../index'
import { RootAction } from '../index'
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

const updateQuery = (query: string): UpdateQueryAction => {
  return {
    type: UPDATE_QUERY,
    payload: {
      query
    }
  }
}

export const search = (query: string): ThunkResult<void> => {
  return (dispatch: ThunkDispatch) => {
    dispatch(updateQuery(query))
    dispatch(fetchGifs())
  }
}

// Reducer

export const reducer = (
  state: SearchState = { query: '' },
  action: RootAction
): SearchState => {
  if (action.type === UPDATE_QUERY) {
    const { query } = action.payload

    return { query }
  }

  return state
}
