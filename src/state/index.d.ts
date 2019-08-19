import { AsyncAction } from 'redux-promise-middleware'
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

declare module 'redux' {
  type PayloadType<PA> = PA extends AsyncAction<infer R> ? R : never;

  export type Dispatch<S> = <R, PA extends AsyncAction<R>>(action: PA) => Promise<{
    value: PayloadType<PA>;
    type: string;
  }>
}

export type ThunkResult<R> = ThunkAction<R, RootState, undefined, RootAction>
export type ThunkGetState = () => RootState

// Get redux-thunk to infer redux-promise-middleware AsyncActions and return a Promise
type PayloadType<PA> = PA extends AsyncAction<infer R> ? R : never

export interface ThunkDispatch {
  <TReturnType>(thunkAction: ThunkResult): TReturnType

  <R, PA extends AsyncAction<R>>(action: PA): Promise<{
    value: PayloadType<PA>
    type: string
  }>
}
