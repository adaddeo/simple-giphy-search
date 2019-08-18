import { ThunkAction, ThunkDispatch } from 'redux-thunk'
import { GifsAction, GifsState } from './ducks/gifs'
import { SearchAction, SearchState } from './ducks/search'

export interface RootState {
  search: SearchState
  gifs: GifsState
}

export type RootAction =
  | SearchAction
  | GifsAction

export type ThunkResult<R> = ThunkAction<R, RootState, undefined, RootAction>
export type ThunkDispatch = ThunkDispatch<RootState, undefined, RootAction>
export type ThunkGetState = () => RootState
