import { Gif, GiphyResponse, trending as giphyTrending } from '../../lib/giphy-api'

// State

export interface TrendingState {
  isLoading: boolean
  gifs: Gif[]
  offset?: number
  totalCount?: number
  count?: number
}

// Actions

const TRENDING_REQUEST = 'trending/REQUEST'
const TRENDING_REQUEST_FUFILLED = 'trending/REQUEST_FULFILLED'

export interface TrendingRequestAction {
  type: typeof TRENDING_REQUEST
  payload: Promise<GiphyResponse>
}

export interface TrendingRequestFulfilledAction {
  type: typeof TRENDING_REQUEST_FUFILLED
  payload: GiphyResponse
}

export type TrendingAction =
  | TrendingRequestAction
  | TrendingRequestFulfilledAction

// Action Creators

export const trending = (): TrendingRequestAction => {
  const payload = giphyTrending()

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
  if (action.type === TRENDING_REQUEST) {
    return {
      ...state,
      isLoading: true
    }
  }

  if (action.type === TRENDING_REQUEST_FUFILLED) {
    const { payload } = action

    return {
      ...state,
      ...giphyResponseToState(payload)
    }
  }

  return state
}

const getEmptyState = (): TrendingState => ({
  gifs: [],
  isLoading: false
})

const giphyResponseToState = (response: GiphyResponse): Partial<TrendingState> => {
  const { data, pagination } = response

  return {
    gifs: data,
    offset: pagination.offset,
    totalCount: pagination.total_count,
    count: pagination.count
  }
}
