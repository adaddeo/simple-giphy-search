import { Epic as ReduxObservableEpic } from 'redux-observable'
import { GifsAction, GifsState } from './ducks/gifs'
import { SearchAction, SearchState } from './ducks/search'
import { ViewerAction, ViewerState } from './ducks/viewer'

export interface RootState {
  search: SearchState
  gifs: GifsState,
  viewer: ViewerState
}

export type RootAction =
  | GifsAction
  | SearchAction
  | ViewerActions

export type Epic = ReduxObservableEpic<RootAction, RootAction, RootState, void>
