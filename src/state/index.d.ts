import { ThunkAction, ThunkDispatch } from 'redux-thunk'
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
  | ViewerAction

export type ThunkResult<R> = ThunkAction<R, RootState, undefined, RootAction>
export type ThunkDispatch = ThunkDispatch<RootState, undefined, RootAction>
export type ThunkGetState = () => RootState
