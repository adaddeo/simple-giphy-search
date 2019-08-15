import {
  GifsResult as GiphyResult,
  SearchOptions as GiphySearchOptions
} from '@giphy/js-fetch-api'
import { IGif } from '@giphy/js-types'
import giphy from '../../giphy'

// State

export interface TrendingState {
  isLoading: boolean
  gifs: IGif[]
  offset?: number
  totalCount?: number
}

// Actions

export const TRENDING_REQUEST = 'trending/REQUEST'
export const TRENDING_REQUEST_PENDING = 'trending/REQUEST_PENDING'
export const TRENDING_REQUEST_FUFILLED = 'trending/REQUEST_FULFILLED'

export interface TrendingRequestAction {
  type: typeof TRENDING_REQUEST
  payload: Promise<GiphyResult>
}

export interface TrendingRequestPendingAction {
  type: typeof TRENDING_REQUEST_PENDING
}

export interface TrendingRequestFulfilledAction {
  type: typeof TRENDING_REQUEST_FUFILLED
  payload: GiphyResult
}

export type TrendingAction =
  | TrendingRequestAction
  | TrendingRequestPendingAction
  | TrendingRequestFulfilledAction

// Action Creators

export const trending = (options?: GiphySearchOptions): TrendingRequestAction => {
  const payload = giphy.trending(options)

  return {
    type: TRENDING_REQUEST,
    payload
  }
}

// Reducer

export const reducer = (
  state: TrendingState = getEmptyState(),
  action: TrendingAction
): TrendingState => {
  if (action.type === TRENDING_REQUEST_PENDING) {
    return {
      ...state,
      isLoading: true
    }
  }

  if (action.type === TRENDING_REQUEST_FUFILLED) {
    const { payload } = action

    return {
      ...state,
      ...giphyResponseToState(payload),
      isLoading: false
    }
  }

  return state
}

const getEmptyState = (): TrendingState => ({
  gifs: [],
  isLoading: false
})

const giphyResponseToState = (response: GiphyResult): Partial<TrendingState> => {
  const { data, pagination } = response

  return {
    gifs: data,
    offset: pagination.offset,
    totalCount: pagination.total_count
  }
}
