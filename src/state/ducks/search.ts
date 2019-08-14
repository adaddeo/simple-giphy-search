import { Gif, GiphyResponse, search as giphySearch } from '../../lib/giphy-api'

// State

export interface SearchState {
  query: string
  isLoading: boolean
  gifs: Gif[]
  offset?: number
  totalCount?: number
  count?: number
}

// Actions

const SEARCH_REQUEST = 'search/REQUEST'
const SEARCH_REQUEST_PENDING = 'search/REQUEST_PENDING'
const SEARCH_REQUEST_FUFILLED = 'search/REQUEST_FULFILLED'

interface SearchResponse {
  response: GiphyResponse
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

export const search = (query: string): SearchRequestAction => {
  const promise =
    giphySearch({ q: query })
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
      query
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
      ...giphyResponseToState(response)
    }
  }

  return state
}

const getEmptyState = (): SearchState => ({
  query: '',
  gifs: [],
  isLoading: false
})

const giphyResponseToState = (response: GiphyResponse): GifResultState => {
  const { data, pagination } = response

  return {
    gifs: data,
    offset: pagination.offset,
    totalCount: pagination.total_count,
    count: pagination.count
  }
}

// todo clean up
interface GifResultState {
  gifs: Gif[]
  offset?: number
  totalCount?: number
  count?: number
}
