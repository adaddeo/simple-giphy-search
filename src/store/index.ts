import { applyMiddleware, createStore } from 'redux'
import { createLogger } from 'redux-logger'
import { createEpicMiddleware } from 'redux-observable'
import { RootAction, RootState } from 'typesafe-actions'
import dependencies, { Dependencies } from './dependencies'
import { epic as rootEpic, reducer as rootReducer } from './root'

const logMiddleware = createLogger()
const epicMiddleware = createEpicMiddleware<RootAction, RootAction, RootState, Dependencies>({
  dependencies
})

const store = createStore(
  rootReducer,
  applyMiddleware(epicMiddleware, logMiddleware)
)

epicMiddleware.run(rootEpic)

export default store
