import { combineReducers } from 'redux'
import { combineEpics } from 'redux-observable'
import { epic as gifsEpic, reducer as gifs } from './ducks/gifs'
import { epic as searchEpic, reducer as search } from './ducks/search'
import { reducer as viewer } from './ducks/viewer'
import { Epic, RootAction, RootState } from './index'

export const reducer = combineReducers<RootState, RootAction>({
  search,
  gifs,
  viewer
})

export const epic = combineEpics<Epic>(
  gifsEpic,
  searchEpic
)
