import { applyMiddleware, createStore as reduxCreateStore, Middleware } from 'redux'
import { createLogger } from 'redux-logger'
import { createEpicMiddleware } from 'redux-observable'
import { RootAction, RootState } from './'
import { epic, reducer } from './root'

const logger = createLogger()

const epicMiddleware = createEpicMiddleware<RootAction, RootAction, RootState>()
const middleware: Middleware[] = [epicMiddleware]

if (process.env.NODE_ENV !== 'production') {
  middleware.push(logger)
}

export const createStore = () => {
  const store = reduxCreateStore(reducer, applyMiddleware(...middleware))

  epicMiddleware.run(epic)

  return store
}
