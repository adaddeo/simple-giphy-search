import { combineReducers } from 'redux'
import { reducer as gifs } from './ducks/gifs'
import { reducer as search } from './ducks/search'
import { reducer as viewer } from './ducks/viewer'
import { RootAction, RootState } from './index'

export const reducers = {
  search,
  gifs,
  viewer
}

export const reducer = combineReducers<RootState, RootAction>(reducers)
