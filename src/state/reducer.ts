import { combineReducers } from 'redux'
import {
  reducer as search,
  SearchAction,
  SearchState,
} from './ducks/search'
import {
  reducer as trending,
  TrendingAction,
  TrendingState,
} from './ducks/trending'

export interface RootState {
  search: SearchState
  trending: TrendingState
}

export type RootAction =
  | SearchAction
  | TrendingAction

export const reducers = {
  search,
  trending
}

// @ts-ignore: AnyAction breaks strong type checking inside reducers
export const reducer = combineReducers<RootState, RootAction>(reducers)
