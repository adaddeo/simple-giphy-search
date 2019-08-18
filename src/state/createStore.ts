import { applyMiddleware, createStore as reduxCreateStore } from 'redux'
import { createLogger } from 'redux-logger'
import promise from 'redux-promise-middleware'
import thunk from 'redux-thunk'

import { reducer } from './reducer'

const logger = createLogger()

const middleware = [promise, thunk]

if (process.env.NODE_ENV !== 'production') {
  middleware.push(logger)
}

export const createStore = () => reduxCreateStore(reducer, applyMiddleware(...middleware))
