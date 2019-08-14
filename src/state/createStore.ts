import { applyMiddleware, createStore as reduxCreateStore } from 'redux'
import { createLogger } from 'redux-logger'
import promise from 'redux-promise-middleware'

// import { reducer } from './reducer'
import { reducer } from './ducks/search'

const logger = createLogger()

const middleware = process.env.NODE_ENV === 'production' ? [promise] : [promise, logger]

export const createStore = () => reduxCreateStore(reducer, applyMiddleware(...middleware))
