import { combineEpics, Epic } from 'redux-observable'
import { from, of } from 'rxjs'
import { catchError, debounceTime, filter, map, retry, switchMap } from 'rxjs/operators'
import {
  ActionType,
  createAction,
  createAsyncAction,
  createReducer,
  isActionOf
} from 'typesafe-actions'
import { Gif, GiphyResponse } from '../lib/giphy-api'
import { Dependencies } from './dependencies'

/* Actions & Action Creators */

export const initialize = createAction('INITIALIZE')

export const search = createAction('search/QUERY', action => {
  return (query: string) => action({ query })
})

export const fetchSearchGifs = createAsyncAction(
  'FETCH_SEARCH_GIFS_REQUEST',
  'FETCH_SEARCH_GIFS_SUCCESS',
  'FETCH_SEARCH_GIFS_FAILURE'
)<string, GiphyResponse, Error, string>()

export const fetchTrendingGifs = createAsyncAction(
  'FETCH_TRENDING_GIFS_REQUEST',
  'FETCH_TRENDING_GIFS_SUCCESS',
  'FETCH_TRENDING_GIFS_FAILURE'
)<undefined, GiphyResponse, Error, string>()

export type RootAction = ActionType<typeof initialize>
  | ActionType<typeof search>
  | ActionType<typeof fetchSearchGifs>
  | ActionType<typeof fetchTrendingGifs>

/* Epics */

type AppEpic = Epic<RootAction, RootAction, RootState, Dependencies>

export const initializeEpic: AppEpic =
  action$ =>
    action$.pipe(
      filter(isActionOf(initialize)),
      map(() => fetchTrendingGifs.request())
    )

/*
 * debounceTime is used to rate-limit incoming search changes so requests
 * can be made more smoothly after a user stops typing.
 *
 * switchMap is used to "cancel" any pending requests.
 */
export const searchEpic: AppEpic =
  action$ =>
    action$.pipe(
      filter(isActionOf(search)),
      debounceTime(150),
      map(action => fetchSearchGifs.request(action.payload.query))
    )

export const fetchSearchGifsEpic: AppEpic =
  (action$, store, { giphyApi }) =>
    action$
      .pipe(
        filter(isActionOf(fetchSearchGifs.request)),
        switchMap(action =>
          from(giphyApi.search({ q: action.payload }))
            .pipe(
              retry(3), // todo fix me
              map(fetchSearchGifs.success),
              catchError(e => of(fetchSearchGifs.failure(e)))
            )
          )
        )

export const fetchTrendingGifsEpic: AppEpic =
  (action$, store, { giphyApi }) =>
    action$
      .pipe(
        filter(isActionOf(fetchTrendingGifs.request)),
        switchMap(action =>
          from(giphyApi.trending())
            .pipe(
              retry(3), // todo fix me
              map(fetchTrendingGifs.success),
              catchError(e => of(fetchTrendingGifs.failure(e)))
            )
          )
        )

export const epic = combineEpics(
  initializeEpic,
  fetchSearchGifsEpic,
  fetchTrendingGifsEpic,
  searchEpic
)

/* Reducer */

interface GifResultState {
  gifs: Gif[]
  offset?: number
  totalCount?: number
  count?: number
}

export interface RootState {
  query: string
  trending: GifResultState
  search: GifResultState
}

const initialState: RootState = {
  query: '',
  search: {
    gifs: []
  },
  trending: {
    gifs: []
  }
}

export const reducer =
  createReducer<RootState, RootAction>(initialState)
    .handleAction(search, (state, action) => ({ ...state, query: action.payload.query }))
    .handleAction(fetchSearchGifs.success, (state, action) => ({ ...state, search: giphyResponseToState(action.payload) }))
    .handleAction(fetchTrendingGifs.success, (state, action) => ({ ...state, trending: giphyResponseToState(action.payload) }))

const giphyResponseToState = (response: GiphyResponse): GifResultState => {
  const { data, pagination } = response

  return {
    gifs: data,
    offset: pagination.offset,
    totalCount: pagination.total_count,
    count: pagination.count
  }
}
