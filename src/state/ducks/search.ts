import {
  GifsResult as GiphyResult,
  SearchOptions as GiphySearchOptions
} from '@giphy/js-fetch-api'
import { IGif } from '@giphy/js-types'
import giphy from '../../giphy'

// State

export interface SearchState {
  query: string
  isLoading: boolean
  gifs: IGif[]
  offset?: number
  totalCount?: number
}

// Actions

export const SEARCH_REQUEST = 'search/REQUEST'
export const SEARCH_REQUEST_PENDING = 'search/REQUEST_PENDING'
export const SEARCH_REQUEST_FUFILLED = 'search/REQUEST_FULFILLED'

interface SearchResponse {
  response: GiphyResult
  query: string
}

export interface SearchRequestAction {
  type: typeof SEARCH_REQUEST
  payload: {
    promise: Promise<SearchResponse>,
    data: {
      query: string
    }
  }
}

export interface SearchRequestPendingAction {
  type: typeof SEARCH_REQUEST_PENDING
  payload: {
    query: string
  }
}

export interface SearchRequestFulfilledAction {
  type: typeof SEARCH_REQUEST_FUFILLED
  payload: SearchResponse
}

export type SearchAction =
  | SearchRequestAction
  | SearchRequestPendingAction
  | SearchRequestFulfilledAction

// Action Creators

export const search = (
  query: string,
  options?: GiphySearchOptions
): SearchRequestAction => {
  const promise =
    giphy.search(query, options)
      .then(response => ({
        response,
        query
      }))

  return {
    type: SEARCH_REQUEST,
    payload: {
      promise,
      data: {
        query
      }
    }
  }
}

// Reducer

export const reducer = (
  state: SearchState = getEmptyState(),
  action: SearchAction
): SearchState => {
  if (action.type === SEARCH_REQUEST_PENDING) {
    const { query } = action.payload

    return {
      ...state,
      query,
      isLoading: true
    }
  }

  if (action.type === SEARCH_REQUEST_FUFILLED) {
    const { response, query } = action.payload

    // Ignore response if it's not for the current query
    if (query !== state.query) {
      return state
    }

    return {
      ...state,
      ...giphyResponseToState(response),
      isLoading: false
    }
  }

  return state
}

const getEmptyState = (): SearchState => ({
  query: '',
  gifs: [],
  isLoading: false
})

const giphyResponseToState = (response: GiphyResult): GifResultState => {
  const { data, pagination } = response

  return {
    gifs: data,
    offset: pagination.offset,
    totalCount: pagination.total_count
  }
}

// todo clean up
interface GifResultState {
  gifs: IGif[]
  offset?: number
  totalCount?: number
}
