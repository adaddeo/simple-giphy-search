import { ActionType, StateType } from 'typesafe-actions'
import { RootAction } from './root'

/*
 * Enable type-free syntax, see:
 * https://github.com/piotrwitek/typesafe-actions#extending-internal-types-to-enable-type-free-syntax-with-createreducer
 */
declare module 'typesafe-actions' {
  export type Store = StateType<typeof import('./store').default>
  export type RootState = RootState
  export type RootAction = RootAction

  interface Types {
    RootAction: RootAction
  }
}
